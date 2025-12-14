// ============================================
// GAME CORE - Ana Oyun Mantığı
// ============================================

// ============================================
// GLOBAL VARIABLES
// ============================================

let totalPoints = 0;
let badges = {
    stars: 0,
    bronze: 0,
    silver: 0,
    gold: 0,
    diamond: 0
};

let streakData = {
    currentStreak: 0,
    bestStreak: 0,
    totalPlayDays: 0,
    lastPlayDate: '',
    playDates: [],
    dailyGoal: 5,
    todayProgress: 0,
    todayDate: ''
};

let dailyTasks = {
    lastTaskDate: '',
    tasks: [],
    bonusTasks: [],
    completedTasks: [],
    todayStats: {
        toplamDogru: 0,
        toplamPuan: 0,
        comboCount: 0,
        allGameModes: new Set(),
        farklıZorluk: new Set(),
        perfectStreak: 0,
        accuracy: 0,
        reviewWords: new Set(),
        streakMaintain: 0,
        totalPlayTime: 0,
        ayetOku: 0,
        duaEt: 0,
        hadisOku: 0
    },
    rewardsClaimed: false
};

let weeklyTasks = {
    lastWeekStart: '',
    weekStart: '',
    weekEnd: '',
    tasks: [],
    completedTasks: [],
    weekStats: {
        totalHasene: 0,
        totalCorrect: 0,
        totalWrong: 0,
        daysPlayed: 0,
        streakDays: 0,
        allModesPlayed: new Set(),
        comboCount: 0
    },
    rewardsClaimed: false
};

let wordStats = {};
let unlockedAchievements = []; // [{id: string, unlockedAt: number}, ...]
let unlockedBadges = []; // [{id: string, unlockedAt: number}, ...] - Kazanılan rozet ID'leri ve zamanları
let perfectLessonsCount = 0; // Toplam mükemmel ders sayısı
let gameStats = {
    totalCorrect: 0,
    totalWrong: 0,
    gameModeCounts: {
        'kelime-cevir': 0,
        'dinle-bul': 0,
        'bosluk-doldur': 0,
        'ayet-oku': 0,
        'dua-et': 0,
        'hadis-oku': 0
    }
};

// Oyun durumu
let currentGame = null;
let currentDifficulty = 'medium';
let currentGameMode = null;
let currentSubMode = null;
let allWordsData = null; // Tüm kelime verileri (yanlış cevaplar için)

// Doğru cevap pozisyon takibi (eşit dağılım için)
let correctAnswerPositions = {
    count: [0, 0, 0, 0], // Her pozisyonun kullanım sayısı
    total: 0 // Toplam soru sayısı
};

// Audio yönetimi - audio-manager.js modülü kullanılıyor
// currentAudio değişkeni ve stopCurrentAudio fonksiyonu audio-manager.js'de tanımlı

// stopCurrentAudio fonksiyonu audio-manager.js modülünde tanımlı

// Global erişim için window'a ekle
window.currentGame = currentGame;
window.currentGameMode = currentGameMode;
window.currentSubMode = currentSubMode;

// Session değişkenleri
let sessionScore = 0;
let sessionCorrect = 0;
let sessionWrong = 0;
let comboCount = 0;
let maxCombo = 0;
let currentQuestion = 0;
let questions = [];
let currentQuestionData = null;
let hintUsed = false;
let lives = 3;

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
    loadingScreen: document.getElementById('loadingScreen'),
    totalPointsEl: document.getElementById('total-points'),
    starPointsEl: document.getElementById('star-points'),
    currentLevelEl: document.getElementById('current-level'),
    dailyGoalProgress: document.getElementById('daily-goal-progress'),
    dailyGoalCurrent: document.getElementById('daily-goal-current'),
    dailyGoalTarget: document.getElementById('daily-goal-target'),
    dailyGoalPercent: document.getElementById('daily-goal-percent'),
    currentStreakEl: document.getElementById('current-streak')
};

// ============================================
// VERİ YÜKLEME VE KAYDETME
// ============================================

/**
 * Tüm istatistikleri yükler
 */
async function loadStats() {
    console.log('📥 loadStats() çağrıldı');
    try {
        // Mobil cihaz tespiti (daha uzun timeout'lar için)
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const sessionWaitTime = isMobile ? 1000 : 500; // Mobil için daha uzun bekleme
        const maxSessionRetries = isMobile ? 5 : 3; // Mobil için daha fazla retry
        
        // ÖNEMLİ: Auth session'ın restore edilmesini bekle
        // Supabase session restore için bekle (mobil cihazlarda daha uzun)
        if (typeof window.supabaseClient !== 'undefined' && window.supabaseClient && window.supabaseClient.auth) {
            let sessionRetryCount = 0;
            let session = null;
            
            // Session restore edilene kadar retry yap
            while (sessionRetryCount < maxSessionRetries && !session) {
                try {
                    const { data, error } = await window.supabaseClient.auth.getSession();
                    if (data && data.session) {
                        session = data.session;
                        console.log('✅ Auth session restore edildi:', session.user.email);
                        // Session restore edildi, biraz daha bekle (güvenli olmak için)
                        await new Promise(resolve => setTimeout(resolve, sessionWaitTime));
                        break;
                    } else if (error) {
                        console.warn(`⚠️ Session kontrolü hatası (deneme ${sessionRetryCount + 1}):`, error);
                    }
                } catch (sessionError) {
                    console.warn(`⚠️ Session kontrolü hatası (deneme ${sessionRetryCount + 1}):`, sessionError);
                }
                
                // Session yoksa, tekrar dene
                if (!session && sessionRetryCount < maxSessionRetries - 1) {
                    console.log(`🔄 Session restore bekleniyor... (${sessionRetryCount + 1}/${maxSessionRetries})`);
                    await new Promise(resolve => setTimeout(resolve, sessionWaitTime));
                    sessionRetryCount++;
                } else {
                    break;
                }
            }
            
            if (!session) {
                console.log('⚠️ Session restore edilemedi, devam ediliyor...');
            }
        } else {
            // Supabase client henüz hazır değil, bekle
            console.log('⏳ Supabase client hazır değil, bekleniyor...');
            let clientWaitCount = 0;
            const maxClientWaits = 10;
            
            while (clientWaitCount < maxClientWaits && (typeof window.supabaseClient === 'undefined' || !window.supabaseClient || !window.supabaseClient.auth)) {
                await new Promise(resolve => setTimeout(resolve, 200));
                clientWaitCount++;
            }
            
            if (typeof window.supabaseClient !== 'undefined' && window.supabaseClient && window.supabaseClient.auth) {
                console.log('✅ Supabase client hazır');
                // Client hazır, session'ı kontrol et
                try {
                    const { data: { session } } = await window.supabaseClient.auth.getSession();
                    if (session) {
                        console.log('✅ Auth session restore edildi:', session.user.email);
                        await new Promise(resolve => setTimeout(resolve, sessionWaitTime));
                    }
                } catch (sessionError) {
                    console.warn('⚠️ Session kontrolü hatası:', sessionError);
                }
            }
        }
        
        // Önce kullanıcı kontrolü yap (session yüklenmesini bekle)
        let user = null;
        console.log('🔍 Kullanıcı kontrolü başlatılıyor...');
        console.log('🔍 window.getCurrentUser mevcut mu?', typeof window.getCurrentUser === 'function');
        console.log('🔍 window.loadUserStats mevcut mu?', typeof window.loadUserStats === 'function');
        
        if (typeof window.getCurrentUser === 'function') {
            let userRetryCount = 0;
            const maxUserRetries = isMobile ? 5 : 3;
            
            // Kullanıcı bulunana kadar retry yap
            while (userRetryCount < maxUserRetries && !user) {
                try {
                    user = await window.getCurrentUser();
                    console.log(`📥 getCurrentUser() sonucu (deneme ${userRetryCount + 1}):`, user ? `✅ Kullanıcı var (${user.id}, ${user.email || 'email yok'})` : '❌ Kullanıcı yok');
                    
                    if (user) {
                        break; // Kullanıcı bulundu, döngüden çık
                    }
                    
                    // Eğer kullanıcı yoksa ama session varsa, tekrar dene (session restore gecikmesi olabilir)
                    if (!user && typeof window.supabaseClient !== 'undefined' && window.supabaseClient && window.supabaseClient.auth) {
                        try {
                            const { data: { session } } = await window.supabaseClient.auth.getSession();
                            console.log('🔍 Session kontrolü:', session ? `✅ Session var (${session.user.email})` : '❌ Session yok');
                            if (session && session.user) {
                                console.log('🔄 Session var ama getCurrentUser null döndü, tekrar deneniyor...');
                                await new Promise(resolve => setTimeout(resolve, sessionWaitTime));
                                user = await window.getCurrentUser();
                                if (user) {
                                    console.log('✅ getCurrentUser() tekrar deneme başarılı:', user.id);
                                    break;
                                }
                            }
                        } catch (sessionError) {
                            console.warn('⚠️ Session kontrolü hatası:', sessionError);
                        }
                    }
                    
                    // Kullanıcı hala yoksa, tekrar dene
                    if (!user && userRetryCount < maxUserRetries - 1) {
                        console.log(`🔄 Kullanıcı bulunamadı, tekrar deneniyor... (${userRetryCount + 1}/${maxUserRetries})`);
                        await new Promise(resolve => setTimeout(resolve, sessionWaitTime));
                        userRetryCount++;
                    } else {
                        break;
                    }
                } catch (e) {
                    console.warn(`📥 getCurrentUser() hatası (deneme ${userRetryCount + 1}):`, e);
                    if (userRetryCount < maxUserRetries - 1) {
                        await new Promise(resolve => setTimeout(resolve, sessionWaitTime));
                        userRetryCount++;
                    } else {
                        break;
                    }
                }
            }
        } else {
            console.warn('⚠️ window.getCurrentUser fonksiyonu bulunamadı - Backend entegrasyonu eksik olabilir');
        }
        
        console.log('🔍 Kullanıcı kontrolü tamamlandı:', user ? `✅ Kullanıcı giriş yapmış (${user.id})` : '❌ Kullanıcı giriş yapmamış');
        
        // KULLANICI DEĞİŞİKLİĞİ KONTROLÜ
        // Eğer farklı bir kullanıcı giriş yaptıysa, localStorage'ı temizle
        const lastUserId = localStorage.getItem('hasene_current_user_id');
        const currentUserId = user ? user.id : null;
        
        if (currentUserId && lastUserId && lastUserId !== currentUserId) {
            // Farklı kullanıcı giriş yaptı, localStorage'ı temizle
            console.log('🔄 Farklı kullanıcı tespit edildi, localStorage temizleniyor...');
            clearUserLocalStorage();
            // Yeni kullanıcı ID'sini kaydet
            localStorage.setItem('hasene_current_user_id', currentUserId);
        } else if (currentUserId && !lastUserId) {
            // İlk kez giriş yapan kullanıcı
            localStorage.setItem('hasene_current_user_id', currentUserId);
        } else if (!currentUserId && lastUserId) {
            // Kullanıcı çıkış yaptı, localStorage'ı temizle
            console.log('🔄 Kullanıcı çıkış yaptı, localStorage temizleniyor...');
            clearUserLocalStorage();
            localStorage.removeItem('hasene_current_user_id');
        }
        
        // ============================================
        // ÖNCELİKLENDİRİLMİŞ VERİ YÜKLEME STRATEJİSİ
        // ============================================
        // Öncelik 1: Kritik veriler (Hemen gösterilmeli)
        // - total_points, badges, streak, level (Ana ekranda görünen)
        // Öncelik 2: Önemli veriler (Hızlı yüklenmeli)
        // - dailyTasks, dailyGoal progress
        // Öncelik 3: Detaylı veriler (Paralel yüklenebilir)
        // - wordStats, achievements, badges (detaylı)
        // Öncelik 4: Arka plan verileri (Lazy loading)
        // - daily_stats, weekly_stats, monthly_stats, favorites
        
        // ÖNCE: localStorage/IndexedDB'den kritik verileri yükle ve UI'ı göster (Optimistic UI)
        console.log('⚡ Optimistic UI: localStorage/IndexedDB\'den kritik veriler yükleniyor...');
        const cachedPoints = await loadFromIndexedDB('hasene_totalPoints');
        if (cachedPoints !== null) {
            totalPoints = parseInt(cachedPoints) || 0;
            if (isNaN(totalPoints) || totalPoints < 0) totalPoints = 0;
        } else {
            totalPoints = parseInt(localStorage.getItem('hasene_totalPoints') || '0') || 0;
            if (isNaN(totalPoints) || totalPoints < 0) totalPoints = 0;
        }
        
        const cachedBadges = await loadFromIndexedDB('hasene_badges');
        if (cachedBadges) {
            badges = cachedBadges;
        } else {
            badges = safeGetItem('hasene_badges', badges);
        }
        
        const cachedStreak = await loadFromIndexedDB('hasene_streakData');
        if (cachedStreak) {
            streakData = cachedStreak;
        } else {
            streakData = safeGetItem('hasene_streakData', streakData);
        }
        
        // UI'ı hemen güncelle (cache'den)
        updateStatsBar();
        updateStreakDisplay();
        console.log('✅ Optimistic UI: Cache\'den veriler yüklendi ve UI güncellendi');
        
        // ============================================
        // ÖNCELİK 1: KRİTİK VERİLER (Backend'den öncelikli yükleme)
        // ============================================
        console.log('🔍 Backend yükleme kontrolü:', {
            user: user ? `✅ Var (${user.id})` : '❌ Yok',
            loadUserStats: typeof window.loadUserStats === 'function' ? '✅ Mevcut' : '❌ Yok'
        });
        
        let backendDataLoaded = false;
        
        // Backend'den kritik verileri yükle (user_stats - total_points, badges, streak)
        if (user && typeof window.loadUserStats === 'function') {
            console.log('⚡ ÖNCELİK 1: Backend\'den kritik veriler yükleniyor...');
            let userStats = null;
            let retryCount = 0;
            const maxRetries = isMobile ? 5 : 3;
            const retryDelay = isMobile ? 1000 : 500;
            
            while (retryCount <= maxRetries && !userStats) {
                try {
                    console.log(`📥 Backend'den user_stats yükleniyor... (deneme ${retryCount + 1}/${maxRetries + 1})`);
                    userStats = await window.loadUserStats();
                    console.log('📥 Backend\'den user_stats yüklendi:', userStats ? 'Veri var' : 'Veri yok');
                    
                    if (userStats === null || userStats === undefined) {
                        if (retryCount < maxRetries) {
                            console.log(`⚠️ Backend'den veri yüklenemedi (null/undefined), ${retryDelay * (retryCount + 1)}ms sonra tekrar deneniyor...`);
                            await new Promise(resolve => setTimeout(resolve, retryDelay * (retryCount + 1)));
                            retryCount++;
                        } else {
                            console.warn('⚠️ Backend\'den veri yüklenemedi (max retry aşıldı)');
                            break;
                        }
                    } else {
                        break;
                    }
                } catch (apiError) {
                    console.warn(`⚠️ Backend yükleme hatası (deneme ${retryCount + 1}):`, apiError);
                    if (retryCount < maxRetries) {
                        await new Promise(resolve => setTimeout(resolve, retryDelay * (retryCount + 1)));
                        retryCount++;
                    } else {
                        console.warn('⚠️ Backend yükleme başarısız, localStorage kullanılacak');
                        break;
                    }
                }
            }
            
            if (userStats) {
                backendDataLoaded = true;
                
                totalPoints = parseInt(userStats.total_points) || 0;
                if (isNaN(totalPoints) || totalPoints < 0) totalPoints = 0;
                
                badges = userStats.badges || badges;
                streakData = userStats.streak_data || streakData;
                gameStats = userStats.game_stats || gameStats;
                perfectLessonsCount = userStats.perfect_lessons_count || 0;
                
                // Backend'den yüklenen verileri cache'e yaz
                localStorage.setItem('hasene_totalPoints', totalPoints.toString());
                if (badges) {
                    safeSetItem('hasene_badges', badges);
                    if (db) {
                        saveToIndexedDB('hasene_badges', badges).catch(() => {});
                    }
                }
                if (streakData) {
                    safeSetItem('hasene_streakData', streakData);
                    if (db) {
                        saveToIndexedDB('hasene_streakData', streakData).catch(() => {});
                    }
                    
                    // playDates güncellemesi arka planda yapılacak (Öncelik 4 - Lazy loading)
                    // Bu işlem uzun sürebilir, kritik değil
                    if (typeof window.loadAllDailyStatsDates === 'function') {
                        Promise.resolve().then(async () => {
                            try {
                                console.log('📅 ÖNCELİK 4: Daily stats tarihleri yükleniyor (arka plan)...');
                                const allDates = await window.loadAllDailyStatsDates();
                                if (allDates && allDates.length > 0) {
                                    const existingDates = new Set(streakData.playDates || []);
                                    allDates.forEach(date => {
                                        if (!existingDates.has(date)) {
                                            existingDates.add(date);
                                        }
                                    });
                                    streakData.playDates = Array.from(existingDates).sort();
                                    streakData.totalPlayDays = streakData.playDates.length;
                                    safeSetItem('hasene_streakData', streakData);
                                    if (db) {
                                        saveToIndexedDB('hasene_streakData', streakData).catch(() => {});
                                    }
                                    console.log('✅ Daily stats tarihleri yüklendi');
                                }
                            } catch (error) {
                                console.warn('daily_stats tarihlerini yükleme hatası (normal olabilir):', error);
                            }
                        });
                    }
                }
                if (gameStats) {
                    safeSetItem('gameStats', gameStats);
                }
                if (perfectLessonsCount !== undefined) {
                    localStorage.setItem('perfectLessonsCount', perfectLessonsCount.toString());
                }
                
                if (db) {
                    saveToIndexedDB('hasene_totalPoints', totalPoints.toString()).catch(() => {});
                }
                
                // UI'ı hemen güncelle (backend'den gelen verilerle)
                updateStatsBar();
                updateStreakDisplay();
                
                console.log('✅ ÖNCELİK 1: Kritik veriler backend\'den yüklendi ve UI güncellendi');
            } else {
                console.warn('⚠️ Backend\'den veri yüklenemedi (userStats null veya boş)');
            }
        } else {
            if (!user) {
                console.warn('⚠️ Kullanıcı giriş yapmamış, backend\'den veri yüklenemiyor');
            }
            if (typeof window.loadUserStats !== 'function') {
                console.warn('⚠️ window.loadUserStats fonksiyonu bulunamadı, backend entegrasyonu eksik');
            }
        }
        
        // Eğer backend'den yüklenmediyse, localStorage/IndexedDB'den yükle
        console.log('🔍 Backend yükleme sonrası durum:', {
            totalPoints,
            badgesStars: badges.stars,
            currentStreak: streakData.currentStreak,
            backendDataLoaded: backendDataLoaded ? '✅ Backend\'den yüklendi (0 değerleri de geçerli)' : '❌ Backend\'den yüklenemedi'
        });
        
        // ÖNEMLİ: Backend'den veri yüklendiyse (backendDataLoaded = true), localStorage'a düşme
        // Backend'den 0 gelmesi ile veri yüklenememesi farklı şeyler!
        if (!backendDataLoaded && totalPoints === 0 && badges.stars === 0 && streakData.currentStreak === 0) {
            console.log('📥 Backend\'den yüklenemedi, localStorage/IndexedDB\'den yükleniyor...');
            // IndexedDB'den yükle (öncelikli)
            const savedPoints = await loadFromIndexedDB('hasene_totalPoints');
            if (savedPoints !== null) {
                totalPoints = parseInt(savedPoints) || 0;
                // NaN kontrolü
                if (isNaN(totalPoints) || totalPoints < 0) totalPoints = 0;
            } else {
                // localStorage'dan yükle (yedek)
                totalPoints = parseInt(localStorage.getItem('hasene_totalPoints') || '0') || 0;
                // NaN kontrolü
                if (isNaN(totalPoints) || totalPoints < 0) totalPoints = 0;
            }

            const savedBadges = await loadFromIndexedDB('hasene_badges');
            if (savedBadges) {
                badges = savedBadges;
            } else {
                const localBadges = safeGetItem('hasene_badges', badges);
                badges = localBadges;
            }

            const savedStreak = await loadFromIndexedDB('hasene_streakData');
            if (savedStreak) {
                streakData = savedStreak;
            } else {
                const localStreak = safeGetItem('hasene_streakData', streakData);
                streakData = localStreak;
            }
        }

        // ============================================
        // ÖNCELİK 2: ÖNEMLİ VERİLER (Paralel yükleme)
        // ============================================
        // DailyTasks ve DailyGoal progress - Cache'den önce yükle, sonra backend'den güncelle
        console.log('⚡ ÖNCELİK 2: Önemli veriler yükleniyor (cache + backend paralel)...');
        
        // Önce cache'den dailyTasks yükle (hızlı gösterim için)
        const cachedDailyTasks = await loadFromIndexedDB('hasene_dailyTasks');
        if (cachedDailyTasks) {
            dailyTasks = cachedDailyTasks;
            if (dailyTasks.todayStats) {
                dailyTasks.todayStats.allGameModes = new Set(dailyTasks.todayStats.allGameModes || []);
                dailyTasks.todayStats.farklıZorluk = new Set(dailyTasks.todayStats.farklıZorluk || []);
                dailyTasks.todayStats.reviewWords = new Set(dailyTasks.todayStats.reviewWords || []);
            }
            updateDailyGoalDisplay();
            updateTasksDisplay();
            console.log('✅ ÖNCELİK 2: DailyTasks cache\'den yüklendi ve UI güncellendi');
        } else {
            const localDailyTasks = safeGetItem('hasene_dailyTasks', dailyTasks);
            dailyTasks = localDailyTasks;
            if (dailyTasks.todayStats) {
                dailyTasks.todayStats.allGameModes = new Set(dailyTasks.todayStats.allGameModes || []);
                dailyTasks.todayStats.farklıZorluk = new Set(dailyTasks.todayStats.farklıZorluk || []);
                dailyTasks.todayStats.reviewWords = new Set(dailyTasks.todayStats.reviewWords || []);
            }
            updateDailyGoalDisplay();
            updateTasksDisplay();
        }
        
        // Backend'den dailyTasks yükle (paralel, arka planda güncelle)
        if (user && typeof window.loadDailyTasks === 'function') {
            // Promise olarak başlat, await etme (paralel çalışsın)
            Promise.resolve().then(async () => {
                try {
                    console.log('📥 Backend\'den daily_tasks yükleniyor (arka plan)...');
                    const backendDailyTasks = await window.loadDailyTasks();
                    if (backendDailyTasks) {
                        dailyTasks = backendDailyTasks;
                        if (dailyTasks.todayStats) {
                            dailyTasks.todayStats.allGameModes = new Set(dailyTasks.todayStats.allGameModes || []);
                            dailyTasks.todayStats.farklıZorluk = new Set(dailyTasks.todayStats.farklıZorluk || []);
                            dailyTasks.todayStats.reviewWords = new Set(dailyTasks.todayStats.reviewWords || []);
                        }
                        
                        const dailyTasksToSave = {
                            ...dailyTasks,
                            todayStats: {
                                ...dailyTasks.todayStats,
                                allGameModes: Array.from(dailyTasks.todayStats.allGameModes || []),
                                farklıZorluk: Array.from(dailyTasks.todayStats.farklıZorluk || []),
                                reviewWords: Array.from(dailyTasks.todayStats.reviewWords || [])
                            }
                        };
                        safeSetItem('hasene_dailyTasks', dailyTasksToSave);
                        if (db) {
                            saveToIndexedDB('hasene_dailyTasks', dailyTasksToSave).catch(() => {});
                        }
                        
                        if (dailyTasks.todayStats) {
                            const todayPuan = dailyTasks.todayStats.toplamPuan || 0;
                            const todayDogru = dailyTasks.todayStats.toplamDogru || 0;
                            localStorage.setItem('dailyXP', todayPuan.toString());
                            localStorage.setItem('dailyCorrect', todayDogru.toString());
                            
                            // ÖNEMLİ: Backend'den gelen toplamPuan'ı hasene_daily_${today}.points'e de yaz
                            // Bu şekilde updateDailyGoalDisplay() doğru değeri gösterir
                            const today = getLocalDateString();
                            const dailyKey = `hasene_daily_${today}`;
                            const dailyData = safeGetItem(dailyKey, {
                                correct: 0,
                                wrong: 0,
                                points: 0,
                                gamesPlayed: 0,
                                perfectLessons: 0,
                                maxCombo: 0,
                                gameModes: {}
                            });
                            
                            // Backend'den gelen değer daha büyükse (senkronizasyon için)
                            if (todayPuan > (dailyData.points || 0)) {
                                dailyData.points = todayPuan;
                                dailyData.correct = todayDogru || dailyData.correct;
                                safeSetItem(dailyKey, dailyData);
                                console.log('🔄 Backend\'den gelen toplamPuan hasene_daily_points\'e yazıldı:', {
                                    backendToplamPuan: todayPuan,
                                    hasene_daily_points: dailyData.points,
                                    dailyKey
                                });
                            }
                            
                            if (dailyTasks.tasks || dailyTasks.bonusTasks) {
                                updateTaskProgressFromStats();
                            }
                        }
                        
                        // UI'ı güncelle
                        updateDailyGoalDisplay();
                        updateTasksDisplay();
                        console.log('✅ ÖNCELİK 2: DailyTasks backend\'den yüklendi ve UI güncellendi');
                    }
                } catch (apiError) {
                    console.warn('Backend daily tasks yükleme hatası:', apiError);
                }
            }).catch(err => {
                console.warn('DailyTasks backend yükleme hatası:', err);
            });
        }

        // Haftalık görevler kaldırıldı - backend yükleme devre dışı
        // (Haftalık görevler UI'dan kaldırıldı, backend çağrıları gereksiz)
        
        // Eğer backend'den yüklenmediyse, localStorage'dan yükle
        if (!weeklyTasks || !weeklyTasks.lastWeekStart) {
            // Haftalık görevler kaldırıldı - yükleme devre dışı
            // const savedWeeklyTasks = await loadFromIndexedDB('hasene_weeklyTasks');
            // ...
        }

        // ============================================
        // ÖNCELİK 3: DETAYLI VERİLER (Paralel lazy loading)
        // ============================================
        console.log('⚡ ÖNCELİK 3: Detaylı veriler paralel yükleniyor (wordStats, achievements, badges)...');
        
        // Önce cache'den yükle
        wordStats = safeGetItem('hasene_wordStats', {});
        if (typeof window !== 'undefined') {
            window.wordStats = wordStats;
        }
        
        // Backend'den paralel yükle (await etme, arka planda çalışsın)
        const loadDetailedDataPromises = [];
        
        // WordStats
        if (user && typeof window.loadWordStats === 'function') {
            loadDetailedDataPromises.push(
                window.loadWordStats().then(backendWordStats => {
                    if (backendWordStats && Object.keys(backendWordStats).length > 0) {
                        wordStats = backendWordStats;
                        if (typeof window !== 'undefined') {
                            window.wordStats = wordStats;
                        }
                        safeSetItem('hasene_wordStats', wordStats);
                        console.log('✅ WordStats backend\'den yüklendi');
                    }
                }).catch(err => console.warn('WordStats yükleme hatası:', err))
            );
        }
        
        // Eski wordStats formatını yeni spaced repetition formatına migrate et
        const todayForMigration = getLocalDateString();
        Object.keys(wordStats).forEach(wordId => {
            const stats = wordStats[wordId];
            
            // Eğer spaced repetition alanları yoksa, ekle
            if (stats.easeFactor === undefined) {
                stats.easeFactor = 2.5; // SM-2 başlangıç değeri
            }
            if (stats.interval === undefined) {
                // Eski verilere göre interval hesapla
                if (stats.attempts === 0) {
                    stats.interval = 0;
                } else if (stats.attempts === 1) {
                    stats.interval = 1; // İlk öğrenme
                } else if (stats.attempts === 2 && stats.correct === 2) {
                    stats.interval = 6; // İkinci doğru cevap
                } else {
                    // Tahmini interval (başarı oranına göre)
                    const estimatedInterval = Math.max(1, Math.floor(stats.attempts * stats.easeFactor));
                    stats.interval = estimatedInterval;
                }
            }
            if (stats.nextReviewDate === undefined) {
                // Son yanlış cevap varsa, 1 gün sonra tekrar
                if (stats.lastWrong) {
                    stats.nextReviewDate = addDays(todayForMigration, 1);
                } else if (stats.lastCorrect) {
                    // Son doğru cevap varsa, interval kadar sonra
                    stats.nextReviewDate = addDays(todayForMigration, stats.interval || 1);
                } else {
                    // Hiç veri yoksa, bugün tekrar et
                    stats.nextReviewDate = todayForMigration;
                }
            }
            if (stats.lastReview === undefined) {
                // Son tekrar tarihi yoksa, son doğru veya yanlış tarihini kullan
                stats.lastReview = stats.lastCorrect || stats.lastWrong || todayForMigration;
            }
        });
        // Achievements (cache'den önce yükle)
        const savedAchievements = safeGetItem('unlockedAchievements', []);
        if (savedAchievements.length > 0 && typeof savedAchievements[0] === 'string') {
            unlockedAchievements = savedAchievements.map((id, index) => ({
                id: id,
                unlockedAt: Date.now() - (savedAchievements.length - index) * 1000
            }));
            safeSetItem('unlockedAchievements', unlockedAchievements);
        } else {
            unlockedAchievements = savedAchievements;
        }
        
        // Backend'den achievements yükle (paralel)
        if (user && typeof window.loadAchievements === 'function') {
            loadDetailedDataPromises.push(
                window.loadAchievements().then(backendAchievements => {
                    if (backendAchievements && backendAchievements.length > 0) {
                        unlockedAchievements = backendAchievements;
                        safeSetItem('unlockedAchievements', unlockedAchievements);
                        console.log('✅ Achievements backend\'den yüklendi');
                    }
                }).catch(err => console.warn('Achievements yükleme hatası:', err))
            );
        }
        
        // Badges (cache'den önce yükle)
        const savedUnlockedBadges = safeGetItem('unlockedBadges', []);
        if (savedUnlockedBadges.length > 0 && typeof savedUnlockedBadges[0] === 'string') {
            unlockedBadges = savedUnlockedBadges.map((id, index) => ({
                id: id,
                unlockedAt: Date.now() - (savedUnlockedBadges.length - index) * 1000
            }));
            safeSetItem('unlockedBadges', unlockedBadges);
        } else {
            unlockedBadges = savedUnlockedBadges;
        }
        
        // Backend'den badges yükle (paralel)
        if (user && typeof window.loadBadges === 'function') {
            loadDetailedDataPromises.push(
                window.loadBadges().then(backendBadges => {
                    if (backendBadges && backendBadges.length > 0) {
                        unlockedBadges = backendBadges;
                        safeSetItem('unlockedBadges', unlockedBadges);
                        console.log('✅ Badges backend\'den yüklendi');
                    }
                }).catch(err => console.warn('Badges yükleme hatası:', err))
            );
        }
        
        // Tüm detaylı veriler paralel yüklensin (await etme, arka planda)
        if (loadDetailedDataPromises.length > 0) {
            Promise.allSettled(loadDetailedDataPromises).then(() => {
                console.log('✅ ÖNCELİK 3: Tüm detaylı veriler yüklendi');
            });
        }
        perfectLessonsCount = parseInt(safeGetItem('perfectLessonsCount', 0)) || 0;
        
        const savedGameStats = safeGetItem('gameStats', gameStats);
        // Güvenli bir şekilde gameStats'ı yükle
        if (savedGameStats && typeof savedGameStats === 'object') {
            gameStats = {
                totalCorrect: savedGameStats.totalCorrect || 0,
                totalWrong: savedGameStats.totalWrong || 0,
                gameModeCounts: savedGameStats.gameModeCounts || {
                    'kelime-cevir': 0,
                    'dinle-bul': 0,
                    'bosluk-doldur': 0,
                    'ayet-oku': 0,
                    'dua-et': 0,
                    'hadis-oku': 0
                }
            };
        } else {
            gameStats = {
                totalCorrect: 0,
                totalWrong: 0,
                gameModeCounts: {
                    'kelime-cevir': 0,
                    'dinle-bul': 0,
                    'bosluk-doldur': 0,
                    'ayet-oku': 0,
                    'dua-et': 0,
                    'hadis-oku': 0
                }
            };
        }

        // Günlük hedef
        const dailyGoalHasene = parseInt(localStorage.getItem('dailyGoalHasene') || CONFIG.DAILY_GOAL_DEFAULT.toString());
        const dailyGoalLevel = localStorage.getItem('dailyGoalLevel') || 'normal';
        localStorage.setItem('dailyGoalHasene', dailyGoalHasene.toString());
        localStorage.setItem('dailyGoalLevel', dailyGoalLevel);

        // Bugünkü istatistikler - ÖNEMLİ: Backend'den yüklenen dailyXP değerini koru
        const today = getLocalDateString();
        const lastDailyGoalDate = localStorage.getItem('lastDailyGoalDate');
        const backendDailyXP = localStorage.getItem('dailyXP'); // Backend'den yüklenen değer (yukarıda yazıldı)
        
        if (lastDailyGoalDate !== today) {
            // Yeni gün, günlük istatistikleri sıfırla
            // AMA: Eğer backend'den yüklendiyse (backendDailyXP varsa ve 0 değilse), backend verilerini koru
            if (!backendDailyXP || backendDailyXP === '0' || parseInt(backendDailyXP) === 0) {
                localStorage.setItem('dailyCorrect', '0');
                localStorage.setItem('dailyWrong', '0');
                localStorage.setItem('dailyXP', '0');
            } else {
                console.log('✅ Backend\'den yüklenen dailyXP korunuyor:', backendDailyXP);
            }
            localStorage.setItem('lastDailyGoalDate', today);
        } else {
            // Aynı gün, backend'den yüklenen değeri koru (zaten yazılmış)
            if (backendDailyXP) {
                console.log('✅ Aynı gün, backend dailyXP korunuyor:', backendDailyXP);
            }
        }

        // Görevleri kontrol et
        checkDailyTasks();
        // checkWeeklyTasks(); // Haftalık görevler UI'dan kaldırıldı

        // UI'ı güncelle - ÖNEMLİ: Backend verileri yüklendikten SONRA güncelle
        // DOM hazır olana kadar bekle
        function updateUIAfterLoad() {
            console.log('🔄 UI güncelleniyor...', {
                totalPoints,
                badges: badges.stars,
                currentStreak: streakData.currentStreak,
                dailyXP: localStorage.getItem('dailyXP')
            });
            
            // Elementleri yeniden bul (DOM henüz hazır olmayabilir)
            elements.totalPointsEl = document.getElementById('total-points');
            elements.starPointsEl = document.getElementById('star-points');
            elements.currentLevelEl = document.getElementById('current-level');
            elements.dailyGoalProgress = document.getElementById('daily-goal-progress');
            elements.dailyGoalCurrent = document.getElementById('daily-goal-current');
            elements.dailyGoalTarget = document.getElementById('daily-goal-target');
            elements.dailyGoalPercent = document.getElementById('daily-goal-percent');
            elements.currentStreakEl = document.getElementById('current-streak');
            
            updateStatsBar();
            updateDailyGoalDisplay();
            updateStreakDisplay(); // Streak'i de güncelle
            updateTasksDisplay(); // Görev sayacını güncelle
            
            console.log('✅ UI güncellendi');
        }
        
        // DOM hazır olana kadar bekle, sonra UI'ı güncelle
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                // DOM hazır, biraz daha bekle (elementlerin render edilmesi için)
                setTimeout(() => {
                    updateUIAfterLoad();
                }, 100);
            });
        } else {
            // DOM zaten hazır, biraz bekle ve güncelle
            setTimeout(() => {
                updateUIAfterLoad();
            }, 100);
        }

        infoLog('İstatistikler yüklendi');
        console.log('✅ loadStats tamamlandı - UI güncellendi');
    } catch (error) {
        errorLog('İstatistik yükleme hatası:', error);
    }
}

