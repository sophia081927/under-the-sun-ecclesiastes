// Proverbs Listen — behavior + boundary tests (Phase A).
// Covers the design-review requirements: merged verses (23/26), chapter-31 end state
// (no loop), stale callbacks on rapid switch, pause/resume/stop, missing voices,
// playback failure (no silent Scripture skip), and segment structure / label exclusion.
import test from 'node:test'; import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  parseRef, resolveScripture, buildSegments, chapterNav, pickVoice, createListenPlayer,
} from '../components/listenPlayer.js';
import { verifyListenSession, verifyMergeBoundary, MERGE_BOUNDARIES } from './verify-proverbs-listen.mjs';
import { proverbsListen } from '../data/listen/proverbsListen.js';

const load = async (n) => (await import(`../data/books/proverbs/ch${String(n).padStart(2, '0')}.js`)).default;

// ---- A test double for SpeechSynthesis (no browser needed) ----
// Real engines misbehave in three ways we have to survive, so they are switchable here:
//   resume: 'noop'  — resume() returns without clearing paused (seen on several platforms)
//   resume/pause: 'throw' — the call raises
//   cancelFiresError — cancel() synchronously delivers onerror for the utterance it kills
function fakeSynth(opts = {}) {
  const calls = { speak: [], cancel: 0, pause: 0, resume: 0 };
  let voices = [];
  let paused = false;   // models the real SpeechSynthesis.paused flag
  let speaking = false;
  let resumeMode = opts.resume || 'ok';         // 'ok' | 'noop' | 'throw'
  let pauseMode = opts.pause || 'ok';           // 'ok' | 'throw'
  let cancelFiresError = !!opts.cancelFiresError;
  const api = {
    _calls: calls,
    get paused() { return paused; },
    get speaking() { return speaking; },
    _setVoices(v) { voices = v; },
    _setResume(m) { resumeMode = m; },
    _setPause(m) { pauseMode = m; },
    _setCancelFiresError(v) { cancelFiresError = v; },
    _last() { return calls.speak[calls.speak.length - 1]; },
    getVoices: () => voices,
    // Web Speech semantics: cancel() and speak() do NOT clear paused; only resume() does.
    speak: (u) => { calls.speak.push(u); speaking = true; },
    cancel: () => {
      calls.cancel++;
      const u = api._last();
      speaking = false;
      if (cancelFiresError && u && u.onerror) u.onerror({ error: 'canceled' });
    },
    pause: () => {
      calls.pause++;
      if (pauseMode === 'throw') throw new Error('pause unsupported');
      if (speaking) paused = true;
    },
    resume: () => {
      calls.resume++;
      if (resumeMode === 'throw') throw new Error('resume unsupported');
      if (resumeMode === 'noop') return;        // engine ignores it and stays paused
      paused = false;
    },
    addEventListener() {}, removeEventListener() {},
  };
  return api;
}
const fakeUtterance = (text) => ({ text, lang: '', rate: 1, voice: null, onend: null, onerror: null });
const mkPlayer = (synth, cbs = {}) => createListenPlayer({ synth, makeUtterance: fakeUtterance, resumeTimeoutMs: 40, ...cbs });

test('delayed resume preserves the same utterance without false error or replay', async () => {
  const synth = fakeSynth();
  const resume = synth.resume.bind(synth);
  synth.resume = () => setTimeout(resume, 10);
  const p = mkPlayer(synth);
  p.play([{ text: 'first' }, { text: 'second' }]);
  const first = synth._last();
  p.pause(); p.resume();
  assert.equal(p.state, 'resuming');
  await new Promise(r => setTimeout(r, 60));
  assert.equal(p.state, 'playing');
  assert.equal(synth._calls.speak.length, 1);
  assert.equal(synth._last(), first);
  first.onend();
  assert.equal(synth._last().text, 'second');
  p.stop();
});

for (const action of ['stop', 'switch']) {
  test(`pending resume cannot restart old speech after ${action}`, async () => {
    const synth = fakeSynth();
    const resume = synth.resume.bind(synth);
    synth.resume = () => setTimeout(resume, 10);
    const p = mkPlayer(synth);
    p.play([{ text: 'old' }, { text: 'old next' }]);
    const old = synth._last();
    p.pause(); p.resume(); p.stop();
    if (action === 'switch') p.play([{ text: 'new language' }], { lang: 'en' });
    old.onend(); old.onerror();
    await new Promise(r => setTimeout(r, 80));
    assert.equal(p.state, action === 'stop' ? 'stopped' : 'playing');
    assert.deepEqual(synth._calls.speak.map(u => u.text), action === 'stop' ? ['old'] : ['old', 'new language']);
    p.stop();
  });
}

