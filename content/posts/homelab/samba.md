---
title: Samba 文件共享
date: 2026-07-25
modified: 2026-07-25
categories: [家用服务器]
tags: [Linux, Samba]
expirationReminder:
  enable: true
---

搭建 Samba 服务器并配置客户端。

<!--more-->

## 安装服务端

安装 `samba` 软件包

```bash
apt install samba
```

## 设置用户

Samba 用户基于 Linux 用户，在创建 Samba 用户前需创建 Linux 用户

若不使用 `-g` 指定主要组，则会创建与用户同名的组。

```bash
useradd -s /bin/zsh -g trusted -u 1000 neko
```

新建 Samba 用户

```bash
smbpasswd -a neko
```

## 配置共享

将 `/etc/samba/smb.conf` 文件中的共享全部注释掉，并设置自定义共享

```ini
[buffer]
    comment = Shared Buffer Directory
    path = /mnt/pve/buffer
    valid users = @trusted
    public = no
    browseable = yes
    writable = yes
    guest ok = no
    create mask = 0644
    directory mask = 0755
    force user = root
    force group = root
```

## 设置权限

需要将共享目录下的文件或文件夹设置为共享用户所有

```bash
chown -R root:root /mnt/pve/buffer
```

## 检查配置文件并启用

```bash
testparm
systemctl restart samba
```
