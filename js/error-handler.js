// ============================================
// ERROR HANDLER - Hata Yönetimi
// ============================================

/**
 * Global hata yakalayıcı
 */
window.addEventListener('error', (event) => {
    errorLog('Global hata:', event.error);
    // Hata bildirimi göster (opsiyonel)
    if (CONFIG && CONFIG.DEBUG) {
        showErrorMessage('Bir hata oluştu. Lütfen sayfayı yenileyin.');
    }
});

/**
 * Promise rejection yakalayıcı
 */
window.addEventListener('unhandledrejection', (event) => {
    errorLog('Unhandled promise rejection:', event.reason);
    // Hata bildirimi göster (opsiyonel)
    if (CONFIG && CONFIG.DEBUG) {
        showErrorMessage('Bir hata oluştu. Lütfen sayfayı yenileyin.');
    }
});

/**
 * Try-catch wrapper
 */
function safeExecute(func, errorMessage = 'Bir hata oluştu') {
    try {
        return func();
    } catch (error) {
        errorLog(errorMessage, error);
        if (CONFIG && CONFIG.DEBUG) {
            showErrorMessage(errorMessage);
        }
        return null;
    }
}

/**
 * Async try-catch wrapper
 */
async function safeExecuteAsync(func, errorMessage = 'Bir hata oluştu') {
    try {
        return await func();
    } catch (error) {
        errorLog(errorMessage, error);
        if (CONFIG && CONFIG.DEBUG) {
            showErrorMessage(errorMessage);
        }
        return null;
    }
}

// Export
if (typeof window !== 'undefined') {
    window.safeExecute = safeExecute;
    window.safeExecuteAsync = safeExecuteAsync;
}


