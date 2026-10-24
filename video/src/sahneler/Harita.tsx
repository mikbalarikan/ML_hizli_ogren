import React from 'react';
import {interpolate} from 'remotion';
import {Asama, Kart, Ortala, RENK, Sahnelik, useGiris, useVurusKaresi} from '../ortak';

const ASAMALAR = [
  {no: 0, ad: 'Büyük resim', grup: 1},
  {no: 1, ad: 'Veriyi al', grup: 1},
  {no: 2, ad: 'Keşfet', grup: 1},
  {no: 3, ad: 'Test ayır', grup: 2},
  {no: 4, ad: 'Hazırla', grup: 2},
  {no: 5, ad: 'Model eğit', grup: 3},
  {no: 6, ad: 'İnce ayar', grup: 3},
  {no: 7, ad: 'Test et', grup: 4},
  {no: 8, ad: 'Kullan', grup: 4},
];
const GRUP_RENK = ['', RENK.mavi, RENK.mor, RENK.pembe, RENK.yesil];
const GRUP_AD = ['', 'Elimizde ne var?', 'Makineye hazırla', 'Öğret ve iyileştir', 'İşe yarıyor mu?'];

export const Harita: React.FC = () => {
  const gruplar = [0, 1, 2, 3, 4].map((g) => useGiris(g));
  const kutular = ASAMALAR.map((_, i) => useGiris(0, i * 4));
  const son = useGiris(5);
  const f5 = useVurusKaresi(5);
  const doluluk = interpolate(f5, [10, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Sahnelik>
      <Asama bas={0} son={4}>
        <Ortala gap={50}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 18, width: '100%'}}>
            {ASAMALAR.map((a, i) => {
              const aktif = gruplar[a.grup];
              const renk = GRUP_RENK[a.grup];
              return (
                <div
                  key={a.no}
                  style={{
                    height: 260,
                    borderRadius: 24,
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: `color-mix(in srgb, ${renk} ${Math.round(aktif * 85)}%, rgba(255,255,255,0.06))`,
                    border: `2px solid ${aktif > 0.5 ? renk : RENK.cizgi}`,
                    opacity: kutular[i],
                    transform: `translateY(${(1 - kutular[i]) * 40}px) scale(${1 + aktif * 0.04})`,
                    boxShadow: aktif > 0.5 ? `0 0 40px ${renk}66` : 'none',
                  }}
                >
                  <div style={{fontSize: 72, fontWeight: 900}}>{a.no}</div>
                  <div style={{fontSize: 30, fontWeight: 700, lineHeight: 1.15}}>{a.ad}</div>
                </div>
              );
            })}
          </div>
          <div style={{display: 'flex', gap: 30}}>
            {[1, 2, 3, 4].map((g) => (
              <div key={g} style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 32, opacity: 0.3 + gruplar[g] * 0.7}}>
                <div style={{width: 26, height: 26, borderRadius: 8, background: GRUP_RENK[g]}} />
                {GRUP_AD[g]}
              </div>
            ))}
          </div>
        </Ortala>
      </Asama>
      <Asama bas={5}>
        <Ortala gap={40}>
          <div style={{fontSize: 52, fontWeight: 800, opacity: son}}>Zaman nereye gidiyor?</div>
          <div style={{display: 'flex', width: 1500, height: 140, borderRadius: 24, overflow: 'hidden', border: `2px solid ${RENK.cizgi}`}}>
            <div
              style={{
                width: `${80 * doluluk}%`,
                background: `linear-gradient(90deg, ${RENK.mavi}, ${RENK.mor})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                fontWeight: 800,
              }}
            >
              {doluluk > 0.6 && 'Veriyle uğraşmak ~%80'}
            </div>
            <div
              style={{
                flex: 1,
                background: RENK.pembe,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
                fontWeight: 800,
                opacity: doluluk,
              }}
            >
              Model
            </div>
          </div>
          <Kart style={{fontFamily: 'DejaVu Sans Mono, monospace', fontSize: 40, opacity: doluluk}}>
            model.fit(X, y) <span style={{color: RENK.soluk}}># asıl "öğrenme" bu kadar</span>
          </Kart>
        </Ortala>
      </Asama>
    </Sahnelik>
  );
};
