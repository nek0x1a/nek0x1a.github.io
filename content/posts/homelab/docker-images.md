---
title: 优秀 Docker 镜像
date: 2023-04-25
modified: 2026-07-25
categories: [家用服务器]
tags: [Docker, Linux]
expirationReminder:
  enable: true
---

正在使用或其他优秀的 Docker 镜像。

<!--more-->

## 数据架构

| 挂载点     | 类型   | 用途                             |
| ---------- | ------ | -------------------------------- |
| /container | 本地   | Compose 配置、各容器的缓存及配置 |
| /proxmox   | 挂载点 | 资源文件，如下载、影视等         |

## Compose 文件

```yaml {title="base"}
services:
  vaultwarden:
    container_name: vaultwarden
    image: vaultwarden/server
    restart: unless-stopped
    ports:
      - 6001:80
    volumes:
      - /container/vaultwarden:/data
    environment:
      DOMAIN: https://password.meow
      DATABASE_URL: ${VAULTWARDEN_DATABASE_URL}
  dufs-public:
    container_name: dufs-public
    image: sigoden/dufs
    restart: unless-stopped
    ports:
      - 6002:5000
    volumes:
      - /proxmox/public:/data
    command: /data
```

```yaml {title="database"}
services:
  postgres:
    container_name: postgres
    image: postgres:18-alpine
    restart: unless-stopped
    ports:
      - 5432:5432
    volumes:
      - /container/postgres:/var/lib/postgresql
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  pgadmin:
    container_name: pgadmin
    image: dpage/pgadmin4
    restart: unless-stopped
    depends_on:
      - postgres
    ports:
      - 6003:80
    volumes:
      - /container/pgadmin:/var/lib/pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_DEFAULT_EMAIL}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_DEFAULT_PASSWORD}
```

```yaml {title="hasura"}
services:
  graphql-engine:
    container_name: graphql-engine
    image: hasura/graphql-engine
    restart: unless-stopped
    ports:
      - 6005:8080
    environment:
      HASURA_GRAPHQL_DATABASE_URL: ${HASURA_GRAPHQL_DATABASE_URL}
      HASURA_GRAPHQL_ENABLE_CONSOLE: true
      HASURA_GRAPHQL_ADMIN_SECRET: ${HASURA_GRAPHQL_ADMIN_SECRET}
```

```yaml {title="flaresolverr"}
services:
  flaresolverr:
    container_name: flaresolverr
    image: ghcr.io/flaresolverr/flaresolverr
    restart: unless-stopped
    ports:
      - 6004:8191
    environment:
      - LOG_LEVEL=info
```

```yaml {title="rss"}
services:
  rsshub:
    container_name: rsshub
    image: diygod/rsshub
    restart: unless-stopped
    ports:
      - 6100:1200
    environment:
      ALLOW_ORIGIN: "*"
      ALLOW_USER_HOTLINK_TEMPLATE: image_hotlink_template
  freshrss:
    container_name: freshrss
    image: freshrss/freshrss
    restart: unless-stopped
    ports:
      - 6101:80
    depends_on:
      - rsshub
    logging:
      options:
        max-size: 10m
    volumes:
      - /container/freshrss/data:/var/www/FreshRSS/data
      - /container/freshrss/extensions:/var/www/FreshRSS/extensions
    environment:
      TZ: Asia/Shanghai
      CRON_MIN: 1,31
      TRUSTED_PROXY: 172.16.0.1/12 10.0.0.0/24 192.168.0.0/16
      FRESHRSS_INSTALL: |-
        --api-enabled
        --base-url https://rss.meow
        --db-base freshrss
        --db-host ${FRESSRSS_DB_HOST}
        --db-password ${FRESSRSS_DB_PASSWORD}
        --db-type pgsql
        --db-user freshrss
        --default-user ${FRESSRSS_DB_USER}
        --language zh-CN
      FRESHRSS_USER: |-
        --user neko
        --api-password ${FRESSRSS_API_KEY}
        --email ${FRESSRSS_USER}
        --language zh-CN
        --password ${FRESSRSS_PASSWORD}
```

