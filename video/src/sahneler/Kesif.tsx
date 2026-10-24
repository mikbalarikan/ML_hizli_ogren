import React from 'react';
import {Asama, BuyukYazi, Cip, Grafik, Hap, Kart, Ortala, RENK, Sahnelik, Sayac, useGiris, useSure} from '../ortak';

export const Kesif: React.FC = () => {
  const sayac = useSure(0, 45);
  const sutun = useGiris(0, 30);
  const konum = useGiris(2);
  const r = useGiris(3);
  const tavan = useGiris(4);
  const sorunlar = [useGiris(5), useGiris(5, 10), useGiris(5, 20)];
  return (
    <Sahnelik>
      <Asama bas={0} son={0}>
        <Ortala gap={20}>
          <BuyukYazi boyut={220} renk={RENK.mavi}>
            <Sayac hedef={20640} ilerleme={sayac} />
          </BuyukYazi>
          <div style={{fontSize: 56, fontWeight: 600}}>mahalle (satır)</div>
          <div style={{fontSize: 48, color: RENK.soluk, opacity: sutun}}>× 10 sütun · 1 CSV dosyası · 1,4 MB</div>
        </Ortala>
      </Asama>
      <Asama bas={1} son={2}>
        <Ortala yon="row" gap={60}>
          <Grafik dosya="02_kaliforniya_haritasi.png" yukseklik={680} />
          <div style={{display: 'flex', flexDirection: 'column', gap: 28, width: 520}}>
            <Cip renk={RENK.kirmizi}>🔴 kıyı = pahalı</Cip>
            <Cip renk={RENK.mavi}>🔵 iç bölge = ucuz</Cip>
            <Kart renk={RENK.yesil} style={{opacity: konum, transform: `scale(${0.8 + 0.2 * konum})`}}>
              <div style={{fontSize: 48, fontWeight: 800}}>📍 Konum önemli!</div>
            </Kart>
          </div>
        </Ortala>
      </Asama>
      <Asama bas={3} son={4}>
        <Ortala yon="row" gap={60}>
          <Grafik dosya="03_gelir_vs_fiyat.png" yukseklik={660} />
          <div style={{display: 'flex', flexDirection: 'column', gap: 30, width: 560}}>
            <Kart renk={RENK.mor} style={{opacity: r}}>
              <div style={{fontSize: 34, color: RENK.soluk}}>gelir ↔ fiyat korelasyonu</div>
              <div style={{fontSize: 110, fontWeight: 900, color: RENK.mor}}>r = 0,69</div>
            </Kart>
            <Kart renk={RENK.kirmizi} style={{opacity: tavan, transform: `scale(${0.8 + 0.2 * tavan})`}}>
              <div style={{fontSize: 40, fontWeight: 800, color: RENK.kirmizi}}>⚠️ 500.001 $ tavanı</div>
              <div style={{fontSize: 32, marginTop: 10}}>Veri burada kesilmiş. Model üstünü hiç görmeyecek.</div>
            </Kart>
          </div>
        </Ortala>
      </Asama>
      <Asama bas={5} son={5}>
        <Ortala gap={40}>
          <BuyukYazi boyut={64}>Model eğitmeden önce 3 sorun</BuyukYazi>
          <div style={{display: 'flex', gap: 40}}>
            {[
              {b: '207 boş hücre', a: 'total_bedrooms', r: RENK.kirmizi},
              {b: 'Yazı sütunu', a: 'NEAR BAY, INLAND…', r: RENK.sari},
              {b: 'Farklı ölçekler', a: 'gelir 0–15 · oda 0–39.000', r: RENK.mor},
            ].map((s, i) => (
              <Kart key={s.b} renk={s.r} style={{width: 480, textAlign: 'center', opacity: sorunlar[i], transform: `translateY(${(1 - sorunlar[i]) * 40}px)`}}>
                <div style={{fontSize: 46, fontWeight: 800}}>{s.b}</div>
                <div style={{fontSize: 30, color: RENK.soluk, marginTop: 12}}>{s.a}</div>
              </Kart>
            ))}
          </div>
        </Ortala>
      </Asama>
      <Asama bas={6}>
        <Hap>
          Modele dokunmadan önce veriye bak.
          <br />
          Sorunlar hep oradadır.
        </Hap>
      </Asama>
    </Sahnelik>
  );
};
