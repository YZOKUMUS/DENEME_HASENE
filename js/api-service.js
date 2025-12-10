// ============================================
// API SERVICE - Backend Entegrasyonu
// ============================================

// Backend seçeneği: 'supabase', 'firebase', 'mongodb'
const BACKEND_TYPE = window.BACKEND_TYPE || 'supabase';

// API Base URL
const API_BASE_URL = window.VITE_API_URL || 'https://your-api.vercel.app';

// ============================================
// SUPABASE BACKEND
// ============================================

let supabaseClient = null;

// Supabase client'ı başlat
function initSupabase() {
    if (BACKEND_TYPE === 'supabase') {
        try {
            // Environment variables'dan al (Vite için)
            // Vite build sisteminde import.meta.env kullanılır
            // Normal HTML'de window.VITE_* veya script tag'den alınır
            let supabaseUrl = 'https://ldsudrqanyjqisdunikn.supabase.co';
            let supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxkc3VkcnFhbnlqcWlzZHVuaWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNDQyNTYsImV4cCI6MjA4MDkyMDI1Nn0.7WeCQLykP60XWQyT0D8jaoIcDvcYpDw_ET9AccyQUO4';
            
            // Önce window'dan kontrol et (script tag ile eklenmişse)
            if (window.VITE_SUPABASE_URL) supabaseUrl = window.VITE_SUPABASE_URL;
            if (window.VITE_SUPABASE_ANON_KEY) supabaseKey = window.VITE_SUPABASE_ANON_KEY;
            
            // Vite build için import.meta.env desteği (şu an kullanılmıyor, normal HTML için)
            // Normal HTML'de import.meta çalışmaz, bu yüzden window.VITE_* kullanıyoruz
            
            // localStorage'dan kontrol et (fallback)
            if (localStorage.getItem('supabase_url')) {
                supabaseUrl = localStorage.getItem('supabase_url');
            }
            if (localStorage.getItem('supabase_key')) {
                supabaseKey = localStorage.getItem('supabase_key');
            }
            
            if (supabaseUrl && supabaseKey && typeof window.supabase !== 'undefined') {
                const { createClient } = window.supabase;
                supabaseClient = createClient(supabaseUrl, supabaseKey);
                console.log('✅ Supabase client başlatıldı:', supabaseUrl);
                return true;
            } else if (!supabaseUrl || !supabaseKey) {
                console.warn('⚠️ Supabase URL veya Key bulunamadı. localStorage kullanılacak.');
                return false;
            } else {
                console.warn('⚠️ Supabase script yüklenmedi. Sayfa yenilendiğinde tekrar deneyin.');
                return false;
            }
        } catch (error) {
            console.error('❌ Supabase başlatma hatası:', error);
            return false;
        }
    }
    return false;
}

// Sayfa yüklendiğinde başlat
if (typeof window !== 'undefined') {
    // Supabase script yüklendikten sonra başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initSupabase, 100); // Script'in yüklenmesini bekle
        });
    } else {
        setTimeout(initSupabase, 100);
    }
}

// ============================================
// AUTHENTICATION
// ============================================

/**
 * Kullanıcı kaydı
 */
async function registerUser(email, password, username = null) {
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        // Not: autoConfirm client-side'da çalışmaz, Supabase Dashboard'dan kapatılmalı
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: { username: username || email.split('@')[0] },
                emailRedirectTo: window.location.origin + window.location.pathname
            }
        });
        
        if (error) throw error;
        
        // Profil oluştur (email confirmation beklenmeden)
        if (data.user) {
            try {
                await supabaseClient.from('profiles').upsert({
                    id: data.user.id,
                    username: username || email.split('@')[0]
                }, {
                    onConflict: 'id'
                });
                
                // İlk istatistikleri oluştur
                await supabaseClient.from('user_stats').upsert({
                    user_id: data.user.id,
                    total_points: 0,
                    badges: { stars: 0, bronze: 0, silver: 0, gold: 0, diamond: 0 },
                    streak_data: { currentStreak: 0, bestStreak: 0, totalPlayDays: 0 },
                    game_stats: { totalCorrect: 0, totalWrong: 0, gameModeCounts: {} },
                    perfect_lessons_count: 0
                }, {
                    onConflict: 'user_id'
                });
            } catch (profileError) {
                console.warn('Profil oluşturma hatası (normal olabilir):', profileError);
            }
        }
        
        return data;
    }
    
    // Fallback: localStorage (offline mode)
    console.warn('Backend not available, using localStorage');
    localStorage.setItem('hasene_user_email', email);
    return { user: { id: 'local-' + Date.now() } };
}

/**
 * Kullanıcı girişi
 */
async function loginUser(email, password) {
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) {
            // Email confirmation hatası için özel mesaj
            if (error.message && error.message.includes('Email not confirmed')) {
                throw new Error('Email not confirmed. Please confirm your email from Supabase Dashboard: Authentication > Users > [Your User] > Confirm email checkbox. Or register a new account.');
            }
            throw error;
        }
        return data;
    }
    
    // Fallback: localStorage
    console.warn('Backend not available, using localStorage');
    localStorage.setItem('hasene_user_email', email);
    return { user: { id: 'local-' + Date.now() } };
}

