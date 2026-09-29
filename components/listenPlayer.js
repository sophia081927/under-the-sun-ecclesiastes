/*
 * Reusable Listen player + pure helpers (Proverbs Phase A).
 * -----------------------------------------------------------------------------
 * Establishes a base for future reuse. The existing listen pages (Revelation via
 * chapterReader.toListenBlocks; Ecclesiastes/John/Psalms inline) are NOT migrated
 * here — this is a new module used only by proverbs-listen.html, so it does not
 * yet remove their duplication.
 *
 * Design goals (per design review):
 *  - Scripture text is resolved from the already corpus-verified chapter data
 *    (data/books/proverbs/chNN.js) — never re-typed here.
 *  - Chinese merged verses (和合本 merges e.g. 23:31–32, 26:18–19) are read ONCE:
 *    the combined text lives on the anchor verse; the merged verse carries an
 *    empty zh + zhMergedWithPrev. Selecting any verse of a merged unit pulls in
 *    the whole unit; zh is emitted once (no omission, no duplication, no rewrite).
 *  - Spoken segment labels ("经文选读/Scripture" …) and spoken references are
 *    NAVIGATION speech, marked isScripture:false, and never participate in corpus
 *    comparison.
 *  - Player is engine-injectable (synth/makeUtterance) so it is unit-testable in
 *    Node without a browser. Stale callbacks are guarded by a generation token that is
 *    bumped BEFORE every cancel(), and each utterance settles at most once, so neither a
 *    callback fired from inside our own cancel() nor a late/duplicate one can advance the
 *    queue. A real (non-cancel) speech error does NOT silently skip a Scripture segment.
 *  - Engine failures are explicit, never papered over: if the engine refuses to un-pause
 *    (resume() no-ops or throws) the player reports 'error' and keeps the current segment
 *    instead of claiming 'playing' over a mute engine. Recovery is the user's retry() —
 *    there is no timer/watchdog that could double-speak.
 */

export const LISTEN_LABELS = {
  zh: { intro: '导读', scripture: '经文选读', reflection: '默想', prayer: '祷告', refPrefix: '箴言' },
  en: { intro: 'Introduction', scripture: 'Scripture', reflection: 'Reflection', prayer: 'Prayer', refPrefix: 'Proverbs' },
};

/** Parse a whole-verse reference: "1:7" or "1:8-9" (no half verses). */
export function parseRef(ref) {
  const m = String(ref).trim().match(/^(\d+):(\d+)(?:-(\d+))?$/);
  if (!m) throw new Error(`Bad verse ref (expect "C:V" or "C:V-V"): ${ref}`);
  const from = +m[2];
  const to = m[3] ? +m[3] : from;
  if (to < from) throw new Error(`Bad verse range: ${ref}`);
  return { ch: +m[1], from, to };
}

/**
 * Resolve selected refs of ONE chapter into ordered Scripture groups.
 * Returns [{ ref, from, to, displayRef, zh, en }]; text is verbatim from chapterData.
 * Expands each selection to the full Chinese merged unit and reads combined zh once.
 */
export function resolveScripture(chapterData, refs) {
  const byNum = new Map(chapterData.verses.map((v) => [v.v, v]));
  const groups = refs.map((ref) => {
    const { ch, from, to } = parseRef(ref);
    if (ch !== chapterData.n) throw new Error(`ref ${ref} is not in chapter ${chapterData.n}`);
    let lo = from;
    let hi = to;
    // Pull the start back to the anchor that holds the combined zh, and extend the
    // end across any trailing verse merged into it, so the whole unit is included.
    while (byNum.get(lo) && byNum.get(lo).zhMergedWithPrev) lo--;
    while (byNum.get(hi + 1) && byNum.get(hi + 1).zhMergedWithPrev) hi++;
    const vs = [];
    for (let n = lo; n <= hi; n++) {
      const v = byNum.get(n);
      if (!v) throw new Error(`verse ${chapterData.n}:${n} missing from chapter data`);
      vs.push(v);
    }
    const zh = vs.filter((v) => !v.zhMergedWithPrev && v.zh && v.zh.trim()).map((v) => v.zh.trim()).join(' ');
    const en = vs.filter((v) => !v.enMergedWithPrev && v.en && v.en.trim()).map((v) => v.en.trim()).join(' ');
    const displayRef = lo === hi ? `${chapterData.n}:${lo}` : `${chapterData.n}:${lo}-${hi}`;
    return { ref, from: lo, to: hi, displayRef, zh, en };
  });
  // Reject overlapping/duplicate selections BEFORE playback. After merge-expansion two
  // refs can cover the same unit (e.g. '23:31' and '23:32' both expand to 23:31-32),
  // which would read the same Scripture twice. Fail loudly rather than duplicate.
  for (let i = 0; i < groups.length; i++) {
    for (let j = i + 1; j < groups.length; j++) {
      const a = groups[i];
      const b = groups[j];
      if (a.from <= b.to && b.from <= a.to) {
        throw new Error(
          `overlapping scripture selection in chapter ${chapterData.n}: `
          + `"${refs[i]}" (${a.displayRef}) and "${refs[j]}" (${b.displayRef}) overlap`);
      }
    }
  }
  return groups;
}

