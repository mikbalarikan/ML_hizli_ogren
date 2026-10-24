import React from 'react';
import {interpolate} from 'remotion';
import {Asama, BuyukYazi, Grafik, Kart, Ortala, RENK, Sahnelik, Sayac, useGiris, useVurusKaresi} from '../ortak';

const Dugme: React.FC<{ad: string; aci: number; renk: string}> = ({ad, aci, renk}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
    <svg width="220" height="220" viewBox="0 0 220 220">
      <circle cx="110" cy="110" r="95" fill={RENK.arka2} stroke={renk} strokeWidth="8" />
      <g transform={`rotate(${aci} 110 110)`}>
        <rect x="104" y="30" width="12" height="60" rx="6" fill={renk} />
      </g>
      {Array.from({length: 11}, (_, i) => {
        const a = ((-135 + i * 27) * Math.PI) / 180;
        return <circle key={i} cx={110 + Math.sin(a) * 105} cy={110 - Math.cos(a) * 105} r="4" fill={RENK.soluk} />;
      })}
    </svg>
    <div style={{fontFamily: 'DejaVu Sans Mono, monospace', fontSize: 30}}>{ad}</div>
  </div>
);

export const Ayar: React.FC = () => {
  const f0 = useVurusKaresi(0);
  const tablo = useGiris(1);
  const f2 = useVurusKaresi(2);
  const yanan = Math.max(0, Math.min(12, Math.floor((f2 - 15) / 8)));
  const egitim = interpolate(f2, [15, 15 + 12 * 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cpu = useGiris(3);
  const kazanc = useGiris(5);
  return (
    <Sahnelik>
      <Asama bas={0} son={0}>
        <Ortala gap={50}>
          <BuyukYazi boyut={64}>Modelin ayar düğmeleri 🎛️</BuyukYazi>
          <div style={{display: 'flex', gap: 100}}>
            <Dugme ad="n_estimators" aci={-90 + Math.sin(f0 / 12) * 60} renk={RENK.mavi} />
            <Dugme ad="max_features" aci={20 + Math.sin(f0 / 15 + 1) * 70} renk={RENK.mor} />
            <Dugme ad="min_samples_leaf" aci={-40 + Math.sin(f0 / 10 + 2) * 80} renk={RENK.pembe} />
          </div>
        </Ortala>
      </Asama>
      <Asama bas={1} son={1}>
        <Ortala yon="row" gap={60}>
          <Kart renk={RENK.mavi} style={{width: 720, opacity: tablo}}>
            <div style={{fontSize: 52, fontWeight: 800, color: RENK.mavi}}>Parametre</div>
            <div style={{fontSize: 36, marginTop: 16}}>🤖 Model kendisi öğrenir</div>
            <div style={{fontSize: 32, color: RENK.soluk, marginTop: 12}}>"gelir &gt; 5,2 mi?" sorusundaki 5,2</div>
          </Kart>
          <Kart renk={RENK.pembe} style={{width: 720, opacity: tablo}}>
            <div style={{fontSize: 52, fontWeight: 800, color: RENK.pembe}}>Hiperparametre</div>
            <div style={{fontSize: 36, marginTop: 16}}>🧑 Biz seçeriz (düğme)</div>
            <div style={{fontSize: 32, color: RENK.soluk, marginTop: 12}}>min_samples_leaf = 10</div>
          </Kart>
        </Ortala>
      </Asama>
      <Asama bas={2} son={2}>
        <Ortala yon="row" gap={100}>
          <div>
            <div style={{fontSize: 34, color: RENK.soluk, textAlign: 'center', marginBottom: 14}}>max_features → 4 · 8 · 16</div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 150px)', gap: 14}}>
              {Array.from({length: 12}, (_, i) => (
                <div
                  key={i}
                  style={{
                    height: 110,
                    borderRadius: 16,
                    background: i < yanan ? RENK.pembe : 'rgba(255,255,255,0.06)',
                    border: `2px solid ${i < yanan ? RENK.pembe : RENK.cizgi}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 30,
                    fontWeight: 700,
                  }}
                >
                  {i < yanan ? '×5 ✓' : ''}
                </div>
              ))}
            </div>
            <div style={{fontSize: 34, color: RENK.soluk, textAlign: 'center', marginTop: 14}}>min_samples_leaf ↓ 1 · 3 · 10 · 30</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: 44, color: RENK.soluk}}>3 × 4 × 5 kat =</div>
            <BuyukYazi boyut={200} renk={RENK.pembe}>
              <Sayac hedef={60} ilerleme={egitim} />
            </BuyukYazi>
            <div style={{fontSize: 48, fontWeight: 700}}>eğitim</div>
          </div>
        </Ortala>
      </Asama>
      <Asama bas={3} son={3}>
        <Ortala yon="row" gap={60}>
          <Grafik dosya="10_grid_search_isi_haritasi.png" yukseklik={640} />
          <Kart renk={RENK.sari} style={{opacity: cpu, textAlign: 'center', width: 520}}>
            <div style={{fontSize: 90}}>⚡</div>
            <div style={{fontSize: 50, fontWeight: 800}}>4 CPU paralel</div>
            <div style={{fontSize: 80, fontWeight: 900, color: RENK.sari}}>1,6 dk</div>
            <div style={{fontSize: 30, color: RENK.soluk}}>sırayla olsa ~6 dk</div>
          </Kart>
        </Ortala>
      </Asama>
      <Asama bas={4} son={4}>
        <Ortala>
          <Grafik dosya="11_ezber_farki.png" yukseklik={640} />
        </Ortala>
      </Asama>
      <Asama bas={5}>
        <Ortala yon="row" gap={80}>
          <Kart style={{textAlign: 'center', width: 560, opacity: kazanc}}>
            <div style={{fontSize: 36, color: RENK.soluk}}>İnce ayarın kazancı</div>
            <div style={{fontSize: 30, marginTop: 10}}>49.591 $ → 49.140 $</div>
            <div style={{fontSize: 110, fontWeight: 900, color: RENK.soluk}}>~450 $</div>
          </Kart>
          <div style={{fontSize: 90, opacity: kazanc}}>&lt;</div>
          <Kart renk={RENK.yesil} style={{textAlign: 'center', width: 620, opacity: kazanc}}>
            <div style={{fontSize: 90}}>🧪</div>
            <div style={{fontSize: 52, fontWeight: 800}}>Daha iyi veri ve özellikler</div>
            <div style={{fontSize: 32, color: RENK.soluk, marginTop: 10}}>büyük kazanç buradan gelir</div>
          </Kart>
        </Ortala>
      </Asama>
    </Sahnelik>
  );
};
