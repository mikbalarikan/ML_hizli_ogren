import React from 'react';
import {interpolate} from 'remotion';
import {Asama, BuyukYazi, Cip, Kart, Ortala, RENK, Sahnelik, useGiris, useVurusKaresi} from '../ortak';

const Ev: React.FC<{boyut: number}> = ({boyut}) => (
  <svg width={boyut} height={boyut} viewBox="0 0 200 200">
    <path d="M100 20 L185 95 L160 95 L160 180 L40 180 L40 95 L15 95 Z" fill={RENK.mavi} opacity={0.9} />
    <rect x="82" y="120" width="36" height="60" rx="4" fill={RENK.arka} />
    <rect x="55" y="110" width="20" height="20" rx="3" fill={RENK.arka} />
    <rect x="125" y="110" width="20" height="20" rx="3" fill={RENK.arka} />
  </svg>
);

export const Giris: React.FC = () => {
  const evGiris = useGiris(0);
  const f = useVurusKaresi(0);
  const nabiz = 1 + Math.sin(f / 8) * 0.06;
  const baslik = useGiris(1);
  const rozet1 = useGiris(2);
  const rozet2 = useGiris(2, 10);
  const akis = [useGiris(3), useGiris(3, 12), useGiris(3, 24)];
  return (
    <Sahnelik>
      <Asama bas={0} son={2}>
        <Ortala gap={40}>
          <div style={{display: 'flex', alignItems: 'center', gap: 50, transform: `scale(${evGiris})`}}>
            <Ev boyut={260} />
            <div style={{fontSize: 200, fontWeight: 900, color: RENK.pembe, transform: `scale(${nabiz})`}}>? $</div>
          </div>
          <BuyukYazi boyut={86} style={{opacity: baslik, transform: `translateY(${(1 - baslik) * 30}px)`}}>
            10 dakikada uçtan uca bir
            <br />
            <span style={{color: RENK.mavi}}>makine öğrenmesi</span> projesi
          </BuyukYazi>
          <div style={{display: 'flex', gap: 28}}>
            <Cip renk={RENK.sari} style={{opacity: rozet1, transform: `scale(${rozet1})`}}>
              ⭐ 14.4k · ageron/handson-ml3
            </Cip>
            <Cip renk={RENK.mavi} style={{opacity: rozet2, transform: `scale(${rozet2})`}}>
              📊 1990 Kaliforniya · 20.640 mahalle
            </Cip>
          </div>
        </Ortala>
      </Asama>
      <Asama bas={3}>
        <Ortala gap={60} yon="row">
          {[
            {ikon: '🏘️', yazi: 'Mahalle bilgileri', renk: RENK.mavi},
            {ikon: '🤖', yazi: 'Model', renk: RENK.mor},
            {ikon: '💰', yazi: 'Ev fiyatı', renk: RENK.pembe},
          ].map((k, i) => (
            <React.Fragment key={k.yazi}>
              {i > 0 && (
                <div style={{fontSize: 90, color: RENK.soluk, opacity: akis[i]}}>→</div>
              )}
              <Kart
                renk={k.renk}
                style={{
                  width: 380,
                  textAlign: 'center',
                  opacity: akis[i],
                  transform: `translateY(${interpolate(akis[i], [0, 1], [40, 0])}px)`,
                }}
              >
                <div style={{fontSize: 120}}>{k.ikon}</div>
                <div style={{fontSize: 42, fontWeight: 700, marginTop: 10}}>{k.yazi}</div>
              </Kart>
            </React.Fragment>
          ))}
        </Ortala>
      </Asama>
    </Sahnelik>
  );
};
