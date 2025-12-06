// ============================================
// INDEXEDDB CACHE - Veri Saklama Sistemi
// ============================================

let db = null;
const DB_NAME = CONFIG.INDEXEDDB_NAME;
const DB_VERSION = CONFIG.INDEXEDDB_VERSION;
const STORE_NAME = 'gameData';

/**
 * IndexedDB'yi başlatır
 */
async function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            errorLog('IndexedDB açılamadı:', request.error);
            reject(request.error);
        };
        
        request.onsuccess = () => {
            db = request.result;
            infoLog('IndexedDB başarıyla açıldı');
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
}

/**
 * IndexedDB'ye veri kaydeder
 */
async function saveToIndexedDB(key, value) {
    if (!db) {
        await initIndexedDB();
    }
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
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
        const transaction = db.transaction([STORE_NAME], 'readonly');
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
            errorLog('IndexedDB yükleme hatası:', request.error);
            reject(request.error);
        };
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
        const transaction = db.transaction([STORE_NAME], 'readwrite');
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

// Sayfa yüklendiğinde IndexedDB'yi başlat
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        initIndexedDB().catch(err => {
            warnLog('IndexedDB başlatılamadı, localStorage kullanılacak:', err);
        });
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