/**
 * Tüm istatistikleri kaydeder
 */
async function saveStats() {
    try {
        console.log('🟣 saveStats çağrıldı');
        
        // localStorage'a hemen kaydet (en hızlı - senkron)
        localStorage.setItem('hasene_totalPoints', totalPoints.toString());
        safeSetItem('hasene_badges', badges);
        safeSetItem('hasene_streakData', streakData);
        
        // Set'leri array'e çevir (hem backend hem IndexedDB için)
        const dailyTasksToSave = {
            ...dailyTasks,
            todayStats: {
                ...dailyTasks.todayStats,
                allGameModes: Array.from(dailyTasks.todayStats.allGameModes || []),
                farklıZorluk: Array.from(dailyTasks.todayStats.farklıZorluk || []),
                reviewWords: Array.from(dailyTasks.todayStats.reviewWords || [])
            }
        };
        
        // Backend ve IndexedDB kayıtlarını paralel yap (performans için)
        const savePromises = [];
        
        // Backend API kayıtları
        if (typeof window.saveUserStats === 'function') {
            savePromises.push(
                window.saveUserStats({
                    total_points: totalPoints,
                    badges: badges,
                    streak_data: streakData,
                    game_stats: gameStats,
                    perfect_lessons_count: perfectLessonsCount
                }).then(() => {
                    console.log('✅ Backend\'e istatistikler kaydedildi');
                }).catch(apiError => {
                    console.error('❌ Backend kaydetme hatası:', apiError);
                    console.warn('Backend kaydetme hatası, localStorage kullanılıyor:', apiError);
                })
            );
        }
        
        // Günlük görevleri backend'e kaydet
        if (typeof window.saveDailyTasks === 'function') {
            savePromises.push(
                window.saveDailyTasks(dailyTasks).catch(apiError => {
                    console.warn('Backend daily tasks kaydetme hatası:', apiError);
                })
            );
        }
        
        // IndexedDB kayıtları (paralel)
        if (typeof saveToIndexedDB === 'function') {
            savePromises.push(
                saveToIndexedDB('hasene_totalPoints', totalPoints.toString()).catch(err => {
                    warnLog('IndexedDB kayıt hatası (totalPoints):', err);
                })
            );
            savePromises.push(
                saveToIndexedDB('hasene_badges', badges).catch(err => {
                    warnLog('IndexedDB kayıt hatası (badges):', err);
                })
            );
            savePromises.push(
                saveToIndexedDB('hasene_streakData', streakData).catch(err => {
                    warnLog('IndexedDB kayıt hatası (streakData):', err);
                })
            );
            savePromises.push(
                saveToIndexedDB('hasene_dailyTasks', dailyTasksToSave).catch(err => {
                    warnLog('IndexedDB kayıt hatası (dailyTasks):', err);
                })
            );
        }
        
        // Tüm paralel kayıtları bekle (hızlı tamamlanır)
        if (savePromises.length > 0) {
            await Promise.allSettled(savePromises);
        }

        // localStorage'a diğer verileri kaydet (yedek - offline destek için)
        safeSetItem('hasene_dailyTasks', dailyTasksToSave);
        
            // Haftalık görevler kaldırıldı - localStorage kaydı devre dışı
            // const weeklyTasksToSave = { ...weeklyTasks, ... };
            // safeSetItem('hasene_weeklyTasks', weeklyTasksToSave);
        
        safeSetItem('hasene_wordStats', wordStats);
        safeSetItem('unlockedAchievements', unlockedAchievements);
        safeSetItem('unlockedBadges', unlockedBadges);
        safeSetItem('perfectLessonsCount', perfectLessonsCount);
        safeSetItem('gameStats', gameStats);
        
        // Kelime istatistiklerini Supabase'e kaydet (async, hata olsa bile devam et)
        if (typeof window.saveWordStat === 'function' && wordStats && Object.keys(wordStats).length > 0) {
            // Tüm kelime istatistiklerini kaydet (paralel olarak)
            const savePromises = Object.keys(wordStats).map(wordId => {
                return window.saveWordStat(wordId, wordStats[wordId]).catch(error => {
                    // RLS hatası (42501) sessizce yakalanıyor, diğer hatalar için uyarı
                    const isRLSError = error?.code === '42501' || 
                                      error?.code === 'PGRST301' ||
                                      error?.message?.includes('row-level security') ||
                                      error?.message?.includes('RLS');
                    
                    if (!isRLSError) {
                        // RLS dışındaki hatalar için uyarı göster
                    console.warn(`Supabase'e kelime ${wordId} kaydedilemedi:`, error);
                    }
                    // RLS hatası için sessiz fallback (saveWordStat içinde zaten localStorage'a kaydediliyor)
                });
            });
            // Tüm kayıtların tamamlanmasını bekle (ama hata olsa bile devam et)
            Promise.all(savePromises).catch(() => {
                // Hatalar zaten yukarıda yakalandı, burada sadece log
            });
        }

        debugLog('İstatistikler kaydedildi');
    } catch (error) {
        errorLog('İstatistik kaydetme hatası:', error);
    }
}

/**
 * Debounced kaydetme
 */
const debouncedSaveStats = debounce(saveStats, CONFIG.DEBOUNCE_DELAY);

/**
 * Anında kaydetme (oyun bitişinde)
 */
async function saveStatsImmediate() {
    console.log('🟡 saveStatsImmediate çağrıldı');
    try {
        await saveStats();
        console.log('🟢 saveStatsImmediate tamamlandı');
    } catch (error) {
        console.error('❌ saveStatsImmediate hatası:', error);
    }
}

// ============================================
// PUAN SİSTEMİ
// ============================================

/**
 * Seviye hesaplar
 */
function calculateLevel(points) {
    if (points < LEVELS.THRESHOLDS[2]) return 1;
    if (points < LEVELS.THRESHOLDS[3]) return 2;
    if (points < LEVELS.THRESHOLDS[4]) return 3;
    if (points < LEVELS.THRESHOLDS[5]) return 4;
    if (points < LEVELS.THRESHOLDS[10]) return 5;
    
    // Level 10'dan sonra
    let level = 10;
    let threshold = LEVELS.THRESHOLDS[10];
    while (points >= threshold + LEVELS.INCREMENT_AFTER_10) {
        threshold += LEVELS.INCREMENT_AFTER_10;
        level++;
    }
    
    return level;
}

/**
 * Mertebe ismini döndürür
 */
function getLevelName(level) {
    if (level <= 4) {
        return LEVELS.NAMES[level] || 'Mübtedi';
    } else if (level < 10) {
        return LEVELS.NAMES[5] || 'Mütebahhir';
    } else {
        return LEVELS.NAMES[10] || 'Mütebahhir';
    }
}

/**
 * Rozetleri hesaplar
 */
function calculateBadges(points) {
    // Yıldız kazanma: 250 Hasene = 1 Yıldız (daha dengeli - 25 doğru cevap gerekir)
    const stars = Math.floor(points / 250);
    // Diğer rozetler aynı oranlarda (5 yıldız = 1 bronz, vb.)
    const bronze = Math.floor(stars / 5);
    const silver = Math.floor(bronze / 5);
    const gold = Math.floor(silver / 5);
    const diamond = Math.floor(gold / 5);
    
    return { stars, bronze, silver, gold, diamond };
}

/**
 * Session puanı ekler
 */
function addSessionPoints(points) {
    sessionScore += points;
    updateUI();
}

/**
 * Günlük XP ekler
 */
function addDailyXP(points) {
    const currentXP = parseInt(localStorage.getItem('dailyXP') || '0');
    const newXP = currentXP + points;
    localStorage.setItem('dailyXP', newXP.toString());
    updateDailyGoalDisplay();
}

/**
 * Global puanlara ekler
 */
async function addToGlobalPoints(points, correctAnswers, skipDetailedStats = false) {
    const oldLevel = calculateLevel(totalPoints);
    totalPoints += points;
    const newLevel = calculateLevel(totalPoints);
    
    // Rozetleri güncelle
    badges = calculateBadges(totalPoints);
    
    // Günlük XP ekle
    addDailyXP(points);
    
    // Seviye atlama kontrolü
    if (newLevel > oldLevel) {
        showLevelUpModal(newLevel);
    }
    
    // UI'ı güncelle
    updateStatsBar();
    
    // Detaylı istatistiklere ekle (haftalık/aylık için)
    // NOT: skipDetailedStats=true ise atla (çünkü her soru zaten saveDetailedStats ile kaydedildi)
    // Bu parametre sadece endGame içinde kullanılır, bonus puanlar için false olmalı
    if (!skipDetailedStats) {
        // Bonus puanlar (günlük hedef, perfect lesson vb.) için detaylı istatistiklere ekle
    saveDetailedStats(points, 0, 0, 0, 0, false);
    }
    
    // Kaydet
    await saveStatsImmediate();
    
    // Rozetleri kontrol et
    checkBadges();
    
    // Başarımları kontrol et
    checkAchievements();
    
    // Streak güncelle
    if (correctAnswers > 0) {
        updateDailyProgress(correctAnswers);
    }
    
    // Haftalık XP'yi güncelle (Leaderboard için)
    if (typeof window.updateWeeklyXP === 'function') {
        try {
            await window.updateWeeklyXP(points);
        } catch (error) {
            console.warn('Weekly XP update failed:', error);
        }
    }
}

/**
 * Üst barı güncelle
 */
function updateStatsBar() {
    // Elementler henüz yüklenmemişse, yeniden oluştur
    if (!elements.totalPointsEl || !elements.starPointsEl || !elements.currentLevelEl) {
        elements.totalPointsEl = document.getElementById('total-points');
        elements.starPointsEl = document.getElementById('star-points');
        elements.currentLevelEl = document.getElementById('current-level');
    }
    
    if (elements.totalPointsEl) {
        elements.totalPointsEl.textContent = formatNumber(totalPoints);
    }
    
    if (elements.starPointsEl) {
        elements.starPointsEl.textContent = formatNumber(badges.stars);
    }
    
    const level = calculateLevel(totalPoints);
    if (elements.currentLevelEl) {
        elements.currentLevelEl.textContent = level;
    }
}

/**
 * Günlük hedef görüntüsünü güncelle
 */
function updateDailyGoalDisplay() {
    // GÜNLÜK VİRD SADECE HASENE PUAN VE KAZANILAN TÜM BONUS, COMBO, HEDİYE VS PUANLARA GÖRE ENDEKSLENMİŞTİR
    // Doğru cevap sayısına değil, sadece Hasene puanına göre
    const dailyGoalHasene = parseInt(localStorage.getItem('dailyGoalHasene') || CONFIG.DAILY_GOAL_DEFAULT.toString());
    
    // ÖNEMLİ: hasene_daily_${today}.points kullan (daha güvenilir - her soru için kaydedilir)
    // dailyXP fallback olarak kullan (geriye dönük uyumluluk için)
    const today = getLocalDateString();
    const dailyKey = `hasene_daily_${today}`;
    const dailyData = safeGetItem(dailyKey, { points: 0 });
    const dailyPointsFromDetailed = dailyData.points || 0;
    const dailyXP = parseInt(localStorage.getItem('dailyXP') || '0');
    
    // hasene_daily_${today}.points daha güvenilir (her soru için kaydedilir)
    // Ama eğer dailyXP daha büyükse (backend senkronizasyonu nedeniyle), onu kullan
    const dailyXPToUse = Math.max(dailyPointsFromDetailed, dailyXP);
    
    const percent = Math.min(100, Math.floor((dailyXPToUse / dailyGoalHasene) * 100));
    
    console.log('🔄 updateDailyGoalDisplay çağrıldı:', {
        dailyXPToUse,
        dailyPointsFromDetailed,
        dailyXP,
        dailyGoalHasene,
        percent,
        kullanilan: dailyXPToUse === dailyPointsFromDetailed ? 'hasene_daily_points' : 'dailyXP',
        elements: {
            dailyGoalProgress: !!elements.dailyGoalProgress,
            dailyGoalCurrent: !!elements.dailyGoalCurrent,
            dailyGoalTarget: !!elements.dailyGoalTarget
        }
    });
    
    if (elements.dailyGoalProgress) {
        elements.dailyGoalProgress.style.width = percent + '%';
        console.log('✅ dailyGoalProgress güncellendi:', percent + '%');
    }
    
    if (elements.dailyGoalCurrent) {
        elements.dailyGoalCurrent.textContent = formatNumber(dailyXPToUse);
        console.log('✅ dailyGoalCurrent güncellendi:', formatNumber(dailyXPToUse));
    }
    
    if (elements.dailyGoalTarget) {
        elements.dailyGoalTarget.textContent = formatNumber(dailyGoalHasene);
        console.log('✅ dailyGoalTarget güncellendi:', formatNumber(dailyGoalHasene));
    }
    
    if (elements.dailyGoalPercent) {
        elements.dailyGoalPercent.textContent = `(${percent}%)`;
    }
    
    // Günlük hedef tamamlandı mı?
    if (dailyXPToUse >= dailyGoalHasene && !localStorage.getItem('dailyGoalCompleted')) {
        localStorage.setItem('dailyGoalCompleted', 'true');
        const dailyGoalBonus = 100;
        // skipDetailedStats=true çünkü aşağıda manuel olarak saveDetailedStats çağrılıyor
        addToGlobalPoints(dailyGoalBonus, 0, true); // Bonus
        // Günlük vird bonusunu detaylı istatistiklere ekle
        saveDetailedStats(dailyGoalBonus, 0, 0, 0, 0);
        showSuccessMessage('🎉 Günlük virdi tamamladınız! +100 Hasene');
    }
}

/**
 * Streak görüntüsünü güncelle
 */
function updateStreakDisplay() {
    // Element henüz yüklenmemişse, yeniden oluştur
    if (!elements.currentStreakEl) {
        elements.currentStreakEl = document.getElementById('current-streak');
    }
    
    if (elements.currentStreakEl) {
        elements.currentStreakEl.textContent = streakData.currentStreak;
    }
    
    // Bugün ilerlemesi artık "Günlük Vird" bölümünde gösteriliyor
}

// ============================================
// OYUN FONKSİYONLARI - KELİME ÇEVİR
// ============================================

/**
 * Kelime Çevir oyununu başlatır
 */
async function startKelimeCevirGame(subMode) {
    currentGame = 'kelime-cevir';
    currentGameMode = 'kelime-cevir';
    currentSubMode = subMode;
    window.currentGame = currentGame;
    window.currentGameMode = currentGameMode;
    window.currentSubMode = currentSubMode;
    currentQuestion = 0;
    sessionScore = 0;
    sessionCorrect = 0;
    sessionWrong = 0;
    comboCount = 0;
    maxCombo = 0;
    hintUsed = false;
    // Can sistemi kaldırıldı
    lives = -1;
    
    // Doğru cevap pozisyon takibini sıfırla
    correctAnswerPositions = {
        count: [0, 0, 0, 0],
        total: 0
    };
    
    // Verileri yükle
    const allWords = await loadKelimeData();
    if (!allWords || allWords.length === 0) {
        showErrorMessage('Kelime verileri yüklenemedi!');
        return;
    }
    
    // Tüm kelime verilerini sakla (yanlış cevaplar için)
    allWordsData = allWords;
    
    // Filtrele - Zorluk seviyesine göre
    infoLog(`Kelime Çevir oyunu başlatılıyor - Zorluk: ${currentDifficulty}`);
    let filteredWords = filterByDifficulty(allWords, currentDifficulty);
    infoLog(`Filtrelenmiş kelime sayısı: ${filteredWords.length}`);
    
    let strugglingWordIds = [];
    let isReviewMode = false;
    
    if (subMode === 'classic') {
        // Klasik oyun: Sadece zorluk seviyesine göre filtreleme (ekstra filtre yok)
        infoLog(`Klasik oyun modu: ${filteredWords.length} kelime`);
    } else if (subMode === 'juz30') {
        filteredWords = filterJuz30(filteredWords);
        infoLog(`30.cüz filtresi uygulandı: ${filteredWords.length} kelime`);
    } else if (subMode === 'review') {
        // Zorlanılan kelimeleri al
        strugglingWordIds = getStrugglingWords();
        if (strugglingWordIds.length > 0) {
            // Zorlanılan kelimelerin ID'lerini kullanarak gerçek kelime verilerini filtrele
            const strugglingIdsSet = new Set(strugglingWordIds.map(w => w.id));
            filteredWords = filteredWords.filter(w => strugglingIdsSet.has(w.id));
            infoLog(`Tekrar et filtresi uygulandı: ${filteredWords.length} kelime (${strugglingWordIds.length} zorlanılan kelime bulundu)`);
            
            // Eğer zorlanılan kelimeler yeterli değilse uyarı ver
            if (filteredWords.length < CONFIG.QUESTIONS_PER_GAME) {
                showCustomAlert(`⚠️ Sadece ${filteredWords.length} zorlanılan kelime bulundu. Oyun normal kelimelerle devam edecek.`, 'info');
                // Normal kelimelerle devam et
                filteredWords = filterByDifficulty(allWords, currentDifficulty);
                isReviewMode = false; // Yeterli kelime yoksa review mode'u kapat
            } else {
                isReviewMode = true; // Yeterli zorlanılan kelime varsa review mode aktif
            }
        } else {
            // Zorlanılan kelime yoksa kullanıcıya bilgi ver
            const hasPlayedBefore = Object.keys(wordStats).length > 0;
            if (hasPlayedBefore) {
                showCustomAlert('ℹ️ Henüz yanlış cevaplanan kelime bulunmuyor. Oyun normal kelimelerle devam edecek.', 'info');
            } else {
                showCustomAlert('ℹ️ İlk oyununuz! Oyunu oynadıkça yanlış cevapladığınız kelimeler bu modda tekrar edilecek.', 'info');
            }
            infoLog('Tekrar et modu: Zorlanılan kelime bulunamadı, normal moda geçiliyor');
            // Normal kelimelerle devam et (filteredWords zaten doğru)
            isReviewMode = false;
        }
    } else if (subMode === 'favorites') {
        // Favori kelimeleri al
        if (typeof getFavoriteWords === 'undefined' || typeof loadFavorites === 'undefined') {
            showErrorMessage('Favori kelimeler modülü yüklenemedi!');
            return;
        }
        
        if (typeof loadFavorites === 'function') {
            loadFavorites();
        }
        
        const favoriteWordIds = getFavoriteWords();
        if (favoriteWordIds.length === 0) {
            showCustomAlert('⭐ Henüz favori kelime eklenmemiş. Kelime istatistikleri sayfasından kelimeleri favorilere ekleyebilirsiniz.', 'info');
            return;
        }
        
        // Favori kelimelerin ID'lerini kullanarak gerçek kelime verilerini filtrele
        const favoriteIdsSet = new Set(favoriteWordIds);
        filteredWords = filteredWords.filter(w => favoriteIdsSet.has(w.id));
        infoLog(`Favori kelimeler filtresi uygulandı: ${filteredWords.length} kelime (${favoriteWordIds.length} favori kelime bulundu)`);
        
        // Eğer favori kelimeler yeterli değilse uyarı ver
        if (filteredWords.length < CONFIG.QUESTIONS_PER_GAME) {
            showCustomAlert(`⚠️ Sadece ${filteredWords.length} favori kelime bulundu. En az ${CONFIG.QUESTIONS_PER_GAME} favori kelime eklemeniz gerekiyor.`, 'warning');
            return;
        }
    }
    
    if (filteredWords.length < CONFIG.QUESTIONS_PER_GAME) {
        showErrorMessage('Yeterli kelime bulunamadı!');
        return;
    }
    
    // Soruları seç (akıllı algoritma ile)
    // Review mode'da zorlanılan kelimelere ekstra öncelik ver
    questions = selectIntelligentWords(filteredWords, CONFIG.QUESTIONS_PER_GAME, isReviewMode);
    
    // Ekranı göster
    document.getElementById('kelime-submode-selection').style.display = 'none';
    document.getElementById('kelime-game-content').style.display = 'block';
    
    // İlk soruyu yükle
    loadKelimeQuestion();
    
    // Can gösterimi kaldırıldı
    const livesDisplay = document.getElementById('lives-display');
    if (livesDisplay) {
        livesDisplay.style.display = 'none';
    }
}

/**
 * Kelime Çevir sorusu yükler
 */
function loadKelimeQuestion() {
    // Oyun bitti mi kontrol et
    if (!questions || questions.length === 0) {
        console.warn('⚠️ Kelime Çevir: Soru listesi boş, oyun bitiriliyor');
        endGame();
        return;
    }
    if (currentQuestion >= questions.length) {
        endGame();
        return;
    }
    
    currentQuestionData = questions[currentQuestion];
    hintUsed = false;
    
    // Arapça kelimeyi göster
    const arabicWordEl = document.getElementById('arabic-word');
    if (arabicWordEl) {
        arabicWordEl.textContent = currentQuestionData.kelime;
    }
    
    // Kelime ID'sini göster
    const kelimeIdEl = document.getElementById('kelime-id');
    if (kelimeIdEl && currentQuestionData.id) {
        kelimeIdEl.textContent = currentQuestionData.id;
        kelimeIdEl.style.display = 'inline';
    } else if (kelimeIdEl) {
        kelimeIdEl.style.display = 'none';
    }
    
    // Ses çal butonu - Audio Manager kullan
    const playAudioBtn = document.getElementById('kelime-play-audio-btn');
    if (playAudioBtn && typeof setupAudioButton === 'function') {
        setupAudioButton(playAudioBtn, currentQuestionData.ses_dosyasi);
    } else if (playAudioBtn) {
        // Fallback: Eski yöntem (audio-manager yüklenmemişse)
        if (currentQuestionData.ses_dosyasi) {
            playAudioBtn.onclick = () => {
                if (typeof playAudio === 'function') {
                    playAudio(currentQuestionData.ses_dosyasi, playAudioBtn);
                }
            };
            playAudioBtn.disabled = false;
            playAudioBtn.style.opacity = '1';
        } else {
            playAudioBtn.style.opacity = '0.5';
            playAudioBtn.disabled = true;
        }
    }
    
    // Seçenekleri oluştur
    const correctAnswer = currentQuestionData.anlam;
    // Tüm kelimelerden yanlış cevapları al ve rastgele seç
    // Önce tüm kelime verilerinden, yoksa questions'dan
    const sourceData = allWordsData || questions;
    const uniqueWrongMeanings = sourceData
        .filter(w => w.id !== currentQuestionData.id && w.anlam !== correctAnswer)
        .map(w => w.anlam)
        .filter((v, i, a) => a.indexOf(v) === i); // Tekrarları kaldır
    
    // Rastgele 3 yanlış cevap seç
    const wrongAnswers = getRandomItems(uniqueWrongMeanings, 3);
    
    // Eşit dağılımlı karıştırma
    const allOptions = [correctAnswer, ...wrongAnswers];
    const shuffled = shuffleWithEqualDistribution(
        allOptions,
        correctAnswer,
        correctAnswerPositions.count
    );
    const options = shuffled.options;
    const correctIndex = shuffled.correctIndex;
    
    // Doğru cevap pozisyonunu sakla (yanlış cevap durumunda göstermek için)
    currentQuestionData.correctIndex = correctIndex;
    
    // Pozisyon sayacını güncelle
    correctAnswerPositions.count[correctIndex]++;
    correctAnswerPositions.total++;
    
    // Butonları güncelle
    const optionButtons = document.querySelectorAll('#kelime-cevir-screen .option-btn');
    optionButtons.forEach((btn, index) => {
        btn.textContent = options[index];
        btn.classList.remove('correct', 'wrong', 'disabled');
        btn.disabled = false;
        btn.onclick = () => checkKelimeAnswer(index, index === correctIndex);
    });
    
    // Soru numarası
    const questionNumberEl = document.getElementById('question-number');
    if (questionNumberEl) {
        questionNumberEl.textContent = `${currentQuestion + 1}/${questions.length}`;
    }
    
    // İpucu butonunu sıfırla
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) {
        hintBtn.disabled = false;
    }
}

/**
 * Kelime Çevir cevabını kontrol eder
 */
