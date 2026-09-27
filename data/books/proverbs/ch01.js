/*
 * Proverbs 1 — "The Beginning of Wisdom / 智慧的开端" (master chapter).
 * ---------------------------------------------------------------------------
 * SCRIPTURE (verses[].zh / verses[].en) is quoted VERBATIM from the project's
 * trusted corpus and is verified verse-by-verse by scripts/verify-proverbs-corpus.mjs:
 *   en — World English Bible (WEB, public domain)  · worker/scripture-assets/en/PRO/1.json
 *   zh — 新标点和合本（简体，公共领域, cmn-cu89s）    · worker/scripture-assets/zh/PRO/1.json
 * Every OTHER field (bigIdea, overview, passages, keyVerses, realLife,
 * reflect, prayer, oneThing, dailyChallenge, ask) is STUDY / APPLICATION
 * material prepared for this site — NOT Scripture — and the UI labels it as such.
 * Key-verse and scenario cards reference verses by number; their Scripture text
 * is pulled from verses[] at render time, so it always matches the corpus.
 */
export default {
  n: 1,
  titleZh: '智慧的开端',
  titleEn: 'The Beginning of Wisdom',
  section: 'invitation',
  status: 'full',
  themes: ['fear-of-the-lord', 'wisdom', 'decision-making', 'friendship', 'money', 'parenting', 'temptation', 'consequences', 'listening'],

  bigIdea: {
    zh: '真正的智慧不是从“知道很多”开始，而是从敬畏神、愿意听从正确的教导开始。',
    en: 'Real wisdom doesn’t start with knowing a lot. It starts with honoring God and being willing to listen to good instruction.',
  },

  overview: {
    zh: [
      '《箴言》一开头就说明它的目的：帮助普通人得着智慧、正确的判断力和生活的本领——不只是知道很多，而是懂得怎样好好生活（1:1–6）。',
      '它的根基是“敬畏耶和华”（1:7）：以敬畏、信靠尊崇神，这是真知识的开端。这里的智慧，与其说是聪明，不如说是与神有正确的关系，并且愿意受教。',
      '接着，一位父亲恳切地劝儿子持守父母的教导（1:8–9），并警告他一个很常见的危险：一群朋友邀他去做一件他心里知道不对的事（1:10–19）。诱惑在于归属感、刺激和快速得利——但这条路最终伤害的，正是走这条路的人自己。',
      '在后半章，智慧被描绘成一位在热闹街市上呼喊的女子（1:20–33）。她不是藏在书房里，而是在公开场合呼唤，愿意教导任何肯回转、肯听的人——同时警告：一直忽视她，是有真实后果的。',
      '本章以一个应许作结：“惟有听从我的，必安然居住”（1:33）。智慧主要不是为了避免犯错，而是为了在亲近神中过一种安稳、不惧怕的生活。',
    ],
    en: [
      'Proverbs opens by telling us what it is for: to help ordinary people gain wisdom, good judgment, and skill for living — not just facts, but knowing how to live well (1:1–6).',
      'Its foundation is “the fear of the LORD” (1:7): a reverent trust in God that is the starting point of real knowledge. Wisdom here is less about being clever and more about being rightly related to God and willing to be taught.',
      'A father then pleads with his son to hold on to his parents’ teaching (1:8–9) and warns him about a very common danger: a group of friends inviting him into something he knows is wrong (1:10–19). The lure is belonging, excitement, and quick gain — but the path ends up harming the very people who take it.',
      'In the second half, Wisdom is pictured as a woman calling aloud in the busy street (1:20–33). She is not hidden away; she calls in public, ready to teach anyone who will turn and listen — while warning that ignoring her has real consequences.',
      'The chapter closes with a promise: “whoever listens to me will dwell securely” (1:33). Wisdom is not mainly about avoiding mistakes; it is about a settled, unafraid life lived close to God.',
    ],
  },

  keyVerseRef: 'Proverbs 1:7',

  verses: [
    { v: 1, zh: '以色列王大卫儿子所罗门的箴言：', en: 'The proverbs of Solomon, the son of David, king of Israel:' },
    { v: 2, zh: '要使人晓得智慧和训诲， 分辨通达的言语，', en: 'to know wisdom and instruction; to discern the words of understanding;' },
    { v: 3, zh: '使人处事领受智慧、 仁义、公平、正直的训诲，', en: 'to receive instruction in wise dealing, in righteousness, justice, and equity;' },
    { v: 4, zh: '使愚人灵明， 使少年人有知识和谋略，', en: 'to give prudence to the simple, knowledge and discretion to the young man—' },
    { v: 5, zh: '使智慧人听见，增长学问， 使聪明人得着智谋，', en: 'that the wise man may hear, and increase in learning; that the man of understanding may attain to sound counsel;' },
    { v: 6, zh: '使人明白箴言和譬喻， 懂得智慧人的言词和谜语。', en: 'to understand a proverb and parables, the words and riddles of the wise.' },
    { v: 7, zh: '敬畏耶和华是知识的开端； 愚妄人藐视智慧和训诲。', en: 'The fear of the LORD is the beginning of knowledge, but the foolish despise wisdom and instruction.' },
    { v: 8, zh: '我儿，要听你父亲的训诲， 不可离弃你母亲的法则；', en: 'My son, listen to your father’s instruction, and don’t forsake your mother’s teaching;' },
    { v: 9, zh: '因为这要作你头上的华冠， 你项上的[金]链。', en: 'for they will be a garland to grace your head, and chains around your neck.' },
    { v: 10, zh: '我儿，恶人若引诱你， 你不可随从。', en: 'My son, if sinners entice you, don’t consent.' },
    { v: 11, zh: '他们若说：你与我们同去， 我们要埋伏流人之血， 要蹲伏害无罪之人；', en: 'If they say, “Come with us. Let’s lie in wait for blood. Let’s lurk secretly for the innocent without cause.' },
    { v: 12, zh: '我们好像阴间，把他们活活吞下； 他们如同下坑的人， 被我们囫囵吞了；', en: 'Let’s swallow them up alive like Sheol, and whole, like those who go down into the pit.' },
    { v: 13, zh: '我们必得各样宝物， 将所掳来的，装满房屋；', en: 'We’ll find all valuable wealth. We’ll fill our houses with plunder.' },
    { v: 14, zh: '你与我们大家同分， 我们共用一个囊袋；', en: 'You shall cast your lot among us. We’ll all have one purse”—' },
    { v: 15, zh: '我儿，不要与他们同行一道， 禁止你脚走他们的路。', en: 'my son, don’t walk on the path with them. Keep your foot from their path,' },
    { v: 16, zh: '因为，他们的脚奔跑行恶； 他们急速流人的血，', en: 'for their feet run to evil. They hurry to shed blood.' },
    { v: 17, zh: '好像飞鸟， 网罗设在眼前仍不躲避。', en: 'For the net is spread in vain in the sight of any bird;' },
    { v: 18, zh: '这些人埋伏，是为自流己血； 蹲伏，是为自害己命。', en: 'but these lay in wait for their own blood. They lurk secretly for their own lives.' },
    { v: 19, zh: '凡贪恋财利的，所行之路都是如此； 这贪恋之心乃夺去得财者之命。', en: 'So are the ways of everyone who is greedy for gain. It takes away the life of its owners.' },
    { v: 20, zh: '智慧在街市上呼喊， 在宽阔处发声，', en: 'Wisdom calls aloud in the street. She utters her voice in the public squares.' },
    { v: 21, zh: '在热闹街头喊叫， 在城门口，在城中发出言语，', en: 'She calls at the head of noisy places. At the entrance of the city gates, she utters her words:' },
    { v: 22, zh: '说：你们愚昧人喜爱愚昧， 亵慢人喜欢亵慢， 愚顽人恨恶知识，要到几时呢？', en: '“How long, you simple ones, will you love simplicity? How long will mockers delight themselves in mockery, and fools hate knowledge?' },
    { v: 23, zh: '你们当因我的责备回转； 我要将我的灵浇灌你们， 将我的话指示你们。', en: 'Turn at my reproof. Behold, I will pour out my spirit on you. I will make known my words to you.' },
    { v: 24, zh: '我呼唤，你们不肯听从； 我伸手，无人理会；', en: 'Because I have called, and you have refused; I have stretched out my hand, and no one has paid attention;' },
    { v: 25, zh: '反轻弃我一切的劝戒， 不肯受我的责备。', en: 'but you have ignored all my counsel, and wanted none of my reproof;' },
    { v: 26, zh: '你们遭灾难，我就发笑； 惊恐临到你们，我必嗤笑。', en: 'I also will laugh at your disaster. I will mock when calamity overtakes you,' },
    { v: 27, zh: '惊恐临到你们，好像狂风； 灾难来到，如同暴风； 急难痛苦临到你们身上。', en: 'when calamity overtakes you like a storm, when your disaster comes on like a whirlwind, when distress and anguish come on you.' },
    { v: 28, zh: '那时，你们必呼求我，我却不答应， 恳切地寻找我，却寻不见。', en: 'Then they will call on me, but I will not answer. They will seek me diligently, but they will not find me,' },
    { v: 29, zh: '因为，你们恨恶知识， 不喜爱敬畏耶和华，', en: 'because they hated knowledge, and didn’t choose the fear of the LORD.' },
    { v: 30, zh: '不听我的劝戒， 藐视我一切的责备，', en: 'They wanted none of my counsel. They despised all my reproof.' },
    { v: 31, zh: '所以必吃自结的果子， 充满自设的计谋。', en: 'Therefore they will eat of the fruit of their own way, and be filled with their own schemes.' },
    { v: 32, zh: '愚昧人背道，必杀己身； 愚顽人安逸，必害己命。', en: 'For the backsliding of the simple will kill them. The careless ease of fools will destroy them.' },
    { v: 33, zh: '惟有听从我的，必安然居住， 得享安静，不怕灾祸。', en: 'But whoever listens to me will dwell securely, and will be at ease, without fear of harm.”' },
  ],

  // UNDERSTAND THE PASSAGE — four segments, each with what it says / means / for me.
  passages: [
    {
      vFrom: 1, vTo: 7, rangeLabel: 'Proverbs 1:1–7', titleZh: '智慧的目的', titleEn: 'The Purpose of Wisdom',
      sayZh: '所罗门为整卷书开场：这些箴言是为了使人得着智慧、训诲、聪明与公平的处事之道；并点出这一切的根基——敬畏耶和华。',
      sayEn: 'Solomon introduces the whole book: these proverbs are given so people can gain wisdom, discipline, understanding, and fair dealing — and names the foundation of it all: the fear of the LORD.',
      meanZh: '《箴言》里的智慧是生活的实用本领，不只是资讯。它有一个起点：尊崇神。把神撇在一边的知识也许很聪明，却还不是智慧。',
      meanEn: 'Wisdom in Proverbs is practical skill for living, not just information. And it has a starting point: honoring God. Knowledge that leaves God out may be clever, but it is not yet wisdom.',
      forMeZh: '在我追求更多知识之前，我可以先问一个更深的问题：我是否愿意让神成为我思考与选择的起点？',
      forMeEn: 'Before I chase more information, I can ask a deeper question: am I willing to let God be the starting point of how I think and choose?',
    },
    {
      vFrom: 8, vTo: 19, rangeLabel: 'Proverbs 1:8–19', titleZh: '谨慎选择你走的道路', titleEn: 'Choose Your Path Carefully',
      sayZh: '父亲劝儿子持守父母的教导，然后警告他：若恶人引诱他靠伤害别人得利，他绝不可随从——这条路最终毁灭的正是走它的人。',
      sayEn: 'A father urges his son to keep his parents’ teaching, then warns him: if sinners invite him to gain by harming others, he must not go along — that road destroys the ones who walk it.',
      meanZh: '危险的不只是那件错事，还有群体的拉力和快速得利的诱惑。《箴言》很诚实：贪心与不义之财看似刺激，结局却是损失。',
      meanEn: 'The danger is not only the wrong act, but the pull of the group and the promise of quick gain. Proverbs is honest: greed and dishonest gain look exciting but end in loss.',
      forMeZh: '当一个群体把我拉向一件我知道不对的事，智慧就是那份说“我不随从”的自由——即使这会让我失去归属感。',
      forMeEn: 'When a group pulls me toward something I know is wrong, wisdom is the freedom to say, “I won’t go along” — even when it costs me belonging.',
    },
    {
      vFrom: 20, vTo: 27, rangeLabel: 'Proverbs 1:20–27', titleZh: '智慧在呼唤', titleEn: 'Wisdom Calls',
      sayZh: '智慧被描绘成一位女子，在街市和城门口高声呼喊，问人还要爱慕愚昧、拒绝责备到几时。',
      sayEn: 'Wisdom is pictured as a woman calling aloud in the street and at the city gates, asking how long people will love foolishness and reject correction.',
      meanZh: '智慧不是隐藏的、也不是精英专属；它在公开场合呼唤，向任何肯回转、肯听的人敞开。但它也警告：一直忽视智慧，会带来真实的患难。',
      meanEn: 'Wisdom is not hidden or elite; it calls out in public, available to anyone who will turn and listen. But it also warns: there is a point where ignoring wisdom brings real trouble.',
      forMeZh: '智慧很可能已经在我的生活中“呼唤”——透过圣经、智慧人、良心。问题是我现在就回转聆听，还是等患难逼我才听。',
      forMeEn: 'Wisdom is probably already “calling” in my life — through Scripture, wise people, conscience. The question is whether I turn and listen now, or wait until trouble forces me.',
    },
    {
      vFrom: 28, vTo: 33, rangeLabel: 'Proverbs 1:28–33', titleZh: '听从智慧', titleEn: 'Listen to Wisdom',
      sayZh: '那些拒绝智慧的人，有一天寻求它却寻不见，因为他们恨恶知识、不肯选择敬畏耶和华；惟有听从的，必安然居住，不怕灾祸。',
      sayEn: 'Those who refused wisdom will one day call for it and not find it, because they hated knowledge and did not choose the fear of the LORD; but whoever listens will live securely, without fear of harm.',
      meanZh: '选择会随时间结出后果。这不是神严厉，而是长久拒绝受教的自然结果。此刻门仍开着——邀请就是：趁着还是今天，就听。',
      meanEn: 'Choices have consequences that ripen over time. This is not God being harsh; it is the natural fruit of a settled refusal to be taught. The door stays open now — the invitation is to listen while it is still today.',
      forMeZh: '我是否在平顺的时候就养成听从智慧的习惯，而不是等到一切崩溃才呼求？',
      forMeEn: 'Am I building the habit of listening to wisdom while things are calm, rather than only crying out when things fall apart?',
    },
  ],

  // KEY VERSES — Scripture text is pulled from verses[v] at render time (always corpus-exact).
  keyVerses: [
    { v: 7, meansZh: '敬畏耶和华——以敬畏之心信靠他——是真知识的开端。', meansEn: 'The fear of the LORD — reverent trust in him — is where real knowledge begins.', mattersZh: '它重整了一切：智慧首先不在于智商或资讯，而在于以谁为中心。', mattersEn: 'It reorders everything: wisdom is not first about IQ or information, but about who is at the center.', todayZh: '今天，在一个决定上先诚实地问神，而不是先做决定、事后才祷告。', todayEn: 'Begin one decision today by honestly asking God, instead of deciding first and praying later.' },
    { v: 8, meansZh: '要持守父母的训诲；它是为了给你恩典与保护。', meansEn: 'Hold on to the instruction of your father and mother; it is meant to grace and protect you.', mattersZh: '智慧常常最先透过养育我们的人临到；藐视一切责备不是独立，而是愚昧。', mattersEn: 'Wisdom often comes first through the people who raised us; despising all correction is not independence but folly.', todayZh: '有没有一句我太快否定的教导，值得我重新掂量？', todayEn: 'Is there past guidance I dismissed too quickly that is worth weighing again?' },
    { v: 10, meansZh: '“我儿，恶人若引诱你，你不可随从。”第一道防线，就是一个清楚的“不”。', meansEn: '“My son, if sinners entice you, don’t consent.” The first line of defense is a clear no.', mattersZh: '大多数走偏，都始于对错误同伴的一个小小的“好”；能拒绝的力量，就是真智慧。', mattersEn: 'Most wrong turns start with a small yes to the wrong company; the power to refuse is real wisdom.', todayZh: '在压力来临之前，先想好一件你要拒绝的事。', todayEn: 'Name in advance one thing you will say no to, before the pressure comes.' },
    { v: 19, meansZh: '贪恋不义之财，会悄悄夺去追逐者自己的性命。', meansEn: 'Greed for dishonest gain quietly takes the life of the one who chases it.', mattersZh: '《箴言》点出“轻松得来的钱”的真实代价：它从来不像看上去那么免费。', mattersEn: 'Proverbs traces the real cost of “easy money”: it is never as free as it looks.', todayZh: '我在哪里被试探走捷径，因为“大家都这样”或“不会有人知道”？', todayEn: 'Where am I tempted to cut a corner because “everyone does it” or “no one will know”?' },
    { v: 33, meansZh: '“惟有听从我的，必安然居住，得享安静，不怕灾祸。”智慧带来安稳、不惧怕的生活。', meansEn: '“Whoever listens to me will dwell securely, and will be at ease, without fear of harm.” Wisdom leads to a settled, unafraid life.', mattersZh: '智慧的目标不是害怕惩罚，而是在神里面的安稳。', mattersEn: 'The goal of wisdom is not fear of punishment but security in God.', todayZh: '在我此刻最担心的那个决定上，“安然居住”会是什么样子？', todayEn: 'What would “dwelling securely” look like in the decision that worries me most right now?' },
  ],

  // WISDOM FOR REAL LIFE — scenarios. `verseRef` links to Scripture; scenario text is application, not Scripture.
  realLife: [
    { tag: 'FRIENDS', tagZh: '朋友', verseRef: 'Proverbs 1:10',
      titleZh: '当朋友邀你做错事', titleEn: 'When friends invite you into something wrong',
      bodyZh: '朋友邀你去做一件你心里隐隐知道不对的事。箴言 1:10 没有说“找个聪明的借口”，而是直接说“你不可随从”。智慧就是在还没陷太深之前说“不”的自由——即使这会让你失去归属感。你可以善待人，却不必跟从人。',
      bodyEn: 'A friend asks you to do something you quietly know isn’t right. Proverbs 1:10 doesn’t say “find a clever excuse” — it says, plainly, “don’t consent.” Wisdom is the freedom to say no before you are in too deep, even when it costs you belonging. You can be kind to people without following them.' },
    { tag: 'MONEY', tagZh: '金钱', verseRef: 'Proverbs 1:19',
      titleZh: '“快钱”与“大家都这样”', titleEn: '“Quick money” and “everyone does it”',
      bodyZh: '“很快。”“大家都这样。”“不会被发现。”《箴言》警告：贪恋不义之财，会悄悄让追逐它的人付出代价（1:19）。问题不在于金钱本身是坏的，而在于不义之财与贪心会带来迟来的后果。古代的埋伏抢夺，与现代的走捷径并不相同——但原则一样：需要靠不诚实才能得到的“利益”，其实不是利益。',
      bodyEn: '“It’s fast.” “Everyone does it.” “No one will find out.” Proverbs warns that greed for dishonest gain quietly costs the one who chases it (1:19). The point is not that money is bad, but that dishonest gain and greed carry consequences that arrive later. An ancient ambush is not the same as a modern shortcut — but the principle holds: gain that needs dishonesty is not really gain.' },
    { tag: 'PARENTING & FAMILY', tagZh: '父母与家庭', verseRef: 'Proverbs 1:8',
      titleZh: '父母的教导与孩子自己的选择', titleEn: 'Parents’ guidance and a child’s own choices',
      bodyZh: '箴言 1:8–9 请孩子持守父母的教导，把它比作“华冠”，使人得体面与尊荣。它没有说父母永远正确；它说的是：智慧的教导值得持守。对孩子而言，智慧包括：不要为了想显得独立，就丢弃好的教导。对父母而言，这幅图画是恩典与尊荣，不是控制。',
      bodyEn: 'Proverbs 1:8–9 asks a child to hold on to a parent’s teaching, picturing it as a “garland” that graces and honors them. It does not say parents are always right; it says wise guidance is worth keeping. For children, wisdom includes not throwing away good instruction just to feel independent. For parents, the picture is grace and honor, not control.' },
    { tag: 'DECISION MAKING', tagZh: '做决定', verseRef: 'Proverbs 1:7',
      titleZh: '当你不知道该怎么选', titleEn: 'When you don’t know how to choose',
      bodyZh: '当一个决定让你卡住，《箴言》把你带回起点：敬畏耶和华是知识的开端（1:7）。这意味着智慧常常不是从更多分析开始，而是从一种姿态开始——诚实地把这个选择带到神面前，并愿意去行那正确的事，即使你还不知道结果。',
      bodyEn: 'When a decision has you stuck, Proverbs sends you back to the beginning: the fear of the LORD is where knowledge starts (1:7). Wisdom often begins not with more analysis but with a posture — honestly bringing the choice to God and being willing to do what is right, even before you know the outcome.' },
    { tag: 'WARNING SIGNS', tagZh: '危险信号', verseRef: null,
      titleZh: '该停下来重新考虑的信号', titleEn: 'Signs it’s time to stop and reconsider',
      bodyZh: '一些诚实的危险信号，提醒你这个决定需要重新考虑：它需要靠撒谎才行得通；它需要被隐瞒；它主要是被群体压力推动；贪心已经成为主要动机；你不得不一再说服自己去做。（这些是供反思的实用提示，不是圣经经文。）',
      bodyEn: 'Some honest warning signs that a decision needs a second look: it needs a lie to work; it needs to be hidden; it is driven mainly by pressure from a group; greed has become the main motive; you keep having to talk yourself into it. (These are practical prompts for reflection, not Bible verses.)' },
  ],

  reflect: [
    { zh: '最近有没有一个决定，我其实知道什么是正确的，却仍然想选择另一条路？', en: 'Is there a recent decision where I actually knew the right thing, but still wanted to take the other road?' },
    { zh: '朋友或群体的意见，会不会让我忽略自己的良知和信仰？', en: 'Do the opinions of friends or a group ever quiet my own conscience and faith?' },
    { zh: '我通常是在做决定之前寻求智慧，还是出问题以后才寻求？', en: 'Do I usually seek wisdom before a decision, or only after something goes wrong?' },
    { zh: '金钱、成功、面子或别人的认可，会不会影响我的判断？', en: 'Do money, success, image, or others’ approval quietly bend my judgment?' },
    { zh: '“敬畏神”如果落实到我今天的生活，会改变我的哪一个决定？', en: 'If “the fear of the LORD” actually shaped my day today, which single decision would change?' },
  ],

  prayer: {
    zh: '神啊，我想要有智慧，但我知道自己常常先做决定、事后才问你。求你使敬畏耶和华成为我的起点。帮助我聆听——听你的话、听智慧人、听自己的良心。求你赐我看清事情的判断力，也赐我勇气，在别人都随从的时候仍能对错的事说“不”。保守我远离贪心和错误群体的拉力，赐我谦卑领受责备的心。帮助我今天就选择那正确的事。阿们。',
    en: 'God, I want to be wise, but I know I often decide first and ask later. Make the fear of the LORD my starting point. Help me listen — to your word, to wise people, to my conscience. Give me discernment to see clearly, and courage to say no to what is wrong, even when others are going along. Guard me from greed and from the pull of the wrong crowd, and give me the humility to receive correction. Help me choose what is right today. Amen.',
  },

  // A short takeaway (summary, NOT Scripture). It echoes 1:7, which is shown verbatim in Key Verses.
  oneThing: {
    zh: '智慧，从敬畏耶和华开始。',
    en: 'Wisdom begins with the fear of the LORD.',
  },

  // A concrete application prompt (NOT Scripture).
  dailyChallenge: {
    zh: '今天在做一个重要决定以前，先停一下问自己：“这在神眼中是智慧的选择吗？”',
    en: 'Before making one important decision today, stop and ask: “Is this wise in God’s eyes?”',
  },

  ask: {
    promptsZh: ['“敬畏耶和华”是什么意思？', '我怎样才能变得更有智慧？', '我怎么知道朋友是不是在对我有坏影响？', '《箴言》怎样教导金钱？', '基督徒该怎样做决定？'],
    promptsEn: ['What does “the fear of the LORD” mean?', 'How can I become wiser?', 'How do I know when friends are influencing me badly?', 'What does Proverbs teach about money?', 'How should Christians make decisions?'],
  },

  sources: {
    zh: '新标点和合本（简体，公共领域）',
    en: 'World English Bible (WEB, Public Domain)',
    sourceUrl: 'https://ebible.org/',
  },
};
