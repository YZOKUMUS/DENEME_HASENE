-- ============================================
-- EMAIL CONFIRMATION'ı KAPAT
-- ============================================

-- Supabase'de email confirmation'ı kapatmak için
-- Bu SQL'i SQL Editor'de çalıştırın

-- Yöntem 1: Auth config'i güncelle (Supabase'in yeni sisteminde)
UPDATE auth.config 
SET enable_email_confirmation = false;

-- Eğer yukarıdaki çalışmazsa, şunu deneyin:
-- UPDATE auth.config 
-- SET raw_app_meta_data = jsonb_set(
--     COALESCE(raw_app_meta_data, '{}'::jsonb),
--     '{email_confirmation}',
--     'false'::jsonb
-- );

-- Kontrol etmek için:
-- SELECT * FROM auth.config;

