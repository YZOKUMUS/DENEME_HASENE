# 🚀 FLUTTER PROJE KURULUM TALİMATLARI

## 📋 GEREKSINIMLER

1. **Flutter SDK** (3.0.0 veya üzeri)
   ```bash
   flutter --version
   ```

2. **Dart SDK** (Flutter ile birlikte gelir)

3. **Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

4. **Android Studio** veya **Xcode** (platform-specific build için)

---

## 🔧 KURULUM ADIMLARI

### 1. Projeyi Klonla/Kopyala
```bash
cd hasene_flutter
```

### 2. Dependencies Yükle
```bash
flutter pub get
```

### 3. Build Runner Çalıştır (JSON Serialization için)
```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

Bu komut şu dosyaları oluşturacak:
- `lib/models/user_model.g.dart`
- `lib/models/word_model.g.dart`
- `lib/models/game_model.g.dart`

### 4. Firebase Yapılandırması

#### Seçenek 1: FlutterFire CLI (Önerilen)
```bash
# Firebase CLI'yi kur
npm install -g firebase-tools

# Firebase'e giriş yap
firebase login

# FlutterFire CLI'yi kur
dart pub global activate flutterfire_cli

# Firebase yapılandırması
flutterfire configure
```

#### Seçenek 2: Manuel Yapılandırma
`lib/config/firebase_options.dart` dosyasını düzenle:
- Android App ID'yi ekle
- iOS App ID'yi ekle
- macOS App ID'yi ekle (gerekirse)

### 5. Assets Dosyalarını Taşı

Mevcut projeden assets'leri kopyala:

```bash
# Windows PowerShell
Copy-Item -Path "..\assets\images" -Destination "assets\" -Recurse
Copy-Item -Path "..\assets\fonts" -Destination "assets\" -Recurse
Copy-Item -Path "..\data" -Destination "assets\data\" -Recurse

# Linux/Mac
cp -r ../assets/images assets/
cp -r ../assets/fonts assets/
cp -r ../data assets/data
```

### 6. Projeyi Çalıştır

```bash
# Android
flutter run

# iOS (Mac only)
flutter run -d ios

# Web
flutter run -d chrome
```

---

## 🐛 SORUN GİDERME

### Build Runner Hatası
```bash
# Cache'i temizle
flutter clean
flutter pub get
flutter pub run build_runner clean
flutter pub run build_runner build --delete-conflicting-outputs
```

### Firebase Hatası
- `firebase_options.dart` dosyasının doğru yapılandırıldığından emin ol
- Firebase Console'da proje ayarlarını kontrol et
- Android/iOS app'lerin Firebase'de kayıtlı olduğundan emin ol

### Assets Bulunamadı Hatası
- `pubspec.yaml` dosyasında assets yollarını kontrol et
- Assets dosyalarının doğru konumda olduğundan emin ol
- `flutter clean` ve `flutter pub get` çalıştır

### Model Serialization Hatası
- `build_runner` çalıştırıldığından emin ol
- `.g.dart` dosyalarının oluşturulduğunu kontrol et
- Model sınıflarında `part` directive'lerinin doğru olduğundan emin ol

---

## 📱 PLATFORM-SPECIFIC AYARLAR

### Android
1. `android/app/build.gradle` dosyasını kontrol et
2. `minSdkVersion` en az 21 olmalı
3. `google-services.json` dosyasını `android/app/` klasörüne ekle

### iOS
1. `ios/Podfile` dosyasını kontrol et
2. `GoogleService-Info.plist` dosyasını `ios/Runner/` klasörüne ekle
3. `pod install` çalıştır

---

## ✅ KONTROL LİSTESİ

- [ ] Flutter SDK kurulu
- [ ] Dependencies yüklendi (`flutter pub get`)
- [ ] Build runner çalıştırıldı
- [ ] Firebase yapılandırıldı
- [ ] Assets dosyaları taşındı
- [ ] Proje başarıyla çalışıyor

---

## 📝 NOTLAR

- İlk çalıştırmada build işlemi biraz uzun sürebilir
- Firebase yapılandırması için internet bağlantısı gereklidir
- Android emulator veya fiziksel cihaz gereklidir (Android için)
- iOS için Mac ve Xcode gereklidir

---

**Sorun yaşarsanız:** `MIGRATION_GUIDE.md` dosyasına bakın veya GitHub Issues'da sorun bildirin.

