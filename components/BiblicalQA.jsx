/* ============================================================
   BiblicalQA.jsx — React component for the open-ended Scripture Q&A
   ------------------------------------------------------------
   ⚠️ NOT WIRED INTO THE CURRENT SITE. This project is served as
   static HTML with native ES modules and has NO React / JSX build
   step, so importing this file from a page would fail to compile.
   The LIVE, working component is the framework-free equivalent
   `components/biblical-qa.js` (mountBiblicalQA), which is what the
   Library, Ecclesiastes, John and ask.html pages actually use.

   This .jsx is provided so the feature drops straight into a future
   React / Vite / Next build with zero rewrite. It is view-only and
   shares the SAME matching engine (`data/qaEngine.js`) — no logic is
   duplicated, and there is no AI backend or network call.

   Usage (once a React build exists):
     import BiblicalQA from './components/BiblicalQA.jsx';
     <BiblicalQA lang={lang} />            // lang: 'zh' | 'en'
   ============================================================ */

import React, { useState, useRef, useEffect } from 'react';
import { getBiblicalResponse } from '../data/qaEngine.js';

const UI = {
  zh: {
    title: '用圣经回应人生问题',
    subtitle: '你可以把真实的问题、焦虑、疑惑和生命处境带到这里。',
    inputLabel: '你想问什么?',
    placeholder: '例如:我为什么总觉得空虚?神真的爱我吗?我很焦虑怎么办?',
    button: '用圣经回应我',
    loading: '正在从圣经中寻找回应……',
    guided: '不知从何问起?试试这些:',
    labels: { verse: '相关经文', explanation: '简短解释', reflection: '默想问题', nextStep: '下一步', prayer: '祷告', relatedBooks: '相关书卷' },
    safetyFooter: '如果你正处于紧急危机中,请立即拨打 988(美国)或联系你信任的人。'
  },
  en: {
    title: 'Biblical Q&A',
    subtitle: 'Bring your real questions, struggles, doubts, and life situations into the light of Scripture.',
    inputLabel: 'What would you like to ask?',
    placeholder: 'For example: Why do I feel empty? Does God really love me? What does the Bible say about anxiety?',
    button: 'Answer from Scripture',
    loading: 'Searching Scripture for a response...',
    guided: 'Not sure where to start? Try one:',
    labels: { verse: 'Relevant Scripture', explanation: 'Reflection', reflection: 'Question for Reflection', nextStep: 'Next Step', prayer: 'Prayer', relatedBooks: 'Related Books' },
    safetyFooter: 'If you are in immediate crisis, please call or text 988 (United States) or reach out to someone you trust.'
  }
};

const PILLS = {
  zh: ['我为什么总觉得空虚?', '我很焦虑怎么办?', '神真的爱我吗?', '我想认识耶稣'],
  en: ['Why do I feel empty?', 'What does the Bible say about anxiety?', 'Does God really love me?', 'How can I know Jesus?']
};

const BOOK_LINKS = {
  ecclesiastes: { zh: '读传道书', en: 'Read Ecclesiastes', href: 'ecclesiastes.html' },
  john: { zh: '读约翰福音', en: 'Read John', href: 'john.html' },
  psalms: { zh: '读诗篇', en: 'Read Psalms', href: 'psalms.html' }
};

const LOADING_MS = 700;

export default function BiblicalQA({ lang = 'zh' }) {
  const L = lang === 'en' ? 'en' : 'zh';
  const t = UI[L];
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [asked, setAsked] = useState('');
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  function ask(qRaw) {
    const q = (qRaw != null ? qRaw : value).trim();
    if (!q) return;
    setAsked(q);
    clearTimeout(timer.current);

    const r = getBiblicalResponse(q, L);
    if (r.id === 'crisis') {           // §1.3 — crisis skips the loading state
      setLoading(false);
      setResponse(r);
      return;
    }
    setLoading(true);
    setResponse(null);
    timer.current = setTimeout(() => {
      setLoading(false);
      setResponse(getBiblicalResponse(q, L));
    }, LOADING_MS);
  }

  function onPill(text) { setValue(text); ask(text); }
  function onKeyDown(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); } }

  return (
    <section className="bqa-root">
      <div className="bqa-head">
        <div className="bqa-eyebrow">{L === 'zh' ? '本站核心 · 随便问' : 'The heart of this site · Ask'}</div>
        <h2 className="bqa-title">{t.title}</h2>
        <p className="bqa-sub">{t.subtitle}</p>
      </div>

      <div className="bqa-box">
        <div className="bqa-label">{t.inputLabel}</div>
        <textarea
          className="bqa-input" rows={3} value={value}
          placeholder={t.placeholder}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className="bqa-go"><button className="bqa-btn" onClick={() => ask()}>{t.button}</button></div>
        <div className="bqa-guided">
          <div className="g-hint">{t.guided}</div>
          <div className="bqa-chips">
            {PILLS[L].map((p) => (
              <button key={p} type="button" className="bqa-chip" onClick={() => onPill(p)}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="bqa-answer" aria-live="polite">
        {loading && (
          <div className="bqa-loading">
            <span>{t.loading}</span>
            <span className="dot" /><span className="dot" /><span className="dot" />
          </div>
        )}
        {!loading && response && <ResponseCard r={response} t={t} L={L} asked={asked} />}
      </div>

      <p className="bqa-safety">{t.safetyFooter}</p>
    </section>
  );
}

function ResponseCard({ r, t, L, asked }) {
  const crisis = r.id === 'crisis';
  return (
    <div className={'bqa-card' + (crisis ? ' crisis' : '')}>
      {asked && <div className="bqa-qecho">{asked}</div>}
      <div className="bqa-ctitle">{r.title}</div>
      <Section label={t.labels.verse}><div className="bqa-verse">{r.verse}</div></Section>
      <Section label={t.labels.explanation}><div className="bqa-body">{r.explanation}</div></Section>
      <Section label={t.labels.reflection}><div className="bqa-body">{r.reflection}</div></Section>
      <Section label={t.labels.nextStep}><div className="bqa-body">{r.nextStep}</div></Section>
      <Section label={t.labels.prayer} className="pray"><div className="bqa-body">{r.prayer}</div></Section>
      {Array.isArray(r.relatedBooks) && r.relatedBooks.length > 0 && (
        <Section label={t.labels.relatedBooks}>
          <div className="bqa-links">
            {r.relatedBooks.map((b) => {
              const lk = BOOK_LINKS[b];
              return lk ? <a key={b} href={lk.href}>{L === 'zh' ? lk.zh : lk.en}</a> : null;
            })}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ label, className = '', children }) {
  return (
    <div className={'bqa-sect ' + className}>
      <div className="bqa-slabel">{label}</div>
      {children}
    </div>
  );
}
