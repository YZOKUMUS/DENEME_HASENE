# Fonksiyon - Tablo Eşleştirmesi

Her fonksiyonun hangi tabloya/yerle veri yazdığının detaylı listesi.

---

## API Service Fonksiyonları (js/api-service.js)

### 1. batchSaveWordStats(wordStatsMap)
**Tablo:** `word_stats`  
**İşlem:** `upsert`  
**Çıktı Verisi:**
```json
{
  "user_id": "string",
  "word_id": "string",
  "stats": {
    "attempts": 0,
    "correct": 0,
    "wrong": 0,
    "lastCorrect": "YYYY-MM-DD",
    "lastWrong": "YYYY-MM-DD",
    "successRate": 0,
    "masteryLevel": 0
  },
  "updated_at": "ISO datetime string"
}
```
**Not:** Toplu kayıt, array olarak gönderilir, `onConflict: 'user_id,word_id'`

---

### 2. batchSaveDailyStats(dailyStatsMap)
**Tablo:** `daily_stats`  
**İşlem:** `upsert`  
**Çıktı Verisi:**
```json
{
  "user_id": "string",
  "date": "YYYY-MM-DD",
  "stats": {
    "correct": 0,
    "wrong": 0,
    "points": 0,
    "gamesPlayed": 0,
    "perfectLessons": 0,
    "maxCombo": 0,
    "gameModes": {}
  },
  "updated_at": "ISO datetime string"
}
```
**Not:** Toplu kayıt, array olarak gönderilir, `onConflict: 'user_id,date'`

---

### 3. batchSaveWeeklyStats(weeklyStatsMap)
**Tablo:** `weekly_stats`  
**İşlem:** `upsert`  
**Çıktı Verisi:**
```json
{
  "user_id": "string",
  "week_start": "YYYY-MM-DD",
  "stats": {
    "hasene": 0,
    "correct": 0,
    "wrong": 0,
    "daysPlayed": 0,
    "gamesPlayed": 0,
    "perfectLessons": 0,
    "maxCombo": 0,
    "streakDays": 0,
    "playedDates": []
  },
  "updated_at": "ISO datetime string"
}
```
**Not:** Toplu kayıt, array olarak gönderilir, `onConflict: 'user_id,week_start'`

---

### 4. batchSaveMonthlyStats(monthlyStatsMap)
**Tablo:** `monthly_stats`  
**İşlem:** `upsert`  
**Çıktı Verisi:**
```json
{
  "user_id": "string",
  "month": "YYYY-MM",
  "stats": {
    "hasene": 0,
    "correct": 0,
    "wrong": 0,
    "daysPlayed": 0,
    "gamesPlayed": 0,
    "perfectLessons": 0,
    "maxCombo": 0,
    "streakDays": 0,
    "bestStreak": 0,
    "playedDates": []
  },
  "updated_at": "ISO datetime string"
}
```
**Not:** Toplu kayıt, array olarak gönderilir, `onConflict: 'user_id,month'`

---

### 5. addToBatchQueue(type, key, data)
**Tablo:** Yok (bellekte tutulur)  
**İşlem:** Bellek (pendingSaves objesine ekler)  
**Çıktı Verisi:** `pendingSaves[type][key] = data`  
**Not:** Veri henüz kaydedilmedi, batch queue'da bekliyor

---

### 6. addWordStatsToBatch(wordId, stats)
**Tablo:** Yok (bellekte tutulur)  
**İşlem:** Bellek (pendingSaves.wordStats objesine ekler)  
**Çıktı Verisi:** `pendingSaves.wordStats[wordId] = stats`  
**Not:** Veri henüz kaydedilmedi, batch queue'da bekliyor

---

### 7. registerUser(email, password, username)
**Tablolar:** 
1. `auth.users` (Supabase Auth tablosu)
2. `profiles`
3. `user_stats`

**İşlem:** 
1. `auth.signUp` (create)
2. `profiles.upsert`
3. `user_stats.upsert`

**Çıktı Verileri:**

**auth.users:**
```json
{
  "id": "UUID",
  "email": "string",
  "created_at": "ISO datetime",
  "email_confirmed_at": null
}
```

**profiles:**
```json
{
  "id": "UUID (user.id)",
  "username": "string"
}
```

