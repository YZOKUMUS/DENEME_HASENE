# 🔐 OAuth Kurulumu - Adım Adım Rehber

## 📋 İçindekiler

1. [Google OAuth Kurulumu](#1-google-oauth-kurulumu)
2. [GitHub OAuth Kurulumu](#2-github-oauth-kurulumu)
3. [Test Etme](#3-test-etme)
4. [Sorun Giderme](#4-sorun-giderme)

---

## 1. Google OAuth Kurulumu

### Adım 1.1: Google Cloud Console'a Giriş

1. Tarayıcınızda şu adrese gidin: **https://console.cloud.google.com/**
2. Google hesabınızla giriş yapın
3. Eğer ilk kez kullanıyorsanız, şartları kabul edin

### Adım 1.2: Proje Oluştur

1. Üst menüde **"Select a project"** (veya "Proje Seç") yazısına tıklayın
2. **"New Project"** (Yeni Proje) butonuna tıklayın
3. **Project name** (Proje adı) kutusuna: **"Hasene OAuth"** yazın
4. **"Create"** (Oluştur) butonuna tıklayın
5. Birkaç saniye bekleyin, proje oluşturulacak

### Adım 1.3: OAuth Consent Screen Ayarla

1. Sol menüden **"APIs & Services"** (API'ler ve Hizmetler) → **"OAuth consent screen"** (OAuth onay ekranı) sekmesine tıklayın
2. **"External"** (Harici) seçeneğini seçin → **"Create"** (Oluştur) butonuna tıklayın
3. **App information** (Uygulama bilgileri) sayfasında:
   - **App name** (Uygulama adı): **"Hasene"** yazın
   - **User support email** (Kullanıcı destek email): **Email adresinizi** seçin
   - **Developer contact information** (Geliştirici iletişim bilgileri): **Email adresinizi** yazın
   - **"Save and Continue"** (Kaydet ve Devam Et) butonuna tıklayın
4. **Scopes** (İzinler) sayfasında:
   - Varsayılan izinler yeterli
   - **"Save and Continue"** butonuna tıklayın
5. **Test users** (Test kullanıcıları) sayfasında:
   - **"+ ADD USERS"** butonuna tıklayın
   - **Email adresinizi** yazın → **"Add"** butonuna tıklayın
   - **"Save and Continue"** butonuna tıklayın
6. **Summary** (Özet) sayfasında:
   - **"Back to Dashboard"** (Panoya Dön) butonuna tıklayın

### Adım 1.4: OAuth Credentials Oluştur

1. Sol menüden **"APIs & Services"** → **"Credentials"** (Kimlik Bilgileri) sekmesine tıklayın
2. Üstte **"+ CREATE CREDENTIALS"** (Kimlik Bilgileri Oluştur) butonuna tıklayın
3. **"OAuth client ID"** seçeneğine tıklayın
4. **Application type** (Uygulama türü): **"Web application"** seçin
5. **Name** (İsim): **"Hasene Web Client"** yazın
6. **Authorized redirect URIs** (Yetkili yönlendirme URI'leri) bölümünde:
   - **"+ ADD URI"** butonuna tıklayın
   - Şu URL'yi yazın:
     ```
     https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback
     ```
   - **"Create"** (Oluştur) butonuna tıklayın
7. Bir popup açılacak:
   - **Client ID**'yi kopyalayın (uzun bir metin, örneğin: `123456789-abcdefg.apps.googleusercontent.com`)
   - **Client Secret**'ı kopyalayın (uzun bir metin)
   - **"OK"** butonuna tıklayın
   - ⚠️ **ÖNEMLİ:** Bu bilgileri bir yere kaydedin!

### Adım 1.5: Supabase Dashboard'da Google Provider'ı Aktifleştir

1. **Supabase Dashboard**'a gidin: **https://app.supabase.com/**
2. **DENEME_HASENE** projenizi seçin
3. Sol menüden **"Authentication"** (🔐) ikonuna tıklayın
4. **"Providers"** (Sağlayıcılar) sekmesine tıklayın
5. **"Google"** provider'ını bulun ve üzerine tıklayın
6. **"Enable Google provider"** toggle'ını **AÇ** (yeşil olmalı)
7. **Client ID (for OAuth)** kutusuna → Google'dan kopyaladığınız **Client ID**'yi yapıştırın
8. **Client Secret (for OAuth)** kutusuna → Google'dan kopyaladığınız **Client Secret**'ı yapıştırın
9. **"Save"** (Kaydet) butonuna tıklayın
10. ✅ **"Google provider enabled"** mesajını görmelisiniz

---

## 2. GitHub OAuth Kurulumu

### Adım 2.1: GitHub Developer Settings'e Giriş

1. Tarayıcınızda şu adrese gidin: **https://github.com/settings/developers**
2. GitHub hesabınızla giriş yapın (gerekirse)

### Adım 2.2: OAuth App Oluştur

1. **"OAuth Apps"** sekmesine tıklayın
2. **"New OAuth App"** (Yeni OAuth Uygulaması) butonuna tıklayın
3. Formu doldurun:
   - **Application name** (Uygulama adı): **"Hasene"** yazın
   - **Homepage URL** (Ana sayfa URL): 
     ```
     https://yzokumus.github.io/DENEME_HASENE
     ```
   - **Authorization callback URL** (Yetkilendirme geri çağrı URL):
     ```
     https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback
     ```
4. **"Register application"** (Uygulamayı Kaydet) butonuna tıklayın

### Adım 2.3: Client ID ve Secret'ı Kopyala

1. Açılan sayfada:
   - **Client ID**'yi kopyalayın (uzun bir metin, örneğin: `Iv1.1234567890abcdef`)
   - **"Generate a new client secret"** (Yeni istemci gizliliği oluştur) butonuna tıklayın
   - **Client Secret**'ı kopyalayın (uzun bir metin)
   - ⚠️ **ÖNEMLİ:** Client Secret'ı bir daha göremeyeceksiniz, mutlaka kaydedin!

### Adım 2.4: Supabase Dashboard'da GitHub Provider'ı Aktifleştir

1. **Supabase Dashboard**'a gidin: **https://app.supabase.com/**
2. **DENEME_HASENE** projenizi seçin
3. Sol menüden **"Authentication"** (🔐) ikonuna tıklayın
4. **"Providers"** (Sağlayıcılar) sekmesine tıklayın
5. **"GitHub"** provider'ını bulun ve üzerine tıklayın
6. **"Enable GitHub provider"** toggle'ını **AÇ** (yeşil olmalı)
7. **Client ID (for OAuth)** kutusuna → GitHub'dan kopyaladığınız **Client ID**'yi yapıştırın
8. **Client Secret (for OAuth)** kutusuna → GitHub'dan kopyaladığınız **Client Secret**'ı yapıştırın
9. **"Save"** (Kaydet) butonuna tıklayın
10. ✅ **"GitHub provider enabled"** mesajını görmelisiniz

---

## 3. Test Etme

### Adım 3.1: Sayfayı Yenileyin

1. GitHub Pages'den oyuna gidin: **https://yzokumus.github.io/DENEME_HASENE**
2. Sayfayı **hard refresh** yapın: **Ctrl+Shift+R** (Windows) veya **Cmd+Shift+R** (Mac)

### Adım 3.2: Google ile Giriş Testi

1. **"Giriş Yap"** butonuna tıklayın
2. **"Google ile Giriş"** butonuna tıklayın
3. Google giriş sayfası açılmalı
4. Google hesabınızı seçin veya email/şifre girin
5. **"İzin ver"** veya **"Allow"** butonuna tıklayın
6. Otomatik olarak oyuna yönlendirilmelisiniz
7. Üst tarafta **email adresiniz** görünmeli ✅

### Adım 3.3: GitHub ile Giriş Testi

1. **"Giriş Yap"** butonuna tıklayın
2. **"GitHub ile Giriş"** butonuna tıklayın
3. GitHub giriş sayfası açılmalı
4. GitHub hesabınızla giriş yapın
5. **"Authorize Hasene"** (Hasene'yi Yetkilendir) butonuna tıklayın
6. Otomatik olarak oyuna yönlendirilmelisiniz
7. Üst tarafta **email adresiniz** görünmeli ✅

---

## 4. Sorun Giderme

### Sorun 1: "Redirect URI mismatch" Hatası

**Hata:** Google/GitHub'da "Redirect URI mismatch" hatası görünüyor

**Çözüm:**
1. Google Cloud Console → Credentials → OAuth 2.0 Client ID
2. **Authorized redirect URIs** listesinde şu URL olmalı:
   ```
   https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback
   ```
3. Eğer yoksa → **"+ ADD URI"** → URL'yi ekleyin → **Save**

### Sorun 2: "OAuth provider not enabled" Hatası

**Hata:** Console'da "OAuth provider not enabled" görünüyor

**Çözüm:**
1. Supabase Dashboard → Authentication → Providers
2. Google/GitHub provider'ının **Enable** olduğundan emin olun
3. Client ID ve Secret'ın doğru olduğundan emin olun
4. **Save** butonuna tekrar tıklayın

### Sorun 3: OAuth Sonrası Sayfa Yenilenmiyor

**Hata:** OAuth ile giriş yaptıktan sonra sayfa yenilenmiyor

**Çözüm:**
1. Console'u açın (F12)
2. Hata mesajı var mı kontrol edin
3. Sayfayı manuel yenileyin (F5)
4. Giriş yapmış olmalısınız

### Sorun 4: Google Consent Screen "Testing" Modunda

**Hata:** Google giriş sayfasında "This app isn't verified" uyarısı görünüyor

**Çözüm:**
1. Google Cloud Console → APIs & Services → OAuth consent screen
2. **"Publishing status"** → **"Testing"** modunda
3. **Test users** listesine email adresinizi ekleyin
4. Veya **"PUBLISH APP"** butonuna tıklayın (production için)

---

## ✅ Tamamlandı!

OAuth kurulumu tamamlandıktan sonra:
- ✅ Kullanıcılar Google ile giriş yapabilir
- ✅ Kullanıcılar GitHub ile giriş yapabilir
- ✅ Tek tıkla giriş mümkün
- ✅ Daha iyi kullanıcı deneyimi

## 📝 Notlar

- **Google OAuth**: Ücretsiz, günlük 100 istek limiti (yeterli)
- **GitHub OAuth**: Ücretsiz, limit yok
- **Email/Şifre**: Hala çalışıyor, OAuth alternatif olarak ekleniyor

---

**Hangi adımdan başlayalım? Google mı, GitHub mı?**


