-- ============================================
-- RAPOR SORGULARI
-- ============================================
-- Tüm rapor sorgularını tek dosyada toplar
-- İstediğiniz raporu seçip çalıştırabilirsiniz
-- ============================================

-- ============================================
-- 1. TEST VERİLERİNİ KONTROL ET
-- ============================================
-- Bu sorgu test verilerini kontrol eder
-- Bugünkü tarihi CURRENT_DATE olarak kullanır

-- 1.1. USER_STATS - Toplam hasene kontrolü
SELECT 
    'USER_STATS' as tablo,
    user_id,
    total_points as "Toplam Hasene",
    perfect_lessons_count as "Mükemmel Ders",
    badges->>'stars' as "Yıldız",
    badges->>'bronze' as "Bronz",
    badges->>'silver' as "Gümüş",
    badges->>'gold' as "Altın",
    badges->>'diamond' as "Elmas",
    game_stats->>'totalCorrect' as "Toplam Doğru",
    game_stats->>'totalWrong' as "Toplam Yanlış",
    streak_data->>'currentStreak' as "Aktif Seri",
    streak_data->>'bestStreak' as "En İyi Seri",
    streak_data->>'totalPlayDays' as "Toplam Oyun Günü",
    game_stats->'gameModeCounts'->>'kelime-cevir' as "Kelime Çevir",
    game_stats->'gameModeCounts'->>'dinle-bul' as "Dinle Bul",
    game_stats->'gameModeCounts'->>'bosluk-doldur' as "Boşluk Doldur",
    game_stats->'gameModeCounts'->>'ayet-oku' as "Ayet Oku",
    game_stats->'gameModeCounts'->>'dua-et' as "Dua Et",
    game_stats->'gameModeCounts'->>'hadis-oku' as "Hadis Oku",
    updated_at
FROM user_stats
ORDER BY updated_at DESC
LIMIT 5;

-- 1.2. DAILY_STATS - Bugünkü istatistikler
SELECT 
    'DAILY_STATS' as tablo,
    user_id,
    date,
    stats->>'points' as "Hasene",
    stats->>'correct' as "Doğru",
    stats->>'wrong' as "Yanlış",
    stats->>'maxCombo' as "Max Combo",
    stats->>'gamesPlayed' as "Oyun Sayısı",
    stats->>'perfectLessons' as "Mükemmel Ders",
    stats->'gameModes'->>'kelime-cevir' as "Kelime Çevir",
    stats->'gameModes'->>'dinle-bul' as "Dinle Bul",
    stats->'gameModes'->>'bosluk-doldur' as "Boşluk Doldur",
    stats->'gameModes'->>'ayet-oku' as "Ayet Oku",
    stats->'gameModes'->>'dua-et' as "Dua Et",
    stats->'gameModes'->>'hadis-oku' as "Hadis Oku",
    updated_at
FROM daily_stats
WHERE date = CURRENT_DATE
ORDER BY updated_at DESC
LIMIT 5;

-- 1.3. WEEKLY_STATS - Bu haftanın istatistikleri
-- Hafta başlangıcı: Pazartesi
SELECT 
    'WEEKLY_STATS' as tablo,
    user_id,
    week_start as "Hafta Başlangıcı",
    stats->>'hasene' as "Hasene",
    stats->>'correct' as "Doğru",
    stats->>'wrong' as "Yanlış",
    stats->>'daysPlayed' as "Oynanan Gün",
    stats->>'gamesPlayed' as "Oyun Sayısı",
    stats->>'perfectLessons' as "Mükemmel Ders",
    stats->>'maxCombo' as "Max Combo",
    stats->>'streakDays' as "Seri Gün",
    updated_at
FROM weekly_stats
WHERE week_start = (
    SELECT DATE_TRUNC('week', CURRENT_DATE)::date + 
           CASE WHEN EXTRACT(DOW FROM CURRENT_DATE) = 0 THEN -6 ELSE 1 END -
           EXTRACT(DOW FROM CURRENT_DATE)::int
)
ORDER BY updated_at DESC
LIMIT 5;