test('end callback during pending resume advances once only after recovery', async () => {
  const synth = fakeSynth();
  const resume = synth.resume.bind(synth);
  synth.resume = () => setTimeout(resume, 10);
  const p = mkPlayer(synth);
  p.play([{ text: 'first' }, { text: 'second' }]);
  const first = synth._last();
  p.pause(); p.resume(); first.onend(); first.onend();
  assert.equal(synth._calls.speak.length, 1);
  await new Promise(r => setTimeout(r, 60));
  assert.equal(p.state, 'playing');
  assert.deepEqual(synth._calls.speak.map(u => u.text), ['first', 'second']);
  p.stop();
});

test('synchronous pause error remains an error rather than being overwritten by paused', () => {
  const synth = fakeSynth();
  synth.pause = () => synth._last().onerror();
  const p = mkPlayer(synth);
  p.play([{ text: 'first' }]); p.pause();
  assert.equal(p.state, 'error');
  assert.equal(p.index, 0);
});

// ---- Ref parsing (whole verses only) ----
test('parseRef accepts single and range, rejects half/garbage', () => {
  assert.deepEqual(parseRef('1:7'), { ch: 1, from: 7, to: 7 });
  assert.deepEqual(parseRef('1:8-9'), { ch: 1, from: 8, to: 9 });
  assert.throws(() => parseRef('1:7a'));
  assert.throws(() => parseRef('1:9-8'));
  assert.throws(() => parseRef('7'));
});

// ---- Corpus-verbatim of the authored Chapter 1 session ----
for (const session of proverbsListen.sessions) {
  test(`Proverbs Listen ${session.n} Scripture is verbatim vs corpus`, async () => {
    const errors = await verifyListenSession(session);
    assert.deepEqual(errors, [], errors.join('\n'));
  });
}

// ---- Chapter 1 selection resolves to whole, corpus-matching verses ----
test('ch1 resolveScripture returns the selected whole verses, no empties', async () => {
  const ch1 = await load(1);
  const groups = resolveScripture(ch1, ['1:7', '1:8-9', '1:20-23', '1:33']);
  assert.equal(groups.length, 4);
  for (const g of groups) { assert.ok(g.zh.trim(), `zh ${g.ref}`); assert.ok(g.en.trim(), `en ${g.ref}`); }
  assert.equal(groups[0].zh, ch1.verses.find((v) => v.v === 7).zh);
  // A range joins its two verses (both languages).
  assert.ok(groups[1].zh.includes(ch1.verses.find((v) => v.v === 8).zh.trim()));
  assert.ok(groups[1].zh.includes(ch1.verses.find((v) => v.v === 9).zh.trim()));
});

// ---- Context-critical groups: a continuous range must not skip the pivotal middle verse ----
// Ch7: v22 ("He follows her immediately…") is the hinge of the trap; the group must span 21–23.
test('ch7 7:21-23 keeps the pivotal v22, and the session does not use the v22-skipping split', async () => {
  const ch7 = await load(7);
  const g = resolveScripture(ch7, ['7:21-23'])[0];
  const v22 = ch7.verses.find((v) => v.v === 22);
  assert.equal(g.from, 21); assert.equal(g.to, 23);
  assert.ok(g.zh.includes(v22.zh.trim()), 'zh must include v22');
  assert.ok(g.en.includes(v22.en.trim()), 'en must include v22');
  const s7 = proverbsListen.sessions.find((s) => s.n === 7);
  const refs = s7.scripture.map((x) => x.ref);
  assert.ok(refs.includes('7:21-23'), 'session must use the continuous 7:21-23 group');
  assert.ok(!refs.includes('7:21') && !refs.includes('7:23'), 'must not reintroduce the v22-skipping split');
  // Negative: the old split ['7:21','7:23'] silently omits v22 — which is exactly why it was rejected.
  const split = resolveScripture(ch7, ['7:21', '7:23']);
  assert.ok(!split.some((gr) => gr.zh.includes(v22.zh.trim())), 'the split leaves v22 unheard (the omission we reject)');
});

// Ch9: the concluding warning v18 ("her guests are in the depths of Sheol") must accompany v17.
test('ch9 9:17-18 keeps the concluding warning v18, not just Folly’s invitation', async () => {
  const ch9 = await load(9);
  const g = resolveScripture(ch9, ['9:17-18'])[0];
  const v18 = ch9.verses.find((v) => v.v === 18);
  assert.equal(g.to, 18);
  assert.ok(g.zh.includes(v18.zh.trim()), 'zh must include v18');
  assert.ok(g.en.includes(v18.en.trim()), 'en must include v18');
  const s9 = proverbsListen.sessions.find((s) => s.n === 9);
  const refs = s9.scripture.map((x) => x.ref);
  assert.ok(refs.includes('9:17-18'), 'session must use 9:17-18');
  assert.ok(!refs.includes('9:17'), 'must not end at bare 9:17 (omitting the warning)');
  // Negative: ending at bare 9:17 omits the warning.
  const bare = resolveScripture(ch9, ['9:17']);
  assert.ok(!bare.some((gr) => gr.zh.includes(v18.zh.trim())), 'bare 9:17 leaves v18 unheard (the omission we reject)');
});

