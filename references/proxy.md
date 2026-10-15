# 本 VM 无头 Chromium 联网说明

Chromium 不认 `HTTPS_PROXY` 环境变量；Playwright 的 `proxy` 选项配代理账号会 hang 死。

## 做法

1. 起本地中继：`node scripts/relay.js`（监听 127.0.0.1:18080）。
   收到 CONNECT 后，向上游 egress 代理（`HTTPS_PROXY` 环境变量）发带
   `Proxy-Authorization` 头的 CONNECT。curl 已验证代理本身是通的。
2. Chromium 启动参数只加：
   `--proxy-server=http://127.0.0.1:18080 --ignore-certificate-errors`
   （代理做 TLS 中间人，不加会 `ERR_CERT_AUTHORITY_INVALID`）。

## Playwright 模块位置

本机 python 没有 playwright；node 的 playwright 在
`~/.claude/skills/xxd-draw-001/node_modules`，运行时 export：

```bash
export NODE_PATH=/home/hatch/.claude/skills/xxd-draw-001/node_modules
node scripts/shoot.js jobs.json
```

## jobs.json 格式

```json
[
  {"name": "reuters-top", "urls": ["https://...", "https://mirror..."],
   "mode": "clip", "clip": {"x": 0, "y": 0, "w": 1280, "h": 1050}},
  {"name": "pricing-table", "urls": ["https://..."],
   "mode": "element", "selector": "article table"}
]
```

输出目录由 `SHOT_OUTDIR` 环境变量控制，默认 `./screenshots`。
