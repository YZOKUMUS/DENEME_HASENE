# 🧪 YENİ KULLANICI TEST REHBERİ

## 📋 HAZIRLIK (Backend Kontrolü)

### 1. Supabase Dashboard'da Kontrol
1. Supabase Dashboard → **Table Editor** açın
2. **schema: public** seçili olduğundan emin olun
3. Şu tabloların **BOŞ** olduğunu kontrol edin:
   - `profiles`
   - `user_stats`
   - `daily_tasks`
   - `weekly_tasks`
   - `weekly_leaderboard`
   - `user_leagues`
   - `achievements`
   - `badges`
   - `word_stats`
   - `daily_stats`
   - `weekly_stats`
   - `monthly_stats`

✅ **Kontrol:** Tüm tablolar boşsa devam edebilirsiniz.

---

## 🎮 ADIM ADIM TEST SÜRECİ

### ADIM 1: YENİ KULLANICI OLUŞTURMA

1. **Uygulamayı açın** (tarayıcıda)
2. **"Giriş Yap"** butonuna tıklayın
3. **"Kayıt Ol"** sekmesine geçin
4. **Yeni bir email adresi** ile kayıt olun:
   - Email: (yeni bir email girin)
   - Şifre: (güçlü bir şifre)
   - **VEYA** Google ile kayıt olun
5. **Kayıt Ol** butonuna tıklayın

✅ **Beklenen Sonuç:** Giriş yapılır ve ana ekrana yönlendirilirsiniz.

---

### ADIM 2: İLK OYUN OYNAMA

1. Ana ekranda **bir oyun modu seçin** (örn: "Kelime Çevir")
2. **Zorluk seviyesi** seçin (Kolay/Orta/Zor)
3. **"Oyunu Başlat"** butonuna tıklayın
4. **10 soru cevaplayın** (mümkünse hepsini doğru cevaplayın)
5. Oyun bittiğinde **sonuç ekranını** inceleyin

✅ **Beklenen Sonuç:** 
- Puan kazanmalısınız (örn: 100-1000 puan)
- İstatistikler güncellenmiş olmalı
- Eğer ilk 100 puan ise, başarım popup'ı görünebilir

---

### ADIM 3: LİDERLİK TABLOSUNU KONTROL ETME

1. Alt navigasyon barında **"Ligler"** butonuna tıklayın
2. Leaderboard modal'ının açıldığını kontrol edin

✅ **Beklenen Sonuç:**
- Lig adı: **"Mübtedi"** görünmeli
- Konum: **#1** (ilk oyuncuysanız)
- Weekly XP: Kazandığınız puan görünmeli
- Progress bar görünmeli

---

### ADIM 4: İSTATİSTİKLERİ KONTROL ETME

1. Ana ekranda **istatistik** butonuna tıklayın (varsa)
2. Veya **alt navigasyon** barından istatistikler sekmesine gidin

✅ **Beklenen Sonuç:**
- Toplam puan görünmeli
- Bugünkü puan görünmeli
- Streak bilgisi görünmeli

---

## 🔍 BACKEND KONTROLÜ (Supabase Dashboard)

### ADIM 5: TABLOLARI KONTROL ETME

**Supabase Dashboard → Table Editor** açın ve şu kontrolleri yapın:

#### 5.1. `profiles` Tablosu
1. `profiles` tablosuna tıklayın
2. ✅ **Kontrol:** Sizin `user_id` ve `username` kaydınız olmalı

**Beklenen Veri:**
```
id: [sizin-user-id]
username: [email'inizin ilk kısmı veya boş]
created_at: [bugünün tarihi]
updated_at: [bugünün tarihi]
```

---

#### 5.2. `user_stats` Tablosu
1. `user_stats` tablosuna tıklayın
2. ✅ **Kontrol:** Sizin `user_id` ile bir kayıt olmalı

**Beklenen Veri:**
```
user_id: [sizin-user-id]
total_points: [kazandığınız puan, örn: 150]
badges: {"stars": 0, "bronze": 0, ...}
streak_data: {"currentStreak": 1, "bestStreak": 1, ...}
game_stats: {"totalCorrect": 10, "totalWrong": 0, ...}
perfect_lessons_count: 0 veya 1
```

---

#### 5.3. `daily_tasks` Tablosu
1. `daily_tasks` tablosuna tıklayın
2. ✅ **Kontrol:** Sizin `user_id` ile bir kayıt olmalı

**Beklenen Veri:**
```
user_id: [sizin-user-id]
last_task_date: [bugünün tarihi]
tasks: [günlük görevler JSON]
today_stats: {"toplamDogru": 10, "toplamPuan": 150, ...}
```

---

#### 5.4. `weekly_tasks` Tablosu
1. `weekly_tasks` tablosuna tıklayın
2. ✅ **Kontrol:** Sizin `user_id` ile bir kayıt olmalı

**Beklenen Veri:**
```
user_id: [sizin-user-id]
week_start: [bu haftanın başlangıç tarihi]
week_end: [bu haftanın bitiş tarihi]
tasks: [haftalık görevler JSON]
week_stats: {"totalHasene": 150, "totalCorrect": 10, ...}
```

