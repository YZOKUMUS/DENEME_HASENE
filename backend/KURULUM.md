# 🚀 Hasene Backend Kurulum Rehberi

## Seçenek 1: Supabase (ÖNERİLEN - En Kolay ve Ücretsiz)

### Adım 1: Supabase Hesabı Oluştur
1. https://supabase.com adresine git
2. "Start your project" butonuna tıkla
3. GitHub ile giriş yap (ücretsiz)
4. Yeni proje oluştur:
   - Project name: `hasene-game`
   - Database Password: Güçlü bir şifre seç
   - Region: En yakın bölgeyi seç (örn: `Europe West`)

### Adım 2: Database Schema Oluştur
1. Supabase Dashboard'da "SQL Editor" sekmesine git
2. `supabase-setup.sql` dosyasının içeriğini kopyala
3. SQL Editor'e yapıştır ve "Run" butonuna tıkla
4. Tüm tablolar oluşturulacak ✅

### Adım 3: API Key'leri Al
1. Supabase Dashboard'da "Settings" > "API" sekmesine git
2. Şu bilgileri kopyala:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (uzun bir key)

### Adım 4: Frontend'e Entegre Et
1. Proje kök dizininde `.env` dosyası oluştur:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

2. `index.html` dosyasına Supabase script ekle (zaten `api-service.js` içinde var)

3. `index.html` içinde `api-service.js` dosyasını yükle:
```html
<script src="js/api-service.js"></script>
```

### Adım 5: Authentication Ayarla
1. Supabase Dashboard'da "Authentication" > "Providers" sekmesine git
2. İstediğin provider'ları aktif et:
   - ✅ Email (varsayılan aktif)
   - ✅ Google (OAuth için)
   - ✅ GitHub (OAuth için)

### Adım 6: Test Et
1. Uygulamayı aç
2. Kayıt ol / Giriş yap
3. Verilerin Supabase'de göründüğünü kontrol et

---

## Seçenek 2: Firebase (Alternatif)

### Adım 1: Firebase Hesabı Oluştur
1. https://firebase.google.com adresine git
2. "Get started" butonuna tıkla
3. Google hesabıyla giriş yap
4. Yeni proje oluştur: `hasene-game`

### Adım 2: Firebase Configuration
1. Firebase Console'da "Project Settings" > "General" sekmesine git
2. "Your apps" bölümünde web uygulaması ekle (</> ikonu)
3. Config bilgilerini kopyala

### Adım 3: Firestore Database Oluştur
1. Firebase Console'da "Firestore Database" sekmesine git
2. "Create database" butonuna tıkla
3. Test mode'da başla (güvenlik kuralları sonra ayarlanacak)
4. Location seç (örn: `europe-west`)

### Adım 4: Frontend'e Entegre Et
1. `.env` dosyasına Firebase config ekle:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

2. Firebase SDK'yı yükle:
```html
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"></script>
```

---

## Seçenek 3: MongoDB Atlas + Express.js (Gelişmiş)

### Adım 1: MongoDB Atlas Hesabı
1. https://www.mongodb.com/cloud/atlas adresine git
2. Ücretsiz hesap oluştur
3. Free tier cluster oluştur (M0)
4. Database user oluştur
5. Network Access'te IP adresini ekle (0.0.0.0/0 = tüm IP'ler)

### Adım 2: Express.js Backend Oluştur
1. `backend/express-backend/` klasörüne bak
2. `npm install` çalıştır
3. `.env` dosyasını düzenle
4. `npm start` ile başlat

### Adım 3: Deploy (Vercel/Railway)
1. Vercel: https://vercel.com
2. Railway: https://railway.app
3. Her ikisi de ücretsiz tier sunuyor

---

## 🔒 Güvenlik Notları

### Supabase RLS (Row Level Security)
- ✅ Zaten aktif! Kullanıcılar sadece kendi verilerini görebilir
- ✅ Policies otomatik oluşturuldu

### Firebase Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 📊 Ücretsiz Limitler

### Supabase
- ✅ 500MB Database
- ✅ 2GB Bandwidth/ay
- ✅ 50,000 Monthly Active Users
- ✅ Unlimited API requests

### Firebase
- ✅ 1GB Storage
- ✅ 10GB Bandwidth/ay
- ✅ 50,000 Reads/day
- ✅ 20,000 Writes/day

### MongoDB Atlas
- ✅ 512MB Storage
- ✅ Shared RAM
- ✅ Unlimited Connections

---

## 🎯 Sonraki Adımlar

1. ✅ Backend seç ve kur
2. ✅ Frontend'i backend'e bağla
3. ✅ Authentication ekle
4. ✅ Verileri migrate et (mevcut kullanıcılar için)
5. ✅ Liderlik tablosu ekle
6. ✅ Real-time özellikler ekle (isteğe bağlı)

