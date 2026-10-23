"""AŞAMA 4 — Veriyi hazırla.

Ham tablo -> modelin yiyebileceği temiz sayı tablosu.

Çalıştırma:  python src/02_veriyi_hazirla.py
Çıktılar:    modeller/hazirlayici.joblib  (öğrenilmiş doldurucu + ölçekleyici + kodlayıcı)
             gorseller/05_*.png, 06_*.png, 07_*.png
"""
from pathlib import Path

import joblib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

from hazirlik import HEDEF, donustur, ogren, yeni_sutunlar_ekle

KOK = Path(__file__).resolve().parent.parent
GORSEL = KOK / "gorseller"
pd.set_option("display.width", 200)

egitim = pd.read_csv(KOK / "data" / "hazir" / "egitim.csv")

# ---------------------------------------------------------------
# 4.1  X ve y'yi ayır
# y = cevap anahtarı. X'in içinde kalırsa model kopya çeker.
# ---------------------------------------------------------------
y = egitim[HEDEF]
X = egitim.drop(columns=HEDEF)
print("X:", X.shape, "| y:", y.shape)

# ---------------------------------------------------------------
# 4.2  Yeni sütunlar üret (feature engineering)
# ---------------------------------------------------------------
X = yeni_sutunlar_ekle(X)
korelasyon = X.drop(columns="ocean_proximity").corrwith(y).sort_values()
print("\nHedefle korelasyon:\n", korelasyon.round(3).to_string())

renkler = ["#198754" if c in ("oda_kisi_basi", "yatak_orani", "kisi_hane_basi") else "#adb5bd"
           for c in korelasyon.index]
fig, ax = plt.subplots(figsize=(10, 6))
ax.barh(korelasyon.index, korelasyon.values, color=renkler)
ax.axvline(0, color="black", lw=0.8)
for i, v in enumerate(korelasyon.values):
    ax.text(v + (0.01 if v >= 0 else -0.01), i, f"{v:+.2f}", va="center",
            ha="left" if v >= 0 else "right", fontsize=10)
ax.set_title("Her sütunun ev fiyatıyla korelasyonu\n(yeşil = bizim ürettiğimiz yeni sütunlar)",
             fontsize=13, weight="bold")
ax.set_xlim(-0.4, 0.8)
ax.grid(axis="x", alpha=0.3)
fig.savefig(GORSEL / "05_yeni_sutunlar_korelasyon.png", dpi=90, bbox_inches="tight")
plt.close(fig)

# ---------------------------------------------------------------
# 4.3  Doldurucu, ölçekleyici, kodlayıcıyı SADECE eğitimden öğren
# ---------------------------------------------------------------
parcalar = ogren(X)
medyanlar = dict(zip(parcalar["sayisal_sutunlar"], parcalar["doldurucu"].statistics_))
print("\nÖğrenilen medyan (total_bedrooms):", medyanlar["total_bedrooms"])
print("Öğrenilen kategoriler:", list(parcalar["kodlayici"].categories_[0]))

# ---------------------------------------------------------------
# 4.4  Dönüştür ve sonuca bak
# ---------------------------------------------------------------
X_hazir = donustur(X, parcalar)
print("\nHazır tablo:", X_hazir.shape, "| boş hücre:", int(X_hazir.isna().sum().sum()))
print(X_hazir.head(3).round(2).to_string())

# Görsel: one-hot önce / sonra
ornek = X[["ocean_proximity"]].head(6)
onehot = X_hazir.filter(like="ocean_proximity_").head(6).astype(int)
onehot.columns = [c.replace("ocean_proximity_", "") for c in onehot.columns]
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 3.6), gridspec_kw={"width_ratios": [1, 3]})
for ax in (ax1, ax2):
    ax.axis("off")
t1 = ax1.table(cellText=ornek.values, colLabels=["ocean_proximity"], loc="center", cellLoc="center")
t2 = ax2.table(cellText=onehot.values, colLabels=onehot.columns, loc="center", cellLoc="center")
for t in (t1, t2):
    t.scale(1, 1.8)
    t.set_fontsize(12)
for (r, c), hucre in t2.get_celld().items():
    if r > 0 and hucre.get_text().get_text() == "1":
        hucre.set_facecolor("#d1e7dd")
        hucre.get_text().set_weight("bold")
ax1.set_title("ÖNCE: 1 yazı sütunu", fontsize=13, weight="bold")
ax2.set_title("SONRA: 5 tane 0/1 sütunu (one-hot)", fontsize=13, weight="bold")
fig.savefig(GORSEL / "06_one_hot.png", dpi=90, bbox_inches="tight")
plt.close(fig)

# Görsel: ölçekleme önce / sonra
fig, axes = plt.subplots(2, 2, figsize=(12, 7))
for j, sutun in enumerate(["median_income", "total_rooms"]):
    axes[0, j].hist(X[sutun], bins=50, color="#0d6efd")
    axes[0, j].set_title(f"ÖNCE: {sutun}\n{X[sutun].min():.0f} … {X[sutun].max():.0f}", fontsize=11)
    axes[1, j].hist(X_hazir[sutun], bins=50, color="#198754")
    axes[1, j].set_title(f"SONRA: {sutun}\n{X_hazir[sutun].min():.1f} … {X_hazir[sutun].max():.1f}",
                         fontsize=11)
    axes[1, j].axvline(0, color="red", ls="--")
for ax in axes.flat:
    ax.grid(alpha=0.3)
fig.suptitle("Standart ölçekleme: herkes ortalama 0, standart sapma 1 etrafına toplanır",
             fontsize=14, weight="bold")
fig.tight_layout()
fig.savefig(GORSEL / "07_olcekleme.png", dpi=90)
plt.close(fig)

# ---------------------------------------------------------------
# 4.5  Öğrenilen parçaları kaydet (test ve yeni veride AYNEN kullanılacak)
# ---------------------------------------------------------------
(KOK / "modeller").mkdir(exist_ok=True)
joblib.dump(parcalar, KOK / "modeller" / "hazirlayici.joblib")
print("\nKaydedildi -> modeller/hazirlayici.joblib")
