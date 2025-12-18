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

async function firestoreGetCollection(collection, userId, username = null) {
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
        const { getDocs, collection: col, query, where, or } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        // Eğer userId null ise, tüm collection'ı getir (leaderboard için)
        if (!userId) {
            const q = query(col(db, collection));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        
        // Eğer kullanıcı local- ile başlıyorsa, Firebase kullanma
        if (String(userId).startsWith('local-')) {
            return [];
        }
        
        // Hem user_id hem de username field'larına göre sorgula (geriye dönük uyumluluk)
        let q;
        if (username) {
            // Username varsa, hem user_id hem de username'e göre sorgula
            q = query(
                col(db, collection),
                or(
                    where('user_id', '==', userId),
                    where('username', '==', username)
                )
            );
        } else {
            // Username yoksa, sadece user_id'ye göre sorgula
            q = query(col(db, collection), where('user_id', '==', userId));
        }
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.warn(`Firestore getCollection error (${collection}):`, error);
        return [];
    }
}

// Firestore collection helper (subcollection için)
async function firestoreGetSubCollection(collection, userId, subCollection, username = null) {
    const db = getFirebaseDb();
    if (!db || getBackendType() !== 'firebase') return [];
    
    try {
        const { getDocs, collection: col, doc: docRef } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        // Username varsa önce username ile dene, yoksa userId ile
        let userDocRef = null;
        if (username) {
            const cleanUsername = username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500);
            try {
                userDocRef = docRef(db, collection, cleanUsername);
                const subColRef = col(userDocRef, subCollection);
                const querySnapshot = await getDocs(subColRef);
                if (!querySnapshot.empty) {
                    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                }
            } catch (err) {
                console.warn('⚠️ firestoreGetSubCollection: Username ile yükleme hatası, UID ile deneniyor:', err);
            }
        }
        
        // Username ile bulunamadıysa veya username yoksa, userId ile dene (geriye dönük uyumluluk)
        userDocRef = docRef(db, collection, userId);
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
            
            // Kullanıcı profilini Firestore'a kaydet (username'i doküman ID'si olarak kullan)
            const db = getFirebaseDb();
            if (db) {
                const finalUsername = username || email.split('@')[0];
                // Username'i Firestore doküman ID'si için temizle
                const cleanUsername = finalUsername.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500);
                
                await firestoreSet('users', cleanUsername, {
                    email: email,
                    username: finalUsername,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    auth_type: 'email',
                    firebase_uid: user.uid // Firebase UID'yi de sakla (gerekirse)
                });
                console.log('✅ Email kayıt: Kullanıcı profili Firestore\'a kaydedildi (Doküman ID:', cleanUsername + ', Username:', finalUsername + ')');
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
            
            // Kullanıcı profilini yükle (önce username ile kontrol et, yoksa UID ile)
            let userData = null;
            const emailUsername = email.split('@')[0];
            const cleanEmailUsername = emailUsername.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500);
            
            // Önce username ile kontrol et (yeni sistem)
            try {
                userData = await firestoreGet('users', cleanEmailUsername);
            } catch (err) {
                console.warn('⚠️ loginUser: Username ile yükleme hatası, UID ile deneniyor:', err);
            }
            
            // Username ile bulunamadıysa, eski UID ile kontrol et (geriye dönük uyumluluk)
            if (!userData) {
                userData = await firestoreGet('users', user.uid);
            }
            
            const username = userData?.username || user.displayName || emailUsername;
            
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
                    
                    // Kullanıcı profilini Firestore'a kaydet (username'i doküman ID'si olarak kullan)
                    const db = getFirebaseDb();
                    if (db) {
                        try {
                            const username = user.displayName || user.email.split('@')[0];
                            // Username'i Firestore doküman ID'si için temizle
                            const cleanUsername = username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500);
                            
                            await firestoreSet('users', cleanUsername, {
                                email: user.email,
                                username: username,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                                auth_type: 'google',
                                firebase_uid: user.uid // Firebase UID'yi de sakla (gerekirse)
                            });
                            console.log('✅ Google login: Kullanıcı profili Firestore\'a kaydedildi (Doküman ID:', cleanUsername + ', Username:', username + ')');
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
            
            // Kullanıcı profilini Firestore'a kaydet (username'i doküman ID'si olarak kullan)
            const db = getFirebaseDb();
            if (db) {
                const username = user.displayName || user.email.split('@')[0];
                // Username'i Firestore doküman ID'si için temizle
                const cleanUsername = username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500);
                
                await firestoreSet('users', cleanUsername, {
                    email: user.email,
                    username: username,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    auth_type: 'github',
                    firebase_uid: user.uid // Firebase UID'yi de sakla (gerekirse)
                });
                console.log('✅ GitHub login: Kullanıcı profili Firestore\'a kaydedildi (Doküman ID:', cleanUsername + ', Username:', username + ')');
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
            console.log('✅ Firebase signOut başarılı');
        } catch (error) {
            console.error('Firebase logout error:', error);
        }
    }

    // Email'i temizle (UI için)
    localStorage.removeItem('hasene_user_email');
    
    // ÖNEMLİ: hasene_username ve hasene_user_id'yi SİLME - tekrar giriş yapınca aynı kullanıcıyı bulabilmek için
    // localStorage.removeItem('hasene_username'); // SİLME! (getCurrentUser için gerekli)
    // localStorage.removeItem('hasene_user_id'); // SİLME! (getCurrentUser için gerekli)
    console.log('ℹ️ hasene_user_id ve hasene_username korundu (tekrar giriş için):', {
        userId: localStorage.getItem('hasene_user_id'),
        username: localStorage.getItem('hasene_username')
    });
}

/**
 * Mevcut kullanıcıyı al
 */
