-- ============================================
-- HASENE BACKEND - TAM KURULUM SQL
-- ============================================
-- Bu dosya TÜM backend yapısını tek seferde kurar
-- Supabase SQL Editor'de çalıştırın
-- 
-- İÇERİK:
-- - Tüm tablolar
-- - Tüm fonksiyonlar
-- - Tüm trigger'lar
-- - Tüm view'lar
-- - Tüm RLS policy'leri (Security Advisor düzeltmeleri ile)
-- - League config verileri
-- ============================================

-- ============================================
-- 1. TEMİZLEME: MEVCUT YAPILARI SİL
-- ============================================

-- View'ları sil
DROP VIEW IF EXISTS league_rankings CASCADE;
DROP VIEW IF EXISTS leaderboard CASCADE;

-- Fonksiyonları sil
DROP FUNCTION IF EXISTS increment_weekly_xp(UUID, DATE, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Trigger'ları sil
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_user_stats_updated_at ON user_stats;
DROP TRIGGER IF EXISTS update_daily_tasks_updated_at ON daily_tasks;
DROP TRIGGER IF EXISTS update_weekly_tasks_updated_at ON weekly_tasks;
DROP TRIGGER IF EXISTS update_word_stats_updated_at ON word_stats;
DROP TRIGGER IF EXISTS update_daily_stats_updated_at ON daily_stats;
DROP TRIGGER IF EXISTS update_weekly_stats_updated_at ON weekly_stats;
DROP TRIGGER IF EXISTS update_monthly_stats_updated_at ON monthly_stats;
DROP TRIGGER IF EXISTS update_weekly_leaderboard_updated_at ON weekly_leaderboard;
DROP TRIGGER IF EXISTS update_user_leagues_updated_at ON user_leagues;

-- Tabloları sil (CASCADE ile bağımlılıkları da siler)
DROP TABLE IF EXISTS weekly_leaderboard CASCADE;
DROP TABLE IF EXISTS user_leagues CASCADE;
DROP TABLE IF EXISTS league_config CASCADE;
DROP TABLE IF EXISTS monthly_stats CASCADE;
DROP TABLE IF EXISTS weekly_stats CASCADE;
DROP TABLE IF EXISTS daily_stats CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS favorite_words CASCADE;
DROP TABLE IF EXISTS word_stats CASCADE;
DROP TABLE IF EXISTS weekly_tasks CASCADE;
DROP TABLE IF EXISTS daily_tasks CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================
-- 2. TABLOLARI OLUŞTUR
-- ============================================

-- Profiles Tablosu
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Stats Tablosu
CREATE TABLE user_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    badges JSONB DEFAULT '{"stars": 0, "bronze": 0, "silver": 0, "gold": 0, "diamond": 0}'::jsonb,
    streak_data JSONB DEFAULT '{"currentStreak": 0, "bestStreak": 0, "totalPlayDays": 0, "lastPlayDate": null, "playDates": []}'::jsonb,
    game_stats JSONB DEFAULT '{"totalCorrect": 0, "totalWrong": 0, "gameModeCounts": {}}'::jsonb,
    perfect_lessons_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Tasks Tablosu
CREATE TABLE daily_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    last_task_date DATE,
    tasks JSONB DEFAULT '[]'::jsonb,
    bonus_tasks JSONB DEFAULT '[]'::jsonb,
    completed_tasks JSONB DEFAULT '[]'::jsonb,
    today_stats JSONB DEFAULT '{"toplamDogru": 0, "toplamPuan": 0, "comboCount": 0, "allGameModes": [], "farklıZorluk": []}'::jsonb,
    rewards_claimed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Weekly Tasks Tablosu
CREATE TABLE weekly_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    last_week_start DATE,
    week_start DATE,
    week_end DATE,
    tasks JSONB DEFAULT '[]'::jsonb,
    completed_tasks JSONB DEFAULT '[]'::jsonb,
    week_stats JSONB DEFAULT '{"totalHasene": 0, "totalCorrect": 0, "totalWrong": 0, "daysPlayed": 0}'::jsonb,
    rewards_claimed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Word Stats Tablosu
CREATE TABLE word_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    word_id TEXT NOT NULL,
    stats JSONB DEFAULT '{"attempts": 0, "correct": 0, "wrong": 0, "successRate": 0, "masteryLevel": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, word_id)
);

-- Favorite Words Tablosu
CREATE TABLE favorite_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    word_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, word_id)
);

-- Achievements Tablosu
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Badges Tablosu
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id TEXT NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Daily Stats Tablosu
CREATE TABLE daily_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    stats JSONB DEFAULT '{"correct": 0, "wrong": 0, "points": 0, "gamesPlayed": 0, "perfectLessons": 0, "maxCombo": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Weekly Stats Tablosu
CREATE TABLE weekly_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    stats JSONB DEFAULT '{"hasene": 0, "correct": 0, "wrong": 0, "daysPlayed": 0, "gamesPlayed": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, week_start)
);

