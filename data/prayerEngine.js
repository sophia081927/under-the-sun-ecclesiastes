/* ============================================================
   prayerEngine.js — Intercessory Prayer Engine · 圣经代祷关怀舱
   ------------------------------------------------------------
   Local, no-API, bilingual (zh / en) prayer matching for the
   Bible Library. A person writes what they are carrying; we
   quietly identify the theme and return a Scripture-grounded
   intercessory prayer. Crisis language is checked FIRST and
   reuses the shared, tested crisis card from qaEngine.

   This is NOT a chatbot and NOT an AI. It is a small, honest
   keyword map to human-written prayers. No external calls, no
   speech synthesis, no persistence.

   Public API:
     prayerRegistry                     — array of prayer topics
     getPrayerResponse(input, lang)      — main entry
     resolvePrayerById(id, lang)         — re-resolve (language toggle)
     getGeneralPrayer(lang)              — warm general prayer

   A prayer response object:
     { id, title, scripture, prayerBody, audioPathZh?, audioPathEn?, crisis? }

   MATCHING ORDER:
     (1) crisis (always first, bypasses everything)
     (2) topic keyword match — LONGEST matched keyword wins; a tie on
         length is broken by the topic's `priority` (lower wins).
     (3) warm general prayer — only when nothing matches.
   No user-facing "no match / database / fallback" wording ever.
   ============================================================ */

import { detectCrisis, getCrisisResponse } from './qaEngine.js';

/* Soft, optional prayer-sanctuary background music. Same local ambient track for
   every topic; user-controlled only (never autoplayed) and looped in the panel. */
export const AMBIENT_ZH = 'audio/ambient/prayer-sanctuary-zh.mp3';
export const AMBIENT_EN = 'audio/ambient/prayer-sanctuary-en.mp3';

/* Prayer trigger words — a person naming a burden often says "为我祷告 / pray for
   me" before they know how to ask a theological question. Exported so the Q&A
   surface can gently hand off to the Prayer Sanctuary Board when it sees one. */
export const PRAYER_TRIGGERS = {
  zh: ['祷告', '代祷', '请为我祷告', '帮我祷告', '为我祷告'],
  en: ['pray', 'prayer', 'please pray', 'pray for me', 'intercede']
};
export function isPrayerRequest(input) {
  const s = (input || '').toLowerCase();
  return PRAYER_TRIGGERS.zh.some((k) => s.includes(k)) ||
         PRAYER_TRIGGERS.en.some((k) => s.includes(k.toLowerCase()));
}

