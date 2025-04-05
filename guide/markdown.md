---
sidebar_position: 5
---

# Markdown 基础样式

本页面将展示常用的 Markdown 基础样式，详情也可查看 **[此文档](https://markdown.com.cn/)**。

:::warning
本页面的部分内容虽然没有使用 React 组件，但也用到了 MDX 的特性，如 Html 标签内的 Markdown，因此无法当作普通 Markdown 文档。
:::

## Markdown 基础组件

### 字体样式

- **粗体**
- _斜体_
- **_粗斜体_**

### 链接

- [页面链接](http://github.com/)
- [路由链接](/blog/)
- [页面链接](writing/create-blog.md)
- [锚点链接](#markdown-基础组件)

### 图片

![author](/img/avatar.svg)

### 代码

```ts title="index.ts" {2} showLineNumbers
console.log("Hello");
console.log("代码可以高亮");
```

### Mermaid

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

### 引用

> 这是一篇引用
>
> > 这是引用中的引用
>
> -- 作者

### 提示块

:::note[笔记]
可以使用 [此 `api`](#)。
:::

:::tip[成功]
使用 [此 `api`](#) 成功。
:::

:::info[信息]
已使用 [此 `api`](#)。
:::

:::warning[警告]
[此 `api`](#) 已过时。
:::

:::danger[错误]
调用 [此 `api`](#) 发生错误。
:::

## Html 组件

### 折叠框

<details>
  <summary>折叠框</summary>

这些是被折叠的内容。

```ts
console.log("可以嵌套使用 Markdown 语法");
```

  <details>
    <summary>内部折叠框</summary>

喵~

  </details>
</details>

### 按键

记得 <kbd>Ctrl</kbd> + <kbd>S</kbd> 保存