-- Monthly Stats Tablosu
CREATE TABLE monthly_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    month TEXT NOT NULL,
    stats JSONB DEFAULT '{"hasene": 0, "correct": 0, "wrong": 0, "daysPlayed": 0, "gamesPlayed": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month)
);

-- Weekly Leaderboard Tablosu
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

-- User Leagues Tablosu
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

-- League Config Tablosu
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

-- ============================================
-- 3. INDEX'LER
-- ============================================

CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX idx_daily_tasks_user_id ON daily_tasks(user_id);
CREATE INDEX idx_weekly_tasks_user_id ON weekly_tasks(user_id);
CREATE INDEX idx_word_stats_user_id ON word_stats(user_id);
CREATE INDEX idx_word_stats_word_id ON word_stats(word_id);
CREATE INDEX idx_favorite_words_user_id ON favorite_words(user_id);
CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_badges_user_id ON badges(user_id);
CREATE INDEX idx_daily_stats_user_id ON daily_stats(user_id);
CREATE INDEX idx_daily_stats_date ON daily_stats(date);
CREATE INDEX idx_weekly_stats_user_id ON weekly_stats(user_id);
CREATE INDEX idx_monthly_stats_user_id ON monthly_stats(user_id);
CREATE INDEX idx_weekly_leaderboard_week ON weekly_leaderboard(week_start);
CREATE INDEX idx_weekly_leaderboard_league ON weekly_leaderboard(league, weekly_xp DESC);
CREATE INDEX idx_weekly_leaderboard_user_week ON weekly_leaderboard(user_id, week_start);
CREATE INDEX idx_user_leagues_league ON user_leagues(current_league);

-- ============================================
-- 4. FONKSİYONLAR
-- ============================================

-- Updated_at Trigger Fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Weekly XP Artırma Fonksiyonu
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

-- ============================================
-- 5. TRİGGER'LAR
-- ============================================

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at 
    BEFORE UPDATE ON user_stats 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_tasks_updated_at 
    BEFORE UPDATE ON daily_tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_tasks_updated_at 
    BEFORE UPDATE ON weekly_tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_word_stats_updated_at 
    BEFORE UPDATE ON word_stats 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_stats_updated_at 
    BEFORE UPDATE ON daily_stats 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_stats_updated_at 
    BEFORE UPDATE ON weekly_stats 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monthly_stats_updated_at 
    BEFORE UPDATE ON monthly_stats 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_leaderboard_updated_at 
    BEFORE UPDATE ON weekly_leaderboard 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_leagues_updated_at 
    BEFORE UPDATE ON user_leagues 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. VIEW'LAR
-- ============================================

-- Leaderboard View (Genel)
CREATE OR REPLACE VIEW leaderboard AS
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

-- League Rankings View
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

-- ============================================
-- 7. RLS AKTİF ET
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_config ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. RLS POLİTİKALARI
-- ============================================

-- Profiles Policies (Security Advisor Düzeltmeleri ile)
DROP POLICY IF EXISTS "Anyone can view leaderboard" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile" 
    ON profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- User Stats Policies
DROP POLICY IF EXISTS "Users can view own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can insert own stats" ON user_stats;

CREATE POLICY "Users can view own stats" 
    ON user_stats FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" 
    ON user_stats FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" 
    ON user_stats FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Daily Tasks Policies
DROP POLICY IF EXISTS "Users can view own daily tasks" ON daily_tasks;
DROP POLICY IF EXISTS "Users can update own daily tasks" ON daily_tasks;
DROP POLICY IF EXISTS "Users can insert own daily tasks" ON daily_tasks;

CREATE POLICY "Users can view own daily tasks" 
    ON daily_tasks FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own daily tasks" 
    ON daily_tasks FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily tasks" 
    ON daily_tasks FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Weekly Tasks Policies
DROP POLICY IF EXISTS "Users can view own weekly tasks" ON weekly_tasks;
DROP POLICY IF EXISTS "Users can update own weekly tasks" ON weekly_tasks;
DROP POLICY IF EXISTS "Users can insert own weekly tasks" ON weekly_tasks;

CREATE POLICY "Users can view own weekly tasks" 
    ON weekly_tasks FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly tasks" 
    ON weekly_tasks FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly tasks" 
    ON weekly_tasks FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Word Stats Policies
DROP POLICY IF EXISTS "Users can view own word stats" ON word_stats;
DROP POLICY IF EXISTS "Users can update own word stats" ON word_stats;
DROP POLICY IF EXISTS "Users can insert own word stats" ON word_stats;

