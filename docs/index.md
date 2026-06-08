# 🏠 搭建个人 Wiki 知识库

使用 **MkDocs + Material 主题 + GitHub Pages** 搭建属于自己的在线知识库。

## 架构一览

```mermaid
graph LR
    A[本地 D:\wiki] -->|git push| B[GitHub 仓库]
    B -->|GitHub Actions| C[GitHub Pages]
    C -->|浏览器访问| D[DualPhaseDev.github.io/wiki]
```

- 本地写 Markdown → `git push` 到 GitHub
- GitHub Actions 自动构建并部署到 GitHub Pages
- 一个漂亮的文档网站就上线了 🎉

---

## 第一部分：人工搭建详细流程

### 前置条件

- Python 3.8+
- Git
- GitHub 账号

### 第 1 步：安装 MkDocs 和 Material 主题

```bash
pip install mkdocs mkdocs-material
```

### 第 2 步：创建目录结构

```bash
mkdir D:\wiki
cd D:\wiki
mkdir docs
```

### 第 3 步：配置 mkdocs.yml

在 `D:\wiki\mkdocs.yml` 创建配置文件：

```yaml
site_name: 个人学习 Wiki
site_url: https://你的用户名.github.io/wiki
repo_url: https://github.com/你的用户名/wiki

theme:
  name: material
  language: zh
  palette:
    - scheme: default
      primary: indigo
      toggle:
        icon: material/weather-night
        name: 暗黑模式
    - scheme: slate
      primary: indigo
      toggle:
        icon: material/weather-sunny
        name: 浅色模式
  features:
    - navigation.instant
    - navigation.top
    - search.suggest
    - search.highlight
    - content.code.copy

plugins:
  - search

markdown_extensions:
  - admonition
  - pymdownx.details
  - pymdownx.superfences
  - pymdownx.highlight
  - pymdownx.emoji
```

### 第 4 步：在 GitHub 创建仓库

```bash
gh repo create 你的用户名/wiki --public --description "个人学习 wiki 知识库"
```

`--public` 是为了能用免费的 GitHub Pages。如果想私密，需要 GitHub Pro（免费用户也有 Private Pages 了，但建议 public 省心）。

### 第 5 步：配置 GitHub Actions 自动部署

创建 `.github/workflows/deploy.yml`：

```yaml
name: deploy
on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.x'
      - run: pip install mkdocs-material
      - run: mkdocs build
      - run: mkdocs gh-deploy --force
```

### 第 6 步：推送并上线

```bash
git init
git add .
git commit -m "init wiki"
git remote add origin git@github.com:你的用户名/wiki.git
git push -u origin main
```

推送后 GitHub Actions 自动运行，1-2 分钟后访问 `https://你的用户名.github.io/wiki` 就能看到了！

### 第 7 步：设置 Pages 源

去 GitHub 仓库 → Settings → Pages → Source 选 `gh-pages` 分支。

---

## 第二部分：AI 搭建提示语

如果你想让 AI 助手帮你一步到位搭建，用以下提示语：

### 完整提示语

```
帮我搭建一个个人 wiki 知识库，要求：

1. 使用 MkDocs + Material 主题 + GitHub Pages
2. 本地目录放在 {你的目录}，GitHub 仓库名为 {你的用户名}/wiki
3. 配置好自动部署：push 到 main 分支后自动构建发布
4. 支持暗黑模式切换、搜索、代码高亮
5. mkdocs.yml 中 site_url 设为 https://{你的用户名}.github.io/wiki
6. 写一篇首页文档，介绍这套方案的架构和使用方法

请按以下步骤执行：
- 安装 mkdocs-material
- 创建目录和 mkdocs.yml 配置
- 用 gh 命令创建 GitHub 仓库
- 配置 .github/workflows/deploy.yml
- 初始化 git 并推送
- 告诉我访问地址
```

### 简化版（如果 AI 已经了解这技术栈）

```
帮我用 MkDocs Material + GitHub Pages 搭一个 wiki，仓库叫 wiki，本地放 D:\wiki
```

### 提示语要点

1. **指明技术栈** — MkDocs + Material + GitHub Pages
2. **指定路径** — 本地放哪、GitHub 仓库名
3. **明确部署方式** — GitHub Actions 自动部署
4. **要求完整交付** — 能直接访问到网站

---

## 日常使用

### 添加新文章

```bash
# 在 D:\wiki\docs 下新建 .md 文件
# 编辑 mkdocs.yml 的 nav 添加导航
mkdocs serve   # 本地预览 http://localhost:8000
git add . && git commit -m "new article" && git push
# 自动部署
```

### 本地预览

```bash
mkdocs serve
# 浏览器打开 http://localhost:8000
```

### 链接文档

```markdown
[另一篇文档](other-page.md)
```

---

## 相关参考

- [MkDocs 官方文档](https://www.mkdocs.org/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
