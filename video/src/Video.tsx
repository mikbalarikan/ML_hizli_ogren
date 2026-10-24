import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BuyukYazi, FONT, Ortala, RENK, VurusContext} from './ortak';
import {KAPANIS, sahneler, senaryo, ZamanliSahne} from './zamanlama';
import {Giris} from './sahneler/Giris';
import {Harita} from './sahneler/Harita';
import {XY} from './sahneler/XY';
import {Kesif} from './sahneler/Kesif';
import {TestSeti} from './sahneler/TestSeti';
import {Hazirla} from './sahneler/Hazirla';
import {Egitim} from './sahneler/Egitim';
import {Ayar} from './sahneler/Ayar';
import {Final} from './sahneler/Final';
import {Kullan} from './sahneler/Kullan';
import {Ozet} from './sahneler/Ozet';

const GORSELLER: Record<string, React.FC> = {
  giris: Giris,
  harita: Harita,
  xy: XY,
  kesif: Kesif,
  test: TestSeti,
  hazirla: Hazirla,
  egitim: Egitim,
  ayar: Ayar,
  final: Final,
  kullan: Kullan,
  ozet: Ozet,
};

// ------------------------------------------------------------------
// Arka plan: yavaşça kayan degrade + ince ızgara
// ------------------------------------------------------------------
const ArkaPlan: React.FC = () => {
  const frame = useCurrentFrame();
  const aci = 135 + Math.sin(frame / 300) * 20;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${aci}deg, ${RENK.arka} 0%, ${RENK.arka2} 55%, #1a1240 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------
// Bölüm kartı (3 sn)
// ------------------------------------------------------------------
const BolumKarti: React.FC<{sahne: ZamanliSahne}> = ({sahne}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const g = spring({frame, fps, config: {damping: 14, mass: 0.6}});
  const cikis = interpolate(frame, [sahne.kart - 12, sahne.kart], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cizgi = interpolate(frame, [5, 35], [0, 700], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{fontFamily: FONT, color: RENK.yazi, opacity: cikis}}>
      <Ortala gap={20}>
        <div style={{fontSize: 44, fontWeight: 700, color: sahne.renk, letterSpacing: 8, opacity: g}}>
          BÖLÜM {sahne.no}
        </div>
        <BuyukYazi boyut={130} style={{transform: `scale(${0.85 + 0.15 * g})`, opacity: g}}>
          {sahne.baslik}
        </BuyukYazi>
        <div style={{width: cizgi, height: 10, borderRadius: 5, background: sahne.renk}} />
      </Ortala>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------
// Altyazı: kelimeler okuma hızında belirir
// ------------------------------------------------------------------
const Altyazi: React.FC<{sahne: ZamanliSahne}> = ({sahne}) => {
  const frame = useCurrentFrame();
  let i = sahne.baslangiclar.findIndex((b, k) => frame >= b && frame < b + sahne.sureler[k]);
  if (i < 0) i = sahne.cumleler.length - 1;
  const cumle = sahne.cumleler[i];
  const yerel = frame - sahne.baslangiclar[i];
  const kelimeler = cumle.split(' ');
  const yazmaSuresi = sahne.sureler[i] * 0.55;
  const hap = cumle.startsWith('Hap bilgi');
  const giris = interpolate(yerel, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: 160,
        right: 160,
        bottom: 56,
        minHeight: 130,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '22px 44px',
        borderRadius: 24,
        background: 'rgba(5,8,20,0.78)',
        border: `2px solid ${hap ? RENK.sari : 'rgba(255,255,255,0.08)'}`,
        fontFamily: FONT,
        fontSize: 40,
        lineHeight: 1.35,
        fontWeight: 500,
        textAlign: 'center',
        opacity: giris,
      }}
    >
      <div>
        {kelimeler.map((k, j) => {
          const an = (j / kelimeler.length) * yazmaSuresi;
          const o = interpolate(yerel, [an, an + 6], [0.18, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <span key={j} style={{opacity: o, color: hap ? RENK.sari : RENK.yazi}}>
              {k}{' '}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Üst etiket + alt ilerleme çubuğu
// ------------------------------------------------------------------
const UstBilgi: React.FC = () => {
  const frame = useCurrentFrame();
  const aktif = [...sahneler].reverse().find((s) => frame >= s.mutlakBaslangic) ?? sahneler[0];
  const saniye = Math.floor(frame / 30);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontFamily: FONT,
          fontSize: 26,
          fontWeight: 600,
          color: RENK.soluk,
        }}
      >
        <div style={{width: 14, height: 14, borderRadius: 7, background: aktif.renk}} />
        {aktif.id === 'giris' ? 'ML Hızlı Öğren' : `Bölüm ${aktif.no} · ${aktif.baslik}`}
      </div>
      <div style={{position: 'absolute', top: 40, right: 60, fontFamily: FONT, fontSize: 26, color: RENK.gri, fontVariantNumeric: 'tabular-nums'}}>
        {String(Math.floor(saniye / 60)).padStart(2, '0')}:{String(saniye % 60).padStart(2, '0')}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 10, display: 'flex', gap: 3}}>
        {sahneler.map((s) => {
          const dolu = interpolate(frame, [s.mutlakBaslangic, s.mutlakBaslangic + s.toplam], [0, 100], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div key={s.id} style={{flex: s.toplam, background: 'rgba(255,255,255,0.08)'}}>
              <div style={{width: `${dolu}%`, height: '100%', background: s.renk}} />
            </div>
          );
        })}
      </div>
    </>
  );
};

// ------------------------------------------------------------------
// Kapanış
// ------------------------------------------------------------------
const Kapanis: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const g = spring({frame, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{fontFamily: FONT, color: RENK.yazi, opacity: interpolate(frame, [KAPANIS - 20, KAPANIS], [1, 0], {extrapolateLeft: 'clamp'})}}>
      <Ortala gap={28}>
        <BuyukYazi boyut={84} style={{opacity: g}}>
          {senaryo.baslik}
        </BuyukYazi>
        <div style={{fontSize: 40, color: RENK.soluk, opacity: g}}>github.com/mikbalarikan/ML_hizli_ogren</div>
      </Ortala>
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => {
  const son = sahneler[sahneler.length - 1];
  return (
    <AbsoluteFill style={{backgroundColor: RENK.arka}}>
      <ArkaPlan />
      {sahneler.map((s) => {
        const Gorsel = GORSELLER[s.id];
        return (
          <Sequence key={s.id} from={s.mutlakBaslangic} durationInFrames={s.toplam} name={`${s.no} ${s.baslik}`}>
            {s.kart > 0 && (
              <Sequence durationInFrames={s.kart} name="Bölüm kartı">
                <BolumKarti sahne={s} />
              </Sequence>
            )}
            <Sequence from={s.kart} durationInFrames={s.govde} name="Gövde">
              <VurusContext.Provider value={{baslangiclar: s.baslangiclar, renk: s.renk}}>
                <Gorsel />
                <Altyazi sahne={s} />
              </VurusContext.Provider>
            </Sequence>
          </Sequence>
        );
      })}
      <Sequence from={son.mutlakBaslangic + son.toplam} durationInFrames={KAPANIS} name="Kapanış">
        <Kapanis />
      </Sequence>
      <UstBilgi />
    </AbsoluteFill>
  );
};