function checkKelimeAnswer(selectedIndex, isCorrect) {
    const optionButtons = document.querySelectorAll('#kelime-cevir-screen .option-btn');
    
    // Tüm butonları devre dışı bırak
    optionButtons.forEach(btn => {
        btn.disabled = true;
        btn.onclick = null;
    });
    
    if (isCorrect) {
        // Doğru cevap
        optionButtons[selectedIndex].classList.add('correct');
        sessionCorrect++;
        comboCount++;
        if (comboCount > maxCombo) maxCombo = comboCount;
        
        // Puan ekle - Kelimenin difficulty değerine göre (temel puan)
        let points = currentQuestionData.difficulty ?? CONFIG.POINTS_CORRECT;
        
        // Combo bonusu - Her doğru cevap için (doğru sayısına endeksli)
        const comboBonus = CONFIG.COMBO_BONUS_PER_CORRECT;
        points += comboBonus;
        
        addSessionPoints(points);
        
        // Kelime istatistiği
        updateWordStats(currentQuestionData.id, true);
        
        // Combo gösterimi kaldırıldı - performans ve kullanıcı odaklanması için
        // showComboBonus();
        
        playSound('correct');
        
        // Her soru cevaplandığında anında kaydet ve modal açıksa yenile
        // Combo bonusu her doğru cevapta olduğu için maxCombo değeri gönderiliyor
        saveDetailedStats(points, 1, 0, comboCount, 0);
        if (typeof refreshDetailedStatsIfOpen === 'function') {
            refreshDetailedStatsIfOpen();
        }
        
        // Bir sonraki soruya geç
        setTimeout(() => {
            currentQuestion++;
            loadKelimeQuestion();
        }, 1500);
    } else {
        // Yanlış cevap
        optionButtons[selectedIndex].classList.add('wrong');
        
        // Doğru cevabı göster
        if (currentQuestionData.correctIndex !== undefined) {
            optionButtons[currentQuestionData.correctIndex].classList.add('correct');
        } else {
            // Fallback: eski yöntem
            optionButtons.forEach((btn, index) => {
                const optionText = btn.textContent;
                if (optionText === currentQuestionData.anlam) {
                    btn.classList.add('correct');
                }
            });
        }
        
        sessionWrong++;
        comboCount = 0;
        
        // Puan kaybı yok - sadece doğru cevap gösterilir
        // addSessionPoints çağrılmıyor
        
        // Kelime istatistiği
        updateWordStats(currentQuestionData.id, false);
        
        // Can sistemi kaldırıldı - oyun devam eder
        
        playSound('wrong');
        
        // Her soru cevaplandığında anında kaydet ve modal açıksa yenile
        saveDetailedStats(0, 0, 1, 0, 0);
        if (typeof refreshDetailedStatsIfOpen === 'function') {
            refreshDetailedStatsIfOpen();
        }
        
        // Bir sonraki soruya geç
        setTimeout(() => {
            currentQuestion++;
            loadKelimeQuestion();
        }, 2000);
    }
    
    // Session skorunu güncelle
    const sessionScoreEl = document.getElementById('session-score');
    if (sessionScoreEl) {
        sessionScoreEl.textContent = `Hasene: ${sessionScore}`;
    }
}

/**
 * İpucu kullanır
 */
function handleHint() {
    if (hintUsed) return;
    
    hintUsed = true;
    const optionButtons = document.querySelectorAll('#kelime-cevir-screen .option-btn');
    const correctAnswer = currentQuestionData.anlam;
    
    // Yanlış bir seçeneği kaldır
    const wrongButtons = Array.from(optionButtons).filter(btn => 
        btn.textContent !== correctAnswer && !btn.disabled
    );
    
    if (wrongButtons.length > 0) {
        const randomWrong = getRandomItem(wrongButtons);
        randomWrong.classList.add('disabled');
        randomWrong.disabled = true;
    }
    
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) {
        hintBtn.disabled = true;
    }
}

/**
 * Combo bonusu gösterir
 * NOT: Kullanıcı isteği üzerine devre dışı bırakıldı - performans ve odaklanma için
 */
function showComboBonus() {
    // Combo gösterimi kaldırıldı - performans ve kullanıcı odaklanması için
    return;
    /*
    const comboDisplay = document.getElementById('combo-display');
    if (comboDisplay) {
        comboDisplay.style.display = 'block';
        const comboCountEl = document.getElementById('combo-count');
        if (comboCountEl) {
            comboCountEl.textContent = comboCount;
        }
        // 2 saniye sonra otomatik gizle
        setTimeout(() => {
            comboDisplay.style.display = 'none';
        }, 2000);
    }
    */
}

// ============================================
// OYUN FONKSİYONLARI - DİNLE BUL
// ============================================

/**
 * Dinle Bul oyununu başlatır
 */
async function startDinleBulGame() {
    currentGame = 'dinle-bul';
    currentGameMode = 'dinle-bul';
    window.currentGame = currentGame;
    window.currentGameMode = currentGameMode;
    currentQuestion = 0;
    sessionScore = 0;
    sessionCorrect = 0;
    sessionWrong = 0;
    comboCount = 0;
    maxCombo = 0;
    
    const allWords = await loadKelimeData();
    if (!allWords || allWords.length === 0) {
        showErrorMessage('Kelime verileri yüklenemedi!');
        return;
    }
    
    // Tüm kelime verilerini sakla (yanlış cevaplar için)
    allWordsData = allWords;
    
    // Filtrele - Zorluk seviyesine göre
    infoLog(`Dinle Bul oyunu başlatılıyor - Zorluk: ${currentDifficulty}`);
    let filteredWords = filterByDifficulty(allWords, currentDifficulty);
    infoLog(`Filtrelenmiş kelime sayısı: ${filteredWords.length}`);
    
    if (filteredWords.length < CONFIG.QUESTIONS_PER_GAME) {
        showErrorMessage('Yeterli kelime bulunamadı!');
        return;
    }
    
    // Soruları seç (akıllı algoritma ile)
    questions = selectIntelligentWords(filteredWords, CONFIG.QUESTIONS_PER_GAME, false);
    
    loadDinleQuestion();
}

/**
 * Dinle Bul sorusu yükler
 */
function loadDinleQuestion() {
    // Oyun bitti mi kontrol et
    if (!questions || questions.length === 0) {
        console.warn('⚠️ Dinle Bul: Soru listesi boş, oyun bitiriliyor');
        endGame();
        return;
    }
    if (currentQuestion >= questions.length) {
        endGame();
        return;
    }
    
    currentQuestionData = questions[currentQuestion];
    
    // Kelime ID'sini göster
    const dinleIdEl = document.getElementById('dinle-id');
    if (dinleIdEl && currentQuestionData.id) {
        dinleIdEl.textContent = currentQuestionData.id;
        dinleIdEl.style.display = 'inline';
    } else if (dinleIdEl) {
        dinleIdEl.style.display = 'none';
    }
    
    // Ses çal (otomatik) - Audio Manager kullan
    if (typeof stopCurrentAudio === 'function') {
        stopCurrentAudio();
    }
    if (typeof playAudio === 'function' && currentQuestionData.ses_dosyasi) {
        playAudio(currentQuestionData.ses_dosyasi);
    }
    
    // Ses çal butonunu güncelle - Audio Manager kullan
    const playBtn = document.getElementById('play-audio-btn');
    if (playBtn && typeof setupAudioButton === 'function') {
        setupAudioButton(playBtn, currentQuestionData.ses_dosyasi);
    } else if (playBtn) {
        // Fallback: Eski yöntem (audio-manager yüklenmemişse)
        if (currentQuestionData.ses_dosyasi) {
            playBtn.onclick = () => {
                if (typeof playAudio === 'function') {
                    playAudio(currentQuestionData.ses_dosyasi, playBtn);
                }
            };
            playBtn.disabled = false;
            playBtn.style.opacity = '1';
        } else {
            playBtn.style.opacity = '0.5';
            playBtn.disabled = true;
        }
    }
    
    // Seçenekleri oluştur
    const correctAnswer = currentQuestionData.kelime;
    // Tüm kelimelerden yanlış cevapları al ve rastgele seç
    // Önce tüm kelime verilerinden, yoksa questions'dan
    const sourceData = allWordsData || questions;
    const uniqueWrongWords = sourceData
        .filter(w => w.id !== currentQuestionData.id && w.kelime !== correctAnswer)
        .map(w => w.kelime)
        .filter((v, i, a) => a.indexOf(v) === i); // Tekrarları kaldır
    
    // Rastgele 3 yanlış cevap seç
    const wrongAnswers = getRandomItems(uniqueWrongWords, 3);
    
    // Eşit dağılımlı karıştırma
    const allOptions = [correctAnswer, ...wrongAnswers];
    const shuffled = shuffleWithEqualDistribution(
        allOptions,
        correctAnswer,
        correctAnswerPositions.count
    );
    const options = shuffled.options;
    const correctIndex = shuffled.correctIndex;
    
    // Doğru cevap pozisyonunu sakla (yanlış cevap durumunda göstermek için)
    currentQuestionData.correctIndex = correctIndex;
    
    // Pozisyon sayacını güncelle
    correctAnswerPositions.count[correctIndex]++;
    correctAnswerPositions.total++;
    
    // Butonları güncelle
    const optionButtons = document.querySelectorAll('#dinle-bul-screen .option-btn');
    optionButtons.forEach((btn, index) => {
        btn.textContent = options[index];
        btn.classList.remove('correct', 'wrong', 'disabled');
        btn.disabled = false;
        btn.onclick = () => checkDinleAnswer(index, index === correctIndex);
    });
    
    // Soru numarası
    const questionNumberEl = document.getElementById('dinle-question-number');
    if (questionNumberEl) {
        questionNumberEl.textContent = `${currentQuestion + 1}/${questions.length}`;
    }
}

/**
 * Dinle Bul cevabını kontrol eder
 */
function checkDinleAnswer(selectedIndex, isCorrect) {
    const optionButtons = document.querySelectorAll('#dinle-bul-screen .option-btn');
    
    optionButtons.forEach(btn => {
        btn.disabled = true;
        btn.onclick = null;
    });
    
    if (isCorrect) {
        optionButtons[selectedIndex].classList.add('correct');
        sessionCorrect++;
        comboCount++;
        if (comboCount > maxCombo) maxCombo = comboCount;
        
        // Puan ekle - Kelimenin difficulty değerine göre (temel puan)
        let points = currentQuestionData.difficulty ?? CONFIG.POINTS_CORRECT;
        
        // Combo bonusu - Her doğru cevap için (doğru sayısına endeksli)
        const comboBonus = CONFIG.COMBO_BONUS_PER_CORRECT;
        points += comboBonus;
        
        addSessionPoints(points);
        
        updateWordStats(currentQuestionData.id, true);
        
        // Combo gösterimi kaldırıldı - performans ve kullanıcı odaklanması için
        // const comboDisplay = document.getElementById('dinle-combo-display');
        // if (comboDisplay) {
        //     comboDisplay.style.display = 'block';
        //     document.getElementById('dinle-combo-count').textContent = comboCount;
        //     setTimeout(() => {
        //         comboDisplay.style.display = 'none';
        //     }, 2000);
        // }
        
        playSound('correct');
        
        // Her soru cevaplandığında anında kaydet ve modal açıksa yenile
        // Combo bonusu her doğru cevapta olduğu için maxCombo değeri gönderiliyor
        saveDetailedStats(points, 1, 0, comboCount, 0);
        if (typeof refreshDetailedStatsIfOpen === 'function') {
            refreshDetailedStatsIfOpen();
        }
        
        setTimeout(() => {
            currentQuestion++;
            loadDinleQuestion();
        }, 1500);
    } else {
        // Yanlış cevap - sadece doğru cevabı göster, puan kaybı yok
        optionButtons[selectedIndex].classList.add('wrong');
        
        // Doğru cevabı göster
        if (currentQuestionData.correctIndex !== undefined) {
            optionButtons[currentQuestionData.correctIndex].classList.add('correct');
        } else {
            // Fallback: eski yöntem
            optionButtons.forEach((btn, index) => {
                if (btn.textContent === currentQuestionData.kelime) {
                    btn.classList.add('correct');
                }
            });
        }
        
        sessionWrong++;
        comboCount = 0;
        // Puan kaybı yok - sadece doğru cevap gösterilir
        updateWordStats(currentQuestionData.id, false);
        playSound('wrong');
        
        // Her soru cevaplandığında anında kaydet ve modal açıksa yenile
        saveDetailedStats(0, 0, 1, 0, 0);
        if (typeof refreshDetailedStatsIfOpen === 'function') {
            refreshDetailedStatsIfOpen();
        }
        
        setTimeout(() => {
            currentQuestion++;
            loadDinleQuestion();
        }, 2000);
    }
    
    const sessionScoreEl = document.getElementById('dinle-session-score');
    if (sessionScoreEl) {
        sessionScoreEl.textContent = `Hasene: ${sessionScore}`;
    }
}

// ============================================
// OYUN FONKSİYONLARI - BOŞLUK DOLDUR
// ============================================

/**
 * Boşluk Doldur oyununu başlatır
 */
async function startBoslukDoldurGame() {
    currentGame = 'bosluk-doldur';
    currentGameMode = 'bosluk-doldur';
    window.currentGame = currentGame;
    window.currentGameMode = currentGameMode;
    currentQuestion = 0;
    sessionScore = 0;
    sessionCorrect = 0;
    sessionWrong = 0;
    comboCount = 0;
    maxCombo = 0;
    
    // Doğru cevap pozisyon takibini sıfırla
    correctAnswerPositions = {
        count: [0, 0, 0, 0],
        total: 0
    };
    
    const allAyet = await loadAyetData();
    if (!allAyet || allAyet.length === 0) {
        showErrorMessage('Ayet verileri yüklenemedi!');
        return;
    }
    
    // Zorluk seviyesine göre filtrele (meal metnindeki kelime sayısına göre)
    infoLog(`Boşluk Doldur oyunu başlatılıyor - Zorluk: ${currentDifficulty}`);
    let filteredAyet = allAyet;
    
    // Ayetleri meal metnindeki kelime sayısına göre filtrele
    filteredAyet = allAyet.filter(ayet => {
        if (!ayet.meal) return true; // Meal yoksa dahil et
        
        // Meal metnindeki kelime sayısını hesapla
        const mealWords = ayet.meal.trim().split(/\s+/).filter(w => w.length > 0);
        const wordCount = mealWords.length;
        
        // Zorluk seviyesine göre filtrele (kelime sayısına göre)
        if (currentDifficulty === 'easy') {
            // Kolay: 1-6 kelime (kısa mealler)
            return wordCount >= 1 && wordCount <= 6;
        } else if (currentDifficulty === 'medium') {
            // Orta: 7-12 kelime (orta uzunlukta mealler)
            return wordCount >= 7 && wordCount <= 12;
        } else if (currentDifficulty === 'hard') {
            // Zor: 13+ kelime (uzun mealler)
            return wordCount >= 13;
        }
        return true;
    });
    
    infoLog(`Filtrelenmiş ayet sayısı: ${filteredAyet.length} / ${allAyet.length}`);
    
    // Debug: Zorluk filtresi çalışıyor mu kontrol et
    if (CONFIG.DEBUG) {
        console.log(`🔍 Zorluk Filtresi Testi:`);
        console.log(`- Seçilen zorluk: ${currentDifficulty}`);
        console.log(`- Toplam ayet: ${allAyet.length}`);
        console.log(`- Filtrelenmiş ayet: ${filteredAyet.length}`);
        console.log(`- Filtreleme oranı: ${((filteredAyet.length / allAyet.length) * 100).toFixed(2)}%`);
        
        // İlk birkaç filtrelenmiş ayetin kelime sayısını göster
        if (filteredAyet.length > 0) {
            const sampleAyet = filteredAyet.slice(0, 3);
            sampleAyet.forEach((ayet, idx) => {
                if (ayet && ayet.meal && typeof ayet.meal === 'string') {
                    const wordCount = ayet.meal.trim().split(/\s+/).filter(w => w.length > 0).length;
                    const mealPreview = ayet.meal.length > 50 ? ayet.meal.substring(0, 50) + '...' : ayet.meal;
                    console.log(`  Örnek ${idx + 1}: "${mealPreview}" - Kelime sayısı: ${wordCount}`);
                }
            });
        }
    }
    
    if (filteredAyet.length < CONFIG.QUESTIONS_PER_GAME) {
        showErrorMessage(`Yeterli ayet bulunamadı! (${filteredAyet.length} ayet bulundu, ${CONFIG.QUESTIONS_PER_GAME} gerekiyor)`);
        return;
    }
    
    // Ayetlerden rastgele seç
    questions = getRandomItems(filteredAyet, CONFIG.QUESTIONS_PER_GAME);
    
    // Kullanıcıya bilgi ver (her zaman göster)
    const difficultyName = currentDifficulty === 'easy' ? 'Kolay' : currentDifficulty === 'medium' ? 'Orta' : 'Zor';
    const filterRatio = ((filteredAyet.length / allAyet.length) * 100).toFixed(1);
    showSuccessMessage(`✅ ${difficultyName} zorluk seviyesi aktif: ${filteredAyet.length} ayet (${filterRatio}%)`);
    
    loadBoslukQuestion();
}

/**
 * Boşluk Doldur sorusu yükler
 */
async function loadBoslukQuestion() {
    // Oyun bitti mi kontrol et
    if (!questions || questions.length === 0) {
        console.warn('⚠️ Boşluk Doldur: Soru listesi boş, oyun bitiriliyor');
        endGame();
        return;
    }
    if (currentQuestion >= questions.length) {
        endGame();
        return;
    }
    
    currentQuestionData = questions[currentQuestion];
    
    // Ayet metnini al ve bir kelimeyi boşlukla değiştir
    const ayetText = currentQuestionData.ayet_metni;
    if (!ayetText || typeof ayetText !== 'string') {
        errorLog('Ayet metni bulunamadı veya geçersiz!');
        // Geçersiz soru varsa bir sonraki soruya geç, eğer soru kalmadıysa oyunu bitir
        currentQuestion++;
        if (currentQuestion >= questions.length) {
            endGame();
        } else {
            loadBoslukQuestion();
        }
        return;
    }
    const words = ayetText.split(' ').filter(w => w.trim().length > 0);
    if (words.length === 0) {
        errorLog('Ayet metninde kelime bulunamadı!');
        // Geçersiz soru varsa bir sonraki soruya geç, eğer soru kalmadıysa oyunu bitir
        currentQuestion++;
        if (currentQuestion >= questions.length) {
            endGame();
        } else {
            loadBoslukQuestion();
        }
        return;
    }
    const randomIndex = Math.floor(Math.random() * words.length);
    const missingWord = words[randomIndex];
    words[randomIndex] = '_____';
    const verseWithBlank = words.join(' ');
    
    // Verse text'i göster
    const verseTextEl = document.getElementById('verse-text');
    if (verseTextEl) {
        verseTextEl.innerHTML = verseWithBlank.replace('_____', '<span class="blank" id="blank-word"></span>');
    }
    
    // Ayet kimliğini göster (verse-info panelinde)
    const verseIdEl = document.getElementById('bosluk-verse-id');
    if (verseIdEl) {
        if (currentQuestionData.ayet_kimligi) {
            verseIdEl.textContent = currentQuestionData.ayet_kimligi;
            verseIdEl.style.display = 'inline';
        } else {
            verseIdEl.style.display = 'none';
        }
    }
    
    // Meali göster
    const verseMealEl = document.getElementById('verse-meal');
    if (verseMealEl && currentQuestionData.meal) {
        verseMealEl.textContent = currentQuestionData.meal;
    }
    
    // Ses çal butonu - Audio Manager kullan
    const playBtn = document.getElementById('bosluk-play-audio-btn');
    if (playBtn && typeof setupAudioButton === 'function') {
        setupAudioButton(playBtn, currentQuestionData.ayet_ses_dosyasi);
    } else if (playBtn) {
        // Fallback: Eski yöntem
        if (currentQuestionData.ayet_ses_dosyasi) {
            playBtn.onclick = () => {
                if (typeof playAudio === 'function') {
                    playAudio(currentQuestionData.ayet_ses_dosyasi, playBtn);
                }
            };
            playBtn.disabled = false;
            playBtn.style.opacity = '1';
        } else {
            playBtn.style.opacity = '0.5';
            playBtn.disabled = true;
        }
    }
    
    // Seçenekleri oluştur (doğru kelime + 3 yanlış)
    const allAyet = questions;
    const uniqueWrongWords = allAyet
        .filter(a => a && a.ayet_kimligi !== currentQuestionData.ayet_kimligi && a.ayet_metni)
        .flatMap(a => {
            const words = a.ayet_metni.split(' ').filter(w => w.trim().length > 0);
            return words;
        })
        .filter((v, i, a) => a.indexOf(v) === i)
        .filter(word => word && word.trim().length > 0 && word !== missingWord); // Doğru cevabı çıkar
    
    // Rastgele 3 yanlış cevap seç
    const wrongWords = getRandomItems(uniqueWrongWords, 3);
    
    // Eşit dağılımlı karıştırma
    const allOptions = [missingWord, ...wrongWords];
    const shuffled = shuffleWithEqualDistribution(
        allOptions,
        missingWord,
        correctAnswerPositions.count
    );
    const options = shuffled.options;
    const correctIndex = shuffled.correctIndex;
    
    // Doğru cevap pozisyonunu sakla (yanlış cevap durumunda göstermek için)
    currentQuestionData.correctIndex = correctIndex;
    
    // Pozisyon sayacını güncelle
    correctAnswerPositions.count[correctIndex]++;
    correctAnswerPositions.total++;
    
    // Butonları güncelle
    const optionButtons = document.querySelectorAll('#bosluk-doldur-screen .option-btn');
    optionButtons.forEach((btn, index) => {
        btn.textContent = options[index];
        btn.classList.remove('correct', 'wrong', 'disabled');
        btn.disabled = false;
        btn.onclick = () => checkBoslukAnswer(index, index === correctIndex);
    });
    
    // Soru numarası
    const questionNumberEl = document.getElementById('bosluk-question-number');
    if (questionNumberEl) {
        questionNumberEl.textContent = `${currentQuestion + 1}/${questions.length}`;
    }
    
    // Doğru kelimeyi sakla
    currentQuestionData.missingWord = missingWord;
}

/**
 * Boşluk Doldur cevabını kontrol eder
 */
function checkBoslukAnswer(selectedIndex, isCorrect) {
    const optionButtons = document.querySelectorAll('#bosluk-doldur-screen .option-btn');
    
    optionButtons.forEach(btn => {
        btn.disabled = true;
        btn.onclick = null;
    });
    
    if (isCorrect) {
        optionButtons[selectedIndex].classList.add('correct');
        sessionCorrect++;
        comboCount++;
        if (comboCount > maxCombo) maxCombo = comboCount;
        
        // Doğru kelimeyi boşluğa yerleştir
        const blankWordEl = document.getElementById('blank-word');
        if (blankWordEl) {
            blankWordEl.textContent = currentQuestionData.missingWord;
            blankWordEl.style.borderBottom = 'none';
            blankWordEl.style.color = 'var(--accent-success)';
            blankWordEl.style.fontWeight = '600';
        }
        
        // Puan hesapla - Zorluk seviyesine göre (meal kelime sayısına göre)
        let points = CONFIG.POINTS_CORRECT;
        
        // Meal metnindeki kelime sayısına göre puan çarpanı
        if (currentQuestionData.meal) {
            const mealWords = currentQuestionData.meal.trim().split(/\s+/).filter(w => w.length > 0);
            const wordCount = mealWords.length;
            
            // Zorluk seviyesine göre puan çarpanı
            if (wordCount >= 1 && wordCount <= 6) {
                // Kolay: 1.0x (10 puan)
                points = CONFIG.POINTS_CORRECT;
            } else if (wordCount >= 7 && wordCount <= 12) {
                // Orta: 1.5x (15 puan)
                points = Math.round(CONFIG.POINTS_CORRECT * 1.5);
            } else if (wordCount >= 13) {
                // Zor: 2.0x (20 puan)
                points = CONFIG.POINTS_CORRECT * 2;
            }
        }
        
        // Combo bonusu - Her doğru cevap için (doğru sayısına endeksli)
        const comboBonus = CONFIG.COMBO_BONUS_PER_CORRECT;
        points += comboBonus;
        
        addSessionPoints(points);
        
        // Combo gösterimi kaldırıldı - performans ve kullanıcı odaklanması için
        // const comboDisplay = document.getElementById('bosluk-combo-display');
        // if (comboDisplay) {
        //     comboDisplay.style.display = 'block';
        //     document.getElementById('bosluk-combo-count').textContent = comboCount;
        //     setTimeout(() => {
        //         comboDisplay.style.display = 'none';
        //     }, 2000);
        // }
        
        playSound('correct');
        
        // Her soru cevaplandığında anında kaydet ve modal açıksa yenile
        // Combo bonusu her doğru cevapta olduğu için maxCombo değeri gönderiliyor
        saveDetailedStats(points, 1, 0, comboCount, 0);
        if (typeof refreshDetailedStatsIfOpen === 'function') {
            refreshDetailedStatsIfOpen();
        }
        
        // Audio çalıyorsa bitmesini bekle, yoksa normal süre sonra geç
        const moveToNextQuestion = () => {
            currentQuestion++;
            loadBoslukQuestion();
        };
        
        if (window.currentAudio && !window.currentAudio.paused && !window.currentAudio.ended) {
            // Audio çalıyorsa, bitmesini bekle
            // Mevcut onended handler'ını sakla
            const originalOnEnded = window.currentAudio.onended;
            // Yeni handler ekle (hem eski handler'ı çağır hem de sonraki soruya geç)
            window.currentAudio.onended = () => {
                if (originalOnEnded) {
                    try {
                        originalOnEnded();
                    } catch (e) {
                        console.error('Original onended handler error:', e);
                    }
                }
                setTimeout(moveToNextQuestion, 500);
            };
        } else {
            // Audio çalmıyorsa, normal süre sonra geç
            setTimeout(moveToNextQuestion, 1500);
        }
    } else {
        optionButtons[selectedIndex].classList.add('wrong');
        
        // Doğru cevabı göster
        if (currentQuestionData.correctIndex !== undefined) {
            optionButtons[currentQuestionData.correctIndex].classList.add('correct');
        } else {
            // Fallback: eski yöntem
            optionButtons.forEach((btn, index) => {
                if (btn.textContent === currentQuestionData.missingWord) {
                    btn.classList.add('correct');
                }
            });
        }
        
        sessionWrong++;
        comboCount = 0;
        // Puan kaybı yok - sadece doğru cevap gösterilir
        playSound('wrong');
        
        // Her soru cevaplandığında anında kaydet ve modal açıksa yenile
        saveDetailedStats(0, 0, 1, 0, 0);
        if (typeof refreshDetailedStatsIfOpen === 'function') {
            refreshDetailedStatsIfOpen();
        }
        
        // Audio çalıyorsa bitmesini bekle, yoksa normal süre sonra geç
        const moveToNextQuestion = () => {
            currentQuestion++;
            loadBoslukQuestion();
        };
        
        if (window.currentAudio && !window.currentAudio.paused && !window.currentAudio.ended) {
            // Audio çalıyorsa, bitmesini bekle
            // Mevcut onended handler'ını sakla
            const originalOnEnded = window.currentAudio.onended;
            // Yeni handler ekle (hem eski handler'ı çağır hem de sonraki soruya geç)
            window.currentAudio.onended = () => {
                if (originalOnEnded) {
                    try {
                        originalOnEnded();
                    } catch (e) {
                        errorLog('Original onended handler error:', e);
                    }
                }
                setTimeout(moveToNextQuestion, 500);
            };
        } else {
            // Audio çalmıyorsa, normal süre sonra geç
            setTimeout(moveToNextQuestion, 2000);
        }
    }
    
    const sessionScoreEl = document.getElementById('bosluk-session-score');
    if (sessionScoreEl) {
        sessionScoreEl.textContent = `Hasene: ${sessionScore}`;
    }
}

// ============================================
// OKUMA MODLARI - AYET OKU, DUA ET, HADİS OKU
// ============================================

let currentAyetIndex = 0;
let currentDuaIndex = 0;
let currentHadisIndex = 0;
let shuffledAyet = [];
let shuffledDua = [];
let shuffledHadis = [];

// ============================================
// ORTAK YARDIMCI FONKSİYONLAR
// ============================================

/**
 * Navigasyon butonlarını ayarlar (Ayet, Dua, Hadis için ortak)
 * @param {string} prevBtnId - Önceki buton ID'si
 * @param {string} nextBtnId - Sonraki buton ID'si
 * @param {number} currentIndex - Mevcut index
 * @param {Array} allItems - Tüm öğeler dizisi
 * @param {Function} displayFunction - Gösterim fonksiyonu (item, allItems) => void
 * @param {Object} indexRef - Index referansı { get: () => number, set: (val) => void }
 */
function setupNavigationButtons(prevBtnId, nextBtnId, currentIndex, allItems, displayFunction, indexRef) {
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    
    if (prevBtn) {
        prevBtn.disabled = currentIndex === 0;
        prevBtn.onclick = () => {
            if (currentIndex > 0) {
                const newIndex = currentIndex - 1;
                indexRef.set(newIndex);
                displayFunction(allItems[newIndex], allItems);
            }
        };
    }
    
    if (nextBtn) {
        // Her zaman bir sonraki rastgele öğeyi göster
        nextBtn.disabled = false;
        nextBtn.onclick = () => {
            // Yeni rastgele bir öğe seç
            const randomIndex = Math.floor(Math.random() * allItems.length);
            indexRef.set(randomIndex);
            displayFunction(allItems[randomIndex], allItems);
        };
    }
}

/**
 * Audio butonunu ayarlar (Ayet, Dua, Hadis için ortak)
 * @param {string} buttonId - Buton ID'si
 * @param {string} audioUrl - Ses dosyası URL'si
 * @param {number|null} startTime - Başlangıç zamanı (opsiyonel)
 */
function setupAudioButtonForContent(buttonId, audioUrl, startTime = null) {
    const playAudioBtn = document.getElementById(buttonId);
    
    if (!playAudioBtn) return;
    
    if (typeof setupAudioButton === 'function') {
        // Audio Manager kullan
        setupAudioButton(playAudioBtn, audioUrl, {
            onEnded: () => {
                // Ses bittiğinde özel işlemler (gerekirse)
            },
            onError: () => {
                // Hata durumunda özel işlemler (gerekirse)
            }
        });
        
        // Başlangıç zamanı varsa ayarla
        if (startTime && typeof window.currentAudio !== 'undefined' && window.currentAudio) {
            // Not: Bu durumda playAudio çağrıldıktan sonra currentTime ayarlanmalı
            // Bu özellik audio-manager.js'e eklenebilir
        }
    } else if (audioUrl) {
        // Fallback: Eski yöntem
        playAudioBtn.onclick = () => {
            if (typeof playAudio === 'function') {
                playAudio(audioUrl, playAudioBtn);
                // Başlangıç zamanı varsa ayarla
                if (startTime && window.currentAudio) {
                    window.currentAudio.currentTime = startTime;
                }
            } else {
                // Fallback fallback: Manuel audio handling
                if (window.currentAudio) {
                    window.currentAudio.pause();
                    window.currentAudio.currentTime = 0;
                }
                window.currentAudio = new Audio(audioUrl);
                if (startTime) {
                    window.currentAudio.currentTime = startTime;
                }
                playAudioBtn.disabled = true;
                playAudioBtn.style.opacity = '0.6';
                window.currentAudio.play().catch(err => {
                    errorLog('Ses çalınamadı:', err);
                    showErrorMessage('Ses dosyası çalınamadı.');
                    playAudioBtn.disabled = false;
                    playAudioBtn.style.opacity = '1';
                    window.currentAudio = null;
                });
                window.currentAudio.onended = () => {
                    playAudioBtn.disabled = false;
                    playAudioBtn.style.opacity = '1';
                    window.currentAudio = null;
                };
                window.currentAudio.onerror = () => {
                    playAudioBtn.disabled = false;
                    playAudioBtn.style.opacity = '1';
                    window.currentAudio = null;
                };
            }
        };
        playAudioBtn.disabled = false;
        playAudioBtn.style.opacity = '1';
    } else {
        playAudioBtn.disabled = true;
        playAudioBtn.style.opacity = '0.5';
    }
}

