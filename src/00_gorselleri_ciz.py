"""Ders görsellerini üretir: büyük harita + veriyi tanıma grafikleri.

Çalıştırma:  python src/00_gorselleri_ciz.py
Çıktılar:    gorseller/*.png
"""
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
import pandas as pd

KOK = Path(__file__).resolve().parent.parent
CIKTI = KOK / "gorseller"
CIKTI.mkdir(exist_ok=True)


def buyuk_harita():
    asamalar = [
        ("0", "Büyük resim", "Ne tahmin ediyoruz?\nBaşarıyı nasıl ölçeriz?", "#6c757d"),
        ("1", "Veriyi al", "housing.csv\n20.640 satır × 10 sütun", "#0d6efd"),
        ("2", "Veriyi keşfet", "Grafikler, korelasyon,\neksik değerler", "#0d6efd"),
        ("3", "Test setini ayır", "%80 eğitim / %20 test\n(teste dokunma!)", "#6f42c1"),
        ("4", "Veriyi hazırla", "Eksikleri doldur, yazıyı\nsayıya çevir, ölçekle", "#6f42c1"),
        ("5", "Model eğit", "Lineer Regresyon\nKarar Ağacı, Random Forest", "#d63384"),
        ("6", "İnce ayar", "Cross-validation\nGrid Search", "#d63384"),
        ("7", "Test et & sun", "Final RMSE\nhata analizi", "#198754"),
        ("8", "Kaydet & kullan", "model.pkl\nyeni eve fiyat tahmini", "#198754"),
    ]
    fig, ax = plt.subplots(figsize=(16, 7.5))
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 7.5)
    ax.axis("off")
    ax.text(8, 7.05, "PROJE HARİTASI — Kaliforniya Ev Fiyatı Tahmini",
            ha="center", fontsize=20, weight="bold")
    ax.text(8, 6.6, "Kaynak: github.com/ageron/handson-ml3  ·  Bölüm 2: Uçtan Uca ML Projesi",
            ha="center", fontsize=11, color="#555")

    # 2 satır: üstte 0-4, altta 5-8 (yılan şeklinde akış)
    konumlar = [(0.4 + i * 3.1, 4.2) for i in range(5)] + \
               [(0.4 + (4 - i) * 3.1, 1.1) for i in range(4)]
    w, h = 2.7, 1.9
    for (no, baslik, alt, renk), (x, y) in zip(asamalar, konumlar):
        ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.05,rounding_size=0.2",
                                    fc=renk, ec="none", alpha=0.92))
        ax.text(x + 0.22, y + h - 0.35, no, fontsize=22, weight="bold", color="white", va="center")
        ax.text(x + w / 2 + 0.2, y + h - 0.38, baslik, fontsize=13, weight="bold",
                color="white", ha="center", va="center")
        ax.text(x + w / 2, y + 0.65, alt, fontsize=10.5, color="white", ha="center", va="center")

    ok = dict(arrowstyle="-|>", lw=2.2, color="#333", mutation_scale=18)
    for i in range(4):  # üst satır oklar
        x, y = konumlar[i]
        ax.annotate("", xy=(x + w + 0.4, y + h / 2), xytext=(x + w + 0.02, y + h / 2), arrowprops=ok)
    x4, y4 = konumlar[4]
    x5, y5 = konumlar[5]
    ax.annotate("", xy=(x5 + w / 2, y5 + h + 0.05), xytext=(x4 + w / 2, y4 - 0.05),
                arrowprops=ok)
    for i in range(5, 8):  # alt satır oklar (sağdan sola)
        x, y = konumlar[i]
        ax.annotate("", xy=(x - 0.4, y + h / 2), xytext=(x - 0.02, y + h / 2), arrowprops=ok)

    lejant = [("#0d6efd", "Veri"), ("#6f42c1", "Hazırlık"), ("#d63384", "Modelleme"), ("#198754", "Sonuç")]
    for i, (renk, ad) in enumerate(lejant):
        ax.add_patch(FancyBboxPatch((0.5 + i * 2.2, 0.2), 0.35, 0.35, boxstyle="round,pad=0.02", fc=renk, ec="none"))
        ax.text(1.0 + i * 2.2, 0.37, ad, fontsize=11, va="center")
    ax.text(15.6, 0.37, "Biz şu an buradayız → 1 ve 2", fontsize=11, ha="right",
            va="center", color="#0d6efd", weight="bold")
    fig.savefig(CIKTI / "00_buyuk_harita.png", dpi=110, bbox_inches="tight")
    plt.close(fig)


