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
        
        // badge-detail-modal kapatıldığında badges-modal açık kalmalı
        if (modalId === 'badge-detail-modal' && currentOpenModal === 'badges-modal') {
            // badges-modal zaten açık, sadece badge-detail-modal'ı kapat
            return;
        }
        
        // Body scroll'unu tekrar etkinleştir (sadece tüm modaller kapandığında)
        if (currentOpenModal === modalId) {
            currentOpenModal = null;
            // Başka açık modal var mı kontrol et
            const anyModalOpen = Array.from(document.querySelectorAll('.modal')).some(m => 
                m.style.display === 'flex' || (m.style.display !== 'none' && m.id !== modalId)
            );
            if (!anyModalOpen) {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
            }
        }
    }
}

/**
 * Modal'ı açar
 */
function openModal(modalId) {
    // badge-detail-modal badges-modal açıkken açılabilir (üst üste modal desteği)
    const canStackModal = modalId === 'badge-detail-modal' && currentOpenModal === 'badges-modal';
    
    // Eğer başka bir modal açıksa ve üst üste modal desteği yoksa önce onu kapat
    if (currentOpenModal && currentOpenModal !== modalId && !canStackModal) {
        closeModal(currentOpenModal);
    }
    
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        
        // Üst üste modal desteği varsa currentOpenModal'ı değiştirme
        if (!canStackModal) {
            currentOpenModal = modalId;
        }
        
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
/**
 * Tarihe belirtilen gün sayısını ekler
 */
function addDays(dateString, days) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return getLocalDateString(date);
}

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
 * Doğru cevabı eşit dağılımla yerleştirir
 * @param {Array} options - Tüm seçenekler (doğru + yanlış)
 * @param {*} correctAnswer - Doğru cevap
 * @param {Array} positionCounts - Her pozisyonun kullanım sayısı [0,0,0,0]
 * @returns {Object} {options: Array, correctIndex: number}
 */