/**
 * Ayet Oku modunu başlatır
 */
async function startAyetOku() {
    currentGame = 'ayet-oku';
    currentGameMode = 'ayet-oku';
    window.currentGame = currentGame;
    window.currentGameMode = currentGameMode;
    const allAyet = await loadAyetData();
    if (!allAyet || allAyet.length === 0) {
        showErrorMessage('Ayet verileri yüklenemedi!');
        return;
    }
    
    // Ayetleri karıştır (random)
    shuffledAyet = shuffleArray([...allAyet]);
    currentAyetIndex = 0;
    displayAyet(shuffledAyet[currentAyetIndex], shuffledAyet);
    
    // Oyun sayacını artır
    gameStats.gameModeCounts['ayet-oku']++;
    
    // İstatistikleri kaydet
    debouncedSaveStats();
    
    // Günlük görev ilerlemesini güncelle
    updateTaskProgress('ayet-oku', {
        correct: 0,
        wrong: 0,
        points: 0,
        combo: 0
    });
}

/**
 * Ayet gösterir
 */
function displayAyet(ayet, allAyet) {
    const sureNameEl = document.getElementById('ayet-sure-name');
    const verseNumberEl = document.getElementById('ayet-verse-number');
    const arabicTextEl = document.getElementById('ayet-arabic-text');
    const translationEl = document.getElementById('ayet-translation');
    
    if (sureNameEl) sureNameEl.textContent = ayet.sure_adı || 'Bilinmeyen';
    // Ayet numarası kaldırıldı - alt tarafta ayet kimliği gösteriliyor
    if (arabicTextEl) arabicTextEl.textContent = ayet.ayet_metni || '';
    if (translationEl) translationEl.textContent = ayet.meal || '';
    
    // Ayet kimliğini göster
    const verseIdEl = document.getElementById('ayet-verse-id');
    if (verseIdEl) {
        if (ayet.ayet_kimligi) {
            verseIdEl.textContent = ayet.ayet_kimligi;
            verseIdEl.style.display = 'inline';
        } else {
            verseIdEl.style.display = 'none';
        }
    }
    
    // Ses çal butonu - Ortak fonksiyon kullan
    setupAudioButtonForContent('ayet-play-audio-btn', ayet.ayet_ses_dosyasi);
    
    // Navigasyon butonları - Özel callback ile (sadece Sonraki butonunda görev güncellenir)
    const prevBtn = document.getElementById('ayet-prev-btn');
    const nextBtn = document.getElementById('ayet-next-btn');
    
    if (prevBtn) {
        prevBtn.disabled = currentAyetIndex === 0;
        prevBtn.onclick = () => {
            if (currentAyetIndex > 0) {
                currentAyetIndex--;
                displayAyet(allAyet[currentAyetIndex], allAyet);
            }
        };
    }
    
    if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.onclick = () => {
            // Yeni rastgele bir ayet seç
            const randomIndex = Math.floor(Math.random() * allAyet.length);
            currentAyetIndex = randomIndex;
            displayAyet(allAyet[currentAyetIndex], allAyet);
            // Sonraki butonuna tıklandığında görev ilerlemesini güncelle
            updateTaskProgress('ayet-oku', {
                correct: 0,
                wrong: 0,
                points: 0,
                combo: 0
            });
        };
    }
}

/**
 * Dua Et modunu başlatır
 */
async function startDuaEt() {
    currentGame = 'dua-et';
    currentGameMode = 'dua-et';
    window.currentGame = currentGame;
    window.currentGameMode = currentGameMode;
    const allDua = await loadDuaData();
    if (!allDua || allDua.length === 0) {
        showErrorMessage('Dua verileri yüklenemedi!');
        return;
    }
    
    // Duaları karıştır (random)
    shuffledDua = shuffleArray([...allDua]);
    currentDuaIndex = 0;
    displayDua(shuffledDua[currentDuaIndex], shuffledDua);
    
    gameStats.gameModeCounts['dua-et']++;
    
    // İstatistikleri kaydet
    debouncedSaveStats();
    
    // Günlük görev ilerlemesini güncelle
    updateTaskProgress('dua-et', {
        correct: 0,
        wrong: 0,
        points: 0,
        combo: 0
    });
}

/**
 * Dua gösterir
 */
function displayDua(dua, allDua) {
    const verseEl = document.getElementById('dua-verse');
    const arabicTextEl = document.getElementById('dua-arabic-text');
    const translationEl = document.getElementById('dua-translation');
    
    if (verseEl) verseEl.textContent = dua.ayet || '';
    if (arabicTextEl) arabicTextEl.textContent = dua.dua || '';
    if (translationEl) translationEl.textContent = dua.tercume || '';
    
    // Ayet kimliğini göster (dua.ayet alanını kullan)
    const verseIdEl = document.getElementById('dua-verse-id');
    if (verseIdEl) {
        if (dua.ayet) {
            verseIdEl.textContent = dua.ayet;
            verseIdEl.style.display = 'inline';
        } else {
            verseIdEl.style.display = 'none';
        }
    }
    
    // Ses çal butonu - Ortak fonksiyon kullan (dua.start zamanı ile)
    setupAudioButtonForContent('dua-play-audio-btn', dua.ses_url, dua.start || null);
    
    // Navigasyon butonları - Özel callback ile (sadece Sonraki butonunda görev güncellenir)
    const prevBtn = document.getElementById('dua-prev-btn');
    const nextBtn = document.getElementById('dua-next-btn');
    
    if (prevBtn) {
        prevBtn.disabled = currentDuaIndex === 0;
        prevBtn.onclick = () => {
            if (currentDuaIndex > 0) {
                currentDuaIndex--;
                displayDua(allDua[currentDuaIndex], allDua);
            }
        };
    }
    
    if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.onclick = () => {
            // Yeni rastgele bir dua seç
            const randomIndex = Math.floor(Math.random() * allDua.length);
            currentDuaIndex = randomIndex;
            displayDua(allDua[currentDuaIndex], allDua);
            // Sonraki butonuna tıklandığında görev ilerlemesini güncelle
            updateTaskProgress('dua-et', {
                correct: 0,
                wrong: 0,
                points: 0,
                combo: 0
            });
        };
    }
}

/**
 * Hadis Oku modunu başlatır
 */
async function startHadisOku() {
    currentGame = 'hadis-oku';
    currentGameMode = 'hadis-oku';
    window.currentGame = currentGame;
    window.currentGameMode = currentGameMode;
    const allHadis = await loadHadisData();
    if (!allHadis || allHadis.length === 0) {
        showErrorMessage('Hadis verileri yüklenemedi!');
        return;
    }
    
    // Hadisleri karıştır (random)
    shuffledHadis = shuffleArray([...allHadis]);
    currentHadisIndex = 0;
    displayHadis(shuffledHadis[currentHadisIndex], shuffledHadis);
    
    gameStats.gameModeCounts['hadis-oku']++;
    
    // İstatistikleri kaydet
    debouncedSaveStats();
    
    // Günlük görev ilerlemesini güncelle
    updateTaskProgress('hadis-oku', {
        correct: 0,
        wrong: 0,
        points: 0,
        combo: 0
    });
}

/**
 * Hadis gösterir
 */
function displayHadis(hadis, allHadis) {
    const categoryEl = document.getElementById('hadis-category');
    const chapterEl = document.getElementById('hadis-chapter');
    const headerEl = document.getElementById('hadis-header');
    const textEl = document.getElementById('hadis-text');
    const refEl = document.getElementById('hadis-ref');
    
    if (categoryEl) categoryEl.textContent = hadis.section || '';
    if (chapterEl) chapterEl.textContent = hadis.chapterName || '';
    if (headerEl) headerEl.textContent = hadis.header || '';
    if (textEl) textEl.textContent = hadis.text || '';
    if (refEl) refEl.textContent = hadis.refno || '';
    
    // Navigasyon butonları - Özel callback ile (sadece Sonraki butonunda görev güncellenir)
    const prevBtn = document.getElementById('hadis-prev-btn');
    const nextBtn = document.getElementById('hadis-next-btn');
    
    if (prevBtn) {
        prevBtn.disabled = currentHadisIndex === 0;
        prevBtn.onclick = () => {
            if (currentHadisIndex > 0) {
                currentHadisIndex--;
                displayHadis(allHadis[currentHadisIndex], allHadis);
            }
        };
    }
    
    if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.onclick = () => {
            // Yeni rastgele bir hadis seç
            const randomIndex = Math.floor(Math.random() * allHadis.length);
            currentHadisIndex = randomIndex;
            displayHadis(allHadis[currentHadisIndex], allHadis);
            // Sonraki butonuna tıklandığında görev ilerlemesini güncelle
            updateTaskProgress('hadis-oku', {
                correct: 0,
                wrong: 0,
                points: 0,
                combo: 0
            });
        };
    }
}

// ============================================
// OYUN BAŞLATMA VE BİTİRME
// ============================================

/**
 * Oyunu başlatır
 */
function startGame(gameMode) {
    currentGameMode = gameMode;
    
    // Ana menüyü gizle
    document.getElementById('main-menu').style.display = 'none';
    
    // İlgili ekranı göster
    if (gameMode === 'kelime-cevir') {
        document.getElementById('kelime-cevir-screen').style.display = 'block';
        document.getElementById('kelime-submode-selection').style.display = 'block';
        document.getElementById('kelime-game-content').style.display = 'none';
    } else if (gameMode === 'dinle-bul') {
        document.getElementById('dinle-bul-screen').style.display = 'block';
        startDinleBulGame();
    } else if (gameMode === 'bosluk-doldur') {
        document.getElementById('bosluk-doldur-screen').style.display = 'block';
        startBoslukDoldurGame();
    } else if (gameMode === 'ayet-oku') {
        document.getElementById('ayet-oku-screen').style.display = 'block';
        startAyetOku();
    } else if (gameMode === 'dua-et') {
        document.getElementById('dua-et-screen').style.display = 'block';
        startDuaEt();
    } else if (gameMode === 'hadis-oku') {
        document.getElementById('hadis-oku-screen').style.display = 'block';
        startHadisOku();
    }
}

/**
 * Oyunu bitirir
 */
/**
 * Mevcut oyun ilerlemesini kaydeder (oyun bitmeden çıkıldığında)
 */
async function saveCurrentGameProgress() {
    // Oyun yoksa veya hiç soru cevaplanmamışsa kaydetme
    if (!currentGame || (sessionCorrect === 0 && sessionWrong === 0)) {
        return;
    }
    
    infoLog('Oyun ilerlemesi kaydediliyor:', {
        game: currentGame,
        score: sessionScore,
        correct: sessionCorrect,
        wrong: sessionWrong
    });
    
    // LOG: saveCurrentGameProgress başladı
    console.log('🟠 saveCurrentGameProgress çağrıldı:', {
        sessionScore,
        sessionCorrect,
        sessionWrong,
        maxCombo
    });
    
    // Global puanlara ekle
    // NOT: skipDetailedStats=true çünkü her soru zaten saveDetailedStats ile kaydedildi
    // Bu şekilde çift sayma önlenir
    await addToGlobalPoints(sessionScore, sessionCorrect, true);
    
    // NOT: saveDetailedStats() çağrılmıyor çünkü her soru cevaplandığında zaten çağrılıyor!
    // Burada duplicate kayıt yapmamak için sadece localStorage senkronizasyonu yapıyoruz.
    
    // localStorage'daki dailyCorrect ve dailyWrong'u hasene_daily_ verilerinden senkronize et
    const today = getLocalDateString();
    const dailyKey = `hasene_daily_${today}`;
    const dailyData = safeGetItem(dailyKey, { correct: 0, wrong: 0, points: 0 });
    
    // LOG: localStorage senkronizasyonu
    console.log('🟣 saveCurrentGameProgress - localStorage senkronize ediliyor:', {
        dailyKey,
        dailyData: { correct: dailyData.correct, wrong: dailyData.wrong },
        localStorageBefore: {
            correct: localStorage.getItem('dailyCorrect'),
            wrong: localStorage.getItem('dailyWrong')
        },
        not: 'saveDetailedStats çağrılmadı - her soru zaten kaydedildi!'
    });
    
    localStorage.setItem('dailyCorrect', (dailyData.correct || 0).toString());
    localStorage.setItem('dailyWrong', (dailyData.wrong || 0).toString());
    
    console.log('🟣 saveCurrentGameProgress - localStorage senkronize edildi:', {
        localStorageAfter: {
            correct: localStorage.getItem('dailyCorrect'),
            wrong: localStorage.getItem('dailyWrong')
        }
    });
    
    // Oyun istatistiklerini güncelle
    gameStats.totalCorrect += sessionCorrect;
    gameStats.totalWrong += sessionWrong;
    
    // Oyun modunu belirle (currentGameMode veya currentGame'den)
    const gameModeKey = currentGameMode || 
                        (currentGame === 'kelime-cevir' ? 'kelime-cevir' :
                         currentGame === 'dinle-bul' ? 'dinle-bul' :
                         currentGame === 'bosluk-doldur' ? 'bosluk-doldur' :
                         currentGame === 'ayet-oku' ? 'ayet-oku' :
                         currentGame === 'dua-et' ? 'dua-et' :
                         currentGame === 'hadis-oku' ? 'hadis-oku' : null);
    
    if (gameModeKey) {
        gameStats.gameModeCounts[gameModeKey] = (gameStats.gameModeCounts[gameModeKey] || 0) + 1;
        console.log(`🎮 Oyun modu sayacı güncellendi: ${gameModeKey} = ${gameStats.gameModeCounts[gameModeKey]}`);
    } else {
        console.warn('⚠️ Oyun modu belirlenemedi! currentGameMode:', currentGameMode, 'currentGame:', currentGame);
    }
    
    // Görev ilerlemesini güncelle
    updateTaskProgress(gameModeKey, {
        correct: sessionCorrect,
        wrong: sessionWrong,
        points: sessionScore,
        combo: maxCombo,
        perfect: 0 // Oyun bitmeden çıkıldığı için perfect bonus yok
    });
    
    // İstatistikleri kaydet
    debouncedSaveStats();
    
    infoLog('Oyun ilerlemesi kaydedildi');
    
    // Rozetleri ve başarımları kontrol et (addToGlobalPoints içinde zaten çağrılıyor)
    // Not: addToGlobalPoints() zaten checkBadges() ve checkAchievements() çağırıyor
    
    // Eğer detaylı istatistikler modalı açıksa, panelleri yenile
    refreshDetailedStatsIfOpen();
    
    // İstatistikleri kaydet
    saveStats();
    
    // Session değişkenlerini sıfırla
    sessionScore = 0;
    sessionCorrect = 0;
    sessionWrong = 0;
    comboCount = 0;
    maxCombo = 0;
    currentQuestion = 0;
    questions = [];
    currentQuestionData = null;
}

async function endGame() {
    // LOG: endGame başladı
    console.log('🔴 endGame çağrıldı:', {
        sessionScore,
        sessionCorrect,
        sessionWrong,
        maxCombo,
        totalQuestions: questions ? questions.length : 0,
        currentGame,
        currentGameMode,
        currentSubMode
    });
    
    // Güvenlik kontrolü: Eğer oyun modu belirlenmemişse, endgame tablosu gösterilmeden çık
    if (!currentGame && !currentGameMode) {
        console.warn('⚠️ endGame: Oyun modu belirlenmemiş, endgame tablosu gösterilmiyor');
        return;
    }
    
    // Perfect Lesson bonusu kontrolü - DERS SAYISINA ENDEKSLİ
    // Tüm sorular doğru cevaplanmış olmalı (hiç yanlış cevap yok ve tüm sorular cevaplanmış)
    let perfectBonus = 0;
    const totalQuestions = questions ? questions.length : 0;
    if (sessionWrong === 0 && sessionCorrect === totalQuestions && sessionScore > 0 && totalQuestions >= 3) {
        // Her mükemmel ders için sabit bonus (ders sayısına endeksli, session skoruna değil)
        perfectBonus = CONFIG.PERFECT_LESSON_BONUS_PER_GAME;
        sessionScore += perfectBonus;
        // Mükemmel ders sayısını artır
        perfectLessonsCount++;
        safeSetItem('perfectLessonsCount', perfectLessonsCount);
        console.log('⭐ Perfect bonus eklendi (ders bazlı):', perfectBonus);
    }
    
    // Global puanlara ekle
    // NOT: skipDetailedStats=true çünkü her soru zaten saveDetailedStats ile kaydedildi
    // Bu şekilde çift sayma önlenir
    // await kaldırıldı - sonuç paneli hemen açılsın (performans optimizasyonu)
    addToGlobalPoints(sessionScore, sessionCorrect, true).catch(err => {
        console.error('addToGlobalPoints hatası (kritik değil):', err);
    });
    
    // Not: Her soru cevaplandığında zaten saveDetailedStats() çağrılıyor
    // Burada sadece perfect lesson bonusu ve oyun sayısını güncelle
    const today = getLocalDateString();
    const dailyKey = `hasene_daily_${today}`;
    const dailyData = safeGetItem(dailyKey, {
        correct: 0,
        wrong: 0,
        points: 0,
        gamesPlayed: 0,
        perfectLessons: 0,
        maxCombo: 0,
        gameModes: {}
    });
    
    // LOG: endGame - mevcut dailyData
    console.log('🔴 endGame - mevcut dailyData:', {
        dailyKey,
        dailyData: { ...dailyData },
        not: 'saveDetailedStats çağrılmadı - her soru zaten kaydedildi!'
    });
    
    // Oyun sayısını artır (her soru zaten kaydedildi, sadece oyun sayısı eksik)
    dailyData.gamesPlayed = (dailyData.gamesPlayed || 0) + 1;
    
    // Perfect bonus'u detaylı istatistiklere ekle
    // NOT: saveDetailedStats zaten perfect bonus'u ekleyecek, bu yüzden burada manuel ekleme yapmıyoruz
    if (perfectBonus > 0) {
        // Perfect bonus'u haftalık/aylık istatistiklere de ekle
        // saveDetailedStats perfect bonus'u dailyData.points'e de ekleyecek
        saveDetailedStats(perfectBonus, 0, 0, 0, 1, false);
        console.log('🔴 endGame - perfect bonus saveDetailedStats ile eklendi:', perfectBonus);
    }
    
    // localStorage'daki dailyCorrect ve dailyWrong'u hasene_daily_ verilerinden senkronize et
    console.log('🔴 endGame - localStorage senkronize ediliyor:', {
        dailyData: { correct: dailyData.correct, wrong: dailyData.wrong },
        localStorageBefore: {
            correct: localStorage.getItem('dailyCorrect'),
            wrong: localStorage.getItem('dailyWrong')
        }
    });
    
    localStorage.setItem('dailyCorrect', (dailyData.correct || 0).toString());
    localStorage.setItem('dailyWrong', (dailyData.wrong || 0).toString());
    
    console.log('🔴 endGame - localStorage senkronize edildi:', {
        localStorageAfter: {
            correct: localStorage.getItem('dailyCorrect'),
            wrong: localStorage.getItem('dailyWrong')
        }
    });
    
    // dailyData'yı güncelle (saveDetailedStats zaten perfect bonus'u ekledi, burada sadece gamesPlayed'i güncelle)
    safeSetItem(dailyKey, dailyData);
    
    // UI'ı hemen güncelle (rakamların görünmesi için)
    updateStatsBar();
    if (typeof updateDailyGoalDisplay === 'function') {
        updateDailyGoalDisplay();
    }
    if (typeof updateStreakDisplay === 'function') {
        updateStreakDisplay();
    }
    
    // Sonuç panelini HEMEN göster (kullanıcı deneyimi için kritik)
    // Güvenlik kontrolü: showCustomConfirm her zaman çağrılmalı
    try {
        showCustomConfirm(sessionCorrect || 0, sessionWrong || 0, sessionScore || 0, perfectBonus || 0);
        console.log('✅ endGame: showCustomConfirm başarıyla çağrıldı');
    } catch (error) {
        console.error('❌ endGame: showCustomConfirm hatası:', error);
        // Hata olsa bile modal'ı açmaya çalış
        const modal = document.getElementById('game-result-modal');
        if (modal) {
            document.getElementById('result-correct').textContent = sessionCorrect || 0;
            document.getElementById('result-wrong').textContent = sessionWrong || 0;
            document.getElementById('result-xp').textContent = formatNumber(sessionScore || 0);
            const perfectBonusEl = document.getElementById('perfect-lesson-bonus');
            if (perfectBonus > 0 && perfectBonusEl) {
                perfectBonusEl.style.display = 'block';
                document.getElementById('perfect-bonus').textContent = formatNumber(perfectBonus);
            } else if (perfectBonusEl) {
                perfectBonusEl.style.display = 'none';
            }
            openModal('game-result-modal');
        }
    }
    
    // Backend kayıtlarını arka planda yap (sonuç panelini bekletme)
    saveStatsImmediate().catch(err => {
        console.error('Backend kayıt hatası (kritik değil):', err);
    });
    
    // Haftalık ve aylık için de oyun sayısını güncelle
    const weekStartStr = getWeekStartDateString(new Date());
    const weeklyKey = `hasene_weekly_${weekStartStr}`;
    const weeklyData = safeGetItem(weeklyKey, {
        hasene: 0,
        correct: 0,
        wrong: 0,
        daysPlayed: 0,
        gamesPlayed: 0,
        perfectLessons: 0,
        maxCombo: 0,
        streakDays: 0,
        playedDates: []
    });
    // Oyun tamamlandığı için gamesPlayed artırılır
    // NOT: Perfect bonus zaten saveDetailedStats ile eklendi, burada tekrar eklemiyoruz
    weeklyData.gamesPlayed = (weeklyData.gamesPlayed || 0) + 1;
    safeSetItem(weeklyKey, weeklyData);
    
    const monthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const monthlyKey = `hasene_monthly_${monthStr}`;
    const monthlyData = safeGetItem(monthlyKey, {
        hasene: 0,
        correct: 0,
        wrong: 0,
        daysPlayed: 0,
        gamesPlayed: 0,
        perfectLessons: 0,
        maxCombo: 0,
        streakDays: 0,
        bestStreak: 0,
        playedDates: []
    });
    // NOT: Perfect bonus zaten saveDetailedStats ile eklendi, burada tekrar eklemiyoruz
    monthlyData.gamesPlayed = (monthlyData.gamesPlayed || 0) + 1;
    safeSetItem(monthlyKey, monthlyData);
    
    // Modal açıksa yenile
    if (typeof refreshDetailedStatsIfOpen === 'function') {
        refreshDetailedStatsIfOpen();
    }
    
    // Oyun istatistiklerini güncelle
    gameStats.totalCorrect += sessionCorrect;
    gameStats.totalWrong += sessionWrong;
    if (currentGameMode) {
        gameStats.gameModeCounts[currentGameMode] = (gameStats.gameModeCounts[currentGameMode] || 0) + 1;
    }
    
    // Görev ilerlemesini güncelle
    updateTaskProgress(currentGameMode, {
        correct: sessionCorrect,
        wrong: sessionWrong,
        points: sessionScore,
        combo: maxCombo,
        perfect: perfectBonus > 0 ? 1 : 0
    });
    
    // Rozetleri ve başarımları kontrol et (addToGlobalPoints içinde zaten çağrılıyor)
    // Not: addToGlobalPoints() zaten checkBadges() ve checkAchievements() çağırıyor
    // Burada tekrar çağırmaya gerek yok, performans için kaldırıldı
    
    // Eğer detaylı istatistikler modalı açıksa, panelleri yenile
    refreshDetailedStatsIfOpen();
    
    // Not: Sonuç modalı yukarıda gösterildi (performans için backend kayıtlarından önce)
}

/**
 * Oyun sonu modalını gösterir
 */
function showCustomConfirm(correct, wrong, xp, perfectBonus = 0) {
    document.getElementById('result-correct').textContent = correct;
    document.getElementById('result-wrong').textContent = wrong;
    document.getElementById('result-xp').textContent = formatNumber(xp);
    
    const perfectBonusEl = document.getElementById('perfect-lesson-bonus');
    if (perfectBonus > 0) {
        perfectBonusEl.style.display = 'block';
        document.getElementById('perfect-bonus').textContent = formatNumber(perfectBonus);
    } else {
        perfectBonusEl.style.display = 'none';
    }
    
    openModal('game-result-modal');
}

/**
 * Oyunu yeniden başlatır
 */
function restartGame() {
    closeModal('game-result-modal');
    if (currentGame === 'kelime-cevir') {
        startKelimeCevirGame(currentSubMode);
    } else if (currentGame === 'dinle-bul') {
        startDinleBulGame();
    } else if (currentGame === 'bosluk-doldur') {
        startBoslukDoldurGame();
    }
}

// ============================================
// GÖREV SİSTEMİ
// ============================================

/**
 * Günlük görevleri kontrol eder
 */
function checkDailyTasks() {
    const today = getLocalDateString();
    
    if (dailyTasks.lastTaskDate !== today) {
        // Yeni gün, görevleri oluştur
        generateDailyTasks(today);
        dailyTasks.lastTaskDate = today;
        dailyTasks.rewardsClaimed = false;
        
        // Bugünkü istatistikleri sıfırla
        dailyTasks.todayStats = {
            toplamDogru: 0,
            toplamPuan: 0,
            comboCount: 0,
            allGameModes: new Set(),
            farklıZorluk: new Set(),
            perfectStreak: 0,
            accuracy: 0,
            reviewWords: new Set(),
            streakMaintain: 0,
            totalPlayTime: 0,
            ayetOku: 0,
            duaEt: 0,
            hadisOku: 0
        };
        
        saveStats();
    } else {
        // Aynı gün, mevcut görevleri template ile senkronize et (ad ve açıklama güncellemeleri için)
        syncTasksWithTemplate();
        saveStats(); // Değişiklikleri kaydet
    }
    
    updateTasksDisplay();
}

/**
 * Gece yarısı kontrolü için zamanlayıcı ayarlar
 * Gece 24:00'da otomatik olarak günlük görevleri sıfırlar
 */
function setupMidnightReset() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Gece yarısı
    
    // Gece yarısına kadar kalan süre (milisaniye)
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    // Gece yarısında görevleri sıfırla
    setTimeout(() => {
        console.log('🌙 Gece yarısı - Günlük görevler sıfırlanıyor...');
        checkDailyTasks();
        // checkWeeklyTasks(); // Haftalık görevler UI'dan kaldırıldı
        
        // Bir sonraki gece yarısı için zamanlayıcıyı tekrar ayarla
        setupMidnightReset();
    }, msUntilMidnight);
    
    // Ayrıca her dakika kontrol et (daha güvenilir, sayfa açıkken)
    // Bu, kullanıcı sayfayı gece yarısından önce açtıysa ve gece yarısı geçtiyse yakalamak için
    if (window.midnightCheckInterval) {
        clearInterval(window.midnightCheckInterval);
    }
    
    window.midnightCheckInterval = setInterval(() => {
        const currentDate = getLocalDateString();
        if (dailyTasks.lastTaskDate !== currentDate) {
            console.log('🌙 Tarih değişti - Günlük görevler sıfırlanıyor...');
            checkDailyTasks();
            // checkWeeklyTasks(); // Haftalık görevler UI'dan kaldırıldı
        }
    }, 60000); // Her 1 dakikada bir kontrol et
}

/**
 * Mevcut görevleri template ile senkronize eder (ad, açıklama ve target güncellemeleri için)
 */
function syncTasksWithTemplate() {
    if (!dailyTasks.tasks || dailyTasks.tasks.length === 0) return;
    
    // Template'den görevleri al
    const templateMap = new Map();
    DAILY_TASKS_TEMPLATE.forEach(t => templateMap.set(t.id, t));
    DAILY_BONUS_TASKS_TEMPLATE.forEach(t => templateMap.set(t.id, t));
    
    // Mevcut görevleri güncelle
    dailyTasks.tasks.forEach(task => {
        const template = templateMap.get(task.id);
        if (template) {
            task.name = template.name;
            task.description = template.description;
            // Target değerini güncelle (eğer değiştiyse)
            if (template.target !== undefined && task.target !== template.target) {
                // Eğer görev tamamlanmamışsa target'ı güncelle
                if (!task.completed) {
                    task.target = template.target;
                    // Progress'i yeni target'a göre ayarla (orantılı olarak)
                    if (task.target > 0 && task.progress > task.target) {
                        // Eğer progress yeni target'tan fazlaysa, target'a eşitle
                        task.progress = Math.min(task.progress, task.target);
                    }
                }
            }
        }
    });
    
    if (dailyTasks.bonusTasks) {
        dailyTasks.bonusTasks.forEach(task => {
            const template = templateMap.get(task.id);
            if (template) {
                task.name = template.name;
                task.description = template.description;
                // Target değerini güncelle (eğer değiştiyse)
                if (template.target !== undefined && task.target !== template.target) {
                    // Eğer görev tamamlanmamışsa target'ı güncelle
                    if (!task.completed) {
                        task.target = template.target;
                        // Progress'i yeni target'a göre ayarla (orantılı olarak)
                        if (task.target > 0 && task.progress > task.target) {
                            // Eğer progress yeni target'tan fazlaysa, target'a eşitle
                            task.progress = Math.min(task.progress, task.target);
                        }
                    }
                }
            }
        });
    }
}

/**
 * Günlük görevler oluşturur
 */
function generateDailyTasks(date) {
    dailyTasks.tasks = DAILY_TASKS_TEMPLATE.map(task => ({
        ...task,
        progress: 0,
        completed: false
    }));
    
    dailyTasks.bonusTasks = DAILY_BONUS_TASKS_TEMPLATE.map(task => ({
        ...task,
        progress: 0,
        completed: false
    }));
    
    dailyTasks.completedTasks = [];
}

/**
 * Haftalık görevleri kontrol eder
 */
function checkWeeklyTasks() {
    const today = new Date();
    const weekStart = getWeekStartDateString(today);
    const weekEnd = getWeekEndDateString(today);
    
    if (weeklyTasks.lastWeekStart !== weekStart) {
        // Yeni hafta, görevleri oluştur
        generateWeeklyTasks(weekStart);
        weeklyTasks.lastWeekStart = weekStart;
        weeklyTasks.weekStart = weekStart;
        weeklyTasks.weekEnd = weekEnd;
        weeklyTasks.rewardsClaimed = false;
        
        // Haftalık istatistikleri sıfırla
        weeklyTasks.weekStats = {
            totalHasene: 0,
            totalCorrect: 0,
            totalWrong: 0,
            daysPlayed: 0,
            streakDays: 0,
            allModesPlayed: new Set(),
            comboCount: 0
        };
        
        saveStats();
    } else {
        // Aynı hafta, mevcut görevleri template ile senkronize et
        syncWeeklyTasksWithTemplate();
        saveStats(); // Değişiklikleri kaydet
    }
    
    updateTasksDisplay();
}