// ---- Chinese merged verses: read once, never dropped or duplicated (23:31–32) ----
test('ch23 merged 31–32: zh combined once, en keeps both; any selection yields the same', async () => {
  const ch23 = await load(23);
  const whole = resolveScripture(ch23, ['23:31-32'])[0];
  const onlyMerged = resolveScripture(ch23, ['23:32'])[0];   // must pull in the anchor (31)
  const onlyAnchor = resolveScripture(ch23, ['23:31'])[0];   // must pull in the trailing merged (32) for EN
  const anchorZh = ch23.verses.find((v) => v.v === 31).zh;
  for (const g of [whole, onlyMerged, onlyAnchor]) {
    assert.equal(g.zh, anchorZh, 'zh must be the combined anchor text, once');
    assert.equal(g.zh.split(anchorZh).length - 1, 1, 'no duplication');
    assert.ok(g.en.includes(ch23.verses.find((v) => v.v === 32).en.trim()), 'en keeps v32');
    assert.ok(g.en.includes(ch23.verses.find((v) => v.v === 31).en.trim()), 'en keeps v31');
  }
  assert.equal(whole.zh, onlyMerged.zh);
  assert.equal(whole.en, onlyMerged.en);
});

test('ch26 merged 18–19 behaves the same', async () => {
  const ch26 = await load(26);
  const g = resolveScripture(ch26, ['26:18-19'])[0];
  const anchorZh = ch26.verses.find((v) => v.v === 18).zh;
  assert.equal(g.zh, anchorZh);
  assert.equal(g.zh.split(anchorZh).length - 1, 1);
  assert.ok(g.en.includes(ch26.verses.find((v) => v.v === 19).en.trim()));
});

// ---- Segment structure + label/ref exclusion from Scripture ----
test('buildSegments: ordered sections; only scripture segments are isScripture', async () => {
  const ch1 = await load(1);
  const session = proverbsListen.sessions.find((s) => s.n === 1);
  const segs = buildSegments(session, ch1, 'zh');
  assert.equal(segs[0].kind, 'label'); assert.equal(segs[0].section, 'intro');
  assert.equal(segs[1].kind, 'text'); assert.equal(segs[1].section, 'intro');
  assert.equal(segs[2].kind, 'label'); assert.equal(segs[2].section, 'scripture');
  // labels + refs are navigation, never Scripture
  for (const s of segs) if (s.kind === 'label' || s.kind === 'ref' || s.kind === 'text') assert.equal(s.isScripture, false);
  const scripture = segs.filter((s) => s.isScripture);
  assert.equal(scripture.length, 4, 'four scripture groups');
  for (const s of scripture) assert.equal(s.kind, 'scripture');
  // each scripture group is preceded by a spoken reference
  const idxs = segs.map((s, i) => (s.kind === 'scripture' ? i : -1)).filter((i) => i >= 0);
  for (const i of idxs) assert.equal(segs[i - 1].kind, 'ref');
  // ends with the prayer section
  assert.equal(segs[segs.length - 1].section, 'prayer');
});

// ---- Chapter nav: no wrap; ch31 has no next (never loops to 1) ----
test('chapterNav end-state: ch31 next is null, no loop; ch1 has no prev', () => {
  assert.deepEqual(chapterNav(1, 31), { prev: null, next: 2 });
  assert.deepEqual(chapterNav(15, 31), { prev: 14, next: 16 });
  assert.deepEqual(chapterNav(31, 31), { prev: 30, next: null });
});

// ---- Player: full advance to ended ----
test('player advances through all segments to "ended"', () => {
  const synth = fakeSynth();
  const states = [];
  const p = mkPlayer(synth, { onStateChange: (s) => states.push(s) });
  const segs = [{ text: 'a', isScripture: false }, { text: 'b', isScripture: true }];
  p.play(segs, { lang: 'en' });
  assert.equal(synth._calls.speak.length, 1);
  synth._last().onend();                       // finish seg 0 → speaks seg 1
  assert.equal(synth._calls.speak.length, 2);
  synth._last().onend();                       // finish seg 1 → ended
  assert.equal(p.state, 'ended');
  assert.ok(states.includes('ended'));
});

// ---- Player: stale callbacks after a rapid switch are ignored ----
test('rapid switch: an old utterance callback does not advance the new playback', () => {
  const synth = fakeSynth();
  const p = mkPlayer(synth);
  p.play([{ text: 'A0' }, { text: 'A1' }], { lang: 'en' });
  const uA = synth._last();
  p.play([{ text: 'B0' }, { text: 'B1' }], { lang: 'en' });  // switch
  assert.equal(p.index, 0);
  uA.onend();                                   // stale → must be ignored
  assert.equal(p.index, 0, 'stale callback must not advance the new session');
  synth._last().onend();                        // current (B0) advances
  assert.equal(p.index, 1);
});