export const prayerRegistry = [
  {
    id: 'family_marriage',
    priority: 5,
    keywordsZh: ['婚姻', '家庭', '老公', '先生', '丈夫', '老婆', '妻子', '吵架', '冷战', '离婚', '关系破裂', '沟通不了'],
    keywordsEn: ['marriage', 'family', 'husband', 'wife', 'divorce', 'relationship', 'conflict', 'separation', 'communication'],
    audioPathZh: 'audio/prayers/family-marriage-zh.mp3',
    audioPathEn: 'audio/prayers/family-marriage-en.mp3',
    ambientPathZh: AMBIENT_ZH,
    ambientPathEn: AMBIENT_EN,
    zh: {
      title: '为家庭与婚姻关系的医治代祷',
      scripture: '【以弗所书 4:32】“并要以恩慈相待，存怜悯的心，彼此饶恕，正如神在基督里饶恕了你们一样。”',
      prayerBody: '天父，我将这位带着家庭与婚姻重担来到你面前的儿女交托在你手中。你知道每一声叹息背后的委屈，也看见每一个无法沟通的破口。求你把十字架上的爱带进这个关系里，拿去骄傲、控诉、冷漠与伤害，赐下恩慈、怜悯、诚实沟通和彼此饶恕的力量。若这段关系仍有可以修复的地方，求你亲自医治、保护并引导；若正在经历很深的伤害，也求你赐下智慧、边界、帮助和安全。愿你成为这个家庭的盾牌，也成为这颗疲惫心灵的安慰。奉主耶稣基督的名祷告，阿们。'
    },
    en: {
      title: 'Intercession for Marriage and Family Healing',
      scripture: 'Ephesians 4:32 — “Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.”',
      prayerBody: 'Heavenly Father, I lift up Your child who brings the burden of marriage and family before You. You see every hidden tear, every weary sigh, and every place where communication has broken down. Bring the love of the cross into this relationship. Remove pride, accusation, coldness, and old wounds. Give kindness, compassion, honest communication, and the strength to forgive. Where restoration is possible, please heal, protect, and guide. Where there has been deep hurt, give wisdom, boundaries, help, and safety. Be the shield over this home and the comfort of this tired heart. In the name of Jesus Christ, Amen.'
    }
  },

  {
    id: 'future_career',
    priority: 4,
    keywordsZh: ['前途', '未来', '工作', '找工作', '事业', '学业', '考试', '申请', '大学', '迷茫', '方向', '选择'],
    keywordsEn: ['future', 'career', 'job', 'work', 'school', 'exam', 'application', 'college', 'direction', 'decision', 'confused'],
    audioPathZh: 'audio/prayers/future-career-zh.mp3',
    audioPathEn: 'audio/prayers/future-career-en.mp3',
    ambientPathZh: AMBIENT_ZH,
    ambientPathEn: AMBIENT_EN,
    zh: {
      title: '为前方道路的方向与交托代祷',
      scripture: '【诗篇 119:105】“你的话是我脚前的灯，是我路上的光。”',
      prayerBody: '阿爸父神，当我看不清前面的道路，为学业、工作、选择和未来感到焦虑时，我来到你面前。求你不要让我被恐惧牵着走，也不要让我只靠自己的聪明判断一切。求你的话成为我脚前的灯、路上的光，一步一步引导我。若有门是你要打开的，求你赐我信心走进去；若有门不是你的心意，求你也温柔拦阻。求你赐下智慧、耐心、勇气和清楚的方向，让我在未知中仍然学习信靠你。奉主耶稣基督的名祷告，阿们。'
    },
    en: {
      title: 'Intercession for Direction and the Future',
      scripture: 'Psalm 119:105 — “Your word is a lamp for my feet, a light on my path.”',
      prayerBody: 'Abba Father, when the road ahead feels unclear and I feel anxious about school, work, decisions, and the future, I come before You. Do not let fear lead me, and do not let me rely only on my own understanding. Let Your Word be a lamp to my feet and a light to my path. If there is a door You want to open, give me faith to walk through it. If a door is not from You, gently redirect me. Give me wisdom, patience, courage, and clarity, and teach me to trust You even in the unknown. In the name of Jesus Christ, Amen.'
    }
  },

  {
    id: 'health_body',
    priority: 4,
    keywordsZh: ['身体', '健康', '生病', '病痛', '疼痛', '检查', '手术', '治疗', '失眠', '疲惫', '害怕生病'],
    keywordsEn: ['health', 'body', 'sick', 'illness', 'pain', 'treatment', 'surgery', 'medical', 'insomnia', 'tired'],
    audioPathZh: 'audio/prayers/health-body-zh.mp3',
    audioPathEn: 'audio/prayers/health-body-en.mp3',
    ambientPathZh: AMBIENT_ZH,
    ambientPathEn: AMBIENT_EN,
    zh: {
      title: '为身体健康与内心平安代祷',
      scripture: '【诗篇 34:18】“耶和华靠近伤心的人，拯救灵性痛悔的人。”',
      prayerBody: '主啊，我把身体的软弱、疼痛、担忧和不确定交托给你。你知道我里面的害怕，也知道我承受的疲惫。求你亲自靠近我，赐下医治、力量和平安。也求你带领医生、检查、治疗和所有决定，让我在每一步都不孤单。即使身体软弱，求你扶持我的心；即使还没有答案，求你让我知道你与我同在。奉主耶稣基督的名祷告，阿们。'
    },
    en: {
      title: 'Intercession for Health and Inner Peace',
      scripture: 'Psalm 34:18 — “The Lord is close to the brokenhearted and saves those who are crushed in spirit.”',
      prayerBody: 'Lord, I bring my physical weakness, pain, worry, and uncertainty before You. You know my fear and You see my exhaustion. Draw near to me with healing, strength, and peace. Guide the doctors, tests, treatments, and every decision ahead. Let me know that I am not alone. Even when my body feels weak, strengthen my heart. Even when I do not yet have answers, help me rest in Your presence. In the name of Jesus Christ, Amen.'
    }
  },

  {
    id: 'children_family',
    priority: 4,
    keywordsZh: ['孩子', '儿子', '女儿', '小孩', '亲子', '教育', '青春期', '学习', '学校', '为孩子祷告'],
    keywordsEn: ['child', 'children', 'son', 'daughter', 'parenting', 'school', 'teenager', 'education', 'pray for my child'],
    audioPathZh: 'audio/prayers/children-family-zh.mp3',
    audioPathEn: 'audio/prayers/children-family-en.mp3',
    ambientPathZh: AMBIENT_ZH,
    ambientPathEn: AMBIENT_EN,
    zh: {
      title: '为孩子与亲子关系代祷',
      scripture: '【箴言 22:6】“教养孩童，使他走当行的道，就是到老他也不偏离。”',
      prayerBody: '天父，我把我的孩子交在你手中。你比我更认识他们，也比我更知道他们里面的需要、挣扎、恩赐和道路。求你保护他们的心，带领他们远离伤害与诱惑，赐给他们智慧、良善、勇气和敬畏你的心。也求你帮助我成为更有耐心、更有智慧、更懂得倾听和引导的父母。愿我们的家不是充满压力和控制，而是有真理、爱、沟通和恩典。奉主耶稣基督的名祷告，阿们。'
    },
    en: {
      title: 'Intercession for Children and Parenting',
      scripture: 'Proverbs 22:6 — “Start children off on the way they should go, and even when they are old they will not turn from it.”',
      prayerBody: 'Heavenly Father, I place my child in Your hands. You know them better than I do. You see their needs, struggles, gifts, and future. Protect their heart, guide them away from harm and temptation, and give them wisdom, kindness, courage, and a heart that seeks You. Help me become a parent with more patience, wisdom, listening, and grace. Let our home be shaped not by pressure and control, but by truth, love, communication, and mercy. In the name of Jesus Christ, Amen.'
    }
  },

  {
    id: 'anxiety_peace',
    priority: 5,
    keywordsZh: ['焦虑', '忧虑', '担心', '害怕', '压力', '睡不着', '心慌', '紧张', '撑不住'],
    keywordsEn: ['anxiety', 'anxious', 'worry', 'worried', 'fear', 'stress', 'panic', 'cannot sleep', 'restless'],
    audioPathZh: 'audio/prayers/anxiety-peace-zh.mp3',
    audioPathEn: 'audio/prayers/anxiety-peace-en.mp3',
    ambientPathZh: AMBIENT_ZH,
    ambientPathEn: AMBIENT_EN,
    zh: {
      title: '为焦虑中的平安代祷',
      scripture: '【腓立比书 4:6-7】“应当一无挂虑，只要凡事借着祷告、祈求和感谢，将你们所要的告诉神。神所赐出人意外的平安，必在基督耶稣里保守你们的心怀意念。”',
      prayerBody: '主啊，我把我的焦虑、压力和无法安静的心交给你。我承认自己常常想靠掌控一切来获得安全感，却因此更加疲惫。求你帮助我把所担心的事一件一件告诉你，把我紧握不放的重担交在你手里。求你赐下出人意外的平安，保守我的心怀意念，让我今天不被恐惧牵着走，而是在基督里重新得安息。奉主耶稣基督的名祷告，阿们。'
    },
    en: {
      title: 'Intercession for Peace in Anxiety',
      scripture: 'Philippians 4:6-7 — “Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.”',
      prayerBody: 'Lord, I bring my anxiety, pressure, and restless heart to You. I confess that I often try to gain security by controlling everything, and it leaves me exhausted. Help me bring each worry before You and release the burdens I have been holding tightly. Give me the peace that surpasses understanding, and guard my heart and mind in Christ Jesus. Let fear no longer lead me today; lead me instead into Your rest. In the name of Jesus Christ, Amen.'
    }
  },

  {
    id: 'insecurity_safety',
    priority: 5,
    keywordsZh: ['没有安全感', '不安全', '害怕失去', '怕被抛弃', '心里不踏实', '没人保护', '缺乏安全感', '孤单无助'],
    keywordsEn: ['insecure', 'insecurity', 'unsafe', 'afraid of losing', 'afraid of being abandoned', 'no sense of security', 'not protected'],
    audioPathZh: 'audio/prayers/insecurity-safety-zh.mp3',
    audioPathEn: 'audio/prayers/insecurity-safety-en.mp3',
    ambientPathZh: AMBIENT_ZH,
    ambientPathEn: AMBIENT_EN,
    zh: {
      title: '为缺乏安全感的心代祷',
      scripture: '【诗篇 46:1】“神是我们的避难所，是我们的力量，是我们在患难中随时的帮助。”',
      prayerBody: '主啊，我把心里的不安、害怕和缺乏安全感带到你面前。很多时候，我想抓住环境、关系、金钱或人的肯定，好让自己觉得安全。但我承认，这些都不能真正托住我的心。求你让我知道，你是我的避难所，是我的力量，是我在患难中随时的帮助。求你用你不改变的爱安定我，让我在不可控的人生里，仍然知道自己被你看见、被你保护、被你托住。奉主耶稣基督的名祷告，阿们。'
    },
    en: {
      title: 'Intercession for a Heart That Feels Insecure',
      scripture: 'Psalm 46:1 — “God is our refuge and strength, an ever-present help in trouble.”',
      prayerBody: 'Lord, I bring my insecurity, fear, and need for safety before You. So often I try to find security in circumstances, relationships, money, or human approval, but none of these can truly hold my heart. Teach me to know You as my refuge and strength, my ever-present help in trouble. Steady me with Your unchanging love, and help me remember that even when life feels uncertain, I am seen, protected, and held by You. In the name of Jesus Christ, Amen.'
    }
  },

  {
    id: 'loneliness_comfort',
    priority: 4,
    keywordsZh: ['孤独', '孤单', '没人懂我', '没人陪', '没人理解', '被遗忘', '一个人'],
    keywordsEn: ['lonely', 'alone', 'no one understands me', 'forgotten', 'abandoned', 'no one is with me'],
    audioPathZh: 'audio/prayers/loneliness-comfort-zh.mp3',
    audioPathEn: 'audio/prayers/loneliness-comfort-en.mp3',
    ambientPathZh: AMBIENT_ZH,
    ambientPathEn: AMBIENT_EN,
    zh: {
      title: '为孤独中渴望被看见的心代祷',
      scripture: '【诗篇 139:1】“耶和华啊，你已经鉴察我，认识我。”',
      prayerBody: '主啊，我把这颗觉得孤独、无人理解、渴望被看见的心带到你面前。也许人看不见我真正的疲惫，也许我说不出口内心深处的孤单，但你认识我。你知道我的坐下、起来，也知道我未出口的话。求你让我在孤独中经历你的同在，在沉默中听见你的安慰。求你也为我预备合适的人、关系和属灵陪伴，让我不再觉得自己必须一个人承担一切。奉主耶稣基督的名祷告，阿们。'
    },
    en: {
      title: 'Intercession for a Lonely Heart Longing to Be Seen',
      scripture: 'Psalm 139:1 — “You have searched me, Lord, and you know me.”',
      prayerBody: 'Lord, I bring before You the heart that feels lonely, unseen, and misunderstood. People may not see my exhaustion, and I may not know how to express the loneliness deep within me, but You know me. You know when I sit and when I rise; You know the words before they are spoken. Let me experience Your presence in loneliness and Your comfort in silence. Please also provide the right people, relationships, and spiritual companionship, so I do not feel I must carry everything alone. In the name of Jesus Christ, Amen.'
    }
  },

  {
    id: 'knowing_jesus',
    priority: 5,
    keywordsZh: ['认识耶稣', '信耶稣', '接受耶稣', '我想认识神', '我想信主', '耶稣是谁'],
    keywordsEn: ['know jesus', 'believe in jesus', 'accept jesus', 'know god', 'follow jesus', 'who is jesus'],
    audioPathZh: 'audio/prayers/knowing-jesus-zh.mp3',
    audioPathEn: 'audio/prayers/knowing-jesus-en.mp3',
    ambientPathZh: AMBIENT_ZH,
    ambientPathEn: AMBIENT_EN,
    zh: {
      title: '为开始认识耶稣代祷',
      scripture: '【约翰福音 14:6】耶稣说：“我就是道路、真理、生命；若不借着我，没有人能到父那里去。”',
      prayerBody: '主耶稣，我也许还不完全认识你，但我愿意把真实的自己带到你面前。求你向我显明你是谁，让我认识你是道路、真理、生命。求你带领我走出迷茫、怀疑和黑暗，让我不只是知道一些关于你的事情，而是真的开始认识你、信靠你、跟随你。若我的心还害怕或不确定，求你用温柔和真光引导我。奉主耶稣基督的名祷告，阿们。'
    },
    en: {
      title: 'Intercession for Beginning to Know Jesus',
      scripture: 'John 14:6 — Jesus answered, “I am the way and the truth and the life.”',
      prayerBody: 'Lord Jesus, I may not fully know You yet, but I bring my real self before You. Reveal to me who You are. Help me know You as the Way, the Truth, and the Life. Lead me out of confusion, doubt, and darkness—not merely to know facts about You, but to truly know You, trust You, and follow You. If my heart is still afraid or uncertain, guide me with Your gentleness and light. In the name of Jesus Christ, Amen.'
    }
  },

  {
    id: 'gratitude',
    priority: 6,
    keywordsZh: ['感恩', '感谢', '谢谢神', '数算恩典', '蒙福', '感恩节', '知足', '赞美'],
    keywordsEn: ['thanksgiving', 'thankful', 'grateful', 'gratitude', 'thank god', 'blessed', 'praise'],
    audioPathZh: 'audio/prayers/gratitude-zh.mp3',
    audioPathEn: 'audio/prayers/gratitude-en.mp3',
    ambientPathZh: AMBIENT_ZH,
    ambientPathEn: AMBIENT_EN,
    zh: {
      title: '为感恩的心代祷',
      scripture: '【帖撒罗尼迦前书 5:18】“凡事谢恩，因为这是神在基督耶稣里向你们所定的旨意。”',
      prayerBody: '天父，谢谢你。在忙碌与担忧之中，我常常忘记数算你的恩典。今天我要停下来，向你献上感恩：谢谢你赐下生命、气息和今天的一切；谢谢你在我看得见和看不见的地方一直保守我；谢谢你即使在困难里，也从未离开我。求你给我一颗知足、感恩的心，让我不只在顺利时感谢你，也学会在还没看见答案时仍然信靠、仍然赞美。愿我的感恩成为对你的敬拜。奉主耶稣基督的名祷告，阿们。'
    },
    en: {
      title: 'A Prayer of Thanksgiving',
      scripture: '1 Thessalonians 5:18 — “Give thanks in all circumstances; for this is God’s will for you in Christ Jesus.”',
      prayerBody: 'Heavenly Father, thank You. In the rush and worry of life I so often forget to count Your gifts. Today I stop to give thanks: for life, breath, and everything in this day; for the ways You have kept me, seen and unseen; for never leaving me, even in hardship. Give me a contented, grateful heart—one that thanks You not only when things go well, but learns to trust and praise You even before I see the answer. Let my gratitude become worship. In the name of Jesus Christ, Amen.'
    }
  },

  {
    id: 'grief_loss',
    priority: 5,
    keywordsZh: ['丧失', '去世', '离世', '过世', '走了', '失去', '思念', '哀伤', '悲伤', '难过', '失去了', '亲人离世', '走不出来'],
    keywordsEn: ['grief', 'grieving', 'loss', 'passed away', 'mourning', 'lost someone', 'bereaved', 'heartbroken'],
    audioPathZh: 'audio/prayers/grief-loss-zh.mp3',
    audioPathEn: 'audio/prayers/grief-loss-en.mp3',
    ambientPathZh: AMBIENT_ZH,
    ambientPathEn: AMBIENT_EN,
    zh: {
      title: '为哀伤与失去中的心代祷',
      scripture: '【诗篇 34:18】“耶和华靠近伤心的人，拯救灵性痛悔的人。”',
      prayerBody: '慈爱的天父，我把这颗正在哀伤、正在思念的心带到你面前。失去所爱的痛，没有人能轻描淡写地带过，你也从不轻看。求你靠近这颗破碎的心，像你所应许的，靠近伤心的人。求你接住每一滴眼泪；在夜深难眠、思念涌上来的时候，用你的同在环绕我。求你给我空间去哀伤，也给我盼望：在基督里，死亡不是最后的话语，你必擦去一切的眼泪。求你一天一天地扶持我走过这段路。奉主耶稣基督的名祷告，阿们。'
    },
    en: {
      title: 'A Prayer in Grief and Loss',
      scripture: 'Psalm 34:18 — “The Lord is close to the brokenhearted and saves those who are crushed in spirit.”',
      prayerBody: 'Loving Father, I bring this grieving, aching heart to You. The pain of losing someone loved cannot be brushed aside, and You never make light of it. Draw near to this broken heart, just as You promised to be close to the brokenhearted. Catch every tear. In the sleepless nights when the missing comes flooding back, surround me with Your presence. Give me room to grieve, and give me hope: in Christ, death is not the final word, and You will wipe away every tear. Hold me up, one day at a time, as I walk through this. In the name of Jesus Christ, Amen.'
    }
  },

  {
    id: 'guilt_forgiveness',
    priority: 5,
    keywordsZh: ['内疚', '自责', '罪疚', '羞愧', '后悔', '悔改', '饶恕', '原谅', '做错了', '良心不安', '亏欠'],
    keywordsEn: ['guilt', 'guilty', 'shame', 'ashamed', 'regret', 'repent', 'forgive', 'forgiveness', 'conscience'],
    audioPathZh: 'audio/prayers/guilt-forgiveness-zh.mp3',
    audioPathEn: 'audio/prayers/guilt-forgiveness-en.mp3',
    ambientPathZh: AMBIENT_ZH,
    ambientPathEn: AMBIENT_EN,
    zh: {
      title: '为内疚与寻求饶恕的心代祷',
      scripture: '【约翰一书 1:9】“我们若认自己的罪，神是信实的，是公义的，必要赦免我们的罪，洗净我们一切的不义。”',
      prayerBody: '天父，我带着心里的内疚和自责来到你面前。有些事我反复想起，越想越沉重，甚至怀疑自己还能不能被接纳。谢谢你不是等我先变好才爱我，而是差你的儿子为我死。我承认我的过错，不再遮掩，也不再靠自己去偿还。求你照你的应许，赦免我、洗净我，把不断自我控告的重担从我心里挪去。求你也给我勇气去修复我能修复的关系，并靠你的恩典重新开始。奉主耶稣基督的名祷告，阿们。'
    },
    en: {
      title: 'A Prayer for Guilt and Forgiveness',
      scripture: '1 John 1:9 — “If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.”',
      prayerBody: 'Father, I come with the guilt and self-blame I carry. Some things replay in my mind and grow heavier each time, until I wonder whether I can still be accepted. Thank You that You did not wait for me to become good before loving me—You gave Your Son to die for me. I confess my wrong; I stop hiding it, and I stop trying to pay for it myself. According to Your promise, forgive me, cleanse me, and lift the weight of constant self-accusation from my heart. Give me courage to repair what I can, and by Your grace, to begin again. In the name of Jesus Christ, Amen.'
    }
  },

  {
    id: 'provision_finances',
    priority: 5,
    keywordsZh: ['经济压力', '经济', '财务', '金钱', '债务', '欠债', '负债', '债', '账单', '失业', '没工作', '收入', '缺乏', '供应', '养家', '付不起', '房租', '没钱'],
    keywordsEn: ['finances', 'financial', 'money', 'debt', 'bills', 'provision', 'provide', 'unemployed', 'income', 'rent', 'afford'],
    audioPathZh: 'audio/prayers/provision-finances-zh.mp3',
    audioPathEn: 'audio/prayers/provision-finances-en.mp3',
    ambientPathZh: AMBIENT_ZH,
    ambientPathEn: AMBIENT_EN,
    zh: {
      title: '为经济压力与供应的需要代祷',
      scripture: '【腓立比书 4:19】“我的神必照他荣耀的丰富，在基督耶稣里，使你们一切所需用的都充足。”',
      prayerBody: '供应的主，我把压在心头的经济重担交给你。数字、账单、债务和不确定的未来，常让我夜里睡不着。你知道我的每一样需要，甚至在我开口以前。求你按你荣耀的丰富，供应我一切所需用的；也求你除去我心里的惊慌，让我不被金钱辖制，而是学习信靠你。求你赐我智慧去规划、诚实去面对、勤劳去付出，也求你亲自开路——工作、帮助、出人意外的供应。愿我在缺乏或丰足中，都以你为我的满足。奉主耶稣基督的名祷告，阿们。'
    },
    en: {
      title: 'A Prayer for Provision and Financial Pressure',
      scripture: 'Philippians 4:19 — “And my God will meet all your needs according to the riches of his glory in Christ Jesus.”',
      prayerBody: 'God my provider, I hand You the financial weight pressing on my heart. The numbers, the bills, the debt, and the uncertain future often keep me awake at night. You know every need before I even ask. According to the riches of Your glory, supply what I truly need; and take away the panic inside me, so that money does not rule me and I learn to trust You. Give me wisdom to plan, honesty to face things, and diligence to work—and open the way Yourself: through provision, help, and unexpected grace. Whether in need or plenty, let me find my enough in You. In the name of Jesus Christ, Amen.'
    }
  },

  {
    id: 'loved_ones',
    priority: 6,
    keywordsZh: ['父母', '爸爸', '妈妈', '家人', '亲人', '长辈', '朋友', '为我的父母', '为家人', '为朋友', '所爱的人', '为他祷告', '为她祷告'],
    keywordsEn: ['parents', 'mother', 'father', 'my mom', 'my dad', 'family member', 'friend', 'loved one', 'pray for my family'],
    audioPathZh: 'audio/prayers/loved-ones-zh.mp3',
    audioPathEn: 'audio/prayers/loved-ones-en.mp3',
    ambientPathZh: AMBIENT_ZH,
    ambientPathEn: AMBIENT_EN,
    zh: {
      title: '为你所爱的人代祷',
      scripture: '【雅各书 5:16】“……义人祈祷所发的力量是大有功效的。”',
      prayerBody: '天父，我为我所爱的人来到你面前——我的父母、家人、朋友，那些在我心上、我却无法替他们承担一切的人。你比我更爱他们，也比我更有能力帮助他们。求你保守他们的身体、心灵和脚步；在他们软弱时扶持，在他们迷失时寻回，在他们受伤时医治。若他们还不认识你，求你亲自向他们显明你的爱。我把自己无法掌控的，都交在你信实的手中。奉主耶稣基督的名祷告，阿们。'
    },
    en: {
      title: 'A Prayer for Someone You Love',
      scripture: 'James 5:16 — “…The prayer of a righteous person is powerful and effective.”',
      prayerBody: 'Father, I bring before You the people I love—my parents, my family, my friends—those who are on my heart but whose burdens I cannot carry for them. You love them more than I do and are far more able to help them. Guard their bodies, their hearts, and their steps. Hold them up when they are weak, find them when they wander, heal them where they hurt. If they do not yet know You, reveal Your love to them Yourself. I place all I cannot control into Your faithful hands. In the name of Jesus Christ, Amen.'
    }
  }
];

