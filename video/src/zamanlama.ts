import senaryo from './senaryo.json';

export const FPS = 30;
const KELIME_SN = 1.7; // altyazı okuma hızı (kelime/saniye)
const BOSLUK_SN = 1.0; // cümleler arası nefes
const MIN_SN = 3.0;
export const BOLUM_KARTI = 3 * FPS; // bölüm başlık kartı
export const KAPANIS = 4 * FPS;

export type Sahne = (typeof senaryo.sahneler)[number];

export type ZamanliSahne = Sahne & {
  kart: number; // bölüm kartı süresi (giriş sahnesinde 0)
  baslangiclar: number[]; // cümlelerin sahne gövdesine göre başlangıç kareleri
  sureler: number[];
  govde: number; // gövde süresi
  toplam: number; // kart + gövde
  mutlakBaslangic: number; // videodaki başlangıç karesi
};

const cumleSuresi = (cumle: string) => {
  const kelime = cumle.split(/\s+/).length;
  return Math.round(Math.max(MIN_SN, kelime / KELIME_SN + BOSLUK_SN) * FPS);
};

let imlec = 0;
export const sahneler: ZamanliSahne[] = senaryo.sahneler.map((s) => {
  const sureler = s.cumleler.map(cumleSuresi);
  const baslangiclar = sureler.map((_, i) => sureler.slice(0, i).reduce((a, b) => a + b, 0));
  const govde = sureler.reduce((a, b) => a + b, 0);
  const kart = s.id === 'giris' ? 0 : BOLUM_KARTI;
  const sahne = {...s, kart, baslangiclar, sureler, govde, toplam: kart + govde, mutlakBaslangic: imlec};
  imlec += sahne.toplam;
  return sahne;
});

export const TOPLAM_KARE = imlec + KAPANIS;
export {senaryo};
