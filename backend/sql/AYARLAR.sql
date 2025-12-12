-- ============================================
-- AYAR SORGULARI
-- ============================================
-- Gerektiğinde kullanılacak ayar sorguları
-- ============================================

-- ============================================
-- 1. EMAIL CONFIRMATION KAPATMA
-- ============================================
-- ⚠️ NOT: Supabase'de email confirmation artık SQL ile değil,
-- Dashboard üzerinden yapılıyor. SQL komutları artık çalışmıyor.

-- ✅ DOĞRU YÖNTEM: SUPABASE DASHBOARD
-- 1. Supabase Dashboard'a gidin: https://app.supabase.com
-- 2. Projenizi seçin
-- 3. Sol menüden "Authentication" → "Providers" sekmesine gidin
-- 4. "Email" provider'ını bulun ve tıklayın
-- 5. "Confirm email" seçeneğini KAPALI yapın (toggle OFF)
-- 6. "Save" butonuna tıklayın

-- ============================================
-- 2. KULLANICIYI MANUEL ONAYLA
-- ============================================
-- Kullanıcının email'ini manuel olarak confirm et
-- UID'yi kendi kullanıcınızın UID'si ile değiştirin

-- NOT: Bu sorguyu çalıştırmak için yukarıdaki yorumları kaldırın ve user_id'yi değiştirin
/*
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE id = 'KULLANICI-ID-BURAYA';

-- Kontrol et
SELECT 
    id,
    email,
    email_confirmed_at,
    confirmed_at,
    created_at
FROM auth.users 
WHERE id = 'KULLANICI-ID-BURAYA';
*/
