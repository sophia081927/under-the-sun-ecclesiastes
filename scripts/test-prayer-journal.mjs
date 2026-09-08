import test from 'node:test';
import assert from 'node:assert/strict';
import {newEntry,writeEntry,readJournal,updateEntry,inspectJournal,rawJournal} from '../data/prayerJournal.js';
function storage(){let value=null;return {getItem:()=>value,setItem:(key,next)=>{value=next;}};}
const response={prayer:'A prayer',verses:[],encouragement:'Call a friend'};
test('updating status preserves a note saved since the entry was displayed',()=>{
 const db=storage(), original=newEntry('Family',response,'en');writeEntry(original,db);
 updateEntry(original.id,current=>({...current,notes:[{text:'A new development',date:new Date().toISOString()}]}),db);
 updateEntry(original.id,current=>({...current,status:'waiting'}),db);
 const saved=readJournal(db)[0];assert.equal(saved.notes.length,1);assert.equal(saved.status,'waiting');
});
test('missing entry and corrupted journal are not silently replaced',()=>{
 const db=storage();assert.throws(()=>updateEntry('missing',x=>x,db));db.setItem('', '{bad json');assert.throws(()=>writeEntry(newEntry('x',response,'en'),db));assert.equal(db.getItem(),'{bad json');
});
test('quota failure preserves previous data',()=>{
 const db=storage(),entry=newEntry('x',response,'en');writeEntry(entry,db);const previous=db.getItem();db.setItem=()=>{throw Error('quota');};assert.throws(()=>updateEntry(entry.id,x=>({...x,status:'answered'}),db));assert.equal(db.getItem(),previous);
});
test('one corrupt row is isolated and preserved through future writes and backup',()=>{
 const db=storage(),good=newEntry('Family',response,'en'),bad={id:'broken',sessions:null};
 db.setItem('',JSON.stringify([good,bad]));assert.equal(readJournal(db).length,1);assert.equal(inspectJournal(db).damaged,1);
 updateEntry(good.id,row=>({...row,status:'waiting'}),db);assert.deepEqual(JSON.parse(rawJournal(db))[1],bad);
 assert.equal(readJournal(db)[0].status,'waiting');
});
test('invalid new records never poison stored records',()=>{
 const db=storage(),good=newEntry('Family',response,'en');writeEntry(good,db);const previous=rawJournal(db);
 assert.throws(()=>writeEntry({...good,sessions:[]},db));assert.equal(rawJournal(db),previous);
});
