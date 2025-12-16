-- ============================================
-- RAPOR SORGULARI
-- ============================================
-- Tüm rapor sorgularını tek dosyada toplar
-- İstediğiniz raporu seçip çalıştırabilirsiniz
-- ============================================

-- ============================================
-- 1. TEST VERİLERİNİ KONTROL ET
-- ============================================
-- Bu sorgu test verilerini kontrol eder
-- Bugünkü tarihi CURRENT_DATE olarak kullanır

-- 1.1. USER_STATS - Toplam hasene kontrolü
SELECT 
    'USER_STATS' as tablo,
    user_id,
    total_points as "Toplam Hasene",
    perfect_lessons_count as "Mükemmel Ders",
    badges->>'stars' as "Yıldız",
    badges->>'bronze' as "Bronz",
    badges->>'silver' as "Gümüş",
    badges->>'gold' as "Altın",
    badges->>'diamond' as "Elmas",
    game_stats->>'totalCorrect' as "Toplam Doğru",
    game_stats->>'totalWrong' as "Toplam Yanlış",
    streak_data->>'currentStreak' as "Aktif Seri",
    streak_data->>'bestStreak' as "En İyi Seri",
    streak_data->>'totalPlayDays' as "Toplam Oyun Günü",
    game_stats->'gameModeCounts'->>'kelime-cevir' as "Kelime Çevir",
    game_stats->'gameModeCounts'->>'dinle-bul' as "Dinle Bul",
    game_stats->'gameModeCounts'->>'bosluk-doldur' as "Boşluk Doldur",
    game_stats->'gameModeCounts'->>'ayet-oku' as "Ayet Oku",
    game_stats->'gameModeCounts'->>'dua-et' as "Dua Et",
    game_stats->'gameModeCounts'->>'hadis-oku' as "Hadis Oku",
    updated_at
FROM user_stats
ORDER BY updated_at DESC
LIMIT 5;

-- 1.2 / 1.3 / 1.4: DAILY_STATS, WEEKLY_STATS, MONTHLY_STATS
-- NOT: Bu tablolar eski mimaride kullanılıyordu, mevcut oyun sürümünde aktif değil.
-- İleride yeniden kullanılmak istenirse, aşağıdaki eski sorgular referans olarak tutuluyor.
--
-- DAILY_STATS örnek sorgu:
-- SELECT ... FROM daily_stats ...
-- WEEKLY_STATS örnek sorgu:
-- SELECT ... FROM weekly_stats ...
-- MONTHLY_STATS örnek sorgu:
-- SELECT ... FROM monthly_stats ...

-- 1.5. WORD_STATS - Kelime istatistikleri
SELECT 
    'WORD_STATS' as tablo,
    COUNT(*) as "Toplam Kelime Sayısı",
    COUNT(DISTINCT user_id) as "Kullanıcı Sayısı",
    COUNT(DISTINCT word_id) as "Farklı Kelime Sayısı"
FROM word_stats;

-- 1.5.1. WORD_STATS - Detaylı kelime istatistikleri (Kullanıcı bazlı)
SELECT 
    'WORD_STATS_DETAY' as tablo,
    user_id,
    COUNT(*) as "Toplam Kelime",
    COUNT(DISTINCT word_id) as "Farklı Kelime",
    COUNT(CASE WHEN (stats->>'correct')::INTEGER > (stats->>'wrong')::INTEGER THEN 1 END) as "İyi Bilinen Kelime",
    COUNT(CASE WHEN (stats->>'wrong')::INTEGER > (stats->>'correct')::INTEGER THEN 1 END) as "Zorlanılan Kelime",
    ROUND(AVG(CASE 
        WHEN (stats->>'attempts')::INTEGER > 0 
        THEN ((stats->>'correct')::NUMERIC / (stats->>'attempts')::NUMERIC) * 100 
        ELSE 0 
    END), 2) as "Ortalama Başarı %"
FROM word_stats
GROUP BY user_id
ORDER BY COUNT(*) DESC
LIMIT 10;

-- 1.6. DAILY_TASKS - Günlük görevler (Detaylı)
SELECT 
    'DAILY_TASKS' as tablo,
    user_id,
    last_task_date as "Son Görev Tarihi",
    rewards_claimed as "Ödül Alındı mı?",
    jsonb_array_length(tasks) as "Toplam Görev Sayısı",
    jsonb_array_length(bonus_tasks) as "Bonus Görev Sayısı",
    jsonb_array_length(completed_tasks) as "Tamamlanan Görev Sayısı",
    today_stats->>'toplamDogru' as "Bugünkü Doğru",
    today_stats->>'toplamPuan' as "Bugünkü Puan",
    today_stats->>'comboCount' as "Bugünkü Combo",
    today_stats->'ayetOku' as "Ayet Oku Sayısı",
    today_stats->'duaEt' as "Dua Et Sayısı",
    today_stats->'hadisOku' as "Hadis Oku Sayısı",
    updated_at
FROM daily_tasks
ORDER BY updated_at DESC
LIMIT 5;

-- 1.6.1. DAILY_TASKS - Görev Detayları (JSON olarak)
SELECT 
    'DAILY_TASKS_DETAY' as tablo,
    user_id,
    last_task_date as "Son Görev Tarihi",
    tasks as "Görevler (JSON)",
    bonus_tasks as "Bonus Görevler (JSON)",
    completed_tasks as "Tamamlanan Görevler (JSON)",
    today_stats as "Bugünkü İstatistikler (JSON)",
    rewards_claimed as "Ödül Alındı mı?"
FROM daily_tasks
ORDER BY updated_at DESC
LIMIT 3;

