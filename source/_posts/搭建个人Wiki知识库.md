---
title: 搭建个人 Wiki 知识库
date: 2026-06-08 10:00:00
categories: [教程, 工具]
description: 基于 Hexo + NexT + GitHub Pages 搭建个人知识库的完整指南，涵盖环境配置、主题安装、自动部署及日常维护。
---

## 方案概述

本方案使用 Hexo 将 Markdown 文件编译为静态网页，通过 GitHub Pages 进行托管，并借助 GitHub Actions 实现 push 自动部署。

涉及的组件：

| 组件 | 说明 |
|------|------|
| Hexo | 基于 Node.js 的静态博客框架，负责将 Markdown 编译为静态站点 |
| NexT | Hexo 生态中使用最广泛的社区主题，提供多种方案和丰富的可配置项 |
| GitHub Pages | GitHub 提供的静态网站托管服务，无需自建服务器 |
| GitHub Actions | CI/CD 流水线，用于在代码推送到仓库后自动执行编译和部署 |

---

## 环境准备

### Node.js

Hexo 基于 Node.js，要求版本不低于 v18。执行以下命令确认已安装：

```bash
node --version
```

未安装时前往 [Node.js 官网](https://nodejs.org/) 下载 LTS 版本。

### Git

用于版本控制和远程推送。

```bash
git --version
```

未安装时前往 [Git 官网](https://git-scm.com/) 下载。

### GitHub 账号

用于代码托管和静态站点发布。如需在命令行中操作 GitHub，可安装 [GitHub CLI](https://cli.github.com/)（可选，不影响后续步骤）。

---

## 第一步：安装 Hexo

在终端（Windows 推荐 Git Bash 或 PowerShell，macOS/Linux 使用系统终端）中执行：

```bash
npm install -g hexo-cli
```

安装完成后验证：

```bash
hexo version
```

## 第二步：初始化项目

```bash
mkdir D:\wiki
cd D:\wiki
hexo init .
npm install
```

`hexo init .` 会在当前目录生成项目结构：

```text
wiki/
├── _config.yml          # 站点配置文件
├── source/
│   └── _posts/          # 文章目录
├── themes/              # 主题目录
├── scaffolds/           # 文章模板
├── package.json         # Node.js 依赖声明
└── node_modules/        # 已安装的依赖
```

## 第三步：安装 NexT 主题

NexT 是 Hexo 社区中安装量最高的主题，特点为功能完善、文档齐全、可配置程度高。

```bash
npm install hexo-theme-next
```

安装后修改 `_config.yml` 中的 `theme` 字段，将默认值 `landscape` 替换为 `next`：

```yaml
theme: next
```

## 第四步：配置站点信息

编辑项目根目录下的 `_config.yml`，重点修改以下字段：

```yaml
title: 个人学习 Wiki
subtitle: 日拱一卒，功不唐捐
description: 编程、AI、科学、人文 —— 个人学习知识库
author: 你的名称
language: zh-CN
timezone: 'Asia/Shanghai'
url: https://你的用户名.github.io/wiki
theme: next
```

`url` 字段填写最终部署地址，GitHub 仓库创建后即可确定。

## 第五步：配置 NexT 主题

NexT 的主题配置位于项目根目录下的 `_config.next.yml`。若该文件不存在，手动新建。

### Scheme 选择

NexT 提供四种方案，通过 `scheme` 字段切换：

| 方案 | 说明 |
|------|------|
| Muse | 无侧边栏，全宽布局 |
| Mist | 紧凑型侧边栏 |
| Pisces | 常规侧边栏，适合知识库 |
| Gemini | 大尺寸侧边栏 |

推荐 Pisces。基础配置：

```yaml
scheme: Pisces

darkmode: true

menu:
  home: / || fa fa-home
  categories: /categories/ || fa fa-th
  about: /about/ || fa fa-user

sidebar:
  position: left
  display: post

back2top:
  enable: true
  sidebar: false
  scrollpercent: false

codeblock:
  copy_button:
    enable: true
    show_result: true
    style: flat

excerpt_description: true
```

- `darkmode: true` — 启用暗黑模式切换
- `excerpt_description: true` — 首页使用 `description` 字段作为摘要，而非截取正文

## 第六步：本地预览

推送至远程仓库之前，先在本地启动服务验证效果：

```bash
hexo server
```

或简写为 `hexo s`。

默认访问地址为 `http://localhost:4000`。若端口被占用，Hexo 会自动切换到下一个可用端口，注意观察终端输出的实际地址。

`hexo server` 会持续监听文件变更，修改文章或配置后刷新浏览器即可查看更新，无需手动重启。

按 `Ctrl + C` 停止服务。

## 第七步：创建 GitHub 仓库

在 GitHub 上新建仓库，名称建议为 `wiki`（该名称将作为 URL 路径的一部分，如 `用户名.github.io/wiki`）。

仓库可见性需设为 **Public**，这是使用免费 GitHub Pages 的前提。

若已安装 GitHub CLI：

```bash
gh repo create 你的用户名/wiki --public --description "个人学习 wiki 知识库"
```

## 第八步：配置自动部署

每次手动执行编译和部署效率较低。GitHub Actions 可以将这一过程自动化：向 `main` 分支推送代码后，自动触发编译并部署至 `gh-pages` 分支。

在项目目录下创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy
on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci

      - run: npx hexo generate

      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          publish_branch: gh-pages
          force_orphan: true
```

工作流说明：

1. `actions/checkout@v4` — 检出仓库代码
2. `actions/setup-node@v4` — 配置 Node.js 环境
3. `npm ci` — 安装依赖
4. `npx hexo generate` — 编译生成静态文件至 `public/` 目录
5. `peaceiris/actions-gh-pages@v4` — 将 `public/` 目录推送至 `gh-pages` 分支

## 第九步：推送并启用 Pages

```bash
cd D:\wiki
git init
git checkout -b main
git add -A
git commit -m "初始化 wiki"
git remote add origin git@github.com:你的用户名/wiki.git
git push -u origin main
```

> 使用 `git@github.com:...` 格式的 SSH 地址需要先在 GitHub 中配置 SSH 公钥。也可使用 HTTPS 地址 `https://github.com/你的用户名/wiki.git`，首次推送时会提示登录。

推送完成后，进入 GitHub 仓库页面 → Settings → Pages，将 Source 设置为 `gh-pages` 分支。GitHub 将在数分钟内完成首次部署。

最终访问地址：`https://你的用户名.github.io/wiki`

此后每次向 `main` 分支推送代码，GitHub Actions 均会自动重新部署。

---

## 本地开发流程

### 日常写作

```bash
cd D:\wiki

# 1. 拉取远程更新（单人不需执行）
git pull

# 2. 创建新文章
hexo new "文章标题"

# 3. 文章生成于 source/_posts/ 目录，使用任意文本编辑器编辑

# 4. 本地预览
hexo server
# 浏览器访问 http://localhost:4000

# 5. 推送
git add -A
git commit -m "新增：文章标题"
git push
```

### 手动编译

若需查看编译产物或在离线状态下调试：

```bash
hexo clean       # 清除缓存与编译输出
hexo generate    # 重新编译至 public/ 目录
```

`hexo clean` 仅在配置变更未生效或编译异常时使用。日常预览使用 `hexo server` 即可，该命令已内置编译步骤。

---

## 文章编写规范

### 文件格式

所有文章置于 `source/_posts/` 目录，文件格式为 Markdown（`.md`）。

### Frontmatter

每篇文章以 YAML 格式的 Frontmatter 开头，定义元信息：

```yaml
---
title: 文章标题
date: 2026-06-08 12:00:00
categories: [一级分类, 子分类]
description: 文章概述，显示于首页标题下方，建议控制在两句话以内。
---
```

### description 字段

`description` 决定了首页文章卡片的概述文字。若省略此字段，Hexo 将自动截取正文头部内容作为摘要（通常效果不佳），因此建议每篇文章自行填写。

### 正文语法

支持标准 Markdown 语法：`#` 表示标题、三个反引号包裹代码块、`[文字](url)` 表示链接。

### 文章模板

`hexo new` 命令使用 `scaffolds/post.md` 作为模板生成文件。可编辑该模板，预设常用的 categories，减少重复填写。

---

## Windows 环境注意事项

- 终端推荐使用 **Git Bash** 或 **PowerShell**。
- 文件路径中的正斜杠 `/` 和反斜杠 `\` 均可使用，Hexo 内部统一处理。
- `node_modules/` 由 `.gitignore` 排除，不会被提交至仓库。
- 如 `hexo server` 启动异常，先执行 `hexo clean` 清空缓存后重试。

---

## 附录：使用 AI 搭建

以下提示语可供 AI 助手直接执行，用于重建或迁移本方案。

### 完整提示语

```
使用 Hexo + NexT 主题 + GitHub Pages 搭建个人 Wiki 知识库。

要求：
1. 本地目录 D:\wiki
2. GitHub 仓库：当前用户名/wiki
3. 主题方案：NexT Pisces
4. 启用暗黑模式、代码复制按钮、回到顶部按钮
5. 首页使用 description 字段显示文章摘要（关闭正文截取）
6. 导航栏仅保留首页、分类、关于
7. 配置 GitHub Actions：向 main 分支推送后自动编译并部署至 gh-pages
8. 生成分类页与关于页
9. 首篇文章为本搭建教程

执行步骤：
- 验证 Node.js 与 Git 环境
- npm install -g hexo-cli
- hexo init D:\wiki && npm install
- npm install hexo-theme-next
- 创建 _config.next.yml 并配置 Pisces 方案
- 修改 _config.yml 中的站点信息与 url
- gh repo create 创建仓库
- 配置 .github/workflows/deploy.yml
- git push 并确认线上访问正常
```

### 简化提示语

```
使用 Hexo + NexT + GitHub Pages 搭建 Wiki，本地目录 D:\wiki，仓库名称 wiki，启用暗黑模式。
```

---

## 参考链接

- [Hexo 官方文档](https://hexo.io/docs/)
- [NexT 主题文档](https://theme-next.js.org/)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
