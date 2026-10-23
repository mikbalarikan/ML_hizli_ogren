"""AŞAMA 6 — İnce ayar (Grid Search).

Random Forest'ın 2 düğmesini dene:
  max_features     : her soruda (dallanmada) kaç sütuna bakılsın      -> 3 seçenek
  min_samples_leaf : bir yaprakta en az kaç mahalle olsun             -> 4 seçenek
3 × 4 = 12 kombinasyon × 5 katlı CV = 60 eğitim (+1: kazananı tüm veriyle yeniden eğitme)

Çalıştırma:  python -u src/04_ince_ayar.py | tee loglar/ince_ayar.log
Çıktılar:    modeller/en_iyi_model.joblib, gorseller/10_*.png, gorseller/11_*.png
"""
import json
import time
from pathlib import Path

import joblib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import root_mean_squared_error
from sklearn.model_selection import GridSearchCV, KFold
from sklearn.pipeline import Pipeline

from hazirlik import HEDEF, Hazirlayici

KOK = Path(__file__).resolve().parent.parent
GORSEL = KOK / "gorseller"
BASLANGIC = time.time()

egitim = pd.read_csv(KOK / "data" / "hazir" / "egitim.csv")
y = egitim[HEDEF]
X = egitim.drop(columns=HEDEF)        # HAM X: hazırlığı artık Pipeline yapıyor

# ---------------------------------------------------------------
# ADIM 1: Pipeline = hazırlayıcı + model tek bir makinede
# fit()    -> önce hazırlayıcı öğrenir ve dönüştürür, sonra model öğrenir
# predict()-> önce hazırlayıcı dönüştürür, sonra model tahmin eder
# ---------------------------------------------------------------
makine = Pipeline([
    ("hazirla", Hazirlayici()),
    ("model", RandomForestRegressor(n_estimators=100, random_state=42)),
])

# ---------------------------------------------------------------
# ADIM 2: Denenecek düğme değerleri ("model__" -> Pipeline'daki "model" adımının düğmesi)
# ---------------------------------------------------------------
izgara = {
    "model__max_features": [4, 8, 16],
    "model__min_samples_leaf": [1, 3, 10, 30],
}

# ---------------------------------------------------------------
# ADIM 3: Grid Search: her kombinasyon için 5 katlı CV yap, en iyisini seç
# n_jobs=-1 -> 4 CPU'nun hepsiyle paralel çalış
# verbose=3 -> her eğitim bitince bir satır yaz (canlı izleme)
# ---------------------------------------------------------------
arama = GridSearchCV(
    makine, izgara,
    cv=KFold(n_splits=5, shuffle=True, random_state=42),
    scoring="neg_root_mean_squared_error",   # sklearn "büyük = iyi" ister, o yüzden eksi RMSE
    return_train_score=True,
    n_jobs=-1, verbose=3,
)
print(f"Başlıyor: {len(izgara['model__max_features']) * len(izgara['model__min_samples_leaf'])} "
      "kombinasyon × 5 kat = 60 eğitim", flush=True)
arama.fit(X, y)
sure = time.time() - BASLANGIC
print(f"\nBİTTİ: {sure:.0f} sn ({sure / 60:.1f} dk)", flush=True)

# ---------------------------------------------------------------
# ADIM 4: Sonuçları tabloya dök
# ---------------------------------------------------------------
sonuc = pd.DataFrame(arama.cv_results_)
tablo = pd.DataFrame({
    "max_features": sonuc["param_model__max_features"],
    "min_samples_leaf": sonuc["param_model__min_samples_leaf"],
    "egitim_rmse": -sonuc["mean_train_score"],
    "cv_rmse": -sonuc["mean_test_score"],
    "sure_sn": sonuc["mean_fit_time"],
}).sort_values("cv_rmse")
print("\nSıralama (en iyi üstte):\n", tablo.round(0).to_string(index=False))
print("\nEN İYİ AYAR:", arama.best_params_, f"-> CV RMSE = {-arama.best_score_:,.0f} $")

