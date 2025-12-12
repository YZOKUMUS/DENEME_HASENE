# 🕐 Timezone (Zaman Dilimi) Sorunu ve Çözümü

## 🔍 Sorun

Supabase'deki başarımların ve rozetlerin kazanıldığı tarih/saat bilgisi, telefon ve bilgisayarınızın saatinden farklı görünüyor.

### Neden?

1. **Supabase UTC kullanıyor**: Veritabanı her zaman UTC (Coordinated Universal Time) zamanını kaydeder
2. **Cihazlarınız yerel saatte**: Türkiye saati UTC+3 (kış saati UTC+3, yaz saati UTC+3)
3. **Fark**: 3 saatlik bir fark olabilir

### Örnek

- **Telefon/Bilgisayar Saati**: 19:30 (Türkiye saati)
- **Supabase'de Görünen**: 16:30 (UTC saati)
- **Fark**: 3 saat

---

## ✅ Çözüm 1: Supabase SQL Editor'da Yerel Saati Görmek

Supabase SQL Editor'da şu sorguyu kullanarak yerel saati görebilirsiniz:

```sql
SELECT 
    achievement_id,
    unlocked_at AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Istanbul' AS yerel_saat,
    unlocked_at AS utc_saat
FROM achievements
WHERE user_id = auth.uid()
ORDER BY unlocked_at DESC;
```

### Türkiye Saatini Görmek İçin:

```sql
SELECT 
    achievement_id,
    TO_CHAR(
        unlocked_at AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Istanbul',
        'DD/MM/YYYY HH24:MI:SS'
    ) AS kazanildi_turkiye_saati,
    TO_CHAR(unlocked_at, 'DD/MM/YYYY HH24:MI:SS') AS utc_saat
FROM achievements
WHERE user_id = auth.uid()
ORDER BY unlocked_at DESC;
```

---

## ✅ Çözüm 2: Frontend'de Timezone Bilgisini Eklemek

Frontend'de kaydetme sırasında yerel saati de kaydedebiliriz, ancak bu **best practice değil**. Veritabanında UTC kullanmak daha iyidir çünkü:

- Tüm zamanlar tutarlıdır
- Zaman dilimi değişikliklerinden etkilenmez
- Uluslararası kullanım için uygundur

---

## ✅ Çözüm 3: Supabase Table Editor'da Timezone Ayarları

Supabase Table Editor'da timezone ayarlarını kontrol edin:

1. **Table Editor** açın
2. Sağ üst köşede **Settings** (⚙️) butonuna tıklayın
3. **Timezone** ayarını kontrol edin
4. İsterseniz **Europe/Istanbul** seçin

**Not**: Bu ayar sadece görüntüleme için geçerlidir. Veritabanında hala UTC olarak saklanır.

---

## 📊 SQL ile Yerel Saati Görüntüleme (Örnekler)

### Başarımları Yerel Saatle Görmek

```sql
-- Başarımlar (Yerel Saat)
SELECT 
    achievement_id,
    unlocked_at AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Istanbul' AS yerel_saat,
    unlocked_at AS utc_saat
FROM achievements
WHERE user_id = auth.uid()
ORDER BY unlocked_at DESC;
```

### Rozetleri Yerel Saatle Görmek

```sql
-- Rozetler (Yerel Saat)
SELECT 
    badge_id,
    unlocked_at AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Istanbul' AS yerel_saat,
    unlocked_at AS utc_saat
FROM badges
WHERE user_id = auth.uid()
ORDER BY unlocked_at DESC;
```

### Tüm Tarihleri Yerel Saatle Görmek (View Oluşturma)

```sql
-- Başarımlar için view (Yerel Saat)
CREATE OR REPLACE VIEW achievements_local_time AS
SELECT 
    id,
    user_id,
    achievement_id,
    unlocked_at AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Istanbul' AS unlocked_at_local,
    unlocked_at AS unlocked_at_utc
FROM achievements;

-- Kullanım
SELECT * FROM achievements_local_time WHERE user_id = auth.uid();
```

---

## 🔧 Frontend'de Görüntüleme

Frontend'de (JavaScript) zamanı yerel saate dönüştürmek:

```javascript
// UTC'den yerel saate dönüştürme
const utcDate = new Date(a.unlocked_at); // Supabase'den gelen UTC zaman
const localDate = new Date(utcDate.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' }));

// veya daha basit
const localDate = new Date(a.unlocked_at); // JavaScript otomatik olarak yerel saate dönüştürür

// Formatla
const formatted = localDate.toLocaleString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
});
```

---

## 📝 Özet

1. **Veritabanında UTC kullanmak doğrudur** - Bu best practice'dir
2. **Görüntüleme sırasında yerel saate dönüştürmek** - Kullanıcı deneyimi için
3. **Supabase Table Editor'da timezone ayarı** - Sadece görüntüleme için
4. **SQL sorgularında timezone dönüşümü** - Görüntüleme için

---

## ⚠️ Önemli Notlar

- **UTC kullanmak**: Veritabanında UTC kullanmak her zaman daha iyidir
- **Yaz/Kış saati**: Türkiye yaz/kış saati uygulamasını kaldırdı, artık hep UTC+3
- **Timezone değişiklikleri**: Veritabanında UTC kullanmak, zaman dilimi değişikliklerinden etkilenmez
- **Uluslararası kullanım**: UTC kullanmak, farklı ülkelerden kullanıcılar için uygundur

---

## 🎯 Sonuç

**Sorun değil, özellik!** Veritabanında UTC kullanmak doğrudur. Görüntüleme sırasında yerel saate dönüştürmek yeterlidir.

