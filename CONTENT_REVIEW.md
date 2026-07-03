# Q&A 内容审核 — CONTENT_REVIEW.md

> 用途：人工审核神学表达、调性与**经文逐字准确性**。经文接线前请核对。
> 中文用**和合本**（免标注），英文标注译本 **(NIV)**。

---

## 诗篇卷 Phase 1 · 经文核对（psalms.html / psalms-listen.html 已上线）

> 页面的**引言、"与日光之下的连接"、默想问题**为原创文案,已随页面上线,可在 psalms.html 内以真实排版审核语气;如需调整语气告诉我即可改。
> 以下是页面引用的**全部经文出处**(中文和合本 / 英文 NIV,均逐字录入,请核对):

| 篇 | 主题 | 引用节数 |
|---|---|---|
| 23 | 牧者 / The Shepherd | 诗 23:1-6（全） |
| 27 | 惧怕中的光 / Light in Fear | 诗 27:1；27:14 |
| 34 | 靠近伤心的人 / Close to the Brokenhearted | 诗 34:17-18 |
| 42 | 忧闷的灵魂 / A Downcast Soul | 诗 42:5,11 |
| 46 | 避难所 / Our Refuge | 诗 46:1-2；46:10 |
| 51 | 造清洁的心 / Create in Me a Clean Heart | 诗 51:1-2；51:10 |
| 73 | 当恶人亨通 / When the Wicked Prosper | 诗 73:2-3；73:25-26 |
| 90 | 数算你的日子 / Number Your Days | 诗 90:2；90:10,12 |
| 91 | 至高者的荫下 / Under the Shadow | 诗 91:1-2；91:11 |
| 121 | 帮助从何而来 / Where Help Comes From | 诗 121:1-2；121:7-8 |
| 139 | 你已经认识我 / You Have Searched Me | 诗 139:1-3；139:7-10；139:23-24 |

