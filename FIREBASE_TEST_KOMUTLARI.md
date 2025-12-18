# 🔥 Firebase Collection Test Komutları

## ✅ Ad Blocker Kapalı - Şimdi Test Edelim!

### 1️⃣ Browser Console'u Açın
- **F12** tuşuna basın
- **Console** sekmesine gidin

### 2️⃣ Kullanıcı Kontrolü
```javascript
// Kullanıcı bilgilerini kontrol edin
const user = await window.getCurrentUser();
console.log('Kullanıcı:', user);
```

**Beklenen çıktı:**
```
Kullanıcı: {id: "YZOKUMUS", username: "YZOKUMUS", email: "YZOKUMUS@local"}
```

### 3️⃣ Otomatik Collection Oluşturma
```javascript
// Collection'ları otomatik oluşturun
await window.autoCreateCollections();
```

**Beklenen çıktı:**
```
✅ user_stats collection'ı otomatik oluşturuldu
✅ user_reports collection'ı otomatik oluşturuldu
✅ user_achievements collection'ı otomatik oluşturuldu
```

### 4️⃣ Manuel Collection Oluşturma (Eğer Otomatik Çalışmazsa)
```javascript
// Tüm collection'ları manuel oluşturun
await createAllCollections();
```

**Beklenen çıktı:**
```
✅ users oluşturuldu
✅ user_stats oluşturuldu
✅ user_reports oluşturuldu
✅ user_achievements oluşturuldu
✅ daily_tasks oluşturuldu
✅ weekly_tasks oluşturuldu
```

### 5️⃣ Firebase Bağlantı Testi
```javascript
// Firebase bağlantısını test edin
const auth = window.getFirebaseAuth();
const db = window.getFirebaseDb();
console.log('Firebase Auth:', auth ? '✅ Bağlı' : '❌ Bağlı değil');
console.log('Firebase DB:', db ? '✅ Bağlı' : '❌ Bağlı değil');
```

### 6️⃣ Collection Kontrolü
```javascript
// Collection'ları kontrol edin
const user = await window.getCurrentUser();
const docId = user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500);

const collections = ['users', 'user_stats', 'user_reports', 'user_achievements', 'daily_tasks'];
for (const collection of collections) {
    const data = await window.firestoreGet(collection, docId);
    console.log(`${collection}:`, data ? '✅ Var' : '❌ Yok');
}
```

### 7️⃣ Hata Kontrolü
```javascript
// Console'da ERR_BLOCKED_BY_CLIENT hatası var mı kontrol edin
// Eğer görünmüyorsa → ✅ Başarılı!
// Eğer görünüyorsa → ❌ Ad blocker hala açık
```

---

## 🚀 Hızlı Test (Tek Komut)

Browser Console'da şunu çalıştırın:

```javascript
(async () => {
    console.log('🔥 Firebase Test Başlatılıyor...\n');
    
    // 1. Kullanıcı kontrolü
    const user = await window.getCurrentUser();
    console.log('1️⃣ Kullanıcı:', user ? '✅ ' + user.username : '❌ Yok');
    
    if (!user || user.id.startsWith('local-')) {
        console.error('❌ Firebase\'de giriş yapmamışsınız!');
        return;
    }
    
    // 2. Firebase bağlantı kontrolü
    const auth = window.getFirebaseAuth();
    const db = window.getFirebaseDb();
    console.log('2️⃣ Firebase Auth:', auth ? '✅ Bağlı' : '❌ Bağlı değil');
    console.log('2️⃣ Firebase DB:', db ? '✅ Bağlı' : '❌ Bağlı değil');
    
    // 3. Collection'ları oluştur
    console.log('\n3️⃣ Collection\'lar oluşturuluyor...');
    await window.autoCreateCollections();
    
    // 4. Collection kontrolü
    console.log('\n4️⃣ Collection\'lar kontrol ediliyor...');
    const docId = user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500);
    const collections = ['users', 'user_stats', 'user_reports', 'user_achievements'];
    
    for (const collection of collections) {
        try {
            const data = await window.firestoreGet(collection, docId);
            console.log(`   ${collection}:`, data ? '✅ Var' : '❌ Yok');
        } catch (error) {
            console.log(`   ${collection}: ❌ Hata - ${error.message}`);
        }
    }
    
    console.log('\n✅ Test tamamlandı!');
    console.log('💡 Firebase Console\'u yenileyin (F5) ve collection\'ları kontrol edin!');
})();
```

---

## 📊 Beklenen Sonuçlar

### ✅ Başarılı Senaryo:
```
🔥 Firebase Test Başlatılıyor...

1️⃣ Kullanıcı: ✅ YZOKUMUS
2️⃣ Firebase Auth: ✅ Bağlı
2️⃣ Firebase DB: ✅ Bağlı

3️⃣ Collection'lar oluşturuluyor...
✅ user_stats collection'ı otomatik oluşturuldu
✅ user_reports collection'ı otomatik oluşturuldu
✅ user_achievements collection'ı otomatik oluşturuldu

4️⃣ Collection'lar kontrol ediliyor...
   users: ✅ Var
   user_stats: ✅ Var
   user_reports: ✅ Var
   user_achievements: ✅ Var

✅ Test tamamlandı!
💡 Firebase Console'u yenileyin (F5) ve collection'ları kontrol edin!
```

### ❌ Hata Senaryosu:
```
1️⃣ Kullanıcı: ❌ Yok
   → Giriş yapmanız gerekiyor!

2️⃣ Firebase Auth: ❌ Bağlı değil
   → Firebase config kontrol edin!

3️⃣ Collection'lar oluşturuluyor...
   ❌ ERR_BLOCKED_BY_CLIENT
   → Ad blocker hala açık!
```

---

## 🎯 Sonraki Adımlar

1. **Browser Console'da test komutunu çalıştırın**
2. **Firebase Console'u açın** (https://console.firebase.google.com)
3. **Firestore Database** → **Data** sekmesine gidin
4. **Collection'ları kontrol edin:**
   - `users`
   - `user_stats`
   - `user_reports`
   - `user_achievements`
   - `daily_tasks`
   - `weekly_tasks`

---

## 🆘 Sorun Giderme

### Collection'lar görünmüyor?
1. **Sayfayı yenileyin** (F5)
2. **Test komutunu tekrar çalıştırın**
3. **Firebase Console'u yenileyin** (F5)

### ERR_BLOCKED_BY_CLIENT hatası görünüyorsa?
1. **Tüm uzantıları kontrol edin** (chrome://extensions/)
2. **Gizli modda test edin** (Ctrl+Shift+N)
3. **Tarayıcıyı yeniden başlatın**

### Firebase bağlantı hatası?
1. **Firebase config'i kontrol edin** (js/firebase-config.js)
2. **Proje ID'sini kontrol edin** (hasene-arapca-dersi)
3. **Firebase Console'da projeyi kontrol edin**