-- NOT: Haftalık görevler kaldırıldı (UI'dan ve sistemden çıkarıldı)
-- 1.7. WEEKLY_TASKS sorgusu artık kullanılmıyor
-- Haftalık görevler tablosu hala mevcut olabilir (geriye dönük uyumluluk için)
-- Ancak yeni özellikler haftalık görevler kullanmıyor

-- 1.8. BAŞARIMLAR VE ROZETLER - Tek sorguda tüm başarımlar ve rozetler

-- 1.8.0. ÖNCE KONTROL: Achievements tablosunda veri var mı? (RLS bypass - Service role gerekli)
SELECT 
    'ACHIEVEMENTS_TABLO_KONTROL' as tablo,
    COUNT(*) as "Toplam Kayıt",
    COUNT(DISTINCT user_id) as "Kullanıcı Sayısı",
    COUNT(DISTINCT achievement_id) as "Farklı Başarım Sayısı",
    STRING_AGG(DISTINCT achievement_id, ', ' ORDER BY achievement_id) as "Tüm Başarım ID'leri"
FROM achievements;

-- 1.8.0.1. BENİM BAŞARIMLARIM VE ROZETLERİM (Giriş yapan kullanıcı için)
-- Bu sorgu RLS politikaları ile çalışır, sadece kendi verilerinizi gösterir
SELECT 
    'BENIM_BASARIMLARIM' as tablo,
    COALESCE(p.username, u.email) as "Kullanıcı",
    u.email as "Email",
    auth.uid() as "User ID",
    
    -- Başarımlar
    (SELECT COUNT(*) FROM achievements a WHERE a.user_id = auth.uid()) as "Toplam Başarım",
    (SELECT STRING_AGG(
        CASE achievement_id
            WHEN 'first_victory' THEN '🕌 İlk Kelime'
            WHEN 'bismillah' THEN 'بِسْمِ اللَّهِ'
            WHEN 'combo_master' THEN '🕌 Muvazebet Ustası'
            WHEN 'first_step' THEN '🌱 İlk Adım'
            WHEN 'level_1' THEN '📖 Mübtedi'
            WHEN 'perfect_lesson_1' THEN '✨ Mükemmel Ders'
            WHEN 'alhamdulillah' THEN 'الْحَمْدُ لِلَّهِ'
            WHEN 'combo_10' THEN '🕋 On Muvazebet'
            WHEN 'bronze_traveler' THEN '📿 Mübtedi Talebe'
            WHEN 'streak_3' THEN '📿 Üç Gün Vird'
            WHEN 'daily_hero' THEN '📿 Günlük Vird'
            WHEN 'mashallah' THEN 'مَا شَاءَ اللَّهُ'
            WHEN 'fast_student' THEN '🕌 Hızlı Talebe'
            WHEN 'perfect_lesson_5' THEN '🌟 Beş Mükemmel'
            WHEN 'all_modes' THEN '📚 Tüm Modlar'
            WHEN 'streak_7' THEN '🕌 Haftalık Vird'
            WHEN 'level_5' THEN '🕌 Mütebahhir'
            WHEN 'thousand_correct_250' THEN '🕌 İki Yüz Elli Doğru'
            WHEN 'silver_master' THEN '🕋 Gümüş Mertebe'
            WHEN 'combo_20' THEN '☪️ Yirmi Muvazebet'
            WHEN 'perfect_lesson_10' THEN '💎 On Mükemmel'
            WHEN 'streak_14' THEN '🌙 İki Hafta Vird'
            WHEN 'thousand_correct_500' THEN '🕌 Beş Yüz Doğru'
            WHEN 'level_10' THEN '🕋 Alim'
            WHEN 'streak_21' THEN '☪️ Üç Hafta Vird'
            WHEN 'streak_30' THEN '🕋 Ramazan Virdi'
            WHEN 'second_silver' THEN '☪️ İkinci Gümüş'
            WHEN 'thousand_correct' THEN '🕌 Bin Doğru'
            WHEN 'gold_master' THEN '🌟 Altın Mertebe'
            WHEN 'level_15' THEN '☪️ Fakih'
            WHEN 'streak_40' THEN '🌟 Kırk Gün Vird'
            WHEN 'level_20' THEN '🌟 Muhaddis'
            WHEN 'second_gold' THEN '💎 İkinci Altın'
            WHEN 'perfect_lesson_50' THEN '🌟 Elli Mükemmel'
            WHEN 'diamond_master' THEN '✨ Elmas Mertebe'
            WHEN 'level_25' THEN '💎 Müfessir'
            WHEN 'streak_100' THEN '💎 Yüz Gün Vird'
            WHEN 'master_of_masters' THEN '📖 Ustalar Ustası'
            WHEN 'level_30' THEN '✨ Hafız'
            WHEN 'perfect_lesson_100' THEN '🕋 Yüz Mükemmel'
            WHEN 'five_thousand_correct' THEN '🕋 Beş Bin Doğru'
            WHEN 'diamond_master_final' THEN '✨ Elmas Mertebe'
            WHEN 'master_of_masters_final' THEN '📖 Ustalar Ustası'
            WHEN 'hafiz' THEN '🕋 Kurra Hafız'
            ELSE achievement_id
        END, ', ' ORDER BY unlocked_at) 
     FROM achievements a 
     WHERE a.user_id = auth.uid()) as "Başarım Listesi",
    (SELECT MAX(unlocked_at) FROM achievements a WHERE a.user_id = auth.uid()) as "Son Başarım Tarihi",
    
    -- Rozetler
    (SELECT COUNT(*) FROM badges b WHERE b.user_id = auth.uid()) as "Toplam Rozet",
    (SELECT STRING_AGG(
        CASE badge_id
            -- Normal Rozetler
            WHEN 'badge_1' THEN '🏅 İlk Adım'
            WHEN 'badge_2' THEN '🏅 Başlangıç'
            WHEN 'badge_3' THEN '🏅 İlk Seri'
            WHEN 'badge_4' THEN '🏅 Hızlı Öğrenci'
            WHEN 'badge_5' THEN '🏅 Combo Ustası'
            WHEN 'badge_6' THEN '🏅 Mükemmel Ders'
            WHEN 'badge_7' THEN '🏅 Haftalık Kahraman'
            WHEN 'badge_8' THEN '🏅 Kelime Ustası'
            WHEN 'badge_9' THEN '🏅 İlerleme'
            WHEN 'badge_10' THEN '🏅 Çoklu Mod'
            WHEN 'badge_11' THEN '🏅 2 Hafta Seri'
            WHEN 'badge_12' THEN '🏅 Bronz Yolcu'
            WHEN 'badge_14' THEN '🏅 10x Combo'
            WHEN 'badge_15' THEN '🏅 100 Doğru'
            WHEN 'badge_16' THEN '🏅 3 Hafta Seri'
            WHEN 'badge_17' THEN '🏅 5 Mükemmel'
            WHEN 'badge_18' THEN '🏅 Gümüş Yolcu'
            WHEN 'badge_19' THEN '🏅 Ay Boyunca'
            WHEN 'badge_20' THEN '🏅 250 Doğru'
            WHEN 'badge_21' THEN '🏅 Mertebe 5'
            WHEN 'badge_22' THEN '🏅 Altın Yolcu'
            WHEN 'badge_23' THEN '🏅 20x Combo'
            WHEN 'badge_24' THEN '🏅 500 Doğru'
            WHEN 'badge_25' THEN '🏅 10 Mükemmel'
            WHEN 'badge_26' THEN '🏅 Mertebe 10'
            WHEN 'badge_27' THEN '🏅 Elmas Yolcu'
            WHEN 'badge_28' THEN '🏅 1000 Doğru'
            WHEN 'badge_29' THEN '🏅 50 Gün Seri'
            WHEN 'badge_30' THEN '🏅 Ustalar Ustası'
            WHEN 'badge_32' THEN '🏅 Mertebe 20'
            WHEN 'badge_33' THEN '🏅 100 Mükemmel'
            WHEN 'badge_34' THEN '🏅 100 Gün Seri'
            WHEN 'badge_35' THEN '🏅 5000 Doğru'
            WHEN 'badge_36' THEN '🏅 HAFIZ'
            WHEN 'badge_42' THEN '🏅 Efsane'
            -- Asr-ı Saadet Rozetleri
            WHEN 'asr_1' THEN '🕌 Doğum'
            WHEN 'asr_2' THEN '🕌 Sütannesi Halime'
            WHEN 'asr_3' THEN '🕌 Dedesi Abdülmuttalib'
            WHEN 'asr_4' THEN '🕌 Amcası Ebu Talib'
            WHEN 'asr_5' THEN '🕌 Hz. Hatice ile Evlilik'
            WHEN 'asr_6' THEN '🕌 İlk Vahiy'
            WHEN 'asr_7' THEN '🕌 İlk Müslümanlar'
            WHEN 'asr_8' THEN '🕌 Açık Davet'
            WHEN 'asr_9' THEN '🕌 Habeşistan Hicreti'
            WHEN 'asr_10' THEN '🕌 Hüzün Yılı'
            WHEN 'asr_11' THEN '🕌 İsra ve Miraç'
            WHEN 'asr_12' THEN '🕌 Birinci Akabe Biatı'
            WHEN 'asr_13' THEN '🕌 İkinci Akabe Biatı'
            WHEN 'asr_14' THEN '🕌 Hicret'
            WHEN 'asr_15' THEN '🕌 Mescid-i Nebevi İnşası'
            WHEN 'asr_16' THEN '🕌 Kardeşlik Antlaşması'
            WHEN 'asr_17' THEN '🕌 Bedir Savaşı'
            WHEN 'asr_18' THEN '🕌 Ramazan Orucu'
            WHEN 'asr_19' THEN '🕌 Uhud Savaşı'
            WHEN 'asr_20' THEN '🕌 Hendek Savaşı'
            WHEN 'asr_21' THEN '🕌 Hudeybiye Antlaşması'
            WHEN 'asr_22' THEN '🕌 Hayber' || chr(39) || 'in Fethi'
            WHEN 'asr_23' THEN '🕌 Mekke' || chr(39) || 'nin Fethi'
            WHEN 'asr_24' THEN '🕌 Veda Haccı'
            WHEN 'asr_25' THEN '🕌 Veda Hutbesi'
            WHEN 'asr_26' THEN '🕌 Son Ayetler'
            WHEN 'asr_27' THEN '🕌 Vefat'
            WHEN 'asr_28' THEN '🕌 Hz. Ebu Bekir Halife'
            WHEN 'asr_29' THEN '🕌 Ridde Savaşları'
            WHEN 'asr_30' THEN '🕌 Hz. Ömer Halife'
            WHEN 'asr_31' THEN '🕌 Kadisiyye Savaşı'
            WHEN 'asr_32' THEN '🕌 Kudüs' || chr(39) || 'ün Fethi'
            WHEN 'asr_33' THEN '🕌 Hicri Takvim'
            WHEN 'asr_34' THEN '🕌 Hz. Ömer Şehit'
            WHEN 'asr_35' THEN '🕌 Hz. Osman Halife'
            WHEN 'asr_36' THEN '🕌 Kuran Çoğaltılması'
            WHEN 'asr_37' THEN '🕌 Hz. Osman Şehit'
            WHEN 'asr_38' THEN '🕌 Hz. Ali Halife'
            WHEN 'asr_39' THEN '🕌 Cemel Vakası'
            WHEN 'asr_40' THEN '🕌 Sıffin Savaşı'
            WHEN 'asr_41' THEN '🕌 Hz. Ali Şehit'
            ELSE badge_id
        END, ', ' ORDER BY unlocked_at) 
     FROM badges b 
     WHERE b.user_id = auth.uid()) as "Rozet Listesi",
    (SELECT MAX(unlocked_at) FROM badges b WHERE b.user_id = auth.uid()) as "Son Rozet Tarihi"
    
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.id = auth.uid();

-- 1.8.0.2. MÜBTEDİ BAŞARIMI KONTROL (Giriş yapan kullanıcı için)
SELECT 
    'MUBTEDI_KONTROL' as tablo,
    CASE 
        WHEN EXISTS (SELECT 1 FROM achievements WHERE user_id = auth.uid() AND achievement_id = 'mubtedi') 
        THEN '✅ Mübtedi başarımı VAR'
        ELSE '❌ Mübtedi başarımı YOK'
    END as "Durum",
    (SELECT unlocked_at FROM achievements WHERE user_id = auth.uid() AND achievement_id = 'mubtedi' LIMIT 1) as "Kazanma Tarihi",
    auth.uid() as "User ID"
FROM achievements
WHERE user_id = auth.uid() AND achievement_id = 'mubtedi'
LIMIT 1;

-- 1.8.0.3. TÜM BAŞARIMLARIM (Detaylı liste)
SELECT 
    'BASARIMLARIM_DETAY' as tablo,
    achievement_id as "Başarım ID",
    CASE achievement_id
        WHEN 'first_victory' THEN '🕌 İlk Kelime'
        WHEN 'bismillah' THEN 'بِسْمِ اللَّهِ'
        WHEN 'combo_master' THEN '🕌 Muvazebet Ustası'
        WHEN 'first_step' THEN '🌱 İlk Adım'
        WHEN 'level_1' THEN '📖 Mübtedi'
        WHEN 'perfect_lesson_1' THEN '✨ Mükemmel Ders'
        WHEN 'alhamdulillah' THEN 'الْحَمْدُ لِلَّهِ'
        WHEN 'combo_10' THEN '🕋 On Muvazebet'
        WHEN 'bronze_traveler' THEN '📿 Mübtedi Talebe'
        WHEN 'streak_3' THEN '📿 Üç Gün Vird'
        WHEN 'daily_hero' THEN '📿 Günlük Vird'
        WHEN 'mashallah' THEN 'مَا شَاءَ اللَّهُ'
        WHEN 'fast_student' THEN '🕌 Hızlı Talebe'
        WHEN 'perfect_lesson_5' THEN '🌟 Beş Mükemmel'
        WHEN 'all_modes' THEN '📚 Tüm Modlar'
        WHEN 'streak_7' THEN '🕌 Haftalık Vird'
        WHEN 'level_5' THEN '🕌 Mütebahhir'
        WHEN 'thousand_correct_250' THEN '🕌 İki Yüz Elli Doğru'
        WHEN 'silver_master' THEN '🕋 Gümüş Mertebe'
        WHEN 'combo_20' THEN '☪️ Yirmi Muvazebet'
        WHEN 'perfect_lesson_10' THEN '💎 On Mükemmel'
        WHEN 'streak_14' THEN '🌙 İki Hafta Vird'
        WHEN 'thousand_correct_500' THEN '🕌 Beş Yüz Doğru'
        WHEN 'level_10' THEN '🕋 Alim'
        WHEN 'streak_21' THEN '☪️ Üç Hafta Vird'
        WHEN 'streak_30' THEN '🕋 Ramazan Virdi'
        WHEN 'second_silver' THEN '☪️ İkinci Gümüş'
        WHEN 'thousand_correct' THEN '🕌 Bin Doğru'
        WHEN 'gold_master' THEN '🌟 Altın Mertebe'
        WHEN 'level_15' THEN '☪️ Fakih'
        WHEN 'streak_40' THEN '🌟 Kırk Gün Vird'
        WHEN 'level_20' THEN '🌟 Muhaddis'
        WHEN 'second_gold' THEN '💎 İkinci Altın'
        WHEN 'perfect_lesson_50' THEN '🌟 Elli Mükemmel'
        WHEN 'diamond_master' THEN '✨ Elmas Mertebe'
        WHEN 'level_25' THEN '💎 Müfessir'
        WHEN 'streak_100' THEN '💎 Yüz Gün Vird'
        WHEN 'master_of_masters' THEN '📖 Ustalar Ustası'
        WHEN 'level_30' THEN '✨ Hafız'
        WHEN 'perfect_lesson_100' THEN '🕋 Yüz Mükemmel'
        WHEN 'five_thousand_correct' THEN '🕋 Beş Bin Doğru'
        WHEN 'diamond_master_final' THEN '✨ Elmas Mertebe'
        WHEN 'master_of_masters_final' THEN '📖 Ustalar Ustası'
        WHEN 'hafiz' THEN '🕋 Kurra Hafız'
        ELSE achievement_id
    END as "Başarım İsmi",
    unlocked_at as "Kazanma Tarihi"
FROM achievements
WHERE user_id = auth.uid()
ORDER BY unlocked_at DESC;

-- 1.8.0.4. TÜM ROZETLERİM (Detaylı liste)
SELECT 
    'ROZETLERIM_DETAY' as tablo,
    badge_id as "Rozet ID",
    CASE badge_id
        -- Normal Rozetler
        WHEN 'badge_1' THEN '🏅 İlk Adım'
        WHEN 'badge_2' THEN '🏅 Başlangıç'
        WHEN 'badge_3' THEN '🏅 İlk Seri'
        WHEN 'badge_4' THEN '🏅 Hızlı Öğrenci'
        WHEN 'badge_5' THEN '🏅 Combo Ustası'
        WHEN 'badge_6' THEN '🏅 Mükemmel Ders'
        WHEN 'badge_7' THEN '🏅 Haftalık Kahraman'
        WHEN 'badge_8' THEN '🏅 Kelime Ustası'
        WHEN 'badge_9' THEN '🏅 İlerleme'
        WHEN 'badge_10' THEN '🏅 Çoklu Mod'
        WHEN 'badge_11' THEN '🏅 2 Hafta Seri'
        WHEN 'badge_12' THEN '🏅 Bronz Yolcu'
        WHEN 'badge_14' THEN '🏅 10x Combo'
        WHEN 'badge_15' THEN '🏅 100 Doğru'
        WHEN 'badge_16' THEN '🏅 3 Hafta Seri'
        WHEN 'badge_17' THEN '🏅 5 Mükemmel'
        WHEN 'badge_18' THEN '🏅 Gümüş Yolcu'
        WHEN 'badge_19' THEN '🏅 Ay Boyunca'
        WHEN 'badge_20' THEN '🏅 250 Doğru'
        WHEN 'badge_21' THEN '🏅 Mertebe 5'
        WHEN 'badge_22' THEN '🏅 Altın Yolcu'
        WHEN 'badge_23' THEN '🏅 20x Combo'
        WHEN 'badge_24' THEN '🏅 500 Doğru'
        WHEN 'badge_25' THEN '🏅 10 Mükemmel'
        WHEN 'badge_26' THEN '🏅 Mertebe 10'
        WHEN 'badge_27' THEN '🏅 Elmas Yolcu'
        WHEN 'badge_28' THEN '🏅 1000 Doğru'
        WHEN 'badge_29' THEN '🏅 50 Gün Seri'
        WHEN 'badge_30' THEN '🏅 Ustalar Ustası'
        WHEN 'badge_32' THEN '🏅 Mertebe 20'
        WHEN 'badge_33' THEN '🏅 100 Mükemmel'
        WHEN 'badge_34' THEN '🏅 100 Gün Seri'
        WHEN 'badge_35' THEN '🏅 5000 Doğru'
        WHEN 'badge_36' THEN '🏅 HAFIZ'
        WHEN 'badge_42' THEN '🏅 Efsane'
        -- Asr-ı Saadet Rozetleri
        WHEN 'asr_1' THEN '🕌 Doğum'
        WHEN 'asr_2' THEN '🕌 Sütannesi Halime'
        WHEN 'asr_3' THEN '🕌 Dedesi Abdülmuttalib'
        WHEN 'asr_4' THEN '🕌 Amcası Ebu Talib'
        WHEN 'asr_5' THEN '🕌 Hz. Hatice ile Evlilik'
        WHEN 'asr_6' THEN '🕌 İlk Vahiy'
        WHEN 'asr_7' THEN '🕌 İlk Müslümanlar'
        WHEN 'asr_8' THEN '🕌 Açık Davet'
        WHEN 'asr_9' THEN '🕌 Habeşistan Hicreti'
        WHEN 'asr_10' THEN '🕌 Hüzün Yılı'
        WHEN 'asr_11' THEN '🕌 İsra ve Miraç'
        WHEN 'asr_12' THEN '🕌 Birinci Akabe Biatı'
        WHEN 'asr_13' THEN '🕌 İkinci Akabe Biatı'
        WHEN 'asr_14' THEN '🕌 Hicret'
        WHEN 'asr_15' THEN '🕌 Mescid-i Nebevi İnşası'
        WHEN 'asr_16' THEN '🕌 Kardeşlik Antlaşması'
        WHEN 'asr_17' THEN '🕌 Bedir Savaşı'
        WHEN 'asr_18' THEN '🕌 Ramazan Orucu'
        WHEN 'asr_19' THEN '🕌 Uhud Savaşı'
        WHEN 'asr_20' THEN '🕌 Hendek Savaşı'
        WHEN 'asr_21' THEN '🕌 Hudeybiye Antlaşması'
        WHEN 'asr_22' THEN '🕌 Hayber' || chr(39) || 'in Fethi'
        WHEN 'asr_23' THEN '🕌 Mekke' || chr(39) || 'nin Fethi'
        WHEN 'asr_24' THEN '🕌 Veda Haccı'
        WHEN 'asr_25' THEN '🕌 Veda Hutbesi'
        WHEN 'asr_26' THEN '🕌 Son Ayetler'
        WHEN 'asr_27' THEN '🕌 Vefat'
        WHEN 'asr_28' THEN '🕌 Hz. Ebu Bekir Halife'
        WHEN 'asr_29' THEN '🕌 Ridde Savaşları'
        WHEN 'asr_30' THEN '🕌 Hz. Ömer Halife'
        WHEN 'asr_31' THEN '🕌 Kadisiyye Savaşı'
        WHEN 'asr_32' THEN '🕌 Kudüs' || chr(39) || 'ün Fethi'
        WHEN 'asr_33' THEN '🕌 Hicri Takvim'
        WHEN 'asr_34' THEN '🕌 Hz. Ömer Şehit'
        WHEN 'asr_35' THEN '🕌 Hz. Osman Halife'
        WHEN 'asr_36' THEN '🕌 Kuran Çoğaltılması'
        WHEN 'asr_37' THEN '🕌 Hz. Osman Şehit'
        WHEN 'asr_38' THEN '🕌 Hz. Ali Halife'
        WHEN 'asr_39' THEN '🕌 Cemel Vakası'
        WHEN 'asr_40' THEN '🕌 Sıffin Savaşı'
        WHEN 'asr_41' THEN '🕌 Hz. Ali Şehit'
        ELSE badge_id
    END as "Rozet İsmi",
    unlocked_at as "Kazanma Tarihi"
FROM badges
WHERE user_id = auth.uid()
ORDER BY unlocked_at DESC;

-- 1.8.1. BAŞARIMLAR VE ROZETLER - Tek sorguda tüm başarımlar ve rozetler
SELECT 
    COALESCE(p.username, u.email) as "Kullanıcı",
    u.email as "Email",
    
    -- Başarımlar
    (SELECT COUNT(*) FROM achievements a WHERE a.user_id = u.id) as "Toplam Başarım",
    (SELECT STRING_AGG(
        CASE achievement_id
            WHEN 'first_victory' THEN '🕌 İlk Kelime'
            WHEN 'bismillah' THEN 'بِسْمِ اللَّهِ'
            WHEN 'combo_master' THEN '🕌 Muvazebet Ustası'
            WHEN 'first_step' THEN '🌱 İlk Adım'
            WHEN 'level_1' THEN '📖 Mübtedi'
            WHEN 'perfect_lesson_1' THEN '✨ Mükemmel Ders'
            WHEN 'alhamdulillah' THEN 'الْحَمْدُ لِلَّهِ'
            WHEN 'combo_10' THEN '🕋 On Muvazebet'
            WHEN 'bronze_traveler' THEN '📿 Mübtedi Talebe'
            WHEN 'streak_3' THEN '📿 Üç Gün Vird'
            WHEN 'daily_hero' THEN '📿 Günlük Vird'
            WHEN 'mashallah' THEN 'مَا شَاءَ اللَّهُ'
            WHEN 'fast_student' THEN '🕌 Hızlı Talebe'
            WHEN 'perfect_lesson_5' THEN '🌟 Beş Mükemmel'
            WHEN 'all_modes' THEN '📚 Tüm Modlar'
            WHEN 'streak_7' THEN '🕌 Haftalık Vird'
            WHEN 'level_5' THEN '🕌 Mütebahhir'
            WHEN 'thousand_correct_250' THEN '🕌 İki Yüz Elli Doğru'
            WHEN 'silver_master' THEN '🕋 Gümüş Mertebe'
            WHEN 'combo_20' THEN '☪️ Yirmi Muvazebet'
            WHEN 'perfect_lesson_10' THEN '💎 On Mükemmel'
            WHEN 'streak_14' THEN '🌙 İki Hafta Vird'
            WHEN 'thousand_correct_500' THEN '🕌 Beş Yüz Doğru'
            WHEN 'level_10' THEN '🕋 Alim'
            WHEN 'streak_21' THEN '☪️ Üç Hafta Vird'
            WHEN 'streak_30' THEN '🕋 Ramazan Virdi'
            WHEN 'second_silver' THEN '☪️ İkinci Gümüş'
            WHEN 'thousand_correct' THEN '🕌 Bin Doğru'
            WHEN 'gold_master' THEN '🌟 Altın Mertebe'
            WHEN 'level_15' THEN '☪️ Fakih'
            WHEN 'streak_40' THEN '🌟 Kırk Gün Vird'
            WHEN 'level_20' THEN '🌟 Muhaddis'
            WHEN 'second_gold' THEN '💎 İkinci Altın'
            WHEN 'perfect_lesson_50' THEN '🌟 Elli Mükemmel'
            WHEN 'diamond_master' THEN '✨ Elmas Mertebe'
            WHEN 'level_25' THEN '💎 Müfessir'
            WHEN 'streak_100' THEN '💎 Yüz Gün Vird'
            WHEN 'master_of_masters' THEN '📖 Ustalar Ustası'
            WHEN 'level_30' THEN '✨ Hafız'
            WHEN 'perfect_lesson_100' THEN '🕋 Yüz Mükemmel'
            WHEN 'five_thousand_correct' THEN '🕋 Beş Bin Doğru'
            WHEN 'diamond_master_final' THEN '✨ Elmas Mertebe'
            WHEN 'master_of_masters_final' THEN '📖 Ustalar Ustası'
            WHEN 'hafiz' THEN '🕋 Kurra Hafız'
            ELSE achievement_id
        END, ', ' ORDER BY unlocked_at) 
     FROM achievements a 
     WHERE a.user_id = u.id) as "Başarım Listesi",
    (SELECT MAX(unlocked_at) FROM achievements a WHERE a.user_id = u.id) as "Son Başarım Tarihi",
    
    -- Rozetler
    (SELECT COUNT(*) FROM badges b WHERE b.user_id = u.id) as "Toplam Rozet",
    (SELECT STRING_AGG(
        CASE badge_id
            -- Normal Rozetler
            WHEN 'badge_1' THEN '🏅 İlk Adım'
            WHEN 'badge_2' THEN '🏅 Başlangıç'
            WHEN 'badge_3' THEN '🏅 İlk Seri'
            WHEN 'badge_4' THEN '🏅 Hızlı Öğrenci'
            WHEN 'badge_5' THEN '🏅 Combo Ustası'
            WHEN 'badge_6' THEN '🏅 Mükemmel Ders'
            WHEN 'badge_7' THEN '🏅 Haftalık Kahraman'
            WHEN 'badge_8' THEN '🏅 Kelime Ustası'
            WHEN 'badge_9' THEN '🏅 İlerleme'
            WHEN 'badge_10' THEN '🏅 Çoklu Mod'
            WHEN 'badge_11' THEN '🏅 2 Hafta Seri'
            WHEN 'badge_12' THEN '🏅 Bronz Yolcu'
            WHEN 'badge_14' THEN '🏅 10x Combo'
            WHEN 'badge_15' THEN '🏅 100 Doğru'
            WHEN 'badge_16' THEN '🏅 3 Hafta Seri'
            WHEN 'badge_17' THEN '🏅 5 Mükemmel'
            WHEN 'badge_18' THEN '🏅 Gümüş Yolcu'
            WHEN 'badge_19' THEN '🏅 Ay Boyunca'
            WHEN 'badge_20' THEN '🏅 250 Doğru'
            WHEN 'badge_21' THEN '🏅 Mertebe 5'
            WHEN 'badge_22' THEN '🏅 Altın Yolcu'
            WHEN 'badge_23' THEN '🏅 20x Combo'
            WHEN 'badge_24' THEN '🏅 500 Doğru'
            WHEN 'badge_25' THEN '🏅 10 Mükemmel'
            WHEN 'badge_26' THEN '🏅 Mertebe 10'
            WHEN 'badge_27' THEN '🏅 Elmas Yolcu'
            WHEN 'badge_28' THEN '🏅 1000 Doğru'
            WHEN 'badge_29' THEN '🏅 50 Gün Seri'
            WHEN 'badge_30' THEN '🏅 Ustalar Ustası'
            WHEN 'badge_32' THEN '🏅 Mertebe 20'
            WHEN 'badge_33' THEN '🏅 100 Mükemmel'
            WHEN 'badge_34' THEN '🏅 100 Gün Seri'
            WHEN 'badge_35' THEN '🏅 5000 Doğru'
            WHEN 'badge_36' THEN '🏅 HAFIZ'
            WHEN 'badge_42' THEN '🏅 Efsane'
            -- Asr-ı Saadet Rozetleri
            WHEN 'asr_1' THEN '🕌 Doğum'
            WHEN 'asr_2' THEN '🕌 Sütannesi Halime'
            WHEN 'asr_3' THEN '🕌 Dedesi Abdülmuttalib'
            WHEN 'asr_4' THEN '🕌 Amcası Ebu Talib'
            WHEN 'asr_5' THEN '🕌 Hz. Hatice ile Evlilik'
            WHEN 'asr_6' THEN '🕌 İlk Vahiy'
            WHEN 'asr_7' THEN '🕌 İlk Müslümanlar'
            WHEN 'asr_8' THEN '🕌 Açık Davet'
            WHEN 'asr_9' THEN '🕌 Habeşistan Hicreti'
            WHEN 'asr_10' THEN '🕌 Hüzün Yılı'
            WHEN 'asr_11' THEN '🕌 İsra ve Miraç'
            WHEN 'asr_12' THEN '🕌 Birinci Akabe Biatı'
            WHEN 'asr_13' THEN '🕌 İkinci Akabe Biatı'
            WHEN 'asr_14' THEN '🕌 Hicret'
            WHEN 'asr_15' THEN '🕌 Mescid-i Nebevi İnşası'
            WHEN 'asr_16' THEN '🕌 Kardeşlik Antlaşması'
            WHEN 'asr_17' THEN '🕌 Bedir Savaşı'
            WHEN 'asr_18' THEN '🕌 Ramazan Orucu'
            WHEN 'asr_19' THEN '🕌 Uhud Savaşı'
            WHEN 'asr_20' THEN '🕌 Hendek Savaşı'
            WHEN 'asr_21' THEN '🕌 Hudeybiye Antlaşması'
            WHEN 'asr_22' THEN '🕌 Hayber' || chr(39) || 'in Fethi'
            WHEN 'asr_23' THEN '🕌 Mekke' || chr(39) || 'nin Fethi'
            WHEN 'asr_24' THEN '🕌 Veda Haccı'
            WHEN 'asr_25' THEN '🕌 Veda Hutbesi'
            WHEN 'asr_26' THEN '🕌 Son Ayetler'
            WHEN 'asr_27' THEN '🕌 Vefat'
            WHEN 'asr_28' THEN '🕌 Hz. Ebu Bekir Halife'
            WHEN 'asr_29' THEN '🕌 Ridde Savaşları'
            WHEN 'asr_30' THEN '🕌 Hz. Ömer Halife'
            WHEN 'asr_31' THEN '🕌 Kadisiyye Savaşı'
            WHEN 'asr_32' THEN '🕌 Kudüs' || chr(39) || 'ün Fethi'
            WHEN 'asr_33' THEN '🕌 Hicri Takvim'
            WHEN 'asr_34' THEN '🕌 Hz. Ömer Şehit'
            WHEN 'asr_35' THEN '🕌 Hz. Osman Halife'
            WHEN 'asr_36' THEN '🕌 Kuran Çoğaltılması'
            WHEN 'asr_37' THEN '🕌 Hz. Osman Şehit'
            WHEN 'asr_38' THEN '🕌 Hz. Ali Halife'
            WHEN 'asr_39' THEN '🕌 Cemel Vakası'
            WHEN 'asr_40' THEN '🕌 Sıffin Savaşı'
            WHEN 'asr_41' THEN '🕌 Hz. Ali Şehit'
            ELSE badge_id
        END, ', ' ORDER BY unlocked_at) 
     FROM badges b 
     WHERE b.user_id = u.id) as "Rozet Listesi",
    (SELECT MAX(unlocked_at) FROM badges b WHERE b.user_id = u.id) as "Son Rozet Tarihi"
    
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE EXISTS (
    SELECT 1 FROM achievements WHERE user_id = u.id
    UNION
    SELECT 1 FROM badges WHERE user_id = u.id
)
ORDER BY 
    (SELECT COUNT(*) FROM achievements a WHERE a.user_id = u.id) DESC,
    (SELECT COUNT(*) FROM badges b WHERE b.user_id = u.id) DESC;

-- 1.10. FAVORITE_WORDS - Favori kelimeler
SELECT 
    'FAVORITE_WORDS' as tablo,
    user_id,
    COUNT(*) as "Toplam Favori Kelime",
    STRING_AGG(word_id, ', ' ORDER BY created_at) as "Favori Kelime Listesi"
FROM favorite_words
GROUP BY user_id
ORDER BY COUNT(*) DESC
LIMIT 5;

-- 1.11. ÖZET - Tüm tablolarda kayıt var mı?
SELECT 
    'user_stats' as tablo,
    COUNT(*) as kayit_sayisi
FROM user_stats
UNION ALL
SELECT 
    'word_stats',
    COUNT(*)
FROM word_stats
UNION ALL
SELECT 
    'favorite_words',
    COUNT(*)
FROM favorite_words
UNION ALL
SELECT 
    'achievements',
    COUNT(*)
FROM achievements
UNION ALL
SELECT 
    'badges',
    COUNT(*)
FROM badges
UNION ALL
SELECT 
    'daily_tasks',
    COUNT(*)
FROM daily_tasks;
-- NOT: weekly_tasks sorgusu kaldırıldı (haftalık görevler sistemden çıkarıldı)
-- UNION ALL
-- SELECT 
--     'weekly_tasks',
--     COUNT(*)
-- FROM weekly_tasks;

-- ============================================
-- 2. KULLANICILARIN KAZANÇ RAPORU
-- ============================================
-- Tüm oyuna giriş yapan kullanıcıların kazançlarını gösterir

SELECT 
    -- Kullanıcı Bilgileri
    COALESCE(p.username, au.email) AS "Kullanıcı Adı",
    au.email AS "Email",
    COALESCE(p.created_at, au.created_at) AS "Kayıt Tarihi",
    au.last_sign_in_at AS "Son Giriş",
    
    -- Puan Bilgileri
    COALESCE(us.total_points, 0) AS "Toplam Hasene",
    COALESCE(us.perfect_lessons_count, 0) AS "Mükemmel Ders",
    
    -- Rozet Bilgileri
    COALESCE((us.badges->>'stars')::INTEGER, 0) AS "⭐ Yıldız",
    COALESCE((us.badges->>'bronze')::INTEGER, 0) AS "🥉 Bronz",
    COALESCE((us.badges->>'silver')::INTEGER, 0) AS "🥈 Gümüş",
    COALESCE((us.badges->>'gold')::INTEGER, 0) AS "🥇 Altın",
    COALESCE((us.badges->>'diamond')::INTEGER, 0) AS "💎 Elmas",
    
    -- Seri Bilgileri
    COALESCE((us.streak_data->>'currentStreak')::INTEGER, 0) AS "Aktif Seri",
    COALESCE((us.streak_data->>'bestStreak')::INTEGER, 0) AS "En İyi Seri",
    COALESCE((us.streak_data->>'totalPlayDays')::INTEGER, 0) AS "Toplam Oyun Günü",
    
    -- Oyun İstatistikleri
    COALESCE((us.game_stats->>'totalCorrect')::INTEGER, 0) AS "Toplam Doğru",
    COALESCE((us.game_stats->>'totalWrong')::INTEGER, 0) AS "Toplam Yanlış",
    CASE 
        WHEN COALESCE((us.game_stats->>'totalCorrect')::INTEGER, 0) + COALESCE((us.game_stats->>'totalWrong')::INTEGER, 0) > 0
        THEN ROUND(
            (COALESCE((us.game_stats->>'totalCorrect')::INTEGER, 0)::NUMERIC / 
             (COALESCE((us.game_stats->>'totalCorrect')::INTEGER, 0) + COALESCE((us.game_stats->>'totalWrong')::INTEGER, 0))::NUMERIC) * 100, 
            2
        )
        ELSE 0
    END AS "Başarı Oranı %",
    
    -- Oyun Modu Sayıları
    COALESCE((us.game_stats->'gameModeCounts'->>'kelime-cevir')::INTEGER, 0) AS "📝 Kelime Çevir",
    COALESCE((us.game_stats->'gameModeCounts'->>'dinle-bul')::INTEGER, 0) AS "🎧 Dinle Bul",
    COALESCE((us.game_stats->'gameModeCounts'->>'bosluk-doldur')::INTEGER, 0) AS "✍️ Boşluk Doldur",
    COALESCE((us.game_stats->'gameModeCounts'->>'ayet-oku')::INTEGER, 0) AS "📖 Ayet Oku",
    COALESCE((us.game_stats->'gameModeCounts'->>'dua-et')::INTEGER, 0) AS "🤲 Dua Et",
    COALESCE((us.game_stats->'gameModeCounts'->>'hadis-oku')::INTEGER, 0) AS "📚 Hadis Oku",
    
    -- Rozet ve Başarım Sayıları
    -- NOT: RLS politikaları nedeniyle bu sorgular sadece giriş yapan kullanıcının verilerini gösterir
    -- Tüm kullanıcıları görmek için Service role key kullanın
    COALESCE((SELECT COUNT(*) FROM achievements a WHERE a.user_id = au.id), 0) AS "Toplam Başarım",
    COALESCE((SELECT STRING_AGG(
        CASE achievement_id
            WHEN 'first_victory' THEN '🕌 İlk Kelime'
            WHEN 'bismillah' THEN 'بِسْمِ اللَّهِ'
            WHEN 'combo_master' THEN '🕌 Muvazebet Ustası'
            WHEN 'first_step' THEN '🌱 İlk Adım'
            WHEN 'level_1' THEN '📖 Mübtedi'
            WHEN 'perfect_lesson_1' THEN '✨ Mükemmel Ders'
            WHEN 'alhamdulillah' THEN 'الْحَمْدُ لِلَّهِ'
            WHEN 'combo_10' THEN '🕋 On Muvazebet'
            WHEN 'bronze_traveler' THEN '📿 Mübtedi Talebe'
            WHEN 'streak_3' THEN '📿 Üç Gün Vird'
            WHEN 'daily_hero' THEN '📿 Günlük Vird'
            WHEN 'mashallah' THEN 'مَا شَاءَ اللَّهُ'
            WHEN 'fast_student' THEN '🕌 Hızlı Talebe'
            WHEN 'perfect_lesson_5' THEN '🌟 Beş Mükemmel'
            WHEN 'all_modes' THEN '📚 Tüm Modlar'
            WHEN 'streak_7' THEN '🕌 Haftalık Vird'
            WHEN 'level_5' THEN '🕌 Mütebahhir'
            WHEN 'thousand_correct_250' THEN '🕌 İki Yüz Elli Doğru'
            WHEN 'silver_master' THEN '🕋 Gümüş Mertebe'
            WHEN 'combo_20' THEN '☪️ Yirmi Muvazebet'
            WHEN 'perfect_lesson_10' THEN '💎 On Mükemmel'
            WHEN 'streak_14' THEN '🌙 İki Hafta Vird'
            WHEN 'thousand_correct_500' THEN '🕌 Beş Yüz Doğru'
            WHEN 'level_10' THEN '🕋 Alim'
            WHEN 'streak_21' THEN '☪️ Üç Hafta Vird'
            WHEN 'streak_30' THEN '🕋 Ramazan Virdi'
            WHEN 'second_silver' THEN '☪️ İkinci Gümüş'
            WHEN 'thousand_correct' THEN '🕌 Bin Doğru'
            WHEN 'gold_master' THEN '🌟 Altın Mertebe'
            WHEN 'level_15' THEN '☪️ Fakih'
            WHEN 'streak_40' THEN '🌟 Kırk Gün Vird'
            WHEN 'level_20' THEN '🌟 Muhaddis'
            WHEN 'second_gold' THEN '💎 İkinci Altın'
            WHEN 'perfect_lesson_50' THEN '🌟 Elli Mükemmel'
            WHEN 'diamond_master' THEN '✨ Elmas Mertebe'
            WHEN 'level_25' THEN '💎 Müfessir'
            WHEN 'streak_100' THEN '💎 Yüz Gün Vird'
            WHEN 'master_of_masters' THEN '📖 Ustalar Ustası'
            WHEN 'level_30' THEN '✨ Hafız'
            WHEN 'perfect_lesson_100' THEN '🕋 Yüz Mükemmel'
            WHEN 'five_thousand_correct' THEN '🕋 Beş Bin Doğru'
            WHEN 'diamond_master_final' THEN '✨ Elmas Mertebe'
            WHEN 'master_of_masters_final' THEN '📖 Ustalar Ustası'
            WHEN 'hafiz' THEN '🕋 Kurra Hafız'
            ELSE achievement_id
        END, ', ' ORDER BY unlocked_at) 
     FROM achievements a WHERE a.user_id = au.id), '') AS "Başarım Listesi",
    (SELECT MAX(unlocked_at) FROM achievements a WHERE a.user_id = au.id) AS "Son Başarım Tarihi",
    COALESCE((SELECT COUNT(*) FROM badges b WHERE b.user_id = au.id), 0) AS "Toplam Rozet",
    COALESCE((SELECT STRING_AGG(
        CASE badge_id
            -- Normal Rozetler
            WHEN 'badge_1' THEN '🏅 İlk Adım'
            WHEN 'badge_2' THEN '🏅 Başlangıç'
            WHEN 'badge_3' THEN '🏅 İlk Seri'
            WHEN 'badge_4' THEN '🏅 Hızlı Öğrenci'
            WHEN 'badge_5' THEN '🏅 Combo Ustası'
            WHEN 'badge_6' THEN '🏅 Mükemmel Ders'
            WHEN 'badge_7' THEN '🏅 Haftalık Kahraman'
            WHEN 'badge_8' THEN '🏅 Kelime Ustası'
            WHEN 'badge_9' THEN '🏅 İlerleme'
            WHEN 'badge_10' THEN '🏅 Çoklu Mod'
            WHEN 'badge_11' THEN '🏅 2 Hafta Seri'
            WHEN 'badge_12' THEN '🏅 Bronz Yolcu'
            WHEN 'badge_14' THEN '🏅 10x Combo'
            WHEN 'badge_15' THEN '🏅 100 Doğru'
            WHEN 'badge_16' THEN '🏅 3 Hafta Seri'
            WHEN 'badge_17' THEN '🏅 5 Mükemmel'
            WHEN 'badge_18' THEN '🏅 Gümüş Yolcu'
            WHEN 'badge_19' THEN '🏅 Ay Boyunca'
            WHEN 'badge_20' THEN '🏅 250 Doğru'
            WHEN 'badge_21' THEN '🏅 Mertebe 5'
            WHEN 'badge_22' THEN '🏅 Altın Yolcu'
            WHEN 'badge_23' THEN '🏅 20x Combo'
            WHEN 'badge_24' THEN '🏅 500 Doğru'
            WHEN 'badge_25' THEN '🏅 10 Mükemmel'
            WHEN 'badge_26' THEN '🏅 Mertebe 10'
            WHEN 'badge_27' THEN '🏅 Elmas Yolcu'
            WHEN 'badge_28' THEN '🏅 1000 Doğru'
            WHEN 'badge_29' THEN '🏅 50 Gün Seri'
            WHEN 'badge_30' THEN '🏅 Ustalar Ustası'
            WHEN 'badge_32' THEN '🏅 Mertebe 20'
            WHEN 'badge_33' THEN '🏅 100 Mükemmel'
            WHEN 'badge_34' THEN '🏅 100 Gün Seri'
            WHEN 'badge_35' THEN '🏅 5000 Doğru'
            WHEN 'badge_36' THEN '🏅 HAFIZ'
            WHEN 'badge_42' THEN '🏅 Efsane'
            -- Asr-ı Saadet Rozetleri
            WHEN 'asr_1' THEN '🕌 Doğum'
            WHEN 'asr_2' THEN '🕌 Sütannesi Halime'
            WHEN 'asr_3' THEN '🕌 Dedesi Abdülmuttalib'
            WHEN 'asr_4' THEN '🕌 Amcası Ebu Talib'
            WHEN 'asr_5' THEN '🕌 Hz. Hatice ile Evlilik'
            WHEN 'asr_6' THEN '🕌 İlk Vahiy'
            WHEN 'asr_7' THEN '🕌 İlk Müslümanlar'
            WHEN 'asr_8' THEN '🕌 Açık Davet'
            WHEN 'asr_9' THEN '🕌 Habeşistan Hicreti'
            WHEN 'asr_10' THEN '🕌 Hüzün Yılı'
            WHEN 'asr_11' THEN '🕌 İsra ve Miraç'
            WHEN 'asr_12' THEN '🕌 Birinci Akabe Biatı'
            WHEN 'asr_13' THEN '🕌 İkinci Akabe Biatı'
            WHEN 'asr_14' THEN '🕌 Hicret'
            WHEN 'asr_15' THEN '🕌 Mescid-i Nebevi İnşası'
            WHEN 'asr_16' THEN '🕌 Kardeşlik Antlaşması'
            WHEN 'asr_17' THEN '🕌 Bedir Savaşı'
            WHEN 'asr_18' THEN '🕌 Ramazan Orucu'
            WHEN 'asr_19' THEN '🕌 Uhud Savaşı'
            WHEN 'asr_20' THEN '🕌 Hendek Savaşı'
            WHEN 'asr_21' THEN '🕌 Hudeybiye Antlaşması'
            WHEN 'asr_22' THEN '🕌 Hayber' || chr(39) || 'in Fethi'
            WHEN 'asr_23' THEN '🕌 Mekke' || chr(39) || 'nin Fethi'
            WHEN 'asr_24' THEN '🕌 Veda Haccı'
            WHEN 'asr_25' THEN '🕌 Veda Hutbesi'
            WHEN 'asr_26' THEN '🕌 Son Ayetler'
            WHEN 'asr_27' THEN '🕌 Vefat'
            WHEN 'asr_28' THEN '🕌 Hz. Ebu Bekir Halife'
            WHEN 'asr_29' THEN '🕌 Ridde Savaşları'
            WHEN 'asr_30' THEN '🕌 Hz. Ömer Halife'
            WHEN 'asr_31' THEN '🕌 Kadisiyye Savaşı'
            WHEN 'asr_32' THEN '🕌 Kudüs' || chr(39) || 'ün Fethi'
            WHEN 'asr_33' THEN '🕌 Hicri Takvim'
            WHEN 'asr_34' THEN '🕌 Hz. Ömer Şehit'
            WHEN 'asr_35' THEN '🕌 Hz. Osman Halife'
            WHEN 'asr_36' THEN '🕌 Kuran Çoğaltılması'
            WHEN 'asr_37' THEN '🕌 Hz. Osman Şehit'
            WHEN 'asr_38' THEN '🕌 Hz. Ali Halife'
            WHEN 'asr_39' THEN '🕌 Cemel Vakası'
            WHEN 'asr_40' THEN '🕌 Sıffin Savaşı'
            WHEN 'asr_41' THEN '🕌 Hz. Ali Şehit'
            ELSE badge_id
        END, ', ' ORDER BY unlocked_at) 
     FROM badges b WHERE b.user_id = au.id), '') AS "Rozet Listesi",
    (SELECT MAX(unlocked_at) FROM badges b WHERE b.user_id = au.id) AS "Son Rozet Tarihi",
    (SELECT COUNT(*) FROM favorite_words fw WHERE fw.user_id = au.id) AS "Favori Kelime",
    (SELECT COUNT(*) FROM word_stats ws WHERE ws.user_id = au.id) AS "Toplam Kelime",
    
    -- Güncellenme Tarihi
    us.updated_at AS "Son Güncelleme"
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
LEFT JOIN user_stats us ON us.user_id = au.id
WHERE EXISTS (SELECT 1 FROM user_stats WHERE user_id = au.id)
ORDER BY us.total_points DESC, au.created_at DESC;

-- ============================================
-- 3. KAPSAMLI KULLANICI RAPOR VIEW'LERİ
-- ============================================
-- Tüm kullanıcı istatistiklerini tek bir view'da toplar
-- Test ve raporlama için kullanılır
-- ============================================

-- 3.1) KULLANICI + TEMEL İSTATİSTİKLER
create or replace view vw_user_overview as
select
  u.id                           as kullanici_id,
  u.email                        as kullanici_mail_id,
  us.total_points                as toplam_hasene,
  (us.badges->>'stars')::int     as yildiz,
  (us.badges->>'bronze')::int    as rozet_bronz,
  (us.badges->>'silver')::int    as rozet_gumus,
  (us.badges->>'gold')::int      as rozet_altin,
  (us.badges->>'diamond')::int   as rozet_elmas,
  case
    when us.total_points >= 100000 then 'Üstad'
    when us.total_points >=  50000 then 'İleri'
    when us.total_points >=  10000 then 'Orta'
    when us.total_points >=   1000 then 'Başlangıç'
    else 'Yeni'
  end                             as mertebe,
  (us.streak_data->>'currentStreak')::int as seri_mevcut,
  (us.streak_data->>'bestStreak')::int    as seri_en_iyi,
  (us.streak_data->>'totalPlayDays')::int as toplam_oyun_gunu,
  COALESCE((us.game_stats->>'totalCorrect')::int, 0) as toplam_dogru,
  COALESCE((us.game_stats->>'totalWrong')::int, 0)   as toplam_yanlis,
  COALESCE(us.game_stats->'gameModeCounts', '{}'::jsonb) as oyun_modlari