/**
 * Google ile giriş
 */
async function loginWithGoogle() {
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + window.location.pathname
            }
        });
        
        if (error) throw error;
        return data;
    }
    
    throw new Error('Google login not available');
}

/**
 * GitHub ile giriş
 */
async function loginWithGitHub() {
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: window.location.origin + window.location.pathname
            }
        });
        
        if (error) throw error;
        return data;
    }
    
    throw new Error('GitHub login not available');
}

/**
 * Çıkış yap
 */
async function logoutUser() {
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        await supabaseClient.auth.signOut();
    }
    
    localStorage.removeItem('hasene_user_email');
}

/**
 * Mevcut kullanıcıyı al
 */
async function getCurrentUser() {
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        try {
            // Önce session'ı kontrol et (localStorage'dan hızlı)
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session && session.user) {
                return session.user;
            }
            
            // Session yoksa server'dan kontrol et
            const { data: { user }, error } = await supabaseClient.auth.getUser();
            if (error) {
                console.warn('getUser hatası:', error);
                return null;
            }
            return user;
        } catch (error) {
            console.warn('getCurrentUser hatası:', error);
            return null;
        }
    }
    
    // Fallback: localStorage
    const email = localStorage.getItem('hasene_user_email');
    if (email) {
        return { id: 'local-' + Date.now(), email };
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
    const user = await getCurrentUser();
    if (!user) return null;
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { data, error } = await supabaseClient
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
        
        return data || {
            total_points: 0,
            badges: { stars: 0, bronze: 0, silver: 0, gold: 0, diamond: 0 },
            streak_data: { currentStreak: 0, bestStreak: 0, totalPlayDays: 0 },
            game_stats: { totalCorrect: 0, totalWrong: 0, gameModeCounts: {} },
            perfect_lessons_count: 0
        };
    }
    
    // Fallback: localStorage
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
    const user = await getCurrentUser();
    if (!user) {
        console.warn('No user logged in, saving to localStorage');
        // Fallback: localStorage
        localStorage.setItem('hasene_totalPoints', stats.total_points.toString());
        localStorage.setItem('hasene_badges', JSON.stringify(stats.badges));
        localStorage.setItem('hasene_streakData', JSON.stringify(stats.streak_data));
        localStorage.setItem('hasene_gameStats', JSON.stringify(stats.game_stats));
        localStorage.setItem('perfectLessonsCount', stats.perfect_lessons_count.toString());
        return;
    }
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { error } = await supabaseClient
            .from('user_stats')
            .upsert({
                user_id: user.id,
                total_points: stats.total_points,
                badges: stats.badges,
                streak_data: stats.streak_data,
                game_stats: stats.game_stats,
                perfect_lessons_count: stats.perfect_lessons_count,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id'
            });
        
        if (error) throw error;
        return;
    }
    
    // Fallback: localStorage
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
    const user = await getCurrentUser();
    if (!user) return null;
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { data, error } = await supabaseClient
            .from('daily_tasks')
            .select('*')
            .eq('user_id', user.id)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
            // Set'leri geri yükle
            if (data.today_stats) {
                data.today_stats.allGameModes = new Set(data.today_stats.allGameModes || []);
                data.today_stats.farklıZorluk = new Set(data.today_stats.farklıZorluk || []);
                data.today_stats.reviewWords = new Set(data.today_stats.reviewWords || []);
            }
        }
        
        return data;
    }
    
    // Fallback: localStorage
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
    const user = await getCurrentUser();
    if (!user) {
        // Fallback: localStorage
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
        return;
    }
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { error } = await supabaseClient
            .from('daily_tasks')
            .upsert({
                user_id: user.id,
                last_task_date: tasks.lastTaskDate,
                tasks: tasks.tasks,
                bonus_tasks: tasks.bonusTasks,
                completed_tasks: tasks.completedTasks,
                today_stats: {
                    ...tasks.todayStats,
                    allGameModes: Array.from(tasks.todayStats.allGameModes || []),
                    farklıZorluk: Array.from(tasks.todayStats.farklıZorluk || []),
                    reviewWords: Array.from(tasks.todayStats.reviewWords || [])
                },
                rewards_claimed: tasks.rewardsClaimed,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id'
            });
        
        if (error) throw error;
        return;
    }
    
    // Fallback: localStorage
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
    const user = await getCurrentUser();
    if (!user) return null;
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { data, error } = await supabaseClient
            .from('weekly_tasks')
            .select('*')
            .eq('user_id', user.id)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        
        if (data && data.week_stats) {
            data.week_stats.allModesPlayed = new Set(data.week_stats.allModesPlayed || []);
        }
        
        return data;
    }
    
    // Fallback: localStorage
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
    const user = await getCurrentUser();
    if (!user) {
        // Fallback: localStorage
        const toSave = {
            ...tasks,
            weekStats: {
                ...tasks.weekStats,
                allModesPlayed: Array.from(tasks.weekStats.allModesPlayed || [])
            }
        };
        localStorage.setItem('hasene_weeklyTasks', JSON.stringify(toSave));
        return;
    }
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { error } = await supabaseClient
            .from('weekly_tasks')
            .upsert({
                user_id: user.id,
                last_week_start: tasks.lastWeekStart,
                week_start: tasks.weekStart,
                week_end: tasks.weekEnd,
                tasks: tasks.tasks,
                completed_tasks: tasks.completedTasks,
                week_stats: {
                    ...tasks.weekStats,
                    allModesPlayed: Array.from(tasks.weekStats.allModesPlayed || [])
                },
                rewards_claimed: tasks.rewardsClaimed,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id'
            });
        
        if (error) throw error;
        return;
    }
    
    // Fallback: localStorage
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
    const user = await getCurrentUser();
    if (!user) return {};
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { data, error } = await supabaseClient
            .from('word_stats')
            .select('word_id, stats')
            .eq('user_id', user.id);
        
        if (error) throw error;
        
        const stats = {};
        data.forEach(item => {
            stats[item.word_id] = item.stats;
        });
        
        return stats;
    }
    
    // Fallback: localStorage
    return JSON.parse(localStorage.getItem('hasene_wordStats') || '{}');
}

