# 🔧 Production URL Ayarları - SUPABASE ve GOOGLE OAUTH

Site zaten deploy edilmiş: **https://yzokumus.github.io/DENEME_HASENE/**

Şimdi Supabase ve Google OAuth ayarlarını güncellemek gerekiyor.

---

## ✅ Adım 1: Supabase Redirect URL'lerini Güncelle

### Supabase Dashboard → Authentication → URL Configuration

1. **Site URL** kısmına yazın:
   ```
   https://yzokumus.github.io/DENEME_HASENE
   ```

2. **Redirect URLs** bölümüne şunları ekleyin:
   ```
   https://yzokumus.github.io/DENEME_HASENE/**
   https://yzokumus.github.io/DENEME_HASENE/index.html
   ```

3. **Save** butonuna tıklayın

**Not**: Zaten localhost için redirect URL'ler varsa, bunları SİLMEYİN. Sadece production URL'lerini EKLEYİN.

---

## ✅ Adım 2: Google OAuth Redirect URL'lerini Kontrol Et

### Google Cloud Console → Credentials → OAuth 2.0 Client ID

1. **Authorized redirect URIs** bölümünde şu olmalı:
   ```
   https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback
   ```
   (Bu zaten olmalı - Supabase callback URL'i)

2. **Authorized JavaScript origins** bölümüne ekleyin (opsiyonel ama önerilir):
   ```
   https://yzokumus.github.io
   ```

**Not**: `https://yzokumus.github.io/DENEME_HASENE` değil, sadece `https://yzokumus.github.io` yazın (origin kısmı).

---

## ✅ Adım 3: Test Et

1. **Tarayıcıda açın**:
   ```
   https://yzokumus.github.io/DENEME_HASENE
   ```

2. **"Google ile Giriş Yap" butonuna tıklayın**

3. **Hata alırsanız**:
   - Browser console'u açın (F12)
   - Hata mesajını kontrol edin
   - Özellikle `redirect_uri_mismatch` veya `Invalid redirect URL` hatalarına bakın

---

## 🐛 Olası Sorunlar ve Çözümleri

### Sorun 1: "redirect_uri_mismatch" Hatası

**Neden**: Google OAuth redirect URI eşleşmiyor

**Çözüm**:
1. Google Cloud Console'da **Authorized redirect URIs**'i kontrol edin
2. **Şu URL olmalı**: `https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback`
3. Tam olarak bu URL olmalı (sonunda `/` olmamalı)

---

### Sorun 2: "Invalid redirect URL" Supabase Hatası

**Neden**: Supabase redirect URL'leri production URL'ini içermiyor

**Çözüm**:
1. Supabase Dashboard → Authentication → URL Configuration
2. **Redirect URLs**'e production URL'ini ekleyin:
   ```
   https://yzokumus.github.io/DENEME_HASENE/**
   ```
3. `/**` wildcard kullanın ki tüm sayfalar çalışsın

---

### Sorun 3: Arkadaş Telefondan Erişemiyor

**Kontrol Listesi**:
- [ ] URL doğru mu? `https://yzokumus.github.io/DENEME_HASENE`
- [ ] HTTPS kullanıyor mu? (GitHub Pages otomatik HTTPS sağlar)
- [ ] Telefon internet bağlantısı var mı?
- [ ] Farklı tarayıcı denendi mi? (Chrome, Safari)

---

## 📱 Telefon Test Adımları

1. **Telefonda Chrome veya Safari'yi açın**
2. **URL'i yazın**: `https://yzokumus.github.io/DENEME_HASENE`
3. **Site açılıyor mu kontrol edin**
4. **"Google ile Giriş Yap" butonuna tıklayın**
5. **Google giriş ekranı geliyor mu kontrol edin**
6. **Giriş yaptıktan sonra oyuna yönlendiriliyor mu kontrol edin**

---

## ✅ Başarı Kriterleri

- [x] GitHub Pages deploy edildi: ✅ (8 dakika önce)
- [ ] Supabase Site URL güncellendi
- [ ] Supabase Redirect URLs'e production URL eklendi
- [ ] Google OAuth JavaScript origins güncellendi (opsiyonel)
- [ ] Test edildi ve çalışıyor

---

## 🎯 Hızlı Kontrol

Supabase Dashboard'da şu ayarlar olmalı:

**Site URL**:
```
https://yzokumus.github.io/DENEME_HASENE
```

**Redirect URLs** (şunların hepsi olmalı):
```
http://localhost:5500/**
http://127.0.0.1:5500/**
https://yzokumus.github.io/DENEME_HASENE/**
```

**Google Cloud Console'da**:
- Authorized redirect URIs: `https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback`
- Authorized JavaScript origins: `https://yzokumus.github.io` (opsiyonel)

---

✅ **Şimdi sadece Supabase ve Google OAuth ayarlarını güncellemeniz yeterli!**

