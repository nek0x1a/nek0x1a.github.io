---
slug: why-use-ltsc
title: 转向 LTSC 的原因
authors: neko
tags:
  - tech
  - windows
---

自从 Windows 8.1 推出 LTSB 版本 到如今的 Windows 11 LTSC（后文统称 LTSC 版本），互联网上有大量的文章表示 LTSC 版本更香，但大多都是说兼容性和性能表象更好这种无法量化的原因。

猫猫在 Windows 发布大版本时，都会第一时间使用，不久后就会成为主力系统，所以猫猫并不觉得极其主观的感受是衡量一个版本好坏的标准，但是最近，猫猫也变成首选 LTSC、不愿打开更新的保守派了。

<!-- truncate -->

:::warning
请读者在理解自己需求的情况下选择适合自己的系统版本，为保证安全，应该打开系统更新并安装防病毒软件。

本文仅分享心得，不构成推荐。
:::

## 契机即要因

正在为不久前装上的 Windows 11 23H2 感到清爽的猫猫在某天傍晚，赫然发现应用列表中多了一个叫 **微软电脑管家** 的东西，可是猫猫在安装系统后会全面设置一遍 Windows、仔细清理一遍不需要的应用然后进行备份，难道是没删干净？

检查安装日期，居然在备份之后。猫猫平时的使用习惯都挺好的，别说病毒了，就连下崽器都没遇到过一次，怎么会翻车了呢？为了寻找是什么软件把它带进来的，猫猫进行了互联网搜索。

这不查不知道，好家伙微软这浓眉大眼的居然学会了中国软件的核心技术：捆版安装。

原本用于增强安全的系统更新功能尽然沦落到下崽器的地步，当场就想退回使用 Windows 10 LTSC 了。
感觉似乎距离上次使用 LTSC 已经过了很久了，Windows 11 也用了不短时间了。所以搜索了 Windows 11 的 LTSC，但似乎还没发布。

综合考虑，大致距离 Windows 11 LTSC 发布还有半年时间，当时的猫猫决定先继续用下去，当 Windows 11 的 LTSC 版本可用时立即换过去。

## 新的系统管理方式

在 Windows 8 时代，微软带来了一项虚拟机技术：VHD。原本是为虚拟机设计的一种虚拟硬盘。但是可用 Windows Boot Manager 原生启动。这就为猫猫的新的系统管理方式提供了基础。

首先将系统安装到 VHDX 中，进行以下操作：

- 系统更新到最新后暂停更新
- 安装必要软件
  - WinGet
  - PowerShell 7
  - Terminal
  - 运行库等
- 移除组件
  - Defender
  - Edge
- 关闭功能
  - VBS
  - 系统还原
  - 遥测
- 设置系统
  
将基础设置完成后，使用这个 VHDX 作为母版 **BASE**，新建一个 VHDX 链接到 BASE，命名为 **CURRENT** 作为日常使用。

今后每几个月进入 BASE 升级系统和基础软件，重新生成 CURRENT 链接，就相当于重装系统了。

BASE 中安装的均为基础软件，需要登陆使用的最多也就 VSCode，这些软件可由 Winget 命令进行升级。日常使用软件则安装在 CURRENT 中，每次重新生成均需要重新安装。不过由于猫猫使用的便携软件较多，可以在重新链接后复制快捷方式过去即可。

## 性能飞跃

移除了 Defender 和 VBS 之后，猫猫发现计算机的性能几乎得到了飞跃式的提升。运行 Nas 中 500MB 的可执行文件到显示界面的时间，由之前的 4-5 秒变成了 1-2 秒，chrome 启动也由原来的 3-4 秒变成了 1-2 秒。似乎回到了 xp 时代的秒启动。

猫猫从 Windows 7 时代开始，一直都是开着安全更新和防病毒过来的，现在系统的安全特性越叠越高，不知不觉已经吃掉了这么多性能了。

这次尝试彻底移除 Windows 的部分安全组件简直可以成为开阔了视野。
不过像这样禁用安全功能也是有前提的，猫猫在客户端电脑中没有保存重要数据，重要的数据均保存在 Nas 中每天快照，也有每周的冷备份，所以不怕中病毒，只要 Nas 没有被攻破，数据就是安全的。
其次内网中没有其他人使用的设备，所有的设备猫猫都了解其作用，没有运行乱七八糟应用的设备。
再次猫猫的宽带没有公网地址，几乎不会有来自公网色主动攻击，除非吃饱了撑着攻破运营商的局域网外加家庭的内网来偷/加密我一只猫的文件。

## 微软动向

微软频繁通过更新向用户电脑中加料的行为也体现出 Windows 产品的核心客户目标的变化。暂且不说 Windows 零售业务的营收，从 Windows 7/8 免费升级活动就能看出，将广大的盗版用户吸纳为 Windows 10/11 的正版用户后，微软就没有把零售端的用户看作是付费用户了。

Windows 的主要直接营收对象从来都不是使用 Windows 的用户，而是服务器厂商、OEM 企业，看来由阿三领导的微软已经想清楚了，普通 Windows 用户非但不是微软的客户，而是微软的资源，是资源，那按照资本家的本性就会利用其产生利润，其干预资源的手段，便是系统更新。

企业用户与零售用户最大的不同，是企业用户的企业为微软的直接营收对象，微软有必要向企业这一主体提供服务支持，面向企业用户的产品出现了规模稍大的问题，负责处理的还是他们。而普通用户则会向 OEM 请求支持，对微软来说几乎没有影响。

基于这个原因，微软在今后可能会做出更加恶心零售用户的动作。猫猫喜欢新鲜事物，但是对于广告和推送极其敏感，想清楚了这些，猫猫决定今后不回去碰零售版系统了。（除非推出全重构的 Windows 系统）
