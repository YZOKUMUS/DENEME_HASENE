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
    
    // Butonları güncelle
    const prevBtn = document.getElementById('onboarding-prev');
    const nextBtn = document.getElementById('onboarding-next');
    
    if (prevBtn) {
        prevBtn.style.display = currentOnboardingSlide === 0 ? 'none' : 'block';
    }
    
    if (nextBtn) {
        if (currentOnboardingSlide === totalOnboardingSlides - 1) {
            nextBtn.textContent = 'Başla!';
        } else {
            nextBtn.textContent = 'İleri →';
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

// Event listeners
if (typeof document !== 'undefined') {
    const nextBtn = document.getElementById('onboarding-next');
    const prevBtn = document.getElementById('onboarding-prev');
    const skipBtn = document.getElementById('onboarding-skip');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextOnboardingSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevOnboardingSlide);
    }
    
    if (skipBtn) {
        skipBtn.addEventListener('click', skipOnboarding);
    }
}

// Export
if (typeof window !== 'undefined') {
    window.showOnboarding = showOnboarding;
}

