-- ============================================
-- USER_STATS KONTROL
-- ============================================
-- user_stats tablosunda kayıt var mı kontrol et
-- ============================================

-- User stats kayıt sayısı
SELECT COUNT(*) AS "User Stats Kayit Sayisi" FROM user_stats;

-- User stats kayıtları (varsa)
SELECT 
    user_id,
    total_points,
    game_stats->'gameModeCounts' as game_mode_counts,
    updated_at,
    created_at
FROM user_stats
ORDER BY updated_at DESC;

-- Eğer kayıt varsa, bunları silmek için:
-- DELETE FROM user_stats;
