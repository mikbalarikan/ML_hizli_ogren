# Video senaryosu: Makine Öğrenmesi: 10 Dakikada Uçtan Uca Bir Proje

> Bu dosya `video/src/senaryo.json` dosyasından otomatik üretilir (`cd video && npm run senaryo`).
> Videodaki altyazılar ve zamanlama da aynı dosyadan gelir. Metni orada değiştir, video ve senaryo birlikte güncellenir.

**Süre:** 09:59 · **Sahne:** 11 · **Cümle:** 80 · **Kelime:** 824
**Hedef kitle:** ML'e yeni başlayan öğrenciler · **Üslup:** samimi, kısa cümleler, her bölüm bir "hap bilgi" ile biter.

## Akış

| # | Sahne | Başlangıç | Süre |
|---|---|---|---|
| 0 | Giriş | 00:00 | 33 sn |
| 1 | Büyük Harita | 00:33 | 45 sn |
| 2 | X ve y | 01:18 | 51 sn |
| 3 | Veriyi Keşfet | 02:10 | 53 sn |
| 4 | Test Setini Kilitle | 03:02 | 57 sn |
| 5 | Veriyi Hazırla | 03:59 | 70 sn |
| 6 | Model Eğit | 05:09 | 78 sn |
| 7 | İnce Ayar | 06:27 | 51 sn |
| 8 | Büyük Sınav | 07:17 | 51 sn |
| 9 | Kaydet ve Kullan | 08:09 | 53 sn |
| 10 | 7 Hap Bilgi | 09:02 | 53 sn |
| — | Kapanış | 09:55 | 4 sn |

## Seslendirme ipuçları

- Tempo: saniyede ~1,7 kelime (dakikada ~100 kelime). Sakin, anlatır gibi oku.
- Her cümle kendi zaman satırında başlar. Cümle bitince kalan süre nefes payıdır.
- **💊 Hap bilgi** cümlelerinde yavaşla ve vurgula. Bunlar videonun akılda kalacak kısmı.
- Kayıt: her sahneyi ayrı dosya olarak kaydetmek (`sahne-00.wav` … `sahne-10.wav`) kurguyu kolaylaştırır.

---

## 00:00 · Sahne 0: Giriş

**Ekranda:** Büyük başlık, soru işaretli ev ikonu, 14.4k ⭐ ve 20.640 mahalle rozetleri.

| Zaman | Anlatım (seslendirme / altyazı) |
|---|---|
| 00:00 | Bir bilgisayar, hiç görmediği bir evin fiyatını nasıl tahmin eder? |
| 00:06 | Bu videoda gerçek bir makine öğrenmesi projesini, on dakikada baştan sona kuruyoruz. |
| 00:14 | Verimiz 1990 Kaliforniya nüfus sayımı. Kaynak projemiz GitHub'da 14 bin yıldızlı handson-ml3. |
| 00:23 | Görevimiz: bir mahallenin bilgilerine bakıp, oradaki ortalama ev fiyatını tahmin etmek. |
| 00:30 | Hazırsan başlayalım. |

## 00:33 · Sahne 1: Büyük Harita

**Ekranda:** 9 aşamalı proje haritası; aşamalar renk gruplarıyla (veri, hazırlık, modelleme, sonuç) sırayla belirir.

| Zaman | Anlatım (seslendirme / altyazı) |
|---|---|
| 00:33 | *(bölüm kartı: "BÖLÜM 1 · Büyük Harita", 3 sn)* |
| 00:36 | Önce haritaya bakalım. Her makine öğrenmesi projesi aşağı yukarı aynı dokuz adımdan geçer. |
| 00:45 | Büyük resim, veriyi almak ve keşfetmek: elimizde ne var? |
| 00:51 | Test setini ayırmak ve veriyi hazırlamak: makinenin anlayacağı hale getirmek. |
| 00:58 | Model eğitmek ve ince ayar yapmak: öğretmek ve iyileştirmek. |
| 01:04 | Test etmek ve kullanmak: gerçekten işe yarıyor mu? |
| 01:10 | Sürpriz: asıl öğrenme kısmı sadece birkaç satır kod. Zamanın çoğu veriyle uğraşırken geçer. |

