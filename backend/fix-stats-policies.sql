-- ============================================
-- STATS TABLOLARI RLS POLICY DÜZELTME
-- ============================================
-- Bu script daily_stats, weekly_stats ve monthly_stats
-- tabloları için eksik RLS policy'lerini ekler
-- ============================================

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

-- RLS'yi aktif et (eğer aktif değilse)
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_stats ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SONUÇ
-- ============================================
SELECT 
    'Stats tablolari icin RLS policyleri basariyla eklendi!' as sonuc,
    'daily_stats, weekly_stats ve monthly_stats tablolari artik erisilebilir' as aciklama;
