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

// Audio yönetimi - seslerin üst üste çalmasını önlemek için
let currentAudio = null;
window.currentAudio = null; // Global erişim için

/**
 * Çalan sesi durdurur
 */
function stopCurrentAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
        window.currentAudio = null;
    }
}

window.stopCurrentAudio = stopCurrentAudio;

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
    loadingScreen: document.getElementById('loading-screen'),
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
    try {
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

        const savedDailyTasks = await loadFromIndexedDB('hasene_dailyTasks');
        if (savedDailyTasks) {
            dailyTasks = savedDailyTasks;
            // Set'leri yeniden oluştur
            if (dailyTasks.todayStats) {
                dailyTasks.todayStats.allGameModes = new Set(dailyTasks.todayStats.allGameModes || []);
                dailyTasks.todayStats.farklıZorluk = new Set(dailyTasks.todayStats.farklıZorluk || []);
                dailyTasks.todayStats.reviewWords = new Set(dailyTasks.todayStats.reviewWords || []);
                // Yeni alanlar için varsayılan değerler
                if (dailyTasks.todayStats.ayetOku === undefined) dailyTasks.todayStats.ayetOku = 0;
                if (dailyTasks.todayStats.duaEt === undefined) dailyTasks.todayStats.duaEt = 0;
                if (dailyTasks.todayStats.hadisOku === undefined) dailyTasks.todayStats.hadisOku = 0;
            }
        } else {
            const localDailyTasks = safeGetItem('hasene_dailyTasks', dailyTasks);
            dailyTasks = localDailyTasks;
            if (dailyTasks.todayStats) {
                dailyTasks.todayStats.allGameModes = new Set(dailyTasks.todayStats.allGameModes || []);
                dailyTasks.todayStats.farklıZorluk = new Set(dailyTasks.todayStats.farklıZorluk || []);
                dailyTasks.todayStats.reviewWords = new Set(dailyTasks.todayStats.reviewWords || []);
                // Yeni alanlar için varsayılan değerler
                if (dailyTasks.todayStats.ayetOku === undefined) dailyTasks.todayStats.ayetOku = 0;
                if (dailyTasks.todayStats.duaEt === undefined) dailyTasks.todayStats.duaEt = 0;
                if (dailyTasks.todayStats.hadisOku === undefined) dailyTasks.todayStats.hadisOku = 0;
            }
        }

        const savedWeeklyTasks = await loadFromIndexedDB('hasene_weeklyTasks');
        if (savedWeeklyTasks) {
            weeklyTasks = savedWeeklyTasks;
            if (weeklyTasks.weekStats) {
                weeklyTasks.weekStats.allModesPlayed = new Set(weeklyTasks.weekStats.allModesPlayed || []);
            }
        } else {
            const localWeeklyTasks = safeGetItem('hasene_weeklyTasks', weeklyTasks);
            weeklyTasks = localWeeklyTasks;
            if (weeklyTasks.weekStats) {
                weeklyTasks.weekStats.allModesPlayed = new Set(weeklyTasks.weekStats.allModesPlayed || []);
            }
        }

        wordStats = safeGetItem('hasene_wordStats', {});
        // Eski format desteği: array of strings -> array of objects
        const savedAchievements = safeGetItem('unlockedAchievements', []);
        const savedUnlockedBadges = safeGetItem('unlockedBadges', []);
        
        // Eski format kontrolü ve dönüştürme
        if (savedAchievements.length > 0 && typeof savedAchievements[0] === 'string') {
            // Eski format: string array -> object array (timestamp şimdiki zaman)
            unlockedAchievements = savedAchievements.map((id, index) => ({
                id: id,
                unlockedAt: Date.now() - (savedAchievements.length - index) * 1000 // Sıraya göre timestamp
            }));
            safeSetItem('unlockedAchievements', unlockedAchievements);
        } else {
            unlockedAchievements = savedAchievements;
        }
        
        if (savedUnlockedBadges.length > 0 && typeof savedUnlockedBadges[0] === 'string') {
            // Eski format: string array -> object array (timestamp şimdiki zaman)
            unlockedBadges = savedUnlockedBadges.map((id, index) => ({
                id: id,
                unlockedAt: Date.now() - (savedUnlockedBadges.length - index) * 1000 // Sıraya göre timestamp
            }));
            safeSetItem('unlockedBadges', unlockedBadges);
        } else {
            unlockedBadges = savedUnlockedBadges;
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

        // Bugünkü istatistikler
        const today = getLocalDateString();
        const lastDailyGoalDate = localStorage.getItem('lastDailyGoalDate');
        if (lastDailyGoalDate !== today) {
            // Yeni gün, günlük istatistikleri sıfırla
            localStorage.setItem('dailyCorrect', '0');
            localStorage.setItem('dailyWrong', '0');
            localStorage.setItem('dailyXP', '0');
            localStorage.setItem('lastDailyGoalDate', today);
        }

        // Görevleri kontrol et
        checkDailyTasks();
        checkWeeklyTasks();

        // UI'ı güncelle
        updateStatsBar();
        updateDailyGoalDisplay();
        updateTasksDisplay(); // Görev sayacını güncelle

        infoLog('İstatistikler yüklendi');
    } catch (error) {
        errorLog('İstatistik yükleme hatası:', error);
    }
}

/**
 * Tüm istatistikleri kaydeder
 */
