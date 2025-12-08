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
    // Günlük Başarımlar
    {
        id: 'first_victory',
        name: '🎯 İlk Zafer',
        description: 'İlk sahih cevap',
        check: (stats) => stats.totalCorrect >= 1
    },
    {
        id: 'daily_hero',
        name: '⭐ Günlük Kahraman',
        description: 'Günlük virdi tamamla',
        check: (stats) => {
            const dailyGoal = parseInt(localStorage.getItem('dailyGoalHasene') || '2700');
            const todayXP = parseInt(localStorage.getItem('dailyXP') || '0');
            return todayXP >= dailyGoal;
        }
    },
    
    // Combo Başarımları
    {
        id: 'combo_master',
        name: '🔥 Muvazebet Ustası',
        description: '5x muvazebet yap',
        check: (stats) => stats.maxCombo >= 5
    },
    
    // Seri Başarımları
    {
        id: 'streak_7',
        name: '🔥 7 Gün Muvazebet',
        description: '7 gün üst üste talebe et',
        check: (stats) => stats.currentStreak >= 7
    },
    {
        id: 'streak_14',
        name: '🔥 14 Gün Muvazebet',
        description: '14 gün üst üste talebe et',
        check: (stats) => stats.currentStreak >= 14
    },
    {
        id: 'streak_21',
        name: '🔥 21 Gün Muvazebet',
        description: '21 gün üst üste talebe et',
        check: (stats) => stats.currentStreak >= 21
    },
    {
        id: 'streak_30',
        name: '🔥 30 Gün Muvazebet',
        description: '30 gün üst üste talebe et',
        check: (stats) => stats.currentStreak >= 30
    },
    
    // Mertebe Başarımları
    {
        id: 'level_5',
        name: '🏆 Mertebe 5',
        description: 'Mertebe 5\'e ulaş',
        check: (stats) => stats.level >= 5
    },
    {
        id: 'level_10',
        name: '💎 Mertebe 10',
        description: 'Mertebe 10\'a ulaş',
        check: (stats) => stats.level >= 10
    },
    {
        id: 'level_20',
        name: '🌟 Mertebe 20',
        description: 'Mertebe 20\'ye ulaş',
        check: (stats) => stats.level >= 20
    },
    
    // Hasene Başarımları
    {
        id: 'first_step',
        name: '🌱 İlk Adım',
        description: '500 Hasene topla (~4 dk)',
        check: (stats) => stats.totalPoints >= 500
    },
    {
        id: 'bronze_traveler',
        name: '🥉 Mübtedi Yolcu',
        description: '2,000 Hasene (1 Bronz)',
        check: (stats) => stats.totalPoints >= 2000
    },
    {
        id: 'fast_student',
        name: '⚡ Hızlı Talebe',
        description: '4,000 Hasene topla',
        check: (stats) => stats.totalPoints >= 4000
    },
    {
        id: 'silver_master',
        name: '🥈 Gümüş Ustası',
        description: '8,500 Hasene (1 Gümüş) (~1 saat)',
        check: (stats) => stats.totalPoints >= 8500
    },
    {
        id: 'second_silver',
        name: '💯 İkinci Gümüş',
        description: '17,000 Hasene topla',
        check: (stats) => stats.totalPoints >= 17000
    },
    {
        id: 'gold_master',
        name: '🥇 Altın Ustası',
        description: '25,500 Hasene (1 Altın) (~3 gün)',
        check: (stats) => stats.totalPoints >= 25500
    },
    {
        id: 'second_gold',
        name: '🔥 İkinci Altın',
        description: '51,000 Hasene topla',
        check: (stats) => stats.totalPoints >= 51000
    },
    {
        id: 'diamond_master',
        name: '💎 Elmas Ustası',
        description: '85,000 Hasene (1 Elmas) (~10 gün)',
        check: (stats) => stats.totalPoints >= 85000
    },
    {
        id: 'master_of_masters',
        name: '✨ Ustalar Ustası',
        description: '170,000 Hasene topla',
        check: (stats) => stats.totalPoints >= 170000
    },
    {
        id: 'hafiz',
        name: '📖 HAFIZ',
        description: '1,000,000 Hasene topla',
        check: (stats) => stats.totalPoints >= 1000000
    }
];

// Günlük Görevler Template
// Analiz: 15 dk/gün = ~2 oyun = ~15 doğru = ~300 puan
const DAILY_TASKS_TEMPLATE = [
    {
        id: 'daily_10_correct',
        name: '10 Doğru Cevap',
        description: '✅ 10 sahih cevap ver',
        target: 10,
        type: 'correct',
        reward: 0
    },
    {
        id: 'daily_20_correct',
        name: '20 Doğru Cevap',
        description: '✅ 20 sahih cevap ver',
        target: 20,
        type: 'correct',
        reward: 0
    },
    {
        id: 'daily_100_hasene',
        name: '100 Hasene',
        description: '⭐ 100 Hasene kazan',
        target: 100,
        type: 'hasene',
        reward: 0
    },
    {
        id: 'daily_300_hasene',
        name: '300 Hasene',
        description: '⭐ 300 Hasene kazan',
        target: 300,
        type: 'hasene',
        reward: 0
    },
    {
        id: 'daily_3_modes',
        name: '3 Oyun Modu',
        description: '🎮 3 farklı oyun modu oyna',
        target: 3,
        type: 'game_modes',
        reward: 0
    },
    {
        id: 'daily_3_difficulties',
        name: 'Tüm Zorluk Seviyeleri',
        description: '📊 Kolay, Orta ve Zor seviyelerinde oyun oyna',
        target: 3,
        type: 'difficulties',
        reward: 0
    },
    {
        id: 'daily_streak',
        name: 'Seri Koru',
        description: '🔥 Günlük serini koru',
        target: 1,
        type: 'streak',
        reward: 0
    },
    {
        id: 'daily_ayet_oku',
        name: 'Ayet Oku',
        description: '📖 Ayet okuması yap',
        target: 1,
        type: 'ayet_oku',
        reward: 0
    },
    {
        id: 'daily_dua_et',
        name: 'Dua Et',
        description: '🤲 Bugünkü duanı et',
        target: 1,
        type: 'dua_et',
        reward: 0
    },
    {
        id: 'daily_hadis_oku',
        name: 'Hadis Oku',
        description: '📚 Hadis okuması yap',
        target: 1,
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
    },
    {
        id: 'daily_all_modes',
        name: 'Tüm Oyun Modları',
        description: '🎮 Tüm 6 oyun modunu oyna',
        target: 6,
        type: 'game_modes',
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

