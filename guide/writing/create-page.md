---
sidebar_position: 1
description: 创建页面引导
---

# 创建页面

在 `src/pages` 创建 **Markdown** 或 **React** 文件捡回自动生成**单页面**：

- `src/pages/index.tsx` → `/`
- `src/pages/foo.md` → `/foo`
- `src/pages/foo/bar.tsx` → `/foo/bar`

## 创建 React 页面

创建以下文件:

```tsx title="src/pages/react-page.tsx" showLineNumbers
import Layout from "@theme/Layout";

export default function MyReactPage() {
  return (
    <Layout>
      <h1>React 页面</h1>
      <p>这是一个 React 页面，可以使用常规 Jsx 开发页面。</p>
    </Layout>
  );
}
```

新页面将于 [http://localhost:3000/react-page](http://localhost:3000/react-page) 可用。

## 创建 Markdown 页面

创建以下文件:

```mdx title="src/pages/markdown-page.mdx" showLineNumbers
# Markdown 页面

export const MdxIcon = () => <span style={{ color: "#f3b100" }}>M ↓ X</span>;

这是一个 Markdown 页面，可以使用常规 Mdx 开发页面。

Powered by <MdxIcon/>
```

新页面将于 [http://localhost:3000/markdown-page](http://localhost:3000/markdown-page) 可用。
