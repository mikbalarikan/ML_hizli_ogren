"""AŞAMA 8 — Kaydedilen modeli kullan: yeni bir mahalleye fiyat tahmini.

Örnekler:
    python src/06_tahmin_et.py --sehir los_angeles --gelir 80000 --yas 20
    python src/06_tahmin_et.py --sehir fresno --gelir 30000 --yas 40 --grafik

Verilmeyen bilgiler (oda sayısı, nüfus...) eğitim verisindeki tipik (medyan) mahalle değerleriyle doldurulur.
Not: Model 1990 verisiyle eğitildi, tahminler 1990 dolarıdır.
"""
import argparse
from pathlib import Path

import joblib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

KOK = Path(__file__).resolve().parent.parent

# Şehir -> (boylam, enlem, okyanusa yakınlık)
SEHIRLER = {
    "san_francisco": (-122.42, 37.77, "NEAR BAY"),
    "los_angeles": (-118.24, 34.05, "<1H OCEAN"),
    "san_diego": (-117.16, 32.72, "NEAR OCEAN"),
    "sacramento": (-121.49, 38.58, "INLAND"),
    "fresno": (-119.79, 36.74, "INLAND"),
}

# ---------------------------------------------------------------
# ADIM 1: Kullanıcıdan bilgileri al
# ---------------------------------------------------------------
ayristirici = argparse.ArgumentParser(description="Kaliforniya mahalle fiyat tahmini (1990)")
ayristirici.add_argument("--sehir", choices=SEHIRLER, required=True)
ayristirici.add_argument("--gelir", type=float, required=True, help="medyan hane geliri, $ (örn. 80000)")
ayristirici.add_argument("--yas", type=float, required=True, help="evlerin medyan yaşı (yıl)")
ayristirici.add_argument("--oda", type=float, help="mahalledeki toplam oda sayısı")
ayristirici.add_argument("--nufus", type=float, help="mahalle nüfusu")
ayristirici.add_argument("--grafik", action="store_true", help="100 ağacın oylarını çiz")
arg = ayristirici.parse_args()

# ---------------------------------------------------------------
# ADIM 2: Tek satırlık bir mahalle tablosu kur (eğitimdeki HAM sütunlarla aynı)
# ---------------------------------------------------------------
tipik = pd.read_csv(KOK / "data" / "hazir" / "egitim.csv").median(numeric_only=True)
boylam, enlem, yakinlik = SEHIRLER[arg.sehir]
mahalle = pd.DataFrame([{
    "longitude": boylam,
    "latitude": enlem,
    "housing_median_age": arg.yas,
    "total_rooms": arg.oda or tipik["total_rooms"],
    "total_bedrooms": tipik["total_bedrooms"],
    "population": arg.nufus or tipik["population"],
    "households": tipik["households"],
    "median_income": arg.gelir / 10_000,          # veri setinde gelir ×10.000 $ biriminde
    "ocean_proximity": yakinlik,
}])

# ---------------------------------------------------------------
# ADIM 3: Modeli yükle ve tahmin et (Pipeline: hazırlık + model tek dosyada)
# ---------------------------------------------------------------
makine = joblib.load(KOK / "modeller" / "en_iyi_model.joblib")
tahmin = makine.predict(mahalle)[0]

# Bonus: ormandaki her ağacın ayrı tahmini ("oyları"). Dağılım ne kadar genişse model o kadar emin değil.
hazir = makine.named_steps["hazirla"].transform(mahalle)
oylar = np.array([agac.predict(hazir.values)[0] for agac in makine.named_steps["model"].estimators_])
alt, ust = np.percentile(oylar, [10, 90])

print(f"📍 {arg.sehir}  |  gelir {arg.gelir:,.0f} $  |  ev yaşı {arg.yas:.0f}  |  {yakinlik}")
print(f"🏠 TAHMİN: {tahmin:,.0f} $   (1990 doları)")
print(f"🌲 Ağaçların %80'i şu aralıkta: {alt:,.0f} $ … {ust:,.0f} $")

if arg.grafik:
    fig, ax = plt.subplots(figsize=(10, 5))
    ax.hist(oylar, bins=25, color="#198754", alpha=0.85)
    ax.axvline(tahmin, color="#d63384", lw=3, label=f"Ortalama = tahmin: {tahmin:,.0f} $")
    ax.axvspan(alt, ust, color="#ffc107", alpha=0.2, label="Ağaçların %80'i")
    ax.set_xlabel("Bir ağacın tahmini ($)")
    ax.set_ylabel("Ağaç sayısı")
    ax.set_title(f"100 ağacın oyları: {arg.sehir}, gelir {arg.gelir / 1000:.0f}k $, ev yaşı {arg.yas:.0f}",
                 fontsize=13, weight="bold")
    ax.legend()
    ax.grid(alpha=0.3)
    yol = KOK / "gorseller" / f"14_tahmin_{arg.sehir}.png"
    fig.savefig(yol, dpi=90, bbox_inches="tight")
    print("Grafik ->", yol.relative_to(KOK))
