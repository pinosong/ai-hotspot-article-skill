---
name: ai-hotspot-article
description: 抓取过去 24 小时 AI 圈最热话题，截图取证，生成单文件公众号 HTML 文章并双通道交付。触发词：AI 热点、每日热点、热点文章、hotspot、公众号热点文。
---

# AI 热点 → 公众号文章

目标：把"过去 24 小时 AI 圈最热的话题"变成一篇有图有文、可直接粘贴进公众号后台的 HTML 文章（图片内嵌单文件）。

## 工作流

### Phase 1：选题（三路交叉，免登录）

1. **getdaytrends.com**（worldwide + united-states 页）：看实时热榜和 24h 榜（Most Tweeted / Longest Trending），筛 AI 相关条目。
2. **browser.search news vertical**：搜 AI 新闻，找官方发布和大媒体报道，确认事件真实性与时间线。
3. **social.search**：3~4 个 semantic_queries，`ranking_intent=engagement`，`since=昨天`，`top=15`；看 Culture moment 聚类和评论摘要，确认社媒热度。

三路交叉定 1 个话题 + 3~5 篇高热度源文章。**样张模式：选题 + 大纲先经用户确认再开工**，确认后再进入 Phase 2。

**选题四条硬标准**（2026-10-15 连毙三个选题换来的）：
1. **AI 核心**：慈善 grant、纯金融宏观不算 AI 话题。
2. **真·24 小时内**：原始报道/帖子在 24h 内；综述可以新，但事件本身不能是几个月前的旧闻。
3. **普通人有体感**：技术宅向话题（如 containment、安全工程）再热也不碰；大众向 = 有好奇、有情绪、有用。
4. **有深度可挖**：除通稿外，必须有论坛热帖 / 论文 / 数据 / 第三方榜单其一可写。
5. 实在没爆点就歇一天，不硬写水文——如实告诉用户比交一篇水稿强。

### Phase 2：查两面评价

不能只看通稿写强项。同步查：真实用户评价（social.search 的评论摘要）、翻车 / 质疑报道、第三方基准榜单。**注意区分厂商自有榜单和独立榜单**（前者叫进步，不叫排名）。作弊争议、内部质疑、榜单打架这类必须写进文章——敢写短板比吹满更像人话。

### Phase 3：截图取证

用 `scripts/relay.js` + `scripts/shoot.js`（本机 node Playwright，见 `references/proxy.md`）。

- viewport 1280x900，`deviceScaleFactor: 2`；默认截标题区（headline + lede，css 1280x1050）；表格用 element 截图。
- **关键证据图用紧凑裁切**：只截正文栏（如 css x:130 width:700），去掉广告侧栏/导航杂物——字在手机上才够大、读得清。全页 establishing shot 和紧凑证据图搭配用。
- 裁掉 cookie 弹窗、广告侧栏、转载站点的站点头图等杂物；同一证据只用一次。
- 实拍截图，不接受 AI 生成图。源站 401/超时：换镜像站重试一次，仍失败就降级为文字引用 + 链接，不硬撑。
- **深度要求**：不只截新闻稿。必须包含至少一类一线材料：论坛热帖（HN/Reddit/V2EX）、X/Threads 帖子、第三方榜单页、论文摘要页。Playwright 可录屏（`recordVideo`，滚动浏览关键页面 20-40 秒，转 mp4 后随文交付）。
- **视觉分工**（真实感 vs 观点感）：真实感靠实拍（截图/录屏，只截真实页面）；观点感靠 HTML 自制信息卡（专家金句卡、数据对比卡、时间线卡）。在合适的地方干合适的事，不混用——不用截图冒充观点，不用自制卡冒充实拍。

### Phase 4：写稿（公众号 HTML）

按 `references/gzh-style.md` 的设计系统写：标题卡 → 导语 → 三句话卡 → PART 01..N（编号头 + 英文副标）→ 图片块（caption 注明来源）→ 结尾卡 → 来源列表（原文链接）。

- 说人话：删正确的废话和术语直译；口号式结尾换成一句实在判断。
- **人物用真名**：不给当事人安"站长/博主"等人设头衔（除非本人如此自称）；无法验证的表述（如"最高赞"）删掉或软化成"被顶起来的评论"。
- **说明卡用 HTML，不用截图**：数据卡/金句卡/时间线卡直接写 HTML（flex + 自动换行，响应式不乱版，矢量字在小屏上清晰）。截图只做证据，不做说明。
- 图片全部 base64 内嵌，输出**单文件**；改版必须换新文件名（`-v2` 后缀），防客户端缓存旧版。
- 门禁（缺一不可）：`scripts/tagcheck.py` 标签配平 0 错误；`scripts/render_preview.js` 渲染后**逐段看**（标题卡、每张图、来源列表）——机器全绿不算数。

封面图用 `scripts/cover.py` 生成（900x383，黑底 + 品牌绿，供公众号后台上传用）。

### Phase 5：交付

- 聊天：正文说明 + 附件（HTML 单文件 + 封面图）。
- Telegram：同步推送（走 `dual-channel-delivery` skill）：消息 + 封面 + HTML 文档。
- 提醒用户：发布仍需手动粘贴进公众号后台（不可自动代发），并在后台重新上传图片。

## Output Contract

- 单文件 HTML（图片内嵌）：本地浏览器打开即所见即所得，聊天附件和 Telegram 都能直接看。
- 封面图 900x383 PNG（公众号后台上传用）。
- 每个事实有来源，来源列表附原文链接；截图 caption 注明出处；引用保持简短，不整篇搬运。

## Operating Rules

1. X 官方直连不做主力（搜索/热榜需登录态，API 付费，云 IP 风控重）。
2. 选题与大纲先确认再开工；成品先自检再交付，不交半成品。
3. 通稿和真实评价两面都查、两面都写；只按通稿吹参数会被视为吹捧。
4. 保留工作目录：`~/workspace/ai-hotspot/<日期>-<slug>/`（截图、脚本、底稿），交付物进 `~/workspace/your_files/ai-hotspot/`。
5. 环境：新工作目录没有 node_modules 时，用 npm 缓存离线装：`npm install --offline playwright@1.64.0`；`render_preview.js` 等脚本必须在有 node_modules 的目录下跑。
6. Telegram 推送 env：`~/.config/telegram/dailymatch-bot.env`，变量名是 `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`。
7. Git：本 skill 仓库本地分支是 `master`，推送用 `git push <url> master:main`；先设好 `user.name`/`user.email` 再 commit。
