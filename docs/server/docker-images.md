---
sidebar_position: 4
description: 优秀 Docker 镜像推荐
---

# Docker 镜像

## 端口分配

| 端口 | 60: 管理  | 61: 基础服务 | 62: 媒体        | 63: 下载     | 64: 实验性    | 65: 工具   |
| ---- | --------- | ------------ | --------------- | ------------ | ------------- | ---------- |
| 00   | portainer | flare        | memos           | autobangumi  |               | ittools    |
| 01   | kuma      | vaultwarden  | freshrss        | ariang       | bitmagnet     | drawdb     |
| 02   | gotify    | adminer      | dufs-public     | qbittorrent  | bitmagnet-web | jsoncrack  |
| 03   |           | flaresolverr | dufs-downlloads | baidunetdisk |               | plantuml   |
| 04   |           | rsshub       | dufs-book       | baidunetdisk |               | picsmaller |
| 05   |           | graphql      | piwigo          | alist        |               | webp2jpg   |
| 06   |           |              | navidrome       |              |               |            |
| 07   |           |              | suwayomi        |              |               |            |

## 管理

```yaml title="~/docker-manage/compose.yaml"
services:
  portainer:
    image: portainer/portainer-ce
    container_name: portainer
    restart: always
    ports:
      - 6000:9000
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ${STACK_VOLUME}/portainer/data:/data
      - ${STACK_VOLUME}/portainer/certs:/certs
    command: |-
      --sslcert /certs/server.crt
      --sslkey /certs/server.key

  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - TZ=Asia/Shanghai
      - WATCHTOWER_NOTIFICATIONS=gotify
      - WATCHTOWER_NOTIFICATION_GOTIFY_URL=http://gotify
      - WATCHTOWER_NOTIFICATION_GOTIFY_TOKEN=${WATCHTOWER_GOTIFY_TOKEN}
    command: |-
      --cleanup
      --schedule "0 0 3 * * *"

  kuma:
    container_name: kuma
    image: louislam/uptime-kuma
    restart: unless-stopped
    ports:
      - 6001:3001
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ${STACK_VOLUME}/kuma:/app/data

  gotify:
    container_name: gotify
    image: gotify/server
    restart: unless-stopped
    ports:
      - 6002:80
    volumes:
      - ./gotify:/app/data
    environment:
      - TZ="Asia/Shanghai"
      - GOTIFY_DEFAULTUSER_PASS=${GOTIFY_PASS}
```

```bash title="环境变量示例"
STACK_VOLUME=/mnt/docker/manage
WATCHTOWER_GOTIFY_TOKEN=
GOTIFY_PASS=
```

## 基础服务

```yaml
services:
  flare:
    container_name: flare
    image: soulteary/flare
    restart: unless-stopped
    command: flare
    ports:
      - 6100:5005
    volumes:
      - ${STACK_VOLUME}/flare:/app

  vaultwarden:
    container_name: vaultwarden
    image: vaultwarden/server
    restart: unless-stopped
    environment:
      DOMAIN: https://password.meow
    volumes:
      - ${STACK_VOLUME}/password:/data
    ports:
      - 6101:80

  flaresolverr:
    container_name: flaresolverr
    image: flaresolverr/flaresolverr
    restart: unless-stopped
    environment:
      - TZ=Asia/Shanghai
    ports:
      - 6103:8191
```

```bash title="环境变量示例"
STACK_VOLUME=/mnt/docker/base
```

## 数据库

```yaml
services:
  postgres:
    container_name: postgres
    image: postgres:alpine
    restart: unless-stopped
    ports:
      - 5432:5432
    volumes:
      - ${STACK_VOLUME}/postgres:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASS}

  mariadb:
    container_name: mariadb
    image: mariadb
    restart: unless-stopped
    ports:
      - 3306:3306
    volumes:
      - ${STACK_VOLUME}/mariadb/conf.d:/etc/mysql/conf.d
      - ${STACK_VOLUME}/mariadb/data:/var/lib/mysql
      - ${STACK_VOLUME}/mariadb/logs:/logs
    environment:
      - MARIADB_ROOT_PASSWORD=${MARIADB_PASS}

  graphql:
    container_name: graphql
    image: hasura/graphql-engine
    restart: unless-stopped
    depends_on:
      - postgres
    ports:
      - 6105:8080
    environment:
      - HASURA_GRAPHQL_METADATA_DATABASE_URL=postgres://${GRAPHQL_DB_USER}:${GRAPHQL_DB_PASS}@postgres/hasura
      - HASURA_GRAPHQL_DATABASE_URL=postgres://${GRAPHQL_DB_USER}:${GRAPHQL_DB_PASS}@postgres/${GRAPHQL_DB}
      - HASURA_GRAPHQL_ENABLE_CONSOLE=true
      - HASURA_GRAPHQL_ADMIN_SECRET=${GRAPHQL_PASS}

  adminer:
    container_name: adminer
    image: adminer
    restart: unless-stopped
    ports:
      - 6102:8080
```

