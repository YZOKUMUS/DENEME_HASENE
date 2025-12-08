// ============================================
// FAVORITES MANAGER - Favori Kelimeler Yönetimi
// ============================================

/**
 * Favori kelimeler listesi
 */
let favoriteWords = new Set();

/**
 * Favori kelimeleri yükler
 */
async function loadFavorites() {
    try {
        // Önce IndexedDB'den yükle (öncelikli)
        if (typeof loadFromIndexedDB === 'function') {
            try {
                const indexedDBData = await loadFromIndexedDB('hasene_favoriteWords');
                if (indexedDBData && Array.isArray(indexedDBData) && indexedDBData.length >= 0) {
                    favoriteWords = new Set(indexedDBData);
                    // localStorage'a da senkronize et (yedek)
                    safeSetItem('hasene_favoriteWords', indexedDBData);
                    return;
                }
            } catch (e) {
                // IndexedDB'den yüklenemezse localStorage'dan yükle
                infoLog('IndexedDB\'den favori kelimeler yüklenemedi, localStorage\'dan yükleniyor:', e);
            }
        }
        
        // IndexedDB'de yoksa veya yüklenemezse localStorage'dan yükle (yedek)
        const favoritesData = safeGetItem('hasene_favoriteWords', []);
        favoriteWords = new Set(favoritesData);
        
        // IndexedDB'ye de senkronize et (eğer yoksa)
        if (typeof saveToIndexedDB === 'function' && favoritesData.length > 0) {
            try {
                await saveToIndexedDB('hasene_favoriteWords', favoritesData);
            } catch (e) {
                // IndexedDB'ye kaydedilemezse devam et
                infoLog('Favori kelimeler IndexedDB\'ye kaydedilemedi:', e);
            }
        }
    } catch (e) {
        errorLog('Favori kelimeler yüklenirken hata:', e);
        favoriteWords = new Set();
    }
}

/**
 * Favori kelimeleri kaydeder
 */
async function saveFavorites() {
    try {
        const favoritesArray = Array.from(favoriteWords);
        
        // localStorage'a kaydet (yedek)
        safeSetItem('hasene_favoriteWords', favoritesArray);
        
        // IndexedDB'ye de kaydet (ana sistem)
        if (typeof saveToIndexedDB === 'function') {
            try {
                await saveToIndexedDB('hasene_favoriteWords', favoritesArray);
            } catch (e) {
                // IndexedDB'ye kaydedilemezse localStorage'a kaydedildi, devam et
                infoLog('Favori kelimeler IndexedDB\'ye kaydedilemedi, localStorage\'a kaydedildi:', e);
            }
        }
    } catch (e) {
        errorLog('Favori kelimeler kaydedilirken hata:', e);
    }
}

/**
 * Kelimeyi favorilere ekler
 * @param {string} wordId - Kelime ID'si
 * @returns {boolean} - Başarılı mı?
 */
async function addToFavorites(wordId) {
    if (!wordId) return false;
    favoriteWords.add(wordId);
    await saveFavorites();
    return true;
}

/**
 * Kelimeyi favorilerden çıkarır
 * @param {string} wordId - Kelime ID'si
 * @returns {boolean} - Başarılı mı?
 */
async function removeFromFavorites(wordId) {
    if (!wordId) return false;
    favoriteWords.delete(wordId);
    await saveFavorites();
    return true;
}

/**
 * Kelime favori mi kontrol eder
 * @param {string} wordId - Kelime ID'si
 * @returns {boolean} - Favori mi?
 */
function isFavorite(wordId) {
    return favoriteWords.has(wordId);
}

/**
 * Favori kelimeleri döndürür
 * @returns {Array<string>} - Favori kelime ID'leri
 */
function getFavoriteWords() {
    return Array.from(favoriteWords);
}

/**
 * Kelimeyi favorilere ekler veya çıkarır (toggle)
 * @param {string} wordId - Kelime ID'si
 * @param {HTMLElement} buttonElement - Buton elementi (opsiyonel)
 * @returns {boolean} - Favori mi? (işlem sonrası)
 */
async function toggleFavorite(wordId, buttonElement = null) {
    if (!wordId) return false;
    
    const wasFavorite = favoriteWords.has(wordId);
    
    if (wasFavorite) {
        await removeFromFavorites(wordId);
    } else {
        await addToFavorites(wordId);
    }
    
    // Buton varsa güncelle
    if (buttonElement) {
        const isNowFavorite = favoriteWords.has(wordId);
        if (isNowFavorite) {
            buttonElement.classList.add('favorited');
            buttonElement.innerHTML = '⭐';
            buttonElement.title = 'Favorilerden çıkar';
        } else {
            buttonElement.classList.remove('favorited');
            buttonElement.innerHTML = '☆';
            buttonElement.title = 'Favorilere ekle';
        }
    }
    
    return favoriteWords.has(wordId);
}

/**
 * Favori kelime sayısını döndürür
 * @returns {number} - Favori kelime sayısı
 */
function getFavoriteWordsCount() {
    return favoriteWords.size;
}

// Sayfa yüklendiğinde favorileri yükle
if (typeof window !== 'undefined') {
    // DOMContentLoaded'da yükle
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadFavorites().catch(e => {
                errorLog('Favori kelimeler yüklenirken hata:', e);
            });
        });
    } else {
        loadFavorites().catch(e => {
            errorLog('Favori kelimeler yüklenirken hata:', e);
        });
    }
}

// Export
if (typeof window !== 'undefined') {
    window.addToFavorites = addToFavorites;
    window.removeFromFavorites = removeFromFavorites;
    window.isFavorite = isFavorite;
    window.getFavoriteWords = getFavoriteWords;
    window.getFavoriteWordsCount = getFavoriteWordsCount;
    window.loadFavorites = loadFavorites;
    window.toggleFavorite = toggleFavorite;
}

