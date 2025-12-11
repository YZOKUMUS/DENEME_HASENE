-- ============================================
-- BACKEND VERİLERİNİ SIFIRDAN BAŞLAT
-- DİKKAT: Bu script TÜM VERİLERİ SİLER!
-- ============================================

-- 1. Tüm veri tablolarındaki kayıtları sil
DELETE FROM weekly_leaderboard;
DELETE FROM user_leagues;
DELETE FROM daily_stats;
DELETE FROM weekly_stats;
DELETE FROM monthly_stats;
DELETE FROM word_stats;
DELETE FROM favorite_words;
DELETE FROM achievements;
DELETE FROM badges;
DELETE FROM daily_tasks;
DELETE FROM weekly_tasks;
DELETE FROM user_stats;
DELETE FROM profiles WHERE id NOT IN (SELECT id FROM auth.users);

-- 2. Leaderboard tablolarını tamamen sil ve yeniden oluştur
DROP TABLE IF EXISTS weekly_leaderboard CASCADE;
DROP TABLE IF EXISTS user_leagues CASCADE;
DROP TABLE IF EXISTS league_config CASCADE;
DROP VIEW IF EXISTS league_rankings CASCADE;
DROP FUNCTION IF EXISTS increment_weekly_xp CASCADE;

-- 3. Leaderboard tablolarını yeniden oluştur
CREATE TABLE weekly_leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    weekly_xp INTEGER DEFAULT 0,
    league VARCHAR(50) NOT NULL DEFAULT 'mubtedi',
    position INTEGER,
    promoted BOOLEAN DEFAULT FALSE,
    demoted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, week_start)
);

CREATE TABLE user_leagues (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_league VARCHAR(50) DEFAULT 'mubtedi',
    current_week_start DATE,
    total_weeks_in_league INTEGER DEFAULT 1,
    best_league VARCHAR(50) DEFAULT 'mubtedi',
    total_promotions INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE league_config (
    league_name VARCHAR(50) PRIMARY KEY,
    league_order INTEGER NOT NULL UNIQUE,
    promotion_top_percent INTEGER DEFAULT 25,
    demotion_bottom_percent INTEGER DEFAULT 30,
    min_players INTEGER DEFAULT 5,
    icon VARCHAR(50),
    color VARCHAR(20),
    display_name VARCHAR(100),
    arabic_name VARCHAR(100),
    description TEXT
);

-- 4. Index'ler
CREATE INDEX idx_weekly_leaderboard_week ON weekly_leaderboard(week_start);
CREATE INDEX idx_weekly_leaderboard_league ON weekly_leaderboard(league, weekly_xp DESC);
CREATE INDEX idx_weekly_leaderboard_user_week ON weekly_leaderboard(user_id, week_start);
CREATE INDEX idx_user_leagues_league ON user_leagues(current_league);

-- 5. League Config Verileri (İslami Terimler)
INSERT INTO league_config (league_name, league_order, promotion_top_percent, demotion_bottom_percent, icon, color, display_name, arabic_name, description) VALUES
('mubtedi', 1, 25, 0, '📖', '#8B4513', 'Mübtedi', 'مبتدئ', 'Başlangıç seviyesi - İlk adımlarınızı atıyorsunuz'),
('talib', 2, 25, 30, '📚', '#CD7F32', 'Talib', 'طالب', 'Öğrenen - İlme talip olan'),
('mutavassit', 3, 20, 25, '📘', '#4682B4', 'Mutavassıt', 'متوسط', 'Orta seviye - Yolun ortasında'),
('mutebahhir', 4, 20, 25, '📗', '#228B22', 'Mütebahhir', 'متبحر', 'Derinleşen - İlme daldınız'),
('hafiz', 5, 15, 20, '📙', '#FFD700', 'Hafız', 'حافظ', 'Koruyan - Kur''an-ı ezberleyen'),
('kurra', 6, 15, 20, '📕', '#DC143C', 'Kurra', 'قراء', 'Okuyucu - Kıraat ilmine sahip'),
('alim', 7, 12, 18, '📓', '#4B0082', 'Alim', 'عالم', 'Bilgin - İlim sahibi'),
('mujtahid', 8, 12, 18, '📔', '#4169E1', 'Müctehid', 'مجتهد', 'İçtihad Eden - Hüküm çıkarabilen'),
('muhaddis', 9, 10, 15, '📖', '#000080', 'Muhaddis', 'محدث', 'Hadis Alimi - Hadis ilmine vakıf'),
('faqih', 10, 10, 15, '📗', '#006400', 'Fakih', 'فقيه', 'Fıkıh Alimi - Fıkıh bilgisine sahip'),
('imam', 11, 8, 12, '📘', '#8B008B', 'İmam', 'إمام', 'Önder - İlimde öncü'),
('ulama', 12, 0, 10, '✨', '#FFD700', 'Ulema', 'علماء', 'Alimler Zümresi - En yüksek mertebe')
ON CONFLICT (league_name) DO NOTHING;

-- 6. Updated_at Trigger
DROP TRIGGER IF EXISTS update_weekly_leaderboard_updated_at ON weekly_leaderboard;
CREATE TRIGGER update_weekly_leaderboard_updated_at 
    BEFORE UPDATE ON weekly_leaderboard 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_leagues_updated_at ON user_leagues;
CREATE TRIGGER update_user_leagues_updated_at 
    BEFORE UPDATE ON user_leagues 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 7. RLS Policies
ALTER TABLE weekly_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view weekly_leaderboard" ON weekly_leaderboard;
CREATE POLICY "Anyone can view weekly_leaderboard" 
    ON weekly_leaderboard FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Users can update own weekly_leaderboard" ON weekly_leaderboard;
CREATE POLICY "Users can update own weekly_leaderboard" 
    ON weekly_leaderboard FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own weekly_leaderboard" ON weekly_leaderboard;
CREATE POLICY "Users can insert own weekly_leaderboard" 
    ON weekly_leaderboard FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view league_config" ON league_config;
CREATE POLICY "Anyone can view league_config" 
    ON league_config FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Anyone can view user_leagues" ON user_leagues;
CREATE POLICY "Anyone can view user_leagues" 
    ON user_leagues FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Users can update own user_leagues" ON user_leagues;
CREATE POLICY "Users can update own user_leagues" 
    ON user_leagues FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own user_leagues" ON user_leagues;
CREATE POLICY "Users can insert own user_leagues" 
    ON user_leagues FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 8. Helper Function: Haftalık XP Artırma
CREATE OR REPLACE FUNCTION increment_weekly_xp(
    p_user_id UUID,
    p_week_start DATE,
    p_points INTEGER
)
RETURNS void AS $$
BEGIN
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. View: Lig Sıralaması
CREATE OR REPLACE VIEW league_rankings AS
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

-- 10. User Stats'ı sıfırla (total_points ve diğer istatistikleri)
UPDATE user_stats 
SET 
    total_points = 0,
    badges = '{"stars":0,"bronze":0,"silver":0,"gold":0,"diamond":0}'::jsonb,
    streak_data = '{"currentStreak":0,"bestStreak":0,"totalPlayDays":0,"playDates":[]}'::jsonb,
    game_stats = '{"totalCorrect":0,"totalWrong":0,"gameModeCounts":{}}'::jsonb,
    perfect_lessons_count = 0,
    updated_at = NOW();

SELECT 'Tüm veriler temizlendi ve tablolar yeniden oluşturuldu!' as result;