-- 1.4. MONTHLY_STATS - Bu ayın istatistikleri
SELECT 
    'MONTHLY_STATS' as tablo,
    user_id,
    month as "Ay",
    stats->>'hasene' as "Hasene",
    stats->>'correct' as "Doğru",
    stats->>'wrong' as "Yanlış",
    stats->>'daysPlayed' as "Oynanan Gün",
    stats->>'gamesPlayed' as "Oyun Sayısı",
    stats->>'perfectLessons' as "Mükemmel Ders",
    stats->>'maxCombo' as "Max Combo",
    stats->>'streakDays' as "Seri Gün",
    stats->>'bestStreak' as "En İyi Seri",
    updated_at
FROM monthly_stats
WHERE month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
ORDER BY updated_at DESC
LIMIT 5;

-- 1.5. WORD_STATS - Kelime istatistikleri
SELECT 
    'WORD_STATS' as tablo,
    COUNT(*) as "Toplam Kelime Sayısı",
    COUNT(DISTINCT user_id) as "Kullanıcı Sayısı",
    COUNT(DISTINCT word_id) as "Farklı Kelime Sayısı"
FROM word_stats;

-- 1.5.1. WORD_STATS - Detaylı kelime istatistikleri (Kullanıcı bazlı)
SELECT 
    'WORD_STATS_DETAY' as tablo,
    user_id,
    COUNT(*) as "Toplam Kelime",
    COUNT(DISTINCT word_id) as "Farklı Kelime",
    COUNT(CASE WHEN (stats->>'correct')::INTEGER > (stats->>'wrong')::INTEGER THEN 1 END) as "İyi Bilinen Kelime",
    COUNT(CASE WHEN (stats->>'wrong')::INTEGER > (stats->>'correct')::INTEGER THEN 1 END) as "Zorlanılan Kelime",
    ROUND(AVG(CASE 
        WHEN (stats->>'attempts')::INTEGER > 0 
        THEN ((stats->>'correct')::NUMERIC / (stats->>'attempts')::NUMERIC) * 100 
        ELSE 0 
    END), 2) as "Ortalama Başarı %"
FROM word_stats
GROUP BY user_id
ORDER BY COUNT(*) DESC
LIMIT 10;

-- 1.6. DAILY_TASKS - Günlük görevler
SELECT 
    'DAILY_TASKS' as tablo,
    user_id,
    last_task_date as "Son Görev Tarihi",
    rewards_claimed as "Ödül Alındı mı?",
    updated_at
FROM daily_tasks
ORDER BY updated_at DESC
LIMIT 5;

-- 1.7. WEEKLY_TASKS - Haftalık görevler
SELECT 
    'WEEKLY_TASKS' as tablo,
    user_id,
    week_start as "Hafta Başlangıcı",
    week_end as "Hafta Sonu",
    rewards_claimed as "Ödül Alındı mı?",
    updated_at
FROM weekly_tasks
ORDER BY updated_at DESC
LIMIT 5;

-- 1.8. ACHIEVEMENTS - Başarımlar
-- NOT: RLS politikaları nedeniyle SQL Editor'de görünmeyebilir
-- Service role key ile çalıştırın veya aşağıdaki bypass sorgusunu kullanın

-- 1.8.1. ACHIEVEMENTS - Tüm başarımlar (RLS bypass - Service role gerekli)
SELECT 
    'ACHIEVEMENTS' as tablo,
    user_id,
    COUNT(*) as "Toplam Başarım",
    STRING_AGG(achievement_id, ', ' ORDER BY unlocked_at) as "Başarım Listesi",
    MAX(unlocked_at) as "Son Başarım Tarihi"
FROM achievements
GROUP BY user_id
ORDER BY COUNT(*) DESC
LIMIT 5;

-- 1.8.2. ACHIEVEMENTS - Tabloda veri var mı kontrol (RLS bypass)
SELECT 
    'ACHIEVEMENTS_KONTROL' as tablo,
    COUNT(*) as "Toplam Kayıt Sayısı",
    COUNT(DISTINCT user_id) as "Kullanıcı Sayısı",
    COUNT(DISTINCT achievement_id) as "Farklı Başarım Sayısı"
FROM achievements;

