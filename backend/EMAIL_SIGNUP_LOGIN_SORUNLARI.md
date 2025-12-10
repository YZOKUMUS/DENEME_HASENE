# 🔐 Email/Şifre ile Giriş Sorunları - Çözüm

## ❌ Hata: "Invalid login credentials"

Bu hata, email veya şifrenin yanlış olduğu anlamına gelir. Aşağıdaki kontrolleri yapın:

---

## ✅ Kontrol Listesi

### 1. Email Doğrulanmış mı?

**Supabase'de email confirmation açık olabilir:**

1. **Supabase Dashboard** → **Authentication** → **Providers** → **Email**
2. **"Confirm email"** seçeneğinin durumunu kontrol edin
3. Eğer **açık** ise:
   - Kayıt olduktan sonra email'inize doğrulama linki gelmiş olmalı
   - Email'inizi kontrol edin (Spam klasörüne de bakın)
   - Linke tıklayın ve email'i doğrulayın
   - Sonra tekrar giriş yapmayı deneyin

**Email confirmation'ı kapatmak için:**
1. Supabase Dashboard → Authentication → Providers → Email
2. **"Confirm email"** seçeneğini **KAPATIN**
3. **SAVE**
4. Artık email doğrulaması olmadan giriş yapabilirsiniz

---

### 2. Email ve Şifre Doğru mu?

**Kontrol edin:**
- ✅ Email adresi doğru yazılmış mı? (küçük harf/büyük harf önemli değil, otomatik lowercase'e çevriliyor)
- ✅ Şifre doğru yazılmış mı? (büyük/küçük harf ve karakterler önemli)
- ✅ Boşluk karakteri var mı? (email ve şifrede başta/sonda boşluk olmamalı)

---

### 3. Kayıt Başarılı Oldu mu?

**Kontrol edin:**
1. Supabase Dashboard → **Authentication** → **Users**
2. Email adresinizi arayın
3. Kullanıcı listede var mı?

**Yoksa:**
- Kayıt işlemi başarısız olmuş olabilir
- Tekrar kayıt olmayı deneyin

---

## 🔧 Çözüm: Email Confirmation'ı Kapat

### Adım 1: Supabase Dashboard'a Gidin

1. https://app.supabase.com
2. Projenizi seçin

### Adım 2: Email Provider Ayarları

1. Sol menüden **Authentication** → **Providers** seçin
2. **Email** provider'ını bulun
3. **Configure** butonuna tıklayın (veya Email'e tıklayın)

### Adım 3: Confirm Email'i Kapatın

1. **"Confirm email"** veya **"Enable email confirmations"** seçeneğini bulun
2. **KAPATIN** (toggle'ı off yapın)
3. **SAVE** butonuna tıklayın

### Adım 4: Test Edin

1. Uygulamaya dönün
2. Email ve şifrenizle giriş yapmayı deneyin
3. ✅ Artık çalışmalı!

---

## 🔍 Alternatif: Mevcut Kullanıcıyı Doğrula

Eğer email confirmation açık ve email'inizi doğrulamak istiyorsanız:

### Supabase Dashboard'dan Manuel Doğrulama:

1. Supabase Dashboard → **Authentication** → **Users**
2. Kullanıcınızı bulun (email ile arayın)
3. Kullanıcıya tıklayın
4. **"Confirm email"** checkbox'ını işaretleyin
5. Artık giriş yapabilirsiniz

---

## 📝 Notlar

### Email Formatı:
- Email otomatik olarak **lowercase**'e çevriliyor
- Boşluklar otomatik olarak temizleniyor
- Format kontrolü yapılıyor (örn: `kullanici@example.com`)

### Şifre:
- En az 6 karakter olmalı
- Büyük/küçük harf ve karakterler önemli
- Boşluk karakteri kullanmayın

---

## ✅ Hızlı Çözüm

**En hızlı çözüm:**
1. Supabase Dashboard → Authentication → Providers → Email
2. **"Confirm email"** seçeneğini **KAPAT**
3. **SAVE**
4. Uygulamada tekrar giriş yapmayı dene

---

## 🧪 Test Senaryosu

1. ✅ Email confirmation'ı kapat
2. ✅ Yeni bir kullanıcı kaydet (email/şifre)
3. ✅ Hemen giriş yap (email/şifre ile)
4. ✅ Başarılı olmalı!

---

## ❓ Hala Çalışmıyor mu?

1. Console'da hata var mı kontrol edin (F12)
2. Supabase Dashboard'da kullanıcı var mı kontrol edin
3. Email ve şifreyi tekrar yazmayı deneyin
4. Yeni bir hesap oluşturmayı deneyin

