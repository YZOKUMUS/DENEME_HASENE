# 📊 Backend'de Verileri Görme - Adım Adım Rehber

## 1. Supabase Dashboard'a Giriş

1. [Supabase Dashboard](https://app.supabase.com/) adresine gidin
2. Giriş yapın (email/şifre ile)
3. **DENEME_HASENE** projenizi seçin

## 2. Table Editor'a Git

### Yöntem 1: Sol Menüden
1. Sol menüde **"Table Editor"** (📊) ikonuna tıklayın
2. Veya sol menüde **"Tables"** yazısına tıklayın

### Yöntem 2: Üst Menüden
1. Üst menüde **"Table Editor"** sekmesine tıklayın

## 3. user_stats Tablosunu Bul

1. Sol tarafta tablo listesi görünecek
2. **"user_stats"** tablosuna tıklayın
3. Tablo açılacak ve veriler görünecek

## 4. Verilerinizi Bulun

### Kullanıcınızı Bulmak İçin:

**Yöntem 1: user_id ile**
1. Üst tarafta **"Filter"** butonuna tıklayın
2. **"user_id"** sütununu seçin
3. Email adresinizin user_id'sini girin
4. Enter'a basın

**Yöntem 2: Manuel Arama**
1. Tabloda kaydırın
2. `total_points` sütununa bakın
3. Oyun oynadıktan sonra puanınızı göreceksiniz

**Yöntem 3: SQL Editor ile (Daha Kolay)**
1. Sol menüden **"SQL Editor"** (📝) ikonuna tıklayın
2. Yeni sorgu açın (+ butonuna tıklayın)
3. Şu SQL'i yapıştırın:

```sql
SELECT 
    p.username,
    p.email,
    us.total_points,
    us.game_stats,
    us.updated_at
FROM profiles p
JOIN user_stats us ON p.id = us.user_id
ORDER BY us.updated_at DESC;
```

4. **Run** butonuna tıklayın (veya F5)
5. Tüm kullanıcıların verilerini göreceksiniz!

## 5. Verileri Kontrol Edin

### Göreceğiniz Sütunlar:

- **user_id**: Kullanıcı ID'si (UUID)
- **total_points**: Toplam Hasene puanı (oyun oynadıkça artar)
- **badges**: Rozet bilgileri (JSON formatında)
- **streak_data**: Seri bilgileri (JSON formatında)
- **game_stats**: Oyun istatistikleri (JSON formatında)
  - `totalCorrect`: Toplam doğru cevap sayısı
  - `totalWrong`: Toplam yanlış cevap sayısı
  - `gameModeCounts`: Her oyun modunda kaç kez oynandığı
- **perfect_lessons_count**: Mükemmel ders sayısı
- **updated_at**: Son güncelleme zamanı

## 6. Oyun Oynadıktan Sonra Kontrol

1. Oyun oynayın (birkaç soru cevaplayın)
2. Oyun bitince birkaç saniye bekleyin (veriler otomatik kaydedilir)
3. Supabase Dashboard'a geri dönün
4. **Table Editor** → **user_stats** tablosuna gidin
5. **Refresh** butonuna tıklayın (veya F5)
6. `total_points` ve `updated_at` sütunlarını kontrol edin
7. Değerler güncellenmiş olmalı! ✅

## 7. JSON Verilerini Okuma

`game_stats`, `badges`, `streak_data` sütunları JSON formatında. Okumak için:

1. Satıra tıklayın
2. JSON sütununa tıklayın
3. Açılan pencerede JSON formatında görünecek
4. Veya SQL Editor'de şu sorguyu kullanın:

```sql
SELECT 
    p.username,
    us.total_points,
    us.game_stats->>'totalCorrect' as dogru_sayisi,
    us.game_stats->>'totalWrong' as yanlis_sayisi,
    us.updated_at
FROM profiles p
JOIN user_stats us ON p.id = us.user_id
WHERE p.email = 'sizin-email@adresiniz.com';
```

## 🎯 Hızlı Kontrol

**En Hızlı Yol:**
1. Supabase Dashboard → **SQL Editor**
2. Şu sorguyu çalıştırın:

```sql
SELECT * FROM user_stats ORDER BY updated_at DESC LIMIT 5;
```

3. En son güncellenen 5 kullanıcıyı göreceksiniz!

## ⚠️ Sorun Giderme

### Veriler görünmüyorsa:
1. **Refresh** butonuna tıklayın
2. Oyun oynadıktan sonra birkaç saniye bekleyin
3. Console'u kontrol edin (F12) - hata var mı?

### Tablo boşsa:
1. İlk kez oyun oynuyorsanız, önce oyun oynayın
2. Oyun bitince veriler otomatik kaydedilir
3. Birkaç saniye sonra tabloda görünecek

## 📸 Görsel Rehber

1. **Sol Menü** → **Table Editor** (📊 ikonu)
2. **Sol Tarafta Tablo Listesi** → **user_stats**'a tıklayın
3. **Tabloda Verileriniz** → Satırları görün
4. **Refresh** → Yeni verileri görmek için

