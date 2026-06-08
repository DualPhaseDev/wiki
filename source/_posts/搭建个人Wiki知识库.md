---
title: 搭建个人 Wiki 知识库
date: 2026-06-08 10:00:00
categories: [教程, 工具]
tags: [wiki, hexo, github-pages, 知识库, 部署]
description: 从零搭建在线知识库：Hexo + NexT 主题 + GitHub Pages，含人工搭建步骤、本地开发流程和 AI 搭建提示。
---

## 这套方案是什么

简单来说，就是用 Hexo 把 Markdown 文件生成静态网页，推送到 GitHub 上，通过 GitHub Pages 免费托管。

你只需要在本地写 Markdown 文章，一条 `git push` 命令，网站就自动更新了。不需要买服务器，也不需要自己维护。

工具清单：

| 工具 | 作用 |
|------|------|
| Hexo | 博客框架，把 Markdown 编译成静态网页 |
| NexT | Hexo 的主题皮肤，负责网站的样式和布局 |
| GitHub Pages | 免费托管静态网站，不需要服务器 |
| GitHub Actions | 自动化流水线，push 代码后自动帮你编译部署 |

## 环境准备

开始之前，先确认电脑上装好了下面这几样：

**Node.js** — Hexo 的运行环境，建议 v18 以上。

```bash
node --version
```

