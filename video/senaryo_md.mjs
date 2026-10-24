// src/senaryo.json -> ../docs/08_video_senaryo.md (zaman kodlu çekim senaryosu)
// Kullanım: node senaryo_md.mjs
import fs from 'node:fs';

const senaryo = JSON.parse(fs.readFileSync('src/senaryo.json', 'utf8'));
// src/zamanlama.ts ile aynı kurallar
const FPS = 30, KELIME_SN = 1.7, BOSLUK_SN = 1.0, MIN_SN = 3.0, KART_SN = 3, KAPANIS_SN = 4;
const sure = (c) => Math.round(Math.max(MIN_SN, c.split(/\s+/).length / KELIME_SN + BOSLUK_SN) * FPS) / FPS;
const zk = (sn) => `${String(Math.floor(sn / 60)).padStart(2, '0')}:${String(Math.floor(sn % 60)).padStart(2, '0')}`;

let t = 0;
let toplamKelime = 0;
const satirlar = [];
const ozet = [];
for (const s of senaryo.sahneler) {
  const bas = t;
  const kart = s.id === 'giris' ? 0 : KART_SN;
  t += kart;
  const tablo = ['| Zaman | Anlatım (seslendirme / altyazı) |', '|---|---|'];
  if (kart) tablo.push(`| ${zk(bas)} | *(bölüm kartı: "BÖLÜM ${s.no} · ${s.baslik}", 3 sn)* |`);
  for (const c of s.cumleler) {
    tablo.push(`| ${zk(t)} | ${c.startsWith('Hap bilgi') ? `**💊 ${c}**` : c} |`);
    toplamKelime += c.split(/\s+/).length;
    t += sure(c);
  }
  ozet.push(`| ${s.no} | ${s.baslik} | ${zk(bas)} | ${Math.round(t - bas)} sn |`);
  satirlar.push(`## ${zk(bas)} · Sahne ${s.no}: ${s.baslik}`, '', `**Ekranda:** ${s.gorsel}`, '', ...tablo, '');
}
const toplam = t + KAPANIS_SN;

const md = `# Video senaryosu: ${senaryo.baslik}

> Bu dosya \`video/src/senaryo.json\` dosyasından otomatik üretilir (\`cd video && npm run senaryo\`).
> Videodaki altyazılar ve zamanlama da aynı dosyadan gelir. Metni orada değiştir, video ve senaryo birlikte güncellenir.

**Süre:** ${zk(toplam)} · **Sahne:** ${senaryo.sahneler.length} · **Cümle:** ${senaryo.sahneler.reduce((a, s) => a + s.cumleler.length, 0)} · **Kelime:** ${toplamKelime}
**Hedef kitle:** ML'e yeni başlayan öğrenciler · **Üslup:** samimi, kısa cümleler, her bölüm bir "hap bilgi" ile biter.

## Akış

| # | Sahne | Başlangıç | Süre |
|---|---|---|---|
${ozet.join('\n')}
| — | Kapanış | ${zk(t)} | ${KAPANIS_SN} sn |

## Seslendirme ipuçları

- Tempo: saniyede ~1,7 kelime (dakikada ~100 kelime). Sakin, anlatır gibi oku.
- Her cümle kendi zaman satırında başlar. Cümle bitince kalan süre nefes payıdır.
- **💊 Hap bilgi** cümlelerinde yavaşla ve vurgula. Bunlar videonun akılda kalacak kısmı.
- Kayıt: her sahneyi ayrı dosya olarak kaydetmek (\`sahne-00.wav\` … \`sahne-10.wav\`) kurguyu kolaylaştırır.

---

${satirlar.join('\n')}
## ${zk(t)} · Kapanış

**Ekranda:** Video başlığı ve repo adresi (github.com/mikbalarikan/ML_hizli_ogren), 4 sn, sessiz.
`;
fs.writeFileSync('../docs/08_video_senaryo.md', md);
console.log('Yazıldı: docs/08_video_senaryo.md', zk(toplam));