/**
 * Build the ordered listen segments for a session in one language.
 * Each segment: { kind:'label'|'text'|'ref'|'scripture', section, text, isScripture, ref? }.
 * Only kind:'scripture' has isScripture:true.
 */
export function buildSegments(session, chapterData, lang) {
  const L = LISTEN_LABELS[lang] || LISTEN_LABELS.zh;
  const pick = (base) => session[base + (lang === 'zh' ? 'Zh' : 'En')];
  const segs = [];
  segs.push({ kind: 'label', section: 'intro', text: L.intro, isScripture: false });
  segs.push({ kind: 'text', section: 'intro', text: pick('intro'), isScripture: false });
  segs.push({ kind: 'label', section: 'scripture', text: L.scripture, isScripture: false });
  for (const g of resolveScripture(chapterData, (session.scripture || []).map((s) => s.ref))) {
    segs.push({ kind: 'ref', section: 'scripture', text: `${L.refPrefix} ${g.displayRef}`, ref: g.displayRef, isScripture: false });
    segs.push({ kind: 'scripture', section: 'scripture', text: lang === 'zh' ? g.zh : g.en, ref: g.displayRef, isScripture: true });
  }
  segs.push({ kind: 'label', section: 'reflection', text: L.reflection, isScripture: false });
  segs.push({ kind: 'text', section: 'reflection', text: pick('reflect'), isScripture: false });
  segs.push({ kind: 'label', section: 'prayer', text: L.prayer, isScripture: false });
  segs.push({ kind: 'text', section: 'prayer', text: pick('prayer'), isScripture: false });
  return segs;
}

/** Prev/next chapter for listen nav. No wrap: chapter maxN has next:null (never loops to 1). */
export function chapterNav(n, maxN) {
  return { prev: n > 1 ? n - 1 : null, next: n < maxN ? n + 1 : null };
}

/** First voice matching the language, or null (caller falls back to the platform default). */
export function pickVoice(synth, lang) {
  if (!synth || typeof synth.getVoices !== 'function') return null;
  const prefix = lang === 'zh' ? 'zh' : 'en';
  const voices = synth.getVoices() || [];
  return voices.find((v) => (v.lang || '').toLowerCase().startsWith(prefix)) || null;
}

/**
 * Create a segment player over an injectable speech engine.
 *   synth        — a SpeechSynthesis-like object (speak/cancel/pause/resume)
 *   makeUtterance— (text) => SpeechSynthesisUtterance-like ({ text, lang, rate, voice, onend, onerror })
 * Callbacks: onSegmentStart(i,seg), onProgress(fraction), onStateChange(state), onError(seg,event).
 * States: 'idle' | 'playing' | 'paused' | 'resuming' | 'stopped' | 'ended' | 'error'.
 */
