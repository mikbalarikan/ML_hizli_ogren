# ML Hızlı Öğren — Kaliforniya Ev Fiyatı Tahmini

Sıfırdan, uygulamalı, adım adım makine öğrenmesi.
Referans proje: [ageron/handson-ml3](https://github.com/ageron/handson-ml3) (14.4k ⭐, Apache-2.0).
Kitaptaki **Bölüm 2: Uçtan Uca ML Projesi**'ni sadeleştirip birlikte yeniden yazıyoruz.

![Proje haritası](gorseller/00_buyuk_harita.png)

## Neden bu proje?

| Kriter | Durum |
|---|---|
| Veri küçük mü? | ✅ 1 CSV, 1,4 MB, 20.640 satır |
| Kod basit mi? | ✅ pandas + scikit-learn, ~150 satır |
| Hızlı sonuç? | ✅ Eğitim CPU'da saniyeler-dakikalar |
| Kaliteli mi? | ✅ ML eğitiminde en çok kullanılan "ilk gerçek proje" |

## Problem tek cümlede

> Kaliforniya'daki bir **mahallenin** (district) özelliklerine bakarak oradaki
> **medyan ev fiyatını** tahmin et.

- **Girdi (X, özellikler):** konum, ev yaşı, oda sayısı, nüfus, gelir, okyanusa yakınlık…
- **Çıktı (y, hedef):** `median_house_value`
- **Tür:** Denetimli öğrenme (supervised) → **Regresyon** (sayı tahmini)
- **Başarı ölçüsü:** RMSE (ortalama ne kadar dolar yanılıyoruz?)

## Klasör yapısı

```
ML_hizli_ogren/
├── README.md                 ← bu dosya: harita + ilerleme
├── data/housing/housing.csv  ← ham veri (dokunmuyoruz)
├── data/hazir/               ← egitim.csv (%80) + test.csv (%20)
├── docs/                     ← her aşamanın ders notu
├── src/                      ← birlikte yazdığımız Python kodları
├── modeller/                 ← kaydedilen hazırlayıcı, modeller, sonuclar.json
├── loglar/                   ← eğitim logları (canlı izleme)
└── gorseller/                ← grafikler
```

## İlerleme

| # | Aşama | Durum | Ders notu | Kod |
|---|---|---|---|---|
| 0 | Büyük resim | ✅ | [docs/01_veri.md](docs/01_veri.md) | — |
| 1 | Veriyi al | ✅ | [docs/01_veri.md](docs/01_veri.md) | — |
| 2 | Veriyi keşfet | ✅ | [docs/01_veri.md](docs/01_veri.md) | [src/00_gorselleri_ciz.py](src/00_gorselleri_ciz.py) |
| 3 | Test setini ayır | ✅ | [docs/02_test_ayir.md](docs/02_test_ayir.md) | [src/01_test_setini_ayir.py](src/01_test_setini_ayir.py) |
| 4 | Veriyi hazırla | ✅ | [docs/03_hazirla.md](docs/03_hazirla.md) | [src/02_veriyi_hazirla.py](src/02_veriyi_hazirla.py), [src/hazirlik.py](src/hazirlik.py) |
| 5 | Model eğit | ✅ | [docs/04_model_egit.md](docs/04_model_egit.md) | [src/03_model_egit.py](src/03_model_egit.py) |
| 6 | İnce ayar | 🟡 sıradaki | | |
| 7 | Test et & sun | ⬜ | | |
| 8 | Kaydet & kullan | ⬜ | | |

## Çalıştırma

```bash
pip install pandas scikit-learn matplotlib joblib
python src/00_gorselleri_ciz.py
python src/01_test_setini_ayir.py
python src/02_veriyi_hazirla.py
python src/03_model_egit.py        # canlı izlemek için başka terminalde: tail -f loglar/egitim.log
```
