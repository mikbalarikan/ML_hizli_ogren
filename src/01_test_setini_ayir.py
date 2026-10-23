"""AŞAMA 3 — Test setini ayır.

Amaç: verinin %20'sini "kasaya kilitle". Model eğitimi bitene kadar ona bakmayacağız.

Çalıştırma:  python src/01_test_setini_ayir.py
"""
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

KOK = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------
# ADIM 1: Veriyi oku
# pd.read_csv -> CSV dosyasını bir "DataFrame"e (Excel tablosu gibi) çevirir.
# ---------------------------------------------------------------
df = pd.read_csv(KOK / "data" / "housing" / "housing.csv")
print("Toplam satır:", len(df))

# ---------------------------------------------------------------
# ADIM 2: Rastgele ayır (%80 eğitim, %20 test)
# test_size=0.2     -> %20 test
# random_state=7    -> "zar"ın tohumu: her çalıştırmada AYNI bölünme olsun
# ---------------------------------------------------------------
egitim, test = train_test_split(df, test_size=0.2, random_state=7)
print("Eğitim:", len(egitim), "| Test:", len(test))

# ---------------------------------------------------------------
# ADIM 3: Kontrol et — test seti, bütün veriyi iyi temsil ediyor mu?
# Geliri 5 gruba (kategori) bölüp her grubun yüzdesine bakıyoruz.
# ---------------------------------------------------------------
sinirlar = [0, 1.5, 3, 4.5, 6, np.inf]          # ×10.000 $
etiketler = ["1\n<15k$", "2\n15-30k$", "3\n30-45k$", "4\n45-60k$", "5\n60k$+"]


def gelir_yuzdeleri(tablo):
    gruplar = pd.cut(tablo["median_income"], bins=sinirlar, labels=etiketler)
    return gruplar.value_counts(normalize=True).sort_index() * 100


karsilastirma = pd.DataFrame({
    "Tüm veri %": gelir_yuzdeleri(df),
    "Rastgele test %": gelir_yuzdeleri(test),
})
karsilastirma["Hata %"] = (karsilastirma["Rastgele test %"] / karsilastirma["Tüm veri %"] - 1) * 100
print(karsilastirma.round(1).to_string())

ax = karsilastirma[["Tüm veri %", "Rastgele test %"]].plot.bar(
    figsize=(10, 6), color=["#0d6efd", "#d63384"], rot=0)
for i, hata in enumerate(karsilastirma["Hata %"]):
    ax.text(i, karsilastirma.iloc[i, :2].max() + 0.8, f"{hata:+.1f}%", ha="center",
            fontsize=11, weight="bold", color="red" if abs(hata) > 5 else "black")
ax.set_title("Gelir gruplarının oranı: tüm veri vs RASTGELE test seti", fontsize=14, weight="bold")
ax.set_xlabel("Gelir grubu")
ax.set_ylabel("% (mahallelerin oranı)")
ax.grid(axis="y", alpha=0.3)
plt.savefig(KOK / "gorseller" / "04_rastgele_ayirma_sorunu.png", dpi=90, bbox_inches="tight")