function shuffleWithEqualDistribution(options, correctAnswer, positionCounts) {
    // Doğru cevabın mevcut pozisyonunu bul
    const currentCorrectIndex = options.indexOf(correctAnswer);
    
    // En az kullanılan pozisyonları bul
    const minCount = Math.min(...positionCounts);
    const leastUsedPositions = positionCounts
        .map((count, index) => ({ count, index }))
        .filter(item => item.count === minCount)
        .map(item => item.index);
    
    // Eğer doğru cevap zaten en az kullanılan pozisyonlardan birindeyse, olduğu gibi bırak
    if (leastUsedPositions.includes(currentCorrectIndex)) {
        // Diğer seçenekleri karıştır
        const otherOptions = options.filter((opt, idx) => idx !== currentCorrectIndex);
        const shuffledOthers = shuffleArray(otherOptions);
        
        // Doğru cevabı yerinde bırak, diğerlerini karıştır
        const result = [...options];
        let otherIndex = 0;
        for (let i = 0; i < result.length; i++) {
            if (i !== currentCorrectIndex) {
                result[i] = shuffledOthers[otherIndex++];
            }
        }
        
        return {
            options: result,
            correctIndex: currentCorrectIndex
        };
    }
    
    // Doğru cevabı en az kullanılan pozisyonlardan birine taşı
    const targetPosition = leastUsedPositions[Math.floor(Math.random() * leastUsedPositions.length)];
    
    // Yeni düzenleme oluştur
    const result = [...options];
    const temp = result[currentCorrectIndex];
    result[currentCorrectIndex] = result[targetPosition];
    result[targetPosition] = temp;
    
    // Diğer seçenekleri de karıştır (doğru cevap hariç)
    const otherIndices = [0, 1, 2, 3].filter(i => i !== targetPosition);
    const otherOptions = otherIndices.map(i => result[i]);
    const shuffledOthers = shuffleArray(otherOptions);
    
    otherIndices.forEach((originalIndex, shuffleIndex) => {
        result[originalIndex] = shuffledOthers[shuffleIndex];
    });
    
    return {
        options: result,
        correctIndex: targetPosition
    };
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

/**
 * Oyun bilgilendirme modalını gösterir
 * @param {string} gameMode - Oyun modu ('kelime-cevir', 'dinle-bul', 'bosluk-doldur')
 */
function showGameInfoModal(gameMode) {
    // Modal'ı aç
    openModal('game-info-modal');
    
    // Oyun moduna göre içeriği güncelle
    updateGameInfoContent(gameMode);
    
    // Tab event listener'larını ekle
    setupGameInfoTabs();
}

/**
 * Oyun moduna göre bilgilendirme içeriğini günceller
 * @param {string} gameMode - Oyun modu
 */
function updateGameInfoContent(gameMode) {
    const howToPlayContent = document.getElementById('how-to-play-content');
    if (!howToPlayContent) return;
    
    let content = '';
    
    switch(gameMode) {
        case 'kelime-cevir':
            content = `
                <p>Arapça kelimenin Türkçe meâl karşılığını bulun.</p>
                <ul>
                    <li>4 seçenekten birini seçin</li>
                    <li>Doğru cevap için kelimenin zorluk seviyesine göre Hasene kazanın (5-21 Hasene)</li>
                    <li>Kolay kelimeler daha az, zor kelimeler daha fazla Hasene verir</li>
                    <li>10 soru tamamlayın</li>
                    <li>Perfect bonus için tüm soruları doğru cevaplayın</li>
                    <li>İpucu butonunu kullanarak yanlış bir seçeneği devre dışı bırakabilirsiniz (her soruda 1 kez)</li>
                    <li>Ses butonunu kullanarak kelimeyi dinleyebilirsiniz</li>
                    <li>Oyunu istediğiniz zaman "Geri" butonu ile çıkabilirsiniz</li>
                </ul>
                <p style="margin-top: 12px; font-size: 0.9rem; color: var(--text-secondary);">
                    💡 <strong>İpucu:</strong> Oyunu yarım bıraksanız bile kazandığınız puanlar kaydedilir. 
                    Ancak oyun sayısı sadece 10 soruyu tamamladığınızda artar. 
                    Detaylı bilgi için "İstatistikler" tab'ına bakın.
                </p>
            `;
            break;
        case 'dinle-bul':
            content = `
                <p>Dinlediğiniz Arapça kelimenin Türkçe meâl karşılığını bulun.</p>
                <ul>
                    <li>🎧 Ses butonuna tıklayarak kelimeyi dinleyin</li>
                    <li>4 seçenekten doğru olanı seçin</li>
                    <li>Doğru cevap için kelimenin zorluk seviyesine göre Hasene kazanın (5-21 Hasene)</li>
                    <li>Kolay kelimeler daha az, zor kelimeler daha fazla Hasene verir</li>
                    <li>10 soru tamamlayın</li>
                    <li>Perfect bonus için tüm soruları doğru cevaplayın</li>
                    <li>Oyunu istediğiniz zaman "Geri" butonu ile çıkabilirsiniz</li>
                </ul>
                <p style="margin-top: 12px; font-size: 0.9rem; color: var(--text-secondary);">
                    💡 <strong>İpucu:</strong> Oyunu yarım bıraksanız bile kazandığınız puanlar kaydedilir. 
                    Ancak oyun sayısı sadece 10 soruyu tamamladığınızda artar. 
                    Detaylı bilgi için "İstatistikler" tab'ına bakın.
                </p>
            `;
            break;
        case 'bosluk-doldur':
            content = `
                <p>Ayetteki eksik kelimeyi tamamlayın.</p>
                <ul>
                    <li>Ayetin Arapça metnini okuyun</li>
                    <li>Boşlukta hangi kelime olması gerektiğini bulun</li>
                    <li>4 seçenekten doğru olanı seçin</li>
                    <li>Doğru cevap için ayetin zorluk seviyesine göre Hasene kazanın:</li>
                    <li style="padding-left: 2rem;">• Kısa ayetler (1-6 kelime): 10 Hasene</li>
                    <li style="padding-left: 2rem;">• Orta ayetler (7-12 kelime): 15 Hasene</li>
                    <li style="padding-left: 2rem;">• Uzun ayetler (13+ kelime): 20 Hasene</li>
                    <li>10 soru tamamlayın</li>
                    <li>Perfect bonus için tüm soruları doğru cevaplayın</li>
                    <li>Ses butonunu kullanarak ayeti dinleyebilirsiniz</li>
                    <li>Oyunu istediğiniz zaman "Geri" butonu ile çıkabilirsiniz</li>
                </ul>
                <p style="margin-top: 12px; font-size: 0.9rem; color: var(--text-secondary);">
                    💡 <strong>İpucu:</strong> Oyunu yarım bıraksanız bile kazandığınız puanlar kaydedilir. 
                    Ancak oyun sayısı sadece 10 soruyu tamamladığınızda artar. 
                    Detaylı bilgi için "İstatistikler" tab'ına bakın.
                </p>
            `;
            break;
        default:
            content = `
                <p>Arapça kelimenin Türkçe meâl karşılığını bulun.</p>
                <ul>
                    <li>4 seçenekten birini seçin</li>
                    <li>Doğru cevap için kelimenin zorluk seviyesine göre Hasene kazanın (5-21 Hasene)</li>
                    <li>10 soru tamamlayın</li>
                    <li>Perfect bonus için tüm soruları doğru cevaplayın</li>
                </ul>
            `;
    }
    
    howToPlayContent.innerHTML = content;
}

/**
 * Bilgilendirme modalındaki tab'ları ayarlar
 */
function setupGameInfoTabs() {
    // Mevcut event listener'ları temizle
    document.querySelectorAll('.info-tab-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    // Yeni event listener'ları ekle
    document.querySelectorAll('.info-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchInfoTab(tabName);
        });
    });
}

/**
 * Bilgilendirme modalında tab değiştirir
 * @param {string} tabName - Tab adı
 */
function switchInfoTab(tabName) {
    // Tüm tab butonlarını pasif yap
    document.querySelectorAll('.info-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Tüm tab içeriklerini gizle
    document.querySelectorAll('.info-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Seçilen tab'ı aktif yap
    const activeBtn = document.querySelector(`.info-tab-btn[data-tab="${tabName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Seçilen tab içeriğini göster
    const activeContent = document.getElementById(`${tabName}-tab`);
    if (activeContent) {
        activeContent.classList.add('active');
    }
}

// Export
if (typeof window !== 'undefined') {
    window.getLocalDateString = getLocalDateString;
    window.addDays = addDays;
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
    window.shuffleWithEqualDistribution = shuffleWithEqualDistribution;
    window.showGameInfoModal = showGameInfoModal;
    window.switchInfoTab = switchInfoTab;
}

