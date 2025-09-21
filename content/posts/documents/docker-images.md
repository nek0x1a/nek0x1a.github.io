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
    restart: unless-stopped
    ports:
      - 6000:9000
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /container/portainer:/data

  vaultwarden:
    container_name: vaultwarden
    image: vaultwarden/server
    restart: unless-stopped
    ports:
      - 6001:80
    volumes:
      - /container/vaultwarden:/data
    environment:
      DOMAIN: "https://password.meow"

  dufs-public:
    container_name: dufs-public
    image: sigoden/dufs
    restart: unless-stopped
    ports:
      - 6002:5000
    volumes:
      - /nfs/public:/data
    command: /data

  adminer:
    container_name: adminer
    image: adminer
    restart: unless-stopped
    ports:
      - 6003:8080

  postgres:
    container_name: postgres
    image: postgres:alpine
    restart: unless-stopped
    user: 1000:1000
    ports:
      - 5432:5432
    volumes:
      - /container/postgresql:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD: "Ero@Postgres"
```

```yaml {title="Rss"}
services:
  rsshub:
    container_name: rsshub
    image: diygod/rsshub
    restart: unless-stopped
    ports:
      - 6200:1200
    environment:
      - ALLOW_ORIGIN: "*"
      - ALLOW_USER_HOTLINK_TEMPLATE: "image_hotlink_template"

  freshrss:
    container_name: freshrss
    image: freshrss/freshrss
    restart: unless-stopped
    ports:
      - 6201:80
    depends_on:
      - rsshub
    logging:
      options:
        max-size: 10m
    volumes:
      - /container/freshrss:/var/www/FreshRSS
    environment:
      TZ: "Asia/Shanghai"
      CRON_MIN: "1,31"
      TRUSTED_PROXY: "172.16.0.1/12 10.0.0.0/8 192.168.0.0/16"
      FRESHRSS_INSTALL: |-
        --api-enabled
        --base-url rss.meow
        --db-base freshrss
        --db-host 10.0.0.32
        --db-password freshrss@Postgres
        --db-type pgsql
        --db-user freshrss
        --default-user neko
        --language zh-CN
      FRESHRSS_USER: |-
        --user neko
        --api-password Ero@Freshrss
        --email neko@meow
        --language zh-CN
        --password Ero@Freshrss
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
      - /container/navidrome:/data
      - /nfs/music:/music:ro
    environment:
      ND_SCANSCHEDULE: 12h
      ND_LOGLEVEL: info

  siyuan:
    container_name: siyuan
    image: apkdv/siyuan-unlock
    restart: unless-stopped
    ports:
      - 6203:6806
    volumes:
      - /container/siyuan:/siyuan/workspace
    environment:
      - PUID: 1000
      - PGID: 1000
      - LANG: zh_CN.UTF-8
      - LC_ALL: zh_CN.UTF-8
      - TZ: Asia/Shanghai
      - SIYUAN_ACCESS_AUTH_CODE: Ero@Siyuan
    command: --workspace=/siyuan/workspace/

  openlist:
    container_name: openlist
    image: openlistteam/openlist
    restart: unless-stopped
    user: 1000:1000
    volumes:
      - /container/openlist:/opt/openlist/data
    environment:
      - UMASK: 022
      - TZ: Asia/Shanghai
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
      - /container/autobangumi:/app
    depends_on:
      - qbittorrent
    environment:
      - PUID: 1000
      - PGID: 1000
      - TZ: Asia/Shanghai
      - UMASK: 022

  aria2:
    container_name: aria2
    image: p3terx/aria2-pro
    restart: unless-stopped
    ports:
      - 6800:6800
      - 6888:6888
      - 6888:6888/udp
    volumes:
      - /container/aria2:/config
      - /nfs/downloads:/downloads
    environment:
      - PUID: 1000
      - PGID: 1000
      - UMASK_SET: 022
      - RPC_SECRET: 123456
      - RPC_PORT: 6800
      - LISTEN_PORT: 6888
      - DISK_CACHE: 64M
      - IPV6_MODE: true
      - UPDATE_TRACKERS: true
      - TZ: Asia/Shanghai
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
    image: johngong/qbittorrent
    restart: unless-stopped
    ports:
      - 6302:8989
      - 6881:6881
      - 6881:6881/udp
    volumes:
      - /container/qbittorrent:/config
      - /nfs/downloads:/Downloads
      - /nfs/bangumi:/Bangumi
    environment:
      - UID: 1000
      - GID: 1000
      - TZ: Asia/Shanghai
      - QB_WEBUI_PORT: 8989
      - QB_EE_BIN: false
```

```yaml {title="Baidu"}
services:
  baidunetdisk:
    container_name: baidunetdisk
    image: johngong/baidunetdisk
    restart: unless-stopped
    ports:
      - 6303:5800
    volumes:
      - /container/config:/config
      - /nfs/downloads:/downloads
    environment:
      - USER_ID=1000
      - GROUP_ID=1000
```