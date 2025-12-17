# 🧪 FONKSİYON TEST PLANI

## ✅ DÜZELTİLEN SORUNLAR

### 1. ✅ `updateTaskProgress()` - OYUN MODLARINDA ÇİFT SAYMA DÜZELTİLDİ

**ÖNCE:**
```javascript
if (!isGameMode) {
    dailyTasks.todayStats.toplamDogru += data.correct || 0; // ✅ OK
    dailyTasks.todayStats.toplamPuan += data.points || 0;
} else {
    dailyTasks.todayStats.toplamDogru += data.correct || 0; // ❌ ÇİFT SAYMA!
}
```

**SONRA:**
```javascript
if (!isGameMode) {
    // Okuma modları: points: 0, sadece sayaç güncelle
    dailyTasks.todayStats.toplamDogru += data.correct || 0; // ✅ OK
    dailyTasks.todayStats.toplamPuan += data.points || 0; // ✅ OK (points: 0)
} else {
    // Oyun modları: correct ve points zaten saveDetailedStats ile eklenmiş
    // SADECE sayaçları güncelle, değerleri ekleme!
}
```

---

## 📊 VERİ AKIŞI (DÜZELTME SONRASI)

### OYUN MODLARI (kelime-cevir, dinle-bul, bosluk-doldur):

```
1. Soru cevaplanır
   ↓
2. checkAnswer() → saveDetailedStats(points, 1, 0, ...)
   ↓
3. saveDetailedStats():
   - hasene_daily_${today}.points += points (ANA KAYNAK)
   - dailyData.correct += 1
   - dailyXP = hasene_daily_${today}.points (senkronize)
   - todayStats.toplamPuan = dailyData.points (EŞİTLEME)
   - todayStats.toplamDogru = dailyData.correct (EŞİTLEME)
   ↓
4. Oyun bitişinde: endGame()
   ↓
5. endGame() → updateTaskProgress(..., {points: 0, correct: sessionCorrect, ...})
   ↓
6. updateTaskProgress():
   - Oyun modlarında: SADECE sayaçları güncelle (allGameModes, comboCount)
   - todayStats.toplamDogru ve todayStats.toplamPuan EKLEME (zaten güncellenmiş)
```

### OKUMA MODLARI (ayet-oku, dua-et, hadis-oku):

```
1. Sonraki butonuna tıklanır
   ↓
2. updateTaskProgress('ayet-oku', {points: 0, correct: 0, ...})
   ↓
3. updateTaskProgress():
   - todayStats.ayetOku += 1 (sayaç)
   - todayStats.toplamDogru += 0 (points: 0 olduğu için sorun yok)
   - todayStats.toplamPuan += 0 (points: 0 olduğu için sorun yok)
```

---

## 🧪 TEST SENARYOLARI

### TEST 1: Kelime Çevir Oyunu
1. Oyunu başlat
2. 5 soru cevapla (3 doğru, 2 yanlış)
3. Oyunu bitir
4. **KONTROL:**
   - `hasene_daily_${today}.points` = 30 (3 doğru × 10 puan)
   - `todayStats.toplamPuan` = 30
   - `todayStats.toplamDogru` = 3
   - `dailyXP` = 30
   - Tüm değerler aynı olmalı ✅

### TEST 2: Ayet Oku Modu
1. Ayet oku modunu başlat
2. 5 ayet oku (sonraki butonuna tıkla)
3. **KONTROL:**
   - `hasene_daily_${today}.points` = 0 (okuma modu, puan yok)
   - `todayStats.toplamPuan` = 0
   - `todayStats.ayetOku` = 5
   - Tüm değerler aynı olmalı ✅

### TEST 3: Karma Test
1. Kelime çevir oyunu oyna (10 soru, 8 doğru)
2. Ayet oku modunda 3 ayet oku
3. **KONTROL:**
   - `hasene_daily_${today}.points` = 80 (8 doğru × 10 puan)
   - `todayStats.toplamPuan` = 80
   - `todayStats.toplamDogru` = 8
   - `todayStats.ayetOku` = 3
   - Tüm değerler tutarlı olmalı ✅

---

## ✅ DOĞRULAMA KONTROL LİSTESİ

- [ ] `saveDetailedStats()` sadece ANA KAYNAK'ı güncelliyor ✅
- [ ] `updateTaskProgress()` oyun modlarında points ve correct eklemiyor ✅
- [ ] `updateTaskProgress()` okuma modlarında sadece sayaçları güncelliyor ✅
- [ ] `getDailyHasene()` sadece ANA KAYNAK döndürüyor ✅
- [ ] `addDailyXP()` kullanılmıyor (kaldırılabilir) ⚠️
- [ ] `endGame()` içinde `updateTaskProgress` points: 0 gönderiyor ✅
- [ ] Çift sayma yok ✅

---

## ⚠️ KALAN RİSKLER

1. **`addDailyXP()` hala tanımlı** - Eğer bir yerde çağrılırsa çift saymaya neden olur
2. **Backend senkronizasyonu** - Backend'den yüklenen veriler `loadStats()` içinde işleniyor, kontrol edilmeli
