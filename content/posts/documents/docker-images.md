---
title: 优秀 Docker 镜像
date: 2023-04-25
modified: 2025-07-15
categories: [文档]
collections: [Homelab]
tags: [Docker, Linux]
expirationReminder:
  enable: true
---

正在使用或其他优秀的 Docker 镜像。

<!--more-->

## 数据架构

| 挂载点  | 类型           | 用途                             |
| ------- | -------------- | -------------------------------- |
| /docker | ISCSI 远程硬盘 | Compose 配置、各容器的缓存及配置 |
| /nfs/*  | NFS 挂载       | 资源文件，如下载、影视等         |

## 端口分配

| 端口 | 60: 管理及基础服务     | 62: 媒体          | 63: 下载                    |
| ---- | ---------------------- | ----------------- | --------------------------- |
| 00   | portainer/portainer-ce | diygod/rsshub     | estrellaxd/auto_bangumi     |
| 01   | vaultwarden/server     | freshrss/freshrss | p3terx/ariang               |
| 02   | sigoden/dufs           | deluan/navidrome  | p3terx/qbittorrent-enhanced |
| 03   | adminer                | neosmemo/memos    | johngong/baidunetdisk       |

以下容器使用默认端口：

- mariadb - `3306`
- postgres:alpine - `5432`
- p3terx/aria2-pro - `6800`

## Compose 文件

```yaml {title="Base"}
services:
  portainer:
    image: portainer/portainer-ce
    container_name: portainer
    restart: always
    ports:
      - 6000:9000
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./portainer:/data

  vaultwarden:
    container_name: vaultwarden
    image: vaultwarden/server
    restart: unless-stopped
    environment:
      DOMAIN: https://password.meow
    volumes:
      - ./vaultwarden:/data
    ports:
      - 6001:80

  dufs-public:
    container_name: dufs-public
    image: sigoden/dufs
    restart: unless-stopped
    ports:
      - 6002:5000
    volumes:
      - /nfs/public:/data
    command: /data
```

```yaml {title="Database"}
services:
  postgres:
    container_name: postgres
    image: postgres:alpine
    restart: unless-stopped
    ports:
      - 5432:5432
    volumes:
      - ./postgresql:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

  mariadb:
    container_name: mariadb
    image: mariadb
    restart: unless-stopped
    ports:
      - 3306:3306
    volumes:
      - ./mariadb/conf.d:/etc/mysql/conf.d
      - ./mariadb/data:/var/lib/mysql
      - ./mariadb/logs:/logs
    environment:
      - MARIADB_ROOT_PASSWORD=${MARIADB_PASSWORD}

  adminer:
    container_name: adminer
    image: adminer
    restart: unless-stopped
    ports:
      - 6003:8080
```

```yaml {title="Rss"}
services:
  rsshub:
    container_name: rsshub
    image: diygod/rsshub
    restart: unless-stopped
    ports:
      - 6200:1200

  freshrss:
    container_name: freshrss
    image: freshrss/freshrss
    restart: unless-stopped
    ports:
      - 6201:80
    depends_on:
      - rsshub
      - rssdb
    logging:
      options:
        max-size: 10m
    volumes:
      - ./freshrss/data:/var/www/FreshRSS/data
      - ./freshrss/extensions:/var/www/FreshRSS/extensions
    environment:
      TZ: Asia/Shanghai
      CRON_MIN: "1,15,31"
      TRUSTED_PROXY: 172.16.0.0/12 192.168.0.0/16

  rssdb:
    container_name: rss-pg
    image: postgres:alpine
    restart: unless-stopped
    volumes:
      - ./rss_pg:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
```

```yaml {title="Media"}
services:
  navidrome:
    container_name: navidrome
    image: deluan/navidrome
    restart: unless-stopped
    ports:
      - 6202:4533
    volumes:
      - ./navidrome:/data
      - /nfs/music:/music:ro
    environment:
      ND_SCANSCHEDULE: 12h
      ND_LOGLEVEL: info
      
  memos:
    container_name: memos
    image: neosmemo/memos
    restart: unless-stopped
    volumes:
      - ./memos:/var/opt/memos
    ports:
      - 6203:5230
```

```yaml {title="Downloader"}
services:
  autobangumi:
    container_name: autobangumi
    image: estrellaxd/auto_bangumi
    restart: unless-stopped
    ports:
      - 6300:7892
    volumes:
      - ./autobangumi/config:/app/config
      - ./autobangumi/data:/app/data
    depends_on:
      - qbittorrent
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai

  aria2:
    container_name: aria2
    image: p3terx/aria2-pro
    restart: unless-stopped
    ports:
      - 6800:6800
      - 6888:6888
      - 6888:6888/udp
    volumes:
      - ./aria2:/config
      - /nfs/downloads:/downloads
    environment:
      - PUID=1000
      - PGID=1000
      - UMASK_SET=022
      - RPC_SECRET=${ARIA2_SECRET}
      - RPC_PORT=6800
      - LISTEN_PORT=6888
      - DISK_CACHE=64M
      - IPV6_MODE=true
      - UPDATE_TRACKERS=true
      - TZ=Asia/Shanghai
    logging:
      driver: json-file
      options:
        max-size: 1m

  ariang:
    container_name: ariang
    image: p3terx/ariang
    restart: unless-stopped
    ports:
      - 6301:6880
    depends_on:
      - aria2
    command: --port 6880 --ipv6
    logging:
      driver: json-file
      options:
        max-size: 1m

  qbittorrent:
    container_name: qbittorrent
    image: p3terx/qbittorrent-enhanced
    restart: unless-stopped
    ports:
      - 6302:28080
      - 26888:26888
      - 26888:26888/udp
    volumes:
      - ./qbittorrent:/qBittorrent
      - /nfs/downloads:/downloads
      - /nfs/bangumi:/bangumi
    environment:
      - PUID=1000
      - PGID=1000
      - UMASK_SET=022
      - TZ=Asia/Shanghai
      - QBT_WEBUI_PORT=28080
```

```yaml {title="Baidu"}
services:
  baidunetdisk:
    container_name: baidunetdisk
    image: johngong/baidunetdisk
    restart: unless-stopped
    ports:
      - 6303:5800
      #- 6304:5900
    volumes:
      - ./config:/config
      - /nfs/downloads:/downloads
    environment:
      - USER_ID=1000
      - GROUP_ID=1000
```