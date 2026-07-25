---
title: 搭建 Proxmox VE 虚拟环境
date: 2023-03-24
modified: 2026-07-25
categories: [家用服务器]
tags: [ProxmoxVE, Linux]
expirationReminder:
  enable: true
---

安装配置 Proxmox VE，更换国内源，设置硬件直通教程。

<!--more-->

## 安装 PVE

首先开启 Bios 虚拟化有关的选项，
之后根据 [官方文档](https://pve.proxmox.com/wiki/Installation) 进行安装。

本文适用于 Proxmox VE 9 (Debian 13)。

## 换源

可在 WebUI 中的 `节点` - `更新` - `存储库` 中查看结果。

### Debian 系统源

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

### Proxmox 软件源

```bash
tee /etc/apt/sources.list.d/pve-no-subscription.sources <<EOF
Types: deb
URIs: https://mirrors.ustc.edu.cn/proxmox/debian/pve
Suites: trixie
Components: pve-no-subscription
Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg

EOF
tee /etc/apt/sources.list.d/pve-enterprise.sources  <<EOF
Types: deb
URIs: https://enterprise.proxmox.com/debian/pve
Suites: trixie
Components: pve-enterprise
Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg
Enabled: false

EOF
rm /etc/apt/sources.list
```

### Ceph 源

```bash
tee /etc/apt/sources.list.d/ceph.sources <<EOF
Types: deb
URIs: https://mirrors.ustc.edu.cn/proxmox/debian/ceph-squid
Suites: trixie
Components: no-subscription
Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg
Enabled: false

EOF
```

### LXC 仓库源

`/usr/share/perl5/PVE/APLInfo.pm` 文件属于 `pve-manager` 软件包，该软件包升级后，需要重新替换。

```bash
sed -i.bak 's|http://download.proxmox.com|https://mirrors.ustc.edu.cn/proxmox|g' /usr/share/perl5/PVE/APLInfo.pm
systemctl restart pvedaemon
```

## 切换为 systemd-boot 引导

检查是否为 grub 引导

```bash
proxmox-boot-tool status
```

检查是否使用 UEFI 引导

```bash
efibootmgr -v
# 此时可删除所有启动项
efibootmgr -b ${序号} -B
```

重新初始化 EFI 分区

```bash
# 查看 /boot/efi 挂载分区
df -h
# 卸载挂载点
umount /boot/efi
# 初始化
proxmox-boot-tool format /dev/${EFI分区}
proxmox-boot-tool init /dev/${EFI分区}
# 查看新磁盘 uuid
ls -l /dev/disk/by-uuid
```

在 `/etc/fstab` 中将新磁盘的 uuid 替换掉原有挂载设备

```bash
# <file system> <mount point> <type> <options> <dump> <pass>
UUID=${EFI分区UUID}  /boot/efi     vfat   defaults  0      1
```

删除 grub 并重新启动

```bash
apt remove grub
rm -r /boot/grub
```

## 硬件直通

### 开启 IOMMU

grub 修改 `/etc/default/grub`

```diff
- GRUB_CMDLINE_LINUX_DEFAULT="quiet"
+ GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt pcie_acs_override=downstream,multifunction"
```

systemd-boot 修改 `/etc/kernel/cmdline`

```diff
- BOOT_IMAGE=/boot/vmlinuz-6.14.11-1-pve root=/dev/mapper/pve-root ro quiet
+ BOOT_IMAGE=/boot/vmlinuz-6.14.11-1-pve root=/dev/mapper/pve-root ro quiet intel_iommu=on iommu=pt pcie_acs_override=downstream,multifunction
```

加载内核模块

```bash
tee /etc/modules <<EOF
vfio
vfio_iommu_type1
vfio_pci
vfio_virqfd

EOF
```

### 启用 GuC / HuC 固件

```bash
echo "options i915 enable_guc=3" >> /etc/modprobe.d/i915.conf
```

更新启动文件并重启

```bash
update-initramfs -u -k all
proxmox-boot-tool refresh
```

完成后重启，检查固件状态和硬解情况

```bash
apt install intel-media-va-driver-non-free vainfo

dmesg | grep -i "i915|dmr|dmc|guc|huc"
vainfo
```

### PCI 设备直通

网卡、M.2 固态、SATA 控制器、显卡等 PCI 设备可直接添加。

虚拟机在网页的虚拟机硬件中 `硬件` - `添加` - `PCI设备`。

特权 LXC 容器打开 `选项` - `功能` - `创建设备节点` 后，在 `资源` - `添加` - `设备直通` 中添加。

### 核显直通

查看显卡及渲染器名称，查找 `card0`、`renderD128` 的名称及用户、用户组。

```bash
ls -al /dev/dri
```

创建 Debian LXC **特权容器**，检查 LXC 中同名的用户、用户组的 ID，一般来说，会得到如下关系：

| 设备                  | 宿主机用户 | 宿主机用户组 | LXC 内同名用户 ID | LXC 内同名用户组 ID |
| --------------------- | ---------- | ------------ | ----------------- | ------------------- |
| `/dev/dri/card0`      | root       | video        | 0                 | 44                  |
| `/dev/dri/renderD128` | root       | render       | 0                 | 104                 |

在 `选项` - `功能` 中勾选 `嵌套`、`NFS`、`创建设备节点`，在 `资源` 中添加设备直通，注意 `CT 中的 UID / GID` 需要为 LXC 内同名 ID。

### 硬盘直通

> [!TIP]
> 在不使用 TrueNas 等 NAS 系统的情况下，并不建议使用硬盘直通，而是使用挂载点共享宿主机空间。

#### RDM 方式

nvme 或其他走 PCI-E 通道的硬盘不建议使用这种方式，一般作为机械硬盘的直通方式。
先使用一下命令查看硬盘名称：

```bash
ls /dev/disk/by-id/
```

会得到诸如 `ata-xxxx` 或 `nvme-xxxx` 形式的硬盘名称，使用以下命令将硬盘添加到虚拟机中：

```bash
qm set ${VM_ID} -scsi1 /dev/disk/by-id/${DISK_NAME}
```

此处的 `-scsi1` 可修改为 `-sata0` 或 `-ide2` 等未占用的通道。

#### 直通 SATA 控制器

详见 [PCI 设备直通](#pci-设备直通)。

### 挂载点

LXC 开启特权容器，并打开 选项 - 功能 中的所有功能。

需要使用命令对 LXC 容器添加目录映射：

```bash
pct set ${LXCID} -mp${挂载点ID} /mnt/pve/buffer,mp=/proxmox
```
