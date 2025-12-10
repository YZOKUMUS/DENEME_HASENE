# 🔐 OAuth Kurulumu - Adım Adım Rehber

## ✅ Kod Hazır!

OAuth kodları zaten hazır. Sadece Supabase Dashboard'da provider'ları aktifleştirmeniz gerekiyor.

## 📋 Adım Adım Kurulum

### 1. Google OAuth Kurulumu

#### A) Google Cloud Console'da OAuth App Oluştur

1. [Google Cloud Console](https://console.cloud.google.com/) → Giriş yapın
2. **Yeni Proje Oluştur** (veya mevcut projeyi seçin)
   - Proje adı: "Hasene OAuth" (veya istediğiniz bir isim)
3. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
4. **Configure Consent Screen** (ilk kez yapıyorsanız):
   - User Type: **External** → **Create**
   - App name: **Hasene**
   - User support email: **Email adresiniz**
   - Developer contact: **Email adresiniz**
   - **Save and Continue** → **Save and Continue** → **Back to Dashboard**
5. **Create OAuth 2.0 Client ID**:
   - Application type: **Web application**
   - Name: **Hasene Web Client**
   - **Authorized redirect URIs** → **Add URI**:
     ```
     https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback
     ```
   - **Create**
6. **Client ID** ve **Client Secret**'ı kopyalayın (önemli!)

#### B) Supabase Dashboard'da Google Provider'ı Aktifleştir

1. Supabase Dashboard → **Authentication** → **Providers**
2. **Google** provider'ına tıklayın
3. **Enable Google provider** toggle'ını **AÇ**
4. **Client ID (for OAuth)** → Google'dan kopyaladığınız Client ID'yi yapıştırın
5. **Client Secret (for OAuth)** → Google'dan kopyaladığınız Client Secret'ı yapıştırın
6. **Save** butonuna tıklayın

### 2. GitHub OAuth Kurulumu

#### A) GitHub'da OAuth App Oluştur

1. [GitHub Developer Settings](https://github.com/settings/developers) → Giriş yapın
2. **OAuth Apps** → **New OAuth App**
3. **Application name**: **Hasene**
4. **Homepage URL**: 
   ```
   https://yzokumus.github.io/DENEME_HASENE
   ```
5. **Authorization callback URL**:
   ```
   https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback
   ```
6. **Register application**
7. **Client ID** ve **Client Secret**'ı kopyalayın (Client Secret'ı görmek için "Generate a new client secret" butonuna tıklayın)

#### B) Supabase Dashboard'da GitHub Provider'ı Aktifleştir

1. Supabase Dashboard → **Authentication** → **Providers**
2. **GitHub** provider'ına tıklayın
3. **Enable GitHub provider** toggle'ını **AÇ**
4. **Client ID (for OAuth)** → GitHub'dan kopyaladığınız Client ID'yi yapıştırın
5. **Client Secret (for OAuth)** → GitHub'dan kopyaladığınız Client Secret'ı yapıştırın
6. **Save** butonuna tıklayın

## 🎯 Test Etme

### 1. Sayfayı Yenileyin

GitHub Pages'de sayfayı yenileyin (Ctrl+Shift+R)

### 2. Giriş Modalını Açın

"Giriş Yap" butonuna tıklayın

### 3. OAuth Butonlarını Test Edin

- **"Google ile Giriş"** butonuna tıklayın → Google giriş sayfası açılmalı
- **"GitHub ile Giriş"** butonuna tıklayın → GitHub giriş sayfası açılmalı

### 4. Giriş Yapın

- Google/GitHub hesabınızla giriş yapın
- Otomatik olarak oyuna yönlendirilmelisiniz
- Üst tarafta email adresiniz görünmeli

## ⚠️ Sorun Giderme

### Google OAuth Çalışmıyorsa:

1. **Redirect URI kontrolü:**
   - Google Cloud Console → Credentials → OAuth 2.0 Client ID
   - Authorized redirect URIs'de şu URL olmalı:
     ```
     https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback
     ```

2. **Consent Screen kontrolü:**
   - Google Cloud Console → APIs & Services → OAuth consent screen
   - "Publishing status" → "Testing" modunda olabilir
   - Test kullanıcıları ekleyin veya "Publish" yapın

### GitHub OAuth Çalışmıyorsa:

1. **Callback URL kontrolü:**
   - GitHub → Settings → Developer settings → OAuth Apps
   - Authorization callback URL şu olmalı:
     ```
     https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback
     ```

2. **Client Secret kontrolü:**
   - Client Secret'ı yeniden oluşturun
   - Supabase Dashboard'da güncelleyin

## 🎉 Tamamlandı!

OAuth kurulumu tamamlandıktan sonra:
- ✅ Kullanıcılar Google ile giriş yapabilir
- ✅ Kullanıcılar GitHub ile giriş yapabilir
- ✅ Tek tıkla giriş mümkün
- ✅ Daha iyi kullanıcı deneyimi

## 📝 Notlar

- **Google OAuth**: Ücretsiz, günlük 100 istek limiti (yeterli)
- **GitHub OAuth**: Ücretsiz, limit yok
- **Email/Şifre**: Hala çalışıyor, OAuth alternatif olarak ekleniyor

