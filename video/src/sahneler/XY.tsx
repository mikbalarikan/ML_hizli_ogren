import React from 'react';
import {Asama, BuyukYazi, Cip, Hap, Kart, Ortala, RENK, Sahnelik, useGiris} from '../ortak';

const X_SUTUN = [
  {ad: 'konum', deger: '-122.23, 37.88'},
  {ad: 'gelir', deger: '83.252 $'},
  {ad: 'ev yaşı', deger: '41'},
  {ad: 'oda', deger: '880'},
  {ad: 'okyanus', deger: 'NEAR BAY'},
];
const ORNEKLER = [
  ['-118.4, 34.1', '45.000 $', '30', '2.100', '<1H OCEAN', '271.000 $'],
  ['-119.8, 36.7', '21.000 $', '25', '1.500', 'INLAND', '74.000 $'],
  ['-117.2, 32.7', '67.000 $', '12', '3.400', 'NEAR OCEAN', '389.000 $'],
];

export const XY: React.FC = () => {
  const harf = useGiris(0);
  const x = useGiris(1);
  const y = useGiris(2);
  const ornek = [useGiris(3), useGiris(3, 8), useGiris(3, 16)];
  const reg = useGiris(4);
  const sin = useGiris(5);
  const hucre = (renk: string, guc: number): React.CSSProperties => ({
    padding: '18px 22px',
    borderRadius: 14,
    background: `${renk}${guc > 0.5 ? '33' : '11'}`,
    border: `2px solid ${guc > 0.5 ? renk : RENK.cizgi}`,
    fontSize: 30,
    textAlign: 'center',
    minWidth: 180,
  });
  return (
    <Sahnelik>
      <Asama bas={0} son={0}>
        <Ortala yon="row" gap={140}>
          <BuyukYazi boyut={360} renk={RENK.mavi} style={{transform: `scale(${harf})`}}>
            X
          </BuyukYazi>
          <div style={{fontSize: 140, color: RENK.soluk, opacity: harf}}>→</div>
          <BuyukYazi boyut={360} renk={RENK.pembe} style={{transform: `scale(${harf})`}}>
            y
          </BuyukYazi>
        </Ortala>
      </Asama>
      <Asama bas={1} son={3}>
        <Ortala gap={24}>
          <div style={{display: 'flex', gap: 14, fontSize: 30, fontWeight: 700}}>
            {X_SUTUN.map((s) => (
              <div key={s.ad} style={{...hucre(RENK.mavi, x), fontWeight: 800}}>
                {s.ad}
              </div>
            ))}
            <div style={{...hucre(RENK.pembe, y), fontWeight: 800}}>fiyat</div>
          </div>
          <div style={{display: 'flex', gap: 14}}>
            {X_SUTUN.map((s) => (
              <div key={s.ad} style={hucre(RENK.mavi, x)}>
                {s.deger}
              </div>
            ))}
            <div style={{...hucre(RENK.pembe, y), opacity: 0.3 + y * 0.7, fontWeight: 800}}>452.600 $</div>
          </div>
          {ORNEKLER.map((satir, i) => (
            <div key={i} style={{display: 'flex', gap: 14, opacity: ornek[i]}}>
              {satir.map((d, j) => (
                <div key={j} style={hucre(j === 5 ? RENK.pembe : RENK.mavi, 0)}>
                  {d}
                </div>
              ))}
            </div>
          ))}
          <div style={{display: 'flex', gap: 40, marginTop: 20}}>
            <Cip renk={RENK.mavi} style={{opacity: x}}>X = sorular (özellikler)</Cip>
            <Cip renk={RENK.pembe} style={{opacity: y}}>y = cevap (hedef)</Cip>
            <Cip renk={RENK.yesil} style={{opacity: ornek[0]}}>
              ✓ cevaplı örnekler → denetimli öğrenme
            </Cip>
          </div>
        </Ortala>
      </Asama>
      <Asama bas={4} son={5}>
        <Ortala yon="row" gap={60}>
          <Kart renk={RENK.mavi} style={{width: 700, textAlign: 'center', opacity: reg, transform: `scale(${0.9 + reg * 0.1})`}}>
            <div style={{fontSize: 56, fontWeight: 800, color: RENK.mavi}}>Regresyon</div>
            <div style={{fontSize: 36, color: RENK.soluk, margin: '16px 0'}}>Sonuç bir sayı</div>
            <div style={{fontSize: 80, fontWeight: 900}}>452.600 $</div>
            <div style={{fontSize: 32, marginTop: 14}}>← bizim problemimiz</div>
          </Kart>
          <Kart renk={RENK.mor} style={{width: 700, textAlign: 'center', opacity: sin * 0.9, transform: `scale(${0.9 + sin * 0.1})`}}>
            <div style={{fontSize: 56, fontWeight: 800, color: RENK.mor}}>Sınıflandırma</div>
            <div style={{fontSize: 36, color: RENK.soluk, margin: '16px 0'}}>Sonuç bir sınıf</div>
            <div style={{fontSize: 80, fontWeight: 900}}>ucuz / pahalı</div>
            <div style={{fontSize: 32, marginTop: 14}}>(başka bir problem türü)</div>
          </Kart>
        </Ortala>
      </Asama>
      <Asama bas={6}>
        <Hap>
          Model, <span style={{color: RENK.mavi}}>X</span>'ten <span style={{color: RENK.pembe}}>y</span>'ye giden tarifi
          <br />
          örneklerden kendisi çıkarır.
        </Hap>
      </Asama>
    </Sahnelik>
  );
};