```yaml {title="media"}
services:
  memos:
    container_name: memos
    image: neosmemo/memos:stable
    restart: unless-stopped
    ports:
      - 6102:5230
    volumes:
      - /container/memos:/var/opt/memos
  navidrome:
    container_name: navidrome
    image: deluan/navidrome
    restart: unless-stopped
    ports:
      - 6103:4533
    volumes:
      - /container/navidrome:/data
      - /proxmox/music:/music:ro
    environment:
      ND_SCANSCHEDULE: 12h
      ND_LOGLEVEL: info
  openlist:
    container_name: openlist
    image: openlistteam/openlist
    restart: unless-stopped
    ports:
      - 6104:5244
    volumes:
      - /container/openlist:/opt/openlist/data
    environment:
      UMASK: 22
      TZ: Asia/Shanghai
      DB_TYPE: postgres
      DB_DSN: ${OPENLIST_DB_DSN}
```

```yaml {title="komga"}
services:
  komga:
    container_name: komga
    image: gotson/komga
    restart: unless-stopped
    volumes:
      - /container/komga:/config
      - /proxmox/comic:/data
    ports:
      - 6106:25600
    user: 0:0
    environment:
      TZ: Asia/Shanghai
```

```yaml {title="download"}
services:
  autobangumi:
    container_name: autobangumi
    image: estrellaxd/auto_bangumi
    restart: unless-stopped
    ports:
      - 6200:7892
    volumes:
      - /container/autobangumi/config:/app/config
      - /container/autobangumi/data:/app/data
    depends_on:
      - qbittorrent
    environment:
      PUID: 0
      PGID: 0
      TZ: Asia/Shanghai
      UMASK: 22
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
      - /proxmox/downloads:/downloads
    environment:
      PUID: 0
      PGID: 0
      UMASK_SET: 22
      RPC_SECRET: ${ARIA2_RPC_SECRET}
      RPC_PORT: 6800
      LISTEN_PORT: 6888
      DISK_CACHE: 64M
      IPV6_MODE: true
      UPDATE_TRACKERS: true
      TZ: Asia/Shanghai
    logging:
      driver: json-file
      options:
        max-size: 1m
  ariang:
    container_name: ariang
    image: p3terx/ariang
    restart: unless-stopped
    ports:
      - 6201:6880
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
      - 6202:8989
      - 6881:6881
      - 6881:6881/udp
    volumes:
      - /container/qbittorrent:/config
      - /proxmox/downloads:/Downloads
      - /proxmox/bangumi:/Bangumi
    environment:
      UID: 0
      GID: 0
      ENABLE_CHOWN_DOWNLOADS: false
      ENABLE_CHOWN_R_DOWNLOADS: false
      TZ: Asia/Shanghai
      QB_WEBUI_PORT: 8989
```

```yaml {title="Baidu"}
services:
  baidunetdisk:
    container_name: baiduyun
    image: johngong/baidunetdisk
    restart: unless-stopped
    ports:
      - 6203:5800
    volumes:
      - /container/baiduyun:/config
      - /proxmox/downloads:/downloads
    environment:
      USER_ID: 0
      GROUP_ID: 0
```

```yaml {title="newapi"}
services:
  newapi:
    container_name: newapi
    image: calciumion/new-api
    restart: unless-stopped
    command: --log-dir /app/logs
    ports:
      - 6006:3000
    volumes:
      - /container/newapi/data:/data
      - /container/newapi/logs:/app/logs
    environment:
      SQL_DSN: ${NEWAPI_SQL_DSN}
      REDIS_CONN_STRING: redis://:${REDIS_PASS}@redis
      TZ: Asia/Shanghai
      ERROR_LOG_ENABLED: true
      BATCH_UPDATE_ENABLED: true
      NODE_NAME: new-api-node-1
    depends_on:
      - redis
    healthcheck:
      test:
        - CMD-SHELL
        - wget -q -O - http://localhost:3000/api/status | grep -o
          '"success":\s*true' || exit 1
      interval: 30s
      timeout: 10s
      retries: 3
  redis:
    container_name: redis
    image: redis
    restart: unless-stopped
    command:
      - redis-server
      - --requirepass
      - ${REDIS_PASS}
```
