---
sidebar_position: 1
description: Docusaurus 常用配置项
---

# 配置文件

Dcusaurus 的主配置文件是 `docusaurus.config.ts`。

通过一个 Config 类型将配置文件传入，接下来将根据功能介绍配置项。

## 站点信息

- `title`: 站点标题，将会以 “|” 分隔显示在页面标题的后方
- `tagline`: 站点标语
- `favicon`: 站点图标
- `url`: 站点生产环境 url 地址
- `baseUrl`: 站点根目录所在所在的路径，如果站点并非直接部署在域名下，则需要设置

## 部署相关

- `organizationName`: GitHub 组织名/用户名
- `projectName`: GitHub 仓库名
- `deploymentBranch`: 部署的目标 Branch

## 写作质量相关

- `onBrokenLinks`: 当检测到错误的链接时报错或警告
- `onBrokenMarkdownLinks`: 当检测到错误的 Markdown 链接时报错或警告

## `i18n`

国际化相关设置。

- `defaultLocale`: 默认语言
- `locales`: 提供的语言

## `markdown`

解析 Markdown 相关设置。

默认情况下，由于历史原因，Docusaurus v3 对所有文件（包括 .md 文件）都使用 MDX 格式。

- `format`: 默认解析格式

## `presets`

预配置方案，通过 `[<方案名>, <方案对象>]` 的数组形式进行配置，可配置多种方案。

### 方案对象

#### `docs`

文档模块配置。

- `id`: 文档插件 id
- `sidebarPath`: 文档模块中侧边栏的内容样式

#### `blog`

博客模块配置。

- `id`: 博客插件 id
- `showReadingTime`: 显示阅读时间
- `blogSidebarTitle`: 侧边栏标题
- `feedOptions`: rss 配置
  - `type`: 类型
  - `xslt`: 是否开启 xslt
- `onInlineTags`: 对行内标签提供警告或报错
- `onInlineAuthors`: 对行内作者提供警告或报错
- `onUntruncatedBlogPosts`: 对行未截断的文章提供警告或报错

#### `plugins`

除预配置方案外，如需增加文档、博客或其他内容，则需要在此处配置。
以数组形式接收 `[<插件名>, <插件配置对象>]`。

##### @docusaurus/plugin-content-docs

同 `docs` 预配置方案，全部配置请查看 **[官方文档](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs)**。

- `id`: 插件 id
- `path`: 文件位置
- `routeBasePath`: 路由路径
- `sidebarPath`: 侧边栏 id

##### @docusaurus/plugin-content-docs

同 `blog` 预配置方案，全部配置请查看 **[官方文档](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-blog)**。

- `id`: 博客插件 id
- `showReadingTime`: 显示阅读时间
- `blogSidebarTitle`: 侧边栏标题
- `feedOptions`: rss 配置
  - `type`: 类型
  - `xslt`: 是否开启 xslt

#### `theme`

自定义主题配置。

- `customCss`: 自定义 Css 路径

## `themeConfig`

主题配置。

### `navbar`

导航栏配置。

- `title`: 标题文字
- `logo`: logo 图片
- `items`: 导航栏内容，以 `NavbarItem` 数组形式提供

#### NavbarItem

NavbarItem 可分为三种形式。

组件形式：

- `type`: 类型
- `sidebarId`: 侧边栏 id
- `position`: 位置
- `label`: 显示内容

导航形式：

- `to`: 导航 uri
- `position`: 位置
- `label`: 显示内容

链接形式：

- `href`: 链接 url
- `position`: 位置
- `label`: 显示内容

### `footer`

页脚配置。

- `style`: 样式
- `copyright`: 版权栏

### `prism`

代码高亮主题。

- `theme`: 浅色主题
- `darkTheme`: 深色主题
