# 持续祷告部署说明

网页编辑器粘贴单个 JS 文件的旧方式已不适用于本版本。必须同时上传 Worker、2,378 个章节资源，以及经文资源和限流绑定。独立 JS 文件不包含资源。

1. 保留现有 Cloudflare Worker `light-of-life-prayer` 和已加密保存的 `ANTHROPIC_API_KEY`。不要将密钥写入文件或聊天。
2. 在本项目目录运行 `npm run test:prayer` 和 `npm run build:prayer`。
3. 运行 `wrangler deploy --dry-run --no-bundle --config worker/wrangler-deploy.toml`。失败则停止。
4. 必要时 `wrangler login` 完成账户授权。运行 `wrangler deploy --no-bundle --keep-vars --config worker/wrangler-deploy.toml`。
5. 确认 `SCRIPTURE_ASSETS`、`PRAYER_RATE_LIMITER`（6次/60秒）、`ANTHROPIC_API_KEY` 均存在。现有 Worker 的首次部署已验证这组绑定可用，新版仍需再次验收。
6. 测试中文、英文、不同生活处境、同主题近况、经文逐字一致、今日行动和错误重试。前端测试不能替代真实 API 验收。
7. 验收通过后才填写 `data/prayerConfig.js` 中的真实端点并发布主站。没有前端构建框架，保持原生 HTML/JS 部署。

站长可使用工作目录 `outputs/deploy-prayer-companion.ps1`，该脚本先做 dry-run，失败不上传。新版尚未验收前不要将本地未配置状态直接发布到主站。

祷告本为浏览器本地存储，不跨设备同步。隔离的坏行保留在原始备份里；整体 JSON 损坏时写入被阻止，但仍可导出原始数据。不要为修复单条记录清空整个浏览器数据。