CREATE POLICY "Users can view own word stats" 
    ON word_stats FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own word stats" 
    ON word_stats FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own word stats" 
    ON word_stats FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Favorite Words Policies
DROP POLICY IF EXISTS "Users can view own favorites" ON favorite_words;
DROP POLICY IF EXISTS "Users can insert own favorites" ON favorite_words;
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorite_words;

CREATE POLICY "Users can view own favorites" 
    ON favorite_words FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" 
    ON favorite_words FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" 
    ON favorite_words FOR DELETE 
    USING (auth.uid() = user_id);

-- Achievements Policies
DROP POLICY IF EXISTS "Users can view own achievements" ON achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON achievements;

CREATE POLICY "Users can view own achievements" 
    ON achievements FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" 
    ON achievements FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Badges Policies
DROP POLICY IF EXISTS "Users can view own badges" ON badges;
DROP POLICY IF EXISTS "Users can insert own badges" ON badges;

CREATE POLICY "Users can view own badges" 
    ON badges FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges" 
    ON badges FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Daily Stats Policies
DROP POLICY IF EXISTS "Users can view own daily stats" ON daily_stats;
DROP POLICY IF EXISTS "Users can update own daily stats" ON daily_stats;
DROP POLICY IF EXISTS "Users can insert own daily stats" ON daily_stats;

CREATE POLICY "Users can view own daily stats" 
    ON daily_stats FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own daily stats" 
    ON daily_stats FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily stats" 
    ON daily_stats FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Weekly Stats Policies
DROP POLICY IF EXISTS "Users can view own weekly stats" ON weekly_stats;
DROP POLICY IF EXISTS "Users can update own weekly stats" ON weekly_stats;
DROP POLICY IF EXISTS "Users can insert own weekly stats" ON weekly_stats;

CREATE POLICY "Users can view own weekly stats" 
    ON weekly_stats FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly stats" 
    ON weekly_stats FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly stats" 
    ON weekly_stats FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Monthly Stats Policies
DROP POLICY IF EXISTS "Users can view own monthly stats" ON monthly_stats;
DROP POLICY IF EXISTS "Users can update own monthly stats" ON monthly_stats;
DROP POLICY IF EXISTS "Users can insert own monthly stats" ON monthly_stats;

CREATE POLICY "Users can view own monthly stats" 
    ON monthly_stats FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own monthly stats" 
    ON monthly_stats FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own monthly stats" 
    ON monthly_stats FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Weekly Leaderboard Policies
DROP POLICY IF EXISTS "Anyone can view weekly_leaderboard" ON weekly_leaderboard;
DROP POLICY IF EXISTS "Users can update own weekly_leaderboard" ON weekly_leaderboard;
DROP POLICY IF EXISTS "Users can insert own weekly_leaderboard" ON weekly_leaderboard;

CREATE POLICY "Anyone can view weekly_leaderboard" 
    ON weekly_leaderboard FOR SELECT 
    USING (true);

CREATE POLICY "Users can update own weekly_leaderboard" 
    ON weekly_leaderboard FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly_leaderboard" 
    ON weekly_leaderboard FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- User Leagues Policies
DROP POLICY IF EXISTS "Anyone can view user_leagues" ON user_leagues;
DROP POLICY IF EXISTS "Users can update own user_leagues" ON user_leagues;
DROP POLICY IF EXISTS "Users can insert own user_leagues" ON user_leagues;

CREATE POLICY "Anyone can view user_leagues" 
    ON user_leagues FOR SELECT 
    USING (true);

CREATE POLICY "Users can update own user_leagues" 
    ON user_leagues FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own user_leagues" 
    ON user_leagues FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- League Config Policies (Security Advisor Düzeltmeleri ile)
DROP POLICY IF EXISTS "Anyone can view league_config" ON league_config;
DROP POLICY IF EXISTS "No one can update league_config" ON league_config;
DROP POLICY IF EXISTS "No one can insert league_config" ON league_config;
DROP POLICY IF EXISTS "No one can delete league_config" ON league_config;

CREATE POLICY "Anyone can view league_config" 
    ON league_config FOR SELECT 
    USING (true);

CREATE POLICY "No one can update league_config" 
    ON league_config FOR UPDATE 
    USING (false);

CREATE POLICY "No one can insert league_config" 
    ON league_config FOR INSERT 
    WITH CHECK (false);

CREATE POLICY "No one can delete league_config" 
    ON league_config FOR DELETE 
    USING (false);

-- ============================================
-- 9. LEAGUE CONFIG VERİLERİ
-- ============================================

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

-- ============================================
-- SONUÇ
-- ============================================
SELECT '✅ Tüm backend yapısı başarıyla kuruldu!' as result;
