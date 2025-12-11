-- ============================================
-- OYUN MODU VERİLERİ KONTROL
-- ============================================
-- Bu sorgu kullanıcının oyun modu verilerini
-- localStorage ve Supabase'deki değerleri karşılaştırır
-- ============================================

-- Supabase'deki oyun modu sayıları
SELECT 
    au.email AS "Kullanıcı Email",
    COALESCE((us.game_stats->'gameModeCounts'->>'kelime-cevir')::INTEGER, 0) AS "Supabase: Kelime Çevir",
    COALESCE((us.game_stats->'gameModeCounts'->>'dinle-bul')::INTEGER, 0) AS "Supabase: Dinle Bul",
    COALESCE((us.game_stats->'gameModeCounts'->>'bosluk-doldur')::INTEGER, 0) AS "Supabase: Boşluk Doldur",
    COALESCE((us.game_stats->'gameModeCounts'->>'ayet-oku')::INTEGER, 0) AS "Supabase: Ayet Oku",
    COALESCE((us.game_stats->'gameModeCounts'->>'dua-et')::INTEGER, 0) AS "Supabase: Dua Et",
    COALESCE((us.game_stats->'gameModeCounts'->>'hadis-oku')::INTEGER, 0) AS "Supabase: Hadis Oku",
    (
        COALESCE((us.game_stats->'gameModeCounts'->>'kelime-cevir')::INTEGER, 0) +
        COALESCE((us.game_stats->'gameModeCounts'->>'dinle-bul')::INTEGER, 0) +
        COALESCE((us.game_stats->'gameModeCounts'->>'bosluk-doldur')::INTEGER, 0) +
        COALESCE((us.game_stats->'gameModeCounts'->>'ayet-oku')::INTEGER, 0) +
        COALESCE((us.game_stats->'gameModeCounts'->>'dua-et')::INTEGER, 0) +
        COALESCE((us.game_stats->'gameModeCounts'->>'hadis-oku')::INTEGER, 0)
    ) AS "Supabase: Toplam Oyun",
    COALESCE((us.game_stats->>'totalCorrect')::INTEGER, 0) AS "Supabase: Toplam Doğru",
    COALESCE((us.game_stats->>'totalWrong')::INTEGER, 0) AS "Supabase: Toplam Yanlış",
    us.updated_at AS "Son Güncelleme"
FROM auth.users au
LEFT JOIN user_stats us ON au.id = us.user_id
WHERE au.email IS NOT NULL
ORDER BY us.updated_at DESC;

-- ============================================
-- GÜNLÜK İSTATİSTİKLERDEN OYUN MODU KONTROL
-- ============================================
-- Günlük istatistiklerde hangi oyun modları oynanmış?
SELECT 
    au.email AS "Kullanıcı Email",
    ds.date AS "Tarih",
    ds.stats->>'gamesPlayed' AS "Oyun Sayısı",
    ds.stats->'gameModes' AS "Oyun Modları (JSON)",
    ds.updated_at AS "Güncelleme"
FROM auth.users au
INNER JOIN daily_stats ds ON au.id = ds.user_id
WHERE ds.date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY ds.date DESC, au.email;

-- ============================================
-- EKSİK OYUN MODU TESPİTİ
-- ============================================
-- Toplam doğru/yanlış sayısı ile oyun modu toplamı uyuşmuyorsa
-- eksik oyun modu olabilir
SELECT 
    au.email AS "Kullanıcı Email",
    COALESCE((us.game_stats->>'totalCorrect')::INTEGER, 0) + 
    COALESCE((us.game_stats->>'totalWrong')::INTEGER, 0) AS "Toplam Cevap",
    (
        COALESCE((us.game_stats->'gameModeCounts'->>'kelime-cevir')::INTEGER, 0) +
        COALESCE((us.game_stats->'gameModeCounts'->>'dinle-bul')::INTEGER, 0) +
        COALESCE((us.game_stats->'gameModeCounts'->>'bosluk-doldur')::INTEGER, 0) +
        COALESCE((us.game_stats->'gameModeCounts'->>'ayet-oku')::INTEGER, 0) +
        COALESCE((us.game_stats->'gameModeCounts'->>'dua-et')::INTEGER, 0) +
        COALESCE((us.game_stats->'gameModeCounts'->>'hadis-oku')::INTEGER, 0)
    ) AS "Toplam Oyun Modu",
    CASE 
        WHEN (COALESCE((us.game_stats->>'totalCorrect')::INTEGER, 0) + 
              COALESCE((us.game_stats->>'totalWrong')::INTEGER, 0)) > 
             (
                COALESCE((us.game_stats->'gameModeCounts'->>'kelime-cevir')::INTEGER, 0) +
                COALESCE((us.game_stats->'gameModeCounts'->>'dinle-bul')::INTEGER, 0) +
                COALESCE((us.game_stats->'gameModeCounts'->>'bosluk-doldur')::INTEGER, 0) +
                COALESCE((us.game_stats->'gameModeCounts'->>'ayet-oku')::INTEGER, 0) +
                COALESCE((us.game_stats->'gameModeCounts'->>'dua-et')::INTEGER, 0) +
                COALESCE((us.game_stats->'gameModeCounts'->>'hadis-oku')::INTEGER, 0)
             )
        THEN '⚠️ EKSİK OYUN MODU OLABİLİR'
        ELSE '✅ UYUMLU'
    END AS "Durum"
FROM auth.users au
LEFT JOIN user_stats us ON au.id = us.user_id
WHERE au.email IS NOT NULL
    AND us.user_id IS NOT NULL
ORDER BY us.updated_at DESC;
