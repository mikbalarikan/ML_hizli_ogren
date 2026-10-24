import React from 'react';
import {interpolate} from 'remotion';
import {Asama, BuyukYazi, Hap, Kart, Ortala, RENK, Sahnelik, useGiris, useVurusKaresi} from '../ortak';

// 100 noktadan 20'si test setine gider (her 5'ten biri: tabakalı gibi düzenli)
const NOKTALAR = Array.from({length: 100}, (_, i) => ({i, test: i % 5 === 2}));
// Oranlar (%) ve hatalar: src/01_test_setini_ayir.py çıktısı
const GRUPLAR = [
  {ad: '<15k$', tum: 3.98, rastgele: 3.32, tabakali: 4.0, hR: -16.67, hT: 0.36},
  {ad: '15–30k$', tum: 31.88, rastgele: 32.75, tabakali: 31.88, hR: 2.72, hT: -0.02},
  {ad: '30–45k$', tum: 35.06, rastgele: 35.08, tabakali: 35.05, hR: 0.06, hT: -0.01},
  {ad: '45–60k$', tum: 17.63, rastgele: 17.51, tabakali: 17.64, hR: -0.66, hT: 0.03},
  {ad: '60k$+', tum: 11.44, rastgele: 11.34, tabakali: 11.43, hR: -0.93, hT: -0.08},
];
const yuzde = (v: number) =>
  Math.abs(v) < 0.05 ? '±0,0%' : `${v > 0 ? '+' : '−'}${Math.abs(v).toFixed(1).replace('.', ',')}%`;

const Kilit: React.FC<{kapali: number}> = ({kapali}) => (
  <svg width="120" height="140" viewBox="0 0 120 140">
    <path d="M30 70 V40 a30 30 0 0 1 60 0 V70" stroke={RENK.sari} strokeWidth="12" fill="none" transform={`translate(0 ${(1 - kapali) * -18})`} />
    <rect x="15" y="65" width="90" height="70" rx="14" fill={RENK.sari} />
    <circle cx="60" cy="98" r="10" fill={RENK.arka} />
  </svg>
);

