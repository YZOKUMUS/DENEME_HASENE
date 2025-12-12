# SQL DOSYALARI KULLANIM REHBERİ

## 📁 DOSYA YAPISI

```
backend/
└── sql/
    ├── complete-setup.sql      ⭐ ANA KURULUM (İlk kurulumda çalıştır)
    ├── GENEL-KONTROL.sql       📋 Tüm kontroller (Günlük kullanım)
    ├── RAPORLAR.sql            📊 Tüm raporlar (İhtiyaç halinde)
    ├── SILME-ISLEMLERI.sql     🗑️ Silme işlemleri (Dikkatli kullan!)
    └── AYARLAR.sql             ⚙️ Ayarlar (Gerektiğinde)
```

---

## 🚀 İLK KURULUM

### 1. Adım: Backend Kurulumu
```sql
-- Supabase SQL Editor'de çalıştır:
sql/complete-setup.sql
```
**Ne yapar?**
- Tüm tabloları oluşturur
- RLS policy'lerini kurar
- Trigger'ları ve fonksiyonları ekler
- League config verilerini yükler

**Ne zaman çalıştırılır?**
- İlk kurulumda
- Sıfırdan başlarken
- Backend yapısını yeniden kurmak istediğinizde

---

## 📋 GÜNLÜ KULLANIM

### Kontrol Etmek İçin:
```sql
-- Supabase SQL Editor'de çalıştır:
sql/GENEL-KONTROL.sql
```

**İçeriği:**
1. Tabloları kontrol et
2. RLS policy'lerini kontrol et
3. User stats kontrolü
4. Achievements kontrolü
5. Kullanıcılar kontrolü

**Ne zaman kullanılır?**
- Backend'in doğru çalışıp çalışmadığını kontrol etmek için
- Sorun giderme için
- Veri kontrolü için

---

## 📊 RAPORLAR

### Rapor Görmek İçin:
```sql
-- Supabase SQL Editor'de çalıştır:
sql/RAPORLAR.sql
```

**İçeriği:**
1. Test verilerini kontrol et (Bugünkü, haftalık, aylık istatistikler)
2. Kullanıcıların kazanç raporu (Tüm kullanıcıların detaylı bilgileri)

**Ne zaman kullanılır?**
- Kullanıcı istatistiklerini görmek için
- Test sonuçlarını kontrol etmek için
- Kazanç raporları için

---

## 🗑️ SİLME İŞLEMLERİ

### ⚠️ DİKKAT: Bu dosya VERİLERİ SİLER!

```sql
-- Supabase SQL Editor'de çalıştır:
sql/SILME-ISLEMLERI.sql
```

**İçeriği:**
1. Tüm verileri sil (Tabloları korur)
2. Tüm kullanıcıları sil (Çok dikkatli!)
3. Belirli bir kullanıcının verilerini sil

**Ne zaman kullanılır?**
- Test verilerini temizlemek için
- Sıfırdan başlamak için
- Belirli bir kullanıcının verilerini silmek için

**⚠️ UYARI:** Silme işlemleri geri alınamaz!

---

## ⚙️ AYARLAR

### Ayarlar İçin:
```sql
-- Supabase SQL Editor'de çalıştır:
sql/AYARLAR.sql
```

**İçeriği:**
1. Email confirmation kapatma (Dashboard'dan yapılır)
2. Kullanıcıyı manuel onaylama

**Ne zaman kullanılır?**
- Email onayını kapatmak için (Dashboard'dan)
- Kullanıcıyı manuel onaylamak için

---

## 📝 HIZLI REFERANS

| İhtiyaç | Dosya | Açıklama |
|---------|-------|----------|
| İlk kurulum | `sql/complete-setup.sql` | Backend yapısını kurar |
| Kontrol | `sql/GENEL-KONTROL.sql` | Her şeyi kontrol eder |
| Rapor | `sql/RAPORLAR.sql` | İstatistikleri gösterir |
| Temizleme | `sql/SILME-ISLEMLERI.sql` | Verileri siler ⚠️ |
| Ayarlar | `sql/AYARLAR.sql` | Ayarları yapar |

---

## ✅ ÖNERİLER

1. **İlk kurulum:** Sadece `sql/complete-setup.sql` çalıştır
2. **Günlük kontrol:** `sql/GENEL-KONTROL.sql` kullan
3. **Rapor ihtiyacı:** `sql/RAPORLAR.sql` kullan
4. **Silme işlemleri:** Çok dikkatli kullan, yedek al
5. **Ayarlar:** Gerektiğinde kullan

---

## 🔄 GÜNCELLEME

Eğer yeni bir SQL sorgusu eklemek isterseniz:
- Kontrol sorgusu → `sql/GENEL-KONTROL.sql`
- Rapor sorgusu → `sql/RAPORLAR.sql`
- Silme sorgusu → `sql/SILME-ISLEMLERI.sql`
- Ayar sorgusu → `sql/AYARLAR.sql`

---

## ❓ SORUN GİDERME

**Sorun:** Tablolar görünmüyor
**Çözüm:** `sql/complete-setup.sql` çalıştır

**Sorun:** RLS hatası alıyorum
**Çözüm:** `sql/GENEL-KONTROL.sql` ile RLS policy'lerini kontrol et

**Sorun:** Veriler görünmüyor
**Çözüm:** `sql/RAPORLAR.sql` ile verileri kontrol et