// ---- Player: pause / resume / stop ----
test('pause/resume/stop drive state and the engine correctly', () => {
  const synth = fakeSynth();
  const p = mkPlayer(synth);
  p.play([{ text: 'a' }, { text: 'b' }], { lang: 'en' });
  p.pause();
  assert.equal(p.state, 'paused'); assert.equal(synth._calls.pause, 1);
  p.resume();
  assert.equal(p.state, 'playing'); assert.equal(synth._calls.resume, 1);
  p.stop();
  assert.equal(p.state, 'stopped'); assert.equal(p.index, 0); assert.ok(synth._calls.cancel >= 1);
});

// ---- Player: a real error does NOT silently skip a Scripture segment ----
test('scripture playback failure stops and reports (no silent skip)', () => {
  const synth = fakeSynth();
  let errored = null;
  const p = mkPlayer(synth, { onError: (seg) => { errored = seg; } });
  const segs = [{ text: '经文', isScripture: true }, { text: 'next', isScripture: false }];
  p.play(segs, { lang: 'zh' });
  synth._last().onerror(new Error('boom'));
  assert.equal(p.state, 'error');
  assert.equal(p.index, 0, 'must not advance past the failed Scripture segment');
  assert.ok(errored && errored.isScripture);
  assert.equal(synth._calls.speak.length, 1, 'no further segment spoken');
});

// ---- Player: a cancel-induced error after stop is treated as stale (not a failure) ----
test('cancel-induced error after stop is ignored', () => {
  const synth = fakeSynth();
  const p = mkPlayer(synth);
  p.play([{ text: 'a' }], { lang: 'en' });
  const u = synth._last();
  p.stop();
  u.onerror(new Error('canceled'));             // arrives late from the cancel
  assert.equal(p.state, 'stopped', 'stale error must not flip state to error');
});

// ---- Player: works with no voices available ----
test('missing voices: pickVoice is null and playback still proceeds', () => {
  const synth = fakeSynth();
  synth._setVoices([]);
  assert.equal(pickVoice(synth, 'zh'), null);
  const p = mkPlayer(synth);
  assert.doesNotThrow(() => p.play([{ text: 'a' }], { lang: 'zh', voice: null }));
  assert.equal(p.state, 'playing');
});

// ---- Overlapping / duplicate selections are rejected BEFORE playback ----
test('resolveScripture rejects an overlapping selection (23:31 & 23:32 both expand to 31-32)', async () => {
  const ch23 = await load(23);
  assert.throws(() => resolveScripture(ch23, ['23:31', '23:32']), /overlap/i);
});

test('resolveScripture rejects a plain duplicate ref', async () => {
  const ch1 = await load(1);
  assert.throws(() => resolveScripture(ch1, ['1:7', '1:7']), /overlap/i);
});

// The same trap exists at the other merged unit (26:18–19), so it is covered too — a fix
// that only special-cased chapter 23 would pass the tests above and still double-read here.
test('resolveScripture rejects an overlapping selection in ch26 (26:18 & 26:19 both expand to 18-19)', async () => {
  const ch26 = await load(26);
  assert.throws(() => resolveScripture(ch26, ['26:18', '26:19']), /overlap/i);
  assert.throws(() => resolveScripture(ch26, ['26:18-19', '26:19']), /overlap/i);
  // A selection that merely touches the unit's neighbours must still be accepted.
  assert.doesNotThrow(() => resolveScripture(ch26, ['26:17', '26:18-19', '26:20']));
});

test('verifyListenSession flags an overlapping selection (was previously silent)', async () => {
  const errors = await verifyListenSession({
    n: 23, titleZh: 't', titleEn: 't',
    scripture: [{ ref: '23:31' }, { ref: '23:32' }],
    introZh: 'x', introEn: 'x', reflectZh: 'x', reflectEn: 'x', prayerZh: 'x', prayerEn: 'x',
  });
  assert.ok(errors.some((e) => /invalid scripture selection|overlap/i.test(e)), errors.join('\n'));
});

test('verifyListenSession flags an overlapping ch26 selection too', async () => {
  const errors = await verifyListenSession({
    n: 26, titleZh: 't', titleEn: 't',
    scripture: [{ ref: '26:18' }, { ref: '26:19' }],
    introZh: 'x', introEn: 'x', reflectZh: 'x', reflectEn: 'x', prayerZh: 'x', prayerEn: 'x',
  });
  assert.ok(errors.some((e) => /invalid scripture selection|overlap/i.test(e)), errors.join('\n'));
});

