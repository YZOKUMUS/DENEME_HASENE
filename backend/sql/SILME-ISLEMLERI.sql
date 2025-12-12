-- ============================================
-- SİLME İŞLEMLERİ
-- ============================================
-- ⚠️ DİKKAT: Bu sorgular VERİLERİ SİLER!
-- Tablolar, fonksiyonlar, trigger'lar ve policy'ler korunur
-- ============================================

-- ============================================
-- 1. TÜM VERİLERİ SİL (Tabloları Korur)
-- ============================================
-- DİKKAT: Bu script TÜM OYUN VERİLERİNİ SİLER!
-- Tablolar, fonksiyonlar, trigger'lar ve policy'ler korunur
-- Sadece veriler silinir

-- Tüm oyun verilerini sil
DELETE FROM daily_stats;
DELETE FROM weekly_stats;
DELETE FROM monthly_stats;
DELETE FROM word_stats;
DELETE FROM favorite_words;
DELETE FROM achievements;
DELETE FROM badges;
DELETE FROM daily_tasks;
DELETE FROM weekly_tasks;
DELETE FROM weekly_leaderboard;
DELETE FROM user_leagues;

-- User stats'ı sıfırla (kullanıcıları silme, sadece istatistikleri sıfırla)
DELETE FROM user_stats;

-- Profiles tablosundaki updated_at'i de sıfırla
UPDATE profiles 
SET updated_at = created_at
WHERE updated_at IS NOT NULL;

-- Sonuç
SELECT 
    'Tum veriler silindi!' as sonuc,
    'Tablolar, fonksiyonlar, triggerlar ve policyler korundu' as aciklama,
    'Yeni oyun oynayarak sifirdan baslayabilirsiniz' as not;

-- ============================================
-- 2. TÜM KULLANICILARI SİL
-- ============================================
-- ⚠️ ÇOK DİKKATLİ KULLANIN!
-- Bu script TÜM KULLANICILARI ve VERİLERİNİ SİLER!

-- NOT: Bu sorguyu çalıştırmak için yukarıdaki yorumları kaldırın
-- DELETE FROM auth.users CASCADE;

-- ============================================
-- 3. BELİRLİ BİR KULLANICININ VERİLERİNİ SİL
-- ============================================
-- Kullanıcı ID'sini değiştirin

-- NOT: Bu sorguyu çalıştırmak için yukarıdaki yorumları kaldırın ve user_id'yi değiştirin
/*
DELETE FROM daily_stats WHERE user_id = 'KULLANICI-ID-BURAYA';
DELETE FROM weekly_stats WHERE user_id = 'KULLANICI-ID-BURAYA';
DELETE FROM monthly_stats WHERE user_id = 'KULLANICI-ID-BURAYA';
DELETE FROM word_stats WHERE user_id = 'KULLANICI-ID-BURAYA';
DELETE FROM favorite_words WHERE user_id = 'KULLANICI-ID-BURAYA';
DELETE FROM achievements WHERE user_id = 'KULLANICI-ID-BURAYA';
DELETE FROM badges WHERE user_id = 'KULLANICI-ID-BURAYA';
DELETE FROM daily_tasks WHERE user_id = 'KULLANICI-ID-BURAYA';
DELETE FROM weekly_tasks WHERE user_id = 'KULLANICI-ID-BURAYA';
DELETE FROM weekly_leaderboard WHERE user_id = 'KULLANICI-ID-BURAYA';
DELETE FROM user_leagues WHERE user_id = 'KULLANICI-ID-BURAYA';
DELETE FROM user_stats WHERE user_id = 'KULLANICI-ID-BURAYA';
*/