**user_stats:**
```json
{
  "user_id": "UUID",
  "total_points": 0,
  "badges": {
    "stars": 0,
    "bronze": 0,
    "silver": 0,
    "gold": 0,
    "diamond": 0
  },
  "streak_data": {
    "currentStreak": 0,
    "bestStreak": 0,
    "totalPlayDays": 0
  },
  "game_stats": {
    "totalCorrect": 0,
    "totalWrong": 0,
    "gameModeCounts": {}
  },
  "perfect_lessons_count": 0
}
```

**Fallback:** `localStorage.setItem('hasene_user_email', email)`

---

### 8. saveUserStats(stats)
**Tablo:** `user_stats`  
**İşlem:** `upsert`  
**Çıktı Verisi:**
```json
{
  "user_id": "UUID",
  "total_points": 0,
  "badges": {
    "stars": 0,
    "bronze": 0,
    "silver": 0,
    "gold": 0,
    "diamond": 0
  },
  "streak_data": {
    "currentStreak": 0,
    "bestStreak": 0,
    "totalPlayDays": 0
  },
  "game_stats": {
    "totalCorrect": 0,
    "totalWrong": 0,
    "gameModeCounts": {}
  },
  "perfect_lessons_count": 0,
  "updated_at": "ISO datetime string"
}
```
**Fallback localStorage:**
- `hasene_totalPoints`
- `hasene_badges`
- `hasene_streakData`
- `hasene_gameStats`
- `perfectLessonsCount`

---

### 9. saveDailyTasks(tasks)
**Tablo:** `daily_tasks`  
**İşlem:** `upsert`  
**Çıktı Verisi:**
```json
{
  "user_id": "UUID",
  "last_task_date": "YYYY-MM-DD" | null,
  "tasks": [
    {
      "id": "string",
      "description": "string",
      "target": 0,
      "progress": 0,
      "completed": false,
      "reward": 0
    }
  ],
  "bonus_tasks": [],
  "completed_tasks": [],
  "today_stats": {
    "allGameModes": [],
    "farklıZorluk": [],
    "reviewWords": []
  },
  "rewards_claimed": false,
  "updated_at": "ISO datetime string"
}
```
**Fallback:** `localStorage.setItem('hasene_dailyTasks', JSON.stringify(tasks))`

---

### 10. saveWeeklyTasks(tasks)
**Tablo:** `weekly_tasks`  
**İşlem:** `upsert`  
**Çıktı Verisi:**
```json
{
  "user_id": "UUID",
  "last_week_start": "YYYY-MM-DD" | null,
  "week_start": "YYYY-MM-DD" | null,
  "week_end": "YYYY-MM-DD" | null,
  "tasks": [],
  "completed_tasks": [],
  "week_stats": {
    "allModesPlayed": []
  },
  "rewards_claimed": false,
  "updated_at": "ISO datetime string"
}
```
**Fallback:** `localStorage.setItem('hasene_weeklyTasks', JSON.stringify(tasks))`

---

### 11. saveWordStat(wordId, stats)
**Tablo:** `word_stats`  
**İşlem:** `upsert`  
**Çıktı Verisi:**
```json
{
  "user_id": "UUID",
  "word_id": "string",
  "stats": {
    "attempts": 0,
    "correct": 0,
    "wrong": 0,
    "lastCorrect": "YYYY-MM-DD",
    "lastWrong": "YYYY-MM-DD",
    "successRate": 0,
    "masteryLevel": 0
  },
  "updated_at": "ISO datetime string"
}
```
**Fallback:** `localStorage.setItem('hasene_wordStats', JSON.stringify(allStats))`

---

### 12. addFavorite(wordId)
**Tablo:** `favorite_words`  
**İşlem:** `insert`  
**Çıktı Verisi:**
```json
{
  "user_id": "UUID",
  "word_id": "string"
}
```
**Not:** Duplicate hatası (23505) ignore edilir  
**Fallback:** `localStorage.setItem('hasene_favorites', JSON.stringify(favorites))`

---

