// ============================================
// CONSTANTS - Oyun Sabitleri
// ============================================

// Mertebe (Level) Eşikleri
const LEVELS = {
    THRESHOLDS: {
        1: 0,           // Level 1: 0-2499 puan
        2: 2500,        // Level 2: 2500-4999 puan
        3: 5000,        // Level 3: 5000-8499 puan
        4: 8500,        // Level 4: 8500-12999 puan
        5: 13000,       // Level 5: 13000-45999 puan
        10: 46000,      // Level 10: 46000-57999 puan
    },
    INCREMENT_AFTER_10: 15000,  // Level 10'dan sonra her seviye için
    NAMES: {
        1: 'Mübtedi',
        2: 'Müterakki',
        3: 'Mütecaviz',
        4: 'Mütebahhir',
        5: 'Mütebahhir',
        10: 'Mütebahhir'
    }
};

// Başarımlar
const ACHIEVEMENTS = [
    // ============================================
    // İLK ADIMLAR (En Kolay - Tek Oturumda Tamamlanabilir)
    // ============================================
    {
        id: 'first_victory',
        name: '🕌 İlk Kelime',
        description: 'İlk sahih cevap - "Bismillah" ile başla',
        check: (stats) => stats.totalCorrect >= 1
    },
    {
        id: 'bismillah',
        name: 'بِسْمِ اللَّهِ',
        description: 'İlk 10 doğru cevap - Allah\'ın adıyla başla',
        check: (stats) => stats.totalCorrect >= 10
    },
    {
        id: 'combo_master',
        name: '🕌 Muvazebet Ustası',
        description: '5x muvazebet yap - İstikrar ve devamlılık',
        check: (stats) => stats.maxCombo >= 5
    },
    {
        id: 'first_step',
        name: '🌱 İlk Adım',
        description: '100 Hasene topla - Bismillah ile başlangıç',
        check: (stats) => stats.totalPoints >= 100
    },
    {
        id: 'level_1',
        name: '📖 Mübtedi',
        description: 'Mertebe 1 - İlim yolunda ilk adım',
        check: (stats) => stats.level >= 1
    },
    {
        id: 'perfect_lesson_1',
        name: '✨ Mükemmel Ders',
        description: '1 mükemmel ders (0 yanlış) - İhlas ve dikkat',
        check: (stats) => stats.perfectLessons >= 1
    },
    
    // ============================================
    // BAŞLANGIÇ (Kolay - Kısa Sürede Tamamlanabilir)
    // ============================================
    {
        id: 'alhamdulillah',
        name: 'الْحَمْدُ لِلَّهِ',
        description: '50 doğru cevap - Şükür ve hamd',
        check: (stats) => stats.totalCorrect >= 50
    },
    {
        id: 'combo_10',
        name: '🕋 On Muvazebet',
        description: '10x muvazebet - On güzel hasene',
        check: (stats) => stats.maxCombo >= 10
    },
    {
        id: 'bronze_traveler',
        name: '📿 Mübtedi Talebe',
        description: '500 Hasene - İlim yolunda ilerleme',
        check: (stats) => stats.totalPoints >= 500
    },
    {
        id: 'streak_3',
        name: '📿 Üç Gün Vird',
        description: '3 gün üst üste talebe et - Sabır başlangıcı',
        check: (stats) => stats.currentStreak >= 3
    },
    {
        id: 'daily_hero',
        name: '📿 Günlük Vird',
        description: 'Günlük virdi tamamla - Sabır ve sebat',
        check: (stats) => {
            const dailyGoal = parseInt(localStorage.getItem('dailyGoalHasene') || '2700');
            const todayXP = parseInt(localStorage.getItem('dailyXP') || '0');
            return todayXP >= dailyGoal;
        }
    },
    {
        id: 'mashallah',
        name: 'مَا شَاءَ اللَّهُ',
        description: '100 doğru cevap - Allah\'ın dilediği gibi',
        check: (stats) => stats.totalCorrect >= 100
    },
    {
        id: 'fast_student',
        name: '🕌 Hızlı Talebe',
        description: '1,000 Hasene - İlim aşkı',
        check: (stats) => stats.totalPoints >= 1000
    },
    {
        id: 'perfect_lesson_5',
        name: '🌟 Beş Mükemmel',
        description: '5 mükemmel ders - İstikrar ve titizlik',
        check: (stats) => stats.perfectLessons >= 5
    },
    {
        id: 'all_modes',
        name: '📚 Tüm Modlar',
        description: 'Tüm 6 oyun modunu oyna - Kapsamlı öğrenme',
        check: (stats) => stats.allModesPlayed >= 6
    },
    {
        id: 'streak_7',
        name: '🕌 Haftalık Vird',
        description: '7 gün üst üste talebe et - Bir hafta istikrar',
        check: (stats) => stats.currentStreak >= 7
    },
    {
        id: 'level_5',
        name: '🕌 Mütebahhir',
        description: 'Mertebe 5 - İlimde derinleşme',
        check: (stats) => stats.level >= 5
    },
    
    // ============================================
    // İLERLEME (Orta Zorluk)
    // ============================================
    {
        id: 'thousand_correct_250',
        name: '🕌 İki Yüz Elli Doğru',
        description: '250 doğru cevap - İki yüz elli hasene',
        check: (stats) => stats.totalCorrect >= 250
    },
    {
        id: 'silver_master',
        name: '🕋 Gümüş Mertebe',
        description: '2,000 Hasene - İlimde derinleşme',
        check: (stats) => stats.totalPoints >= 2000
    },
    {
        id: 'combo_20',
        name: '☪️ Yirmi Muvazebet',
        description: '20x muvazebet - İhlas ve samimiyet',
        check: (stats) => stats.maxCombo >= 20
    },
    {
        id: 'perfect_lesson_10',
        name: '💎 On Mükemmel',
        description: '10 mükemmel ders - Mükemmellik arayışı',
        check: (stats) => stats.perfectLessons >= 10
    },
    {
        id: 'streak_14',
        name: '🌙 İki Hafta Vird',
        description: '14 gün üst üste talebe et - İki hafta sebat',
        check: (stats) => stats.currentStreak >= 14
    },
    {
        id: 'thousand_correct_500',
        name: '🕌 Beş Yüz Doğru',
        description: '500 doğru cevap - Beş yüz hasene',
        check: (stats) => stats.totalCorrect >= 500
    },
    {
        id: 'level_10',
        name: '🕋 Alim',
        description: 'Mertebe 10 - İlim sahibi olma',
        check: (stats) => stats.level >= 10
    },
    {
        id: 'streak_21',
        name: '☪️ Üç Hafta Vird',
        description: '21 gün üst üste talebe et - Alışkanlık oluşumu',
        check: (stats) => stats.currentStreak >= 21
    },
    {
        id: 'streak_30',
        name: '🕋 Ramazan Virdi',
        description: '30 gün üst üste talebe et - Ramazan gibi sebat',
        check: (stats) => stats.currentStreak >= 30
    },
    
    // ============================================
    // USTALIK (Zor)
    // ============================================
    {
        id: 'second_silver',
        name: '☪️ İkinci Gümüş',
        description: '4,000 Hasene - İstikrar ve sebat',
        check: (stats) => stats.totalPoints >= 4000
    },
    {
        id: 'thousand_correct',
        name: '🕌 Bin Doğru',
        description: '1,000 doğru cevap - Bin hasene',
        check: (stats) => stats.totalCorrect >= 1000
    },
    {
        id: 'gold_master',
        name: '🌟 Altın Mertebe',
        description: '8,500 Hasene - İlim sahibi olma',
        check: (stats) => stats.totalPoints >= 8500
    },
    {
        id: 'level_15',
        name: '☪️ Fakih',
        description: 'Mertebe 15 - Fıkıh bilgisi',
        check: (stats) => stats.level >= 15
    },
    {
        id: 'streak_40',
        name: '🌟 Kırk Gün Vird',
        description: '40 gün üst üste talebe et - Kırk günlük nafile',
        check: (stats) => stats.currentStreak >= 40
    },
    {
        id: 'level_20',
        name: '🌟 Muhaddis',
        description: 'Mertebe 20 - Hadis ilmi',
        check: (stats) => stats.level >= 20
    },
    
    // ============================================
    // MASTER (Çok Zor)
    // ============================================
    {
        id: 'second_gold',
        name: '💎 İkinci Altın',
        description: '17,000 Hasene - Fıkıh bilgisi',
        check: (stats) => stats.totalPoints >= 17000
    },
    {
        id: 'perfect_lesson_50',
        name: '🌟 Elli Mükemmel',
        description: '50 mükemmel ders - İhlas ve samimiyet',
        check: (stats) => stats.perfectLessons >= 50
    },
    {
        id: 'diamond_master',
        name: '✨ Elmas Mertebe',
        description: '25,500 Hasene - Hadis ilmi',
        check: (stats) => stats.totalPoints >= 25500
    },
    {
        id: 'level_25',
        name: '💎 Müfessir',
        description: 'Mertebe 25 - Tefsir ilmi',
        check: (stats) => stats.level >= 25
    },
    {
        id: 'streak_100',
        name: '💎 Yüz Gün Vird',
        description: '100 gün üst üste talebe et - Yüz günlük ibadet',
        check: (stats) => stats.currentStreak >= 100
    },
    
    // ============================================
    // EFSANE (En Zor)
    // ============================================
    {
        id: 'master_of_masters',
        name: '📖 Ustalar Ustası',
        description: '51,000 Hasene - Tefsir ilmi',
        check: (stats) => stats.totalPoints >= 51000
    },
    {
        id: 'level_30',
        name: '✨ Hafız',
        description: 'Mertebe 30 - Hafızlık mertebesi',
        check: (stats) => stats.level >= 30
    },
    {
        id: 'perfect_lesson_100',
        name: '🕋 Yüz Mükemmel',
        description: '100 mükemmel ders - İhlas ve samimiyet',
        check: (stats) => stats.perfectLessons >= 100
    },
    {
        id: 'five_thousand_correct',
        name: '🕋 Beş Bin Doğru',
        description: '5,000 doğru cevap - Beş bin hasene',
        check: (stats) => stats.totalCorrect >= 5000
    },
    {
        id: 'diamond_master_final',
        name: '✨ Elmas Mertebe',
        description: '85,000 Hasene - Hadis ilmi',
        check: (stats) => stats.totalPoints >= 85000
    },
    {
        id: 'master_of_masters_final',
        name: '📖 Ustalar Ustası',
        description: '170,000 Hasene - Tefsir ilmi',
        check: (stats) => stats.totalPoints >= 170000
    },
    {
        id: 'hafiz',
        name: '🕋 Kurra Hafız',
        description: '1,000,000 Hasene - Kurra Hafızlık mertebesi',
        check: (stats) => stats.totalPoints >= 1000000
    }
];

