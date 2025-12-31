# 🧪 Vazifeler Paneli Test Rehberi

## Test Scripti Hazır!

Test scripti `test-vazifeler-paneli.js` dosyasına eklendi ve `index.html`'e yüklendi.

## Test Adımları

### 1. Sayfayı Açın
- `index.html` dosyasını tarayıcıda açın (Live Server kullanın veya `python -m http.server` ile çalıştırın)

### 2. Giriş Yapın
- Giriş yap butonuna tıklayın
- Bir kullanıcı adı ile giriş yapın (örn: YZOKUMUS)

### 3. Test Scriptini Çalıştırın
Tarayıcı konsolunda (F12) şu komutu çalıştırın:

```javascript
await testVazifelerPaneli()
```

### 4. Test Sonuçlarını Kontrol Edin
Konsolda şu testler çalışacak:

1. ✅ **dailyTasks.tasks ve dailyTasks.bonusTasks kontrolü**
   - Görevler oluşturulmuş mu?

2. ✅ **dailyTasks.todayStats kontrolü**
   - todayStats objesi var mı?
   - toplamPuan, toplamDogru değerleri var mı?

3. ✅ **hasene_daily_${today}.points kontrolü**
   - localStorage'da günlük puan var mı?

4. ✅ **updateTaskProgressFromStats fonksiyonu**
   - Fonksiyon çalışıyor mu?
   - Görevlerin progress değerleri güncelleniyor mu?

5. ✅ **updateTasksDisplay fonksiyonu**
   - Fonksiyon çalışıyor mu?
   - DOM'da görevler görünüyor mu?
   - Progress değerleri görünüyor mu?

6. ✅ **Backend'den veri yükleme**
   - Firebase'den daily_tasks yükleniyor mu?
   - todayStats.toplamPuan değeri doğru mu?

## Beklenen Sonuçlar

### ✅ Başarılı Senaryo:
- Tüm testler geçmeli
- Görevler oluşturulmuş olmalı
- Progress değerleri > 0 olmalı (oyun oynandıysa)
- DOM'da görevler görünmeli

### ❌ Sorun Varsa:
- Hangi test başarısız oldu?
- Konsoldaki hata mesajları neler?
- `dailyTasks.tasks` var mı?
- `dailyTasks.todayStats.toplamPuan` değeri nedir?

## Manuel Test

Eğer otomatik test çalışmazsa, manuel olarak şunları kontrol edin:

1. **Vazifeler panelini açın**
   - Alt nav bar'daki "Vazifeler" butonuna tıklayın

2. **Konsolda kontrol edin:**
```javascript
// Görevler var mı?
console.log('Görevler:', dailyTasks.tasks?.length || 0);
console.log('Bonus görevler:', dailyTasks.bonusTasks?.length || 0);

// Progress değerleri nedir?
dailyTasks.tasks?.forEach(task => {
    console.log(`${task.id}: ${task.progress}/${task.target}`);
});

// todayStats değerleri nedir?
console.log('todayStats:', {
    toplamPuan: dailyTasks.todayStats?.toplamPuan,
    toplamDogru: dailyTasks.todayStats?.toplamDogru,
    ayetOku: dailyTasks.todayStats?.ayetOku
});
```

3. **Bir oyun oynayın ve tekrar kontrol edin:**
   - Oyun oynadıktan sonra progress değerleri güncellenmeli
   - Vazifeler panelinde rakamlar görünmeli

## Sorun Giderme

### Görevler görünmüyor:
- `checkDailyTasks()` çağrıldı mı?
- `dailyTasks.tasks` array'i dolu mu?

### Progress değerleri 0:
- `updateTaskProgressFromStats()` çağrıldı mı?
- `dailyTasks.todayStats.toplamPuan` değeri nedir?
- `hasene_daily_${today}.points` değeri nedir?

### Backend'den veri gelmiyor:
- Kullanıcı giriş yapmış mı?
- Firebase bağlantısı çalışıyor mu?
- `loadDailyTasks()` fonksiyonu çalışıyor mu?
