# 🔒 Supabase Security Advisor Uyarılarını Düzeltme Rehberi

## 📋 Durum

Supabase Security Advisor'da **3 tane warning** var. Bu rehber bu uyarıları nasıl düzelteceğinizi gösterir.

---

## 🔍 Muhtemel Uyarılar

Supabase Security Advisor genellikle şu konularda uyarı verir:

1. **RLS Enabled ama Policy Eksik** - Tabloda RLS açık ama bazı işlemler için policy yok
2. **Geniş Public Access** - Herkesin okuyabileceği policy var (güvenlik riski)
3. **DELETE Policy Eksik** - DELETE işlemi için policy tanımlanmamış

---

## ✅ Çözüm: Adım Adım

### Adım 1: Security Advisor'ı Kontrol Et

1. Supabase Dashboard'a gidin
2. Sol menüden **"Security"** veya **"Advisor"** sekmesine tıklayın
3. **"Security Advisor"** bölümünü açın
4. Uyarıları not edin (hangi tablolar, hangi sorunlar)

### Adım 2: SQL Dosyasını Çalıştır

1. Supabase Dashboard'da **"SQL Editor"** sekmesine gidin
2. **`backend/fix-security-warnings.sql`** dosyasını açın
3. Tüm içeriği kopyalayın
4. SQL Editor'e yapıştırın
5. **"Run"** butonuna tıklayın
6. ✅ Tüm uyarılar düzelmiş olmalı

### Adım 3: Kontrol Et

1. **Security Advisor**'a tekrar gidin
2. Uyarıların kaybolduğunu kontrol edin
3. Eğer hala uyarı varsa, aşağıdaki manuel düzeltmeleri yapın

---

## 🔧 Manuel Düzeltmeler

### Sorun 1: Profiles Tablosu - Geniş Public Access

**Uyarı:** "Anyone can view leaderboard" policy'si çok geniş

**Çözüm:**
```sql
-- Eski policy'yi kaldır
DROP POLICY IF EXISTS "Anyone can view leaderboard" ON profiles;

-- Yeni, daha güvenli policy
CREATE POLICY "Public can view username for leaderboard" 
    ON profiles FOR SELECT 
    USING (true);
```

**Not:** Leaderboard için username gerekli, bu yüzden public SELECT policy'si gerekli. Ancak sadece `id` ve `username` kolonları kullanılmalı.

---

### Sorun 2: League Config - UPDATE/INSERT/DELETE Policy Eksik

**Uyarı:** `league_config` tablosunda sadece SELECT policy var

**Çözüm:**
```sql
-- League config sadece admin tarafından değiştirilebilir
-- RLS ile engelle (service_role ile değiştirilebilir)

-- UPDATE engelle
DROP POLICY IF EXISTS "No one can update league_config" ON league_config;
-- Policy oluşturma = hiç kimse update edemez (sadece service_role)

-- INSERT engelle
DROP POLICY IF EXISTS "No one can insert league_config" ON league_config;
-- Policy oluşturma = hiç kimse insert edemez (sadece service_role)

-- DELETE engelle
DROP POLICY IF EXISTS "No one can delete league_config" ON league_config;
-- Policy oluşturma = hiç kimse delete edemez (sadece service_role)
```

**Not:** `league_config` tablosu sadece admin tarafından (service_role key ile) değiştirilebilir. Normal kullanıcılar sadece okuyabilir.

---

### Sorun 3: DELETE Policy Eksik

**Uyarı:** Bazı tablolarda DELETE policy yok

**Çözüm:**
```sql
-- Eğer DELETE gerekliyse (genelde gerekli değil):

-- weekly_leaderboard için DELETE (opsiyonel)
CREATE POLICY "Users can delete own weekly_leaderboard" 
    ON weekly_leaderboard FOR DELETE 
    USING (auth.uid() = user_id);

-- user_leagues için DELETE (opsiyonel)
CREATE POLICY "Users can delete own user_leagues" 
    ON user_leagues FOR DELETE 
    USING (auth.uid() = user_id);
```