## 01:18 · Sahne 2: X ve y

**Ekranda:** Bir veri satırı: mavi X sütunları ve pembe y sütunu; aradaki model kutusu; 'Denetimli' ve 'Regresyon / Sınıflandırma' etiketleri.

| Zaman | Anlatım (seslendirme / altyazı) |
|---|---|
| 01:18 | *(bölüm kartı: "BÖLÜM 2 · X ve y", 3 sn)* |
| 01:21 | Makine öğrenmesinin kalbinde iki harf var: X ve y. |
| 01:28 | X, modele verdiğimiz bilgiler: konum, gelir, evlerin yaşı, oda sayısı, okyanusa yakınlık. |
| 01:36 | y ise tahmin etmek istediğimiz cevap: ev fiyatı. |
| 01:41 | Elimizde doğru cevabı bilinen binlerce örnek var. Buna denetimli öğrenme denir. |
| 01:49 | Tahmin ettiğimiz şey bir sayı olduğu için, bu bir regresyon problemi. |
| 01:56 | Ucuz mu, pahalı mı diye sorsaydık, sınıflandırma problemi olurdu. |
| 02:03 | **💊 Hap bilgi: model, X'ten y'ye giden tarifi örneklerden kendisi çıkarır.** |

## 02:10 · Sahne 3: Veriyi Keşfet

**Ekranda:** 20.640 sayacı; Kaliforniya fiyat haritası; gelir–fiyat grafiği (r = 0,69 ve 500k tavanı); üç uyarı çipi.

| Zaman | Anlatım (seslendirme / altyazı) |
|---|---|
| 02:10 | *(bölüm kartı: "BÖLÜM 3 · Veriyi Keşfet", 3 sn)* |
| 02:13 | Verimizde 20.640 mahalle ve on sütun var. |
| 02:18 | Haritada her nokta bir mahalle. Renk fiyatı gösteriyor: kıyılar kırmızı, iç bölgeler mavi. |
| 02:26 | Demek ki konum çok önemli. |
| 02:30 | Gelir ile fiyat arasında güçlü bir ilişki var: korelasyon 0,69. |
| 02:37 | Ama dikkat: fiyatlar 500 bin dolarda kesilmiş. Model bunun üstünü hiç görmeyecek. |
| 02:45 | Üç sorun daha var: 207 boş hücre, yazıyla dolu bir sütun ve birbirinden çok farklı ölçekler. |
| 02:56 | **💊 Hap bilgi: modele dokunmadan önce veriye bak. Sorunlar hep oradadır.** |

## 03:02 · Sahne 4: Test Setini Kilitle

**Ekranda:** 100 noktalık ızgaradan 20 nokta kasaya kayar ve kilitlenir; rastgele ve tabakalı ayırma çubukları (−16,7% → +0,4%).

| Zaman | Anlatım (seslendirme / altyazı) |
|---|---|
| 03:02 | *(bölüm kartı: "BÖLÜM 4 · Test Setini Kilitle", 3 sn)* |
| 03:05 | Şimdi projenin en önemli kuralı. |
| 03:09 | Sınav sorularını önceden gören öğrenci, ne kadar bildiğini kanıtlayamaz. |
| 03:16 | Bu yüzden verinin yüzde yirmisini bir kasaya kilitliyoruz. Adı test seti. |
| 03:23 | Model eğitilirken ona asla bakmayacağız. Biz de bakmayacağız. |
| 03:29 | Rastgele ayırınca bir sorun çıktı: en düşük gelirli mahalleler test setinde yüzde 17 eksik kaldı. |
| 03:39 | Çözüm, seçim anketlerindeki gibi tabakalı örnekleme: her gelir grubundan, gerçek oranında örnek al. |
| 03:47 | Hata yüzde 17'den yüzde 0,4'e indi. |
| 03:52 | **💊 Hap bilgi: test seti kutsaldır. Bir kez ve en sonda kullanılır.** |

## 03:59 · Sahne 5: Veriyi Hazırla

**Ekranda:** Yeni sütun formülü kartı; boş hücrelerin 435 ile dolması; one-hot tablosu; ölçekleme çubukları; terzi kartı (fit / transform).

