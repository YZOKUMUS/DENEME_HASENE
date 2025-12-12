# 🔗 Redirect URL Nerede? - Supabase Dashboard

## 📍 Supabase Dashboard'da Redirect URL Ayarları

### Adım 1: Supabase Dashboard'a Giriş Yapın

1. https://app.supabase.com adresine gidin
2. Projenizi seçin

---

### Adım 2: Authentication Bölümüne Gidin

1. Sol menüden **"Authentication"** (🔐) sekmesine tıklayın
2. Açılan alt menüden **"URL Configuration"** sekmesine tıklayın

**Veya:**

1. Sol menüden **"Authentication"** sekmesine tıklayın
2. Üstteki sekmelerden **"URL Configuration"** sekmesine tıklayın

---

### Adım 3: Redirect URLs Bölümünü Bulun

**URL Configuration** sayfasında şu bölümleri göreceksiniz:

#### 1. **Site URL**
```
http://localhost:5500
```
*(Geliştirme için)*

#### 2. **Redirect URLs** ⭐ (BURASI!)
Bu bölümde şu URL'leri ekleyin:

```
http://localhost:5500/**
http://127.0.0.1:5500/**
https://yzokumus.github.io/DENEME_HASENE/**
```

**Mobil cihazlar için ekleyin:**
```
http://192.168.*.*:5500/**
```
*(Yerel ağ IP'leri için - mobil cihazlar)*

---

## 📸 Görsel Konum

```
Supabase Dashboard
├── Sol Menü
│   ├── Table Editor
│   ├── SQL Editor
│   ├── Authentication 🔐 ← BURAYA TIKLA
│   │   ├── Users
│   │   ├── Policies
│   │   ├── Providers ← Google OAuth ayarları burada
│   │   └── URL Configuration ⭐ ← REDIRECT URL'LERİ BURADA!
│   ├── Storage
│   └── ...
```

---

## 🔍 Alternatif: Providers Bölümünden

1. **Authentication** → **Providers** sekmesine gidin
2. **Google** provider'ını bulun
3. **Configure** butonuna tıklayın
4. Açılan pencerede **"Redirect URLs"** bölümü görünecek

**Ancak:** Genel redirect URL'leri **URL Configuration** bölümünden ayarlamak daha iyidir.

---

## ✅ Eklenmesi Gereken Redirect URL'ler

### Desktop (Geliştirme):
```
http://localhost:5500/**
http://127.0.0.1:5500/**
```

### Production:
```
https://yzokumus.github.io/DENEME_HASENE/**
```
*(Kendi domain URL'iniz varsa onu da ekleyin)*

### Mobil Cihazlar (Yerel Ağ):
```
http://192.168.*.*:5500/**
```
*(Wildcard ile tüm yerel ağ IP'lerini kapsar)*

---

## 📝 Adım Adım Nasıl Eklenir?

1. **Authentication** → **URL Configuration** sayfasına gidin
2. **Redirect URLs** bölümünde **"+ Add URL"** butonuna tıklayın
3. URL'i girin (örnek: `http://localhost:5500/**`)
4. **Enter** veya **"Add"** butonuna tıklayın
5. Tüm URL'leri ekledikten sonra sayfa otomatik kaydedilir

---

## ⚠️ Önemli Notlar

1. **Wildcard (`**`)** kullanarak tüm alt sayfaları kapsayabilirsiniz
   - ✅ `http://localhost:5500/**` → Tüm alt sayfalar
   - ❌ `http://localhost:5500` → Sadece ana sayfa

2. **Her URL'i ayrı ayrı ekleyin** (virgülle ayırmayın)

3. **HTTPS** ve **HTTP** farklı URL'lerdir, ikisini de ekleyin

4. **Mobil cihazlar** için yerel ağ IP adresini ekleyin:
   - Bilgisayarınızın yerel IP'sini öğrenin (örnek: `192.168.1.100`)
   - `http://192.168.1.100:5500/**` şeklinde ekleyin

---

## 🧪 Test Etme

1. Redirect URL'leri ekledikten sonra
2. Mobil cihazınızdan uygulamayı açın
3. Google ile giriş yapmayı deneyin
4. ✅ Artık çalışmalı!

---

## 🎯 Hızlı Erişim

**Doğrudan link (kendi proje URL'inizi kullanın):**
```
https://app.supabase.com/project/YOUR_PROJECT_ID/auth/url-configuration
```

**veya**

1. Dashboard → Authentication → URL Configuration

