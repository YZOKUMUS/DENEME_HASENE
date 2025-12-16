// ============================================
// API SERVICE - LocalStorage Only
// ============================================

// ============================================
// AUTHENTICATION
// ============================================

/**
 * Kullanıcı kaydı
 */
async function registerUser(email, password, username = null) {
    // localStorage only
    localStorage.setItem('hasene_user_email', email);
    if (username) {
        localStorage.setItem('hasene_username', username);
    }
    return { user: { id: 'local-' + Date.now(), email, username: username || email.split('@')[0] } };
}

/**
 * Kullanıcı girişi
 */
async function loginUser(email, password) {
    // localStorage only
    localStorage.setItem('hasene_user_email', email);
    return { user: { id: 'local-' + Date.now(), email } };
}

/**
 * Google ile giriş
 */
async function loginWithGoogle() {
    throw new Error('Google login not available - backend removed');
}

/**
 * GitHub ile giriş
 */
async function loginWithGitHub() {
    throw new Error('GitHub login not available - backend removed');
}

/**
 * Çıkış yap
 */
async function logoutUser() {
    localStorage.removeItem('hasene_user_email');
    localStorage.removeItem('hasene_username');
}

/**
 * Mevcut kullanıcıyı al
 */
async function getCurrentUser() {
    const email = localStorage.getItem('hasene_user_email');
    if (email) {
        const username = localStorage.getItem('hasene_username');
        return { id: 'local-' + Date.now(), email, username: username || email.split('@')[0] };
    }
    return null;
}

// ============================================
// USER STATS API
// ============================================

/**
 * Kullanıcı istatistiklerini yükle
 */
async function loadUserStats() {
    return {
        total_points: parseInt(localStorage.getItem('hasene_totalPoints') || '0'),
        badges: JSON.parse(localStorage.getItem('hasene_badges') || '{"stars":0,"bronze":0,"silver":0,"gold":0,"diamond":0}'),
        streak_data: JSON.parse(localStorage.getItem('hasene_streakData') || '{"currentStreak":0,"bestStreak":0,"totalPlayDays":0}'),
        game_stats: JSON.parse(localStorage.getItem('hasene_gameStats') || '{"totalCorrect":0,"totalWrong":0,"gameModeCounts":{}}'),
        perfect_lessons_count: parseInt(localStorage.getItem('perfectLessonsCount') || '0')
    };
}

/**
 * Kullanıcı istatistiklerini kaydet
 */
async function saveUserStats(stats) {
    localStorage.setItem('hasene_totalPoints', stats.total_points.toString());
    localStorage.setItem('hasene_badges', JSON.stringify(stats.badges));
    localStorage.setItem('hasene_streakData', JSON.stringify(stats.streak_data));
    localStorage.setItem('hasene_gameStats', JSON.stringify(stats.game_stats));
    localStorage.setItem('perfectLessonsCount', stats.perfect_lessons_count.toString());
}

// ============================================
// TASKS API
// ============================================

/**
 * Günlük görevleri yükle
 */
async function loadDailyTasks() {
    const saved = localStorage.getItem('hasene_dailyTasks');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.todayStats) {
            data.todayStats.allGameModes = new Set(data.todayStats.allGameModes || []);
            data.todayStats.farklıZorluk = new Set(data.todayStats.farklıZorluk || []);
            data.todayStats.reviewWords = new Set(data.todayStats.reviewWords || []);
        }
        return data;
    }
    return null;
}

/**
 * Günlük görevleri kaydet
 */
async function saveDailyTasks(tasks) {
    const toSave = {
        ...tasks,
        todayStats: {
            ...tasks.todayStats,
            allGameModes: Array.from(tasks.todayStats.allGameModes || []),
            farklıZorluk: Array.from(tasks.todayStats.farklıZorluk || []),
            reviewWords: Array.from(tasks.todayStats.reviewWords || [])
        }
    };
    localStorage.setItem('hasene_dailyTasks', JSON.stringify(toSave));
}

/**
 * Haftalık görevleri yükle
 */
async function loadWeeklyTasks() {
    const saved = localStorage.getItem('hasene_weeklyTasks');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.weekStats) {
            data.weekStats.allModesPlayed = new Set(data.weekStats.allModesPlayed || []);
        }
        return data;
    }
    return null;
}

/**
 * Haftalık görevleri kaydet
 */
async function saveWeeklyTasks(tasks) {
    const toSave = {
        ...tasks,
        weekStats: {
            ...tasks.weekStats,
            allModesPlayed: Array.from(tasks.weekStats.allModesPlayed || [])
        }
    };
    localStorage.setItem('hasene_weeklyTasks', JSON.stringify(toSave));
}

