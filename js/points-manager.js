// ============================================
// POINTS MANAGER - Puan Sistemi Yönetimi
// ============================================

/**
 * Session puanı ekler
 * @param {number} points - Eklenecek puan
 */
function addSessionPoints(points) {
    const oldScore = sessionScore;
    sessionScore += points;
    
    // Log ekle (eğer gameLog fonksiyonu varsa)
    if (typeof gameLog === 'function') {
        gameLog('💰 Puan eklendi', { 
            points, 
            oldScore, 
            newScore: sessionScore,
            totalSessionScore: sessionScore
        });
    }
    
    const sessionScoreEl = document.getElementById('session-score');
    if (sessionScoreEl) {
        sessionScoreEl.textContent = `Hasene: ${sessionScore}`;
    }
}

/**
 * Günlük XP ekler - GÜNLÜK VİRD SADECE HASENE PUAN VE KAZANILAN TÜM BONUS, COMBO, HEDİYE VS PUANLARA GÖRE ENDEKSLENMİŞTİR
 * @param {number} points - Eklenecek puan (doğru cevap + combo bonusu + perfect lesson bonusu + günlük görev ödülü + hediye vs)
 */
function addDailyXP(points) {
    const dailyXP = parseInt(localStorage.getItem('dailyXP') || '0');
    localStorage.setItem('dailyXP', (dailyXP + points).toString());
    updateDailyGoalDisplay();
}

/**
 * Seviye hesaplar
 * @param {number} points - Toplam puan
 * @returns {number} - Seviye
 */
function calculateLevel(points) {
    if (!LEVELS || !LEVELS.THRESHOLDS) {
        return 1;
    }
    
    let level = 1;
    for (let i = 1; i <= 20; i++) {
        if (points >= LEVELS.THRESHOLDS[i]) {
            level = i;
        } else {
            break;
        }
    }
    
    // Level 10'dan sonra her 15,000 Hasene için 1 seviye
    if (points >= LEVELS.THRESHOLDS[10]) {
        const extraPoints = points - LEVELS.THRESHOLDS[10];
        const extraLevels = Math.floor(extraPoints / LEVELS.INCREMENT_AFTER_10);
        level = 10 + extraLevels;
    }
    
    return level;
}

/**
 * Seviye adını döndürür
 * @param {number} level - Seviye numarası
 * @returns {string} - Seviye adı
 */
function getLevelName(level) {
    if (!LEVELS || !LEVELS.NAMES) {
        return 'Mübtedi';
    }
    
    if (level <= 5) {
        return LEVELS.NAMES[level] || 'Mübtedi';
    } else if (level <= 10) {
        return LEVELS.NAMES[level] || 'Müteallim';
    } else {
        return 'Usta';
    }
}

/**
 * Rozet hesaplar
 * @param {number} points - Toplam puan
 * @returns {Object} - Rozet sayıları
 */
function calculateBadges(points) {
    const badges = {
        stars: 0,
        bronze: 0,
        silver: 0,
        gold: 0,
        diamond: 0
    };
    
    if (!LEVELS || !LEVELS.BADGE_THRESHOLDS) {
        return badges;
    }
    
    // Her rozet seviyesi için kontrol et
    Object.keys(LEVELS.BADGE_THRESHOLDS).forEach(badgeType => {
        const threshold = LEVELS.BADGE_THRESHOLDS[badgeType];
        if (points >= threshold) {
            badges[badgeType] = Math.floor(points / threshold);
        }
    });
    
    return badges;
}

/**
 * Global puanlara ekler
 * @param {number} points - Eklenecek puan
 * @param {number} correctAnswers - Doğru cevap sayısı
 */
async function addToGlobalPoints(points, correctAnswers) {
    console.log('💰 addToGlobalPoints çağrıldı:', {
        points: points,
        correctAnswers: correctAnswers,
        totalPointsBefore: totalPoints
    });
    
    const oldLevel = calculateLevel(totalPoints);
    totalPoints += points;
    
    console.log('💰 addToGlobalPoints: totalPoints güncellendi:', {
        totalPointsAfter: totalPoints,
        addedPoints: points
    });
    
    // Rozetleri güncelle (eğer calculateBadges fonksiyonu varsa)
    if (typeof calculateBadges === 'function' && typeof badges !== 'undefined') {
        badges = calculateBadges(totalPoints);
    }
    
    // Günlük XP ekle
    addDailyXP(points);
    
    // Yeni seviye kontrolü
    const newLevel = calculateLevel(totalPoints);
    if (newLevel > oldLevel) {
        if (typeof showLevelUpModal === 'function') {
            showLevelUpModal(newLevel);
        }
    }
    
    // UI'ı güncelle (HEMEN GÖRÜNSÜN)
    if (typeof updateStatsBar === 'function') {
        updateStatsBar(); // Hasene, Yıldız, Mertebe güncellenir
    }
    
    if (typeof updateDailyGoalDisplay === 'function') {
        updateDailyGoalDisplay(); // Günlük hedef progress bar güncellenir
    }
    
    if (typeof updateStreakDisplay === 'function') {
        updateStreakDisplay(); // Streak (Seri) güncellenir
    }
    
    // Kaydet (ÖNEMLİ: await et - totalPoints güncellenmeden kayıt yapılmamalı)
    if (typeof saveStatsImmediate === 'function') {
        // ÖNEMLİ: await ekle - totalPoints güncellenmeden kayıt yapılmamalı
        await saveStatsImmediate();
        console.log('✅ addToGlobalPoints: saveStatsImmediate tamamlandı, totalPoints:', totalPoints);
    }
    
    // Rozetleri kontrol et
    if (typeof checkBadges === 'function') {
        checkBadges();
    }
    
    // Başarımları kontrol et
    if (typeof checkAchievements === 'function') {
        checkAchievements();
    }
    
    // Streak güncelle
    if (correctAnswers > 0 && typeof updateDailyProgress === 'function') {
        updateDailyProgress(correctAnswers);
        // Streak güncellendikten sonra tekrar göster
        if (typeof updateStreakDisplay === 'function') {
            updateStreakDisplay();
        }
        // Günlük hedef de güncellenebilir
        if (typeof updateDailyGoalDisplay === 'function') {
            updateDailyGoalDisplay();
        }
    }
}

// Export
if (typeof window !== 'undefined') {
    window.addSessionPoints = addSessionPoints;
    window.addDailyXP = addDailyXP;
    window.calculateLevel = calculateLevel;
    window.getLevelName = getLevelName;
    window.calculateBadges = calculateBadges;
    window.addToGlobalPoints = addToGlobalPoints;
}

