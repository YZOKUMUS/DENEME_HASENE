# 🔄 Firebase → localStorage Senkronizasyon Test

## 🔍 Sorun: Firebase'den Veriler localStorage'a Gelmiyor

### Browser Console'da Test Edin:

```javascript
(async () => {
    console.log('🔥 Firebase → localStorage Senkronizasyon Test Başlatılıyor...\n');
    
    // 1. Kullanıcı bilgilerini kontrol edin
    const user = await window.getCurrentUser();
    console.log('1️⃣ Kullanıcı:', user);
    
    if (!user || user.id.startsWith('local-')) {
        console.error('❌ Firebase\'de giriş yapmamışsınız!');
        return;
    }
    
    // 2. Firebase'den veri yükleyin
    console.log('\n2️⃣ Firebase\'den veri yükleniyor...');
    const stats = await window.loadUserStats();
    console.log('   Firebase\'den gelen veri:', stats);
    
    // 3. localStorage'da veri var mı kontrol edin
    console.log('\n3️⃣ localStorage kontrol ediliyor...');
    const localTotalPoints = localStorage.getItem('hasene_totalPoints');
    const localBadges = localStorage.getItem('hasene_badges');
    const localStreak = localStorage.getItem('hasene_streakData');
    const localGameStats = localStorage.getItem('hasene_gameStats');
    
    console.log('   localStorage totalPoints:', localTotalPoints);
    console.log('   localStorage badges:', localBadges);
    console.log('   localStorage streakData:', localStreak);
    console.log('   localStorage gameStats:', localGameStats);
    
    // 4. Karşılaştırma
    console.log('\n4️⃣ Karşılaştırma:');
    console.log('   Firebase totalPoints:', stats?.total_points);
    console.log('   localStorage totalPoints:', localTotalPoints);
    console.log('   Eşleşiyor mu?', stats?.total_points?.toString() === localTotalPoints);
    
    // 5. Manuel senkronizasyon (eğer eşleşmiyorsa)
    if (stats && stats.total_points?.toString() !== localTotalPoints) {
        console.log('\n5️⃣ Manuel senkronizasyon yapılıyor...');
        localStorage.setItem('hasene_totalPoints', (stats.total_points || 0).toString());
        localStorage.setItem('hasene_badges', JSON.stringify(stats.badges || { stars: 0, bronze: 0, silver: 0, gold: 0, diamond: 0 }));
        localStorage.setItem('hasene_streakData', JSON.stringify(stats.streak_data || { currentStreak: 0, bestStreak: 0, totalPlayDays: 0 }));
        localStorage.setItem('hasene_gameStats', JSON.stringify(stats.game_stats || { totalCorrect: 0, totalWrong: 0, gameModeCounts: {} }));
        localStorage.setItem('perfectLessonsCount', (stats.perfect_lessons_count || 0).toString());
        console.log('   ✅ Manuel senkronizasyon tamamlandı!');
        
        // Sayfayı yenileyin
        console.log('   💡 Sayfayı yenileyin (F5) ve tekrar kontrol edin');
    }
    
    console.log('\n✅ Test tamamlandı!');
})();
```

---

## 🚀 Hızlı Çözüm

Eğer Firebase'den veri gelmiyorsa, manuel olarak senkronize edin:

```javascript
// Firebase'den veri yükle ve localStorage'a kaydet
const stats = await window.loadUserStats();
if (stats) {
    localStorage.setItem('hasene_totalPoints', (stats.total_points || 0).toString());
    localStorage.setItem('hasene_badges', JSON.stringify(stats.badges || {}));
    localStorage.setItem('hasene_streakData', JSON.stringify(stats.streak_data || {}));
    localStorage.setItem('hasene_gameStats', JSON.stringify(stats.game_stats || {}));
    localStorage.setItem('perfectLessonsCount', (stats.perfect_lessons_count || 0).toString());
    console.log('✅ Firebase verileri localStorage\'a kaydedildi!');
    // Sayfayı yenileyin
    location.reload();
}
```

---

## 🔧 Sorun Giderme

### 1. `loadUserStats()` Çağrılıyor mu?

Browser Console'da şunu kontrol edin:
```javascript
// Console'da "📥 loadUserStats çağrıldı:" logunu arayın
```

### 2. Firebase'den Veri Yükleniyor mu?

Browser Console'da şunu kontrol edin:
```javascript
// Console'da "✅ Firebase'den veri yüklendi:" logunu arayın
```

### 3. localStorage'a Kayıt Yapılıyor mu?

Browser Console'da şunu kontrol edin:
```javascript
// Console'da "✅ Firebase'den localStorage'a kaydedildi:" logunu arayın
```

### 4. Document ID Formatı Doğru mu?

Yukarıdaki test komutunu çalıştırın ve Document ID formatını kontrol edin.

---

## ✅ Çözüm

Eğer sorun devam ediyorsa:

1. **Sayfayı yenileyin** (F5)
2. **Browser Console'u açın** (F12)
3. **Yukarıdaki test komutunu çalıştırın**
4. **Manuel senkronizasyon yapın** (yukarıdaki hızlı çözüm)
5. **Sonuçları paylaşın**
