# 🏆 Liderlik Tablosu Test Komutları

## 🔍 Sorun: "Bu hafta oyun oynamamış veya veri yok"

### Browser Console'da Şunu Çalıştırın:

```javascript
(async () => {
    console.log('🔥 Liderlik Tablosu Debug Test Başlatılıyor...\n');
    
    // 1. Kullanıcı bilgilerini kontrol edin
    const user = await window.getCurrentUser();
    console.log('1️⃣ Kullanıcı:', user);
    
    if (!user || user.id.startsWith('local-')) {
        console.error('❌ Firebase\'de giriş yapmamışsınız!');
        return;
    }
    
    // 2. Hafta başlangıcını kontrol edin
    const weekStart = window.getWeekStart();
    const weekStartStr = weekStart.toISOString().split('T')[0];
    console.log('2️⃣ Hafta başlangıcı:', weekStartStr);
    
    // 3. Document ID formatını kontrol edin
    const docId = (user.username && user.username !== 'Kullanıcı') 
        ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
        : user.id;
    const leaderboardDocId = `${docId}_${weekStartStr}`;
    console.log('3️⃣ Document ID:', leaderboardDocId);
    console.log('   - Username:', user.username);
    console.log('   - User ID:', user.id);
    console.log('   - Clean DocId:', docId);
    
    // 4. Firebase'de veri var mı kontrol edin
    console.log('\n4️⃣ Firebase\'de veri kontrol ediliyor...');
    const data = await window.firestoreGet('weekly_leaderboard', leaderboardDocId);
    console.log('   Firebase verisi:', data);
    
    // 5. Eğer user_id ile farklı bir document ID varsa kontrol edin
    if (!data && user.id !== docId) {
        const altDocId = `${user.id}_${weekStartStr}`;
        console.log('   Alternatif Document ID deneniyor:', altDocId);
        const altData = await window.firestoreGet('weekly_leaderboard', altDocId);
        console.log('   Alternatif veri:', altData);
    }
    
    // 6. Tüm weekly_leaderboard collection'ını kontrol edin
    console.log('\n5️⃣ Tüm weekly_leaderboard collection\'ı kontrol ediliyor...');
    const allData = await window.firestoreGetCollection('weekly_leaderboard', null, null);
    console.log('   Toplam document sayısı:', allData.length);
    console.log('   Bu hafta document\'ları:', allData.filter(d => d.week_start === weekStartStr));
    
    // 7. Kullanıcı pozisyonunu kontrol edin
    console.log('\n6️⃣ Kullanıcı pozisyonu kontrol ediliyor...');
    const position = await window.getUserLeaguePosition();
    console.log('   Pozisyon:', position);
    
    // 8. localStorage'da haftalık XP var mı kontrol edin
    console.log('\n7️⃣ localStorage\'da haftalık XP kontrol ediliyor...');
    const key = `hasene_weekly_xp_${weekStartStr}`;
    const localXP = localStorage.getItem(key);
    console.log('   localStorage key:', key);
    console.log('   localStorage XP:', localXP);
    
    console.log('\n✅ Test tamamlandı!');
})();
```

---

## 🚀 Manuel XP Ekleme (Test İçin)

Eğer Firebase'de veri yoksa, manuel olarak ekleyebilirsiniz:

```javascript
(async () => {
    const user = await window.getCurrentUser();
    const weekStart = window.getWeekStart();
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const docId = (user.username && user.username !== 'Kullanıcı') 
        ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
        : user.id;
    
    // Test için 100 XP ekleyin
    await window.updateWeeklyXP(100);
    console.log('✅ 100 XP eklendi!');
    
    // Kontrol edin
    const position = await window.getUserLeaguePosition();
    console.log('Pozisyon:', position);
})();
```

---

## 🔧 Sorun Giderme

### 1. `updateWeeklyXP()` Çağrılmıyor mu?

Browser Console'da oyun oynadıktan sonra şunu kontrol edin:
```javascript
// Console'da "✅ Haftalık XP güncellendi (endGame):" logunu arayın
```

### 2. Firebase'e Kayıt Yapılmıyor mu?

Browser Console'da şunu kontrol edin:
```javascript
// Console'da "✅ Haftalık XP Firebase'e kaydedildi:" logunu arayın
```

### 3. Document ID Formatı Yanlış mı?

Yukarıdaki test komutunu çalıştırın ve Document ID formatını kontrol edin.

### 4. Hafta Başlangıcı Yanlış mı?

Yukarıdaki test komutunu çalıştırın ve hafta başlangıcını kontrol edin.

---

## ✅ Çözüm

Eğer sorun devam ediyorsa:

1. **Sayfayı yenileyin** (F5)
2. **Yeni bir oyun oynayın** (en az 1 soru cevaplayın)
3. **Browser Console'u açın** (F12)
4. **Yukarıdaki test komutunu çalıştırın**
5. **Sonuçları paylaşın**
