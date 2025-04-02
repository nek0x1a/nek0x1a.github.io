---
sidebar_position: 1
description: Docusaurus 安装文档
---

# 开始使用 Docusaurus

这里是文档库，将会介绍 Docusaurus 的使用。

## 开始使用

根据此文档创建新站点或通过 **[docusaurus.new](https://docusaurus.new)** 试用 **Docusaurus**

### 前提条件

- [Node.js](https://nodejs.org/): v18.0 及以上

本文档以 `yarn` 作为示例。

## 创建新站点

### 使用模板

克隆本项目可直接作为模板使用：

```bash
git clone -b template --depth 1 https://github.com/nek0x1a/nek0x1a.github.io.git website
cd website
git checkout -b main
```

链接自己的仓库地址：

```bash
git remote set-url origin ${自己的仓库地址}
git push --set-upstream origin main
```

需要安装依赖：

```bash
yarn install
```

### 使用官方 Cli 创建

使用**经典模板**生成新的 Docusaurus 站点。

使用以下命令将会在 `website` 目录创建经典模板：

```bash
npx create-docusaurus@latest website classic --typescript
cd website
```

此命令将会一并使用 `npm` 安装依赖。

## 启动站点

运行以下命令启动开发服务器：

```bash
yarn start
```

执行命令前需要进入站点 `website` 目录。

本命令会在本地构建网站并通过开发服务器提供服务，可以在 `http://localhost:3000/` 上查看。

## 文件结构

站点创建好之后项目结构大致如下，在之后的章节将会详细介绍常用的文件和配置项。

```
website
├── blog
│   ├── 2025-01-01-hello-world.md
├── docs
│   ├── doc1.md
├── src
│   ├── css
│   │   └── custom.css
│   └── pages
│       ├── styles.module.css
│       └── index.js
├── static
│   └── img
│       └── favicon.ico
├── docusaurus.config.js
├── package.json
├── README.md
└── sidebars.js
```
