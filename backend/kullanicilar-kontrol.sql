-- ============================================
-- KULLANICI KONTROL SORGULARI
-- ============================================
-- Bu sorgular veritabanında kullanıcı olup olmadığını kontrol eder
-- ============================================

-- 1. Auth.users tablosunda kaç kullanıcı var?
SELECT 
    COUNT(*) AS "Auth Kullanıcı Sayısı",
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) AS "Email Onaylı",
    COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) AS "Email Onaysız"
FROM auth.users;

-- 2. Profiles tablosunda kaç kullanıcı var?
SELECT 
    COUNT(*) AS "Profil Sayısı"
FROM profiles;

-- 3. User_stats tablosunda kaç kullanıcı var?
SELECT 
    COUNT(*) AS "İstatistik Kaydı Olan Kullanıcı",
    SUM(total_points) AS "Toplam Hasene (Tüm Kullanıcılar)"
FROM user_stats;

-- 4. Tüm kullanıcıları listele (basit)
SELECT 
    au.id,
    au.email,
    au.created_at AS "Kayıt Tarihi",
    au.email_confirmed_at IS NOT NULL AS "Email Onaylı",
    p.username,
    COALESCE(us.total_points, 0) AS "Hasene"
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
LEFT JOIN user_stats us ON au.id = us.user_id
ORDER BY au.created_at DESC;

-- 5. Eğer hiç kullanıcı yoksa, test için:
-- Bu sorgu sadece tabloların var olup olmadığını kontrol eder
SELECT 
    'profiles' AS tablo,
    COUNT(*) AS kayit_sayisi
FROM profiles
UNION ALL
SELECT 
    'user_stats' AS tablo,
    COUNT(*) AS kayit_sayisi
FROM user_stats
UNION ALL
SELECT 
    'auth.users' AS tablo,
    COUNT(*) AS kayit_sayisi
FROM auth.users;
