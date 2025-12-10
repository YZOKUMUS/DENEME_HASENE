# 📊 Supabase'de Başarımları Görme Rehberi

## 📋 Tablo: `achievements`

Başarımlar **`achievements`** tablosunda saklanıyor.

### Tablo Yapısı

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID | Kayıt ID'si (otomatik) |
| `user_id` | UUID | Kullanıcı ID'si (auth.users'a referans) |
| `achievement_id` | TEXT | Başarım ID'si |
| `unlocked_at` | TIMESTAMP | Kazanıldığı tarih/saat |

---

## 🔍 Supabase'de Görme Adımları

### 1. Supabase Dashboard'a Giriş
1. [Supabase Dashboard](https://app.supabase.com) açın
2. Projenizi seçin

### 2. Table Editor'a Gitme
1. Sol menüden **`Table Editor`** seçin
2. **`achievements`** tablosuna tıklayın

### 3. Başarımları Görme

#### Yöntem 1: Tüm Başarımları Görmek
- Tablo otomatik olarak açılır
- Tüm kullanıcıların başarımları görünür (RLS politikası sayesinde sadece kendi verilerinizi görebilirsiniz)

#### Yöntem 2: Sadece Kendi Başarımlarınızı Filtrelemek
1. **Filter** butonuna tıklayın
2. **`user_id`** kolonunu seçin
3. **`is`** operatörünü seçin
4. Kendi `user_id`'nizi girin (auth.users tablosundan bulabilirsiniz)

---

## 🎯 Kazandığınız Başarımlar

### 1. **İlk Kelime** (`first_victory`)
- **Açıklama**: İlk sahih cevap - "Bismillah" ile başla
- **Koşul**: `totalCorrect >= 1`

### 2. **Mübtedi** (`level_1`)
- **Açıklama**: Mertebe 1 - İlim yolunda ilk adım
- **Koşul**: `level >= 1`

---

## 📝 SQL ile Kontrol Etme

### Tüm Başarımlarınızı Görmek
```sql
SELECT 
    achievement_id,
    unlocked_at
FROM achievements
WHERE user_id = auth.uid()
ORDER BY unlocked_at ASC;
```

### Belirli Bir Başarımı Kontrol Etmek
```sql
SELECT *
FROM achievements
WHERE user_id = auth.uid()
  AND achievement_id = 'first_victory';  -- veya 'level_1'
```

### Başarımları Tarih/Saat ile Görmek
```sql
SELECT 
    achievement_id,
    unlocked_at,
    TO_CHAR(unlocked_at, 'DD/MM/YYYY HH24:MI:SS') AS kazanildi
FROM achievements
WHERE user_id = auth.uid()
ORDER BY unlocked_at DESC;
```

---

## 🔗 Başarım ID'leri (Tüm Liste)

### İlk Adımlar
- `first_victory` → 🕌 İlk Kelime
- `bismillah` → بِسْمِ اللَّهِ (10 doğru cevap)
- `combo_master` → 🕌 Muvazebet Ustası (5x combo)
- `first_step` → 🌱 İlk Adım (100 Hasene)
- `level_1` → 📖 Mübtedi (Mertebe 1)
- `perfect_lesson_1` → ✨ Mükemmel Ders

### Başlangıç
- `alhamdulillah` → الْحَمْدُ لِلَّهِ (50 doğru)
- `combo_10` → 🕋 On Muvazebet
- `bronze_traveler` → 📿 Mübtedi Talebe (500 Hasene)
- `streak_3` → 📿 Üç Gün Vird
- `daily_hero` → 📿 Günlük Vird
- `mashallah` → مَا شَاءَ اللَّهُ (100 doğru)
- `fast_student` → 🕌 Hızlı Talebe (1,000 Hasene)
- ... ve daha fazlası

---

## ⚠️ Notlar

1. **RLS (Row Level Security)**: Sadece kendi başarımlarınızı görebilirsiniz. Başka kullanıcıların başarımlarını göremezsiniz.

2. **Duplicate Kontrolü**: Her başarım bir kullanıcı için sadece bir kez kaydedilir (`UNIQUE(user_id, achievement_id)`).

3. **Otomatik Zaman Damgası**: `unlocked_at` otomatik olarak başarım kazanıldığında `NOW()` ile set edilir.

4. **Backend-Frontend Senkronizasyonu**: 
   - Başarım kazanıldığında önce backend'e kaydedilir
   - Backend kayıt başarısız olursa localStorage'a yazılır
   - Sayfa yenilendiğinde backend'den yüklenir

---

## 🐛 Sorun Giderme

### Başarımlar Görünmüyor
1. **Giriş Kontrolü**: Önce giriş yaptığınızdan emin olun
2. **RLS Politikaları**: `achievements` tablosunda RLS politikalarının aktif olduğunu kontrol edin
3. **SQL Editor**: SQL Editor'de yukarıdaki sorguyu çalıştırarak verilerin var olup olmadığını kontrol edin

### Başarım Kazanıldı Ama Tabloda Yok
1. **Console Logları**: Tarayıcı konsolunda `saveAchievement` hataları olup olmadığını kontrol edin
2. **Network Tab**: Supabase API isteklerinin başarılı olup olmadığını kontrol edin
3. **LocalStorage**: `unlockedAchievements` localStorage'da olabilir, backend'e senkronize edilmemiş olabilir

---

## 📊 Örnek Görüntü

```
achievements Tablosu:
┌─────────────────────────────────────┬─────────────────────┬──────────────────────┬─────────────────────────┐
│ id                                  │ user_id             │ achievement_id       │ unlocked_at             │
├─────────────────────────────────────┼─────────────────────┼──────────────────────┼─────────────────────────┤
│ a1b2c3d4-e5f6-7890-abcd-ef1234567890│ 4a4ef4d9-...        │ first_victory        │ 2025-12-10 16:30:00+00 │
│ b2c3d4e5-f6a7-8901-bcde-f12345678901│ 4a4ef4d9-...        │ level_1              │ 2025-12-10 16:45:00+00 │
└─────────────────────────────────────┴─────────────────────┴──────────────────────┴─────────────────────────┘
```

---

✅ **Artık başarımlarınızı Supabase'de görebilirsiniz!**