// Günlük Görevler Template
// Analiz: 15 dk/gün = ~2 oyun = ~15 doğru = ~300 puan
const DAILY_TASKS_TEMPLATE = [
    {
        id: 'daily_3_modes',
        name: '3 Oyun Modu',
        description: '🎮 3 farklı oyun modu oyna',
        target: 3,
        type: 'game_modes',
        reward: 0
    },
    {
        id: 'daily_ayet_oku',
        name: 'Ayet Oku',
        description: '📖 Ayet okuması yap',
        target: 5,
        type: 'ayet_oku',
        reward: 0
    },
    {
        id: 'daily_dua_et',
        name: 'Dua Et',
        description: '🤲 Bugünkü duanı et',
        target: 5,
        type: 'dua_et',
        reward: 0
    },
    {
        id: 'daily_hadis_oku',
        name: 'Hadis Oku',
        description: '📚 Hadis okuması yap',
        target: 5,
        type: 'hadis_oku',
        reward: 0
    }
];

// Fazilet Vazifeleri (Bonus)
// Analiz: 15 dk/gün için zorlu bonus görevler
const DAILY_BONUS_TASKS_TEMPLATE = [
    {
        id: 'daily_30_correct',
        name: '30 Doğru Cevap',
        description: '✅ 30 sahih cevap ver',
        target: 30,
        type: 'correct',
        reward: 0
    },
    {
        id: 'daily_500_hasene',
        name: '500 Hasene',
        description: '⭐ 500 Hasene kazan',
        target: 500,
        type: 'hasene',
        reward: 0
    }
];

