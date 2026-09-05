# 「生成祷告」AI 接入与部署指南

这份指南把网站的「生成祷告」从**写死的关键词模板**（永远返回马太福音 11:28）升级为**真正的 AI**：读懂用户写下的处境 → 从整本圣经 66 卷选相关经文 → 简短解释 → 写一段个人化祷告 → 给一个温柔的下一步。

因为网站是纯静态站（GitHub Pages），**不能把 API Key 放进前端**（会公开泄露）。所以中间加一个极小的服务端代理：**Cloudflare Worker**（免费额度足够）。它替网站调用 Claude，Key 只存在 Worker 里，浏览器永远看不到。

---

## 你需要准备的两样东西

1. **一个 Cloudflare 账号**（免费）：https://dash.cloudflare.com/sign-up
2. **一个 Anthropic API Key**：https://console.anthropic.com/ → 登录 → API Keys → Create Key（形如 `sk-ant-...`）。需要在 Billing 里充一点额度（下面有费用说明）。

> 我（Claude Code）看不到、也不会保存你的 Key。你只在 Cloudflare 后台把它设为「加密变量」，它就只存在服务器端。

---

## 部署（推荐：Cloudflare 后台复制粘贴，无需命令行）

1. 登录 Cloudflare → 左侧 **Workers & Pages** → **Create** → **Create Worker**。
2. 起个名字，例如 `lol-prayer` → **Deploy**（先部署一个默认版本）。
3. 点 **Edit code**，把编辑器里原有内容**全部删除**，粘贴本仓库 `worker/prayer-worker.js` 的**全部内容** → **Deploy**。
4. 回到这个 Worker 的 **Settings → Variables and Secrets**：
   - 点 **Add** → 类型选 **Secret**（加密）→ 名称填 `ANTHROPIC_API_KEY`，值填你的 `sk-ant-...` → 保存。
   - （可选）再加**普通变量**：`MODEL`（默认 `claude-opus-5`）、`EFFORT`（默认 `medium`）。
5. 复制这个 Worker 的公开网址，形如 `https://lol-prayer.你的名字.workers.dev`。
6. 打开本仓库 `data/prayerConfig.js`，把网址粘进去：
   ```js
   export const PRAYER_API_ENDPOINT = 'https://lol-prayer.你的名字.workers.dev';
   ```
7. 提交并推送（`git add data/prayerConfig.js && git commit && git push`）。几分钟后 GitHub Pages 更新，网站上的「生成祷告」就正式启用了。

> 在第 6 步填好网址之前，网站会诚实地显示「AI 祷告功能正在开通中」，**绝不会**再返回假的固定经文。所以现在就把前端改动上线也是安全的。

### 备选：命令行部署（wrangler）
```bash
cd worker
npx wrangler secret put ANTHROPIC_API_KEY   # 粘贴 sk-ant-... 回车
npx wrangler deploy
```
部署完成后同样把输出的网址填进 `data/prayerConfig.js`。

---

## 费用与模型选择

按 Anthropic 官方价格，一次祷告请求大约几分钱。可用 `MODEL` 变量随时切换：

| 模型 (`MODEL` 值) | 输入 $/百万 | 输出 $/百万 | 每次请求约 | 质量 |
|---|---|---|---|---|
| `claude-opus-5`（默认） | $5 | $25 | ~$0.03–0.05 | 最高（经文选择、祷告最贴切） |
| `claude-sonnet-5` | $2 | $10 | ~$0.015–0.02 | 很好，性价比高 |
| `claude-haiku-4-5` | $1 | $5 | ~$0.008 | 够用，最省 |

建议：**先用默认 `claude-opus-5` 保证质量**；如果流量变大、想省钱，把 `MODEL` 改成 `claude-sonnet-5` 即可，无需改代码。也可以把 `EFFORT` 从 `medium` 调成 `low` 进一步降本提速。

**防滥用（强烈建议）**：在 Cloudflare 该 Worker 的 **Settings → 触发器 / Rate limiting** 里加一条限流规则（例如同一 IP 每分钟 5 次），避免有人恶意刷接口导致账单飙升。Worker 本身已把单次输入限制在 1000 字符。

---

## 测试

部署好后，把网址填进下面命令，跑 20 个不同主题的自动测试（需要 Node）：
```bash
node scripts/test-prayer.mjs https://lol-prayer.你的名字.workers.dev
```
它会检查：每个主题都返回**不同且贴切**的经文、经文带书卷/章节/译本、包含完整祷告文、危机主题包含 988、并把结果写到 `scripts/prayer-test-results.json`。把结果发我，我整理成验收报告。

---

## 出了问题怎么排查

- 网站显示「这次没能生成祷告」→ 说明前端连到了 Worker 但 Worker 报错。最常见原因：Key 没设或额度用尽。到 Worker 的 **Logs**（实时日志）看报错。
- 一直显示「正在开通中」→ `data/prayerConfig.js` 里的网址还没填或没推送上线。
- 危机词（如"不想活了"）会**立即**在前端显示 988 卡片，不经过网络也不花钱——这是安全兜底，属正常。
