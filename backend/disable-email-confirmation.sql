-- ============================================
-- EMAIL CONFIRMATION'ı KAPAT
-- ============================================

-- ⚠️ NOT: Supabase'de email confirmation artık SQL ile değil,
-- Dashboard üzerinden yapılıyor. SQL komutları artık çalışmıyor.

-- ============================================
-- ✅ DOĞRU YÖNTEM: SUPABASE DASHBOARD
-- ============================================

-- 1. Supabase Dashboard'a gidin: https://app.supabase.com
-- 2. Projenizi seçin
-- 3. Sol menüden "Authentication" → "Providers" sekmesine gidin
-- 4. "Email" provider'ını bulun ve tıklayın
-- 5. "Confirm email" seçeneğini KAPALI yapın (toggle OFF)
-- 6. "Save" butonuna tıklayın

-- ============================================
-- 🔄 ALTERNATIF: AUTH → SETTINGS
-- ============================================

-- Eğer yukarıdaki yöntem çalışmazsa:
-- 1. Supabase Dashboard → Authentication → Settings
-- 2. "Enable email confirmations" toggle'ını KAPATIN
-- 3. Kaydedin

-- ============================================
-- 📝 ESKİ YÖNTEMLER (ARTIK ÇALIŞMIYOR)
-- ============================================

-- ❌ Bu komutlar artık çalışmıyor:
-- UPDATE auth.config 
-- SET enable_email_confirmation = false;

-- ❌ Bu da çalışmıyor:
-- SELECT * FROM auth.config;

