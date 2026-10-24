// Kontrol kareleri: her cümlenin ortasından bir kare PNG olarak alır.
// Kullanım: node kareler.mjs [sahne_id ...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const senaryo = JSON.parse(fs.readFileSync('src/senaryo.json', 'utf8'));
const FPS = 30, KELIME_SN = 1.7, BOSLUK_SN = 1.0, MIN_SN = 3.0, KART = 90;
const sure = (c) => Math.round(Math.max(MIN_SN, c.split(/\s+/).length / KELIME_SN + BOSLUK_SN) * FPS);
const secili = process.argv.slice(2);
const kareler = [];
let imlec = 0;
for (const s of senaryo.sahneler) {
  const kart = s.id === 'giris' ? 0 : KART;
  let t = imlec + kart;
  s.cumleler.forEach((c, i) => {
    const d = sure(c);
    if (!secili.length || secili.includes(s.id)) kareler.push({ad: `${s.no}_${s.id}_${i}`, kare: t + Math.round(d * 0.75)});
    t += d;
  });
  imlec = t;
}
const tarayici = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'MLOzet', browserExecutable: tarayici});
fs.mkdirSync('out/kareler', {recursive: true});
for (const k of kareler) {
  await renderStill({composition, serveUrl, frame: k.kare, output: `out/kareler/${k.ad}.png`, browserExecutable: tarayici, scale: 0.5});
  console.log(k.ad, k.kare);
}
