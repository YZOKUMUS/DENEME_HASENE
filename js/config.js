// ============================================
// CONFIG - Yapılandırma ve Debug Ayarları
// ============================================

const CONFIG = {
    // Debug Mode
    DEBUG: false,
    
    // Logging
    LOG_LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
    GAME_DEBUG: true, // Oyun adımları için detaylı log (test için)
    
    // Performance
    DEBOUNCE_DELAY: 500, // ms
    LAZY_LOAD_DELAY: 100, // ms
    
    // Game Settings
    QUESTIONS_PER_GAME: 10,
    TIME_LIMIT_PER_QUESTION: 0, // Zaman limiti kaldırıldı
    LIVES_COUNT: 3, // for 3lives mode
    
    // Points - DOĞRU SAYISI VE DERS SAYISINA ENDEKSLİ
    POINTS_CORRECT: 10, // Her doğru cevap için 10 Hasene
    POINTS_WRONG: 0, // Yanlış cevap için puan kaybı yok
    COMBO_BONUS_PER_CORRECT: 2, // Her doğru cevap için 2 Hasene combo bonusu (doğru sayısına endeksli)
    PERFECT_LESSON_BONUS_PER_GAME: 50, // Her mükemmel ders için 50 Hasene bonus (ders sayısına endeksli, minimum 3 soru)
    
    // Daily Goal Defaults
    DAILY_GOAL_DEFAULT: 2700,
    DAILY_GOAL_LEVELS: {
        easy: 1300,
        normal: 2700,
        hard: 5400,
        serious: 6000
    },
    
    // Streak
    DAILY_GOAL_CORRECT: 5, // minimum correct answers to maintain streak
    
    // Storage
    STORAGE_PREFIX: 'hasene_',
    INDEXEDDB_NAME: 'HaseneGameDB',
    INDEXEDDB_VERSION: 1,
    
    // API/Data
    DATA_PATH: './data/',
    
    // Notifications
    NOTIFICATIONS_ENABLED: true,
    DAILY_REMINDER_TIME: '09:00',
    TASK_REMINDER_TIME: '22:00'
};

// Debug logging function
function debugLog(...args) {
    if (CONFIG.DEBUG || CONFIG.LOG_LEVEL === 'debug') {
        console.log('[DEBUG]', ...args);
    }
}

function infoLog(...args) {
    if (['debug', 'info'].includes(CONFIG.LOG_LEVEL)) {
        console.log('[INFO]', ...args);
    }
}

// Oyun adımları için özel log fonksiyonu
function gameLog(step, data = {}) {
    if (CONFIG.GAME_DEBUG || CONFIG.DEBUG) {
        const timestamp = new Date().toLocaleTimeString('tr-TR');
        console.log(`[GAME ${timestamp}] ${step}`, data);
    }
}

function warnLog(...args) {
    if (['debug', 'info', 'warn'].includes(CONFIG.LOG_LEVEL)) {
        console.warn('[WARN]', ...args);
    }
}

function errorLog(...args) {
    console.error('[ERROR]', ...args);
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    window.debugLog = debugLog;
    window.infoLog = infoLog;
    window.warnLog = warnLog;
    window.errorLog = errorLog;
    window.gameLog = gameLog;
    
    // Debug modunu açıp kapatmak için global fonksiyon
    window.toggleGameDebug = function() {
        CONFIG.GAME_DEBUG = !CONFIG.GAME_DEBUG;
        console.log(`[DEBUG] Oyun log modu: ${CONFIG.GAME_DEBUG ? 'AÇIK' : 'KAPALI'}`);
        return CONFIG.GAME_DEBUG;
    };
}

