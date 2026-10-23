"""Veri hazırlama araçları (Aşama 4).

Diğer dosyalar buradan import eder:
    from hazirlik import yeni_sutunlar_ekle, ogren, donustur

Altın kural: ogren() SADECE eğitim verisiyle çağrılır.
donustur() ise eğitim, test ve yeni gelen her veriye aynı şekilde uygulanır.

Hazirlayici sınıfı bu üç fonksiyonu tek bir sklearn kutusuna koyar (Aşama 6+).
"""
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

HEDEF = "median_house_value"
KATEGORIK = ["ocean_proximity"]


def yeni_sutunlar_ekle(X):
    """Oranlardan yeni, daha anlamlı sütunlar üretir."""
    X = X.copy()                                               # orijinali bozma
    X["oda_kisi_basi"] = X["total_rooms"] / X["population"]    # senin fikrin (S9)
    X["yatak_orani"] = X["total_bedrooms"] / X["total_rooms"]  # odaların ne kadarı yatak odası
    X["kisi_hane_basi"] = X["population"] / X["households"]    # hane büyüklüğü
    return X


def ogren(X_egitim):
    """Doldurucu, ölçekleyici ve kodlayıcıyı EĞİTİM verisinden öğrenir."""
    sayisal = X_egitim.drop(columns=KATEGORIK)

    doldurucu = SimpleImputer(strategy="median").fit(sayisal)
    olcekleyici = StandardScaler().fit(doldurucu.transform(sayisal))
    kodlayici = OneHotEncoder(handle_unknown="ignore").fit(X_egitim[KATEGORIK])

    return {"doldurucu": doldurucu, "olcekleyici": olcekleyici, "kodlayici": kodlayici,
            "sayisal_sutunlar": list(sayisal.columns)}


def donustur(X, parcalar):
    """Öğrenilmiş parçaları kullanarak X'i modele hazır sayı tablosuna çevirir."""
    sayisal = X[parcalar["sayisal_sutunlar"]]
    sayisal = parcalar["doldurucu"].transform(sayisal)      # 1) boşlukları doldur
    sayisal = parcalar["olcekleyici"].transform(sayisal)    # 2) ölçekle

    kodlayici = parcalar["kodlayici"]
    kategorik = kodlayici.transform(X[KATEGORIK]).toarray()  # 3) one-hot

    return pd.DataFrame(                                     # 4) yan yana yapıştır
        data=np.hstack([sayisal, kategorik]),
        columns=parcalar["sayisal_sutunlar"] + list(kodlayici.get_feature_names_out()),
        index=X.index,
    )


class Hazirlayici(BaseEstimator, TransformerMixin):
    """yeni_sutunlar_ekle + ogren + donustur'u tek kutuda toplar.

    sklearn'ün fit/transform kalıbına uyduğu için Pipeline ve GridSearchCV içinde
    kullanılabilir: cross-validation'ın her turunda fit() o turun eğitim parçasıyla
    yeniden çağrılır, yani sızıntı olmaz.
    """

    def fit(self, X, y=None):
        self.parcalar_ = ogren(yeni_sutunlar_ekle(X))
        return self

    def transform(self, X):
        return donustur(yeni_sutunlar_ekle(X), self.parcalar_)
