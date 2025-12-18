# 🏆 Liderlik Tablosu Debug Rehberi

## ✅ Yapılan Düzeltmeler

### 1. `endGame()` İçinde `updateWeeklyXP()` Eklendi
- `endGame()` fonksiyonunda `sessionScore` ile `updateWeeklyXP()` çağrılıyor
- Her oyun bitişinde haftalık XP Firebase'e kaydediliyor

### 2. `getUserLeaguePosition()` Debug Logları Eklendi
- Kullanıcı bilgileri loglanıyor
- Document ID formatı loglanıyor
- Firebase'den gelen veri loglanıyor

### 3. Document ID Formatı Düzeltildi
- `updateWeeklyXP()` ve `getUserLeaguePosition()` aynı formatı kullanıyor
- Hem `username` hem `user_id` ile deneme yapılıyor

---

## 🔍 Debug Komutları

### Browser Console'da Test Edin:

```javascript
// 1. Haftalık XP'yi kontrol edin
const weekStart = window.getWeekStart();
const weekStartStr = weekStart.toISOString().split('T')[0];
console.log('Hafta başlangıcı:', weekStartStr);

// 2. Kullanıcı bilgilerini kontrol edin
const user = await window.getCurrentUser();
console.log('Kullanıcı:', user);

// 3. Firebase'de haftalık XP'yi kontrol edin
const docId = user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500);
const leaderboardDocId = `${docId}_${weekStartStr}`;
const data = await window.firestoreGet('weekly_leaderboard', leaderboardDocId);
console.log('Firebase haftalık XP:', data);

// 4. Kullanıcı pozisyonunu kontrol edin
const position = await window.getUserLeaguePosition();
console.log('Kullanıcı pozisyonu:', position);
```

---

## 🚀 Test Adımları

1. **Oyun oynayın** (en az 1 soru cevaplayın)
2. **Browser Console'u açın** (F12)
3. **Console'da şunu çalıştırın:**
```javascript
const position = await window.getUserLeaguePosition();
console.log('Pozisyon:', position);
```
4. **Liderlik tablosunu açın** ve kontrol edin

---

## ⚠️ Önemli Notlar

1. **Haftalık XP**: Her oyun bitişinde `sessionScore` ile güncellenir
2. **Document ID**: `{username}_{weekStart}` formatında
3. **Debug Logları**: Console'da detaylı loglar görünecek

---

## 🔧 Sorun Giderme

### Hala "Henüz bu hafta oyun oynamadınız" görünüyorsa?

1. **Browser Console'u açın** (F12)
2. **Console'da hata var mı kontrol edin**
3. **Debug komutlarını çalıştırın** (yukarıdaki)
4. **Firebase Console'da `weekly_leaderboard` collection'ını kontrol edin**

### Firebase'de veri var ama görünmüyorsa?

1. **Document ID formatını kontrol edin**
2. **Hafta başlangıcı doğru mu kontrol edin**
3. **Kullanıcı adı doğru mu kontrol edin**

---

## ✅ Başarı Kontrolü

1. **Oyun oynayın**
2. **Browser Console'da logları kontrol edin**
3. **Firebase Console'da `weekly_leaderboard` collection'ını kontrol edin**
4. **Liderlik tablosunu açın ve pozisyonunuzu görün**

Başarılar! 🎉
