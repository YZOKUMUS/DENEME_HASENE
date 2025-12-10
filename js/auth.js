// ============================================
// AUTHENTICATION - Kullanıcı Girişi/Kaydı
// ============================================

let currentAuthTab = 'login';

/**
 * Authentication modal'ını açar
 */
function showAuthModal() {
    // openModal fonksiyonunu kullan (utils.js'den)
    if (typeof openModal === 'function') {
        openModal('auth-modal');
    } else {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    // İlk tab'ı göster
    switchAuthTab('login');
}

/**
 * Authentication modal'ını kapatır
 */
function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    // Formları temizle
    clearAuthForms();
}

/**
 * Auth tab'ları arasında geçiş yapar
 */
function switchAuthTab(tab) {
    currentAuthTab = tab;
    
    // Tab butonlarını güncelle
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });
    
    // Formları göster/gizle
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (!loginForm || !registerForm) {
        console.warn('⚠️ Auth formları bulunamadı');
        return;
    }
    
    if (tab === 'login') {
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
    }
    
    // Mesajları temizle
    hideAuthMessage();
}

/**
 * Giriş yap
 */
async function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showAuthMessage('Lütfen tüm alanları doldurun', 'error');
        return;
    }
    
    try {
        if (typeof window.loginUser === 'function') {
            const result = await window.loginUser(email, password);
            
            if (result && result.user) {
                showAuthMessage('Giriş başarılı! Yönlendiriliyorsunuz...', 'success');
                
                // Modal'ı hemen kapat
                closeAuthModal();
                
                // Kullanıcı bilgilerini kaydet (async, hata verse bile devam et)
                syncUserData().catch(err => {
                    console.warn('Veri senkronizasyon hatası (normal olabilir):', err);
                });
                
                // UI'ı güncelle ve sayfayı yenile
                updateUserUI();
                setTimeout(() => {
                    location.reload(); // Verileri yeniden yükle
                }, 500);
            }
        } else {
            showAuthMessage('Backend servisi yüklenmedi. Lütfen sayfayı yenileyin.', 'error');
        }
    } catch (error) {
        console.error('Login hatası:', error);
        
        // Email confirmation hatası için özel mesaj
        if (error.message && error.message.includes('Email not confirmed')) {
            showAuthMessage('Email doğrulanmamış. Lütfen email\'inize gelen doğrulama linkine tıklayın. Eğer email gelmediyse, Supabase Dashboard\'dan "Authentication" > "Providers" > "Email" bölümünde "Confirm email" seçeneğini kapatabilirsiniz.', 'error');
        } else {
            showAuthMessage(error.message || 'Giriş yapılamadı. Lütfen tekrar deneyin.', 'error');
        }
    }
}

/**
 * Kayıt ol
 */
