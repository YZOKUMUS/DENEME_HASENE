# 🔐 Google OAuth Ayarları - Mobil Hata Çözümü

## ❌ Hata: "CODE 500 ERROR CODE UNEXPECTED_FAILURE"

Bu hata genellikle Supabase'de Google OAuth provider'ının yapılandırılmamış olmasından kaynaklanır.

---

## ✅ Çözüm: Adım Adım Google OAuth Ayarları

### Adım 1: Google Cloud Console'da OAuth Client ID Oluşturma

1. **Google Cloud Console**'a gidin:
   - https://console.cloud.google.com/

2. **Proje Seçin** veya yeni proje oluşturun

3. **APIs & Services → Credentials** bölümüne gidin

4. **+ CREATE CREDENTIALS** → **OAuth client ID** seçin

5. **OAuth consent screen** ayarlarını yapın (ilk defa):
   - User Type: **External** (veya Internal)
   - App name: **Hasene** (veya istediğiniz isim)
   - User support email: Email adresiniz
   - Developer contact: Email adresiniz
   - **SAVE AND CONTINUE**

6. **Scopes** bölümünde **SAVE AND CONTINUE**

7. **Test users** (opsiyonel) → **SAVE AND CONTINUE**

8. **Summary** → **BACK TO DASHBOARD**

9. **Credentials** sayfasına dönün → **+ CREATE CREDENTIALS** → **OAuth client ID**

10. **Application type**: **Web application** seçin

11. **Name**: "Hasene Web Client" (veya istediğiniz isim)

12. **Authorized redirect URIs** bölümüne şu URL'leri ekleyin:
    ```
    https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback
    ```
    *(Supabase project URL'inizi kullanın)*

13. **CREATE** butonuna tıklayın

14. **Client ID** ve **Client Secret** değerlerini kopyalayın (bir daha gösterilmeyecek!)

---

### Adım 2: Supabase Dashboard'da Google Provider Ayarları

1. **Supabase Dashboard**'a gidin:
   - https://app.supabase.com

2. Projenizi seçin

3. Sol menüden **Authentication** → **Providers** bölümüne gidin

4. **Google** provider'ını bulun ve **Enable Google** butonuna tıklayın

5. **Google Provider Settings** açılır:
   - **Client ID (for OAuth)**: Google Cloud Console'dan aldığınız **Client ID**'yi yapıştırın
   - **Client Secret (for OAuth)**: Google Cloud Console'dan aldığınız **Client Secret**'ı yapıştırın

6. **Site URL** kontrol edin:
   - Geliştirme için: `http://localhost:5500` veya `http://127.0.0.1:5500`
   - Production için: `https://yzokumus.github.io/DENEME_HASENE` (veya kendi URL'iniz)

7. **Redirect URLs** bölümüne şu URL'leri ekleyin:
   ```
   http://localhost:5500/**
   http://127.0.0.1:5500/**
   https://yzokumus.github.io/DENEME_HASENE/**
   ```
   *(Mobil cihazlar için IP adresi veya domain URL'lerini de ekleyin)*

8. **SAVE** butonuna tıklayın

---

### Adım 3: Mobil Cihazlar İçin Ek Ayarlar

Mobil cihazlarda (PWA veya tarayıcı) çalışması için:

#### Seçenek 1: Dinamik Redirect URL (Önerilen)

Kod zaten dinamik redirect URL kullanıyor, ancak mobil cihazlar için ek kontrol eklenebilir.

#### Seçenek 2: Supabase'de Tüm Olası URL'leri Ekleyin

Supabase Dashboard → Authentication → URL Configuration → **Redirect URLs** bölümüne:

```
http://localhost:5500/**
http://127.0.0.1:5500/**
https://yzokumus.github.io/DENEME_HASENE/**
http://192.168.*.*:5500/**
```

*(`192.168.*.*` yerel ağ IP'lerini temsil eder - mobil cihazlar için gerekli)*

---

## 🔍 Sorun Giderme

### Hata 1: "CODE 500 ERROR CODE UNEXPECTED_FAILURE"

**Neden:**
- Google OAuth provider Supabase'de yapılandırılmamış
- Client ID veya Client Secret yanlış

**Çözüm:**
1. Supabase Dashboard → Authentication → Providers → Google
2. Client ID ve Client Secret'ın doğru girildiğinden emin olun
3. **Enable Google** butonunun aktif olduğunu kontrol edin

---

### Hata 2: "redirect_uri_mismatch"

**Neden:**
- Google Cloud Console'da tanımlı redirect URI ile Supabase'deki eşleşmiyor

**Çözüm:**
1. Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID
2. **Authorized redirect URIs** bölümüne şunu ekleyin:
   ```
   https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback
   ```
   *(Kendi Supabase project URL'inizi kullanın)*

---

### Hata 3: Mobil Cihazda Çalışmıyor

**Neden:**
- Mobil cihazın IP adresi veya URL'i Supabase'de tanımlı değil

**Çözüm:**
1. Mobil cihazdan uygulamayı açın
2. Tarayıcı console'unda (F12) mevcut URL'i kontrol edin
3. Bu URL'i Supabase Dashboard → Authentication → URL Configuration → **Redirect URLs** bölümüne ekleyin
4. Örnek: `http://192.168.1.100:5500/**` (yerel ağ IP'si)

---

## ✅ Test Etme

1. **Desktop'ta test:**
   - `http://localhost:5500` veya `http://127.0.0.1:5500` açın
   - "🔐 Giriş" butonuna tıklayın
   - "Google ile Giriş Yap" butonuna tıklayın
   - Google hesabıyla giriş yapın
   - ✅ Başarılı olmalı

2. **Mobil cihazda test:**
   - Mobil cihazdan uygulamayı açın (aynı ağda olmalı)
   - "🔐 Giriş" butonuna tıklayın
   - "Google ile Giriş Yap" butonuna tıklayın
   - Google hesabıyla giriş yapın
   - ✅ Başarılı olmalı

---

## 📝 Önemli Notlar

1. **Google Cloud Console** ve **Supabase Dashboard** ayarlarının **eşleşmesi** gerekir

2. **Redirect URL'leri** her iki tarafta da doğru olmalı:
   - Google Cloud Console: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
   - Supabase Dashboard: Uygulamanızın URL'leri

3. **Client Secret** bir kez gösterilir, kaydedin!

4. **Test modunda** sadece test kullanıcıları giriş yapabilir (Google OAuth consent screen)

5. **Production** için OAuth consent screen'i yayınlamanız gerekebilir

---

## 🚀 Hızlı Kontrol Listesi

- [ ] Google Cloud Console'da OAuth Client ID oluşturuldu
- [ ] Client ID ve Client Secret kopyalandı
- [ ] Google Cloud Console'da redirect URI eklendi: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
- [ ] Supabase Dashboard'da Google provider enable edildi
- [ ] Client ID ve Client Secret Supabase'e girildi
- [ ] Supabase'de redirect URL'leri eklendi
- [ ] Desktop'ta test edildi ✅
- [ ] Mobil cihazda test edildi ✅

---

## 💡 Alternatif: Email/Password Kullanımı

Google OAuth ayarları karmaşık görünüyorsa, **Email/Password** ile giriş yapabilirsiniz:

1. Supabase Dashboard → Authentication → Providers → Email
2. **Enable Email provider** butonunu aktif edin
3. Uygulamada email/şifre ile kayıt olun ve giriş yapın

**Google OAuth** daha sonra yapılandırılabilir.

