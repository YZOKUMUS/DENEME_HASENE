-- ============================================
-- HAFTALIK LİG FONKSİYONU KURULUMU
-- ============================================
-- Bu dosyayı Supabase SQL Editor'da çalıştırarak
-- increment_weekly_xp fonksiyonunu oluştur/güncelle
-- ============================================

-- Weekly XP Artırma Fonksiyonu
-- SECURITY DEFINER kullanılıyor çünkü RLS politikalarını bypass etmek gerekiyor
-- Ancak güvenlik için auth.uid() kontrolü eklendi
CREATE OR REPLACE FUNCTION increment_weekly_xp(
    p_user_id UUID,
    p_week_start DATE,
    p_points INTEGER
)
RETURNS void 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Güvenlik kontrolü: Kullanıcı sadece kendi verilerini güncelleyebilir
    IF p_user_id != auth.uid() THEN
        RAISE EXCEPTION 'Permission denied: You can only update your own data';
    END IF;
    
    INSERT INTO weekly_leaderboard (user_id, week_start, week_end, weekly_xp, league)
    VALUES (
        p_user_id,
        p_week_start,
        p_week_start + INTERVAL '6 days',
        p_points,
        COALESCE(
            (SELECT current_league FROM user_leagues WHERE user_id = p_user_id),
            'mubtedi'
        )
    )
    ON CONFLICT (user_id, week_start)
    DO UPDATE SET
        weekly_xp = weekly_leaderboard.weekly_xp + p_points,
        updated_at = NOW();
    
    -- İlk kayıt ise user_leagues'e ekle
    INSERT INTO user_leagues (user_id, current_league, current_week_start)
    VALUES (p_user_id, 'mubtedi', p_week_start)
    ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- ============================================
-- KONTROL SORGUSU
-- ============================================
-- Fonksiyonun başarıyla oluşturulduğunu kontrol et
SELECT 
    '✅ increment_weekly_xp fonksiyonu başarıyla oluşturuldu!' as sonuc,
    proname as fonksiyon_adi,
    pg_get_function_identity_arguments(oid) as parametreler
FROM pg_proc
WHERE proname = 'increment_weekly_xp';
