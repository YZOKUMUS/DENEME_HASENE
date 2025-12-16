# 🕌 Hasene Arapça Dersi

Kuran-ı Kerim kelimelerini eğlenceli bir şekilde öğrenerek hem bilginizi artırın hem de **Hasene** kazanın.

## 🎮 Oyun Modları

1. **Kelime Çevir** - Arapça kelimelerin Türkçe meâl karşılığını bul
2. **Dinle Bul** - Dinlediğin kelimeyi seçeneklerden bul
3. **Boşluk Doldur** - Ayetlerdeki boşlukları doldur
4. **Ayet Oku** - Ayetleri oku ve dinle
5. **Dua Et** - Duaları oku ve dinle
6. **Hadis Oku** - Hadisleri oku

## ✨ Özellikler

- 📚 6 Farklı Oyun Modu
- 💰 Hasene Puan Sistemi (tüm bonuslar dahil)
- 🏆 41 Kronolojik Rozet (Asr-ı Saadet)
- 🎖️ 44 Başarım (mantıklı sıralama)
- 📅 Günlük Görevler (sadeleştirilmiş ve İslami içerik odaklı)
- 🔥 Seri (Streak) Takibi
- 📊 Detaylı İstatistikler (Kelimeler ve Favoriler)
- 🎯 Günlük Vird Sistemi
- 🎁 Günlük Ödül Kutusu (İslami öğretiler ile sürpriz ödüller)
- 📱 Tam Responsive Tasarım (mobil, tablet, desktop)
- 💾 Offline Çalışma (PWA - LocalStorage)
- 🎨 iOS 16 Liquid Glass Tasarımı (Glassmorphism)
- 📖 Rozet Detay Modalı (tarihsel bilgiler, Arapça terimler)
- 🎯 iPhone Tarzı Bottom Navigation

