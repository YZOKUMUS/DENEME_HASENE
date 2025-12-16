# 🔧 Firebase Config Nasıl Eklenir? - Çok Basit Anlatım

## 📍 ADIM 3A: Firebase Console'dan Config'i Alın

### 1️⃣ Firebase Console'a Gidin
- Tarayıcınızda [https://console.firebase.google.com/](https://console.firebase.google.com/) adresine gidin
- Google hesabınızla giriş yapın

### 2️⃣ Projenizi Seçin
- Eğer proje oluşturduysanız, projenizin adına tıklayın
- Eğer henüz proje oluşturmadıysanız, önce "Add project" ile proje oluşturun

### 3️⃣ Web App Ekleyin
- Firebase Console'da projenizin ana sayfasında **"</>"** (Web) ikonunu bulun
- Bu ikona tıklayın
- VEYA sol üstteki **"Add app"** butonuna tıklayıp **"Web"** seçin

### 4️⃣ App Nickname Girin
- Açılan pencerede **"App nickname"** kısmına bir isim yazın (örn: `Hasene Web App`)
- **"Register app"** (Uygulamayı kaydet) butonuna tıklayın

### 5️⃣ Config Kodunu Görün
- Firebase size şöyle bir kod gösterecek:

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

### 6️⃣ Config'i Kopyalayın
- Tüm kodu seçin (fare ile sürükleyerek veya Ctrl+A ile)
- **Ctrl+C** (veya Cmd+C) ile kopyalayın
- **"Continue to console"** butonuna tıklayın

---

## 📍 ADIM 3B: Config'i Projeye Ekleyin

### Yöntem 1: Bana Gönderin, Ben Ekleyeyim (KOLAY)

1. Firebase Console'dan kopyaladığınız config kodunu buraya yapıştırın
2. Bana gönderin
3. Ben `js/firebase-config.js` dosyasını güncelleyeceğim

**Örnek:**
```
apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
authDomain: "hasene-arapca-dersi.firebaseapp.com"
projectId: "hasene-arapca-dersi"
storageBucket: "hasene-arapca-dersi.appspot.com"
messagingSenderId: "123456789012"
appId: "1:123456789012:web:abcdefghijklmnop"
```

### Yöntem 2: Kendiniz Ekleyin (MANUEL)

1. Projenizde `js/firebase-config.js` dosyasını açın (VS Code veya başka bir editörle)

2. Dosyada 7-14. satırları bulun:

```javascript
const FIREBASE_CONFIG = {
    apiKey: window.FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: window.FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: window.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
    storageBucket: window.FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
    appId: window.FIREBASE_APP_ID || "YOUR_APP_ID"
};
```

3. Firebase Console'dan aldığınız değerleri buraya yapıştırın:

**ÖNCE (şu anki hali):**
```javascript
apiKey: window.FIREBASE_API_KEY || "YOUR_API_KEY",
```

**SONRA (Firebase'den aldığınız değerle değiştirin):**
```javascript
apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
```

**Tüm değerleri değiştirin:**
- `"YOUR_API_KEY"` → Firebase'den aldığınız `apiKey` değeri
- `"YOUR_PROJECT_ID.firebaseapp.com"` → Firebase'den aldığınız `authDomain` değeri
- `"YOUR_PROJECT_ID"` → Firebase'den aldığınız `projectId` değeri
- `"YOUR_PROJECT_ID.appspot.com"` → Firebase'den aldığınız `storageBucket` değeri
- `"YOUR_MESSAGING_SENDER_ID"` → Firebase'den aldığınız `messagingSenderId` değeri
- `"YOUR_APP_ID"` → Firebase'den aldığınız `appId` değeri

4. Dosyayı kaydedin (Ctrl+S veya Cmd+S)

---

## ✅ Kontrol

Config'i doğru eklediğinizden emin olmak için:

1. `js/firebase-config.js` dosyasını açın
2. `"YOUR_API_KEY"`, `"YOUR_PROJECT_ID"` gibi placeholder değerlerin kalmadığından emin olun
3. Tüm değerlerin tırnak işaretleri içinde olduğundan emin olun

**Örnek doğru config:**
```javascript
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "hasene-arapca-dersi.firebaseapp.com",
    projectId: "hasene-arapca-dersi",
    storageBucket: "hasene-arapca-dersi.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdefghijklmnop"
};
```

---

## 🆘 Yardım

Eğer hala anlamadıysanız:
1. Firebase Console'dan config'i kopyalayın
2. Buraya yapıştırın
3. Ben sizin için ekleyeceğim!
