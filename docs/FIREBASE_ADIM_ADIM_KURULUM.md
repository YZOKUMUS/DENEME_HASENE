# 🔥 Firebase Kurulum - Adım Adım Rehber

Bu rehber, Firebase kurulumunu **adım adım** yapmanız için hazırlanmıştır. Her adımı sırayla takip edin.

---

## 📋 ADIM 1: Firebase Console'a Giriş Yapın

### Ne Yapmalısınız:

1. Tarayıcınızda [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. Google hesabınızla giriş yapın (şifrenizi girin)
3. Giriş yaptıktan sonra Firebase Console ana sayfasına yönlendirileceksiniz

### Kontrol:
- ✅ Firebase Console ana sayfasını görüyorsanız → **ADIM 2'ye geçin**

---

## 📋 ADIM 2: Yeni Proje Oluşturun

### Ne Yapmalısınız:

1. Firebase Console ana sayfasında **"Add project"** (Proje ekle) butonuna tıklayın
2. **Proje adı** girin: `hasene-arapca-dersi` (veya istediğiniz bir isim)
3. **"Continue"** (Devam) butonuna tıklayın
4. **Google Analytics** seçeneği:
   - İsterseniz açabilirsiniz (isteğe bağlı)
   - Veya **"Not now"** (Şimdi değil) seçeneğini seçin
5. **"Create project"** (Proje oluştur) butonuna tıklayın
6. Proje oluşturulmasını bekleyin (10-30 saniye sürebilir)
7. **"Continue"** butonuna tıklayın

### Kontrol:
- ✅ Proje oluşturuldu ve Firebase Console'da projenizi görüyorsanız → **ADIM 3'e geçin**

---

## 📋 ADIM 3: Web App Ekleyin ve Config Alın

### Ne Yapmalısınız:

1. Firebase Console'da projenizin ana sayfasında **"</>"** (Web) ikonuna tıklayın
   - Veya sol üstteki **"Add app"** butonuna tıklayıp **"Web"** seçin

2. **App nickname** girin: `Hasene Web App` (veya istediğiniz bir isim)

3. **"Register app"** (Uygulamayı kaydet) butonuna tıklayın

4. Firebase size bir **config kodu** gösterecek. Şu şekilde görünecek:

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

5. **Bu config'i kopyalayın!** (Tüm değerleri seçip Ctrl+C veya Cmd+C)

6. **"Continue to console"** (Konsola devam et) butonuna tıklayın

### Kontrol:
- ✅ Config'i kopyaladınız mı? → **ADIM 4'e geçin**

---

## 📋 ADIM 4: Config'i Projeye Ekleyin

### Ne Yapmalısınız:

1. Projenizde `js/firebase-config.js` dosyasını açın

2. Dosyada şu satırları bulun:

```javascript
const FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

3. Firebase Console'dan kopyaladığınız config değerlerini buraya yapıştırın:

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

4. Dosyayı kaydedin (Ctrl+S veya Cmd+S)

### Kontrol:
- ✅ Config değerlerini güncellediniz mi? → **ADIM 5'e geçin**

---

## 📋 ADIM 5: Firebase Authentication'ı Açın

### Ne Yapmalısınız:

1. Firebase Console'da sol menüden **"Authentication"** (Kimlik Doğrulama) seçin
   - İkon: 🔐 (kilit simgesi)

2. **"Get started"** (Başlayın) butonuna tıklayın (ilk kez açıyorsanız)

3. Üst menüden **"Sign-in method"** (Giriş yöntemi) sekmesine tıklayın

4. **"Email/Password"** satırını bulun ve üzerine tıklayın

5. Açılan pencerede:
   - **"Enable"** (Etkinleştir) toggle'ını **AÇIK** yapın
   - **"Email link (passwordless sign-in)"** seçeneğini **KAPALI** bırakın (şimdilik)
   - **"Save"** (Kaydet) butonuna tıklayın

6. ✅ **"Email/Password"** artık **Enabled** (Etkin) görünmeli

### Kontrol:
- ✅ Email/Password provider'ı açık mı? → **ADIM 6'ya geçin**

---

## 📋 ADIM 6: Firestore Database Oluşturun

### Ne Yapmalısınız:

1. Firebase Console'da sol menüden **"Firestore Database"** seçin
   - İkon: 🗄️ (veritabanı simgesi)

2. **"Create database"** (Veritabanı oluştur) butonuna tıklayın

3. **Güvenlik kuralları** seçimi:
   - **"Start in test mode"** (Test modunda başlat) seçin
   - ⚠️ **NOT**: Test modu 30 gün sonra otomatik kapanır, production için kurallar eklemeniz gerekecek
   - **"Next"** (İleri) butonuna tıklayın

4. **Cloud Firestore location** (Konum) seçin:
   - Size en yakın konumu seçin (örn: `europe-west` veya `us-central`)
   - **"Enable"** (Etkinleştir) butonuna tıklayın

5. Veritabanı oluşturulmasını bekleyin (10-30 saniye)

### Kontrol:
- ✅ Firestore Database oluşturuldu mu? → **ADIM 7'ye geçin**

---

## 📋 ADIM 7: Firestore Güvenlik Kuralları (ÖNEMLİ!)

### Ne Yapmalısınız:

1. Firestore Database sayfasında üst menüden **"Rules"** (Kurallar) sekmesine tıklayın

2. Mevcut kuralları silin ve şu kuralları yapıştırın:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Kullanıcı profilleri
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Kullanıcı istatistikleri
    match /user_stats/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Kelime istatistikleri
    match /word_stats/{docId} {
      allow read, write: if request.auth != null && resource.data.user_id == request.auth.uid;
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
    match /favorites/{docId} {
      allow read, write: if request.auth != null && resource.data.user_id == request.auth.uid;
    }
    
    // Başarımlar
    match /achievements/{docId} {
      allow read, write: if request.auth != null && resource.data.user_id == request.auth.uid;
    }
    
    // Rozetler
    match /badges/{docId} {
      allow read, write: if request.auth != null && resource.data.user_id == request.auth.uid;
    }
  }
}
```

3. **"Publish"** (Yayınla) butonuna tıklayın

4. ✅ Kurallar yayınlandı mesajını görmelisiniz

### Kontrol:
- ✅ Güvenlik kuralları yayınlandı mı? → **ADIM 8'e geçin**

---

## 📋 ADIM 8: Test Edin

### Ne Yapmalısınız:

1. Projenizi bir web sunucusu ile çalıştırın (VS Code Live Server veya Python http.server)

2. Tarayıcı konsolunu açın (F12 veya Ctrl+Shift+I)

3. Şu mesajları görmelisiniz:
   - ✅ `Firebase başlatıldı: [proje-id]`
   - ✅ `Firebase modülleri yüklendi`

4. Uygulamada **"Giriş Yap"** butonuna tıklayın

5. Yeni bir hesap oluşturmayı deneyin:
   - Email: `test@example.com`
   - Şifre: `test123456`
   - **"Kayıt Ol"** butonuna tıklayın

6. ✅ Kayıt başarılı olmalı ve Firebase Console > Authentication > Users bölümünde kullanıcı görünmeli

### Kontrol:
- ✅ Kullanıcı kaydı başarılı mı? → **TAMAMLANDI! 🎉**

---

## 📋 ADIM 9: (İsteğe Bağlı) Google Login Ekleyin

### Ne Yapmalısınız:

1. Firebase Console > Authentication > Sign-in method

2. **"Google"** satırını bulun ve üzerine tıklayın

3. **"Enable"** toggle'ını açın

4. **"Project support email"** seçin (Firebase projenizin email'i)

5. **"Save"** (Kaydet) butonuna tıklayın

6. ✅ Google login artık kullanılabilir!

---

## 📋 ADIM 10: (İsteğe Bağlı) Firebase Hosting ile Yayınlayın

### Ne Yapmalısınız:

1. Terminal/Command Prompt açın

2. Firebase CLI'yi kurun:
```bash
npm install -g firebase-tools
```

3. Firebase'e giriş yapın:
```bash
firebase login
```
- Tarayıcı açılacak, Google hesabınızla giriş yapın

4. Proje klasörünüze gidin:
```bash
cd c:\Users\ziyao\Desktop\DENEME_HASENE
```

5. Firebase Hosting'i başlatın:
```bash
firebase init hosting
```

6. Sorulara cevap verin:
   - **"Use an existing project"** seçin
   - Projenizi seçin (`hasene-arapca-dersi`)
   - **"What do you want to use as your public directory?"** → `./` yazın
   - **"Configure as a single-page app?"** → `Yes` yazın
   - **"Set up automatic builds and deploys with GitHub?"** → `No` yazın
   - **"File ./index.html already exists. Overwrite?"** → `No` yazın

7. Projeyi yayınlayın:
```bash
firebase deploy --only hosting
```

8. ✅ Yayınlama tamamlandığında size bir URL verilecek (örn: `https://hasene-arapca-dersi.web.app`)

---

## ✅ TAMAMLANDI!

Firebase kurulumu başarıyla tamamlandı! Artık uygulamanız:
- ✅ Firebase Authentication kullanıyor
- ✅ Firestore Database'e veri kaydediyor
- ✅ (İsteğe bağlı) Firebase Hosting'de yayınlanıyor

---

## 🔧 Sorun mu Yaşıyorsunuz?

### Firebase başlatılmıyor
- Tarayıcı konsolunu kontrol edin (F12)
- `firebase-config.js` dosyasındaki config değerlerinin doğru olduğundan emin olun
- Sayfayı hard refresh yapın (Ctrl+Shift+R)

### Authentication çalışmıyor
- Firebase Console > Authentication > Sign-in method'da Email/Password'un açık olduğundan emin olun
- Tarayıcı konsolunda hata mesajlarını kontrol edin

### Firestore erişim hatası
- Firestore Database'in oluşturulduğundan emin olun
- Güvenlik kurallarının yayınlandığından emin olun
- Test modunda çalışıyorsanız 30 gün sonra otomatik kapanır

---

## 📞 Yardım

Daha fazla yardım için:
- [Firebase Dokümantasyonu](https://firebase.google.com/docs)
- `docs/FIREBASE_KURULUM.md` dosyasına bakın
