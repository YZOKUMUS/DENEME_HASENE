# 🔥 Firebase Kurulum Rehberi

Bu rehber, Hasene Arapça Dersi uygulamasına Firebase entegrasyonu için adım adım talimatlar içerir.

## 📋 İçindekiler

1. [Firebase Console'da Proje Oluşturma](#1-firebase-consoleda-proje-oluşturma)
2. [Web App Ekleme ve Config Alma](#2-web-app-ekleme-ve-config-alma)
3. [HTML'e Firebase SDK Ekleme](#3-htme-firebase-sdk-ekleme)
4. [Firebase Auth ve Firestore'u Açma](#4-firebase-auth-ve-firestoreu-açma)
5. [Firebase Hosting ile Yayınlama](#5-firebase-hosting-ile-yayınlama)

---

## 1. Firebase Console'da Proje Oluşturma

### Adım 1: Firebase Console'a Giriş Yapın

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. Google hesabınızla giriş yapın

### Adım 2: Yeni Proje Oluşturun

1. **"Add project"** veya **"Proje ekle"** butonuna tıklayın
2. Proje adını girin (örn: `hasene-arapca-dersi`)
3. **"Continue"** (Devam) butonuna tıklayın
4. Google Analytics'i açıp kapatabilirsiniz (isteğe bağlı)
5. **"Create project"** (Proje oluştur) butonuna tıklayın
6. Proje oluşturulmasını bekleyin (birkaç saniye sürebilir)
7. **"Continue"** butonuna tıklayın

---

## 2. Web App Ekleme ve Config Alma

### Adım 1: Web App Ekleyin

1. Firebase Console'da projenize gidin
2. Ana sayfada **"</>"** (Web) ikonuna tıklayın veya **"Add app"** > **"Web"** seçin
3. App nickname girin (örn: `Hasene Web App`)
4. **"Register app"** (Uygulamayı kaydet) butonuna tıklayın

### Adım 2: Firebase Config'i Kopyalayın

Firebase size şu şekilde bir config verecek:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "hasene-arapca-dersi.firebaseapp.com",
  projectId: "hasene-arapca-dersi",
  storageBucket: "hasene-arapca-dersi.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

**Bu config'i kopyalayın!**

### Adım 3: Config'i Projeye Ekleyin

`js/firebase-config.js` dosyasını açın ve config değerlerini güncelleyin:

```javascript
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Firebase'den aldığınız
    authDomain: "hasene-arapca-dersi.firebaseapp.com",
    projectId: "hasene-arapca-dersi",
    storageBucket: "hasene-arapca-dersi.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdefghijklmnop"
};
```

**VEYA** `index.html` dosyasında script tag içinde güncelleyin (firebase-init.js kullanıyorsanız firebase-config.js'de güncelleyin).

---

## 3. HTML'e Firebase SDK Ekleme

✅ **Zaten yapıldı!** Firebase SDK zaten `index.html` dosyasına eklenmiş durumda.

Eğer manuel olarak eklemek isterseniz:

```html
<!-- Firebase SDK (ES6 Modules) -->
<script type="module" src="js/firebase-init.js"></script>
```

`firebase-init.js` dosyası Firebase SDK'yı CDN'den yükler.

---

## 4. Firebase Auth ve Firestore'u Açma

### Adım 1: Authentication (Kimlik Doğrulama) Açın

1. Firebase Console'da sol menüden **"Authentication"** (Kimlik Doğrulama) seçin
2. **"Get started"** (Başlayın) butonuna tıklayın
3. **"Sign-in method"** (Giriş yöntemi) sekmesine gidin
4. **"Email/Password"** seçeneğini açın:
   - **"Enable"** (Etkinleştir) toggle'ını açın
   - **"Save"** (Kaydet) butonuna tıklayın
5. (İsteğe bağlı) **"Google"** provider'ını da açabilirsiniz:
   - **"Enable"** toggle'ını açın
   - Gerekli bilgileri doldurun
   - **"Save"** butonuna tıklayın

### Adım 2: Firestore Database Oluşturun

1. Firebase Console'da sol menüden **"Firestore Database"** seçin
2. **"Create database"** (Veritabanı oluştur) butonuna tıklayın
3. **"Start in test mode"** (Test modunda başlat) seçin (geliştirme için)
   - ⚠️ **ÖNEMLİ**: Production'da güvenlik kuralları eklemeniz gerekecek
4. **"Next"** (İleri) butonuna tıklayın
5. Cloud Firestore location seçin (örn: `europe-west` veya size en yakın)
6. **"Enable"** (Etkinleştir) butonuna tıklayın

### Adım 3: Firestore Güvenlik Kuralları (Production için)

Test modunda çalışıyorsanız şimdilik atlayabilirsiniz, ama production için güvenlik kuralları eklemeniz gerekir:

**Firestore Console > Rules** sekmesine gidin ve şu kuralları ekleyin:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Kullanıcılar sadece kendi verilerine erişebilir
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Kullanıcı istatistikleri
    match /user_stats/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Kelime istatistikleri
    match /word_stats/{userId}/{wordId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Günlük görevler
    match /daily_tasks/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Haftalık görevler
    match /weekly_tasks/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Favori kelimeler
    match /favorites/{userId}/{wordId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Başarımlar
    match /achievements/{userId}/{achievementId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Rozetler
    match /badges/{userId}/{badgeId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**"Publish"** (Yayınla) butonuna tıklayın.

---

## 5. Firebase Hosting ile Yayınlama

### Adım 1: Firebase CLI Kurulumu

Terminal/Command Prompt'ta:

```bash
npm install -g firebase-tools
```

### Adım 2: Firebase'e Giriş Yapın

```bash
firebase login
```

Tarayıcı açılacak, Google hesabınızla giriş yapın.

### Adım 3: Projeyi Firebase'e Bağlayın

Proje klasörünüzde:

```bash
firebase init hosting
```

Sorulara şu şekilde cevap verin:

1. **"Use an existing project"** seçin ve projenizi seçin
2. **"What do you want to use as your public directory?"** → `./` (root directory)
3. **"Configure as a single-page app?"** → `Yes`
4. **"Set up automatic builds and deploys with GitHub?"** → `No` (isteğe bağlı)
5. **"File ./index.html already exists. Overwrite?"** → `No`

### Adım 4: Projeyi Yayınlayın

```bash
firebase deploy --only hosting
```

Yayınlama tamamlandığında size bir URL verilecek (örn: `https://hasene-arapca-dersi.web.app`)

### Adım 5: Otomatik Yayınlama (İsteğe bağlı)

Her değişiklikten sonra otomatik yayınlamak için:

```bash
firebase deploy
```

---

## ✅ Kontrol Listesi

- [ ] Firebase Console'da proje oluşturuldu
- [ ] Web app eklendi ve config alındı
- [ ] `js/firebase-config.js` dosyası güncellendi
- [ ] Authentication açıldı (Email/Password)
- [ ] Firestore Database oluşturuldu
- [ ] (Production için) Firestore güvenlik kuralları eklendi
- [ ] Firebase Hosting ile yayınlandı (isteğe bağlı)

---

## 🔧 Sorun Giderme

### Firebase modülleri yüklenmiyor

- Tarayıcı konsolunu kontrol edin
- `firebase-config.js` dosyasındaki config değerlerinin doğru olduğundan emin olun
- Sayfayı yenileyin (hard refresh: Ctrl+Shift+R veya Cmd+Shift+R)

### Authentication çalışmıyor

- Firebase Console'da Authentication'ın açık olduğundan emin olun
- Email/Password provider'ının enable olduğundan emin olun
- Tarayıcı konsolunda hata mesajlarını kontrol edin

### Firestore erişim hatası

- Firestore Database'in oluşturulduğundan emin olun
- Güvenlik kurallarını kontrol edin
- Test modunda çalışıyorsanız 30 gün sonra otomatik kapanır, production kuralları ekleyin

---

## 📚 Daha Fazla Bilgi

- [Firebase Dokümantasyonu](https://firebase.google.com/docs)
- [Firebase Auth Dokümantasyonu](https://firebase.google.com/docs/auth)
- [Firestore Dokümantasyonu](https://firebase.google.com/docs/firestore)
- [Firebase Hosting Dokümantasyonu](https://firebase.google.com/docs/hosting)

---

## 🎉 Tamamlandı!

Firebase entegrasyonu başarıyla tamamlandı! Artık uygulamanız Firebase Auth ve Firestore kullanarak çalışıyor.