// ---- Merge boundaries compared EXACTLY against the bilingual corpus ----
// The assertions above use includes(), which cannot see a group that silently gained or
// lost a neighbouring verse. verifyMergeBoundary rebuilds the expected zh AND en straight
// from worker/scripture-assets and compares them with === for every ref form of the unit.
for (const b of MERGE_BOUNDARIES) {
  test(`merge boundary ch${b.n} (v${b.merged}) matches the corpus exactly in zh and en`, async () => {
    const errors = await verifyMergeBoundary(b.n, b.refs, b.merged);
    assert.deepEqual(errors, [], errors.join('\n'));
  });
}

test('MERGE_BOUNDARIES covers both Proverbs merged units (23 and 26)', () => {
  assert.deepEqual(MERGE_BOUNDARIES.map((b) => b.n).sort((x, y) => x - y), [23, 26]);
});

// ---- Blocker: a stale paused engine state must be cleared on (re)play ----
test('play after pause→stop clears the paused engine (no silent "playing")', () => {
  const synth = fakeSynth();
  const p = mkPlayer(synth);
  p.play([{ text: 'a' }, { text: 'b' }], { lang: 'en' });
  p.pause();
  assert.equal(synth.paused, true);
  p.stop();
  assert.equal(synth.paused, true, 'per spec, cancel() does not clear paused');
  p.play([{ text: 'c' }], { lang: 'en' });
  assert.equal(synth.paused, false, 'play() must clear the stale paused state so speech is audible');
  assert.equal(p.state, 'playing');
});

test('play after pause→language-switch(stop) clears the paused engine', () => {
  const synth = fakeSynth();
  const p = mkPlayer(synth);
  p.play([{ text: 'a' }], { lang: 'zh' });
  p.pause();
  p.stop();                              // setLang() stops before re-rendering
  assert.equal(synth.paused, true);
  p.play([{ text: 'b' }], { lang: 'en' });
  assert.equal(synth.paused, false);
});

// ---- Conservative recovery: explicit user retry replays the CURRENT segment ----
test('retry() replays the current segment and invalidates the old generation', () => {
  const synth = fakeSynth();
  const p = mkPlayer(synth);
  p.play([{ text: 's0' }, { text: 's1' }], { lang: 'en' });
  const uOld = synth._last();
  assert.equal(p.index, 0);
  p.retry();
  assert.equal(synth._calls.speak.length, 2, 'current segment re-spoken');
  assert.equal(synth._last().text, 's0', 'replays the CURRENT segment, not the next');
  uOld.onend();                          // stale callback from before retry
  assert.equal(p.index, 0, 'stale onend must not advance the retried playback');
  synth._last().onend();                 // the retried utterance completes → advance
  assert.equal(p.index, 1);
});

test('retry() clears a stale paused engine before replaying', () => {
  const synth = fakeSynth();
  const p = mkPlayer(synth);
  p.play([{ text: 'a' }, { text: 'b' }], { lang: 'en' });
  p.pause();
  assert.equal(synth.paused, true);
  p.retry();
  assert.equal(synth.paused, false, 'retry must not leave the engine paused');
  assert.equal(p.state, 'playing');
});

// ---- Blocker: an engine that refuses to un-pause must never be reported as "playing" ----
// resume() is a no-op on some platforms. Silently accepting that leaves a UI that says
// "playing" over a mute engine, so the failure has to be explicit and recoverable.
test('resume() that the engine ignores fails loudly: not playing, nothing enqueued, segment kept', async () => {
  const synth = fakeSynth({ resume: 'noop' });
  const seen = [];
  const p = mkPlayer(synth, { onError: (seg, info) => seen.push(info.reason) });
  p.play([{ text: 's0' }, { text: 's1' }], { lang: 'en' });
  const spoken = synth._calls.speak.length;
  p.pause();
  assert.equal(p.state, 'paused');
  p.resume();
  assert.notEqual(p.state, 'playing', 'must not claim playing over a still-paused engine');
  assert.equal(p.state, 'resuming', 'wait for an asynchronous engine update');
  await new Promise(r => setTimeout(r, 80));
  assert.equal(p.state, 'error');
  assert.equal(synth.paused, true, 'the engine really is still paused');
  assert.equal(synth._calls.speak.length, spoken, 'must not enqueue speech into a paused engine');
  assert.equal(p.index, 0, 'current segment kept for a manual retry');
  assert.deepEqual(seen, ['resume-failed']);
});

test('retry() on an engine that ignores resume() also fails loudly instead of faking playback', async () => {
  const synth = fakeSynth({ resume: 'noop' });
  const seen = [];
  const p = mkPlayer(synth, { onError: (seg, info) => seen.push(info.reason) });
  p.play([{ text: 's0' }, { text: 's1' }], { lang: 'en' });
  const spoken = synth._calls.speak.length;
  p.pause();
  p.retry();
  assert.equal(p.state, 'resuming', 'wait for an asynchronous engine update');
  await new Promise(r => setTimeout(r, 80));
  assert.equal(p.state, 'error');
  assert.equal(synth.paused, true);
  assert.equal(synth._calls.speak.length, spoken, 'no speech queued behind a paused engine');
  assert.equal(p.index, 0);
  assert.deepEqual(seen, ['paused']);
});

