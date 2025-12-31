# 🔥 Firebase Collection'ları - TAM LİSTE

## 📋 Tüm Firebase Collection'ları

### 1. **`users`** - Kullanıcı Profilleri
- **Document ID**: Kullanıcı adı (username)
- **İçerik**: Email, username, created_at, updated_at, auth_type, firebase_uid
- **Kullanım**: Kullanıcı kayıt/giriş bilgileri

### 2. **`user_stats`** - Kullanıcı İstatistikleri
- **Document ID**: Kullanıcı adı (username)
- **İçerik**: total_points, badges, streak_data, game_stats, perfect_lessons_count
- **Kullanım**: Ana kullanıcı istatistikleri

### 3. **`user_reports`** - Basit Rapor (YENİ)
- **Document ID**: Kullanıcı adı (username)
- **İçerik**: username, toplam_hasene, yildiz, mertebe, mertebe_adi, seri
- **Kullanım**: Özet rapor (kullanıcı adı, toplam hasene, yıldız, mertebe, seri)

### 4. **`user_achievements`** - Muvaffakiyetler (Rozetler)
- **Document ID**: Kullanıcı adı (username)
- **İçerik**: unlocked_badges (array), user_id, username
- **Kullanım**: Kazanılan rozetler

### 5. **`daily_tasks`** - Günlük Görevler
- **Document ID**: Kullanıcı adı (username)
- **İçerik**: tasks, bonusTasks, todayStats, completedTasks
- **Kullanım**: Günlük görevler ve ilerlemeleri

### 6. **`weekly_tasks`** - Haftalık Görevler
- **Document ID**: Kullanıcı adı (username)
- **İçerik**: tasks, weekStats, completedTasks
- **Kullanım**: Haftalık görevler ve ilerlemeleri

### 7. **`word_stats`** - Kelime İstatistikleri
- **Document ID**: `{user_id}_{word_id}` formatında
- **İçerik**: word_id, user_id, correct_count, wrong_count, last_seen
- **Kullanım**: Her kelime için kullanıcı istatistikleri

### 8. **`favorites`** - Favoriler
- **Document ID**: `{user_id}_{word_id}` formatında
- **İçerik**: word_id, user_id, added_at
- **Kullanım**: Kullanıcının favori kelimeleri

### 9. **`achievements`** - Başarımlar
- **Document ID**: `{user_id}_{achievement_id}` formatında
- **İçerik**: achievement_id, user_id, unlocked_at
- **Kullanım**: Kazanılan başarımlar

### 10. **`badges`** - Rozetler (Eski sistem - kullanılmıyor olabilir)
- **Document ID**: `{user_id}_{badge_id}` formatında
- **İçerik**: badge_id, user_id, unlocked_at
- **Kullanım**: Kazanılan rozetler (user_achievements kullanılıyor)

### 11. **`daily_stats`** - Günlük İstatistikler
- **Document ID**: `{username}_{date}` formatında (örn: YZOKUMUS_2025-12-18)
- **İçerik**: date, correct, wrong, points, gamesPlayed, perfectLessons
- **Kullanım**: Her gün için detaylı istatistikler

### 12. **`weekly_stats`** - Haftalık İstatistikler
- **Document ID**: `{username}_{weekStart}` formatında
- **İçerik**: week_start, totalHasene, totalCorrect, totalWrong, daysPlayed
- **Kullanım**: Her hafta için istatistikler

### 13. **`monthly_stats`** - Aylık İstatistikler
- **Document ID**: `{username}_{month}` formatında (örn: YZOKUMUS_2025-12)
- **İçerik**: month, totalHasene, totalCorrect, totalWrong
- **Kullanım**: Her ay için istatistikler

## 📊 Özet

**Toplam: 13 Collection**

### Kullanıcı Bazlı (Her kullanıcı için 1 document):
1. `users`
2. `user_stats`
3. `user_reports` ⭐ YENİ
4. `user_achievements`
5. `daily_tasks`
6. `weekly_tasks`

### Çoklu Document (Her kullanıcı için birden fazla):
7. `word_stats` - Her kelime için
8. `favorites` - Her favori için
9. `achievements` - Her başarım için
10. `badges` - Her rozet için (eski sistem)
11. `daily_stats` - Her gün için
12. `weekly_stats` - Her hafta için
13. `monthly_stats` - Her ay için

## 🔍 Firebase Console'da Görmeniz Gerekenler

Root seviyede şu collection'lar görünmeli:
- ✅ `users`
- ✅ `user_stats`
- ✅ `user_reports` ⭐
- ✅ `user_achievements`
- ✅ `daily_tasks`
- ✅ `weekly_tasks`
- ✅ `word_stats`
- ✅ `favorites`
- ✅ `achievements`
- ✅ `badges` (eğer kullanılıyorsa)
- ✅ `daily_stats`
- ✅ `weekly_stats`
- ✅ `monthly_stats`