如果没装，去 [Node.js 官网](https://nodejs.org/) 下载 LTS 版本安装。

**Git** — 版本控制和推送代码的工具。

```bash
git --version
```

没装的话去 [Git 官网](https://git-scm.com/) 下载。

**GitHub 账号** — 用来托管代码和网站。如果你还想在命令行操作 GitHub，可以装 [GitHub CLI](https://cli.github.com/)（可选，不装也可以用浏览器操作）。

---

## 第一步：安装 Hexo

打开终端（Windows 用 Git Bash 或 PowerShell，macOS 用终端），执行：

```bash
npm install -g hexo-cli
```

这条命令会在全局安装 `hexo` 命令。装完之后可以验证一下：

```bash
hexo version
```

## 第二步：创建项目

找个放项目的位置，比如 `D:\wiki`。然后：

```bash
mkdir D:\wiki           # 创建目录
cd D:\wiki              # 进入目录
hexo init .             # 初始化 Hexo 项目
npm install             # 安装依赖包
```

`hexo init .` 会自动生成一套默认的项目结构：

```text
wiki/
├── _config.yml          # 站点配置文件
├── source/
│   └── _posts/          # 文章放这里
├── themes/              # 主题目录
├── scaffolds/           # 文章模板
├── package.json         # Node.js 依赖
└── node_modules/        # 安装的依赖包
```

## 第三步：安装 NexT 主题

NexT 是目前 Hexo 生态里使用最广的主题，稳定、文档全、可配置项多。

```bash
npm install hexo-theme-next
```

装完之后修改站点配置文件 `_config.yml`，把主题从默认的 `landscape` 换成 `next`：

```yaml
theme: next
```

## 第四步：配置站点

打开项目根目录的 `_config.yml`，修改以下几个关键字段：

```yaml
# 站点名称和描述（这两行会出现在网站头部）
title: 个人学习 Wiki
subtitle: 日拱一卒，功不唐捐
description: 编程、AI、科学、人文 —— 个人学习知识库

# 作者名
author: 你的名字

# 语言设为中文
language: zh-CN

# 时区
timezone: 'Asia/Shanghai'

# 网站地址（等仓库建好后再填真实地址）
url: https://你的用户名.github.io/wiki

# 主题
theme: next
```

## 第五步：配置 NexT 主题

NexT 的主题配置放在项目根目录的 `_config.next.yml` 文件中。如果这个文件还不存在，手动新建一个。

NexT 提供了四套方案（Scheme），你可以在这四者之间切换：

| 方案 | 特点 |
|------|------|
| Muse | 无侧边栏，全宽布局，最极简 |
| Mist | 紧凑型侧边栏，文字为主 |
| Pisces | 干净清爽的侧边栏，适合做知识库 |
| Gemini | 更大的侧边栏，偏展示型 |

推荐用 Pisces。基础配置如下：

```yaml
scheme: Pisces

darkmode: true             # 允许访客切换到暗黑模式

menu:                      # 导航菜单
  home: / || fa fa-home
  categories: /categories/ || fa fa-th
  about: /about/ || fa fa-user

sidebar:                   # 侧边栏
  position: left
  display: post

back2top:                  # 回到顶部按钮
  enable: true
  sidebar: false
  scrollpercent: false

codeblock:                 # 代码块设置
  copy_button:
    enable: true
    show_result: true
    style: flat

excerpt_description: true  # 首页显示文章描述而非正文截取
```

## 第六步：本地预览

在推送之前，先本地跑起来看看效果：

```bash
hexo server
```

或者简写为：

```bash
hexo s
```

浏览器打开 `http://localhost:4000`，就能看到网站了。如果终端没报错但浏览器打不开，检查一下 `hexo s` 输出里显示的端口号（不一定是 4000，被占用的话会自动换端口）。

`hexo server` 会监听文件变化，你改了文章或配置后刷新浏览器就能看到最新效果，不需要重启。

按 `Ctrl + C` 可以停掉本地服务器。

## 第七步：创建 GitHub 仓库

登录 GitHub，新建一个仓库。仓库名建议就叫 `wiki`（这个名称会出现在网址里，比如 `用户名.github.io/wiki`）。

仓库类型选 Public（公开），这是免费使用 GitHub Pages 的前提。

如果你装了 GitHub CLI，可以在终端一条命令搞定：

```bash
gh repo create 你的用户名/wiki --public --description "个人学习 wiki 知识库"
```

## 第八步：配置 GitHub Actions 自动部署

每次手动编译再部署太麻烦了。GitHub Actions 可以做到：你往 main 分支 push 代码，它自动帮你编译并发布到 gh-pages 分支。

在项目里创建 `.github/workflows/deploy.yml`：

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

这里的逻辑很简单：检出代码 → 安装依赖 → 执行 `hexo generate` 编译 → 把 `public/` 目录推到 `gh-pages` 分支。

## 第九步：推送代码并启用 Pages

```bash
cd D:\wiki
git init
git checkout -b main
git add -A
git commit -m "初始化 wiki"
git remote add origin git@github.com:你的用户名/wiki.git
git push -u origin main
```

如果用的是 `git@github.com:...` 这种 SSH 地址，需要先在 GitHub 设置里配好 SSH 公钥。不想折腾可以用 HTTPS 地址：`https://github.com/你的用户名/wiki.git`，push 的时候会弹框让你登录。

推送之后，去 GitHub 仓库页面 → Settings → Pages，把 Source 选为 `gh-pages` 分支。等一两分钟，网站就上线了。

访问地址：`https://你的用户名.github.io/wiki`

以后每次 push 代码，GitHub Actions 都会自动重新部署，你在浏览器里直接看就行。

---

## 本地开发完整流程

### 常规操作

每天写文章的流程就这几步：

```bash
cd D:\wiki

# 1. 拉取最新代码（多人协作时需要，一个人用可跳过）
git pull

# 2. 创建新文章
hexo new "文章标题"

# 3. 文章会生成在 source/_posts/ 目录下，用任意编辑器打开编辑
#    写完后保存

# 4. 本地预览
hexo server
# 浏览器打开 http://localhost:4000 看效果

# 5. 满意了就推上去
git add -A
git commit -m "新增：文章标题"
git push
```

### 手动编译（不推送时）

如果想看编译产物，或在没有网络的时候调试：

```bash
hexo clean        # 清除缓存和已编译文件
hexo generate     # 重新生成静态文件到 public/ 目录
```

`hexo clean` 不是每次都需要的，只有当你改了配置但刷新没生效、或者编译出错的时候用一下。

`hexo server` 本身也包含编译步骤，所以日常写文章直接 `hexo s` 预览就够了，不需要手动 generate。

### 手动部署

正常情况下 GitHub Actions 会自动部署，但如果你想手动推送 gh-pages：

```bash
hexo deploy
```

要使用这个命令，需要先在 `_config.yml` 里配置 deploy 参数。不过既然有了 GitHub Actions，一般不需要手动执行这个。

---

## 写文章的规范

### 文件存放

所有文章都在 `source/_posts/` 目录下，`.md` 格式。

### Frontmatter

每篇文章顶部的 YAML 区域叫 frontmatter，用来定义文章元信息。一个完整的示例：

```yaml
---
title: 文章标题
date: 2026-06-08 12:00:00
categories: [分类1, 子分类2]
tags: [标签1, 标签2, 标签3]
description: 这里写文章的概述，会出现在首页标题下方，一两句话就好。
---
```

### description 的作用

`description` 字段就是首页标题下面显示的那行概述文字。不写的话，Hexo 会自动截取正文前几行，但效果不好，建议每篇都自己写。

### 正文用 Markdown

Hexo 支持标准 Markdown 语法。标题用 `#`，代码块用三个反引号，链接用 `[文字](url)`。写法和 GitHub 的 README 一样，没什么特殊的。

### 新建文章命令

```bash
hexo new "你的标题"
```

这个命令用的是 `scaffolds/post.md` 里的模板来生成文件。你可以修改这个模板，让每次新建文章都自动带上你常用的 categories 或 tags。

---

## Windows 上的一些注意事项

- 终端推荐用 **Git Bash** 或 **PowerShell**，`hexo` 命令在这两种环境下都能正常跑。
- 路径分隔符用反斜杠 `\` 还是斜杠 `/` 都可以，Hexo 内部会处理好。
- `node_modules` 目录很大，`.gitignore` 里已经排除了，不用担心被提交到仓库。
- 如果 `hexo server` 启动报错，先跑一次 `hexo clean` 清缓存试试。

---

## 附：让 AI 帮你搭建

如果以后换了电脑或者想重新搭一套，把下面这段话发给 AI 助手就行。

### 详细版

```
帮我用 Hexo + NexT 主题 + GitHub Pages 搭建个人 wiki 知识库。

要求：
1. 本地目录 D:\wiki
2. GitHub 仓库：我的用户名/wiki
3. 主题用 NexT 的 Pisces 方案
4. 配置好暗黑模式、代码复制按钮、回到顶部
5. 首页用 description 字段显示文章概述，不要截取正文
6. 导航栏只保留：首页、分类、关于
7. 配置 GitHub Actions：push main 自动部署到 gh-pages
8. 生成标签页、分类页、关于页
9. 写一篇详细的教程文章作为首篇内容

执行步骤：
- 检查 Node.js 和 Git 环境
- npm install -g hexo-cli
- hexo init D:\wiki && npm install
- npm install hexo-theme-next
- 创建 _config.next.yml 并配置 Pisces 方案
- 修改 _config.yml 的站点信息和 url
- gh repo create + 配置 .github/workflows/deploy.yml
- git push 并验证网站上线
- 告诉我访问地址
```

### 简化版

```
帮我用 Hexo + NexT + GitHub Pages 搭 wiki，本地 D:\wiki，仓库 wiki，暗黑模式。
```

---

## 参考链接

- [Hexo 官方文档](https://hexo.io/docs/)
- [NexT 主题文档](https://theme-next.js.org/)
- [GitHub Pages 帮助](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
