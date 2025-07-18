---
title: Windows 窗口边框设置
date: 2022-05-01
modified: 2025-07-16
categories: [系统配置]
collections: [Windows 美化, windows 设置]
tags: [Windows, 美化, 设置]
---

Windows 7 时代有一注册表可以调整窗口边框的宽度，这一注册表直到 Windows 11 24H2 依旧可用。

<!--more-->

## 设置项目

```pwsh
$regOptions = @(
    @{
        Path = "Registry::HKEY_CURRENT_USER\Control Panel\Desktop\WindowMetrics"
        Name = "PaddedBorderWidth"
        # 默认值：-12
        Value = 0
    },
    @{
        Path = "Registry::HKEY_CURRENT_USER\Control Panel\Desktop\WindowMetrics"
        Name = "BorderWidth"
        # 默认值：-60
        Value = 0
    }
)
$regOptions | ForEach-Object { Set-ItemProperty @_ }
```

## 效果

除了将两个值改为 0 外，猫猫也改了几个其他的数值，均没有变化。

### 默认

即 `PaddedBorderWidth` = `-12`、`BorderWidth` = `-60` 时：

- 标题栏高度：30px
- 窗口边框：1px


![默认](https://assets.eroneko.eu.org/blog/osconfig/windows-window-border-01.webp)

根据 Window Spy，消去窗体内容影响（设 client 的 x、y、w、h 为 0）后，Screen 的数值：

- x: -8
- y: -31
- w: 16
- h: 39

### 窄边框

即 `PaddedBorderWidth` = `0`、`BorderWidth` = `0` 时：

- 标题栏高度：27px
- 窗口边框：1px

![窄边框](https://assets.eroneko.eu.org/blog/osconfig/windows-window-border-02.webp)

根据 Window Spy，消去窗体内容影响（设 client 的 x、y、w、h 为 0）后，Screen 的数值：

- x: -4
- y: -27
- w: 8
- h: 31
