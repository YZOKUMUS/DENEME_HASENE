-- ============================================
-- TEST VERİLERİNİ KONTROL ET
-- ============================================
-- Bu SQL'i Supabase SQL Editor'de çalıştırın
-- Test sonuçlarına göre kontrol eder:
-- - 145 hasene
-- - 7 doğru, 3 yanlış
-- - Bugün: 12 Aralık 2025
-- - Hafta: 8-14 Aralık (Pazartesi-Pazar)
-- - Ay: Aralık 2025

-- 1. USER_STATS - Toplam hasene kontrolü
SELECT 
    'USER_STATS' as tablo,
    user_id,
    total_points as "Toplam Hasene",
    badges->>'stars' as "Yıldız",
    game_stats->>'totalCorrect' as "Toplam Doğru",
    game_stats->>'totalWrong' as "Toplam Yanlış",
    game_stats->'gameModeCounts'->>'bosluk-doldur' as "Boşluk Doldur Oyun Sayısı",
    updated_at
FROM user_stats
ORDER BY updated_at DESC
LIMIT 5;

-- 2. DAILY_STATS - Bugünkü istatistikler (12 Aralık 2025)
SELECT 
    'DAILY_STATS' as tablo,
    user_id,
    date,
    stats->>'points' as "Hasene",
    stats->>'correct' as "Doğru",
    stats->>'wrong' as "Yanlış",
    stats->>'maxCombo' as "Max Combo",
    stats->'gameModes'->>'bosluk-doldur' as "Boşluk Doldur Oyun Sayısı",
    updated_at
FROM daily_stats
WHERE date = '2025-12-12'
ORDER BY updated_at DESC
LIMIT 5;

-- 3. WEEKLY_STATS - Haftalık istatistikler (8-14 Aralık)
SELECT 
    'WEEKLY_STATS' as tablo,
    user_id,
    week_start as "Hafta Başlangıcı",
    stats->>'hasene' as "Hasene",
    stats->>'correct' as "Doğru",
    stats->>'wrong' as "Yanlış",
    stats->>'daysPlayed' as "Oynanan Gün",
    stats->>'gamesPlayed' as "Oyun Sayısı",
    updated_at
FROM weekly_stats
WHERE week_start = '2025-12-08'  -- Pazartesi (8 Aralık)
ORDER BY updated_at DESC
LIMIT 5;

-- 4. MONTHLY_STATS - Aylık istatistikler (Aralık 2025)
SELECT 
    'MONTHLY_STATS' as tablo,
    user_id,
    month as "Ay",
    stats->>'hasene' as "Hasene",
    stats->>'correct' as "Doğru",
    stats->>'wrong' as "Yanlış",
    stats->>'daysPlayed' as "Oynanan Gün",
    stats->>'gamesPlayed' as "Oyun Sayısı",
    updated_at
FROM monthly_stats
WHERE month = '2025-12'
ORDER BY updated_at DESC
LIMIT 5;

-- 5. WORD_STATS - Kelime istatistikleri (kaç kelime kaydedilmiş?)
SELECT 
    'WORD_STATS' as tablo,
    COUNT(*) as "Toplam Kelime Sayısı",
    COUNT(DISTINCT user_id) as "Kullanıcı Sayısı"
FROM word_stats;

-- 6. DAILY_TASKS - Günlük görevler
SELECT 
    'DAILY_TASKS' as tablo,
    user_id,
    last_task_date as "Son Görev Tarihi",
    rewards_claimed as "Ödül Alındı mı?",
    updated_at
FROM daily_tasks
ORDER BY updated_at DESC
LIMIT 5;

-- 7. WEEKLY_TASKS - Haftalık görevler
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

-- 8. ÖZET - Tüm tablolarda kayıt var mı?
SELECT 
    'user_stats' as tablo,
    COUNT(*) as kayit_sayisi
FROM user_stats
UNION ALL
SELECT 
    'daily_stats',
    COUNT(*)
FROM daily_stats
WHERE date = '2025-12-12'
UNION ALL
SELECT 
    'weekly_stats',
    COUNT(*)
FROM weekly_stats
WHERE week_start = '2025-12-08'
UNION ALL
SELECT 
    'monthly_stats',
    COUNT(*)
FROM monthly_stats
WHERE month = '2025-12'
UNION ALL
SELECT 
    'word_stats',
    COUNT(*)
FROM word_stats
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
