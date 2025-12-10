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
        // GitHub Pages URL'ini kullan (production)
        const redirectUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? window.location.origin + window.location.pathname
            : 'https://yzokumus.github.io/DENEME_HASENE';
        
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl
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
        // GitHub Pages URL'ini kullan (production)
        const redirectUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? window.location.origin + window.location.pathname
            : 'https://yzokumus.github.io/DENEME_HASENE';
        
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: redirectUrl
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
            // Önce session'ı kontrol et
            const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
            
            // Session yoksa direkt null döndür (getUser() çağırma)
            if (sessionError || !session || !session.user) {
                // Session yok, localStorage'ı temizle
                localStorage.removeItem('hasene_user_email');
                return null;
            }
            
            // Session varsa user'ı döndür
            if (session.user.email) {
                localStorage.setItem('hasene_user_email', session.user.email);
            }
            
            // Username'i profiles tablosundan al
            try {
                const { data: profile } = await supabaseClient
                    .from('profiles')
                    .select('username')
                    .eq('id', session.user.id)
                    .maybeSingle();
                
                if (profile && profile.username) {
                    return { ...session.user, username: profile.username };
                }
            } catch (profileError) {
                // Profile hatası kritik değil, devam et
                console.warn('Profile yükleme hatası (normal olabilir):', profileError);
            }
            
            return session.user;
        } catch (error) {
            // Hata durumunda sessizce null döndür (console spam'ini önle)
            if (error.message && !error.message.includes('Auth session missing')) {
                console.warn('getCurrentUser hatası:', error);
            }
            localStorage.removeItem('hasene_user_email');
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
// ACHIEVEMENTS API
// ============================================

/**
 * Achievements yükle
 */
async function loadAchievements() {
    const user = await getCurrentUser();
    if (!user) {
        // Fallback: localStorage
        return JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
    }
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { data, error } = await supabaseClient
            .from('achievements')
            .select('achievement_id, unlocked_at')
            .eq('user_id', user.id);
        
        if (error) throw error;
        
        // Format: [{id: string, unlockedAt: number}, ...]
        return (data || []).map(a => ({
            id: a.achievement_id,
            unlockedAt: new Date(a.unlocked_at).getTime()
        }));
    }
    
    // Fallback: localStorage
    return JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
}

/**
 * Achievement kaydet
 */
async function saveAchievement(achievementId) {
    const user = await getCurrentUser();
    if (!user) {
        // Fallback: localStorage
        const achievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
        const exists = achievements.some(a => {
            if (typeof a === 'string') return a === achievementId;
            return a.id === achievementId;
        });
        if (!exists) {
            achievements.push({ id: achievementId, unlockedAt: Date.now() });
            localStorage.setItem('unlockedAchievements', JSON.stringify(achievements));
        }
        return;
    }
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { error } = await supabaseClient
            .from('achievements')
            .upsert({
                user_id: user.id,
                achievement_id: achievementId,
                unlocked_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,achievement_id'
            });
        
        if (error) throw error;
        return;
    }
    
    // Fallback: localStorage
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
 * Badges yükle (ayrı tablo - user_stats.badges ile karıştırma)
 */
async function loadBadges() {
    const user = await getCurrentUser();
    if (!user) {
        // Fallback: localStorage
        return JSON.parse(localStorage.getItem('unlockedBadges') || '[]');
    }
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { data, error } = await supabaseClient
            .from('badges')
            .select('badge_id, unlocked_at')
            .eq('user_id', user.id);
        
        if (error) throw error;
        
        // Format: [{id: string, unlockedAt: number}, ...]
        return (data || []).map(b => ({
            id: b.badge_id,
            unlockedAt: new Date(b.unlocked_at).getTime()
        }));
    }
    
    // Fallback: localStorage
    return JSON.parse(localStorage.getItem('unlockedBadges') || '[]');
}

/**
 * Badge kaydet
 */
