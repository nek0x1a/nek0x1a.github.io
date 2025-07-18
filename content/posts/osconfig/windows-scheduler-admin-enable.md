---
title: 使用 Windows 计划任务配置管理员启动项
date: 2022-05-03
modified: 2025-07-16
categories: [系统配置]
collections: [windows 设置]
tags: [Windows, 设置]
---

UAC 能在应用在访问关键位置时弹出提示提醒用户，但同时对于一些可信应用，UAC 提示又变成了用户的打扰因素，特别是这些应用需要自启时，开机的提示框会带给使用者及其不好的使用感受。

对于这些应用，可以使用计划任务来自启，以消除 UAC 弹窗。

<!--more-->

## 配置

使用命令 `taskschd.msc` 可以打开计划任务库。右键 *任务计划程序库* 增加文件夹用于放置自启条目，如 `AutoRun`。

新建计划任务：

- 常规
  - 名称：易于分辨就行
  - 安全选项：
    - 用户：使用当前用户
    - 只在用户登陆时运行：点选
    - 使用最高权限运行： 勾选
- 触发器：
  - 开始任务：登陆时
  - 特定用户：当前用户
  - 已启用：勾选
- 操作：新建
  - 启动程序：需要自启的程序

![常规](https://assets.eroneko.eu.org/blog/osconfig/windows-scheduler-admin-enable-01.webp)
![触发器](https://assets.eroneko.eu.org/blog/osconfig/windows-scheduler-admin-enable-02.webp)
![操作](https://assets.eroneko.eu.org/blog/osconfig/windows-scheduler-admin-enable-03.webp)
![条件](https://assets.eroneko.eu.org/blog/osconfig/windows-scheduler-admin-enable-04.webp)
![设置](https://assets.eroneko.eu.org/blog/osconfig/windows-scheduler-admin-enable-05.webp)

创建完成后可导出便于今后使用，这是一份示例配置，所需参数使用 `${}` 包裹，可修改后导入：

```xml {title="计划任务配置示例"}
<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.4" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Date>2025-01-01T00:00:00.0000000</Date>
    <Author>${Hostname}\${User}</Author>
    <URI>\AutoRun\${TaskName}</URI>
  </RegistrationInfo>
  <Triggers>
    <LogonTrigger>
      <Enabled>true</Enabled>
      <UserId>${Hostname}\${User}</UserId>
    </LogonTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author">
      <UserId>${UserID}</UserId>
      <LogonType>InteractiveToken</LogonType>
      <RunLevel>HighestAvailable</RunLevel>
    </Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>true</StopIfGoingOnBatteries>
    <AllowHardTerminate>true</AllowHardTerminate>
    <StartWhenAvailable>false</StartWhenAvailable>
    <RunOnlyIfNetworkAvailable>false</RunOnlyIfNetworkAvailable>
    <IdleSettings>
      <StopOnIdleEnd>true</StopOnIdleEnd>
      <RestartOnIdle>false</RestartOnIdle>
    </IdleSettings>
    <AllowStartOnDemand>true</AllowStartOnDemand>
    <Enabled>true</Enabled>
    <Hidden>false</Hidden>
    <RunOnlyIfIdle>false</RunOnlyIfIdle>
    <DisallowStartOnRemoteAppSession>false</DisallowStartOnRemoteAppSession>
    <UseUnifiedSchedulingEngine>true</UseUnifiedSchedulingEngine>
    <WakeToRun>false</WakeToRun>
    <ExecutionTimeLimit>PT0S</ExecutionTimeLimit>
    <Priority>7</Priority>
  </Settings>
  <Actions Context="Author">
    <Exec>
      <Command>${AppPath}</Command>
    </Exec>
  </Actions>
</Task>
```
