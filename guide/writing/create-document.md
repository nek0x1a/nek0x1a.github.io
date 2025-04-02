---
sidebar_position: 2
description: 创建文档引导
---

# 创建文档

文档目录默认为 `docs`，可以通过修改预配置方案或插件配置来修改或增加。

文档由 **多组页面** 组成，他们通过以下方式进行链接：

- 侧边栏
- 前进/后退导航
- 版本控制

可以选用 `md` 或 `mdx` 文件进行编写。

## 创建第一个文档

创建以下文件:

```md title="docs/hello.md"
# 你好，世界

这是站点的第一个文档。
```

新页面将于 [http://localhost:3000/docs/hello](http://localhost:3000/docs/hello) 可用。

## 配置侧边栏

Docusaurus 默认会从 `doc/` 中创建自动侧边栏。

在文档中添加元数据可以自定义显示标题和侧边栏位置

```md title="docs/hello.md" {1-4} showLineNumbers
---
sidebar_label: 你好，世界
sidebar_position: 3
---

# 你好，世界

这是站点的第一个文档。
```

也可以手动创建侧边栏：

```js title="sidebars.js" {4} showLineNumbers
export default {
  tutorialSidebar: [
    "doc1",
    "hello",
    {
      type: "category",
      label: "doc2",
      items: ["category1/doc2"],
    },
  ],
};
```

将会自动查找与字符串同名的 `md` 或 `mdx` 文件进行解析。

## 目录

创建以下文件:

```md title="docs/category/_category_.json" showLineNumbers
{
"label": "目录名",
"position": 3,
"link": {
"type": "generated-index",
"description": "目录 1"
}
}
```

```md title="docs/category/doc2.md" showLineNumbers
---
sidebar_position: 1
description: 在目录中显示的描述
---

# 又一个文档

这是站点的又一个文档。
```

目录选项中使用 `"type": "generated-index"` 将会自动生成目录页面。
