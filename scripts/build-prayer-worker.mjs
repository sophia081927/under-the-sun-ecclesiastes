import {readFileSync,writeFileSync} from 'node:fs';
const schema=readFileSync(new URL('../data/prayerSchema.js',import.meta.url),'utf8').replace('export function validPrayer','function validPrayer');
const resolver=readFileSync(new URL('../worker/scripture-resolver.js',import.meta.url),'utf8').replace('export const BOOKS','const BOOKS').replace('export async function resolveVerses','async function resolveVerses').replace(/export default \{ resolveVerses, BOOKS \};/,'');
const worker=readFileSync(new URL('../worker/prayer-worker.js',import.meta.url),'utf8').replace(/^import .*;\r?\n/gm,'');
writeFileSync(new URL('../worker/prayer-worker-standalone.js',import.meta.url),'// Requires SCRIPTURE_ASSETS and PRAYER_RATE_LIMITER bindings. Deploy via Wrangler with the chapter assets.\n'+schema+'\n'+resolver+'\n'+worker);
console.log('Generated bundled source. Deploy with Wrangler; copying this file alone does not deploy the required corpus/bindings.');
