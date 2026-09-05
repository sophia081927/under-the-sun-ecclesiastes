// Shared response contract. A structurally valid response still needs editorial review.
export function validPrayer(data, lang) {
  const text = (s, max = 12000) => typeof s === 'string' && s.trim().length > 0 && s.length <= max;
  const version = lang === 'en' ? 'World English Bible (WEB)' : '和合本';
  return !!data && typeof data.crisis === 'boolean'
    && ['understanding', 'explanation', 'prayer'].every(k => text(data[k]))
    && typeof data.encouragement === 'string' && typeof data.safety === 'string'
    && (!data.crisis || text(data.safety))
    && Array.isArray(data.verses) && data.verses.length >= 1 && data.verses.length <= 3
    && data.verses.every(v => v && text(v.ref, 120) && /\d+[:：]\d+/.test(v.ref)
      && v.version === version && text(v.text, 5000));
}
