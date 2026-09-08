import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import worker from '../worker/prayer-worker.js';
import {resolveVerses,BOOKS} from '../worker/scripture-resolver.js';
const base=new URL('../worker/scripture-assets/',import.meta.url);
const load=async(lang,book,chapter)=>JSON.parse(await readFile(new URL(`${lang}/${book}/${chapter}.json`,base),'utf8'));
const env={ANTHROPIC_API_KEY:'test-only-not-a-real-key',PRAYER_RATE_LIMITER:{limit:async()=>({success:true})},SCRIPTURE_ASSETS:{fetch:async req=>{
 try{return new Response(await readFile(new URL(new URL(req.url).pathname.slice(1),base)));}catch{return new Response('',{status:404});}
}}};
const valid={crisis:false,understanding:'I hear your concern.',verses:[{book:'JHN',chapter:11,verseStart:35}],explanation:'Jesus shares our grief.',prayer:'God, please comfort this grieving family.',encouragement:'Reach out to a friend.',safety:''};
const req=(body={input:'Please pray for my grief',lang:'en'},origin='https://lightoflifebible.org')=>new Request('https://worker.test',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1'},body:JSON.stringify(body)});
const upstream=(data=valid,stop='end_turn')=>new Response(JSON.stringify({stop_reason:stop,content:[{type:'text',text:JSON.stringify(data)}]}));
test('all 2378 chapters have pinned hashes, all 66 books have expected chapter counts',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../worker/scripture-manifest.json',import.meta.url),'utf8'));
 for(const lang of ['en','zh']){
  assert.equal(Object.keys(manifest.chapters[lang]).length,1189);
  for(const [book,info] of Object.entries(BOOKS))for(let chapter=1;chapter<=info.chapters;chapter++){
   const key=`${book}/${chapter}`;const bytes=await readFile(new URL(`${lang}/${key}.json`,base));
   assert.equal(createHash('sha256').update(bytes).digest('hex'),manifest.chapters[lang][key]);
   const verses=JSON.parse(bytes); const start=Number(Object.keys(verses)[0]);
   const [result]=await resolveVerses([{book,chapter,verseStart:start}],lang,load);
   assert.equal(result.text,verses[start]);
  }
 }
});
test('service inserts real source text and ignores invented AI text/version',async()=>{
 globalThis.fetch=async()=>upstream({...valid,verses:[{...valid.verses[0],text:'invented',version:'KJV'}]});
 const response=await worker.fetch(req(),env);assert.equal(response.status,200);
 const result=await response.json();assert.equal(result.verses[0].text,(await load('en','JHN',11))['35']);assert.equal(result.verses[0].version,'World English Bible (WEB)');
});
test('Chinese source text including fullwidth spaces is exact',async()=>{
 globalThis.fetch=async()=>upstream({...valid,verses:[{book:'GEN',chapter:1,verseStart:1}]});
 const response=await worker.fetch(req({input:'请为我祷告',lang:'zh'}),env);
 assert.equal((await response.json()).verses[0].text,(await load('zh','GEN',1))['1']);
});
test('invented references fail without a fixed fallback',async()=>{
 for(const verses of [[{book:'JHN',chapter:99,verseStart:1}],[{book:'JHN',chapter:3,verseStart:999}],[]]){
 globalThis.fetch=async()=>upstream({...valid,verses});const r=await worker.fetch(req(),env);assert.equal(r.status,502);assert.equal((await r.json()).error,'bad_reference');}
});
test('unconfigured and rate-limited requests never call AI',async()=>{
 globalThis.fetch=()=>{throw Error('must not call');};
 assert.equal((await worker.fetch(req(),{})).status,503);
 assert.equal((await worker.fetch(req(),{...env,PRAYER_RATE_LIMITER:{limit:async()=>({success:false})}})).status,429);
 assert.equal((await worker.fetch(req(undefined,'https://evil.test'),env)).status,403);
});
test('incomplete structure and truncated completions are rejected',async()=>{
 for(const data of [{...valid,understanding:''},{...valid,crisis:'false'},{...valid,crisis:true,safety:''}]){globalThis.fetch=async()=>upstream(data);assert.equal((await worker.fetch(req(),env)).status,502);}
 globalThis.fetch=async()=>upstream(valid,'max_tokens');assert.equal((await worker.fetch(req(),env)).status,502);
});
test('missing assets fail instead of releasing AI scripture',async()=>{
 globalThis.fetch=async()=>upstream();
 assert.equal((await worker.fetch(req(),{...env,SCRIPTURE_ASSETS:{fetch:async()=>new Response('',{status:404})}})).status,502);
});
test('unsafe integers are rejected before a loop can stall',async()=>{
 await assert.rejects(resolveVerses([{book:'JHN',chapter:3,verseStart:1e20}],'en',load),/invalid_verse_start/);
});