### 13. saveDailyStat(date, stats)
**Tablo:** `daily_stats`  
**İşlem:** `upsert`  
**Çıktı Verisi:**
```json
{
  "user_id": "UUID",
  "date": "YYYY-MM-DD",
  "stats": {
    "correct": 0,
    "wrong": 0,
    "points": 0,
    "gamesPlayed": 0,
    "perfectLessons": 0,
    "maxCombo": 0,
    "gameModes": {}
  },
  "updated_at": "ISO datetime string"
}
```
**Fallback:** `localStorage.setItem('hasene_daily_${date}', JSON.stringify(stats))`

---

### 14. saveWeeklyStat(weekStart, stats)
**Tablo:** `weekly_stats`  
**İşlem:** `upsert`  
**Çıktı Verisi:**
```json
{
  "user_id": "UUID",
  "week_start": "YYYY-MM-DD",
  "stats": {
    "hasene": 0,
    "correct": 0,
    "wrong": 0,
    "daysPlayed": 0,
    "gamesPlayed": 0,
    "perfectLessons": 0,
    "maxCombo": 0,
    "streakDays": 0,
    "playedDates": []
  },
  "updated_at": "ISO datetime string"
}
```
**Fallback:** `localStorage.setItem('hasene_weekly_${weekStart}', JSON.stringify(stats))`

---

### 15. saveMonthlyStat(month, stats)
**Tablo:** `monthly_stats`  
**İşlem:** `upsert`  
**Çıktı Verisi:**
```json
{
  "user_id": "UUID",
  "month": "YYYY-MM",
  "stats": {
    "hasene": 0,
    "correct": 0,
    "wrong": 0,
    "daysPlayed": 0,
    "gamesPlayed": 0,
    "perfectLessons": 0,
    "maxCombo": 0,
    "streakDays": 0,
    "bestStreak": 0,
    "playedDates": []
  },
  "updated_at": "ISO datetime string"
}
```
**Fallback:** `localStorage.setItem('hasene_monthly_${month}', JSON.stringify(stats))`

---

### 16. saveAchievement(achievementId)
**Tablo:** `achievements`  
**İşlem:** `upsert`  
**Çıktı Verisi:**
```json
{
  "user_id": "UUID",
  "achievement_id": "string"
  // unlocked_at: DEFAULT NOW() (Supabase tarafından otomatik)
}
```
**Fallback:** `localStorage.setItem('unlockedAchievements', JSON.stringify(achievements))`  
**Format:** `[{id: "string", unlockedAt: timestamp}]`

---

### 17. saveBadge(badgeId)
**Tablo:** `badges`  
**İşlem:** `upsert`  
**Çıktı Verisi:**
```json
{
  "user_id": "UUID",
  "badge_id": "string"
  // unlocked_at: DEFAULT NOW() (Supabase tarafından otomatik)
}
```
**Fallback:** `localStorage.setItem('unlockedBadges', JSON.stringify(badges))`  
**Format:** `[{id: "string", unlockedAt: timestamp}]`

---

### 18. updateWeeklyXP(points)
**Tablo:** `weekly_leaderboard`  
**İşlem:** 
1. `rpc('increment_weekly_xp')` (önce dener)
2. `upsert` (fallback)

**Çıktı Verisi:**
```json
{
  "user_id": "UUID",
  "week_start": "YYYY-MM-DD",
  "week_end": "YYYY-MM-DD",
  "weekly_xp": 0,
  "league": "mubtedi",
  "updated_at": "ISO datetime string"
}
```
**Not:** Mevcut `weekly_xp` değerine `points` eklenir

---

## Oyun Çekirdeği Fonksiyonları (js/game-core.js)

### 19. saveStats()
**Tablolar:** Yok (diğer fonksiyonları çağırır)  
**İşlem:** 
- `saveUserStats()` çağırır
- `saveDailyTasks()` çağırır
- `saveToIndexedDB()` çağırır (birden fazla key için)

**localStorage Kayıtları:**
- `hasene_totalPoints` (string)
- `hasene_badges` (JSON)
- `hasene_streakData` (JSON)
- `hasene_dailyTasks` (JSON)
- `hasene_wordStats` (JSON)
- `unlockedAchievements` (JSON)
- `unlockedBadges` (JSON)
- `perfectLessonsCount` (string)
- `gameStats` (JSON)

**IndexedDB Kayıtları:**
- `hasene_totalPoints`
- `hasene_badges`
- `hasene_streakData`
- `hasene_dailyTasks`

---