/* Warm general prayer — shown ONLY when nothing else matches. It never reads
   like a search miss; an unnamed burden is still a burden worth bringing to God
   (Matthew 11:28). No audio narration is planned for this general prayer. */
export function getGeneralPrayer(lang) {
  const general = {
    zh: {
      id: 'general',
      title: '把真实的重担交托给神',
      scripture: '【马太福音 11:28】“凡劳苦担重担的人，可以到我这里来，我就使你们得安息。”',
      prayerBody: '主耶稣，我把此刻说不清、理不顺、也无法独自承担的重担带到你面前。你没有要求我先变得坚强才可以靠近你，你邀请劳苦担重担的人到你这里来。求你在我的困惑中赐下光，在我的疲惫中赐下安息，在我的不安中赐下平安。求你一步一步带领我，让我知道我不是独自面对这一切。奉主耶稣基督的名祷告，阿们。'
    },
    en: {
      id: 'general',
      title: 'Bring Your Burden Before God',
      scripture: 'Matthew 11:28 — “Come to me, all you who are weary and burdened, and I will give you rest.”',
      prayerBody: 'Lord Jesus, I bring before You the burden that I cannot fully explain, organize, or carry on my own. You do not ask me to become strong before I come near to You; You invite the weary and burdened to come to You. Give me light in my confusion, rest in my exhaustion, and peace in my uncertainty. Lead me step by step, and help me know that I am not facing this alone. In the name of Jesus Christ, Amen.'
    }
  };
  return general[lang === 'en' ? 'en' : 'zh'];
}

