# ai-hotspot-article

每天抓取过去 24 小时 AI 圈最热话题，截图取证，生成单文件公众号 HTML 文章，并双通道交付。

## Workflow

1. **选题**（三路交叉，免登录）：getdaytrends（X 热榜聚合）+ 新闻搜索 + 社媒热度（Threads/IG/FB）。样张模式下选题与大纲先经用户确认。
2. **查两面评价**：通稿和真实评价/翻车/第三方榜单都要查、都要写。
3. **截图取证**：本机 Playwright（`scripts/relay.js` 本地中继 + `scripts/shoot.js`），2x 清晰度。
4. **写稿**：公众号 HTML（`references/gzh-style.md` 设计系统），图片 base64 内嵌为单文件；`tagcheck.py` 标签配平 + 渲染预览自检。
5. **交付**：聊天 + Telegram 双通道。

## Scripts

| 脚本 | 用途 |
|---|---|
| `scripts/relay.js` | Chromium 本地 CONNECT 中继（走 egress 代理） |
| `scripts/shoot.js` | 文章截图批处理（jobs.json 驱动） |
| `scripts/inline_images.py` | 图片转 base64 内嵌，输出单文件 HTML |
| `scripts/tagcheck.py` | HTML 标签配平校验 |
| `scripts/cover.py` | 生成公众号封面图（900x383） |
| `scripts/render_preview.js` | 本地渲染预览，自检用 |

## 触发词

AI 热点 / 每日热点 / 热点文章 / hotspot / 公众号热点文
