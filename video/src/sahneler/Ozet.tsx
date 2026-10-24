import React from 'react';
import {Asama, BuyukYazi, Kart, Ortala, RENK, Sahnelik, useGiris} from '../ortak';

const HAPLAR = [
  {ikon: '🔍', yazi: 'Önce veriye bak', renk: RENK.mavi},
  {ikon: '🔒', yazi: 'Test setini kilitle, en sonda bir kez aç', renk: RENK.mor},
  {ikon: '🧹', yazi: 'Doldur · one-hot · ölçekle (ölçü sadece eğitimden)', renk: RENK.mor},
  {ikon: '🔄', yazi: 'Eğitim notuna değil, çapraz doğrulamaya güven', renk: RENK.pembe},
  {ikon: '⚖️', yazi: 'Ezber ile basitlik arasındaki dengeyi bul', renk: RENK.pembe},
  {ikon: '🧪', yazi: 'İyi özellik > düğme çevirmek', renk: RENK.yesil},
  {ikon: '👀', yazi: 'Canlıdaki modeli izle ve güncelle', renk: RENK.yesil},
];

export const Ozet: React.FC = () => {
  const baslik = useGiris(0);
  const kartlar = HAPLAR.map((_, i) => useGiris(i + 1));
  const son = useGiris(8);
  return (
    <Sahnelik>
      <Asama bas={0} son={7}>
        <Ortala gap={30}>
          <BuyukYazi boyut={64} style={{opacity: baslik}}>
            💊 7 Hap Bilgi
          </BuyukYazi>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, width: 1640}}>
            {HAPLAR.map((h, i) => (
              <Kart
                key={i}
                renk={kartlar[i] > 0.5 ? h.renk : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                  padding: '20px 28px',
                  opacity: 0.12 + kartlar[i] * 0.88,
                  transform: `translateX(${(1 - kartlar[i]) * (i % 2 ? 60 : -60)}px)`,
                  gridColumn: i === 6 ? '1 / span 2' : undefined,
                  justifySelf: i === 6 ? 'center' : undefined,
                  width: i === 6 ? 810 : undefined,
                }}
              >
                <div style={{fontSize: 46, fontWeight: 900, color: h.renk, width: 50}}>{i + 1}</div>
                <div style={{fontSize: 48}}>{h.ikon}</div>
                <div style={{fontSize: 34, fontWeight: 700}}>{h.yazi}</div>
              </Kart>
            ))}
          </div>
        </Ortala>
      </Asama>
      <Asama bas={8}>
        <Ortala gap={36}>
          <div style={{fontSize: 120, transform: `scale(${son})`}}>🚀</div>
          <BuyukYazi boyut={96}>
            Sıra <span style={{color: RENK.sari}}>sende!</span>
          </BuyukYazi>
          <div style={{fontSize: 44, color: RENK.soluk}}>Aynı 9 adımlık haritayı kendi verinle dene.</div>
          <Kart style={{fontFamily: 'DejaVu Sans Mono, monospace', fontSize: 38}}>github.com/mikbalarikan/ML_hizli_ogren</Kart>
        </Ortala>
      </Asama>
    </Sahnelik>
  );
};
