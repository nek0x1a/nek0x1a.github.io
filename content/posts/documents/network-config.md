---
title: 搭建基础网络环境
date: 2022-12-15
modified: 2025-07-13
categories: [documents]
collections: [homelab]
tags: [Openwrt, VPN, Nginx]
expirationReminder:
  enable: true
---

以 Rax3000M 为例，搭建以 Openwrt 为基础的网络环境。

<!--more-->

> [!TIP] 提示
> 建议将 Openwrt 作为主路由，仅保留基本路由和代理功能，其他功能在服务器中实现。

## 镜像获取

在 [**immortalwrt 官网**](https://firmware-selector.immortalwrt.org/) 搜索 `RAX3000M` 并下载下列五个镜像文件：

- immortalwrt-mediatek-filogic-cmcc_rax3000m-emmc-gpt.bin
- immortalwrt-mediatek-filogic-cmcc_rax3000m-emmc-preloader.bin
- immortalwrt-mediatek-filogic-cmcc_rax3000m-emmc-bl31-uboot.fip
- immortalwrt-mediatek-filogic-cmcc_rax3000m-initramfs-recovery.itb
- immortalwrt-mediatek-filogic-cmcc_rax3000m-squashfs-sysupgrade.itb

上传到路由器 `/tmp` 进行刷写。

## 刷写镜像

将 Boot 相关固件刷入：

```bash {title="刷写 gpt 分区表"}
dd if=immortalwrt-mediatek-filogic-cmcc_rax3000m-emmc-gpt.bin of=/dev/mmcblk0 bs=512 seek=0 count=34 conv=fsync
```

```bash {title="刷写 bl2"}
echo 0 > /sys/block/mmcblk0boot0/force_ro
dd if=/dev/zero of=/dev/mmcblk0boot0 bs=512 count=8192 conv=fsync
dd if=immortalwrt-mediatek-filogic-cmcc_rax3000m-emmc-preloader.bin of=/dev/mmcblk0boot0 bs=512 conv=fsync
```

```bash {title="刷写 bl31 uboot"}
dd if=/dev/zero of=/dev/mmcblk0 bs=512 seek=13312 count=8192 conv=fsync
dd if=immortalwrt-mediatek-filogic-cmcc_rax3000m-emmc-bl31-uboot.fip of=/dev/mmcblk0 bs=512 seek=13312 conv=fsync
```

刷入完成后路由器重启捡回自动搜索 **tftp** 服务器并自动刷写底包。
设置电脑 ip 为 `192.168.1.254`，使用 tftpd32 搭建服务器，服务路径选择 `immortalwrt-mediatek-filogic-cmcc_rax3000m-initramfs-recovery.itb` 所在文件夹。
将路由器断电重启，将会自动恢复，详见 tftp 日志，等待路由器重启。

在路由器界面使用 `immortalwrt-mediatek-filogic-cmcc_rax3000m-squashfs-sysupgrade.itb` 进行升级。

### overlay 扩容

使用 cfdisk 在空闲空间创建分区并挂载到 `/mnt/mmcblk0p6`，将原 `/overlay` 内容复制到分区内：

```bash
tar -C /overlay -cvf - . | tar -C /mnt/mmcblk0p6 -xf -
```

再去 WebUI 的 **挂载点** 将原 overlay 分区挂载到 `/mnt/mmcblk0p66` 再将新分区挂载到 `/overlay` 之后应用。应用后由于重新挂载到 `/overlay` 的分区包含了复制的配置文件，所以需要重新设置一次本段的挂载点，之后重启即可。

## 软件包

| 包名                | 描述        |
| ------------------- | ----------- |
| luci-app-homeproxy  | 科学上网    |
| luci-app-zerotier   | 异地组网    |
| luci-app-vsftpd     | SFTP 服务器 |
| luci-app-statistics | 系统监控    |
| nginx-full          | 替换 uhttpd |
| uwsgi               | 转发 luci   |

## 使用 Nginx 替换 uhttp

让 Nginx 支持 luci 需要额外的软件包，检查是否包含如下软件包：

- uwsgi
- uwsgi-cgi-plugin
- uwsgi-luci-support
- nginx-mod-luci

安装 nginx-full 后，在 `系统` - `启动项` 中禁用 `uhttpd`、启用 `uwsgi` 和 `nginx`，重启 Openwrt。


## 配置桥接光猫静态路由

新建一个接口 `modem`，设置静态地址，填写光猫同网段 ip，关闭默认路由，防火墙区域为 `wan`。

新建一条 ipv4 静态路由，接口 `lan`，目标为光猫 ip 地址，网关为 `modem` 接口地址。

## 增加导航主页

修改 Nginx 配置：

```nginx {title="/etc/nginx/conf.d/nav.conf"}
server {
    listen 443 ssl;
    server_name nav.meow;
    ssl_certificate /etc/nginx/conf.d/nav.crt;
    ssl_certificate_key /etc/nginx/conf.d/nav.key;
    location / {
        root /www/nav/;
        index index.html index.htm;
    }
}
```