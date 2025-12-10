# 🔍 Tablo Boş - Çözüm Adımları

## Sorun
Console'da "✅ Backend'e istatistikler kaydedildi" görünüyor ama tablo boş.

## Olası Nedenler

### 1. Kullanıcı ID'si Eşleşmiyor
- Veriler kaydediliyor ama farklı bir kullanıcı ID'si ile
- Profil tablosunda kullanıcı yok olabilir

### 2. RLS (Row Level Security) Politikaları
- Veriler kaydediliyor ama görünmüyor
- RLS politikaları verileri gizliyor olabilir

### 3. Yanlış Tablo
- Veriler başka bir tabloda olabilir

## Çözüm Adımları

### Adım 1: Kullanıcı ID'nizi Bulun

SQL Editor'de şu sorguyu çalıştırın:

```sql
SELECT id, email FROM auth.users;
```

Bu sorgu ile kullanıcı ID'nizi bulun.

### Adım 2: Profil Var mı Kontrol Edin

```sql
SELECT * FROM profiles WHERE id = 'BURAYA_USER_ID_YAZIN';
```

Eğer boşsa, profil oluşturulmamış demektir.

### Adım 3: İstatistik Var mı Kontrol Edin

```sql
SELECT * FROM user_stats WHERE user_id = 'BURAYA_USER_ID_YAZIN';
```

### Adım 4: Tüm Verileri Görün

```sql
SELECT 
    u.id as user_id,
    u.email,
    p.username,
    us.total_points,
    us.game_stats,
    us.updated_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_stats us ON u.id = us.user_id
ORDER BY us.updated_at DESC;
```

Bu sorgu tüm kullanıcıları ve verilerini gösterir.

### Adım 5: RLS Politikalarını Kontrol Edin

Eğer hala boşsa, RLS politikalarını kontrol edin:

```sql
SELECT * FROM pg_policies WHERE tablename = 'user_stats';
```

## 🎯 Hızlı Test

**En Basit Kontrol:**

```sql
-- Tüm tabloları listele
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Bu sorgu ile hangi tabloların olduğunu görebilirsiniz.

## 🔧 Manuel Profil Oluşturma (Gerekirse)

Eğer profil yoksa, manuel oluşturabilirsiniz:

```sql
-- Kullanıcı ID'nizi bulun
SELECT id, email FROM auth.users;

-- Profil oluşturun (USER_ID'yi değiştirin)
INSERT INTO profiles (id, username)
VALUES (
    'USER_ID_BURAYA',
    'kullanici_adi'
)
ON CONFLICT (id) DO NOTHING;

-- İstatistik oluşturun
INSERT INTO user_stats (
    user_id,
    total_points,
    badges,
    streak_data,
    game_stats,
    perfect_lessons_count
)
VALUES (
    'USER_ID_BURAYA',
    0,
    '{"stars":0,"bronze":0,"silver":0,"gold":0,"diamond":0}'::jsonb,
    '{"currentStreak":0,"bestStreak":0,"totalPlayDays":0}'::jsonb,
    '{"totalCorrect":0,"totalWrong":0,"gameModeCounts":{}}'::jsonb,
    0
)
ON CONFLICT (user_id) DO NOTHING;
```