/**
 * Haftalık görevleri template ile senkronize eder (ad, açıklama ve target güncellemeleri için)
 */
function syncWeeklyTasksWithTemplate() {
    if (!weeklyTasks.tasks || weeklyTasks.tasks.length === 0) return;
    
    // Template'den görevleri al
    const templateMap = new Map();
    WEEKLY_TASKS_TEMPLATE.forEach(t => templateMap.set(t.id, t));
    
    // Mevcut görevleri güncelle
    weeklyTasks.tasks.forEach(task => {
        const template = templateMap.get(task.id);
        if (template) {
            task.name = template.name;
            task.description = template.description;
            // Target değerini güncelle (eğer değiştiyse)
            if (template.target !== undefined && task.target !== template.target) {
                // Eğer görev tamamlanmamışsa target'ı güncelle
                if (!task.completed) {
                    task.target = template.target;
                    // Progress'i yeni target'a göre ayarla (orantılı olarak)
                    if (task.target > 0 && task.progress > task.target) {
                        // Eğer progress yeni target'tan fazlaysa, target'a eşitle
                        task.progress = Math.min(task.progress, task.target);
                    }
                }
            }
        }
    });
}

/**
 * Haftalık görevler oluşturur
 */
function generateWeeklyTasks(weekStart) {
    weeklyTasks.tasks = WEEKLY_TASKS_TEMPLATE.map(task => ({
        ...task,
        progress: 0,
        completed: false
    }));
    
    weeklyTasks.completedTasks = [];
}

/**
 * Görev ilerlemesini günceller
 */
function updateTaskProgress(gameType, data) {
    // Günlük görevler - todayStats kontrolü
    if (!dailyTasks.todayStats) {
        dailyTasks.todayStats = {
            toplamDogru: 0,
            toplamPuan: 0,
            comboCount: 0,
            allGameModes: new Set(),
            farklıZorluk: new Set(),
            perfectStreak: 0,
            accuracy: 0,
            reviewWords: new Set(),
            streakMaintain: 0,
            totalPlayTime: 0,
            ayetOku: 0,
            duaEt: 0,
            hadisOku: 0
        };
    }
    
    dailyTasks.todayStats.toplamDogru += data.correct || 0;
    dailyTasks.todayStats.toplamPuan += data.points || 0;
    dailyTasks.todayStats.comboCount = Math.max(dailyTasks.todayStats.comboCount || 0, data.combo || 0);
    
    if (gameType) {
        dailyTasks.todayStats.allGameModes.add(gameType);
        
        // Spesifik mod görevleri için sayaçları güncelle
        if (gameType === 'ayet-oku') {
            dailyTasks.todayStats.ayetOku = (dailyTasks.todayStats.ayetOku || 0) + 1;
        } else if (gameType === 'dua-et') {
            dailyTasks.todayStats.duaEt = (dailyTasks.todayStats.duaEt || 0) + 1;
        } else if (gameType === 'hadis-oku') {
            dailyTasks.todayStats.hadisOku = (dailyTasks.todayStats.hadisOku || 0) + 1;
        }
    }
    if (currentDifficulty) {
        dailyTasks.todayStats.farklıZorluk.add(currentDifficulty);
    }
    
    if (data.perfect) {
        dailyTasks.todayStats.perfectStreak += data.perfect;
    }
    
    // Görevleri kontrol et
    dailyTasks.tasks.forEach(task => {
        if (task.completed) return;
        
        let progress = 0;
        if (task.type === 'correct') {
            progress = dailyTasks.todayStats.toplamDogru;
        } else if (task.type === 'hasene') {
            progress = dailyTasks.todayStats.toplamPuan;
        } else if (task.type === 'game_modes') {
            progress = dailyTasks.todayStats.allGameModes.size;
        } else if (task.type === 'difficulties') {
            progress = dailyTasks.todayStats.farklıZorluk.size;
        } else if (task.type === 'combo') {
            progress = dailyTasks.todayStats.comboCount;
        } else if (task.type === 'streak') {
            progress = streakData.currentStreak > 0 ? 1 : 0;
        } else if (task.type === 'ayet_oku') {
            progress = dailyTasks.todayStats.ayetOku || 0;
        } else if (task.type === 'dua_et') {
            progress = dailyTasks.todayStats.duaEt || 0;
        } else if (task.type === 'hadis_oku') {
            progress = dailyTasks.todayStats.hadisOku || 0;
        }
        
        task.progress = progress;
        if (progress >= task.target) {
            task.completed = true;
            if (!dailyTasks.completedTasks.includes(task.id)) {
                dailyTasks.completedTasks.push(task.id);
            }
        }
    });
    
    // Fazilet vazifeleri
    if (!dailyTasks.bonusTasks) return; // Bonus görevler yoksa çık
    
    dailyTasks.bonusTasks.forEach(task => {
        if (task.completed) return;
        
        let progress = 0;
        if (task.type === 'correct') {
            progress = (dailyTasks.todayStats?.toplamDogru) || 0;
        } else if (task.type === 'hasene') {
            progress = (dailyTasks.todayStats?.toplamPuan) || 0;
        } else if (task.type === 'game_modes') {
            progress = (dailyTasks.todayStats?.allGameModes?.size) || 0;
        } else if (task.type === 'combo') {
            progress = (dailyTasks.todayStats?.comboCount) || 0;
        } else if (task.type === 'ayet_oku') {
            progress = (dailyTasks.todayStats?.ayetOku) || 0;
        } else if (task.type === 'dua_et') {
            progress = (dailyTasks.todayStats?.duaEt) || 0;
        } else if (task.type === 'hadis_oku') {
            progress = (dailyTasks.todayStats?.hadisOku) || 0;
        }
        
        task.progress = progress;
        if (progress >= task.target) {
            task.completed = true;
            if (!dailyTasks.completedTasks.includes(task.id)) {
                dailyTasks.completedTasks.push(task.id);
            }
        }
    });
    
    // Haftalık görevler kaldırıldı - güncelleme kodları devre dışı
    // (Haftalık görevler UI'dan kaldırıldı)
    
    updateTasksDisplay();
    debouncedSaveStats();
}

/**
 * Backend'den yüklenen todayStats verilerine göre görev progress'lerini günceller
 * (updateTaskProgress çağrılmadan, sadece progress güncellemesi için)
 */
function updateTaskProgressFromStats() {
    if (!dailyTasks.todayStats) return;
    
    // Günlük görevler
    if (dailyTasks.tasks && Array.isArray(dailyTasks.tasks)) {
        dailyTasks.tasks.forEach(task => {
            if (task.completed) return;
            
            let progress = 0;
            if (task.type === 'correct') {
                progress = dailyTasks.todayStats.toplamDogru || 0;
            } else if (task.type === 'hasene') {
                progress = dailyTasks.todayStats.toplamPuan || 0;
            } else if (task.type === 'game_modes') {
                progress = (dailyTasks.todayStats.allGameModes && dailyTasks.todayStats.allGameModes.size) || 0;
            } else if (task.type === 'difficulties') {
                progress = (dailyTasks.todayStats.farklıZorluk && dailyTasks.todayStats.farklıZorluk.size) || 0;
            } else if (task.type === 'combo') {
                progress = dailyTasks.todayStats.comboCount || 0;
            } else if (task.type === 'streak') {
                progress = streakData.currentStreak > 0 ? 1 : 0;
            } else if (task.type === 'ayet_oku') {
                progress = dailyTasks.todayStats.ayetOku || 0;
            } else if (task.type === 'dua_et') {
                progress = dailyTasks.todayStats.duaEt || 0;
            } else if (task.type === 'hadis_oku') {
                progress = dailyTasks.todayStats.hadisOku || 0;
            }
            
            task.progress = progress;
            if (progress >= task.target) {
                task.completed = true;
                if (!dailyTasks.completedTasks.includes(task.id)) {
                    dailyTasks.completedTasks.push(task.id);
                }
            }
        });
    }
    
    // Fazilet vazifeleri
    if (dailyTasks.bonusTasks && Array.isArray(dailyTasks.bonusTasks)) {
        dailyTasks.bonusTasks.forEach(task => {
            if (task.completed) return;
            
            let progress = 0;
            if (task.type === 'correct') {
                progress = dailyTasks.todayStats.toplamDogru || 0;
            } else if (task.type === 'hasene') {
                progress = dailyTasks.todayStats.toplamPuan || 0;
            } else if (task.type === 'game_modes') {
                progress = (dailyTasks.todayStats.allGameModes && dailyTasks.todayStats.allGameModes.size) || 0;
            } else if (task.type === 'combo') {
                progress = dailyTasks.todayStats.comboCount || 0;
            } else if (task.type === 'ayet_oku') {
                progress = dailyTasks.todayStats.ayetOku || 0;
            } else if (task.type === 'dua_et') {
                progress = dailyTasks.todayStats.duaEt || 0;
            } else if (task.type === 'hadis_oku') {
                progress = dailyTasks.todayStats.hadisOku || 0;
            }
            
            task.progress = progress;
            if (progress >= task.target) {
                task.completed = true;
                if (!dailyTasks.completedTasks.includes(task.id)) {
                    dailyTasks.completedTasks.push(task.id);
                }
            }
        });
    }
}

/**
 * Backend'den yüklenen weekStats verilerine göre görev progress'lerini günceller
 * (updateTaskProgress çağrılmadan, sadece progress güncellemesi için)
 */
function updateWeeklyTaskProgressFromStats() {
    // Haftalık görevler kaldırıldı - fonksiyon devre dışı
    // (Haftalık görevler UI'dan kaldırıldı)
    return;
}

/**
 * Görev görüntüsünü günceller
 */