// Haftalık Görevler Template
// Analiz: 15 dk/gün × 7 gün = ~14 oyun = ~105 doğru = ~2,100 puan
// Hedef: Bir haftada tamamlanabilir görevler
const WEEKLY_TASKS_TEMPLATE = [
    {
        id: 'weekly_150_correct',
        name: '150 Doğru Cevap',
        description: '✅ 150 sahih cevap ver',
        target: 150,
        type: 'correct',
        reward: 0
    },
    {
        id: 'weekly_2500_hasene',
        name: '2500 Hasene',
        description: '⭐ 2,500 Hasene kazan',
        target: 2500,
        type: 'hasene',
        reward: 0
    },
    {
        id: 'weekly_7_streak',
        name: '7 Gün Seri',
        description: '🔥 7 gün üst üste talebe et',
        target: 7,
        type: 'streak',
        reward: 0
    },
    {
        id: 'weekly_all_modes',
        name: 'Tüm Oyun Modları',
        description: '🎮 Tüm 6 oyun modunu oyna',
        target: 6,
        type: 'game_modes',
        reward: 0
    },
    {
        id: 'weekly_5_perfect',
        name: 'Perfect Lesson',
        description: '💎 Tüm soruları doğru cevaplayarak 3 ders tamamla',
        target: 3,
        type: 'perfect_lessons',
        reward: 0
    }
];

// Rozet Renkleri
const BADGE_COLORS = {
    star: '#fbbf24',
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    diamond: '#b9f2ff'
};