async function getCurrentUser() {
    console.log('🔍 getCurrentUser() çağrıldı');
    
    // ÖNCE localStorage'da hasene_user_id var mı kontrol et (çıkış yapınca korunur)
    let savedUserId = localStorage.getItem('hasene_user_id');
    let savedUsername = localStorage.getItem('hasene_username');
    let savedEmail = localStorage.getItem('hasene_user_email');
    
    // 'null' string'ini temizle (localStorage bazen 'null' string'i kaydeder)
    if (savedEmail === 'null' || savedEmail === null) savedEmail = null;
    if (savedUsername === 'null' || savedUsername === null) savedUsername = null;
    if (savedUserId === 'null' || savedUserId === null) savedUserId = null;
    
    console.log('🔍 localStorage durumu:', {
        hasene_user_id: savedUserId,
        hasene_username: savedUsername,
        hasene_user_email: savedEmail
    });
    
    // Eğer localStorage'da Firebase UID varsa (local- ile başlamıyorsa), ÖNCE ONU KULLAN
    // Bu çok önemli - çıkış yapıp tekrar giriş yapınca eski UID'yi kullanmak için
    // NOT: savedUsername yoksa da UID varsa kullan (username sonra set edilebilir)
    if (savedUserId && !savedUserId.startsWith('local-')) {
        console.log('✅ localStorage\'da mevcut Firebase UID bulundu, öncelikli kullanılıyor:', savedUserId);
        
        // Firestore kontrolü yapmadan direkt döndür (daha hızlı ve güvenilir)
        // localStorage'da UID varsa, o UID'yi kullan (Firestore'da veriler o UID'de)
        const username = savedUsername || (savedEmail && savedEmail !== 'null' ? savedEmail.split('@')[0] : 'Kullanıcı');
        const email = savedEmail && savedEmail !== 'null' ? savedEmail : username + '@local';
        
        // localStorage'ı güncelle (tutarlılık için)
        localStorage.setItem('hasene_user_email', email);
        localStorage.setItem('hasene_username', username);
        localStorage.setItem('hasene_user_id', savedUserId); // ESKİ UID'yi koru!
        
        console.log('✅ getCurrentUser: localStorage\'dan Firebase UID bulundu (öncelikli, Firestore kontrolü yok):', {
            id: savedUserId,
            username: username,
            email: email
        });
        return { id: savedUserId, email, username };
    }
    
    console.log('⚠️ localStorage\'da Firebase UID yok veya local- ile başlıyor:', savedUserId);
    
    // Firebase auth state'ini kontrol et (sadece localStorage'da UID yoksa)
    const auth = getFirebaseAuth();
    if (getBackendType() === 'firebase' && auth) {
        try {
            // Mevcut Firebase kullanıcısını kontrol et (anonim veya normal)
            const currentUser = auth.currentUser;
            if (currentUser) {
                // Firebase kullanıcısı var (anonymous veya normal)
                // Ama önce localStorage'da eski UID var mı kontrol et
                const localUserId = localStorage.getItem('hasene_user_id');
                if (localUserId && !localUserId.startsWith('local-') && localUserId !== currentUser.uid) {
                    // localStorage'da farklı bir UID var, onu kullan (eski kullanıcı)
                    console.log('⚠️ Firebase auth\'da yeni UID var ama localStorage\'da eski UID var, eski UID kullanılıyor:', {
                        firebaseUID: currentUser.uid,
                        localStorageUID: localUserId
                    });
                    let localUsername = localStorage.getItem('hasene_username');
                    let localEmail = localStorage.getItem('hasene_user_email');
                    // 'null' string'ini temizle
                    if (localEmail === 'null' || localEmail === null) localEmail = null;
                    if (localUsername === 'null' || localUsername === null) localUsername = null;
                    const finalUsername = localUsername || 'Kullanıcı';
                    const finalEmail = localEmail || finalUsername + '@local';
                    return { id: localUserId, email: finalEmail, username: finalUsername };
                }
                
                // Normal durum: Firebase auth'dan UID kullan
                // ÖNEMLİ: Önce localStorage'dan username al (kullanıcı YZOKUMUS ile giriş yaptıysa burada olmalı)
                let localUsername = localStorage.getItem('hasene_username');
                let localEmail = localStorage.getItem('hasene_user_email');
                // 'null' string'ini temizle
                if (localEmail === 'null' || localEmail === null) localEmail = null;
                if (localUsername === 'null' || localUsername === null) localUsername = null;
                
                let userData = null;
                try {
                    userData = await firestoreGet('users', currentUser.uid);
                } catch (err) {
                    console.warn('⚠️ getCurrentUser: Firestore\'dan kullanıcı verisi yüklenemedi, localStorage kullanılıyor:', err);
                }
                
                // Username ve email'i belirle (öncelik: localStorage > Firestore > Firebase Auth)
                const username = localUsername || userData?.username || currentUser.displayName || 'Kullanıcı';
                const email = localEmail || currentUser.email || userData?.email || username + '@local';
                
                // Eğer localStorage'da username varsa ve Firebase'de farklıysa, Firebase'i güncelle
                if (localUsername && localUsername !== 'Kullanıcı' && userData?.username !== localUsername) {
                    try {
                        await firestoreSet('users', currentUser.uid, {
                            ...userData,
                            username: localUsername
                        });
                        console.log('✅ getCurrentUser: Firebase username güncellendi:', { eski: userData?.username, yeni: localUsername });
                    } catch (err) {
                        console.warn('⚠️ getCurrentUser: Firebase username güncelleme hatası:', err);
                    }
                }
                
                // localStorage'ı güncelle (ÖNEMLİ: Firestore başarısız olsa bile localStorage'a kaydet!)
                localStorage.setItem('hasene_user_email', email);
                localStorage.setItem('hasene_username', username);
                localStorage.setItem('hasene_user_id', currentUser.uid);
                
                console.log('✅ getCurrentUser: Firebase kullanıcısı bulundu:', currentUser.uid, username);
                return { id: currentUser.uid, email, username };
            }
            
            // Firebase'de kullanıcı yok, onAuthStateChanged ile bekle
            const { onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            const promiseResult = await new Promise((resolve) => {
                // Timeout ekle - eğer 1 saniye içinde cevap gelmezse localStorage'a bak
                const timeout = setTimeout(() => {
                    console.log('⏰ Firebase auth timeout, localStorage\'a bakılıyor...');
                    let localEmail = localStorage.getItem('hasene_user_email');
                    let localUsername = localStorage.getItem('hasene_username');
                    let localId = localStorage.getItem('hasene_user_id');
                    // 'null' string'ini temizle
                    if (localEmail === 'null' || localEmail === null) localEmail = null;
                    if (localUsername === 'null' || localUsername === null) localUsername = null;
                    if (localId === 'null' || localId === null) localId = null;
                    if (localEmail || localUsername || localId) {
                        const finalEmail = localEmail || (localUsername ? localUsername + '@local' : 'user@local');
                        const finalUsername = localUsername || (localEmail && localEmail !== 'null' ? localEmail.split('@')[0] : 'Kullanıcı');
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
                        let localUsername = localStorage.getItem('hasene_username');
                        let localEmail = localStorage.getItem('hasene_user_email');
                        // 'null' string'ini temizle
                        if (localEmail === 'null' || localEmail === null) localEmail = null;
                        if (localUsername === 'null' || localUsername === null) localUsername = null;
                        const username = userData?.username || user.displayName || localUsername || 'Kullanıcı';
                        const email = user.email || userData?.email || localEmail || username + '@local';
                        
                        localStorage.setItem('hasene_user_email', email);
                        localStorage.setItem('hasene_username', username);
                        localStorage.setItem('hasene_user_id', user.uid);
                        
                        resolve({ id: user.uid, email, username });
                    } else {
                        // Firebase'de kullanıcı yok, localStorage'a bak
                        let localEmail = localStorage.getItem('hasene_user_email');
                        let localUsername = localStorage.getItem('hasene_username');
                        let localId = localStorage.getItem('hasene_user_id');
                        // 'null' string'ini temizle
                        if (localEmail === 'null' || localEmail === null) localEmail = null;
                        if (localUsername === 'null' || localUsername === null) localUsername = null;
                        if (localId === 'null' || localId === null) localId = null;
                        if (localEmail || localUsername || localId) {
                            const finalEmail = localEmail || (localUsername ? localUsername + '@local' : 'user@local');
                            const finalUsername = localUsername || (localEmail && localEmail !== 'null' ? localEmail.split('@')[0] : 'Kullanıcı');
                            const finalId = localId || 'local-' + Date.now();
                            resolve({ id: finalId, email: finalEmail, username: finalUsername });
                        } else {
                            resolve(null);
                        }
                    }
                });
            });
            
            // Promise sonucunu döndür
            if (promiseResult) {
                return promiseResult;
            }
        } catch (error) {
            console.warn('Firebase getCurrentUser error:', error);
            // Hata olsa bile fallback'e devam et
        }
    }
    
    // Fallback: localStorage
    let email = localStorage.getItem('hasene_user_email');
    let username = localStorage.getItem('hasene_username');
    let userId = localStorage.getItem('hasene_user_id');
    
    // 'null' string'ini temizle (localStorage bazen 'null' string'i kaydeder)
    if (email === 'null' || email === null) email = null;
    if (username === 'null' || username === null) username = null;
    if (userId === 'null' || userId === null) userId = null;
    
    console.log('🔍 getCurrentUser fallback kontrolü:', {
        email: email,
        username: username,
        userId: userId
    });
    
    if (email || username || userId) {
        // Email yoksa username'den oluştur
        const finalEmail = email || (username ? username + '@local' : 'user@local');
        const finalUsername = username || (email && email !== 'null' ? email.split('@')[0] : 'Kullanıcı');
        const finalUserId = userId || 'local-' + Date.now();
        
        console.log('✅ getCurrentUser: localStorage\'dan kullanıcı bulundu (fallback):', {
            id: finalUserId,
            email: finalEmail,
            username: finalUsername
        });
        return { id: finalUserId, email: finalEmail, username: finalUsername };
    }
    
    console.log('❌ getCurrentUser: Hiçbir koşul sağlanmadı, localStorage\'da da veri yok, null döndürülüyor');
    return null;
}

// ============================================
// HELPER FUNCTIONS - Username'i doküman ID'si olarak kullan
// ============================================

/**
 * Kullanıcı için doküman ID'sini döndürür (username temizlenmiş hali)
 * Geriye dönük uyumluluk için önce username'e göre kontrol eder, yoksa UID'ye göre kontrol eder
 */
async function getUserDocumentId(user) {
    if (!user || !user.username) {
        // Username yoksa, eski UID'yi kullan (geriye dönük uyumluluk)
        return user?.id || null;
    }
    
    // Username'i Firestore doküman ID'si için temizle
    const cleanUsername = user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500);
    
    // Eğer Firebase kullanılıyorsa, önce username'e göre kontrol et
    if (getBackendType() === 'firebase' && user.id && !user.id.startsWith('local-')) {
        const db = getFirebaseDb();
        if (db) {
            try {
                const { getDoc, doc, collection: col } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                
                // Önce username ile kontrol et (yeni sistem)
                const usernameDocRef = doc(col(db, 'users'), cleanUsername);
                const usernameDocSnap = await getDoc(usernameDocRef);
                
                if (usernameDocSnap.exists()) {
                    // Username ile doküman bulundu, username kullan
                    return cleanUsername;
                }
                
                // Username ile bulunamadı, eski UID ile kontrol et (geriye dönük uyumluluk)
                const uidDocRef = doc(col(db, 'users'), user.id);
                const uidDocSnap = await getDoc(uidDocRef);
                
                if (uidDocSnap.exists()) {
                    // Eski UID ile doküman var, ama yeni sistemde username kullanılacak
                    // Eski dokümanı username'e migrate et (opsiyonel - şimdilik UID kullan)
                    console.log('ℹ️ Eski UID dokümanı bulundu, username\'e migrate edilebilir:', user.id, '->', cleanUsername);
                    // Şimdilik UID kullan (migration yapılmadı)
                    return user.id;
                }
            } catch (err) {
                console.warn('⚠️ getUserDocumentId: Doküman kontrolü hatası, username kullanılacak:', err);
            }
        }
    }
    
    // Username kullan (yeni sistem)
    return cleanUsername;
}

