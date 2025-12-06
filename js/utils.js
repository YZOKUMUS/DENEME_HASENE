// ============================================
// UTILS - Yardımcı Fonksiyonlar
// ============================================

/**
 * YYYY-MM-DD formatında bugünün tarihini döndürür
 */
function getLocalDateString(date = new Date()) {
    // Yerel saat dilimini kullan
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Sayıyı binlik ayırıcı ile formatlar (1,234)
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Modal'ı kapatır
 */
// Açık modal takibi
let currentOpenModal = null;

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        // Body scroll'unu tekrar etkinleştir
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        
        // Açık modal kaydını temizle
        if (currentOpenModal === modalId) {
            currentOpenModal = null;
        }
    }
}

/**
 * Modal'ı açar
 */
function openModal(modalId) {
    // Eğer başka bir modal açıksa önce onu kapat
    if (currentOpenModal && currentOpenModal !== modalId) {
        closeModal(currentOpenModal);
    }
    
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        currentOpenModal = modalId;
        
        // Mobilde body scroll'unu engelle (sadece modal içinde kaydırma)
        if (window.innerWidth <= 600) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        }
    }
}

/**
 * Ana menüye döner
 */
function goToMainMenu(saveProgress = false) {
    // Çalan sesi durdur
    if (typeof window.stopCurrentAudio === 'function') {
        window.stopCurrentAudio();
    }
    
    // Tüm açık modalları kapat
    document.querySelectorAll('.modal').forEach(modal => {
        if (modal.style.display !== 'none') {
            modal.style.display = 'none';
        }
    });
    
    // Body scroll'unu tekrar etkinleştir
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    
    // Açık modal kaydını temizle
    if (typeof currentOpenModal !== 'undefined') {
        currentOpenModal = null;
    }
    
    // Oyun devam ediyorsa ve kayıt isteniyorsa
    if (saveProgress && typeof window.currentGame !== 'undefined' && window.currentGame !== null) {
        // Mevcut kazanımları kaydet
        if (typeof window.saveCurrentGameProgress === 'function') {
            window.saveCurrentGameProgress();
        }
    }
    
    // Tüm oyun ekranlarını gizle
    document.querySelectorAll('.game-screen, .reading-screen').forEach(screen => {
        screen.style.display = 'none';
    });
    
    // Ana menüyü göster
    const mainMenu = document.getElementById('main-menu');
    if (mainMenu) {
        mainMenu.style.display = 'block';
    }
    
    // Bottom nav'ı aktif et
    document.querySelectorAll('.bottom-nav .nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Oyun durumunu sıfırla
    if (typeof window.currentGame !== 'undefined') {
        window.currentGame = null;
        if (typeof window.currentGameMode !== 'undefined') {
            window.currentGameMode = null;
        }
        if (typeof window.currentSubMode !== 'undefined') {
            window.currentSubMode = null;
        }
    }
    
    const mainMenuBtn = document.querySelector('.bottom-nav .nav-btn[data-page="main-menu"]');
    if (mainMenuBtn) {
        mainMenuBtn.classList.add('active');
    }
}

/**
 * Hafta başlangıç tarihini döndürür (Pazartesi)
 */
function getWeekStartDate(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Pazartesi
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

/**
 * Hafta bitiş tarihini döndürür (Pazar)
 */
function getWeekEndDate(date = new Date()) {
    const start = getWeekStartDate(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
}

/**
 * Hafta başlangıç tarihini string olarak döndürür
 */
function getWeekStartDateString(date = new Date()) {
    return getLocalDateString(getWeekStartDate(date));
}

/**
 * Hafta bitiş tarihini string olarak döndürür
 */
function getWeekEndDateString(date = new Date()) {
    return getLocalDateString(getWeekEndDate(date));
}

/**
 * İki tarih arasındaki gün farkını döndürür
 */
function getDaysDifference(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    firstDate.setHours(0, 0, 0, 0);
    secondDate.setHours(0, 0, 0, 0);
    return Math.round((secondDate - firstDate) / oneDay);
}

/**
 * Array'den rastgele eleman seçer
 */
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Array'den rastgele N eleman seçer (tekrar etmeden)
 */
function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

/**
 * Array'i karıştırır (Fisher-Yates shuffle)
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Debounce fonksiyonu
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle fonksiyonu
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Custom alert gösterir
 */
function showCustomAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        padding: 1rem 2rem;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#667eea'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 35px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 300);
    }, 3000);
}

