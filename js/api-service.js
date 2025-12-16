// ============================================
// API SERVICE - Firebase + LocalStorage Fallback
// ============================================

// Backend tipi kontrolü (firebase-config.js'den alınır)
// const BACKEND_TYPE tanımı firebase-config.js'de yapılıyor, burada sadece kullanıyoruz
function getBackendType() {
    return window.BACKEND_TYPE || 'firebase';
}

// Firebase helper fonksiyonları
// firebase-config.js'deki window.getFirebaseAuth ve window.getFirebaseDb fonksiyonlarını kullan
// Sonsuz döngüyü önlemek için direkt window.firebaseAuth ve window.firebaseDb kullanıyoruz
function getFirebaseAuth() {
    // firebase-config.js'de window.firebaseAuth set edilir
    return window.firebaseAuth || null;
}

function getFirebaseDb() {
    // firebase-config.js'de window.firebaseDb set edilir
    return window.firebaseDb || null;
}

// Firestore helper fonksiyonları
async function firestoreGet(collection, docId) {
    // Eğer docId local- ile başlıyorsa, Firebase kullanma (en önce kontrol et)
    // NOT: Firebase Anonymous Authentication kullanıcıları için docId Firebase UID olacak
    if (!docId || String(docId).startsWith('local-')) {
        // LocalStorage kullanıcısı, Firebase kullanma
        return null;
    }
    
    const db = getFirebaseDb();
    if (!db || getBackendType() !== 'firebase') return null;
    
    // Firebase auth kontrolü - eğer kullanıcı Firebase'de giriş yapmamışsa erişme
    const auth = getFirebaseAuth();
    if (auth) {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                return null; // Firebase'de kullanıcı yok, erişme
            }
        } catch (e) {
            return null; // Hata durumunda erişme
        }
    } else {
        return null;
    }
    
    try {
        const { getDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        const docRef = doc(db, collection, docId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
        console.warn(`Firestore get error (${collection}/${docId}):`, error);
        return null;
    }
}

async function firestoreSet(collection, docId, data) {
    // Eğer docId local- ile başlıyorsa, Firebase kullanma (en önce kontrol et)
    if (!docId || String(docId).startsWith('local-')) {
        console.log(`ℹ️ firestoreSet: LocalStorage kullanıcısı (${docId}), Firebase kullanılmıyor`);
        return false; // LocalStorage kullanıcısı, Firebase kullanma
    }
    
    const db = getFirebaseDb();
    if (!db || getBackendType() !== 'firebase') {
        return false;
    }
    
    // Firebase auth kontrolü - eğer kullanıcı Firebase'de giriş yapmamışsa erişme
    const auth = getFirebaseAuth();
    if (auth) {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                console.log('ℹ️ firestoreSet: Firebase\'de kullanıcı yok, erişilmiyor');
                return false; // Firebase'de kullanıcı yok, erişme
            }
        } catch (e) {
            console.log('ℹ️ firestoreSet: Firebase auth kontrolü hatası, erişilmiyor');
            return false; // Hata durumunda erişme
        }
    } else {
        console.log('ℹ️ firestoreSet: Firebase auth yok, erişilmiyor');
        return false;
    }
    
    try {
        const { setDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        const { doc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        const docRef = doc(db, collection, docId);
        await setDoc(docRef, { ...data, updated_at: new Date().toISOString() }, { merge: true });
        return true;
    } catch (error) {
        // Sessizce devam et, hata mesajı gösterme (localStorage kullanıcıları için normal)
        if (!String(docId).startsWith('local-')) {
            console.warn(`Firestore set error (${collection}/${docId}):`, error);
        }
        return false;
    }
}

async function firestoreGetCollection(collection, userId) {
    // Eğer kullanıcı Firebase'de giriş yapmamışsa, Firebase kullanma (en önce kontrol et)
    // NOT: Firebase Anonymous Authentication kullanıcıları için userId Firebase UID olacak
    if (!userId || String(userId).startsWith('local-')) {
        // LocalStorage kullanıcısı, Firebase kullanma
        return [];
    }
    
    const db = getFirebaseDb();
    if (!db || getBackendType() !== 'firebase') return [];
    
    // Firebase auth kontrolü - eğer kullanıcı Firebase'de giriş yapmamışsa erişme
    const auth = getFirebaseAuth();
    if (auth) {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                return []; // Firebase'de kullanıcı yok, erişme
            }
        } catch (e) {
            return []; // Hata durumunda erişme
        }
    } else {
        return [];
    }
    
    try {
        const { getDocs, collection: col, query, where } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        const q = query(col(db, collection), where('user_id', '==', userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.warn(`Firestore getCollection error (${collection}):`, error);
        return [];
    }
}

// Firestore collection helper (subcollection için)
async function firestoreGetSubCollection(collection, userId, subCollection) {
    const db = getFirebaseDb();
    if (!db || getBackendType() !== 'firebase') return [];
    
    try {
        const { getDocs, collection: col, doc: docRef } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        const userDocRef = docRef(db, collection, userId);
        const subColRef = col(userDocRef, subCollection);
        const querySnapshot = await getDocs(subColRef);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.warn(`Firestore getSubCollection error (${collection}/${userId}/${subCollection}):`, error);
        return [];
    }
}

// ============================================
// AUTHENTICATION
// ============================================

/**
 * Kullanıcı kaydı
 */
async function registerUser(email, password, username = null) {
    const auth = getFirebaseAuth();
    
    if (getBackendType() === 'firebase' && auth) {
        try {
            const { createUserWithEmailAndPassword, updateProfile } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Username'i güncelle
            if (username) {
                await updateProfile(user, { displayName: username });
            }
            
            // Kullanıcı profilini Firestore'a kaydet
            const db = getFirebaseDb();
            if (db) {
                await firestoreSet('users', user.uid, {
                    email: email,
                    username: username || email.split('@')[0],
                    created_at: new Date().toISOString()
                });
            }
            
            localStorage.setItem('hasene_user_email', email);
            if (username) {
                localStorage.setItem('hasene_username', username);
            }
            
            return { user: { id: user.uid, email: user.email, username: username || email.split('@')[0] } };
        } catch (error) {
            console.error('Firebase register error:', error);
            throw error;
        }
    }
    
    // Fallback: localStorage
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
    const auth = getFirebaseAuth();
    
    if (getBackendType() === 'firebase' && auth) {
        try {
            const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Kullanıcı profilini yükle
            const userData = await firestoreGet('users', user.uid);
            const username = userData?.username || user.displayName || email.split('@')[0];
            
            localStorage.setItem('hasene_user_email', email);
            localStorage.setItem('hasene_username', username);
            
            return { user: { id: user.uid, email: user.email, username } };
        } catch (error) {
            console.error('Firebase login error:', error);
            throw error;
        }
    }
    
    // Fallback: localStorage
    localStorage.setItem('hasene_user_email', email);
    return { user: { id: 'local-' + Date.now(), email } };
}

/**
 * Google ile giriş (Redirect kullanarak - popup yerine)
 */
async function loginWithGoogle() {
    console.log('🔄 loginWithGoogle fonksiyonu çağrıldı');
    const auth = getFirebaseAuth();
    console.log('🔍 getFirebaseAuth sonucu:', auth ? 'Mevcut' : 'Yok');
    console.log('🔍 Backend Type:', getBackendType());
    
    if (getBackendType() === 'firebase' && auth) {
        console.log('✅ Firebase ve Auth mevcut, Google login başlatılıyor...');
        try {
            const { GoogleAuthProvider, signInWithRedirect, getRedirectResult } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            
            // Önce redirect sonucunu kontrol et (sayfa yenilendikten sonra)
            try {
                const redirectResult = await getRedirectResult(auth);
                if (redirectResult) {
                    console.log('✅ Google redirect sonucu alındı:', redirectResult.user.email);
                    const user = redirectResult.user;
                    
                    // Kullanıcı profilini Firestore'a kaydet
                    const db = getFirebaseDb();
                    if (db) {
                        try {
                            await firestoreSet('users', user.uid, {
                                email: user.email,
                                username: user.displayName || user.email.split('@')[0],
                                created_at: new Date().toISOString()
                            });
                        } catch (firestoreError) {
                            console.warn('⚠️ Firestore kayıt hatası (normal olabilir):', firestoreError);
                        }
                    }
                    
                    localStorage.setItem('hasene_user_email', user.email);
                    localStorage.setItem('hasene_username', user.displayName || user.email.split('@')[0]);
                    
                    return { user: { id: user.uid, email: user.email, username: user.displayName || user.email.split('@')[0] } };
                }
            } catch (redirectError) {
                // Redirect sonucu yoksa veya hata varsa, bu normal (ilk redirect başlatılıyor)
                console.log('ℹ️ Redirect sonucu yok (normal - ilk redirect başlatılıyor):', redirectError.message);
            }
            
            // Redirect sonucu yoksa, redirect başlat
            console.log('🔄 Google redirect başlatılıyor...');
            const provider = new GoogleAuthProvider();
            console.log('🔍 GoogleAuthProvider oluşturuldu');
            
            // Auth domain kontrolü
            console.log('🔍 Auth domain:', auth.app.options.authDomain);
            console.log('🔍 Current URL:', window.location.href);
            console.log('🔍 Current origin:', window.location.origin);
            
            // 404 hatasını görmezden gel (__/firebase/init.json hatası normal)
            const originalError = window.onerror;
            window.onerror = function(msg, url, line, col, error) {
                if (url && url.includes('__/firebase/init.json')) {
                    console.log('ℹ️ Firebase init.json 404 hatası (normal, görmezden geliniyor)');
                    return true; // Hatayı görmezden gel
                }
                if (originalError) {
                    return originalError.apply(this, arguments);
                }
                return false;
            };
            
            try {
                console.log('🔍 signInWithRedirect çağrılıyor - auth:', auth ? 'Mevcut' : 'Yok');
                console.log('🔍 signInWithRedirect çağrılıyor - provider:', provider ? 'Mevcut' : 'Yok');
                
                // signInWithRedirect promise'ini bekliyoruz
                console.log('🔍 signInWithRedirect çağrılıyor...');
                const redirectPromise = signInWithRedirect(auth, provider);
                console.log('🔍 signInWithRedirect promise oluşturuldu');
                
                // Promise'i await et - eğer redirect başarılı olursa sayfa yönlendirilir
                await redirectPromise;
                
                // Eğer buraya geldiysek, redirect başarısız olmuş demektir
                // Çünkü başarılı redirect'te sayfa yönlendirilir ve kod çalışmaz
                console.error('❌ signInWithRedirect promise resolve oldu ama redirect gerçekleşmedi');
                console.error('❌ Sayfa hala aynı yerde, redirect başarısız oldu');
                console.error('❌ Bu genellikle Firebase Console ayarlarından kaynaklanır');
                
                // Error handler'ı geri yükle
                window.onerror = originalError;
                
                // Detaylı hata mesajı
                const errorMsg = 'Google\'a yönlendirme başarısız oldu. Lütfen:\n' +
                    '1. Firebase Console > Authentication > Settings > Authorized domains\'e şu domain\'leri ekleyin:\n' +
                    '   - ' + window.location.hostname + '\n' +
                    '   - localhost\n' +
                    '   - 127.0.0.1\n' +
                    '2. Firebase Console > Authentication > Sign-in method > Google\'ın etkin olduğundan emin olun\n' +
                    '3. Sayfayı yenileyin ve tekrar deneyin';
                
                throw new Error(errorMsg);
            } catch (redirectError) {
                // Error handler'ı geri yükle
                window.onerror = originalError;
                
                console.error('❌ signInWithRedirect hatası:', redirectError);
                console.error('❌ Error code:', redirectError.code);
                console.error('❌ Error message:', redirectError.message);
                console.error('❌ Error stack:', redirectError.stack);
                console.error('❌ Full error object:', redirectError);
                
                // Hata mesajını localStorage'a kaydet (sayfa yenilense bile görünsün)
                localStorage.setItem('hasene_last_auth_error', JSON.stringify({
                    code: redirectError.code,
                    message: redirectError.message,
                    stack: redirectError.stack,
                    timestamp: new Date().toISOString(),
                    type: 'signInWithRedirect'
                }));
                
                throw redirectError;
            }
            
            return null; // Redirect başlatıldı, henüz kullanıcı yok
        } catch (error) {
            // Hata detaylarını kalıcı olarak logla
            console.error('❌ Firebase Google login error:', error);
            console.error('❌ Error code:', error.code);
            console.error('❌ Error message:', error.message);
            console.error('❌ Full error:', JSON.stringify(error, null, 2));
            
            // Hata mesajını localStorage'a kaydet (sayfa yenilense bile görünsün)
            localStorage.setItem('hasene_last_auth_error', JSON.stringify({
                code: error.code,
                message: error.message,
                timestamp: new Date().toISOString()
            }));
            
            throw error;
        }
    }
    
    const error = new Error('Google login not available - Firebase not configured');
    console.error('❌', error.message);
    throw error;
}

/**
 * GitHub ile giriş
 */
async function loginWithGitHub() {
    const auth = getFirebaseAuth();
    
    if (getBackendType() === 'firebase' && auth) {
        try {
            const { GithubAuthProvider, signInWithPopup } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            const provider = new GithubAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            
            // Kullanıcı profilini Firestore'a kaydet
            const db = getFirebaseDb();
            if (db) {
                await firestoreSet('users', user.uid, {
                    email: user.email,
                    username: user.displayName || user.email.split('@')[0],
                    created_at: new Date().toISOString()
                });
            }
            
            localStorage.setItem('hasene_user_email', user.email);
            localStorage.setItem('hasene_username', user.displayName || user.email.split('@')[0]);
            
            return { user: { id: user.uid, email: user.email, username: user.displayName || user.email.split('@')[0] } };
        } catch (error) {
            console.error('Firebase GitHub login error:', error);
            throw error;
        }
    }
    
    throw new Error('GitHub login not available - Firebase not configured');
}

/**
 * Çıkış yap
 */
async function logoutUser() {
    const auth = getFirebaseAuth();
    
    if (getBackendType() === 'firebase' && auth) {
        try {
            const { signOut } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            await signOut(auth);
        } catch (error) {
            console.error('Firebase logout error:', error);
        }
    }
    
    localStorage.removeItem('hasene_user_email');
    localStorage.removeItem('hasene_username');
}

/**
 * Mevcut kullanıcıyı al
 */
async function getCurrentUser() {
    // Önce Firebase auth state'ini kontrol et (anonymous kullanıcılar için önemli)
    const auth = getFirebaseAuth();
    if (getBackendType() === 'firebase' && auth) {
        try {
            // Mevcut Firebase kullanıcısını kontrol et (anonim veya normal)
            const currentUser = auth.currentUser;
            if (currentUser) {
                // Firebase kullanıcısı var (anonymous veya normal)
                const userData = await firestoreGet('users', currentUser.uid);
                const username = userData?.username || currentUser.displayName || localStorage.getItem('hasene_username') || 'Kullanıcı';
                const email = currentUser.email || userData?.email || localStorage.getItem('hasene_user_email') || username + '@local';
                
                // localStorage'ı güncelle
                localStorage.setItem('hasene_user_email', email);
                localStorage.setItem('hasene_username', username);
                localStorage.setItem('hasene_user_id', currentUser.uid);
                
                console.log('✅ getCurrentUser: Firebase kullanıcısı bulundu:', currentUser.uid, username);
                return { id: currentUser.uid, email, username };
            }
            
            // Firebase'de kullanıcı yok, onAuthStateChanged ile bekle
            const { onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            return new Promise((resolve) => {
                // Timeout ekle - eğer 1 saniye içinde cevap gelmezse localStorage'a bak
                const timeout = setTimeout(() => {
                    console.log('⏰ Firebase auth timeout, localStorage\'a bakılıyor...');
                    const localEmail = localStorage.getItem('hasene_user_email');
                    const localUsername = localStorage.getItem('hasene_username');
                    const localId = localStorage.getItem('hasene_user_id');
                    if (localEmail || localUsername || localId) {
                        const finalEmail = localEmail || (localUsername ? localUsername + '@local' : 'user@local');
                        const finalUsername = localUsername || (localEmail ? localEmail.split('@')[0] : 'Kullanıcı');
                        const finalId = localId || 'local-' + Date.now();
                        resolve({ id: finalId, email: finalEmail, username: finalUsername });
                    } else {
                        resolve(null);
                    }
                }, 1000);
                
                const unsubscribe = onAuthStateChanged(auth, async (user) => {
                    clearTimeout(timeout);
                    unsubscribe();
                    if (user) {
                        // Kullanıcı profilini Firestore'dan yükle
                        const userData = await firestoreGet('users', user.uid);
                        const username = userData?.username || user.displayName || localStorage.getItem('hasene_username') || 'Kullanıcı';
                        const email = user.email || userData?.email || localStorage.getItem('hasene_user_email') || username + '@local';
                        
                        localStorage.setItem('hasene_user_email', email);
                        localStorage.setItem('hasene_username', username);
                        localStorage.setItem('hasene_user_id', user.uid);
                        
                        resolve({ id: user.uid, email, username });
                    } else {
                        // Firebase'de kullanıcı yok, localStorage'a bak
                        const localEmail = localStorage.getItem('hasene_user_email');
                        const localUsername = localStorage.getItem('hasene_username');
                        const localId = localStorage.getItem('hasene_user_id');
                        if (localEmail || localUsername || localId) {
                            const finalEmail = localEmail || (localUsername ? localUsername + '@local' : 'user@local');
                            const finalUsername = localUsername || (localEmail ? localEmail.split('@')[0] : 'Kullanıcı');
                            const finalId = localId || 'local-' + Date.now();
                            resolve({ id: finalId, email: finalEmail, username: finalUsername });
                        } else {
                            resolve(null);
                        }
                    }
                });
            });
        } catch (error) {
            console.warn('Firebase getCurrentUser error:', error);
        }
    }
    
    // Fallback: localStorage
    const email = localStorage.getItem('hasene_user_email');
    const username = localStorage.getItem('hasene_username');
    const userId = localStorage.getItem('hasene_user_id');
    
    if (email || username || userId) {
        // Email yoksa username'den oluştur
        const finalEmail = email || (username ? username + '@local' : 'user@local');
        const finalUsername = username || (email ? email.split('@')[0] : 'Kullanıcı');
        const finalUserId = userId || 'local-' + Date.now();
        
        console.log('✅ getCurrentUser: localStorage\'dan kullanıcı bulundu:', finalEmail, finalUsername);
        return { id: finalUserId, email: finalEmail, username: finalUsername };
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
    
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            const stats = await firestoreGet('user_stats', user.id);
            if (stats) {
                // Firestore'dan gelen veriyi localStorage'a da kaydet (senkronizasyon)
                localStorage.setItem('hasene_totalPoints', (stats.total_points || 0).toString());
                localStorage.setItem('hasene_badges', JSON.stringify(stats.badges || { stars: 0, bronze: 0, silver: 0, gold: 0, diamond: 0 }));
                localStorage.setItem('hasene_streakData', JSON.stringify(stats.streak_data || { currentStreak: 0, bestStreak: 0, totalPlayDays: 0 }));
                localStorage.setItem('hasene_gameStats', JSON.stringify(stats.game_stats || { totalCorrect: 0, totalWrong: 0, gameModeCounts: {} }));
                localStorage.setItem('perfectLessonsCount', (stats.perfect_lessons_count || 0).toString());
                
                return {
                    total_points: parseInt(stats.total_points || 0),
                    badges: stats.badges || { stars: 0, bronze: 0, silver: 0, gold: 0, diamond: 0 },
                    streak_data: stats.streak_data || { currentStreak: 0, bestStreak: 0, totalPlayDays: 0 },
                    game_stats: stats.game_stats || { totalCorrect: 0, totalWrong: 0, gameModeCounts: {} },
                    perfect_lessons_count: parseInt(stats.perfect_lessons_count || 0)
                };
            }
        } catch (error) {
            console.warn('Firebase loadUserStats error:', error);
        }
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
    
    // Her durumda localStorage'a kaydet
    localStorage.setItem('hasene_totalPoints', stats.total_points.toString());
    localStorage.setItem('hasene_badges', JSON.stringify(stats.badges));
    localStorage.setItem('hasene_streakData', JSON.stringify(stats.streak_data));
    localStorage.setItem('hasene_gameStats', JSON.stringify(stats.game_stats));
    localStorage.setItem('perfectLessonsCount', stats.perfect_lessons_count.toString());
    
    // Firebase'e de kaydet
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            await firestoreSet('user_stats', user.id, {
                user_id: user.id,
                total_points: stats.total_points,
                badges: stats.badges,
                streak_data: stats.streak_data,
                game_stats: stats.game_stats,
                perfect_lessons_count: stats.perfect_lessons_count
            });
        } catch (error) {
            console.warn('Firebase saveUserStats error:', error);
        }
    }
}

