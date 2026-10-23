"""AŞAMA 7 — Büyük sınav: test setinde final değerlendirme + hata analizi.

Test seti Aşama 3'ten beri kilitliydi. SADECE BİR KEZ kullanılır;
sonuca bakıp geri dönüp ayar yapmak = sınav sorularına göre çalışmak (hile).

Çalıştırma:  python src/05_test_et.py   (önce src/04_ince_ayar.py çalışmış olmalı)
Çıktılar:    modeller/test_sonuclari.json, gorseller/12_*.png, gorseller/13_*.png
"""
import json
from pathlib import Path

import joblib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from scipy import stats
from sklearn.metrics import mean_absolute_error, root_mean_squared_error

from hazirlik import HEDEF

KOK = Path(__file__).resolve().parent.parent
GORSEL = KOK / "gorseller"
TAVAN = 500_001

# ---------------------------------------------------------------
# ADIM 1: Kasayı aç, modeli yükle
# ---------------------------------------------------------------
test = pd.read_csv(KOK / "data" / "hazir" / "test.csv")
y_test = test[HEDEF]
X_test = test.drop(columns=HEDEF)
makine = joblib.load(KOK / "modeller" / "en_iyi_model.joblib")   # Pipeline: hazırlık + model
print("Test seti:", len(test), "mahalle (model bunların hiçbirini görmedi)")

# ---------------------------------------------------------------
# ADIM 2: Tahmin et ve notu hesapla
# Pipeline sayesinde HAM veriyi veriyoruz; hazırlığı kendisi yapıyor.
# ---------------------------------------------------------------
tahmin = makine.predict(X_test)
rmse = root_mean_squared_error(y_test, tahmin)
mae = mean_absolute_error(y_test, tahmin)
print(f"\nTEST RMSE = {rmse:,.0f} $")
print(f"TEST MAE  = {mae:,.0f} $   (ortalama mutlak hata: 'tipik bir mahallede kaç $ yanılıyoruz')")

# ---------------------------------------------------------------
# ADIM 3: Bu not ne kadar güvenilir? %95 güven aralığı
# Başka bir 4.128 mahallelik test seti olsaydı RMSE büyük ihtimalle bu aralıkta çıkardı.
# ---------------------------------------------------------------
kare_hatalar = (tahmin - y_test) ** 2
alt, ust = np.sqrt(stats.t.interval(0.95, len(kare_hatalar) - 1,
                                    loc=kare_hatalar.mean(), scale=stats.sem(kare_hatalar)))
print(f"%95 güven aralığı: {alt:,.0f} $ … {ust:,.0f} $")

# ---------------------------------------------------------------
# ADIM 4: Hata analizi: model nerede yanılıyor?
# ---------------------------------------------------------------
analiz = X_test.assign(gercek=y_test, tahmin=tahmin, hata=tahmin - y_test)
analiz["mutlak_hata"] = analiz["hata"].abs()
analiz["fiyat_grubu"] = pd.cut(analiz["gercek"], bins=[0, 100_000, 200_000, 300_000, 400_000, 500_000, np.inf],
                               labels=["<100k", "100-200k", "200-300k", "300-400k", "400-500k", "500k tavan"])

grup_hata = analiz.groupby("fiyat_grubu", observed=True)["hata"].agg(
    adet="size", rmse=lambda h: np.sqrt((h ** 2).mean()), ortalama_sapma="mean")
bolge_hata = analiz.groupby("ocean_proximity")["hata"].agg(
    adet="size", rmse=lambda h: np.sqrt((h ** 2).mean()))
print("\nFiyat grubuna göre hata:\n", grup_hata.round(0).to_string())
print("\nBölgeye göre hata:\n", bolge_hata.round(0).to_string())

