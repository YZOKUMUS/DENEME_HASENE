## UI ↔ JS ↔ Supabase Alan Eşlemesi

Bu dosya, oyun ekranındaki rakamsal alanlar ile JavaScript değişkenleri ve Supabase tabloları arasında **tek ve resmi referans** olarak kullanılmak içindir.

Format:

- **UI etiketi** → Ekranda gördüğünüz başlık/metin
- **JS** → İlgili değişken / fonksiyon
- **Supabase** → Tablo ve kolon(lar)

---

### 1. Kullanıcı Genel İstatistikleri (`user_stats`)

- **UI**: Top bar → **Toplam Hasene**
  - **JS**:
    - Değişken: `totalPoints`
    - Yükleme: `loadStats()` → `window.loadUserStats()` → `userStats.total_points`
    - Gösterim: `updateStatsBar()` → `elements.totalPointsEl.textContent = formatNumber(totalPoints)`
  - **Supabase**:
    - Tablo: `user_stats`
    - Kolon: `total_points` (Toplam Hasene puanı)

- **UI**: Top bar → **⭐ Yıldız**
  - **JS**:
    - Değişken: `badges.stars`
    - Gösterim: `updateStatsBar()` → `elements.starPointsEl.textContent = formatNumber(badges.stars)`
  - **Supabase**:
    - Tablo: `user_stats`
    - Kolon: `badges` (JSON) → alan: `stars`

- **UI**: Top bar → Seviye (`id="current-level"`)
  - **JS**:
    - Girdi: `totalPoints`
    - Fonksiyon: `calculateLevel(totalPoints)`
    - Gösterim: `elements.currentLevelEl.textContent = level`
  - **Supabase**:
    - Doğrudan kolon yok; **`user_stats.total_points`’ten hesaplanan türev değer**

- **UI**: Streak / Seri (ilgili widget)
  - **JS**:
    - Değişken: `streakData`
      - `streakData.currentStreak`
      - `streakData.bestStreak`
      - `streakData.totalPlayDays`
      - `streakData.playDates` vb.
    - Yükleme: `loadStats()` → `userStats.streak_data`
    - Gösterim: `updateStreakDisplay()`
  - **Supabase**:
    - Tablo: `user_stats`
    - Kolon: `streak_data` (JSON)

- **UI**: Genel oyun istatistikleri (toplam doğru, yanlış, mod sayıları – çeşitli panellerde)
  - **JS**:
    - Değişken: `gameStats`
      - `gameStats.totalCorrect`
      - `gameStats.totalWrong`
      - `gameStats.gameModeCounts`
  - **Supabase**:
    - Tablo: `user_stats`
    - Kolon: `game_stats` (JSON)

- **UI**: Mükemmel Ders Sayısı (başarımlar/istatistikler)
  - **JS**:
    - Değişken: `perfectLessonsCount`
  - **Supabase**:
    - Tablo: `user_stats`
    - Kolon: `perfect_lessons_count`  
      (Eski olası ad: `perfectLessonsCount` – `loadUserStats()` içinde normalize edilir)

---

### 2. Günlük Hedef ve Günlük Hasene

- **UI**: Günlük hedef barı → **Bugünkü Hasene** (progress bar içindeki mevcut değer)
  - **JS**:
    - Kaynak fonksiyon: `getDailyHasene()`
      - localStorage + gerektiğinde `dailyTasks.todayStats.toplamPuan`
    - Gösterim: `updateDailyGoalDisplay()`:
      - `dailyGoalCurrent` = `formatNumber(dailyXPToUse)`
      - `dailyGoalTarget` = `formatNumber(dailyGoalHasene)`
      - `dailyGoalPercent` = `(dailyXPToUse / dailyGoalHasene)`
  - **Supabase**:
    - Tablo: `daily_tasks`
    - Kolon: `today_stats` (JSON) → alan: `toplamPuan` (bugünkü toplam Hasene)

- **UI**: Günlük hedef seviyesi (Rahat / Normal / Zor / Ciddi)
  - **JS**:
    - localStorage: `dailyGoalLevel` (`easy | normal | hard | serious`)
    - Sayısal hedef: `dailyGoalHasene` (`CONFIG.DAILY_GOAL_LEVELS`)
  - **Supabase**:
    - Doğrudan kolon yok; konsept olarak `today_stats.toplamPuan` ile bağlantılı

---

### 3. Günlük Vazifeler Paneli (`daily_tasks`)