// ============================================
// USER STATS API
// ============================================

/**
 * Kullanıcı istatistiklerini yükle
 */
async function loadUserStats() {
    const user = await getCurrentUser();
    
    console.log('📥 loadUserStats çağrıldı:', {
        user: user ? { id: user.id, username: user.username } : null,
        backendType: getBackendType()
    });
    
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            // Doküman ID'sini al (username veya UID)
            const docId = await getUserDocumentId(user);
            
            console.log('🔥 Firebase\'den yükleniyor:', {
                collection: 'user_stats',
                docId: docId,
                username: user.username
            });
            
            // Önce username ile kontrol et (ama "Kullanıcı" default değerini atla)
            let stats = null;
            if (user.username && user.username !== 'Kullanıcı') {
                const cleanUsername = user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500);
                stats = await firestoreGet('user_stats', cleanUsername);
                console.log('🔍 Username ile arama:', { cleanUsername, found: !!stats });
            }
            
            // Username ile bulunamadıysa, eski UID ile kontrol et (geriye dönük uyumluluk)
            if (!stats && user.id && !user.id.startsWith('local-')) {
                stats = await firestoreGet('user_stats', user.id);
                console.log('🔍 UID ile arama:', { userId: user.id, found: !!stats });
            }
            
            // Eğer hala bulunamadıysa, docId ile dene
            if (!stats && docId && docId !== user.id && docId !== (user.username ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) : null)) {
                stats = await firestoreGet('user_stats', docId);
                console.log('🔍 docId ile arama:', { docId, found: !!stats });
            }
            if (stats) {
                console.log('✅ Firebase\'den veri yüklendi:', {
                    docId: docId,
                    username: user.username,
                    total_points: stats.total_points
                });
                // Firestore'dan gelen veriyi localStorage'a da kaydet (senkronizasyon)
                const totalPoints = parseInt(stats.total_points || 0);
                const badgesData = stats.badges || { stars: 0, bronze: 0, silver: 0, gold: 0, diamond: 0 };
                const streakData = stats.streak_data || { currentStreak: 0, bestStreak: 0, totalPlayDays: 0 };
                const gameStatsData = stats.game_stats || { totalCorrect: 0, totalWrong: 0, gameModeCounts: {} };
                const perfectLessons = parseInt(stats.perfect_lessons_count || 0);
                
                localStorage.setItem('hasene_totalPoints', totalPoints.toString());
                localStorage.setItem('hasene_badges', JSON.stringify(badgesData));
                localStorage.setItem('hasene_streakData', JSON.stringify(streakData));
                localStorage.setItem('hasene_gameStats', JSON.stringify(gameStatsData));
                localStorage.setItem('perfectLessonsCount', perfectLessons.toString());
                
                console.log('✅ Firebase\'den localStorage\'a kaydedildi:', {
                    totalPoints: totalPoints,
                    badges: badgesData,
                    streak: streakData,
                    gameStats: gameStatsData,
                    perfectLessons: perfectLessons
                });
                
                // Global değişkenleri güncelle (game-core.js'deki değişkenler)
                if (typeof window !== 'undefined') {
                    // totalPoints'i güncelle
                    if (typeof window.totalPoints !== 'undefined') {
                        window.totalPoints = totalPoints;
                    }
                    // badges'i güncelle
                    if (typeof window.badges !== 'undefined') {
                        window.badges = badgesData;
                    }
                    // streakData'yı güncelle
                    if (typeof window.streakData !== 'undefined') {
                        window.streakData = streakData;
                    }
                    // gameStats'i güncelle
                    if (typeof window.gameStats !== 'undefined') {
                        window.gameStats = gameStatsData;
                    }
                    // perfectLessonsCount'u güncelle
                    if (typeof window.perfectLessonsCount !== 'undefined') {
                        window.perfectLessonsCount = perfectLessons;
                    }
                }
                
                // UI'ı güncelle (localStorage'dan okuyacak, çünkü zaten kaydedildi)
                // NOT: updateStatsBar() totalPoints, badges gibi global değişkenleri kullanıyor
                // Bu değişkenler loadStats() içinde localStorage'dan yükleniyor
                // Bu yüzden loadStats() çağrılmalı, ama sonsuz döngü olmaması için
                // sadece localStorage'dan yükleme yapılmalı (Firebase'den yükleme yapılmamalı)
                
                // Event gönder (game-core.js'deki loadStats() dinleyebilir)
                if (typeof window.dispatchEvent === 'function') {
                    try {
                        window.dispatchEvent(new CustomEvent('userStatsLoaded', {
                            detail: {
                                totalPoints: totalPoints,
                                badges: badgesData,
                                streakData: streakData,
                                gameStats: gameStatsData,
                                perfectLessons: perfectLessons
                            }
                        }));
                        console.log('✅ userStatsLoaded event gönderildi');
                    } catch (eventError) {
                        console.warn('⚠️ Event gönderme hatası:', eventError);
                    }
                }
                
                // UI'ı güncelle (localStorage'dan okuyacak)
                // setTimeout ile biraz bekle (loadStats() tamamlanması için)
                setTimeout(() => {
                    if (typeof window.updateStatsBar === 'function') {
                        try {
                            window.updateStatsBar();
                            console.log('✅ UI güncellendi (updateStatsBar)');
                        } catch (uiError) {
                            console.warn('⚠️ UI güncelleme hatası:', uiError);
                        }
                    }
                    if (typeof window.updateStreakDisplay === 'function') {
                        try {
                            window.updateStreakDisplay();
                            console.log('✅ Streak UI güncellendi');
                        } catch (uiError) {
                            console.warn('⚠️ Streak UI güncelleme hatası:', uiError);
                        }
                    }
                    if (typeof window.updateDailyGoalDisplay === 'function') {
                        try {
                            window.updateDailyGoalDisplay();
                            console.log('✅ Daily Goal UI güncellendi');
                        } catch (uiError) {
                            console.warn('⚠️ Daily Goal UI güncelleme hatası:', uiError);
                        }
                    }
                }, 100);
                
                // Muvaffakiyetleri (achievements) yükle
                try {
                    const cleanUsername = user.username && user.username !== 'Kullanıcı'
                        ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500)
                        : docId;
                    const achievements = await firestoreGet('user_achievements', cleanUsername);
                    if (achievements && achievements.unlocked_badges) {
                        // unlockedBadges'i localStorage'a kaydet
                        localStorage.setItem('unlockedBadges', JSON.stringify(achievements.unlocked_badges));
                        // window'a da export et (game-core.js'de kullanılabilmesi için)
                        if (typeof window !== 'undefined') {
                            window.unlockedBadges = achievements.unlocked_badges;
                        }
                        console.log('✅ Muvaffakiyetler Firebase\'den yüklendi:', {
                            docId: cleanUsername,
                            badge_count: achievements.unlocked_badges.length
                        });
                    }
                } catch (achievementError) {
                    console.warn('⚠️ Muvaffakiyetler yüklenemedi (normal olabilir):', achievementError);
                }
                
                // Basit raporu yükle (opsiyonel - sadece rapor için)
                try {
                    const cleanUsername = user.username && user.username !== 'Kullanıcı'
                        ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500)
                        : docId;
                    const report = await firestoreGet('user_reports', cleanUsername);
                    if (report) {
                        console.log('✅ Basit rapor Firebase\'den yüklendi:', {
                            docId: cleanUsername,
                            username: report.username,
                            toplam_hasene: report.toplam_hasene,
                            yildiz: report.yildiz,
                            mertebe: report.mertebe,
                            seri: report.seri
                        });
                    }
                } catch (reportError) {
                    console.warn('⚠️ Basit rapor yüklenemedi (normal olabilir):', reportError);
                }
                
                return {
                    total_points: parseInt(stats.total_points || 0),
                    badges: stats.badges || { stars: 0, bronze: 0, silver: 0, gold: 0, diamond: 0 },
                    streak_data: stats.streak_data || { currentStreak: 0, bestStreak: 0, totalPlayDays: 0 },
                    game_stats: stats.game_stats || { totalCorrect: 0, totalWrong: 0, gameModeCounts: {} },
                    perfect_lessons_count: parseInt(stats.perfect_lessons_count || 0)
                };
            } else {
                console.log('ℹ️ Firebase\'de veri bulunamadı (yeni kullanıcı olabilir):', docId || user.id);
            }
        } catch (error) {
            console.error('❌ Firebase loadUserStats error:', error);
        }
    }
    
    // Fallback: localStorage
    console.log('📦 localStorage\'dan yükleniyor (Firebase\'den yüklenemedi)');
    const localPoints = parseInt(localStorage.getItem('hasene_totalPoints') || '0');
    console.log('📦 localStorage totalPoints:', localPoints);
    
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
    
    console.log('💾 saveUserStats çağrıldı:', {
        user: user ? { id: user.id, username: user.username } : null,
        total_points: stats.total_points,
        backendType: getBackendType()
    });
    
    // Her durumda localStorage'a kaydet
    localStorage.setItem('hasene_totalPoints', stats.total_points.toString());
    localStorage.setItem('hasene_badges', JSON.stringify(stats.badges));
    localStorage.setItem('hasene_streakData', JSON.stringify(stats.streak_data));
    localStorage.setItem('hasene_gameStats', JSON.stringify(stats.game_stats));
    localStorage.setItem('perfectLessonsCount', stats.perfect_lessons_count.toString());
    
    // Firebase'e de kaydet (username'i doküman ID'si olarak kullan)
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            // Username'i doküman ID'si olarak kullan (ama "Kullanıcı" default değerini atla)
            const docId = (user.username && user.username !== 'Kullanıcı') 
                ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
                : user.id;
            
            console.log('🔥 Firebase\'e kaydediliyor:', {
                collection: 'user_stats',
                docId: docId,
                username: user.username,
                total_points: stats.total_points
            });
            
            // Firebase auth'dan gerçek UID'yi al
            const auth = getFirebaseAuth();
            const firebaseUid = auth?.currentUser?.uid || null;
            
            await firestoreSet('user_stats', docId, {
                user_id: user.id,
                username: user.username || (user.email ? user.email.split('@')[0] : 'Kullanıcı'),
                firebase_uid: firebaseUid, // Firestore rules için gerekli
                total_points: stats.total_points,
                badges: stats.badges,
                streak_data: stats.streak_data,
                game_stats: stats.game_stats,
                perfect_lessons_count: stats.perfect_lessons_count
            });
            
            // Basit rapor collection'ına kaydet
            try {
                console.log('📊 Basit rapor kaydediliyor...', {
                    docId: docId,
                    total_points: stats.total_points,
                    badges: stats.badges,
                    streak_data: stats.streak_data
                });
                
                // Level (mertebe) hesapla
                let level = 1;
                let levelName = 'Başlangıç';
                if (typeof window.calculateLevel === 'function') {
                    level = window.calculateLevel(stats.total_points);
                    console.log('📊 Level hesaplandı:', level);
                } else {
                    console.warn('⚠️ window.calculateLevel fonksiyonu bulunamadı');
                }
                if (typeof window.getLevelName === 'function') {
                    levelName = window.getLevelName(level);
                    console.log('📊 Level adı:', levelName);
                } else {
                    console.warn('⚠️ window.getLevelName fonksiyonu bulunamadı');
                }
                
                // Yıldız sayısı (badges.stars)
                const stars = stats.badges?.stars || 0;
                
                // Seri (streak)
                const streak = stats.streak_data?.currentStreak || 0;
                
                const reportData = {
                    user_id: user.id,
                    username: user.username || (user.email ? user.email.split('@')[0] : 'Kullanıcı'),
                    firebase_uid: firebaseUid,
                    toplam_hasene: stats.total_points,
                    yildiz: stars,
                    mertebe: level,
                    mertebe_adi: levelName,
                    seri: streak,
                    updated_at: new Date().toISOString()
                };
                
                console.log('📊 Rapor verisi hazırlandı:', reportData);
                
                const result = await firestoreSet('user_reports', docId, reportData);
                
                if (result) {
                    console.log('✅ Basit rapor Firebase\'e başarıyla kaydedildi:', {
                        collection: 'user_reports',
                        docId: docId,
                        username: user.username,
                        toplam_hasene: stats.total_points,
                        yildiz: stars,
                        mertebe: level,
                        mertebe_adi: levelName,
                        seri: streak
                    });
                } else {
                    console.error('❌ Basit rapor Firebase\'e kaydedilemedi - firestoreSet false döndü');
                }
            } catch (reportError) {
                console.error('❌ Basit rapor kaydetme hatası:', reportError);
                console.error('❌ Hata detayı:', {
                    message: reportError.message,
                    stack: reportError.stack,
                    name: reportError.name
                });
            }
            
            // Muvaffakiyetler (achievements) için ayrı collection'a kaydet
            // Eğer unlockedBadges varsa kaydet
            if (typeof window.unlockedBadges !== 'undefined' && Array.isArray(window.unlockedBadges) && window.unlockedBadges.length > 0) {
                try {
                    await firestoreSet('user_achievements', docId, {
                        user_id: user.id,
                        username: user.username || (user.email ? user.email.split('@')[0] : 'Kullanıcı'),
                        firebase_uid: firebaseUid,
                        unlocked_badges: window.unlockedBadges.map(badge => ({
                            id: typeof badge === 'string' ? badge : badge.id,
                            unlocked_at: typeof badge === 'object' && badge.unlockedAt ? badge.unlockedAt : Date.now(),
                            badge_type: typeof badge === 'object' && badge.badge_type ? badge.badge_type : null
                        })),
                        updated_at: new Date().toISOString()
                    });
                    console.log('✅ Muvaffakiyetler Firebase\'e kaydedildi:', {
                        docId: docId,
                        badge_count: window.unlockedBadges.length
                    });
                } catch (achievementError) {
                    console.warn('⚠️ Muvaffakiyetler kaydedilemedi:', achievementError);
                }
            }
            
            console.log('✅ Firebase\'e başarıyla kaydedildi:', {
                docId: docId,
                username: user.username,
                total_points: stats.total_points
            });
        } catch (error) {
            console.error('❌ Firebase saveUserStats error:', error);
        }
    } else {
        console.warn('⚠️ Firebase\'e kaydedilmedi:', {
            backendType: getBackendType(),
            user: user ? { id: user.id, isLocal: user.id.startsWith('local-') } : null
        });
    }
}

