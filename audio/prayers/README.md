# Prayer narration audio

Human female prayer narration for the Intercessory Prayer Engine (圣经代祷关怀舱).
Drop a real MP3 here at the exact path below and the Prayer Care Panel plays it
automatically through the standard HTML5 audio player — no code change needed.
Until a file exists, the panel shows a calm "human prayer narration in production"
state. Browser text-to-speech is never used.

Expected files (one per prayer topic, Chinese + English):

- family_marriage    : family-marriage-zh.mp3    · family-marriage-en.mp3
- future_career      : future-career-zh.mp3      · future-career-en.mp3
- health_body        : health-body-zh.mp3        · health-body-en.mp3
- children_family    : children-family-zh.mp3    · children-family-en.mp3
- anxiety_peace      : anxiety-peace-zh.mp3       · anxiety-peace-en.mp3
- insecurity_safety  : insecurity-safety-zh.mp3   · insecurity-safety-en.mp3
- loneliness_comfort : loneliness-comfort-zh.mp3  · loneliness-comfort-en.mp3
- knowing_jesus      : knowing-jesus-zh.mp3       · knowing-jesus-en.mp3

Paths are defined in `data/prayerEngine.js` (`audioPathZh` / `audioPathEn`).
The general prayer and the crisis response intentionally carry no narration.