test('play() into an engine stuck paused reports failure instead of a silent "playing"', async () => {
  const synth = fakeSynth({ resume: 'noop' });
  const seen = [];
  const p = mkPlayer(synth, { onError: (seg, info) => seen.push(info.reason) });
  p.play([{ text: 'a' }], { lang: 'en' });
  p.pause();
  p.stop();                              // per spec, cancel() leaves paused set
  assert.equal(synth.paused, true);
  p.play([{ text: 'b' }], { lang: 'en' });
  assert.equal(p.state, 'resuming', 'wait for an asynchronous engine update');
  await new Promise(r => setTimeout(r, 80));
  assert.equal(p.state, 'error');
  assert.equal(synth._calls.speak.filter((u) => u.text === 'b').length, 0, 'nothing queued while paused');
  assert.deepEqual(seen, ['paused']);
});

test('resume()/play() survive an engine whose resume() throws', () => {
  const synth = fakeSynth({ resume: 'throw' });
  const seen = [];
  const p = mkPlayer(synth, { onError: (seg, info) => seen.push(info.reason) });
  p.play([{ text: 'a' }, { text: 'b' }], { lang: 'en' });   // not paused yet → resume() not called
  assert.equal(p.state, 'playing');
  p.pause();
  p.resume();
  assert.equal(p.state, 'error', 'a throwing resume() is a failure, not a resume');
  assert.equal(p.index, 0);
  p.play([{ text: 'c' }], { lang: 'en' });                  // still paused → clearPaused throws again
  assert.equal(p.state, 'error');
  assert.equal(synth._calls.speak.filter((u) => u.text === 'c').length, 0);
  assert.deepEqual(seen, ['resume-failed', 'paused']);
});

test('pause() that throws does not claim paused', () => {
  const synth = fakeSynth({ pause: 'throw' });
  const seen = [];
  const p = mkPlayer(synth, { onError: (seg, info) => seen.push(info.reason) });
  p.play([{ text: 'a' }, { text: 'b' }], { lang: 'en' });
  p.pause();
  assert.notEqual(p.state, 'paused', 'the engine refused to pause — do not show "paused"');
  assert.equal(p.state, 'error');
  assert.equal(synth.paused, false);
  assert.equal(p.index, 0, 'current segment kept');
  assert.deepEqual(seen, ['pause-failed']);
});

// ---- Recovery: the user's explicit retry gets playback going again ----
test('recovery: after a refused resume, retry replays the current segment and plays on to the end', async () => {
  const synth = fakeSynth({ resume: 'noop' });
  const p = mkPlayer(synth);
  p.play([{ text: 's0' }, { text: 's1' }], { lang: 'en' });
  p.pause();
  p.resume();
  assert.equal(p.state, 'resuming', 'wait for an asynchronous engine update');
  await new Promise(r => setTimeout(r, 80));
  assert.equal(p.state, 'error');
  synth._setResume('ok');                // engine (or the user's voice/app switch) recovers
  p.retry();
  assert.equal(p.state, 'playing');
  assert.equal(synth.paused, false);
  assert.equal(synth._last().text, 's0', 'continues from the segment that was interrupted');
  synth._last().onend();
  assert.equal(p.index, 1);
  synth._last().onend();
  assert.equal(p.state, 'ended');
});

// ---- Cancel/callback races ----
test('an onerror delivered synchronously from inside cancel() is never a playback failure', () => {
  const synth = fakeSynth({ cancelFiresError: true });
  let errors = 0;
  const p = mkPlayer(synth, { onError: () => { errors++; } });
  p.play([{ text: 'a' }, { text: 'b' }], { lang: 'en' });
  p.stop();                              // cancel() re-fires onerror for 'a'
  assert.equal(p.state, 'stopped');
  assert.equal(errors, 0, 'a cancel-induced error must not surface as an error');
  p.play([{ text: 'c' }], { lang: 'en' }); // cancel() re-fires the stale onerror again
  assert.equal(p.state, 'playing');
  assert.equal(synth._last().text, 'c');
  p.retry();                             // cancel() re-fires onerror for the previous 'c'
  assert.equal(p.state, 'playing');
  assert.equal(errors, 0);
});