// ============================================
// AUTO CREATE COLLECTIONS - Otomatik Collection Oluşturma
// ============================================

/**
 * Tüm gerekli collection'ları otomatik oluşturur (eğer yoksa)
 * Giriş yapıldığında veya sayfa yüklendiğinde çağrılır
 */
async function autoCreateCollections() {
    try {
        const user = await getCurrentUser();
        if (!user || !user.id || user.id.startsWith('local-')) {
            // LocalStorage kullanıcısı, Firebase collection'ları oluşturma
            return;
        }
        
        const docId = (user.username && user.username !== 'Kullanıcı') 
            ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
            : user.id;
        
        const auth = getFirebaseAuth();
        const firebaseUid = auth?.currentUser?.uid || null;
        
        // Collection'ları kontrol et ve oluştur (sadece yoksa)
        const collections = [
            {
                name: 'user_stats',
                data: {
                    user_id: user.id,
                    username: user.username || (user.email ? user.email.split('@')[0] : 'Kullanıcı'),
                    firebase_uid: firebaseUid,
                    total_points: 0,
                    badges: { stars: 0, bronze: 0, silver: 0, gold: 0, diamond: 0 },
                    streak_data: { currentStreak: 0, bestStreak: 0, totalPlayDays: 0 },
                    game_stats: { totalCorrect: 0, totalWrong: 0, gameModeCounts: {} },
                    perfect_lessons_count: 0
                }
            },
            {
                name: 'user_reports',
                data: {
                    user_id: user.id,
                    username: user.username || (user.email ? user.email.split('@')[0] : 'Kullanıcı'),
                    firebase_uid: firebaseUid,
                    toplam_hasene: 0,
                    yildiz: 0,
                    mertebe: 1,
                    mertebe_adi: 'Başlangıç',
                    seri: 0,
                    updated_at: new Date().toISOString()
                }
            },
            {
                name: 'user_achievements',
                data: {
                    user_id: user.id,
                    username: user.username || (user.email ? user.email.split('@')[0] : 'Kullanıcı'),
                    firebase_uid: firebaseUid,
                    unlocked_badges: [],
                    updated_at: new Date().toISOString()
                }
            }
        ];
        
        // Her collection'ı kontrol et ve yoksa oluştur
        for (const collection of collections) {
            try {
                // Önce kontrol et (varsa oluşturma)
                const existing = await firestoreGet(collection.name, docId);
                if (!existing) {
                    // Yoksa oluştur
                    const result = await firestoreSet(collection.name, docId, collection.data);
                    if (result) {
                        console.log(`✅ ${collection.name} collection'ı otomatik oluşturuldu`);
                    }
                }
            } catch (error) {
                // Hata olsa bile devam et (collection zaten var olabilir)
                console.log(`ℹ️ ${collection.name} kontrol edilemedi (normal olabilir):`, error.message);
            }
        }
    } catch (error) {
        // Sessizce devam et - hata olsa bile uygulama çalışmaya devam etmeli
        console.log('ℹ️ Otomatik collection oluşturma atlandı:', error.message);
    }
}

