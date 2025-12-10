# 📍 Doğru Yol: Email Confirmation Ayarı

## ⚠️ Şu An Neredesiniz?

Görselde **kullanıcı detay sayfası** görünüyor. Bu yanlış sayfa!

## ✅ Doğru Sayfa: Authentication > Providers

### Adım 1: Sol Menüden Doğru Yere Git

1. **Sol menüden** (en üstteki yan menüden):
   - **"Authentication"** sekmesine tıkla
   - **"Providers"** alt sekmesine tıkla

### Adım 2: Email Provider Ayarlarını Bul

1. **"Providers"** sayfasında şunları göreceksiniz:
   - Google
   - GitHub  
   - Email ← **BUNU BUL**

2. **"Email"** provider'ının yanında:
   - **"Enable Email provider"** toggle'ı olmalı (AÇIK olmalı)
   - **"Confirm email"** toggle'ı olmalı (BUNU KAPAT)

### Adım 3: Confirm Email'i Kapat

1. **"Email"** provider'ının altında veya yanında
2. **"Confirm email"** veya **"Require email confirmation"** seçeneğini bul
3. Toggle'ı **KAPAT**
4. **"Save"** butonuna tıkla

## 📸 Hangi Sayfada Olmalısınız?

```
Supabase Dashboard
├── Authentication (sol menüden)
│   ├── Users (şu an buradasınız - YANLIŞ)
│   ├── Providers (BURAYA GİTMELİSİNİZ) ← ✅
│   ├── Policies
│   └── URL Configuration
```

## 🔍 Alternatif: Email Template'lerden

Eğer Providers sayfasında "Confirm email" seçeneğini bulamazsanız:

1. **Authentication** > **Email Templates** sekmesine git
2. Orada email confirmation ayarları olabilir
3. Veya **Settings** > **Auth** bölümüne bak

## 💡 Hızlı Çözüm

Eğer bulamazsanız, şu adımları deneyin:

1. Sol menüden **"Settings"** (⚙️ ikonu) sekmesine git
2. **"Auth"** alt sekmesine git
3. **"Email Auth"** veya **"Email Confirmation"** ayarını bul
4. **"Disable email confirmation"** veya benzer bir seçeneği kapat

## 🆘 Hala Bulamıyorsanız

Supabase'in yeni arayüzünde farklı olabilir. Şunu deneyin:

1. Sol menüden **"Project Settings"** (⚙️) sekmesine git
2. **"Auth"** sekmesine git
3. **"Email"** bölümünde ayarları kontrol et

