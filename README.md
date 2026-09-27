# 日光之下 · Under the Sun

An honest investigation into the meaning of life, drawn from the book of Ecclesiastes — built as a gentle, non-preachy on-ramp for skeptics, with a clearly-labeled, opt-in path toward the Gospel and a crisis off-ramp built in from the start.

一场关于人生意义的诚实调查,文本来自《传道书》。面向无信仰的怀疑者设计——温和、不说教,设有清楚标注、自选进入的福音通道,以及上线即有的危机求助出口。

## Contents

| File | Description |
|------|-------------|
| `ecclesiastes.html` | Main site — English, with an EN / 中文 language toggle |
| `ecclesiastes-zh.html` | Main site — Chinese (default 中文), with the 「虚空 ≠ 空」 distinction |
| `deck-en.html` | Full visual summary — *Beyond the Vapor* (15 slides) |
| `deck-zh.html` | Full visual summary — 穿透迷雾的建筑学 (17 slides) |
| `images/en` · `images/zh` | In-context slide images embedded in the main sites |
| `images/deck-en` · `images/deck-zh` | Complete sermon decks, slide by slide |
| `Beyond the Vapor(3).pptx` | Source deck (English) |
| `Architecture_Beyond_the_Mist(4).pptx` | Source deck (Chinese) |

## Structure of the site

Homepage question → the *hevel* (vapor, not "vanity") insight → the same-violin illustration → the emptiness of success (Ecclesiastes 2) → grounded passage reader → "And then what?" → Ask Anything (constrained, cited, with crisis detection) → opt-in Gospel bridge → crisis / human / church off-ramps.

## Notes

- Scripture sources: Chinese uses the Chinese Union Version (新标点和合本, public domain). English uses the World English Bible (WEB, public domain) for the Q&A, AI prayer, listen pages, Psalms, and Revelation. Some earlier Ecclesiastes/John reading material still uses KJV or older wording and is pending migration to WEB. English divine-name display is not yet fully consistent across pages (e.g. the Psalms reading page uses the WEB edition that renders “Yahweh”) — a separate follow-up.
- 经文来源：中文用新标点和合本（简体，公共领域）；英文在问答、AI 祷告、聆听页、诗篇与《启示录》采用 World English Bible（WEB，公共领域）。传道书与约翰福音的部分较早阅读内容仍保留 KJV 或旧措辞，待迁移到 WEB。全站英文神名显示尚未完全统一（例如诗篇阅读页使用显示为“Yahweh”的 WEB 版本），属后续单独处理。
- The slide images contain text baked in; for web deployment they should be compressed.
- This is an MVP demo. The "Ask Anything" assistant currently uses a small built-in, verse-grounded set; the production version is a retrieval-augmented model constrained to the Ecclesiastes corpus.