// ============================================
// AUTO CREATE COLLECTIONS - Otomatik Collection Oluşturma
// ============================================

/**
 * Tüm gerekli collection'ları otomatik oluşturur (eğer yoksa)
 * Giriş yapıldığında veya sayfa yüklendiğinde çağrılır
 */
async function autoCreateCollections() {
    try {
        const user = await getCurrentUser();
        if (!user || !user.id || user.id.startsWith('local-')) {
            // LocalStorage kullanıcısı, Firebase collection'ları oluşturma
            return;
        }
        
        const docId = (user.username && user.username !== 'Kullanıcı') 
            ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
            : user.id;
        
        const auth = getFirebaseAuth();
        const firebaseUid = auth?.currentUser?.uid || null;
        
        // Collection'ları kontrol et ve oluştur (sadece yoksa)
        const collections = [
            {
                name: 'user_stats',
                data: {
                    user_id: user.id,
                    username: user.username || (user.email ? user.email.split('@')[0] : 'Kullanıcı'),
                    firebase_uid: firebaseUid,
                    total_points: 0,
                    badges: { stars: 0, bronze: 0, silver: 0, gold: 0, diamond: 0 },
                    streak_data: { currentStreak: 0, bestStreak: 0, totalPlayDays: 0 },
                    game_stats: { totalCorrect: 0, totalWrong: 0, gameModeCounts: {} },
                    perfect_lessons_count: 0
                }
            },
            {
                name: 'user_reports',
                data: {
                    user_id: user.id,
                    username: user.username || (user.email ? user.email.split('@')[0] : 'Kullanıcı'),
                    firebase_uid: firebaseUid,
                    toplam_hasene: 0,
                    yildiz: 0,
                    mertebe: 1,
                    mertebe_adi: 'Başlangıç',
                    seri: 0,
                    updated_at: new Date().toISOString()
                }
            },
            {
                name: 'user_achievements',
                data: {
                    user_id: user.id,
                    username: user.username || (user.email ? user.email.split('@')[0] : 'Kullanıcı'),
                    firebase_uid: firebaseUid,
                    unlocked_badges: [],
                    updated_at: new Date().toISOString()
                }
            }
        ];
        
        // Her collection'ı kontrol et ve yoksa oluştur
        for (const collection of collections) {
            try {
                // Önce kontrol et (varsa oluşturma)
                const existing = await firestoreGet(collection.name, docId);
                if (!existing) {
                    // Yoksa oluştur
                    const result = await firestoreSet(collection.name, docId, collection.data);
                    if (result) {
                        console.log(`✅ ${collection.name} collection'ı otomatik oluşturuldu`);
                    }
                }
            } catch (error) {
                // Hata olsa bile devam et (collection zaten var olabilir)
                console.log(`ℹ️ ${collection.name} kontrol edilemedi (normal olabilir):`, error.message);
            }
        }
    } catch (error) {
        // Sessizce devam et - hata olsa bile uygulama çalışmaya devam etmeli
        console.log('ℹ️ Otomatik collection oluşturma atlandı:', error.message);
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
            // Username'i doküman ID'si olarak kullan (ama "Kullanıcı" default değerini atla)
            const docId = (user.username && user.username !== 'Kullanıcı') 
                ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
                : user.id;
            
            // Önce username ile kontrol et (ama "Kullanıcı" default değerini atla)
            let data = null;
            if (user.username && user.username !== 'Kullanıcı') {
                data = await firestoreGet('daily_tasks', docId);
            }
            
            // Username ile bulunamadıysa, eski UID ile kontrol et (geriye dönük uyumluluk)
            if (!data && user.id && !user.id.startsWith('local-')) {
                data = await firestoreGet('daily_tasks', user.id);
            }
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
    console.log('💾 saveDailyTasks çağrıldı:', {
        todayStats: {
            ayetOku: tasks.todayStats?.ayetOku,
            duaEt: tasks.todayStats?.duaEt,
            hadisOku: tasks.todayStats?.hadisOku,
            allGameModes: tasks.todayStats?.allGameModes
        }
    });
    
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
    console.log('💾 saveDailyTasks - localStorage kaydedildi');
    
    // Firebase'e de kaydet (username'i doküman ID'si olarak kullan)
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            // Username'i doküman ID'si olarak kullan (ama "Kullanıcı" default değerini atla)
            const docId = (user.username && user.username !== 'Kullanıcı') 
                ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
                : user.id;
            
            console.log('🔥 saveDailyTasks - Firebase\'e kaydediliyor:', {
                docId: docId,
                username: user.username,
                collection: 'daily_tasks',
                todayStats: {
                    ayetOku: toSave.todayStats.ayetOku,
                    duaEt: toSave.todayStats.duaEt,
                    hadisOku: toSave.todayStats.hadisOku
                }
            });
            // Firebase auth'dan gerçek UID'yi al
            const auth = getFirebaseAuth();
            const firebaseUid = auth?.currentUser?.uid || null;
            
            await firestoreSet('daily_tasks', docId, {
                user_id: user.id,
                username: user.username || (user.email ? user.email.split('@')[0] : 'Kullanıcı'),
                firebase_uid: firebaseUid, // Firestore rules için gerekli
                ...toSave
            });
            console.log('✅ saveDailyTasks - Firebase\'e başarıyla kaydedildi (docId:', docId + ')');
        } catch (error) {
            console.error('❌ saveDailyTasks - Firebase kaydetme hatası:', error);
        }
    } else {
        console.warn('⚠️ saveDailyTasks - Firebase\'e kaydedilmedi:', {
            backendType: getBackendType(),
            user: user ? { id: user.id, idStartsWithLocal: user.id?.startsWith('local-') } : null
        });
    }
}