/**
 * Başarı mesajı gösterir
 */
function showSuccessMessage(message) {
    showCustomAlert(message, 'success');
}

/**
 * Hata mesajı gösterir
 */
function showErrorMessage(message) {
    showCustomAlert(message, 'error');
}

/**
 * Ses çalar (Web Audio API veya HTML5 Audio)
 */
function playSound(soundName) {
    // Ses efektleri için placeholder
    // Gerçek implementasyon ses dosyaları eklendiğinde yapılacak
    if (CONFIG && CONFIG.DEBUG) {
        console.log('Playing sound:', soundName);
    }
}

/**
 * HTML'i sanitize eder (XSS koruması)
 */
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * LocalStorage'dan güvenli şekilde veri okur
 */
function safeGetItem(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return defaultValue;
    }
}

/**
 * LocalStorage'a güvenli şekilde veri yazar
 */
function safeSetItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Error writing to localStorage:', e);
        return false;
    }
}

/**
 * Zorluk seviyesine göre kelime filtreler
 * JSON'da difficulty değerleri 5-21 arasında (çoğunlukla 6-16)
 * Analiz sonucu: Kolay (5-8): 27.57%, Orta (9-12): 53.38%, Zor (13-21): 19.05%
 * Daha dengeli dağılım için:
 * Kolay: 5-8, Orta: 9-12, Zor: 13-21
 */
function filterByDifficulty(words, difficulty) {
    if (difficulty === 'easy') {
        // Kolay: difficulty 5-8 arası (4091 kelime, %27.57)
        return words.filter(w => {
            const diff = w.difficulty ?? 10; // Varsayılan orta seviye
            return diff >= 5 && diff <= 8;
        });
    } else if (difficulty === 'medium') {
        // Orta: difficulty 9-12 arası (8079 kelime, %54.48)
        return words.filter(w => {
            const diff = w.difficulty ?? 10; // Varsayılan orta seviye
            return diff >= 9 && diff <= 12;
        });
    } else if (difficulty === 'hard') {
        // Zor: difficulty 13-21 arası (2667 kelime, %17.98)
        return words.filter(w => {
            const diff = w.difficulty ?? 10; // Varsayılan orta seviye
            return diff >= 13 && diff <= 21;
        });
    }
    return words;
}

/**
 * 30. cüz ayetlerini filtreler (sure 78-114)
 */
function filterJuz30(words) {
    return words.filter(w => {
        const sureNum = parseInt(w.id.split(':')[0]);
        return sureNum >= 78 && sureNum <= 114;
    });
}


// CSS Animasyonları için style ekle
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-20px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export
if (typeof window !== 'undefined') {
    window.getLocalDateString = getLocalDateString;
    window.formatNumber = formatNumber;
    window.closeModal = closeModal;
    window.openModal = openModal;
    window.goToMainMenu = goToMainMenu;
    window.getWeekStartDate = getWeekStartDate;
    window.getWeekEndDate = getWeekEndDate;
    window.getWeekStartDateString = getWeekStartDateString;
    window.getWeekEndDateString = getWeekEndDateString;
    window.getDaysDifference = getDaysDifference;
    window.getRandomItem = getRandomItem;
    window.getRandomItems = getRandomItems;
    window.shuffleArray = shuffleArray;
    window.debounce = debounce;
    window.throttle = throttle;
    window.showCustomAlert = showCustomAlert;
    window.showSuccessMessage = showSuccessMessage;
    window.showErrorMessage = showErrorMessage;
    window.playSound = playSound;
    window.sanitizeHTML = sanitizeHTML;
    window.safeGetItem = safeGetItem;
    window.safeSetItem = safeSetItem;
    window.filterByDifficulty = filterByDifficulty;
    window.filterJuz30 = filterJuz30;
}

