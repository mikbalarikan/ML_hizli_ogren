import React from 'react';
import {interpolate} from 'remotion';
import {Asama, BuyukYazi, Kart, Ortala, RENK, Sahnelik, useGiris, useVurusKaresi} from '../ortak';

const Cizgi: React.FC = () => (
  <svg width="220" height="160" viewBox="0 0 220 160">
    {[[20, 130], [45, 110], [60, 120], [90, 85], [110, 95], [140, 60], [160, 70], [190, 35]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="8" fill={RENK.mavi} />
    ))}
    <line x1="10" y1="140" x2="210" y2="25" stroke={RENK.yazi} strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const Agac: React.FC<{renk?: string; olcek?: number}> = ({renk = RENK.yesil, olcek = 1}) => (
  <svg width={160 * olcek} height={160 * olcek} viewBox="0 0 160 160">
    <line x1="80" y1="30" x2="40" y2="80" stroke={RENK.soluk} strokeWidth="5" />
    <line x1="80" y1="30" x2="120" y2="80" stroke={RENK.soluk} strokeWidth="5" />
    <line x1="40" y1="80" x2="20" y2="130" stroke={RENK.soluk} strokeWidth="5" />
    <line x1="40" y1="80" x2="60" y2="130" stroke={RENK.soluk} strokeWidth="5" />
    <line x1="120" y1="80" x2="100" y2="130" stroke={RENK.soluk} strokeWidth="5" />
    <line x1="120" y1="80" x2="140" y2="130" stroke={RENK.soluk} strokeWidth="5" />
    {[[80, 30], [40, 80], [120, 80]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="14" fill={renk} />
    ))}
    {[20, 60, 100, 140].map((x) => (
      <rect key={x} x={x - 11} y="120" width="22" height="22" rx="5" fill={RENK.sari} />
    ))}
  </svg>
);

const MODELLER = [
  {ad: 'Lineer Regresyon', alt: 'en uygun düz çizgi', renk: RENK.mavi, ezber: 67311, gercek: 67689},
  {ad: 'Karar Ağacı', alt: '20 soru oyunu', renk: RENK.yesil, ezber: 0, gercek: 70886},
  {ad: 'Random Forest', alt: '100 ağacın oylaması', renk: RENK.pembe, ezber: 18255, gercek: 49591},
];

