---
title: 佳软推荐：Sizer
date: 2023-11-09
modified: 2025-07-16
categories: [软件]
collections: [Windows 软件]
tags: [Windows, 软件, 窗口管理]
---

Sizer 能够将原本不能调整尺寸的窗口放大至指定尺寸。

官方网站：[:(fa-solid fa-link): brianapps.net](https://www.brianapps.net/sizer4/)

<!--more-->

玩早期版本的 RPG Maker 游戏时，尤其是 VxAce 以前时代，游戏窗口时不允许调整的，有了这个软件，可以将窗口放大至现代高清屏也非常合适的尺寸。

缺点时需要提前定义窗口尺寸，通常来说官方自带的尺寸就够用了，以下是常用窗口尺寸配置：

- 4:3
  - 800x600
  - 960x720
  - 1280x960
  - 1600x1200
- 16:9
  - 1280x720
  - 1600x900
  - 1920x1080
- 16:10
  - 1280x800
  - 1440x900
  - 1600x1000
  - 1920x1200

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<sizer>
	<options showIconInTray="1" startInSafeMode="0" adjustOppositeEdge="0" tooltipOption="1" hotKey="90" hotKeyModifiers="10" hotKeyExtended="0" useDwmExtendedFrames="1"/>
	<menu>
		<resize description="800×600" hotKey="0" hotKeyModifiers="0" hotKeyExtended="0" width="800" height="600" relocate="0" monitor="-2" top="" left="" noresize="0" relocateCoords="1" allowOutsideBounds="0"/>
		<resize description="960×720" hotKey="0" hotKeyModifiers="0" hotKeyExtended="0" width="960" height="720" relocate="0" monitor="-2" top="" left="" noresize="0" relocateCoords="1" allowOutsideBounds="0"/>
		<resize description="1280×960" hotKey="0" hotKeyModifiers="0" hotKeyExtended="0" width="1280" height="960" relocate="0" monitor="-2" top="" left="" noresize="0" relocateCoords="1" allowOutsideBounds="0"/>
		<resize description="1600x1200" hotKey="0" hotKeyModifiers="0" hotKeyExtended="0" width="1600" height="1200" relocate="0" monitor="-2" top="" left="" noresize="0" relocateCoords="1" allowOutsideBounds="0"/>
		<separator/>
		<group description="4:3" hotKey="0" hotKeyModifiers="0" hotKeyExtended="0">
			<resize description="800×600" hotKey="0" hotKeyModifiers="0" hotKeyExtended="0" width="800" height="600" relocate="0" monitor="-2" top="" left="" noresize="0" relocateCoords="1" allowOutsideBounds="0"/>
			<resize description="1024×768" hotKey="0" hotKeyModifiers="0" hotKeyExtended="0" width="1024" height="768" relocate="0" monitor="-2" top="" left="" noresize="0" relocateCoords="1" allowOutsideBounds="0"/>
			<resize description="1280×960" hotKey="0" hotKeyModifiers="0" hotKeyExtended="0" width="1280" height="960" relocate="0" monitor="-2" top="" left="" noresize="0" relocateCoords="1" allowOutsideBounds="0"/>
			<resize description="1400×1050" hotKey="0" hotKeyModifiers="0" hotKeyExtended="0" width="1400" height="1050" relocate="0" monitor="-2" top="" left="" noresize="0" relocateCoords="1" allowOutsideBounds="0"/>
			<resize description="1600×1200" hotKey="0" hotKeyModifiers="0" hotKeyExtended="0" width="1600" height="1200" relocate="0" monitor="-2" top="" left="" noresize="0" relocateCoords="1" allowOutsideBounds="0"/>
		</group>
		<group description="16:9" hotKey="0" hotKeyModifiers="0" hotKeyExtended="0">
			<resize description="1280×720" hotKey="0" hotKeyModifiers="0" hotKeyExtended="0" width="1280" height="720" relocate="0" monitor="-2" top="" left="" noresize="0" relocateCoords="1" allowOutsideBounds="0"/>
			<resize description="1600×900" hotKey="0" hotKeyModifiers="0" hotKeyExtended="0" width="1600" height="900" relocate="0" monitor="-2" top="" left="" noresize="0" relocateCoords="1" allowOutsideBounds="0"/>
			<resize description="1920×1080" hotKey="0" hotKeyModifiers="0" hotKeyExtended="0" width="1920" height="1080" relocate="0" monitor="-2" top="" left="" noresize="0" relocateCoords="1" allowOutsideBounds="0"/>
		</group>
		<group description="16:10" hotKey="0" hotKeyModifiers="0" hotKeyExtended="0">
			<resize description="1280×800" hotKey="0" hotKeyModifiers="0" hotKeyExtended="0" width="1280" height="800" relocate="0" monitor="-2" top="" left="" noresize="0" relocateCoords="1" allowOutsideBounds="0"/>
			<resize description="1440×900" hotKey="0" hotKeyModifiers="0" hotKeyExtended="0" width="1440" height="900" relocate="0" monitor="-2" top="" left="" noresize="0" relocateCoords="1" allowOutsideBounds="0"/>
			<resize description="1600×1000" hotKey="0" hotKeyModifiers="0" hotKeyExtended="0" width="1600" height="1000" relocate="0" monitor="-2" top="" left="" noresize="0" relocateCoords="1" allowOutsideBounds="0"/>
			<resize description="1920×1200" hotKey="0" hotKeyModifiers="0" hotKeyExtended="0" width="1920" height="1200" relocate="0" monitor="-2" top="" left="" noresize="0" relocateCoords="1" allowOutsideBounds="0"/>
		</group>
		<template/>
		<configDialog/>
	</menu>
</sizer>
```