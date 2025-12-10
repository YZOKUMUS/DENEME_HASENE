# 🔐 Supabase Identities Silme Rehberi

## ⚠️ ÖNEMLİ NOT

`identities` tablosu `auth.users` tablosu ile otomatik olarak ilişkilidir. Identities'leri direkt silmek yerine, genellikle **kullanıcıyı silmek** daha güvenli ve doğru yöntemdir.

---

## ✅ Önerilen Yöntem: Kullanıcıyı Silmek

Kullanıcı silindiğinde, o kullanıcıya ait tüm identities otomatik olarak silinir.

### Yöntem 1: Supabase Dashboard (Kolay)

1. **Supabase Dashboard'a gidin**: https://app.supabase.com
2. **Projenizi seçin**
3. **Authentication** → **Users** sekmesine gidin
4. Silmek istediğiniz **kullanıcıyı bulun**
5. Kullanıcının **yanındaki üç nokta (⋮)** butonuna tıklayın
6. **Delete user** seçeneğini seçin
7. Onaylayın

**Sonuç:** Kullanıcı ve tüm identities'leri silinir.

---

### Yöntem 2: SQL ile Kullanıcı Silme

```sql
-- ⚠️ DİKKAT: Bu komut kullanıcıyı ve tüm verilerini siler!
-- Önce kullanıcı ID'sini bulun:
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- Kullanıcıyı silmek için (ID'yi değiştirin):
DELETE FROM auth.users 
WHERE id = 'kullanici-id-buraya';
```

**Not:** Bu komut çalıştırıldığında:
- Kullanıcı `auth.users` tablosundan silinir
- Tüm identities otomatik olarak silinir
- Ancak `public.profiles` ve diğer tablolardaki veriler kalabilir (cascade delete yoksa)

---

## 🗑️ Tüm Kullanıcıları ve Identities'leri Temizleme

Eğer tüm kullanıcıları ve identities'leri temizlemek istiyorsanız:

### Yöntem 1: SQL ile (Dikkatli Kullanın!)

```sql
-- ⚠️ TEHLİKELİ: TÜM KULLANICILARI SİLER!
-- Önce yedek alın!

-- Tüm kullanıcıları sil (identities otomatik silinir)
DELETE FROM auth.users;

-- Veya sadece belirli email'leri sil:
DELETE FROM auth.users 
WHERE email LIKE '%test%' OR email LIKE '%example%';
```

### Yöntem 2: Profiles Tablosunu da Temizleme

```sql
-- Önce profiles tablosunu temizle
DELETE FROM public.profiles;

-- Sonra auth.users'ı temizle (identities otomatik silinir)
DELETE FROM auth.users;
```

---

## 🔍 Identities'leri Kontrol Etme

Identities'leri görmek için:

```sql
-- Tüm identities'leri listele
SELECT 
    id,
    user_id,
    identity_data->>'email' as email,
    provider,
    created_at,
    updated_at
FROM auth.identities
ORDER BY created_at DESC;
```

---

## 📋 Adım Adım: Test Kullanıcılarını Temizleme

### Senaryo: Tüm test kullanıcılarını silmek

1. **Supabase Dashboard** → **SQL Editor**
2. Şu sorguyu çalıştırın:

```sql
-- Önce hangi kullanıcılar var görelim
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- Test kullanıcılarını sil (email'e göre)
DELETE FROM auth.users 
WHERE email LIKE '%test%' 
   OR email LIKE '%example%'
   OR email LIKE '%@test.com';
```

3. **Çalıştır** butonuna tıklayın
4. Onaylayın

---

## 🛠️ Manuel Identities Silme (Önerilmez)

⚠️ **Dikkat:** Bu yöntem sadece özel durumlarda kullanılmalıdır.

```sql
-- Belirli bir provider'ı silmek için (örnek: Google identity)
DELETE FROM auth.identities 
WHERE user_id = 'kullanici-id'
  AND provider = 'google';
```

**Not:** Bu işlem kullanıcıyı silmez, sadece o provider ile bağlantıyı keser.

---

## 🧹 Reset All Data SQL'i

Projenizde `reset-all-data.sql` dosyası varsa, bu dosya tüm kullanıcıları ve verileri temizler:

```bash
# Supabase Dashboard → SQL Editor
# reset-all-data.sql dosyasını çalıştırın
```

---

## ⚠️ ÖNEMLİ UYARILAR

1. **Yedek Alın:** Kullanıcı silmeden önce verilerinizi yedekleyin
2. **Cascade Delete:** `public.profiles` ve diğer tablolardaki veriler otomatik silinmeyebilir
3. **Foreign Key:** Bazı tablolar kullanıcı ID'sine referans veriyorsa hata alabilirsiniz
4. **Production:** Production ortamında dikkatli olun!

---

## 🔄 Cascade Delete için Foreign Key Ayarları

Eğer `profiles` tablosunu da otomatik silmek istiyorsanız:

```sql
-- Foreign key constraint'i güncelle (eğer yoksa)
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_user_id_fkey
FOREIGN KEY (id) REFERENCES auth.users(id)
ON DELETE CASCADE;
```

---

## 📝 Özet

**En Güvenli Yöntem:**
1. Supabase Dashboard → Authentication → Users
2. Kullanıcıyı bulun
3. Silin

**Tüm Test Kullanıcılarını Temizleme:**
1. SQL Editor → `DELETE FROM auth.users WHERE email LIKE '%test%'`
2. Çalıştır

**Not:** Identities otomatik olarak silinir, ayrıca silmeye gerek yok!

