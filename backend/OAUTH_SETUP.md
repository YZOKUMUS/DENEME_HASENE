# 🔐 OAuth (Google/GitHub) Kurulum Rehberi

## Google OAuth Kurulumu

### 1. Google Cloud Console'da Proje Oluştur

1. **https://console.cloud.google.com** adresine git
2. Yeni proje oluştur veya mevcut projeyi seç
3. Proje adı: `Hasene Game`

### 2. OAuth Consent Screen Ayarla

1. Sol menüden **"APIs & Services"** > **"OAuth consent screen"** sekmesine git
2. **"External"** seçeneğini seç (test için)
3. Formu doldur:
   - **App name**: `Hasene Arapça Dersi`
   - **User support email**: Kendi email'iniz
   - **Developer contact information**: Kendi email'iniz
4. **"Save and Continue"** butonuna tıkla
5. **Scopes** sayfasında **"Save and Continue"** (varsayılan scopes yeterli)
6. **Test users** sayfasında kendi email'inizi ekle (test için)
7. **"Save and Continue"** butonuna tıkla

### 3. OAuth Credentials Oluştur

1. Sol menüden **"APIs & Services"** > **"Credentials"** sekmesine git
2. **"+ CREATE CREDENTIALS"** > **"OAuth client ID"** seç
3. **Application type**: `Web application` seç
4. **Name**: `Hasene Web App`
5. **Authorized JavaScript origins**:
   - `http://localhost:5500` (development için)
   - `https://yourdomain.com` (production için)
6. **Authorized redirect URIs**:
   - `https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback`
7. **"Create"** butonuna tıkla
8. **Client ID** ve **Client Secret**'ı kopyala

### 4. Supabase'e Google OAuth Ekle

1. **Supabase Dashboard** > **Authentication** > **Providers** sekmesine git
2. **Google** provider'ını bul ve **Enable** yap
3. **Client ID** ve **Client Secret**'ı yapıştır
4. **"Save"** butonuna tıkla

## GitHub OAuth Kurulumu

### 1. GitHub'da OAuth App Oluştur

1. **https://github.com/settings/developers** adresine git
2. **"OAuth Apps"** sekmesine git
3. **"New OAuth App"** butonuna tıkla
4. Formu doldur:
   - **Application name**: `Hasene Arapça Dersi`
   - **Homepage URL**: `http://localhost:5500` (development) veya `https://yourdomain.com` (production)
   - **Authorization callback URL**: `https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback`
5. **"Register application"** butonuna tıkla
6. **Client ID** ve **Client Secret**'ı kopyala

### 2. Supabase'e GitHub OAuth Ekle

1. **Supabase Dashboard** > **Authentication** > **Providers** sekmesine git
2. **GitHub** provider'ını bul ve **Enable** yap
3. **Client ID** ve **Client Secret**'ı yapıştır
4. **"Save"** butonuna tıkla

## Site URL Ayarları

Supabase Dashboard'da **Authentication** > **URL Configuration** sekmesinde:

- **Site URL**: `http://localhost:5500` (development) veya `https://yourdomain.com` (production)
- **Redirect URLs**: 
  - `http://localhost:5500/**`
  - `https://yourdomain.com/**`

## Test Et

1. Oyunu aç
2. **"Giriş Yap"** butonuna tıkla
3. **"Google ile Giriş"** veya **"GitHub ile Giriş"** butonuna tıkla
4. OAuth akışı başlamalı
5. Giriş yaptıktan sonra sayfa yenilenecek ve kullanıcı bilgileri görünecek

## Sorun Giderme

### "Redirect URI mismatch" hatası

**Çözüm**: 
- Google Cloud Console'da **Authorized redirect URIs** listesine `https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback` eklediğinizden emin olun
- GitHub'da **Authorization callback URL**'nin doğru olduğundan emin olun

### "OAuth provider not enabled" hatası

**Çözüm**: 
- Supabase Dashboard'da provider'ın **Enable** olduğundan emin olun
- Client ID ve Secret'ın doğru olduğundan emin olun

### OAuth sonrası sayfa yenilenmiyor

**Çözüm**: 
- Browser console'u kontrol edin
- `auth.js` dosyasındaki OAuth callback kontrolünü kontrol edin




