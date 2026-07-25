---
title: 搭建基础网络环境
date: 2022-12-15
modified: 2026-07-25
categories: [家用服务器]
tags: [Openwrt, VPN, Nginx]
expirationReminder:
  enable: true
---

搭建以 Openwrt 为基础的网络环境。

<!--more-->

## IP 分配

| 网段       | 设备         |
| ---------- | ------------ |
| ..0/32     | 网络         |
| ..1/28     | 实体主机     |
| ..16/28    | 受信客户端   |
| ..32/27    | LXC 服务     |
| ..64/26    | 虚拟机       |
| ..128/26   | 未授权客户端 |
| ..192/26   | 网络关键服务 |
| ..254.0/24 | 监控         |
| ..253.0/24 | 智能家居     |

## 软件包

| 包名                | 描述        |
| ------------------- | ----------- |
| luci-app-passwall   | 科学上网    |
| luci-app-zerotier   | 异地组网    |
| openssh-sftp-server | SFTP 服务器 |
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

## 代理规则

```text {title="直连列表"}
# Local
meow

# Hugging Face
hf-mirror.com


# Steam
steamcontent.com
dl.steam.clngaa.com
dl.steam.ksyna.com
st.dl.bscstorage.net
st.dl.eccdnx.com
st.dl.pinyuncloud.com
cdn.mileweb.cs.steampowered.com.8686c.com
cdn-ws.content.steamchina.com
cdn-qc.content.steamchina.com
cdn-ali.content.steamchina.com
epicgames-download1-1251447533.file.myqcloud.com
```

```text {title="代理列表"}
# Cloudflare
cloudflare.com
engage.cloudflareclient.com

# Google
googleapis.cn
googleapis.com
google.com.tw
google.com.hk
gstatic.com
xn--ngstr-lra8j.com

# Docker
index.docker.io
registry-1.docker.io
auth.docker.io
docker.com

# 资源
cangku.moe
blog.reimu.net
hacg.mov
hacg.pics
coomer.su
kemono.cr
exhentai.org

# tmdb
api.themoviedb.org
api.thetvdb.org
image.tmdb.org

# steam
steamcommunity.com
steampowered.com
steamcdn-a.akamaihd.net
steam-chat.com
steamstatic.com

# 漫画
mangacopy.com
copy20.com
2025copy.com
2026copy.com
manga2025.com
hotmangasf.com
hotmangasg.com
18comic.vip
picacomic.com

# groq
groq.com
api.groq.com

# ipfs
ipfs.raribleuserdata.com
ipfs.4everland.io


# 其他
favo-soft.jp
mypikpak.com
```

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
