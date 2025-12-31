# 🕌 Hasene Arapça Dersi - Flutter

Kuran kelimelerini öğren, rozet topla, günlük görevleri tamamla!

## 📱 Özellikler

- ✅ 7 Farklı Oyun Modu
- ✅ Firebase Authentication & Firestore
- ✅ Puan Sistemi (Hasene)
- ✅ Rozet ve Başarım Sistemi
- ✅ Günlük Görevler
- ✅ Liderlik Tablosu
- ✅ İstatistikler
- ✅ Ses Çalma
- ✅ Offline Support

## 🚀 Kurulum

### Gereksinimler

- Flutter SDK (3.0.0+)
- Dart SDK
- Firebase CLI
- Android Studio / Xcode (platform-specific)

### Adımlar

1. **Dependencies yükle:**
```bash
cd hasene_flutter
flutter pub get
```

2. **Firebase yapılandırması:**
```bash
# Firebase CLI ile config oluştur
flutterfire configure

# Veya manuel olarak firebase_options.dart dosyasını güncelle
```

3. **Build runner çalıştır (JSON serialization için):**
```bash
flutter pub run build_runner build
```

4. **Uygulamayı çalıştır:**
```bash
flutter run
```

## 📁 Proje Yapısı

```
lib/
├── main.dart              # Entry point
├── app.dart              # App widget
├── models/               # Data models
├── services/             # Business logic
├── providers/            # State management
├── screens/              # UI screens
├── widgets/              # Reusable widgets
├── utils/                # Helper functions
└── config/               # Configuration
```

## 🔧 Geliştirme

### State Management
Provider pattern kullanılıyor.

### Local Storage
Hive + SharedPreferences kombinasyonu kullanılıyor.

### Firebase
Firebase Auth (Anonymous) + Firestore kullanılıyor.

## 📝 Notlar

- Bu proje web versiyonundan Flutter'a migrate edilmiştir
- Tüm özellikler web versiyonuyla uyumlu olacak şekilde tasarlanmıştır
- Firebase config değerleri web versiyonundan alınmıştır

## 📄 Lisans

Bu proje özel bir projedir.

