# 🎮 OYUN SENARYOLARI ANALİZİ

**Tarih:** 2025-01-XX  
**Kontrol Edilen Senaryolar:**
1. Oyuna girdim, 1 soru cevapladım ve çıktım
2. Oyuna girdim, 10 soru tamamladım

---

## 📋 SENARYO 1: 1 SORU CEVAPLADIM VE ÇIKTIM

### Durum:
- Kullanıcı oyuna girdi
- 1 soru cevapladı (doğru veya yanlış)
- "Geri" butonuna tıklayıp çıktı

### Ne Oluyor?

**1. `goToMainMenu(true)` çağrılıyor**
   - `saveProgress = true` parametresi ile

**2. `saveCurrentGameProgress()` çağrılıyor**
   - **Koşul kontrolü:**
     ```javascript
     if (!currentGame || (sessionCorrect === 0 && sessionWrong === 0)) {
         return; // Kaydetme
     }
     ```
   - ✅ **1 soru cevaplandıysa** (doğru veya yanlış), koşul geçer, kayıt yapılır

**3. Kaydedilenler:**
   - ✅ **Puanlar:** `sessionScore` global puanlara ekleniyor
   - ✅ **Doğru cevap:** `sessionCorrect` kaydediliyor
   - ✅ **Yanlış cevap:** `sessionWrong` kaydediliyor
   - ✅ **Günlük istatistikler:** `dailyCorrect` ve `dailyWrong` güncelleniyor
   - ✅ **Oyun istatistikleri:** `gameStats.totalCorrect` ve `gameStats.totalWrong` güncelleniyor
   - ✅ **Oyun modu sayısı:** `gameStats.gameModeCounts[gameModeKey] += 1` (oyun sayısı artırılıyor)
   - ✅ **Görev ilerlemesi:** Güncelleniyor
   - ✅ **Rozetler:** Kontrol ediliyor (`addToGlobalPoints()` içinde)
   - ❌ **Perfect bonus:** Yok (oyun bitmeden çıkıldığı için)

**4. Session değişkenleri sıfırlanıyor:**
   - `sessionScore = 0`
   - `sessionCorrect = 0`
   - `sessionWrong = 0`
   - `comboCount = 0`
   - `currentQuestion = 0`
   - `questions = []`

**5. Ana menüye dönülüyor**

### Sonuç:
- ✅ **Puanlar kaydedildi**
- ✅ **İstatistikler güncellendi**
- ✅ **Oyun sayısı artırıldı** (1 oyun olarak sayıldı)
- ✅ **Rozetler kontrol edildi**
- ❌ **Perfect bonus yok**
- ❌ **Oyun devam edilemiyor** (session sıfırlandı)

---

## 📋 SENARYO 2: 10 SORU TAMAMLADIM

### Durum:
- Kullanıcı oyuna girdi
- 10 soru tamamladı (tüm sorular cevaplandı)
- Oyun otomatik olarak bitti

### Ne Oluyor?

**1. Son soru cevaplandığında:**
   - `currentQuestion` artırılıyor
   - Kontrol: `if (currentQuestion >= questions.length)` (10 >= 10)
   - ✅ Koşul geçer, `endGame()` çağrılıyor

**2. `endGame()` çağrılıyor**

**3. Perfect Lesson Bonus Kontrolü:**
   ```javascript
   if (sessionWrong === 0 && sessionCorrect === totalQuestions && sessionScore > 0 && totalQuestions >= 3) {
       perfectBonus = Math.floor(sessionScore * CONFIG.PERFECT_LESSON_BONUS_PERCENT);
       sessionScore += perfectBonus;
       perfectLessonsCount++;
   }
   ```
   - ✅ **Tüm sorular doğruysa:** Perfect bonus verilir (%50 ekstra puan)
   - ✅ **Mükemmel ders sayısı:** Artırılır

**4. Kaydedilenler:**
   - ✅ **Puanlar:** `sessionScore` (+ perfect bonus varsa) global puanlara ekleniyor
   - ✅ **Doğru cevap:** `sessionCorrect` kaydediliyor
   - ✅ **Yanlış cevap:** `sessionWrong` kaydediliyor
   - ✅ **Günlük istatistikler:** `dailyCorrect` ve `dailyWrong` güncelleniyor
   - ✅ **Günlük oyun sayısı:** `dailyData.gamesPlayed += 1`
   - ✅ **Haftalık oyun sayısı:** `weeklyData.gamesPlayed += 1`
   - ✅ **Aylık oyun sayısı:** `monthlyData.gamesPlayed += 1`
   - ✅ **Perfect lesson sayısı:** Artırılıyor (eğer perfect bonus varsa)
   - ✅ **Oyun istatistikleri:** `gameStats.totalCorrect` ve `gameStats.totalWrong` güncelleniyor
   - ✅ **Oyun modu sayısı:** `gameStats.gameModeCounts[currentGameMode] += 1`
   - ✅ **Görev ilerlemesi:** Güncelleniyor (perfect bonus dahil)
   - ✅ **Rozetler:** Kontrol ediliyor (`addToGlobalPoints()` içinde)

