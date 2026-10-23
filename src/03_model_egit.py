"""AŞAMA 5 — Model eğit ve karşılaştır.

3 model: Lineer Regresyon, Karar Ağacı, Random Forest.
A) Eğitim verisinde RMSE     -> "ezber notu"
B) 5 katlı cross-validation  -> "gerçek not" (modelin görmediği parçada)
C) Ormanı ağaç ağaç büyüt    -> ağaç sayısı arttıkça hata nasıl düşüyor?

Çalıştırma:  python src/03_model_egit.py
İzleme:      tail -f loglar/egitim.log
Çıktılar:    modeller/sonuclar.json, gorseller/08_*.png, gorseller/09_*.png
"""
import json
import time
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import root_mean_squared_error
from sklearn.model_selection import KFold
from sklearn.tree import DecisionTreeRegressor

from hazirlik import HEDEF, donustur, ogren, yeni_sutunlar_ekle

KOK = Path(__file__).resolve().parent.parent
GORSEL = KOK / "gorseller"
(KOK / "loglar").mkdir(exist_ok=True)
LOG = open(KOK / "loglar" / "egitim.log", "w", encoding="utf-8")
BASLANGIC = time.time()


def log(mesaj):
    """Hem ekrana hem log dosyasına yaz (tail -f ile canlı izlenebilsin)."""
    satir = f"[{time.time() - BASLANGIC:6.1f} sn] {mesaj}"
    print(satir, flush=True)
    LOG.write(satir + "\n")
    LOG.flush()


# ---------------------------------------------------------------
# Veriyi yükle ve hazırla (Aşama 4'teki aletlerle)
# ---------------------------------------------------------------
egitim = pd.read_csv(KOK / "data" / "hazir" / "egitim.csv")
y = egitim[HEDEF]
X = yeni_sutunlar_ekle(egitim.drop(columns=HEDEF))
X_hazir = donustur(X, ogren(X))
log(f"Veri hazır: {X_hazir.shape[0]} satır × {X_hazir.shape[1]} sütun")


def modeller():
    """Her çağrıda sıfır, eğitilmemiş modeller döndürür."""
    return {
        "Lineer Regresyon": LinearRegression(),
        "Karar Ağacı": DecisionTreeRegressor(random_state=42),
        "Random Forest": RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1),
    }


# ---------------------------------------------------------------
# A) Eğitim verisinde ölç: model.fit(X, y) -> model.predict(X)
# ---------------------------------------------------------------
log("=== A) Eğitim verisinde RMSE (ezber notu) ===")
egitim_rmse = {}
for ad, model in modeller().items():
    t0 = time.time()
    model.fit(X_hazir, y)                 # ÖĞREN: X'e bakıp y'yi tahmin etmeyi öğren
    tahmin = model.predict(X_hazir)       # TAHMİN ET: aynı X için fiyat söyle
    egitim_rmse[ad] = root_mean_squared_error(y, tahmin)
    log(f"{ad:<17} RMSE = {egitim_rmse[ad]:>9,.0f} $   ({time.time() - t0:.1f} sn)")

# ---------------------------------------------------------------
# B) Cross-validation: eğitim setini 5 parçaya böl.
# Her turda 4 parçayla eğit, görmediği 1 parçada ölç. 5 tur.
# Hazırlayıcı da her turda SADECE o turun eğitim parçasından öğrenir (sızıntı yok).
# ---------------------------------------------------------------
log("=== B) 5 katlı cross-validation (gerçek not) ===")
katlar = KFold(n_splits=5, shuffle=True, random_state=42)
cv_rmse = {ad: [] for ad in egitim_rmse}
for tur, (egt_idx, dgr_idx) in enumerate(katlar.split(X), start=1):
    X_egt, X_dgr = X.iloc[egt_idx], X.iloc[dgr_idx]
    y_egt, y_dgr = y.iloc[egt_idx], y.iloc[dgr_idx]
    parcalar = ogren(X_egt)
    X_egt, X_dgr = donustur(X_egt, parcalar), donustur(X_dgr, parcalar)
    for ad, model in modeller().items():
        model.fit(X_egt, y_egt)
        cv_rmse[ad].append(root_mean_squared_error(y_dgr, model.predict(X_dgr)))
        log(f"Tur {tur}/5  {ad:<17} RMSE = {cv_rmse[ad][-1]:>9,.0f} $")

