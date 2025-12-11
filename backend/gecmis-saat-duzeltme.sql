-- ============================================
-- GEÇMİŞ OYUN SAATLERİNİ DÜZELTME
-- ============================================
-- Bu script, geçmiş oyunlarda UTC olarak saklanmış
-- updated_at değerlerini yerel saat dilimine (Türkiye: +03:00) göre düzeltir
-- 
-- ÖNEMLİ: Bu script'i çalıştırmadan önce yedek alın!
-- ============================================

-- Türkiye saat dilimi: UTC+3
-- Eğer farklı bir saat dilimi kullanıyorsanız, aşağıdaki +3 değerini değiştirin

-- ============================================
-- 1. USER_STATS TABLOSU
-- ============================================
-- updated_at değerlerini UTC'den yerel saate çevir (+3 saat ekle)
UPDATE user_stats
SET updated_at = updated_at + INTERVAL '3 hours'
WHERE updated_at IS NOT NULL;

-- ============================================
-- 2. DAILY_TASKS TABLOSU
-- ============================================
UPDATE daily_tasks
SET updated_at = updated_at + INTERVAL '3 hours'
WHERE updated_at IS NOT NULL;

-- ============================================
-- 3. WEEKLY_TASKS TABLOSU
-- ============================================
UPDATE weekly_tasks
SET updated_at = updated_at + INTERVAL '3 hours'
WHERE updated_at IS NOT NULL;

-- ============================================
-- 4. WORD_STATS TABLOSU
-- ============================================
UPDATE word_stats
SET updated_at = updated_at + INTERVAL '3 hours'
WHERE updated_at IS NOT NULL;

-- ============================================
-- 5. DAILY_STATS TABLOSU
-- ============================================
UPDATE daily_stats
SET updated_at = updated_at + INTERVAL '3 hours'
WHERE updated_at IS NOT NULL;

-- ============================================
-- 6. WEEKLY_LEADERBOARD TABLOSU
-- ============================================
UPDATE weekly_leaderboard
SET updated_at = updated_at + INTERVAL '3 hours'
WHERE updated_at IS NOT NULL;

-- ============================================
-- 7. BADGES TABLOSU
-- ============================================
-- unlocked_at değerlerini düzelt
UPDATE badges
SET unlocked_at = unlocked_at + INTERVAL '3 hours'
WHERE unlocked_at IS NOT NULL;

-- ============================================
-- 8. ACHIEVEMENTS TABLOSU
-- ============================================
-- unlocked_at değerlerini düzelt
UPDATE achievements
SET unlocked_at = unlocked_at + INTERVAL '3 hours'
WHERE unlocked_at IS NOT NULL;

-- ============================================
-- KONTROL SORGUSU
-- ============================================
-- Düzeltme sonrası kontrol için:
-- Aşağıdaki sorguyu çalıştırarak güncellenmiş saatleri görebilirsiniz

/*
SELECT 
    'user_stats' as tablo,
    user_id,
    updated_at,
    updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Istanbul' as yerel_saat
FROM user_stats
WHERE updated_at IS NOT NULL
ORDER BY updated_at DESC
LIMIT 10;
*/

-- ============================================
-- SONUÇ
-- ============================================
SELECT 
    '✅ Geçmiş saatler düzeltildi!' as sonuc,
    'Tüm updated_at ve unlocked_at değerlerine +3 saat eklendi' as aciklama,
    'Yeni oyunlarda zaten doğru saat kullanılacak' as not;
