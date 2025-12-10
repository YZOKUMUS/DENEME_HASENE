-- Kullanıcının email'ini manuel olarak confirm et
-- UID'yi kendi kullanıcınızın UID'si ile değiştirin

-- Kullanıcının email'ini confirm et
-- Not: confirmed_at otomatik oluşturulan bir sütun, sadece email_confirmed_at güncellenebilir
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE id = '1691a345-8387-46b3-804a-9083100c558f';

-- Kontrol et
SELECT 
    id,
    email,
    email_confirmed_at,
    confirmed_at,
    created_at
FROM auth.users 
WHERE id = '1691a345-8387-46b3-804a-9083100c558f';

