import {inspectJournal, rawJournal, readJournal, writeEntry, updateEntry, newEntry, continuation} from '../data/prayerJournal.js';
const T = {
zh: {title:'我的祷告本', privacy:'仅保存在当前浏览器，不跨设备同步；清除浏览器数据会丢失记录。继续祷告时，会发送本主题、最近祷告与最多三条后续记录给 AI。', save:'保存到我的祷告本', saved:'已保存到祷告本', follow:'继续为此祷告', record:'记录神的回应', note:'写下你观察到的回应、变化或仍在等待的事（这是你的个人记录）', add:'保存记录', empty:'还没有保存的祷告。', error:'无法读取或保存祷告本，请检查浏览器储存空间。原有记录未被覆盖。', update:'今天有什么新的情况？', send:'根据近况继续祷告', praying:'持续祷告中', waiting:'等候中', answered:'已记录回应', status:'当前状态', export:'导出备份', action:'今日行动', history:'祷告与后续记录'},
en: {title:'My prayer journal', privacy:'Saved only in this browser; no cross-device sync. Clearing browser data removes entries. Continuing sends this topic, the latest prayer and up to three notes to AI.', save:'Save to my prayer journal', saved:'Saved to journal', follow:'Continue praying for this', record:'Record God’s response', note:'Describe what you observed, changes, or what you are still waiting for (your personal record)', add:'Save note', empty:'No saved prayers yet.', error:'Could not read or save the journal. Check browser storage. Existing records were not overwritten.', update:'What has changed today?', send:'Pray with this update', praying:'Praying', waiting:'Waiting', answered:'Response recorded', status:'Current status', export:'Export backup', action:'Today’s action', history:'Prayers and follow-up notes'}
};
function node(tag, text, parent) { const e=document.createElement(tag); if(text)e.textContent=text; parent?.append(e); return e; }
function button(text, parent, fn){const e=node('button',text,parent);e.type='button';e.addEventListener('click',fn);return e;}
export function mountJournal(host, getLang, onContinue) {
  host.classList.add('prayer-journal');
  if(!document.getElementById('journal-style')){const s=node('style');s.id='journal-style';s.textContent='.prayer-journal{margin-top:24px;color:inherit;overflow-wrap:anywhere}.prayer-journal button,.prayer-journal select,.prayer-journal textarea{font:inherit;max-width:100%;border:1px solid #887443;border-radius:8px;background:#1b2228;color:#f4f1ea;padding:10px;margin:5px 5px 5px 0;min-height:44px}.prayer-journal textarea{display:block;width:100%;font-size:16px}.prayer-journal summary{cursor:pointer;padding:12px 0;min-height:44px}.prayer-journal article{border-top:1px solid #58606a;padding:14px 0}.prayer-journal p{white-space:pre-wrap}.prayer-journal :focus-visible{outline:3px solid #d4af37;outline-offset:3px}';document.head.append(s);}
  let active=null;
  function render(){const wasOpen=!!host.querySelector('details')?.open;host.replaceChildren();const t=T[getLang()];const status=node('p','',host);status.setAttribute('role','status');
    const details=node('details','',host);details.open=wasOpen;node('summary',t.title,details);node('p',t.privacy,details);

    button(t.export,details,()=>{try{const blob=new Blob([rawJournal()],{type:'application/json'});const url=URL.createObjectURL(blob);const a=node('a');a.href=url;a.download='prayer-journal.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch{status.textContent=t.error;}});
    let entries;try{const state=inspectJournal();entries=state.entries;if(state.damaged)status.textContent=getLang()==='zh'?'有损坏记录已隔离，其余记录可继续使用。导出备份会保留全部原始数据。':'Damaged entries are isolated. Other entries remain available; export preserves all original data.';}catch{status.textContent=t.error;return;}
    if(!entries.length)node('p',t.empty,details);
    entries.forEach(entry=>{const card=node('article','',details);node('h3',entry.topic,card);node('p',new Date(entry.date).toLocaleString(getLang()==='zh'?'zh-CN':'en'),card);
      const label=node('label',t.status+' ',card);const select=node('select','',label);for(const key of ['praying','waiting','answered']){const o=node('option',t[key],select);o.value=key;}select.value=entry.status;
      select.onchange=()=>{try{updateEntry(entry.id, latest => ({...latest,status:select.value}));entry.status=select.value;}catch{select.value=entry.status;status.textContent=t.error;}};
      const history=node('details','',card);node('summary',t.history,history);
      entry.sessions.forEach(session=>{node('p',new Date(session.date).toLocaleString(getLang()==='zh'?'zh-CN':'en'),history);node('p',session.input,history);for(const v of session.response.verses)node('p',v.text+' — '+v.ref+' · '+v.version,history);node('p',session.response.prayer,history);node('p',t.action+': '+session.response.encouragement,history);});
      entry.notes.forEach(n=>node('p',new Date(n.date).toLocaleString(getLang()==='zh'?'zh-CN':'en')+'\n'+n.text,history));
      const edit=node('div','',card);
      button(t.record,card,()=>{edit.replaceChildren();const l=node('label',t.note,edit);const input=node('textarea','',l);input.maxLength=1000;button(t.add,edit,()=>{if(!input.value.trim())return;try{updateEntry(entry.id, latest => ({...latest,notes:[...latest.notes,{date:new Date().toISOString(),text:input.value.trim()}]}));render();host.querySelector('details').open=true;}catch{status.textContent=t.error;}});input.focus();});
      button(t.follow,card,()=>{edit.replaceChildren();const l=node('label',t.update,edit);const input=node('textarea','',l);input.maxLength=1000;node('p',t.privacy,edit);button(t.send,edit,()=>{if(!input.value.trim())return;try{const latest=readJournal().find(row => row.id === entry.id);if(!latest)throw Error('journal_missing');active=entry.id;onContinue(input.value.trim(),continuation(latest,input.value.trim(),getLang()));}catch{status.textContent=t.error;}});input.focus();});
    });
  }
  render();
  window.addEventListener('storage',e=>{if(e.key==='bible_prayer_journal_v1' && !Array.from(host.querySelectorAll('textarea')).some(e=>e.value.trim()))render();});
  return {render, reset(){active=null;}, attach(target,data,input,lang){const box=node('div','',target);box.className='prayer-journal';const t=T[lang];const msg=node('p','',box);msg.setAttribute('role','status');let saved=false;const entryId=active;
    button(t.save,box,()=>{if(saved)return;try{if(entryId){const entry=readJournal().find(e=>e.id===entryId);if(!entry)throw Error();writeEntry({...entry,updated:new Date().toISOString(),sessions:[...entry.sessions,{date:new Date().toISOString(),input,response:data}]});}else{const entry=newEntry(input,data,lang);writeEntry(entry);active=entry.id;}saved=true;msg.textContent=t.saved;render();}catch{msg.textContent=t.error;}});
  }};
}