async function saveStats() {
    try {
        // IndexedDB'ye kaydet (ana sistem)
        if (db) {
            await saveToIndexedDB('hasene_totalPoints', totalPoints.toString());
            await saveToIndexedDB('hasene_badges', badges);
            await saveToIndexedDB('hasene_streakData', streakData);
            
            // Set'leri array'e çevir
            const dailyTasksToSave = {
                ...dailyTasks,
                todayStats: {
                    ...dailyTasks.todayStats,
                    allGameModes: Array.from(dailyTasks.todayStats.allGameModes || []),
                    farklıZorluk: Array.from(dailyTasks.todayStats.farklıZorluk || []),
                    reviewWords: Array.from(dailyTasks.todayStats.reviewWords || [])
                }
            };
            await saveToIndexedDB('hasene_dailyTasks', dailyTasksToSave);
            
            const weeklyTasksToSave = {
                ...weeklyTasks,
                weekStats: {
                    ...weeklyTasks.weekStats,
                    allModesPlayed: Array.from(weeklyTasks.weekStats.allModesPlayed || [])
                }
            };
            await saveToIndexedDB('hasene_weeklyTasks', weeklyTasksToSave);
        }

        // localStorage'a kaydet (yedek)
        localStorage.setItem('hasene_totalPoints', totalPoints.toString());
        safeSetItem('hasene_badges', badges);
        safeSetItem('hasene_streakData', streakData);
        
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
        
        const weeklyTasksToSave = {
            ...weeklyTasks,
            weekStats: {
                ...weeklyTasks.weekStats,
                allModesPlayed: Array.from(weeklyTasks.weekStats.allModesPlayed || [])
            }
        };
        safeSetItem('hasene_weeklyTasks', weeklyTasksToSave);
        
        safeSetItem('hasene_wordStats', wordStats);
        safeSetItem('unlockedAchievements', unlockedAchievements);
        safeSetItem('unlockedBadges', unlockedBadges);
        safeSetItem('perfectLessonsCount', perfectLessonsCount);
        safeSetItem('gameStats', gameStats);

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
    await saveStats();
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
    const stars = Math.floor(points / 100);
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
async function addToGlobalPoints(points, correctAnswers) {
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
}

/**
 * Üst barı güncelle
 */
function updateStatsBar() {
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
    const dailyGoalHasene = parseInt(localStorage.getItem('dailyGoalHasene') || CONFIG.DAILY_GOAL_DEFAULT.toString());
    const dailyXP = parseInt(localStorage.getItem('dailyXP') || '0');
    const percent = Math.min(100, Math.floor((dailyXP / dailyGoalHasene) * 100));
    
    if (elements.dailyGoalProgress) {
        elements.dailyGoalProgress.style.width = percent + '%';
    }
    
    if (elements.dailyGoalCurrent) {
        elements.dailyGoalCurrent.textContent = formatNumber(dailyXP);
    }
    
    if (elements.dailyGoalTarget) {
        elements.dailyGoalTarget.textContent = formatNumber(dailyGoalHasene);
    }
    
    if (elements.dailyGoalPercent) {
        elements.dailyGoalPercent.textContent = `(${percent}%)`;
    }
    
    // Günlük hedef tamamlandı mı?
    if (dailyXP >= dailyGoalHasene && !localStorage.getItem('dailyGoalCompleted')) {
        localStorage.setItem('dailyGoalCompleted', 'true');
        addToGlobalPoints(1000, 0); // Bonus
        showSuccessMessage('🎉 Günlük virdi tamamladınız! +1,000 Hasene');
    }
}

/**
 * Streak görüntüsünü güncelle
 */
function updateStreakDisplay() {
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
    currentSubMode = subMode;
    window.currentGame = currentGame;
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
    
    // Verileri yükle
    const allWords = await loadKelimeData();
    if (!allWords || allWords.length === 0) {
        showErrorMessage('Kelime verileri yüklenemedi!');
        return;
    }
    
    // Filtrele - Zorluk seviyesine göre
    infoLog(`Kelime Çevir oyunu başlatılıyor - Zorluk: ${currentDifficulty}`);
    let filteredWords = filterByDifficulty(allWords, currentDifficulty);
    infoLog(`Filtrelenmiş kelime sayısı: ${filteredWords.length}`);
    
    if (subMode === 'juz30') {
        filteredWords = filterJuz30(filteredWords);
        infoLog(`30.cüz filtresi uygulandı: ${filteredWords.length} kelime`);
    } else if (subMode === 'review') {
        // Zorlanılan kelimeleri al
        const strugglingWordIds = getStrugglingWords();
        if (strugglingWordIds.length > 0) {
            // Zorlanılan kelimelerin ID'lerini kullanarak gerçek kelime verilerini filtrele
            const strugglingIdsSet = new Set(strugglingWordIds.map(w => w.id));
            filteredWords = filteredWords.filter(w => strugglingIdsSet.has(w.id));
            infoLog(`Tekrar et filtresi uygulandı: ${filteredWords.length} kelime (${strugglingWordIds.length} zorlanılan kelime bulundu)`);
        } else {
            infoLog('Tekrar et modu: Zorlanılan kelime bulunamadı, normal moda geçiliyor');
        }
    }
    
    if (filteredWords.length < CONFIG.QUESTIONS_PER_GAME) {
        showErrorMessage('Yeterli kelime bulunamadı!');
        return;
    }
    
    // Soruları seç
    questions = getRandomItems(filteredWords, CONFIG.QUESTIONS_PER_GAME);
    
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
    
    // Ses çal butonu
    const playAudioBtn = document.getElementById('kelime-play-audio-btn');
    if (playAudioBtn && currentQuestionData.ses_dosyasi) {
        playAudioBtn.onclick = () => {
            // Önceki sesi durdur
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
            
            // Yeni ses oluştur ve çal
            currentAudio = new Audio(currentQuestionData.ses_dosyasi);
            window.currentAudio = currentAudio;
            playAudioBtn.disabled = true;
            playAudioBtn.style.opacity = '0.6';
            
            currentAudio.play().catch(err => {
                console.error('Ses çalınamadı:', err);
                showErrorMessage('Ses dosyası yüklenemedi!');
                playAudioBtn.disabled = false;
                playAudioBtn.style.opacity = '1';
                currentAudio = null;
                window.currentAudio = null;
            });
            
            // Ses bitince butonu tekrar aktif et
            currentAudio.onended = () => {
                playAudioBtn.disabled = false;
                playAudioBtn.style.opacity = '1';
                currentAudio = null;
                window.currentAudio = null;
            };
            
            // Hata durumunda butonu tekrar aktif et
            currentAudio.onerror = () => {
                playAudioBtn.disabled = false;
                playAudioBtn.style.opacity = '1';
                currentAudio = null;
                window.currentAudio = null;
            };
        };
    } else if (playAudioBtn) {
        // Ses dosyası yoksa butonu devre dışı bırak
        playAudioBtn.style.opacity = '0.5';
        playAudioBtn.disabled = true;
    }
    
    // Seçenekleri oluştur
    const correctAnswer = currentQuestionData.anlam;
    const allWords = questions;
    const wrongAnswers = allWords
        .filter(w => w.id !== currentQuestionData.id)
        .map(w => w.anlam)
        .filter((v, i, a) => a.indexOf(v) === i) // Tekrarları kaldır
        .slice(0, 3);
    
    const options = shuffleArray([correctAnswer, ...wrongAnswers]);
    
    // Butonları güncelle
    const optionButtons = document.querySelectorAll('#kelime-cevir-screen .option-btn');
    optionButtons.forEach((btn, index) => {
        btn.textContent = options[index];
        btn.classList.remove('correct', 'wrong', 'disabled');
        btn.disabled = false;
        btn.onclick = () => checkKelimeAnswer(index, options[index] === correctAnswer);
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
        
        // Puan ekle
        let points = CONFIG.POINTS_CORRECT;
        if (comboCount % 3 === 0) {
            points += CONFIG.COMBO_BONUS;
        }
        addSessionPoints(points);
        
        // Kelime istatistiği
        updateWordStats(currentQuestionData.id, true);
        
        // Combo göster
        if (comboCount % 3 === 0) {
            showComboBonus();
        }
        
        playSound('correct');
        
        // Bir sonraki soruya geç
        setTimeout(() => {
            currentQuestion++;
            loadKelimeQuestion();
        }, 1500);
    } else {
        // Yanlış cevap
        optionButtons[selectedIndex].classList.add('wrong');
        
        // Doğru cevabı göster
        optionButtons.forEach((btn, index) => {
            const optionText = btn.textContent;
            if (optionText === currentQuestionData.anlam) {
                btn.classList.add('correct');
            }
        });
        
        sessionWrong++;
        comboCount = 0;
        
        // Puan kaybı yok - sadece doğru cevap gösterilir
        // addSessionPoints çağrılmıyor
        
        // Kelime istatistiği
        updateWordStats(currentQuestionData.id, false);
        
        // Can sistemi kaldırıldı - oyun devam eder
        
        playSound('wrong');
        
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
 */
function showComboBonus() {
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
}

// ============================================
// OYUN FONKSİYONLARI - DİNLE BUL
// ============================================

/**
 * Dinle Bul oyununu başlatır
 */
async function startDinleBulGame() {
    currentGame = 'dinle-bul';
    window.currentGame = currentGame;
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
    
    // Filtrele - Zorluk seviyesine göre
    infoLog(`Dinle Bul oyunu başlatılıyor - Zorluk: ${currentDifficulty}`);
    let filteredWords = filterByDifficulty(allWords, currentDifficulty);
    infoLog(`Filtrelenmiş kelime sayısı: ${filteredWords.length}`);
    
    if (filteredWords.length < CONFIG.QUESTIONS_PER_GAME) {
        showErrorMessage('Yeterli kelime bulunamadı!');
        return;
    }
    
    questions = getRandomItems(filteredWords, CONFIG.QUESTIONS_PER_GAME);
    
    loadDinleQuestion();
}

/**
 * Dinle Bul sorusu yükler
 */
function loadDinleQuestion() {
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
    
    // Ses çal (otomatik)
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    currentAudio = new Audio(currentQuestionData.ses_dosyasi);
    window.currentAudio = currentAudio;
    currentAudio.play().catch(err => {
        warnLog('Ses çalınamadı:', err);
        currentAudio = null;
        window.currentAudio = null;
    });
    
    // Ses bitince temizle
    currentAudio.onended = () => {
        currentAudio = null;
        window.currentAudio = null;
    };
    
    // Ses çal butonunu güncelle
    const playBtn = document.getElementById('play-audio-btn');
    if (playBtn) {
        playBtn.onclick = () => {
            // Önceki sesi durdur
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
            
            // Yeni ses oluştur ve çal
            currentAudio = new Audio(currentQuestionData.ses_dosyasi);
            window.currentAudio = currentAudio;
            playBtn.disabled = true;
            playBtn.style.opacity = '0.6';
            
            currentAudio.play().catch(err => {
                warnLog('Ses çalınamadı:', err);
                playBtn.disabled = false;
                playBtn.style.opacity = '1';
                currentAudio = null;
                window.currentAudio = null;
            });
            
            // Ses bitince butonu tekrar aktif et
            currentAudio.onended = () => {
                playBtn.disabled = false;
                playBtn.style.opacity = '1';
                currentAudio = null;
                window.currentAudio = null;
            };
            
            // Hata durumunda butonu tekrar aktif et
            currentAudio.onerror = () => {
                playBtn.disabled = false;
                playBtn.style.opacity = '1';
                currentAudio = null;
                window.currentAudio = null;
            };
        };
    }
    
    // Seçenekleri oluştur
    const correctAnswer = currentQuestionData.kelime;
    const allWords = questions;
    const wrongAnswers = allWords
        .filter(w => w.id !== currentQuestionData.id)
        .map(w => w.kelime)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 3);
    
    const options = shuffleArray([correctAnswer, ...wrongAnswers]);
    
    // Butonları güncelle
    const optionButtons = document.querySelectorAll('#dinle-bul-screen .option-btn');
    optionButtons.forEach((btn, index) => {
        btn.textContent = options[index];
        btn.classList.remove('correct', 'wrong', 'disabled');
        btn.disabled = false;
        btn.onclick = () => checkDinleAnswer(index, options[index] === correctAnswer);
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
        
        let points = CONFIG.POINTS_CORRECT;
        if (comboCount % 3 === 0) {
            points += CONFIG.COMBO_BONUS;
        }
        addSessionPoints(points);
        
        updateWordStats(currentQuestionData.id, true);
        
        if (comboCount % 3 === 0) {
            const comboDisplay = document.getElementById('dinle-combo-display');
            if (comboDisplay) {
                comboDisplay.style.display = 'block';
                document.getElementById('dinle-combo-count').textContent = comboCount;
                // 2 saniye sonra otomatik gizle
                setTimeout(() => {
                    comboDisplay.style.display = 'none';
                }, 2000);
            }
        }
        
        playSound('correct');
        
        setTimeout(() => {
            currentQuestion++;
            loadDinleQuestion();
        }, 1500);
    } else {
        // Yanlış cevap - sadece doğru cevabı göster, puan kaybı yok
        optionButtons[selectedIndex].classList.add('wrong');
        
        optionButtons.forEach((btn, index) => {
            if (btn.textContent === currentQuestionData.kelime) {
                btn.classList.add('correct');
            }
        });
        
        sessionWrong++;
        comboCount = 0;
        // Puan kaybı yok - sadece doğru cevap gösterilir
        updateWordStats(currentQuestionData.id, false);
        playSound('wrong');
        
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
    window.currentGame = currentGame;
    currentQuestion = 0;
    sessionScore = 0;
    sessionCorrect = 0;
    sessionWrong = 0;
    comboCount = 0;
    maxCombo = 0;
    
    const allAyet = await loadAyetData();
    if (!allAyet || allAyet.length === 0) {
        showErrorMessage('Ayet verileri yüklenemedi!');
        return;
    }
    
    // Ayetlerden rastgele seç
    questions = getRandomItems(allAyet, CONFIG.QUESTIONS_PER_GAME);
    
    loadBoslukQuestion();
}

/**
 * Boşluk Doldur sorusu yükler
 */
async function loadBoslukQuestion() {
    if (currentQuestion >= questions.length) {
        endGame();
        return;
    }
    
    currentQuestionData = questions[currentQuestion];
    
    // Ayet metnini al ve bir kelimeyi boşlukla değiştir
    const ayetText = currentQuestionData.ayet_metni;
    const words = ayetText.split(' ');
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
    
    // Ses çal butonu
    const playBtn = document.getElementById('bosluk-play-audio-btn');
    if (playBtn && currentQuestionData.ayet_ses_dosyasi) {
        playBtn.onclick = () => {
            // Önceki sesi durdur
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
            
            // Yeni ses oluştur ve çal
            currentAudio = new Audio(currentQuestionData.ayet_ses_dosyasi);
            window.currentAudio = currentAudio;
            playBtn.disabled = true;
            playBtn.style.opacity = '0.6';
            
            currentAudio.play().catch(err => {
                console.error('Ses çalınamadı:', err);
                showErrorMessage('Ses dosyası çalınamadı.');
                playBtn.disabled = false;
                playBtn.style.opacity = '1';
                currentAudio = null;
                window.currentAudio = null;
            });
            
            // Ses bitince butonu tekrar aktif et
            currentAudio.onended = () => {
                playBtn.disabled = false;
                playBtn.style.opacity = '1';
                currentAudio = null;
                window.currentAudio = null;
            };
            
            // Hata durumunda butonu tekrar aktif et
            currentAudio.onerror = () => {
                playBtn.disabled = false;
                playBtn.style.opacity = '1';
                currentAudio = null;
                window.currentAudio = null;
            };
        };
    }
    
    // Seçenekleri oluştur (doğru kelime + 3 yanlış)
    const allAyet = questions;
    const wrongWords = allAyet
        .filter(a => a.ayet_kimligi !== currentQuestionData.ayet_kimligi)
        .flatMap(a => a.ayet_metni.split(' '))
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 3);
    
    const options = shuffleArray([missingWord, ...wrongWords]);
    
    // Butonları güncelle
    const optionButtons = document.querySelectorAll('#bosluk-doldur-screen .option-btn');
    optionButtons.forEach((btn, index) => {
        btn.textContent = options[index];
        btn.classList.remove('correct', 'wrong', 'disabled');
        btn.disabled = false;
        btn.onclick = () => checkBoslukAnswer(index, options[index] === missingWord);
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
        
        let points = CONFIG.POINTS_CORRECT;
        if (comboCount % 3 === 0) {
            points += CONFIG.COMBO_BONUS;
        }
        addSessionPoints(points);
        
        if (comboCount % 3 === 0) {
            const comboDisplay = document.getElementById('bosluk-combo-display');
            if (comboDisplay) {
                comboDisplay.style.display = 'block';
                document.getElementById('bosluk-combo-count').textContent = comboCount;
                // 2 saniye sonra otomatik gizle
                setTimeout(() => {
                    comboDisplay.style.display = 'none';
                }, 2000);
            }
        }
        
        playSound('correct');
        
        // Audio çalıyorsa bitmesini bekle, yoksa normal süre sonra geç
        const moveToNextQuestion = () => {
            currentQuestion++;
            loadBoslukQuestion();
        };
        
        if (currentAudio && !currentAudio.paused && !currentAudio.ended) {
            // Audio çalıyorsa, bitmesini bekle
            // Mevcut onended handler'ını sakla
            const originalOnEnded = currentAudio.onended;
            // Yeni handler ekle (hem eski handler'ı çağır hem de sonraki soruya geç)
            currentAudio.onended = () => {
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
        
        optionButtons.forEach((btn, index) => {
            if (btn.textContent === currentQuestionData.missingWord) {
                btn.classList.add('correct');
            }
        });
        
        sessionWrong++;
        comboCount = 0;
        // Puan kaybı yok - sadece doğru cevap gösterilir
        playSound('wrong');
        
        // Audio çalıyorsa bitmesini bekle, yoksa normal süre sonra geç
        const moveToNextQuestion = () => {
            currentQuestion++;
            loadBoslukQuestion();
        };
        
        if (currentAudio && !currentAudio.paused && !currentAudio.ended) {
            // Audio çalıyorsa, bitmesini bekle
            // Mevcut onended handler'ını sakla
            const originalOnEnded = currentAudio.onended;
            // Yeni handler ekle (hem eski handler'ı çağır hem de sonraki soruya geç)
            currentAudio.onended = () => {
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

/**
 * Ayet Oku modunu başlatır
 */
async function startAyetOku() {
    currentGame = 'ayet-oku';
    window.currentGame = currentGame;
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
    
    // Ses çal butonu (Arapça metnin yanında)
    const playAudioBtn = document.getElementById('ayet-play-audio-btn');
    if (playAudioBtn) {
        if (ayet.ayet_ses_dosyasi) {
            playAudioBtn.onclick = () => {
                // Önceki sesi durdur
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                
                // Yeni ses oluştur ve çal
                currentAudio = new Audio(ayet.ayet_ses_dosyasi);
                window.currentAudio = currentAudio;
                playAudioBtn.disabled = true;
                playAudioBtn.style.opacity = '0.6';
                
                currentAudio.play().catch(err => {
                    console.error('Ses çalınamadı:', err);
                    showErrorMessage('Ses dosyası çalınamadı.');
                    playAudioBtn.disabled = false;
                    playAudioBtn.style.opacity = '1';
                    currentAudio = null;
                    window.currentAudio = null;
                });
                
                // Ses bitince butonu tekrar aktif et
                currentAudio.onended = () => {
                    playAudioBtn.disabled = false;
                    playAudioBtn.style.opacity = '1';
                    currentAudio = null;
                    window.currentAudio = null;
                };
                
                // Hata durumunda butonu tekrar aktif et
                currentAudio.onerror = () => {
                    playAudioBtn.disabled = false;
                    playAudioBtn.style.opacity = '1';
                    currentAudio = null;
                    window.currentAudio = null;
                };
            };
            playAudioBtn.disabled = false;
            playAudioBtn.style.opacity = '1';
        } else {
            // Ses dosyası yoksa butonu devre dışı bırak
            playAudioBtn.disabled = true;
            playAudioBtn.style.opacity = '0.5';
        }
    }
    
    // Navigasyon butonları
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
        // Her zaman bir sonraki rastgele ayeti göster
        nextBtn.disabled = false;
        nextBtn.onclick = () => {
            // Yeni rastgele bir ayet seç
            const randomIndex = Math.floor(Math.random() * allAyet.length);
            currentAyetIndex = randomIndex;
            displayAyet(allAyet[currentAyetIndex], allAyet);
        };
    }
}

/**
 * Dua Et modunu başlatır
 */
async function startDuaEt() {
    currentGame = 'dua-et';
    window.currentGame = currentGame;
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
    
    // Ses çal butonu (Arapça metnin yanında)
    const playAudioBtn = document.getElementById('dua-play-audio-btn');
    if (playAudioBtn) {
        if (dua.ses_url) {
            playAudioBtn.onclick = () => {
                // Önceki sesi durdur
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                
                // Yeni ses oluştur ve çal
                currentAudio = new Audio(dua.ses_url);
                window.currentAudio = currentAudio;
                if (dua.start) {
                    currentAudio.currentTime = dua.start;
                }
                playAudioBtn.disabled = true;
                playAudioBtn.style.opacity = '0.6';
                
                currentAudio.play().catch(err => {
                    console.error('Ses çalınamadı:', err);
                    showErrorMessage('Ses dosyası çalınamadı.');
                    playAudioBtn.disabled = false;
                    playAudioBtn.style.opacity = '1';
                    currentAudio = null;
                    window.currentAudio = null;
                });
                
                // Ses bitince butonu tekrar aktif et
                currentAudio.onended = () => {
                    playAudioBtn.disabled = false;
                    playAudioBtn.style.opacity = '1';
                    currentAudio = null;
                    window.currentAudio = null;
                };
                
                // Hata durumunda butonu tekrar aktif et
                currentAudio.onerror = () => {
                    playAudioBtn.disabled = false;
                    playAudioBtn.style.opacity = '1';
                    currentAudio = null;
                    window.currentAudio = null;
                };
            };
            playAudioBtn.disabled = false;
            playAudioBtn.style.opacity = '1';
        } else {
            // Ses dosyası yoksa butonu devre dışı bırak
            playAudioBtn.disabled = true;
            playAudioBtn.style.opacity = '0.5';
        }
    }
    
    // Navigasyon
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
        // Her zaman bir sonraki rastgele duayı göster
        nextBtn.disabled = false;
        nextBtn.onclick = () => {
            // Yeni rastgele bir dua seç
            const randomIndex = Math.floor(Math.random() * allDua.length);
            currentDuaIndex = randomIndex;
            displayDua(allDua[currentDuaIndex], allDua);
        };
    }
}

/**
 * Hadis Oku modunu başlatır
 */
async function startHadisOku() {
    currentGame = 'hadis-oku';
    window.currentGame = currentGame;
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
    
    // Navigasyon
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
        // Her zaman bir sonraki rastgele hadisi göster
        nextBtn.disabled = false;
        nextBtn.onclick = () => {
            // Yeni rastgele bir hadis seç
            const randomIndex = Math.floor(Math.random() * allHadis.length);
            currentHadisIndex = randomIndex;
            displayHadis(allHadis[currentHadisIndex], allHadis);
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
    if (!currentGame || sessionScore === 0 && sessionCorrect === 0) {
        return; // Oyun yoksa veya ilerleme yoksa kaydetme
    }
    
    // Global puanlara ekle
    await addToGlobalPoints(sessionScore, sessionCorrect);
    
    // Günlük istatistikleri güncelle
    const dailyCorrect = parseInt(localStorage.getItem('dailyCorrect') || '0');
    const dailyWrong = parseInt(localStorage.getItem('dailyWrong') || '0');
    localStorage.setItem('dailyCorrect', (dailyCorrect + sessionCorrect).toString());
    localStorage.setItem('dailyWrong', (dailyWrong + sessionWrong).toString());
    
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
        perfect: 0 // Oyun bitmeden çıkıldığı için perfect bonus yok
    });
    
    // Rozetleri ve başarımları kontrol et
    checkBadges();
    checkAchievements();
    
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
    // Perfect Lesson bonusu kontrolü
    let perfectBonus = 0;
    if (sessionWrong === 0 && sessionCorrect >= 3 && sessionScore > 0) {
        perfectBonus = Math.floor(sessionScore * CONFIG.PERFECT_LESSON_BONUS_PERCENT);
        sessionScore += perfectBonus;
        // Mükemmel ders sayısını artır
        perfectLessonsCount++;
        safeSetItem('perfectLessonsCount', perfectLessonsCount);
    }
    
    // Global puanlara ekle
    await addToGlobalPoints(sessionScore, sessionCorrect);
    
    // Günlük istatistikleri güncelle
    const dailyCorrect = parseInt(localStorage.getItem('dailyCorrect') || '0');
    const dailyWrong = parseInt(localStorage.getItem('dailyWrong') || '0');
    localStorage.setItem('dailyCorrect', (dailyCorrect + sessionCorrect).toString());
    localStorage.setItem('dailyWrong', (dailyWrong + sessionWrong).toString());
    
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
    
    // Rozetleri ve başarımları kontrol et (addToGlobalPoints içinde zaten çağrılıyor ama tekrar kontrol için)
    checkBadges();
    checkAchievements();
    
    // Sonuç modalını göster
    showCustomConfirm(sessionCorrect, sessionWrong, sessionScore, perfectBonus);
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
    }
    
    updateTasksDisplay();
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
    }
    
    updateTasksDisplay();
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
    
    // Haftalık görevler
    weeklyTasks.weekStats.totalHasene += data.points || 0;
    weeklyTasks.weekStats.totalCorrect += data.correct || 0;
    weeklyTasks.weekStats.totalWrong += data.wrong || 0;
    weeklyTasks.weekStats.comboCount = Math.max(weeklyTasks.weekStats.comboCount, data.combo || 0);
    
    if (gameType) {
        weeklyTasks.weekStats.allModesPlayed.add(gameType);
    }
    
    weeklyTasks.tasks.forEach(task => {
        if (task.completed) return;
        
        let progress = 0;
        if (task.type === 'correct') {
            progress = weeklyTasks.weekStats.totalCorrect;
        } else if (task.type === 'hasene') {
            progress = weeklyTasks.weekStats.totalHasene;
        } else if (task.type === 'streak') {
            progress = streakData.currentStreak;
        } else if (task.type === 'game_modes') {
            progress = weeklyTasks.weekStats.allModesPlayed.size;
        } else if (task.type === 'combo') {
            progress = weeklyTasks.weekStats.comboCount;
        } else if (task.type === 'perfect_lessons') {
            // Haftalık perfect lessons için perfectLessonsCount kullan
            progress = perfectLessonsCount;
        }
        
        task.progress = progress;
        if (progress >= task.target) {
            task.completed = true;
            if (!weeklyTasks.completedTasks.includes(task.id)) {
                weeklyTasks.completedTasks.push(task.id);
            }
        }
    });
    
    updateTasksDisplay();
    debouncedSaveStats();
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
            const progressPercent = Math.min(100, Math.round((task.progress / task.target) * 100));
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <div class="task-info">
                    <div class="task-name-row">
                        <span class="task-name">${task.name}</span>
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
    const weeklyTasksList = document.getElementById('weekly-tasks-list');
    if (weeklyTasksList) {
        weeklyTasksList.innerHTML = '';
        
        // Haftalık görevler yoksa kontrol et
        if (!weeklyTasks.tasks || weeklyTasks.tasks.length === 0) {
            checkWeeklyTasks();
        }
        
        const weeklyTasksArray = weeklyTasks.tasks || [];
        
        if (weeklyTasksArray.length === 0) {
            weeklyTasksList.innerHTML = '<div style="text-align: center; padding: var(--spacing-md); color: var(--text-secondary);">Görevler yükleniyor...</div>';
        } else {
            weeklyTasksArray.forEach(task => {
            const progressPercent = Math.min(100, Math.round((task.progress / task.target) * 100));
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <div class="task-info">
                    <div class="task-name-row">
                        <span class="task-name">${task.name}</span>
                        ${task.completed ? '<span class="task-check">✓</span>' : `<span class="task-progress-text">${task.progress}/${task.target}</span>`}
                    </div>
                    ${!task.completed ? `
                        <div class="task-progress-bar">
                            <div class="task-progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                    ` : ''}
                </div>
            `;
                weeklyTasksList.appendChild(taskItem);
            });
        }
    }
    
    // Ödül butonlarını kontrol et
    const allDailyCompleted = dailyTasks.tasks.every(t => t.completed) && 
                              dailyTasks.bonusTasks.every(t => t.completed);
    const claimDailyBtn = document.getElementById('claim-daily-reward');
    if (claimDailyBtn) {
        claimDailyBtn.disabled = !allDailyCompleted || dailyTasks.rewardsClaimed;
    }
    
    const allWeeklyCompleted = weeklyTasks.tasks.every(t => t.completed);
    const claimWeeklyBtn = document.getElementById('claim-weekly-reward');
    if (claimWeeklyBtn) {
        claimWeeklyBtn.disabled = !allWeeklyCompleted || weeklyTasks.rewardsClaimed;
    }
    
    // Görev sayacını güncelle
    const tasksCounter = document.getElementById('tasks-counter');
    if (tasksCounter) {
        const dailyTasksArray = [...(dailyTasks.tasks || []), ...(dailyTasks.bonusTasks || [])];
        const weeklyTasksArray = weeklyTasks.tasks || [];
        
        const totalTasks = dailyTasksArray.length + weeklyTasksArray.length;
        const completedDaily = dailyTasksArray.filter(t => t.completed).length;
        const completedWeekly = weeklyTasksArray.filter(t => t.completed).length;
        const totalCompleted = completedDaily + completedWeekly;
        
        tasksCounter.textContent = `${totalCompleted}/${totalTasks}`;
        tasksCounter.style.display = totalTasks > 0 ? 'block' : 'none';
    }
    
    // Bildirim rozeti
    const tasksBadge = document.getElementById('tasks-badge');
    if (tasksBadge) {
        if (allDailyCompleted && !dailyTasks.rewardsClaimed) {
            tasksBadge.style.display = 'block';
        } else if (allWeeklyCompleted && !weeklyTasks.rewardsClaimed) {
            tasksBadge.style.display = 'block';
        } else {
            tasksBadge.style.display = 'none';
        }
    }
}

/**
 * Günlük ödülü alır
 */
async function claimDailyRewards() {
    if (dailyTasks.rewardsClaimed) return;
    
    dailyTasks.rewardsClaimed = true;
    await addToGlobalPoints(2500, 0);
    showSuccessMessage('🎉 Günlük görevler tamamlandı! +2,500 Hasene');
    updateTasksDisplay();
    saveStats();
}

/**
 * Haftalık ödülü alır
 */
async function claimWeeklyRewards() {
    if (weeklyTasks.rewardsClaimed) return;
    
    weeklyTasks.rewardsClaimed = true;
    await addToGlobalPoints(5000, 0);
    showSuccessMessage('🎉 Haftalık görevler tamamlandı! +5,000 Hasene');
    updateTasksDisplay();
    saveStats();
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
function updateWordStats(wordId, isCorrect) {
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
        stats.lastCorrect = getLocalDateString();
    } else {
        stats.wrong++;
        stats.lastWrong = getLocalDateString();
    }
    
    stats.successRate = (stats.correct / stats.attempts) * 100;
    stats.masteryLevel = Math.min(10, Math.floor(stats.successRate / 10));
    
    debouncedSaveStats();
}

/**
 * Zorlanılan kelimeleri döndürür
 */
function getStrugglingWords() {
    const allWords = Object.keys(wordStats)
        .filter(wordId => {
            const stats = wordStats[wordId];
            return stats.successRate < 50 && stats.attempts >= 2;
        })
        .map(wordId => {
            // Kelime verisini bul
            // Bu basitleştirilmiş bir versiyon, gerçek implementasyonda kelime verisini yüklemek gerekir
            return { id: wordId, ...wordStats[wordId] };
        });
    
    return allWords;
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
    
    BADGE_DEFINITIONS.forEach(badge => {
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
    saveStats();
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
    const stats = {
        totalPoints,
        totalCorrect: gameStats.totalCorrect,
        totalWrong: gameStats.totalWrong,
        level: calculateLevel(totalPoints),
        currentStreak: streakData.currentStreak,
        maxCombo
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
    // Güvenli değer alma - NaN, undefined, null kontrolü
    const dailyCorrect = parseInt(localStorage.getItem('dailyCorrect') || '0') || 0;
    const dailyWrong = parseInt(localStorage.getItem('dailyWrong') || '0') || 0;
    
    const safeTotalPoints = totalPoints || 0;
    const safeTotalCorrect = (gameStats && gameStats.totalCorrect) || 0;
    const safeTotalWrong = (gameStats && gameStats.totalWrong) || 0;
    const safeGameModeCounts = (gameStats && gameStats.gameModeCounts) || {};
    
    document.getElementById('stats-daily-correct').textContent = dailyCorrect;
    document.getElementById('stats-daily-wrong').textContent = dailyWrong;
    document.getElementById('stats-total-points').textContent = formatNumber(safeTotalPoints);
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
    const badgesGrid = document.getElementById('badges-grid');
    if (badgesGrid && BADGE_DEFINITIONS) {
        badgesGrid.innerHTML = '';
        
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
        
        // Rozetleri zorluk skoruna göre sırala (kolaydan zora, kazanılanlar önce)
        const badgesWithUnlockInfo = BADGE_DEFINITIONS.map((badge, originalIndex) => {
            // Yeni ve eski format desteği
            const unlockInfo = unlockedBadges.find(b => {
                if (typeof b === 'string') return b === badge.id;
                return b.id === badge.id;
            });
            
            return {
                badge: badge,
                originalIndex: originalIndex,
                difficultyScore: calculateBadgeDifficulty(badge),
                isUnlocked: !!unlockInfo,
                unlockedAt: unlockInfo ? (typeof unlockInfo === 'string' ? 0 : unlockInfo.unlockedAt) : null
            };
        });
        
        // Sırala: Önce kazanılanlar (zorluk skoruna göre kolaydan zora), sonra kazanılmayanlar (zorluk skoruna göre kolaydan zora)
        badgesWithUnlockInfo.sort((a, b) => {
            if (a.isUnlocked && b.isUnlocked) {
                // Her ikisi de kazanılmış: zorluk skoruna göre (kolaydan zora)
                return a.difficultyScore - b.difficultyScore;
            } else if (a.isUnlocked && !b.isUnlocked) {
                // A kazanılmış, B kazanılmamış: A önce
                return -1;
            } else if (!a.isUnlocked && b.isUnlocked) {
                // A kazanılmamış, B kazanılmış: B önce
                return 1;
            } else {
                // Her ikisi de kazanılmamış: zorluk skoruna göre (kolaydan zora)
                return a.difficultyScore - b.difficultyScore;
            }
        });
        
        badgesWithUnlockInfo.forEach(({badge, isUnlocked}) => {
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
            
            // İlerleme çubuğu - sadece ilerleme varsa ve %100'den azsa göster
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
                ${isUnlocked ? '<div style="color: var(--accent-success); font-size: 0.75rem; margin-top: 0.25rem;">✓ Kazanıldı</div>' : ''}
            `;
            badgesGrid.appendChild(badgeItem);
            
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
    }
    
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
            let difficultyScore = 0;
            
            // Hasene gereksinimleri (logaritmik skorlama)
            if (desc.includes('hasene')) {
                const match = desc.match(/([\d,]+)\s*hasene/i);
                if (match) {
                    const points = parseInt(match[1].replace(/,/g, ''));
                    difficultyScore += Math.log10(points / 100) * 10 + 1;
                }
            }
            
            // Doğru cevap gereksinimleri
            if (desc.includes('sahih') || desc.includes('doğru')) {
                difficultyScore += 0.5; // İlk zafer = çok kolay
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
        
        // Başarımları zorluk skoruna göre sırala (kolaydan zora, kazanılanlar önce)
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
        
        // Sırala: Önce kazanılanlar (zorluk skoruna göre kolaydan zora), sonra kazanılmayanlar (zorluk skoruna göre kolaydan zora)
        achievementsWithUnlockInfo.sort((a, b) => {
            if (a.isUnlocked && b.isUnlocked) {
                // Her ikisi de kazanılmış: zorluk skoruna göre (kolaydan zora)
                return a.difficultyScore - b.difficultyScore;
            } else if (a.isUnlocked && !b.isUnlocked) {
                // A kazanılmış, B kazanılmamış: A önce
                return -1;
            } else if (!a.isUnlocked && b.isUnlocked) {
                // A kazanılmamış, B kazanılmış: B önce
                return 1;
            } else {
                // Her ikisi de kazanılmamış: zorluk skoruna göre (kolaydan zora)
                return a.difficultyScore - b.difficultyScore;
            }
        });
        
        achievementsWithUnlockInfo.forEach(({achievement, originalIndex, isUnlocked}) => {
            // Mevcut rozetlerden döngüsel olarak seç
            const badgeNumber = availableBadges[originalIndex % availableBadges.length];
            const badgeImage = `rozet${badgeNumber}.png`;
            
            const achievementItem = document.createElement('div');
            achievementItem.className = `achievement-item ${isUnlocked ? 'unlocked' : ''}`;
            // Sadece badges klasöründeki PNG rozetlerini kullan, fallback icon yok
            achievementItem.innerHTML = `
                <img src="assets/badges/${badgeImage}" alt="${achievement.name}" class="achievement-image">
                <div class="achievement-name">${achievement.name}</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary); margin-top: 2px; line-height: 1.2;">${achievement.description}</div>
            `;
            achievementsGrid.appendChild(achievementItem);
        });
    }
    
    openModal('badges-modal');
}

/**
 * Takvim modalını gösterir
 */
function showCalendarModal() {
    const calendarGrid = document.getElementById('calendar-grid');
    const calendarMonthYear = document.getElementById('calendar-month-year');
    
    if (calendarGrid) {
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
            const isPlayed = streakData.playDates.includes(dateStr);
            
            // Bu gün gelecek bir gün mü?
            const isFuture = date > today;
            
            // Seri kontrolü: Bugünden geriye doğru kesintisiz oynanan günler
            let isStreak = false;
            if (isPlayed && !isFuture && streakData.currentStreak > 0) {
                const daysDiff = getDaysDifference(date, today);
                // Bugünden geriye doğru seri uzunluğu kadar gün içinde mi?
                if (daysDiff >= 0 && daysDiff < streakData.currentStreak) {
                    // Kesintisiz kontrol: Bu günden bugüne kadar tüm günler oynanmış mı?
                    let allDaysPlayed = true;
                    for (let j = 0; j <= daysDiff; j++) {
                        const checkDate = new Date(today);
                        checkDate.setDate(checkDate.getDate() - j);
                        const checkDateStr = getLocalDateString(checkDate);
                        if (!streakData.playDates.includes(checkDateStr)) {
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
    }
    
    document.getElementById('calendar-current-streak').textContent = streakData.currentStreak + ' gün';
    document.getElementById('calendar-best-streak').textContent = streakData.bestStreak + ' gün';
    document.getElementById('calendar-total-days').textContent = streakData.totalPlayDays;
    
    openModal('calendar-modal');
}

/**
 * Günlük vazifeler modalını gösterir
 */
function showDailyTasksModal() {
    // Görevleri kontrol et ve yükle (eğer yüklenmemişse)
    checkDailyTasks();
    checkWeeklyTasks();
    
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
    
    const weeklyTasksStatus = document.getElementById('weekly-tasks-status');
    weeklyTasksStatus.innerHTML = `
        <p>Hafta: ${weeklyTasks.weekStart || 'Yok'} - ${weeklyTasks.weekEnd || 'Yok'}</p>
        <p>Tamamlanan: ${weeklyTasks.completedTasks.length} / ${weeklyTasks.tasks.length}</p>
    `;
    
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
            key === 'hasene_onboarding_seen_v2') {
            keysToRemove.push(key);
        }
    });
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
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
    unlockedAchievements = [];
    unlockedBadges = [];
    perfectLessonsCount = 0;
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
    
    // Rozet modalını yenile (eğer açıksa)
    if (document.getElementById('badges-modal') && document.getElementById('badges-modal').style.display !== 'none') {
        showBadgesModal();
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
    
    // İstatistikleri yükle
    await loadStats();
    
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

// Hem DOMContentLoaded hem de load event'lerinde çalıştır
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncDifficultyFromHTML);
} else {
    // DOM zaten yüklüyse hemen çalıştır
    syncDifficultyFromHTML();
}

// window.load event'inde de çalıştır (tüm kaynaklar yüklendikten sonra)
window.addEventListener('load', syncDifficultyFromHTML);

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
            showStatsModal();
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
    window.claimWeeklyRewards = claimWeeklyRewards;
    window.setCustomGoal = setCustomGoal;
    window.resetAllStats = resetAllStats;
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

