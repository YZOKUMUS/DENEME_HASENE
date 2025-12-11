-- ============================================
-- STATS TABLOLARI RLS POLICY DÜZELTME (BASİT)
-- ============================================
-- Bu script daha basit bir yaklaşımla policy'leri oluşturur
-- ============================================

-- ÖNCE TÜM MEVCUT POLICY'LERİ SİL (Manuel)
DROP POLICY IF EXISTS "daily_stats_select_policy" ON daily_stats;
DROP POLICY IF EXISTS "daily_stats_update_policy" ON daily_stats;
DROP POLICY IF EXISTS "daily_stats_insert_policy" ON daily_stats;
DROP POLICY IF EXISTS "weekly_stats_select_policy" ON weekly_stats;
DROP POLICY IF EXISTS "weekly_stats_update_policy" ON weekly_stats;
DROP POLICY IF EXISTS "weekly_stats_insert_policy" ON weekly_stats;
DROP POLICY IF EXISTS "monthly_stats_select_policy" ON monthly_stats;
DROP POLICY IF EXISTS "monthly_stats_update_policy" ON monthly_stats;
DROP POLICY IF EXISTS "monthly_stats_insert_policy" ON monthly_stats;

-- Eski policy isimlerini de sil (eğer varsa)
DROP POLICY IF EXISTS "Users can view own daily stats" ON daily_stats;
DROP POLICY IF EXISTS "Users can update own daily stats" ON daily_stats;
DROP POLICY IF EXISTS "Users can insert own daily stats" ON daily_stats;
DROP POLICY IF EXISTS "Users can view own weekly stats" ON weekly_stats;
DROP POLICY IF EXISTS "Users can update own weekly stats" ON weekly_stats;
DROP POLICY IF EXISTS "Users can insert own weekly stats" ON weekly_stats;
DROP POLICY IF EXISTS "Users can view own monthly stats" ON monthly_stats;
DROP POLICY IF EXISTS "Users can update own monthly stats" ON monthly_stats;
DROP POLICY IF EXISTS "Users can insert own monthly stats" ON monthly_stats;

-- RLS'yi aktif et
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

-- Kontrol: Policy'ler oluşturuldu mu?
SELECT 
    'Policy kontrol:' as bilgi,
    COUNT(*) FILTER (WHERE tablename = 'daily_stats') as daily_stats_policy_sayisi,
    COUNT(*) FILTER (WHERE tablename = 'weekly_stats') as weekly_stats_policy_sayisi,
    COUNT(*) FILTER (WHERE tablename = 'monthly_stats') as monthly_stats_policy_sayisi
FROM pg_policies 
WHERE tablename IN ('daily_stats', 'weekly_stats', 'monthly_stats');

-- Başarı mesajı
SELECT 
    'RLS policyleri basariyla eklendi!' as sonuc,
    'Sayfayi yenileyin (F5) ve konsol hatalarini kontrol edin' as sonraki_adim;
