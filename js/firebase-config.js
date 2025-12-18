// ============================================
// FIREBASE CONFIG - Yapılandırma
// ============================================

// ============================================
// FIREBASE CONFIG - Yapılandırma
// ============================================
// ⚠️ ÖNEMLİ: Bu proje için SADECE "hasene-arapca-dersi" kullanılmalıdır!
// Proje ID değiştirilmemelidir!

// Firebase config değerleri
// Firebase Console'dan alınan config değerleri
const FIREBASE_CONFIG = {
    apiKey: window.FIREBASE_API_KEY || "AIzaSyDowCfkzzdazJm9gqQTFZO7EB72g4jI9qQ",
    authDomain: window.FIREBASE_AUTH_DOMAIN || "hasene-arapca-dersi.firebaseapp.com",
    projectId: window.FIREBASE_PROJECT_ID || "hasene-arapca-dersi", // ⚠️ DEĞİŞTİRMEYİN!
    storageBucket: window.FIREBASE_STORAGE_BUCKET || "hasene-arapca-dersi.firebasestorage.app",
    messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID || "333314966610",
    appId: window.FIREBASE_APP_ID || "1:333314966610:web:1e23b62a76a012a06b8b8b",
    measurementId: window.FIREBASE_MEASUREMENT_ID || "G-F9DJZ7Y7FX" // Analytics için (opsiyonel)
};

// Proje ID kontrolü - karışıklığı önlemek için
if (FIREBASE_CONFIG.projectId !== 'hasene-arapca-dersi') {
    console.error('❌ YANLIŞ PROJE ID! Beklenen: hasene-arapca-dersi, Bulunan:', FIREBASE_CONFIG.projectId);
    console.error('❌ Lütfen projectId\'yi "hasene-arapca-dersi" olarak ayarlayın!');
}

// Backend tipi: 'firebase' veya 'localStorage'
const BACKEND_TYPE = window.BACKEND_TYPE || 'firebase';

// Firebase modülleri (ES6 modules ile yüklenecek)
let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;

// Firebase'i başlat (ES6 modules yüklendikten sonra)
async function initFirebase() {
    if (BACKEND_TYPE !== 'firebase') {
        console.log('ℹ️ Firebase devre dışı, localStorage kullanılıyor');
        return false;
    }
    
    try {
        // Firebase modüllerini kontrol et
        if (typeof window.firebaseApp !== 'undefined' && window.firebaseAuth && window.firebaseDb) {
            firebaseApp = window.firebaseApp;
            firebaseAuth = window.firebaseAuth;
            firebaseDb = window.firebaseDb;
            console.log('✅ Firebase modülleri yüklendi');
            return true;
        } else {
            // Biraz bekle ve tekrar dene (ES6 module yüklenmesi için)
            await new Promise(resolve => setTimeout(resolve, 500));
            if (typeof window.firebaseApp !== 'undefined' && window.firebaseAuth && window.firebaseDb) {
                firebaseApp = window.firebaseApp;
                firebaseAuth = window.firebaseAuth;
                firebaseDb = window.firebaseDb;
                console.log('✅ Firebase modülleri yüklendi (retry)');
                return true;
            }
            console.warn('⚠️ Firebase modülleri henüz yüklenmedi');
            return false;
        }
    } catch (error) {
        console.error('❌ Firebase başlatma hatası:', error);
        return false;
    }
}

// Sayfa yüklendiğinde Firebase'i başlat
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            initFirebase().then(success => {
                if (success) {
                    console.log('✅ Firebase başarıyla başlatıldı');
                } else {
                    console.warn('⚠️ Firebase başlatılamadı, localStorage kullanılacak');
                }
            });
        }, 500);
    });
}

// Export
if (typeof window !== 'undefined') {
    window.FIREBASE_CONFIG = FIREBASE_CONFIG;
    window.BACKEND_TYPE = BACKEND_TYPE;
    window.initFirebase = initFirebase;
    window.getFirebaseAuth = () => firebaseAuth;
    window.getFirebaseDb = () => firebaseDb;
}
