-- ============================================
-- TABLOLARI KONTROL ET
-- ============================================
-- Bu SQL'i Supabase SQL Editor'de çalıştırın

-- 1. Public schema'daki tüm tabloları listele
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Oluşturduğumuz tabloları kontrol et
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN '✅'
        ELSE '❌'
    END as profiles,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_stats') THEN '✅'
        ELSE '❌'
    END as user_stats,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'daily_tasks') THEN '✅'
        ELSE '❌'
    END as daily_tasks,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'weekly_tasks') THEN '✅'
        ELSE '❌'
    END as weekly_tasks,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'word_stats') THEN '✅'
        ELSE '❌'
    END as word_stats,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'favorite_words') THEN '✅'
        ELSE '❌'
    END as favorite_words,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'achievements') THEN '✅'
        ELSE '❌'
    END as achievements,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'badges') THEN '✅'
        ELSE '❌'
    END as badges,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'daily_stats') THEN '✅'
        ELSE '❌'
    END as daily_stats,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'weekly_stats') THEN '✅'
        ELSE '❌'
    END as weekly_stats,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'monthly_stats') THEN '✅'
        ELSE '❌'
    END as monthly_stats,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'weekly_leaderboard') THEN '✅'
        ELSE '❌'
    END as weekly_leaderboard,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_leagues') THEN '✅'
        ELSE '❌'
    END as user_leagues,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'league_config') THEN '✅'
        ELSE '❌'
    END as league_config;

-- 3. league_config tablosundaki lig sayısını kontrol et (12 olmalı)
SELECT COUNT(*) as lig_sayisi FROM league_config;

-- 4. Tüm tabloları detaylı göster
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t.table_name) as kolon_sayisi
FROM information_schema.tables t
WHERE table_schema = 'public' 
ORDER BY table_name;