async function saveBadge(badgeId) {
    const user = await getCurrentUser();
    if (!user) {
        // Fallback: localStorage
        const badges = JSON.parse(localStorage.getItem('unlockedBadges') || '[]');
        const exists = badges.some(b => {
            if (typeof b === 'string') return b === badgeId;
            return b.id === badgeId;
        });
        if (!exists) {
            badges.push({ id: badgeId, unlockedAt: Date.now() });
            localStorage.setItem('unlockedBadges', JSON.stringify(badges));
        }
        return;
    }
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { error } = await supabaseClient
            .from('badges')
            .upsert({
                user_id: user.id,
                badge_id: badgeId,
                unlocked_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,badge_id'
            });
        
        if (error) throw error;
        return;
    }
    
    // Fallback: localStorage
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
 * Liderlik tablosunu yükle (eski - genel)
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
// WEEKLY LEADERBOARD API (Duolingo Benzeri)
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
    const user = await getCurrentUser();
    if (!user) {
        console.warn('No user logged in, weekly XP not updated');
        return;
    }
    
    const weekStart = getWeekStart();
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        try {
            // Önce RPC fonksiyonunu dene
            const { error: rpcError } = await supabaseClient.rpc('increment_weekly_xp', {
                p_user_id: user.id,
                p_week_start: weekStartStr,
                p_points: points
            });
            
            if (rpcError) {
                // Fallback: Manual upsert
                const weekEnd = getWeekEnd(weekStart);
                const weekEndStr = weekEnd.toISOString().split('T')[0];
                
                // Mevcut kaydı kontrol et
                const { data: current } = await supabaseClient
                    .from('weekly_leaderboard')
                    .select('weekly_xp, league')
                    .eq('user_id', user.id)
                    .eq('week_start', weekStartStr)
                    .single();
                
                const currentXP = current?.weekly_xp || 0;
                const currentLeague = current?.league || 'mubtedi';
                
                // Upsert
                const { error: upsertError } = await supabaseClient
                    .from('weekly_leaderboard')
                    .upsert({
                        user_id: user.id,
                        week_start: weekStartStr,
                        week_end: weekEndStr,
                        weekly_xp: currentXP + points,
                        league: currentLeague,
                        updated_at: new Date().toISOString()
                    }, {
                        onConflict: 'user_id,week_start'
                    });
                
                if (upsertError) {
                    console.warn('Weekly XP upsert error:', upsertError);
                }
            }
        } catch (error) {
            console.warn('Weekly XP update error:', error);
        }
    }
}

/**
 * Kullanıcının lig bilgilerini getir
 */
async function getLeagueInfo(userId = null) {
    const user = userId || await getCurrentUser();
    if (!user) return null;
    
    const weekStart = getWeekStart();
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('weekly_leaderboard')
                .select(`
                    *,
                    user_leagues!inner(*)
                `)
                .eq('user_id', user.id)
                .eq('week_start', weekStartStr)
                .single();
            
            if (error && error.code !== 'PGRST116') {
                console.warn('Get league info error:', error);
                return null;
            }
            
            return data;
        } catch (error) {
            console.warn('Get league info error:', error);
            return null;
        }
    }
    
    return null;
}

/**
 * Ligdeki sıralamayı getir
 */
