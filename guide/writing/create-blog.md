---
sidebar_position: 3
description: 创建博客引导
---

# 创建博客

博客目录默认为 `blog`，可以通过修改预配置方案或插件配置来修改或增加。

Docusaurus 为每篇博客文章创建一个**页面**，
同时还创建一个**博客索引页**、一个**标签系统**、一个**RSS**提要等。

## 作者

作者信息使用以下文件进行定义：

```yaml blog/authors.yml showLineNumbers
neko: # 作者 id
  name: Neko # 作者名
  title: 猫 # 作者职位
  url: https://github.com/nek0x1a # 作者主页
  image_url: /img/avatar.svg # 作者头像
  page: true # 作者页面
  socials: # 社交链接
    github: nek0x1a
```

## 标签

标签信息使用以下文件进行定义：

```yaml blog/tags.yml showLineNumbers
blog: # 标签 id
  label: 博客 # 标签名
  permalink: /blog # 标签页面
  description: 博客相关 # 标签描述
```

## 创建博客文章

创建以下文件:

```md title="blog/2025-01-01-greetings.md" showLineNumbers
---
slug: greetings
title: 你好，Docusaurus！
authors: neko
tags:
  - blog
---

这是第一篇博客文章。

<!-- truncate -->

Powered by Docusaurus
```

新页面将于 [http://localhost:3000/blog/greetings](http://localhost:3000/blog/greetings) 可用。

## 元数据

可以在文章的 front matter 区域内添加一些元数据：

```yaml showLineNumbers
slug: greetings # uri
title: 你好，Docusaurus！ # 标题
authors: neko # 作者 id / 作者对象
date: 2025-01-01T00:00 # 发布日期，覆盖从文件名获取的日期
tags: # 标签 id 列表
  - blog
```
