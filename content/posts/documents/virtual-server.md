---
title: 搭建 Debian 虚拟服务器
date: 2023-04-15
modified: 2025-07-14
categories: [文档]
collections: [Homelab]
tags: [ProxmoxVE, Linux, Server, Debian]
expirationReminder:
  enable: true
---

搭建 Debian 基础虚拟服务器。

<!--more-->

## 虚拟客户端创建注意事项

### 虚拟机

1. 带有图形界面的虚拟机可以使用 `VirtIO-GPU` 以获得更好的图形性能。
2. 机型和 BIOS 尽量选择 `q35` 和 `OVMF`，如果遇到启动问题，则进入 BIOS 关闭安全启动。
3. 启用 `Qemu 代理` 能更好地管理虚拟机。
4. CPU 尽量使用 `host` 类别

### LXC 容器

1. 尽量创建特权嵌套容器，PVE 8 中的无特权容器可能会导致登录时卡顿。
2. IPv6 网络需要选择 SLAAC 来配置地址，不然也可能会导致登录时卡顿。
3. 非特权容器无法直接挂载网络文件夹。
4. 特权容器挂载网络文件夹比较简单，在 `选项` - `功能` 中开启对应对应的功能即可在容器内部进行正常挂载。

## Debian 虚拟机

从 [Debian 官网](https://www.debian.org/) 下载 Netinst ISO 镜像最小化安装 Debian，安装过程中提示的软件包仅安装 `ssh server` 和 `standard system utilities`。

### 更换引导以及提升普通用户权限

```bash
su -
apt update
apt remove grub
rm -rf /boot/grub
apt install systemd-boot sudo -y
bootctl install
gpasswd -a neko sudo
```

> [!TIP] 提示
> 完成后建议重启系统。

### Debian 换源

```bash
# 更新证书及增加 apt https 支持
apt update && apt install -y apt-transport-https ca-certificates  --fix-missing

# USTC Debian 源
sudo sed -i 's|http://deb.debian.org|https://mirrors.ustc.edu.cn|g' /etc/apt/sources.list
sudo sed -i \
  -e 's|security.debian.org/\? |security.debian.org/debian-security |g' \
  -e 's|http://security.debian.org|https://mirrors.ustc.edu.cn|g' \
  -e 's|http://deb.debian.org/debian-security|https://mirrors.ustc.edu.cn/debian-security|g' \
  /etc/apt/sources.list

# 刷新软件列表并更新系统
apt update && apt upgrade
```

### 安装基础软件

安装基础软件和 `oh-my-zsh` 插件。

```bash
sudo apt install vim git zsh tmux curl nfs-common lsd bat fd-find ripgrep  -y
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

配置 zsh：

```bash
cd ~/.oh-my-zsh/custom/plugins
git clone https://github.com/zsh-users/zsh-autosuggestions.git
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git
cd ~

cp ~/.zshrc ~/.zshrc.bak
sed -i 's/ZSH_THEME=\"robbyrussell\"/ZSH_THEME=\"ys\"/g' ~/.zshrc
sed -i 's/plugins=(git)/plugins=(git z sudo extract fzf zsh-autosuggestions zsh-syntax-highlighting)/g' ~/.zshrc
source ~/.zshrc
```

配置 vim：

```bash
sudo tee -a /etc/vim/vimrc << EOF
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
git config --global user.name neko
git config --global user.email neko@eroneko.eu.org
git config --global init.defaultbranch main
git config --global core.autocrlf input
git config --global core.safecrlf true
```

配置 .zshrc 别名：

```bash
tee -a ~/.zshrc << EOF
alias sudo="sudo "
alias ls="lsd"
alias ll="lsd -l"
alias la="lsd -al"
alias lt="lsd --tree"
alias cat="batcat -pp"
alias bat="batcat"
alias fd="find"
alias grep="rg"

if [[ -z "$TMUX" ]]; then
    tmux attach -t default || tmux new -s default
fi

EOF
```

> [!NOTE] 笔记
> 完成后退出远程并重连，会直接进入 Tmux 的 default 会话，使用 <kbd>ctrl</kbd> + <kbd>b</kbd> 再按 <kbd>d</kbd> 退出 Tmux，再使用 `exit` 退出远程。

### 挂载 NFS

先创建本地空文件夹，之后在配置文件中将远程目录映射到目录中：

```test title="/etc/fstab"
# <file system>             <mount point> <type> <options>                                                          <dump> <pass>
${remotehost}:${remotepath} ${localpath}  nfs4    vers=4,minorversion=2,rw,noatime,hard,timeo=150,retrans=3,_netdev 0      0
```

### Docker

#### 安装 Docker

```bash
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update

sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 授权普通用户使用 docker
sudo gpasswd -a neko docker
```

> [!WARNING] 警告
> 若 Docker 运行依赖了远程网络文件夹，可能会出现 Docker 启动后 NFS 还没有挂载好的情况，若出现，则检查是否设置了足够长的 Nas 启动时间，或需要配置 Docker 在挂载完成之后再运行。

> [!NOTE]- Docker 延迟启动配置
> 编辑 `/lib/systemd/system/docker.service` 文件，编辑 `[Unit]` 段
> 
> - 将 `local-fs.target` 和 `remote-fs.target` 添加到 `After` 中
>   - 确保 Docker 在本地和远程目录挂载完成后再启动
> - 将 `local-fs.target` 和 `remote-fs.target` 添加到 `Requires`中
>   - 确保 在本地和远程目录挂载失败时，Docker 不启动，避免 Docker 映射错误的卷
> 
> ```text {title="/lib/systemd/system/docker.service",hl_lines=[4,6]}
> [Unit]
> Description=Docker Application Container Engine
> Documentation=https://docs.docker.com
> After=network-online.target nss-lookup.target docker.socket firewalld.service > containerd.service time-set.target local-fs.target remote-fs.target
> Wants=network-online.target containerd.service
> Requires=docker.socket local-fs.target remote-fs.target
> ```

## Debian LXC 容器

选择 Debian 最新的 standard 模板即可。

### Debian 换源

```bash
# 更新证书及增加 apt https 支持
apt update && apt install -y apt-transport-https ca-certificates  --fix-missing

# USTC Debian 源
sed -i 's|http://deb.debian.org|https://mirrors.ustc.edu.cn|g' /etc/apt/sources.list
sed -i \
  -e 's|security.debian.org/\? |security.debian.org/debian-security |g' \
  -e 's|http://security.debian.org|https://mirrors.ustc.edu.cn|g' \
  -e 's|http://deb.debian.org/debian-security|https://mirrors.ustc.edu.cn/debian-security|g' \
  /etc/apt/sources.list

# 刷新软件列表并更新系统
apt update && apt upgrade
```

### 反代服务器

```bash
apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install caddy
```

### Git 服务器

安装基础包：

```bash
apt install git nfs-common
adduser git
```

NFS 挂载：参照 [挂载 NFS](#挂载-nfs)

创建链接：

```bash
ln -s ${映射目录} /home/git/neko
```

换用 git 用户配置 Git：

```bash
git config --global user.name neko
git config --global user.email neko@eroneko.eu.org
git config --global init.defaultbranch main
git config --global core.autocrlf input
git config --global core.safecrlf true
git config --global --add safe.directory '*'
```

远程测试创建拉取仓库：

```bash
ssh gitsvr git init --bare neko/test.git
git clone gitsvr:neko/test
```

### Jellyfin 服务器

#### 核显直通

PVE 主机安装相关软件并加载 GuC 和 HuC 固件，之后重启：

```bash
apt update && apt dist-upgrade
apt install intel-media-va-driver-non-free vainfo -y
echo "options i915 enable_guc=3" >> /etc/modprobe.d/i915.conf
update-initramfs -u -k all
```

创建 Debian 12 LXC **特权容器**（需要挂载 NFS ）

在 `选项` - `功能` 中勾选 `嵌套`、`NFS`、`创建设备节点`，在 `资源` 中添加设备直通。

根据 PVE 中设备的用户名/组名查找容器内部的 UID/GID：

- `/dev/dri/card1`
  - UID: `0` (root)
  - GID: `44` (video)
- `/dev/dri/renderD128`
  - UID: `0` (root)
  - GID: `104` (render)

例如：`/dev/dri/card1` 在 PVE 中的拥有者是 **root**/**video**，那么在 LXC 容器内查找所对应的 UID/GID：

```bash
# 查找 UID
cat /etc/passwd | grep root
# 查找 GID
cat /etc/group | grep video
```

#### 使用闭源驱动

检查软件源是否包含闭源仓库，否则需要添加仓库：

```bash
# 检查是否包含 non-free non-free-firmware
cat /etc/apt/sources.list | grep "^deb"

# 若不包含，则添加到软件源尾部
sudo sed -i -e 's| main contrib| main contrib non-free non-free-firmware|g' /etc/apt/sources.list
# 更新
apt update && apt upgrade
```

安装相关软件并挂载 NFS：

```shell
apt install curl fonts-noto-cjk-extra nfs-common intel-media-va-driver-non-free vainfo intel-gpu-tools -y
```

检查硬解支持情况：

```shell
vainfo
```

#### 安装 jellyfin：

```shell
curl https://repo.jellyfin.org/install-debuntu.sh | bash
```