// ============================================
// TASKS API
// ============================================

/**
 * Günlük görevleri yükle
 */
async function loadDailyTasks() {
    const user = await getCurrentUser();
    
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            const data = await firestoreGet('daily_tasks', user.id);
            if (data) {
                // Set'leri geri yükle
                if (data.todayStats) {
                    data.todayStats.allGameModes = new Set(data.todayStats.allGameModes || []);
                    data.todayStats.farklıZorluk = new Set(data.todayStats.farklıZorluk || []);
                    data.todayStats.reviewWords = new Set(data.todayStats.reviewWords || []);
                }
                // localStorage'a da kaydet
                localStorage.setItem('hasene_dailyTasks', JSON.stringify({
                    ...data,
                    todayStats: {
                        ...data.todayStats,
                        allGameModes: Array.from(data.todayStats.allGameModes || []),
                        farklıZorluk: Array.from(data.todayStats.farklıZorluk || []),
                        reviewWords: Array.from(data.todayStats.reviewWords || [])
                    }
                }));
                return data;
            }
        } catch (error) {
            console.warn('Firebase loadDailyTasks error:', error);
        }
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
    const toSave = {
        ...tasks,
        todayStats: {
            ...tasks.todayStats,
            allGameModes: Array.from(tasks.todayStats.allGameModes || []),
            farklıZorluk: Array.from(tasks.todayStats.farklıZorluk || []),
            reviewWords: Array.from(tasks.todayStats.reviewWords || [])
        }
    };
    
    // Her durumda localStorage'a kaydet
    localStorage.setItem('hasene_dailyTasks', JSON.stringify(toSave));
    
    // Firebase'e de kaydet
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            await firestoreSet('daily_tasks', user.id, {
                user_id: user.id,
                ...toSave
            });
        } catch (error) {
            console.warn('Firebase saveDailyTasks error:', error);
        }
    }
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
    const user = await getCurrentUser();
    
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            // word_stats collection'ından tüm kelime istatistiklerini al
            const wordStatsCollection = await firestoreGetCollection('word_stats', user.id);
            const stats = {};
            wordStatsCollection.forEach(item => {
                if (item.word_id && item.stats) {
                    stats[item.word_id] = item.stats;
                }
            });
            // localStorage'a da kaydet
            localStorage.setItem('hasene_wordStats', JSON.stringify(stats));
            return stats;
        } catch (error) {
            console.warn('Firebase loadWordStats error:', error);
        }
    }
    
    // Fallback: localStorage
    return JSON.parse(localStorage.getItem('hasene_wordStats') || '{}');
}