/* Adapt the shared crisis card (title/verse/explanation/nextStep) into the
   prayer response shape. The concrete help line (988 / 741741 / 911) is kept in
   the body so it stays visible; crisis never carries audio narration. */
function toPrayerCrisis(c) {
  return {
    id: 'crisis',
    crisis: true,
    title: c.title,
    scripture: c.verse,
    prayerBody: c.explanation + '\n\n' + c.nextStep + '\n\n' + c.prayer
  };
}

function resolvePrayer(t, lang) {
  const L = lang === 'en' ? 'en' : 'zh';
  return {
    id: t.id,
    title: t[L].title,
    scripture: t[L].scripture,
    prayerBody: t[L].prayerBody,
    audioPathZh: t.audioPathZh,
    audioPathEn: t.audioPathEn,
    ambientPathZh: t.ambientPathZh,
    ambientPathEn: t.ambientPathEn
  };
}

/* Re-resolve a known response id in a new language WITHOUT re-running the match
   (used by the panel on a page language toggle, so the same prayer stays put). */
export function resolvePrayerById(id, lang) {
  const L = lang === 'en' ? 'en' : 'zh';
  if (id === 'crisis') return toPrayerCrisis(getCrisisResponse(L));
  if (id === 'general' || !id) return getGeneralPrayer(L);
  const t = prayerRegistry.find((x) => x.id === id);
  if (!t) return getGeneralPrayer(L);
  return resolvePrayer(t, L);
}

