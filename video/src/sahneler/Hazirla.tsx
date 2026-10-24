import React from 'react';
import {interpolate} from 'remotion';
import {Asama, BuyukYazi, Kart, Ortala, RENK, Sahnelik, useGiris, useVurusKaresi} from '../ortak';

const KATEGORI = ['<1H OCEAN', 'INLAND', 'ISLAND', 'NEAR BAY', 'NEAR OCEAN'];
const ORNEK = ['INLAND', 'NEAR BAY', 'INLAND', '<1H OCEAN'];

const Hucre: React.FC<{children: React.ReactNode; renk?: string; genislik?: number; vurgulu?: boolean}> = ({
  children,
  renk = RENK.cizgi,
  genislik = 220,
  vurgulu,
}) => (
  <div
    style={{
      width: genislik,
      padding: '10px 0',
      textAlign: 'center',
      fontSize: 30,
      fontWeight: vurgulu ? 800 : 500,
      borderRadius: 10,
      border: `2px solid ${renk}`,
      background: vurgulu ? `${renk}33` : 'rgba(255,255,255,0.03)',
    }}
  >
    {children}
  </div>
);

export const Hazirla: React.FC = () => {
  const giris = useGiris(0);
  const formul = useGiris(1);
  const r = useGiris(1, 30);
  const f2 = useVurusKaresi(2);
  const yanlis = useGiris(3);
  const onehot = useGiris(4);
  const olcek = useGiris(5);
  const olcekAnim = interpolate(useVurusKaresi(5), [30, 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const terzi = useGiris(6);
  const fitTr = useGiris(7);
  const bos = [2, 5];
  return (
    <Sahnelik>
      <Asama bas={0} son={0}>
        <Ortala yon="row" gap={80}>
          <Kart renk={RENK.kirmizi} style={{fontSize: 40, lineHeight: 1.6, width: 560, opacity: giris}}>
            <div style={{fontWeight: 800, marginBottom: 10}}>Ham veri 😵</div>
            NaN · "NEAR BAY" · 39.320 · 0,5
          </Kart>
          <div style={{fontSize: 100, color: RENK.soluk}}>→</div>
          <Kart renk={RENK.yesil} style={{fontSize: 40, lineHeight: 1.6, width: 560, opacity: giris}}>
            <div style={{fontWeight: 800, marginBottom: 10}}>Modele hazır 🍽️</div>
            0,23 · 1 · −0,41 · 1,87
          </Kart>
        </Ortala>
      </Asama>
      <Asama bas={1} son={1}>
        <Ortala gap={40}>
          <div style={{fontSize: 44, color: RENK.soluk}}>Yeni sütun üretmek (feature engineering)</div>
          <Kart renk={RENK.mor} style={{fontSize: 64, fontWeight: 800, opacity: formul, padding: '40px 60px'}}>
            <span style={{color: RENK.mavi}}>oda_kişi_başı</span> = toplam_oda ÷ nüfus
          </Kart>
          <div style={{display: 'flex', gap: 40, fontSize: 44, opacity: r}}>
            <span style={{color: RENK.soluk}}>toplam_oda: r = 0,14</span>
            <span>→</span>
            <span style={{color: RENK.yesil, fontWeight: 800}}>oda_kişi_başı: r = 0,21 ✓</span>
          </div>
        </Ortala>
      </Asama>
      <Asama bas={2} son={2}>
        <Ortala yon="row" gap={100}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            <Hucre vurgulu renk={RENK.mor}>yatak odası</Hucre>
            {Array.from({length: 7}, (_, i) => {
              const bosMu = bos.includes(i);
              const dolma = interpolate(f2, [30 + bos.indexOf(i) * 12, 45 + bos.indexOf(i) * 12], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              return (
                <Hucre key={i} renk={bosMu ? (dolma > 0.5 ? RENK.yesil : RENK.kirmizi) : RENK.cizgi} vurgulu={bosMu}>
                  {bosMu ? (dolma > 0.5 ? '435' : 'NaN') : [129, 1106, 0, 190, 280, 0, 489][i]}
                </Hucre>
              );
            })}
          </div>
          <Kart renk={RENK.yesil} style={{width: 720}}>
            <div style={{fontSize: 44, fontWeight: 800}}>Boşluğa medyanı yaz</div>
            <div style={{fontSize: 34, color: RENK.soluk, marginTop: 14, lineHeight: 1.5}}>
              Eğitim verisinin medyanı: <b style={{color: RENK.yesil}}>435</b>
              <br />
              Satırı silmiyoruz: yarın gelen veride de boşluk olabilir.
            </div>
          </Kart>
        </Ortala>
      </Asama>
      <Asama bas={3} son={4}>
        <Ortala yon="row" gap={70}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12, opacity: 1 - onehot * 0.6}}>
            <div style={{fontSize: 36, fontWeight: 800, color: RENK.kirmizi, textAlign: 'center'}}>✗ Numaralandırma</div>
            {KATEGORI.map((k, i) => (
              <div key={k} style={{display: 'flex', gap: 12}}>
                <Hucre genislik={260}>{k}</Hucre>
                <Hucre genislik={90} renk={RENK.kirmizi} vurgulu>
                  {i}
                </Hucre>
              </div>
            ))}
            <div style={{fontSize: 32, color: RENK.kirmizi, textAlign: 'center', opacity: yanlis}}>NEAR OCEAN (4) &gt; INLAND (1) ?!</div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12, opacity: onehot}}>
            <div style={{fontSize: 36, fontWeight: 800, color: RENK.yesil, textAlign: 'center'}}>✓ One-hot</div>
            <div style={{display: 'flex', gap: 8}}>
              <Hucre genislik={200} vurgulu renk={RENK.mor}>
                değer
              </Hucre>
              {KATEGORI.map((k) => (
                <Hucre key={k} genislik={150} vurgulu renk={RENK.mor}>
                  <span style={{fontSize: 22}}>{k}</span>
                </Hucre>
              ))}
            </div>
            {ORNEK.map((o, i) => (
              <div key={i} style={{display: 'flex', gap: 8}}>
                <Hucre genislik={200}>{o}</Hucre>
                {KATEGORI.map((k) => (
                  <Hucre key={k} genislik={150} renk={k === o ? RENK.yesil : RENK.cizgi} vurgulu={k === o}>
                    {k === o ? 1 : 0}
                  </Hucre>
                ))}
              </div>
            ))}
          </div>
        </Ortala>
      </Asama>
      <Asama bas={5} son={5}>
        <Ortala gap={50}>
          <div style={{fontSize: 48, fontWeight: 800, opacity: olcek}}>Standart ölçekleme: (değer − ortalama) ÷ std</div>
          {[
            {ad: 'gelir', once: [0, 15], sonra: [-1.8, 5.8], renk: RENK.mavi},
            {ad: 'toplam oda', once: [0, 39320], sonra: [-1.2, 16.1], renk: RENK.pembe},
          ].map((s) => {
            const genislik = interpolate(olcekAnim, [0, 1], [s.ad === 'gelir' ? 60 : 1400, s.ad === 'gelir' ? 420 : 900]);
            return (
              <div key={s.ad} style={{display: 'flex', alignItems: 'center', gap: 30, width: 1600}}>
                <div style={{width: 260, fontSize: 38, fontWeight: 700, textAlign: 'right'}}>{s.ad}</div>
                <div style={{width: genislik, height: 60, background: s.renk, borderRadius: 12}} />
                <div style={{fontSize: 34, color: RENK.soluk, fontVariantNumeric: 'tabular-nums'}}>
                  {olcekAnim < 0.5
                    ? `${s.once[0].toLocaleString('tr-TR')} … ${s.once[1].toLocaleString('tr-TR')}`
                    : `${s.sonra[0]} … ${s.sonra[1]}`}
                </div>
              </div>
            );
          })}
          <div style={{fontSize: 36, color: RENK.yesil, opacity: olcekAnim}}>Artık aynı dili konuşuyorlar ✓</div>
        </Ortala>
      </Asama>
      <Asama bas={6} son={7}>
        <Ortala gap={40}>
          <BuyukYazi boyut={70} style={{opacity: terzi}}>
            ✂️ Terzi kuralı
          </BuyukYazi>
          <div style={{display: 'flex', gap: 50}}>
            <Kart renk={RENK.mor} style={{width: 720, opacity: terzi}}>
              <div style={{fontFamily: 'DejaVu Sans Mono, monospace', fontSize: 54, fontWeight: 700, color: RENK.mor}}>.fit()</div>
              <div style={{fontSize: 40, fontWeight: 700, marginTop: 12}}>Ölçü al 📏</div>
              <div style={{fontSize: 32, color: RENK.soluk, marginTop: 10}}>Sadece EĞİTİM verisinden</div>
            </Kart>
            <Kart renk={RENK.yesil} style={{width: 720, opacity: fitTr}}>
              <div style={{fontFamily: 'DejaVu Sans Mono, monospace', fontSize: 54, fontWeight: 700, color: RENK.yesil}}>.transform()</div>
              <div style={{fontSize: 40, fontWeight: 700, marginTop: 12}}>Aynı kalıpla kes ✂️</div>
              <div style={{fontSize: 32, color: RENK.soluk, marginTop: 10}}>Eğitim · test · yeni veri</div>
            </Kart>
          </div>
        </Ortala>
      </Asama>
    </Sahnelik>
  );
};
