# 🔑 API Keys Ayarları

## API Keys Sekmesinde Ne Var?

API Keys sekmesinde genellikle şunlar görünür:

1. **anon key** (public key) - Frontend'de kullanılır ✅ (Zaten kullanıyoruz)
2. **service_role key** (secret key) - Backend'de kullanılır (Gizli tutulmalı!)
3. **JWT Secret** - Token imzalama için kullanılır

## Şu An Durum

✅ **anon key** zaten `index.html` içinde kullanılıyor:
```javascript
window.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

## Yapılacaklar

### 1. API Keys'i Kontrol Et (Sadece Bilgi)

- **anon key**: Frontend'de kullanılıyor ✅
- **service_role key**: Backend'de kullanılır (Gizli tutun!)
- Bu key'leri kopyalayıp başka yere kaydetmeyin (güvenlik riski)

### 2. CORS Ayarları (API Keys'de Yok)

CORS ayarları genellikle API Keys sekmesinde **değil**, şu yerlerde olabilir:
- **Project Settings** → **API** → **CORS**
- **Authentication** → **URL Configuration**
- Veya otomatik açık olabilir

### 3. GitHub Pages için Yapılacaklar

GitHub Pages için **hiçbir şey yapmanıza gerek yok** çünkü:
- ✅ anon key zaten `index.html` içinde
- ✅ Supabase CORS genellikle otomatik açık
- ✅ GitHub Pages'den direkt çalışmalı

## ⚠️ Güvenlik Uyarısı

**service_role key'i ASLA frontend'de kullanmayın!**
- Bu key tüm veritabanına erişim sağlar
- Sadece backend'de (server-side) kullanılmalı
- Şu an frontend'de kullanmıyoruz ✅

## Sonuç

**API Keys sekmesinde hiçbir şey yapmanıza gerek yok!**

Şimdi yapmanız gereken:
1. ✅ GitHub Pages'i aktifleştirin
2. ✅ Test edin
3. ✅ CORS hatası varsa o zaman ayarları yapın

API Keys sekmesinden çıkabilirsiniz, orada yapılacak bir şey yok! 🎉






