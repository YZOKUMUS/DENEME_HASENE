-- ============================================
-- HASENE BACKEND - SUPABASE DATABASE SCHEMA
-- ============================================

-- Kullanıcılar tablosu (Supabase Auth ile otomatik oluşturulur)
-- Ekstra kullanıcı bilgileri için profiles tablosu

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kullanıcı istatistikleri tablosu
CREATE TABLE IF NOT EXISTS user_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    badges JSONB DEFAULT '{"stars": 0, "bronze": 0, "silver": 0, "gold": 0, "diamond": 0}'::jsonb,
    streak_data JSONB DEFAULT '{"currentStreak": 0, "bestStreak": 0, "totalPlayDays": 0, "lastPlayDate": null, "playDates": []}'::jsonb,
    game_stats JSONB DEFAULT '{"totalCorrect": 0, "totalWrong": 0, "gameModeCounts": {}}'::jsonb,
    perfect_lessons_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Günlük görevler tablosu
CREATE TABLE IF NOT EXISTS daily_tasks (
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

-- Haftalık görevler tablosu
CREATE TABLE IF NOT EXISTS weekly_tasks (
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

-- Kelime istatistikleri tablosu
CREATE TABLE IF NOT EXISTS word_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    word_id TEXT NOT NULL,
    stats JSONB DEFAULT '{"attempts": 0, "correct": 0, "wrong": 0, "successRate": 0, "masteryLevel": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, word_id)
);

-- Favori kelimeler tablosu
CREATE TABLE IF NOT EXISTS favorite_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    word_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, word_id)
);

-- Başarımlar tablosu
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Rozetler tablosu
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id TEXT NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Detaylı istatistikler tablosu (günlük)
CREATE TABLE IF NOT EXISTS daily_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    stats JSONB DEFAULT '{"correct": 0, "wrong": 0, "points": 0, "gamesPlayed": 0, "perfectLessons": 0, "maxCombo": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Detaylı istatistikler tablosu (haftalık)
CREATE TABLE IF NOT EXISTS weekly_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    stats JSONB DEFAULT '{"hasene": 0, "correct": 0, "wrong": 0, "daysPlayed": 0, "gamesPlayed": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, week_start)
);

-- Detaylı istatistikler tablosu (aylık)
CREATE TABLE IF NOT EXISTS monthly_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    month TEXT NOT NULL, -- Format: YYYY-MM
    stats JSONB DEFAULT '{"hasene": 0, "correct": 0, "wrong": 0, "daysPlayed": 0, "gamesPlayed": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month)
);

-- Index'ler (performans için)
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_id ON daily_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_tasks_user_id ON weekly_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_word_stats_user_id ON word_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_word_stats_word_id ON word_stats(word_id);
CREATE INDEX IF NOT EXISTS idx_favorite_words_user_id ON favorite_words(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON badges(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_id ON daily_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date);
CREATE INDEX IF NOT EXISTS idx_weekly_stats_user_id ON weekly_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_stats_user_id ON monthly_stats(user_id);

-- Row Level Security (RLS) Politikaları
-- Kullanıcılar sadece kendi verilerini görebilir/düzenleyebilir

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

-- Policies: Kullanıcılar sadece kendi verilerini görebilir
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own stats" ON user_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own daily tasks" ON daily_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own daily tasks" ON daily_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily tasks" ON daily_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own weekly tasks" ON weekly_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own weekly tasks" ON weekly_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own weekly tasks" ON weekly_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own word stats" ON word_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own word stats" ON word_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own word stats" ON word_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own favorites" ON favorite_words FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON favorite_words FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON favorite_words FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements" ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own badges" ON badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON badges FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own daily stats" ON daily_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own daily stats" ON daily_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily stats" ON daily_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own weekly stats" ON weekly_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own weekly stats" ON weekly_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own weekly stats" ON weekly_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own monthly stats" ON monthly_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own monthly stats" ON monthly_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own monthly stats" ON monthly_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger: updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_tasks_updated_at BEFORE UPDATE ON daily_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weekly_tasks_updated_at BEFORE UPDATE ON weekly_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_word_stats_updated_at BEFORE UPDATE ON word_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_stats_updated_at BEFORE UPDATE ON daily_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weekly_stats_updated_at BEFORE UPDATE ON weekly_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_monthly_stats_updated_at BEFORE UPDATE ON monthly_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Liderlik tablosu için view (public, herkes görebilir)
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

-- Liderlik tablosu için policy (herkes görebilir ama sadece username ve stats)
CREATE POLICY "Anyone can view leaderboard" ON profiles FOR SELECT USING (true);