-- 1.8.3. ACHIEVEMENTS - Detaylı liste (RLS bypass)
SELECT 
    'ACHIEVEMENTS_DETAY' as tablo,
    a.user_id,
    COALESCE(p.username, u.email) as "Kullanıcı",
    a.achievement_id as "Başarım ID",
    a.unlocked_at as "Kazanma Tarihi"
FROM achievements a
LEFT JOIN auth.users u ON u.id = a.user_id
LEFT JOIN profiles p ON p.id = a.user_id
ORDER BY a.unlocked_at DESC
LIMIT 20;

-- 1.9. BADGES - Rozetler
-- NOT: RLS politikaları nedeniyle SQL Editor'de görünmeyebilir

-- 1.9.1. BADGES - Tüm rozetler (RLS bypass - Service role gerekli)
SELECT 
    'BADGES' as tablo,
    user_id,
    COUNT(*) as "Toplam Rozet",
    STRING_AGG(badge_id, ', ' ORDER BY unlocked_at) as "Rozet Listesi",
    MAX(unlocked_at) as "Son Rozet Tarihi"
FROM badges
GROUP BY user_id
ORDER BY COUNT(*) DESC
LIMIT 5;

-- 1.9.2. BADGES - Tabloda veri var mı kontrol (RLS bypass)
SELECT 
    'BADGES_KONTROL' as tablo,
    COUNT(*) as "Toplam Kayıt Sayısı",
    COUNT(DISTINCT user_id) as "Kullanıcı Sayısı",
    COUNT(DISTINCT badge_id) as "Farklı Rozet Sayısı"
FROM badges;

-- 1.9.3. BADGES - Detaylı liste (RLS bypass)
SELECT 
    'BADGES_DETAY' as tablo,
    b.user_id,
    COALESCE(p.username, u.email) as "Kullanıcı",
    b.badge_id as "Rozet ID",
    b.unlocked_at as "Kazanma Tarihi"
FROM badges b
LEFT JOIN auth.users u ON u.id = b.user_id
LEFT JOIN profiles p ON p.id = b.user_id
ORDER BY b.unlocked_at DESC
LIMIT 20;

-- 1.10. FAVORITE_WORDS - Favori kelimeler
SELECT 
    'FAVORITE_WORDS' as tablo,
    user_id,
    COUNT(*) as "Toplam Favori Kelime",
    STRING_AGG(word_id, ', ' ORDER BY created_at) as "Favori Kelime Listesi"
FROM favorite_words
GROUP BY user_id
ORDER BY COUNT(*) DESC
LIMIT 5;

-- 1.11. ÖZET - Tüm tablolarda kayıt var mı?
SELECT 
    'user_stats' as tablo,
    COUNT(*) as kayit_sayisi
FROM user_stats
UNION ALL
SELECT 
    'daily_stats',
    COUNT(*)
FROM daily_stats
WHERE date = CURRENT_DATE
UNION ALL
SELECT 
    'weekly_stats',
    COUNT(*)
FROM weekly_stats
WHERE week_start = (
    SELECT DATE_TRUNC('week', CURRENT_DATE)::date + 
           CASE WHEN EXTRACT(DOW FROM CURRENT_DATE) = 0 THEN -6 ELSE 1 END -
           EXTRACT(DOW FROM CURRENT_DATE)::int
)
UNION ALL
SELECT 
    'monthly_stats',
    COUNT(*)
FROM monthly_stats
WHERE month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
UNION ALL
SELECT 
    'word_stats',
    COUNT(*)
FROM word_stats
UNION ALL
SELECT 
    'favorite_words',
    COUNT(*)
FROM favorite_words
UNION ALL
SELECT 
    'achievements',
    COUNT(*)
FROM achievements
UNION ALL
SELECT 
    'badges',
    COUNT(*)
FROM badges
UNION ALL
SELECT 
    'daily_tasks',
    COUNT(*)
FROM daily_tasks
UNION ALL
SELECT 
    'weekly_tasks',
    COUNT(*)
FROM weekly_tasks;

-- ============================================
-- 2. KULLANICILARIN KAZANÇ RAPORU
-- ============================================
-- Tüm oyuna giriş yapan kullanıcıların kazançlarını gösterir

