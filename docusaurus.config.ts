import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

// 这些将在 Node.js 中运行
// 此处不要使用客户端代码 (浏览器 API, JSX ...)

const config: Config = {
  title: "猫的笔记本",
  tagline: "这是猫的笔记本",
  favicon: "img/favicon.ico",

  // 设置生产环境地址
  url: "https://nek0x1a.github.io",
  // 设置站点根目录所在所在的路径
  // 对于 GitHub pages 部署，通常为 "/<projectName>/"
  baseUrl: "/",
  // GitHub Pages 默认为 Docusaurus URL 添加尾部斜杠。
  // 建议设置此项不为 undefined
  trailingSlash: true,

  // GitHub pages 部署设置
  // 如果不使用 GitHub pages，则不需要这部分
  // GitHub 组织名/用户名
  organizationName: "nek0x1a",
  // GitHub 仓库名
  projectName: "nek0x1a.github.io",
  // 部署的 Branch
  // deploymentBranch: "gh-pages",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // 即使您不使用国际化，也可以使用此字段设置有用的元数据，例如 html 中的 lang
  // 如果网站是中文的，此处应设置 "cmn-Hans-CN"
  i18n: {
    defaultLocale: "cmn-Hans-CN",
    locales: ["cmn-Hans-CN"],
  },

  markdown: {
    // format: "detect",
    mermaid: true,
  },

  themes: ["@docusaurus/theme-mermaid"],

  presets: [
    [
      "classic",
      {
        docs: {
          id: "default",
          sidebarPath: "./sidebars.ts",
        },
        blog: {
          id: "default",
          showReadingTime: true,
          blogSidebarTitle: "最近文章",
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [["./src/plugins/tailwind-config.js", {}]],

  themeConfig: {
    navbar: {
      title: "猫的笔记本",
      logo: {
        alt: "SiteLogo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          docsPluginId: "default",
          sidebarId: "docSidebar",
          position: "left",
          label: "文档",
        },
        { to: "/blog", position: "left", label: "博客" },
        {
          href: "https://github.com/nek0x1a",
          position: "right",
          label: "GitHub",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()} nek0x1a | 猫 ♥ 喵`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "powershell"],
    },
    mermaid: {
      theme: { light: "neutral", dark: "dark" },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
