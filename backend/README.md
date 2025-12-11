# Hasene Backend - Ücretsiz Backend Çözümleri

Bu proje için 3 farklı ücretsiz backend seçeneği sunuyoruz:

## 🚀 Seçenek 1: Supabase (ÖNERİLEN - En Kolay)

**Avantajlar:**
- ✅ Tamamen ücretsiz (500MB database, 2GB bandwidth)
- ✅ PostgreSQL database (güçlü ve güvenilir)
- ✅ Otomatik REST API oluşturuyor
- ✅ Authentication dahil (email, Google, GitHub)
- ✅ Real-time subscriptions
- ✅ Kolay kurulum (5 dakika)

**Kurulum:**
1. https://supabase.com adresine git
2. Ücretsiz hesap oluştur
3. Yeni proje oluştur
4. `supabase-setup.sql` dosyasını çalıştır
5. API key'leri `.env` dosyasına ekle

## 🔥 Seçenek 2: Firebase (Google)

**Avantajlar:**
- ✅ Ücretsiz tier (1GB storage, 10GB bandwidth)
- ✅ NoSQL database (Firestore)
- ✅ Authentication dahil
- ✅ Real-time database
- ✅ Kolay kurulum

**Kurulum:**
1. https://firebase.google.com adresine git
2. Ücretsiz hesap oluştur
3. Yeni proje oluştur
4. `firebase-setup.js` dosyasını kullan

## 🟢 Seçenek 3: MongoDB Atlas + Express.js

**Avantajlar:**
- ✅ Ücretsiz MongoDB (512MB)
- ✅ Tam kontrol
- ✅ Express.js ile custom API
- ⚠️ Sunucu gerekiyor (Vercel/Railway ücretsiz)

**Kurulum:**
1. https://www.mongodb.com/cloud/atlas adresine git
2. Ücretsiz cluster oluştur
3. `express-backend/` klasöründeki kodu kullan
4. Vercel/Railway'e deploy et

## 📊 Veri Yapısı

### Kullanıcı Verileri
- `totalPoints` - Toplam Hasene
- `badges` - Rozet verileri
- `streakData` - Seri verileri
- `gameStats` - Oyun istatistikleri
- `wordStats` - Kelime istatistikleri
- `dailyTasks` - Günlük görevler
- `weeklyTasks` - Haftalık görevler
- `favorites` - Favori kelimeler
- `achievements` - Başarımlar

### Detaylı İstatistikler
- `hasene_daily_YYYY-MM-DD` - Günlük istatistikler
- `hasene_weekly_YYYY-MM-DD` - Haftalık istatistikler
- `hasene_monthly_YYYY-MM` - Aylık istatistikler

## 🔐 Authentication

Kullanıcılar şu yöntemlerle giriş yapabilir:
1. Email/Şifre
2. Google (OAuth)
3. GitHub (OAuth)
4. Anonim (geçici kullanıcı)

## 📡 API Endpoints

```
POST   /api/auth/register     - Kullanıcı kaydı
POST   /api/auth/login        - Kullanıcı girişi
GET    /api/user/stats        - Kullanıcı istatistikleri
PUT    /api/user/stats        - İstatistikleri güncelle
GET    /api/user/tasks        - Görevleri getir
PUT    /api/user/tasks        - Görevleri güncelle
GET    /api/user/word-stats   - Kelime istatistikleri
PUT    /api/user/word-stats   - Kelime istatistiklerini güncelle
GET    /api/leaderboard       - Liderlik tablosu
```

## 🚀 Hızlı Başlangıç (Supabase)

1. `supabase-setup.sql` dosyasını Supabase SQL Editor'de çalıştır
2. `.env.example` dosyasını `.env` olarak kopyala
3. Supabase'den API key'leri al ve `.env` dosyasına ekle
4. Frontend'de `js/api-service.js` modülünü kullan