### 20. saveStatsImmediate()
**Tablolar:** Yok (diğer fonksiyonları çağırır)  
**İşlem:**
1. `syncBatchQueue()` çağırır
2. `saveStats()` çağırır

**Çıktı Verisi:** Yukarıdaki `saveStats()` ile aynı

---

### 21. addSessionPoints(points)
**Tablo:** Yok (sadece bellekte)  
**İşlem:** `sessionScore += points` (geçici değişken)  
**Çıktı Verisi:** Yok (sadece bellek değişkeni güncellenir)

---

### 22. addDailyXP(points)
**Tablo:** Yok (localStorage)  
**İşlem:** localStorage güncelleme  
**localStorage Kayıtları:**
1. `dailyXP` (string, toplam günlük XP)
2. `hasene_daily_${today}` (JSON, günlük detaylı istatistik)

**Çıktı Verisi:**

**dailyXP:**
```
"1234" (string, toplam sayı)
```

**hasene_daily_${today}:**
```json
{
  "points": 1234,
  "correct": 0,
  "wrong": 0,
  "gamesPlayed": 0,
  "perfectLessons": 0,
  "maxCombo": 0,
  "gameModes": {}
}
```

---

### 23. addToGlobalPoints(points, correctAnswers, skipDetailedStats)
**Tablo:** Yok (diğer fonksiyonları çağırır)  
**İşlem:**
- `totalPoints` değişkenini günceller
- `badges` değişkenini günceller (calculateBadges ile)
- `saveStatsImmediate()` çağırır
- `updateWeeklyXP()` çağırır

**Çıktı Verisi:** Yukarıdaki `saveStats()` ve `updateWeeklyXP()` ile aynı

---

### 24. saveCurrentGameProgress()
**Tablo:** Yok (diğer fonksiyonları çağırır)  
**İşlem:**
- `totalPoints` günceller
- `badges` günceller
- `saveDetailedStats()` çağırır
- `saveStatsImmediate()` çağırır

**Çıktı Verisi:** Yukarıdaki `saveDetailedStats()` ve `saveStats()` ile aynı

---

### 25. saveDetailedStats(points, correct, wrong, maxCombo, perfectLessons, incrementGamesPlayed)
**Tablolar:** Yok (sadece localStorage)  
**İşlem:** localStorage güncelleme  
**localStorage Kayıtları:**

1. `hasene_daily_${today}` (JSON)
2. `hasene_weekly_${weekStart}` (JSON)
3. `hasene_monthly_${month}` (JSON)
4. `dailyXP` (string, senkronize edilir)

**Çıktı Verileri:**

**hasene_daily_${today}:**
```json
{
  "correct": 0,
  "wrong": 0,
  "points": 0,
  "gamesPlayed": 0,
  "perfectLessons": 0,
  "maxCombo": 0,
  "gameModes": {
    "kelime-cevir": 1,
    "dinle-bul": 2
  }
}
```

**hasene_weekly_${weekStart}:**
```json
{
  "hasene": 0,
  "correct": 0,
  "wrong": 0,
  "daysPlayed": 0,
  "gamesPlayed": 0,
  "perfectLessons": 0,
  "maxCombo": 0,
  "streakDays": 0,
  "playedDates": ["YYYY-MM-DD"]
}
```

**hasene_monthly_${month}:**
```json
{
  "hasene": 0,
  "correct": 0,
  "wrong": 0,
  "daysPlayed": 0,
  "gamesPlayed": 0,
  "perfectLessons": 0,
  "maxCombo": 0,
  "streakDays": 0,
  "bestStreak": 0,
  "playedDates": ["YYYY-MM-DD"]
}
```

**Not:** Bu fonksiyon artık backend tablolarına yazmıyor (sadece localStorage)

---

### 26. createHarfGrid()
**Tablo:** Yok (DOM işlemi)  
**İşlem:** DOM elementleri oluşturur  
**Çıktı Verisi:** HTML DOM elementleri (veri kaydı yapılmaz)

---

## Puan Yönetimi Fonksiyonları (js/points-manager.js)

### 27. addSessionPoints(points)
**Durum:** MÜKERRER - `game-core.js` versiyonu kullanılıyor  
**Tablo:** Yok (sadece bellekte)  
**İşlem:** `sessionScore += points`  
**Çıktı Verisi:** Yok

---

