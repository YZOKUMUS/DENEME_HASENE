# 🚀 FLUTTER PROJESİNİ ÇALIŞTIRMA REHBERİ

## 📋 ÖN HAZIRLIK

### 1. Flutter Kurulumu Kontrolü
```bash
flutter doctor
```

Bu komut Flutter kurulumunuzu kontrol eder. Şunları kontrol eder:
- ✅ Flutter SDK kurulu mu?
- ✅ Dart SDK kurulu mu?
- ✅ Android Studio / Xcode kurulu mu?
- ✅ Emulator/Device bağlı mı?

---

## 🔧 KURULUM ADIMLARI

### Adım 1: Proje Klasörüne Git
```bash
cd hasene_flutter
```

### Adım 2: Bağımlılıkları Yükle
```bash
flutter pub get
```

Bu komut `pubspec.yaml` dosyasındaki tüm paketleri yükler.

### Adım 3: Build Runner Çalıştır (JSON Serialization için)
```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

Bu komut model sınıfları için JSON serialization kodlarını oluşturur.

### Adım 4: Assets Dosyalarını Kopyala
**Windows için:**
```powershell
.\scripts\copy_assets.ps1
```

**Linux/Mac için:**
```bash
./scripts/copy_assets.sh
```

Bu script'ler data dosyalarını `assets/data/` klasörüne kopyalar.

---

## 🎮 ÇALIŞTIRMA

### Seçenek 1: Emulator/Device'da Çalıştır

#### Android Emulator:
```bash
# Emulator'ü başlat (Android Studio'dan veya)
flutter emulators --launch <emulator_id>

# Uygulamayı çalıştır
flutter run
```

#### iOS Simulator (Mac):
```bash
# Simulator'ü başlat
open -a Simulator

# Uygulamayı çalıştır
flutter run
```

#### Fiziksel Cihaz:
1. USB ile cihazı bağla
2. USB Debugging'i aç (Android) veya Developer Mode'u aç (iOS)
3. Cihazı kontrol et:
```bash
flutter devices
```
4. Uygulamayı çalıştır:
```bash
flutter run
```

---

### Seçenek 2: Web'de Çalıştır

```bash
flutter run -d chrome
```

veya

```bash
flutter run -d web-server
```

---

### Seçenek 3: VS Code / Android Studio'dan

#### VS Code:
1. VS Code'u aç
2. `hasene_flutter` klasörünü aç
3. F5 tuşuna bas veya Run > Start Debugging
4. Cihaz seç (Chrome, Android Emulator, iOS Simulator, vb.)

#### Android Studio:
1. Android Studio'yu aç
2. `hasene_flutter` klasörünü aç
3. Run butonuna tıkla (▶️)
4. Cihaz seç

---

## 🔥 HOT RELOAD

Uygulama çalışırken:
- **r** tuşuna bas → Hot reload (hızlı yenileme)
- **R** tuşuna bas → Hot restart (tam yeniden başlatma)
- **q** tuşuna bas → Çıkış

---

## 🐛 HATA GİDERME

### Hata 1: "No devices found"
**Çözüm:**
```bash
flutter devices
```
Eğer cihaz görünmüyorsa:
- Android: USB Debugging açık mı kontrol et
- iOS: Developer Mode açık mı kontrol et
- Emulator: Emulator çalışıyor mu kontrol et

### Hata 2: "Firebase not configured"
**Çözüm:**
```bash
flutterfire configure
```
Bu komut Firebase yapılandırmasını oluşturur.

### Hata 3: "Assets not found"
**Çözüm:**
```bash
# Windows
.\scripts\copy_assets.ps1

# Linux/Mac
./scripts/copy_assets.sh
```

### Hata 4: "Build runner errors"
**Çözüm:**
```bash
flutter clean
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
```

### Hata 5: "JSON serialization errors"
**Çözüm:**
Model dosyalarında `part` ve `@JsonSerializable` annotation'larını kontrol et.

---

## 📱 PLATFORM SEÇİMİ

### Android:
```bash
flutter run -d android
```

### iOS (Mac):
```bash
flutter run -d ios
```

### Web:
```bash
flutter run -d chrome
```

### Windows:
```bash
flutter run -d windows
```

### Linux:
```bash
flutter run -d linux
```

---

## 🎯 HIZLI BAŞLANGIÇ

Tüm adımları tek seferde yapmak için:

```bash
# 1. Proje klasörüne git
cd hasene_flutter

# 2. Bağımlılıkları yükle
flutter pub get

# 3. Build runner çalıştır
flutter pub run build_runner build --delete-conflicting-outputs

# 4. Assets kopyala (Windows)
.\scripts\copy_assets.ps1

# 5. Çalıştır (Web - en kolay)
flutter run -d chrome
```

---

## 📝 ÖNEMLİ NOTLAR

1. **Firebase Yapılandırması:**
   - İlk çalıştırmada `flutterfire configure` çalıştırılmalı
   - Firebase projesi oluşturulmuş olmalı

2. **Assets Dosyaları:**
   - `data/` klasöründeki JSON dosyaları `assets/data/` klasörüne kopyalanmalı
   - Script'ler bunu otomatik yapar

3. **Model Dosyaları:**
   - `*.g.dart` dosyaları build runner tarafından oluşturulur
   - Bu dosyaları manuel düzenlemeyin

4. **Platform Bağımlılıkları:**
   - Android: Android Studio + Android SDK
   - iOS: Xcode (sadece Mac)
   - Web: Chrome/Edge
   - Desktop: Platform SDK'ları

---

## 🎉 BAŞARILI ÇALIŞTIRMA

Uygulama başarıyla çalıştığında:
- ✅ Splash screen görünür
- ✅ Login screen açılır
- ✅ Kullanıcı adı ile giriş yapılabilir
- ✅ Ana menüde 2 oyun modu görünür:
  - 📚 Kelime Sınavı
  - 📖 İlim Modu

---

## 📞 YARDIM

Sorun yaşarsanız:
1. `flutter doctor` çalıştır ve çıktıyı kontrol et
2. `flutter clean` çalıştır ve tekrar dene
3. Log dosyalarını kontrol et
4. GitHub Issues'da ara

---

**İyi çalışmalar! 🚀**

