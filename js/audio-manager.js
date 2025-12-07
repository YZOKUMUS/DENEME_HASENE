// ============================================
// AUDIO MANAGER - Ses Yönetimi
// ============================================

/**
 * Global audio değişkeni - tek seferde bir ses çalınması için
 */
let currentAudio = null;
window.currentAudio = null; // Global erişim için

/**
 * Mevcut sesi durdurur
 */
function stopCurrentAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
        window.currentAudio = null;
    }
}

/**
 * Ses dosyasını çalar
 * @param {string} url - Ses dosyası URL'i
 * @param {HTMLElement} buttonElement - Buton elementi (opsiyonel)
 * @param {Object} options - Ek seçenekler
 * @param {Function} options.onEnded - Ses bittiğinde çağrılacak fonksiyon
 * @param {Function} options.onError - Hata durumunda çağrılacak fonksiyon
 * @returns {Promise<Audio>} - Audio objesi
 */
async function playAudio(url, buttonElement = null, options = {}) {
    // Önceki sesi durdur
    stopCurrentAudio();
    
    if (!url) {
        warnLog('Ses URL\'i bulunamadı');
        if (buttonElement) {
            buttonElement.disabled = true;
            buttonElement.style.opacity = '0.5';
        }
        return null;
    }
    
    try {
        // Yeni ses oluştur
        currentAudio = new Audio(url);
        window.currentAudio = currentAudio;
        
        // Buton durumunu güncelle
        if (buttonElement) {
            buttonElement.disabled = true;
            buttonElement.style.opacity = '0.6';
        }
        
        // Ses çal
        await currentAudio.play();
        
        // Ses bitince
        currentAudio.onended = () => {
            if (buttonElement) {
                buttonElement.disabled = false;
                buttonElement.style.opacity = '1';
            }
            
            // Custom onEnded callback
            if (options.onEnded) {
                try {
                    options.onEnded();
                } catch (e) {
                    errorLog('onEnded callback error:', e);
                }
            }
            
            // Audio'yu temizle
            currentAudio = null;
            window.currentAudio = null;
        };
        
        // Hata durumunda
        currentAudio.onerror = () => {
            errorLog('Ses çalınamadı:', url);
            if (buttonElement) {
                buttonElement.disabled = false;
                buttonElement.style.opacity = '1';
            }
            
            // Custom onError callback
            if (options.onError) {
                try {
                    options.onError();
                } catch (e) {
                    errorLog('onError callback error:', e);
                }
            }
            
            // Hata mesajı göster
            if (typeof showErrorMessage === 'function') {
                showErrorMessage('Ses dosyası çalınamadı.');
            }
            
            // Audio'yu temizle
            currentAudio = null;
            window.currentAudio = null;
        };
        
        return currentAudio;
        
    } catch (err) {
        errorLog('Ses çalınamadı:', err);
        
        if (buttonElement) {
            buttonElement.disabled = false;
            buttonElement.style.opacity = '1';
        }
        
        if (typeof showErrorMessage === 'function') {
            showErrorMessage('Ses dosyası yüklenemedi!');
        }
        
        currentAudio = null;
        window.currentAudio = null;
        return null;
    }
}

/**
 * Ses butonunu ayarlar (onclick handler)
 * @param {HTMLElement} buttonElement - Buton elementi
 * @param {string} audioUrl - Ses dosyası URL'i
 * @param {Object} options - Ek seçenekler
 */
function setupAudioButton(buttonElement, audioUrl, options = {}) {
    if (!buttonElement) return;
    
    if (!audioUrl) {
        // Ses dosyası yoksa butonu devre dışı bırak
        buttonElement.disabled = true;
        buttonElement.style.opacity = '0.5';
        buttonElement.onclick = null;
        return;
    }
    
    // Butonu aktif et
    buttonElement.disabled = false;
    buttonElement.style.opacity = '1';
    
    // Click handler
    buttonElement.onclick = () => {
        playAudio(audioUrl, buttonElement, options);
    };
}

// Export
if (typeof window !== 'undefined') {
    window.stopCurrentAudio = stopCurrentAudio;
    window.playAudio = playAudio;
    window.setupAudioButton = setupAudioButton;
    window.currentAudio = currentAudio;
}

