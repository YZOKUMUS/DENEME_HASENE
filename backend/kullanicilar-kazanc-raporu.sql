-- ============================================
-- TÜM KULLANICILARIN KAZANÇ RAPORU
-- ============================================
-- Bu sorgu tüm oyuna giriş yapan kullanıcıların
-- kazançlarını detaylı bir şekilde gösterir
-- ============================================

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
    
    -- Toplam Oyun Sayısı
    (
        COALESCE((us.game_stats->'gameModeCounts'->>'kelime-cevir')::INTEGER, 0) +
        COALESCE((us.game_stats->'gameModeCounts'->>'dinle-bul')::INTEGER, 0) +
        COALESCE((us.game_stats->'gameModeCounts'->>'bosluk-doldur')::INTEGER, 0) +
        COALESCE((us.game_stats->'gameModeCounts'->>'ayet-oku')::INTEGER, 0) +
        COALESCE((us.game_stats->'gameModeCounts'->>'dua-et')::INTEGER, 0) +
        COALESCE((us.game_stats->'gameModeCounts'->>'hadis-oku')::INTEGER, 0)
    ) AS "🎮 Toplam Oyun",
    
    -- Haftalık XP (Bu Hafta)
    COALESCE(wl.weekly_xp, 0) AS "Bu Hafta XP",
    COALESCE(wl.league, 'mubtedi') AS "Lig",
    
    -- Günlük/Haftalık/Aylık İstatistikler
    (SELECT MIN(date) FROM daily_stats ds WHERE ds.user_id = au.id) AS "İlk Oyun Tarihi",
    (SELECT MAX(date) FROM daily_stats ds WHERE ds.user_id = au.id) AS "Son Oyun Tarihi",
    (SELECT COALESCE((stats->>'points')::INTEGER, 0) FROM daily_stats ds WHERE ds.user_id = au.id AND ds.date = CURRENT_DATE) AS "Bugünkü Puan",
    (SELECT COALESCE((stats->>'correct')::INTEGER, 0) FROM daily_stats ds WHERE ds.user_id = au.id AND ds.date = CURRENT_DATE) AS "Bugünkü Doğru",
    (SELECT COALESCE((stats->>'wrong')::INTEGER, 0) FROM daily_stats ds WHERE ds.user_id = au.id AND ds.date = CURRENT_DATE) AS "Bugünkü Yanlış",
    (SELECT COALESCE((stats->>'gamesPlayed')::INTEGER, 0) FROM daily_stats ds WHERE ds.user_id = au.id AND ds.date = CURRENT_DATE) AS "Bugünkü Oyun",
    (SELECT COALESCE((stats->>'perfectLessons')::INTEGER, 0) FROM daily_stats ds WHERE ds.user_id = au.id AND ds.date = CURRENT_DATE) AS "Bugünkü Mükemmel",
    (SELECT MAX((stats->>'points')::INTEGER) FROM daily_stats ds WHERE ds.user_id = au.id) AS "En Yüksek Günlük Puan",
    (SELECT MAX((stats->>'maxCombo')::INTEGER) FROM daily_stats ds WHERE ds.user_id = au.id) AS "En Yüksek Combo",
    (SELECT SUM(COALESCE((stats->>'points')::INTEGER, 0)) FROM daily_stats ds WHERE ds.user_id = au.id) AS "Toplam Günlük Puan",
    (SELECT SUM(COALESCE((stats->>'correct')::INTEGER, 0)) FROM daily_stats ds WHERE ds.user_id = au.id) AS "Toplam Günlük Doğru",
    (SELECT SUM(COALESCE((stats->>'wrong')::INTEGER, 0)) FROM daily_stats ds WHERE ds.user_id = au.id) AS "Toplam Günlük Yanlış",
    (SELECT SUM(COALESCE((stats->>'gamesPlayed')::INTEGER, 0)) FROM daily_stats ds WHERE ds.user_id = au.id) AS "Toplam Günlük Oyun",
    (SELECT SUM(COALESCE((stats->>'perfectLessons')::INTEGER, 0)) FROM daily_stats ds WHERE ds.user_id = au.id) AS "Toplam Günlük Mükemmel",
    (SELECT COUNT(DISTINCT date) FROM daily_stats ds WHERE ds.user_id = au.id) AS "Oynanan Gün Sayısı",
    (SELECT COALESCE((stats->>'hasene')::INTEGER, 0) FROM weekly_stats ws WHERE ws.user_id = au.id AND ws.week_start = DATE_TRUNC('week', CURRENT_DATE)::DATE) AS "Bu Hafta Toplam",
    (SELECT COALESCE((stats->>'correct')::INTEGER, 0) FROM weekly_stats ws WHERE ws.user_id = au.id AND ws.week_start = DATE_TRUNC('week', CURRENT_DATE)::DATE) AS "Bu Hafta Doğru",
    (SELECT COALESCE((stats->>'wrong')::INTEGER, 0) FROM weekly_stats ws WHERE ws.user_id = au.id AND ws.week_start = DATE_TRUNC('week', CURRENT_DATE)::DATE) AS "Bu Hafta Yanlış",
    (SELECT COALESCE((stats->>'gamesPlayed')::INTEGER, 0) FROM weekly_stats ws WHERE ws.user_id = au.id AND ws.week_start = DATE_TRUNC('week', CURRENT_DATE)::DATE) AS "Bu Hafta Oyun",
    (SELECT COALESCE((stats->>'daysPlayed')::INTEGER, 0) FROM weekly_stats ws WHERE ws.user_id = au.id AND ws.week_start = DATE_TRUNC('week', CURRENT_DATE)::DATE) AS "Bu Hafta Oynanan Gün",
    (SELECT COALESCE((stats->>'streakDays')::INTEGER, 0) FROM weekly_stats ws WHERE ws.user_id = au.id AND ws.week_start = DATE_TRUNC('week', CURRENT_DATE)::DATE) AS "Bu Hafta Seri Gün",
    (SELECT MAX((stats->>'hasene')::INTEGER) FROM weekly_stats ws WHERE ws.user_id = au.id) AS "En Yüksek Haftalık Puan",
    (SELECT SUM(COALESCE((stats->>'hasene')::INTEGER, 0)) FROM weekly_stats ws WHERE ws.user_id = au.id) AS "Toplam Haftalık Puan",
    (SELECT SUM(COALESCE((stats->>'correct')::INTEGER, 0)) FROM weekly_stats ws WHERE ws.user_id = au.id) AS "Toplam Haftalık Doğru",
    (SELECT SUM(COALESCE((stats->>'wrong')::INTEGER, 0)) FROM weekly_stats ws WHERE ws.user_id = au.id) AS "Toplam Haftalık Yanlış",
    (SELECT SUM(COALESCE((stats->>'gamesPlayed')::INTEGER, 0)) FROM weekly_stats ws WHERE ws.user_id = au.id) AS "Toplam Haftalık Oyun",
    (SELECT COALESCE((stats->>'hasene')::INTEGER, 0) FROM monthly_stats ms WHERE ms.user_id = au.id AND ms.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')) AS "Bu Ay Toplam",
    (SELECT COALESCE((stats->>'correct')::INTEGER, 0) FROM monthly_stats ms WHERE ms.user_id = au.id AND ms.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')) AS "Bu Ay Doğru",
    (SELECT COALESCE((stats->>'wrong')::INTEGER, 0) FROM monthly_stats ms WHERE ms.user_id = au.id AND ms.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')) AS "Bu Ay Yanlış",
    (SELECT COALESCE((stats->>'gamesPlayed')::INTEGER, 0) FROM monthly_stats ms WHERE ms.user_id = au.id AND ms.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')) AS "Bu Ay Oyun",
    (SELECT COALESCE((stats->>'daysPlayed')::INTEGER, 0) FROM monthly_stats ms WHERE ms.user_id = au.id AND ms.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')) AS "Bu Ay Oynanan Gün",
    (SELECT COALESCE((stats->>'streakDays')::INTEGER, 0) FROM monthly_stats ms WHERE ms.user_id = au.id AND ms.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')) AS "Bu Ay Seri Gün",
    (SELECT COALESCE((stats->>'bestStreak')::INTEGER, 0) FROM monthly_stats ms WHERE ms.user_id = au.id AND ms.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')) AS "Bu Ay En İyi Seri",
    (SELECT MAX((stats->>'hasene')::INTEGER) FROM monthly_stats ms WHERE ms.user_id = au.id) AS "En Yüksek Aylık Puan",
    (SELECT SUM(COALESCE((stats->>'hasene')::INTEGER, 0)) FROM monthly_stats ms WHERE ms.user_id = au.id) AS "Toplam Aylık Puan",
    (SELECT SUM(COALESCE((stats->>'correct')::INTEGER, 0)) FROM monthly_stats ms WHERE ms.user_id = au.id) AS "Toplam Aylık Doğru",
    (SELECT SUM(COALESCE((stats->>'wrong')::INTEGER, 0)) FROM monthly_stats ms WHERE ms.user_id = au.id) AS "Toplam Aylık Yanlış",
    (SELECT SUM(COALESCE((stats->>'gamesPlayed')::INTEGER, 0)) FROM monthly_stats ms WHERE ms.user_id = au.id) AS "Toplam Aylık Oyun",
    
    -- En Aktif Gün (En çok puan kazanılan gün)
    (SELECT date FROM daily_stats ds WHERE ds.user_id = au.id 
        ORDER BY (stats->>'points')::INTEGER DESC LIMIT 1) AS "En Aktif Gün",
    (SELECT (stats->>'points')::INTEGER FROM daily_stats ds WHERE ds.user_id = au.id 
        ORDER BY (stats->>'points')::INTEGER DESC LIMIT 1) AS "En Aktif Gün Puanı",
    (SELECT (stats->>'correct')::INTEGER FROM daily_stats ds WHERE ds.user_id = au.id 
        ORDER BY (stats->>'points')::INTEGER DESC LIMIT 1) AS "En Aktif Gün Doğru",
    (SELECT (stats->>'gamesPlayed')::INTEGER FROM daily_stats ds WHERE ds.user_id = au.id 
        ORDER BY (stats->>'points')::INTEGER DESC LIMIT 1) AS "En Aktif Gün Oyun",
    
    -- Ortalama Hesaplamalar
    CASE 
        WHEN COALESCE((us.streak_data->>'totalPlayDays')::INTEGER, 0) > 0
        THEN ROUND(COALESCE(us.total_points, 0)::NUMERIC / (us.streak_data->>'totalPlayDays')::NUMERIC, 2)
        ELSE 0
    END AS "Ortalama Günlük Puan",
    CASE 
        WHEN COALESCE((us.streak_data->>'totalPlayDays')::INTEGER, 0) > 0
        THEN ROUND(
            (
                COALESCE((us.game_stats->'gameModeCounts'->>'kelime-cevir')::INTEGER, 0) +
                COALESCE((us.game_stats->'gameModeCounts'->>'dinle-bul')::INTEGER, 0) +
                COALESCE((us.game_stats->'gameModeCounts'->>'bosluk-doldur')::INTEGER, 0) +
                COALESCE((us.game_stats->'gameModeCounts'->>'ayet-oku')::INTEGER, 0) +
                COALESCE((us.game_stats->'gameModeCounts'->>'dua-et')::INTEGER, 0) +
                COALESCE((us.game_stats->'gameModeCounts'->>'hadis-oku')::INTEGER, 0)
            )::NUMERIC / (us.streak_data->>'totalPlayDays')::NUMERIC, 
            2
        )
        ELSE 0
    END AS "Ortalama Günlük Oyun",
    CASE 
        WHEN (
            COALESCE((us.game_stats->'gameModeCounts'->>'kelime-cevir')::INTEGER, 0) +
            COALESCE((us.game_stats->'gameModeCounts'->>'dinle-bul')::INTEGER, 0) +
            COALESCE((us.game_stats->'gameModeCounts'->>'bosluk-doldur')::INTEGER, 0) +
            COALESCE((us.game_stats->'gameModeCounts'->>'ayet-oku')::INTEGER, 0) +
            COALESCE((us.game_stats->'gameModeCounts'->>'dua-et')::INTEGER, 0) +
            COALESCE((us.game_stats->'gameModeCounts'->>'hadis-oku')::INTEGER, 0)
        ) > 0
        THEN ROUND(
            COALESCE(us.total_points, 0)::NUMERIC / 
            (
                COALESCE((us.game_stats->'gameModeCounts'->>'kelime-cevir')::INTEGER, 0) +
                COALESCE((us.game_stats->'gameModeCounts'->>'dinle-bul')::INTEGER, 0) +
                COALESCE((us.game_stats->'gameModeCounts'->>'bosluk-doldur')::INTEGER, 0) +
                COALESCE((us.game_stats->'gameModeCounts'->>'ayet-oku')::INTEGER, 0) +
                COALESCE((us.game_stats->'gameModeCounts'->>'dua-et')::INTEGER, 0) +
                COALESCE((us.game_stats->'gameModeCounts'->>'hadis-oku')::INTEGER, 0)
            )::NUMERIC, 
            2
        )
        ELSE 0
    END AS "Ortalama Oyun Başına Puan",
    
    -- Rozet ve Başarım Sayıları
    (SELECT COUNT(*) FROM badges b WHERE b.user_id = au.id) AS "Toplam Rozet",
    (SELECT MAX(unlocked_at) FROM badges b WHERE b.user_id = au.id) AS "Son Rozet Tarihi",
    (SELECT COUNT(*) FROM achievements a WHERE a.user_id = au.id) AS "Toplam Başarım",
    (SELECT MAX(unlocked_at) FROM achievements a WHERE a.user_id = au.id) AS "Son Başarım Tarihi",
    
    -- Kelime İstatistikleri
    (SELECT COUNT(*) FROM word_stats ws WHERE ws.user_id = au.id) AS "Toplam Öğrenilen Kelime",
    (SELECT COUNT(*) FROM word_stats ws WHERE ws.user_id = au.id 
        AND (ws.stats->>'successRate')::NUMERIC < 50 
        AND (ws.stats->>'attempts')::INTEGER >= 2) AS "Zorlanılan Kelime",
    (SELECT COUNT(*) FROM word_stats ws WHERE ws.user_id = au.id 
        AND (ws.stats->>'successRate')::NUMERIC >= 80 
        AND (ws.stats->>'attempts')::INTEGER >= 3) AS "İyi Bilinen Kelime",
    (SELECT COUNT(*) FROM word_stats ws WHERE ws.user_id = au.id 
        AND (ws.stats->>'attempts')::INTEGER >= 5) AS "Çok Denenen Kelime",
    (SELECT SUM(COALESCE((ws.stats->>'attempts')::INTEGER, 0)) FROM word_stats ws WHERE ws.user_id = au.id) AS "Toplam Kelime Denemesi",
    (SELECT SUM(COALESCE((ws.stats->>'correct')::INTEGER, 0)) FROM word_stats ws WHERE ws.user_id = au.id) AS "Toplam Kelime Doğru",
    (SELECT SUM(COALESCE((ws.stats->>'wrong')::INTEGER, 0)) FROM word_stats ws WHERE ws.user_id = au.id) AS "Toplam Kelime Yanlış",
    (SELECT AVG(COALESCE((ws.stats->>'successRate')::NUMERIC, 0)) FROM word_stats ws WHERE ws.user_id = au.id 
        AND (ws.stats->>'attempts')::INTEGER >= 1) AS "Ortalama Kelime Başarı Oranı %",
    (SELECT MAX(COALESCE((ws.stats->>'masteryLevel')::INTEGER, 0)) FROM word_stats ws WHERE ws.user_id = au.id) AS "En Yüksek Kelime Ustalık Seviyesi",
    
    -- Favori Kelime Sayısı
    (SELECT COUNT(*) FROM favorite_words fw WHERE fw.user_id = au.id) AS "Favori Kelime",
    
    -- Görev İstatistikleri
    (SELECT COUNT(*) FROM daily_tasks dt, jsonb_array_elements(dt.tasks) task 
        WHERE dt.user_id = au.id AND (task->>'completed')::BOOLEAN = true) AS "Tamamlanan Günlük Görev",
    (SELECT COUNT(*) FROM weekly_tasks wt, jsonb_array_elements(wt.tasks) task 
        WHERE wt.user_id = au.id AND (task->>'completed')::BOOLEAN = true) AS "Tamamlanan Haftalık Görev",
    (SELECT COALESCE(rewards_claimed, false) FROM daily_tasks dt WHERE dt.user_id = au.id) AS "Günlük Ödül Alındı",
    (SELECT COALESCE(rewards_claimed, false) FROM weekly_tasks wt WHERE wt.user_id = au.id) AS "Haftalık Ödül Alındı",
    
    -- En Çok Oynanan Oyun Modu
    CASE 
        WHEN us.user_id IS NULL OR us.game_stats IS NULL OR (us.game_stats->'gameModeCounts') IS NULL THEN '❌ Oyun Yok'
        WHEN COALESCE((us.game_stats->'gameModeCounts'->>'kelime-cevir')::INTEGER, 0) >= 
             GREATEST(
                 COALESCE((us.game_stats->'gameModeCounts'->>'dinle-bul')::INTEGER, 0),
                 COALESCE((us.game_stats->'gameModeCounts'->>'bosluk-doldur')::INTEGER, 0),
                 COALESCE((us.game_stats->'gameModeCounts'->>'ayet-oku')::INTEGER, 0),
                 COALESCE((us.game_stats->'gameModeCounts'->>'dua-et')::INTEGER, 0),
                 COALESCE((us.game_stats->'gameModeCounts'->>'hadis-oku')::INTEGER, 0)
             ) THEN '📝 Kelime Çevir'
        WHEN COALESCE((us.game_stats->'gameModeCounts'->>'dinle-bul')::INTEGER, 0) >= 
             GREATEST(
                 COALESCE((us.game_stats->'gameModeCounts'->>'bosluk-doldur')::INTEGER, 0),
                 COALESCE((us.game_stats->'gameModeCounts'->>'ayet-oku')::INTEGER, 0),
                 COALESCE((us.game_stats->'gameModeCounts'->>'dua-et')::INTEGER, 0),
                 COALESCE((us.game_stats->'gameModeCounts'->>'hadis-oku')::INTEGER, 0)
             ) THEN '🎧 Dinle Bul'
        WHEN COALESCE((us.game_stats->'gameModeCounts'->>'bosluk-doldur')::INTEGER, 0) >= 
             GREATEST(
                 COALESCE((us.game_stats->'gameModeCounts'->>'ayet-oku')::INTEGER, 0),
                 COALESCE((us.game_stats->'gameModeCounts'->>'dua-et')::INTEGER, 0),
                 COALESCE((us.game_stats->'gameModeCounts'->>'hadis-oku')::INTEGER, 0)
             ) THEN '✍️ Boşluk Doldur'
        WHEN COALESCE((us.game_stats->'gameModeCounts'->>'ayet-oku')::INTEGER, 0) >= 
             GREATEST(
                 COALESCE((us.game_stats->'gameModeCounts'->>'dua-et')::INTEGER, 0),
                 COALESCE((us.game_stats->'gameModeCounts'->>'hadis-oku')::INTEGER, 0)
             ) THEN '📖 Ayet Oku'
        WHEN COALESCE((us.game_stats->'gameModeCounts'->>'dua-et')::INTEGER, 0) >= 
             COALESCE((us.game_stats->'gameModeCounts'->>'hadis-oku')::INTEGER, 0) THEN '🤲 Dua Et'
        WHEN COALESCE((us.game_stats->'gameModeCounts'->>'hadis-oku')::INTEGER, 0) > 0 THEN '📚 Hadis Oku'
        ELSE '❌ Oyun Yok'
    END AS "En Çok Oynanan Mod",
    
    -- Son Güncelleme (sadece oyun oynanmışsa göster)
    CASE 
        WHEN us.user_id IS NOT NULL AND us.updated_at IS NOT NULL THEN us.updated_at
        ELSE NULL
    END AS "Son Güncelleme",
    
    -- Durum Bilgisi
    CASE 
        WHEN us.user_id IS NOT NULL THEN '✅ Oyun Oynamış'
        WHEN p.id IS NOT NULL THEN '📝 Profil Var (Oyun Yok)'
        ELSE '👤 Sadece Kayıt'
    END AS "Durum"
    
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
LEFT JOIN user_stats us ON au.id = us.user_id
LEFT JOIN weekly_leaderboard wl ON au.id = wl.user_id 
    AND wl.week_start = (
        SELECT DATE_TRUNC('week', CURRENT_DATE)::DATE + 1
    )
ORDER BY 
    COALESCE(us.total_points, 0) DESC,  -- Önce en yüksek puanlılar
    COALESCE((us.streak_data->>'bestStreak')::INTEGER, 0) DESC,  -- Sonra en iyi seri
    au.created_at ASC;  -- Son olarak kayıt tarihi

-- ============================================
-- ÖZET İSTATİSTİKLER (Ayrı bir sorgu)
-- ============================================
-- Yukarıdaki sorguyu çalıştırdıktan sonra,
-- aşağıdaki sorguyu da çalıştırarak özet görebilirsiniz:

/*
SELECT 
    COUNT(DISTINCT p.id) AS "Toplam Kullanıcı",
    COUNT(DISTINCT CASE WHEN us.total_points > 0 THEN p.id END) AS "Oyun Oynayan",
    SUM(COALESCE(us.total_points, 0)) AS "Toplam Hasene (Tüm Kullanıcılar)",
    AVG(COALESCE(us.total_points, 0)) AS "Ortalama Hasene",
    MAX(COALESCE(us.total_points, 0)) AS "En Yüksek Hasene",
    SUM(COALESCE((us.game_stats->>'totalCorrect')::INTEGER, 0)) AS "Toplam Doğru Cevap",
    SUM(COALESCE((us.game_stats->>'totalWrong')::INTEGER, 0)) AS "Toplam Yanlış Cevap",
    AVG(COALESCE((us.streak_data->>'bestStreak')::INTEGER, 0)) AS "Ortalama En İyi Seri",
    MAX(COALESCE((us.streak_data->>'bestStreak')::INTEGER, 0)) AS "En Yüksek Seri"
FROM profiles p
LEFT JOIN user_stats us ON p.id = us.user_id
LEFT JOIN auth.users au ON p.id = au.id
WHERE au.email IS NOT NULL;
*/