/**
 * Haftalık görevleri yükle
 */
async function loadWeeklyTasks() {
    const user = await getCurrentUser();
    
    // Firebase'den yükle
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            // Username'i doküman ID'si olarak kullan
            const docId = (user.username && user.username !== 'Kullanıcı') 
                ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
                : user.id;
            
            const weeklyTasks = await firestoreGet('weekly_tasks', docId);
            if (weeklyTasks) {
                // Set'leri dönüştür
                if (weeklyTasks.weekStats) {
                    weeklyTasks.weekStats.allModesPlayed = new Set(weeklyTasks.weekStats.allModesPlayed || []);
                }
                // Firebase'den yüklenen veriyi localStorage'a da kaydet (senkronizasyon)
                localStorage.setItem('hasene_weeklyTasks', JSON.stringify(weeklyTasks));
                return weeklyTasks;
            }
        } catch (error) {
            console.warn('Firebase loadWeeklyTasks error:', error);
        }
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
    const toSave = {
        ...tasks,
        weekStats: {
            ...tasks.weekStats,
            allModesPlayed: Array.from(tasks.weekStats.allModesPlayed || [])
        }
    };
    
    // Her durumda localStorage'a kaydet
    localStorage.setItem('hasene_weeklyTasks', JSON.stringify(toSave));
    
    // Firebase'e de kaydet (username'i doküman ID'si olarak kullan)
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            // Username'i doküman ID'si olarak kullan (ama "Kullanıcı" default değerini atla)
            const docId = (user.username && user.username !== 'Kullanıcı') 
                ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
                : user.id;
            
            console.log('🔥 saveWeeklyTasks - Firebase\'e kaydediliyor:', {
                docId: docId,
                username: user.username,
                collection: 'weekly_tasks'
            });
            
            // Firebase auth'dan gerçek UID'yi al
            const auth = getFirebaseAuth();
            const firebaseUid = auth?.currentUser?.uid || null;
            
            await firestoreSet('weekly_tasks', docId, {
                user_id: user.id,
                username: user.username || (user.email ? user.email.split('@')[0] : 'Kullanıcı'),
                firebase_uid: firebaseUid,
                ...toSave
            });
            console.log('✅ saveWeeklyTasks - Firebase\'e başarıyla kaydedildi (docId:', docId + ')');
        } catch (error) {
            console.error('❌ saveWeeklyTasks - Firebase kaydetme hatası:', error);
        }
    }
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
            // Username'i doküman ID'si olarak kullan
            const docId = user.username ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) : user.id;
            
            // Username ile sorgula (firestoreGetCollection hem user_id hem username'e göre sorgulayacak)
            const wordStatsCollection = await firestoreGetCollection('word_stats', user.id, user.username);
            
            if (wordStatsCollection && wordStatsCollection.length > 0) {
                const stats = {};
                wordStatsCollection.forEach(item => {
                    if (item.word_id && item.stats) {
                        stats[item.word_id] = item.stats;
                    }
                });
                // localStorage'a da kaydet
                localStorage.setItem('hasene_wordStats', JSON.stringify(stats));
                return stats;
            }
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
    
    // Firebase'e de kaydet (username'i doküman ID'si olarak kullan)
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            const db = getFirebaseDb();
            if (db) {
                // Username'i doküman ID'si olarak kullan
                const docId = user.username ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) : user.id;
                const { setDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                const docRef = doc(db, 'word_stats', `${docId}_${wordId}`);
                await setDoc(docRef, {
                    user_id: user.id,
                    username: user.username || (user.email ? user.email.split('@')[0] : 'Kullanıcı'),
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
            // Username'i doküman ID'si olarak kullan
            const docId = user.username ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) : user.id;
            
            // Username ile sorgula (firestoreGetCollection hem user_id hem username'e göre sorgulayacak)
            const favoritesCollection = await firestoreGetCollection('favorites', user.id, user.username);
            
            if (favoritesCollection && favoritesCollection.length > 0) {
                const favorites = favoritesCollection.map(item => item.word_id).filter(Boolean);
                // localStorage'a da kaydet
                localStorage.setItem('hasene_favorites', JSON.stringify(favorites));
                return favorites;
            }
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
        
        // Firebase'e de kaydet (username'i doküman ID'si olarak kullan)
        if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
            try {
                const db = getFirebaseDb();
                if (db) {
                    // Username'i doküman ID'si olarak kullan
                    const docId = user.username ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) : user.id;
                    const { setDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                    const docRef = doc(db, 'favorites', `${docId}_${wordId}`);
                    await setDoc(docRef, {
                        user_id: user.id,
                        username: user.username || (user.email ? user.email.split('@')[0] : 'Kullanıcı'),
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
    
    // Firebase'den de kaldır (username'i doküman ID'si olarak kullan)
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            const db = getFirebaseDb();
            if (db) {
                // Username'i doküman ID'si olarak kullan
                const docId = user.username ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) : user.id;
                const { deleteDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                
                // Önce username ile silmeyi dene
                if (user.username) {
                    try {
                        const docRef = doc(db, 'favorites', `${docId}_${wordId}`);
                        await deleteDoc(docRef);
                    } catch (err) {
                        // Username ile bulunamadıysa, eski UID ile silmeyi dene (geriye dönük uyumluluk)
                        const oldDocRef = doc(db, 'favorites', `${user.id}_${wordId}`);
                        await deleteDoc(oldDocRef);
                    }
                } else {
                    const docRef = doc(db, 'favorites', `${user.id}_${wordId}`);
                    await deleteDoc(docRef);
                }
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
    const user = await getCurrentUser();
    
    // Her durumda localStorage'a kaydet
    localStorage.setItem(`hasene_daily_${date}`, JSON.stringify(stats));
    
    // Firebase'e de kaydet
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            // Username'i doküman ID'si olarak kullan
            const docId = (user.username && user.username !== 'Kullanıcı') 
                ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
                : user.id;
            
            // Firebase auth'dan gerçek UID'yi al
            const auth = getFirebaseAuth();
            const firebaseUid = auth?.currentUser?.uid || null;
            
            // Daily stats için subcollection kullan (user_daily_stats/{date})
            // Veya document ID olarak {username}_{date} kullan
            const dailyDocId = `${docId}_${date}`;
            
            await firestoreSet('daily_stats', dailyDocId, {
                user_id: user.id,
                username: user.username || (user.email ? user.email.split('@')[0] : 'Kullanıcı'),
                firebase_uid: firebaseUid,
                date: date,
                ...stats
            });
        } catch (error) {
            console.warn('⚠️ saveDailyStat - Firebase kaydetme hatası (normal olabilir):', error);
        }
    }
}

/**
 * Haftalık istatistikleri kaydet
 */
async function saveWeeklyStat(weekStart, stats) {
    const user = await getCurrentUser();
    
    // Her durumda localStorage'a kaydet
    localStorage.setItem(`hasene_weekly_${weekStart}`, JSON.stringify(stats));
    
    // Firebase'e de kaydet
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            // Username'i doküman ID'si olarak kullan
            const docId = (user.username && user.username !== 'Kullanıcı') 
                ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
                : user.id;
            
            // Firebase auth'dan gerçek UID'yi al
            const auth = getFirebaseAuth();
            const firebaseUid = auth?.currentUser?.uid || null;
            
            // Weekly stats için document ID olarak {username}_{weekStart} kullan
            const weeklyDocId = `${docId}_${weekStart}`;
            
            await firestoreSet('weekly_stats', weeklyDocId, {
                user_id: user.id,
                username: user.username || (user.email ? user.email.split('@')[0] : 'Kullanıcı'),
                firebase_uid: firebaseUid,
                week_start: weekStart,
                ...stats
            });
        } catch (error) {
            console.warn('⚠️ saveWeeklyStat - Firebase kaydetme hatası (normal olabilir):', error);
        }
    }
}

/**
 * Aylık istatistikleri kaydet
 */
async function saveMonthlyStat(month, stats) {
    const user = await getCurrentUser();
    
    // Her durumda localStorage'a kaydet
    localStorage.setItem(`hasene_monthly_${month}`, JSON.stringify(stats));
    
    // Firebase'e de kaydet
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            // Username'i doküman ID'si olarak kullan
            const docId = (user.username && user.username !== 'Kullanıcı') 
                ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
                : user.id;
            
            // Firebase auth'dan gerçek UID'yi al
            const auth = getFirebaseAuth();
            const firebaseUid = auth?.currentUser?.uid || null;
            
            // Monthly stats için document ID olarak {username}_{month} kullan
            const monthlyDocId = `${docId}_${month}`;
            
            await firestoreSet('monthly_stats', monthlyDocId, {
                user_id: user.id,
                username: user.username || (user.email ? user.email.split('@')[0] : 'Kullanıcı'),
                firebase_uid: firebaseUid,
                month: month,
                ...stats
            });
        } catch (error) {
            console.warn('⚠️ saveMonthlyStat - Firebase kaydetme hatası (normal olabilir):', error);
        }
    }
}