async function getLeagueRankings(leagueName, limit = 50) {
    const weekStart = getWeekStart();
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        try {
            // Önce view'ı dene
            const { data: viewData, error: viewError } = await supabaseClient
                .from('league_rankings')
                .select('*')
                .eq('league', leagueName)
                .eq('week_start', weekStartStr)
                .order('weekly_xp', { ascending: false })
                .limit(limit);
            
            if (!viewError && viewData) {
                return viewData;
            }
            
            // Fallback: Manuel join - önce weekly_leaderboard'dan al
            const { data: leaderboardData, error: lbError } = await supabaseClient
                .from('weekly_leaderboard')
                .select('user_id,weekly_xp')
                .eq('week_start', weekStartStr)
                .eq('league', leagueName)
                .order('weekly_xp', { ascending: false })
                .limit(limit);
            
            if (lbError || !leaderboardData || leaderboardData.length === 0) {
                if (lbError) console.warn('Get league rankings error:', lbError);
                return [];
            }
            
            // Username'leri profiles'den ayrı al
            const userIds = leaderboardData.map(item => item.user_id);
            const { data: profilesData } = await supabaseClient
                .from('profiles')
                .select('id,username')
                .in('id', userIds);
            
            const profilesMap = new Map();
            if (profilesData) {
                profilesData.forEach(p => {
                    profilesMap.set(p.id, p.username || 'Anonim');
                });
            }
            
            // Pozisyon ekle
            return leaderboardData.map((item, index) => ({
                user_id: item.user_id,
                weekly_xp: item.weekly_xp || 0,
                username: profilesMap.get(item.user_id) || 'Anonim',
                position: index + 1
            }));
        } catch (error) {
            console.warn('Get league rankings error:', error);
            return [];
        }
    }
    
    return [];
}

/**
 * Kullanıcının lig pozisyonu
 */
async function getUserLeaguePosition(userId = null) {
    const user = userId || await getCurrentUser();
    if (!user) return null;
    
    const weekStart = getWeekStart();
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        try {
            // Kullanıcının bilgileri
            const { data: userData, error: userError } = await supabaseClient
                .from('weekly_leaderboard')
                .select('league,weekly_xp')
                .eq('user_id', user.id)
                .eq('week_start', weekStartStr)
                .maybeSingle();
            
            if (userError) {
                console.error('getUserLeaguePosition userData error:', userError);
                return null;
            }
            
            if (!userData) {
                return null;
            }
            
            // Ligdeki tüm sıralama
            const { data: rankings, error: rankError } = await supabaseClient
                .from('weekly_leaderboard')
                .select('user_id,weekly_xp')
                .eq('week_start', weekStartStr)
                .eq('league', userData.league)
                .order('weekly_xp', { ascending: false });
            
            if (rankError) {
                console.error('getUserLeaguePosition rankings error:', rankError);
                return null;
            }
            
            if (!rankings || rankings.length === 0) {
                return null;
            }
            
            const position = rankings.findIndex(r => r.user_id === user.id) + 1;
            const totalInLeague = rankings.length;
            
            // Lig config'den yükselme/düşme eşiklerini al
            let leagueConfig = null;
            try {
                const { data: configData, error: configError } = await supabaseClient
                    .from('league_config')
                    .select('promotion_top_percent,demotion_bottom_percent')
                    .eq('league_name', userData.league)
                    .maybeSingle();
                
                if (!configError && configData) {
                    leagueConfig = configData;
                }
            } catch (configErr) {
                console.warn('getUserLeaguePosition leagueConfig error:', configErr);
            }
            
            const promotionPercent = (leagueConfig && leagueConfig.promotion_top_percent) ? leagueConfig.promotion_top_percent : 25;
            const demotionPercent = (leagueConfig && leagueConfig.demotion_bottom_percent) ? leagueConfig.demotion_bottom_percent : 30;
            
            const promotionThreshold = Math.ceil(totalInLeague * promotionPercent / 100);
            const demotionThreshold = Math.floor(totalInLeague * (100 - demotionPercent) / 100);
            
            return {
                league: userData.league,
                weekly_xp: userData.weekly_xp,
                position: position,
                total_in_league: totalInLeague,
                promotion_threshold: promotionThreshold,
                demotion_threshold: demotionThreshold,
                promotion_percent: promotionPercent,
                demotion_percent: demotionPercent
            };
        } catch (error) {
            console.warn('Get user league position error:', error);
            return null;
        }
    }
    
    return null;
}

/**
 * Lig config bilgilerini getir
 */
async function getLeagueConfig(leagueName) {
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('league_config')
                .select('*')
                .eq('league_name', leagueName)
                .single();
            
            if (error) return null;
            return data;
        } catch (error) {
            console.warn('Get league config error:', error);
            return null;
        }
    }
    
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
    window.loadDailyStat = loadDailyStat;
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