```bash title="环境变量示例"
STACK_VOLUME=/mnt/docker/database
POSTGRES_PASS=
MARIADB_PASS=
GRAPHQL_DB_USER=
GRAPHQL_DB_PASS=
GRAPHQL_DB=
GRAPHQL_PASS=
```

## 媒体

```yaml
services:
  memos:
    container_name: memos
    image: neosmemo/memos
    restart: unless-stopped
    volumes:
      - ${STACK_VOLUME}/memos:/var/opt/memos
    ports:
      - 6200:5230

  dufs-public:
    container_name: dufs-public
    image: sigoden/dufs
    restart: unless-stopped
    ports:
      - 6202:5000
    volumes:
      - ${SOURCE_MOUNT}/public:/data
    command: /data

  dufs-downlloads:
    container_name: dufs-downloads
    image: sigoden/dufs
    restart: unless-stopped
    ports:
      - 6203:5000
    volumes:
      - ${SOURCE_MOUNT}/downloads:/data
    command: /data --allow-upload --allow-search

  dufs-book:
    container_name: dufs-book
    image: sigoden/dufs
    restart: unless-stopped
    ports:
      - 6204:5000
    volumes:
      - ${SOURCE_MOUNT}/book:/data
    command: /data --allow-search --allow-archive

  piwigo:
    container_name: piwigo
    image: linuxserver/piwigo:latest
    restart: unless-stopped
    ports:
      - 6205:80
    volumes:
      - ${STACK_VOLUME}/piwigo:/config
      - ${SOURCE_MOUNT}/gallery:/gallery
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai

  piwigodb:
    container_name: piwigo-db
    image: mariadb
    restart: unless-stopped
    volumes:
      - ${STACK_VOLUME}/piwigo-db/conf.d:/etc/mysql/conf.d
      - ${STACK_VOLUME}/piwigo-db/data:/var/lib/mysql
      - ${STACK_VOLUME}/piwigo-db/logs:/logs
    environment:
      - MARIADB_ROOT_PASSWORD=${PIWIGODB_PASS}
  navidrome:
    container_name: navidrome
    image: deluan/navidrome
    restart: unless-stopped
    ports:
      - 6206:4533
    volumes:
      - ${STACK_VOLUME}/navidrome:/data
      - ${SOURCE_MOUNT}/music:/music:ro
    environment:
      ND_SCANSCHEDULE: 12h
      ND_LOGLEVEL: info

  suwayomi:
    container_name: suwayomi
    image: ghcr.io/suwayomi/tachidesk
    restart: unless-stopped
    volumes:
      - ${STACK_VOLUME}/suwayomi:/home/suwayomi/.local/share/Tachidesk
      - ${SOURCE_MOUNT}/comic/online:/home/suwayomi/.local/share/Tachidesk/downloads/mangas
    ports:
      - 6208:4567
    environment:
      - TZ=Asia/Shanghai
      - FLARESOLVERR_ENABLED=true
      - FLARESOLVERR_URL=${FLARESOLVERR_URL}
```

```bash title="环境变量示例"
STACK_VOLUME=/mnt/docker/media
SOURCE_MOUNT=/mnt
PIWIGODB_PASS=
FLARESOLVERR_URL=
```

## Rss

```yaml
services:
  rsshub:
    container_name: rsshub
    image: diygod/rsshub
    restart: unless-stopped
    ports:
      - 6104:1200

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
      - ${STACK_VOLUME}/freshrss/data:/var/www/FreshRSS/data
      - ${STACK_VOLUME}/freshrss/extensions:/var/www/FreshRSS/extensions
    environment:
      TZ: Asia/Shanghai
      CRON_MIN: "1,15,31"
      TRUSTED_PROXY: 172.16.0.0/12 192.168.0.0/16

  rssdb:
    container_name: rss-pg
    image: postgres:alpine
    restart: unless-stopped
    volumes:
      - ${STACK_VOLUME}/rss_pg:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=${RSSDB_PASS}
```

```bash title="环境变量示例"
STACK_VOLUME=/mnt/docker/rss
RSSDB_PASS=
```

## 下载