// Rozet Tanımları - Her rozet için kazanma koşulları
const BADGE_DEFINITIONS = [
    // Temel Rozetler (1-10)
    {
        id: 'badge_1',
        name: 'İlk Adım',
        image: 'rozet1.png',
        description: '100 Hasene kazan',
        check: (stats) => stats.totalPoints >= 100,
        progress: (stats) => {
            const value = stats.totalPoints || 0;
            return Math.min(100, (value / 100) * 100);
        }
    },
    {
        id: 'badge_2',
        name: 'Başlangıç',
        image: 'rozet2.png',
        description: '10 doğru cevap ver',
        check: (stats) => stats.totalCorrect >= 10,
        progress: (stats) => {
            const value = stats.totalCorrect || 0;
            return Math.min(100, (value / 10) * 100);
        }
    },
    {
        id: 'badge_3',
        name: 'İlk Seri',
        image: 'rozet3.png',
        description: '3 gün üst üste oyna',
        check: (stats) => stats.currentStreak >= 3,
        progress: (stats) => {
            const value = stats.currentStreak || 0;
            return Math.min(100, (value / 3) * 100);
        }
    },
    {
        id: 'badge_4',
        name: 'Hızlı Öğrenci',
        image: 'rozet4.png',
        description: '500 Hasene kazan',
        check: (stats) => stats.totalPoints >= 500,
        progress: (stats) => {
            const value = stats.totalPoints || 0;
            return Math.min(100, (value / 500) * 100);
        }
    },
    {
        id: 'badge_5',
        name: 'Combo Ustası',
        image: 'rozet5.png',
        description: '5x combo yap',
        check: (stats) => stats.maxCombo >= 5,
        progress: (stats) => {
            const value = stats.maxCombo || 0;
            return Math.min(100, (value / 5) * 100);
        }
    },
    {
        id: 'badge_6',
        name: 'Mükemmel Ders',
        image: 'rozet6.png',
        description: '1 mükemmel ders yap (0 yanlış)',
        check: (stats) => stats.perfectLessons >= 1,
        progress: (stats) => {
            const value = stats.perfectLessons || 0;
            return Math.min(100, (value / 1) * 100);
        }
    },
    {
        id: 'badge_7',
        name: 'Haftalık Kahraman',
        image: 'rozet7.png',
        description: '7 gün seri yap',
        check: (stats) => stats.currentStreak >= 7,
        progress: (stats) => Math.min(100, (stats.currentStreak / 7) * 100)
    },
    {
        id: 'badge_8',
        name: 'Kelime Ustası',
        image: 'rozet8.png',
        description: '50 doğru cevap ver',
        check: (stats) => stats.totalCorrect >= 50,
        progress: (stats) => Math.min(100, (stats.totalCorrect / 50) * 100)
    },
    {
        id: 'badge_9',
        name: 'İlerleme',
        image: 'rozet9.png',
        description: '1,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 1000,
        progress: (stats) => Math.min(100, (stats.totalPoints / 1000) * 100)
    },
    {
        id: 'badge_10',
        name: 'Çoklu Mod',
        image: 'rozet10.png',
        description: 'Tüm 6 oyun modunu oyna',
        check: (stats) => stats.allModesPlayed >= 6,
        progress: (stats) => Math.min(100, (stats.allModesPlayed / 6) * 100)
    },
    // Orta Seviye Rozetler (11-20)
    {
        id: 'badge_11',
        name: '2 Hafta Seri',
        image: 'rozet11.png',
        description: '14 gün üst üste oyna',
        check: (stats) => stats.currentStreak >= 14,
        progress: (stats) => Math.min(100, (stats.currentStreak / 14) * 100)
    },
    {
        id: 'badge_12',
        name: 'Bronz Yolcu',
        image: 'rozet12.png',
        description: '2,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 2000,
        progress: (stats) => Math.min(100, (stats.totalPoints / 2000) * 100)
    },
    {
        id: 'badge_14',
        name: '10x Combo',
        image: 'rozet14.png',
        description: '10x combo yap',
        check: (stats) => stats.maxCombo >= 10,
        progress: (stats) => Math.min(100, (stats.maxCombo / 10) * 100)
    },
    {
        id: 'badge_15',
        name: '100 Doğru',
        image: 'rozet15.png',
        description: '100 doğru cevap ver',
        check: (stats) => stats.totalCorrect >= 100,
        progress: (stats) => Math.min(100, (stats.totalCorrect / 100) * 100)
    },
    {
        id: 'badge_16',
        name: '3 Hafta Seri',
        image: 'rozet16.png',
        description: '21 gün üst üste oyna',
        check: (stats) => stats.currentStreak >= 21,
        progress: (stats) => Math.min(100, (stats.currentStreak / 21) * 100)
    },
    {
        id: 'badge_17',
        name: '5 Mükemmel',
        image: 'rozet17.png',
        description: '5 mükemmel ders yap',
        check: (stats) => stats.perfectLessons >= 5,
        progress: (stats) => Math.min(100, (stats.perfectLessons / 5) * 100)
    },
    {
        id: 'badge_18',
        name: 'Gümüş Yolcu',
        image: 'rozet18.png',
        description: '5,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 5000,
        progress: (stats) => Math.min(100, (stats.totalPoints / 5000) * 100)
    },
    {
        id: 'badge_19',
        name: 'Ay Boyunca',
        image: 'rozet19.png',
        description: '30 gün üst üste oyna',
        check: (stats) => stats.currentStreak >= 30,
        progress: (stats) => Math.min(100, (stats.currentStreak / 30) * 100)
    },
    {
        id: 'badge_20',
        name: '250 Doğru',
        image: 'rozet20.png',
        description: '250 doğru cevap ver',
        check: (stats) => stats.totalCorrect >= 250,
        progress: (stats) => Math.min(100, (stats.totalCorrect / 250) * 100)
    },
    // İleri Seviye Rozetler (21-30)
    {
        id: 'badge_21',
        name: 'Mertebe 5',
        image: 'rozet21.png',
        description: 'Mertebe 5\'e ulaş',
        check: (stats) => stats.level >= 5,
        progress: (stats) => {
            // Mertebe rozetleri için progress gösterme (sadece kazanıldı/ kazanılmadı)
            return stats.level >= 5 ? 100 : 0;
        }
    },
    {
        id: 'badge_22',
        name: 'Altın Yolcu',
        image: 'rozet22.png',
        description: '10,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 10000,
        progress: (stats) => Math.min(100, (stats.totalPoints / 10000) * 100)
    },
    {
        id: 'badge_23',
        name: '20x Combo',
        image: 'rozet23.png',
        description: '20x combo yap',
        check: (stats) => stats.maxCombo >= 20,
        progress: (stats) => Math.min(100, (stats.maxCombo / 20) * 100)
    },
    {
        id: 'badge_24',
        name: '500 Doğru',
        image: 'rozet24.png',
        description: '500 doğru cevap ver',
        check: (stats) => stats.totalCorrect >= 500,
        progress: (stats) => Math.min(100, (stats.totalCorrect / 500) * 100)
    },
    {
        id: 'badge_25',
        name: '10 Mükemmel',
        image: 'rozet25.png',
        description: '10 mükemmel ders yap',
        check: (stats) => stats.perfectLessons >= 10,
        progress: (stats) => Math.min(100, (stats.perfectLessons / 10) * 100)
    },
    {
        id: 'badge_26',
        name: 'Mertebe 10',
        image: 'rozet26.png',
        description: 'Mertebe 10\'a ulaş',
        check: (stats) => stats.level >= 10,
        progress: (stats) => {
            // Mertebe rozetleri için progress gösterme (sadece kazanıldı/ kazanılmadı)
            return stats.level >= 10 ? 100 : 0;
        }
    },
    {
        id: 'badge_27',
        name: 'Elmas Yolcu',
        image: 'rozet27.png',
        description: '25,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 25000,
        progress: (stats) => Math.min(100, (stats.totalPoints / 25000) * 100)
    },
    {
        id: 'badge_28',
        name: '1000 Doğru',
        image: 'rozet28.png',
        description: '1,000 doğru cevap ver',
        check: (stats) => stats.totalCorrect >= 1000,
        progress: (stats) => Math.min(100, (stats.totalCorrect / 1000) * 100)
    },
    {
        id: 'badge_29',
        name: '50 Gün Seri',
        image: 'rozet29.png',
        description: '50 gün üst üste oyna',
        check: (stats) => stats.currentStreak >= 50,
        progress: (stats) => Math.min(100, (stats.currentStreak / 50) * 100)
    },
    {
        id: 'badge_30',
        name: 'Ustalar Ustası',
        image: 'rozet30.png',
        description: '50,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 50000,
        progress: (stats) => Math.min(100, (stats.totalPoints / 50000) * 100)
    },
    // Uzman Seviye Rozetler (32-42)
    {
        id: 'badge_32',
        name: 'Mertebe 20',
        image: 'rozet32.png',
        description: 'Mertebe 20\'ye ulaş',
        check: (stats) => stats.level >= 20,
        progress: (stats) => {
            // Mertebe rozetleri için progress gösterme (sadece kazanıldı/ kazanılmadı)
            return stats.level >= 20 ? 100 : 0;
        }
    },
    {
        id: 'badge_33',
        name: '100 Mükemmel',
        image: 'rozet33.png',
        description: '100 mükemmel ders yap',
        check: (stats) => stats.perfectLessons >= 100,
        progress: (stats) => Math.min(100, (stats.perfectLessons / 100) * 100)
    },
    {
        id: 'badge_34',
        name: '100 Gün Seri',
        image: 'rozet34.png',
        description: '100 gün üst üste oyna',
        check: (stats) => stats.currentStreak >= 100,
        progress: (stats) => Math.min(100, (stats.currentStreak / 100) * 100)
    },
    {
        id: 'badge_35',
        name: '5000 Doğru',
        image: 'rozet35.png',
        description: '5,000 doğru cevap ver',
        check: (stats) => stats.totalCorrect >= 5000,
        progress: (stats) => Math.min(100, (stats.totalCorrect / 5000) * 100)
    },
    {
        id: 'badge_36',
        name: 'HAFIZ',
        image: 'rozet36.png',
        description: '100,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 100000,
        progress: (stats) => Math.min(100, (stats.totalPoints / 100000) * 100)
    },
    {
        id: 'badge_42',
        name: 'Efsane',
        image: 'rozet42.png',
        description: '1,000,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 1000000,
        progress: (stats) => Math.min(100, (stats.totalPoints / 1000000) * 100)
    },
    
    // ============================================
    // ASR-I SAADET ROZETLERİ (41 Rozet)
    // Kronolojik sırayla: Doğumdan Dört Halife Dönemi Sonuna Kadar
    // ============================================
    
    // MEKKE DÖNEMİ (1-13)
    {
        id: 'asr_1',
        name: 'Doğum',
        image: 'rozet1.png',
        description: '571 - Hz. Muhammed (s.a.v.) Mekke\'de doğdu. Fil Yılı. 10 doğru cevap ver',
        check: (stats) => stats.totalCorrect >= 10,
        progress: (stats) => Math.min(100, ((stats.totalCorrect || 0) / 10) * 100),
        detail: {
            year: '571 - Miladi',
            fullDescription: 'Hz. Muhammed (s.a.v.) Mekke\'de doğdu. Fil Yılı olarak bilinen bu yıl, Ebrehe\'nin Kabe\'yi yıkmak için geldiği yıldır.',
            arabic: 'وُلِدَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ',
            significance: 'İslam tarihinin başlangıcı'
        }
    },
    {
        id: 'asr_2',
        name: 'Sütannesi Halime',
        image: 'rozet2.png',
        description: '575 - Çocukluğunun ilk yılları. 100 Hasene kazan',
        check: (stats) => stats.totalPoints >= 100,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 100) * 100)
    },
    {
        id: 'asr_3',
        name: 'Dedesi Abdülmuttalib',
        image: 'rozet3.png',
        description: '578 - Dedesi Abdülmuttalib\'in himayesi. 200 Hasene kazan',
        check: (stats) => stats.totalPoints >= 200,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 200) * 100)
    },
    {
        id: 'asr_4',
        name: 'Amcası Ebu Talib',
        image: 'rozet4.png',
        description: '579 - Amcası Ebu Talib\'in yanında. 300 Hasene kazan',
        check: (stats) => stats.totalPoints >= 300,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 300) * 100)
    },
    {
        id: 'asr_5',
        name: 'Hz. Hatice ile Evlilik',
        image: 'rozet5.png',
        description: '595 - Hz. Hatice validemizle evlilik. 20 doğru cevap ver',
        check: (stats) => stats.totalCorrect >= 20,
        progress: (stats) => Math.min(100, ((stats.totalCorrect || 0) / 20) * 100)
    },
    {
        id: 'asr_6',
        name: 'İlk Vahiy',
        image: 'rozet6.png',
        description: '610 - Hira Mağarası\'nda ilk vahiy. "Oku! Yaratan Rabbinin adıyla oku!" 500 Hasene kazan',
        check: (stats) => stats.totalPoints >= 500,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 500) * 100)
    },
    {
        id: 'asr_7',
        name: 'İlk Müslümanlar',
        image: 'rozet7.png',
        description: '610 - Hz. Hatice, Hz. Ebu Bekir, Hz. Ali ve Hz. Zeyd. 3 gün seri yap',
        check: (stats) => stats.currentStreak >= 3,
        progress: (stats) => Math.min(100, ((stats.currentStreak || 0) / 3) * 100)
    },
    {
        id: 'asr_8',
        name: 'Açık Davet',
        image: 'rozet8.png',
        description: '613 - Safa Tepesi\'nde açıkça İslam\'a davet. 30 doğru cevap ver',
        check: (stats) => stats.totalCorrect >= 30,
        progress: (stats) => Math.min(100, ((stats.totalCorrect || 0) / 30) * 100)
    },
    {
        id: 'asr_9',
        name: 'Habeşistan Hicreti',
        image: 'rozet9.png',
        description: '615 - İlk hicret, Habeşistan\'a. 800 Hasene kazan',
        check: (stats) => stats.totalPoints >= 800,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 800) * 100)
    },
    {
        id: 'asr_10',
        name: 'Hüzün Yılı',
        image: 'rozet10.png',
        description: '619 - Hz. Hatice ve Ebu Talib\'in vefatı. 1 mükemmel ders yap',
        check: (stats) => stats.perfectLessons >= 1,
        progress: (stats) => Math.min(100, ((stats.perfectLessons || 0) / 1) * 100)
    },
    {
        id: 'asr_11',
        name: 'İsra ve Miraç',
        image: 'rozet11.png',
        description: '620 - Mescid-i Haram\'dan Mescid-i Aksa\'ya, göklere yükselme. Beş vakit namaz farz kılındı. 7 gün seri yap',
        check: (stats) => stats.currentStreak >= 7,
        progress: (stats) => Math.min(100, ((stats.currentStreak || 0) / 7) * 100)
    },
    {
        id: 'asr_12',
        name: 'Birinci Akabe Biatı',
        image: 'rozet12.png',
        description: '621 - Medineli 12 kişi Akabe\'de biat etti. 50 doğru cevap ver',
        check: (stats) => stats.totalCorrect >= 50,
        progress: (stats) => Math.min(100, ((stats.totalCorrect || 0) / 50) * 100)
    },
    {
        id: 'asr_13',
        name: 'İkinci Akabe Biatı',
        image: 'rozet14.png',
        description: '622 - 73 Medineli Müslüman biat etti. Hicret için izin verildi. 1,500 Hasene kazan',
        check: (stats) => stats.totalPoints >= 1500,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 1500) * 100)
    },
    
    // MEDİNE DÖNEMİ (14-27)
    {
        id: 'asr_14',
        name: 'Hicret',
        image: 'rozet15.png',
        description: '622 (Hicri 1) - Mekke\'den Medine\'ye hicret. Hicri takvimin başlangıcı. 2,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 2000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 2000) * 100)
    },
    {
        id: 'asr_15',
        name: 'Mescid-i Nebevi İnşası',
        image: 'rozet16.png',
        description: '622 (Hicri 1) - Medine\'de Mescid-i Nebevi inşa edildi. 14 gün seri yap',
        check: (stats) => stats.currentStreak >= 14,
        progress: (stats) => Math.min(100, ((stats.currentStreak || 0) / 14) * 100)
    },
    {
        id: 'asr_16',
        name: 'Kardeşlik Antlaşması',
        image: 'rozet17.png',
        description: '622 (Hicri 1) - Muhacirler ile Ensar arasında kardeşlik. 100 doğru cevap ver',
        check: (stats) => stats.totalCorrect >= 100,
        progress: (stats) => Math.min(100, ((stats.totalCorrect || 0) / 100) * 100)
    },
    {
        id: 'asr_17',
        name: 'Bedir Savaşı',
        image: 'rozet18.png',
        description: '624 (Hicri 2) - İlk büyük zafer. 313 Müslüman, 1000 kişilik orduyu yendi. 3,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 3000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 3000) * 100)
    },
    {
        id: 'asr_18',
        name: 'Ramazan Orucu',
        image: 'rozet19.png',
        description: '624 (Hicri 2) - Ramazan orucu farz kılındı. 21 gün seri yap',
        check: (stats) => stats.currentStreak >= 21,
        progress: (stats) => Math.min(100, ((stats.currentStreak || 0) / 21) * 100)
    },
    {
        id: 'asr_19',
        name: 'Uhud Savaşı',
        image: 'rozet20.png',
        description: '625 (Hicri 3) - Okçuların yerlerini terk etmesi sonucu zorlu savaş. Hz. Hamza şehit oldu. 150 doğru cevap ver',
        check: (stats) => stats.totalCorrect >= 150,
        progress: (stats) => Math.min(100, ((stats.totalCorrect || 0) / 150) * 100)
    },
    {
        id: 'asr_20',
        name: 'Hendek Savaşı',
        image: 'rozet21.png',
        description: '627 (Hicri 5) - Medine\'nin etrafına hendek kazıldı. Strateji zaferi. 5 mükemmel ders yap',
        check: (stats) => stats.perfectLessons >= 5,
        progress: (stats) => Math.min(100, ((stats.perfectLessons || 0) / 5) * 100)
    },
    {
        id: 'asr_21',
        name: 'Hudeybiye Antlaşması',
        image: 'rozet22.png',
        description: '628 (Hicri 6) - 10 yıllık barış antlaşması. Stratejik zafer. 4,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 4000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 4000) * 100)
    },
    {
        id: 'asr_22',
        name: 'Hayber\'in Fethi',
        image: 'rozet23.png',
        description: '629 (Hicri 7) - Yahudilerin kalesi fethedildi. Hz. Ali\'nin kahramanlıkları. 10x combo yap',
        check: (stats) => stats.maxCombo >= 10,
        progress: (stats) => Math.min(100, ((stats.maxCombo || 0) / 10) * 100)
    },
    {
        id: 'asr_23',
        name: 'Mekke\'nin Fethi',
        image: 'rozet24.png',
        description: '630 (Hicri 8) - En büyük zafer. Kabe putlardan temizlendi. Genel af. 250 doğru cevap ver',
        check: (stats) => stats.totalCorrect >= 250,
        progress: (stats) => Math.min(100, ((stats.totalCorrect || 0) / 250) * 100)
    },
    {
        id: 'asr_24',
        name: 'Huneyn Savaşı',
        image: 'rozet25.png',
        description: '630 (Hicri 8) - Mekke\'nin fethinden sonra zafer. 30 gün seri yap',
        check: (stats) => stats.currentStreak >= 30,
        progress: (stats) => Math.min(100, ((stats.currentStreak || 0) / 30) * 100)
    },
    {
        id: 'asr_25',
        name: 'Tebük Seferi',
        image: 'rozet26.png',
        description: '630 (Hicri 9) - Bizans\'a karşı son sefer. En uzak sefer. 6,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 6000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 6000) * 100)
    },
    {
        id: 'asr_26',
        name: 'Veda Haccı',
        image: 'rozet27.png',
        description: '631 (Hicri 9) - Son hacc. Veda Hutbesi. "Bugün dininizi kemale erdirdim". 10 mükemmel ders yap',
        check: (stats) => stats.perfectLessons >= 10,
        progress: (stats) => Math.min(100, ((stats.perfectLessons || 0) / 10) * 100)
    },
    {
        id: 'asr_27',
        name: 'Vefat',
        image: 'rozet28.png',
        description: '632 (Hicri 11) - Peygamberimiz 63 yaşında vefat etti. Asr-ı Saadet\'in sonu. 500 doğru cevap ver',
        check: (stats) => stats.totalCorrect >= 500,
        progress: (stats) => Math.min(100, ((stats.totalCorrect || 0) / 500) * 100)
    },
    
    // DÖRT HALİFE DÖNEMİ (28-41)
    {
        id: 'asr_28',
        name: 'Hz. Ebu Bekir\'in Halife Seçilmesi',
        image: 'rozet29.png',
        description: '632 (Hicri 11) - İlk halife. "Sıddık" lakabı. 8,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 8000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 8000) * 100)
    },
    {
        id: 'asr_29',
        name: 'Ridde Savaşları',
        image: 'rozet30.png',
        description: '632-633 (Hicri 11-12) - Dinden dönen kabilelerle savaş. İslam\'ın korunması. 40 gün seri yap',
        check: (stats) => stats.currentStreak >= 40,
        progress: (stats) => Math.min(100, ((stats.currentStreak || 0) / 40) * 100)
    },
    {
        id: 'asr_30',
        name: 'Hz. Ömer\'in Halife Seçilmesi',
        image: 'rozet32.png',
        description: '634 (Hicri 13) - İkinci halife. "Faruk" lakabı. Adalet timsali. 750 doğru cevap ver',
        check: (stats) => stats.totalCorrect >= 750,
        progress: (stats) => Math.min(100, ((stats.totalCorrect || 0) / 750) * 100)
    },
    {
        id: 'asr_31',
        name: 'Kadisiyye Savaşı',
        image: 'rozet33.png',
        description: '636 (Hicri 15) - İran Sasani İmparatorluğu\'na karşı zafer. İran\'ın fethi başladı. 15,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 15000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 15000) * 100)
    },
    {
        id: 'asr_32',
        name: 'Kudüs\'ün Fethi',
        image: 'rozet34.png',
        description: '637 (Hicri 16) - Hz. Ömer bizzat geldi ve Kudüs\'ü teslim aldı. 20 mükemmel ders yap',
        check: (stats) => stats.perfectLessons >= 20,
        progress: (stats) => Math.min(100, ((stats.perfectLessons || 0) / 20) * 100)
    },
    {
        id: 'asr_33',
        name: 'Hicri Takvim Başlangıcı',
        image: 'rozet35.png',
        description: '638 (Hicri 17) - Hicri takvim resmi takvim olarak kabul edildi. 50 gün seri yap',
        check: (stats) => stats.currentStreak >= 50,
        progress: (stats) => Math.min(100, ((stats.currentStreak || 0) / 50) * 100)
    },
    {
        id: 'asr_34',
        name: 'Hz. Ömer\'in Şehit Edilmesi',
        image: 'rozet36.png',
        description: '644 (Hicri 23) - Ebu Lü\'lü tarafından şehit edildi. 10 yıl halifelik. 1,000 doğru cevap ver',
        check: (stats) => stats.totalCorrect >= 1000,
        progress: (stats) => Math.min(100, ((stats.totalCorrect || 0) / 1000) * 100)
    },
    {
        id: 'asr_35',
        name: 'Hz. Osman\'ın Halife Seçilmesi',
        image: 'rozet42.png',
        description: '644 (Hicri 23) - Üçüncü halife. "Zinnureyn" lakabı. 25,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 25000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 25000) * 100)
    },
    {
        id: 'asr_36',
        name: 'Kuran\'ın Çoğaltılması',
        image: 'rozet1.png',
        description: '650 (Hicri 30) - Kuran-ı Kerim çoğaltıldı ve farklı bölgelere gönderildi. Standart Mushaf. 30 mükemmel ders yap',
        check: (stats) => stats.perfectLessons >= 30,
        progress: (stats) => Math.min(100, ((stats.perfectLessons || 0) / 30) * 100)
    },
    {
        id: 'asr_37',
        name: 'Hz. Osman\'ın Şehit Edilmesi',
        image: 'rozet2.png',
        description: '656 (Hicri 35) - Fitne dönemi. Kuran okurken şehit edildi. 12 yıl halifelik. 1,500 doğru cevap ver',
        check: (stats) => stats.totalCorrect >= 1500,
        progress: (stats) => Math.min(100, ((stats.totalCorrect || 0) / 1500) * 100)
    },
    {
        id: 'asr_38',
        name: 'Hz. Ali\'nin Halife Seçilmesi',
        image: 'rozet3.png',
        description: '656 (Hicri 35) - Dördüncü halife. "Esedullah" lakabı. İlim ve cesaret. 35,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 35000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 35000) * 100)
    },
    {
        id: 'asr_39',
        name: 'Cemel (Deve) Vakası',
        image: 'rozet4.png',
        description: '656 (Hicri 36) - İlk iç savaş. Hz. Aişe, Talha ve Zübeyr ile Hz. Ali. 60 gün seri yap',
        check: (stats) => stats.currentStreak >= 60,
        progress: (stats) => Math.min(100, ((stats.currentStreak || 0) / 60) * 100)
    },
    {
        id: 'asr_40',
        name: 'Sıffin Savaşı',
        image: 'rozet5.png',
        description: '657 (Hicri 37) - Hz. Ali ile Muaviye arasında savaş. Hakem olayı. 50 mükemmel ders yap',
        check: (stats) => stats.perfectLessons >= 50,
        progress: (stats) => Math.min(100, ((stats.perfectLessons || 0) / 50) * 100)
    },
    {
        id: 'asr_41',
        name: 'Hz. Ali\'nin Şehit Edilmesi',
        image: 'rozet6.png',
        description: '661 (Hicri 40) - Haricilerden İbn Mülcem tarafından şehit edildi. Dört halife dönemi sona erdi. 2,000 doğru cevap ver',
        check: (stats) => stats.totalCorrect >= 2000,
        progress: (stats) => Math.min(100, ((stats.totalCorrect || 0) / 2000) * 100)
    }
];

// Export
if (typeof window !== 'undefined') {
    window.LEVELS = LEVELS;
    window.ACHIEVEMENTS = ACHIEVEMENTS;
    window.DAILY_TASKS_TEMPLATE = DAILY_TASKS_TEMPLATE;
    window.DAILY_BONUS_TASKS_TEMPLATE = DAILY_BONUS_TASKS_TEMPLATE;
    window.WEEKLY_TASKS_TEMPLATE = WEEKLY_TASKS_TEMPLATE;
    window.BADGE_COLORS = BADGE_COLORS;
    window.BADGE_DEFINITIONS = BADGE_DEFINITIONS;
}

