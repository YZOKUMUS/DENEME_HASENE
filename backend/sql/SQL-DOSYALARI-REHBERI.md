# 📋 SQL DOSYALARI REHBERİ

## 🎯 EN KAPSAMLI DOSYALAR

### 1. ⭐ **complete-setup.sql** (EN ÖNEMLİ - İLK ÇALIŞTIRILACAK)
**Ne İşe Yarar:** Tüm backend yapısını sıfırdan kurar
**İçerik:**
- ✅ Tüm tablolar (profiles, user_stats, achievements, badges, vb.)
- ✅ Tüm fonksiyonlar (get_achievement_name, get_badge_name, vb.)
- ✅ Tüm trigger'lar (updated_at otomatik güncelleme)
- ✅ Tüm view'lar (leaderboard, league_rankings)
- ✅ Tüm RLS policy'leri (güvenlik ayarları)
- ✅ Index'ler (performans optimizasyonu)
- ✅ League config verileri (lig ayarları)

**Ne Zaman Kullanılır:**
- 🆕 Yeni bir Supabase projesi kurarken
- 🔄 Tüm yapıyı sıfırdan kurmak istediğinizde
- 🛠️ Tabloları, fonksiyonları yeniden oluşturmak istediğinizde

**⚠️ DİKKAT:** Bu dosya mevcut yapıları SİLER ve yeniden oluşturur!

---

### 2. 📊 **RAPORLAR.sql** (EN KAPSAMLI RAPOR DOSYASI)
**Ne İşe Yarar:** Tüm verileri raporlar ve analiz eder
**İçerik:**
- ✅ Kullanıcı istatistikleri (user_stats)
- ✅ Günlük/Haftalık/Aylık istatistikler
- ✅ Kelime istatistikleri (word_stats)
- ✅ Başarımlar (achievements) - İSİMLERİYLE gösterir
- ✅ Rozetler (badges) - İSİMLERİYLE gösterir
- ✅ Favoriler (favorite_words)
- ✅ Tüm kullanıcıların kazanç raporu
- ✅ Özet raporlar

**Ne Zaman Kullanılır:**
- 📈 Verileri analiz etmek istediğinizde
- 👥 Tüm kullanıcıların performansını görmek istediğinizde
- 🏆 Başarımları ve rozetleri kontrol etmek istediğinizde
- 📊 Detaylı istatistik raporları almak istediğinizde

**💡 İPUCU:** İstediğiniz raporu seçip çalıştırabilirsiniz, hepsini birden çalıştırmak zorunda değilsiniz.

---

### 3. 🔍 **GENEL-KONTROL.sql** (KONTROL VE DOĞRULAMA)
**Ne İşe Yarar:** Kurulumun doğru yapılıp yapılmadığını kontrol eder
**İçerik:**
- ✅ Tabloların varlığını kontrol eder
- ✅ Fonksiyonların varlığını kontrol eder
- ✅ Trigger'ların varlığını kontrol eder
- ✅ RLS policy'lerin varlığını kontrol eder
- ✅ Index'lerin varlığını kontrol eder
- ✅ Veri sayılarını gösterir

**Ne Zaman Kullanılır:**
- ✅ Kurulum sonrası kontrol için
- 🔧 Bir şeylerin çalışıp çalışmadığını test etmek için
- 📋 Mevcut yapıyı görmek için

---

## 📁 DİĞER ÖZEL DOSYALAR

### 4. 🏆 **BENIM-BASARIMLARIM.sql**
**Ne İşe Yarar:** Giriş yapan kullanıcının başarımlarını ve rozetlerini gösterir
**İçerik:**
- ✅ Kullanıcının başarımları (isimleriyle)
- ✅ Kullanıcının rozetleri (isimleriyle)
- ✅ Mübtedi başarımı kontrolü
- ✅ Detaylı başarım listesi
- ✅ Detaylı rozet listesi

**Ne Zaman Kullanılır:**
- 👤 Kendi başarımlarınızı görmek istediğinizde
- 🔍 Belirli bir başarımı kontrol etmek istediğinizde

---

### 5. 🗑️ **SILME-ISLEMLERI.sql**
**Ne İşe Yarar:** Verileri silmek için sorgular
**İçerik:**
- ✅ Tüm verileri silme
- ✅ Belirli kullanıcının verilerini silme
- ✅ Belirli başarımı silme
- ✅ Belirli rozeti silme
- ✅ Kullanıcının tüm başarımlarını silme
- ✅ Kullanıcının tüm rozetlerini silme

**Ne Zaman Kullanılır:**
- 🧹 Test verilerini temizlemek için
- 🔄 Sıfırdan başlamak için
- ❌ Hatalı verileri silmek için

**⚠️ DİKKAT:** Bu dosya VERİLERİ SİLER! Dikkatli kullanın!

---

### 6. ⚙️ **AYARLAR.sql**
**Ne İşe Yarar:** Çeşitli ayarlar için sorgular
**İçerik:**
- ✅ Email confirmation ayarları (not: artık dashboard'dan yapılıyor)
- ✅ Kullanıcıyı manuel onaylama

**Ne Zaman Kullanılır:**
- 🔧 Özel ayarlar yapmak istediğinizde

---

## 🚀 KULLANIM SIRASI

### İlk Kurulum:
1. **complete-setup.sql** → Tüm yapıyı kur
2. **GENEL-KONTROL.sql** → Kurulumu kontrol et
3. **RAPORLAR.sql** → Verileri kontrol et

### Günlük Kullanım:
- **RAPORLAR.sql** → Verileri analiz et
- **BENIM-BASARIMLARIM.sql** → Kendi başarımlarınızı görün

### Sorun Giderme:
- **GENEL-KONTROL.sql** → Yapıyı kontrol et
- **SILME-ISLEMLERI.sql** → Hatalı verileri temizle (dikkatli!)

---

## 📊 DOSYA BOYUTLARI VE KAPSAM

| Dosya | Satır Sayısı | Kapsam | Öncelik |
|-------|--------------|--------|---------|
| **complete-setup.sql** | ~800 | ⭐⭐⭐⭐⭐ Tam kurulum | 🔴 YÜKSEK |
| **RAPORLAR.sql** | ~719 | ⭐⭐⭐⭐⭐ Tüm raporlar | 🟡 ORTA |
| **BENIM-BASARIMLARIM.sql** | ~300 | ⭐⭐⭐ Kullanıcı başarımları | 🟢 DÜŞÜK |
| **GENEL-KONTROL.sql** | ~233 | ⭐⭐⭐ Kontrol sorguları | 🟡 ORTA |
| **SILME-ISLEMLERI.sql** | ~122 | ⭐⭐ Silme işlemleri | 🟢 DÜŞÜK |
| **AYARLAR.sql** | ~43 | ⭐ Ayarlar | 🟢 DÜŞÜK |

---

## 💡 ÖNERİLER

1. **İlk kurulumda:** Sadece `complete-setup.sql` yeterli
2. **Raporlama için:** `RAPORLAR.sql` en kapsamlı
3. **Kontrol için:** `GENEL-KONTROL.sql` kullanın
4. **Kendi verileriniz için:** `BENIM-BASARIMLARIM.sql` kullanın

---

## ⚠️ ÖNEMLİ NOTLAR

- `complete-setup.sql` mevcut yapıları SİLER! Dikkatli kullanın!
- `SILME-ISLEMLERI.sql` VERİLERİ SİLER! Yedek alın!
- RLS (Row Level Security) nedeniyle bazı sorgular sadece kendi verilerinizi gösterir
- Service role key ile çalıştırırsanız tüm verileri görebilirsiniz

