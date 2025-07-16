---
title: 搭建 Proxmox VE 虚拟环境
date: 2023-03-24
modified: 2025-07-13
categories: [documents]
collections: [homelab]
tags: [ProxmoxVE, Linux]
expirationReminder:
  enable: true
---

安装配置 Proxmox VE，更换国内源，设置硬件直通教程。

<!--more-->

## 安装 PVE

首先开启 Bios 虚拟化有关的选项，
之后根据 [官方文档](https://pve.proxmox.com/wiki/Installation) 进行安装。

本文适用于 Proxmox VE 8 (Debian 12)。

## 换源

可在 WebUI 中的 `节点` - `更新` - `存储库` 中查看结果。

### Debian 系统源

```shell
# 更新证书及增加 apt https 支持
apt update && apt-get install -y apt-transport-https ca-certificates  --fix-missing

# USTC Debian 源
sed -i 's|^deb http://ftp.debian.org|deb https://mirrors.ustc.edu.cn|g' /etc/apt/sources.list
sed -i 's|^deb http://security.debian.org|deb https://mirrors.ustc.edu.cn/debian-security|g' /etc/apt/sources.list

# 刷新软件列表并更新系统
apt update && apt dist-upgrade
```

### Proxmox 软件源

```shell
# 取消企业源
mv /etc/apt/sources.list.d/pve-enterprise.list /etc/apt/sources.list.d/pve-enterprise.list.bak
# USTC Proxmox 软件源
echo "deb https://mirrors.ustc.edu.cn/proxmox/debian/pve bookworm pve-no-subscription" > /etc/apt/sources.list.d/pve-no-subscription.list
```

### Ceph 源

```shell
if [ -f /etc/apt/sources.list.d/ceph.list ]; then
  CEPH_CODENAME=`ceph -v | grep ceph | awk '{print $(NF-1)}'`
  source /etc/os-release
  echo "deb https://mirrors.ustc.edu.cn/proxmox/debian/ceph-$CEPH_CODENAME $VERSION_CODENAME no-subscription" > /etc/apt/sources.list.d/ceph.list
fi
```

### LXC 仓库源

```shell
# USTC LXC 仓库源
sed -i.bak 's|http://download.proxmox.com|https://mirrors.ustc.edu.cn/proxmox|g' /usr/share/perl5/PVE/APLInfo.pm
systemctl restart pvedaemon
```

## 直通

直通首先需要开启内核的 IOMMU 功能，编辑 `/etc/default/grub`：

```diff
- GRUB_CMDLINE_LINUX_DEFAULT="quiet"
+ GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt pcie_acs_override=downstream,multifunction"
```

更新一下 Grub 的配置：

```shell
proxmox-boot-tool refresh
```

加载内核模块，编辑 `vim /etc/modules` 文件，添加下列内容：

```text
vfio
vfio_iommu_type1
vfio_pci
vfio_virqfd
```

重启设备即可开启 IOMMU 功能。

### PCI 设备直通

网卡、M.2 固态、SATA 控制器、显卡等 PCI 设备可直接添加。

虚拟机在网页的虚拟机硬件中 `硬件` - `添加` - `PCI设备`。

特权 LXC 容器打开 `选项` - `功能` - `创建设备节点` 后，在 `资源` - `添加` - `设备直通` 中添加。

### 硬盘直通

#### RDM 方式

nvme 或其他走 PCI-E 通道的硬盘不建议使用这种方式，一般作为机械硬盘的直通方式。
先使用一下命令查看硬盘名称：

```shell
ls /dev/disk/by-id/
```

会得到诸如 `ata-xxxx` 或 `nvme-xxxx` 形式的硬盘名称，使用以下命令将硬盘添加到虚拟机中：

```shell
qm set ${VM_ID} -scsi1 /dev/disk/by-id/${DISK_NAME}
```

此处的 `-scsi1` 可修改为 `-sata0` 或 `-ide2` 等未占用的通道。

#### 直通 SATA 控制器

详见 [PCI 设备直通](#pci-设备直通)。
