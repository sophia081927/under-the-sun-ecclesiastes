# Q&A 内容审核 — CONTENT_REVIEW.md

> 用途：人工审核神学表达、调性与**经文逐字准确性**。经文接线前请核对。
> 中文用**和合本**（免标注），英文标注译本 **(NIV)**。

---

## ⚠️ 重要前置发现：主题基线不符（需你确认后再动新主题）

规格假设"现有 8–9 个主题"，但**当前 `qaRegistry` 实际已有 15 个主题**：
`emptiness, anxiety, godlove, jesus, insecurity, meaning, truth, loneliness, success, marriage, suffering, death, satisfaction, seeker, light`。

因此规格里列为"新增"的 **`suffering`、`death`、`marriage` 三个其实已存在**。若按字面再新增会产生**重复 id / 重复 priority**，破坏确定性匹配（不可破坏清单 #3）。

**我的处理建议（只此一种工程上正确）**：
- 这 3 个**就地增强**（加变体经文 + 补关键词），**不新建**。
- 其余 **12 个真正新增**：Batch A 的 `guilt, forgiving, grief, money, burnout, doubt`（6 个）+ Batch B 的 `parenting, failure, envy, anger, guidance, belonging`（6 个）。
- 完成后总主题数 = **27**（规格预期"约 23"，此为更全覆盖；如你希望精简可删减）。

**→ 请确认此重构方式，我再据此把 Batch A 的全部双语文案写入本文件供审核。**

---

## Part 1 · §1 已接线的现有主题变体经文（请核对逐字）

> 机制已上线（提交 `bc8d33b`）：每主题变体池 = [主经文, ...变体]，模块级计数器 0→1→2→0 轮换；无变体的主题行为不变；危机卡不加变体。

| 主题 | 主经文（原有） | 变体 1 | 变体 2 |
|---|---|---|---|
| emptiness | 传 1:14 | **传 3:11**「神造万物，各按其时成为美好，又将永生安置在世人心里。」/ Ecc 3:11 (NIV) | **约 4:13-14**「凡喝这水的还要再渴；人若喝我所赐的水就永远不渴。我所赐的水要在他里头成为泉源，直涌到永生。」/ John 4:13-14 (NIV) |
| anxiety | 约 14:27 | **腓 4:6-7**「应当一无挂虑，只要凡事借着祷告、祈求和感谢，将你们所要的告诉神。神所赐出人意外的平安，必在基督耶稣里保守你们的心怀意念。」/ Phil 4:6-7 (NIV) | **太 6:34**「所以，不要为明天忧虑，因为明天自有明天的忧虑；一天的难处一天当就够了。」/ Matt 6:34 (NIV) |
| godlove | 约 15:9 | **罗 5:8**「惟有基督在我们还作罪人的时候为我们死，神的爱就在此向我们显明了。」/ Rom 5:8 (NIV) | **约一 4:9-10**「神差他独生子到世间来，使我们借着他得生……不是我们爱神，乃是神爱我们，差他的儿子为我们的罪作了挽回祭，这就是爱了。」/ 1 John 4:9-10 (NIV) |
| insecurity | 诗 46:1 | **赛 41:10**「你不要害怕，因为我与你同在；不要惊惶，因为我是你的神。我必坚固你，我必帮助你；我必用我公义的右手扶持你。」/ Isa 41:10 (NIV) | **约 10:27-29**「我的羊听我的声音，我也认识他们，他们也跟着我。我又赐给他们永生；他们永不灭亡，谁也不能从我手里把他们夺去。」/ John 10:27-29 (NIV) |
| meaning | 传 12:13 | **传 3:11**（同上）| **约 17:3**「认识你独一的真神，并且认识你所差来的耶稣基督，这就是永生。」/ John 17:3 (NIV) |
| truth | 约 14:6 | **约 1:1,4-5**「太初有道，道与神同在，道就是神。……生命在他里头，这生命就是人的光。光照在黑暗里，黑暗却不接受光。」/ John 1:1,4-5 (NIV) | **来 11:1**「信就是所望之事的实底，是未见之事的确据。」/ Heb 11:1 (NIV) |
| loneliness | 约 14:18 | **太 28:20**「凡我所吩咐你们的，都教训他们遵守，我就常与你们同在，直到世界的末了。」/ Matt 28:20 (NIV) | — |

