# 🏆 Liderlik Tablosu Sistemi - Çözüm

## ✅ Yapılan Değişiklikler

### 1. Firebase Entegrasyonu Eklendi
- `updateWeeklyXP()` artık Firebase'e de kaydediyor
- `weekly_leaderboard` collection'ı oluşturuldu
- Firestore rules'a `weekly_leaderboard` eklendi

### 2. Liderlik Tablosu Fonksiyonları Implement Edildi
- `getUserLeaguePosition()` → Firebase'den kullanıcının pozisyonunu getiriyor
- `getLeagueRankings()` → Firebase'den lig sıralamasını getiriyor

### 3. Lig Seviyesi Hesaplama
Lig seviyeleri haftalık XP'ye göre belirleniyor:
- **Mübtedi** (Başlangıç): 0-99 XP
- **Talib**: 100-249 XP
- **Mutavassıt**: 250-499 XP
- **Mütebahhir**: 500-999 XP
- **Hafız**: 1000-1499 XP
- **Kurra**: 1500-1999 XP
- **Alim**: 2000-2999 XP
- **Müctehid**: 3000-3999 XP
- **Muhaddis**: 4000-5999 XP
- **Fakih**: 6000-7999 XP
- **İmam**: 8000-9999 XP
- **Ulema**: 10000+ XP

---

## 🔥 Firebase Collection Yapısı

### `weekly_leaderboard` Collection
- **Document ID**: `{username}_{weekStart}` (örn: `YZOKUMUS_2025-12-16`)
- **İçerik**:
  - `user_id`: Kullanıcı ID'si
  - `username`: Kullanıcı adı
  - `firebase_uid`: Firebase UID
  - `week_start`: Hafta başlangıç tarihi (YYYY-MM-DD)
  - `weekly_xp`: Haftalık XP (Hasene puanı)
  - `updated_at`: Son güncelleme zamanı

---

## 🚀 Nasıl Çalışır?

### 1. Oyun Oynandığında
- Her doğru cevap için puan kazanılır
- `updateWeeklyXP()` çağrılır
- Hem localStorage hem Firebase'e kaydedilir

### 2. Liderlik Tablosu Açıldığında
- `getUserLeaguePosition()` çağrılır
- Kullanıcının haftalık XP'si Firebase'den alınır
- Lig seviyesi hesaplanır
- Pozisyon belirlenir

### 3. Lig Sıralaması Gösterildiğinde
- `getLeagueRankings()` çağrılır
- Aynı ligdeki tüm kullanıcılar getirilir
- XP'ye göre sıralanır
- İlk N kullanıcı gösterilir

---

## 📊 Test

### Browser Console'da Test Edin:

```javascript
// 1. Haftalık XP'yi kontrol edin
const weekStart = window.getWeekStart();
const weekStartStr = weekStart.toISOString().split('T')[0];
console.log('Hafta başlangıcı:', weekStartStr);

// 2. Kullanıcı pozisyonunu kontrol edin
const position = await window.getUserLeaguePosition();
console.log('Kullanıcı pozisyonu:', position);

// 3. Lig sıralamasını kontrol edin
if (position) {
    const rankings = await window.getLeagueRankings(position.league, 20);
    console.log('Lig sıralaması:', rankings);
}
```

---

## ⚠️ Önemli Notlar

1. **Haftalık XP Sıfırlanır**: Her hafta Pazartesi günü sıfırlanır
2. **Lig Seviyesi**: Haftalık XP'ye göre belirlenir (toplam puan değil)
3. **Firebase Gerekli**: Liderlik tablosu Firebase olmadan çalışmaz
4. **Giriş Gerekli**: Liderlik tablosunu görmek için giriş yapmanız gerekir

---

## 🔍 Sorun Giderme

### Liderlik tablosu boş görünüyorsa?
1. **Giriş yaptığınızdan emin olun**
2. **Bu hafta oyun oynadığınızdan emin olun**
3. **Firebase Console'da `weekly_leaderboard` collection'ını kontrol edin**

### Pozisyon görünmüyorsa?
1. **Browser Console'da hata var mı kontrol edin**
2. **Firebase bağlantısını kontrol edin**
3. **Ad blocker'ın kapalı olduğundan emin olun**

---

## ✅ Başarı Kontrolü

1. **Oyun oynayın** (en az 1 soru cevaplayın)
2. **Liderlik tablosunu açın**
3. **Kendi pozisyonunuzu görün**
4. **Lig sıralamasını görün**

Başarılar! 🎉
