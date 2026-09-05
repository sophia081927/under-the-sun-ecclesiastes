import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../worker/prayer-worker.js';
const env={ANTHROPIC_API_KEY:'test-only-not-a-real-key'};
const valid={crisis:false,understanding:'I hear your concern.',verses:[{ref:'John 11:35',version:'World English Bible (WEB)',text:'Jesus wept.'}],explanation:'Jesus shares our grief.',prayer:'God, please comfort this grieving family.',encouragement:'Reach out to a friend.',safety:''};
const request=(body={input:'Please pray for my grief',lang:'en'},origin='https://lightoflifebible.org')=>new Request('https://worker.test',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
const upstream=(data=valid,stop='end_turn')=>new Response(JSON.stringify({stop_reason:stop,content:[{type:'text',text:JSON.stringify(data)}]}));
test('valid response preserves the requested situation and language',async()=>{
 globalThis.fetch=async(url,options)=>{assert.equal(url,'https://api.anthropic.com/v1/messages');assert.match(JSON.parse(options.body).messages[0].content,/grief/);assert.ok(options.signal);return upstream();};
 assert.deepEqual(await (await worker.fetch(request(),env)).json(),valid);
});
test('unapproved origin never calls upstream',async()=>{globalThis.fetch=()=>{throw Error('must not call');};assert.equal((await worker.fetch(request(undefined,'https://evil.test'),env)).status,403);});
test('unconfigured service explicitly fails',async()=>assert.equal((await worker.fetch(request(),{})).status,500));
test('empty and overlong input rejected',async()=>{for(const input of ['', 'x'.repeat(1001)]) assert.ok((await worker.fetch(request({input}),env)).status>=400);});
test('upstream errors do not leak service details',async()=>{globalThis.fetch=async()=>new Response('private upstream detail',{status:401});const r=await worker.fetch(request(),env);assert.equal(r.status,502);assert.equal((await r.text()).includes('private'),false);});
test('malformed, incomplete and wrong-version responses fail closed',async()=>{
 for(const data of [{...valid,verses:[]},{...valid,understanding:''},{...valid,crisis:'false'},{...valid,crisis:true,safety:''},{...valid,verses:[{...valid.verses[0],version:'KJV'}]}]){
 globalThis.fetch=async()=>upstream(data);assert.equal((await worker.fetch(request(),env)).status,502);
 }
});
test('truncated completion rejected even if JSON looks complete',async()=>{globalThis.fetch=async()=>upstream(valid,'max_tokens');assert.equal((await worker.fetch(request(),env)).status,502);});
test('network failure returns an error instead of a fixed verse',async()=>{globalThis.fetch=async()=>{throw Error('network');};const r=await worker.fetch(request(),env);assert.equal(r.status,502);assert.equal((await r.json()).error,'upstream_unreachable');});