from
  auth.users u
  join user_stats us on us.user_id = u.id;

-- 3.2) KELİME İSTATİSTİKLERİ ÖZETİ (ZORLANILAN / İYİ BİLİNEN / ÇOK DENENEN / SON YANLIŞLAR)
create or replace view vw_user_word_stats_summary as
select
  user_id,
  count(*) filter (
    where (stats->>'attempts')::int >= 2
      and (stats->>'successRate')::float < 60
  ) as zorlanilan,
  count(*) filter (
    where (stats->>'attempts')::int >= 3
      and (stats->>'successRate')::float >= 80
  ) as iyi_bilinen,
  count(*)                    as cok_denenen,
  count(*) filter (
    where stats ? 'lastWrong'
  ) as son_yanlis
from
  word_stats
group by
  user_id;

-- 3.3) FAVORİLER ÖZETİ
create or replace view vw_user_favorites_summary as
select
  user_id,
  count(*) as favoriler
from
  favorite_words
group by
  user_id;

-- 3.4) BAŞARIMLAR / MUVAFFAKİYETLER ÖZETİ
create or replace view vw_user_achievements_summary as
select
  user_id,
  count(*)                                       as basarim_sayisi,
  json_agg(achievement_id order by unlocked_at) as basarimlar_detay
from
  achievements
