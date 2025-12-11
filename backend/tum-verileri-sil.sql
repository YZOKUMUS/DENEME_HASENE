-- ============================================
-- TÜM VERİLERİ SİL (Tabloları Korur)
-- ============================================
-- DİKKAT: Bu script TÜM OYUN VERİLERİNİ SİLER!
-- Tablolar, fonksiyonlar, trigger'lar ve policy'ler korunur
-- Sadece veriler silinir
-- ============================================

-- Tüm oyun verilerini sil
DELETE FROM daily_stats;
DELETE FROM weekly_stats;
DELETE FROM monthly_stats;
DELETE FROM word_stats;
DELETE FROM favorite_words;
DELETE FROM achievements;
DELETE FROM badges;
DELETE FROM daily_tasks;
DELETE FROM weekly_tasks;
DELETE FROM weekly_leaderboard;
DELETE FROM user_leagues;

-- User stats'ı sıfırla (kullanıcıları silme, sadece istatistikleri sıfırla)
-- Tüm user_stats kayıtlarını sil (yeniden oyun oynandığında otomatik oluşacak)
DELETE FROM user_stats;

-- Profiles tablosundaki updated_at'i de sıfırla (Son Güncelleme için)
UPDATE profiles 
SET updated_at = created_at
WHERE updated_at IS NOT NULL;

-- Profiles tablosunu temizle (username'leri koru, sadece oyun verilerini sıfırla)
-- Not: Profiles tablosu sadece username içeriyor, oyun verisi yok
-- Bu yüzden burada bir şey yapmaya gerek yok

-- ============================================
-- SONUÇ
-- ============================================
SELECT 
    'Tum veriler silindi!' as sonuc,
    'Tablolar, fonksiyonlar, triggerlar ve policyler korundu' as aciklama,
    'Yeni oyun oynayarak sifirdan baslayabilirsiniz' as not;
