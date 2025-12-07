// ============================================
// WORD STATS MANAGER - Kelime İstatistikleri Yönetimi
// ============================================

/**
 * Kelime istatistiklerini günceller (Spaced Repetition - SM-2 algoritması)
 * @param {string} wordId - Kelime ID'si
 * @param {boolean} isCorrect - Doğru cevap verildi mi?
 */
function updateWordStats(wordId, isCorrect) {
    const today = getLocalDateString();
    if (!wordStats[wordId]) {
        wordStats[wordId] = {
            attempts: 0,
            correct: 0,
            wrong: 0,
            successRate: 0,
            masteryLevel: 0,
            lastCorrect: null,
            lastWrong: null,
            easeFactor: 2.5, // SM-2 başlangıç değeri
            interval: 0,     // Gün cinsinden tekrar aralığı
            nextReviewDate: today, // Sonraki tekrar tarihi
            lastReview: null // Son tekrar tarihi
        };
    }
    
    const stats = wordStats[wordId];
    const previousAttempts = stats.attempts; // Önceki deneme sayısını al
    stats.attempts++;
    stats.lastReview = today; // Her denemede son tekrar tarihini güncelle
    
    if (isCorrect) {
        stats.correct++;
        stats.lastCorrect = today;
        
        // SM-2 Algoritması: Doğru cevap durumu
        if (previousAttempts === 0) {
            // İlk öğrenme
            stats.interval = 1; // 1 gün sonra tekrar
        } else if (previousAttempts === 1 && stats.correct === 2) {
            // İkinci doğru cevap (ilk denemede yanlış, ikinci denemede doğru)
            // Veya ilk denemede doğru, ikinci denemede doğru
            stats.interval = 6; // 6 gün sonra tekrar
        } else {
            // Sonraki doğru cevaplar
            stats.interval = Math.max(1, Math.floor(stats.interval * stats.easeFactor));
        }
        
        // Ease Factor güncellemesi (SM-2)
        // Başarı oranına göre ease factor'ü ayarla
        const currentSuccessRate = (stats.correct / stats.attempts) * 100;
        
        if (currentSuccessRate >= 90) {
            // Çok başarılı → Ease factor artır (kolaylaştır)
            stats.easeFactor = Math.min(2.5, stats.easeFactor + 0.15);
        } else if (currentSuccessRate >= 70) {
            // Başarılı → Ease factor hafif artır
            stats.easeFactor = Math.min(2.5, stats.easeFactor + 0.05);
        } else if (currentSuccessRate < 50) {
            // Başarısız → Ease factor azalt (zorlaştır)
            stats.easeFactor = Math.max(1.3, stats.easeFactor - 0.15);
        }
        // 50-70 arası: ease factor değişmez
        
    } else {
        // Yanlış cevap
        stats.wrong++;
        stats.lastWrong = today;
        
        // SM-2 Algoritması: Yanlış cevap durumu
        // Yanlış cevap verilince interval sıfırlanır ve ease factor azalır
        stats.interval = 1; // 1 gün sonra tekrar (sıfırla)
        stats.easeFactor = Math.max(1.3, stats.easeFactor - 0.20); // Zorlaştır
    }
    
    // Sonraki tekrar tarihini hesapla
    stats.nextReviewDate = addDays(today, stats.interval);
    
    // Başarı oranı ve ustalık seviyesi
    stats.successRate = (stats.correct / stats.attempts) * 100;
    stats.masteryLevel = Math.min(10, Math.floor(stats.successRate / 10));
    
    debouncedSaveStats();
}

/**
 * Zorlanılan kelimeleri döndürür
 * @returns {Array} - Zorlanılan kelimeler
 */
function getStrugglingWords() {
    return Object.keys(wordStats)
        .filter(wordId => {
            const stats = wordStats[wordId];
            return stats.attempts >= 2 && stats.successRate < 50;
        })
        .map(wordId => ({
            id: wordId,
            ...wordStats[wordId]
        }))
        .sort((a, b) => a.successRate - b.successRate)
        .slice(0, 20);
}

/**
 * Akıllı kelime seçimi - Spaced Repetition algoritması
 * @param {Array} words - Kelime listesi
 * @param {number} count - Seçilecek kelime sayısı
 * @param {boolean} isReviewMode - Review modu mu?
 * @returns {Array} - Seçilen kelimeler
 */