function updateTasksDisplay() {
    // Günlük görevler
    const dailyTasksList = document.getElementById('daily-tasks-list');
    if (dailyTasksList) {
        dailyTasksList.innerHTML = '';
        
        // Görevler yoksa kontrol et
        if (!dailyTasks.tasks || dailyTasks.tasks.length === 0) {
            checkDailyTasks();
        }
        
        // Bonus görevler yoksa kontrol et
        if (!dailyTasks.bonusTasks || dailyTasks.bonusTasks.length === 0) {
            checkDailyTasks();
        }
        
        const allDailyTasks = [...(dailyTasks.tasks || []), ...(dailyTasks.bonusTasks || [])];
        
        if (allDailyTasks.length === 0) {
            dailyTasksList.innerHTML = '<div style="text-align: center; padding: var(--spacing-md); color: var(--text-secondary);">Görevler yükleniyor...</div>';
        } else {
            allDailyTasks.forEach(task => {
            const progressPercent = task.target > 0 ? Math.min(100, Math.round((task.progress / task.target) * 100)) : 0;
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <div class="task-info">
                    <div class="task-name-row">
                        <span class="task-name">${task.description || task.name}</span>
                        ${task.completed ? '<span class="task-check">✓</span>' : `<span class="task-progress-text">${task.progress}/${task.target}</span>`}
                    </div>
                    ${!task.completed ? `
                        <div class="task-progress-bar">
                            <div class="task-progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                    ` : ''}
                </div>
            `;
                dailyTasksList.appendChild(taskItem);
            });
        }
    }
    
    // Haftalık görevler
    // Haftalık görevler UI'dan kaldırıldı - sadece günlük görevler gösteriliyor
    
    // Ödül butonlarını kontrol et
    const allDailyCompleted = dailyTasks.tasks.every(t => t.completed) && 
                              dailyTasks.bonusTasks.every(t => t.completed);
    const claimDailyBtn = document.getElementById('claim-daily-reward');
    const rewardBoxMystery = document.querySelector('#claim-daily-reward .reward-box-mystery');
    
    if (claimDailyBtn) {
        const isDisabled = !allDailyCompleted || dailyTasks.rewardsClaimed;
        claimDailyBtn.disabled = isDisabled;
        
        // Kutu görsel durumunu güncelle
        if (dailyTasks.rewardsClaimed) {
            claimDailyBtn.classList.add('claimed');
            // Ödül alındıktan sonra mesaj göster
            if (rewardBoxMystery) {
                rewardBoxMystery.textContent = 'Ödül Alındı';
                rewardBoxMystery.style.fontSize = '0.75rem';
                rewardBoxMystery.style.letterSpacing = '0.5px';
            }
        } else {
            claimDailyBtn.classList.remove('claimed');
            // Görevler yenilendiğinde tekrar soru işareti göster
            if (rewardBoxMystery) {
                rewardBoxMystery.textContent = '???';
                rewardBoxMystery.style.fontSize = '1.1rem';
                rewardBoxMystery.style.letterSpacing = '2px';
            }
        }
    }
    
    // Görev sayacını güncelle (sadece günlük görevler)
    const tasksCounter = document.getElementById('tasks-counter');
    if (tasksCounter) {
        const dailyTasksArray = [...(dailyTasks.tasks || []), ...(dailyTasks.bonusTasks || [])];
        
        const totalTasks = dailyTasksArray.length;
        const totalCompleted = dailyTasksArray.filter(t => t.completed).length;
        
        tasksCounter.textContent = `${totalCompleted}/${totalTasks}`;
        tasksCounter.style.display = totalTasks > 0 ? 'block' : 'none';
    }
    
    // Bildirim rozeti (sadece günlük görevler için)
    const tasksBadge = document.getElementById('tasks-badge');
    if (tasksBadge) {
        if (allDailyCompleted && !dailyTasks.rewardsClaimed) {
            tasksBadge.style.display = 'block';
        } else {
            tasksBadge.style.display = 'none';
        }
    }
}

/**
 * İslami öğretiler listesi (Zikir, Dua, Hadis)
 */
const islamicTeachings = [
    {
        arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ',
        turkish: 'Güç ve kuvvet ancak Allah iledir',
        explanation: 'Bu zikir, zorluklar karşısında Allah\'a sığınmayı ve O\'ndan yardım istemeyi hatırlatır.',
        rewardAmounts: [100, 250, 500]
    },
    {
        arabic: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ',
        turkish: 'Şehadet ederim ki Allah\'tan başka ilah yoktur',
        explanation: 'Kelime-i Şehadet, İslam\'ın temelidir ve imanın ilk şartıdır.',
        rewardAmounts: [100, 250, 500]
    },
    {
        arabic: 'سُبْحَانَ اللَّهِ',
        turkish: 'Allah noksan sıfatlardan münezzehtir',
        explanation: 'Bu zikir, Allah\'ın her türlü eksiklikten uzak olduğunu hatırlatır ve günahların affına vesile olur.',
        rewardAmounts: [100, 250, 500]
    },
    {
        arabic: 'الْحَمْدُ لِلَّهِ',
        turkish: 'Hamd Allah\'a mahsustur',
        explanation: 'Her türlü övgü ve şükür Allah\'a aittir. Her durumda şükretmek mü\'minin özelliğidir.',
        rewardAmounts: [100, 250, 500]
    },
    {
        arabic: 'اللهُ أَكْبَرُ',
        turkish: 'Allah en büyüktür',
        explanation: 'Allah her şeyden daha büyüktür. Bu zikir, kalbi Allah\'a bağlar ve O\'na teslimiyeti artırır.',
        rewardAmounts: [100, 250, 500]
    },
    {
        arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
        turkish: 'Allah\'tan başka ilah yoktur',
        explanation: 'Kelime-i Tevhid, tevhid inancının özüdür ve her Müslüman\'ın kalbindeki en önemli zikirdir.',
        rewardAmounts: [100, 250, 500]
    },
    {
        arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
        turkish: 'Allah bize yeter, O ne güzel vekildir',
        explanation: 'Her şeyde Allah\'a güvenmeyi ve O\'nu vekil edinmeyi öğütleyen bir zikirdir.',
        rewardAmounts: [100, 250, 500]
    },
    {
        arabic: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
        turkish: 'Biz Allah\'a aidiz ve O\'na döneceğiz',
        explanation: 'İstirca duasıdır. Musibet anında sabır ve teslimiyet için okunur.',
        rewardAmounts: [100, 250, 500]
    },
    {
        arabic: 'مَا شَاءَ اللَّهُ',
        turkish: 'Allah dilediğini yapar',
        explanation: 'Güzel bir şey gördüğümüzde, Allah\'ın dilemesiyle olduğunu hatırlatmak için söylenir.',
        rewardAmounts: [100, 250, 500]
    },
    {
        arabic: 'بَارَكَ اللَّهُ',
        turkish: 'Allah bereket versin',
        explanation: 'Hayırlı işlerde bereket dileyerek, Allah\'tan bereket istemek için kullanılır.',
        rewardAmounts: [100, 250, 500]
    },
    {
        arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        turkish: 'Allah noksan sıfatlardan münezzehtir, hamd O\'na mahsustur',
        explanation: 'Bu zikir hem tesbih hem hamd içerir. Günahların affına ve sevap kazanmaya vesile olur.',
        rewardAmounts: [100, 250, 500]
    },
    {
        arabic: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
        turkish: 'Senden başka ilah yoktur, sen münezzehsin, ben zalimlerden oldum',
        explanation: 'Yunus (a.s.)\'ın duasıdır. Zor durumda kalanların Allah\'a yönelmesini öğütler.',
        rewardAmounts: [100, 250, 500]
    },
    {
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        turkish: 'Rabbimiz, bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru',
        explanation: 'Dünya ve ahiret hayrını isteyen mükemmel bir duadır.',
        rewardAmounts: [100, 250, 500]
    },
    {
        arabic: 'اللَّهُمَّ بَارِكْ لِي فِيهَا',
        turkish: 'Allah\'ım, bunda benim için bereket ver',
        explanation: 'Yeni bir şeye başlarken veya bir nimete sahip olurken bereket için okunur.',
        rewardAmounts: [100, 250, 500]
    },
    {
        arabic: 'رَبِّ زِدْنِي عِلْمًا',
        turkish: 'Rabbim, benim ilmimi artır',
        explanation: 'İlim öğrenmek ve bilgiye değer vermek için okunan bir duadır.',
        rewardAmounts: [100, 250, 500]
    }
];

/**
 * Günlük ödülü alır
 */
async function claimDailyRewards() {
    if (dailyTasks.rewardsClaimed) return;
    
    // Rastgele bir İslami öğreti seç
    const randomTeaching = islamicTeachings[Math.floor(Math.random() * islamicTeachings.length)];
    // Rastgele bir ödül miktarı seç (3 farklı rakam)
    const rewardPoints = randomTeaching.rewardAmounts[Math.floor(Math.random() * randomTeaching.rewardAmounts.length)];
    
    dailyTasks.rewardsClaimed = true;
    
    // skipDetailedStats=true çünkü aşağıda manuel olarak saveDetailedStats çağrılıyor
    await addToGlobalPoints(rewardPoints, 0, true);
    // Görev ödülünü detaylı istatistiklere ekle
    saveDetailedStats(rewardPoints, 0, 0, 0, 0);
    
    // Ödül modalını göster
    showDailyRewardModal(randomTeaching, rewardPoints);
    
    updateTasksDisplay();
    saveStats();
}

/**
 * Günlük ödül modalını gösterir
 */
function showDailyRewardModal(teaching, rewardAmount) {
    const modal = document.getElementById('daily-reward-modal');
    const arabicText = document.getElementById('reward-arabic-text');
    const turkishText = document.getElementById('reward-turkish-text');
    const explanationText = document.getElementById('reward-explanation');
    const pointsText = document.getElementById('reward-points');
    
    if (modal && arabicText && turkishText && explanationText && pointsText) {
        arabicText.textContent = teaching.arabic;
        turkishText.textContent = teaching.turkish;
        explanationText.textContent = teaching.explanation;
        pointsText.textContent = `+${rewardAmount.toLocaleString('tr-TR')}`;
        
        openModal('daily-reward-modal');
    }
}

/**
 * Günlük ödül modalını kapatır
 */
function closeDailyRewardModal() {
    closeModal('daily-reward-modal');
}

/**
 * Haftalık ödülü alır
 */
// Haftalık görevler kaldırıldı - fonksiyon artık kullanılmıyor
async function claimWeeklyRewards() {
    // Haftalık görevler UI'dan kaldırıldı
    return;
}

// ============================================
// STREAK SİSTEMİ
// ============================================

/**
 * Günlük ilerlemeyi günceller
 */
function updateDailyProgress(correctAnswers) {
    const today = getLocalDateString();
    
    // Bugünkü tarihi kontrol et
    if (streakData.todayDate !== today) {
        // Yeni gün
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = getLocalDateString(yesterday);
        
        // Dün hedef tamamlandı mı?
        if (streakData.lastPlayDate === yesterdayStr && streakData.todayProgress >= streakData.dailyGoal) {
            // Seri korundu/arttı
            streakData.currentStreak++;
            if (streakData.currentStreak > streakData.bestStreak) {
                streakData.bestStreak = streakData.currentStreak;
            }
        } else if (streakData.lastPlayDate !== yesterdayStr && streakData.lastPlayDate !== today) {
            // Seri kırıldı
            streakData.currentStreak = 0;
        }
        
        // Bugünkü ilerlemeyi sıfırla
        streakData.todayProgress = 0;
        streakData.todayDate = today;
    }
    
    // İlerlemeyi artır
    streakData.todayProgress += correctAnswers;
    
    // Günlük hedef tamamlandı mı?
    if (streakData.todayProgress >= streakData.dailyGoal && streakData.lastPlayDate !== today) {
        streakData.currentStreak++;
        if (streakData.currentStreak > streakData.bestStreak) {
            streakData.bestStreak = streakData.currentStreak;
        }
        streakData.lastPlayDate = today;
        streakData.totalPlayDays++;
        
        if (!streakData.playDates.includes(today)) {
            streakData.playDates.push(today);
        }
        
        showSuccessMessage(`🔥 Seri: ${streakData.currentStreak} gün!`);
    }
    
    updateStreakDisplay();
    debouncedSaveStats();
}

// ============================================
// KELİME İSTATİSTİKLERİ
// ============================================

/**
 * Kelime istatistiğini günceller
 */
/**
 * SM-2 Spaced Repetition Algoritması ile kelime istatistiklerini günceller
 */
// updateWordStats artık word-stats-manager.js modülünde
// Fallback: Eğer modül yüklenmemişse
if (typeof updateWordStats === 'undefined') {
    function updateWordStats(wordId, isCorrect) {
        // Basit fallback implementasyonu
        const today = getLocalDateString();
        if (!wordStats[wordId]) {
            wordStats[wordId] = {
                attempts: 0,
                correct: 0,
                wrong: 0,
                successRate: 0,
                masteryLevel: 0,
                lastCorrect: null,
                lastWrong: null
            };
        }
        const stats = wordStats[wordId];
        stats.attempts++;
        if (isCorrect) {
            stats.correct++;
            stats.lastCorrect = today;
        } else {
            stats.wrong++;
            stats.lastWrong = today;
        }
        stats.successRate = (stats.correct / stats.attempts) * 100;
        stats.masteryLevel = Math.min(10, Math.floor(stats.successRate / 10));
        debouncedSaveStats();
    }
    window.updateWordStats = updateWordStats;
}

/**
 * Detaylı istatistikleri kaydeder (günlük, haftalık, aylık)
 */
function saveDetailedStats(points, correct, wrong, maxCombo, perfectLessons, incrementGamesPlayed = false) {
    const today = getLocalDateString();
    const todayDate = new Date();
    
    // LOG: Fonksiyon çağrısı
    console.log('🔵 saveDetailedStats çağrıldı:', {
        points,
        correct,
        wrong,
        maxCombo,
        perfectLessons,
        incrementGamesPlayed,
        stackTrace: new Error().stack.split('\n').slice(1, 4).join('\n')
    });
    
    // Günlük istatistikler
    const dailyKey = `hasene_daily_${today}`;
    const dailyData = safeGetItem(dailyKey, {
        correct: 0,
        wrong: 0,
        points: 0,
        gamesPlayed: 0,
        perfectLessons: 0,
        maxCombo: 0,
        gameModes: {}
    });
    
    const oldCorrect = dailyData.correct || 0;
    const oldWrong = dailyData.wrong || 0;
    const oldPoints = dailyData.points || 0;
    
    dailyData.correct = (dailyData.correct || 0) + correct;
    dailyData.wrong = (dailyData.wrong || 0) + wrong;
    dailyData.points = (dailyData.points || 0) + points;
    // gamesPlayed sadece oyun tamamlandığında artırılmalı, her soru için değil
    if (incrementGamesPlayed) {
        dailyData.gamesPlayed = (dailyData.gamesPlayed || 0) + 1;
    }
    dailyData.perfectLessons = (dailyData.perfectLessons || 0) + perfectLessons;
    
    // ÖNEMLİ: dailyXP'yi de senkronize et (günlük vird gösterimi için)
    // hasene_daily_${today}.points ile dailyXP aynı değeri göstermeli
    const currentDailyXP = parseInt(localStorage.getItem('dailyXP') || '0');
    const newDailyXP = dailyData.points; // hasene_daily_${today}.points'i kullan (daha güvenilir)
    if (newDailyXP !== currentDailyXP) {
        localStorage.setItem('dailyXP', newDailyXP.toString());
        console.log('🔄 dailyXP senkronize edildi:', {
            eski: currentDailyXP,
            yeni: newDailyXP,
            kaynak: 'hasene_daily_points'
        });
    }
    
    // LOG: Günlük veri güncellemesi
    console.log('🟢 Günlük veri güncellendi:', {
        key: dailyKey,
        eski: { correct: oldCorrect, wrong: oldWrong, points: oldPoints },
        yeni: { correct: dailyData.correct, wrong: dailyData.wrong, points: dailyData.points },
        eklenen: { correct, wrong, points },
        dailyXP_senkronize: { eski: currentDailyXP, yeni: newDailyXP }
    });
    if (maxCombo > (dailyData.maxCombo || 0)) {
        dailyData.maxCombo = maxCombo;
    }
    
    // Oyun modunu belirle (currentGameMode veya currentGame'den)
    const gameModeKey = currentGameMode || 
                        (currentGame === 'kelime-cevir' ? 'kelime-cevir' :
                         currentGame === 'dinle-bul' ? 'dinle-bul' :
                         currentGame === 'bosluk-doldur' ? 'bosluk-doldur' :
                         currentGame === 'ayet-oku' ? 'ayet-oku' :
                         currentGame === 'dua-et' ? 'dua-et' :
                         currentGame === 'hadis-oku' ? 'hadis-oku' : null);
    
    if (gameModeKey) {
        dailyData.gameModes[gameModeKey] = (dailyData.gameModes[gameModeKey] || 0) + 1;
        console.log(`🎮 Günlük oyun modu sayacı güncellendi: ${gameModeKey} = ${dailyData.gameModes[gameModeKey]}`);
    } else {
        console.warn('⚠️ saveDetailedStats: Oyun modu belirlenemedi! currentGameMode:', currentGameMode, 'currentGame:', currentGame);
    }
    
    safeSetItem(dailyKey, dailyData);
    
    // LOG: localStorage senkronizasyonu kontrolü
    const localStorageCorrect = parseInt(localStorage.getItem('dailyCorrect') || '0') || 0;
    const localStorageWrong = parseInt(localStorage.getItem('dailyWrong') || '0') || 0;
    console.log('🟡 localStorage durumu:', {
        dailyCorrect: localStorageCorrect,
        dailyWrong: localStorageWrong,
        hasene_daily_correct: dailyData.correct,
        hasene_daily_wrong: dailyData.wrong,
        fark: {
            correct: Math.abs(localStorageCorrect - dailyData.correct),
            wrong: Math.abs(localStorageWrong - dailyData.wrong)
        }
    });
    
    // Haftalık istatistikler
    const weekStartStr = getWeekStartDateString(todayDate);
    const weeklyKey = `hasene_weekly_${weekStartStr}`;
    const weeklyData = safeGetItem(weeklyKey, {
        hasene: 0,
        correct: 0,
        wrong: 0,
        daysPlayed: 0,
        gamesPlayed: 0,
        perfectLessons: 0,
        maxCombo: 0,
        streakDays: 0,
        playedDates: []
    });
    
    weeklyData.hasene = (weeklyData.hasene || 0) + points;
    weeklyData.correct = (weeklyData.correct || 0) + correct;
    weeklyData.wrong = (weeklyData.wrong || 0) + wrong;
    // gamesPlayed sadece oyun tamamlandığında artırılmalı, her soru için değil
    if (incrementGamesPlayed) {
        weeklyData.gamesPlayed = (weeklyData.gamesPlayed || 0) + 1;
    }
    weeklyData.perfectLessons = (weeklyData.perfectLessons || 0) + perfectLessons;
    if (maxCombo > (weeklyData.maxCombo || 0)) {
        weeklyData.maxCombo = maxCombo;
    }
    
    // Bugün oynandı mı kontrol et
    const playedDates = weeklyData.playedDates || [];
    if (!playedDates.includes(today)) {
        playedDates.push(today);
        weeklyData.daysPlayed = (weeklyData.daysPlayed || 0) + 1;
        weeklyData.playedDates = playedDates;
    }
    
    // Streak kontrolü
    if (streakData.currentStreak > 0) {
        weeklyData.streakDays = Math.max(weeklyData.streakDays || 0, streakData.currentStreak);
    }
    
    safeSetItem(weeklyKey, weeklyData);
    
    // Aylık istatistikler
    const monthStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}`;
    const monthlyKey = `hasene_monthly_${monthStr}`;
    const monthlyData = safeGetItem(monthlyKey, {
        hasene: 0,
        correct: 0,
        wrong: 0,
        daysPlayed: 0,
        gamesPlayed: 0,
        perfectLessons: 0,
        maxCombo: 0,
        streakDays: 0,
        bestStreak: 0,
        playedDates: []
    });
    
    monthlyData.hasene = (monthlyData.hasene || 0) + points;
    monthlyData.correct = (monthlyData.correct || 0) + correct;
    monthlyData.wrong = (monthlyData.wrong || 0) + wrong;
    // gamesPlayed sadece oyun tamamlandığında artırılmalı, her soru için değil
    if (incrementGamesPlayed) {
        monthlyData.gamesPlayed = (monthlyData.gamesPlayed || 0) + 1;
    }
    monthlyData.perfectLessons = (monthlyData.perfectLessons || 0) + perfectLessons;
    if (maxCombo > (monthlyData.maxCombo || 0)) {
        monthlyData.maxCombo = maxCombo;
    }
    
    // Bugün oynandı mı kontrol et
    const monthlyPlayedDates = monthlyData.playedDates || [];
    if (!monthlyPlayedDates.includes(today)) {
        monthlyPlayedDates.push(today);
        monthlyData.daysPlayed = (monthlyData.daysPlayed || 0) + 1;
        monthlyData.playedDates = monthlyPlayedDates;
    }
    
    // Streak kontrolü
    if (streakData.currentStreak > 0) {
        monthlyData.streakDays = Math.max(monthlyData.streakDays || 0, streakData.currentStreak);
        monthlyData.bestStreak = Math.max(monthlyData.bestStreak || 0, streakData.bestStreak || 0);
    }
    
    safeSetItem(monthlyKey, monthlyData);
    
    // Supabase'e kaydet (async, hata olsa bile devam et)
    if (typeof window.saveDailyStat === 'function') {
        window.saveDailyStat(today, dailyData).catch(error => {
            console.warn('Supabase\'e daily_stat kaydedilemedi:', error);
        });
    }
    
    if (typeof window.saveWeeklyStat === 'function') {
        window.saveWeeklyStat(weekStartStr, weeklyData).catch(error => {
            console.warn('Supabase\'e weekly_stat kaydedilemedi:', error);
        });
    }
    
    if (typeof window.saveMonthlyStat === 'function') {
        window.saveMonthlyStat(monthStr, monthlyData).catch(error => {
            console.warn('Supabase\'e monthly_stat kaydedilemedi:', error);
        });
    }
}

// getStrugglingWords ve selectIntelligentWords artık word-stats-manager.js modülünde
// Fallback: Eğer modül yüklenmemişse
if (typeof getStrugglingWords === 'undefined') {
    function getStrugglingWords() {
        const allWords = Object.keys(wordStats)
            .filter(wordId => {
                const stats = wordStats[wordId];
                return stats.successRate < 50 && stats.attempts >= 2;
            })
            .map(wordId => {
                return { id: wordId, ...wordStats[wordId] };
            });
        return allWords;
    }
    window.getStrugglingWords = getStrugglingWords;
}

/**
 * Akıllı kelime seçimi algoritması
 * Öncelik sırası:
 * 1. Son yanlış cevap verilen kelimeler (100x, 50x, 25x, ...)
 * 2. Zorlanılan kelimeler (3x)
 * 3. Review mode'da zorlanılan kelimelere ekstra öncelik
 * 4. Ustalık seviyesi düşük kelimeler
 * 5. Rastgele seçim (ağırlıklı)
 */
function selectIntelligentWords(words, count, isReviewMode = false) {
    if (words.length === 0) return [];
    
    const today = getLocalDateString();
    const recentWrongWords = [];
    const strugglingWords = [];
    const lowMasteryWords = [];
    const normalWords = [];
    
    // Son 10 yanlış cevabı al (tarih sırasına göre)
    const wrongAnswers = Object.keys(wordStats)
        .map(wordId => {
            const stats = wordStats[wordId];
            if (stats.lastWrong) {
                const daysDiff = getDaysDifference(stats.lastWrong, today);
                return {
                    wordId,
                    stats,
                    daysDiff,
                    priority: daysDiff <= 0 ? 100 : daysDiff === 1 ? 50 : daysDiff === 2 ? 25 : daysDiff === 3 ? 12 : 0
                };
            }
            return null;
        })
        .filter(w => w && w.priority > 0)
        .sort((a, b) => a.daysDiff - b.daysDiff)
        .slice(0, 10);
    
    // Kelimeleri kategorilere ayır (Spaced Repetition önceliği ile)
    words.forEach(word => {
        const wordId = word.id;
        const stats = wordStats[wordId];
        
        if (!stats) {
            // Hiç denenmemiş kelime - yüksek öncelik
            normalWords.push({ word, priority: 5 });
            return;
        }
        
        // SPACED REPETITION: Tekrar zamanı gelmiş kelimeler (en yüksek öncelik)
        if (stats.nextReviewDate) {
            const daysUntilReview = getDaysDifference(today, stats.nextReviewDate);
            if (daysUntilReview <= 0) {
                // Tekrar zamanı geçmiş veya bugün - çok yüksek öncelik
                const overdueDays = Math.abs(daysUntilReview);
                const priority = 200 + (overdueDays * 10); // Gecikme ne kadar fazlaysa o kadar öncelik
                recentWrongWords.push({ word, priority, stats });
                return;
            }
        }
        
        // Son yanlış cevap verilen kelimeler
        const recentWrong = wrongAnswers.find(w => w.wordId === wordId);
        if (recentWrong) {
            recentWrongWords.push({ word, priority: recentWrong.priority });
            return;
        }
        
        // Zorlanılan kelimeler (başarı oranı < 50% ve en az 2 deneme)
        if (stats.successRate < 50 && stats.attempts >= 2) {
            const priority = isReviewMode ? 10 : 3; // Review mode'da ekstra öncelik
            strugglingWords.push({ word, priority, stats });
            return;
        }
        
        // Ustalık seviyesi düşük kelimeler (0-3)
        if (stats.masteryLevel <= 3 && stats.attempts > 0) {
            lowMasteryWords.push({ word, priority: 2, stats });
            return;
        }
        
        // Normal kelimeler (tekrar zamanı henüz gelmemiş)
        // Tekrar zamanı yaklaşan kelimelere hafif öncelik ver
        let priority = 1;
        if (stats.nextReviewDate) {
            const daysUntilReview = getDaysDifference(today, stats.nextReviewDate);
            if (daysUntilReview <= 2 && daysUntilReview > 0) {
                // 1-2 gün içinde tekrar zamanı gelecek - hafif öncelik
                priority = 1.5;
            }
        }
        normalWords.push({ word, priority });
    });
    
    // Öncelik sırasına göre birleştir
    const allWordsWithPriority = [
        ...recentWrongWords,
        ...strugglingWords,
        ...lowMasteryWords,
        ...normalWords
    ];
    
    // Ağırlıklı rastgele seçim
    const selectedWords = [];
    const usedIds = new Set();
    
    // Önce yüksek öncelikli kelimeleri seç
    const highPriorityWords = allWordsWithPriority
        .filter(w => w.priority >= 10 && !usedIds.has(w.word.id))
        .sort((a, b) => b.priority - a.priority);
    
    // Yüksek öncelikli kelimelerden seç (en fazla count/2)
    const highPriorityCount = Math.min(Math.floor(count / 2), highPriorityWords.length);
    for (let i = 0; i < highPriorityCount && selectedWords.length < count; i++) {
        selectedWords.push(highPriorityWords[i].word);
        usedIds.add(highPriorityWords[i].word.id);
    }
    
    // Kalan kelimeleri ağırlıklı rastgele seç
    const remainingWords = allWordsWithPriority.filter(w => !usedIds.has(w.word.id));
    
    while (selectedWords.length < count && remainingWords.length > 0) {
        // Toplam öncelik skorunu hesapla
        const totalPriority = remainingWords.reduce((sum, w) => sum + w.priority, 0);
        
        // Rastgele bir sayı seç (0 - totalPriority arası)
        let random = Math.random() * totalPriority;
        
        // Öncelik skoruna göre kelime seç
        for (const item of remainingWords) {
            random -= item.priority;
            if (random <= 0) {
                selectedWords.push(item.word);
                usedIds.add(item.word.id);
                // Seçilen kelimeyi listeden çıkar
                const index = remainingWords.indexOf(item);
                remainingWords.splice(index, 1);
                break;
            }
        }
    }
    
    // Eğer hala yeterli kelime yoksa, rastgele ekle
    if (selectedWords.length < count) {
        const remaining = words.filter(w => !usedIds.has(w.id));
        const needed = count - selectedWords.length;
        const randomWords = getRandomItems(remaining, needed);
        selectedWords.push(...randomWords);
    }
    
    // Son olarak karıştır (ama yüksek öncelikli kelimeler başta olsun)
    const shuffled = shuffleArray(selectedWords);
    
    infoLog(`Akıllı kelime seçimi: ${recentWrongWords.length} son yanlış, ${strugglingWords.length} zorlanılan, ${lowMasteryWords.length} düşük ustalık, ${normalWords.length} normal`);
    
    return shuffled;
}

// ============================================
// ROZET SİSTEMİ
// ============================================

/**
 * Rozetleri kontrol eder
 */
function checkBadges() {
    if (!BADGE_DEFINITIONS) return;
    
    // Tüm oyun modlarını say
    const allModesPlayed = Object.values(gameStats.gameModeCounts).filter(count => count > 0).length;
    
    const stats = {
        totalPoints,
        totalCorrect: gameStats.totalCorrect,
        totalWrong: gameStats.totalWrong,
        level: calculateLevel(totalPoints),
        currentStreak: streakData.currentStreak,
        maxCombo,
        perfectLessons: perfectLessonsCount,
        allModesPlayed: allModesPlayed
    };
    
    // Asr-ı Saadet rozetlerini kronolojik sıraya göre ayır
    const asrBadges = BADGE_DEFINITIONS.filter(badge => badge.id.startsWith('asr_'));
    const regularBadges = BADGE_DEFINITIONS.filter(badge => !badge.id.startsWith('asr_'));
    
    // Önce normal rozetleri kontrol et (kronolojik sıra gerekmez)
    regularBadges.forEach(badge => {
        // Yeni ve eski format desteği
        const isUnlocked = unlockedBadges.some(b => {
            if (typeof b === 'string') return b === badge.id;
            return b.id === badge.id;
        });
        if (isUnlocked) {
            return; // Zaten kazanılmış
        }
        
        if (badge.check(stats)) {
            unlockBadge(badge);
        }
    });
    
    // Asr-ı Saadet rozetlerini kronolojik sıraya göre kontrol et
    // Rozetleri numaralarına göre sırala (asr_1, asr_2, ... asr_41)
    asrBadges.sort((a, b) => {
        const numA = parseInt(a.id.split('_')[1]);
        const numB = parseInt(b.id.split('_')[1]);
        return numA - numB;
    });
    
    asrBadges.forEach((badge, index) => {
        // Yeni ve eski format desteği
        const isUnlocked = unlockedBadges.some(b => {
            if (typeof b === 'string') return b === badge.id;
            return b.id === badge.id;
        });
        if (isUnlocked) {
            return; // Zaten kazanılmış
        }
        
        // Kronolojik kontrol: Önceki tüm rozetler kazanılmış olmalı
        let canUnlock = true;
        if (index > 0) {
            // Önceki rozetlerin hepsinin kazanılmış olup olmadığını kontrol et
            for (let i = 0; i < index; i++) {
                const previousBadge = asrBadges[i];
                const previousUnlocked = unlockedBadges.some(b => {
                    if (typeof b === 'string') return b === previousBadge.id;
                    return b.id === previousBadge.id;
                });
                if (!previousUnlocked) {
                    canUnlock = false;
                    break;
                }
            }
        }
        
        // Eğer önceki rozetler kazanılmışsa ve koşullar sağlanmışsa rozeti kazan
        if (canUnlock && badge.check(stats)) {
            unlockBadge(badge);
        }
    });
}

/**
 * Rozeti açar
 */
function unlockBadge(badge) {
    // Zaten kazanılmış mı kontrol et
    const alreadyUnlocked = unlockedBadges.some(b => b.id === badge.id || (typeof b === 'string' && b === badge.id));
    if (alreadyUnlocked) {
        return;
    }
    
    // Yeni format: object with timestamp
    unlockedBadges.push({
        id: badge.id,
        unlockedAt: Date.now()
    });
    showBadgeUnlock(badge);
    
    // Backend'e kaydet
    if (typeof window.saveBadge === 'function') {
        window.saveBadge(badge.id).catch(err => {
            console.warn('Badge backend kayıt hatası (normal olabilir):', err);
        });
    }
    
    saveStats();
}

/**
 * Rozet detay modalını gösterir
 */
function showBadgeDetail(badge, isUnlocked) {
    if (!badge || !isUnlocked) return;
    
    const modal = document.getElementById('badge-detail-modal');
    const titleEl = document.getElementById('badge-detail-title');
    const contentEl = document.getElementById('badge-detail-content');
    
    if (!modal || !titleEl || !contentEl) return;
    
    // Rozet numarasını al (asr_1 -> 1, asr_2 -> 2, vb.)
    const badgeNum = badge.id.startsWith('asr_') ? parseInt(badge.id.split('_')[1]) : null;
    
    // Rozet detay bilgilerini oluştur (responsive inline styles)
    let detailHTML = `
        <div style="margin-bottom: clamp(15px, 4vw, 20px);">
            <img src="assets/badges/${badge.image}" alt="${badge.name}" 
                 style="width: clamp(120px, 25vw, 160px); height: clamp(120px, 25vw, 160px); object-fit: contain; margin-bottom: clamp(12px, 3vw, 15px); border-radius: var(--radius-md); box-shadow: 0 4px 15px rgba(0,0,0,0.1);"
                 onerror="this.style.display='none';">
        </div>
        <h3 style="color: var(--accent-primary); margin-bottom: clamp(8px, 2vw, 10px); font-size: clamp(1.2rem, 4vw, 1.5rem); word-wrap: break-word;">${badge.name}</h3>
    `;
    
    // Asr-ı Saadet rozetleri için detaylı bilgi
    if (badgeNum && badgeNum >= 1 && badgeNum <= 41) {
        const badgeDetails = getBadgeDetailInfo(badgeNum);
        if (badgeDetails) {
            detailHTML += `
                <div style="text-align: left; max-width: 100%; width: 100%; margin: 0 auto; padding: 0 clamp(5px, 2vw, 10px); box-sizing: border-box; word-wrap: break-word; overflow-wrap: break-word;">
                    <div class="badge-detail-year" style="color: var(--accent-primary); font-weight: 600; margin-bottom: clamp(8px, 2vw, 10px); font-size: clamp(0.85rem, 2.5vw, 1rem); word-wrap: break-word; overflow-wrap: break-word;">
                        ${badgeDetails.year}
                    </div>
                    <div class="badge-detail-description" style="color: var(--text-primary); line-height: 1.8; margin-bottom: clamp(15px, 3vw, 20px); font-size: clamp(0.9rem, 2.5vw, 1rem); word-wrap: break-word; overflow-wrap: break-word; text-align: justify; text-justify: inter-word; width: 100%; box-sizing: border-box;">
                        ${badgeDetails.fullDescription}
                    </div>
                    ${badgeDetails.arabic ? `
                        <div class="badge-detail-arabic" style="font-family: 'KFGQPC Uthmanic Script HAFS', 'Arial', sans-serif; 
                                    font-size: clamp(1rem, 3vw, 1.2rem); color: var(--accent-primary); 
                                    direction: rtl; text-align: right; 
                                    padding: clamp(10px, 3vw, 15px); background: #f8f9fa; 
                                    border-radius: 8px; margin-bottom: clamp(12px, 3vw, 15px); word-wrap: break-word; overflow-wrap: break-word; width: 100%; box-sizing: border-box;">
                            ${badgeDetails.arabic}
                        </div>
                    ` : ''}
                    <div class="badge-detail-significance" style="color: var(--text-secondary); font-size: clamp(0.8rem, 2.2vw, 0.9rem); font-style: italic; 
                                padding-top: clamp(12px, 3vw, 15px); border-top: 1px solid #e5e7eb; word-wrap: break-word; overflow-wrap: break-word; text-align: justify; text-justify: inter-word; width: 100%; box-sizing: border-box;">
                        📌 ${badgeDetails.significance}
                    </div>
                </div>
            `;
        }
    } else {
        // Normal rozetler için basit açıklama
        detailHTML += `
            <div style="text-align: left; max-width: 100%; width: 100%; margin: 0 auto; padding: 0 clamp(5px, 2vw, 10px); box-sizing: border-box; word-wrap: break-word; overflow-wrap: break-word;">
                <div style="color: var(--text-primary); line-height: 1.8; font-size: clamp(0.9rem, 2.5vw, 1rem); word-wrap: break-word; overflow-wrap: break-word; text-align: justify; text-justify: inter-word; width: 100%; box-sizing: border-box;">
                    ${badge.description}
                </div>
            </div>
        `;
    }
    
    titleEl.textContent = badge.name;
    contentEl.innerHTML = detailHTML;
    openModal('badge-detail-modal');
}

/**
 * Rozet detay bilgilerini döndürür
 */
function getBadgeDetailInfo(badgeNum) {
    const badgeDetails = {
        1: { year: '571 - Miladi', fullDescription: 'Hz. Muhammed (s.a.v.) Mekke\'de doğdu. Fil Yılı olarak bilinen bu yıl, Ebrehe\'nin Kabe\'yi yıkmak için geldiği yıldır.', arabic: 'وُلِدَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ', significance: 'İslam tarihinin başlangıcı' },
        2: { year: '575 - Miladi', fullDescription: 'Çocukluğunun ilk yıllarını çöl hayatında, sütannesi Halime bint Ebi Züeyb\'in yanında geçirdi. Bu dönemde göğsünün yarılması mucizesi gerçekleşti.', arabic: 'حَلِيمَةُ السَّعْدِيَّةُ', significance: 'Sağlıklı büyüme ve Arapça\'nın saf halini öğrenme' },
        3: { year: '578 - Miladi', fullDescription: 'Annesi vefat ettikten sonra dedesi Abdülmuttalib\'in himayesine girdi. Dedesi onu çok sever ve korurdu.', arabic: 'عَبْدُ الْمُطَّلِبِ', significance: 'Kabile liderliği ve Mekke\'nin önemli ailelerini tanıma' },
        4: { year: '579 - Miladi', fullDescription: 'Dedesi vefat edince amcası Ebu Talib\'in yanına alındı. Ebu Talib onu kendi çocuklarından daha çok severdi.', arabic: 'أَبُو طَالِبٍ', significance: 'Ticaret hayatına giriş ve Şam seyahati' },
        5: { year: '595 - Miladi', fullDescription: 'Hz. Hatice validemizle evlendi. Bu evlilik 25 yıl sürdü ve Hz. Hatice, İslam\'ın ilk kadın mümini oldu.', arabic: 'خَدِيجَةُ بِنْتُ خُوَيْلِدٍ', significance: 'İlk ve en sadık destekçi, tüm çocuklarının annesi' },
        6: { year: '610 - Miladi', fullDescription: 'Hira Mağarası\'nda ilk vahiy geldi: "Oku! Yaratan Rabbinin adıyla oku!" (Alak Suresi 1-5). Bu, peygamberliğin başlangıcıdır.', arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ', significance: 'İslam\'ın başlangıcı, ilk ayetlerin inişi' },
        7: { year: '610 - Miladi', fullDescription: 'Hz. Hatice, Hz. Ebu Bekir, Hz. Ali ve Hz. Zeyd ilk Müslümanlar oldu. İslam gizlice yayılmaya başladı.', arabic: 'أَوَّلُ الْمُسْلِمِينَ', significance: 'İslam toplumunun temelleri' },
        8: { year: '613 - Miladi', fullDescription: '"En yakın akrabanı uyar" ayeti gelince, Safa Tepesi\'nde açıkça İslam\'a davet başladı. Mekke müşrikleri şiddetli tepki gösterdi.', arabic: 'وَأَنْذِرْ عَشِيرَتَكَ الْأَقْرَبِينَ', significance: 'İslam\'ın açıkça ilan edilmesi' },
        9: { year: '615 - Miladi', fullDescription: 'Müşriklerin zulmünden kaçan ilk Müslümanlar Habeşistan\'a hicret etti. Necaşi onları korudu.', arabic: 'هِجْرَةُ الْحَبَشَةِ', significance: 'İlk hicret, İslam\'ın yayılması' },
        10: { year: '619 - Miladi', fullDescription: 'Hz. Hatice ve Ebu Talib\'in vefatı. Peygamberimiz bu yıla "Hüzün Yılı" adını verdi. En büyük destekçilerini kaybetti.', arabic: 'عَامُ الْحُزْنِ', significance: 'En zor dönem, sabır ve metanet' },
        11: { year: '620 - Miladi', fullDescription: 'Bir gecede Mescid-i Haram\'dan Mescid-i Aksa\'ya (İsra), oradan da göklere yükselme (Miraç) mucizesi. Beş vakit namaz farz kılındı.', arabic: 'الْإِسْرَاءُ وَالْمِعْرَاجُ', significance: 'En büyük mucizelerden biri, namazın farz kılınması' },
        12: { year: '621 - Miladi', fullDescription: 'Medineli 12 kişi Akabe\'de Peygamberimizle görüştü ve İslam\'ı kabul etti. Medine\'ye İslam\'ı öğretmek için öğretmen gönderildi.', arabic: 'بَيْعَةُ الْعَقَبَةِ الْأُولَى', significance: 'Medine ile ilk bağlantı' },
        13: { year: '622 - Miladi', fullDescription: '73 Medineli Müslüman Akabe\'de biat etti ve Peygamberimizi Medine\'ye davet ettiler. Hicret için izin verildi.', arabic: 'بَيْعَةُ الْعَقَبَةِ الثَّانِيَةُ', significance: 'Hicret kararı, Medine\'ye davet' },
        14: { year: '622 - Miladi (Hicri 1)', fullDescription: 'Peygamberimiz ve Hz. Ebu Bekir Mekke\'den Medine\'ye hicret etti. Hicri takvimin başlangıcı. Kuba Mescidi inşa edildi.', arabic: 'الْهِجْرَةُ', significance: 'İslam devletinin kuruluşu, Hicri takvimin başlangıcı' },
        15: { year: '622 - Miladi (Hicri 1)', fullDescription: 'Medine\'de Mescid-i Nebevi inşa edildi. Aynı zamanda Suffa (eğitim yeri) ve Hz. Aişe\'nin odaları yapıldı.', arabic: 'الْمَسْجِدُ النَّبَوِيُّ', significance: 'İslam\'ın merkezi, eğitim ve ibadet yeri' },
        16: { year: '622 - Miladi (Hicri 1)', fullDescription: 'Muhacirler (Mekkeli Müslümanlar) ile Ensar (Medineli Müslümanlar) arasında kardeşlik antlaşması yapıldı.', arabic: 'الْمُؤَاخَاةُ بَيْنَ الْمُهَاجِرِينَ وَالْأَنْصَارِ', significance: 'İslam kardeşliğinin temelleri' },
        17: { year: '624 - Miladi (Hicri 2)', fullDescription: 'İlk büyük savaş. 313 Müslüman, 1000 kişilik müşrik ordusunu yendi. Melekler yardım etti. Zafer kazanıldı.', arabic: 'غَزْوَةُ بَدْرٍ', significance: 'İlk büyük zafer, İslam\'ın gücünün kanıtı' },
        18: { year: '624 - Miladi (Hicri 2)', fullDescription: 'Ramazan ayında oruç tutmak farz kılındı. Bedir Savaşı\'ndan sonra bu emir geldi.', arabic: 'صَوْمُ رَمَضَانَ', significance: 'İslam\'ın temel ibadetlerinden biri' },
        19: { year: '625 - Miladi (Hicri 3)', fullDescription: 'Müşrikler intikam için geldi. Okçuların yerlerini terk etmesi sonucu zorlu bir savaş oldu. Hz. Hamza şehit oldu.', arabic: 'غَزْوَةُ أُحُدٍ', significance: 'İtaat ve sabır dersi, şehitler' },
        20: { year: '627 - Miladi (Hicri 5)', fullDescription: 'Medine\'nin etrafına hendek kazıldı. 10.000 kişilik müşrik ordusu kuşatmayı kaldıramadı. Selman-ı Farisi\'nin önerisi.', arabic: 'غَزْوَةُ الْخَنْدَقِ', significance: 'Strateji zaferi, Medine\'nin korunması' },
        21: { year: '628 - Miladi (Hicri 6)', fullDescription: 'Mekke\'ye umre için gidildi ama müşrikler engelledi. Hudeybiye\'de 10 yıllık barış antlaşması imzalandı. Görünüşte zor ama stratejik zafer.', arabic: 'صُلْحُ الْحُدَيْبِيَةِ', significance: 'Barış antlaşması, İslam\'ın yayılması için fırsat' },
        22: { year: '629 - Miladi (Hicri 7)', fullDescription: 'Yahudilerin kalesi Hayber fethedildi. Hz. Ali\'nin kahramanlıkları. Yahudiler Medine\'den çıkarıldıktan sonra buraya yerleşmişlerdi.', arabic: 'فَتْحُ خَيْبَرَ', significance: 'Güçlü kalenin fethi, ganimetler' },
        23: { year: '630 - Miladi (Hicri 8)', fullDescription: 'Hudeybiye Antlaşması\'nın ihlali üzerine 10.000 kişilik orduyla Mekke fethedildi. Kabe putlardan temizlendi. Genel af ilan edildi.', arabic: 'فَتْحُ مَكَّةَ', significance: 'En büyük zafer, Kabe\'nin temizlenmesi' },
        24: { year: '630 - Miladi (Hicri 8)', fullDescription: 'Mekke\'nin fethinden sonra Hevazin ve Sakif kabileleri saldırdı. İlk başta zorluk yaşandı ama zafer kazanıldı.', arabic: 'غَزْوَةُ حُنَيْنٍ', significance: 'Son büyük savaş, ganimetlerin dağıtımı' },
        25: { year: '630 - Miladi (Hicri 9)', fullDescription: 'Bizans\'a karşı son sefer. Çok zorlu bir yolculuk. Münafıklar geri kaldı. Savaş olmadı ama İslam\'ın gücü gösterildi.', arabic: 'غَزْوَةُ تَبُوكَ', significance: 'En uzak sefer, münafıkların ortaya çıkması' },
        26: { year: '631 - Miladi (Hicri 9)', fullDescription: 'Peygamberimizin son haccı. 100.000\'den fazla Müslüman katıldı. Veda Hutbesi okundu. "Bugün dininizi kemale erdirdim" ayeti indi.', arabic: 'حَجَّةُ الْوَدَاعِ', significance: 'Son hacc, Veda Hutbesi, dinin tamamlanması' },
        27: { year: '632 - Miladi (Hicri 11)', fullDescription: 'Peygamberimiz 63 yaşında vefat etti. Hz. Aişe\'nin odasında, başı Hz. Aişe\'nin göğsünde. "En yüce dosta" kavuştu.', arabic: 'وَفَاةُ رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ', significance: 'Asr-ı Saadet\'in sonu, tüm Müslümanlar için büyük kayıp' },
        28: { year: '632 - Miladi (Hicri 11)', fullDescription: 'Peygamberimizin vefatından sonra Sakife\'de toplanıldı. Hz. Ebu Bekir ilk halife seçildi. "Sıddık" lakabıyla bilinir.', arabic: 'خِلَافَةُ أَبِي بَكْرٍ الصِّدِّيقِ', significance: 'İlk halife, İslam devletinin devamı' },
        29: { year: '632-633 - Miladi (Hicri 11-12)', fullDescription: 'Peygamberimizin vefatından sonra bazı kabileler dinden döndü. Hz. Ebu Bekir bunlarla savaştı ve İslam\'ı korudu.', arabic: 'حُرُوبُ الرِّدَّةِ', significance: 'İslam\'ın korunması, devletin güçlenmesi' },
        30: { year: '634 - Miladi (Hicri 13)', fullDescription: 'Hz. Ebu Bekir\'in vefatından sonra Hz. Ömer halife oldu. "Faruk" lakabıyla bilinir. Adalet ve cesaret timsali.', arabic: 'خِلَافَةُ عُمَرَ بْنِ الْخَطَّابِ', significance: 'Adalet dönemi, İslam\'ın genişlemesi' },
        31: { year: '636 - Miladi (Hicri 15)', fullDescription: 'İran Sasani İmparatorluğu\'na karşı büyük zafer. Sa\'d bin Ebi Vakkas komutasında. İran\'ın fethi başladı.', arabic: 'مَعْرَكَةُ الْقَادِسِيَّةِ', significance: 'İran\'ın fethinin başlangıcı' },
        32: { year: '637 - Miladi (Hicri 16)', fullDescription: 'Hz. Ömer bizzat geldi ve Kudüs\'ü teslim aldı. Mescid-i Aksa\'yı ziyaret etti. Adaletli yönetim örneği.', arabic: 'فَتْحُ بَيْتِ الْمَقْدِسِ', significance: 'Üç kutsal şehirden birinin fethi' },
        33: { year: '638 - Miladi (Hicri 17)', fullDescription: 'Hz. Ömer, Hicri takvimi resmi takvim olarak kabul etti. Hicret yılı (622) başlangıç kabul edildi.', arabic: 'التَّقْوِيمُ الْهِجْرِيُّ', significance: 'İslam takvimi, tarihleme sistemi' },
        34: { year: '644 - Miladi (Hicri 23)', fullDescription: 'Ebu Lü\'lü adlı bir köle tarafından sabah namazında şehit edildi. 10 yıl halifelik yaptı. Adalet dönemi sona erdi.', arabic: 'اسْتِشْهَادُ عُمَرَ بْنِ الْخَطَّابِ', significance: 'Büyük halifenin şehit olması' },
        35: { year: '644 - Miladi (Hicri 23)', fullDescription: 'Şura heyeti Hz. Osman\'ı halife seçti. "Zinnureyn" (iki nur sahibi) lakabıyla bilinir. Kuran\'ın çoğaltılması.', arabic: 'خِلَافَةُ عُثْمَانَ بْنِ عَفَّانَ', significance: 'Kuran\'ın çoğaltılması, donanma kurulması' },
        36: { year: '650 - Miladi (Hicri 30)', fullDescription: 'Hz. Osman döneminde Kuran-ı Kerim çoğaltıldı ve farklı bölgelere gönderildi. Standart Mushaf oluşturuldu.', arabic: 'جَمْعُ الْقُرْآنِ', significance: 'Kuran\'ın korunması, standart nüsha' },
        37: { year: '656 - Miladi (Hicri 35)', fullDescription: 'Fitne dönemi. Asiler Medine\'yi kuşattı. Hz. Osman Kuran okurken şehit edildi. 12 yıl halifelik yaptı.', arabic: 'اسْتِشْهَادُ عُثْمَانَ بْنِ عَفَّانَ', significance: 'Fitne döneminin başlangıcı' },
        38: { year: '656 - Miladi (Hicri 35)', fullDescription: 'Hz. Osman\'ın şehit edilmesinden sonra Hz. Ali halife seçildi. "Esedullah" (Allah\'ın Aslanı) lakabıyla bilinir.', arabic: 'خِلَافَةُ عَلِيِّ بْنِ أَبِي طَالِبٍ', significance: 'Dördüncü halife, ilim ve cesaret' },
        39: { year: '656 - Miladi (Hicri 36)', fullDescription: 'Hz. Aişe, Talha ve Zübeyr ile Hz. Ali arasında savaş. Hz. Ali galip geldi. İslam tarihinde ilk iç savaş.', arabic: 'وَقْعَةُ الْجَمَلِ', significance: 'İlk iç savaş, fitne dönemi' },
        40: { year: '657 - Miladi (Hicri 37)', fullDescription: 'Hz. Ali ile Muaviye arasında savaş. Hakem olayı gerçekleşti. İslam dünyasında ayrılık başladı.', arabic: 'مَعْرَكَةُ صِفِّينَ', significance: 'Büyük iç savaş, hakem olayı' },
        41: { year: '661 - Miladi (Hicri 40)', fullDescription: 'Haricilerden İbn Mülcem tarafından sabah namazında zehirli kılıçla şehit edildi. Dört halife dönemi sona erdi.', arabic: 'اسْتِشْهَادُ عَلِيِّ بْنِ أَبِي طَالِبٍ', significance: 'Dört halife döneminin sonu, Emevi döneminin başlangıcı' }
    };
    
    return badgeDetails[badgeNum] || null;
}

/**
 * Rozet kazanma popup'ını gösterir
 */
function showBadgeUnlock(badge) {
    // Başarım modalını kullan (aynı yapı)
    document.getElementById('achievement-title').textContent = badge.name;
    document.getElementById('achievement-desc').textContent = badge.description;
    
    const iconEl = document.getElementById('achievement-icon');
    if (iconEl && iconEl.tagName === 'IMG') {
        // Rozet görselini yükle, hata durumunda fallback göster
        iconEl.src = `assets/badges/${badge.image}`;
        iconEl.alt = badge.name;
        iconEl.style.display = 'block';
        iconEl.onerror = function() {
            // Görsel yüklenemezse fallback icon'u göster
            this.style.display = 'none';
            const fallbackIcon = this.nextElementSibling;
            if (fallbackIcon && fallbackIcon.classList.contains('achievement-icon')) {
                fallbackIcon.style.display = 'block';
                fallbackIcon.textContent = badge.name.split(' ')[0] || '🏆';
            }
        };
        const fallbackIcon = iconEl.nextElementSibling;
        if (fallbackIcon && fallbackIcon.classList.contains('achievement-icon')) {
            fallbackIcon.style.display = 'none';
        }
    }
    
    openModal('achievement-modal');
    
    // 3 saniye sonra otomatik kapat
    setTimeout(() => {
        closeModal('achievement-modal');
    }, 3000);
}

// ============================================
// BAŞARIM SİSTEMİ
// ============================================

/**
 * Başarımları kontrol eder
 */
function checkAchievements() {
    // Yıldız sayısını hesapla (250 Hasene = 1 Yıldız)
    const calculatedBadges = calculateBadges(totalPoints);
    const stats = {
        totalPoints,
        totalCorrect: gameStats.totalCorrect,
        totalWrong: gameStats.totalWrong,
        level: calculateLevel(totalPoints),
        currentStreak: streakData.currentStreak,
        maxCombo,
        perfectLessons: perfectLessonsCount,
        allModesPlayed: Object.keys(gameStats.gameModeCounts || {}).filter(mode => (gameStats.gameModeCounts[mode] || 0) > 0).length,
        stars: calculatedBadges.stars // Yıldız sayısını stats'e ekle
    };
    
        ACHIEVEMENTS.forEach(achievement => {
        // Yeni ve eski format desteği
        const isUnlocked = unlockedAchievements.some(a => {
            if (typeof a === 'string') return a === achievement.id;
            return a.id === achievement.id;
        });
        if (isUnlocked) {
            return; // Zaten kazanılmış
        }
        
        if (achievement.check(stats)) {
            unlockAchievement(achievement);
        }
    });
}

/**
 * Başarımı açar
 */
function unlockAchievement(achievement) {
    // Zaten kazanılmış mı kontrol et
    const alreadyUnlocked = unlockedAchievements.some(a => a.id === achievement.id || (typeof a === 'string' && a === achievement.id));
    if (alreadyUnlocked) {
        return;
    }
    
    // Yeni format: object with timestamp
    unlockedAchievements.push({
        id: achievement.id,
        unlockedAt: Date.now()
    });
    showAchievementUnlock(achievement);
    
    // Backend'e kaydet
    if (typeof window.saveAchievement === 'function') {
        window.saveAchievement(achievement.id).catch(err => {
            console.warn('Achievement backend kayıt hatası (normal olabilir):', err);
        });
    }
    
    saveStats();
}

/**
 * Başarım kazanma popup'ını gösterir
 */
function showAchievementUnlock(achievement) {
    document.getElementById('achievement-title').textContent = achievement.name;
    document.getElementById('achievement-desc').textContent = achievement.description;
    
    // Başarım için rozet numarası bul (ACHIEVEMENTS array'indeki index'e göre)
    const achievementIndex = ACHIEVEMENTS.findIndex(a => a.id === achievement.id);
    if (achievementIndex !== -1) {
        // Mevcut rozet dosyaları (eksik olanlar hariç)
        const availableBadges = [6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35, 36, 42];
        // Mevcut rozetlerden döngüsel olarak seç
        const badgeNumber = availableBadges[achievementIndex % availableBadges.length];
        const badgeImage = `rozet${badgeNumber}.png`;
        const iconEl = document.getElementById('achievement-icon');
        if (iconEl && iconEl.tagName === 'IMG') {
            // Sadece badges klasöründeki PNG rozetlerini kullan
            iconEl.src = `assets/badges/${badgeImage}`;
            iconEl.alt = achievement.name;
            iconEl.style.display = 'block';
            // Görsel yüklenemezse sadece görseli gizle, fallback gösterme
            iconEl.onerror = function() {
                this.style.display = 'none';
            };
        }
    }
    
    openModal('achievement-modal');
    
    // 3 saniye sonra otomatik kapat
    setTimeout(() => {
        closeModal('achievement-modal');
    }, 3000);
}

// ============================================
// MODAL FONKSİYONLARI
// ============================================

/**
 * İstatistikler modalını gösterir
 */
function showStatsModal() {
    // LOG: showStatsModal çağrıldı
    console.log('🟡 showStatsModal çağrıldı');
    
    // Güvenli değer alma - NaN, undefined, null kontrolü
    // dailyCorrect ve dailyWrong'u hasene_daily_ verilerinden al (duplicate kaynağı kaldırıldı)
    const today = getLocalDateString();
    const dailyKey = `hasene_daily_${today}`;
    const dailyData = safeGetItem(dailyKey, { correct: 0, wrong: 0, points: 0 });
    const dailyCorrect = dailyData.correct || 0;
    const dailyWrong = dailyData.wrong || 0;
    
    const localStorageCorrect = parseInt(localStorage.getItem('dailyCorrect') || '0') || 0;
    const localStorageWrong = parseInt(localStorage.getItem('dailyWrong') || '0') || 0;
    
    // LOG: Değer karşılaştırması
    console.log('🟡 showStatsModal - Değer karşılaştırması:', {
        hasene_daily: { correct: dailyCorrect, wrong: dailyWrong },
        localStorage: { correct: localStorageCorrect, wrong: localStorageWrong },
        fark: {
            correct: Math.abs(dailyCorrect - localStorageCorrect),
            wrong: Math.abs(dailyWrong - localStorageWrong)
        }
    });
    
    // Bugünkü toplam Hasene'yi hasene_daily_ verilerinden al (totalPoints değil, bugünkü toplam)
    const dailyTotalPoints = dailyData.points || 0;
    
    const safeTotalPoints = totalPoints || 0;
    const safeTotalCorrect = (gameStats && gameStats.totalCorrect) || 0;
    const safeTotalWrong = (gameStats && gameStats.totalWrong) || 0;
    const safeGameModeCounts = (gameStats && gameStats.gameModeCounts) || {};
    
    document.getElementById('stats-daily-correct').textContent = dailyCorrect;
    document.getElementById('stats-daily-wrong').textContent = dailyWrong;
    // NOT: HTML'de "Toplam Hasene" yazıyor ama kullanıcı bugünkü toplamı görmek istiyor
    // Bu yüzden bugünkü toplamı gösteriyoruz (hasene_daily_${today}.points)
    document.getElementById('stats-total-points').textContent = formatNumber(dailyTotalPoints);
    
    // LOG: Puan karşılaştırması
    console.log('🟡 showStatsModal - Puan karşılaştırması:', {
        bugunkuToplam: dailyTotalPoints,
        tumZamanlarToplami: safeTotalPoints,
        kullanilan: 'dailyTotalPoints (bugünkü toplam)',
        hasene_daily_points: dailyData.points
    });
    
    console.log('🟡 showStatsModal - DOM güncellendi:', {
        statsDailyCorrect: dailyCorrect,
        statsDailyWrong: dailyWrong,
        statsTotalPoints: safeTotalPoints
    });
    document.getElementById('stats-total-correct').textContent = formatNumber(safeTotalCorrect);
    document.getElementById('stats-total-wrong').textContent = formatNumber(safeTotalWrong);
    
    const accuracy = safeTotalCorrect + safeTotalWrong > 0
        ? Math.round((safeTotalCorrect / (safeTotalCorrect + safeTotalWrong)) * 100)
        : 0;
    document.getElementById('stats-accuracy').textContent = accuracy + '%';
    
    document.getElementById('stats-kelime-count').textContent = safeGameModeCounts['kelime-cevir'] || 0;
    document.getElementById('stats-dinle-count').textContent = safeGameModeCounts['dinle-bul'] || 0;
    document.getElementById('stats-bosluk-count').textContent = safeGameModeCounts['bosluk-doldur'] || 0;
    document.getElementById('stats-ayet-count').textContent = safeGameModeCounts['ayet-oku'] || 0;
    document.getElementById('stats-dua-count').textContent = safeGameModeCounts['dua-et'] || 0;
    document.getElementById('stats-hadis-count').textContent = safeGameModeCounts['hadis-oku'] || 0;
    
    openModal('stats-modal');
}

/**
 * Muvaffakiyetler modalını gösterir
 */
function showBadgesModal() {
    // Rozetler - Her rozet için ilerleme göster
    // Asr-ı Saadet rozetlerini kategorilere göre filtrele
    const asrBadges = BADGE_DEFINITIONS.filter(badge => badge.id.startsWith('asr_'));
    const regularBadges = BADGE_DEFINITIONS.filter(badge => !badge.id.startsWith('asr_'));
    
    // Sekmelere göre Asr-ı Saadet rozetlerini dağıt
    const badgeTabs = [
        { 
            id: 'asr-saadet', 
            gridId: 'badges-grid-asr-saadet', 
            badgeIds: asrBadges.filter(b => {
                const num = parseInt(b.id.split('_')[1]);
                return num >= 1 && num <= 13; // Mekke dönemi
            }).map(b => b.id)
        },
        { 
            id: 'dort-halife', 
            gridId: 'badges-grid-dort-halife', 
            badgeIds: asrBadges.filter(b => {
                const num = parseInt(b.id.split('_')[1]);
                return num >= 14 && num <= 27; // Medine dönemi
            }).map(b => b.id)
        },
        { 
            id: 'uhud-sehitleri', 
            gridId: 'badges-grid-uhud-sehitleri', 
            badgeIds: asrBadges.filter(b => {
                const num = parseInt(b.id.split('_')[1]);
                return num >= 28 && num <= 35; // Hz. Ebu Bekir ve Hz. Ömer dönemi
            }).map(b => b.id)
        },
        { 
            id: 'osmanli', 
            gridId: 'badges-grid-osmanli', 
            badgeIds: asrBadges.filter(b => {
                const num = parseInt(b.id.split('_')[1]);
                return num >= 36 && num <= 38; // Hz. Osman dönemi
            }).map(b => b.id)
        },
        { 
            id: 'selcuklu', 
            gridId: 'badges-grid-selcuklu', 
            badgeIds: asrBadges.filter(b => {
                const num = parseInt(b.id.split('_')[1]);
                return num >= 39 && num <= 41; // Hz. Ali dönemi
            }).map(b => b.id)
        }
    ];
    
    if (!BADGE_DEFINITIONS) {
        openModal('badges-modal');
        return;
    }
    
    // Tüm badge grid'lerini temizle
    badgeTabs.forEach(tab => {
        const grid = document.getElementById(tab.gridId);
        if (grid) grid.innerHTML = '';
    });
    
    // Tüm oyun modlarını say
    const allModesPlayed = Object.values(gameStats.gameModeCounts || {}).filter(count => count > 0).length;
    
    // Stats değerlerini güvenli hale getir (NaN, undefined, null kontrolü)
    const stats = {
        totalPoints: totalPoints || 0,
        totalCorrect: gameStats.totalCorrect || 0,
        totalWrong: gameStats.totalWrong || 0,
        level: calculateLevel(totalPoints || 0),
        currentStreak: streakData.currentStreak || 0,
        maxCombo: maxCombo || 0,
        perfectLessons: perfectLessonsCount || 0,
        allModesPlayed: allModesPlayed || 0
    };
    
    /**
     * Rozet zorluk skorunu hesaplar (düşük skor = kolay, yüksek skor = zor)
     */
    function calculateBadgeDifficulty(badge) {
        const desc = badge.description.toLowerCase();
        let difficultyScore = 0;
        
        // Hasene gereksinimleri (logaritmik skorlama)
        if (desc.includes('hasene')) {
            const match = desc.match(/([\d,]+)\s*hasene/i);
            if (match) {
                const points = parseInt(match[1].replace(/,/g, ''));
                // Logaritmik skorlama: 100=1, 500=2, 1000=3, 10000=4, 100000=5, 1000000=6
                difficultyScore += Math.log10(points / 100) * 10 + 1;
            }
        }
        
        // Doğru cevap gereksinimleri
        if (desc.includes('doğru')) {
            const match = desc.match(/([\d,]+)\s*doğru/i);
            if (match) {
                const correct = parseInt(match[1].replace(/,/g, ''));
                // 10=1, 50=2, 100=3, 500=4, 1000=5, 5000=6
                difficultyScore += Math.log10(correct / 10) * 10 + 1;
            }
        }
        
        // Seri gün gereksinimleri
        if (desc.includes('gün') || desc.includes('seri')) {
            const match = desc.match(/(\d+)\s*gün/i);
            if (match) {
                const days = parseInt(match[1]);
                // 3=1, 7=2, 14=3, 21=4, 30=5, 50=6, 100=7
                difficultyScore += Math.log10(days / 3) * 10 + 1;
            }
        }
        
        // Combo gereksinimleri
        if (desc.includes('combo') || desc.includes('x')) {
            const match = desc.match(/(\d+)x/i);
            if (match) {
                const combo = parseInt(match[1]);
                // 5=1, 10=2, 20=3
                difficultyScore += Math.log10(combo / 5) * 10 + 1;
            }
        }
        
        // Mükemmel ders gereksinimleri
        if (desc.includes('mükemmel')) {
            const match = desc.match(/(\d+)\s*mükemmel/i);
            if (match) {
                const perfect = parseInt(match[1]);
                // 1=1, 5=2, 10=3, 100=4
                difficultyScore += Math.log10(perfect) * 10 + 1;
            }
        }
        
        // Mertebe gereksinimleri (Hasene bazlı hesaplama)
        if (desc.includes('mertebe')) {
            const match = desc.match(/mertebe\s*(\d+)/i);
            if (match) {
                const level = parseInt(match[1]);
                let requiredPoints = 0;
                
                // Mertebe için gereken Hasene miktarını hesapla
                if (level <= 5) {
                    requiredPoints = LEVELS.THRESHOLDS[5] || 13000; // 13,000 Hasene
                } else if (level <= 10) {
                    requiredPoints = LEVELS.THRESHOLDS[10] || 46000; // 46,000 Hasene
                } else {
                    // Level 10'dan sonra her seviye için 15,000 Hasene eklenir
                    requiredPoints = (LEVELS.THRESHOLDS[10] || 46000) + (level - 10) * (LEVELS.INCREMENT_AFTER_10 || 15000);
                }
                
                // Hasene bazlı logaritmik skorlama (diğer Hasene rozetleriyle aynı mantık)
                difficultyScore += Math.log10(requiredPoints / 100) * 10 + 1;
            }
        }
        
        // Oyun modu gereksinimleri (6 mod = orta zorluk)
        if (desc.includes('mod')) {
            difficultyScore += 3;
        }
        
        return difficultyScore;
    }
    
    // Sadece Asr-ı Saadet rozetlerini filtrele ve kronolojik sıraya göre sırala
    const asrBadgeDefinitions = BADGE_DEFINITIONS.filter(badge => badge.id.startsWith('asr_'))
        .sort((a, b) => {
            // Kronolojik sıralama: asr_1, asr_2, asr_3, ... asr_41
            const numA = parseInt(a.id.split('_')[1]);
            const numB = parseInt(b.id.split('_')[1]);
            return numA - numB;
        });
    
    // Rozetleri kronolojik sıraya göre hazırla (kazanılanlar ve kazanılmayanlar ayrı)
    const badgesWithUnlockInfo = asrBadgeDefinitions.map((badge, originalIndex) => {
        // Yeni ve eski format desteği
        const unlockInfo = unlockedBadges.find(b => {
            if (typeof b === 'string') return b === badge.id;
            return b.id === badge.id;
        });
        
        // Rozet numarasını al (kronolojik sıralama için)
        const badgeNum = parseInt(badge.id.split('_')[1]);
        
        return {
            badge: badge,
            originalIndex: originalIndex,
            badgeNum: badgeNum,
            difficultyScore: calculateBadgeDifficulty(badge),
            isUnlocked: !!unlockInfo,
            unlockedAt: unlockInfo ? (typeof unlockInfo === 'string' ? 0 : unlockInfo.unlockedAt) : null
        };
    });
    
    // Sırala: Önce kazanılanlar (kronolojik sıraya göre), sonra kazanılmayanlar (kronolojik sıraya göre)
    // Kronolojik sıra (badgeNum) 1. öncelik, Hasene miktarı (difficultyScore) 2. öncelik
    badgesWithUnlockInfo.sort((a, b) => {
        if (a.isUnlocked && b.isUnlocked) {
            // Her ikisi de kazanılmış: 
            // 1. Öncelik: Kronolojik sıra (badgeNum - asr_1, asr_2, ...)
            // 2. Öncelik: Hasene miktarı (difficultyScore - kolaydan zora)
            if (a.badgeNum !== b.badgeNum) {
                return a.badgeNum - b.badgeNum;
            }
            // Eğer kronolojik sıra aynıysa, Hasene miktarına göre sırala
            return a.difficultyScore - b.difficultyScore;
        } else if (a.isUnlocked && !b.isUnlocked) {
            // A kazanılmış, B kazanılmamış: A önce
            return -1;
        } else if (!a.isUnlocked && b.isUnlocked) {
            // A kazanılmamış, B kazanılmış: B önce
            return 1;
        } else {
            // Her ikisi de kazanılmamış:
            // 1. Öncelik: Kronolojik sıra (badgeNum - asr_1, asr_2, ...)
            // 2. Öncelik: Hasene miktarı (difficultyScore - kolaydan zora)
            if (a.badgeNum !== b.badgeNum) {
                return a.badgeNum - b.badgeNum;
            }
            // Eğer kronolojik sıra aynıysa, Hasene miktarına göre sırala
            return a.difficultyScore - b.difficultyScore;
        }
    });
    
    // Rozetleri sekmelere dağıt
    badgesWithUnlockInfo.forEach(({badge, isUnlocked}) => {
        // Hangi sekmede olduğunu bul (badge ID'sine göre)
        const tabInfo = badgeTabs.find(tab => tab.badgeIds.includes(badge.id));
        if (!tabInfo) return; // Bu sekmede değilse atla
        
        const badgesGrid = document.getElementById(tabInfo.gridId);
        if (!badgesGrid) return;
        
        let progress = 0;
        if (badge.progress) {
            const calculatedProgress = badge.progress(stats);
            // NaN, undefined veya negatif değerleri 0 yap
            progress = (isNaN(calculatedProgress) || calculatedProgress === undefined || calculatedProgress < 0) 
                ? 0 
                : Math.round(Math.min(100, Math.max(0, calculatedProgress)));
        }
        
        const badgeItem = document.createElement('div');
        badgeItem.className = `badge-item ${isUnlocked ? 'unlocked' : ''}`;
        
        // Kazanılan rozetler için minimal görünüm (sadece ikon ve isim)
        if (isUnlocked) {
            badgeItem.innerHTML = `
                <img src="assets/badges/${badge.image}" alt="${badge.name}" class="badge-image" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <div class="achievement-icon" style="font-size: 3rem; display: none;">${badge.name.charAt(0)}</div>
                <div class="badge-name">${badge.name}</div>
            `;
        } else {
            // Kilitli rozetler için tam bilgi (açıklama ve ilerleme)
            const progressBar = (progress > 0 && progress < 100) ? `
                <div class="badge-progress-bar">
                    <div class="badge-progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="badge-progress-text">${progress}%</div>
            ` : '';
            
            badgeItem.innerHTML = `
                <img src="assets/badges/${badge.image}" alt="${badge.name}" class="badge-image" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <div class="achievement-icon" style="font-size: 3rem; display: none;">${badge.name.charAt(0)}</div>
                <div class="badge-name">${badge.name}</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary); margin-top: 2px; line-height: 1.2;">${badge.description}</div>
                ${progressBar}
            `;
        }
        badgesGrid.appendChild(badgeItem);
        
        // Kazanılan rozetlere tıklama özelliği ekle
        if (isUnlocked) {
            badgeItem.style.cursor = 'pointer';
            badgeItem.title = 'Detayları görmek için tıklayın';
            badgeItem.addEventListener('click', () => {
                showBadgeDetail(badge, isUnlocked);
            });
        }
        
        // Rozet görseli yüklendiğinde fallback icon'u gizle
        const badgeImg = badgeItem.querySelector('.badge-image');
        if (badgeImg) {
            // Eğer görsel zaten yüklenmişse (cache'den)
            if (badgeImg.complete && badgeImg.naturalHeight !== 0) {
                const fallbackIcon = badgeImg.nextElementSibling;
                if (fallbackIcon && fallbackIcon.classList.contains('achievement-icon')) {
                    fallbackIcon.style.display = 'none';
                }
            } else {
                // Görsel yükleniyor, onload event'i ekle
                badgeImg.onload = function() {
                    const fallbackIcon = this.nextElementSibling;
                    if (fallbackIcon && fallbackIcon.classList.contains('achievement-icon')) {
                        fallbackIcon.style.display = 'none';
                    }
                };
            }
        }
    });
    
    // Sekme değiştirme işlevselliği
    const badgeTabButtons = document.querySelectorAll('.badge-tab-btn');
    const badgeTabContents = document.querySelectorAll('.badge-tab-content');
    
    badgeTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Tüm butonlardan active class'ını kaldır
            badgeTabButtons.forEach(b => b.classList.remove('active'));
            // Tıklanan butona active class'ı ekle
            btn.classList.add('active');
            
            // Tüm tab içeriklerini gizle
            badgeTabContents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });
            
            // Hedef tab içeriğini göster
            const targetContent = document.getElementById(`${targetTab}-tab`);
            if (targetContent) {
                targetContent.style.display = 'block';
                targetContent.classList.add('active');
            }
        });
    });
    
    // Başarımlar - PNG dosyalarını kullan
    const achievementsGrid = document.getElementById('achievements-grid');
    if (achievementsGrid) {
        achievementsGrid.innerHTML = '';
        
        // Mevcut rozet dosyaları (eksik olanlar hariç)
        const availableBadges = [6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35, 36, 42];
        
        /**
         * Başarım zorluk skorunu hesaplar (düşük skor = kolay, yüksek skor = zor)
         */
        function calculateAchievementDifficulty(achievement) {
            const desc = achievement.description.toLowerCase();
            const name = achievement.name.toLowerCase();
            let difficultyScore = 0;
            
            // "İlk Kelime" başarımı için özel kontrol (en kolay - mutlaka ilk sırada)
            if (achievement.id === 'first_victory' || (name.includes('ilk') && name.includes('kelime'))) {
                return 0; // En kolay, ilk sırada olmalı
            }
            
            // "İlk Adım" gibi diğer "ilk" başarımları için de düşük skor
            if (name.includes('ilk') && (name.includes('adım') || name.includes('zafer'))) {
                difficultyScore += 0.1; // Çok kolay ama İlk Kelime'den sonra
            }
            
            // Yıldız sayısına göre zorluk skorunu hesapla (EN ÖNEMLİ KRİTER)
            // Format: "600 Yıldız kazan" veya "1,500 Yıldız kazan"
            if (desc.includes('yıldız')) {
                const starMatch = desc.match(/([\d,]+)\s*yıldız/i);
                if (starMatch) {
                    const stars = parseInt(starMatch[1].replace(/,/g, ''));
                    // Yıldız sayısına göre logaritmik skorlama (1 yıldız = 0, 10 yıldız = 1, 100 yıldız = 2, vb.)
                    // Bu en önemli kriter olduğu için yüksek ağırlık veriyoruz
                    difficultyScore += Math.log10(stars / 1) * 10;
                }
            }
            
            // Hasene gereksinimleri (logaritmik skorlama)
            if (desc.includes('hasene')) {
                const match = desc.match(/([\d,]+)\s*hasene/i);
                if (match) {
                    const points = parseInt(match[1].replace(/,/g, ''));
                    difficultyScore += Math.log10(points / 100) * 10 + 1;
                }
            }
            
            // Doğru cevap gereksinimleri (sayıya göre)
            if (desc.includes('doğru') || desc.includes('sahih')) {
                const match = desc.match(/([\d,]+)\s*doğru/i) || desc.match(/([\d,]+)\s*sahih/i);
                if (match) {
                    const correct = parseInt(match[1].replace(/,/g, ''));
                    // 1 doğru = 0, 10 doğru = 1, 50 doğru = 2, 100 doğru = 3, vb.
                    if (correct === 1) {
                        difficultyScore += 0; // En kolay
                    } else {
                        difficultyScore += Math.log10(correct / 10) * 10 + 1;
                    }
                } else if (desc.includes('ilk') && (desc.includes('sahih') || desc.includes('doğru'))) {
                    // "İlk sahih cevap" gibi ifadeler için
                    difficultyScore += 0; // En kolay
                } else {
                    // Sadece "doğru" veya "sahih" kelimesi geçiyorsa ama sayı yoksa
                    difficultyScore += 0.5;
                }
            }
            
            // Günlük vird gereksinimleri
            if (desc.includes('vird') || desc.includes('günlük')) {
                difficultyScore += 2; // Günlük hedef = orta zorluk
            }
            
            // Combo gereksinimleri
            if (desc.includes('muvazebet') || desc.includes('combo')) {
                const match = desc.match(/(\d+)x/i);
                if (match) {
                    const combo = parseInt(match[1]);
                    difficultyScore += Math.log10(combo / 5) * 10 + 1;
                }
            }
            
            // Seri gün gereksinimleri
            if (desc.includes('gün') && desc.includes('muvazebet')) {
                const match = desc.match(/(\d+)\s*gün/i);
                if (match) {
                    const days = parseInt(match[1]);
                    difficultyScore += Math.log10(days / 7) * 10 + 1;
                }
            }
            
            // Mertebe gereksinimleri (Hasene bazlı hesaplama)
            if (desc.includes('mertebe')) {
                const match = desc.match(/mertebe\s*(\d+)/i);
                if (match) {
                    const level = parseInt(match[1]);
                    let requiredPoints = 0;
                    
                    // Mertebe için gereken Hasene miktarını hesapla
                    if (level <= 5) {
                        requiredPoints = LEVELS.THRESHOLDS[5] || 13000; // 13,000 Hasene
                    } else if (level <= 10) {
                        requiredPoints = LEVELS.THRESHOLDS[10] || 46000; // 46,000 Hasene
                    } else {
                        // Level 10'dan sonra her seviye için 15,000 Hasene eklenir
                        requiredPoints = (LEVELS.THRESHOLDS[10] || 46000) + (level - 10) * (LEVELS.INCREMENT_AFTER_10 || 15000);
                    }
                    
                    // Hasene bazlı logaritmik skorlama (diğer Hasene rozetleriyle aynı mantık)
                    difficultyScore += Math.log10(requiredPoints / 100) * 10 + 1;
                }
            }
            
            // Bronz, Gümüş, Altın, Elmas gereksinimleri
            if (desc.includes('bronz') || desc.includes('mübtedi')) {
                difficultyScore += 2;
            } else if (desc.includes('gümüş') || desc.includes('ikinci gümüş')) {
                difficultyScore += 3.5;
            } else if (desc.includes('altın') || desc.includes('ikinci altın')) {
                difficultyScore += 4.5;
            } else if (desc.includes('elmas') || desc.includes('ustalar ustası')) {
                difficultyScore += 5.5;
            } else if (desc.includes('hafiz')) {
                difficultyScore += 7; // En zor
            }
            
            return difficultyScore;
        }
        
        // Başarımları kronolojik sıraya göre hazırla (kazanılanlar ve kazanılmayanlar ayrı)
        const achievementsWithUnlockInfo = ACHIEVEMENTS.map((achievement, originalIndex) => {
            // Yeni ve eski format desteği
            const unlockInfo = unlockedAchievements.find(a => {
                if (typeof a === 'string') return a === achievement.id;
                return a.id === achievement.id;
            });
            
            return {
                achievement: achievement,
                originalIndex: originalIndex,
                difficultyScore: calculateAchievementDifficulty(achievement),
                isUnlocked: !!unlockInfo,
                unlockedAt: unlockInfo ? (typeof unlockInfo === 'string' ? 0 : unlockInfo.unlockedAt) : null
            };
        });
        
        // Sırala: Önce kazanılanlar (kronolojik sıraya göre), sonra kazanılmayanlar (kronolojik sıraya göre)
        // Kronolojik sıra (originalIndex) 1. öncelik, yıldız sayısı (difficultyScore) 2. öncelik
        achievementsWithUnlockInfo.sort((a, b) => {
            // Önce kazanılanlar, sonra kazanılmayanlar
            if (a.isUnlocked && !b.isUnlocked) {
                return -1; // A kazanılmış, B kazanılmamış: A önce
            } else if (!a.isUnlocked && b.isUnlocked) {
                return 1; // A kazanılmamış, B kazanılmış: B önce
            } else {
                // Aynı durumdaysa (ikisi de kazanılmış veya ikisi de kazanılmamış): 
                // 1. Öncelik: Kronolojik sıra (originalIndex - constants.js'teki sıraya göre)
                // 2. Öncelik: Yıldız sayısı (difficultyScore - kolaydan zora)
                if (a.originalIndex !== b.originalIndex) {
                    return a.originalIndex - b.originalIndex;
                }
                // Eğer kronolojik sıra aynıysa, yıldız sayısına göre sırala
                return a.difficultyScore - b.difficultyScore;
            }
        });
        
        achievementsWithUnlockInfo.forEach(({achievement, originalIndex, isUnlocked}) => {
            // Mevcut rozetlerden döngüsel olarak seç
            const badgeNumber = availableBadges[originalIndex % availableBadges.length];
            const badgeImage = `rozet${badgeNumber}.png`;
            
            const achievementItem = document.createElement('div');
            achievementItem.className = `achievement-item ${isUnlocked ? 'unlocked' : ''}`;
            
            // Kazanılan başarımlar için minimal görünüm (sadece ikon ve isim)
            if (isUnlocked) {
                achievementItem.innerHTML = `
                    <img src="assets/badges/${badgeImage}" alt="${achievement.name}" class="achievement-image">
                    <div class="achievement-name">${achievement.name}</div>
                `;
            } else {
                // Kilitli başarımlar için tam bilgi (açıklama)
                achievementItem.innerHTML = `
                    <img src="assets/badges/${badgeImage}" alt="${achievement.name}" class="achievement-image">
                    <div class="achievement-name">${achievement.name}</div>
                    <div style="font-size: 0.65rem; color: var(--text-secondary); margin-top: 2px; line-height: 1.2;">${achievement.description}</div>
                `;
            }
            achievementsGrid.appendChild(achievementItem);
            
            // Kazanılan başarımlara tıklama özelliği ekle
            if (isUnlocked) {
                achievementItem.style.cursor = 'pointer';
                achievementItem.title = 'Detayları görmek için tıklayın';
                achievementItem.addEventListener('click', () => {
                    // Başarımı badge formatına çevir ve detay göster
                    const badgeFormat = {
                        id: achievement.id,
                        name: achievement.name,
                        image: badgeImage,
                        description: achievement.description
                    };
                    showBadgeDetail(badgeFormat, isUnlocked);
                });
            }
        });
    }
    
    openModal('badges-modal');
}

