// ============================================
// INDEXEDDB CACHE - Veri Saklama Sistemi
// ============================================

let db = null;
let initPromise = null; // Başlatma Promise'ini sakla (singleton pattern)
const DB_NAME = CONFIG.INDEXEDDB_NAME;
const DB_VERSION = CONFIG.INDEXEDDB_VERSION;
const STORE_NAME = 'gameData';

/**
 * IndexedDB'yi başlatır (singleton pattern - sadece bir kez açılır)
 */
async function initIndexedDB() {
    // Eğer zaten açıksa ve bağlantı aktifse, mevcut db'yi döndür
    // Not: IndexedDB'de readyState property yok, ancak transaction açarak test edebiliriz
    if (db) {
        // Bağlantının hala açık olduğunu kontrol et (basit bir kontrol)
        try {
            // Transaction açmayı deneyerek bağlantıyı test et
            // Ancak bu işlem transaction açmaz, sadece objectStore kontrolü yapar
            if (db.objectStoreNames && db.objectStoreNames.contains(STORE_NAME)) {
                return db;
            }
        } catch (e) {
            // Bağlantı kapalı, sıfırla ve yeniden aç
            warnLog('IndexedDB bağlantısı kapalı, yeniden açılıyor...');
            db = null;
        }
    }
    
    // Eğer zaten açılıyorsa, mevcut Promise'i bekle
    if (initPromise) {
        return initPromise;
    }
    
    // Yeni bir başlatma işlemi başlat
    initPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            errorLog('IndexedDB açılamadı:', request.error);
            initPromise = null; // Hata durumunda Promise'i sıfırla
            reject(request.error);
        };
        
        request.onsuccess = () => {
            db = request.result;
            
            // Bağlantı kapanırsa db'yi null yap (yeniden açılabilmesi için)
            db.onclose = () => {
                warnLog('IndexedDB bağlantısı kapatıldı');
                db = null;
                initPromise = null;
            };
            
            db.onerror = (event) => {
                errorLog('IndexedDB bağlantı hatası:', event);
            };
            
            infoLog('IndexedDB başarıyla açıldı');
            initPromise = null; // Başarılı olduğunda Promise'i sıfırla
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            
            // Object store oluştur
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = database.createObjectStore(STORE_NAME, { keyPath: 'key' });
                infoLog('Object store oluşturuldu');
            }
        };
    });
    
    return initPromise;
}

/**
 * IndexedDB'ye veri kaydeder
 */
async function saveToIndexedDB(key, value) {
    // Bağlantı yoksa veya kapalıysa aç
    if (!db) {
        await initIndexedDB();
    }
    
    return new Promise((resolve, reject) => {
        try {
            // Bağlantı kontrolü - eğer hala kapalıysa yeniden aç
            if (!db) {
                initIndexedDB().then(() => {
                    // Yeniden deneme
                    saveToIndexedDB(key, value).then(resolve).catch(reject);
                }).catch(reject);
                return;
            }
            
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            
            // Transaction hata kontrolü
            transaction.onerror = (event) => {
                errorLog('IndexedDB transaction hatası:', event.target.error);
                // Bağlantı kapanmışsa db'yi null yap
                if (event.target.error && event.target.error.name === 'InvalidStateError') {
                    db = null;
                    initPromise = null;
                }
                reject(event.target.error);
            };
            
            transaction.onabort = () => {
                warnLog('IndexedDB transaction iptal edildi');
                reject(new Error('Transaction aborted'));
            };
            
            const objectStore = transaction.objectStore(STORE_NAME);
            
            const data = {
                key: key,
                value: typeof value === 'string' ? value : JSON.stringify(value),
                timestamp: Date.now()
            };
            
            const request = objectStore.put(data);
            
            request.onsuccess = () => {
                debugLog('IndexedDB\'ye kaydedildi:', key);
                resolve();
            };
            
            request.onerror = () => {
                errorLog('IndexedDB kayıt hatası:', request.error);
                reject(request.error);
            };
        } catch (error) {
            // InvalidStateError veya diğer hatalar için bağlantıyı sıfırla
            if (error.name === 'InvalidStateError' || error.message.includes('closing')) {
                warnLog('IndexedDB bağlantısı kapanıyor, yeniden açılıyor...');
                db = null;
                initPromise = null;
                // Yeniden deneme
                initIndexedDB().then(() => {
                    saveToIndexedDB(key, value).then(resolve).catch(reject);
                }).catch(reject);
            } else {
                reject(error);
            }
        }
    });
}

