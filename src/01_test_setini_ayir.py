"""AŞAMA 3 — Test setini ayır.

Amaç: verinin %20'sini "kasaya kilitle". Model eğitimi bitene kadar ona bakmayacağız.
Gelir en önemli özellik olduğu için, test setinde her gelir grubu
tüm verideki ORANIYLA bulunsun (tabakalı / stratified örnekleme).

Çalıştırma:  python src/01_test_setini_ayir.py
Çıktılar:    data/hazir/egitim.csv, data/hazir/test.csv
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
# ADIM 2: Gelir grupları (kümeler) oluştur
# pd.cut -> sayıları aralıklara göre etiketler: 2.1 -> "2", 7.3 -> "5"
# ---------------------------------------------------------------
sinirlar = [0, 1.5, 3, 4.5, 6, np.inf]          # ×10.000 $
etiketler = ["1\n<15k$", "2\n15-30k$", "3\n30-45k$", "4\n45-60k$", "5\n60k$+"]
df["gelir_grubu"] = pd.cut(df["median_income"], bins=sinirlar, labels=etiketler)

# ---------------------------------------------------------------
# ADIM 3: İki yöntemle ayır ve karşılaştır
# random_state -> karıştırma zarının tohumu: aynı sayı = her seferinde aynı bölünme
# stratify     -> "her gruptan aynı oranda al" (anketçinin yöntemi)
# ---------------------------------------------------------------
_, rastgele_test = train_test_split(df, test_size=0.2, random_state=7)
egitim, test = train_test_split(df, test_size=0.2, random_state=7, stratify=df["gelir_grubu"])
print("Eğitim:", len(egitim), "| Test:", len(test))


def gelir_yuzdeleri(tablo):
    return tablo["gelir_grubu"].value_counts(normalize=True).sort_index() * 100


karsilastirma = pd.DataFrame({
    "Tüm veri %": gelir_yuzdeleri(df),
    "Rastgele test %": gelir_yuzdeleri(rastgele_test),
    "Tabakalı test %": gelir_yuzdeleri(test),
})
karsilastirma["Rastgele hata %"] = (karsilastirma["Rastgele test %"] / karsilastirma["Tüm veri %"] - 1) * 100
karsilastirma["Tabakalı hata %"] = (karsilastirma["Tabakalı test %"] / karsilastirma["Tüm veri %"] - 1) * 100
print(karsilastirma.round(2).to_string())

ax = karsilastirma[["Tüm veri %", "Rastgele test %", "Tabakalı test %"]].plot.bar(
    figsize=(11, 6), color=["#0d6efd", "#d63384", "#198754"], rot=0, width=0.8)
for i in range(len(karsilastirma)):
    tepe = karsilastirma.iloc[i, :3].max()
    r, t = karsilastirma.iloc[i]["Rastgele hata %"], karsilastirma.iloc[i]["Tabakalı hata %"]
    ax.text(i, tepe + 1.0, f"rastgele {r:+.1f}%", ha="center", fontsize=9.5,
            color="red" if abs(r) > 5 else "#d63384", weight="bold")
    ax.text(i, tepe + 2.6, f"tabakalı {t:+.1f}%", ha="center", fontsize=9.5, color="#198754", weight="bold")
ax.set_ylim(0, 42)
ax.set_title("Gelir gruplarının oranı: rastgele vs TABAKALI ayırma", fontsize=14, weight="bold")
ax.set_xlabel("Gelir grubu")
ax.set_ylabel("% (mahallelerin oranı)")
ax.grid(axis="y", alpha=0.3)
plt.savefig(KOK / "gorseller" / "04_rastgele_vs_tabakali.png", dpi=90, bbox_inches="tight")

# ---------------------------------------------------------------
# ADIM 4: Yardımcı sütunu sil ve iki dosyayı kaydet
# gelir_grubu sadece ayırmak içindi, modele lazım değil.
# ---------------------------------------------------------------
cikti = KOK / "data" / "hazir"
cikti.mkdir(exist_ok=True)
egitim.drop(columns="gelir_grubu").to_csv(cikti / "egitim.csv", index=False)
test.drop(columns="gelir_grubu").to_csv(cikti / "test.csv", index=False)
print("Kaydedildi ->", cikti / "egitim.csv", "ve", cikti / "test.csv")
