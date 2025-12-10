# 🔍 Email Confirmation Alternatif Yolları

## Yol 1: Email Template'lerden

1. Sol menüde **"NOTIFICATIONS"** bölümüne bak
2. **"Email"** sekmesine tıkla
3. Orada email confirmation ayarları olabilir

## Yol 2: Settings'ten

1. Sol menüde en üstte **"Settings"** (⚙️) ikonuna tıkla
2. **"Auth"** sekmesine git
3. **"Email Auth"** veya **"Email Settings"** bölümüne bak
4. **"Confirm email"** veya **"Require email confirmation"** seçeneğini bul

## Yol 3: SQL ile Kapat (En Kolay!)

Eğer UI'da bulamazsanız, SQL ile kapatabilirsiniz:

1. Sol menüden **"SQL Editor"** sekmesine git
2. Şu SQL'i çalıştır:

```sql
-- Email confirmation'ı kapat
UPDATE auth.config 
SET enable_signup = true, 
    enable_email_confirmation = false;
```

Veya Supabase'in yeni sisteminde:

```sql
-- Auth config'i güncelle
UPDATE auth.config 
SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{email_confirmation}',
    'false'::jsonb
);
```

## Yol 4: API ile Kontrol

Browser console'da şunu çalıştırın:

```javascript
// Supabase client ile kontrol
const { data, error } = await supabaseClient.auth.getSession();
console.log('Session:', data);
```

## En Kolay Çözüm: SQL Editor

1. Sol menüden **"SQL Editor"** sekmesine git
2. Şu SQL'i çalıştır:

```sql
-- Email confirmation'ı devre dışı bırak
UPDATE auth.config 
SET enable_email_confirmation = false;
```

Eğer bu çalışmazsa, Supabase'in yeni sisteminde farklı olabilir. O zaman:

```sql
-- Tüm auth ayarlarını kontrol et
SELECT * FROM auth.config;
```

Bu sorguyu çalıştırıp sonucu gönderin, ona göre doğru SQL'i yazabilirim.