| Zaman | Anlatım (seslendirme / altyazı) |
|---|---|
| 03:59 | *(bölüm kartı: "BÖLÜM 5 · Veriyi Hazırla", 3 sn)* |
| 04:02 | Modeller sadece sayı yer, ve o sayıların düzgün olmasını ister. |
| 04:09 | Önce yeni sütunlar üretiyoruz. Toplam oda sayısı az şey söyler, kişi başına oda çok şey söyler. |
| 04:20 | Boş hücreleri, eğitim verisinin medyanıyla dolduruyoruz. |
| 04:24 | Yazıyı sayıya çevirirken tuzağa dikkat: iç bölgeye bir, okyanus kenarına dört dersek, model sahte bir sıralama görür. |
| 04:35 | Çözüm one-hot kodlama: her kategori kendi sıfır-bir sütununu alır. |
| 04:41 | Son olarak ölçekleme: gelir sıfır ile on beş arasında, oda sayısı kırk bine kadar. Hepsini aynı ölçeğe getiriyoruz. |
| 04:53 | Altın kural: ölçüyü sadece eğitim verisinden al. Terzi ölçüyü bir kez alır, sonra her kumaşı aynı kalıpla keser. |
| 05:05 | Kodda bunun adı fit ve transform. |

## 05:09 · Sahne 6: Model Eğit

**Ekranda:** Üç model kartı (çizgi, ağaç, orman); RMSE formülü; ezber ve gerçek not çubukları; 5 katlı çapraz doğrulama animasyonu; basit–ezberci yelpazesi.

| Zaman | Anlatım (seslendirme / altyazı) |
|---|---|
| 05:09 | *(bölüm kartı: "BÖLÜM 6 · Model Eğit", 3 sn)* |
| 05:12 | Sıra geldi öğrenmeye. Üç model yarıştırıyoruz. |
| 05:17 | Lineer regresyon, veriye en uygun düz çizgiyi çeker. |
| 05:22 | Karar ağacı yirmi soru oyunu oynar: gelir beşten büyük mü? Kıyıda mı? |
| 05:30 | Random Forest ise yüz ağacın oylamasıdır. Kalabalığın bilgeliği. |
| 05:36 | Başarıyı RMSE ile ölçüyoruz: tahminlerimiz tipik olarak kaç dolar sapıyor? |
| 05:43 | İlk sonuç şaşırtıcı: karar ağacı eğitim verisinde sıfır hata yaptı! |
| 05:50 | Sevinmeyin, bu ezber. Görmediği veride en kötü model o çıktı: 71 bin dolar hata. |
| 05:59 | Bunu test setine dokunmadan nasıl gördük? Çapraz doğrulama ile. |
| 06:05 | Eğitim verisini beş parçaya böl. Dördüyle eğit, biriyle sına, beş kez tekrarla. |
| 06:14 | Kazanan Random Forest: yaklaşık 49.600 dolar hata. |
| 06:19 | **💊 Hap bilgi: çok basit model öğrenemez, çok karmaşık model ezberler. Doğrusu ortada.** |

## 06:27 · Sahne 7: İnce Ayar

**Ekranda:** Hiperparametre düğmeleri; 3×4 ızgara ve 0→60 eğitim sayacı; ısı haritası; ezber farkı grafiği; '+450 $' kartı.

| Zaman | Anlatım (seslendirme / altyazı) |
|---|---|
| 06:27 | *(bölüm kartı: "BÖLÜM 7 · İnce Ayar", 3 sn)* |
| 06:30 | Modellerin, bizim ayarladığımız düğmeleri vardır. Bunlara hiperparametre denir. |
| 06:35 | Model, eğitim sırasında parametrelerini kendisi öğrenir. Düğmeleri ise biz seçeriz. |
| 06:42 | Grid Search bütün kombinasyonları dener: üç çarpı dört, on iki kombinasyon. Her biri beş turda, toplam altmış eğitim. |
| 06:54 | Dört işlemci paralel çalıştı. Hepsi bir buçuk dakika sürdü. |
| 07:00 | Yaprak büyüklüğünü artırınca ezber azaldı. Ama çok artırınca model fazla basitleşti. |
| 07:08 | Dürüst sonuç: ince ayar sadece 450 dolar kazandırdı. Büyük kazançlar genelde daha iyi veriden gelir. |

