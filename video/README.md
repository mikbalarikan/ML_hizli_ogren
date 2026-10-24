# 10 dakikalık özet video (Remotion)

Kaliforniya ev fiyatı projesini ML'e yeni başlayanlara anlatan, 11 sahnelik eğitim videosu.
[Remotion](https://www.remotion.dev/) ile React bileşenlerinden render edilir.

- **Hazır video:** [`ml_ozet.mp4`](ml_ozet.mp4) (9:59 · 1920×1080 · 30 fps · 30 MB)
- **Senaryo (zaman kodlu):** [`../docs/08_video_senaryo.md`](../docs/08_video_senaryo.md)
- **Tek kaynak:** [`src/senaryo.json`](src/senaryo.json). Altyazılar, sahne süreleri ve senaryo dokümanı bu dosyadan üretilir.

## Çalıştırma

```bash
cd video
npm install
npm run studio      # tarayıcıda canlı önizleme ve düzenleme
npm run render      # out/ml_ozet.mp4 (1920×1080, 30 fps, ~10 dk)
npm run senaryo     # docs/08_video_senaryo.md'yi yeniden üretir
node kareler.mjs    # her cümleden bir kontrol karesi -> out/kareler/
```

`remotion.config.ts` içindeki Chromium yolu bu bulut makinesine özel. Kendi bilgisayarında bu satırı silmen yeterli,
Remotion kendi tarayıcısını indirir.

## Yapı

| Dosya | Görev |
|---|---|
| `src/senaryo.json` | 11 sahne, 80 cümle. Her cümle bir altyazı ve bir görsel "vuruş" (beat). |
| `src/zamanlama.ts` | Cümle süresi = max(3 sn, kelime ÷ 1,7 + 1 sn). Toplam ≈ 10:00. |
| `src/Video.tsx` | Arka plan, bölüm kartları, altyazı, ilerleme çubuğu, kapanış |
| `src/ortak.tsx` | Tema renkleri, `Asama` (cümle aralığında görünen katman), `useGiris(i)` (i. cümlede başlayan animasyon), kart, çip, sayaç bileşenleri |
| `src/sahneler/*.tsx` | Her sahnenin görselleri |
| `public/*.png` | Projede ürettiğimiz grafikler (`../gorseller/`) |

Bir cümleyi değiştirirsen ya da eklersen, sahnelerin vuruş numaraları (`useGiris(3)`, `<Asama bas={2} son={4}>`) cümle sırasına bağlı olduğu için onları da kontrol et.

## Seslendirme

Video, ekranda okuma hızında beliren altyazılarla **sessiz** üretildi (bu ortamda Türkçe TTS modeli indirilemedi).
Kendi sesini eklemek için senaryodaki zaman kodlarına göre kaydet ve şöyle birleştir:

```bash
ffmpeg -i out/ml_ozet.mp4 -i ses.wav -c:v copy -c:a aac -shortest out/ml_ozet_sesli.mp4
```

Lisans notu: Remotion bireyler ve 3 kişiye kadar şirketler için ücretsizdir. Daha büyük kurumlar için şirket lisansı gerekir.