async function handleRegister() {
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    
    if (!username || !email || !password || !passwordConfirm) {
        showAuthMessage('Lütfen tüm alanları doldurun', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAuthMessage('Şifre en az 6 karakter olmalıdır', 'error');
        return;
    }
    
    if (password !== passwordConfirm) {
        showAuthMessage('Şifreler eşleşmiyor', 'error');
        return;
    }
    
    try {
        if (typeof window.registerUser === 'function') {
            const result = await window.registerUser(email, password, username);
            
            if (result && result.user) {
                // Email confirmation kontrolü
                if (result.user.email_confirmed_at || result.user.confirmed_at) {
                    // Email zaten doğrulanmış, direkt giriş yap
                    showAuthMessage('Kayıt başarılı! Giriş yapılıyor...', 'success');
                    
                    // Kullanıcı bilgilerini kaydet
                    await syncUserData();
                    
                    // Modal'ı kapat
                    setTimeout(() => {
                        closeAuthModal();
                        updateUserUI();
                        location.reload(); // Verileri yeniden yükle
                    }, 1000);
                } else {
                    // Email confirmation gerekli
                    showAuthMessage('Kayıt başarılı! Lütfen email\'inize gelen doğrulama linkine tıklayın. Email\'i doğruladıktan sonra giriş yapabilirsiniz.', 'success');
                    
                    // Modal'ı kapat ama sayfayı yenileme
                    setTimeout(() => {
                        closeAuthModal();
                    }, 3000);
                }
            }
        } else {
            showAuthMessage('Backend servisi yüklenmedi. Lütfen sayfayı yenileyin.', 'error');
        }
    } catch (error) {
        console.error('Register hatası:', error);
        
        // Email confirmation hatası için özel mesaj
        if (error.message && error.message.includes('Email not confirmed')) {
            showAuthMessage('Email doğrulanmamış. Lütfen email\'inize gelen doğrulama linkine tıklayın veya Supabase ayarlarından email confirmation\'ı kapatın.', 'error');
        } else {
            showAuthMessage(error.message || 'Kayıt olunamadı. Lütfen tekrar deneyin.', 'error');
        }
    }
}

/**
 * Google ile giriş
 */
async function handleGoogleLogin() {
    try {
        if (typeof window.loginWithGoogle === 'function') {
            await window.loginWithGoogle();
            // OAuth redirect sonrası sayfa yenilenecek
        } else {
            showAuthMessage('Google girişi şu an kullanılamıyor', 'error');
        }
    } catch (error) {
        console.error('Google login hatası:', error);
        showAuthMessage('Google ile giriş yapılamadı', 'error');
    }
}

/**
 * GitHub ile giriş
 */
async function handleGitHubLogin() {
    try {
        if (typeof window.loginWithGitHub === 'function') {
            await window.loginWithGitHub();
            // OAuth redirect sonrası sayfa yenilenecek
        } else {
            showAuthMessage('GitHub girişi şu an kullanılamıyor', 'error');
        }
    } catch (error) {
        console.error('GitHub login hatası:', error);
        showAuthMessage('GitHub ile giriş yapılamadı', 'error');
    }
}

/**
 * Çıkış yap
 */
async function handleLogout() {
    try {
        if (typeof window.logoutUser === 'function') {
            await window.logoutUser();
            updateUserUI();
            showAuthMessage('Çıkış yapıldı', 'success');
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    } catch (error) {
        console.error('Logout hatası:', error);
    }
}

/**
 * Auth mesajını göster
 */
function showAuthMessage(message, type) {
    const messageEl = document.getElementById('auth-message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `auth-message ${type}`;
        messageEl.style.display = 'block';
    }
}

/**
 * Auth mesajını gizle
 */
function hideAuthMessage() {
    const messageEl = document.getElementById('auth-message');
    if (messageEl) {
        messageEl.style.display = 'none';
        messageEl.className = 'auth-message';
    }
}

/**
 * Formları temizle
 */
function clearAuthForms() {
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('register-username').value = '';
    document.getElementById('register-email').value = '';
    document.getElementById('register-password').value = '';
    document.getElementById('register-password-confirm').value = '';
    hideAuthMessage();
}

/**
 * Kullanıcı UI'ını güncelle
 */
async function updateUserUI() {
    // getCurrentUser fonksiyonunu kullan (api-service.js'den)
    let user = null;
    if (typeof window.getCurrentUser === 'function') {
        user = await window.getCurrentUser();
    }
    
    const userProfileBtn = document.getElementById('user-profile-btn');
    const userEmailEl = document.getElementById('user-email');
    const authNavBtn = document.getElementById('auth-nav-btn');
    const registerTabBtn = document.getElementById('register-tab-btn');
    const registerBenefitsInfo = document.getElementById('register-benefits-info');
    
    if (user && user.email) {
        // Kullanıcı giriş yapmış
        if (userProfileBtn) {
            userProfileBtn.style.display = 'flex';
        }
        // Email'i gizle - sadece avatar ve çıkış butonu göster
        if (userEmailEl) {
            userEmailEl.style.display = 'none';
        }
        // Avatar'ı güncelle
        const userAvatarInitial = document.getElementById('user-avatar-initial');
        if (userAvatarInitial) {
            // Kullanıcı adının ilk harfini al veya email'in ilk harfini al
            const displayName = user.username || user.email || 'U';
            const initial = displayName.charAt(0).toUpperCase();
            userAvatarInitial.textContent = initial;
            
            // Avatar rengini kullanıcı adına göre belirle (tutarlı renk için)
            const colors = [
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
            ];
            const colorIndex = displayName.charCodeAt(0) % colors.length;
            const avatarEl = document.getElementById('user-avatar');
            if (avatarEl) {
                avatarEl.style.background = colors[colorIndex];
            }
        }
        if (authNavBtn) {
            authNavBtn.style.display = 'none';
        }
        // Kayıt Ol sekmesini gizle
        if (registerTabBtn) {
            registerTabBtn.style.display = 'none';
        }
        // Bilgilendirme kutusunu gizle
        if (registerBenefitsInfo) {
            registerBenefitsInfo.style.display = 'none';
        }
    } else {
        // Kullanıcı giriş yapmamış
        if (userProfileBtn) {
            userProfileBtn.style.display = 'none';
        }
        if (authNavBtn) {
            authNavBtn.style.display = 'flex';
        }
        // Kayıt Ol sekmesini göster
        if (registerTabBtn) {
            registerTabBtn.style.display = 'flex';
        }
        // Bilgilendirme kutusunu göster
        if (registerBenefitsInfo) {
            registerBenefitsInfo.style.display = 'block';
        }
    }
}

/**
 * Kullanıcı verilerini backend'e senkronize et
 */
async function syncUserData() {
    try {
        // localStorage'dan verileri oku (game-core.js'den senkronize edilmiş olabilir)
        const totalPoints = parseInt(localStorage.getItem('hasene_totalPoints') || '0');
        const badges = JSON.parse(localStorage.getItem('hasene_badges') || '{"stars":0,"bronze":0,"silver":0,"gold":0,"diamond":0}');
        const streakData = JSON.parse(localStorage.getItem('hasene_streakData') || '{"currentStreak":0,"bestStreak":0,"totalPlayDays":0}');
        const gameStats = JSON.parse(localStorage.getItem('hasene_gameStats') || '{"totalCorrect":0,"totalWrong":0,"gameModeCounts":{}}');
        const perfectLessonsCount = parseInt(localStorage.getItem('perfectLessonsCount') || '0');
        
        // Mevcut localStorage verilerini backend'e gönder
        if (typeof window.saveUserStats === 'function') {
            const stats = {
                total_points: totalPoints,
                badges: badges,
                streak_data: streakData,
                game_stats: gameStats,
                perfect_lessons_count: perfectLessonsCount
            };
            
            await window.saveUserStats(stats);
        }
        
        // Günlük ve haftalık görevleri senkronize et
        const dailyTasksStr = localStorage.getItem('hasene_dailyTasks');
        if (typeof window.saveDailyTasks === 'function' && dailyTasksStr) {
            try {
                const dailyTasks = JSON.parse(dailyTasksStr);
                await window.saveDailyTasks(dailyTasks);
            } catch (e) {
                console.warn('Daily tasks parse hatası:', e);
            }
        }
        
        const weeklyTasksStr = localStorage.getItem('hasene_weeklyTasks');
        if (typeof window.saveWeeklyTasks === 'function' && weeklyTasksStr) {
            try {
                const weeklyTasks = JSON.parse(weeklyTasksStr);
                await window.saveWeeklyTasks(weeklyTasks);
            } catch (e) {
                console.warn('Weekly tasks parse hatası:', e);
            }
        }
        
        console.log('✅ Kullanıcı verileri backend\'e senkronize edildi');
    } catch (error) {
        console.error('❌ Veri senkronizasyon hatası:', error);
    }
}

/**
 * Kullanıcı menüsünü göster (basit dropdown)
 */
function showUserMenu() {
    // Şimdilik sadece logout butonu gösteriliyor
    // İleride profil, ayarlar vs. eklenebilir
}

/**
 * Auth'u başlat
 */
async function initializeAuth() {
    // Supabase client'ın başlatılmasını bekle
    await new Promise(resolve => {
        let attempts = 0;
        const checkSupabase = () => {
            if (typeof window.supabase !== 'undefined' && window.supabase) {
                resolve();
            } else if (attempts < 50) { // 5 saniye timeout
                attempts++;
                setTimeout(checkSupabase, 100);
            } else {
                console.warn('⚠️ Supabase client başlatılamadı, auth devre dışı');
                resolve(); // Devam et
            }
        };
        checkSupabase();
    });
    
    // Biraz daha bekle (Supabase client init için)
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Kullanıcı giriş durumunu kontrol et
    await updateUserUI();
    
    // OAuth callback kontrolü (URL'de code parametresi varsa)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code')) {
        // OAuth başarılı, kullanıcı bilgilerini yükle
        setTimeout(async () => {
            await updateUserUI();
            await syncUserData();
            // URL'den code parametresini temizle
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 1000);
    }
    
    // Eğer kullanıcı giriş yapmamışsa, auth butonunu göster
    // (updateUserUI zaten bunu yapıyor, ama emin olmak için)
    if (typeof window.getCurrentUser === 'function') {
        const user = await window.getCurrentUser();
        const authNavBtn = document.getElementById('auth-nav-btn');
        if (!user && authNavBtn) {
            authNavBtn.style.display = 'flex';
        }
    }
}

/**
 * Sayfa yüklendiğinde kullanıcı durumunu kontrol et
 */
window.addEventListener('DOMContentLoaded', initializeAuth);
window.addEventListener('load', initializeAuth);

// Export functions
if (typeof window !== 'undefined') {
    window.showAuthModal = showAuthModal;
    window.closeAuthModal = closeAuthModal;
    window.switchAuthTab = switchAuthTab;
    window.handleLogin = handleLogin;
    window.handleRegister = handleRegister;
    window.handleGoogleLogin = handleGoogleLogin;
    window.handleGitHubLogin = handleGitHubLogin;
    window.handleLogout = handleLogout;
    window.updateUserUI = updateUserUI;
    window.syncUserData = syncUserData;
    window.showUserMenu = showUserMenu;
    
    // getCurrentUser fonksiyonunu export et (auth.js'den kullanmak için)
    if (typeof window.getCurrentUser === 'function') {
        window.getCurrentUser = window.getCurrentUser;
    }
}