### 28. addDailyXP(points)
**Durum:** MÜKERRER - `game-core.js` versiyonu kullanılıyor  
**Tablo:** Yok (localStorage)  
**İşlem:** `localStorage.setItem('dailyXP', ...)`  
**Çıktı Verisi:** `dailyXP` (string)

---

### 29. addToGlobalPoints(points, correctAnswers)
**Durum:** MÜKERRER - `game-core.js` versiyonu kullanılıyor  
**Tablo:** Yok (diğer fonksiyonları çağırır)  
**İşlem:** `totalPoints` günceller, diğer fonksiyonları çağırır  
**Çıktı Verisi:** Yukarıdaki ilgili fonksiyonlar ile aynı

---

## Favoriler Yönetimi Fonksiyonları (js/favorites-manager.js)

### 30. saveFavorites()
**Tablolar:** Yok (localStorage ve IndexedDB)  
**İşlem:** 
- `localStorage.setItem('hasene_favoriteWords', ...)`
- `saveToIndexedDB('hasene_favoriteWords', ...)`

**Çıktı Verisi:**
```json
["word_id1", "word_id2", "word_id3"]
```
**Format:** Array of strings (word IDs)

---

### 31. addToFavorites(wordId)
**Tablolar:** Yok (diğer fonksiyonları çağırır)  
**İşlem:** 
- `favoriteWords.add(wordId)` (Set'e ekler)
- `saveFavorites()` çağırır

**Çıktı Verisi:** Yukarıdaki `saveFavorites()` ile aynı

**Not:** API service'deki `addFavorite()` ile farklı - bu localStorage/IndexedDB'ye yazar

---

## IndexedDB Cache Fonksiyonları (js/indexeddb-cache.js)

### 32. initIndexedDB()
**Tablo:** IndexedDB object store oluşturur  
**İşlem:** `createObjectStore('gameData', { keyPath: 'key' })`  
**Çıktı Verisi:** IndexedDB veritabanı ve object store oluşturulur

---

### 33. saveToIndexedDB(key, value)
**Tablo:** IndexedDB `gameData` object store  
**İşlem:** `put`  
**Çıktı Verisi:**
```json
{
  "key": "string",
  "value": "string | JSON stringified",
  "timestamp": 1234567890
}
```

---

## Kimlik Doğrulama Fonksiyonları (js/api-service.js)

### 34. registerUser(email, password, username)
**Durum:** MÜKERRER - Fonksiyon #7 ile aynı  
**Tablolar:** `auth.users`, `profiles`, `user_stats`  
**Çıktı Verisi:** Fonksiyon #7 ile aynı

---

### 35. loginUser(email, password)
**Tablo:** `auth.users` (session oluşturur)  
**İşlem:** `auth.signInWithPassword`  
**Çıktı Verisi:** Session token ve user bilgileri  
**Fallback:** `localStorage.setItem('hasene_user_email', email)`

---

### 36. loginWithGoogle()
**Tablo:** `auth.users` (OAuth session oluşturur)  
**İşlem:** `auth.signInWithOAuth({ provider: 'google' })`  
**Çıktı Verisi:** OAuth redirect URL'i (kullanıcı Google'a yönlendirilir)

---

### 37. loginWithGitHub()
**Tablo:** `auth.users` (OAuth session oluşturur)  
**İşlem:** `auth.signInWithOAuth({ provider: 'github' })`  
**Çıktı Verisi:** OAuth redirect URL'i (kullanıcı GitHub'a yönlendirilir)

---

## Özet Tablo

