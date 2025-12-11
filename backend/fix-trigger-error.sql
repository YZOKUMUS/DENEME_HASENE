-- ============================================
-- TRIGGER HATASINI DÜZELT
-- ============================================
-- Eğer "trigger already exists" hatası alıyorsanız,
-- önce bu script'i çalıştırın, sonra diğer script'leri çalıştırın.

-- Weekly Leaderboard Trigger'ını Sil
DROP TRIGGER IF EXISTS update_weekly_leaderboard_updated_at ON weekly_leaderboard;

-- User Leagues Trigger'ını Sil
DROP TRIGGER IF EXISTS update_user_leagues_updated_at ON user_leagues;

-- Şimdi leaderboard-setup.sql veya supabase-setup.sql'i tekrar çalıştırabilirsiniz
-- Trigger'lar otomatik olarak yeniden oluşturulacak.