export const Egitim: React.FC = () => {
  const kartlar = [useGiris(1), useGiris(2), useGiris(3)];
  const baslik = useGiris(0);
  const rmse = useGiris(4);
  const ezber = useGiris(5);
  const sifir = useGiris(5, 25);
  const gercek = useGiris(6);
  const f8 = useVurusKaresi(8);
  const tur = Math.min(4, Math.max(0, Math.floor((f8 - 10) / 22)));
  const cvGorunur = useGiris(7);
  const kazanan = useGiris(9);
  const yelpaze = useGiris(10);
  const max = 75000;
  return (
    <Sahnelik>
      <Asama bas={0} son={3}>
        <Ortala gap={50}>
          <BuyukYazi boyut={64} style={{opacity: baslik}}>
            3 model yarışıyor 🏁
          </BuyukYazi>
          <div style={{display: 'flex', gap: 50}}>
            {MODELLER.map((m, i) => (
              <Kart
                key={m.ad}
                renk={kartlar[i] > 0.5 ? m.renk : undefined}
                style={{
                  width: 500,
                  height: 420,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 20,
                  opacity: 0.25 + kartlar[i] * 0.75,
                  transform: `scale(${0.92 + kartlar[i] * 0.08})`,
                }}
              >
                {i === 0 && <Cizgi />}
                {i === 1 && <Agac />}
                {i === 2 && (
                  <div style={{display: 'flex', gap: 0}}>
                    {[0, 1, 2].map((k) => (
                      <Agac key={k} olcek={0.62} renk={[RENK.pembe, RENK.mor, RENK.yesil][k]} />
                    ))}
                  </div>
                )}
                <div style={{fontSize: 44, fontWeight: 800}}>{m.ad}</div>
                <div style={{fontSize: 32, color: RENK.soluk}}>{m.alt}</div>
              </Kart>
            ))}
          </div>
        </Ortala>
      </Asama>
      <Asama bas={4} son={4}>
        <Ortala gap={40}>
          <Kart renk={RENK.sari} style={{opacity: rmse, padding: '40px 70px', textAlign: 'center'}}>
            <div style={{fontSize: 40, color: RENK.soluk}}>Başarı ölçüsü</div>
            <div style={{fontSize: 110, fontWeight: 900, color: RENK.sari}}>RMSE</div>
            <div style={{fontSize: 40, marginTop: 8}}>√ ortalama( (gerçek − tahmin)² )</div>
          </Kart>
          <div style={{fontSize: 46, fontWeight: 700}}>= tahminlerimiz tipik olarak kaç $ sapıyor? (düşük = iyi)</div>
        </Ortala>
      </Asama>
      <Asama bas={5} son={6}>
        <Ortala gap={30}>
          <div style={{display: 'flex', gap: 40, fontSize: 34}}>
            <span style={{color: RENK.soluk}}>■ eğitim verisinde (ezber notu)</span>
            <span style={{color: RENK.pembe, opacity: gercek}}>■ görmediği veride (gerçek not)</span>
          </div>
          {MODELLER.map((m) => (
            <div key={m.ad} style={{display: 'flex', alignItems: 'center', gap: 30}}>
              <div style={{width: 360, textAlign: 'right', fontSize: 38, fontWeight: 700}}>{m.ad}</div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
                  <div style={{width: (m.ezber / max) * 1000 * ezber, height: 50, background: RENK.gri, borderRadius: 10}} />
                  <div style={{fontSize: 34, fontWeight: 800, opacity: ezber, color: m.ezber === 0 ? RENK.sari : RENK.yazi}}>
                    {m.ezber === 0 ? <span style={{fontSize: 34 + 20 * sifir}}>0 $ 🤯</span> : `${Math.round(m.ezber / 1000)}k $`}
                  </div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
                  <div style={{width: (m.gercek / max) * 1000 * gercek, height: 50, background: RENK.pembe, borderRadius: 10}} />
                  <div style={{fontSize: 34, fontWeight: 800, opacity: gercek, color: m.ezber === 0 ? RENK.kirmizi : RENK.yazi}}>
                    {Math.round(m.gercek / 1000)}k ${m.ezber === 0 ? ' 💀 ezber!' : ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Ortala>
      </Asama>
      <Asama bas={7} son={8}>
        <Ortala gap={34}>
          <BuyukYazi boyut={60} style={{opacity: cvGorunur}}>
            Çapraz doğrulama (5 kat)
          </BuyukYazi>
          {[0, 1, 2, 3, 4].map((t) => {
            const aktif = f8 >= 10 && t <= tur;
            return (
              <div key={t} style={{display: 'flex', gap: 14, alignItems: 'center', opacity: f8 < 0 ? 0.3 : aktif ? 1 : 0.3}}>
                <div style={{width: 140, fontSize: 32, fontWeight: 700}}>Tur {t + 1}</div>
                {[0, 1, 2, 3, 4].map((p) => (
                  <div
                    key={p}
                    style={{
                      width: 200,
                      height: 62,
                      borderRadius: 12,
                      background: p === t ? RENK.pembe : RENK.mavi,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 28,
                      fontWeight: 700,
                    }}
                  >
                    {p === t ? '📝 sına' : '🏋️ eğit'}
                  </div>
                ))}
              </div>
            );
          })}
          <div style={{fontSize: 36, color: RENK.soluk}}>Test setine dokunmadan "gerçek not" → 5 notun ortalaması</div>
        </Ortala>
      </Asama>
      <Asama bas={9} son={9}>
        <Ortala gap={30}>
          <div style={{fontSize: 140, transform: `scale(${kazanan})`}}>🏆</div>
          <BuyukYazi boyut={90} renk={RENK.pembe}>
            Random Forest
          </BuyukYazi>
          <div style={{fontSize: 64, fontWeight: 800}}>≈ 49.600 $ hata</div>
        </Ortala>
      </Asama>
      <Asama bas={10}>
        <Ortala gap={50}>
          <div style={{position: 'relative', width: 1500, height: 30, borderRadius: 15, background: `linear-gradient(90deg, ${RENK.mavi}, ${RENK.yesil}, ${RENK.kirmizi})`, opacity: yelpaze}}>
            {[
              {x: 0.06, ad: 'Lineer', alt: 'çok basit (underfitting)'},
              {x: 0.5, ad: 'Random Forest', alt: 'denge ✓'},
              {x: 0.94, ad: 'Karar Ağacı', alt: 'ezberci (overfitting)'},
            ].map((n) => (
              <div key={n.ad} style={{position: 'absolute', left: `${n.x * 100}%`, top: -16, transform: 'translateX(-50%)', textAlign: 'center', width: 420}}>
                <div style={{width: 60, height: 60, borderRadius: 30, background: RENK.yazi, margin: '0 auto'}} />
                <div style={{fontSize: 40, fontWeight: 800, marginTop: 16}}>{n.ad}</div>
                <div style={{fontSize: 30, color: RENK.soluk}}>{n.alt}</div>
              </div>
            ))}
          </div>
          <div style={{height: 160}} />
          <div style={{opacity: interpolate(useVurusKaresi(10), [60, 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
            <Kart renk={RENK.sari} style={{padding: '30px 56px'}}>
              <div style={{fontSize: 30, fontWeight: 800, color: RENK.sari, letterSpacing: 4}}>💊 HAP BİLGİ</div>
              <div style={{fontSize: 50, fontWeight: 700, marginTop: 10}}>Çok basit model öğrenemez, çok karmaşık model ezberler.</div>
            </Kart>
          </div>
        </Ortala>
      </Asama>
    </Sahnelik>
  );
};
