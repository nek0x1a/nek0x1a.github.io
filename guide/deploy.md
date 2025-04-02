---
sidebar_position: 4
description: 静态部署引导
---

# 部署

Docusaurus 本身是一个**静态站点生成工具**。
它会将工程文件编译成静态的 **HTML**、**JavaScript** 和 **CSS** 文件。

## 编译

确认 `docusaurus.config.ts` 中以下项目配置正确：

- config.url
- config.baseUrl

使用以下命令进行编译：

```bash
# 清理之前的构建文件
yarn clear
# 构建
yarn build
```

这将会在 `build` 文件夹下生成静态文件。

使用以下命令可以在本地测试编译成果：

```bash
yarn serve
```

站点将于 [http://localhost:3000/](http://localhost:3000/) 可用。

## 部署站点

把 `build` 部署在任意服务即可。
详细部署方式请查看 **[官方文档](https://docusaurus.io/docs/deployment)**。

### Github Pages

先确认 `docusaurus.config.ts` 中以下项目配置正确：

- config.organizationName
- config.projectName
- config.deploymentBranch

#### Github Actions

本模板已内置 GitHub Actions 帮助部署。

`.github/workflows/` 下有 `deploy.yml` 和 `test-deploy.yml` 两个文件：

- deploy: 当向 main 发出新的拉取请求时，可以确保站点成功构建，而无需实际部署。
- test-deploy: 当拉取请求合并到主分支或直接推送到 main 分支时，main 分支将被构建并部署到 GitHub Pages。

在 github 仓库设置中改变 `Actions` - `General` - `Workflow permissions` 的权限为 `Read and write permissions`，以确保 Action 有足够的权限。

合并 main 分支或向其直接推送后，页面将会自动部署。
之后在 github 仓库设置中改变 `Pages` - `Build and deployment` 为 `Github Actions`，
这样就能够让项目的 Github Action 自动化部署页面。
然后到 Actions 页面检查是否有 `pages build and deployment` 这个 github 自带的 Action，
将它们全部删除。

#### 使用 Cli 部署

仓库的分支用途：

- main: 原始工程
- gh-pages: 部署分支

使用以下命令通过 Docusaurus 部署至配置文件中 `config.deploymentBranch` 指定仓库的指定分支：

```bash
yarn deploy
```

之后在 github 仓库设置中改变 `Pages` - `Build and deployment` 为 `Deploy from a branch`，
并选择 `config.deploymentBranch` 所指定的分支。
