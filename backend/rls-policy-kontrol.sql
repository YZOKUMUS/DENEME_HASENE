-- ============================================
-- RLS POLICY KONTROL
-- ============================================
-- Mevcut RLS policy'lerini kontrol eder
-- ============================================

-- Daily Stats Policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'daily_stats'
ORDER BY policyname;

-- Weekly Stats Policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'weekly_stats'
ORDER BY policyname;

-- Monthly Stats Policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'monthly_stats'
ORDER BY policyname;

-- RLS Durumu
SELECT 
    tablename,
    rowsecurity as "RLS Aktif"
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('daily_stats', 'weekly_stats', 'monthly_stats')
ORDER BY tablename;