log("--- Özet ---")
for ad in egitim_rmse:
    log(f"{ad:<17} eğitim = {egitim_rmse[ad]:>9,.0f} $  |  CV = {np.mean(cv_rmse[ad]):>9,.0f} $ "
        f"± {np.std(cv_rmse[ad]):,.0f}")

# Görsel: ezber notu vs gerçek not
fig, ax = plt.subplots(figsize=(11, 6))
adlar = list(egitim_rmse)
x = np.arange(len(adlar))
b1 = ax.bar(x - 0.2, [egitim_rmse[a] for a in adlar], 0.4, color="#adb5bd", label="Eğitim verisinde (ezber notu)")
b2 = ax.bar(x + 0.2, [np.mean(cv_rmse[a]) for a in adlar], 0.4, color="#d63384",
            yerr=[np.std(cv_rmse[a]) for a in adlar], capsize=6, label="Cross-validation (gerçek not)")
for cubuklar in (b1, b2):
    for c in cubuklar:
        ax.text(c.get_x() + c.get_width() / 2, c.get_height() + 1500, f"{c.get_height():,.0f} $",
                ha="center", fontsize=11, weight="bold")
ax.set_xticks(x, adlar, fontsize=12)
ax.set_ylabel("RMSE ($) — düşük = iyi")
ax.set_title("Ezber notu vs gerçek not: hangi model gerçekten öğrendi?", fontsize=14, weight="bold")
ax.legend(fontsize=11)
ax.grid(axis="y", alpha=0.3)
fig.savefig(GORSEL / "08_ezber_vs_gercek.png", dpi=90, bbox_inches="tight")
plt.close(fig)

# ---------------------------------------------------------------
# C) Ormanı ağaç ağaç büyüt: warm_start=True -> eski ağaçları koru, yenilerini ekle.
# oob_score: her ağaç verinin ~%37'sini hiç görmez; o "torba dışı" satırlarda ölçülür.
# 20'den az ağaçta bazı satırlar hiçbir ağacın dışında kalmaz -> ölçüm güvenilmez, o yüzden 20'den başlıyoruz.
# ---------------------------------------------------------------
log("=== C) Orman büyüyor (ağaç sayısı vs hata) ===")
orman = RandomForestRegressor(warm_start=True, oob_score=True, random_state=42, n_jobs=-1)
agac_sayilari, oob_rmse = [], []
for n in [20, 30, 50, 75, 100, 150, 200, 300]:
    orman.set_params(n_estimators=n)
    orman.fit(X_hazir, y)
    agac_sayilari.append(n)
    oob_rmse.append(root_mean_squared_error(y, orman.oob_prediction_))
    log(f"{n:>3} ağaç -> torba dışı RMSE = {oob_rmse[-1]:,.0f} $")

fig, ax = plt.subplots(figsize=(10, 5.5))
ax.plot(agac_sayilari, oob_rmse, "o-", color="#198754", lw=2.5, ms=8)
for n, r in zip(agac_sayilari, oob_rmse):
    ax.annotate(f"{r / 1000:.1f}k", (n, r), textcoords="offset points", xytext=(0, 10), ha="center")
ax.set_xlabel("Ormandaki ağaç sayısı")
ax.set_ylabel("Görülmemiş veride RMSE ($)")
ax.set_title("Kalabalığın bilgeliği: ağaç eklendikçe hata düşer, sonra düzleşir", fontsize=14, weight="bold")
ax.grid(alpha=0.3)
fig.savefig(GORSEL / "09_orman_buyurken.png", dpi=90, bbox_inches="tight")
plt.close(fig)

# Hangi özellikler önemli?
onem = pd.Series(orman.feature_importances_, index=X_hazir.columns).sort_values()
log("En önemli 5 özellik: " + ", ".join(f"{k} ({v:.2f})" for k, v in onem.tail(5)[::-1].items()))

sonuclar = {
    "egitim_rmse": egitim_rmse,
    "cv_rmse_ortalama": {a: float(np.mean(v)) for a, v in cv_rmse.items()},
    "cv_rmse_turlar": cv_rmse,
    "orman_buyurken": dict(zip(agac_sayilari, oob_rmse)),
    "ozellik_onemi": onem[::-1].round(4).to_dict(),
}
(KOK / "modeller" / "sonuclar.json").write_text(json.dumps(sonuclar, indent=2, ensure_ascii=False))
log("BİTTİ ✅  -> modeller/sonuclar.json")