---

#### 5.5. `weekly_leaderboard` Tablosu
1. `weekly_leaderboard` tablosuna tıklayın
2. ✅ **Kontrol:** Sizin `user_id` ile bir kayıt olmalı

**Beklenen Veri:**
```
user_id: [sizin-user-id]
week_start: [bu haftanın başlangıç tarihi]
week_end: [bu haftanın bitiş tarihi]
weekly_xp: [kazandığınız puan, örn: 150]
league: "mubtedi"
position: 1 (ilk oyuncuysanız)
```

---

#### 5.6. `user_leagues` Tablosu
1. `user_leagues` tablosuna tıklayın
2. ✅ **Kontrol:** Sizin `user_id` ile bir kayıt olmalı

**Beklenen Veri:**
```
user_id: [sizin-user-id]
current_league: "mubtedi"
current_week_start: [bu haftanın başlangıç tarihi]
total_weeks_in_league: 1
best_league: "mubtedi"
total_promotions: 0
```

---

#### 5.7. `achievements` Tablosu (Opsiyonel)
1. `achievements` tablosuna tıklayın
2. ✅ **Kontrol:** Eğer başarım kazandıysanız, kayıt olabilir

**Eğer İlk 100 Puan Başarımı Kazandıysanız:**
```
user_id: [sizin-user-id]
achievement_id: "first_100_points"
unlocked_at: [kazanma tarihi]
```

---

#### 5.8. `badges` Tablosu (Opsiyonel)
1. `badges` tablosuna tıklayın
2. ✅ **Kontrol:** Eğer rozet kazandıysanız, kayıt olabilir

**Eğer Rozet Kazandıysanız:**
```
user_id: [sizin-user-id]
badge_id: [rozet-id, örn: "star_bronze"]
unlocked_at: [kazanma tarihi]
```

---

#### 5.9. `word_stats` Tablosu (Opsiyonel)
1. `word_stats` tablosuna tıklayın
2. ✅ **Kontrol:** Oynadığınız kelimeler için istatistik kayıtları olabilir

---

#### 5.10. `daily_stats` Tablosu
1. `daily_stats` tablosuna tıklayın
2. ✅ **Kontrol:** Bugünün tarihi ile bir kayıt olmalı

**Beklenen Veri:**
```
user_id: [sizin-user-id]
date: [bugünün tarihi]
stats: {"correct": 10, "wrong": 0, "points": 150, ...}
```

---

#### 5.11. `weekly_stats` Tablosu (Opsiyonel)
1. `weekly_stats` tablosuna tıklayın
2. ✅ **Kontrol:** Bu hafta için bir kayıt olabilir

---

#### 5.12. `monthly_stats` Tablosu (Opsiyonel)
1. `monthly_stats` tablosuna tıklayın
2. ✅ **Kontrol:** Bu ay için bir kayıt olabilir

---

## ✅ BAŞARI KRİTERLERİ

Test **BAŞARILI** sayılır eğer:

1. ✅ Yeni kullanıcı olarak giriş yapılabildi
2. ✅ İlk oyun oynanabildi ve puan kazanıldı
3. ✅ Leaderboard modal'ı açılabildi ve lig bilgileri görüntülendi
4. ✅ **En azından şu tablolarda veri var:**
   - ✅ `profiles` (kullanıcı profili)
   - ✅ `user_stats` (toplam puan, istatistikler)
   - ✅ `daily_tasks` (günlük görevler)
   - ✅ `weekly_tasks` (haftalık görevler)
   - ✅ `weekly_leaderboard` (leaderboard kaydı)
   - ✅ `user_leagues` (lig bilgisi)
   - ✅ `daily_stats` (günlük istatistik)

---

## 🔴 SORUN GİDERME

### Eğer Tablolarda Veri Yoksa:

1. **Tarayıcı Console'unu kontrol edin** (F12 → Console)
   - Hata mesajları var mı?
   - "Backend'e kaydedildi" mesajları görünüyor mu?

2. **Supabase Dashboard → Logs** kontrol edin
   - API hataları var mı?

3. **Network sekmesini kontrol edin** (F12 → Network)
   - Supabase API çağrıları başarılı mı? (200 OK)
   - Hangi çağrılar başarısız?

### Eğer Leaderboard Modal Açılmıyorsa:

1. **Console'da hata var mı kontrol edin**
2. **"Ligler" butonuna tıkladığınızda ne oluyor?**
3. **`js/leaderboard.js` dosyası yüklenmiş mi kontrol edin**

---

## 📝 NOTLAR

- İlk oyun oynandıktan sonra verilerin backend'e kaydedilmesi birkaç saniye sürebilir
- Eğer çok hızlı kontrol ederseniz, veriler henüz kaydedilmemiş olabilir (1-2 saniye bekleyin)
- `achievements` ve `badges` tabloları sadece başarım/rozet kazanıldığında dolar
- `word_stats` tablosu her kelime için ayrı kayıt oluşturur (çok fazla kayıt olabilir)

---

**Test sonuçlarını paylaşın!** 🚀