---

## Part 2 · §2 新主题 priority 分配（现有最大值 15 之后顺延）

现有主题 priority 全部不变。新主题按下表分配（唯一、确定性；longest-match 为主，priority 仅破平局）：

| 批次 | id | priority | 处理 | relatedBooks |
|---|---|---|---|---|
| — | suffering | 11（不变）| **增强**（加变体经文，见下）| john, ecclesiastes |
| — | death | 12（不变）| **增强**（+ `人死后` 已迁入；加变体）| ecclesiastes, john |
| — | marriage | 10（不变）| **增强**（加变体）| ecclesiastes, john |
| A | guilt | 16 | 新建 | john |
| A | forgiving | 17 | 新建 | john |
| A | grief | 18 | 新建 | john |
| A | money | 19 | 新建 | ecclesiastes |
| A | burnout | 20 | 新建 | ecclesiastes |
| A | doubt | 21 | 新建 | john |
| B | parenting | 22 | 新建 | john |
| B | failure | 23 | 新建 | ecclesiastes |
| B | envy | 24 | 新建 | ecclesiastes |
| B | anger | 25 | 新建 | john |
| B | guidance | 26 | 新建 | john |
| B | belonging | 27 | 新建 | john |

## Part 3 · 关键词碰撞分析与解决（§3.2）

全部靠**最长关键词优先 + 唯一 priority 破平局**确定性解决，不改现有主题既有结果：

- **burnout ↔ anxiety（"压力"系）**：anxiety 有 `压力/stress/overwhelmed`；burnout 用 `工作压力(4)` 长于 `压力(2)` → 工作压力类归 burnout，单纯 `压力/stressed` 仍归 anxiety。**调整**：`overwhelmed` 不放进 burnout（避免与 anxiety 完全同词重复），anxiety 保留。
- **grief ↔ loneliness（"孤单"系）**：grief 用 `失去亲人/亲人去世(4)` 长于 loneliness `孤单(2)`；"亲人去世后好孤单" → grief。单纯 `孤单/孤独` 仍 → loneliness。
- **belonging ↔ loneliness**：belonging 的 `移民的孤独(5)` 含 `孤独(2)` 但更长 → belonging；单纯 `孤独` → loneliness。
- **money ↔ success**：success 有 `钱(1)/财富`；money 用 `钱不够(3)/为钱焦虑(4)` 更长 → money；"赚了很多钱" 仍 → success。`为钱焦虑(4)` 长于 anxiety `焦虑(2)`。
- **guilt ↔ forgiving**：无直接重叠（guilt=后悔/内疚/我做错了；forgiving=被伤害/无法原谅/恨）。
- **guidance ↔ light**：light 有 `该往哪(3)`；guidance 用 `不知道怎么办/该怎么选` 不同词，不碰撞。

## Part 4 · 危机边界（§4，最重要）

- 危机关键词列表**一字未动**，检测永远第一（已验证）。
- 新主题关键词**绝不含**任何危机表达（`不想活/想死/活不下去/撑不住了` 等）。特别地：burnout 用 `撑得好辛苦/喘不过气`，**不含** `撑不住了`（那是危机词）。
- 已验证四个混合危机输入全部走危机卡：
  - 「我太累了，撑不住了」→ 危机 ✅（`撑不住了`）
  - 「亲人去世后我也不想活了」→ 危机 ✅（`不想活`）
  - 「我怕死，但有时又想结束生命」→ 危机 ✅（`想结束生命`）
  - "I'm so burned out I can't go on" → 危机 ✅（`can't go on`）

---

## Part 5 · Batch A 新主题双语全文（待你确认 Part 0 重构方式后写入）

> 确认后我会把 guilt / forgiving / grief / money / burnout / doubt 六个新主题的
> title / verse / explanation(100–160字) / reflection / nextStep / prayer 中英全文，
> 以及 suffering / death / marriage 三个的变体增强，逐一写在此处供审核；审核通过前不接线。
