import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// ------------------------------------------------------------------
// Tema
// ------------------------------------------------------------------
export const RENK = {
  arka: '#0b1020',
  arka2: '#141b34',
  kart: 'rgba(255,255,255,0.06)',
  cizgi: 'rgba(255,255,255,0.12)',
  yazi: '#f1f5f9',
  soluk: '#94a3b8',
  mavi: '#4c8dff',
  mor: '#8b5cf6',
  pembe: '#ec4899',
  yesil: '#22c55e',
  sari: '#f59e0b',
  kirmizi: '#ef4444',
  gri: '#64748b',
};
export const FONT = 'Inter, "Noto Color Emoji", sans-serif';

// ------------------------------------------------------------------
// Sahne zamanlaması: her cümle bir "vuruş" (beat). Görseller vuruşlara bağlanır.
// ------------------------------------------------------------------
export const VurusContext = createContext<{baslangiclar: number[]; renk: string}>({baslangiclar: [0], renk: RENK.mavi});

export const useVurus = () => useContext(VurusContext);

/** i. cümle başladığında 0'dan 1'e yaylanan değer. */
export const useGiris = (i: number, gecikme = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {baslangiclar} = useVurus();
  return spring({frame: frame - (baslangiclar[i] ?? 0) - gecikme, fps, config: {damping: 200}});
};

/** i. cümlenin başından bu yana geçen kare (önceyse negatif). */
export const useVurusKaresi = (i: number) => {
  const frame = useCurrentFrame();
  const {baslangiclar} = useVurus();
  return frame - (baslangiclar[i] ?? 0);
};

/** [bas, son] cümleleri boyunca görünen, kenarlarda yumuşakça giren/çıkan katman. */
export const Asama: React.FC<{bas: number; son?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  bas,
  son,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const {baslangiclar} = useVurus();
  const giris = baslangiclar[bas] ?? 0;
  const cikis = son === undefined || son + 1 >= baslangiclar.length ? Infinity : baslangiclar[son + 1];
  if (frame < giris - 1 || frame > cikis + 12) return null;
  const opaklik = Number.isFinite(cikis)
    ? interpolate(frame, [giris, giris + 12, cikis - 2, cikis + 10], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : interpolate(frame, [giris, giris + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = interpolate(frame, [giris, giris + 15], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{padding: '100px 120px 220px', opacity: opaklik, transform: `translateY(${y}px)`, ...style}}>
      {children}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------
// Yapı taşları
// ------------------------------------------------------------------
export const Sahnelik: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={{fontFamily: FONT, color: RENK.yazi, ...style}}>
    {children}
  </AbsoluteFill>
);

export const Ortala: React.FC<{children: React.ReactNode; gap?: number; yon?: 'row' | 'column'; style?: React.CSSProperties}> = ({
  children,
  gap = 32,
  yon = 'column',
  style,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: yon,
      alignItems: 'center',
      justifyContent: 'center',
      gap,
      width: '100%',
      height: '100%',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Kart: React.FC<{children: React.ReactNode; renk?: string; style?: React.CSSProperties}> = ({
  children,
  renk,
  style,
}) => (
  <div
    style={{
      background: RENK.kart,
      border: `2px solid ${renk ?? RENK.cizgi}`,
      borderRadius: 28,
      padding: '28px 36px',
      boxShadow: renk ? `0 0 40px ${renk}33` : '0 10px 40px rgba(0,0,0,0.35)',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Cip: React.FC<{children: React.ReactNode; renk: string; style?: React.CSSProperties}> = ({children, renk, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 28px',
      borderRadius: 999,
      background: `${renk}22`,
      border: `2px solid ${renk}`,
      color: RENK.yazi,
      fontSize: 34,
      fontWeight: 600,
      ...style,
    }}
  >
    {children}
  </div>
);

export const BuyukYazi: React.FC<{children: React.ReactNode; boyut?: number; renk?: string; style?: React.CSSProperties}> = ({
  children,
  boyut = 72,
  renk,
  style,
}) => (
  <div style={{fontSize: boyut, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.1, color: renk, textAlign: 'center', ...style}}>
    {children}
  </div>
);

/** Hap bilgi kartı: sahnenin akılda kalacak tek cümlesi. */
export const Hap: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {renk} = useVurus();
  return (
    <Ortala>
      <div style={{fontSize: 40, fontWeight: 800, color: RENK.sari, letterSpacing: 4}}>💊 HAP BİLGİ</div>
      <Kart renk={RENK.sari} style={{maxWidth: 1400, padding: '48px 64px'}}>
        <div style={{fontSize: 64, fontWeight: 700, textAlign: 'center', lineHeight: 1.25}}>{children}</div>
      </Kart>
      <div style={{width: 160, height: 8, borderRadius: 4, background: renk}} />
    </Ortala>
  );
};

/** Projede ürettiğimiz grafikleri beyaz bir kart içinde gösterir. */
export const Grafik: React.FC<{dosya: string; yukseklik?: number; style?: React.CSSProperties}> = ({
  dosya,
  yukseklik = 640,
  style,
}) => (
  <div
    style={{
      background: 'white',
      borderRadius: 24,
      padding: 16,
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      ...style,
    }}
  >
    <Img src={staticFile(dosya)} style={{height: yukseklik, display: 'block', borderRadius: 12}} />
  </div>
);

/** 0'dan hedefe sayan sayaç. */
export const Sayac: React.FC<{hedef: number; ilerleme: number; onEk?: string; sonEk?: string; style?: React.CSSProperties}> = ({
  hedef,
  ilerleme,
  onEk = '',
  sonEk = '',
  style,
}) => {
  const deger = Math.round(hedef * Math.min(1, Math.max(0, ilerleme)));
  return (
    <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>
      {onEk}
      {deger.toLocaleString('tr-TR')}
      {sonEk}
    </span>
  );
};

/** Belirli sürede 0→1 giden doğrusal ilerleme (sayaçlar için). */
export const useSure = (i: number, kare: number, gecikme = 0) => {
  const f = useVurusKaresi(i) - gecikme;
  return interpolate(f, [0, kare], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
};

/** Yatay çubuk grafik satırı. */
export const Cubuk: React.FC<{
  etiket: string;
  deger: number;
  max: number;
  ilerleme: number;
  renk: string;
  yazi?: string;
  genislik?: number;
  vurgulu?: boolean;
}> = ({etiket, deger, max, ilerleme, renk, yazi, genislik = 900, vurgulu}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 24, fontSize: 32}}>
    <div style={{width: 320, textAlign: 'right', color: vurgulu ? RENK.yazi : RENK.soluk, fontWeight: vurgulu ? 700 : 500}}>
      {etiket}
    </div>
    <div style={{width: genislik, height: 54, background: 'rgba(255,255,255,0.05)', borderRadius: 12, position: 'relative'}}>
      <div
        style={{
          width: `${(deger / max) * 100 * ilerleme}%`,
          height: '100%',
          background: renk,
          borderRadius: 12,
          boxShadow: vurgulu ? `0 0 30px ${renk}` : undefined,
        }}
      />
    </div>
    <div style={{width: 240, fontWeight: 700, fontVariantNumeric: 'tabular-nums', opacity: ilerleme}}>{yazi}</div>
  </div>
);
