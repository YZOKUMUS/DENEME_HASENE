# ⚡ HIZLI BAŞLANGIÇ

## 🚀 EN KOLAY YOL: WEB'DE ÇALIŞTIR

### Adım 1: Terminal'de Proje Klasörüne Git
```bash
cd hasene_flutter
```

### Adım 2: Web'de Çalıştır
```bash
flutter run -d chrome
```

Bu komut:
- ✅ Chrome tarayıcısını açar
- ✅ Uygulamayı otomatik yükler
- ✅ Hot reload desteği sağlar

---

## 📱 ANDROID'DE ÇALIŞTIR

### Önce Emulator'ü Başlat:
1. Android Studio'yu aç
2. Tools > Device Manager
3. Bir emulator seç ve başlat

### Sonra Uygulamayı Çalıştır:
```bash
flutter run
```

veya belirli bir cihaz seçmek için:
```bash
flutter run -d <device_id>
```

---

## 🍎 iOS'TA ÇALIŞTIR (Sadece Mac)

### Önce Simulator'ü Başlat:
```bash
open -a Simulator
```

### Sonra Uygulamayı Çalıştır:
```bash
flutter run
```

---

## 🪟 WINDOWS'TA ÇALIŞTIR

```bash
flutter run -d windows
```

---

## 🔧 İLK ÇALIŞTIRMADA YAPILMASI GEREKENLER

### 1. Build Runner Çalıştır (JSON Serialization için)
```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

### 2. Assets Dosyalarını Kopyala
**Windows:**
```powershell
.\scripts\copy_assets.ps1
```

**Linux/Mac:**
```bash
./scripts/copy_assets.sh
```

### 3. Firebase Yapılandır (İsteğe bağlı)
```bash
flutterfire configure
```

---

## 🎯 ÖNERİLEN İLK ÇALIŞTIRMA SIRASI

```bash
# 1. Proje klasörüne git
cd hasene_flutter

# 2. Bağımlılıkları yükle (zaten yapıldı)
flutter pub get

# 3. Build runner çalıştır
flutter pub run build_runner build --delete-conflicting-outputs

# 4. Assets kopyala (Windows)
.\scripts\copy_assets.ps1

# 5. Web'de çalıştır (en kolay)
flutter run -d chrome
```

---

## 🔥 HOT RELOAD

Uygulama çalışırken:
- **r** → Hot reload (hızlı yenileme)
- **R** → Hot restart (tam yeniden başlatma)
- **q** → Çıkış

---

## 📝 NOTLAR

1. **Web'de çalıştırmak en kolay yoldur** - Emulator/Simulator gerekmez
2. **Android/iOS için** emulator/simulator çalışıyor olmalı
3. **İlk çalıştırmada** build runner mutlaka çalıştırılmalı
4. **Assets dosyaları** kopyalanmalı (data JSON dosyaları)

---

## 🐛 SORUN ÇÖZME

### "No devices found" hatası:
```bash
flutter devices
```
Cihaz görünmüyorsa emulator/simulator'ü başlat.

### "Assets not found" hatası:
```bash
.\scripts\copy_assets.ps1
```

### "Build runner errors":
```bash
flutter clean
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
```

---

**İyi çalışmalar! 🚀**