```yaml
services:
  autobangumi:
    container_name: autobangumi
    image: estrellaxd/auto_bangumi
    restart: unless-stopped
    ports:
      - 6300:7892
    volumes:
      - ${STACK_VOLUME}/autobangumi/config:/app/config
      - ${STACK_VOLUME}/autobangumi/data:/app/data
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
      - ${STACK_VOLUME}/aria2:/config
      - ${SOURCE_MOUNT}/downloads:/downloads
    environment:
      - PUID=1000
      - PGID=1000
      - UMASK_SET=022
      - RPC_SECRET=${ARIA_PASS}
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
      - ${STACK_VOLUME}/qbittorrent:/qBittorrent
      - ${SOURCE_MOUNT}/downloads:/downloads
      - ${SOURCE_MOUNT}/bangumi:/bangumi
    environment:
      - PUID=1000
      - PGID=1000
      - UMASK_SET=022
      - TZ=Asia/Shanghai
      - QBT_WEBUI_PORT=28080

  alist:
    container_name: alist
    image: xhofe/alist
    restart: unless-stopped
    ports:
      - 6305:5244
    volumes:
      - ${STACK_VOLUME}/alist:/opt/alist/data
    environment:
      - PUID=1000
      - PGID=1000
      - UMASK=022
```

```bash title="环境变量示例"
STACK_VOLUME=/mnt/docker/downloader
SOURCE_MOUNT=/mnt
ARIA_PASS=
```

## 百度云

```yaml
services:
  baidunetdisk:
    container_name: baidunetdisk
    image: johngong/baidunetdisk
    restart: unless-stopped
    ports:
      - 6303:5800
      - 6304:5900
    volumes:
      - ${STACK_VOLUME}/config:/config
      - ${SOURCE_MOUNT}/downloads:/downloads
    environment:
      - USER_ID=1000
      - GROUP_ID=1000
```

```bash title="环境变量示例"
STACK_VOLUME=/mnt/docker/baiduyun
SOURCE_MOUNT=/mnt
```

## 工具

```yaml
services:
  ittools:
    container_name: ittools
    image: corentinth/it-tools
    restart: unless-stopped
    ports:
      - 6500:80

  drawdb:
    container_name: drawdb
    image: xinsodev/drawdb
    restart: unless-stopped
    ports:
      - 6501:80

  jsoncrack:
    container_name: jsoncrack
    image: shokohsc/jsoncrack
    restart: unless-stopped
    ports:
      - 6502:8080

  plantuml:
    container_name: plantuml
    image: plantuml/plantuml-server
    restart: unless-stopped
    ports:
      - 6503:8080
    volumes:
      - ${STACK_VOLUME}/plantuml:/tmp/jetty

  picsmaller:
    container_name: picsmaller
    image: vimiix/pic-smaller
    restart: unless-stopped
    ports:
      - 6504:3000

  webp2jpg:
    container_name: webp2jpg
    image: wbsu2003/webp2jpg-online
    restart: unless-stopped
    ports:
      - 6505:80
```

```bash title="环境变量示例"
STACK_VOLUME=/mnt/docker/tools
```

## Bitmagnet

```yaml
services:
  bitmagnet-web:
    container_name: bitmagnet-web
    image: journey0ad/bitmagnet-next-web
    restart: unless-stopped
    ports:
      - 6402:3000
    environment:
      - POSTGRES_DB_URL=postgres://postgres:postgres@bitmagnetdb:5432/bitmagnet
    depends_on:
      postgres:
        condition: service_healthy

  bitmagnet:
    container_name: bitmagnet
    image: ghcr.io/bitmagnet-io/bitmagnet
    restart: unless-stopped
    ports:
      - 6401:3333
      - 3334:3334/tcp
      - 3334:3334/udp
    environment:
      - POSTGRES_HOST=bitmagnetdb
      - POSTGRES_PASSWORD=postgres
      - TMDB_ENABLED=false
    command:
      - worker
      - run
      - --keys=http_server
      - --keys=queue_server
      - --keys=dht_crawler
    depends_on:
      postgres:
        condition: service_healthy

  bitmagnetdb:
    container_name: bitmagnet-pg
    image: postgres:alpine
    restart: unless-stopped
    volumes:
      - ${STACK_VOLUME}/postgres:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=bitmagnet
      - PGUSER=postgres
    shm_size: 1g
    healthcheck:
      test:
        - CMD-SHELL
        - pg_isready
      start_period: 20s
      interval: 10s
```

```bash title="环境变量示例"
STACK_VOLUME=/mnt/docker/bitmagnet
```