SELECT 
    -- Kullanıcı Bilgileri
    COALESCE(p.username, au.email) AS "Kullanıcı Adı",
    au.email AS "Email",
    COALESCE(p.created_at, au.created_at) AS "Kayıt Tarihi",
    au.last_sign_in_at AS "Son Giriş",
    
    -- Puan Bilgileri
    COALESCE(us.total_points, 0) AS "Toplam Hasene",
    COALESCE(us.perfect_lessons_count, 0) AS "Mükemmel Ders",
    
    -- Rozet Bilgileri
    COALESCE((us.badges->>'stars')::INTEGER, 0) AS "⭐ Yıldız",
    COALESCE((us.badges->>'bronze')::INTEGER, 0) AS "🥉 Bronz",
    COALESCE((us.badges->>'silver')::INTEGER, 0) AS "🥈 Gümüş",
    COALESCE((us.badges->>'gold')::INTEGER, 0) AS "🥇 Altın",
    COALESCE((us.badges->>'diamond')::INTEGER, 0) AS "💎 Elmas",
    
    -- Seri Bilgileri
    COALESCE((us.streak_data->>'currentStreak')::INTEGER, 0) AS "Aktif Seri",
    COALESCE((us.streak_data->>'bestStreak')::INTEGER, 0) AS "En İyi Seri",
    COALESCE((us.streak_data->>'totalPlayDays')::INTEGER, 0) AS "Toplam Oyun Günü",
    
    -- Oyun İstatistikleri
    COALESCE((us.game_stats->>'totalCorrect')::INTEGER, 0) AS "Toplam Doğru",
    COALESCE((us.game_stats->>'totalWrong')::INTEGER, 0) AS "Toplam Yanlış",
    CASE 
        WHEN COALESCE((us.game_stats->>'totalCorrect')::INTEGER, 0) + COALESCE((us.game_stats->>'totalWrong')::INTEGER, 0) > 0
        THEN ROUND(
            (COALESCE((us.game_stats->>'totalCorrect')::INTEGER, 0)::NUMERIC / 
             (COALESCE((us.game_stats->>'totalCorrect')::INTEGER, 0) + COALESCE((us.game_stats->>'totalWrong')::INTEGER, 0))::NUMERIC) * 100, 
            2
        )
        ELSE 0
    END AS "Başarı Oranı %",
    
    -- Oyun Modu Sayıları
    COALESCE((us.game_stats->'gameModeCounts'->>'kelime-cevir')::INTEGER, 0) AS "📝 Kelime Çevir",
    COALESCE((us.game_stats->'gameModeCounts'->>'dinle-bul')::INTEGER, 0) AS "🎧 Dinle Bul",
    COALESCE((us.game_stats->'gameModeCounts'->>'bosluk-doldur')::INTEGER, 0) AS "✍️ Boşluk Doldur",
    COALESCE((us.game_stats->'gameModeCounts'->>'ayet-oku')::INTEGER, 0) AS "📖 Ayet Oku",
    COALESCE((us.game_stats->'gameModeCounts'->>'dua-et')::INTEGER, 0) AS "🤲 Dua Et",
    COALESCE((us.game_stats->'gameModeCounts'->>'hadis-oku')::INTEGER, 0) AS "📚 Hadis Oku",
    
    -- Rozet ve Başarım Sayıları
    (SELECT COUNT(*) FROM achievements a WHERE a.user_id = au.id) AS "Toplam Başarım",
    (SELECT MAX(unlocked_at) FROM achievements a WHERE a.user_id = au.id) AS "Son Başarım Tarihi",
    (SELECT COUNT(*) FROM badges b WHERE b.user_id = au.id) AS "Toplam Rozet",
    (SELECT MAX(unlocked_at) FROM badges b WHERE b.user_id = au.id) AS "Son Rozet Tarihi",
    (SELECT COUNT(*) FROM favorite_words fw WHERE fw.user_id = au.id) AS "Favori Kelime",
    (SELECT COUNT(*) FROM word_stats ws WHERE ws.user_id = au.id) AS "Toplam Kelime",
    
    -- Güncellenme Tarihi
    us.updated_at AS "Son Güncelleme"
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
LEFT JOIN user_stats us ON us.user_id = au.id
WHERE EXISTS (SELECT 1 FROM user_stats WHERE user_id = au.id)
ORDER BY us.total_points DESC, au.created_at DESC;
