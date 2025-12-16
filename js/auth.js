// ============================================
// AUTHENTICATION - Kullanıcı Girişi/Kaydı
// ============================================

let currentAuthTab = 'login';

/**
 * Authentication modal'ını açar
 */
async function showAuthModal() {
    console.log('🔄 showAuthModal çağrıldı');
    
    // Kullanıcı giriş yapmışsa modal'ı açma
    const user = typeof window.getCurrentUser === 'function' ? await window.getCurrentUser() : null;
    if (user) {
        console.log('ℹ️ Kullanıcı zaten giriş yapmış, auth modal açılmadı');
        return;
    }
    
    console.log('🔍 Modal açılıyor...');
    const modal = document.getElementById('auth-modal');
    console.log('🔍 Modal elementi:', modal ? 'Bulundu' : 'BULUNAMADI!');
    
    if (!modal) {
        console.error('❌ auth-modal elementi bulunamadı!');
        alert('Giriş modalı bulunamadı. Lütfen sayfayı yenileyin.');
        return;
    }
    
    // openModal fonksiyonunu kullan (utils.js'den)
    if (typeof openModal === 'function') {
        console.log('✅ openModal fonksiyonu kullanılıyor');
        openModal('auth-modal');
    } else {
        console.log('⚠️ openModal fonksiyonu yok, direkt modal açılıyor');
        modal.style.display = 'flex';
        console.log('✅ Modal display: flex yapıldı');
    }
    
    // UI'ı güncelle (modal açıldıktan sonra)
    // Kısa bir gecikme ile event listener'ları ekle (DOM'un hazır olması için)
    setTimeout(() => {
        updateAuthModalUI();
    }, 100);
    
    console.log('✅ showAuthModal tamamlandı');
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
    const registerForm = document.getElementById('register-form'); // Opsiyonel - HTML'de olmayabilir
    
    if (!loginForm) {
        console.warn('⚠️ Login formu bulunamadı');
        return;
    }
    
    if (tab === 'login') {
        loginForm.style.display = 'flex';
        if (registerForm) {
            registerForm.style.display = 'none';
        }
    } else if (tab === 'register') {
        // Kayıt ol sekmesine geçiş yapılıyorsa, kullanıcı kontrolü yap
        if (user) {
            loginForm.style.display = 'flex';
            if (registerForm) {
                registerForm.style.display = 'none';
            }
            showAuthMessage('Zaten giriş yapmışsınız.', 'error');
            return;
        }
        if (registerForm) {
            loginForm.style.display = 'none';
            registerForm.style.display = 'flex';
        } else {
            console.warn('⚠️ Register formu bulunamadı, login formu gösteriliyor');
            loginForm.style.display = 'flex';
        }
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
        
        showAuthMessage(errorMessage, 'error', 'register');
    }
}

/**
 * Kayıt ol
 */
async function handleRegister() {
    const username = document.getElementById('register-username')?.value.trim() || '';
    const email = document.getElementById('register-email').value.trim().toLowerCase();
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    
    if (!email || !password || !passwordConfirm) {
        showAuthMessage('Lütfen email, şifre ve şifre tekrar alanlarını doldurun', 'error');
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
                    showAuthMessage('Kayıt başarılı! Giriş yapılıyor...', 'success', 'register');
                    
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
                    showAuthMessage('Kayıt başarılı! Lütfen email\'inize gelen doğrulama linkine tıklayın. Email\'i doğruladıktan sonra giriş yapabilirsiniz.', 'success', 'register');
                    
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
                // Tab navigation kaldırıldı, sadece Google ile giriş var
                // Email'i login formuna kopyala
                const loginEmailInput = document.getElementById('login-email');
                if (loginEmailInput) {
                    loginEmailInput.value = email;
                }
            }, 1500);
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showAuthMessage(errorMessage, 'error', 'register');
    }
}

/**
 * Direkt giriş (kullanıcı adı ile)
 */