Referans: `docs/VAZIFELER_SUPABASE_KONTROL.md`

- **UI**: **Toplam Doğru**
  - **JS**: `dailyTasks.todayStats.toplamDogru`
  - **Supabase**:
    - Tablo: `daily_tasks`
    - Kolon: `today_stats.toplamDogru`

- **UI**: **Toplam Puan** (günlük Hasene)
  - **JS**: `dailyTasks.todayStats.toplamPuan`
  - **Supabase**:
    - Tablo: `daily_tasks`
    - Kolon: `today_stats.toplamPuan`

- **UI**: **Combo**
  - **JS**: `dailyTasks.todayStats.comboCount`
  - **Supabase**:
    - Tablo: `daily_tasks`
    - Kolon: `today_stats.comboCount`

- **UI**: **Ayet Oku**
  - **JS**: `dailyTasks.todayStats.ayetOku`
  - **Supabase**:
    - Tablo: `daily_tasks`
    - Kolon: `today_stats.ayetOku`

- **UI**: **Dua Et**
  - **JS**: `dailyTasks.todayStats.duaEt`
  - **Supabase**:
    - Tablo: `daily_tasks`
    - Kolon: `today_stats.duaEt`

- **UI**: **Hadis Oku**
  - **JS**: `dailyTasks.todayStats.hadisOku`
  - **Supabase**:
    - Tablo: `daily_tasks`
    - Kolon: `today_stats.hadisOku`

---

### 4. Haftalık Vazifeler Paneli (`weekly_tasks`)

- **UI**: **Toplam Hasene** (haftalık)
  - **JS**: `weeklyTasks.weekStats.totalHasene`
  - **Supabase**:
    - Tablo: `weekly_tasks`
    - Kolon: `week_stats.totalHasene`

- **UI**: **Toplam Doğru**
  - **JS**: `weeklyTasks.weekStats.totalCorrect`
  - **Supabase**:
    - Tablo: `weekly_tasks`
    - Kolon: `week_stats.totalCorrect`

- **UI**: **Toplam Yanlış**
  - **JS**: `weeklyTasks.weekStats.totalWrong`
  - **Supabase**:
    - Tablo: `weekly_tasks`
    - Kolon: `week_stats.totalWrong`

- **UI**: **Oynanan Gün**
  - **JS**: `weeklyTasks.weekStats.daysPlayed`
  - **Supabase**:
    - Tablo: `weekly_tasks`
    - Kolon: `week_stats.daysPlayed`

- **UI**: **Combo**
  - **JS**: `weeklyTasks.weekStats.comboCount`
  - **Supabase**:
    - Tablo: `weekly_tasks`
    - Kolon: `week_stats.comboCount`

---

### 5. Detaylı İstatistikler – Günlük / Haftalık / Aylık

JS dosyası: `js/detailed-stats.js`

#### 5.1 Günlük istatistikler (`daily_stats`)

- **UI**: Günlük liste → **Hasene**
  - **JS**: `dailyData.points`
  - **Supabase**:
    - Tablo: `daily_stats`
    - Kolon: `stats.points`

- **UI**: Günlük liste → **Doğru**, **Yanlış**
  - **JS**: `dailyData.correct`, `dailyData.wrong`
  - **Supabase**:
    - `stats.correct`, `stats.wrong`

- **UI**: Günlük liste → **Oyun**, **Mükemmel**, **Max Combo**
  - **JS**: `gamesPlayed`, `perfectLessons`, `maxCombo`
  - **Supabase**:
    - `stats.gamesPlayed`, `stats.perfectLessons`, `stats.maxCombo`

#### 5.2 Haftalık istatistikler (`weekly_stats`)

- **UI**: Haftalık liste → **Hasene**
  - **JS**: `weeklyData.hasene`
  - **Supabase**:
    - Tablo: `weekly_stats`
    - Kolon: `stats.hasene`

- **UI**: Haftalık liste → **Doğru**, **Yanlış**, **Oynanan Gün**
  - **JS**: `weeklyData.correct`, `weeklyData.wrong`, `weeklyData.daysPlayed`
  - **Supabase**:
    - `stats.correct`, `stats.wrong`, `stats.daysPlayed`

- **UI**: Haftalık liste → **Oyun**, **Mükemmel**, **Seri Gün**
  - **JS**: `gamesPlayed`, `perfectLessons`, `streakDays`
  - **Supabase**:
    - `stats.gamesPlayed`, `stats.perfectLessons`, `stats.streakDays`