| # | Fonksiyon | Tablo/Depo | İşlem | Çıktı Tipi |
|---|-----------|------------|-------|------------|
| 1 | batchSaveWordStats | `word_stats` | upsert | Array of records |
| 2 | batchSaveDailyStats | `daily_stats` | upsert | Array of records |
| 3 | batchSaveWeeklyStats | `weekly_stats` | upsert | Array of records |
| 4 | batchSaveMonthlyStats | `monthly_stats` | upsert | Array of records |
| 5 | addToBatchQueue | Bellek | - | Memory object |
| 6 | addWordStatsToBatch | Bellek | - | Memory object |
| 7 | registerUser | `auth.users`, `profiles`, `user_stats` | create/upsert | User, Profile, Stats |
| 8 | saveUserStats | `user_stats` | upsert | Stats object |
| 9 | saveDailyTasks | `daily_tasks` | upsert | Tasks object |
| 10 | saveWeeklyTasks | `weekly_tasks` | upsert | Tasks object |
| 11 | saveWordStat | `word_stats` | upsert | Word stats object |
| 12 | addFavorite | `favorite_words` | insert | Favorite record |
| 13 | saveDailyStat | `daily_stats` | upsert | Daily stats object |
| 14 | saveWeeklyStat | `weekly_stats` | upsert | Weekly stats object |
| 15 | saveMonthlyStat | `monthly_stats` | upsert | Monthly stats object |
| 16 | saveAchievement | `achievements` | upsert | Achievement record |
| 17 | saveBadge | `badges` | upsert | Badge record |
| 18 | updateWeeklyXP | `weekly_leaderboard` | upsert | Leaderboard record |
| 19 | saveStats | localStorage/IndexedDB | - | Multiple keys |
| 20 | saveStatsImmediate | localStorage/IndexedDB | - | Multiple keys |
| 21 | addSessionPoints | Bellek | - | Variable update |
| 22 | addDailyXP | localStorage | setItem | String + JSON |
| 23 | addToGlobalPoints | localStorage/IndexedDB/Backend | - | Multiple |
| 24 | saveCurrentGameProgress | localStorage/IndexedDB/Backend | - | Multiple |
| 25 | saveDetailedStats | localStorage | setItem | JSON objects |
| 26 | createHarfGrid | DOM | - | HTML elements |
| 27-29 | (Mükerrer) | - | - | - |
| 30 | saveFavorites | localStorage/IndexedDB | setItem/put | Array of strings |
| 31 | addToFavorites | localStorage/IndexedDB | - | Array of strings |
| 32 | initIndexedDB | IndexedDB | createObjectStore | Database |
| 33 | saveToIndexedDB | IndexedDB | put | Key-value |
| 34 | registerUser | (Mükerrer - #7) | - | - |
| 35 | loginUser | `auth.users` | signInWithPassword | Session |
| 36 | loginWithGoogle | `auth.users` | signInWithOAuth | Redirect URL |
| 37 | loginWithGitHub | `auth.users` | signInWithOAuth | Redirect URL |

---

## Supabase Tabloları Listesi

1. `auth.users` - Kullanıcı kimlik doğrulama (Supabase Auth)
2. `profiles` - Kullanıcı profil bilgileri
3. `user_stats` - Kullanıcı genel istatistikleri
4. `word_stats` - Kelime bazlı istatistikler
5. `daily_tasks` - Günlük görevler
6. `weekly_tasks` - Haftalık görevler
7. `daily_stats` - Günlük detaylı istatistikler
8. `weekly_stats` - Haftalık detaylı istatistikler
9. `monthly_stats` - Aylık detaylı istatistikler
10. `favorite_words` - Favori kelimeler
11. `achievements` - Başarımlar
12. `badges` - Rozetler
13. `weekly_leaderboard` - Haftalık liderlik tablosu
14. `league_config` - Lig yapılandırması (sadece okuma)
15. `league_rankings` - Lig sıralaması view'ı (sadece okuma)

---

## localStorage Key'leri Listesi

- `hasene_totalPoints`
- `hasene_badges`
- `hasene_streakData`
- `hasene_gameStats`
- `hasene_dailyTasks`
- `hasene_weeklyTasks`
- `hasene_wordStats`
- `hasene_favorites` / `hasene_favoriteWords`
- `unlockedAchievements`
- `unlockedBadges`
- `perfectLessonsCount`
- `gameStats`
- `dailyXP`
- `hasene_daily_${date}` (dinamik)
- `hasene_weekly_${weekStart}` (dinamik)
- `hasene_monthly_${month}` (dinamik)
- `hasene_user_email`

---

## IndexedDB Key'leri Listesi

- `hasene_totalPoints`
- `hasene_badges`
- `hasene_streakData`
- `hasene_dailyTasks`
- `hasene_favoriteWords`
- (Diğer key'ler de kaydedilebilir, `saveToIndexedDB()` ile)

---

**Not:** Bu liste projenin mevcut durumuna göre oluşturulmuştur. Yeni fonksiyonlar veya tablolar eklendiğinde güncellenmelidir.

