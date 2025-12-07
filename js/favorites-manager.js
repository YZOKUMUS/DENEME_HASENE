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
function loadFavorites() {
    try {
        const favoritesData = safeGetItem('hasene_favoriteWords', []);
        favoriteWords = new Set(favoritesData);
    } catch (e) {
        errorLog('Favori kelimeler yüklenirken hata:', e);
        favoriteWords = new Set();
    }
}

/**
 * Favori kelimeleri kaydeder
 */
function saveFavorites() {
    try {
        const favoritesArray = Array.from(favoriteWords);
        safeSetItem('hasene_favoriteWords', favoritesArray);
        // IndexedDB'ye de kaydet
        if (db) {
            saveToIndexedDB('hasene_favoriteWords', favoritesArray);
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
function addToFavorites(wordId) {
    if (!wordId) return false;
    favoriteWords.add(wordId);
    saveFavorites();
    return true;
}

/**
 * Kelimeyi favorilerden çıkarır
 * @param {string} wordId - Kelime ID'si
 * @returns {boolean} - Başarılı mı?
 */
function removeFromFavorites(wordId) {
    if (!wordId) return false;
    favoriteWords.delete(wordId);
    saveFavorites();
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
        document.addEventListener('DOMContentLoaded', loadFavorites);
    } else {
        loadFavorites();
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
}