#### 5.3 Aylık istatistikler (`monthly_stats`)

- **UI**: Aylık liste → **Hasene**
  - **JS**: `monthlyData.hasene`
  - **Supabase**:
    - Tablo: `monthly_stats`
    - Kolon: `stats.hasene`

- **UI**: Aylık liste → **Doğru**, **Yanlış**, **Oynanan Gün**
  - **JS**: `correct`, `wrong`, `daysPlayed`
  - **Supabase**:
    - `stats.correct`, `stats.wrong`, `stats.daysPlayed`

- **UI**: Aylık liste → **Oyun**, **Mükemmel**, **En İyi Seri**, **Max Combo**
  - **JS**: `gamesPlayed`, `perfectLessons`, `bestStreak`, `maxCombo`, `maxConsecutiveCorrect`
  - **Supabase**:
    - Kolon: `stats.<aynıAlanAdı>`

---

### 6. Kelime İstatistikleri (`word_stats`)

- **UI**: Kelime istatistik kartları (Zorlanılan / İyi Bilinen / Çok Denenen / Son Yanlışlar)
  - **JS**:
    - Global: `wordStats` (`wordId` → stats)
    - Tek kelime için:
      - `attempts`
      - `correct`
      - `wrong`
      - `successRate`
      - `masteryLevel`
      - `lastWrong`, `lastCorrect`
      - `nextReviewDate`, `interval`
  - **Supabase**:
    - Tablo: `word_stats`
    - Kolonlar:
      - `word_id`
      - `stats` (JSON) → yukarıdaki alanlar aynı adlarla

---

### 7. Favoriler (`favorite_words`)

- **UI**: Favori yıldızı, Favori kelimeler listesi
  - **JS**:
    - Fonksiyonlar: `loadFavorites()`, `addFavorite(wordId)`, `removeFavorite(wordId)`
    - Veriler: `favoriteWordIds: string[]`
  - **Supabase**:
    - Tablo: `favorite_words`
    - Kolonlar:
      - `user_id`
      - `word_id` (UI/JS’te kullanılan kelime id’si ile aynı)

---

### 8. Başarımlar (`achievements`)

- **UI**: Achievement listesi / kartları
  - **JS**:
    - Fonksiyonlar: `loadAchievements()`, `saveAchievement(achievementId)`
    - Format: `{ id, unlockedAt }[]`
  - **Supabase**:
    - Tablo: `achievements`
    - Kolonlar:
      - `user_id`
      - `achievement_id` (JS’te `achievementId` ile birebir aynı)
      - `unlocked_at`

---

### 9. Rozetler (`badges` tablosu)

- **UI**: Kazanılan rozetler (ayrı “badge” sistemi, user_stats.badges ile karıştırma)
  - **JS**:
    - Fonksiyonlar: `loadBadges()`, `saveBadge(badgeId)`
    - Format: `{ id, unlockedAt }[]`
  - **Supabase**:
    - Tablo: `badges`
    - Kolonlar:
      - `user_id`
      - `badge_id` (JS’te `badgeId` ile birebir aynı)
      - `unlocked_at`

---

### 10. Haftalık Lig / Leaderboard (`weekly_leaderboard`)

- **UI**: Haftalık lig ekranı, kullanıcı sıralaması
  - **JS**:
    - Fonksiyonlar:
      - `updateWeeklyXP(points)`
      - `getLeagueInfo(userId?)`
      - `getLeagueRankings(leagueName, limit)`
      - `getUserLeaguePosition(userId?)`
    - Alanlar:
      - `weekly_xp`
      - `league`
      - Hesaplanmış: `position`, `total_in_league`, `promotion_threshold`, `demotion_threshold`
  - **Supabase**:
    - Tablo: `weekly_leaderboard`
    - Kolonlar:
      - `user_id`
      - `week_start`, `week_end`
      - `weekly_xp`
      - `league`

---

### Notlar

- Yeni bir UI alanı eklerken **önce buraya bir satır ekleyin**, sonra kodu ve Supabase şemasını bu satıra göre yazın.
- Eski kolon adlarından yeni kolonlara geçiş (örn. `totalPoints` → `total_points`) yapılırken `api-service.js/loadUserStats()` içinde normalize edilmelidir; böylece hem eski hem yeni veriler sorunsuz çalışır.