/**
 * Takvim modalını gösterir
 */
function showCalendarModal() {
    try {
        const calendarGrid = document.getElementById('calendar-grid');
        const calendarMonthYear = document.getElementById('calendar-month-year');
        
        if (!calendarGrid) {
            console.error('❌ calendar-grid elementi bulunamadı!');
            return;
        }
        calendarGrid.innerHTML = '';
        
        // Bugünün tarihi
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Ay adını göster
        const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                           'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        const monthName = monthNames[today.getMonth()];
        const year = today.getFullYear();
        
        if (calendarMonthYear) {
            calendarMonthYear.textContent = `${monthName} ${year}`;
        }
        
        // Ayın ilk günü ve hangi güne denk geliyor (0=Pazar, 1=Pazartesi, ...)
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        firstDayOfMonth.setHours(0, 0, 0, 0);
        const firstDayWeekday = firstDayOfMonth.getDay(); // 0=Pazar, 1=Pazartesi, ...
        // Pazartesi başlangıcı için: 0=Pazar -> 6, 1=Pazartesi -> 0, 2=Salı -> 1, ...
        const startOffset = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;
        
        // Ayın son günü (bir sonraki ayın 0. günü = bu ayın son günü)
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        
        // İlk hafta için boş hücreler ekle (ayın ilk günü Pazartesi değilse)
        for (let i = 0; i < startOffset; i++) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyEl);
        }
        
        // Ayın tüm günlerini göster (1'den son güne kadar)
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(today.getFullYear(), today.getMonth(), day);
            date.setHours(0, 0, 0, 0);
            const dateStr = getLocalDateString(date);
            
            // Bu gün oynanmış mı?
            const isPlayed = (streakData?.playDates && Array.isArray(streakData.playDates)) 
                ? streakData.playDates.includes(dateStr) 
                : false;
            
            // Bu gün gelecek bir gün mü?
            const isFuture = date > today;
            
            // Seri kontrolü: Bugünden geriye doğru kesintisiz oynanan günler
            let isStreak = false;
            if (isPlayed && !isFuture && streakData?.currentStreak > 0) {
                const daysDiff = getDaysDifference(date, today);
                // Bugünden geriye doğru seri uzunluğu kadar gün içinde mi?
                if (daysDiff >= 0 && daysDiff < (streakData?.currentStreak || 0)) {
                    // Kesintisiz kontrol: Bu günden bugüne kadar tüm günler oynanmış mı?
                    let allDaysPlayed = true;
                    for (let j = 0; j <= daysDiff; j++) {
                        const checkDate = new Date(today);
                        checkDate.setDate(checkDate.getDate() - j);
                        const checkDateStr = getLocalDateString(checkDate);
                        if (!streakData?.playDates || !Array.isArray(streakData.playDates) || !streakData.playDates.includes(checkDateStr)) {
                            allDaysPlayed = false;
                            break;
                        }
                    }
                    isStreak = allDaysPlayed;
                }
            }
            
            const dayEl = document.createElement('div');
            let className = 'calendar-day';
            if (isFuture) {
                className += ' future'; // Gelecek günler için özel stil
            } else if (isStreak) {
                className += ' streak'; // Seri günler - turuncu/sarı
            } else if (isPlayed) {
                className += ' played'; // Oynanan günler - yeşil
            }
            // Oynanmayan geçmiş günler için sadece 'calendar-day' class'ı (gri)
            
            dayEl.className = className;
            dayEl.textContent = day;
            calendarGrid.appendChild(dayEl);
        }
        
        // Streak bilgilerini güncelle (null check ile)
        const currentStreakEl = document.getElementById('calendar-current-streak');
        const bestStreakEl = document.getElementById('calendar-best-streak');
        const totalDaysEl = document.getElementById('calendar-total-days');
        
        if (currentStreakEl) {
            currentStreakEl.textContent = (streakData?.currentStreak || 0) + ' gün';
        }
        if (bestStreakEl) {
            bestStreakEl.textContent = (streakData?.bestStreak || 0) + ' gün';
        }
        if (totalDaysEl) {
            totalDaysEl.textContent = streakData?.totalPlayDays || 0;
        }
        
        openModal('calendar-modal');
    } catch (error) {
        console.error('❌ showCalendarModal hatası:', error);
        // Hata olsa bile modal açılmaya çalış
        try {
            openModal('calendar-modal');
        } catch (modalError) {
            console.error('❌ Modal açma hatası:', modalError);
        }
    }
}

