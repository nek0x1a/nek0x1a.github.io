---
title: 佳软推荐：UnTMDpack
date: 2023-10-27
modified: 2025-07-16
categories: [软件]
collections: [Windows 软件]
tags: [Windows, 软件, 解压, 密码]
---

UnTMDpack 可以通过 7z 批量解压文件，可以说完美符合经常下载加密压缩包的仓鼠症患者的痛点。可识别隐写文件，可解压嵌套压缩包，可管理字典文件，再也不用记录每个压缩包的密码了。

发布页面：[:(fa-solid fa-link): cangku.moe](https://cangku.moe/archives/216302)

<!--more-->

![软件截图](https://assets.eroneko.eu.org/blog/software/untmdpack-01.webp)

## 配置

由于嵌套解压会分析压缩包中的每个文件，而部分资源文件等不需要解压，但实际也是压缩包，为避免无意解压，建议解压完成后不要直接删除，并添加以下排除扩展名：

```
doc,docx,docm,docz,dot,dotx,dotm,xls,xlsx,xlsm,xlsz,xlt,xltx,xltm,ppt,pptx,pptm,pptz,pot,potx,potm,wps,msg,odt,ods,odp,jar,jarx,war,xpi,msi,msix,cab,cabinet,deb,rpm,ipk,crx,apk,bar,xap,ipa,pkg,pk3,pk4,vpk,pak,zap,sav,save,iso,udf,mdf,mds,wim,img,bin,epub,apng,amz,xar,z,gz
```

增加进行隐写检测的扩展名：

```
MP4,WMV,MKV,JPG,PNG
```

勾选以下选项：

- 提取压缩包到固定位置
- 同时解压包含的压缩包
- 为压缩包创建单独的输出目录
- 若压缩包中已存在单独目录则取消创建目录

## 密码字典

> [!IMPORTANT] 重要
> 为保护资源分享者的劳动，并且避免非法资源倒卖者获利，请勿分享密码字典！
