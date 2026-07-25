---
title: NFS 文件共享
date: 2026-07-25
modified: 2026-07-25
categories: [家用服务器]
tags: [Linux, Samba]
expirationReminder:
  enable: true
---

搭建 NFS 服务器并配置客户端。

<!--more-->

## 服务端

安装 `nfs-kernel-server` 软件包

```bash
apt install nfs-kernel-server
```

编辑 `/etc/exports` 文件配置配置导出目录

```bash
tee -a /etc/exports <<EOF
/mnt/pve/buffer/share/book 10.0.0.0/24(rw,anonuid=1000,anongid=1000,all_squash,sync,no_subtree_check)
/mnt/pve/buffer/share/music 10.0.0.0/24(rw,anonuid=1000,anongid=1000,all_squash,sync,no_subtree_check)
/mnt/pve/buffer/share/public 10.0.0.0/24(rw,anonuid=1000,anongid=1000,all_squash,sync,no_subtree_check)
/mnt/pve/buffer/share/repository 10.0.0.0/24(rw,anonuid=1000,anongid=1000,all_squash,sync,no_subtree_check)
/mnt/pve/buffer/share/web 10.0.0.0/24(rw,anonuid=1000,anongid=1000,all_squash,sync,no_subtree_check)
/mnt/pve/buffer/share/comic 10.0.0.0/24(rw,anonuid=1000,anongid=1000,all_squash,sync,no_subtree_check)
/mnt/pve/buffer/share/downloads 10.0.0.0/24(rw,anonuid=1000,anongid=1000,all_squash,sync,no_subtree_check)
/mnt/pve/buffer/share/bangumi 10.0.0.0/24(rw,anonuid=1000,anongid=1000,all_squash,sync,no_subtree_check)

EOF
# 重新加载导出配置
exportfs -ar
```

## 客户端

安装 `nfs-common` 软件包

```bash
apt install nfs-common
```

在 `/nfs` 下创建挂载文件夹

```bash
mkdir -p /nfs/test
```

测试挂载

```bash
mount -t nfs4 -o vers=4,minorversion=2,rw,noatime,hard,timeo=150,retrans=3,_netdev 10.0.0.1:/mnt/pve/buffer/share/test /nfs/test
df -h
umount /nfs/test
```

修改 `/etc/fstab`

```plaintext
# <file system>                         <mount point>   <type> <options>                                                         <dump> <pass>
10.0.0.1:/mnt/pve/buffer/share/book       /nfs/book        nfs4  vers=4,minorversion=2,rw,noatime,hard,timeo=150,retrans=3,_netdev 0      0
10.0.0.1:/mnt/pve/buffer/share/music      /nfs/music       nfs4  vers=4,minorversion=2,rw,noatime,hard,timeo=150,retrans=3,_netdev 0      0
10.0.0.1:/mnt/pve/buffer/share/public     /nfs/public      nfs4  vers=4,minorversion=2,rw,noatime,hard,timeo=150,retrans=3,_netdev 0      0
10.0.0.1:/mnt/pve/buffer/share/repository /root/repository nfs4  vers=4,minorversion=2,rw,noatime,hard,timeo=150,retrans=3,_netdev 0      0
10.0.0.1:/mnt/pve/buffer/share/web        /nfs/web         nfs4  vers=4,minorversion=2,rw,noatime,hard,timeo=150,retrans=3,_netdev 0      0
10.0.0.1:/mnt/pve/buffer/share/comic      /nfs/comic       nfs4  vers=4,minorversion=2,rw,noatime,hard,timeo=150,retrans=3,_netdev 0      0
10.0.0.1:/mnt/pve/buffer/share/downloads  /nfs/downloads   nfs4  vers=4,minorversion=2,rw,noatime,hard,timeo=150,retrans=3,_netdev 0      0
10.0.0.1:/mnt/pve/buffer/share/bangumi    /nfs/bangumi     nfs4  vers=4,minorversion=2,rw,noatime,hard,timeo=150,retrans=3,_netdev 0      0
```
