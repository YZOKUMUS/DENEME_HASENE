# 🚫 Ad Blocker Kapatma Rehberi - Adım Adım

## 📋 Hangi Tarayıcıyı Kullanıyorsunuz?

- [Chrome](#chrome-ad-blocker-kapatma)
- [Microsoft Edge](#edge-ad-blocker-kapatma)
- [Firefox](#firefox-ad-blocker-kapatma)

---

## 🌐 Chrome - Ad Blocker Kapatma

### Yöntem 1: Uzantıları Tamamen Kapatma

1. **Chrome'u açın**
2. **Adres çubuğuna yazın:** `chrome://extensions/`
   - Veya: **3 nokta menü** (sağ üst) → **Uzantılar** → **Uzantıları yönet**
3. **Ad blocker'ı bulun:**
   - `uBlock Origin`
   - `AdBlock Plus`
   - `AdBlock`
   - `AdGuard`
   - Diğer ad blocker'lar
4. **Toggle'ı kapatın** (mavi → gri)
   - Veya **Kaldır** butonuna tıklayın
5. **Sayfayı yenileyin** (F5)

### Yöntem 2: Bu Site İçin Devre Dışı Bırakma

1. **Ad blocker ikonuna tıklayın** (tarayıcı çubuğunda)
2. **"Bu sitede devre dışı bırak"** seçeneğini bulun
3. **Aktif edin**

### Yöntem 3: uBlock Origin - Power Mode

1. **uBlock Origin ikonuna tıklayın**
2. **"Power mode"** butonuna tıklayın (⚡)
3. **Firebase domain'lerini yeşil yapın:**
   - `firestore.googleapis.com` → Yeşil
   - `firebase.googleapis.com` → Yeşil
4. **Sayfayı yenileyin** (F5)

---

## 🌐 Microsoft Edge - Ad Blocker Kapatma

### Yöntem 1: Uzantıları Tamamen Kapatma

1. **Edge'i açın**
2. **Adres çubuğuna yazın:** `edge://extensions/`
   - Veya: **3 nokta menü** (sağ üst) → **Uzantılar**
3. **Ad blocker'ı bulun**
4. **Toggle'ı kapatın** (mavi → gri)
5. **Sayfayı yenileyin** (F5)

### Yöntem 2: Bu Site İçin Devre Dışı Bırakma

1. **Ad blocker ikonuna tıklayın**
2. **"Bu sitede devre dışı bırak"** seçeneğini bulun
3. **Aktif edin**

---

## 🦊 Firefox - Ad Blocker Kapatma

### Yöntem 1: Uzantıları Tamamen Kapatma

1. **Firefox'u açın**
2. **Adres çubuğuna yazın:** `about:addons`
   - Veya: **3 çizgi menü** (sağ üst) → **Uzantılar**
3. **Ad blocker'ı bulun**
4. **"Devre dışı bırak"** butonuna tıklayın
5. **Sayfayı yenileyin** (F5)

### Yöntem 2: Bu Site İçin Devre Dışı Bırakma

1. **Ad blocker ikonuna tıklayın**
2. **"Bu sitede devre dışı bırak"** seçeneğini bulun
3. **Aktif edin**

---

## 🔍 Hangi Ad Blocker'ı Kullanıyorsunuz?

### Popüler Ad Blocker'lar:

1. **uBlock Origin** ⭐ (En popüler)
   - İkon: Kırmızı kalkan
   - Kapatma: `chrome://extensions/` → Toggle kapat

2. **AdBlock Plus**
   - İkon: Kırmızı "ABP" yazısı
   - Kapatma: `chrome://extensions/` → Toggle kapat

3. **AdBlock**
   - İkon: Kırmızı "AB" yazısı
   - Kapatma: `chrome://extensions/` → Toggle kapat

4. **AdGuard**
   - İkon: Kalkan simgesi
   - Kapatma: `chrome://extensions/` → Toggle kapat

5. **Privacy Badger**
   - İkon: Porsuk simgesi
   - Kapatma: `chrome://extensions/` → Toggle kapat

---

## ✅ Hızlı Test - Ad Blocker Kapalı mı?

1. **Browser Console'u açın** (F12)
2. **Console sekmesine gidin**
3. **Şunu yazın:**
```javascript
console.log('Ad blocker test');
```
4. **Eğer hata görünmüyorsa** → Ad blocker kapalı ✅
5. **Eğer `ERR_BLOCKED_BY_CLIENT` hatası görünüyorsa** → Ad blocker hala açık ❌

---

## 🎯 Firebase İçin Özel Ayarlar

### uBlock Origin - Firebase Domain'lerini Whitelist'e Ekleme

1. **uBlock Origin ikonuna tıklayın**
2. **Ayarlar ikonuna tıklayın** (⚙️)
3. **"Filter lists"** sekmesine gidin
4. **"Custom"** bölümüne şunları ekleyin:
```
@@||firestore.googleapis.com^
@@||firebase.googleapis.com^
@@||*.firebaseapp.com^
@@||*.firebasestorage.app^
```
5. **"Apply changes"** butonuna tıklayın
6. **Sayfayı yenileyin** (F5)

### AdBlock Plus - Firebase Domain'lerini Whitelist'e Ekleme

1. **AdBlock Plus ikonuna tıklayın**
2. **"Options"** → **"Whitelisted domains"**
3. **Şunları ekleyin:**
   - `firestore.googleapis.com`
   - `firebase.googleapis.com`
   - `*.firebaseapp.com`
   - `*.firebasestorage.app`
4. **"Save"** butonuna tıklayın
5. **Sayfayı yenileyin** (F5)

---

## 🚀 Test Adımları

### 1. Ad Blocker'ı Kapatın
- Yukarıdaki talimatları takip edin

### 2. Sayfayı Yenileyin
- **F5** tuşuna basın
- Veya **Ctrl+R** (Windows) / **Cmd+R** (Mac)

### 3. Giriş Yapın
- YZOKUMUS ile giriş yapın

### 4. Browser Console'u Açın
- **F12** tuşuna basın
- **Console** sekmesine gidin

### 5. Hata Kontrolü
- **Eğer `ERR_BLOCKED_BY_CLIENT` hatası görünmüyorsa** → ✅ Başarılı!
- **Eğer hala görünüyorsa** → ❌ Ad blocker hala açık, tekrar kontrol edin

### 6. Firebase Console'u Kontrol Edin
- Firebase Console'u açın
- **Firestore Database** → **Data** sekmesine gidin
- Collection'ları kontrol edin

---

## 💡 İpucu: Gizli Modda Test

Eğer ad blocker'ı kapatmak istemiyorsanız:

1. **Gizli mod açın:**
   - Chrome: **Ctrl+Shift+N** (Windows) / **Cmd+Shift+N** (Mac)
   - Edge: **Ctrl+Shift+N** (Windows) / **Cmd+Shift+N** (Mac)
   - Firefox: **Ctrl+Shift+P** (Windows) / **Cmd+Shift+P** (Mac)

2. **Gizli modda uzantılar genellikle çalışmaz**
3. **Oyunu gizli modda test edin**

---

## ⚠️ Önemli Notlar

- Ad blocker'ı kapatmak **güvenlik riski oluşturmaz** - sadece reklamları engellemez
- Firebase domain'leri **güvenli** ve **güvenilir** domain'lerdir
- Sadece **bu site için** devre dışı bırakabilirsiniz (tüm siteler için değil)

---

## 🆘 Hala Çalışmıyor mu?

1. **Tüm uzantıları kapatın** (geçici olarak)
2. **Tarayıcıyı yeniden başlatın**
3. **Cache'i temizleyin:**
   - Chrome: **Ctrl+Shift+Delete** → **Cached images and files** → **Clear data**
4. **Hard refresh yapın:**
   - **Ctrl+Shift+R** (Windows) / **Cmd+Shift+R** (Mac)

---

## ✅ Başarı Kontrolü

Ad blocker kapandıktan sonra:

1. **Browser Console'da** `ERR_BLOCKED_BY_CLIENT` hatası görünmemeli
2. **Firebase Console'da** collection'lar görünmeli
3. **Oyun oynadığınızda** veriler Firebase'e kaydedilmeli

Başarılar! 🎉