/**
 * Kelime istatistiğini kaydet
 */
async function saveWordStat(wordId, stats) {
    const user = await getCurrentUser();
    
    // Her durumda localStorage'a kaydet
    const allStats = JSON.parse(localStorage.getItem('hasene_wordStats') || '{}');
    allStats[wordId] = stats;
    localStorage.setItem('hasene_wordStats', JSON.stringify(allStats));
    
    // Firebase'e de kaydet
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            const db = getFirebaseDb();
            if (db) {
                const { setDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                const docRef = doc(db, 'word_stats', `${user.id}_${wordId}`);
                await setDoc(docRef, {
                    user_id: user.id,
                    word_id: wordId,
                    stats: stats
                }, { merge: true });
            }
        } catch (error) {
            console.warn('Firebase saveWordStat error:', error);
        }
    }
}

// ============================================
// FAVORITES API
// ============================================

/**
 * Favori kelimeleri yükle
 */
async function loadFavorites() {
    const user = await getCurrentUser();
    
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            const favoritesCollection = await firestoreGetCollection('favorites', user.id);
            const favorites = favoritesCollection.map(item => item.word_id).filter(Boolean);
            // localStorage'a da kaydet
            localStorage.setItem('hasene_favorites', JSON.stringify(favorites));
            return favorites;
        } catch (error) {
            console.warn('Firebase loadFavorites error:', error);
        }
    }
    
    // Fallback: localStorage
    return JSON.parse(localStorage.getItem('hasene_favorites') || '[]');
}