test('a real error reports exactly once, even when our own cancel() re-fires onerror', () => {
  const synth = fakeSynth({ cancelFiresError: true });
  const seen = [];
  const p = mkPlayer(synth, { onError: (seg, info) => seen.push(info.reason) });
  p.play([{ text: '经文', isScripture: true }, { text: 'x' }], { lang: 'zh' });
  const u = synth._last();
  u.onerror({ error: 'synthesis-failed' });
  assert.deepEqual(seen, ['speak-error'], 'reported once, not once per cancel echo');
  assert.equal(p.state, 'error');
  assert.equal(p.index, 0);
  assert.equal(synth._calls.speak.length, 1, 'no further segment spoken');
  u.onend();                             // a late end for the utterance that already failed
  assert.equal(p.state, 'error');
  assert.equal(p.index, 0, 'a late onend must not advance past the failed segment');
});

test('a duplicate/late onend from the same utterance advances only once', () => {
  const synth = fakeSynth();
  const p = mkPlayer(synth);
  p.play([{ text: 'a' }, { text: 'b' }, { text: 'c' }], { lang: 'en' });
  const u0 = synth._calls.speak[0];
  u0.onend();
  assert.equal(p.index, 1);
  assert.equal(synth._last().text, 'b');
  u0.onend();                            // engines are known to deliver onend twice
  assert.equal(p.index, 1, 'a duplicate onend must not skip a segment');
  assert.equal(synth._calls.speak.length, 2, 'and must not enqueue an extra utterance');
  assert.equal(synth._calls.speak.filter((u) => u.text === 'c').length, 0, 'c must not be reached early');
});

// ---- Synchronous engine failure on speak → error, no advance, no silent Scripture skip ----
test('synchronous speak() failure sets error and does not advance', () => {
  const synth = fakeSynth();
  synth.speak = () => { throw new Error('engine boom'); };
  let erroredSeg = null;
  const p = mkPlayer(synth, { onError: (seg) => { erroredSeg = seg; } });
  p.play([{ text: '经文', isScripture: true }, { text: 'x' }], { lang: 'zh' });
  assert.equal(p.state, 'error');
  assert.equal(p.index, 0, 'must not advance past a Scripture segment that failed to start');
  assert.ok(erroredSeg && erroredSeg.isScripture);
});

// ---- End of a real session queue: last segment end does not enqueue/restart (no loop) ----
test('reaching the end does not re-enqueue or loop to the first segment', () => {
  const synth = fakeSynth();
  const p = mkPlayer(synth);
  const segs = [{ text: 'one' }, { text: 'two' }, { text: 'three' }];
  p.play(segs, { lang: 'en' });
  let guard = 0;
  while (p.state === 'playing' && guard++ < 20) synth._last().onend();
  assert.equal(p.state, 'ended');
  const spokenAtEnd = synth._calls.speak.length;
  assert.equal(spokenAtEnd, segs.length, 'each segment spoken exactly once');
  synth._last().onend();                 // a late/extra end callback after 'ended'
  assert.equal(synth._calls.speak.length, spokenAtEnd, 'no extra speech after the end');
  assert.equal(p.state, 'ended');
  assert.equal(synth._calls.speak.filter((u) => u.text === 'one').length, 1, 'never loops back to the first segment');
});

// ---- Page regression: the player bar must be measured from its rendered box ----
// proverbs-listen.html measured the fixed player with `bar.offsetParent !== null`. Chrome
// reports offsetParent === null for EVERY position:fixed element, visible or not, so the
// bar measured 0: scroll-padding stayed at 10px and the active Scripture (e.g. 1:20-23,
// bottom ~802 at 375x812) was left sitting under a bar whose top was at ~686 (zh) / ~721
// (en). The height must come from the rendered rect + computed display/visibility instead.
const PAGE = fs.readFileSync(new URL('../proverbs-listen.html', import.meta.url), 'utf8');

for (const lang of ['zh', 'en']) {
  test(`page ${lang}: visible pause/continue/replay labels and error guidance survive callbacks`, () => {
    const nodes = new Map();
    const $ = id => {
      if (!nodes.has(id)) nodes.set(id, { textContent: '', style: {}, setAttribute() {} });
      return nodes.get(id);
    };
    const controls = PAGE.slice(PAGE.indexOf('    const PLAY_LABELS'), PAGE.indexOf('    function renderTranscript'));
    const init = PAGE.match(/    const player = createListenPlayer\(\{[\s\S]*?\n    \}\);/)[0];
    const loadPagePlayer = new Function('createListenPlayer', 'synth', 'SpeechSynthesisUtterance', 'lang', '$', 'tr', 'highlight', 'clearHighlight', 'onViewportChange',
      controls + '\n' + init + '\nreturn player;');
    const synth = fakeSynth();
    const p = loadPagePlayer(createListenPlayer, synth, function (text) { this.text = text; }, lang, $, () => ({ err: 'generic error' }), () => {}, () => {}, () => {});
    p.play([{ text: 'first' }]);
    assert.match($('play').textContent, lang === 'zh' ? /暂停/ : /Pause/);
    p.pause();
    assert.match($('play').textContent, lang === 'zh' ? /继续/ : /Continue/);
    p.resume();
    synth._last().onerror();
    assert.match($('play').textContent, lang === 'zh' ? /重播本段/ : /Replay segment/);
    assert.match($('status').textContent, lang === 'zh' ? /从本段开头.*刷新页面/ : /segment over.*refresh/);
    assert.equal($('play').disabled, false, 'manual recovery remains available');
  });
}