function selectIntelligentWords(words, count, isReviewMode = false) {
    if (words.length === 0) return [];
    
    const today = getLocalDateString();
    const recentWrongWords = [];
    const strugglingWords = [];
    const lowMasteryWords = [];
    const normalWords = [];
    
    // Son 10 yanlış cevabı al (tarih sırasına göre)
    const wrongAnswers = Object.keys(wordStats)
        .map(wordId => {
            const stats = wordStats[wordId];
            if (stats.lastWrong) {
                const daysDiff = getDaysDifference(stats.lastWrong, today);
                return {
                    wordId,
                    stats,
                    daysDiff,
                    priority: daysDiff <= 0 ? 100 : daysDiff === 1 ? 50 : daysDiff === 2 ? 25 : daysDiff === 3 ? 12 : 0
                };
            }
            return null;
        })
        .filter(w => w && w.priority > 0)
        .sort((a, b) => a.daysDiff - b.daysDiff)
        .slice(0, 10);
    
    // Kelimeleri kategorilere ayır (Spaced Repetition önceliği ile)
    words.forEach(word => {
        const wordId = word.id;
        const stats = wordStats[wordId];
        
        if (!stats) {
            // Hiç denenmemiş kelime - yüksek öncelik
            normalWords.push({ word, priority: 5 });
            return;
        }
        
        // SPACED REPETITION: Tekrar zamanı gelmiş kelimeler (en yüksek öncelik)
        if (stats.nextReviewDate) {
            const daysUntilReview = getDaysDifference(today, stats.nextReviewDate);
            if (daysUntilReview <= 0) {
                // Tekrar zamanı geçmiş veya bugün - çok yüksek öncelik
                const overdueDays = Math.abs(daysUntilReview);
                const priority = 200 + (overdueDays * 10); // Gecikme ne kadar fazlaysa o kadar öncelik
                recentWrongWords.push({ word, priority, stats });
                return;
            }
        }
        
        // Son yanlış cevap verilen kelimeler
        const recentWrong = wrongAnswers.find(w => w.wordId === wordId);
        if (recentWrong) {
            recentWrongWords.push({ word, priority: recentWrong.priority });
            return;
        }
        
        // Zorlanılan kelimeler (başarı oranı < 50% ve en az 2 deneme)
        if (stats.successRate < 50 && stats.attempts >= 2) {
            const priority = isReviewMode ? 10 : 3; // Review mode'da ekstra öncelik
            strugglingWords.push({ word, priority, stats });
            return;
        }
        
        // Ustalık seviyesi düşük kelimeler (0-3)
        if (stats.masteryLevel <= 3 && stats.attempts > 0) {
            lowMasteryWords.push({ word, priority: 2, stats });
            return;
        }
        
        // Normal kelimeler (tekrar zamanı henüz gelmemiş)
        // Tekrar zamanı yaklaşan kelimelere hafif öncelik ver
        let priority = 1;
        if (stats.nextReviewDate) {
            const daysUntilReview = getDaysDifference(today, stats.nextReviewDate);
            if (daysUntilReview <= 2 && daysUntilReview > 0) {
                // 1-2 gün içinde tekrar zamanı gelecek - hafif öncelik
                priority = 1.5;
            }
        }
        normalWords.push({ word, priority });
    });
    
    // Öncelik sırasına göre birleştir
    const allWordsWithPriority = [
        ...recentWrongWords,
        ...strugglingWords,
        ...lowMasteryWords,
        ...normalWords
    ];
    
    // Ağırlıklı rastgele seçim
    const selectedWords = [];
    const usedIds = new Set();
    
    // Önce yüksek öncelikli kelimeleri seç
    const highPriorityWords = allWordsWithPriority
        .filter(w => w.priority >= 10 && !usedIds.has(w.word.id))
        .sort((a, b) => b.priority - a.priority);
    
    // Yüksek öncelikli kelimelerden seç (en fazla count/2)
    const highPriorityCount = Math.min(Math.floor(count / 2), highPriorityWords.length);
    for (let i = 0; i < highPriorityCount && selectedWords.length < count; i++) {
        selectedWords.push(highPriorityWords[i].word);
        usedIds.add(highPriorityWords[i].word.id);
    }
    
    // Kalan kelimeleri ağırlıklı rastgele seç
    const remainingWords = allWordsWithPriority.filter(w => !usedIds.has(w.word.id));
    
    while (selectedWords.length < count && remainingWords.length > 0) {
        // Toplam öncelik skorunu hesapla
        const totalPriority = remainingWords.reduce((sum, w) => sum + w.priority, 0);
        
        // Rastgele bir sayı seç (0 - totalPriority arası)
        let random = Math.random() * totalPriority;
        
        // Öncelik skoruna göre kelime seç
        for (const item of remainingWords) {
            random -= item.priority;
            if (random <= 0) {
                selectedWords.push(item.word);
                usedIds.add(item.word.id);
                // Seçilen kelimeyi listeden çıkar
                const index = remainingWords.indexOf(item);
                remainingWords.splice(index, 1);
                break;
            }
        }
    }
    
    // Eğer hala yeterli kelime yoksa, rastgele ekle
    if (selectedWords.length < count) {
        const remaining = words.filter(w => !usedIds.has(w.id));
        const needed = count - selectedWords.length;
        const randomWords = getRandomItems(remaining, needed);
        selectedWords.push(...randomWords);
    }
    
    // Son olarak karıştır (ama yüksek öncelikli kelimeler başta olsun)
    const shuffled = shuffleArray(selectedWords);
    
    infoLog(`Akıllı kelime seçimi: ${recentWrongWords.length} son yanlış, ${strugglingWords.length} zorlanılan, ${lowMasteryWords.length} düşük ustalık, ${normalWords.length} normal`);
    
    return shuffled;
}

// Export
if (typeof window !== 'undefined') {
    window.updateWordStats = updateWordStats;
    window.getStrugglingWords = getStrugglingWords;
    window.selectIntelligentWords = selectIntelligentWords;
}

