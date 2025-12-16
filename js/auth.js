// ============================================
// AUTHENTICATION - Kullanıcı Girişi/Kaydı
// ============================================

let currentAuthTab = 'login';

/**
 * Authentication modal'ını açar
 */
async function showAuthModal() {
    // Kullanıcı giriş yapmışsa modal'ı açma
    const user = typeof window.getCurrentUser === 'function' ? await window.getCurrentUser() : null;
    if (user) {
        console.log('Kullanıcı zaten giriş yapmış, auth modal açılmadı');
        return;
    }
    
    // openModal fonksiyonunu kullan (utils.js'den)
    if (typeof openModal === 'function') {
        openModal('auth-modal');
    } else {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    // İlk tab'ı göster (kullanıcı giriş yapmamışsa kayıt ol sekmesi görünebilir)
    switchAuthTab('login');
    
    // UI'ı güncelle (kayıt ol sekmesini gizle/göster)
    updateAuthModalUI();
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
async function switchAuthTab(tab) {
    // Kullanıcı giriş yapmışsa ve kayıt ol sekmesine geçmeye çalışıyorsa engelle
    const user = typeof window.getCurrentUser === 'function' ? await window.getCurrentUser() : null;
    if (user && tab === 'register') {
        console.log('Giriş yapmış kullanıcı kayıt ol sekmesine geçemez');
        showAuthMessage('Zaten giriş yapmışsınız. Çıkış yapmak için üst sağdaki butonu kullanın.', 'error');
        return;
    }
    
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
        // Kayıt ol sekmesine geçiş yapılıyorsa, kullanıcı kontrolü yap
        if (user) {
            loginForm.style.display = 'flex';
            registerForm.style.display = 'none';
            showAuthMessage('Zaten giriş yapmışsınız.', 'error');
            return;
        }
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
    }
    
    // Mesajları temizle
    hideAuthMessage();
    
    // UI'ı güncelle
    updateAuthModalUI();
}

/**
 * Giriş yap
 */
async function handleLogin() {
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showAuthMessage('Lütfen tüm alanları doldurun', 'error');
        return;
    }
    
    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAuthMessage('Geçerli bir email adresi girin (örn: kullanici@example.com)', 'error');
        return;
    }
    
    try {
        if (typeof window.loginUser === 'function') {
            const result = await window.loginUser(email, password);
            
            if (result && result.user) {
                // Giriş başarılı - kayıt durumunu işaretle
                localStorage.setItem('hasene_user_has_registered', 'true');
                console.log('✅ Giriş başarılı, kayıt durumu localStorage\'a kaydedildi');
                
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
        
        let errorMessage = 'Giriş yapılamadı. Lütfen tekrar deneyin.';
        
        // Detaylı hata mesajları
        if (error.message && error.message.includes('Email doğrulanmamış')) {
            errorMessage = error.message;
        } else if (error.message && (error.message.includes('Invalid login credentials') || error.message.includes('invalid') || error.message.includes('Email veya şifre hatalı'))) {
            errorMessage = error.message;
        } else if (error.message && error.message.includes('Email not confirmed')) {
            errorMessage = 'Email doğrulanmamış.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showAuthMessage(errorMessage, 'error');
    }
}

/**
 * Kayıt ol
 */
async function handleRegister() {
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim().toLowerCase();
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    
    if (!username || !email || !password || !passwordConfirm) {
        showAuthMessage('Lütfen tüm alanları doldurun', 'error');
        return;
    }
    
    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAuthMessage('Geçerli bir email adresi girin (örn: kullanici@example.com)', 'error');
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
                // Kayıt başarılı - localStorage'a kayıt durumunu kaydet
                localStorage.setItem('hasene_user_has_registered', 'true');
                console.log('✅ Kayıt başarılı, localStorage\'a kaydedildi');
                
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
                    
                    // Auth modal UI'ını güncelle (kayıt ol sekmesini gizle)
                    updateAuthModalUI();
                    
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
        
        // Özel hata mesajları
        let errorMessage = 'Kayıt olunamadı. Lütfen tekrar deneyin.';
        
        if (error.message && error.message.includes('Email signups are disabled')) {
            errorMessage = 'Email kayıtları şu an devre dışı.';
        } else if (error.message && error.message.includes('Unable to validate email address: invalid format')) {
            errorMessage = 'Geçersiz email formatı. Lütfen geçerli bir email adresi girin (örn: kullanici@example.com)';
        } else if (error.message && error.message.includes('invalid format')) {
            errorMessage = 'Email formatı geçersiz. Lütfen doğru formatta bir email adresi girin.';
        } else if (error.message && error.message.includes('Email not confirmed')) {
            errorMessage = 'Email doğrulanmamış.';
        } else if (error.message && (error.message.includes('User already registered') || error.message.includes('already registered'))) {
            errorMessage = 'Bu email adresi ile zaten bir hesap var. Lütfen giriş yapın.';
            // Otomatik olarak login tab'ına geç
            setTimeout(() => {
                switchAuthTab('login');
                // Email'i login formuna kopyala
                const loginEmailInput = document.getElementById('login-email');
                if (loginEmailInput) {
                    loginEmailInput.value = email;
                }
            }, 1500);
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showAuthMessage(errorMessage, 'error');
    }
}

/**
 * Google ile giriş
 */
async function handleGoogleLogin() {
    try {
        if (typeof window.loginWithGoogle === 'function') {
            showAuthMessage('Google ile giriş yapılıyor...', 'info');
            
            await window.loginWithGoogle();
            // OAuth redirect sonrası sayfa yenilenecek
            // Başarılı olduğunda kullanıcı Google'a yönlendirilir
        } else {
            showAuthMessage('Google girişi şu an kullanılamıyor. Lütfen sayfayı yenileyin.', 'error');
        }
    } catch (error) {
        console.error('Google login hatası:', error);
        
        let errorMessage = 'Google ile giriş yapılamadı.';
        
        if (error.message && error.message.includes('yapılandırılmamış')) {
            errorMessage = 'Google girişi kullanılamıyor.';
        } else if (error.message && error.message.includes('500')) {
            errorMessage = 'Google giriş hatası.';
        } else if (error.message) {
            errorMessage = `Google giriş hatası: ${error.message}`;
        }
        
        showAuthMessage(errorMessage, 'error');
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
            
            // Çıkış yapılınca kullanıcıya özel localStorage'ı temizle
            if (typeof window.clearUserLocalStorage === 'function') {
                window.clearUserLocalStorage();
            }
            
            // Kullanıcı ID'sini temizle
            localStorage.removeItem('hasene_current_user_id');
            
            // Çıkış yapılınca kayıt durumunu SİLME (kullanıcı tekrar kayıt olmamalı)
            // localStorage.removeItem('hasene_user_has_registered'); // Silme, kullanıcı zaten kayıtlı
            
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
 * Auth modal UI'ını güncelle (kullanıcı giriş durumuna göre)
 */
async function updateAuthModalUI() {
    // Kayıt ol kaldırıldı - sadece Google ile giriş
    // Her zaman kayıt ol sekmesini ve formunu gizle
    const registerTabBtn = document.getElementById('register-tab-btn');
    const registerForm = document.getElementById('register-form');
    const registerBenefitsInfo = document.getElementById('register-benefits-info');
    
    if (registerTabBtn) {
        registerTabBtn.style.display = 'none';
    }
    if (registerForm) {
        registerForm.style.display = 'none';
    }
    if (registerBenefitsInfo) {
        registerBenefitsInfo.style.display = 'none';
    }
}

/**
 * Kullanıcı UI'ını güncelle
 */
async function updateUserUI() {
    if (typeof debugLog === 'function') {
        debugLog('updateUserUI çağrıldı');
    }
    
    // getCurrentUser fonksiyonunu kullan (api-service.js'den)
    let user = null;
    if (typeof window.getCurrentUser === 'function') {
        user = await window.getCurrentUser();
        if (typeof infoLog === 'function') {
            infoLog('Kullanıcı durumu:', user ? 'Giriş yapmış' : 'Giriş yapmamış', user);
        }
    } else {
        console.warn('⚠️ getCurrentUser fonksiyonu bulunamadı');
    }
    
    const userProfileBtn = document.getElementById('user-profile-btn');
    const userEmailEl = document.getElementById('user-email');
    const authNavBtn = document.getElementById('auth-nav-btn');
    // registerTabBtn ve registerBenefitsInfo kaldırıldı (sadece Google ile giriş)
    
    if (typeof debugLog === 'function') {
        debugLog('updateUserUI element durumu', {
            userProfileBtn: !!userProfileBtn,
            authNavBtn: !!authNavBtn
        });
    }
    
    if (user && user.email) {
        // Kullanıcı giriş yapmış
        if (typeof infoLog === 'function') {
            infoLog('Kullanıcı giriş yapmış, avatar gösteriliyor');
        }
        if (userProfileBtn) {
            userProfileBtn.style.display = 'flex';
            console.log('👤 user-profile-btn gösterildi');
        } else {
            console.error('❌ user-profile-btn bulunamadı!');
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
            if (typeof debugLog === 'function') {
                debugLog('Avatar harfi güncellendi:', {
                    initial: initial,
                    username: user.username,
                    email: user.email,
                    displayName: displayName
                });
            }
            
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
                if (typeof debugLog === 'function') {
                    debugLog('Avatar rengi güncellendi:', colors[colorIndex]);
                }
            } else {
                console.error('❌ user-avatar elementi bulunamadı!');
            }
        } else {
            console.error('❌ user-avatar-initial elementi bulunamadı!');
        }
        if (authNavBtn) {
            authNavBtn.style.display = 'none';
        }
        // Kayıt Ol sekmesi ve bilgilendirme kutusu artık yok (sadece Google ile giriş)
        
        // Auth modal açıksa kapat
        const authModal = document.getElementById('auth-modal');
        if (authModal && authModal.style.display !== 'none') {
            closeAuthModal();
        }
        
        // Kullanıcı giriş yaptıysa, verileri yükle
        if (typeof window.loadStats === 'function') {
            if (typeof infoLog === 'function') {
                infoLog('Kullanıcı giriş yapmış, veriler yükleniyor...');
            }
            // Asenkron olarak çağır, UI güncellemesini engellemesin
            window.loadStats().catch(err => {
                console.error('❌ loadStats hatası (updateUserUI):', err);
            });
        }
    } else {
        // Kullanıcı giriş yapmamış
        if (typeof infoLog === 'function') {
            infoLog('Kullanıcı giriş yapmamış, giriş butonu gösteriliyor');
        }
        if (userProfileBtn) {
            userProfileBtn.style.display = 'none';
        }
        if (authNavBtn) {
            authNavBtn.style.display = 'flex';
        }
        // Kayıt Ol sekmesi ve bilgilendirme kutusu artık yok (sadece Google ile giriş)
    }
    
    // Auth modal UI'ını da güncelle
    updateAuthModalUI();
    
    if (typeof debugLog === 'function') {
        debugLog('updateUserUI tamamlandı');
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
        
        console.log('✅ Kullanıcı verileri kaydedildi');
        
        // Verileri yükle ve UI'ı güncelle
        if (typeof window.loadStats === 'function') {
            console.log('📥 Veriler yükleniyor (syncUserData sonrası)...');
            try {
                await window.loadStats();
                console.log('✅ Veriler yüklendi ve UI güncellendi');
            } catch (loadError) {
                console.warn('⚠️ Veri yükleme hatası (normal olabilir):', loadError);
            }
        }
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
    if (typeof debugLog === 'function') {
        debugLog('initializeAuth başlatılıyor...');
    }
    
    // Kullanıcı giriş durumunu kontrol et
    if (typeof debugLog === 'function') {
        debugLog('initializeAuth içinde updateUserUI çağrılıyor...');
    }
    await updateUserUI();
    
    // Eğer kullanıcı giriş yapmamışsa, auth butonunu göster
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

