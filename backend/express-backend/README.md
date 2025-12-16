# Express.js Backend

## Kurulum

1. MongoDB Atlas'ta ücretsiz cluster oluştur
2. `.env.example` dosyasını `.env` olarak kopyala
3. MongoDB connection string'i `.env` dosyasına ekle
4. `npm install` çalıştır
5. `npm start` ile başlat

## Deploy (Vercel)

1. Vercel hesabı oluştur: https://vercel.com
2. GitHub'a push et
3. Vercel'de "Import Project" yap
4. Environment variables ekle
5. Deploy et

## Deploy (Railway)

1. Railway hesabı oluştur: https://railway.app
2. "New Project" > "Deploy from GitHub"
3. Repository'yi seç
4. Environment variables ekle
5. Deploy et

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/user/stats` - Kullanıcı istatistikleri
- `PUT /api/user/stats` - İstatistikleri güncelle
- `GET /api/user/daily-tasks` - Günlük görevler
- `PUT /api/user/daily-tasks` - Günlük görevleri güncelle
- `GET /api/user/weekly-tasks` - Haftalık görevler
- `PUT /api/user/weekly-tasks` - Haftalık görevleri güncelle
- `GET /api/user/word-stats` - Kelime istatistikleri
- `PUT /api/user/word-stats/:wordId` - Kelime istatistiğini güncelle
- `GET /api/user/favorites` - Favori kelimeler
- `POST /api/user/favorites/:wordId` - Favori ekle
- `DELETE /api/user/favorites/:wordId` - Favori kaldır
- `GET /api/user/daily-stats/:date` - Günlük istatistik
- `PUT /api/user/daily-stats/:date` - Günlük istatistiği güncelle
- `GET /api/leaderboard` - Liderlik tablosu

## Authentication

Header'da `x-user-id` gönderilmesi gerekiyor:
```
x-user-id: user-id-here
```

Production'da JWT token kullanılmalı.









