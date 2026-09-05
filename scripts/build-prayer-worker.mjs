import {readFileSync,writeFileSync} from 'node:fs';
const schema=readFileSync(new URL('../data/prayerSchema.js',import.meta.url),'utf8').replace('export function validPrayer','function validPrayer');
const worker=readFileSync(new URL('../worker/prayer-worker.js',import.meta.url),'utf8').replace(/import \{ validPrayer \} from '..\/data\/prayerSchema.js';\r?\n/,'');
writeFileSync(new URL('../worker/prayer-worker-standalone.js',import.meta.url),schema+'\n'+worker);
console.log('Created worker/prayer-worker-standalone.js for Cloudflare dashboard deployment.');
