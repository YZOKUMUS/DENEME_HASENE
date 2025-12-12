-- ============================================
-- KULLANICI DETAY RAPORU (Okunabilir Format)
-- ============================================
-- Kullanıcı adı üstte, veriler alt alta satırlar halinde
-- Her kullanıcı için ayrı blok
-- ============================================

-- BELİRLİ BİR KULLANICI İÇİN DETAYLI RAPOR
-- Kullanıcı ID'sini değiştirin veya tüm kullanıcılar için çalıştırın

-- KULLANICI LİSTESİ (İlk 10 kullanıcı - LIMIT'i değiştirebilirsiniz)
WITH user_list AS (
    SELECT DISTINCT 
        u.id as user_id,
        COALESCE(p.username, u.email, u.id::text) as kullanici_adi,
        u.email,
        u.created_at
    FROM auth.users u
    LEFT JOIN profiles p ON p.id = u.id
    WHERE u.id IN (
        SELECT DISTINCT user_id FROM user_stats
        UNION
        SELECT DISTINCT user_id FROM daily_stats
        UNION
        SELECT DISTINCT user_id FROM weekly_stats
        UNION
        SELECT DISTINCT user_id FROM monthly_stats
    )
    ORDER BY u.created_at DESC
    LIMIT 10
),
-- TÜM VERİLERİ BİRLEŞTİR
user_data AS (
    SELECT 
        ud.user_id,
        ud.kullanici_adi,
        ud.email,
        -- USER_STATS
        us.total_points,
        us.badges->>'stars' as stars,
        us.game_stats->>'totalCorrect' as total_correct,
        us.game_stats->>'totalWrong' as total_wrong,
        us.perfect_lessons_count,
        us.streak_data->>'currentStreak' as current_streak,
        us.streak_data->>'bestStreak' as best_streak,
        us.game_stats->'gameModeCounts'->>'kelime-cevir' as kelime_cevir,
        us.game_stats->'gameModeCounts'->>'dinle-bul' as dinle_bul,
        us.game_stats->'gameModeCounts'->>'bosluk-doldur' as bosluk_doldur,
        us.game_stats->'gameModeCounts'->>'ayet-oku' as ayet_oku,
        us.game_stats->'gameModeCounts'->>'dua-et' as dua_et,
        us.game_stats->'gameModeCounts'->>'hadis-oku' as hadis_oku,
        us.badges->>'bronze' as bronze,
        us.badges->>'silver' as silver,
        us.badges->>'gold' as gold,
        us.badges->>'diamond' as diamond,
        -- DAILY_STATS
        ds.stats->>'points' as daily_points,
        ds.stats->>'correct' as daily_correct,
        ds.stats->>'wrong' as daily_wrong,
        ds.stats->>'maxCombo' as daily_max_combo,
        ds.stats->>'gamesPlayed' as daily_games_played,
        ds.stats->>'perfectLessons' as daily_perfect_lessons,
        -- WEEKLY_STATS (Bu hafta için)
        ws.stats->>'hasene' as weekly_hasene,
        ws.stats->>'correct' as weekly_correct,
        ws.stats->>'wrong' as weekly_wrong,
        ws.stats->>'daysPlayed' as weekly_days_played,
        ws.stats->>'gamesPlayed' as weekly_games_played,
        ws.week_start as weekly_week_start,
        -- MONTHLY_STATS (Bu ay için)
        ms.stats->>'hasene' as monthly_hasene,
        ms.stats->>'correct' as monthly_correct,
        ms.stats->>'wrong' as monthly_wrong,
        ms.stats->>'daysPlayed' as monthly_days_played,
        ms.stats->>'gamesPlayed' as monthly_games_played,
        ms.month as monthly_month,
        -- WORD_STATS
        (SELECT COUNT(*) FROM word_stats ws2 WHERE ws2.user_id = ud.user_id) as word_count,
        -- DAILY_TASKS
        dt.last_task_date as daily_task_date,
        dt.rewards_claimed as daily_rewards_claimed,
        -- WEEKLY_TASKS
        wt.week_start as weekly_task_start,
        wt.week_end as weekly_task_end,
        wt.rewards_claimed as weekly_rewards_claimed
    FROM user_list ud
    LEFT JOIN user_stats us ON us.user_id = ud.user_id
    LEFT JOIN daily_stats ds ON ds.user_id = ud.user_id AND ds.date = CURRENT_DATE
    LEFT JOIN weekly_stats ws ON ws.user_id = ud.user_id 
        AND ws.week_start = (
            SELECT DATE_TRUNC('week', CURRENT_DATE)::date + 
                   CASE WHEN EXTRACT(DOW FROM CURRENT_DATE) = 0 THEN -6 ELSE 1 END -
                   EXTRACT(DOW FROM CURRENT_DATE)::int
        )
    LEFT JOIN monthly_stats ms ON ms.user_id = ud.user_id 
        AND ms.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
    LEFT JOIN daily_tasks dt ON dt.user_id = ud.user_id
    LEFT JOIN weekly_tasks wt ON wt.user_id = ud.user_id
)
-- HER KULLANICI İÇİN DETAYLI RAPOR
SELECT 
    rapor_satiri
FROM (
    -- KULLANICI BAŞLIĞI
    SELECT user_id, 1 as sira, '═══════════════════════════════════════════════════════════════' as rapor_satiri FROM user_data
    UNION ALL
    SELECT user_id, 2, '👤 KULLANICI: ' || kullanici_adi || ' (' || email || ')' FROM user_data
    UNION ALL
    SELECT user_id, 3, '───────────────────────────────────────────────────────────────' FROM user_data
    
    UNION ALL
    
    -- TOPLAM İSTATİSTİKLER
    SELECT user_id, 4, '📊 TOPLAM İSTATİSTİKLER' FROM user_data
    UNION ALL
    SELECT user_id, 5, '  • Toplam Hasene: ' || COALESCE(total_points::text, '0') FROM user_data
    UNION ALL
    SELECT user_id, 6, '  • Yıldız: ' || COALESCE(stars, '0') FROM user_data
    UNION ALL
    SELECT user_id, 7, '  • Toplam Doğru: ' || COALESCE(total_correct, '0') FROM user_data
    UNION ALL
    SELECT user_id, 8, '  • Toplam Yanlış: ' || COALESCE(total_wrong, '0') FROM user_data
    UNION ALL
    SELECT user_id, 9, '  • Mükemmel Ders: ' || COALESCE(perfect_lessons_count::text, '0') FROM user_data
    UNION ALL
    SELECT user_id, 10, '  • Seri (Streak): ' || COALESCE(current_streak, '0') || ' gün' FROM user_data
    UNION ALL
    SELECT user_id, 11, '  • En İyi Seri: ' || COALESCE(best_streak, '0') || ' gün' FROM user_data
    
    UNION ALL
    
    -- OYUN MODU İSTATİSTİKLERİ
    SELECT user_id, 12, '───────────────────────────────────────────────────────────────' FROM user_data
    UNION ALL
    SELECT user_id, 13, '🎮 OYUN MODU İSTATİSTİKLERİ' FROM user_data
    UNION ALL
    SELECT user_id, 14, '  • Kelime Çevir: ' || COALESCE(kelime_cevir, '0') || ' oyun' FROM user_data
    UNION ALL
    SELECT user_id, 15, '  • Dinle Bul: ' || COALESCE(dinle_bul, '0') || ' oyun' FROM user_data
    UNION ALL
    SELECT user_id, 16, '  • Boşluk Doldur: ' || COALESCE(bosluk_doldur, '0') || ' oyun' FROM user_data
    UNION ALL
    SELECT user_id, 17, '  • Ayet Oku: ' || COALESCE(ayet_oku, '0') || ' oyun' FROM user_data
    UNION ALL
    SELECT user_id, 18, '  • Dua Et: ' || COALESCE(dua_et, '0') || ' oyun' FROM user_data
    UNION ALL
    SELECT user_id, 19, '  • Hadis Oku: ' || COALESCE(hadis_oku, '0') || ' oyun' FROM user_data
    
    UNION ALL
    
    -- BUGÜNKÜ İSTATİSTİKLER
    SELECT user_id, 20, '───────────────────────────────────────────────────────────────' FROM user_data
    UNION ALL
    SELECT user_id, 21, '📅 BUGÜNKÜ İSTATİSTİKLER (' || CURRENT_DATE::text || ')' FROM user_data
    UNION ALL
    SELECT user_id, 22, '  • Hasene: ' || COALESCE(daily_points, '0') FROM user_data
    UNION ALL
    SELECT user_id, 23, '  • Doğru: ' || COALESCE(daily_correct, '0') FROM user_data
    UNION ALL
    SELECT user_id, 24, '  • Yanlış: ' || COALESCE(daily_wrong, '0') FROM user_data
    UNION ALL
    SELECT user_id, 25, '  • Max Combo: ' || COALESCE(daily_max_combo, '0') FROM user_data
    UNION ALL
    SELECT user_id, 26, '  • Oyun Sayısı: ' || COALESCE(daily_games_played, '0') FROM user_data
    UNION ALL
    SELECT user_id, 27, '  • Mükemmel Ders: ' || COALESCE(daily_perfect_lessons, '0') FROM user_data
    
    UNION ALL
    
    -- HAFTALIK İSTATİSTİKLER
    SELECT user_id, 28, '───────────────────────────────────────────────────────────────' FROM user_data
    UNION ALL
    SELECT user_id, 29, '📆 HAFTALIK İSTATİSTİKLER (Bu Hafta)' FROM user_data
    UNION ALL
    SELECT user_id, 30, '  • Hafta: ' || COALESCE(
        weekly_week_start::text || ' - ' || (weekly_week_start + INTERVAL '6 days')::text, 
        'Veri yok'
    ) FROM user_data
    UNION ALL
    SELECT user_id, 31, '  • Hasene: ' || COALESCE(weekly_hasene, '0') FROM user_data
    UNION ALL
    SELECT user_id, 32, '  • Doğru: ' || COALESCE(weekly_correct, '0') FROM user_data
    UNION ALL
    SELECT user_id, 33, '  • Yanlış: ' || COALESCE(weekly_wrong, '0') FROM user_data
    UNION ALL
    SELECT user_id, 34, '  • Oynanan Gün: ' || COALESCE(weekly_days_played, '0') || '/7' FROM user_data
    UNION ALL
    SELECT user_id, 35, '  • Oyun Sayısı: ' || COALESCE(weekly_games_played, '0') FROM user_data
    
    UNION ALL
    
    -- AYLIK İSTATİSTİKLER
    SELECT user_id, 36, '───────────────────────────────────────────────────────────────' FROM user_data
    UNION ALL
    SELECT user_id, 37, '📅 AYLIK İSTATİSTİKLER (Bu Ay)' FROM user_data
    UNION ALL
    SELECT user_id, 38, '  • Ay: ' || COALESCE(monthly_month, 'Veri yok') FROM user_data
    UNION ALL
    SELECT user_id, 39, '  • Hasene: ' || COALESCE(monthly_hasene, '0') FROM user_data
    UNION ALL
    SELECT user_id, 40, '  • Doğru: ' || COALESCE(monthly_correct, '0') FROM user_data
    UNION ALL
    SELECT user_id, 41, '  • Yanlış: ' || COALESCE(monthly_wrong, '0') FROM user_data
    UNION ALL
    SELECT user_id, 42, '  • Oynanan Gün: ' || COALESCE(monthly_days_played, '0') FROM user_data
    UNION ALL
    SELECT user_id, 43, '  • Oyun Sayısı: ' || COALESCE(monthly_games_played, '0') FROM user_data
    
    UNION ALL
    
    -- ROZETLER
    SELECT user_id, 44, '───────────────────────────────────────────────────────────────' FROM user_data
    UNION ALL
    SELECT user_id, 45, '🏆 ROZETLER' FROM user_data
    UNION ALL
    SELECT user_id, 46, '  • Yıldız: ' || COALESCE(stars, '0') FROM user_data
    UNION ALL
    SELECT user_id, 47, '  • Bronz: ' || COALESCE(bronze, '0') FROM user_data
    UNION ALL
    SELECT user_id, 48, '  • Gümüş: ' || COALESCE(silver, '0') FROM user_data
    UNION ALL
    SELECT user_id, 49, '  • Altın: ' || COALESCE(gold, '0') FROM user_data
    UNION ALL
    SELECT user_id, 50, '  • Elmas: ' || COALESCE(diamond, '0') FROM user_data
    
    UNION ALL
    
    -- KELİME İSTATİSTİKLERİ
    SELECT user_id, 51, '───────────────────────────────────────────────────────────────' FROM user_data
    UNION ALL
    SELECT user_id, 52, '📚 KELİME İSTATİSTİKLERİ' FROM user_data
    UNION ALL
    SELECT user_id, 53, '  • Toplam Kelime: ' || COALESCE(word_count::text, '0') FROM user_data
    
    UNION ALL
    
    -- GÖREVLER
    SELECT user_id, 54, '───────────────────────────────────────────────────────────────' FROM user_data
    UNION ALL
    SELECT user_id, 55, '✅ GÖREVLER' FROM user_data
    UNION ALL
    SELECT user_id, 56, '  • Günlük Görevler - Son Tarih: ' || COALESCE(daily_task_date::text, 'Veri yok') FROM user_data
    UNION ALL
    SELECT user_id, 57, '  • Günlük Görevler - Ödül Alındı: ' || CASE WHEN daily_rewards_claimed THEN 'Evet' ELSE 'Hayır' END FROM user_data
    UNION ALL
    SELECT user_id, 58, '  • Haftalık Görevler - Hafta: ' || COALESCE(
        weekly_task_start::text || ' - ' || weekly_task_end::text, 
        'Veri yok'
    ) FROM user_data
    UNION ALL
    SELECT user_id, 59, '  • Haftalık Görevler - Ödül Alındı: ' || CASE WHEN weekly_rewards_claimed THEN 'Evet' ELSE 'Hayır' END FROM user_data
    UNION ALL
    SELECT user_id, 60, '═══════════════════════════════════════════════════════════════' FROM user_data
) report_data
ORDER BY user_id, sira;