async function handleDirectLogin() {
    const usernameInput = document.getElementById('username-input');
    if (!usernameInput) {
        console.error('❌ Username input bulunamadı');
        return;
    }
    
    const username = usernameInput.value.trim();
    if (!username) {
        showAuthMessage('Lütfen kullanıcı adınızı girin', 'error');
        return;
    }
    
    if (username.length < 2) {
        showAuthMessage('Kullanıcı adı en az 2 karakter olmalıdır', 'error');
        return;
    }
    
    try {
        console.log('🔄 Direkt giriş başlatılıyor:', username);
        
        // Firebase Anonymous Authentication ile giriş yap (verilerin Firebase'de saklanması için)
        const auth = window.getFirebaseAuth ? window.getFirebaseAuth() : null;
        let firebaseUser = null;
        
        if (auth && window.BACKEND_TYPE === 'firebase') {
            try {
                const { signInAnonymously } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
                showAuthMessage('Giriş yapılıyor ve verileriniz kaydediliyor...', 'info');
                
                const userCredential = await signInAnonymously(auth);
                firebaseUser = userCredential.user;
                
                console.log('✅ Firebase Anonymous Authentication başarılı:', firebaseUser.uid);
                
                // Kullanıcı profilini Firestore'a kaydet
                const db = window.getFirebaseDb ? window.getFirebaseDb() : null;
                if (db && typeof window.firestoreSet === 'function') {
                    try {
                        await window.firestoreSet('users', firebaseUser.uid, {
                            email: username + '@local',
                            username: username,
                            created_at: new Date().toISOString(),
                            auth_type: 'anonymous'
                        });
                        console.log('✅ Kullanıcı profili Firestore\'a kaydedildi');
                    } catch (err) {
                        console.warn('⚠️ Firestore kullanıcı kayıt hatası (normal olabilir):', err);
                    }
                }
                
                // Firebase kullanıcı bilgilerini localStorage'a kaydet
                const userEmail = username + '@local';
                localStorage.setItem('hasene_username', username);
                localStorage.setItem('hasene_user_email', userEmail);
                localStorage.setItem('hasene_user_id', firebaseUser.uid); // Firebase UID kullan
                
                console.log('✅ Firebase kullanıcı bilgileri localStorage\'a kaydedildi:', {
                    uid: firebaseUser.uid,
                    username: username,
                    email: userEmail
                });
            } catch (error) {
                console.warn('⚠️ Firebase Anonymous Authentication hatası, localStorage kullanılıyor:', error);
                // Fallback: Sadece localStorage kullan
                localStorage.setItem('hasene_username', username);
                localStorage.setItem('hasene_user_email', username + '@local');
                localStorage.setItem('hasene_user_id', 'local_' + Date.now());
            }
        } else {
            // Firebase yok, sadece localStorage kullan
            localStorage.setItem('hasene_username', username);
            localStorage.setItem('hasene_user_email', username + '@local');
            localStorage.setItem('hasene_user_id', 'local_' + Date.now());
        }
        
        console.log('✅ Kullanıcı bilgileri kaydedildi');
        console.log('🔍 localStorage kontrol:', {
            username: localStorage.getItem('hasene_username'),
            email: localStorage.getItem('hasene_user_email'),
            id: localStorage.getItem('hasene_user_id')
        });
        
        // UI'ı güncelle
        showAuthMessage('Giriş başarılı! Verileriniz Firebase\'de saklanıyor.', 'success');
        
        // Modal'ı kapat
        closeAuthModal();
        
        // UI'ı güncelle (biraz bekle ki modal kapansın ve localStorage yazılsın)
        setTimeout(async () => {
            console.log('🔄 UI güncelleniyor...');
            
            // getCurrentUser'ı manuel kontrol et
            if (typeof window.getCurrentUser === 'function') {
                const user = await window.getCurrentUser();
                console.log('🔍 getCurrentUser sonucu:', user);
            }
            
            await updateUserUI();
            console.log('✅ UI güncellendi');
            
            // Verileri yükle
            if (typeof window.loadStats === 'function') {
                console.log('🔄 Veriler yükleniyor...');
                await window.loadStats();
                console.log('✅ Veriler yüklendi');
            }
        }, 500);
        
        console.log('✅ Direkt giriş başarılı:', username);
    } catch (error) {
        console.error('❌ Direkt giriş hatası:', error);
        showAuthMessage('Giriş yapılamadı. Lütfen tekrar deneyin.', 'error');
    }
}