# Görsel 1: ısı haritası
isi = tablo.pivot(index="min_samples_leaf", columns="max_features", values="cv_rmse")
fig, ax = plt.subplots(figsize=(8, 6))
im = ax.imshow(isi.values, cmap="RdYlGn_r")
ax.set_xticks(range(len(isi.columns)), isi.columns)
ax.set_yticks(range(len(isi.index)), isi.index)
for i in range(isi.shape[0]):
    for j in range(isi.shape[1]):
        deger = isi.values[i, j]
        en_iyi = deger == isi.values.min()
        ax.text(j, i, f"{deger / 1000:.1f}k" + ("\n★ en iyi" if en_iyi else ""), ha="center", va="center",
                fontsize=13, weight="bold" if en_iyi else "normal")
ax.set_xlabel("max_features (her soruda bakılan sütun sayısı)")
ax.set_ylabel("min_samples_leaf (yapraktaki en az mahalle)")
ax.set_title("Grid Search: 12 kombinasyonun CV RMSE'si\n(yeşil = iyi, kırmızı = kötü)", fontsize=13, weight="bold")
fig.colorbar(im, ax=ax, label="CV RMSE ($)")
fig.savefig(GORSEL / "10_grid_search_isi_haritasi.png", dpi=90, bbox_inches="tight")
plt.close(fig)

# Görsel 2: ezber farkı nasıl kapanıyor? (en iyi max_features için)
en_iyi_mf = arama.best_params_["model__max_features"]
dilim = tablo[tablo["max_features"] == en_iyi_mf].sort_values("min_samples_leaf")
fig, ax = plt.subplots(figsize=(10, 5.5))
x = dilim["min_samples_leaf"].astype(str)
ax.plot(x, dilim["egitim_rmse"], "o-", color="#adb5bd", lw=2.5, ms=9, label="Eğitimde (ezber notu)")
ax.plot(x, dilim["cv_rmse"], "o-", color="#d63384", lw=2.5, ms=9, label="CV (gerçek not)")
for xi, e, c in zip(x, dilim["egitim_rmse"], dilim["cv_rmse"]):
    ax.annotate("", xy=(xi, c), xytext=(xi, e), arrowprops=dict(arrowstyle="<->", color="#6c757d"))
    ax.text(xi, (e + c) / 2, f"  fark\n  {(c - e) / 1000:.0f}k", va="center", fontsize=10, color="#6c757d")
ax.set_xlabel("min_samples_leaf")
ax.set_ylabel("RMSE ($)")
ax.set_title(f"Yaprak büyüdükçe ezber azalır (max_features={en_iyi_mf})", fontsize=13, weight="bold")
ax.legend()
ax.grid(alpha=0.3)
fig.savefig(GORSEL / "11_ezber_farki.png", dpi=90, bbox_inches="tight")
plt.close(fig)

# ---------------------------------------------------------------
# ADIM 5: Kazananı kaydet (GridSearchCV onu zaten tüm eğitim verisiyle yeniden eğitti)
# ---------------------------------------------------------------
en_iyi = arama.best_estimator_
egitim_rmse = root_mean_squared_error(y, en_iyi.predict(X))
print(f"Kazananın eğitim RMSE'si: {egitim_rmse:,.0f} $")
joblib.dump(en_iyi, KOK / "modeller" / "en_iyi_model.joblib", compress=3)

(KOK / "modeller" / "ince_ayar_sonuclari.json").write_text(json.dumps({
    "en_iyi_ayar": {k.replace("model__", ""): int(v) for k, v in arama.best_params_.items()},
    "en_iyi_cv_rmse": float(-arama.best_score_),
    "en_iyi_egitim_rmse": float(egitim_rmse),
    "toplam_sure_sn": round(sure),
    "tum_kombinasyonlar": tablo.round(0).to_dict(orient="records"),
}, indent=2, ensure_ascii=False))
print("Kaydedildi -> modeller/en_iyi_model.joblib, modeller/ince_ayar_sonuclari.json")
