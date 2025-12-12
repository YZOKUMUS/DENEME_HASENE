# 🔗 Frontend-Backend Entegrasyon Rehberi

## ✅ Tamamlanan İşlemler

1. ✅ Backend klasör yapısı oluşturuldu
2. ✅ Supabase database schema hazırlandı
3. ✅ API servis modülü (`js/api-service.js`) oluşturuldu
4. ✅ Frontend entegrasyonu yapıldı (`game-core.js` güncellendi)
5. ✅ Hibrit sistem: Backend varsa API, yoksa localStorage kullanılıyor

## 📋 Sizin Yapmanız Gerekenler

### 1. Supabase Hesabı Oluştur (5 dakika)

1. **https://supabase.com** adresine git
2. "Start your project" butonuna tıkla
3. GitHub ile giriş yap (ücretsiz)
4. Yeni proje oluştur:
   - **Project name**: `hasene-game`
   - **Database Password**: Güçlü bir şifre seç (kaydet!)
   - **Region**: En yakın bölgeyi seç (örn: `Europe West`)

### 2. Database Schema Oluştur (2 dakika)

1. Supabase Dashboard'da **"SQL Editor"** sekmesine git
2. **`backend/supabase-setup.sql`** dosyasını aç
3. Tüm içeriği kopyala
4. SQL Editor'e yapıştır
5. **"Run"** butonuna tıkla
6. ✅ Tüm tablolar oluşturulacak

### 3. API Key'leri Al (1 dakika)

1. Supabase Dashboard'da **"Settings"** > **"API"** sekmesine git
2. Şu bilgileri kopyala:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (uzun bir key)

### 4. Frontend'e API Key'leri Ekle (2 dakika)

**Seçenek 1: `.env` dosyası (Vite için)**
```bash
# Proje kök dizininde .env dosyası oluştur
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**Seçenek 2: localStorage (Hızlı test için)**
```javascript
// Browser console'da çalıştır:
localStorage.setItem('supabase_url', 'https://xxxxx.supabase.co');
localStorage.setItem('supabase_key', 'eyJhbGc...');
```

**Seçenek 3: index.html içinde script tag (Geçici)**
```html
<script>
    window.VITE_SUPABASE_URL = 'https://xxxxx.supabase.co';
    window.VITE_SUPABASE_ANON_KEY = 'eyJhbGc...';
</script>
```

### 5. Authentication Ayarla (Opsiyonel - 2 dakika)

1. Supabase Dashboard'da **"Authentication"** > **"Providers"** sekmesine git
2. İstediğin provider'ları aktif et:
   - ✅ **Email** (varsayılan aktif)
   - ✅ **Google** (OAuth için - Site URL ekle)
   - ✅ **GitHub** (OAuth için - Site URL ekle)

**Site URL**: `http://localhost:3000` (geliştirme) veya `https://yourdomain.com` (production)

### 6. Test Et

1. Uygulamayı aç
2. Browser console'u aç (F12)
3. Şu mesajı görmelisin: `✅ Supabase client başlatıldı`
4. Oyun oyna, puan kazan
5. Supabase Dashboard'da **"Table Editor"** > **"user_stats"** tablosuna bak
6. Verilerin göründüğünü kontrol et ✅

## 🔄 Nasıl Çalışıyor?

### Hibrit Sistem

1. **Backend mevcut ve kullanıcı giriş yapmışsa**:
   - Veriler Supabase'e kaydedilir
   - Veriler Supabase'den yüklenir
   - localStorage/IndexedDB yedek olarak kullanılır

2. **Backend yoksa veya kullanıcı giriş yapmamışsa**:
   - Veriler localStorage/IndexedDB'ye kaydedilir
   - Veriler localStorage/IndexedDB'den yüklenir
   - Oyun normal çalışır (offline mode)

### Veri Akışı

```
Kullanıcı oyun oynar
    ↓
saveStats() çağrılır
    ↓
Backend API'ye kaydet (varsa)
    ↓
localStorage/IndexedDB'ye kaydet (yedek)
    ↓
Başarılı ✅
```

## 🐛 Sorun Giderme

### "Supabase client başlatılamadı" hatası

**Çözüm**: API key'lerin doğru olduğundan emin ol:
```javascript
console.log(localStorage.getItem('supabase_url'));
console.log(localStorage.getItem('supabase_key'));
```

### Veriler backend'e kaydedilmiyor

**Kontrol et**:
1. Kullanıcı giriş yapmış mı? (`getCurrentUser()`)
2. Browser console'da hata var mı?
3. Supabase RLS (Row Level Security) aktif mi?

**Çözüm**: Supabase Dashboard'da **"Table Editor"** > **"user_stats"** tablosunda **"RLS"** butonuna tıkla ve politikaların aktif olduğunu kontrol et.

### "Unauthorized" hatası

**Çözüm**: Supabase Dashboard'da **"Authentication"** > **"Policies"** sekmesinde RLS politikalarının doğru olduğundan emin ol.

## 📊 Veri Yapısı

### user_stats Tablosu
- `total_points`: Toplam Hasene puanı
- `badges`: Rozet verileri (JSON)
- `streak_data`: Seri verileri (JSON)
- `game_stats`: Oyun istatistikleri (JSON)

### daily_tasks Tablosu
- `last_task_date`: Son görev tarihi
- `tasks`: Görevler (JSON array)
- `today_stats`: Bugünkü istatistikler (JSON)

### weekly_tasks Tablosu
- `last_week_start`: Son hafta başlangıcı
- `tasks`: Görevler (JSON array)
- `week_stats`: Haftalık istatistikler (JSON)

## 🚀 Sonraki Adımlar

1. ✅ Authentication UI ekle (kullanıcı girişi/kaydı)
2. ✅ Liderlik tablosu ekle
3. ✅ Real-time özellikler ekle (isteğe bağlı)
4. ✅ Veri migrate et (mevcut kullanıcılar için)

## 📞 Yardım

Sorun yaşarsanız:
1. Browser console'u kontrol et
2. Supabase Dashboard'da **"Logs"** sekmesine bak
3. `backend/KURULUM.md` dosyasını oku






