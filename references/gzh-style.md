# 公众号 HTML 设计系统（源自 muse_tutorial_gzh_v12.html）

微信公众号编辑器只认内联样式。所有文本包在 `<span leaf="">` 里（编辑器兼容标记）。

## 全局

- 外层：`max-width:677px; margin:0 auto; background:#ffffff;`
- 字体：`-apple-system,BlinkMacSystemFont,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif`
- 正文：`#374151`，`font-size:14px; line-height:1.9; text-align:justify; padding:0 20px;`
- 品牌绿：`#059669`（浅底 `#ECFDF5`，亮绿 `#34D399`）；标题黑 `#111827`；灰 `#9CA3AF` / `#D1D5DB`

## 块模式

**标题卡**：圆角 20px 白卡，1.5px 绿边框 + 淡阴影。顶部 kicker 行（绿点 + `HOT TOPIC · 每日 AI 热点` + 右侧日期）；大标题 24px 900字重（关键词染绿）；48px 渐变绿线；底部绿条（`#059669`）放公众号名 + 标签 chips。

**三句话卡**：`#ECFDF5` 底，1px 绿边框，圆角 14px，`margin:0 20px 32px`，标题 12px 绿字重。

**PART 头**：flex 行 — 左侧大编号（28px 900 绿）+ `PART` 小字；1px 竖线分隔；右侧标题 17px 900 + 英文副标 11px 灰字重。

**图片块**：`margin:24px 0; text-align:center`；`img` 用 `width:100%; border-radius:12px; border:1px solid #E5E7EB`；caption 11px 灰色，`▲` + 来源说明。

**结尾卡**：`#111827` 深底圆角 14px，标题 12px 亮绿字重，正文 14px `#E5E7EB`——放一句实在判断，不放口号。

**来源列表**：顶部 1px 灰分隔线；12px 灰字；每条 `· <a href="原文URL" style="color:#059669;">原文链接</a>`。

## 写作 tone

- 说人话：删"正确的废话"和术语直译；敢写短板。
- 每段一个信息；关键数据加粗染绿。
- 结尾必须是实在判断，不是口号。
