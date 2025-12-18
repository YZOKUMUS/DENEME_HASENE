// ============================================
// FIREBASE INIT - Firebase SDK Yükleme
// ============================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase config - firebase-config.js'den alınacak
// firebase-config.js yüklendikten sonra çalışacak
let firebaseConfig = null;

// Config'i bekle (firebase-config.js yüklenene kadar)
function getFirebaseConfig() {
    if (window.FIREBASE_CONFIG) {
        return window.FIREBASE_CONFIG;
    }
    // Fallback config (geliştirme için)
    return {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
}

firebaseConfig = getFirebaseConfig();

// Firebase'i başlat
// Config'in yüklenmesini bekle
function initFirebaseApp() {
    firebaseConfig = getFirebaseConfig();
    
    // Config kontrolü - eğer placeholder değerler varsa Firebase'i başlatma
    if (firebaseConfig.apiKey === "YOUR_API_KEY" || firebaseConfig.projectId === "YOUR_PROJECT_ID") {
        console.warn('⚠️ Firebase config henüz ayarlanmamış, localStorage kullanılacak');
        console.log('💡 Firebase config\'i ayarlamak için: js/firebase-config.js dosyasını güncelleyin');
        return;
    }
    
    try {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        
        // Global olarak expose et
        window.firebaseApp = app;
        window.firebaseAuth = auth;
        window.firebaseDb = db;
        
        // Proje kontrolü - karışıklığı önlemek için
        const expectedProjectId = 'hasene-arapca-dersi';
        if (firebaseConfig.projectId !== expectedProjectId) {
            console.error('❌ YANLIŞ PROJE! Beklenen:', expectedProjectId, 'Bulunan:', firebaseConfig.projectId);
            console.error('❌ Lütfen js/firebase-config.js dosyasında projectId\'yi kontrol edin!');
        } else {
            console.log('✅ Firebase başlatıldı:', firebaseConfig.projectId);
            console.log('✅ Proje doğrulandı: hasene-arapca-dersi');
        }
        
        // firebase-config.js'deki initFirebase fonksiyonunu çağır
        if (typeof window.initFirebase === 'function') {
            window.initFirebase();
        }
    } catch (error) {
        console.error('❌ Firebase başlatma hatası:', error);
        console.warn('⚠️ localStorage kullanılacak');
    }
}

// Config yüklenene kadar bekle
if (window.FIREBASE_CONFIG) {
    initFirebaseApp();
} else {
    // firebase-config.js yüklenene kadar bekle
    let retryCount = 0;
    const maxRetries = 10;
    const checkConfig = setInterval(() => {
        if (window.FIREBASE_CONFIG || retryCount >= maxRetries) {
            clearInterval(checkConfig);
            if (window.FIREBASE_CONFIG) {
                initFirebaseApp();
            } else {
                console.warn('⚠️ Firebase config yüklenemedi, localStorage kullanılacak');
            }
        }
        retryCount++;
    }, 100);
}
