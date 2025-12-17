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

// Başarımlar - TÜM BAŞARIMLAR YILDIZ SAYISINA ENDEKSLENMİŞTİR (Daha Zorlu)
// 250 Hasene = 1 Yıldız
const ACHIEVEMENTS = [
    // ============================================
    // İLK ADIMLAR (1-5 Yıldız - 250-1,250 Hasene)
    // ============================================
    {
        id: 'first_victory',
        name: '🕌 İlk Kelime',
        description: '1 Yıldız kazan - "Bismillah" ile başla',
        check: (stats) => stats.stars >= 1
    },
    {
        id: 'bismillah',
        name: 'بِسْمِ اللَّهِ',
        description: '2 Yıldız kazan - Allah\'ın adıyla başla',
        check: (stats) => stats.stars >= 2
    },
    {
        id: 'combo_master',
        name: '🕌 Muvazebet Ustası',
        description: '3 Yıldız kazan - İstikrar ve devamlılık',
        check: (stats) => stats.stars >= 3
    },
    {
        id: 'first_step',
        name: '🌱 İlk Adım',
        description: '4 Yıldız kazan - Bismillah ile başlangıç',
        check: (stats) => stats.stars >= 4
    },
    {
        id: 'level_1',
        name: '📖 Mübtedi',
        description: '5 Yıldız kazan - İlim yolunda ilk adım',
        check: (stats) => stats.stars >= 5
    },
    {
        id: 'perfect_lesson_1',
        name: '✨ Mükemmel Ders',
        description: '6 Yıldız kazan - İhlas ve dikkat',
        check: (stats) => stats.stars >= 6
    },
    
    // ============================================
    // BAŞLANGIÇ (5-25 Yıldız - 1,250-6,250 Hasene)
    // ============================================
    {
        id: 'alhamdulillah',
        name: 'الْحَمْدُ لِلَّهِ',
        description: '8 Yıldız kazan - Şükür ve hamd',
        check: (stats) => stats.stars >= 8
    },
    {
        id: 'combo_10',
        name: '🕋 On Muvazebet',
        description: '10 Yıldız kazan - On güzel hasene',
        check: (stats) => stats.stars >= 10
    },
    {
        id: 'bronze_traveler',
        name: '📿 Mübtedi Talebe',
        description: '12 Yıldız kazan - İlim yolunda ilerleme',
        check: (stats) => stats.stars >= 12
    },
    {
        id: 'streak_3',
        name: '📿 Üç Gün Vird',
        description: '15 Yıldız kazan - Sabır başlangıcı',
        check: (stats) => stats.stars >= 15
    },
    {
        id: 'daily_hero',
        name: '📿 Günlük Vird',
        description: '18 Yıldız kazan - Sabır ve sebat',
        check: (stats) => stats.stars >= 18
    },
    {
        id: 'mashallah',
        name: 'مَا شَاءَ اللَّهُ',
        description: '20 Yıldız kazan - Allah\'ın dilediği gibi',
        check: (stats) => stats.stars >= 20
    },
    {
        id: 'fast_student',
        name: '🕌 Hızlı Talebe',
        description: '25 Yıldız kazan - İlim aşkı',
        check: (stats) => stats.stars >= 25
    },
    {
        id: 'perfect_lesson_5',
        name: '🌟 Beş Mükemmel',
        description: '30 Yıldız kazan - İstikrar ve titizlik',
        check: (stats) => stats.stars >= 30
    },
    {
        id: 'all_modes',
        name: '📚 Tüm Modlar',
        description: '35 Yıldız kazan - Kapsamlı öğrenme',
        check: (stats) => stats.stars >= 35
    },
    {
        id: 'streak_7',
        name: '🕌 Haftalık Vird',
        description: '40 Yıldız kazan - Bir hafta istikrar',
        check: (stats) => stats.stars >= 40
    },
    {
        id: 'level_5',
        name: '🕌 Mütebahhir',
        description: '50 Yıldız kazan - İlimde derinleşme',
        check: (stats) => stats.stars >= 50
    },
    
    // ============================================
    // İLERLEME (25-100 Yıldız - 6,250-25,000 Hasene)
    // ============================================
    {
        id: 'thousand_correct_250',
        name: '🕌 İki Yüz Elli Doğru',
        description: '60 Yıldız kazan - İki yüz elli hasene',
        check: (stats) => stats.stars >= 60
    },
    {
        id: 'silver_master',
        name: '🕋 Gümüş Mertebe',
        description: '75 Yıldız kazan - İlimde derinleşme',
        check: (stats) => stats.stars >= 75
    },
    {
        id: 'combo_20',
        name: '☪️ Yirmi Muvazebet',
        description: '90 Yıldız kazan - İhlas ve samimiyet',
        check: (stats) => stats.stars >= 90
    },
    {
        id: 'perfect_lesson_10',
        name: '💎 On Mükemmel',
        description: '100 Yıldız kazan - Mükemmellik arayışı',
        check: (stats) => stats.stars >= 100
    },
    {
        id: 'streak_14',
        name: '🌙 İki Hafta Vird',
        description: '120 Yıldız kazan - İki hafta sebat',
        check: (stats) => stats.stars >= 120
    },
    {
        id: 'thousand_correct_500',
        name: '🕌 Beş Yüz Doğru',
        description: '150 Yıldız kazan - Beş yüz hasene',
        check: (stats) => stats.stars >= 150
    },
    {
        id: 'level_10',
        name: '🕋 Alim',
        description: '180 Yıldız kazan - İlim sahibi olma',
        check: (stats) => stats.stars >= 180
    },
    {
        id: 'streak_21',
        name: '☪️ Üç Hafta Vird',
        description: '200 Yıldız kazan - Alışkanlık oluşumu',
        check: (stats) => stats.stars >= 200
    },
    {
        id: 'streak_30',
        name: '🕋 Ramazan Virdi',
        description: '250 Yıldız kazan - Ramazan gibi sebat',
        check: (stats) => stats.stars >= 250
    },
    
    // ============================================
    // USTALIK (100-400 Yıldız - 25,000-100,000 Hasene)
    // ============================================
    {
        id: 'second_silver',
        name: '☪️ İkinci Gümüş',
        description: '300 Yıldız kazan - İstikrar ve sebat',
        check: (stats) => stats.stars >= 300
    },
    {
        id: 'thousand_correct',
        name: '🕌 Bin Doğru',
        description: '350 Yıldız kazan - Bin hasene',
        check: (stats) => stats.stars >= 350
    },
    {
        id: 'gold_master',
        name: '🌟 Altın Mertebe',
        description: '400 Yıldız kazan - İlim sahibi olma',
        check: (stats) => stats.stars >= 400
    },
    {
        id: 'level_15',
        name: '☪️ Fakih',
        description: '500 Yıldız kazan - Fıkıh bilgisi',
        check: (stats) => stats.stars >= 500
    },
    {
        id: 'streak_40',
        name: '🌟 Kırk Gün Vird',
        description: '600 Yıldız kazan - Kırk günlük nafile',
        check: (stats) => stats.stars >= 600
    },
    {
        id: 'level_20',
        name: '🌟 Muhaddis',
        description: '700 Yıldız kazan - Hadis ilmi',
        check: (stats) => stats.stars >= 700
    },
    
    // ============================================
    // MASTER (400-1000 Yıldız - 100,000-250,000 Hasene)
    // ============================================
    {
        id: 'second_gold',
        name: '💎 İkinci Altın',
        description: '800 Yıldız kazan - Fıkıh bilgisi',
        check: (stats) => stats.stars >= 800
    },
    {
        id: 'perfect_lesson_50',
        name: '🌟 Elli Mükemmel',
        description: '900 Yıldız kazan - İhlas ve samimiyet',
        check: (stats) => stats.stars >= 900
    },
    {
        id: 'diamond_master',
        name: '✨ Elmas Mertebe',
        description: '1,000 Yıldız kazan - Hadis ilmi',
        check: (stats) => stats.stars >= 1000
    },
    {
        id: 'level_25',
        name: '💎 Müfessir',
        description: '1,200 Yıldız kazan - Tefsir ilmi',
        check: (stats) => stats.stars >= 1200
    },
    {
        id: 'streak_100',
        name: '💎 Yüz Gün Vird',
        description: '1,500 Yıldız kazan - Yüz günlük ibadet',
        check: (stats) => stats.stars >= 1500
    },
    
    // ============================================
    // EFSANE (1000+ Yıldız - 250,000+ Hasene)
    // ============================================
    {
        id: 'master_of_masters',
        name: '📖 Ustalar Ustası',
        description: '2,000 Yıldız kazan - Tefsir ilmi',
        check: (stats) => stats.stars >= 2000
    },
    {
        id: 'level_30',
        name: '✨ Hafız',
        description: '2,500 Yıldız kazan - Hafızlık mertebesi',
        check: (stats) => stats.stars >= 2500
    },
    {
        id: 'perfect_lesson_100',
        name: '🕋 Yüz Mükemmel',
        description: '3,000 Yıldız kazan - İhlas ve samimiyet',
        check: (stats) => stats.stars >= 3000
    },
    {
        id: 'five_thousand_correct',
        name: '🕋 Beş Bin Doğru',
        description: '4,000 Yıldız kazan - Beş bin hasene',
        check: (stats) => stats.stars >= 4000
    },
    {
        id: 'diamond_master_final',
        name: '✨ Elmas Mertebe',
        description: '5,000 Yıldız kazan - Hadis ilmi',
        check: (stats) => stats.stars >= 5000
    },
    {
        id: 'master_of_masters_final',
        name: '📖 Ustalar Ustası',
        description: '6,000 Yıldız kazan - Tefsir ilmi',
        check: (stats) => stats.stars >= 6000
    },
    {
        id: 'hafiz',
        name: '🕋 Kurra Hafız',
        description: '10,000 Yıldız kazan - Kurra Hafızlık mertebesi',
        check: (stats) => stats.stars >= 10000
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

// Haftalık Görevler Template - KALDIRILDI (Haftalık görevler UI'dan kaldırıldı)

// Rozet Renkleri
const BADGE_COLORS = {
    star: '#fbbf24',
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    diamond: '#b9f2ff'
};

// Rozet Tanımları - TÜM ROZETLER HASENE PUANINA ENDEKSLENMİŞTİR (Daha Zorlu)
const BADGE_DEFINITIONS = [
    // Temel Rozetler (1-10) - Sadece Hasene gereksinimi
    {
        id: 'badge_1',
        name: 'İlk Adım',
        image: 'rozet1.png',
        description: '250 Hasene kazan',
        check: (stats) => stats.totalPoints >= 250,
        progress: (stats) => {
            const value = stats.totalPoints || 0;
            return Math.min(100, (value / 250) * 100);
        }
    },
    {
        id: 'badge_2',
        name: 'Başlangıç',
        image: 'rozet2.png',
        description: '500 Hasene kazan',
        check: (stats) => stats.totalPoints >= 500,
        progress: (stats) => {
            const value = stats.totalPoints || 0;
            return Math.min(100, (value / 500) * 100);
        }
    },
    {
        id: 'badge_3',
        name: 'İlk Seri',
        image: 'rozet3.png',
        description: '750 Hasene kazan',
        check: (stats) => stats.totalPoints >= 750,
        progress: (stats) => {
            const value = stats.totalPoints || 0;
            return Math.min(100, (value / 750) * 100);
        }
    },
    {
        id: 'badge_4',
        name: 'Hızlı Öğrenci',
        image: 'rozet4.png',
        description: '1,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 1000,
        progress: (stats) => {
            const value = stats.totalPoints || 0;
            return Math.min(100, (value / 1000) * 100);
        }
    },
    {
        id: 'badge_5',
        name: 'Combo Ustası',
        image: 'rozet5.png',
        description: '1,500 Hasene kazan',
        check: (stats) => stats.totalPoints >= 1500,
        progress: (stats) => {
            const value = stats.totalPoints || 0;
            return Math.min(100, (value / 1500) * 100);
        }
    },
    {
        id: 'badge_6',
        name: 'Mükemmel Ders',
        image: 'rozet6.png',
        description: '2,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 2000,
        progress: (stats) => {
            const value = stats.totalPoints || 0;
            return Math.min(100, (value / 2000) * 100);
        }
    },
    {
        id: 'badge_7',
        name: 'Haftalık Kahraman',
        image: 'rozet7.png',
        description: '2,500 Hasene kazan',
        check: (stats) => stats.totalPoints >= 2500,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 2500) * 100)
    },
    {
        id: 'badge_8',
        name: 'Kelime Ustası',
        image: 'rozet8.png',
        description: '3,500 Hasene kazan',
        check: (stats) => stats.totalPoints >= 3500,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 3500) * 100)
    },
    {
        id: 'badge_9',
        name: 'İlerleme',
        image: 'rozet9.png',
        description: '5,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 5000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 5000) * 100)
    },
    {
        id: 'badge_10',
        name: 'Çoklu Mod',
        image: 'rozet10.png',
        description: '7,500 Hasene kazan',
        check: (stats) => stats.totalPoints >= 7500,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 7500) * 100)
    },
    // Orta Seviye Rozetler (11-20) - Sadece Hasene gereksinimi
    {
        id: 'badge_11',
        name: '2 Hafta Seri',
        image: 'rozet11.png',
        description: '10,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 10000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 10000) * 100)
    },
    {
        id: 'badge_12',
        name: 'Bronz Yolcu',
        image: 'rozet12.png',
        description: '15,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 15000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 15000) * 100)
    },
    {
        id: 'badge_14',
        name: '10x Combo',
        image: 'rozet14.png',
        description: '20,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 20000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 20000) * 100)
    },
    {
        id: 'badge_15',
        name: '100 Doğru',
        image: 'rozet15.png',
        description: '25,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 25000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 25000) * 100)
    },
    {
        id: 'badge_16',
        name: '3 Hafta Seri',
        image: 'rozet16.png',
        description: '30,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 30000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 30000) * 100)
    },
    {
        id: 'badge_17',
        name: '5 Mükemmel',
        image: 'rozet17.png',
        description: '40,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 40000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 40000) * 100)
    },
    {
        id: 'badge_18',
        name: 'Gümüş Yolcu',
        image: 'rozet18.png',
        description: '50,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 50000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 50000) * 100)
    },
    {
        id: 'badge_19',
        name: 'Ay Boyunca',
        image: 'rozet19.png',
        description: '60,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 60000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 60000) * 100)
    },
    {
        id: 'badge_20',
        name: '250 Doğru',
        image: 'rozet20.png',
        description: '75,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 75000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 75000) * 100)
    },
    // İleri Seviye Rozetler (21-30) - Sadece Hasene gereksinimi
    {
        id: 'badge_21',
        name: 'Mertebe 5',
        image: 'rozet21.png',
        description: '85,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 85000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 85000) * 100)
    },
    {
        id: 'badge_22',
        name: 'Altın Yolcu',
        image: 'rozet22.png',
        description: '100,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 100000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 100000) * 100)
    },
    {
        id: 'badge_23',
        name: '20x Combo',
        image: 'rozet23.png',
        description: '125,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 125000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 125000) * 100)
    },
    {
        id: 'badge_24',
        name: '500 Doğru',
        image: 'rozet24.png',
        description: '150,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 150000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 150000) * 100)
    },
    {
        id: 'badge_25',
        name: '10 Mükemmel',
        image: 'rozet25.png',
        description: '200,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 200000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 200000) * 100)
    },
    {
        id: 'badge_26',
        name: 'Mertebe 10',
        image: 'rozet26.png',
        description: '250,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 250000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 250000) * 100)
    },
    {
        id: 'badge_27',
        name: 'Elmas Yolcu',
        image: 'rozet27.png',
        description: '300,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 300000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 300000) * 100)
    },
    {
        id: 'badge_28',
        name: '1000 Doğru',
        image: 'rozet28.png',
        description: '400,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 400000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 400000) * 100)
    },
    {
        id: 'badge_29',
        name: '50 Gün Seri',
        image: 'rozet29.png',
        description: '500,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 500000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 500000) * 100)
    },
    {
        id: 'badge_30',
        name: 'Ustalar Ustası',
        image: 'rozet30.png',
        description: '600,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 600000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 600000) * 100)
    },
    // Uzman Seviye Rozetler (32-42) - Sadece Hasene gereksinimi
    {
        id: 'badge_32',
        name: 'Mertebe 20',
        image: 'rozet32.png',
        description: '750,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 750000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 750000) * 100)
    },
    {
        id: 'badge_33',
        name: '100 Mükemmel',
        image: 'rozet33.png',
        description: '850,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 850000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 850000) * 100)
    },
    {
        id: 'badge_34',
        name: '100 Gün Seri',
        image: 'rozet34.png',
        description: '1,000,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 1000000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 1000000) * 100)
    },
    {
        id: 'badge_35',
        name: '5000 Doğru',
        image: 'rozet35.png',
        description: '1,250,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 1250000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 1250000) * 100)
    },
    {
        id: 'badge_36',
        name: 'HAFIZ',
        image: 'rozet36.png',
        description: '1,500,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 1500000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 1500000) * 100)
    },
    {
        id: 'badge_42',
        name: 'Efsane',
        image: 'rozet42.png',
        description: '2,500,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 2500000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 2500000) * 100)
    },
    
    // ============================================
    // ASR-I SAADET ROZETLERİ (41 Rozet)
    // Kronolojik sırayla: Doğumdan Dört Halife Dönemi Sonuna Kadar
    // ============================================
    
    // MEKKE DÖNEMİ (1-13) - TÜM ROZETLER HASENE PUANINA ENDEKSLENMİŞTİR
    {
        id: 'asr_1',
        name: 'Doğum',
        image: 'rozet1.png',
        description: '571 - Hz. Muhammed (s.a.v.) Mekke\'de doğdu. Fil Yılı. 250 Hasene kazan',
        check: (stats) => stats.totalPoints >= 250,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 250) * 100),
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
        description: '575 - Çocukluğunun ilk yılları. 500 Hasene kazan',
        check: (stats) => stats.totalPoints >= 500,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 500) * 100)
    },
    {
        id: 'asr_3',
        name: 'Dedesi Abdülmuttalib',
        image: 'rozet3.png',
        description: '578 - Dedesi Abdülmuttalib\'in himayesi. 750 Hasene kazan',
        check: (stats) => stats.totalPoints >= 750,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 750) * 100)
    },
    {
        id: 'asr_4',
        name: 'Amcası Ebu Talib',
        image: 'rozet4.png',
        description: '579 - Amcası Ebu Talib\'in yanında. 1,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 1000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 1000) * 100)
    },
    {
        id: 'asr_5',
        name: 'Hz. Hatice ile Evlilik',
        image: 'rozet5.png',
        description: '595 - Hz. Hatice validemizle evlilik. 1,250 Hasene kazan',
        check: (stats) => stats.totalPoints >= 1250,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 1250) * 100)
    },
    {
        id: 'asr_6',
        name: 'İlk Vahiy',
        image: 'hira-magarasi.png', // Hira Mağarası - İlk Vahiy'in indiği mağara
        description: '610 - Hira Mağarası\'nda ilk vahiy. "Oku! Yaratan Rabbinin adıyla oku!" 1,500 Hasene kazan',
        check: (stats) => stats.totalPoints >= 1500,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 1500) * 100)
    },
    {
        id: 'asr_7',
        name: 'İlk Müslümanlar',
        image: 'rozet7.png',
        description: '610 - Hz. Hatice, Hz. Ebu Bekir, Hz. Ali ve Hz. Zeyd. 1,750 Hasene kazan',
        check: (stats) => stats.totalPoints >= 1750,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 1750) * 100)
    },
    {
        id: 'asr_8',
        name: 'Açık Davet',
        image: 'rozet8.png',
        description: '613 - Safa Tepesi\'nde açıkça İslam\'a davet. 2,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 2000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 2000) * 100)
    },
    {
        id: 'asr_9',
        name: 'Habeşistan Hicreti',
        image: 'deve-kervani.png', // Deve Kervanı - Habeşistan'a hicret eden Müslümanları taşıyan kervan
        description: '615 - İlk hicret, Habeşistan\'a. 2,500 Hasene kazan',
        check: (stats) => stats.totalPoints >= 2500,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 2500) * 100)
    },
    {
        id: 'asr_10',
        name: 'Hüzün Yılı',
        image: 'mezar-tasi.png', // Mezar Taşı - Hz. Hatice ve Ebu Talib'in vefatı
        description: '619 - Hz. Hatice ve Ebu Talib\'in vefatı. 3,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 3000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 3000) * 100)
    },
    {
        id: 'asr_11',
        name: 'İsra ve Miraç',
        image: 'gokyuzu.png', // Gökyüzü - İsra ve Miraç mucizesi, göklere yükselme
        description: '620 - Mescid-i Haram\'dan Mescid-i Aksa\'ya, göklere yükselme. Beş vakit namaz farz kılındı. 3,500 Hasene kazan',
        check: (stats) => stats.totalPoints >= 3500,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 3500) * 100)
    },
    {
        id: 'asr_12',
        name: 'Birinci Akabe Biatı',
        image: 'rozet12.png',
        description: '621 - Medineli 12 kişi Akabe\'de biat etti. 4,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 4000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 4000) * 100)
    },
    {
        id: 'asr_13',
        name: 'İkinci Akabe Biatı',
        image: 'rozet14.png',
        description: '622 - 73 Medineli Müslüman biat etti. Hicret için izin verildi. 4,500 Hasene kazan',
        check: (stats) => stats.totalPoints >= 4500,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 4500) * 100)
    },
    
    // MEDİNE DÖNEMİ (14-27) - TÜM ROZETLER HASENE PUANINA ENDEKSLENMİŞTİR
    {
        id: 'asr_14',
        name: 'Hicret',
        image: 'rozet15.png',
        description: '622 (Hicri 1) - Mekke\'den Medine\'ye hicret. Hicri takvimin başlangıcı. 5,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 5000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 5000) * 100)
    },
    {
        id: 'asr_15',
        name: 'Mescid-i Nebevi İnşası',
        image: 'rozet16.png',
        description: '622 (Hicri 1) - Medine\'de Mescid-i Nebevi inşa edildi. 6,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 6000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 6000) * 100)
    },
    {
        id: 'asr_16',
        name: 'Kardeşlik Antlaşması',
        image: 'rozet17.png',
        description: '622 (Hicri 1) - Muhacirler ile Ensar arasında kardeşlik. 7,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 7000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 7000) * 100)
    },
    {
        id: 'asr_17',
        name: 'Bedir Savaşı',
        image: 'rozet18.png',
        description: '624 (Hicri 2) - İlk büyük zafer. 313 Müslüman, 1000 kişilik orduyu yendi. 8,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 8000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 8000) * 100)
    },
    {
        id: 'asr_18',
        name: 'Ramazan Orucu',
        image: 'rozet19.png',
        description: '624 (Hicri 2) - Ramazan orucu farz kılındı. 9,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 9000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 9000) * 100)
    },
    {
        id: 'asr_19',
        name: 'Uhud Savaşı',
        image: 'rozet20.png',
        description: '625 (Hicri 3) - Okçuların yerlerini terk etmesi sonucu zorlu savaş. Hz. Hamza şehit oldu. 10,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 10000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 10000) * 100)
    },
    {
        id: 'asr_20',
        name: 'Hendek Savaşı',
        image: 'rozet21.png',
        description: '627 (Hicri 5) - Medine\'nin etrafına hendek kazıldı. Strateji zaferi. 12,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 12000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 12000) * 100)
    },
    {
        id: 'asr_21',
        name: 'Hudeybiye Antlaşması',
        image: 'rozet22.png',
        description: '628 (Hicri 6) - 10 yıllık barış antlaşması. Stratejik zafer. 14,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 14000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 14000) * 100)
    },
    {
        id: 'asr_22',
        name: 'Hayber\'in Fethi',
        image: 'rozet23.png',
        description: '629 (Hicri 7) - Yahudilerin kalesi fethedildi. Hz. Ali\'nin kahramanlıkları. 16,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 16000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 16000) * 100)
    },
    {
        id: 'asr_23',
        name: 'Mekke\'nin Fethi',
        image: 'rozet24.png',
        description: '630 (Hicri 8) - En büyük zafer. Kabe putlardan temizlendi. Genel af. 18,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 18000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 18000) * 100)
    },
    {
        id: 'asr_24',
        name: 'Huneyn Savaşı',
        image: 'rozet25.png',
        description: '630 (Hicri 8) - Mekke\'nin fethinden sonra zafer. 20,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 20000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 20000) * 100)
    },
    {
        id: 'asr_25',
        name: 'Tebük Seferi',
        image: 'rozet26.png',
        description: '630 (Hicri 9) - Bizans\'a karşı son sefer. En uzak sefer. 22,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 22000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 22000) * 100)
    },
    {
        id: 'asr_26',
        name: 'Veda Haccı',
        image: 'rozet27.png',
        description: '631 (Hicri 9) - Son hacc. Veda Hutbesi. "Bugün dininizi kemale erdirdim". 24,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 24000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 24000) * 100)
    },
    {
        id: 'asr_27',
        name: 'Vefat',
        image: 'rozet28.png',
        description: '632 (Hicri 11) - Peygamberimiz 63 yaşında vefat etti. Asr-ı Saadet\'in sonu. 26,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 26000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 26000) * 100)
    },
    
    // DÖRT HALİFE DÖNEMİ (28-41) - TÜM ROZETLER HASENE PUANINA ENDEKSLENMİŞTİR
    {
        id: 'asr_28',
        name: 'Hz. Ebu Bekir\'in Halife Seçilmesi',
        image: 'rozet29.png',
        description: '632 (Hicri 11) - İlk halife. "Sıddık" lakabı. 28,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 28000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 28000) * 100)
    },
    {
        id: 'asr_29',
        name: 'Ridde Savaşları',
        image: 'rozet30.png',
        description: '632-633 (Hicri 11-12) - Dinden dönen kabilelerle savaş. İslam\'ın korunması. 30,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 30000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 30000) * 100)
    },
    {
        id: 'asr_30',
        name: 'Hz. Ömer\'in Halife Seçilmesi',
        image: 'rozet32.png',
        description: '634 (Hicri 13) - İkinci halife. "Faruk" lakabı. Adalet timsali. 32,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 32000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 32000) * 100)
    },
    {
        id: 'asr_31',
        name: 'Kadisiyye Savaşı',
        image: 'rozet33.png',
        description: '636 (Hicri 15) - İran Sasani İmparatorluğu\'na karşı zafer. İran\'ın fethi başladı. 35,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 35000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 35000) * 100)
    },
    {
        id: 'asr_32',
        name: 'Kudüs\'ün Fethi',
        image: 'rozet34.png',
        description: '637 (Hicri 16) - Hz. Ömer bizzat geldi ve Kudüs\'ü teslim aldı. 38,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 38000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 38000) * 100)
    },
    {
        id: 'asr_33',
        name: 'Hicri Takvim Başlangıcı',
        image: 'rozet35.png',
        description: '638 (Hicri 17) - Hicri takvim resmi takvim olarak kabul edildi. 42,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 42000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 42000) * 100)
    },
    {
        id: 'asr_34',
        name: 'Hz. Ömer\'in Şehit Edilmesi',
        image: 'rozet36.png',
        description: '644 (Hicri 23) - Ebu Lü\'lü tarafından şehit edildi. 10 yıl halifelik. 45,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 45000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 45000) * 100)
    },
    {
        id: 'asr_35',
        name: 'Hz. Osman\'ın Halife Seçilmesi',
        image: 'rozet42.png',
        description: '644 (Hicri 23) - Üçüncü halife. "Zinnureyn" lakabı. 50,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 50000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 50000) * 100)
    },
    {
        id: 'asr_36',
        name: 'Kuran\'ın Çoğaltılması',
        image: 'rozet1.png',
        description: '650 (Hicri 30) - Kuran-ı Kerim çoğaltıldı ve farklı bölgelere gönderildi. Standart Mushaf. 55,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 55000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 55000) * 100)
    },
    {
        id: 'asr_37',
        name: 'Hz. Osman\'ın Şehit Edilmesi',
        image: 'rozet2.png',
        description: '656 (Hicri 35) - Fitne dönemi. Kuran okurken şehit edildi. 12 yıl halifelik. 60,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 60000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 60000) * 100)
    },
    {
        id: 'asr_38',
        name: 'Hz. Ali\'nin Halife Seçilmesi',
        image: 'rozet3.png',
        description: '656 (Hicri 35) - Dördüncü halife. "Esedullah" lakabı. İlim ve cesaret. 65,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 65000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 65000) * 100)
    },
    {
        id: 'asr_39',
        name: 'Cemel (Deve) Vakası',
        image: 'rozet4.png',
        description: '656 (Hicri 36) - İlk iç savaş. Hz. Aişe, Talha ve Zübeyr ile Hz. Ali. 70,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 70000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 70000) * 100)
    },
    {
        id: 'asr_40',
        name: 'Sıffin Savaşı',
        image: 'rozet5.png',
        description: '657 (Hicri 37) - Hz. Ali ile Muaviye arasında savaş. Hakem olayı. 75,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 75000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 75000) * 100)
    },
    {
        id: 'asr_41',
        name: 'Hz. Ali\'nin Şehit Edilmesi',
        image: 'rozet6.png',
        description: '661 (Hicri 40) - Haricilerden İbn Mülcem tarafından şehit edildi. Dört halife dönemi sona erdi. 80,000 Hasene kazan',
        check: (stats) => stats.totalPoints >= 80000,
        progress: (stats) => Math.min(100, ((stats.totalPoints || 0) / 80000) * 100)
    }
];

// Export
if (typeof window !== 'undefined') {
    window.LEVELS = LEVELS;
    window.ACHIEVEMENTS = ACHIEVEMENTS;
    window.DAILY_TASKS_TEMPLATE = DAILY_TASKS_TEMPLATE;
    window.DAILY_BONUS_TASKS_TEMPLATE = DAILY_BONUS_TASKS_TEMPLATE;
    window.BADGE_COLORS = BADGE_COLORS;
    window.BADGE_DEFINITIONS = BADGE_DEFINITIONS;
}

