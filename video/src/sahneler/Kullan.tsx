import React from 'react';
import {interpolate} from 'remotion';
import {Asama, BuyukYazi, Grafik, Kart, Ortala, RENK, Sahnelik, useGiris, useVurusKaresi} from '../ortak';

const KOMUT = 'python src/06_tahmin_et.py --sehir los_angeles --gelir 80000 --yas 20';

export const Kullan: React.FC = () => {
  const f = useVurusKaresi(0);
  const harf = Math.floor(interpolate(f, [15, 15 + KOMUT.length * 1.1], [0, KOMUT.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const cikti = useGiris(1, 20);
  const yil = useGiris(4);
  const sayi = Math.round(interpolate(useVurusKaresi(4), [20, 70], [1990, 2026], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const dongu = useGiris(5);
  const fd = useVurusKaresi(5);
  return (
    <Sahnelik>
      <Asama bas={0} son={1}>
        <Ortala>
          <div style={{width: 1560, borderRadius: 20, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.6)'}}>
            <div style={{background: '#1f2937', padding: '14px 20px', display: 'flex', gap: 10}}>
              {[RENK.kirmizi, RENK.sari, RENK.yesil].map((r) => (
                <div key={r} style={{width: 18, height: 18, borderRadius: 9, background: r}} />
              ))}
            </div>
            <div style={{background: '#0d1117', padding: '36px 44px', fontFamily: 'DejaVu Sans Mono, monospace', fontSize: 32, lineHeight: 1.7, minHeight: 330}}>
              <div>
                <span style={{color: RENK.yesil}}>$ </span>
                {KOMUT.slice(0, harf)}
                <span style={{opacity: Math.floor(f / 15) % 2 ? 1 : 0}}>▌</span>
              </div>
              <div style={{opacity: cikti}}>
                <div style={{color: RENK.soluk}}>📍 los_angeles | gelir 80,000 $ | ev yaşı 20 | &lt;1H OCEAN</div>
                <div style={{color: RENK.yesil, fontSize: 52, fontWeight: 700}}>🏠 TAHMİN: 382,409 $</div>
                <div style={{color: RENK.sari}}>🌲 Ağaçların %80'i: 271,990 $ … 500,001 $</div>
              </div>
            </div>
          </div>
        </Ortala>
      </Asama>
      <Asama bas={2} son={3}>
        <Ortala yon="row" gap={60}>
          <Grafik dosya="14_tahmin_los_angeles.png" yukseklik={580} />
          <Kart renk={RENK.sari} style={{width: 520}}>
            <div style={{fontSize: 40, fontWeight: 800}}>100 ağacın oyları</div>
            <div style={{fontSize: 32, color: RENK.soluk, marginTop: 12, lineHeight: 1.5}}>
              110k … 500k arası dağınık → model <b style={{color: RENK.sari}}>emin değil</b>
              <br />
              1990'da 80k $ gelir: mahallelerin en zengin <b style={{color: RENK.yazi}}>%3,3</b>'ü
            </div>
          </Kart>
        </Ortala>
      </Asama>
      <Asama bas={4} son={4}>
        <Ortala gap={30}>
          <BuyukYazi boyut={220} renk={sayi > 2000 ? RENK.kirmizi : RENK.mavi} style={{opacity: yil, fontVariantNumeric: 'tabular-nums'}}>
            {sayi}
          </BuyukYazi>
          <div style={{fontSize: 56, fontWeight: 800}}>⚠️ Veri kayması (data drift)</div>
          <div style={{fontSize: 38, color: RENK.soluk}}>Model 1990 dünyasını biliyor; dünyanın değiştiğini kendisi fark edemez.</div>
        </Ortala>
      </Asama>
      <Asama bas={5}>
        <Ortala>
          <div style={{position: 'relative', width: 760, height: 620, opacity: dongu}}>
            <svg width="760" height="620" style={{position: 'absolute', inset: 0}}>
              <circle cx="380" cy="310" r="220" fill="none" stroke={RENK.cizgi} strokeWidth="6" strokeDasharray="20 16" transform={`rotate(${fd * 0.8} 380 310)`} />
            </svg>
            {[
              {ad: '🚀 Yayınla', x: 380, y: 60},
              {ad: '👀 İzle', x: 640, y: 450},
              {ad: '🔁 Yeniden eğit', x: 120, y: 450},
            ].map((n) => (
              <div key={n.ad} style={{position: 'absolute', left: n.x, top: n.y, transform: 'translate(-50%, -50%)'}}>
                <Kart renk={RENK.yesil} style={{fontSize: 44, fontWeight: 800, whiteSpace: 'nowrap', background: RENK.arka2}}>
                  {n.ad}
                </Kart>
              </div>
            ))}
          </div>
        </Ortala>
      </Asama>
    </Sahnelik>
  );
};
