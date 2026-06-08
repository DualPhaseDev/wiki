---
title: 搭建个人 Wiki 知识库
date: 2026-06-08 10:00:00
categories: [教程, 工具]
tags: [wiki, hexo, github-pages, 知识库, mkdocs, 部署]
---

## 方案概述

使用 **Hexo + NexT 主题 + GitHub Pages** 搭建个人学习知识库。

### 架构

```text
本地 D:\wiki (Markdown) → git push → GitHub Actions → DualPhaseDev.github.io/wiki
```

---

## 第一部分：人工搭建流程

### 前置条件

- Node.js (v24+)
- Git
- GitHub 账号

### 步骤 1：安装 Hexo

```bash
npm install -g hexo-cli
```

### 步骤 2：初始化项目

```bash
mkdir D:\wiki
cd D:\wiki
hexo init .
npm install
```

### 步骤 3：安装 NexT 主题

```bash
npm install hexo-theme-next
```

### 步骤 4：配置 `_config.yml`

```yaml
title: 个人学习 Wiki
subtitle: 日拱一卒，功不唐捐
url: https://你的用户名.github.io/wiki
language: zh-CN
theme: next
```

### 步骤 5：配置 `_config.next.yml`

```yaml
scheme: Pisces       # Muse/Mist/Pisces/Gemini 四选一
darkmode: true       # 暗黑模式
back2top: true       # 回到顶部
```

### 步骤 6：在 GitHub 创建仓库

```bash
gh repo create 你的用户名/wiki --public
```

### 步骤 7：配置 GitHub Actions 自动部署

创建 `.github/workflows/deploy.yml`：

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
      - run: |
          cd public
          git init
          git checkout -b gh-pages
          git add -A
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git commit -m "deploy"
          git remote add origin https://${{ secrets.GITHUB_TOKEN }}@github.com/你的用户名/wiki.git
          git push -f origin gh-pages
```

### 步骤 8：推出上线

```bash
git init
git add -A
git commit -m "init wiki"
git remote add origin git@github.com:你的用户名/wiki.git
git push -u origin main
```

访问 `https://你的用户名.github.io/wiki` 即可。

---

## 第二部分：AI 搭建提示语

### 完整版

```
帮我用 Hexo + NexT 主题 + GitHub Pages 搭建个人 wiki 知识库。

要求：
1. 本地目录 D:\wiki
2. GitHub 仓库：你的用户名/wiki
3. 使用 NexT 的 Pisces 方案
4. 支持暗黑模式、搜索、代码高亮
5. 配置 GitHub Actions：push 到 main 自动部署到 gh-pages
6. 写一篇首页教程，介绍搭建方法和 AI 提示语

按顺序执行：
- 检查 Node.js
- npm install -g hexo-cli
- hexo init D:\wiki
- npm install hexo-theme-next
- 配置 _config.yml（title、url、theme）
- 配置 _config.next.yml（scheme: Pisces、darkmode）
- gh repo create + GitHub Actions + git push
- 告诉访问地址
```

### 简化版

```
帮我用 Hexo + NexT + GitHub Pages 搭 wiki，本地 D:\wiki，仓库 wiki，启用暗黑模式
```

---

## NexT 四套方案

| 方案 | 风格 | 适合 |
|------|------|------|
| Muse | 无侧边栏，全宽 | 极简 |
| Mist | 紧凑侧边栏 | 个人博客 |
| Pisces | 干净侧边栏 | 知识库 ✅ |
| Gemini | 花哨侧边栏 | 展示型 |

本文档使用 **Pisces**。

## 日常使用

```bash
hexo new "文章标题"       # 新建文章
hexo server               # 本地预览 http://localhost:4000
git add -A && git commit && git push  # 自动部署
```

---

## 参考

- [Hexo 官方文档](https://hexo.io/docs/)
- [NexT 主题文档](https://theme-next.js.org/)
- [GitHub Pages](https://pages.github.com/)