/**
 * Favori kelime ekle
 */
async function addFavorite(wordId) {
    const user = await getCurrentUser();
    
    // Her durumda localStorage'a kaydet
    const favorites = JSON.parse(localStorage.getItem('hasene_favorites') || '[]');
    if (!favorites.includes(wordId)) {
        favorites.push(wordId);
        localStorage.setItem('hasene_favorites', JSON.stringify(favorites));
        
        // Firebase'e de kaydet
        if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
            try {
                const db = getFirebaseDb();
                if (db) {
                    const { setDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                    const docRef = doc(db, 'favorites', `${user.id}_${wordId}`);
                    await setDoc(docRef, {
                        user_id: user.id,
                        word_id: wordId
                    }, { merge: true });
                }
            } catch (error) {
                console.warn('Firebase addFavorite error:', error);
            }
        }
    }
}

/**
 * Favori kelimeyi kaldır
 */
async function removeFavorite(wordId) {
    const user = await getCurrentUser();
    
    // Her durumda localStorage'dan kaldır
    const favorites = JSON.parse(localStorage.getItem('hasene_favorites') || '[]');
    const filtered = favorites.filter(id => id !== wordId);
    localStorage.setItem('hasene_favorites', JSON.stringify(filtered));
    
    // Firebase'den de kaldır
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            const db = getFirebaseDb();
            if (db) {
                const { deleteDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                const docRef = doc(db, 'favorites', `${user.id}_${wordId}`);
                await deleteDoc(docRef);
            }
        } catch (error) {
            console.warn('Firebase removeFavorite error:', error);
        }
    }
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
    const user = await getCurrentUser();
    
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            const achievementsCollection = await firestoreGetCollection('achievements', user.id);
            const achievements = achievementsCollection
                .filter(item => item.achievement_id)
                .map(item => ({
                    id: item.achievement_id,
                    unlockedAt: item.unlocked_at ? new Date(item.unlocked_at).getTime() : Date.now()
                }));
            // localStorage'a da kaydet
            localStorage.setItem('unlockedAchievements', JSON.stringify(achievements));
            return achievements;
        } catch (error) {
            console.warn('Firebase loadAchievements error:', error);
        }
    }
    
    // Fallback: localStorage
    return JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
}

