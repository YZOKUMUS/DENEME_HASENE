-- ============================================
-- RLS PERFORMANS DÜZELTMESİ
-- ============================================
-- Bu dosya, RLS policy'lerdeki performans sorununu çözer
-- auth.uid() yerine (SELECT auth.uid()) kullanarak
-- Supabase SQL Editor'de bu dosyayı çalıştırın
-- ============================================

-- Achievements Policies
DROP POLICY IF EXISTS "Users can view own achievements" ON achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON achievements;
DROP POLICY IF EXISTS "Users can delete own achievements" ON achievements;

CREATE POLICY "Users can view own achievements" 
    ON achievements FOR SELECT 
    USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own achievements" 
    ON achievements FOR INSERT 
    WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own achievements" 
    ON achievements FOR DELETE 
    USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- NOT: Eğer tüm tablolardaki policy'leri güncellemek istiyorsanız
-- complete-setup.sql dosyasını çalıştırın
-- ============================================

