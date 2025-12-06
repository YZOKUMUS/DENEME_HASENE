// ============================================
// DATA LOADER - Lazy Loading ve Veri Yönetimi
// ============================================

// Veri cache'leri
let kelimeData = null;
let ayetData = null;
let duaData = null;
let hadisData = null;

// Yükleme durumları
const loadingStates = {
    kelime: false,
    ayet: false,
    dua: false,
    hadis: false
};

/**
 * JSON dosyasını yükler
 */
async function loadJSONFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        errorLog('JSON yükleme hatası:', error);
        throw error;
    }
}

/**
 * Kelime verilerini yükler (lazy loading)
 */
async function loadKelimeData() {
    if (kelimeData) {
        return kelimeData;
    }
    
    if (loadingStates.kelime) {
        // Zaten yükleniyor, bekle
        while (loadingStates.kelime) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return kelimeData;
    }
    
    loadingStates.kelime = true;
    try {
        infoLog('Kelime verileri yükleniyor...');
        kelimeData = await loadJSONFile(CONFIG.DATA_PATH + 'kelimebul.json');
        infoLog('Kelime verileri yüklendi:', kelimeData.length, 'kelime');
        return kelimeData;
    } catch (error) {
        errorLog('Kelime verileri yüklenemedi:', error);
        return [];
    } finally {
        loadingStates.kelime = false;
    }
}

/**
 * Ayet verilerini yükler (lazy loading)
 */
async function loadAyetData() {
    if (ayetData) {
        return ayetData;
    }
    
    if (loadingStates.ayet) {
        while (loadingStates.ayet) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return ayetData;
    }
    
    loadingStates.ayet = true;
    try {
        infoLog('Ayet verileri yükleniyor...');
        ayetData = await loadJSONFile(CONFIG.DATA_PATH + 'ayetoku.json');
        infoLog('Ayet verileri yüklendi:', ayetData.length, 'ayet');
        return ayetData;
    } catch (error) {
        errorLog('Ayet verileri yüklenemedi:', error);
        return [];
    } finally {
        loadingStates.ayet = false;
    }
}

/**
 * Dua verilerini yükler (lazy loading)
 */
async function loadDuaData() {
    if (duaData) {
        return duaData;
    }
    
    if (loadingStates.dua) {
        while (loadingStates.dua) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return duaData;
    }
    
    loadingStates.dua = true;
    try {
        infoLog('Dua verileri yükleniyor...');
        duaData = await loadJSONFile(CONFIG.DATA_PATH + 'duaet.json');
        infoLog('Dua verileri yüklendi:', duaData.length, 'dua');
        return duaData;
    } catch (error) {
        errorLog('Dua verileri yüklenemedi:', error);
        return [];
    } finally {
        loadingStates.dua = false;
    }
}

/**
 * Hadis verilerini yükler (lazy loading)
 */
async function loadHadisData() {
    if (hadisData) {
        return hadisData;
    }
    
    if (loadingStates.hadis) {
        while (loadingStates.hadis) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return hadisData;
    }
    
    loadingStates.hadis = true;
    try {
        infoLog('Hadis verileri yükleniyor...');
        hadisData = await loadJSONFile(CONFIG.DATA_PATH + 'hadisoku.json');
        infoLog('Hadis verileri yüklendi:', hadisData.length, 'hadis');
        return hadisData;
    } catch (error) {
        errorLog('Hadis verileri yüklenemedi:', error);
        return [];
    } finally {
        loadingStates.hadis = false;
    }
}

/**
 * Tüm verileri önceden yükler (preload)
 */
async function preloadAllData() {
    infoLog('Tüm veriler önceden yükleniyor...');
    try {
        await Promise.all([
            loadKelimeData(),
            loadAyetData(),
            loadDuaData(),
            loadHadisData()
        ]);
        infoLog('Tüm veriler yüklendi');
    } catch (error) {
        errorLog('Veri ön yükleme hatası:', error);
    }
}

/**
 * Veri cache'lerini temizler
 */
function clearDataCache() {
    kelimeData = null;
    ayetData = null;
    duaData = null;
    hadisData = null;
    infoLog('Veri cache temizlendi');
}

// Export
if (typeof window !== 'undefined') {
    window.loadKelimeData = loadKelimeData;
    window.loadAyetData = loadAyetData;
    window.loadDuaData = loadDuaData;
    window.loadHadisData = loadHadisData;
    window.preloadAllData = preloadAllData;
    window.clearDataCache = clearDataCache;
}