/**
 * Kelime istatistiğini kaydet
 */
async function saveWordStat(wordId, stats) {
    const user = await getCurrentUser();
    if (!user) {
        // Fallback: localStorage
        const allStats = JSON.parse(localStorage.getItem('hasene_wordStats') || '{}');
        allStats[wordId] = stats;
        localStorage.setItem('hasene_wordStats', JSON.stringify(allStats));
        return;
    }
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { error } = await supabaseClient
            .from('word_stats')
            .upsert({
                user_id: user.id,
                word_id: wordId,
                stats: stats,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,word_id'
            });
        
        if (error) throw error;
        return;
    }
    
    // Fallback: localStorage
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
    const user = await getCurrentUser();
    if (!user) return [];
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { data, error } = await supabaseClient
            .from('favorite_words')
            .select('word_id')
            .eq('user_id', user.id);
        
        if (error) throw error;
        return data.map(item => item.word_id);
    }
    
    // Fallback: localStorage
    return JSON.parse(localStorage.getItem('hasene_favorites') || '[]');
}

/**
 * Favori kelime ekle
 */
async function addFavorite(wordId) {
    const user = await getCurrentUser();
    if (!user) {
        // Fallback: localStorage
        const favorites = JSON.parse(localStorage.getItem('hasene_favorites') || '[]');
        if (!favorites.includes(wordId)) {
            favorites.push(wordId);
            localStorage.setItem('hasene_favorites', JSON.stringify(favorites));
        }
        return;
    }
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { error } = await supabaseClient
            .from('favorite_words')
            .insert({
                user_id: user.id,
                word_id: wordId
            });
        
        if (error && error.code !== '23505') throw error; // 23505 = duplicate
        return;
    }
    
    // Fallback: localStorage
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
    const user = await getCurrentUser();
    if (!user) {
        // Fallback: localStorage
        const favorites = JSON.parse(localStorage.getItem('hasene_favorites') || '[]');
        const filtered = favorites.filter(id => id !== wordId);
        localStorage.setItem('hasene_favorites', JSON.stringify(filtered));
        return;
    }
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { error } = await supabaseClient
            .from('favorite_words')
            .delete()
            .eq('user_id', user.id)
            .eq('word_id', wordId);
        
        if (error) throw error;
        return;
    }
    
    // Fallback: localStorage
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
    const user = await getCurrentUser();
    if (!user) {
        // Fallback: localStorage
        localStorage.setItem(`hasene_daily_${date}`, JSON.stringify(stats));
        return;
    }
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { error } = await supabaseClient
            .from('daily_stats')
            .upsert({
                user_id: user.id,
                date: date,
                stats: stats,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,date'
            });
        
        if (error) throw error;
        return;
    }
    
    // Fallback: localStorage
    localStorage.setItem(`hasene_daily_${date}`, JSON.stringify(stats));
}

/**
 * Günlük istatistikleri yükle
 */
async function loadDailyStat(date) {
    const user = await getCurrentUser();
    if (!user) {
        // Fallback: localStorage
        const saved = localStorage.getItem(`hasene_daily_${date}`);
        return saved ? JSON.parse(saved) : null;
    }
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { data, error } = await supabaseClient
            .from('daily_stats')
            .select('stats')
            .eq('user_id', user.id)
            .eq('date', date)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data ? data.stats : null;
    }
    
    // Fallback: localStorage
    const saved = localStorage.getItem(`hasene_daily_${date}`);
    return saved ? JSON.parse(saved) : null;
}

// ============================================
// LEADERBOARD API
// ============================================

/**
 * Liderlik tablosunu yükle
 */
async function loadLeaderboard(limit = 100) {
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { data, error } = await supabaseClient
            .from('leaderboard')
            .select('*')
            .limit(limit);
        
        if (error) throw error;
        return data;
    }
    
    // Fallback: Boş array
    return [];
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
    window.loadDailyStat = loadDailyStat;
    window.loadLeaderboard = loadLeaderboard;
}