/**
 * Achievement kaydet
 */
async function saveAchievement(achievementId) {
    const user = await getCurrentUser();
    
    // Her durumda localStorage'a kaydet
    const achievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
    const exists = achievements.some(a => {
        if (typeof a === 'string') return a === achievementId;
        return a.id === achievementId;
    });
    if (!exists) {
        achievements.push({ id: achievementId, unlockedAt: Date.now() });
        localStorage.setItem('unlockedAchievements', JSON.stringify(achievements));
        
        // Firebase'e de kaydet
        if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
            try {
                const db = getFirebaseDb();
                if (db) {
                    const { setDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                    const docRef = doc(db, 'achievements', `${user.id}_${achievementId}`);
                    await setDoc(docRef, {
                        user_id: user.id,
                        achievement_id: achievementId,
                        unlocked_at: new Date().toISOString()
                    }, { merge: true });
                }
            } catch (error) {
                console.warn('Firebase saveAchievement error:', error);
            }
        }
    }
}

// ============================================
// BADGES API
// ============================================

/**
 * Badges yükle
 */
async function loadBadges() {
    const user = await getCurrentUser();
    
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            const badgesCollection = await firestoreGetCollection('badges', user.id);
            const badges = badgesCollection
                .filter(item => item.badge_id)
                .map(item => ({
                    id: item.badge_id,
                    unlockedAt: item.unlocked_at ? new Date(item.unlocked_at).getTime() : Date.now()
                }));
            // localStorage'a da kaydet
            localStorage.setItem('unlockedBadges', JSON.stringify(badges));
            return badges;
        } catch (error) {
            console.warn('Firebase loadBadges error:', error);
        }
    }
    
    // Fallback: localStorage
    return JSON.parse(localStorage.getItem('unlockedBadges') || '[]');
}

/**
 * Badge kaydet
 */
async function saveBadge(badgeId) {
    const user = await getCurrentUser();
    
    // Her durumda localStorage'a kaydet
    const badges = JSON.parse(localStorage.getItem('unlockedBadges') || '[]');
    const exists = badges.some(b => {
        if (typeof b === 'string') return b === badgeId;
        return b.id === badgeId;
    });
    if (!exists) {
        badges.push({ id: badgeId, unlockedAt: Date.now() });
        localStorage.setItem('unlockedBadges', JSON.stringify(badges));
        
        // Firebase'e de kaydet
        if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
            try {
                const db = getFirebaseDb();
                if (db) {
                    const { setDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                    const docRef = doc(db, 'badges', `${user.id}_${badgeId}`);
                    await setDoc(docRef, {
                        user_id: user.id,
                        badge_id: badgeId,
                        unlocked_at: new Date().toISOString()
                    }, { merge: true });
                }
            } catch (error) {
                console.warn('Firebase saveBadge error:', error);
            }
        }
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