**Not:** Leaderboard kayıtları genelde silinmez, bu yüzden DELETE policy'leri opsiyoneldir.

---

## 📊 Tüm Tabloların RLS Durumunu Kontrol Et

```sql
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Beklenen:** Tüm tablolarda `rls_enabled = true` olmalı ✅

---

## 📋 Tüm Policy'leri Kontrol Et

```sql
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd as command
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
```

**Beklenen:** Her tablo için SELECT, INSERT, UPDATE policy'leri olmalı ✅

---

## 🎯 En Yaygın 3 Uyarı ve Çözümleri

### 1. "RLS enabled but no policies" (RLS açık ama policy yok)

**Çözüm:**
```sql
-- İlgili tablo için policy ekle
ALTER TABLE [tablo_adi] ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own [tablo_adi]" 
    ON [tablo_adi] FOR SELECT 
    USING (auth.uid() = user_id);
```

### 2. "Public access to sensitive data" (Hassas verilere public erişim)

**Çözüm:**
```sql
-- Geniş policy'yi kaldır
DROP POLICY IF EXISTS "Anyone can view [tablo_adi]" ON [tablo_adi];

-- Daha kısıtlayıcı policy ekle
CREATE POLICY "Users can view own [tablo_adi]" 
    ON [tablo_adi] FOR SELECT 
    USING (auth.uid() = user_id);
```

### 3. "Missing DELETE policy" (DELETE policy eksik)

**Çözüm:**
```sql
-- Eğer DELETE gerekliyse:
CREATE POLICY "Users can delete own [tablo_adi]" 
    ON [tablo_adi] FOR DELETE 
    USING (auth.uid() = user_id);

-- Eğer DELETE gerekli değilse:
-- Hiçbir şey yapma, Security Advisor'ı ignore et
```

---

## ✅ Test Etme

1. **Security Advisor'ı kontrol et:**
   - Supabase Dashboard → Security → Advisor
   - Uyarıların kaybolduğunu kontrol et

2. **Uygulamayı test et:**
   - Oyun oyna, veri kaydet
   - Verilerin backend'e kaydedildiğini kontrol et
   - Hata olmamalı

3. **Konsolu kontrol et:**
   - Browser console'u aç (F12)
   - Hata mesajı olmamalı
   - "✅ Supabase client başlatıldı" mesajını görmelisin

---

## 🆘 Sorun Giderme

### "Policy already exists" hatası

**Çözüm:** Policy zaten var, sorun yok. Devam edin.

### "Permission denied" hatası

**Çözüm:** 
1. Supabase Dashboard'da doğru projede olduğunuzdan emin olun
2. SQL Editor'de çalıştırdığınızdan emin olun
3. Service role key kullanmıyorsanız, anon key ile çalışmalı

### Uygulama çalışmıyor

**Çözüm:**
1. Browser console'u kontrol et (F12)
2. Supabase Dashboard → Logs → API Logs
3. Hata mesajlarını kontrol et
4. RLS policy'lerinin doğru olduğundan emin olun

---

## 📝 Özet

1. ✅ `fix-security-warnings.sql` dosyasını çalıştır
2. ✅ Security Advisor'ı kontrol et
3. ✅ Uyarılar kayboldu mu? → Evet: Tamamlandı! 🎉
4. ✅ Hala uyarı var mı? → Yukarıdaki manuel düzeltmeleri yap

---

## 💡 İpuçları

- **RLS Policy'ler:** Her tablo için SELECT, INSERT, UPDATE policy'leri olmalı
- **DELETE Policy'ler:** Genelde gerekli değil, opsiyonel
- **Public Access:** Sadece leaderboard gibi public veriler için kullanılmalı
- **Service Role:** Admin işlemleri için service_role key kullanılmalı

---

## 🔗 İlgili Dosyalar

- `backend/fix-security-warnings.sql` - Otomatik düzeltme SQL'i
- `backend/supabase-setup.sql` - İlk kurulum SQL'i
- `backend/leaderboard-setup.sql` - Leaderboard kurulum SQL'i

---

**Son Güncelleme:** 2025-01-XX
