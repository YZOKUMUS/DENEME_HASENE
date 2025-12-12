-- ============================================
-- VIEW GÜVENLİK DÜZELTMESİ
-- ============================================
-- Bu dosya, SECURITY DEFINER sorununu çözmek için view'ları düzeltir
-- Supabase SQL Editor'de bu dosyayı çalıştırın
-- ============================================

-- Önce mevcut view'ları sil
DROP VIEW IF EXISTS leaderboard CASCADE;
DROP VIEW IF EXISTS league_rankings CASCADE;

-- Leaderboard View'ı SECURITY INVOKER ile yeniden oluştur
CREATE VIEW leaderboard
WITH (security_invoker = true) AS
SELECT 
    p.id,
    p.username,
    us.total_points,
    us.streak_data->>'bestStreak' as best_streak,
    us.game_stats->>'totalCorrect' as total_correct,
    us.updated_at
FROM profiles p
JOIN user_stats us ON p.id = us.user_id
ORDER BY us.total_points DESC, us.updated_at DESC
LIMIT 100;

-- League Rankings View'ı SECURITY INVOKER ile yeniden oluştur
CREATE VIEW league_rankings
WITH (security_invoker = true) AS
SELECT 
    wl.id,
    wl.user_id,
    p.username,
    wl.weekly_xp,
    wl.league,
    wl.week_start,
    ROW_NUMBER() OVER (
        PARTITION BY wl.league, wl.week_start 
        ORDER BY wl.weekly_xp DESC, wl.updated_at ASC
    ) as position
FROM weekly_leaderboard wl
JOIN profiles p ON wl.user_id = p.id
WHERE wl.week_start = (
    SELECT DATE_TRUNC('week', CURRENT_DATE)::DATE + 1
);

-- ============================================
-- ALTERNATİF ÇÖZÜM (Eğer yukarıdaki çalışmazsa)
-- ============================================
-- PostgreSQL 15'ten eski versiyonlarda WITH (security_invoker = true) 
-- syntax'ı çalışmayabilir. Bu durumda view'ları normal şekilde oluşturup
-- sonra ALTER VIEW komutunu kullanın:

/*
-- Önce view'ları normal şekilde oluştur
CREATE VIEW leaderboard AS
SELECT 
    p.id,
    p.username,
    us.total_points,
    us.streak_data->>'bestStreak' as best_streak,
    us.game_stats->>'totalCorrect' as total_correct,
    us.updated_at
FROM profiles p
JOIN user_stats us ON p.id = us.user_id
ORDER BY us.total_points DESC, us.updated_at DESC
LIMIT 100;

CREATE VIEW league_rankings AS
SELECT 
    wl.id,
    wl.user_id,
    p.username,
    wl.weekly_xp,
    wl.league,
    wl.week_start,
    ROW_NUMBER() OVER (
        PARTITION BY wl.league, wl.week_start 
        ORDER BY wl.weekly_xp DESC, wl.updated_at ASC
    ) as position
FROM weekly_leaderboard wl
JOIN profiles p ON wl.user_id = p.id
WHERE wl.week_start = (
    SELECT DATE_TRUNC('week', CURRENT_DATE)::DATE + 1
);

-- Sonra ALTER VIEW ile security_invoker ayarla (PostgreSQL 15+)
ALTER VIEW leaderboard SET (security_invoker = true);
ALTER VIEW league_rankings SET (security_invoker = true);
*/

-- ============================================
-- KONTROL
-- ============================================
-- View'ların düzgün oluşturulduğunu kontrol edin:
SELECT 
    schemaname,
    viewname,
    viewowner
FROM pg_views
WHERE viewname IN ('leaderboard', 'league_rankings');

-- Security invoker ayarını kontrol edin (PostgreSQL 15+):
SELECT 
    n.nspname as schema_name,
    c.relname as view_name,
    c.reloptions as view_options
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind = 'v'
  AND c.relname IN ('leaderboard', 'league_rankings');