**遗留项**：`psalms-worship.html` 未建(按你 #4 的取舍,先列遗留,不为此改架构;registry 已设 `worship:false`,无死链)。篇级 `relatedBooks` 锚点(如 `#psalm-46`)列为增强项。

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

## Part 5 · 6 个新主题双语全文（待你审核批准后接线 — 现未接线）

> 本批 6 个：**grief / guilt / envy / burnout / forgiving / belonging**（money/doubt/parenting/failure/anger/guidance 本阶段不做）。

### 5.0 关键词设计 + priority + relatedBooks（接线时用）

| id | priority | keywordsZh | keywordsEn | relatedBooks |
|---|---|---|---|---|
| guilt | 16 | 内疚·罪恶感·后悔·良心不安·我做错了·神会原谅我吗 | guilt·i feel guilty·regret·will god forgive me·ashamed | john, psalms |
| forgiving | 17 | 无法原谅·怎么饶恕·恨一个人·被伤害了·放不下仇恨 | how to forgive·cannot forgive·i hate someone·they hurt me | john |
| grief | 18 | 失去亲人·亲人去世·走不出来·太想念·哀伤 | lost a loved one·grieving·someone died·miss them so much | john, psalms |
| burnout | 19 | 太累了·工作压力·疲惫不堪·撑得好辛苦·喘不过气 | burned out·exhausted·work stress·so tired | ecclesiastes, psalms |
| envy | 20 | 嫉妒·比不上别人·凭什么是他·心里不平衡·攀比 | jealous·envy·comparing myself·why them not me | ecclesiastes, psalms |
| belonging | 21 | 漂泊·没有归属感·异乡·不属于这里·想家·移民的孤独 | do not belong·homesick·foreigner·far from home·immigrant | john, psalms |

### 5.0b 关键词碰撞分析（纸面；接线后会跑全量 live 校验并汇报）

- **burnout ↔ anxiety**：burnout `工作压力(4)` 长于 anxiety `压力(2)` → 工作压力类归 burnout；单纯 `压力/stress/stressed/overwhelmed` 仍归 anxiety。**`overwhelmed` 不放进 burnout**（避免与 anxiety 同词重复）。
- **grief ↔ loneliness / suffering**：grief `失去亲人(4)/亲人去世(4)` 长于 loneliness `孤单(2)`、suffering `痛苦(2)`；"亲人去世后好孤单/太痛苦" → grief。单纯 `孤单/孤独`→loneliness、`痛苦/苦难`→suffering 不变。
- **belonging ↔ loneliness**：belonging `移民的孤独(5)` 含 `孤独` 但更长 → belonging；单纯 `孤独`→loneliness。
- **guilt ↔ forgiving**：无重叠（guilt=后悔/内疚/我做错了；forgiving=被伤害/无法原谅/恨）。
- **envy**：`嫉妒/攀比/凭什么是他` 与现有主题无碰撞。
- **危机边界**：6 组关键词**均不含**任何危机表达；`太累了`(burnout) 不是危机词,`撑不住了` 只在危机表内,故"我太累了,撑不住了"→危机(已验证)。

---

### 5.1 guilt · 当你被内疚缠住 / When Guilt Won't Let Go
- **verse zh** 【约翰一书 1:9】“我们若认自己的罪，神是信实的，是公义的，必要赦免我们的罪，洗净我们一切的不义。” · **en** 【1 John 1:9】“If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.” (NIV)
- **explanation zh**：内疚有两种：一种把你带向修复与赦免，一种只是把你按在过去反复羞辱。圣经里的认罪，不是没完没了地自责，而是把罪如实说出来，交给一位“信实又公义”的神——他赦免，不是因为你的罪不严重，而是因为他的怜悯足够大。诗篇51篇里，大卫犯了大错，也正是这样把罪摊开，求神洗净、重造。
- **en**：There are two kinds of guilt: one leads you toward repair and forgiveness; the other just pins you to the past and shames you on repeat. Confession in the Bible is not endless self-blame — it is naming the wrong honestly and handing it to a God who is “faithful and just.” He forgives not because your sin was small, but because His mercy is large enough. In Psalm 51 David laid his grave failure open the same way, and asked to be washed and remade.
- **reflection zh**：有没有一件事，你一直在心里判自己有罪，却从未把它如实地交给神，求赦免？ · **en**：Is there something you keep sentencing yourself for, but have never honestly handed to God to ask for forgiveness?
- **nextStep zh**：读约翰一书 1:9，再读诗篇51篇，看认罪之后神如何“造清洁的心”。 · **en**：Read 1 John 1:9, then Psalm 51, and see how God “creates a clean heart” after confession.
- **prayer zh**：神啊，我把这件一直压着我的事，如实交在你面前。谢谢你信实又公义，愿意赦免、洗净我。求你让我不再靠自责活着，而是靠你的怜悯。阿们。 · **en**：God, I bring You honestly the thing that keeps weighing on me. Thank You that You are faithful and just, willing to forgive and cleanse. Help me stop living on self-blame, and live on Your mercy instead. Amen.

### 5.2 forgiving · 当你无法原谅 / When You Can't Forgive
- **verse zh** 【马太福音 18:21-22】“主啊，我弟兄得罪我，我当饶恕他几次呢？到七次可以吗？耶稣说：我对你说，不是到七次，乃是到七十个七次。” · **en** 【Matthew 18:21-22】“Lord, how many times shall I forgive my brother or sister who sins against me? Up to seven times? Jesus answered, I tell you, not seven times, but seventy-seven times.” (NIV)
- **explanation zh**：饶恕不是说“你没有伤害我”，也不是假装伤口不存在。它是一个艰难的决定：不再让仇恨来定义你、绑架你。耶稣把饶恕说成“七十个七次”——不是算账，而是一种新的活法。这很难，尤其当对方从未道歉。但保留苦毒，常常最先毒害的是自己；神也说“伸冤在我”（罗12:19），意思是你可以把公义交给他，不必自己扛。
- **en**：Forgiveness does not mean “you didn’t hurt me,” nor pretending the wound isn’t there. It is a hard decision: to stop letting hatred define and hijack you. Jesus frames it as “seventy-seven times” — not bookkeeping, but a whole new way to live. It is hard, especially when the other person never apologized. But holding bitterness usually poisons you first; and God says “It is mine to avenge” (Rom 12:19) — meaning you can hand the justice to Him and not carry it yourself.
- **reflection zh**：你放不下的那份怨恨，如今最重地压在谁的身上——对方，还是你自己？ · **en**：The resentment you can’t put down — who does it weigh on most heavily now: the other person, or you?
- **nextStep zh**：读马太福音 18 章那个不饶恕人的比喻，再读以弗所书 4:32，慢慢求神给你迈出一小步的力量。 · **en**：Read the parable of the unforgiving servant in Matthew 18, then Ephesians 4:32, and ask God slowly for strength to take one small step.
- **prayer zh**：主啊，有一个伤口我一直放不下，也还没准备好原谅。我先把这份重担、这份想讨回公道的心，交在你手里。求你医治我，也在你的时间里，给我饶恕的力量。阿们。 · **en**：Lord, there is a wound I can’t put down, and I’m not ready to forgive. First I hand You this weight, and my craving to get justice back. Heal me, and in Your time, give me the strength to forgive. Amen.

### 5.3 grief · 当你失去了所爱的人 / When You Have Lost Someone You Love
- **verse zh** 【马太福音 5:4】“哀恸的人有福了，因为他们必得安慰。” · **en** 【Matthew 5:4】“Blessed are those who mourn, for they will be comforted.” (NIV)
- **explanation zh**：哀伤不是软弱，也不是不属灵。耶稣没有说“别哭”，他自己就在朋友拉撒路的坟前哭了（约11:35）——神完全明白失去是什么滋味。哀恸的人“有福”，不是因为悲伤本身是好的，而是因为神应许亲自安慰，并且有一天要“擦去他们一切的眼泪”（启21:4）。你不需要赶快好起来，也不需要假装坚强，才可以来到他面前。
- **en**：Grief is not weakness, nor unspiritual. Jesus did not say “don’t cry” — He Himself wept at the tomb of His friend Lazarus (John 11:35). God fully knows what loss feels like. Those who mourn are “blessed” not because sorrow itself is good, but because God promises to comfort them Himself, and one day to “wipe every tear from their eyes” (Rev 21:4). You do not have to get better quickly, or pretend to be strong, to come to Him.
- **reflection zh**：如果你能对神说出这份思念里最真实的一句话，你会说什么？ · **en**：If you could say the truest sentence inside this missing-them to God, what would it be?
- **nextStep zh**：读诗篇34篇，那里说“神靠近伤心的人”；若你愿意，也读约翰福音11章，看耶稣如何面对死亡与眼泪。 · **en**：Read Psalm 34, where “the Lord is close to the brokenhearted”; and if you’re willing, John 11, to see how Jesus faces death and tears.
- **prayer zh**：主啊，我失去了我所爱的，心里空了一块。谢谢你没有要求我快点好起来。求你亲自靠近我的伤心，在我流泪的时候与我同在，也让我抓住有一天你要擦去一切眼泪的应许。阿们。 · **en**：Lord, I have lost someone I love, and there is an empty place in me. Thank You that You do not ask me to hurry up and heal. Draw close to my grief, be with me as I weep, and let me hold the promise that one day You will wipe away every tear. Amen.

### 5.4 burnout · 当你累到快撑不住 / When You're Worn Down to Empty
- **verse zh** 【马太福音 11:28-30】“凡劳苦担重担的人，可以到我这里来，我就使你们得安息……因为我的轭是容易的，我的担子是轻省的。” · **en** 【Matthew 11:28-30】“Come to me, all you who are weary and burdened, and I will give you rest… For my yoke is easy and my burden is light.” (NIV)
- **explanation zh**：累，不只是身体的事。长期扛着超过自己能承受的重担，人会被掏空。传道书早就说过：日光之下的劳碌，若没有安息，只是捕风。耶稣的邀请不是“再加把劲”，而是“到我这里来”——把重担卸下，换上他“容易的轭”。真正的休息，不只是睡一觉，而是把那份“全靠我撑”的重压，交回给托住万有的神。
- **en**：Exhaustion is not only physical. Carrying a weight beyond what you can bear, for too long, hollows a person out. Ecclesiastes said it long ago: toil under the sun, without rest, is chasing the wind. Jesus’ invitation is not “try harder,” but “come to me” — lay the load down and take His “easy yoke.” Real rest is not just a night’s sleep; it is handing the crushing “it all depends on me” back to the God who holds all things together.
- **reflection zh**：你现在扛着的重担里，有哪一部分其实不是你该独自扛的？ · **en**：In the load you’re carrying now, which part was never actually yours to carry alone?
- **nextStep zh**：读马太福音 11:28-30，也可以读传道书 2 章，看清“劳碌若没有神，终归捕风”；累的时候，也可以到“聆听”页，让经文读给你听。 · **en**：Read Matthew 11:28-30, and Ecclesiastes 2 to see that toil without God ends in chasing the wind; when you’re tired, you can also open the Listen page and let Scripture be read to you.
- **prayer zh**：主啊，我太累了，感觉快撑不住。谢谢你没有叫我更努力，而是叫我到你这里来得安息。我把这压得我喘不过气的担子交给你，求你让我重新得力。阿们。 · **en**：Lord, I am so worn down I can barely carry this. Thank You that You do not tell me to try harder, but to come to You for rest. I hand You the load that has left me breathless — please renew my strength. Amen.

### 5.5 envy · 当你嫉妒、心里不平 / When Envy Leaves You Bitter
- **verse zh** 【诗篇 73:25-26】“除你以外，在天上我有谁呢？除你以外，在地上我也没有所爱慕的……但神是我心里的力量，又是我的福分，直到永远。” · **en** 【Psalm 73:25-26】“Whom have I in heaven but you? And earth has nothing I desire besides you… God is the strength of my heart and my portion forever.” (NIV)
- **explanation zh**：嫉妒常常从一个问题开始：“凭什么是他，不是我？”诗篇73篇的作者也这样，看见恶人享福，几乎站不住。转机发生在他“进了神的圣所”，重新看见结局与永恒——攀比就松开了。嫉妒让你一直盯着别人手里有什么；这节经文邀请你先回到“神是我的福分”，从那里重新衡量自己真正拥有的。
- **en**：Envy often begins with a question: “Why them, and not me?” The writer of Psalm 73 felt it too — he saw the wicked thrive and nearly lost his footing. The turn came when he “entered the sanctuary of God” and saw the end and eternity again; the comparison loosened. Envy keeps your eyes fixed on what’s in someone else’s hands; this verse invites you back to “God is my portion,” and to re-measure what you truly have from there.
- **reflection zh**：你最近一次的攀比，如果诚实说，你真正羡慕的，是那样东西，还是它背后你以为会有的安全感或价值感？ · **en**：Your latest comparison — honestly, is it the thing itself you envy, or the security or worth you imagine it would give you?
- **nextStep zh**：读诗篇73篇全篇，看作者如何从“心怀不平”走到“神是我的福分”；也可以读传道书，看“人靠比较得来的，终归捕风”。 · **en**：Read all of Psalm 73 and watch the writer move from bitterness to “God is my portion”; and read Ecclesiastes on how what we gain by comparison ends in chasing the wind.
- **prayer zh**：神啊，我承认我心里在嫉妒、不平。求你帮助我把眼光从别人手里，转回到你身上；让我真的相信，有你，就已经是我最大的福分。阿们。 · **en**：God, I admit the envy and unrest in my heart. Help me turn my eyes from other people’s hands back to You; and help me truly believe that having You is already my greatest portion. Amen.

### 5.6 belonging · 当你觉得无处归属 / When You Feel You Don't Belong
- **verse zh** 【诗篇 139:9-10】“我若展开清晨的翅膀，飞到海极居住，就是在那里，你的手必引导我；你的右手也必扶持我。” · **en** 【Psalm 139:9-10】“If I rise on the wings of the dawn, if I settle on the far side of the sea, even there your hand will guide me, your right hand will hold me fast.” (NIV)
- **explanation zh**：漂泊、想家、在异乡觉得“我不属于这里”——这种没有归属的感觉，很深也很真实。圣经里许多人也是寄居的、客旅（来11:13），他们“羡慕一个更美的家乡”。诗篇139篇给出的安慰是：无论你飞到多远、身在何方，神的手一直在那里引导、扶持你。你或许在地上没有一处完全属于的地方；但有一位神，无论你在哪里，他都与你同在——而信的人真正的家乡，是在他那里。
- **en**：Drifting, homesick, feeling “I don’t belong here” in a foreign place — that ache of not belonging is deep and real. Many people in the Bible were sojourners and strangers too (Heb 11:13), “longing for a better country.” Psalm 139 offers this comfort: however far you fly, wherever you are, God’s hand is already there to guide and hold you. You may have no place on earth that fully belongs to you; but there is a God who is with you wherever you are — and the believer’s true home is in Him.
- **reflection zh**：在你漂泊或想家的感觉里，你最深渴望的“归属”，是一个地方，还是被谁完全接纳、看见？ · **en**：In your drifting or homesickness, the “belonging” you long for most — is it a place, or to be fully accepted and seen by someone?
- **nextStep zh**：读诗篇139篇，看神如何无处不在地与你同在；若你愿意，读腓立比书 3:20，看信的人真正的“国籍”在哪里。 · **en**：Read Psalm 139 and see how God is with you everywhere; and if you’re willing, Philippians 3:20, on where the believer’s true “citizenship” is.
- **prayer zh**：神啊，我常常觉得漂泊、无处归属。谢谢你应许，无论我在多远的地方，你的手都在引导我、扶持我。求你作我漂泊中的家，让我在你里面找到真正的归属。阿们。 · **en**：God, I so often feel adrift, like I belong nowhere. Thank You for promising that however far I go, Your hand still guides and holds me. Be my home in my wandering, and let me find true belonging in You. Amen.

---

## Part 6 · 诗篇卷 Phase 1 原创文案（已上线,补交审核）

> 经文出处见文首"诗篇卷 Phase 1 · 经文核对"表。以下为页面的**原创文案**(引言 + 每篇"与日光之下的连接" + 默想),已随 psalms.html 上线;如需调整语气,告诉我即改。

**卷首引言 zh**：诗篇不是完美信徒的赞美集。它收录的是真实的人向神喊出来的声音——有信靠，也有恐惧、愤怒、忧闷和质问。神没有删掉这些，反而把它们写进圣经里。这意味着：你此刻真实的情绪，不必先整理干净，就可以带到神面前。传道书诚实地看“日光之下”的虚空；诗篇则教我们，在同样的虚空里，如何抬头向“日光之上”的神说话。
**intro en**：The Psalms are not a collection of polished praise. They record the raw voices of real people crying out to God — trust, yes, but also fear, anger, sorrow, and protest. God did not edit these out; He wrote them into Scripture. That means your honest feelings, right now, need not be cleaned up before you bring them to God. Ecclesiastes looks honestly at the emptiness “under the sun”; the Psalms teach us how, inside that same emptiness, to lift our eyes and speak to the God “above the sun.”

| 篇 | 与日光之下的连接（zh） | 默想（zh） |
|---|---|---|
| 23 | 传道书说人像羊没有牧人；诗23给出另一幅图：你不是无主的孤羊，有一位在幽谷里仍与你同行的牧者。孤独最深时，你要的不是答案，而是同在。 | 在你最近走过的“幽谷”里，你更需要一个解释，还是知道有人一直在身边？ |
| 27 | 惧怕会把威胁放大、把神缩小。诗27不否认危险，却先调整视角：先看“亮光”与“拯救”是谁。 | 把你最大的惧怕放在“耶和华是我的亮光”旁边，它变小了吗？ |
| 34 | 传道书敢直视苦难却停在墙前；诗34补上：在你痛悔之处，神不是远远评判，而是“靠近”。（本站危机提醒的经文。） | “神靠近伤心的人”若此刻是真的，会改变你独自扛着的哪件事？ |
| 42 | 诗42不假装喜乐，承认忧闷烦躁，却向自己的灵魂说话，把盼望重新指向神。低谷的信心常是决定，不是感觉。 | 此刻你能对自己的灵魂说一句诚实又不放弃的话，会是什么？ |
| 46 | 没有安全感，是把稳固建在会摇动的东西上。诗46承认地会改变，却指向不随环境改变的避难所。 | 你现在的安全感，主要建立在哪一件“会摇动”的事情上？ |
| 51 | 大卫犯大错后没有辩解、也没被内疚压垮，而是把罪摊开求洗净、重造。真悔改不是无止境自责。 | 有件事你反复自责，却从未真正交给神求赦免和更新吗？ |
| 73 | 几乎为传道书而写：看恶人享福“心怀不平”，直到“进了神的圣所”，重见永恒，嫉妒才松开。 | 你最近的攀比，放进“神是我的福分，直到永远”，还那么重要吗？ |
| 90 | 摩西版“日光之下”：人生短暂劳苦如飞。但不停在虚空，而转成祷告：求你教我们数算日子。 | 若你真的数算剩下的日子，有哪件事你会立刻多做、或立刻停下？ |
| 91 | 讲保护，但不是保证永不遇难；是一种更深的荫庇——投靠神的人灵魂有稳妥的隐密处。 | “投靠”神，对你此刻处境，具体会是什么样的一步？ |
| 121 | 上行之诗，先问“我的帮助从何而来”，再把答案指向造天地的主，而非自己的能力。 | 你在盼望“帮助”从哪里来？那个方向承受得起你的重量吗？ |
| 139 | 被完全看透可能可怕，诗139却把它变成安慰：鉴察你的神比你更认识你、更爱你，你逃到海极他的手仍引导扶持。 | 若真有一位比你更懂你、又不离开你的神，这对你今天的孤独或羞耻意味着什么？ |

> 英文 connection/meditation 同义,已在 psalms.html 内(可直接在页面审阅)；如需我把英文也列成表,告诉我。
