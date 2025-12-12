# 📋 Vazifeler Panelindeki Rakamlar Supabase'de Nasıl Görülür?

## ✅ Evet, Vazifeler Panelindeki Rakamlar Supabase'de Var!

Vazifeler panelindeki tüm rakamlar Supabase'de saklanıyor. İşte detaylar:

---

## 📊 Supabase Tabloları

### 1. Günlük Vazifeler (`daily_tasks`)

**Tablo**: `daily_tasks`

**Kolonlar**:
- `user_id` - Kullanıcı ID
- `last_task_date` - Son görev tarihi
- `tasks` - Görevler listesi (JSONB)
- `bonus_tasks` - Fazilet vazifeleri (JSONB)
- `completed_tasks` - Tamamlanan görevler (JSONB)
- **`today_stats`** - **Vazifeler panelindeki rakamlar burada!** (JSONB)

**`today_stats` İçeriği**:
```json
{
  "toplamDogru": 25,
  "toplamPuan": 1500,
  "comboCount": 5,
  "allGameModes": ["kelime-cevir", "dinle-bul"],
  "farklıZorluk": ["easy", "medium"],
  "perfectStreak": 2,
  "accuracy": 85,
  "reviewWords": [],
  "streakMaintain": 1,
  "totalPlayTime": 3600,
  "ayetOku": 3,
  "duaEt": 2,
  "hadisOku": 1
}
```

### 2. Haftalık Vazifeler (`weekly_tasks`)

**Tablo**: `weekly_tasks`

**Kolonlar**:
- `user_id` - Kullanıcı ID
- `last_week_start` - Son hafta başlangıcı
- `week_start` - Hafta başlangıcı
- `week_end` - Hafta sonu
- `tasks` - Görevler listesi (JSONB)
- `completed_tasks` - Tamamlanan görevler (JSONB)
- **`week_stats`** - **Vazifeler panelindeki rakamlar burada!** (JSONB)

**`week_stats` İçeriği**:
```json
{
  "totalHasene": 5000,
  "totalCorrect": 100,
  "totalWrong": 20,
  "daysPlayed": 5,
  "streakDays": 3,
  "allModesPlayed": ["kelime-cevir", "dinle-bul", "bosluk-doldur"],
  "comboCount": 15
}
```

---

## 🔍 Supabase'de Nasıl Görülür?

### Yöntem 1: Table Editor

1. **Supabase Dashboard** → **Table Editor**
2. **`daily_tasks`** tablosunu açın
3. Kullanıcınızın satırını bulun
4. **`today_stats`** kolonuna tıklayın
5. JSON içeriği görünecek

**Örnek**:
```
today_stats: {
  "toplamDogru": 25,
  "toplamPuan": 1500,
  "comboCount": 5,
  ...
}
```

### Yöntem 2: SQL Editor

```sql
-- Günlük vazifeler ve rakamları
SELECT 
    user_id,
    last_task_date,
    today_stats->>'toplamDogru' as toplam_dogru,
    today_stats->>'toplamPuan' as toplam_puan,
    today_stats->>'comboCount' as combo_count,
    today_stats->>'ayetOku' as ayet_oku,
    today_stats->>'duaEt' as dua_et,
    today_stats->>'hadisOku' as hadis_oku
FROM daily_tasks
WHERE user_id = 'KULLANICI_ID_BURAYA';

-- Haftalık vazifeler ve rakamları
SELECT 
    user_id,
    week_start,
    week_end,
    week_stats->>'totalHasene' as total_hasene,
    week_stats->>'totalCorrect' as total_correct,
    week_stats->>'totalWrong' as total_wrong,
    week_stats->>'daysPlayed' as days_played,
    week_stats->>'comboCount' as combo_count
FROM weekly_tasks
WHERE user_id = 'KULLANICI_ID_BURAYA';
```

---

## 📋 Vazifeler Panelindeki Rakamlar

### Günlük Vazifeler Paneli

| Panelde Görünen | Supabase Kolonu | Açıklama |
|----------------|-----------------|----------|
| Toplam Doğru | `today_stats.toplamDogru` | Bugünkü toplam doğru cevap |
| Toplam Puan | `today_stats.toplamPuan` | Bugünkü toplam Hasene |
| Combo | `today_stats.comboCount` | En yüksek combo sayısı |
| Ayet Oku | `today_stats.ayetOku` | Bugün okunan ayet sayısı |
| Dua Et | `today_stats.duaEt` | Bugün edilen dua sayısı |
| Hadis Oku | `today_stats.hadisOku` | Bugün okunan hadis sayısı |

### Haftalık Vazifeler Paneli

| Panelde Görünen | Supabase Kolonu | Açıklama |
|----------------|-----------------|----------|
| Toplam Hasene | `week_stats.totalHasene` | Haftalık toplam Hasene |
| Toplam Doğru | `week_stats.totalCorrect` | Haftalık toplam doğru |
| Toplam Yanlış | `week_stats.totalWrong` | Haftalık toplam yanlış |
| Oynanan Gün | `week_stats.daysPlayed` | Haftada oynanan gün sayısı |
| Combo | `week_stats.comboCount` | Haftalık en yüksek combo |

---

## ✅ Senkronizasyon

Vazifeler panelindeki rakamlar:

1. **Oyun oynandığında** → `updateTaskProgress()` → `saveStats()` → `saveDailyTasks()` / `saveWeeklyTasks()` → **Supabase'e kaydediliyor** ✅

2. **Sayfa yüklendiğinde** → `loadStats()` → `loadDailyTasks()` / `loadWeeklyTasks()` → **Supabase'den yükleniyor** ✅

3. **LocalStorage'a da yazılıyor** → Offline destek için ✅

---

## 🔧 Sorun Giderme

### Rakamlar Supabase'de Görünmüyorsa:

1. **Kullanıcı giriş yapmış mı?**
   - `saveDailyTasks` ve `saveWeeklyTasks` sadece giriş yapmış kullanıcılar için çalışır

2. **Oyun oynandı mı?**
   - Rakamlar oyun oynandığında güncellenir
   - `saveStats()` oyun bitişinde çağrılır

3. **Console'da hata var mı?**
   - F12 → Console → `saveDailyTasks` veya `saveWeeklyTasks` hatalarını kontrol edin

4. **Supabase'de doğru tabloyu kontrol ediyor musunuz?**
   - `daily_tasks` tablosu → `today_stats` kolonu
   - `weekly_tasks` tablosu → `week_stats` kolonu

---

## 📝 Özet

**Vazifeler panelindeki tüm rakamlar Supabase'de var!**

- ✅ Günlük rakamlar → `daily_tasks.today_stats` (JSONB)
- ✅ Haftalık rakamlar → `weekly_tasks.week_stats` (JSONB)
- ✅ Otomatik senkronizasyon çalışıyor
- ✅ Oyun oynandığında güncelleniyor

**Supabase Table Editor'da `today_stats` ve `week_stats` kolonlarına tıklayarak JSON içeriğini görebilirsiniz!**

