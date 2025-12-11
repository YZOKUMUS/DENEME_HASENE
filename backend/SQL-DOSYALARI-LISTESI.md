# 📋 SQL Dosyaları Listesi

## 🎯 Ana Kurulum Dosyaları

### 1. `complete-setup.sql` ⭐ **EN ÖNEMLİ**
- **Açıklama**: Tüm backend yapısını tek seferde kurar
- **İçerik**: 
  - Tüm tablolar (14 tablo)
  - Tüm fonksiyonlar
  - Tüm trigger'lar
  - Tüm view'lar
  - Tüm RLS policy'leri
  - League config verileri
- **Ne zaman kullanılır**: İlk kurulum veya tam sıfırlama
- **Dikkat**: Tüm mevcut yapıları siler ve yeniden oluşturur

---

## 🗑️ Veri Silme Dosyaları

### 2. `tum-verileri-sil.sql` ⭐ **ÖNERİLEN**
- **Açıklama**: Tüm oyun verilerini siler, tabloları korur
- **İçerik**:
  - Tüm oyun verilerini siler (daily_stats, weekly_stats, monthly_stats, word_stats, vb.)
  - `user_stats` kayıtlarını siler
  - `profiles.updated_at`'i sıfırlar
- **Ne zaman kullanılır**: Verileri temizlemek için (tablolar korunur)
- **Dikkat**: Sadece veriler silinir, yapı korunur

### 3. `reset-all-data.sql`
- **Açıklama**: Leaderboard verilerini sıfırlar
- **İçerik**: Leaderboard tablolarını siler ve yeniden oluşturur
- **Ne zaman kullanılır**: Sadece leaderboard'u sıfırlamak için

### 4. `delete-all-users.sql`
- **Açıklama**: Tüm kullanıcıları siler
- **Dikkat**: Çok tehlikeli! Tüm kullanıcı verilerini siler

---

## 🔧 Düzeltme ve Kontrol Dosyaları

### 5. `fix-stats-policies.sql` ⭐
- **Açıklama**: Stats tabloları için RLS policy'lerini düzeltir
- **İçerik**: daily_stats, weekly_stats, monthly_stats için RLS policy'leri
- **Ne zaman kullanılır**: 406 (Not Acceptable) hatası alındığında

### 6. `gecmis-saat-duzeltme.sql`
- **Açıklama**: Geçmiş oyun saatlerini düzeltir (UTC → yerel saat)
- **İçerik**: Tüm timestamp alanlarına +3 saat ekler
- **Ne zaman kullanılır**: Geçmiş verilerin saatlerini düzeltmek için

### 7. `fix-trigger-error.sql`
- **Açıklama**: Trigger hatalarını düzeltir
- **Ne zaman kullanılır**: Trigger hataları olduğunda

---

## 📊 Rapor ve Kontrol Dosyaları

### 8. `kullanicilar-kazanc-raporu.sql` ⭐ **DETAYLI RAPOR**
- **Açıklama**: Tüm kullanıcıların kazanç ve aktivite raporu
- **İçerik**: ~85 alanlı detaylı rapor
- **Ne zaman kullanılır**: Kullanıcı istatistiklerini görmek için

### 9. `kullanicilar-kontrol.sql`
- **Açıklama**: Kullanıcı sayısını ve temel bilgileri kontrol eder
- **İçerik**: Kullanıcı sayıları ve temel bilgiler

### 10. `kullanicilari-gor.sql`
- **Açıklama**: Kullanıcıları listeler
- **İçerik**: Email, kayıt tarihi, email onay durumu

### 11. `user-stats-kontrol.sql`
- **Açıklama**: user_stats tablosunu kontrol eder
- **İçerik**: user_stats kayıt sayısı ve detayları

### 12. `veri-kontrol-hizli.sql`
- **Açıklama**: Hızlı veri kontrolü
- **İçerik**: Temel veri kontrol sorguları

### 13. `TABLOLARI_KONTROL_ET.sql`
- **Açıklama**: Tüm tabloları kontrol eder
- **İçerik**: Tablo yapılarını gösterir

---

## 🔐 Güvenlik ve Ayarlar

### 14. `manual-confirm-user.sql`
- **Açıklama**: Kullanıcıyı manuel onaylar
- **Ne zaman kullanılır**: Email onayı olmadan kullanıcı aktif etmek için

### 15. `disable-email-confirmation.sql`
- **Açıklama**: Email onayını devre dışı bırakır
- **Ne zaman kullanılır**: Email onayı gerektirmemek için

---

## 📦 Eski/Kullanılmayan Dosyalar (Opsiyonel)

### 16. `supabase-setup.sql`
- **Durum**: `complete-setup.sql` içinde birleştirildi
- **Not**: Artık `complete-setup.sql` kullanılmalı

### 17. `leaderboard-setup.sql`
- **Durum**: `complete-setup.sql` içinde birleştirildi
- **Not**: Artık `complete-setup.sql` kullanılmalı

---

## 📝 Özet

### ⭐ En Çok Kullanılan Dosyalar:
1. **`complete-setup.sql`** - Tam kurulum
2. **`tum-verileri-sil.sql`** - Veri temizleme
3. **`fix-stats-policies.sql`** - RLS düzeltme
4. **`kullanicilar-kazanc-raporu.sql`** - Detaylı rapor

### 🔄 Sıralama:
1. İlk kurulum → `complete-setup.sql`
2. Veri temizleme → `tum-verileri-sil.sql`
3. RLS hatası → `fix-stats-policies.sql`
4. Rapor görüntüleme → `kullanicilar-kazanc-raporu.sql`
