# 🚀 Google OAuth Hızlı Ayarlar - Mobil Hata Çözümü

## ❌ Hata: "CODE 500 ERROR CODE UNEXPECTED_FAILURE"

Bu hata, Supabase'de Google OAuth provider'ının yapılandırılmamış olmasından kaynaklanır.

---

## ✅ Hızlı Çözüm (5 Dakika)

### 1. Google Cloud Console'da OAuth Client ID Oluştur

**📖 Detaylı rehber:** `backend/GOOGLE_CLOUD_OAUTH_CLIENT_ID_OLUSTURMA.md`

**Hızlı özet:**
1. https://console.cloud.google.com/ → Proje seçin (veya yeni proje oluşturun)
2. **APIs & Services** → **OAuth consent screen** (ilk defa ise ayarlayın)
3. **APIs & Services** → **Credentials** → **+ CREATE CREDENTIALS** → **OAuth client ID**
4. **Application type**: **Web application**
5. **Name**: "Hasene Web"
6. **Authorized redirect URIs**: 
   ```
   https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback
   ```
   *(Kendi Supabase project URL'inizi kullanın - Settings → API → Project URL)*
7. **CREATE** → **Client ID** ve **Client Secret**'ı kopyalayın ⚠️ (Bir daha gösterilmeyecek!)

---

### 2. Supabase Dashboard'da Google Provider Ayarla

1. https://app.supabase.com → Projenizi seçin
2. **Authentication** → **Providers** → **Google**
3. **Enable Google** butonuna tıklayın
4. **Client ID**: Google'dan aldığınız Client ID'yi yapıştırın
5. **Client Secret**: Google'dan aldığınız Client Secret'ı yapıştırın
6. **SAVE**

---

### 3. Supabase Redirect URLs Ayarla

1. Supabase Dashboard → **Authentication** (sol menüden 🔐 ikonu)
2. Üst sekmelerden **"URL Configuration"** sekmesine tıklayın
3. **"Redirect URLs"** bölümünü bulun
4. **"+ Add URL"** butonuna tıklayın ve şu URL'leri ekleyin:
   ```
   http://localhost:5500/**
   http://127.0.0.1:5500/**
   https://yzokumus.github.io/DENEME_HASENE/**
   ```
   *(Mobil cihazlar için IP adresi ekleyin: `http://192.168.*.*:5500/**`)*

**📍 Detaylı konum rehberi için:** `backend/REDIRECT_URL_NEREDE.md`

---

## 🧪 Test Et

1. Desktop'ta: `http://localhost:5500` → Giriş → Google ile Giriş
2. Mobil'de: Uygulamayı aç → Giriş → Google ile Giriş

---

## ❓ Hala Çalışmıyor mu?

Detaylı rehber için: `backend/GOOGLE_OAUTH_AYARLARI.md`

---

## 💡 Alternatif: Email/Password Kullan

Google OAuth yerine email/şifre ile giriş yapabilirsiniz:
1. Supabase → Authentication → Providers → Email
2. **Enable Email provider** → **SAVE**
3. Uygulamada email/şifre ile kayıt olun