// ============================================
// WORD STATS API
// ============================================

/**
 * Kelime istatistiklerini yükle
 */
async function loadWordStats() {
    return JSON.parse(localStorage.getItem('hasene_wordStats') || '{}');
}

/**
 * Kelime istatistiğini kaydet
 */
async function saveWordStat(wordId, stats) {
    const allStats = JSON.parse(localStorage.getItem('hasene_wordStats') || '{}');
    allStats[wordId] = stats;
    localStorage.setItem('hasene_wordStats', JSON.stringify(allStats));
}

// ============================================
// FAVORITES API
// ============================================

/**
 * Favori kelimeleri yükle
 */
async function loadFavorites() {
    return JSON.parse(localStorage.getItem('hasene_favorites') || '[]');
}

/**
 * Favori kelime ekle
 */
async function addFavorite(wordId) {
    const favorites = JSON.parse(localStorage.getItem('hasene_favorites') || '[]');
    if (!favorites.includes(wordId)) {
        favorites.push(wordId);
        localStorage.setItem('hasene_favorites', JSON.stringify(favorites));
    }
}

/**
 * Favori kelimeyi kaldır
 */
async function removeFavorite(wordId) {
    const favorites = JSON.parse(localStorage.getItem('hasene_favorites') || '[]');
    const filtered = favorites.filter(id => id !== wordId);
    localStorage.setItem('hasene_favorites', JSON.stringify(filtered));
}

// ============================================
// DETAILED STATS API
// ============================================

/**
 * Günlük istatistikleri kaydet
 */
async function saveDailyStat(date, stats) {
    localStorage.setItem(`hasene_daily_${date}`, JSON.stringify(stats));
}

/**
 * Haftalık istatistikleri kaydet
 */
async function saveWeeklyStat(weekStart, stats) {
    localStorage.setItem(`hasene_weekly_${weekStart}`, JSON.stringify(stats));
}

/**
 * Aylık istatistikleri kaydet
 */
async function saveMonthlyStat(month, stats) {
    localStorage.setItem(`hasene_monthly_${month}`, JSON.stringify(stats));
}

/**
 * Günlük istatistikleri yükle
 */
async function loadDailyStat(date) {
    const saved = localStorage.getItem(`hasene_daily_${date}`);
    return saved ? JSON.parse(saved) : null;
}

/**
 * Haftalık istatistikleri yükle
 */
async function loadWeeklyStat(weekStart) {
    const saved = localStorage.getItem(`hasene_weekly_${weekStart}`);
    return saved ? JSON.parse(saved) : null;
}

/**
 * Aylık istatistikleri yükle
 */
async function loadMonthlyStat(month) {
    const saved = localStorage.getItem(`hasene_monthly_${month}`);
    return saved ? JSON.parse(saved) : null;
}

/**
 * Tüm daily_stats tarihlerini yükle (takvim için playDates oluşturmak için)
 */
async function loadAllDailyStatsDates() {
    const dates = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('hasene_daily_') && key !== 'hasene_dailyTasks') {
            const date = key.replace('hasene_daily_', '');
            if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                dates.push(date);
            }
        }
    }
    return dates.sort().reverse();
}

// ============================================
// ACHIEVEMENTS API
// ============================================

/**
 * Achievements yükle
 */
async function loadAchievements() {
    return JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
}

/**
 * Achievement kaydet
 */
async function saveAchievement(achievementId) {
    const achievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
    const exists = achievements.some(a => {
        if (typeof a === 'string') return a === achievementId;
        return a.id === achievementId;
    });
    if (!exists) {
        achievements.push({ id: achievementId, unlockedAt: Date.now() });
        localStorage.setItem('unlockedAchievements', JSON.stringify(achievements));
    }
}

// ============================================
// BADGES API
// ============================================

/**
 * Badges yükle
 */
async function loadBadges() {
    return JSON.parse(localStorage.getItem('unlockedBadges') || '[]');
}

/**
 * Badge kaydet
 */
async function saveBadge(badgeId) {
    const badges = JSON.parse(localStorage.getItem('unlockedBadges') || '[]');
    const exists = badges.some(b => {
        if (typeof b === 'string') return b === badgeId;
        return b.id === badgeId;
    });
    if (!exists) {
        badges.push({ id: badgeId, unlockedAt: Date.now() });
        localStorage.setItem('unlockedBadges', JSON.stringify(badges));
    }
}

// ============================================
// LEADERBOARD API
// ============================================

/**
 * Liderlik tablosunu yükle
 */
async function loadLeaderboard(limit = 100) {
    return [];
}

// ============================================
// WEEKLY LEADERBOARD API
// ============================================

