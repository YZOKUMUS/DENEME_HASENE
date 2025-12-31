# 📚 FLUTTER MİGRASYON REHBERİ

## ✅ TAMAMLANAN ADIMLAR

### 1. Proje Yapısı ✅
- Flutter proje klasörü oluşturuldu
- `pubspec.yaml` hazırlandı
- Temel klasör yapısı oluşturuldu

### 2. Temel Dosyalar ✅
- `main.dart` - Entry point
- `app.dart` - App widget
- `constants.dart` - Sabitler
- `theme.dart` - Tema tanımları
- `helpers.dart` - Yardımcı fonksiyonlar

### 3. Model Sınıfları ✅
- `UserModel` - Kullanıcı modeli
- `WordModel` - Kelime modeli
- `GameModel` - Oyun modeli
- `QuestionModel` - Soru modeli

### 4. Provider'lar ✅
- `UserProvider` - Kullanıcı state yönetimi
- `GameProvider` - Oyun state yönetimi
- `StatsProvider` - İstatistik state yönetimi

### 5. Service Katmanı ✅
- `AuthService` - Firebase Authentication
- `FirebaseService` - Firestore operations
- `DataService` - JSON data loading

### 6. UI Ekranları ✅
- `SplashScreen` - Splash ekranı
- `LoginScreen` - Giriş ekranı
- `HomeScreen` - Ana menü
- `GameScreen` - Oyun ekranı

---

## 🔄 SONRAKI ADIMLAR

### 1. Build Runner Çalıştır
```bash
cd hasene_flutter
flutter pub get
flutter pub run build_runner build
```

Bu komut JSON serialization dosyalarını oluşturacak:
- `user_model.g.dart`
- `word_model.g.dart`
- `game_model.g.dart`

### 2. Assets Taşıma
```bash
# Mevcut assets'leri Flutter projesine kopyala
cp -r assets/images hasene_flutter/assets/
cp -r assets/fonts hasene_flutter/assets/
cp -r data hasene_flutter/assets/data
```

### 3. Firebase Yapılandırması
```bash
# Firebase CLI ile config oluştur
cd hasene_flutter
flutterfire configure

# Veya manuel olarak firebase_options.dart'ı güncelle
```

### 4. Eksik Ekranlar
- [ ] Stats Screen
- [ ] Badges Screen
- [ ] Leaderboard Screen
- [ ] Tasks Screen
- [ ] Ayet Oku Screen
- [ ] Dua Et Screen
- [ ] Hadis Oku Screen
- [ ] Elif Ba Screen

### 5. Eksik Servisler
- [ ] Audio Service (ses çalma)
- [ ] Storage Service (local storage)
- [ ] Badge Service
- [ ] Task Service

### 6. Widget'lar
- [ ] Arabic Text Widget
- [ ] Audio Button Widget
- [ ] Badge Card Widget
- [ ] Progress Bar Widget
- [ ] Stat Card Widget

---

## 🐛 BİLİNEN SORUNLAR

1. **JSON Serialization**: `build_runner` çalıştırılmalı
2. **Firebase Config**: Android/iOS app ID'leri güncellenmeli
3. **Assets**: Dosyalar henüz taşınmadı
4. **Audio**: Audio service henüz implement edilmedi

---

## 📝 NOTLAR

- Tüm model sınıfları JSON serialization için hazır
- Provider pattern kullanılıyor (state management)
- Firebase entegrasyonu temel seviyede hazır
- UI ekranları temel yapıda, detaylandırılmalı

---

**Son Güncelleme:** 2025-01-XX

