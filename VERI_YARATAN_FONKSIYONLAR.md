# Veri Yaratan Fonksiyonlar Listesi

Bu dosya, projedeki tüm veri yaratan (create/insert/save/add) fonksiyonları içerir.

## 📋 İçindekiler
1. [API Service Fonksiyonları](#api-service-fonksiyonları)
2. [Oyun Çekirdeği Fonksiyonları](#oyun-çekirdeği-fonksiyonları)
3. [Puan Yönetimi Fonksiyonları](#puan-yönetimi-fonksiyonları)
4. [Favoriler Yönetimi Fonksiyonları](#favoriler-yönetimi-fonksiyonları)
5. [IndexedDB Cache Fonksiyonları](#indexeddb-cache-fonksiyonları)
6. [Kimlik Doğrulama Fonksiyonları](#kimlik-doğrulama-fonksiyonları)

---

## API Service Fonksiyonları
📁 **Dosya:** `js/api-service.js`

### Batch İşlem Fonksiyonları
1. **`batchSaveWordStats(wordStatsMap)`**
   - Kelime istatistiklerini toplu kaydeder
   - Supabase: `word_stats` tablosuna `upsert` işlemi
   - Dosya: `js/api-service.js:33`

2. **`batchSaveDailyStats(dailyStatsMap)`**
   - Günlük istatistikleri toplu kaydeder
   - Supabase: `daily_stats` tablosuna `upsert` işlemi
   - Dosya: `js/api-service.js:79`

3. **`batchSaveWeeklyStats(weeklyStatsMap)`**
   - Haftalık istatistikleri toplu kaydeder
   - Supabase: `weekly_stats` tablosuna `upsert` işlemi
   - Dosya: `js/api-service.js:121`

4. **`batchSaveMonthlyStats(monthlyStatsMap)`**
   - Aylık istatistikleri toplu kaydeder
   - Supabase: `monthly_stats` tablosuna `upsert` işlemi
   - Dosya: `js/api-service.js:163`

5. **`addToBatchQueue(type, key, data)`**
   - Batch queue'ya veri ekler
   - Dosya: `js/api-service.js:293`

6. **`addWordStatsToBatch(wordId, stats)`**
   - Kelime istatistiklerini batch queue'ya ekler
   - Dosya: `js/api-service.js:312`

### Kullanıcı İstatistikleri
7. **`registerUser(email, password, username)`**
   - Yeni kullanıcı kaydı oluşturur
   - Supabase: `auth.users` ve `profiles` tablolarına kayıt
   - İlk `user_stats` kaydı oluşturur
   - Dosya: `js/api-service.js:418`

8. **`saveUserStats(stats)`**
   - Kullanıcı istatistiklerini kaydeder
   - Supabase: `user_stats` tablosuna `upsert` işlemi
   - Dosya: `js/api-service.js:786`

### Görev Yönetimi
9. **`saveDailyTasks(tasks)`**
   - Günlük görevleri kaydeder
   - Supabase: `daily_tasks` tablosuna `upsert` işlemi
   - Dosya: `js/api-service.js:908`

10. **`saveWeeklyTasks(tasks)`**
    - Haftalık görevleri kaydeder
    - Supabase: `weekly_tasks` tablosuna `upsert` işlemi
    - Dosya: `js/api-service.js:1023`

### Kelime İstatistikleri
11. **`saveWordStat(wordId, stats)`**
    - Tek bir kelime istatistiğini kaydeder
    - Supabase: `word_stats` tablosuna `upsert` işlemi
    - Dosya: `js/api-service.js:1118`

### Favoriler
12. **`addFavorite(wordId)`**
    - Favori kelime ekler
    - Supabase: `favorite_words` tablosuna `insert` işlemi
    - Dosya: `js/api-service.js:1215`

### Detaylı İstatistikler
13. **`saveDailyStat(date, stats)`**
    - Günlük istatistikleri kaydeder
    - Supabase: `daily_stats` tablosuna `upsert` işlemi
    - Dosya: `js/api-service.js:1284`

14. **`saveWeeklyStat(weekStart, stats)`**
    - Haftalık istatistikleri kaydeder
    - Supabase: `weekly_stats` tablosuna `upsert` işlemi
    - Dosya: `js/api-service.js:1348`

15. **`saveMonthlyStat(month, stats)`**
    - Aylık istatistikleri kaydeder
    - Supabase: `monthly_stats` tablosuna `upsert` işlemi
    - Dosya: `js/api-service.js:1412`

### Başarımlar ve Rozetler
16. **`saveAchievement(achievementId)`**
    - Başarım kaydeder
    - Supabase: `achievements` tablosuna `upsert` işlemi
    - Dosya: `js/api-service.js:1710`

17. **`saveBadge(badgeId)`**
    - Rozet kaydeder
    - Supabase: `badges` tablosuna `upsert` işlemi
    - Dosya: `js/api-service.js:1791`

### Liderlik Tablosu
18. **`updateWeeklyXP(points)`**
    - Haftalık XP'yi günceller/oluşturur
    - Supabase: `weekly_leaderboard` tablosuna `upsert` işlemi
    - Dosya: `js/api-service.js:1880`

---

## Oyun Çekirdeği Fonksiyonları
📁 **Dosya:** `js/game-core.js`

19. **`saveStats()`**
    - Tüm istatistikleri kaydeder
    - localStorage, IndexedDB ve backend'e kayıt yapar
    - Dosya: `js/game-core.js:906`

20. **`saveStatsImmediate()`**
    - İstatistikleri anında kaydeder (oyun bitişinde)
    - Batch queue sync yapar
    - Dosya: `js/game-core.js:1020`

21. **`addSessionPoints(points)`**
    - Session puanı ekler (geçici)
    - Dosya: `js/game-core.js:1099`

22. **`addDailyXP(points)`**
    - Günlük XP ekler
    - localStorage'a kaydeder
    - Dosya: `js/game-core.js:1108`

23. **`addToGlobalPoints(points, correctAnswers, skipDetailedStats)`**
    - Global puanlara ekler
    - totalPoints, badges günceller
    - Dosya: `js/game-core.js:1128`

24. **`saveCurrentGameProgress()`**
    - Mevcut oyun ilerlemesini kaydeder
    - Oyun bitmeden çıkıldığında kullanılır
    - Dosya: `js/game-core.js:3682`

25. **`saveDetailedStats(points, correct, wrong, maxCombo, perfectLessons, incrementGamesPlayed)`**
    - Detaylı istatistikleri kaydeder (günlük, haftalık, aylık)
    - localStorage ve backend'e kayıt yapar
    - Dosya: `js/game-core.js:4868`

26. **`createHarfGrid()`**
    - Harf grid'i oluşturur (elif-ba oyunu için)
    - DOM elementleri oluşturur
    - Dosya: `js/game-core.js:3005`

---

## Puan Yönetimi Fonksiyonları
📁 **Dosya:** `js/points-manager.js`

27. **`addSessionPoints(points)`**
    - Session puanı ekler
    - Dosya: `js/points-manager.js:9`

28. **`addDailyXP(points)`**
    - Günlük XP ekler
    - localStorage'a kaydeder
    - Dosya: `js/points-manager.js:33`

29. **`addToGlobalPoints(points, correctAnswers)`**
    - Global puanlara ekler
    - Seviye, rozet güncellemeleri yapar
    - Dosya: `js/points-manager.js:121`

---

## Favoriler Yönetimi Fonksiyonları
📁 **Dosya:** `js/favorites-manager.js`

30. **`saveFavorites()`**
    - Favori kelimeleri kaydeder
    - localStorage ve IndexedDB'ye kayıt yapar
    - Dosya: `js/favorites-manager.js:53`

31. **`addToFavorites(wordId)`**
    - Kelimeyi favorilere ekler
    - Dosya: `js/favorites-manager.js:79`

---

## IndexedDB Cache Fonksiyonları
📁 **Dosya:** `js/indexeddb-cache.js`

32. **`initIndexedDB()`**
    - IndexedDB'yi başlatır
    - Object store oluşturur (eğer yoksa)
    - Dosya: `js/indexeddb-cache.js:14`

33. **`saveToIndexedDB(key, value)`**
    - IndexedDB'ye veri kaydeder
    - Dosya: `js/indexeddb-cache.js:83`

---

## Kimlik Doğrulama Fonksiyonları
📁 **Dosya:** `js/api-service.js`

34. **`registerUser(email, password, username)`**
    - Yeni kullanıcı kaydı oluşturur
    - Profil ve ilk istatistikleri oluşturur
    - Dosya: `js/api-service.js:418`

35. **`loginUser(email, password)`**
    - Kullanıcı girişi yapar (session oluşturur)
    - Dosya: `js/api-service.js:470`

36. **`loginWithGoogle()`**
    - Google ile giriş yapar (OAuth)
    - Dosya: `js/api-service.js:508`

37. **`loginWithGitHub()`**
    - GitHub ile giriş yapar (OAuth)
    - Dosya: `js/api-service.js:553`

---

## 📊 Özet İstatistikler

- **Toplam Fonksiyon Sayısı:** 37
- **API Service:** 18 fonksiyon
- **Oyun Çekirdeği:** 8 fonksiyon
- **Puan Yönetimi:** 3 fonksiyon
- **Favoriler:** 2 fonksiyon
- **IndexedDB:** 2 fonksiyon
- **Kimlik Doğrulama:** 4 fonksiyon (registerUser iki yerde sayıldı)

---

## 🔍 Notlar

1. **Batch İşlemler:** Kelime istatistikleri ve diğer veriler batch queue sistemi ile toplu olarak kaydedilir (performans için).

2. **Fallback Mekanizması:** Çoğu fonksiyon önce Supabase'e kaydetmeyi dener, başarısız olursa localStorage'a fallback yapar.

3. **Upsert vs Insert:** 
   - `upsert`: Kayıt varsa günceller, yoksa oluşturur
   - `insert`: Yeni kayıt oluşturur (duplicate kontrolü yapılır)

4. **localStorage Kullanımı:** Tüm veriler hem backend hem de localStorage'a kaydedilir (offline destek için).

5. **IndexedDB:** Bazı veriler IndexedDB'ye de kaydedilir (daha büyük veriler için).

---

## 📝 Güncelleme Tarihi
Bu liste projenin mevcut durumuna göre oluşturulmuştur. Yeni fonksiyonlar eklendiğinde güncellenmelidir.

