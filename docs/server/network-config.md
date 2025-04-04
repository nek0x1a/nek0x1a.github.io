---
sidebar_position: 1
description: 以 Openwrt 为基础的网络环境配置
---

# 网络环境配置

:::tip
建议将 Openwrt 作为主路由，仅保留基本路由和代理功能，其他功能在服务器中实现。
:::

## Rax3000m

在 [**immortalwrt 官网**](https://firmware-selector.immortalwrt.org/) 搜索 `RAX3000M` 并下载下列五个镜像文件：

- immortalwrt-mediatek-filogic-cmcc_rax3000m-emmc-gpt.bin
- immortalwrt-mediatek-filogic-cmcc_rax3000m-emmc-preloader.bin
- immortalwrt-mediatek-filogic-cmcc_rax3000m-emmc-bl31-uboot.fip
- immortalwrt-mediatek-filogic-cmcc_rax3000m-initramfs-recovery.itb
- immortalwrt-mediatek-filogic-cmcc_rax3000m-squashfs-sysupgrade.itb

上传到路由器 `/tmp` 进行刷写。

### 刷写镜像

刷写 gpt 分区表

```bash
dd if=immortalwrt-mediatek-filogic-cmcc_rax3000m-emmc-gpt.bin of=/dev/mmcblk0 bs=512 seek=0 count=34 conv=fsync
```

刷写 bl2

```bash
echo 0 > /sys/block/mmcblk0boot0/force_ro
dd if=/dev/zero of=/dev/mmcblk0boot0 bs=512 count=8192 conv=fsync
dd if=immortalwrt-mediatek-filogic-cmcc_rax3000m-emmc-preloader.bin of=/dev/mmcblk0boot0 bs=512 conv=fsync
```

刷写 bl31 uboot

```bash
dd if=/dev/zero of=/dev/mmcblk0 bs=512 seek=13312 count=8192 conv=fsync
dd if=immortalwrt-mediatek-filogic-cmcc_rax3000m-emmc-bl31-uboot.fip of=/dev/mmcblk0 bs=512 seek=13312 conv=fsync
```

设置电脑 ip 为 `192.168.1.254`，
使用 tftpd32 搭建服务器，服务路径选择 `immortalwrt-mediatek-filogic-cmcc_rax3000m-initramfs-recovery.itb` 所在文件夹。
将路由器断电重启，将会自动恢复，详见 tftp 日志，等待路由器重启。

在路由器界面使用 `immortalwrt-mediatek-filogic-cmcc_rax3000m-squashfs-sysupgrade.itb` 进行升级。

### overlay 扩容

使用 cfdisk 分区后，将原 `/overlay` 内容复制到分区内：

```bash
tar -C /overlay -cvf - . | tar -C /mnt/mmcblk0p6 -xf -
```

再去 WebUI 的 **挂载点** 将原有分区挂载到 `/mnt/mmcblk0p66` 再将新分区挂载到 `/overlay`，之后重启即可。

## 软件包

| 包名                | 描述        |
| ------------------- | ----------- |
| luci-app-homeproxy  | 科学上网    |
| luci-app-vlmcsd     | KMS 激活    |
| luci-app-zerotier   | 异地组网    |
| luci-app-upnp       | upnp 服务   |
| luci-app-vsftpd     | SFTP 服务器 |
| luci-app-statistics | 系统监控    |

```bash
opkg update
opkg install luci-app-homeproxy
opkg install luci-i18n-homeproxy-zh-cn
opkg install luci-app-vlmcsd
opkg install luci-i18n-vlmcsd-zh-cn
opkg install luci-app-zerotier
opkg install luci-i18n-zerotier-zh-cn
opkg install luci-app-vsftpd
opkg install luci-i18n-vsftpd-zh-cn
opkg install luci-app-upnp
opkg install luci-i18n-upnp-zh-cn

# 监控
opkg install luci-app-statistics
opkg install luci-i18n-statistics-zh-cn
opkg install collectd-mod-cpu
opkg install collectd-mod-interface
opkg install collectd-mod-iwinfo
opkg install collectd-mod-load
opkg install collectd-mod-memory
opkg install collectd-mod-network
opkg install collectd-mod-rrdtool
```

## 配置

### 启用 NTP 服务器

```bash
uci set system.ntp.enable_server='1'
uci set system.ntp.interface='lan'
uci set system.ntp.use_dhcp='1'
uci add_list system.ntp.server='cn.ntp.org.cn'
uci add_list system.ntp.server='ntp.aliyun.com'
uci commit system
```

### 启用 KMS 服务器

```bash
uci set vlmcsd.config.enabled='1'
uci set vlmcsd.config.autoactivate='1'
uci commit vlmcsd
```

### 访问桥接光猫

```bash
# 光猫地址
modem_address='192.168.1.1'
# 子网掩码
modem_netmask='255.255.255.0'
# openwrt 接口地址
interface_address='192.168.1.2'
# openwrt 接口设备
interface_device='eth1'

# 配置接口
uci set network.modem=interface
uci set network.modem.proto='static'
uci set network.modem.device='eth1'
uci set network.modem.ipaddr="$interface_address"
uci set network.modem.netmask="$modem_netmask"
uci set network.modem.defaultroute='0'
# 配置静态路由
uci add network route
uci set network.@route[-1].interface='lan'
uci set network.@route[-1].target="$modem_address/32"
uci set network.@route[-1].gateway="$interface_address"

# 配置防火墙
wan_zone_id=$(uci show firewall | grep "name='wan'" | sed 's/.*zone\[\(.*\)\].*/\1/')
uci add_list firewall.@zone[$wan_zone_id].network='modem'

# 应用配置
uci commit network
uci commit firewall
```

### 启用 ZeroTier

```bash
zerotier_network=‘’
uci add_list zerotier.sample_config.join="$zerotier_network"
uci set zerotier.sample_config.enabled='1'
uci set zerotier.sample_config.nat='1'
uci commit zerotier
```

### 代理域名

```
index.docker.io
registry-1.docker.io
auth.docker.io
docker.com
cangku.moe
blog.reimu.net
www.hacg.mov
api.themoviedb.org
api.thetvdb.org
image.tmdb.org
my.zerotier.com
truenas.com
mikanani.me
steamcommunity.com
www.steamcommunity.com
store.steampowered.com
api.steampowered.com
help.steampowered.com
store.akamai.steamstatic.com
steamcdn-a.akamaihd.net
cdn.akamai.steamstatic.com
steam-chat.com
community.akamai.steamstatic.com
xfuliji.com
meta.appinn.net
rutracker.org
coomer.su
z-lib.gs
```

### hosts

```hosts title="\etc\hosts"
# weiyun
101.89.39.11         weiyun.com
109.244.157.5        share.weiyun.com
109.244.173.140      share.weiyun.com

# blocked
127.0.0.1            geo2.adobe.com
127.0.0.1            fpdownload2.macromedia.com
127.0.0.1            fpdownload.macromedia.com
127.0.0.1            macromedia.com
```
