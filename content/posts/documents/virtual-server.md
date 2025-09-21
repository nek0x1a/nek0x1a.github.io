---
title: 搭建 Debian 虚拟服务器
date: 2023-04-15
modified: 2025-09-21
categories: [文档]
collections: [Homelab]
tags: [ProxmoxVE, Linux, Server, Debian]
expirationReminder:
  enable: true
---

使用 LXC 搭建 Debian 13 基础虚拟服务器。

<!--more-->

## LXC 容器创建注意事项

1. 需创建创建特权嵌套容器，若网络中没有 DHCPv6 服务器，则 IPv6 网络需要选择 SLAAC 来配置地址，否则 networking.service 可能会启动失败导致登录时卡顿。
2. 非特权容器无法直接挂载网络文件夹。
3. 特权容器挂载网络文件夹比较简单，在 `选项` - `功能` 中开启对应对应的功能即可在容器内部进行正常挂载。

## LXC 容器初始化

选择 Debian 最新的 standard 模板即可。

#### Debian 换源

```bash
tee /etc/apt/sources.list.d/debian.sources << EOF
Types: deb
URIs: http://mirrors.ustc.edu.cn/debian
Suites: trixie trixie-updates
Components: main contrib non-free non-free-firmware
Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg

Types: deb
URIs: http://mirrors.ustc.edu.cn/debian-security
Suites: trixie-security
Components: main contrib non-free non-free-firmware
Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg

EOF
```

#### 更改时区

```bash
timedatectl set-timezone Asia/Shanghai
```


#### 安装基础软件

安装基础软件和 `oh-my-zsh` 插件。

```bash
apt update && apt upgrade
apt install vim git zsh curl nfs-common lsd bat fd-find ripgrep fzf -y
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

配置 zsh：

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
git clone --depth=1 https://github.com/zsh-users/zsh-autosuggestions.git "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-autosuggestions"
git clone --depth=1 https://github.com/zsh-users/zsh-syntax-highlighting.git "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting"

cp ~/.zshrc ~/.zshrc.bak
sed -i 's#ZSH_THEME=\"robbyrussell\"#ZSH_THEME=\"powerlevel10k\/powerlevel10k\"#g' ~/.zshrc
sed -i 's#plugins=(git)#plugins=(git z sudo extract fzf zsh-autosuggestions zsh-syntax-highlighting)#g' ~/.zshrc
sed -i 's/# HIST_STAMPS="mm\/dd\/yyyy"/HIST_STAMPS="yyyy-mm-dd"/g' ~/.zshrc

tee -a ~/.zshrc << EOF
alias ls="lsd"
alias ll="lsd -l"
alias la="lsd -al"
alias lt="lsd --tree"
alias cat="batcat -pp"
alias bat="batcat"
alias fd="find"
alias grep="rg"

EOF
source ~/.zshrc
```


配置 vim：

```bash
tee -a /etc/vim/vimrc << EOF
set encoding=utf-8
set nocompatible
set mouse=a

set nobackup
set nowritebackup
set noswapfile

syntax on
set showmatch
set hlsearch
set incsearch
set ignorecase
set smartcase

set number
set relativenumber
set cursorline
set showmode
set showcmd

set scrolloff=6
set sidescrolloff=16
set linebreak

set autoindent
set expandtab
set softtabstop=4
set tabstop=4
set shiftwidth=4

EOF
```

配置 Git：

```bash
git config --global init.defaultbranch main
git config --global core.autocrlf input
git config --global core.safecrlf true
```


#### 挂载 NFS

先创建本地空文件夹，之后在配置文件中将远程目录映射到目录中：

```test title="/etc/fstab"
# <file system>             <mount point> <type> <options>                                                          <dump> <pass>
${remotehost}:${remotepath} ${localpath}  nfs4    vers=4,minorversion=2,rw,noatime,hard,timeo=150,retrans=3,_netdev 0      0
```

Debian 13 LXC 模板中启用了 `systemd-networkd-wait-online.service` 在挂载了 nfs 的情况下在启动阶段将会等待网络配置，造成卡住。可使用以下命令禁用：

```bash
systemctl disabled systemd-networkd-wait-online.service
```


## 反代服务器

```bash
apt install caddy
```

## Git 服务器

配置 Git：

```bash
git config --global --add safe.directory '*'
```

远程测试创建拉取仓库：

```bash
ssh gitsvr git init --bare repository/test.git
git clone gitsvr:repository/test
```

## Jellyfin 服务器

### 主机操作

PVE 主机安装相关软件并加载 GuC 和 HuC 固件，之后重启：

```bash
apt update && apt dist-upgrade
apt install intel-media-va-driver-non-free vainfo -y
echo "options i915 enable_guc=3" >> /etc/modprobe.d/i915.conf
update-initramfs -u -k all
proxmox-boot-tool refresh
```

创建 Debian LXC **特权容器**（需要挂载 NFS ）

在 `选项` - `功能` 中勾选 `嵌套`、`NFS`、`创建设备节点`，在 `资源` 中添加设备直通。

根据 PVE 中设备的用户名/组名查找容器内部的 UID/GID：

- `/dev/dri/card0`
  - UID: `0` (root)
  - GID: `44` (video)
- `/dev/dri/renderD128`
  - UID: `0` (root)
  - GID: `104` (render)

例如：`/dev/dri/card0` 在 PVE 中的拥有者是 **root**/**video**，那么在 LXC 容器内查找所对应的 UID/GID：

```bash
# 查找 UID
cat /etc/passwd | grep root
# 查找 GID
cat /etc/group | grep video
```

### 客户机使用闭源驱动

检查软件源是否包含闭源仓库 `non-free non-free-firmware`，否则需要添加仓库。

安装相关软件并挂载 NFS：

```bash
apt install fonts-noto-cjk-extra intel-media-va-driver-non-free vainfo intel-gpu-tools
```

检查硬解支持情况：

```bash
vainfo
```

### 安装 jellyfin：

```bash
curl https://repo.jellyfin.org/install-debuntu.sh | bash
```

## Podman 服务器

```bash
apt install podman
```

### docker 镜像国内源

```bash
tee -a /etc/containers/registries.conf <<EOF
[[registry]]
location = "docker.io"
    [[registry.mirror]]
    location = "docker.m.daocloud.io"

EOF
```
