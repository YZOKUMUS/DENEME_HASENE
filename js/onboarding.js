// ============================================
// ONBOARDING - İlk Açılış Turu
// ============================================

let currentOnboardingSlide = 0;
const totalOnboardingSlides = 7;

/**
 * Onboarding modalını gösterir
 */
function showOnboarding() {
    currentOnboardingSlide = 0;
    updateOnboardingSlide();
    openModal('onboarding-modal');
}

// Onboarding elementleri cache'le (duplikasyon önleme)
let onboardingElementsCache = null;

/**
 * Onboarding elementlerini alır (cache'lenmiş)
 */
function getOnboardingElements() {
    if (!onboardingElementsCache) {
        onboardingElementsCache = {
            prevBtn: document.getElementById('onboarding-prev'),
            nextBtn: document.getElementById('onboarding-next'),
            skipBtn: document.getElementById('onboarding-skip')
        };
    }
    return onboardingElementsCache;
}

/**
 * Onboarding slide'ını günceller
 */
function updateOnboardingSlide() {
    // Tüm slide'ları gizle
    document.querySelectorAll('.onboarding-slide').forEach(slide => {
        slide.style.display = 'none';
    });
    
    // Mevcut slide'ı göster
    const currentSlide = document.querySelector(`.onboarding-slide[data-slide="${currentOnboardingSlide}"]`);
    if (currentSlide) {
        currentSlide.style.display = 'block';
    }
    
    // Butonları güncelle (cache'lenmiş elementleri kullan)
    const elements = getOnboardingElements();
    
    if (elements.prevBtn) {
        elements.prevBtn.style.display = currentOnboardingSlide === 0 ? 'none' : 'block';
    }
    
    if (elements.nextBtn) {
        if (currentOnboardingSlide === totalOnboardingSlides - 1) {
            elements.nextBtn.textContent = 'Başla!';
        } else {
            elements.nextBtn.textContent = 'İleri →';
        }
    }
}

/**
 * Sonraki slide'a geçer
 */
function nextOnboardingSlide() {
    if (currentOnboardingSlide < totalOnboardingSlides - 1) {
        currentOnboardingSlide++;
        updateOnboardingSlide();
    } else {
        // Onboarding'i bitir
        finishOnboarding();
    }
}

/**
 * Önceki slide'a geçer
 */
function prevOnboardingSlide() {
    if (currentOnboardingSlide > 0) {
        currentOnboardingSlide--;
        updateOnboardingSlide();
    }
}

/**
 * Onboarding'i bitirir
 */
function finishOnboarding() {
    localStorage.setItem('hasene_onboarding_seen_v2', 'true');
    closeModal('onboarding-modal');
}

/**
 * Onboarding'i atlar
 */
function skipOnboarding() {
    finishOnboarding();
}

// Event listeners (cache'lenmiş elementleri kullan)
if (typeof document !== 'undefined') {
    const elements = getOnboardingElements();
    
    if (elements.nextBtn) {
        elements.nextBtn.addEventListener('click', nextOnboardingSlide);
    }
    
    if (elements.prevBtn) {
        elements.prevBtn.addEventListener('click', prevOnboardingSlide);
    }
    
    if (elements.skipBtn) {
        elements.skipBtn.addEventListener('click', skipOnboarding);
    }
}

// Export
if (typeof window !== 'undefined') {
    window.showOnboarding = showOnboarding;
}