def veri_grafikleri():
    df = pd.read_csv(KOK / "data" / "housing" / "housing.csv")

    # 1) Her sayısal sütunun histogramı
    turkce = {
        "longitude": "boylam", "latitude": "enlem", "housing_median_age": "ev yaşı (medyan)",
        "total_rooms": "toplam oda", "total_bedrooms": "toplam yatak odası",
        "population": "nüfus", "households": "hane sayısı",
        "median_income": "gelir (medyan, ×10.000$)", "median_house_value": "EV DEĞERİ (hedef) $",
    }
    sayisal = df.select_dtypes("number").columns
    fig, axes = plt.subplots(3, 3, figsize=(15, 11))
    for ax, sutun in zip(axes.flat, sayisal):
        renk = "#d63384" if sutun == "median_house_value" else "#0d6efd"
        ax.hist(df[sutun].dropna(), bins=50, color=renk, alpha=0.85)
        ax.set_title(f"{sutun}\n({turkce[sutun]})", fontsize=11)
        ax.grid(alpha=0.3)
    fig.suptitle("Her sütunun dağılımı (histogram: hangi değerden kaç tane var?)", fontsize=16, weight="bold")
    fig.tight_layout()
    fig.savefig(CIKTI / "01_histogramlar.png", dpi=90)
    plt.close(fig)

    # 2) Kaliforniya haritası: konum + fiyat
    fig, ax = plt.subplots(figsize=(10, 9))
    sc = ax.scatter(df["longitude"], df["latitude"], s=df["population"] / 100, c=df["median_house_value"],
                    cmap="jet", alpha=0.4)
    cb = fig.colorbar(sc, ax=ax)
    cb.set_label("Medyan ev değeri ($)")
    for ad, (lon, lat) in {"San Francisco": (-122.42, 37.77), "Los Angeles": (-118.24, 34.05),
                           "San Diego": (-117.16, 32.72), "Sacramento": (-121.49, 38.58)}.items():
        ax.annotate(ad, (lon, lat), xytext=(lon + 0.6, lat + 0.5), fontsize=11, weight="bold",
                    arrowprops=dict(arrowstyle="->", color="black"))
    ax.set_xlabel("Boylam (longitude)")
    ax.set_ylabel("Enlem (latitude)")
    ax.set_title("Her nokta = 1 mahalle (district)\nNokta büyüklüğü = nüfus · Renk = ev fiyatı",
                 fontsize=14, weight="bold")
    ax.grid(alpha=0.3)
    fig.savefig(CIKTI / "02_kaliforniya_haritasi.png", dpi=90, bbox_inches="tight")
    plt.close(fig)

    # 3) Gelir vs ev değeri (en güçlü ilişki)
    fig, ax = plt.subplots(figsize=(10, 7))
    ax.scatter(df["median_income"], df["median_house_value"], alpha=0.1, s=8, color="#6f42c1")
    ax.axhline(500_001, color="red", ls="--", lw=1.5)
    ax.text(10.3, 430_000, "500.001$ tavanı!\n(veri burada kesilmiş)", color="red", fontsize=11)
    r = df["median_income"].corr(df["median_house_value"])
    ax.set_xlabel("Medyan gelir (×10.000 $)")
    ax.set_ylabel("Medyan ev değeri ($)")
    ax.set_title(f"Gelir arttıkça ev fiyatı artıyor  (korelasyon r = {r:.2f})", fontsize=14, weight="bold")
    ax.grid(alpha=0.3)
    fig.savefig(CIKTI / "03_gelir_vs_fiyat.png", dpi=90, bbox_inches="tight")
    plt.close(fig)


if __name__ == "__main__":
    buyuk_harita()
    veri_grafikleri()
    print("Görseller hazır:", sorted(p.name for p in CIKTI.glob("*.png")))
