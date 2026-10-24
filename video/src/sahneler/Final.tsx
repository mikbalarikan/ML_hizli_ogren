import React from 'react';
import {Asama, BuyukYazi, Cubuk, Hap, Kart, Ortala, RENK, Sahnelik, Sayac, useGiris, useSure} from '../ortak';

const FIYAT_GRUBU = [
  {ad: '<100k', rmse: 32430},
  {ad: '100–200k', rmse: 34090},
  {ad: '200–300k', rmse: 41926},
  {ad: '300–400k', rmse: 63335},
  {ad: '400–500k', rmse: 103591},
  {ad: '500k tavan', rmse: 92910},
];

const Kasa: React.FC<{acik: number}> = ({acik}) => (
  <div style={{perspective: 1200}}>
    <div
      style={{
        width: 380,
        height: 380,
        borderRadius: 30,
        background: 'rgba(0,0,0,0.5)',
        border: `8px solid ${RENK.sari}`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 64,
        fontWeight: 900,
        color: RENK.yesil,
      }}
    >
      4.128
      <div
        style={{
          position: 'absolute',
          inset: -8,
          borderRadius: 30,
          background: `linear-gradient(135deg, #3b3f55, #23263a)`,
          border: `8px solid ${RENK.sari}`,
          transformOrigin: 'left center',
          transform: `rotateY(${-acik * 105}deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{width: 130, height: 130, borderRadius: 65, border: `10px solid ${RENK.sari}`, transform: `rotate(${acik * 270}deg)`}}>
          <div style={{width: 10, height: 50, background: RENK.sari, margin: '0 auto'}} />
        </div>
      </div>
    </div>
  </div>
);

export const Final: React.FC = () => {
  const acik = useSure(0, 50, 10);
  const mahalle = useGiris(1);
  const skor = useSure(2, 50);
  const karsilastirma = useGiris(2, 20);
  const tik = useGiris(3);
  const cubuk = useSure(4, 40);
  const tavan = useGiris(5);
  return (
    <Sahnelik>
      <Asama bas={0} son={1}>
        <Ortala yon="row" gap={100}>
          <Kasa acik={acik} />
          <div style={{opacity: mahalle}}>
            <BuyukYazi boyut={80} style={{textAlign: 'left'}}>
              Kasa açıldı 🔓
            </BuyukYazi>
            <div style={{fontSize: 46, color: RENK.soluk, marginTop: 20}}>
              Model bu <b style={{color: RENK.yesil}}>4.128 mahalleyi</b>
              <br />
              hiç görmedi.
            </div>
          </div>
        </Ortala>
      </Asama>
      <Asama bas={2} son={3}>
        <Ortala gap={40}>
          <div style={{fontSize: 44, color: RENK.soluk}}>FİNAL TEST RMSE</div>
          <BuyukYazi boyut={190} renk={RENK.yesil}>
            <Sayac hedef={47510} ilerleme={skor} sonEk=" $" />
          </BuyukYazi>
          <div style={{display: 'flex', flexDirection: 'column', gap: 18, opacity: karsilastirma}}>
            <Cubuk etiket="Eğitim (ezber)" deger={17998} max={50000} ilerleme={karsilastirma} renk={RENK.gri} yazi="18.0k $" genislik={800} />
            <Cubuk etiket="Çapraz doğrulama" deger={49140} max={50000} ilerleme={karsilastirma} renk={RENK.pembe} yazi="49.1k $" genislik={800} />
            <Cubuk etiket="TEST" deger={47510} max={50000} ilerleme={karsilastirma} renk={RENK.yesil} yazi="47.5k $" genislik={800} vurgulu />
          </div>
          <div style={{fontSize: 46, fontWeight: 800, color: RENK.yesil, opacity: tik}}>✓ Ezberlememiş, gerçekten öğrenmiş</div>
        </Ortala>
      </Asama>
      <Asama bas={4} son={5}>
        <Ortala gap={22}>
          <div style={{fontSize: 46, fontWeight: 800, marginBottom: 10}}>Fiyat grubuna göre hata</div>
          {FIYAT_GRUBU.map((g) => {
            const tavanMi = g.ad === '500k tavan' || g.ad === '400–500k';
            return (
              <Cubuk
                key={g.ad}
                etiket={g.ad}
                deger={g.rmse}
                max={110000}
                ilerleme={cubuk}
                renk={tavanMi && tavan > 0.5 ? RENK.kirmizi : RENK.mavi}
                yazi={`${Math.round(g.rmse / 1000)}k $`}
                vurgulu={tavanMi && tavan > 0.5}
              />
            );
          })}
          <Kart renk={RENK.kirmizi} style={{opacity: tavan, padding: '16px 36px', marginTop: 10}}>
            <div style={{fontSize: 38, fontWeight: 700}}>⚠️ En kötü 5 tahminin 5'i de 500k tavanında</div>
          </Kart>
        </Ortala>
      </Asama>
      <Asama bas={6}>
        <Hap>
          Tek bir sayıya bakıp geçme.
          <br />
          Hatanın <span style={{color: RENK.kirmizi}}>nerede</span> olduğunu analiz et.
        </Hap>
      </Asama>
    </Sahnelik>
  );
};