/* Main entry.
   (1) crisis first. (2) LONGEST matched keyword wins across all topics; a tie
   on matched-keyword length is broken by the topic's `priority` (lower wins).
   Both keyword lists are matched regardless of UI language (a zh user may type
   an English word). (3) warm general prayer when nothing matches. */
export function getPrayerResponse(userInput, currentLanguage = 'zh') {
  const input = (userInput || '').trim().toLowerCase();
  const lang = currentLanguage === 'en' ? 'en' : 'zh';

  if (!input) return getGeneralPrayer(lang);

  const crisis = detectCrisis(input, lang);
  if (crisis) return toPrayerCrisis(crisis);

  let best = null, bestLen = 0, bestPriority = Infinity;
  for (const t of prayerRegistry) {
    const keywords = t.keywordsZh.concat(t.keywordsEn);
    let longest = 0;
    for (const kw of keywords) {
      const k = kw.toLowerCase();
      if (k.length > longest && input.includes(k)) longest = k.length;
    }
    if (longest === 0) continue;
    if (longest > bestLen || (longest === bestLen && t.priority < bestPriority)) {
      best = t; bestLen = longest; bestPriority = t.priority;
    }
  }
  if (best) return resolvePrayer(best, lang);
  return getGeneralPrayer(lang);
}
