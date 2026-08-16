/* ============================================================
   crisisLexicon.js — 全站唯一的危机词库与分级判定（共享层）
   诗篇 / 箴言 / 传道书 / 约翰 的所有自由文本入口共用此实现。
   两级：
     high      — 明确高危（自伤意念、绝望、家暴/被侵犯等）→ 危机卡片
     ambiguous — 模糊地带（可能只是疲惫，也可能是求助信号）
                 → 温和澄清 + 把支持资源作为一个"选项"，不诊断、不追问
   规则：high 命中优先于 ambiguous；两者都优先于任何经文匹配。
   ⚠️ high 列表保持与历史实现一致，确保既有危机检测行为不回退。
   ============================================================ */

export const CRISIS_HIGH = {
  zh: ['想死', '自杀', '不想活', '不想活了', '伤害自己', '被打', '家暴', '被侵犯', '轻生',
       '活不下去', '想结束生命', '没人救我', '结束生命', '结束自己', '撑不住了', '不想醒来'],
  en: ['suicide', 'kill myself', 'killing myself', 'want to die', 'self harm', 'self-harm',
       'abuse', 'domestic violence', 'assault', 'end my life', 'hurt myself', 'no reason to live',
       'cannot go on', 'cant go on', "can't go on", 'want to disappear'],
};

// 模糊地带：既可能是日常疲惫、也可能是求助信号。宁可温和，不误报成危机页。
export const CRISIS_AMBIGUOUS = {
  zh: ['撑不下去', '受不了了', '快撑不住', '坚持不下去', '活着好累', '活着好难', '活着没意思',
       '我不想再撑了', '不想再撑', '喘不过气', '好累好累', '快崩溃了', '要崩溃了'],
  en: ['too much to handle', "can't take it anymore", 'cannot take it anymore', 'so tired of everything',
       'want to give up', 'about to break', 'breaking down', "can't keep going", 'so done with everything'],
};

const norm = (s) => (s || '').toLowerCase();
const hit = (input, list) => list.some((kw) => input.includes(kw.toLowerCase()));

/** 返回 'high' | 'ambiguous' | null。high 永远优先。 */
export function detectCrisisTier(userInput) {
  const input = norm(userInput);
  if (!input) return null;
  if (hit(input, CRISIS_HIGH.zh) || hit(input, CRISIS_HIGH.en)) return 'high';
  if (hit(input, CRISIS_AMBIGUOUS.zh) || hit(input, CRISIS_AMBIGUOUS.en)) return 'ambiguous';
  return null;
}
