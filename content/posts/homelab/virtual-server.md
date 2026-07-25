---
title: 搭建 Debian 虚拟服务器
date: 2023-04-15
modified: 2026-07-25
categories: [家用服务器]
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

选择 Debian 最新的 standard 模板。

### Debian 换源

```bash
tee /etc/apt/sources.list.d/debian.sources <<EOF
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

### 更改语言和时区

```bash
# 语言需要选择 en_US.UTF-8 并设置默认
dpkg-reconfigure locales
# 时区选择北京时间
timedatectl set-timezone Asia/Shanghai
```

### 用户管理

#### 添加用户组

```bash
groupadd -g 1000 trusted
```

#### 添加用户

若不使用 `-g` 指定主要组，则会创建与用户同名的组。

```bash
useradd -s /bin/zsh -g trusted -u 1000 neko
```

#### 添加到组

```bash
usermod -aG wheel neko
```

#### 修改 Shell

```bash
chsh -s /bin/zsh neko
```

#### 删除用户

```bash
userdel -r neko
```

### 安装基础软件

安装基础软件和 `oh-my-zsh` 插件。

```bash
apt update && apt upgrade
apt install vim git zsh curl nfs-common lsd bat fd-find ripgrep fzf tmux -y
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

git clone https://github.com/gpakosz/.tmux.git ~/.tmux
ln -s -f .tmux/.tmux.conf ~/.tmux.conf
cp .tmux/.tmux.conf.local ~
sed -i '1i\if [[ -z "$TMUX" ]] && [[ -n "$SSH_CONNECTION" ]]; then\n    tmux new -A -s default\nfi\n' ~/.zshrc
sed -i 's/#set -g mouse on/set -g mouse on/g' ~/.tmux.conf.local

tee -a ~/.zshrc <<EOF
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
tee -a /etc/vim/vimrc <<EOF
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
```

配置 lsd:

```bash
mkdir -p ~/.config/lsd
tee -a ~/.config/lsd/config.yaml <<EOF
date: '+%Y-%m-%d %H:%M:%S'

EOF
```

## 反代服务器

```bash
apt install caddy
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

### 安装 jellyfin

```bash
curl https://repo.jellyfin.org/install-debuntu.sh | bash
```

## Contianer 服务器

### 安装 Docker

```bash
apt update
apt install ca-certificates curl
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://mirrors.ustc.edu.cn/docker-ce/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Docker 镜像国内源

```bash
tee -a /etc/containers/registries.conf <<EOF
[[registry]]
location = "docker.io"
    [[registry.mirror]]
    location = "docker.m.daocloud.io"

EOF
```
