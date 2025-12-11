-- ============================================
-- STATS TABLOLARI RLS POLICY DÜZELTME
-- ============================================
-- Bu script daily_stats, weekly_stats ve monthly_stats
-- tabloları için eksik RLS policy'lerini ekler
-- ============================================

-- ÖNCE TÜM MEVCUT POLICY'LERİ SİL
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- daily_stats için tüm policy'leri sil
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'daily_stats') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON daily_stats';
    END LOOP;
    
    -- weekly_stats için tüm policy'leri sil
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'weekly_stats') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON weekly_stats';
    END LOOP;
    
    -- monthly_stats için tüm policy'leri sil
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'monthly_stats') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON monthly_stats';
    END LOOP;
END $$;

-- RLS'yi aktif et (eğer aktif değilse)
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_stats ENABLE ROW LEVEL SECURITY;

-- Daily Stats Policies
CREATE POLICY "daily_stats_select_policy" 
    ON daily_stats FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "daily_stats_update_policy" 
    ON daily_stats FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "daily_stats_insert_policy" 
    ON daily_stats FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Weekly Stats Policies
CREATE POLICY "weekly_stats_select_policy" 
    ON weekly_stats FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "weekly_stats_update_policy" 
    ON weekly_stats FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "weekly_stats_insert_policy" 
    ON weekly_stats FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Monthly Stats Policies
CREATE POLICY "monthly_stats_select_policy" 
    ON monthly_stats FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "monthly_stats_update_policy" 
    ON monthly_stats FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "monthly_stats_insert_policy" 
    ON monthly_stats FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- SONUÇ
-- ============================================
SELECT 
    'Stats tablolari icin RLS policyleri basariyla eklendi!' as sonuc,
    'daily_stats, weekly_stats ve monthly_stats tablolari artik erisilebilir' as aciklama;
