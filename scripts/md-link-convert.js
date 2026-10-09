/**
 * Hexo 插件：词条内 .md 相对链接 → 站点 URL
 *
 * 知识库词条使用标准 Markdown 相对链接互链（如 ../insights/xxx.md），
 * 在 GitHub 仓库中天然可点；本插件在渲染时把指向站内文章的 .md 链接
 * 转换为对应文章的站点 permalink，保证仓库和网站双端可用。
 * 无法解析到站内文章的链接（如指向 sources/ 的链接）保持原样。
 */
'use strict';

const path = require('path');

hexo.extend.filter.register('after_post_render', function (data) {
  if (!data || !data.content || !data.source) return data;

  const posts = hexo.locals.get('posts');
  if (!posts) return data;

  // 源文件路径（如 _posts/tech/xxx.md）→ 站点 permalink
  const linkMap = {};
  posts.forEach((p) => {
    if (p.source && p.permalink) {
      linkMap[p.source.replace(/\\/g, '/')] = p.permalink;
    }
  });

  const currentDir = path.posix.dirname(data.source.replace(/\\/g, '/'));

  data.content = data.content.replace(
    /href="([^"#]+?\.md)(#[^"]*)?"/g,
    (match, link, anchor) => {
      let decoded;
      try {
        decoded = decodeURIComponent(link);
      } catch (e) {
        decoded = link;
      }
      // 跳过 http(s) 绝对链接
      if (/^https?:\/\//i.test(decoded)) return match;

      const resolved = path.posix.normalize(path.posix.join(currentDir, decoded));
      const target = linkMap[resolved];
      if (!target) return match; // 非站内文章链接（如 sources/），保持原样
      return `href="${target}${anchor || ''}"`;
    }
  );

  return data;
});
