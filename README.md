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
- 💰 Hasene Puan Sistemi
- 🏆 Rozet ve Başarım Sistemi
- 📅 Günlük ve Haftalık Görevler
- 🔥 Seri (Streak) Takibi
- 📊 Detaylı İstatistikler
- 🎯 Günlük Vird Sistemi
- 📱 Responsive Tasarım
- 💾 Offline Çalışma (PWA)

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
│   ├── utils.js       # Yardımcı fonksiyonlar
│   └── ...
├── data/
│   ├── kelimebul.json # Kelime verileri
│   ├── ayetoku.json   # Ayet verileri
│   ├── duaet.json     # Dua verileri
│   └── hadisoku.json  # Hadis verileri
└── assets/            # Görseller ve ikonlar
```

## 🎯 Zorluk Seviyeleri

- 🌱 **Kolay**: 5-8 difficulty
- ⚖️ **Orta**: 9-12 difficulty
- 🔥 **Zor**: 13-21 difficulty

## 📊 Puan Sistemi

- Doğru cevap: 10 Hasene
- Her 3 doğru cevapta: +5 Hasene (Combo Bonus)
- Mükemmel ders: %50 ekstra bonus

## 🏆 Rozetler ve Başarımlar

Rozetler ve başarımlar zorluk seviyelerine göre mantıklı bir sırayla gösterilir:
- Kazanılanlar önce (kolaydan zora)
- Kazanılmayanlar sonra (kolaydan zora)

## 📅 Takvim Sistemi

Duolingo tarzı takvim:
- Ayın tüm günleri gösterilir
- Oynanan günler yeşil
- Seri günler turuncu/sarı
- Oynanmayan günler gri

## 🔧 Teknolojiler

- Vanilla JavaScript
- HTML5
- CSS3
- IndexedDB (veri saklama)
- Service Worker (PWA)
- LocalStorage (yedek veri)

## 📝 Lisans

Bu proje eğitim amaçlıdır.

## 👤 Geliştirici

YZOKUMUS

