# 🔥 Firebase ERR_BLOCKED_BY_CLIENT Hatası - Çözüm

## ❌ Sorun
```
net::ERR_BLOCKED_BY_CLIENT
POST https://firestore.googleapis.com/.../Write/channel?... 
```

Bu hata, **tarayıcı uzantıları** (özellikle ad blocker'lar) Firebase isteklerini engelliyor demektir.

## ✅ Çözüm

### Yöntem 1: Ad Blocker'ı Devre Dışı Bırakın (ÖNERİLEN)

**Chrome/Edge:**
1. Tarayıcı uzantılarını açın (`chrome://extensions/` veya `edge://extensions/`)
2. Ad blocker uzantılarını bulun (uBlock Origin, AdBlock Plus, vb.)
3. Bu site için **devre dışı bırakın** veya **whitelist'e ekleyin**

**Firefox:**
1. Uzantıları açın (`about:addons`)
2. Ad blocker'ı bulun
3. Bu site için devre dışı bırakın

### Yöntem 2: Firebase Domain'lerini Whitelist'e Ekleyin

Ad blocker ayarlarına şu domain'leri ekleyin:
```
firestore.googleapis.com
firebase.googleapis.com
*.firebaseapp.com
*.firebasestorage.app
```

### Yöntem 3: Gizli Modda Test Edin

Gizli modda (Incognito/Private) test edin - uzantılar genellikle gizli modda çalışmaz.

### Yöntem 4: Tarayıcı Uzantılarını Geçici Olarak Kapatın

1. Tüm uzantıları geçici olarak kapatın
2. Sayfayı yenileyin (F5)
3. Firebase Console'u kontrol edin

---

## 🔍 Hangi Uzantılar Sorun Olabilir?

- **uBlock Origin**
- **AdBlock Plus**
- **AdGuard**
- **Privacy Badger**
- **Ghostery**
- **NoScript** (Firebase script'lerini engelliyor olabilir)

---

## ✅ Test

1. **Ad blocker'ı kapatın**
2. **Sayfayı yenileyin** (F5)
3. **Oyun oynayın** veya **`createAllCollections()` çalıştırın**
4. **Firebase Console'u kontrol edin**

---

## 💡 Kalıcı Çözüm

Eğer ad blocker kullanmak istiyorsanız, Firebase domain'lerini **whitelist'e ekleyin**:

**uBlock Origin için:**
1. uBlock Origin ikonuna tıklayın
2. "Power mode" butonuna tıklayın
3. `firestore.googleapis.com` ve `firebase.googleapis.com` için yeşil yapın

**AdBlock Plus için:**
1. AdBlock Plus ayarlarını açın
2. "Whitelisted domains" bölümüne ekleyin:
   - `firestore.googleapis.com`
   - `firebase.googleapis.com`

---

## ⚠️ Önemli Not

Bu hata **sadece görünürlüğü etkilemez**, aynı zamanda:
- ❌ Collection'lar oluşturulamaz
- ❌ Veriler kaydedilemez
- ❌ Real-time güncellemeler çalışmaz

Bu yüzden **mutlaka çözülmesi gerekir**!