/**
 * Günlük istatistikleri yükle
 */
async function loadDailyStat(date) {
    const user = await getCurrentUser();
    
    // Firebase'den yükle
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            // Username'i doküman ID'si olarak kullan
            const docId = (user.username && user.username !== 'Kullanıcı') 
                ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
                : user.id;
            
            const dailyDocId = `${docId}_${date}`;
            const dailyStat = await firestoreGet('daily_stats', dailyDocId);
            if (dailyStat) {
                // Firebase'den yüklenen veriyi localStorage'a da kaydet (senkronizasyon)
                localStorage.setItem(`hasene_daily_${date}`, JSON.stringify(dailyStat));
                return dailyStat;
            }
        } catch (error) {
            console.warn('Firebase loadDailyStat error:', error);
        }
    }
    
    // Fallback: localStorage
    const saved = localStorage.getItem(`hasene_daily_${date}`);
    return saved ? JSON.parse(saved) : null;
}

/**
 * Haftalık istatistikleri yükle
 */
async function loadWeeklyStat(weekStart) {
    const user = await getCurrentUser();
    
    // Firebase'den yükle
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            // Username'i doküman ID'si olarak kullan
            const docId = (user.username && user.username !== 'Kullanıcı') 
                ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
                : user.id;
            
            const weeklyDocId = `${docId}_${weekStart}`;
            const weeklyStat = await firestoreGet('weekly_stats', weeklyDocId);
            if (weeklyStat) {
                // Firebase'den yüklenen veriyi localStorage'a da kaydet (senkronizasyon)
                localStorage.setItem(`hasene_weekly_${weekStart}`, JSON.stringify(weeklyStat));
                return weeklyStat;
            }
        } catch (error) {
            console.warn('Firebase loadWeeklyStat error:', error);
        }
    }
    
    // Fallback: localStorage
    const saved = localStorage.getItem(`hasene_weekly_${weekStart}`);
    return saved ? JSON.parse(saved) : null;
}

/**
 * Aylık istatistikleri yükle
 */
async function loadMonthlyStat(month) {
    const user = await getCurrentUser();
    
    // Firebase'den yükle
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            // Username'i doküman ID'si olarak kullan
            const docId = (user.username && user.username !== 'Kullanıcı') 
                ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
                : user.id;
            
            const monthlyDocId = `${docId}_${month}`;
            const monthlyStat = await firestoreGet('monthly_stats', monthlyDocId);
            if (monthlyStat) {
                // Firebase'den yüklenen veriyi localStorage'a da kaydet (senkronizasyon)
                localStorage.setItem(`hasene_monthly_${month}`, JSON.stringify(monthlyStat));
                return monthlyStat;
            }
        } catch (error) {
            console.warn('Firebase loadMonthlyStat error:', error);
        }
    }
    
    // Fallback: localStorage
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
    const weekStart = getWeekStart();
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const key = `hasene_weekly_xp_${weekStartStr}`;
    const currentXP = parseInt(localStorage.getItem(key) || '0');
    const newXP = currentXP + points;
    localStorage.setItem(key, newXP.toString());
    
    // Firebase'e de kaydet
    const user = await getCurrentUser();
    if (getBackendType() === 'firebase' && user && user.id && !user.id.startsWith('local-')) {
        try {
            const docId = (user.username && user.username !== 'Kullanıcı') 
                ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
                : user.id;
            
            const auth = getFirebaseAuth();
            const firebaseUid = auth?.currentUser?.uid || null;
            
            // Weekly leaderboard için document ID: {username}_{weekStart}
            const leaderboardDocId = `${docId}_${weekStartStr}`;
            
            // Mevcut veriyi al (varsa)
            const existing = await firestoreGet('weekly_leaderboard', leaderboardDocId);
            const existingXP = existing?.weekly_xp || 0;
            const finalXP = existingXP + points;
            
            await firestoreSet('weekly_leaderboard', leaderboardDocId, {
                user_id: user.id,
                username: user.username || (user.email ? user.email.split('@')[0] : 'Kullanıcı'),
                firebase_uid: firebaseUid,
                week_start: weekStartStr,
                weekly_xp: finalXP,
                updated_at: new Date().toISOString()
            });
            
            console.log('✅ Haftalık XP Firebase\'e kaydedildi:', {
                docId: leaderboardDocId,
                weekly_xp: finalXP,
                points: points,
                existingXP: existingXP
            });
        } catch (error) {
            console.error('❌ updateWeeklyXP - Firebase kaydetme hatası:', error);
            console.error('❌ Hata detayı:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
        }
    }
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
    try {
        const weekStart = getWeekStart();
        const weekStartStr = weekStart.toISOString().split('T')[0];
        
        // Tüm kullanıcıların haftalık XP'lerini al
        const allUsers = await firestoreGetCollection('weekly_leaderboard', null, null);
        const weekUsers = allUsers.filter(u => u.week_start === weekStartStr);
        
        // Her kullanıcının lig seviyesini hesapla ve filtrele
        const leagueUsers = weekUsers
            .map(u => {
                const uXP = u.weekly_xp || 0;
                let uLeague = 'mubtedi';
                if (uXP >= 10000) uLeague = 'ulama';
                else if (uXP >= 8000) uLeague = 'imam';
                else if (uXP >= 6000) uLeague = 'faqih';
                else if (uXP >= 4000) uLeague = 'muhaddis';
                else if (uXP >= 3000) uLeague = 'mujtahid';
                else if (uXP >= 2000) uLeague = 'alim';
                else if (uXP >= 1500) uLeague = 'kurra';
                else if (uXP >= 1000) uLeague = 'hafiz';
                else if (uXP >= 500) uLeague = 'mutebahhir';
                else if (uXP >= 250) uLeague = 'mutavassit';
                else if (uXP >= 100) uLeague = 'talib';
                
                return { ...u, calculated_league: uLeague };
            })
            .filter(u => u.calculated_league === leagueName);
        
        // XP'ye göre sırala (yüksekten düşüğe)
        leagueUsers.sort((a, b) => (b.weekly_xp || 0) - (a.weekly_xp || 0));
        
        // Limit'e göre kes ve pozisyon ekle
        return leagueUsers.slice(0, limit).map((u, index) => ({
            position: index + 1,
            user_id: u.user_id,
            username: u.username,
            weekly_xp: u.weekly_xp || 0,
            profiles: { username: u.username }
        }));
    } catch (error) {
        console.error('getLeagueRankings error:', error);
        return [];
    }
}

