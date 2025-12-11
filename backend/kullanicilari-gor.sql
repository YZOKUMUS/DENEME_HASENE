-- ============================================
-- SUPABASE'DEKİ KULLANICILARI GÖR
-- ============================================
-- Bu sorgu tüm kullanıcıları basit bir şekilde gösterir
-- ============================================

-- EN BASİT: Sadece kullanıcı sayısı
SELECT 
    COUNT(*) AS "Toplam Kullanıcı Sayısı"
FROM auth.users;

-- DETAYLI: Tüm kullanıcıların listesi
SELECT 
    id,
    email,
    created_at AS "Kayıt Tarihi",
    email_confirmed_at AS "Email Onay Tarihi",
    last_sign_in_at AS "Son Giriş",
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN '✅ Onaylı'
        ELSE '❌ Onaysız'
    END AS "Durum"
FROM auth.users
ORDER BY created_at DESC;

-- PROFİL BİLGİLERİ İLE BİRLİKTE
SELECT 
    au.email AS "Email",
    au.created_at AS "Kayıt Tarihi",
    au.email_confirmed_at IS NOT NULL AS "Email Onaylı",
    p.username AS "Kullanıcı Adı",
    COALESCE(us.total_points, 0) AS "Hasene",
    CASE 
        WHEN us.user_id IS NOT NULL THEN '✅ Oyun Oynamış'
        ELSE '❌ Oyun Oynamamış'
    END AS "Oyun Durumu"
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
LEFT JOIN user_stats us ON au.id = us.user_id
ORDER BY au.created_at DESC;