// The band helpers live in the page's inline module, so lift visibleHeight() out of the
// source and exercise it against DOM stubs that reproduce the Chrome behaviour.
function visibleHeightSource() {
  const m = PAGE.match(/\n {4}function visibleHeight\(el\) \{[\s\S]*?\n {4}\}/);
  assert.ok(m, 'visibleHeight(el) not found in proverbs-listen.html');
  return m[0];
}
function loadVisibleHeight(view) {
  return new Function('window', `${visibleHeightSource()}\nreturn visibleHeight;`)(view);
}
const stubWindow = { getComputedStyle: (el) => el._computed };
const stubEl = (over = {}) => ({
  offsetParent: null,                       // Chrome: null for position:fixed, visible or not
  hidden: false,
  _computed: { display: 'block', visibility: 'visible' },
  getBoundingClientRect() { return this._rect; },
  getClientRects() { return this._rect.height > 0 && this._computed.display !== 'none' ? [this._rect] : []; },
  _rect: { top: 685.61, bottom: 812, height: 126.39 },
  ...over,
});

test('page: a visible fixed player bar is measured despite offsetParent === null', () => {
  const visibleHeight = loadVisibleHeight(stubWindow);
  assert.equal(visibleHeight(stubEl()), 126.39, 'zh bar height must be measured, not zeroed');
  const en = stubEl({ _rect: { top: 721, bottom: 812, height: 91 } });
  assert.equal(visibleHeight(en), 91, 'en bar is shorter (one row) but just as visible');
});

test('page: a hidden player bar still measures 0 (coming-soon chapters)', () => {
  const visibleHeight = loadVisibleHeight(stubWindow);
  // showComingSoon() sets style.display = 'none' → no client rects, zero box.
  const displayNone = stubEl({ _computed: { display: 'none', visibility: 'visible' }, _rect: { top: 0, bottom: 0, height: 0 } });
  assert.equal(visibleHeight(displayNone), 0);
  // visibility:hidden keeps a box, so the rect alone would wrongly count it.
  const invisible = stubEl({ _computed: { display: 'block', visibility: 'hidden' } });
  assert.equal(visibleHeight(invisible), 0);
  assert.equal(visibleHeight(stubEl({ hidden: true })), 0);
  assert.equal(visibleHeight(null), 0);
});

test('page: nothing decides layout from offsetParent, and the tail padding follows the real bar', () => {
  assert.ok(!/offsetParent/.test(visibleHeightSource()), 'the visibility test must not consult offsetParent');
  assert.ok(!/\.offsetParent/.test(PAGE), 'offsetParent must not be read anywhere to detect the fixed bar');
  assert.match(visibleHeightSource(), /getClientRects|getBoundingClientRect/);
  assert.match(visibleHeightSource(), /getComputedStyle/);
  assert.match(PAGE, /root\.style\.scrollPaddingBottom\s*=\s*[^;]*bandBottom/);
  assert.match(PAGE, /document\.body\.style\.paddingBottom\s*=\s*[^;]*playerH/,
    'tail padding must come from the measured bar height (safe-area + wrapping)');
});

test('page: reduced motion is honoured in CSS as well as in JS', () => {
  const mq = PAGE.match(/@media \(prefers-reduced-motion:reduce\)\{[\s\S]*?\n {4}\}/);
  assert.ok(mq, 'a prefers-reduced-motion:reduce block is required — behavior:"auto" still inherits html{scroll-behavior:smooth}');
  assert.match(mq[0], /html\{scroll-behavior:auto\}/);
  assert.match(mq[0], /\.seg\{transition:none\}/);
  assert.match(mq[0], /\.progress i\{transition:none\}/);
  // Resize repositioning must jump, never animate.
  assert.match(PAGE, /scrollSegIntoView\(node, 'instant'\)/);
  assert.match(PAGE, /if \(instant\) root\.style\.scrollBehavior = 'auto'/);
});

// ---- End-to-end over the built Chapter-1 queue: last scripture/prayer end does not restart ----
test('built Chapter-1 queue plays once through to ended with no restart', async () => {
  const ch1 = await load(1);
  const session = proverbsListen.sessions.find((s) => s.n === 1);
  const segs = buildSegments(session, ch1, 'zh');
  const synth = fakeSynth();
  const p = mkPlayer(synth);
  p.play(segs, { lang: 'zh' });
  let guard = 0;
  while (p.state === 'playing' && guard++ < 200) synth._last().onend();
  assert.equal(p.state, 'ended');
  assert.equal(synth._calls.speak.length, segs.length, 'every segment spoken exactly once');
});