export const TestSeti: React.FC = () => {
  const kural = useGiris(0);
  const ogrenci = useGiris(1);
  const f2 = useVurusKaresi(2);
  const kay = interpolate(f2, [10, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const kilit = useGiris(3);
  const rastgele = useGiris(4);
  const tabakali = useGiris(5);
  const sonuc = useGiris(6);
  return (
    <Sahnelik>
      <Asama bas={0} son={1}>
        <Ortala gap={50}>
          <BuyukYazi boyut={80} style={{opacity: kural}}>
            Projenin <span style={{color: RENK.sari}}>en önemli</span> kuralı
          </BuyukYazi>
          <div style={{display: 'flex', gap: 50, opacity: ogrenci}}>
            <Kart renk={RENK.kirmizi} style={{width: 640, textAlign: 'center'}}>
              <div style={{fontSize: 110}}>🙈📄</div>
              <div style={{fontSize: 40, fontWeight: 800, marginTop: 10}}>Soruları önceden gördü</div>
              <div style={{fontSize: 34, color: RENK.soluk, marginTop: 8}}>Notu 100 → ama ne biliyor?</div>
            </Kart>
            <Kart renk={RENK.yesil} style={{width: 640, textAlign: 'center'}}>
              <div style={{fontSize: 110}}>🧠📝</div>
              <div style={{fontSize: 40, fontWeight: 800, marginTop: 10}}>Hiç görmediği sorular</div>
              <div style={{fontSize: 34, color: RENK.soluk, marginTop: 8}}>Gerçek bilgiyi ölçer</div>
            </Kart>
          </div>
        </Ortala>
      </Asama>
      <Asama bas={2} son={3}>
        <Ortala yon="row" gap={120}>
          <div>
            <div style={{fontSize: 40, fontWeight: 700, marginBottom: 24, textAlign: 'center'}}>
              Eğitim <span style={{color: RENK.mavi}}>%80</span>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 46px)', gap: 12, position: 'relative'}}>
              {NOKTALAR.map((n) => {
                const sira = Math.floor(n.i / 5);
                const hedefX = n.test ? 734 + (sira % 4) * 58 - (n.i % 10) * 58 : 0;
                const hedefY = n.test ? 110 + Math.floor(sira / 4) * 58 - Math.floor(n.i / 10) * 58 : 0;
                return (
                  <div
                    key={n.i}
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 23,
                      background: n.test ? RENK.pembe : RENK.mavi,
                      opacity: n.test ? 1 : 0.85,
                      transform: `translate(${hedefX * kay}px, ${hedefY * kay}px)`,
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
            <div style={{fontSize: 40, fontWeight: 700}}>
              Test <span style={{color: RENK.pembe}}>%20</span>
            </div>
            <div
              style={{
                width: 300,
                height: 360,
                borderRadius: 30,
                border: `6px solid ${kilit > 0.5 ? RENK.sari : RENK.cizgi}`,
                background: 'rgba(0,0,0,0.35)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: 20,
              }}
            >

            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 34, color: RENK.sari, fontWeight: 700, opacity: kilit}}>
              <div style={{transform: 'scale(0.5)', margin: -30}}>
                <Kilit kapali={kilit} />
              </div>
              Kasaya kilitlendi
            </div>
          </div>
        </Ortala>
      </Asama>
      <Asama bas={4} son={6}>
        <Ortala gap={26}>
          <div style={{fontSize: 46, fontWeight: 800}}>Gelir gruplarının test setindeki oranı</div>
          <div style={{display: 'flex', gap: 50, alignItems: 'flex-end'}}>
            {GRUPLAR.map((g, i) => {
              const yukseklik = (v: number) => (v / 36) * 230;
              return (
                <div key={g.ad} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
                  <div style={{display: 'flex', gap: 8, alignItems: 'flex-end', height: 230}}>
                    <div style={{width: 56, height: yukseklik(g.tum), background: RENK.mavi, borderRadius: 8}} />
                    <div style={{width: 56, height: yukseklik(g.rastgele) * rastgele, background: RENK.pembe, borderRadius: 8}} />
                    <div style={{width: 56, height: yukseklik(g.tabakali) * tabakali, background: RENK.yesil, borderRadius: 8}} />
                  </div>
                  <div style={{fontSize: 28, color: i === 0 ? RENK.yazi : RENK.soluk, fontWeight: i === 0 ? 800 : 500}}>{g.ad}</div>
                  <div style={{fontSize: 28, fontWeight: 800, textAlign: 'center', height: 76}}>
                    <div style={{color: Math.abs(g.hR) > 5 ? RENK.kirmizi : RENK.pembe, opacity: rastgele}}>{yuzde(g.hR)}</div>
                    <div style={{color: RENK.yesil, opacity: tabakali}}>{yuzde(g.hT)}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{display: 'flex', gap: 40, fontSize: 30}}>
            <span style={{color: RENK.mavi}}>■ tüm veri</span>
            <span style={{color: RENK.pembe, opacity: rastgele}}>■ rastgele ayırma</span>
            <span style={{color: RENK.yesil, opacity: tabakali}}>■ tabakalı ayırma</span>
          </div>
          <Kart renk={RENK.yesil} style={{opacity: sonuc, transform: `scale(${0.8 + 0.2 * sonuc})`, padding: '18px 40px'}}>
            <div style={{fontSize: 52, fontWeight: 900}}>
              <span style={{color: RENK.kirmizi}}>−16,7%</span> → <span style={{color: RENK.yesil}}>+0,4%</span>
            </div>
          </Kart>
        </Ortala>
      </Asama>
      <Asama bas={7}>
        <Hap>
          Test seti kutsaldır.
          <br />
          Bir kez ve en sonda kullanılır.
        </Hap>
      </Asama>
    </Sahnelik>
  );
};