export function createListenPlayer({ synth, makeUtterance, onSegmentStart, onProgress, onStateChange, onError, resumeTimeoutMs = 1000 } = {}) {
  let token = 0;        // generation id; bumped on every play()/stop() so stale callbacks are ignored
  let idx = 0;
  let segs = [];
  let opts = {};
  let state = 'idle';
  let resumeTimer = null;
  let activeUtterance = null;
  const clearResumeWait = () => { clearTimeout(resumeTimer); resumeTimer = null; };

  const setState = (s) => { state = s; if (onStateChange) onStateChange(s); };
  const cancel = () => { try { if (synth) synth.cancel(); } catch (e) { /* ignore */ } };
  // Web Speech spec: cancel() and speak() do NOT clear a prior paused state. If the
  // engine was left paused (e.g. pause → stop, or pause → language switch), a fresh
  // speak() would be queued but silent. Clear the paused flag before new speech so the
  // UI never claims "playing" over a silent engine.
  // Wait briefly for engines that update paused asynchronously. This never replays
  // speech. Stop/switch invalidates the wait; a genuine refusal becomes an error.
  const clearPaused = (myToken, done, reason) => {
    clearResumeWait();
    try {
      if (synth && synth.paused) synth.resume();
    } catch (e) {
      fail(segs[idx], reason, e);
      return;
    }
    if (myToken !== token) return;
    if (!synth?.paused) { done(); return; }
    // Engine state can update after resume() returns. Wait without replaying.
    setState('resuming');
    const deadline = Date.now() + resumeTimeoutMs;
    const check = () => {
      resumeTimer = null;
      if (myToken !== token || state !== 'resuming') return;
      if (!synth.paused) { done(); return; }
      if (Date.now() >= deadline) { fail(segs[idx], reason); return; }
      resumeTimer = setTimeout(check, 20);
    };
    resumeTimer = setTimeout(check, 20);
  };
  // Enter the recoverable 'error' state on a real failure: invalidate the generation and
  // cancel so any delayed onend/onerror can no longer advance; keep idx (current segment)
  // so the user can Replay it.
  const fail = (seg, reason, error) => {
    token++;
    clearResumeWait();
    activeUtterance = null;
    cancel();
    setState('error');
    if (onError) onError(seg || null, error ? { index: idx, reason, error } : { index: idx, reason });
  };

  function speakNext(myToken) {
    if (myToken !== token) return;                         // stale
    if (idx >= segs.length) { setState('ended'); if (onProgress) onProgress(1); return; }
    const seg = segs[idx];
    if (onSegmentStart) onSegmentStart(idx, seg);
    // One utterance settles exactly once. Engines are known to deliver a late second
    // callback (onend after onerror, a duplicate onend, or an onerror fired synchronously
    // from inside our own cancel()); without this the queue could advance twice or a
    // cancel could be mistaken for a real failure.
    let settled = false;
    try {
      const u = makeUtterance(seg.text);
      activeUtterance = u;
      u.lang = opts.lang === 'zh' ? 'zh-CN' : 'en-US';
      if (opts.rate) u.rate = opts.rate;
      if (opts.voice) u.voice = opts.voice;
      u.onend = () => {
        if (settled || myToken !== token) return;          // duplicate/late, or stale after stop/switch
        settled = true;
        activeUtterance = null;
        idx++;
        if (onProgress) onProgress(segs.length ? idx / segs.length : 1);
        if (state !== 'paused' && state !== 'resuming') speakNext(myToken);
      };
      u.onerror = () => {
        if (settled || myToken !== token) return;          // cancel-induced / stale / duplicate errors ignored
        settled = true;
        fail(seg, 'speak-error');                          // invalidate + do NOT advance past a failed segment
      };
      synth.speak(u);
    } catch (e) {
      if (settled || myToken !== token) return;            // already reported synchronously, or stale
      settled = true;
      fail(seg, 'speak-failed', e);                        // synchronous engine failure → invalidate, no advance
    }
  }

  return {
    play(segments, options = {}) {
      token++;                                             // invalidate any in-flight callbacks first
      const myToken = token;
      clearResumeWait();
      activeUtterance = null;
      cancel();
      segs = Array.isArray(segments) ? segments : [];
      opts = options;
      idx = 0;
      if (onProgress) onProgress(0);
      clearPaused(myToken, () => { setState('playing'); speakNext(myToken); }, 'paused');
      return myToken;
    },
    pause() {
      if (state !== 'playing') return;
      setState('paused');
      try {
        if (synth) synth.pause();
      } catch (e) {
        fail(segs[idx], 'pause-failed', e);                // engine threw → do NOT claim paused
        return;
      }
    },
    resume() {
      if (state !== 'paused') return;
      const myToken = token;
      clearPaused(myToken, () => {
        setState('playing');
        if (!activeUtterance) speakNext(myToken);
      }, 'resume-failed');
    },
    // Explicit, user-triggered replay of the CURRENT segment. This is the conservative
    // recovery when resume() proves unreliable on a platform (some engines no-op resume):
    // rather than an automatic watchdog that could double-speak, the user asks for a
    // replay. Old generation is invalidated first so no stale callback duplicates speech.
    retry() {
      if (!segs.length) return null;
      token++;
      const myToken = token;
      clearResumeWait();
      activeUtterance = null;
      cancel();
      if (idx >= segs.length) idx = segs.length - 1;       // clamp if called after 'ended'
      clearPaused(myToken, () => {
        if (onProgress) onProgress(segs.length ? idx / segs.length : 0);
        setState('playing');
        speakNext(myToken);
      }, 'paused');
      return myToken;
    },
    stop() {
      token++;                                             // invalidate in-flight callbacks, then cancel
      clearResumeWait();
      activeUtterance = null;
      cancel();
      idx = 0;
      if (onProgress) onProgress(0);
      setState('stopped');
    },
    get state() { return state; },
    get index() { return idx; },
    get length() { return segs.length; },
  };
}

export default createListenPlayer;
