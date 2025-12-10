# 🔍 SQL Test Sorguları - Adım Adım

## 1. Önce Tabloları Kontrol Edin

### A) profiles Tablosunu Kontrol Et:

```sql
SELECT * FROM profiles;
```

**Ne Görmeli:**
- Eğer boşsa → Henüz kayıt olmamışsınız veya profil oluşturulmamış
- Eğer doluysa → Kullanıcı bilgilerinizi göreceksiniz

### B) user_stats Tablosunu Kontrol Et:

```sql
SELECT * FROM user_stats;
```

**Ne Görmeli:**
- Eğer boşsa → Henüz oyun oynamamışsınız veya veriler kaydedilmemiş
- Eğer doluysa → İstatistiklerinizi göreceksiniz

## 2. Eğer Tablolar Boşsa

### Adım 1: Oyun Oynayın
1. GitHub Pages'den oyuna girin: `https://yzokumus.github.io/DENEME_HASENE`
2. Giriş yapın (üst tarafta email görünüyor mu kontrol edin)
3. Oyun oynayın (birkaç soru cevaplayın)
4. Oyun bitince birkaç saniye bekleyin

### Adım 2: Tekrar Kontrol Edin
```sql
SELECT * FROM user_stats;
```

## 3. Eğer Hala Boşsa - Manuel Kontrol

### A) Kullanıcı ID'nizi Bulun:

```sql
SELECT id, email FROM auth.users;
```

Bu sorgu ile kullanıcı ID'nizi bulun.

### B) Profil Var mı Kontrol Edin:

```sql
SELECT * FROM profiles WHERE id = 'BURAYA_USER_ID_YAZIN';
```

### C) İstatistik Var mı Kontrol Edin:

```sql
SELECT * FROM user_stats WHERE user_id = 'BURAYA_USER_ID_YAZIN';
```

## 4. Verileri Manuel Oluşturma (Gerekirse)

Eğer profil veya istatistik yoksa, manuel oluşturabilirsiniz:

### Profil Oluştur:

```sql
INSERT INTO profiles (id, username)
VALUES (
    'BURAYA_USER_ID_YAZIN',
    'kullanici_adi'
)
ON CONFLICT (id) DO NOTHING;
```

### İstatistik Oluştur:

```sql
INSERT INTO user_stats (
    user_id,
    total_points,
    badges,
    streak_data,
    game_stats,
    perfect_lessons_count
)
VALUES (
    'BURAYA_USER_ID_YAZIN',
    0,
    '{"stars":0,"bronze":0,"silver":0,"gold":0,"diamond":0}'::jsonb,
    '{"currentStreak":0,"bestStreak":0,"totalPlayDays":0}'::jsonb,
    '{"totalCorrect":0,"totalWrong":0,"gameModeCounts":{}}'::jsonb,
    0
)
ON CONFLICT (user_id) DO NOTHING;
```

## 5. Tüm Tabloları Listeleyin

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Bu sorgu ile hangi tabloların olduğunu görebilirsiniz.

## 6. Debug İçin Console Kontrolü

GitHub Pages'de oyun oynarken:
1. Console'u açın (F12)
2. Şu mesajları kontrol edin:
   - "✅ Backend'e istatistikler kaydedildi" görünüyor mu?
   - Hata mesajı var mı?

## 🎯 Hızlı Test

**En Basit Kontrol:**

```sql
-- Tüm tabloları listele
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Bu sorgu ile hangi tabloların olduğunu görebilirsiniz.

