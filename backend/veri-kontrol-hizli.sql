-- ============================================
-- HIZLI VERİ KONTROL SORGUSU
-- ============================================
-- Oyun oynadıktan sonra bu sorguyu çalıştırarak
-- verilerin Supabase'e kaydedilip kaydedilmediğini kontrol edin
-- ============================================

-- 1. Kullanıcının user_stats'ını kontrol et
SELECT 
    au.email AS "Email",
    COALESCE(us.total_points, 0) AS "Toplam Hasene",
    COALESCE((us.game_stats->>'totalCorrect')::INTEGER, 0) AS "Toplam Doğru",
    COALESCE((us.game_stats->>'totalWrong')::INTEGER, 0) AS "Toplam Yanlış",
    COALESCE((us.game_stats->'gameModeCounts'->>'kelime-cevir')::INTEGER, 0) AS "Kelime Çevir Oyunu",
    COALESCE(us.updated_at, au.created_at) AS "Son Güncelleme"
FROM auth.users au
LEFT JOIN user_stats us ON au.id = us.user_id
WHERE au.email = 'SİZİN-EMAIL-ADRESİNİZ@example.com'  -- EMAIL'İNİZİ BURAYA YAZIN
ORDER BY au.created_at DESC;

-- 2. Bugünkü daily_stats'ı kontrol et
SELECT 
    au.email AS "Email",
    ds.date AS "Tarih",
    COALESCE((ds.stats->>'points')::INTEGER, 0) AS "Bugünkü Puan",
    COALESCE((ds.stats->>'correct')::INTEGER, 0) AS "Bugünkü Doğru",
    COALESCE((ds.stats->>'wrong')::INTEGER, 0) AS "Bugünkü Yanlış",
    COALESCE((ds.stats->>'gamesPlayed')::INTEGER, 0) AS "Bugünkü Oyun"
FROM auth.users au
LEFT JOIN daily_stats ds ON au.id = ds.user_id AND ds.date = CURRENT_DATE
WHERE au.email = 'SİZİN-EMAIL-ADRESİNİZ@example.com'  -- EMAIL'İNİZİ BURAYA YAZIN
ORDER BY ds.date DESC;

-- 3. Rozet kontrolü (mübtedi rozeti kazanıldı mı?)
SELECT 
    au.email AS "Email",
    b.badge_id AS "Rozet ID",
    b.unlocked_at AS "Kazanma Tarihi"
FROM auth.users au
LEFT JOIN badges b ON au.id = b.user_id
WHERE au.email = 'SİZİN-EMAIL-ADRESİNİZ@example.com'  -- EMAIL'İNİZİ BURAYA YAZIN
ORDER BY b.unlocked_at DESC;

-- 4. TÜM KULLANICILAR İÇİN ÖZET (Email yazmadan)
SELECT 
    COALESCE(p.username, au.email) AS "Kullanıcı",
    COALESCE(us.total_points, 0) AS "Hasene",
    COALESCE((us.game_stats->>'totalCorrect')::INTEGER, 0) AS "Doğru",
    COALESCE((us.game_stats->>'totalWrong')::INTEGER, 0) AS "Yanlış",
    COALESCE((us.game_stats->'gameModeCounts'->>'kelime-cevir')::INTEGER, 0) AS "Kelime Çevir",
    (SELECT COUNT(*) FROM badges b WHERE b.user_id = au.id) AS "Rozet Sayısı",
    COALESCE(us.updated_at, au.created_at) AS "Son Güncelleme"
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
LEFT JOIN user_stats us ON au.id = us.user_id
ORDER BY COALESCE(us.total_points, 0) DESC, au.created_at DESC;