**5. Oyun bitiş modalı gösteriliyor:**
   - `showCustomConfirm(sessionCorrect, sessionWrong, sessionScore, perfectBonus)`
   - Doğru cevap sayısı gösteriliyor
   - Yanlış cevap sayısı gösteriliyor
   - Toplam puan gösteriliyor
   - Perfect bonus gösteriliyor (varsa)

**6. Session değişkenleri sıfırlanıyor:**
   - `sessionScore = 0`
   - `sessionCorrect = 0`
   - `sessionWrong = 0`
   - `comboCount = 0`
   - `currentQuestion = 0`
   - `questions = []`

### Sonuç:
- ✅ **Puanlar kaydedildi** (+ perfect bonus varsa)
- ✅ **İstatistikler güncellendi**
- ✅ **Oyun sayısı artırıldı** (günlük/haftalık/aylık)
- ✅ **Perfect bonus verildi** (tüm sorular doğruysa)
- ✅ **Mükemmel ders sayısı artırıldı** (perfect bonus varsa)
- ✅ **Rozetler kontrol edildi**
- ✅ **Oyun bitiş modalı gösterildi**

---

## 🔍 KARŞILAŞTIRMA

| Özellik | Senaryo 1 (1 soru, çıktım) | Senaryo 2 (10 soru, tamamladım) |
|---------|------------------------------|----------------------------------|
| **Puanlar kaydediliyor** | ✅ Evet | ✅ Evet |
| **İstatistikler güncelleniyor** | ✅ Evet | ✅ Evet |
| **Oyun sayısı artırılıyor** | ✅ Evet (1 oyun) | ✅ Evet (1 oyun) |
| **Perfect bonus** | ❌ Yok | ✅ Var (tüm sorular doğruysa) |
| **Mükemmel ders sayısı** | ❌ Artırılmıyor | ✅ Artırılıyor (perfect varsa) |
| **Günlük/Haftalık/Aylık oyun sayısı** | ❌ Artırılmıyor | ✅ Artırılıyor |
| **Oyun bitiş modalı** | ❌ Gösterilmiyor | ✅ Gösteriliyor |
| **Rozetler kontrol ediliyor** | ✅ Evet | ✅ Evet |

---

## ⚠️ TESPİT EDİLEN FARKLILIKLAR

### 1. Günlük/Haftalık/Aylık Oyun Sayısı

**Sorun:** Senaryo 1'de (1 soru cevapladım ve çıktım) günlük/haftalık/aylık oyun sayısı artırılmıyor, ama Senaryo 2'de (10 soru tamamladım) artırılıyor.

**Mevcut Durum:**
- `saveCurrentGameProgress()` içinde: Günlük/haftalık/aylık oyun sayısı artırılmıyor
- `endGame()` içinde: Günlük/haftalık/aylık oyun sayısı artırılıyor

**Bu Bir Sorun mu?**
- Bu tutarsızlık olabilir
- Oyun sayısı her iki durumda da artırılmalı mı?
- Veya sadece tamamlanan oyunlar mı sayılmalı?

**Öneri:** 
- Eğer oyun sayısı sadece tamamlanan oyunlar için sayılmalıysa: Mevcut durum doğru ✅
- Eğer oyun sayısı başlatılan oyunlar için sayılmalıysa: `saveCurrentGameProgress()` içinde de artırılmalı ⚠️

### 2. Oyun Modu Sayısı

**Mevcut Durum:**
- `saveCurrentGameProgress()` içinde: `gameStats.gameModeCounts[gameModeKey] += 1`
- `endGame()` içinde: `gameStats.gameModeCounts[currentGameMode] += 1`

**Sorun:** Her iki durumda da oyun sayısı artırılıyor, bu doğru. Ancak `gameModeKey` ve `currentGameMode` farklı olabilir.

**Kontrol:** `currentGameMode` ve `currentGame` ilişkisi kontrol edilmeli.

---

## ✅ SONUÇ

### Senaryo 1 (1 soru, çıktım):
- ✅ Puanlar ve istatistikler kaydediliyor
- ✅ Oyun sayısı artırılıyor (`gameStats.gameModeCounts`)
- ❌ Günlük/haftalık/aylık oyun sayısı artırılmıyor
- ❌ Perfect bonus yok

### Senaryo 2 (10 soru, tamamladım):
- ✅ Puanlar ve istatistikler kaydediliyor
- ✅ Oyun sayısı artırılıyor (`gameStats.gameModeCounts`)
- ✅ Günlük/haftalık/aylık oyun sayısı artırılıyor
- ✅ Perfect bonus veriliyor (tüm sorular doğruysa)
- ✅ Oyun bitiş modalı gösteriliyor

### Öneriler:
1. **Günlük/Haftalık/Aylık Oyun Sayısı:** Tutarlılık için karar verilmeli (sadece tamamlanan oyunlar mı, yoksa başlatılan oyunlar da mı?)
2. **Oyun Modu Sayısı:** `currentGameMode` ve `currentGame` ilişkisi kontrol edilmeli

