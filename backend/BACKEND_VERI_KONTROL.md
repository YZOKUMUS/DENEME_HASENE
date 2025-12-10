# 📊 Backend'de Verileri Görme Rehberi

## 1. Supabase Dashboard'a Git

1. [Supabase Dashboard](https://app.supabase.com/) → Projenize giriş yapın
2. Projenizi seçin: **DENEME_HASENE**

## 2. Verileri Kontrol Etme

### A. Kullanıcı İstatistikleri (user_stats)

1. Sol menüden **"Table Editor"** (📊) ikonuna tıklayın
2. **"user_stats"** tablosunu seçin
3. Oyun oynadıktan sonra şu verileri göreceksiniz:
   - `user_id`: Kullanıcı ID'si
   - `total_points`: Toplam Hasene puanı
   - `badges`: Rozet bilgileri (JSON)
   - `streak_data`: Seri bilgileri (JSON)
   - `game_stats`: Oyun istatistikleri (JSON)
   - `perfect_lessons_count`: Mükemmel ders sayısı
   - `updated_at`: Son güncelleme zamanı

### B. Günlük Görevler (daily_tasks)

1. **"Table Editor"** → **"daily_tasks"** tablosunu seçin
2. Şu verileri göreceksiniz:
   - `user_id`: Kullanıcı ID'si
   - `last_task_date`: Son görev tarihi
   - `tasks`: Görevler (JSON)
   - `today_stats`: Bugünkü istatistikler (JSON)
   - `completed_tasks`: Tamamlanan görevler (JSON)

### C. Haftalık Görevler (weekly_tasks)

1. **"Table Editor"** → **"weekly_tasks"** tablosunu seçin
2. Şu verileri göreceksiniz:
   - `user_id`: Kullanıcı ID'si
   - `week_start`: Hafta başlangıcı
   - `week_end`: Hafta bitişi
   - `tasks`: Görevler (JSON)
   - `week_stats`: Haftalık istatistikler (JSON)

### D. Kelime İstatistikleri (word_stats)

1. **"Table Editor"** → **"word_stats"** tablosunu seçin
2. Her kelime için:
   - `user_id`: Kullanıcı ID'si
   - `word_id`: Kelime ID'si
   - `attempts`: Deneme sayısı
   - `correct`: Doğru cevap sayısı
   - `wrong`: Yanlış cevap sayısı
   - `last_correct`: Son doğru cevap tarihi
   - `last_wrong`: Son yanlış cevap tarihi

### E. Kullanıcı Profilleri (profiles)

1. **"Table Editor"** → **"profiles"** tablosunu seçin
2. Kullanıcı bilgileri:
   - `id`: Kullanıcı ID'si (auth.users ile aynı)
   - `username`: Kullanıcı adı
   - `created_at`: Oluşturulma tarihi

## 3. SQL Editor ile Sorgulama

### Tüm Kullanıcı İstatistiklerini Gör:

```sql
SELECT 
    p.username,
    us.total_points,
    us.game_stats,
    us.updated_at
FROM profiles p
JOIN user_stats us ON p.id = us.user_id
ORDER BY us.total_points DESC;
```

### Belirli Bir Kullanıcının İstatistiklerini Gör:

```sql
SELECT 
    p.username,
    us.total_points,
    us.badges,
    us.streak_data,
    us.game_stats,
    us.perfect_lessons_count
FROM profiles p
JOIN user_stats us ON p.id = us.user_id
WHERE p.username = 'kullanici_adi';
```

### Bugünkü Oyun İstatistiklerini Gör:

```sql
SELECT 
    p.username,
    dt.today_stats->>'toplamDogru' as dogru_sayisi,
    dt.today_stats->>'toplamPuan' as bugunku_puan,
    dt.today_stats->>'comboCount' as combo_sayisi
FROM profiles p
JOIN daily_tasks dt ON p.id = dt.user_id
WHERE dt.last_task_date = CURRENT_DATE;
```

### En Çok Oynayan Kullanıcılar:

```sql
SELECT 
    p.username,
    us.total_points,
    (us.game_stats->>'totalCorrect')::int as toplam_dogru,
    (us.game_stats->>'totalWrong')::int as toplam_yanlis
FROM profiles p
JOIN user_stats us ON p.id = us.user_id
ORDER BY (us.game_stats->>'totalCorrect')::int DESC
LIMIT 10;
```

## 4. Authentication Logs (Giriş Kayıtları)

1. Sol menüden **"Authentication"** (🔐) ikonuna tıklayın
2. **"Users"** sekmesine gidin
3. Kullanıcıları görebilirsiniz:
   - Email adresi
   - Son giriş zamanı
   - Email doğrulama durumu

## 5. Real-time Monitoring

1. Sol menüden **"Logs"** (📋) ikonuna tıklayın
2. **"API Logs"** → Backend çağrılarını görebilirsiniz
3. **"Auth Logs"** → Giriş/çıkış kayıtlarını görebilirsiniz

## 6. Veri Güncellemelerini Kontrol Etme

### Manuel Kontrol:
1. Oyun oynayın
2. Birkaç saniye bekleyin (veriler otomatik kaydedilir)
3. **Table Editor**'da **"Refresh"** butonuna tıklayın
4. `updated_at` sütununu kontrol edin - yeni tarih görünmeli

### Otomatik Güncelleme:
- Veriler oyun bittikten sonra otomatik kaydedilir
- `saveStats()` fonksiyonu çağrıldığında backend'e yazılır

## 7. Sorun Giderme

### Veriler görünmüyorsa:
1. **Table Editor**'da **"Refresh"** butonuna tıklayın
2. Console'u kontrol edin (F12) - hata var mı?
3. **Logs** → **API Logs** → Backend çağrıları başarılı mı?

### Veriler güncellenmiyorsa:
1. Kullanıcının giriş yaptığından emin olun
2. `saveStats()` fonksiyonunun çağrıldığını kontrol edin
3. Network tab'ında backend çağrılarını kontrol edin

## 🎯 Hızlı Kontrol

**En hızlı yol:**
1. Supabase Dashboard → **Table Editor** → **user_stats**
2. Kullanıcınızın satırını bulun
3. `total_points` ve `game_stats` sütunlarını kontrol edin
4. Oyun oynadıktan sonra bu değerler güncellenmeli!

