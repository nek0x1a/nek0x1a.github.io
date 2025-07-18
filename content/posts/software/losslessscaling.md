---
title: 佳软推荐：Lossless Scaling
date: 2025-01-27
modified: 2025-07-16
categories: [软件]
collections: [Windows 软件]
tags: [Windows, 软件, 超分, 补帧]
---

2024 年火出圈的超分补帧软件，可以方便地对游戏或其他窗口进行超分和补帧。

官方网站：[:(fa-brands fa-steam): Steam:Lossless_Scaling](https://store.steampowered.com/app/993090/Lossless_Scaling/)

<!--more-->

![软件截图](https://assets.eroneko.eu.org/blog/software/losslessscaling-01.webp)

## 配置

> [!TIP] 提示
> v3.2 版本更新后可补帧到自定义帧率：
> 
> - 帧生成：
>   - 类型：LSFG 3.1
>   - 模式：自适应
>   - 目标帧率：设置问显示器刷新率
> 
> 但是看番等其他固定帧率的环境下，建议还是使用传统的固定倍率模式。因为非倍率会导致显示画面与原始画面帧时间不对应。

### 帧生成

类型选择 LSFG 最新版。

模式可选 `固定`（适合视频）、`自适应`（适合游戏）。

倍数/目标帧率尽量靠近显示器的刷新率。

### 缩放

类型依照显卡平台和窗口内容确定：

- Anime4K：动漫、rpg等偏向二次元的选择
- FSR：AMD 平台，现实、3D 游戏画面
- NIS：Nvidia 平台，现实、3D 游戏画面
- SGSR：骁龙平台，现实、3D 游戏画面

其他可根据性能选择。

### 渲染选项

同步模式一般默认，有需求或性能足够可选择开启或关闭。

HDR 和 G-Sync 硬件支持即可开启。

### 捕获

游戏全屏运行时，一般使用 DXGI，若目标为窗口时，可选择 WCG，避免受到全局刷新率影响获取到重复帧。

### 光标选项

一般开启 限制光标 和 调整光标速度 即可。

### GPU/显示器

多 GPU 或多显示器用户使用，选择需要指定的设备。

### 裁剪

使用非正规系统 API 的窗口可能会将窗口边框一起获取，可在此处裁剪掉无用部分。

### 示例配置

这是一份示例配置文件：

```xml {title="Settings.xml"}
<?xml version="1.0" encoding="utf-8"?>
<Settings xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <WindowMaximized>false</WindowMaximized>
  <WindowHeight>748</WindowHeight>
  <WindowWidth>1282</WindowWidth>
  <ProfileListWidth>180</ProfileListWidth>
  <Hotkey>S</Hotkey>
  <HotkeyModifierKeys>Alt Control</HotkeyModifierKeys>
  <GpuPreference>0</GpuPreference>
  <GpuPreferenceChangeCount>0</GpuPreferenceChangeCount>
  <SetupPhase>0</SetupPhase>
  <StartAsAdmin>false</StartAsAdmin>
  <StartAtWindowsStartup>false</StartAtWindowsStartup>
  <MinimizeToTray>true</MinimizeToTray>
  <CloseToTray>false</CloseToTray>
  <Language>System</Language>
  <Theme>System</Theme>
  <FrameGenerationCollapsed>false</FrameGenerationCollapsed>
  <CursorOptionsCollapsed>false</CursorOptionsCollapsed>
  <RenderingOptionsCollapsed>false</RenderingOptionsCollapsed>
  <CaptureOptionsCollapsed>false</CaptureOptionsCollapsed>
  <GpuDisplayOptionsCollapsed>false</GpuDisplayOptionsCollapsed>
  <CropInputOptionsCollapsed>false</CropInputOptionsCollapsed>
  <BehaviorCollapsed>false</BehaviorCollapsed>
  <LegacyOptionsCollapsed>false</LegacyOptionsCollapsed>
  <GameProfiles>
    <Profile>
      <Title>默认</Title>
      <AutoScale>false</AutoScale>
      <AutoScaleDelay>0</AutoScaleDelay>
      <ScalingMode>Auto</ScalingMode>
      <ScalingFitMode>AspectRatio</ScalingFitMode>
      <ScaleFactor>1.5</ScaleFactor>
      <ResizeBeforeScaling>false</ResizeBeforeScaling>
      <WindowedMode>false</WindowedMode>
      <ScalingType>Anime4K</ScalingType>
      <FSRType>ORIGINAL</FSRType>
      <LS1Type>BALANCED</LS1Type>
      <LSFG2Mode>X2</LSFG2Mode>
      <LSFG3Mode1>FIXED</LSFG3Mode1>
      <LSFG3Multiplier>3</LSFG3Multiplier>
      <LSFG3Target>75</LSFG3Target>
      <LSFGFlowScale>100</LSFGFlowScale>
      <LSFGSize>BALANCED</LSFGSize>
      <Anime4kType>S</Anime4kType>
      <Sharpness>5</Sharpness>
      <LS1Sharpness>1</LS1Sharpness>
      <VRS>true</VRS>
      <FrameGeneration>LSFG3</FrameGeneration>
      <ClipCursor>true</ClipCursor>
      <AdjustCursorSpeed>true</AdjustCursorSpeed>
      <HideCursor>false</HideCursor>
      <ScaleCursor>true</ScaleCursor>
      <SyncMode>DEFAULT</SyncMode>
      <MaxFrameLatency>3</MaxFrameLatency>
      <GsyncSupport>true</GsyncSupport>
      <HdrSupport>false</HdrSupport>
      <DrawFps>true</DrawFps>
      <CaptureApi>WGC</CaptureApi>
      <QueueTarget>1</QueueTarget>
      <PreferredGpuId>0</PreferredGpuId>
      <OutputDisplayId>0</OutputDisplayId>
      <CropInput>false</CropInput>
      <CropInputLeft>0</CropInputLeft>
      <CropInputTop>0</CropInputTop>
      <CropInputRight>0</CropInputRight>
      <CropInputBottom>0</CropInputBottom>
      <MultiDisplayMode>false</MultiDisplayMode>
    </Profile>
  </GameProfiles>
</Settings>
```