/**
 * Günlük vazifeler modalını gösterir
 */
function showDailyTasksModal() {
    // Görevleri kontrol et ve yükle (eğer yüklenmemişse)
    checkDailyTasks();
    // checkWeeklyTasks(); // Haftalık görevler UI'dan kaldırıldı
    
    // Görevleri göster
    updateTasksDisplay();
    
    // Modal'ı aç
    openModal('tasks-modal');
}

/**
 * Günlük vird ayarları modalını gösterir
 */
function showDailyGoalSettings() {
    const currentLevel = localStorage.getItem('dailyGoalLevel') || 'normal';
    document.querySelectorAll('.goal-level-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.level === currentLevel) {
            btn.classList.add('active');
        }
    });
    
    openModal('daily-goal-modal');
}

/**
 * Günlük hedef seviyesini ayarlar
 */
function setDailyGoalLevel(level) {
    const goalAmount = CONFIG.DAILY_GOAL_LEVELS[level] || CONFIG.DAILY_GOAL_DEFAULT;
    localStorage.setItem('dailyGoalHasene', goalAmount.toString());
    localStorage.setItem('dailyGoalLevel', level);
    updateDailyGoalDisplay();
    closeModal('daily-goal-modal');
    showSuccessMessage('Günlük hedef güncellendi!');
}

/**
 * Özel günlük hedef ayarlar
 */
function setCustomGoal() {
    const input = document.getElementById('custom-goal-input');
    const value = parseInt(input.value);
    if (value >= 100 && value <= 10000) {
        localStorage.setItem('dailyGoalHasene', value.toString());
        localStorage.setItem('dailyGoalLevel', 'custom');
        updateDailyGoalDisplay();
        closeModal('daily-goal-modal');
        showSuccessMessage('Özel hedef ayarlandı!');
    } else {
        showErrorMessage('Hedef 100-10,000 arasında olmalıdır!');
    }
}

/**
 * Seviye atlama modalını gösterir
 */
function showLevelUpModal(level) {
    const oldLevel = level - 1;
    document.getElementById('old-level').textContent = oldLevel;
    document.getElementById('new-level').textContent = level;
    document.getElementById('level-name').textContent = getLevelName(level);
    
    openModal('level-up-modal');
    playSound('levelup');
}

/**
 * Veri durumu modalını gösterir
 */
async function showDataStatus() {
    const indexeddbStatus = await checkIndexedDBStatus();
    document.getElementById('indexeddb-status').textContent = indexeddbStatus.available 
        ? '✅ Mevcut' 
        : `❌ Bulunamadı: ${indexeddbStatus.error}`;
    
    const localStorageAvailable = typeof Storage !== 'undefined';
    document.getElementById('localstorage-status').textContent = localStorageAvailable 
        ? '✅ Mevcut' 
        : '❌ Bulunamadı';
    
    const dailyTasksStatus = document.getElementById('daily-tasks-status');
    dailyTasksStatus.innerHTML = `
        <p>Son Tarih: ${dailyTasks.lastTaskDate || 'Yok'}</p>
        <p>Tamamlanan: ${dailyTasks.completedTasks.length} / ${dailyTasks.tasks.length + dailyTasks.bonusTasks.length}</p>
    `;
    
    // Haftalık görevler kaldırıldı
    
    const streakStatus = document.getElementById('streak-status');
    streakStatus.innerHTML = `
        <p>Mevcut Seri: ${streakData.currentStreak} gün</p>
        <p>En İyi Seri: ${streakData.bestStreak} gün</p>
        <p>Toplam Oyun Günü: ${streakData.totalPlayDays}</p>
        <p>Son Oyun: ${streakData.lastPlayDate || 'Yok'}</p>
        <p>Bugünkü İlerleme: ${streakData.todayProgress}/${streakData.dailyGoal}</p>
    `;
    
    openModal('data-status-modal');
}

/**
 * Kullanıcıya özel localStorage verilerini temizler (kullanıcı değiştiğinde)
 * hasene_user_has_registered ve hasene_current_user_id hariç
 */
function clearUserLocalStorage() {
    try {
        // Tüm localStorage key'lerini al
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (
                key.startsWith('hasene_') ||
                key.startsWith('daily') ||
                key.startsWith('weekly') ||
                key === 'gameStats' ||
                key === 'perfectLessonsCount' ||
                key === 'unlockedAchievements' ||
                key === 'unlockedBadges'
            )) {
                // hasene_user_has_registered ve hasene_current_user_id hariç
                if (key !== 'hasene_user_has_registered' && key !== 'hasene_current_user_id') {
                    keysToRemove.push(key);
                }
            }
        }
        
        // Key'leri temizle
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });
        
        console.log(`✅ ${keysToRemove.length} localStorage key'i temizlendi`);
        
        // IndexedDB'yi de temizle
        if (typeof window.clearIndexedDB === 'function') {
            window.clearIndexedDB().catch(err => {
                console.warn('IndexedDB temizleme hatası:', err);
            });
        }
    } catch (error) {
        console.error('clearUserLocalStorage hatası:', error);
    }
}

/**
 * Tüm verileri sıfırlar
 */
async function resetAllStats() {
    if (!confirm('Tüm verileri sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
        return;
    }
    
    // LocalStorage temizle - Tüm hasene ile ilgili key'leri temizle
    const keysToRemove = [];
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('hasene_') || 
            key === 'unlockedAchievements' || 
            key === 'unlockedBadges' || 
            key === 'gameStats' || 
            key === 'perfectLessonsCount' ||
            key === 'dailyCorrect' ||
            key === 'dailyWrong' ||
            key === 'dailyXP' ||
            key === 'lastDailyGoalDate' ||
            // dailyGoalHasene ve dailyGoalLevel kullanıcı tercihleri olduğu için korunmalı
            key === 'dailyGoalCompleted' ||
            key === 'hasene_statsJustReset' ||
            key === 'hasene_onboarding_seen_v2' ||
            key === 'hasene_wordStats') { // Kelime istatistikleri
            keysToRemove.push(key);
        }
    });
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Günlük, haftalık, aylık istatistikleri temizle (hasene_daily_*, hasene_weekly_*, hasene_monthly_*)
    // TÜM geçmiş verileri temizle (sadece son 30 gün değil, hepsi)
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('hasene_daily_') || 
            key.startsWith('hasene_weekly_') || 
            key.startsWith('hasene_monthly_')) {
            localStorage.removeItem(key);
        }
    });
    
    // Favori kelimeleri de temizle
    localStorage.removeItem('hasene_favoriteWords');
    
    // IndexedDB temizle
    await clearIndexedDB();
    
    // IndexedDB'deki özel key'leri de manuel olarak sil (ekstra güvenlik)
    try {
        if (db) {
            await deleteFromIndexedDB('hasene_totalPoints');
            await deleteFromIndexedDB('hasene_badges');
            await deleteFromIndexedDB('hasene_streakData');
            await deleteFromIndexedDB('hasene_dailyTasks');
            await deleteFromIndexedDB('hasene_weeklyTasks');
            await deleteFromIndexedDB('hasene_wordStats');
            
            // Günlük, haftalık, aylık istatistikleri IndexedDB'den de temizle
            // Son 30 günün günlük verilerini temizle
            for (let i = 0; i < 30; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = getLocalDateString(date);
                await deleteFromIndexedDB(`hasene_daily_${dateStr}`);
            }
            
            // Son 8 haftanın haftalık verilerini temizle
            for (let i = 0; i < 8; i++) {
                const weekStart = new Date();
                weekStart.setDate(weekStart.getDate() - (i * 7));
                const weekStartStr = getWeekStartDateString(weekStart);
                await deleteFromIndexedDB(`hasene_weekly_${weekStartStr}`);
            }
            
            // Son 6 ayın aylık verilerini temizle
            for (let i = 0; i < 6; i++) {
                const month = new Date();
                month.setMonth(month.getMonth() - i);
                const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
                await deleteFromIndexedDB(`hasene_monthly_${monthStr}`);
            }
        }
    } catch (e) {
        warnLog('IndexedDB temizleme hatası (normal olabilir):', e);
    }
    
    // Global değişkenleri sıfırla
    totalPoints = 0;
    badges = { stars: 0, bronze: 0, silver: 0, gold: 0, diamond: 0 };
    
    // Session değişkenlerini sıfırla
    sessionScore = 0;
    sessionCorrect = 0;
    sessionWrong = 0;
    comboCount = 0;
    maxCombo = 0;
    currentQuestion = 0;
    questions = [];
    currentQuestionData = null;
    hintUsed = false;
    lives = 3;
    streakData = {
        currentStreak: 0,
        bestStreak: 0,
        totalPlayDays: 0,
        lastPlayDate: '',
        playDates: [],
        dailyGoal: 5,
        todayProgress: 0,
        todayDate: ''
    };
    dailyTasks = {
        lastTaskDate: '',
        tasks: [],
        bonusTasks: [],
        completedTasks: [],
        todayStats: {
            toplamDogru: 0,
            toplamPuan: 0,
            comboCount: 0,
            allGameModes: new Set(),
            farklıZorluk: new Set(),
            perfectStreak: 0,
            accuracy: 0,
            reviewWords: new Set(),
            streakMaintain: 0,
            totalPlayTime: 0,
            ayetOku: 0,
            duaEt: 0,
            hadisOku: 0
        },
        rewardsClaimed: false
    };
    weeklyTasks = {
        lastWeekStart: '',
        weekStart: '',
        weekEnd: '',
        tasks: [],
        completedTasks: [],
        weekStats: {
            totalHasene: 0,
            totalCorrect: 0,
            totalWrong: 0,
            daysPlayed: 0,
            streakDays: 0,
            allModesPlayed: new Set(),
            comboCount: 0
        },
        rewardsClaimed: false
    };
    wordStats = {};
    // Global wordStats'ı da window'a ekle (detailed-stats.js'de kullanılabilir)
    if (typeof window !== 'undefined') {
        window.wordStats = wordStats;
    }
    unlockedAchievements = [];
    unlockedBadges = [];
    perfectLessonsCount = 0;
    
    // Backend'den TÜM kullanıcı verilerini sil
    if (typeof window.getCurrentUser === 'function') {
        try {
            const user = await window.getCurrentUser();
            if (user && window.supabaseClient && (window.BACKEND_TYPE === 'supabase' || !window.BACKEND_TYPE)) {
                console.log('🗑️ Backend verileri siliniyor...');
                
                // Tüm backend tablolarını temizle (kullanıcı verileri)
                const tablesToDelete = [
                    'user_stats',
                    'daily_tasks',
                    'weekly_tasks',
                    'daily_stats',
                    'weekly_stats',
                    'monthly_stats',
                    'word_stats', // Kelime istatistikleri - ÖNEMLİ: Tüm kelime verileri silinecek
                    'favorites',
                    'favorite_words',
                    'achievements',
                    'badges',
                    'leaderboard',
                    'weekly_leaderboard',
                    'league_rankings'
                ];
                // Not: 'profiles' tablosu username için kullanılıyor, silinmemeli
                // Not: 'league_config' sistem tablosu, silinmemeli
                
                for (const table of tablesToDelete) {
                    try {
                        // word_stats tablosu için özel kontrol
                        if (table === 'word_stats') {
                            console.log('🗑️ word_stats tablosu temizleniyor...');
                            // Önce tüm word_stats kayıtlarını sil
                            const { error: deleteError } = await window.supabaseClient
                                .from(table)
                                .delete()
                                .eq('user_id', user.id);
                            
                            if (deleteError && deleteError.code !== '42501' && deleteError.code !== 'PGRST301' && deleteError.code !== 'PGRST116') {
                                console.warn(`⚠️ Backend ${table} silme hatası:`, deleteError);
                            } else if (!deleteError) {
                                console.log(`✅ Backend ${table} tüm kelime istatistikleri silindi`);
                            }
                        } else {
                            const { error } = await window.supabaseClient
                                .from(table)
                                .delete()
                                .eq('user_id', user.id);
                            
                            if (error && error.code !== '42501' && error.code !== 'PGRST301' && error.code !== 'PGRST116') {
                                console.warn(`⚠️ Backend ${table} silme hatası:`, error);
                            } else if (!error) {
                                console.log(`✅ Backend ${table} silindi`);
                            }
                        }
                    } catch (tableError) {
                        console.warn(`⚠️ ${table} tablosu silinirken hata (normal olabilir):`, tableError);
                    }
                }
                
                console.log('✅ Tüm backend verileri temizlendi');
            }
        } catch (e) {
            console.warn('⚠️ Backend veri silme hatası (normal olabilir):', e);
        }
    }
    
    // Favori kelimeleri local'den de sıfırla (backend zaten yukarıda temizlendi)
    if (typeof window.loadFavorites === 'function') {
        try {
            // Local'den sil
            const favoriteWords = window.getFavoriteWords ? window.getFavoriteWords() : [];
            if (favoriteWords.length > 0 && typeof window.removeFromFavorites === 'function') {
                for (const wordId of favoriteWords) {
                    try {
                        await window.removeFromFavorites(wordId);
                    } catch (e) {
                        console.warn(`Local'den favori ${wordId} silinirken hata:`, e);
                    }
                }
            }
            
            // Ek olarak localStorage ve IndexedDB'den de temizle
            localStorage.removeItem('hasene_favoriteWords');
            if (typeof deleteFromIndexedDB === 'function') {
                try {
                    await deleteFromIndexedDB('hasene_favoriteWords');
                } catch (e) {
                    console.warn('IndexedDB\'den favoriler silinirken hata:', e);
                }
            }
        } catch (e) {
            console.warn('Favoriler sıfırlanırken hata:', e);
        }
    }
    gameStats = {
        totalCorrect: 0,
        totalWrong: 0,
        gameModeCounts: {
            'kelime-cevir': 0,
            'dinle-bul': 0,
            'bosluk-doldur': 0,
            'ayet-oku': 0,
            'dua-et': 0,
            'hadis-oku': 0
        }
    };
    
    // Günlük ilerlemeyi sıfırla (kullanıcı tercihleri korunur)
    localStorage.setItem('dailyCorrect', '0');
    localStorage.setItem('dailyWrong', '0');
    localStorage.setItem('dailyXP', '0');
    localStorage.setItem('lastDailyGoalDate', getLocalDateString());
    
    // Eğer günlük hedef ayarları yoksa varsayılan değerleri ayarla
    if (!localStorage.getItem('dailyGoalHasene')) {
        localStorage.setItem('dailyGoalHasene', CONFIG.DAILY_GOAL_DEFAULT.toString());
    }
    if (!localStorage.getItem('dailyGoalLevel')) {
        localStorage.setItem('dailyGoalLevel', 'normal');
    }
    
    // UI'ı güncelle
    updateStatsBar();
    updateDailyGoalDisplay();
    updateStreakDisplay();
    
    // Vazifeler (Günlük Görevler) panelini yenile
    if (typeof updateTasksDisplay === 'function') {
        updateTasksDisplay();
    }
    
    // Rozet modalını yenile (eğer açıksa)
    if (document.getElementById('badges-modal') && document.getElementById('badges-modal').style.display !== 'none') {
        showBadgesModal();
    }
    
    // Detaylı istatistikler modalını yenile (eğer açıksa) - Kelimeler ve Favoriler panelleri
    // ÖNEMLİ: Backend silme işlemi tamamlandıktan SONRA UI'ı güncelle
    // Global wordStats = {} yapıldı, localStorage ve backend temizlendi
    const detailedStatsModal = document.getElementById('detailed-stats-modal');
    if (detailedStatsModal && detailedStatsModal.style.display !== 'none') {
        // Kelime istatistikleri panelini yenile (wordStats boş, backend/localStorage temizlendi)
        // loadWordsStats boş veri görecek ve "Henüz kelime istatistiği yok" mesajı gösterecek
        if (typeof window.loadWordsStats === 'function') {
            try {
                // Global wordStats'ı açıkça boş yap (resetAllStats zaten yaptı ama ekstra güvence)
                if (typeof window !== 'undefined') {
                    window.wordStats = {};
                }
                // Backend'den yükleme denemesi yapılmadan önce boş olduğunu garantile
                await window.loadWordsStats();
                // Tekrar kontrol et ve boş olduğundan emin ol
                if (typeof window !== 'undefined' && window.wordStats && Object.keys(window.wordStats).length > 0) {
                    console.warn('⚠️ resetAllStats sonrası wordStats hala dolu! Manuel temizleniyor...');
                    window.wordStats = {};
                }
            } catch (e) {
                console.warn('Kelime istatistikleri paneli yenilenirken hata:', e);
                // Hata olsa bile boş göster
                const wordsStatsContent = document.getElementById('words-stats-content');
                if (wordsStatsContent) {
                    wordsStatsContent.innerHTML = '<div style="text-align: center; padding: var(--spacing-lg); color: var(--text-secondary);">Henüz kelime istatistiği yok. Oyun oynayarak kelime istatistikleri oluşturun.</div>';
                }
            }
        }
        // Favoriler panelini de yenile
        if (typeof loadFavoritesStats === 'function') {
            try {
                await loadFavoritesStats();
            } catch (e) {
                console.warn('Favoriler paneli yenilenirken hata:', e);
            }
        }
    } else {
        // Modal açık değilse refreshDetailedStatsIfOpen çağır (açıldığında yüklenecek)
        if (typeof refreshDetailedStatsIfOpen === 'function') {
            refreshDetailedStatsIfOpen();
        }
    }
    
    // Flag set et
    localStorage.setItem('hasene_statsJustReset', 'true');
    
    // Verileri kaydet
    await saveStatsImmediate();
    
    closeModal('data-status-modal');
    showSuccessMessage('Tüm veriler sıfırlandı!');
}

// ============================================
// UI GÜNCELLEME
// ============================================

/**
 * Oyun içi UI'ı günceller
 */
function updateUI() {
    // Session skorunu güncelle
    const sessionScoreEls = document.querySelectorAll('#session-score, #dinle-session-score, #bosluk-session-score');
    sessionScoreEls.forEach(el => {
        if (el) el.textContent = `Hasene: ${sessionScore}`;
    });
}

// ============================================
// EVENT LISTENERS
// ============================================

// Sayfa yüklendiğinde
window.addEventListener('load', async () => {
    // Loading screen'i gizle
    if (elements.loadingScreen) {
        setTimeout(() => {
            elements.loadingScreen.classList.add('hidden');
            setTimeout(() => {
                elements.loadingScreen.style.display = 'none';
            }, 500);
        }, 500);
    }
    
    // Mobil cihaz tespiti
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const clientWaitTime = isMobile ? 1000 : 500; // Mobil için daha uzun bekleme
    
    // Supabase client'ın başlatılmasını bekle (eğer varsa)
    if (typeof window.supabase !== 'undefined') {
        await new Promise(resolve => {
            let checkCount = 0;
            const maxChecks = 20; // Maksimum kontrol sayısı
            
            const checkSupabase = () => {
                if (typeof window.getCurrentUser === 'function' && typeof window.supabaseClient !== 'undefined' && window.supabaseClient) {
                    // Client hazır, session restore için bekle
                    console.log('✅ Supabase client hazır, session restore bekleniyor...');
                    setTimeout(resolve, clientWaitTime);
                } else if (checkCount < maxChecks) {
                    // Henüz hazır değil, tekrar kontrol et
                    checkCount++;
                    setTimeout(checkSupabase, 200);
                } else {
                    // Maksimum kontrol sayısına ulaşıldı, devam et
                    console.warn('⚠️ Supabase client hazır olmadı, devam ediliyor...');
                    setTimeout(resolve, clientWaitTime);
                }
            };
            checkSupabase();
        });
    }
    
    // İstatistikleri yükle
    await loadStats();
    
    // UI'ın güncellendiğinden emin olmak için tekrar kontrol et
    // (loadStats içinde güncellenmiş olabilir ama emin olmak için)
    setTimeout(() => {
        if (typeof updateStatsBar === 'function') {
            updateStatsBar();
        }
        if (typeof updateDailyGoalDisplay === 'function') {
            updateDailyGoalDisplay();
        }
        if (typeof updateStreakDisplay === 'function') {
            updateStreakDisplay();
        }
        if (typeof updateTasksDisplay === 'function') {
            updateTasksDisplay();
        }
        console.log('✅ Sayfa yüklendi, UI son kontrol ile güncellendi');
    }, 500);
    
    // Gece yarısı otomatik sıfırlama zamanlayıcısını başlat
    setupMidnightReset();
    
    // Arka planda JSON verilerini önceden yükle (non-blocking)
    if (typeof preloadAllDataBackground === 'function') {
        preloadAllDataBackground();
    }
    
    // Onboarding kontrolü
    if (!localStorage.getItem('hasene_onboarding_seen_v2')) {
        setTimeout(() => {
            if (typeof showOnboarding === 'function') {
                showOnboarding();
            }
        }, 1000);
    }
});

// Oyun kartları
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
        const gameMode = card.dataset.game;
        startGame(gameMode);
    });
});

// Zorluk seçici
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentDifficulty = btn.dataset.difficulty;
        // Zorluk değiştiğinde kullanıcıya bilgi ver
        infoLog(`Zorluk seviyesi değiştirildi: ${currentDifficulty}`);
        // Pop-up mesajı kaldırıldı - sadece log tutuluyor
    });
});

// Sayfa yüklendiğinde aktif zorluk seviyesini JS'e senkronize et
function syncDifficultyFromHTML() {
    const activeBtn = document.querySelector('.difficulty-btn.active');
    if (activeBtn) {
        currentDifficulty = activeBtn.dataset.difficulty || 'medium';
        infoLog(`Zorluk seviyesi HTML'den senkronize edildi: ${currentDifficulty}`);
    }
}

// Zorluk seviyesini senkronize et (tek bir event listener ile)
// DOMContentLoaded veya load event'inde çalıştır
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncDifficultyFromHTML, { once: true });
} else {
    // DOM zaten yüklüyse hemen çalıştır
    syncDifficultyFromHTML();
}

// Kelime Çevir alt mod seçimi
document.querySelectorAll('.submode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const subMode = btn.dataset.submode;
        startKelimeCevirGame(subMode);
    });
});

// İpucu butonu
const hintBtn = document.getElementById('hint-btn');
if (hintBtn) {
    hintBtn.addEventListener('click', handleHint);
}

// Bottom navigation
document.querySelectorAll('.bottom-nav .nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        
        // Aktif butonu güncelle
        document.querySelectorAll('.bottom-nav .nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (page === 'main-menu') {
            goToMainMenu();
        } else if (page === 'stats') {
            // Direkt detaylı istatistikleri göster
            if (typeof showDetailedStatsModal === 'function') {
                showDetailedStatsModal();
            } else if (typeof showDetailedStats === 'function') {
                showDetailedStats();
            }
        } else if (page === 'badges') {
            showBadgesModal();
        } else if (page === 'calendar') {
            showCalendarModal();
        } else if (page === 'tasks') {
            showDailyTasksModal();
        }
    });
});

// Günlük vird ayarları butonu
const dailyGoalSettingsBtn = document.getElementById('daily-goal-settings-btn');
if (dailyGoalSettingsBtn) {
    dailyGoalSettingsBtn.addEventListener('click', showDailyGoalSettings);
}

// Günlük hedef seviye butonları
document.querySelectorAll('.goal-level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const level = btn.dataset.level;
        setDailyGoalLevel(level);
    });
});

// Export functions
if (typeof window !== 'undefined') {
    window.startGame = startGame;
    window.endGame = endGame;
    window.restartGame = restartGame;
    window.saveCurrentGameProgress = saveCurrentGameProgress;
    window.showStatsModal = showStatsModal;
    window.showBadgesModal = showBadgesModal;
    window.showCalendarModal = showCalendarModal;
    window.showDailyTasksModal = showDailyTasksModal;
    window.showDailyGoalSettings = showDailyGoalSettings;
    window.showDataStatus = showDataStatus;
    window.showCustomConfirm = showCustomConfirm;
    window.showLevelUpModal = showLevelUpModal;
    window.claimDailyRewards = claimDailyRewards;
    window.closeDailyRewardModal = closeDailyRewardModal;
    window.claimWeeklyRewards = claimWeeklyRewards;
    window.setCustomGoal = setCustomGoal;
    window.resetAllStats = resetAllStats;
    window.clearUserLocalStorage = clearUserLocalStorage;
    window.loadStats = loadStats; // Auth.js'den çağrılabilmesi için
    window.showDetailedStats = () => {
        if (typeof showDetailedStatsModal === 'function') {
            showDetailedStatsModal();
        } else {
            // Fallback: Basit bir modal göster
            showErrorMessage('Detaylı istatistikler yükleniyor...');
            setTimeout(() => {
                if (typeof showDetailedStatsModal === 'function') {
                    showDetailedStatsModal();
                }
            }, 100);
        }
    };
}