/**
 * IndexedDB'den veri yükler
 */
async function loadFromIndexedDB(key) {
    if (!db) {
        try {
            await initIndexedDB();
        } catch (e) {
            return null;
        }
    }
    
    return new Promise((resolve, reject) => {
        try {
            // Bağlantı kontrolü
            if (!db) {
                initIndexedDB().then(() => {
                    loadFromIndexedDB(key).then(resolve).catch(() => resolve(null));
                }).catch(() => resolve(null));
                return;
            }
            
            const transaction = db.transaction([STORE_NAME], 'readonly');
            
            transaction.onerror = (event) => {
                if (event.target.error && event.target.error.name === 'InvalidStateError') {
                    db = null;
                    initPromise = null;
                }
                resolve(null); // Hata durumunda null döndür (kritik değil)
            };
            
            const objectStore = transaction.objectStore(STORE_NAME);
            const request = objectStore.get(key);
            
            request.onsuccess = () => {
                if (request.result) {
                    const value = request.result.value;
                    try {
                        // JSON ise parse et
                        const parsed = JSON.parse(value);
                        resolve(parsed);
                    } catch (e) {
                        // String ise direkt döndür
                        resolve(value);
                    }
                } else {
                    resolve(null);
                }
            };
            
            request.onerror = () => {
                // Yükleme hatası kritik değil, null döndür
                resolve(null);
            };
        } catch (error) {
            if (error.name === 'InvalidStateError' || error.message.includes('closing')) {
                db = null;
                initPromise = null;
                resolve(null); // Kritik değil, null döndür
            } else {
                resolve(null); // Diğer hatalarda da null döndür (kritik değil)
            }
        }
    });
}

/**
 * IndexedDB'den veri siler
 */
async function deleteFromIndexedDB(key) {
    if (!db) {
        await initIndexedDB();
    }
    
    return new Promise((resolve, reject) => {
        try {
            if (!db) {
                initIndexedDB().then(() => {
                    deleteFromIndexedDB(key).then(resolve).catch(reject);
                }).catch(reject);
                return;
            }
            
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            
            transaction.onerror = (event) => {
                if (event.target.error && event.target.error.name === 'InvalidStateError') {
                    db = null;
                    initPromise = null;
                }
                reject(event.target.error);
            };
            
            const objectStore = transaction.objectStore(STORE_NAME);
            const request = objectStore.delete(key);
            
            request.onsuccess = () => {
                debugLog('IndexedDB\'den silindi:', key);
                resolve();
            };
            
            request.onerror = () => {
                errorLog('IndexedDB silme hatası:', request.error);
                reject(request.error);
            };
        } catch (error) {
            if (error.name === 'InvalidStateError' || error.message.includes('closing')) {
                db = null;
                initPromise = null;
                initIndexedDB().then(() => {
                    deleteFromIndexedDB(key).then(resolve).catch(reject);
                }).catch(reject);
            } else {
                reject(error);
            }
        }
    });
}

/**
 * Tüm IndexedDB verilerini temizler
 */
async function clearIndexedDB() {
    if (!db) {
        await initIndexedDB();
    }
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.clear();
        
        request.onsuccess = () => {
            infoLog('IndexedDB temizlendi');
            resolve();
        };
        
        request.onerror = () => {
            errorLog('IndexedDB temizleme hatası:', request.error);
            reject(request.error);
        };
    });
}

/**
 * IndexedDB durumunu kontrol eder
 */
async function checkIndexedDBStatus() {
    try {
        if (!db) {
            await initIndexedDB();
        }
        return { available: true, error: null };
    } catch (e) {
        return { available: false, error: e.message };
    }
}

// Sayfa yüklendiğinde IndexedDB'yi başlat (sadece bir kez)
if (typeof window !== 'undefined') {
    // Sadece bir kez başlat (load event'inde)
    let indexedDBInitialized = false;
    window.addEventListener('load', () => {
        if (!indexedDBInitialized) {
            indexedDBInitialized = true;
            initIndexedDB().catch(err => {
                warnLog('IndexedDB başlatılamadı, localStorage kullanılacak:', err);
            });
        }
    });
}

// Export
if (typeof window !== 'undefined') {
    window.initIndexedDB = initIndexedDB;
    window.saveToIndexedDB = saveToIndexedDB;
    window.loadFromIndexedDB = loadFromIndexedDB;
    window.deleteFromIndexedDB = deleteFromIndexedDB;
    window.clearIndexedDB = clearIndexedDB;
    window.checkIndexedDBStatus = checkIndexedDBStatus;
}