/**
 * Hafta başlangıcını hesapla (Pazartesi)
 */
function getWeekStart(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Pazartesi
    const weekStart = new Date(d.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
}

/**
 * Hafta bitişini hesapla (Pazar)
 */
function getWeekEnd(weekStart) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return weekEnd;
}

/**
 * Haftalık XP güncelle
 */
async function updateWeeklyXP(points) {
    // localStorage only - no backend
    const weekStart = getWeekStart();
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const key = `hasene_weekly_xp_${weekStartStr}`;
    const currentXP = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, (currentXP + points).toString());
}

/**
 * Kullanıcının lig bilgilerini getir
 */
async function getLeagueInfo(userId = null) {
    return null;
}

/**
 * Ligdeki sıralamayı getir
 */
async function getLeagueRankings(leagueName, limit = 50) {
    return [];
}

/**
 * Kullanıcının lig pozisyonu
 */
async function getUserLeaguePosition(userId = null) {
    return null;
}

/**
 * Lig config bilgilerini getir
 */
async function getLeagueConfig(leagueName) {
    // Fallback: Hardcoded config
    const configs = {
        'mubtedi': { icon: '📖', display_name: 'Mübtedi', arabic_name: 'مبتدئ', color: '#8B4513' },
        'talib': { icon: '📚', display_name: 'Talib', arabic_name: 'طالب', color: '#CD7F32' },
        'mutavassit': { icon: '📘', display_name: 'Mutavassıt', arabic_name: 'متوسط', color: '#4682B4' },
        'mutebahhir': { icon: '📗', display_name: 'Mütebahhir', arabic_name: 'متبحر', color: '#228B22' },
        'hafiz': { icon: '📙', display_name: 'Hafız', arabic_name: 'حافظ', color: '#FFD700' },
        'kurra': { icon: '📕', display_name: 'Kurra', arabic_name: 'قراء', color: '#DC143C' },
        'alim': { icon: '📓', display_name: 'Alim', arabic_name: 'عالم', color: '#4B0082' },
        'mujtahid': { icon: '📔', display_name: 'Müctehid', arabic_name: 'مجتهد', color: '#4169E1' },
        'muhaddis': { icon: '📖', display_name: 'Muhaddis', arabic_name: 'محدث', color: '#000080' },
        'faqih': { icon: '📗', display_name: 'Fakih', arabic_name: 'فقيه', color: '#006400' },
        'imam': { icon: '📘', display_name: 'İmam', arabic_name: 'إمام', color: '#8B008B' },
        'ulama': { icon: '✨', display_name: 'Ulema', arabic_name: 'علماء', color: '#FFD700' }
    };
    return configs[leagueName] || configs['mubtedi'];
}

// ============================================
// EXPORT
// ============================================

if (typeof window !== 'undefined') {
    window.registerUser = registerUser;
    window.loginUser = loginUser;
    window.loginWithGoogle = loginWithGoogle;
    window.loginWithGitHub = loginWithGitHub;
    window.logoutUser = logoutUser;
    window.getCurrentUser = getCurrentUser;
    window.loadUserStats = loadUserStats;
    window.saveUserStats = saveUserStats;
    window.loadDailyTasks = loadDailyTasks;
    window.saveDailyTasks = saveDailyTasks;
    window.loadWeeklyTasks = loadWeeklyTasks;
    window.saveWeeklyTasks = saveWeeklyTasks;
    window.loadWordStats = loadWordStats;
    window.saveWordStat = saveWordStat;
    window.loadFavorites = loadFavorites;
    window.addFavorite = addFavorite;
    window.removeFavorite = removeFavorite;
    window.saveDailyStat = saveDailyStat;
    window.saveWeeklyStat = saveWeeklyStat;
    window.saveMonthlyStat = saveMonthlyStat;
    window.loadDailyStat = loadDailyStat;
    window.loadWeeklyStat = loadWeeklyStat;
    window.loadMonthlyStat = loadMonthlyStat;
    window.loadAllDailyStatsDates = loadAllDailyStatsDates;
    window.loadLeaderboard = loadLeaderboard;
    window.loadAchievements = loadAchievements;
    window.saveAchievement = saveAchievement;
    window.loadBadges = loadBadges;
    window.saveBadge = saveBadge;
    
    // Weekly Leaderboard API
    window.getWeekStart = getWeekStart;
    window.getWeekEnd = getWeekEnd;
    window.updateWeeklyXP = updateWeeklyXP;
    window.getLeagueInfo = getLeagueInfo;
    window.getLeagueRankings = getLeagueRankings;
    window.getUserLeaguePosition = getUserLeaguePosition;
    window.getLeagueConfig = getLeagueConfig;
}