group by
  user_id;

-- 3.5) HAFTALIK LİGLER (ŞİMDİLİK SADECE LİG ADI)
create or replace view vw_user_league_summary as
select
  user_id,
  current_league as haftalik_lig_adi
from
  user_leagues;

-- 3.6) VAZİFELER PANELİ ÖZETİ
create or replace view vw_user_daily_tasks_summary as
select
  user_id,
  last_task_date                               as vazifeler_son_tarih,
  -- Toplam görev = ana görevler (tasks) + bonus görevler (bonus_tasks)
  jsonb_array_length(tasks) 
    + jsonb_array_length(coalesce(bonus_tasks, '[]'::jsonb)) 
                                                as vazifeler_toplam_gorev_sayisi,
  jsonb_array_length(completed_tasks)          as vazifeler_tamamlanan_gorev_sayisi,
  (today_stats->>'toplamPuan')::int            as vazifeler_bugun_hasene
from
  daily_tasks;

-- 3.7) TÜMÜ: KAPSAMLI KULLANICI RAPORU (TEST İÇİN ANA VIEW)
-- Bu view'ı kullanarak tüm kullanıcı istatistiklerini tek bir sorguda görebilirsiniz
-- Örnek kullanım: SELECT * FROM vw_user_full_report;
create or replace view vw_user_full_report as
select
  o.kullanici_mail_id,
  o.kullanici_id,
  o.toplam_hasene,
  o.toplam_dogru,
  o.toplam_yanlis,
  o.oyun_modlari,
  o.yildiz,
  o.rozet_bronz,
  o.rozet_gumus,
  o.rozet_altin,
  o.rozet_elmas,
  o.mertebe,
  o.seri_mevcut,
  o.seri_en_iyi,
  o.toplam_oyun_gunu,
  coalesce(w.zorlanilan, 0)        as zorlanilan,
  coalesce(w.iyi_bilinen, 0)       as iyi_bilinen,
  coalesce(w.cok_denenen, 0)       as cok_denenen,
  coalesce(w.son_yanlis, 0)        as son_yanlis,
  coalesce(f.favoriler, 0)         as favoriler,
  coalesce(a.basarim_sayisi, 0)    as basarim_sayisi,
  a.basarimlar_detay,
  l.haftalik_lig_adi,
  d.vazifeler_son_tarih,
  d.vazifeler_toplam_gorev_sayisi,
  d.vazifeler_tamamlanan_gorev_sayisi,
  d.vazifeler_bugun_hasene
from
  vw_user_overview              o
  left join vw_user_word_stats_summary   w on w.user_id = o.kullanici_id
  left join vw_user_favorites_summary    f on f.user_id = o.kullanici_id
  left join vw_user_achievements_summary a on a.user_id = o.kullanici_id
  left join vw_user_league_summary       l on l.user_id = o.kullanici_id
  left join vw_user_daily_tasks_summary  d on d.user_id = o.kullanici_id;
