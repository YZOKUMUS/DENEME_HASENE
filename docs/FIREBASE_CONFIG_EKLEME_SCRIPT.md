# 🔧 Firebase Config Otomatik Ekleme

Firebase Console'dan config'i aldıktan sonra, buraya yapıştırın ve ben otomatik olarak `js/firebase-config.js` dosyasını güncelleyeceğim.

## 📋 Config Formatı

Firebase Console'dan aldığınız config şu şekilde olmalı:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "proje-id.firebaseapp.com",
  projectId: "proje-id",
  storageBucket: "proje-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

VEYA sadece değerleri:

```
apiKey: "AIzaSy..."
authDomain: "proje-id.firebaseapp.com"
projectId: "proje-id"
storageBucket: "proje-id.appspot.com"
messagingSenderId: "123456789"
appId: "1:123456789:web:abc123"
```

## ✅ Yapmanız Gerekenler

1. Firebase Console'da proje oluşturun (veya mevcut projeyi kullanın)
2. Web app ekleyin ve config'i kopyalayın
3. Config'i buraya yapıştırın
4. Ben dosyayı güncelleyeceğim
