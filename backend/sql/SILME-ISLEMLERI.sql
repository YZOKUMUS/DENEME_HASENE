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
-- 
-- NOT: Başarımlar ve rozetler de silinir!
-- get_achievement_name() ve get_badge_name() fonksiyonları korunur

-- Tüm oyun verilerini sil
DELETE FROM daily_stats;
DELETE FROM weekly_stats;
DELETE FROM monthly_stats;
DELETE FROM word_stats;
DELETE FROM favorite_words;
DELETE FROM achievements;  -- Başarımlar silinir
DELETE FROM badges;  -- Rozetler silinir
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
DELETE FROM achievements WHERE user_id = 'KULLANICI-ID-BURAYA';  -- Kullanıcının başarımları silinir
DELETE FROM badges WHERE user_id = 'KULLANICI-ID-BURAYA';  -- Kullanıcının rozetleri silinir
DELETE FROM daily_tasks WHERE user_id = 'KULLANICI-ID-BURAYA';
DELETE FROM weekly_tasks WHERE user_id = 'KULLANICI-ID-BURAYA';
DELETE FROM weekly_leaderboard WHERE user_id = 'KULLANICI-ID-BURAYA';
DELETE FROM user_leagues WHERE user_id = 'KULLANICI-ID-BURAYA';
DELETE FROM user_stats WHERE user_id = 'KULLANICI-ID-BURAYA';
*/

-- ============================================
-- 4. BELİRLİ BİR BAŞARIMI SİL
-- ============================================
-- Kullanıcı ID'sini ve başarım ID'sini değiştirin

-- NOT: Bu sorguyu çalıştırmak için yukarıdaki yorumları kaldırın ve değerleri değiştirin
/*
-- Örnek: Kullanıcının 'level_1' (Mübtedi) başarımını sil
DELETE FROM achievements 
WHERE user_id = 'KULLANICI-ID-BURAYA' 
  AND achievement_id = 'level_1';

-- Örnek: Tüm kullanıcıların 'first_step' başarımını sil
DELETE FROM achievements WHERE achievement_id = 'first_step';
*/

-- ============================================
-- 5. BELİRLİ BİR ROZETİ SİL
-- ============================================
-- Kullanıcı ID'sini ve rozet ID'sini değiştirin

-- NOT: Bu sorguyu çalıştırmak için yukarıdaki yorumları kaldırın ve değerleri değiştirin
/*
-- Örnek: Kullanıcının 'badge_1' (İlk Adım) rozetini sil
DELETE FROM badges 
WHERE user_id = 'KULLANICI-ID-BURAYA' 
  AND badge_id = 'badge_1';

-- Örnek: Tüm kullanıcıların 'asr_1' rozetini sil
DELETE FROM badges WHERE badge_id = 'asr_1';
*/

-- ============================================
-- 6. KULLANICININ TÜM BAŞARIMLARINI SİL
-- ============================================
-- NOT: Bu sorguyu çalıştırmak için yukarıdaki yorumları kaldırın ve user_id'yi değiştirin
/*
DELETE FROM achievements WHERE user_id = 'KULLANICI-ID-BURAYA';
*/

-- ============================================
-- 7. KULLANICININ TÜM ROZETLERİNİ SİL
-- ============================================
-- NOT: Bu sorguyu çalıştırmak için yukarıdaki yorumları kaldırın ve user_id'yi değiştirin
/*
DELETE FROM badges WHERE user_id = 'KULLANICI-ID-BURAYA';
*/

-- ============================================
-- 8. TEST KULLANICISINI TAMAMEN SIFIRLA (EMAIL İLE)
-- ============================================
-- Bu script, belirli bir email adresine ait KULLANICI VERİLERİNİN TAMAMINI sıfırlar.
-- 1) İlgili kullanıcının user_id'sini auth.users tablosundan bulur
-- 2) Tüm oyun/veri tablolarından o user_id'ye ait kayıtları SİLER
-- 3) user_stats tablosuna SIFIR kayıt (0 hasene, 0 rozet, 0 streak) ekler
--
-- ⚠️ DİKKAT:
-- - Bu scripti sadece TEST ortamında ve kendi hesabınız için kullanın.
-- - Aşağıdaki 'KULLANICI_EMAIL_BURAYA' kısmını kendi email adresinizle değiştirin.
--
-- ÖRNEK:
--   WHERE email = 'ziya.okumus@gmail.com'
--
-- NOT:
-- - SQL Editor / psql üzerinden çalıştırıldığında RLS (Row Level Security) genelde service role ile BYPASS edilir.
-- - Böylece frontend'den silinemeyen (RLS engeline takılan) kayıtlar da tamamen temizlenir.

/*
WITH target_user AS (
    SELECT id
    FROM auth.users
    WHERE email = 'KULLANICI_EMAIL_BURAYA'
    LIMIT 1
)
-- Önce tüm bağımlı/veri tablolarından kullanıcının verilerini sil
DELETE FROM daily_stats
WHERE user_id IN (SELECT id FROM target_user);

DELETE FROM weekly_stats
WHERE user_id IN (SELECT id FROM target_user);

DELETE FROM monthly_stats
WHERE user_id IN (SELECT id FROM target_user);

DELETE FROM word_stats
WHERE user_id IN (SELECT id FROM target_user);

DELETE FROM favorite_words
WHERE user_id IN (SELECT id FROM target_user);

DELETE FROM achievements
WHERE user_id IN (SELECT id FROM target_user);

DELETE FROM badges
WHERE user_id IN (SELECT id FROM target_user);

DELETE FROM daily_tasks
WHERE user_id IN (SELECT id FROM target_user);

DELETE FROM weekly_tasks
WHERE user_id IN (SELECT id FROM target_user);

DELETE FROM weekly_leaderboard
WHERE user_id IN (SELECT id FROM target_user);

DELETE FROM user_leagues
WHERE user_id IN (SELECT id FROM target_user);

DELETE FROM user_stats
WHERE user_id IN (SELECT id FROM target_user);

-- Son olarak: user_stats için SIFIR KAYIT ekle
INSERT INTO user_stats (
    user_id,
    total_points,
    badges,
    streak_data,
    game_stats,
    perfect_lessons_count
)
SELECT
    id                                                                                 AS user_id,
    0                                                                                  AS total_points,
    jsonb_build_object('stars',0,'bronze',0,'silver',0,'gold',0,'diamond',0)          AS badges,
    jsonb_build_object('currentStreak',0,'bestStreak',0,'totalPlayDays',0)            AS streak_data,
    jsonb_build_object('totalCorrect',0,'totalWrong',0,'gameModeCounts',jsonb_build_object()) AS game_stats,
    0                                                                                  AS perfect_lessons_count
FROM target_user;

-- Kontrol için özet
SELECT 
    'TEST KULLANICISI SIFIRLANDI' AS sonuc,
    (SELECT email FROM auth.users u JOIN target_user t ON u.id = t.id) AS kullanici_email,
    (SELECT total_points FROM user_stats us JOIN target_user t ON us.user_id = t.id) AS toplam_hasene,
    (SELECT COUNT(*) FROM word_stats ws JOIN target_user t ON ws.user_id = t.id) AS kalan_kelime_kaydi,
    (SELECT COUNT(*) FROM achievements a JOIN target_user t ON a.user_id = t.id) AS kalan_basarim,
    (SELECT COUNT(*) FROM badges b JOIN target_user t ON b.user_id = t.id) AS kalan_rozet,
    (SELECT COUNT(*) FROM daily_tasks dt JOIN target_user t ON dt.user_id = t.id) AS kalan_gunluk_vazife
;
*/
