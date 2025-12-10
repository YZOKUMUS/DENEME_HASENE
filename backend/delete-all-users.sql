-- ============================================
-- TÜM KULLANICILARI VE IDENTITIES'LERİ SİL
-- ⚠️ DİKKAT: Bu script TÜM KULLANICILARI SİLER!
-- ============================================

-- 1. Önce hangi kullanıcılar var görelim
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- 2. TÜM KULLANICILARI SİL (Identities otomatik silinir)
-- ⚠️ DİKKAT: Aşağıdaki komutu çalıştırmadan önce emin olun!
-- DELETE FROM auth.users;

-- 3. Sadece test kullanıcılarını silmek için:
-- DELETE FROM auth.users 
-- WHERE email LIKE '%test%' 
--    OR email LIKE '%example%'
--    OR email LIKE '%@test.com'
--    OR email LIKE '%@example.com';

-- 4. Belirli bir kullanıcıyı silmek için:
-- DELETE FROM auth.users WHERE email = 'kullanici@email.com';

-- 5. Profiles tablosunu da temizlemek için (kullanıcılar silindikten sonra):
-- DELETE FROM public.profiles WHERE id NOT IN (SELECT id FROM auth.users);

