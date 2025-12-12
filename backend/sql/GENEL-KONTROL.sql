-- ============================================
-- GENEL KONTROL SORGULARI
-- ============================================
-- Tüm kontrolleri tek dosyada toplar
-- İstediğiniz sorguyu seçip çalıştırabilirsiniz
-- ============================================

-- ============================================
-- 1. TABLOLARI KONTROL ET
-- ============================================

-- 1.1. Public schema'daki tüm tabloları listele
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 1.2. Oluşturduğumuz tabloları kontrol et
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

-- 1.3. League config tablosundaki lig sayısını kontrol et (12 olmalı)
SELECT COUNT(*) as lig_sayisi FROM league_config;

-- 1.4. Tüm tabloları detaylı göster
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t.table_name) as kolon_sayisi
FROM information_schema.tables t
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 1.5. Fonksiyonları kontrol et
SELECT 
    routine_name as "Fonksiyon Adı",
    routine_type as "Tip",
    data_type as "Dönüş Tipi"
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- ============================================
-- 2. RLS POLICY KONTROL
-- ============================================

-- 2.1. Daily Stats Policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'daily_stats'
ORDER BY policyname;

-- 2.2. Weekly Stats Policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'weekly_stats'
ORDER BY policyname;

-- 2.3. Monthly Stats Policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'monthly_stats'
ORDER BY policyname;

-- 2.4. RLS Durumu
SELECT 
    tablename,
    rowsecurity as "RLS Aktif"
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('daily_stats', 'weekly_stats', 'monthly_stats', 'word_stats')
ORDER BY tablename;

-- ============================================
-- 3. USER_STATS KONTROL
-- ============================================

-- 3.1. User stats kayıt sayısı
SELECT COUNT(*) AS "User Stats Kayit Sayisi" FROM user_stats;

-- 3.2. User stats kayıtları (varsa)
SELECT 
    user_id,
    total_points,
    game_stats->'gameModeCounts' as game_mode_counts,
    updated_at,
    created_at
FROM user_stats
ORDER BY updated_at DESC
LIMIT 10;

-- ============================================
-- 4. ACHIEVEMENTS (BAŞARIMLAR) KONTROL
-- ============================================

-- 4.1. Achievements tablosu var mı?
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'achievements') 
        THEN '✅ achievements tablosu VAR'
        ELSE '❌ achievements tablosu YOK'
    END as tablo_durumu;

-- 4.2. Tüm kullanıcıların başarımları
SELECT 
    u.email,
    COALESCE(p.username, u.email) as kullanici_adi,
    COUNT(a.achievement_id) as toplam_basarim,
    STRING_AGG(a.achievement_id, ', ' ORDER BY a.unlocked_at) as basarim_listesi,
    MAX(a.unlocked_at) as son_basarim_tarihi
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
LEFT JOIN achievements a ON a.user_id = u.id
WHERE u.id IN (
    SELECT DISTINCT user_id FROM achievements
    UNION
    SELECT DISTINCT user_id FROM user_stats
)
GROUP BY u.id, u.email, p.username
ORDER BY toplam_basarim DESC, u.created_at DESC;

-- 4.3. Başarım sayıları (Her başarım tipi için kaç kullanıcı kazandı?)
SELECT 
    achievement_id,
    COUNT(DISTINCT user_id) as kazanan_kullanici_sayisi,
    MIN(unlocked_at) as ilk_kazanma_tarihi,
    MAX(unlocked_at) as son_kazanma_tarihi
FROM achievements
GROUP BY achievement_id
ORDER BY kazanan_kullanici_sayisi DESC, achievement_id;

-- ============================================
-- 5. KULLANICILAR KONTROL
-- ============================================

-- 5.1. Tüm kullanıcılar
SELECT 
    u.id,
    u.email,
    COALESCE(p.username, u.email) as kullanici_adi,
    u.created_at,
    u.last_sign_in_at,
    (SELECT COUNT(*) FROM user_stats WHERE user_id = u.id) as user_stats_var_mi
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
ORDER BY u.created_at DESC
LIMIT 20;

-- 5.2. Kullanıcı sayıları
SELECT 
    COUNT(*) as toplam_kullanici,
    COUNT(CASE WHEN last_sign_in_at IS NOT NULL THEN 1 END) as giris_yapan_kullanici,
    COUNT(CASE WHEN EXISTS (SELECT 1 FROM user_stats WHERE user_id = u.id) THEN 1 END) as oyun_oynayan_kullanici
FROM auth.users u;