## 🚀 Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/YZOKUMUS/DENEME_HASENE.git
```

2. Proje klasörüne gidin:
```bash
cd DENEME_HASENE
```

3. Bir web sunucusu ile çalıştırın (örneğin VS Code Live Server veya Python http.server)

## 📁 Proje Yapısı

```
deneme_hasene/
├── index.html          # Ana HTML dosyası
├── style.css           # Stil dosyası
├── manifest.json       # PWA manifest
├── sw.js              # Service Worker
├── js/
│   ├── game-core.js   # Ana oyun mantığı
│   ├── constants.js   # Sabitler ve rozet tanımları
│   ├── config.js      # Yapılandırma
│   ├── api-service.js # LocalStorage API servisi
│   ├── auth.js        # Kullanıcı kimlik doğrulama (localStorage)
│   └── ...
├── data/
│   ├── kelimebul.json # Kelime verileri
│   ├── ayetoku.json   # Ayet verileri
│   ├── duaet.json     # Dua verileri
│   └── hadisoku.json  # Hadis verileri
├── docs/              # Dokümantasyon
│   ├── README.md      # Bu dosya
│   ├── DIL_OGRETME_ALGORITMALARI.md
│   ├── analiz/        # Analiz raporları
│   ├── sistem/        # Sistem dokümantasyonu
│   └── rozetler/      # Rozet sistemi dokümantasyonu
└── assets/            # Görseller ve ikonlar
```

## 🎯 Zorluk Seviyeleri

- 🌱 **Kolay**: 5-8 difficulty
- ⚖️ **Orta**: 9-12 difficulty
- 🔥 **Zor**: 13-21 difficulty

## 📊 Puan Sistemi

### Temel Puanlar
- **Doğru cevap**: 10 Hasene
- **Combo Bonus**: Her doğru cevap için +2 Hasene
- **Mükemmel ders** (0 yanlış, min 3 soru): +50 Hasene

### Bonuslar
- **Günlük Görev Ödülleri**: Tüm görevler tamamlandığında sürpriz ödül (100, 250 veya 500 Hasene)
- **Günlük Ödül Kutusu**: Her gün kurdelalı kutu ile İslami öğreti ve sürpriz Hasene ödülü
- **Günlük Vird Bonusu**: Günlük hedefi tamamlayınca +100 Hasene bonus

Tüm bonuslar detaylı istatistiklere kaydedilir.

### ⭐ Yıldız Sistemi
- **250 Hasene = 1 Yıldız** (yaklaşık 25 doğru cevap, 2-3 oyun)
- **5 Yıldız = 1 Bronz** (1,250 Hasene)
- **5 Bronz = 1 Gümüş** (6,250 Hasene)
- **5 Gümüş = 1 Altın** (31,250 Hasene)
- **5 Altın = 1 Elmas** (156,250 Hasene)

Yıldızlar rozet sistemine dönüşür ve başarımlar için kullanılır.

## 🏆 Rozetler ve Başarımlar

### Rozetler (Asr-ı Saadet)
41 kronolojik rozet sistemi - Peygamberimizin doğumundan Dört Halife dönemi sonuna kadar:
- **Mekke Dönemi** (13 rozet): Doğum'dan İkinci Akabe Biatı'na kadar
- **Medine Dönemi** (14 rozet): Hicret'ten Vefat'a kadar
- **İlk İki Halife** (8 rozet): Hz. Ebu Bekir ve Hz. Ömer dönemi
- **Hz. Osman** (3 rozet): Üçüncü halife dönemi
- **Hz. Ali** (3 rozet): Dördüncü halife dönemi

Her rozet tıklanabilir ve detaylı tarihsel bilgi gösterir (Miladi/Hicri tarih, Arapça terimler, önemi).

### Başarımlar
44 başarım mantıklı sırayla gösterilir:
- **İlk Adımlar**: Tek oturumda tamamlanabilir (İlk Kelime, Bismillah, vb.)
- **Başlangıç**: Kısa sürede tamamlanabilir
- **İlerleme**: Orta zorluk
- **Ustalık**: Zor
- **Master**: Çok zor
- **Efsane**: En zor (Kurra Hafız: 1,000,000 Hasene)

Sıralama: Kolaydan zora, hızlıdan yavaşa doğru mantıklı ilerleme.

## 📅 Günlük Görevler

Sadeleştirilmiş ve İslami içerik odaklı günlük görevler:

### Temel Görevler (4 adet)
1. **🎮 3 Oyun Modu** - 3 farklı oyun modu oyna
2. **📖 Ayet Oku** - 5 ayet okuması yap
3. **🤲 Dua Et** - 5 dua et
4. **📚 Hadis Oku** - 5 hadis okuması yap

### Fazilet Vazifeleri (Bonus - 2 adet)
1. **✅ 30 Doğru Cevap** - 30 sahih cevap ver
2. **⭐ 500 Hasene** - 500 Hasene kazan

### Günlük Ödül Kutusu
- Tüm görevler tamamlandığında kurdelalı kutu ile sürpriz ödül
- Her gün farklı İslami öğreti (zikir, dua, hadis)
- Rastgele ödül miktarı: 100, 250 veya 500 Hasene
- Arapça metin, Türkçe çeviri ve eğitici açıklama

## 🎨 UI/UX Tasarımı

### iOS 16 Liquid Glass (Glassmorphism)
- Modern cam efekti (backdrop-filter blur)
- Yarı saydam arka planlar
- Yumuşak gölgeler ve kenarlar
- Apple SF Pro font ailesi

### Responsive Tasarım
- Mobil: 2 sütunlu oyun grid'i
- Tablet: 3 sütunlu oyun grid'i
- Desktop: 3 sütunlu oyun grid'i
- iPhone tarzı bottom navigation (safe area desteği)
- Optimize edilmiş compact daily goal section

### İstatistikler Paneli
- Sadeleştirilmiş görünüm: Sadece "Kelimeler" ve "Favoriler" bölümleri
- Detaylı istatistikler modalı: Doğrudan erişim
- Kullanıcı profil butonu: Combined stats card içinde konumlandırılmış

## 📅 Takvim Sistemi

Duolingo tarzı takvim:
- Ayın tüm günleri gösterilir
- Oynanan günler yeşil
- Seri günler turuncu/sarı
- Oynanmayan günler gri

## 💾 Veri Saklama

Uygulama tamamen **offline** çalışır ve tüm veriler **localStorage**'da saklanır:
- Kullanıcı istatistikleri
- Rozetler ve başarımlar
- Günlük ve haftalık görevler
- Kelime istatistikleri
- Favori kelimeler
- Oyun geçmişi

## 🔧 Teknolojiler

- Vanilla JavaScript
- HTML5
- CSS3
- LocalStorage (veri saklama)
- IndexedDB (cache)
- Service Worker (PWA)

## 📚 Dokümantasyon

Detaylı dokümantasyon için `docs/` klasörüne bakın:
- **DIL_OGRETME_ALGORITMALARI.md** - Dil öğretme algoritmaları
- **analiz/** - Analiz raporları
- **sistem/** - Sistem dokümantasyonu
- **rozetler/** - Rozet sistemi dokümantasyonu

## 📝 Lisans

Bu proje eğitim amaçlıdır.

## 👤 Geliştirici

YZOKUMUS
