-- ============================================
-- BENİM BAŞARIMLARIM VE ROZETLERİM
-- ============================================
-- Giriş yapan kullanıcının başarımlarını ve rozetlerini gösterir
-- ============================================

-- 1. ÖNCE KONTROL: Achievements tablosunda veri var mı? (Service role key ile çalıştırın)
SELECT 
    'ACHIEVEMENTS_TABLO_KONTROL' as tablo,
    COUNT(*) as "Toplam Kayıt",
    COUNT(DISTINCT user_id) as "Kullanıcı Sayısı",
    COUNT(DISTINCT achievement_id) as "Farklı Başarım Sayısı",
    STRING_AGG(DISTINCT achievement_id, ', ' ORDER BY achievement_id) as "Tüm Başarım ID'leri"
FROM achievements;

-- 2. BENİM BAŞARIMLARIM VE ROZETLERİM (Giriş yapan kullanıcı için)
SELECT 
    'BENIM_BASARIMLARIM' as tablo,
    COALESCE(p.username, u.email) as "Kullanıcı",
    u.email as "Email",
    auth.uid() as "User ID",
    
    -- Başarımlar
    (SELECT COUNT(*) FROM achievements a WHERE a.user_id = auth.uid()) as "Toplam Başarım",
    (SELECT STRING_AGG(
        CASE achievement_id
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

-- 3. MÜBTEDİ BAŞARIMI KONTROL
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

-- 4. TÜM BAŞARIMLARIM (Detaylı liste)
SELECT 
    'BASARIMLARIM_DETAY' as tablo,
    achievement_id as "Başarım ID",
    CASE achievement_id
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
        ELSE achievement_id
    END as "Başarım İsmi",
    unlocked_at as "Kazanma Tarihi"
FROM achievements
WHERE user_id = auth.uid()
ORDER BY unlocked_at DESC;

-- 5. TÜM ROZETLERİM (Detaylı liste)
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