## 07:17 · Sahne 8: Büyük Sınav

**Ekranda:** Kasa açılır; 47.510 $ sayacı; eğitim / çapraz doğrulama / test karşılaştırması; fiyat grubuna göre hata çubukları.

| Zaman | Anlatım (seslendirme / altyazı) |
|---|---|
| 07:17 | *(bölüm kartı: "BÖLÜM 8 · Büyük Sınav", 3 sn)* |
| 07:20 | Ve büyük an: kasayı açıyoruz. |
| 07:24 | Model, hiç görmediği 4.128 mahallede sınava giriyor. |
| 07:30 | Sonuç: 47.500 dolar hata. Çapraz doğrulamadaki 49 binle neredeyse aynı. |
| 07:36 | Bu harika bir haber: model ezberlememiş, gerçekten öğrenmiş. |
| 07:42 | Peki nerede yanılıyor? Ucuz mahallelerde 33 bin, pahalı mahallelerde 100 bin dolar civarı hata. |
| 07:51 | En büyük hatalar, 500 bin dolar tavanına takılan mahallelerde. Verideki sorun, modele de yansıdı. |
| 08:01 | **💊 Hap bilgi: tek bir sayıya bakıp geçme. Hatanın nerede olduğunu analiz et.** |

## 08:09 · Sahne 9: Kaydet ve Kullan

**Ekranda:** Terminalde tahmin komutu yazılır; 382.409 $ çıktısı; 100 ağacın oyları grafiği; 1990 → 2026 takvimi ve veri kayması uyarısı.

| Zaman | Anlatım (seslendirme / altyazı) |
|---|---|
| 08:09 | *(bölüm kartı: "BÖLÜM 9 · Kaydet ve Kullan", 3 sn)* |
| 08:12 | Son adım: modeli kaydedip kullanmak. |
| 08:16 | Los Angeles'ta, geliri 80 bin dolar, evleri 20 yaşında bir mahalleyi soralım. |
| 08:24 | Model 382 bin dolar diyor. Ama yüz ağacın oyları 110 bin ile 500 bin arasına dağılmış, yani model emin değil. |
| 08:36 | Çünkü 1990'da 80 bin dolar gelir çok yüksekti. Model böyle mahalleleri az görmüş. |
| 08:45 | Bir uyarı daha: bu model 1990 dünyasını biliyor. Dünya değişir, model bunu kendisi fark edemez. |
| 08:55 | Bu yüzden canlıdaki modeller izlenir ve yeni veriyle yeniden eğitilir. |

## 09:02 · Sahne 10: 7 Hap Bilgi

**Ekranda:** Yedi numaralı hap kartı sırayla dizilir; kapanışta repo adı ve 'Sıra sende!' çağrısı.

| Zaman | Anlatım (seslendirme / altyazı) |
|---|---|
| 09:02 | *(bölüm kartı: "BÖLÜM 10 · 7 Hap Bilgi", 3 sn)* |
| 09:05 | Toparlayalım. Yedi hap bilgi. |
| 09:08 | Bir: önce veriye bak. |
| 09:11 | İki: test setini kilitle, en sonda bir kez aç. |
| 09:18 | Üç: eksikleri doldur, yazıyı one-hot yap, ölçekle. Ölçüyü sadece eğitimden al. |
| 09:25 | Dört: eğitim notuna güvenme, çapraz doğrulamaya bak. |
| 09:30 | Beş: ezber ile basitlik arasındaki dengeyi bul. |
| 09:36 | Altı: iyi özellikler, düğme çevirmekten daha çok kazandırır. |
| 09:41 | Yedi: model canlıya çıkınca iş bitmez. İzle ve güncelle. |
| 09:48 | Bütün kodlar GitHub'da. Şimdi sıra sende: aynı haritayı kendi verinle dene! |

## 09:55 · Kapanış

**Ekranda:** Video başlığı ve repo adresi (github.com/mikbalarikan/ML_hizli_ogren), 4 sn, sessiz.