/**
 * Kullanıcının lig pozisyonu
 */
async function getUserLeaguePosition(userId = null) {
    try {
        const user = userId ? { id: userId } : await getCurrentUser();
        if (!user || !user.id || user.id.startsWith('local-')) {
            console.log('⚠️ getUserLeaguePosition: Kullanıcı yok veya local kullanıcı');
            return null;
        }
        
        const weekStart = getWeekStart();
        const weekStartStr = weekStart.toISOString().split('T')[0];
        const docId = (user.username && user.username !== 'Kullanıcı') 
            ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
            : user.id;
        
        console.log('🔍 getUserLeaguePosition:', {
            userId: user.id,
            username: user.username,
            docId: docId,
            weekStart: weekStartStr
        });
        
        // Firebase'den haftalık XP'yi al - önce username ile dene
        let leaderboardDocId = `${docId}_${weekStartStr}`;
        let leaderboardData = await firestoreGet('weekly_leaderboard', leaderboardDocId);
        
        // Eğer username ile bulunamadıysa, user_id ile dene
        if (!leaderboardData && user.id !== docId) {
            leaderboardDocId = `${user.id}_${weekStartStr}`;
            leaderboardData = await firestoreGet('weekly_leaderboard', leaderboardDocId);
        }
        
        console.log('🔍 Leaderboard data:', {
            docId: leaderboardDocId,
            found: !!leaderboardData,
            weekly_xp: leaderboardData?.weekly_xp
        });
        
        if (!leaderboardData || !leaderboardData.weekly_xp) {
            console.log('⚠️ getUserLeaguePosition: Bu hafta oyun oynamamış veya veri yok');
            return null; // Bu hafta oyun oynamamış
        }
        
        // Tüm kullanıcıların haftalık XP'lerini al ve sırala
        const allUsers = await firestoreGetCollection('weekly_leaderboard', null, null);
        const weekUsers = allUsers.filter(u => u.week_start === weekStartStr);
        
        // XP'ye göre sırala (yüksekten düşüğe)
        weekUsers.sort((a, b) => (b.weekly_xp || 0) - (a.weekly_xp || 0));
        
        // Kullanıcının pozisyonunu bul
        const userPosition = weekUsers.findIndex(u => u.user_id === user.id || u.username === user.username) + 1;
        
        if (userPosition === 0) {
            return null; // Kullanıcı listede yok
        }
        
        // Lig seviyesini hesapla (XP'ye göre)
        const weeklyXP = leaderboardData.weekly_xp;
        let league = 'mubtedi';
        if (weeklyXP >= 10000) league = 'ulama';
        else if (weeklyXP >= 8000) league = 'imam';
        else if (weeklyXP >= 6000) league = 'faqih';
        else if (weeklyXP >= 4000) league = 'muhaddis';
        else if (weeklyXP >= 3000) league = 'mujtahid';
        else if (weeklyXP >= 2000) league = 'alim';
        else if (weeklyXP >= 1500) league = 'kurra';
        else if (weeklyXP >= 1000) league = 'hafiz';
        else if (weeklyXP >= 500) league = 'mutebahhir';
        else if (weeklyXP >= 250) league = 'mutavassit';
        else if (weeklyXP >= 100) league = 'talib';
        
        // Aynı ligdeki toplam kullanıcı sayısını bul
        const leagueUsers = weekUsers.filter(u => {
            const uXP = u.weekly_xp || 0;
            let uLeague = 'mubtedi';
            if (uXP >= 10000) uLeague = 'ulama';
            else if (uXP >= 8000) uLeague = 'imam';
            else if (uXP >= 6000) uLeague = 'faqih';
            else if (uXP >= 4000) uLeague = 'muhaddis';
            else if (uXP >= 3000) uLeague = 'mujtahid';
            else if (uXP >= 2000) uLeague = 'alim';
            else if (uXP >= 1500) uLeague = 'kurra';
            else if (uXP >= 1000) uLeague = 'hafiz';
            else if (uXP >= 500) uLeague = 'mutebahhir';
            else if (uXP >= 250) uLeague = 'mutavassit';
            else if (uXP >= 100) uLeague = 'talib';
            return uLeague === league;
        });
        
        return {
            league: league,
            position: userPosition,
            weekly_xp: weeklyXP,
            total_in_league: leagueUsers.length,
            week_start: weekStartStr
        };
    } catch (error) {
        console.error('getUserLeaguePosition error:', error);
        return null;
    }
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
    // Backend / Firestore helper'larını da global yap
    // Böylece auth.js gibi diğer dosyalar aynı helper'ları kullanarak
    // TEK BİR yerden Firestore erişimi yapabilir (tutarlı ve merkezi yapı).
    window.getBackendType = getBackendType;
    window.getFirebaseAuth = getFirebaseAuth;
    window.getFirebaseDb = getFirebaseDb;
    window.firestoreGet = firestoreGet;
    window.firestoreSet = firestoreSet;
    window.firestoreGetCollection = firestoreGetCollection;
    window.firestoreGetSubCollection = firestoreGetSubCollection;

    // Auth API
    window.registerUser = registerUser;
    window.loginUser = loginUser;
    window.loginWithGoogle = loginWithGoogle;
    window.loginWithGitHub = loginWithGitHub;
    window.logoutUser = logoutUser;
    window.getCurrentUser = getCurrentUser;
    window.autoCreateCollections = autoCreateCollections;
    
    // Debug: Export kontrolü
    console.log('✅ api-service.js: Fonksiyonlar export edildi:', {
        getCurrentUser: typeof window.getCurrentUser,
        loadUserStats: typeof window.loadUserStats,
        saveUserStats: typeof window.saveUserStats,
        firestoreSet: typeof window.firestoreSet,
        firestoreGet: typeof window.firestoreGet
    });

    // Stats & Tasks API
    window.loadUserStats = loadUserStats;
    window.saveUserStats = saveUserStats;
    window.loadDailyTasks = loadDailyTasks;
    window.saveDailyTasks = saveDailyTasks;
    window.loadWeeklyTasks = loadWeeklyTasks;
    window.saveWeeklyTasks = saveWeeklyTasks;

    // Word / Favorites API
    window.loadWordStats = loadWordStats;
    window.saveWordStat = saveWordStat;
    window.loadFavorites = loadFavorites;
    window.addFavorite = addFavorite;
    window.removeFavorite = removeFavorite;

    // Detailed stats API
    window.saveDailyStat = saveDailyStat;
    window.saveWeeklyStat = saveWeeklyStat;
    window.saveMonthlyStat = saveMonthlyStat;
    window.loadDailyStat = loadDailyStat;
    window.loadWeeklyStat = loadWeeklyStat;
    window.loadMonthlyStat = loadMonthlyStat;
    window.loadAllDailyStatsDates = loadAllDailyStatsDates;

    // Achievements / Badges / Leaderboard
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
