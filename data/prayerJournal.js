const KEY = 'bible_prayer_journal_v1';
function validEntry(r) {
  const date = value => typeof value === 'string' && Number.isFinite(Date.parse(value));
  return !!r && typeof r.id === 'string' && !!r.id && typeof r.topic === 'string'
    && date(r.date) && ['praying','waiting','answered'].includes(r.status)
    && Array.isArray(r.sessions) && r.sessions.length > 0
    && r.sessions.every(s => date(s?.date) && typeof s.input === 'string'
      && typeof s.response?.prayer === 'string' && s.response.prayer.trim()
      && Array.isArray(s.response.verses) && s.response.verses.every(v => v && ['text','ref','version'].every(k => typeof v[k] === 'string')))
    && Array.isArray(r.notes) && r.notes.every(n => typeof n?.text === 'string' && date(n.date));
}
export function rawJournal(storage = localStorage) { return storage.getItem(KEY) || '[]'; }
export function inspectJournal(storage = localStorage) {
  const rows = JSON.parse(rawJournal(storage));
  if (!Array.isArray(rows)) throw Error('journal_invalid');
  const ids = new Set();
  const entries = rows.filter(row => {
    if (!validEntry(row) || ids.has(row.id)) return false;
    ids.add(row.id); return true;
  });
  return {rows, entries, damaged: rows.length - entries.length};
}
export function readJournal(storage = localStorage) {
  return inspectJournal(storage).entries;
}
export function writeEntry(entry, storage = localStorage) {
  if (!validEntry(entry)) throw Error('journal_invalid_entry');
  // Retain quarantined rows verbatim for raw backup/recovery, even after later saves.
  const {rows} = inspectJournal(storage);
  const i = rows.findIndex(r => validEntry(r) && r.id === entry.id);
  if (i < 0) rows.unshift(entry); else rows[i] = entry;
  // Commit before reporting success. Quota/private-mode failures retain the previous value.
  storage.setItem(KEY, JSON.stringify(rows));
  return entry;
}
export function newEntry(topic, data, lang) {
  const now = new Date().toISOString();
  return {id: crypto.randomUUID(), topic, date: now, updated: now, lang, status: 'praying', notes: [], sessions: [{date: now, input: topic, response: data}]};
}
export function updateEntry(id, change, storage = localStorage) {
  const latest = readJournal(storage).find(entry => entry.id === id);
  if (!latest) throw Error('journal_missing');
  return writeEntry({...change(latest), id, updated: new Date().toISOString()}, storage);
}
export function continuation(entry, update, lang) {
  return {topic: entry.topic.slice(0,1000), previousPrayer: entry.sessions.at(-1).response.prayer.slice(0,4000), updates: entry.notes.slice(-3).map(n => n.text.slice(0,1000)), update, lang};
}