/**
 * Google ile giriş (eski - artık kullanılmıyor)
 */
async function handleGoogleLogin() {
    try {
        console.log('🔄 handleGoogleLogin çağrıldı');
        console.log('🔍 loginWithGoogle fonksiyonu var mı?', typeof window.loginWithGoogle);
        console.log('🔍 getFirebaseAuth fonksiyonu var mı?', typeof window.getFirebaseAuth);
        
        if (typeof window.loginWithGoogle === 'function') {
            showAuthMessage('Google ile giriş yapılıyor, yönlendiriliyorsunuz...', 'info');
            
            console.log('🔄 Google login başlatılıyor...');
            const auth = window.getFirebaseAuth ? window.getFirebaseAuth() : null;
            console.log('🔍 Firebase Auth:', auth ? 'Mevcut' : 'Yok');
            console.log('🔍 Backend Type:', window.BACKEND_TYPE);
            
            const result = await window.loginWithGoogle();
            console.log('📥 Google login sonucu:', result);
            
            // Redirect başlatıldıysa (result null), kullanıcı Google'a yönlendirilecek
            // Sayfa yenilendikten sonra initializeAuth() redirect sonucunu kontrol edecek
            if (result === null) {
                // Redirect başlatıldı, sayfa Google'a yönlendirilecek
                console.log('✅ Redirect başlatıldı, Google\'a yönlendiriliyorsunuz...');
                showAuthMessage('Google\'a yönlendiriliyorsunuz...', 'info');
                
                // Eğer 2 saniye içinde yönlendirme gerçekleşmezse, kullanıcıya bilgi ver
                setTimeout(() => {
                    // Eğer hala aynı sayfadaysak (window.location değişmediyse)
                    const currentUrl = window.location.href;
                    console.warn('⚠️ 2 saniye geçti ama yönlendirme gerçekleşmedi');
                    console.warn('⚠️ Mevcut URL:', currentUrl);
                    
                    // Kullanıcıya bilgi ver
                    showAuthMessage('Yönlendirme gerçekleşmedi. Lütfen pop-up engelleyicileri kontrol edin ve tekrar deneyin.', 'error');
                }, 2000);
                
                // Burada bir şey yapmaya gerek yok, sayfa otomatik yönlendirilecek
                return;
            }
            
            // Eğer result varsa, zaten giriş yapılmış demektir
            if (result && result.user) {
                console.log('✅ Google login başarılı:', result.user.email);
                showAuthMessage('Giriş başarılı!', 'success');
                closeAuthModal();
                await updateUserUI();
                if (typeof window.loadStats === 'function') {
                    await window.loadStats();
                }
            }
        } else {
            console.error('❌ loginWithGoogle fonksiyonu bulunamadı');
            showAuthMessage('Google girişi şu an kullanılamıyor. Lütfen sayfayı yenileyin.', 'error');
        }
    } catch (error) {
        // Hata detaylarını kalıcı olarak logla
        console.error('❌ Google login hatası:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
        console.error('❌ Full error:', JSON.stringify(error, null, 2));
        
        // Hata mesajını localStorage'a kaydet
        localStorage.setItem('hasene_last_auth_error', JSON.stringify({
            code: error.code,
            message: error.message,
            timestamp: new Date().toISOString(),
            type: 'handle_google_login'
        }));
        
        let errorMessage = 'Google ile giriş yapılamadı.';
        
        // Hata mesajını kontrol et
        if (error.message && error.message.includes('yönlendirme başarısız')) {
            errorMessage = error.message; // Detaylı hata mesajını göster
        } else if (error.code === 'auth/operation-not-allowed') {
            errorMessage = 'Google girişi Firebase Console\'da açık değil. Lütfen Firebase Console > Authentication > Sign-in method > Google\'ı açın.';
        } else if (error.code === 'auth/unauthorized-domain') {
            errorMessage = 'Bu domain Firebase Console\'da yetkilendirilmemiş. Lütfen Firebase Console > Authentication > Settings > Authorized domains\'e şu domain\'leri ekleyin:\n' +
                '- ' + window.location.hostname + '\n' +
                '- localhost\n' +
                '- 127.0.0.1';
        } else if (error.code === 'auth/popup-blocked') {
            errorMessage = 'Popup engellendi. Lütfen tarayıcı ayarlarınızı kontrol edin.';
        } else if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Giriş penceresi kapatıldı.';
        } else if (error.message && error.message.includes('yapılandırılmamış')) {
            errorMessage = 'Google girişi kullanılamıyor.';
        } else if (error.message) {
            errorMessage = error.message; // Hata mesajını direkt göster
        } else if (error.message && error.message.includes('500')) {
            errorMessage = 'Google giriş hatası.';
        } else if (error.code) {
            errorMessage = `Google giriş hatası (${error.code}): ${error.message || 'Bilinmeyen hata'}`;
        } else if (error.message) {
            errorMessage = `Google giriş hatası: ${error.message}`;
        }
        
        // Hata mesajını alert ile göster (konsolda kaybolmasın diye)
        alert(`❌ ${errorMessage}\n\nDetaylar için konsolu kontrol edin (F12)`);
        
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
function showAuthMessage(message, type, formType = 'login') {
    // Hangi form aktifse ona mesaj göster
    const messageId = formType === 'register' ? 'auth-message-register' : 'auth-message';
    const messageEl = document.getElementById(messageId);
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `auth-message ${type}`;
        messageEl.style.display = 'block';
    }
    // Diğer formdaki mesajı gizle
    const otherMessageId = formType === 'register' ? 'auth-message' : 'auth-message-register';
    const otherMessageEl = document.getElementById(otherMessageId);
    if (otherMessageEl) {
        otherMessageEl.style.display = 'none';
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
    // Formlar kaldırıldı, sadece Google ile giriş var
    // Mesajı temizle
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
    
    // Direkt giriş butonuna event listener ekle
    const directLoginBtn = document.getElementById('direct-login-btn');
    if (directLoginBtn) {
        // Eski event listener'ları kaldır
        const newDirectBtn = directLoginBtn.cloneNode(true);
        directLoginBtn.parentNode.replaceChild(newDirectBtn, directLoginBtn);
        
        // Yeni event listener ekle
        newDirectBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Direkt giriş butonuna tıklandı');
            await handleDirectLogin();
        });
        console.log('✅ Direkt giriş butonu event listener ile bağlandı');
    }
    
    // Username input'a Enter tuşu desteği
    const usernameInput = document.getElementById('username-input');
    if (usernameInput) {
        const newUsernameInput = usernameInput.cloneNode(true);
        usernameInput.parentNode.replaceChild(newUsernameInput, usernameInput);
        
        newUsernameInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('⌨️ Enter tuşuna basıldı');
                await handleDirectLogin();
            }
        });
        console.log('✅ Username input event listener ile bağlandı');
    }
    
    // Modal close butonuna event listener ekle
    const modalCloseBtn = document.getElementById('auth-modal-close');
    if (modalCloseBtn) {
        // Eski event listener'ları kaldır
        const newCloseBtn = modalCloseBtn.cloneNode(true);
        modalCloseBtn.parentNode.replaceChild(newCloseBtn, modalCloseBtn);
        
        // Yeni event listener ekle
        newCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Modal close butonuna tıklandı');
            
            if (typeof window.closeAuthModal === 'function') {
                window.closeAuthModal();
            } else if (typeof closeAuthModal === 'function') {
                closeAuthModal();
            } else {
                const modal = document.getElementById('auth-modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            }
        });
        console.log('✅ Modal close butonu event listener ile bağlandı');
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
        console.log('✅ Kullanıcı giriş yapmış:', user.email, user.username);
        if (typeof infoLog === 'function') {
            infoLog('Kullanıcı giriş yapmış, avatar gösteriliyor');
        }
        
        // Giriş butonunu gizle
        if (authNavBtn) {
            authNavBtn.style.display = 'none';
            console.log('🔐 auth-nav-btn gizlendi');
        } else {
            console.warn('⚠️ auth-nav-btn bulunamadı');
        }
        
        // Kullanıcı profil butonunu göster
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
            console.log('🔐 auth-nav-btn gizlendi (kullanıcı giriş yapmış)');
        } else {
            console.error('❌ auth-nav-btn bulunamadı!');
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
        console.log('❌ Kullanıcı giriş yapmamış');
        if (typeof infoLog === 'function') {
            infoLog('Kullanıcı giriş yapmamış, giriş butonu gösteriliyor');
        }
        
        // Kullanıcı profil butonunu gizle
        if (userProfileBtn) {
            userProfileBtn.style.display = 'none';
            console.log('👤 user-profile-btn gizlendi');
        }
        
        // Giriş butonunu göster
        if (authNavBtn) {
            authNavBtn.style.display = 'flex';
            console.log('🔐 auth-nav-btn gösterildi (kullanıcı giriş yapmamış)');
        } else {
            console.warn('⚠️ auth-nav-btn bulunamadı');
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
    
    // 404 hatasını görmezden gel (__/firebase/init.json hatası normal)
    const originalError = window.onerror;
    window.onerror = function(msg, url, line, col, error) {
        if (url && url.includes('__/firebase/init.json')) {
            // Bu hatayı görmezden gel
            return true;
        }
        if (originalError) {
            return originalError.apply(this, arguments);
        }
        return false;
    };
    
    // Firebase Auth state listener ekle
    const auth = window.getFirebaseAuth ? await window.getFirebaseAuth() : null;
    if (auth && window.BACKEND_TYPE === 'firebase') {
        try {
            // Önceki hataları kontrol et
            const lastError = localStorage.getItem('hasene_last_auth_error');
            if (lastError) {
                try {
                    const errorData = JSON.parse(lastError);
                    console.error('❌ Önceki auth hatası bulundu:', errorData);
                    // Sadece gerçek hataları göster, 404'ü değil
                    if (!errorData.message || !errorData.message.includes('404') && !errorData.message.includes('init.json')) {
                        alert(`Giriş hatası: ${errorData.message || errorData.code || 'Bilinmeyen hata'}\n\nKonsolu kontrol edin (F12)`);
                    }
                    localStorage.removeItem('hasene_last_auth_error');
                } catch (e) {
                    console.error('Hata verisi parse edilemedi:', e);
                }
            }
            
            // Redirect sonucunu kontrol et (Google login redirect sonrası)
            const { getRedirectResult } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            try {
                const redirectResult = await getRedirectResult(auth);
                if (redirectResult) {
                    const user = redirectResult.user;
                    console.log('✅ Google login redirect başarılı:', user.email);
                    
                    // Kullanıcı profilini Firestore'a kaydet
                    const db = window.getFirebaseDb ? window.getFirebaseDb() : null;
                    if (db && typeof window.firestoreSet === 'function') {
                        try {
                            await window.firestoreSet('users', user.uid, {
                                email: user.email,
                                username: user.displayName || user.email.split('@')[0],
                                created_at: new Date().toISOString()
                            });
                        } catch (err) {
                            console.warn('⚠️ Firestore kayıt hatası (normal olabilir):', err);
                        }
                    }
                    
                    // localStorage'a kaydet
                    localStorage.setItem('hasene_user_email', user.email);
                    if (user.displayName) {
                        localStorage.setItem('hasene_username', user.displayName);
                    }
                    
                    // UI'ı güncelle
                    await updateUserUI();
                    
                    // Verileri yükle
                    if (typeof window.loadStats === 'function') {
                        await window.loadStats();
                    }
                    
                    // Auth modal'ı kapat
                    closeAuthModal();
                } else {
                    console.log('ℹ️ Redirect sonucu yok (normal - henüz redirect yapılmadı)');
                }
            } catch (redirectError) {
                // 404 hatasını görmezden gel
                if (redirectError.message && redirectError.message.includes('404')) {
                    console.log('ℹ️ 404 hatası (normal, görmezden geliniyor)');
                    return;
                }
                
                console.error('❌ Redirect sonucu kontrol hatası:', redirectError);
                console.error('❌ Error code:', redirectError.code);
                console.error('❌ Error message:', redirectError.message);
                
                // Hata mesajını localStorage'a kaydet (404 hariç)
                if (redirectError.code && redirectError.code !== '404') {
                    localStorage.setItem('hasene_last_auth_error', JSON.stringify({
                        code: redirectError.code,
                        message: redirectError.message,
                        timestamp: new Date().toISOString(),
                        type: 'redirect_result'
                    }));
                }
            }
        } finally {
            // Error handler'ı geri yükle
            window.onerror = originalError;
        }
        
        // Auth state listener ekle
        try {
            const { onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            onAuthStateChanged(auth, async (user) => {
                if (typeof debugLog === 'function') {
                    debugLog('Firebase auth state changed:', user ? 'User logged in' : 'User logged out');
                }
                
                if (user) {
                    // Kullanıcı giriş yaptı
                    localStorage.setItem('hasene_user_email', user.email);
                    if (user.displayName) {
                        localStorage.setItem('hasene_username', user.displayName);
                    }
                    
                    // UI'ı güncelle
                    await updateUserUI();
                    
                    // Verileri yükle
                    if (typeof window.loadStats === 'function') {
                        await window.loadStats();
                    }
                } else {
                    // Kullanıcı çıkış yaptı
                    localStorage.removeItem('hasene_user_email');
                    localStorage.removeItem('hasene_username');
                    await updateUserUI();
                }
            });
            
            if (typeof debugLog === 'function') {
                debugLog('Firebase auth state listener eklendi');
            }
        } catch (error) {
            console.warn('Firebase auth state listener eklenemedi:', error);
        }
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

// Export functions - Hemen export et (script yüklenir yüklenmez)
// Fonksiyonlar tanımlandıktan hemen sonra export et
if (typeof window !== 'undefined') {
    // Fonksiyonları hemen export et
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
    
    console.log('✅ Auth fonksiyonları window\'a export edildi');
    console.log('🔍 window.showAuthModal:', typeof window.showAuthModal);
    console.log('🔍 window.showAuthModal === showAuthModal:', window.showAuthModal === showAuthModal);
    
    // getCurrentUser fonksiyonunu export et (auth.js'den kullanmak için)
    if (typeof window.getCurrentUser === 'function') {
        window.getCurrentUser = window.getCurrentUser;
    }
    
    // Test: Fonksiyonun çalışıp çalışmadığını kontrol et
    if (typeof window.showAuthModal === 'function') {
        console.log('✅ showAuthModal başarıyla export edildi');
    } else {
        console.error('❌ showAuthModal export edilemedi!');
    }
}

// Ayrıca DOMContentLoaded'da da export et (güvenlik için - script yüklenmeden önce butona tıklanırsa)
if (typeof window !== 'undefined') {
    // Hemen export et (script yüklenir yüklenmez)
    const exportAuthFunctions = () => {
        window.showAuthModal = showAuthModal;
        window.closeAuthModal = closeAuthModal;
        window.switchAuthTab = switchAuthTab;
        window.handleLogin = handleLogin;
        window.handleRegister = handleRegister;
        window.handleDirectLogin = handleDirectLogin;
        window.handleGoogleLogin = handleGoogleLogin;
        window.handleGitHubLogin = handleGitHubLogin;
        window.handleLogout = handleLogout;
        window.updateUserUI = updateUserUI;
        window.syncUserData = syncUserData;
        window.showUserMenu = showUserMenu;
    };
    
    // Hemen çalıştır
    exportAuthFunctions();
    
    // DOMContentLoaded'da da çalıştır (güvenlik için)
    window.addEventListener('DOMContentLoaded', exportAuthFunctions);
    
    // Load event'inde de çalıştır (tüm scriptler yüklendikten sonra)
    window.addEventListener('load', exportAuthFunctions);
    
    // Auth butonuna event listener ekle (onclick yerine)
    const setupAuthButton = () => {
        const authNavBtn = document.getElementById('auth-nav-btn');
        console.log('🔍 Auth butonu aranıyor:', authNavBtn ? 'Bulundu' : 'BULUNAMADI!');
        
        if (authNavBtn) {
            // Eski onclick'i kaldır ve yeni event listener ekle
            authNavBtn.onclick = null;
            
            // Eski onclick'i kaldır
            authNavBtn.onclick = null;
            authNavBtn.removeAttribute('onclick');
            
            // Önceki event listener'ları kaldır (tekrar eklememek için)
            const newAuthNavBtn = authNavBtn.cloneNode(true);
            // cloneNode sonrası onclick'i de kaldır
            newAuthNavBtn.onclick = null;
            newAuthNavBtn.removeAttribute('onclick');
            authNavBtn.parentNode.replaceChild(newAuthNavBtn, authNavBtn);
            
            // Yeni butona event listener ekle
            newAuthNavBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Auth butonuna tıklandı');
                console.log('🔍 showAuthModal tipi:', typeof showAuthModal);
                console.log('🔍 window.showAuthModal tipi:', typeof window.showAuthModal);
                
                // Önce window.showAuthModal'ı dene
                if (typeof window.showAuthModal === 'function') {
                    console.log('✅ window.showAuthModal fonksiyonu bulundu, çağrılıyor...');
                    await window.showAuthModal();
                } else if (typeof showAuthModal === 'function') {
                    console.log('✅ showAuthModal fonksiyonu bulundu, çağrılıyor...');
                    await showAuthModal();
                } else {
                    console.error('❌ showAuthModal fonksiyonu bulunamadı');
                    console.error('🔍 window.showAuthModal:', typeof window.showAuthModal);
                    console.error('🔍 showAuthModal:', typeof showAuthModal);
                    alert('Giriş modalı açılamadı. Lütfen sayfayı yenileyin.');
                }
            });
            console.log('✅ Auth butonu event listener ile bağlandı');
        } else {
            console.warn('⚠️ auth-nav-btn elementi bulunamadı, tekrar denenecek...');
        }
    };
    
    // Hemen çalıştır
    console.log('🔧 Auth butonu kurulumu başlatılıyor...');
    console.log('🔍 Document readyState:', document.readyState);
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('📄 DOMContentLoaded - Auth butonu kuruluyor...');
            setTimeout(setupAuthButton, 100); // Biraz bekle
        });
    } else {
        console.log('📄 DOM zaten yüklü - Auth butonu kuruluyor...');
        setTimeout(setupAuthButton, 100); // Biraz bekle
    }
    
    // Load event'inde de çalıştır
    window.addEventListener('load', () => {
        console.log('📄 Load event - Auth butonu kuruluyor...');
        setTimeout(setupAuthButton, 200); // Biraz daha bekle
    });
    
    // Ayrıca bir süre sonra da dene (güvenlik için)
    setTimeout(() => {
        console.log('⏰ Timeout - Auth butonu kuruluyor...');
        setupAuthButton();
    }, 1000);
}

