# Prayer sanctuary ambient audio

Soft, optional background music for the Prayer Sanctuary Board (圣经代祷关怀舱).
Drop a real MP3 here at the exact path below and a gentle, user-controlled
"Quiet prayer background · 安静祷告背景" button appears on the prayer card.

Expected files:

- prayer-sanctuary-zh.mp3
- prayer-sanctuary-en.mp3

Behaviour (enforced in `components/prayer-care.js`):
- Never autoplays — the track starts only when the user taps the button.
- Soft by default (volume ~0.32) and loops while playing.
- Stops when the prayer card is closed or replaced.

If these files do not exist, the prayer card simply renders silently — no button,
no error. Paths are defined in `data/prayerEngine.js` (AMBIENT_ZH / AMBIENT_EN).
Spoken prayer narration lives separately under `audio/prayers/` and never loops.
