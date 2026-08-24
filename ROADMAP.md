# ROADMAP · 圣经书阁扩卷路线图

> 内部规划文档。落档用，不代表已实施。实施以各阶段任务与回归为准。

## 原则

1. **按用户真实问题扩卷，不按圣经顺序。** 先建人们真正会带着来问的主题所对应的书卷（虚空、意义、焦虑、苦难、饶恕、归属……），而不是从创世记顺排。
2. **Q&A 引擎始终可引用整本圣经，先于书卷页面存在。** `data/qaEngine.js` 不受"哪些书卷页面已建"限制——某个主题需要的经文（如约伯记、罗马书、腓立比书）可以在对应阅读页建成之前，就先在 Q&A 里引用并牧养用户。`relatedBooks` 只在书卷页面上线后才挂链接。
3. **每卷最小改动、可复用现有基础设施：** registry 驱动首页卡片、`.lang-zh` 双语、hash 路由、听经 TTS（含语音缓存 / cancel 守卫 / 同步触发修复）、biblical-qa 组件。加新卷 = 往 `bibleRegistry.js` 追加一条 + 建页面 + 接 relatedBooks。

## 书卷顺序与状态

| # | 书卷 | 主题定位 | 状态 |
|---|---|---|---|
| ① | 传道书 Ecclesiastes | 虚空 / 劳碌 / 时间 / 死亡 / 人生意义 | ✅ 已上线（阅读+听经+敬拜+Ask+图解） |
| ② | 约翰福音 John | 道成肉身 / 真光 / 生命 / 道路真理 | ✅ 已上线（阅读+听经+敬拜+导览+图解） |
| ③ | 诗篇精选 Psalms | 恐惧 / 忧闷 / 悔改 / 避难 / 同在（真实向神喊话） | ✅ 阅读+听经已上线；敬拜=遗留项 |
| ④ | 启示录 Revelation | 22章架构 / 安慰与盼望 / 随讲道系列逐章完善 | 🚧 第1、21、22章首发 |
| ⑤ | 马太福音补全 Matthew | 登山宝训 5–7 章、11:28、28 章（天国 / 安息 / 大使命） | ⏳ 目前仅 registry "敬请期待"占位页 |
| ⑥ | 箴言精选 Proverbs | 婚姻 / 教养 / 金钱 / 言语 / 抉择（日常智慧） | 📋 规划 |
| ⑦ | 腓立比书 Philippians | 喜乐 / 焦虑 / 知足 | 📋 规划 |
| ⑧ | 罗马书 Romans | 3、5、8、10、12 章：罪 / 恩典 / 救恩 / 确据 | 📋 规划 |
| ⑨ | 约伯记 Job | 苦难（文本难度高，**靠后**；在此之前，"苦难/哀伤"主题由 Q&A 直接引用约伯记经文承接） | 📋 规划（registry 已占位 upcoming） |
| ⑩ | 以赛亚精选 Isaiah | 40、41、53、55、61 章：安慰 / 弥赛亚 | 📋 规划 |
| ⑪ | 约翰一书 1 John | 神是爱 / 确据 | 📋 规划 |

## 每卷 checklist（新增一卷时逐项过）

- [ ] **registry**：`data/bibleRegistry.js` 追加条目（id/slug/order/status/page/listen/worship/hash 路由/keyVerse/features/双语标题·副题·说明/accent·bgColor）
- [ ] **阅读页**：双语并列（新内容使用公共领域的和合本 + WEB），移动优先，`#anchor` 锚点直达
- [ ] **听经页**：仿 `psalms-listen.html` / `john-listen.html`——语音缓存、无跨语言 voice、cancel 守卫、点击同步触发、MP3-ready 路径
- [ ] **敬拜页**（如适用）：仿 `*-worship.html`；不适用则列遗留，不为此改架构
- [ ] **默想问题**：每章/每段一个真诚开放问题
- [ ] **Q&A relatedBooks 接线**：相关主题 `relatedBooks` 追加本卷 id；`components/biblical-qa.js` + `BiblicalQA.jsx` 的 `BOOK_LINKS` 加映射
- [ ] **导航**：首页 registry 自动出卡；相关书页顶栏加互链
- [ ] **语言切换**：`.lang-zh` / `setLang` / `bible_lang` 全站跟随
- [ ] **移动端**：375px 排版、触控 ≥44px、无横向滚动
- [ ] **hash 路由**：`#/<book>` · `#/<book>/listen` 经 `resolveHash` 可达
- [ ] **回归门禁**：危机检测最先且不走加载、qaRegistry 既有结果不变、构建零报错无新增 warning

## 当前 Q&A 覆盖（截至诗篇卷 Phase 2）

- **21 个主题**：emptiness · anxiety · godlove · jesus · insecurity · meaning · truth · loneliness · success · marriage · suffering · death · satisfaction · seeker · light · **guilt · forgiving · grief · burnout · envy · belonging**（后 6 个为诗篇卷 Phase 2 新增）
- 匹配：最长关键词优先 + 唯一 priority 破平局；危机检测最先且立即出卡；温暖 fallback（太 11:28）；经文变体轮换；英文经文标 (NIV)、中文和合本。
- 已挂 `psalms` 的 relatedBooks：anxiety · insecurity · loneliness · suffering · guilt · grief · burnout · envy · belonging。

## 已知遗留项（不阻塞扩卷）

- `psalms-worship.html` 未建（registry `worship:false`，无死链）。
- `relatedBooks` 目前为**卷级**链接；**篇级锚点**（如 insecurity → `psalms.html#psalm-46`）为增强项。
- 建议篇级锚点映射（实施篇级增强时用）：guilt→#psalm-51 · envy→#psalm-73 · belonging→#psalm-139 · grief→#psalm-34/42 · insecurity→#psalm-46 · anxiety→#psalm-27 · loneliness→#psalm-23。
- `index.html` 仍用 Tailwind Play CDN（既有技术债），留待"首页改版"任务迁移到站内 CSS。
- belonging 英文关键词 `do not belong` 不覆盖缩写 `don't belong`（可在后续按需补）。