tavan_disi = analiz[analiz["gercek"] < TAVAN]
rmse_tavan_disi = root_mean_squared_error(tavan_disi["gercek"], tavan_disi["tahmin"])
print(f"\nTavan (500.001 $) mahalleleri hariç RMSE = {rmse_tavan_disi:,.0f} $ "
      f"({len(analiz) - len(tavan_disi)} mahalle çıkarıldı)")

print("\nEn kötü 5 tahmin:")
print(analiz.nlargest(5, "mutlak_hata")[["ocean_proximity", "median_income", "gercek", "tahmin", "hata"]]
      .round({"median_income": 2, "gercek": 0, "tahmin": 0, "hata": 0}).to_string())

# Görsel 1: tahmin vs gerçek
fig, ax = plt.subplots(figsize=(9, 8.5))
ax.scatter(analiz["gercek"], analiz["tahmin"], s=8, alpha=0.35, color="#6f42c1")
ax.plot([0, 520_000], [0, 520_000], "--", color="#198754", lw=2, label="Mükemmel tahmin çizgisi")
ax.axvline(TAVAN, color="red", ls=":", lw=1.5)
ax.text(TAVAN - 5_000, 30_000, "500k tavanı →\nmodel bu mahalleleri\nhep düşük tahmin ediyor", ha="right",
        color="red", fontsize=10)
ax.set_xlabel("Gerçek fiyat ($)")
ax.set_ylabel("Modelin tahmini ($)")
ax.set_title(f"Test seti: tahmin vs gerçek  (RMSE = {rmse:,.0f} $)\nÇizgiye yakın = iyi tahmin",
             fontsize=13, weight="bold")
ax.legend(loc="upper left")
ax.grid(alpha=0.3)
fig.savefig(GORSEL / "12_tahmin_vs_gercek.png", dpi=90, bbox_inches="tight")
plt.close(fig)

# Görsel 2: hata analizi
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5.5))
renk = ["#d63384" if g == "500k tavan" else "#0d6efd" for g in grup_hata.index]
ax1.bar(grup_hata.index.astype(str), grup_hata["rmse"], color=renk)
for i, (r, n) in enumerate(zip(grup_hata["rmse"], grup_hata["adet"])):
    ax1.text(i, r + 1500, f"{r / 1000:.0f}k\n({n} mah.)", ha="center", fontsize=10)
ax1.set_title("Fiyat grubuna göre hata (RMSE)", fontsize=13, weight="bold")
ax1.set_xlabel("Gerçek fiyat grubu")
ax1.set_ylabel("RMSE ($)")
ax1.grid(axis="y", alpha=0.3)
ax1.set_ylim(0, grup_hata["rmse"].max() * 1.2)

ax2.bar(bolge_hata.index, bolge_hata["rmse"], color="#198754")
for i, (r, n) in enumerate(zip(bolge_hata["rmse"], bolge_hata["adet"])):
    ax2.text(i, r + 1500, f"{r / 1000:.0f}k\n({n} mah.)", ha="center", fontsize=10)
ax2.set_title("Bölgeye göre hata (RMSE)", fontsize=13, weight="bold")
ax2.set_xlabel("ocean_proximity")
ax2.grid(axis="y", alpha=0.3)
ax2.set_ylim(0, bolge_hata["rmse"].max() * 1.25)
fig.tight_layout()
fig.savefig(GORSEL / "13_hata_analizi.png", dpi=90, bbox_inches="tight")
plt.close(fig)

(KOK / "modeller" / "test_sonuclari.json").write_text(json.dumps({
    "test_rmse": float(rmse),
    "test_mae": float(mae),
    "guven_araligi_95": [float(alt), float(ust)],
    "tavan_disi_rmse": float(rmse_tavan_disi),
    "fiyat_grubuna_gore": grup_hata.round(0).reset_index().astype({"fiyat_grubu": str}).to_dict(orient="records"),
    "bolgeye_gore": bolge_hata.round(0).reset_index().to_dict(orient="records"),
}, indent=2, ensure_ascii=False))
print("\nKaydedildi -> modeller/test_sonuclari.json")
