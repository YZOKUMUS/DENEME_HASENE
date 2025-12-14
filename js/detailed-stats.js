// ============================================
// DETAILED STATS - Detaylı İstatistikler
// ============================================

/**
 * Detaylı istatistikler modalını gösterir
 */
function showDetailedStatsModal() {
    // Her iki bölümün içeriğini yükle
    loadWordsStats();
    loadFavoritesStats();
    
    openModal('detailed-stats-modal');
}

/**
 * Günlük istatistikleri yükler
 */
async function loadDailyStats() {
    const content = document.getElementById('daily-stats-content');
    if (!content) return;
    
    console.log('📊 loadDailyStats çağrıldı');
    
    // Yükleniyor mesajı göster
    content.innerHTML = '<div style="text-align: center; padding: var(--spacing-lg); color: var(--text-secondary);">Yükleniyor...</div>';
    
    const today = getLocalDateString();
    const dailyStats = [];
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalPoints = 0;
    let daysPlayed = 0;
    
    // Son 7 günün verilerini topla
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = getLocalDateString(date);
        
        // Önce Supabase'den yüklemeyi dene
        let dailyData = null;
        if (typeof window.loadDailyStat === 'function') {
            try {
                dailyData = await window.loadDailyStat(dateStr);
            } catch (error) {
                console.warn(`Supabase'den ${dateStr} tarihi yüklenemedi:`, error);
            }
        }
        
        // Supabase'den yüklenemediyse localStorage'dan yükle
        if (!dailyData) {
            dailyData = safeGetItem(`hasene_daily_${dateStr}`, {
                correct: 0,
                wrong: 0,
                points: 0,
                gamesPlayed: 0,
                perfectLessons: 0,
                maxCombo: 0,
                gameModes: {}
            });
        }
        
        // Eğer Supabase'den veri geldiyse localStorage'a da kaydet (senkronizasyon için)
        if (dailyData && typeof window.loadDailyStat === 'function') {
            localStorage.setItem(`hasene_daily_${dateStr}`, JSON.stringify(dailyData));
        }
        
        const isToday = dateStr === today;
        
        // LOG: Bugün için detaylı log
        if (isToday) {
            const localStorageCorrect = parseInt(localStorage.getItem('dailyCorrect') || '0') || 0;
            const localStorageWrong = parseInt(localStorage.getItem('dailyWrong') || '0') || 0;
            console.log('📊 loadDailyStats - Bugün verileri:', {
                dateStr,
                hasene_daily: { correct: dailyData.correct, wrong: dailyData.wrong, points: dailyData.points },
                localStorage: { correct: localStorageCorrect, wrong: localStorageWrong },
                fark: {
                    correct: Math.abs(dailyData.correct - localStorageCorrect),
                    wrong: Math.abs(dailyData.wrong - localStorageWrong)
                }
            });
        }
        const accuracy = (dailyData.correct + dailyData.wrong) > 0 
            ? Math.round((dailyData.correct / (dailyData.correct + dailyData.wrong)) * 100) 
            : 0;
        
        if (dailyData.correct > 0 || dailyData.wrong > 0) {
            daysPlayed++;
        }
        
        totalCorrect += dailyData.correct || 0;
        totalWrong += dailyData.wrong || 0;
        totalPoints += dailyData.points || 0;
        
        dailyStats.push({
            date: dateStr,
            dateObj: date,
            ...dailyData,
            accuracy,
            isToday
        });
    }
    
    // Tarih formatını düzenle (gün adı + tarih)
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    
    let html = '<div class="daily-stats-container">';
    
    // Özet istatistikler
    html += `
        <div class="stats-summary">
            <div class="summary-item">
                <div class="summary-label">Toplam Hasene</div>
                <div class="summary-value">${formatNumber(totalPoints)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Doğru Cevap</div>
                <div class="summary-value">${formatNumber(totalCorrect)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Oynanan Gün</div>
                <div class="summary-value">${daysPlayed}/7</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Ortalama Doğruluk</div>
                <div class="summary-value">${totalCorrect + totalWrong > 0 ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) : 0}%</div>
            </div>
        </div>
    `;
    
    // Günlük detaylar
    html += '<div class="daily-stats-list">';
    dailyStats.forEach(stat => {
        const dayName = dayNames[stat.dateObj.getDay()];
        const day = stat.dateObj.getDate();
        const month = monthNames[stat.dateObj.getMonth()];
        const displayDate = `${dayName}, ${day} ${month}`;
        
        html += `
            <div class="daily-stat-item ${stat.isToday ? 'today' : ''}">
                <div class="stat-header">
                    <div class="stat-date">
                        ${stat.isToday ? '<span class="today-badge">Bugün</span>' : ''}
                        <span class="date-text">${displayDate}</span>
                    </div>
                    ${stat.accuracy > 0 ? `<div class="stat-accuracy">${stat.accuracy}% doğruluk</div>` : ''}
                </div>
                <div class="stat-details">
                    <div class="stat-detail-item">
                        <span class="stat-icon">✅</span>
                        <span class="stat-label">Doğru</span>
                        <span class="stat-value">${stat.correct || 0}</span>
                    </div>
                    <div class="stat-detail-item">
                        <span class="stat-icon">❌</span>
                        <span class="stat-label">Yanlış</span>
                        <span class="stat-value">${stat.wrong || 0}</span>
                    </div>
                    <div class="stat-detail-item">
                        <span class="stat-icon">💰</span>
                        <span class="stat-label">Hasene</span>
                        <span class="stat-value">${formatNumber(stat.points || 0)}</span>
                    </div>
                    ${stat.gamesPlayed > 0 ? `
                        <div class="stat-detail-item">
                            <span class="stat-icon">🎮</span>
                            <span class="stat-label">Oyun</span>
                            <span class="stat-value">${stat.gamesPlayed}</span>
                        </div>
                    ` : ''}
                    ${stat.perfectLessons > 0 ? `
                        <div class="stat-detail-item">
                            <span class="stat-icon">💎</span>
                            <span class="stat-label">Mükemmel</span>
                            <span class="stat-value">${stat.perfectLessons}</span>
                        </div>
                    ` : ''}
                    ${stat.maxCombo > 0 ? `
                        <div class="stat-detail-item">
                            <span class="stat-icon">🔥</span>
                            <span class="stat-label">Max Combo</span>
                            <span class="stat-value">${stat.maxCombo}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });
    html += '</div></div>';
    
    content.innerHTML = html;
}

/**
 * Haftalık istatistikleri yükler
 */
async function loadWeeklyStats() {
    const content = document.getElementById('weekly-stats-content');
    if (!content) return;
    
    // Yükleniyor mesajı göster
    content.innerHTML = '<div style="text-align: center; padding: var(--spacing-lg); color: var(--text-secondary);">Yükleniyor...</div>';
    
    const today = new Date();
    const weeklyStats = [];
    let totalHasene = 0;
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalDaysPlayed = 0;
    
    // Son 4 hafta
    for (let i = 3; i >= 0; i--) {
        // Bugünden i hafta geriye git
        const referenceDate = new Date();
        referenceDate.setDate(referenceDate.getDate() - (i * 7));
        
        // Hafta başlangıcını hesapla (Pazartesi)
        const weekStartDate = getWeekStartDate(referenceDate);
        const weekStartStr = getLocalDateString(weekStartDate);
        
        // Hafta sonunu hesapla (Pazar = Pazartesi + 6 gün)
        const weekEndDate = getWeekEndDate(referenceDate);
        const weekEndStr = getLocalDateString(weekEndDate);
        
        // Önce Supabase'den yüklemeyi dene
        let weeklyData = null;
        if (typeof window.loadWeeklyStat === 'function') {
            try {
                weeklyData = await window.loadWeeklyStat(weekStartStr);
            } catch (error) {
                console.warn(`Supabase'den ${weekStartStr} haftası yüklenemedi:`, error);
            }
        }
        
        // Supabase'den yüklenemediyse localStorage'dan yükle
        if (!weeklyData) {
            weeklyData = safeGetItem(`hasene_weekly_${weekStartStr}`, {
                hasene: 0,
                correct: 0,
                wrong: 0,
                daysPlayed: 0,
                gamesPlayed: 0,
                perfectLessons: 0,
                maxCombo: 0,
                streakDays: 0
            });
        }
        
        // Eğer Supabase'den veri geldiyse localStorage'a da kaydet (senkronizasyon için)
        if (weeklyData && typeof window.loadWeeklyStat === 'function') {
            localStorage.setItem(`hasene_weekly_${weekStartStr}`, JSON.stringify(weeklyData));
        }
        
        const isCurrentWeek = weekStartDate <= today && weekEndDate >= today;
        const accuracy = (weeklyData.correct + weeklyData.wrong) > 0 
            ? Math.round((weeklyData.correct / (weeklyData.correct + weeklyData.wrong)) * 100) 
            : 0;
        
        totalHasene += weeklyData.hasene || 0;
        totalCorrect += weeklyData.correct || 0;
        totalWrong += weeklyData.wrong || 0;
        totalDaysPlayed += weeklyData.daysPlayed || 0;
        
        weeklyStats.push({
            weekStart: weekStartStr,
            weekEnd: weekEndStr,
            weekStartObj: weekStartDate,
            weekEndObj: weekEndDate,
            ...weeklyData,
            accuracy,
            isCurrentWeek
        });
    }
    
    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    
    let html = '<div class="weekly-stats-container">';
    
    // Özet istatistikler
    html += `
        <div class="stats-summary">
            <div class="summary-item">
                <div class="summary-label">Toplam Hasene</div>
                <div class="summary-value">${formatNumber(totalHasene)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Doğru Cevap</div>
                <div class="summary-value">${formatNumber(totalCorrect)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Oynanan Gün</div>
                <div class="summary-value">${totalDaysPlayed}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Ortalama Doğruluk</div>
                <div class="summary-value">${totalCorrect + totalWrong > 0 ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) : 0}%</div>
            </div>
        </div>
    `;
    
    // Haftalık detaylar
    html += '<div class="weekly-stats-list">';
    weeklyStats.forEach(stat => {
        const startDay = stat.weekStartObj.getDate();
        const startMonth = monthNames[stat.weekStartObj.getMonth()];
        const endDay = stat.weekEndObj.getDate();
        const endMonth = monthNames[stat.weekEndObj.getMonth()];
        const displayDate = `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
        
        html += `
            <div class="weekly-stat-item ${stat.isCurrentWeek ? 'current-week' : ''}">
                <div class="stat-header">
                    <div class="stat-date">
                        ${stat.isCurrentWeek ? '<span class="current-badge">Bu Hafta</span>' : ''}
                        <span class="date-text">${displayDate}</span>
                    </div>
                    ${stat.accuracy > 0 ? `<div class="stat-accuracy">${stat.accuracy}% doğruluk</div>` : ''}
                </div>
                <div class="stat-details">
                    <div class="stat-detail-item">
                        <span class="stat-icon">💰</span>
                        <span class="stat-label">Hasene</span>
                        <span class="stat-value">${formatNumber(stat.hasene || 0)}</span>
                    </div>
                    <div class="stat-detail-item">
                        <span class="stat-icon">✅</span>
                        <span class="stat-label">Doğru</span>
                        <span class="stat-value">${stat.correct || 0}</span>
                    </div>
                    <div class="stat-detail-item">
                        <span class="stat-icon">❌</span>
                        <span class="stat-label">Yanlış</span>
                        <span class="stat-value">${stat.wrong || 0}</span>
                    </div>
                    <div class="stat-detail-item">
                        <span class="stat-icon">📅</span>
                        <span class="stat-label">Oynanan Gün</span>
                        <span class="stat-value">${stat.daysPlayed || 0}/7</span>
                    </div>
                    ${stat.gamesPlayed > 0 ? `
                        <div class="stat-detail-item">
                            <span class="stat-icon">🎮</span>
                            <span class="stat-label">Oyun</span>
                            <span class="stat-value">${stat.gamesPlayed}</span>
                        </div>
                    ` : ''}
                    ${stat.perfectLessons > 0 ? `
                        <div class="stat-detail-item">
                            <span class="stat-icon">💎</span>
                            <span class="stat-label">Mükemmel</span>
                            <span class="stat-value">${stat.perfectLessons}</span>
                        </div>
                    ` : ''}
                    ${stat.streakDays > 0 ? `
                        <div class="stat-detail-item">
                            <span class="stat-icon">🔥</span>
                            <span class="stat-label">Seri Gün</span>
                            <span class="stat-value">${stat.streakDays}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });
    html += '</div></div>';
    
    content.innerHTML = html;
}

/**
 * Aylık istatistikleri yükler
 */
async function loadMonthlyStats() {
    const content = document.getElementById('monthly-stats-content');
    if (!content) return;
    
    // Yükleniyor mesajı göster
    content.innerHTML = '<div style="text-align: center; padding: var(--spacing-lg); color: var(--text-secondary);">Yükleniyor...</div>';
    
    const today = new Date();
    const monthlyStats = [];
    let totalHasene = 0;
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalDaysPlayed = 0;
    
    // Son 3 ay
    for (let i = 2; i >= 0; i--) {
        const month = new Date();
        month.setMonth(month.getMonth() - i);
        const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
        
        // Önce Supabase'den yüklemeyi dene
        let monthlyData = null;
        if (typeof window.loadMonthlyStat === 'function') {
            try {
                monthlyData = await window.loadMonthlyStat(monthStr);
            } catch (error) {
                console.warn(`Supabase'den ${monthStr} ayı yüklenemedi:`, error);
            }
        }
        
        // Supabase'den yüklenemediyse localStorage'dan yükle
        if (!monthlyData) {
            monthlyData = safeGetItem(`hasene_monthly_${monthStr}`, {
                hasene: 0,
                correct: 0,
                wrong: 0,
                daysPlayed: 0,
                gamesPlayed: 0,
                perfectLessons: 0,
                maxCombo: 0,
                maxConsecutiveCorrect: 0,
                streakDays: 0,
                bestStreak: 0
            });
        }
        
        // Eğer Supabase'den veri geldiyse localStorage'a da kaydet (senkronizasyon için)
        if (monthlyData && typeof window.loadMonthlyStat === 'function') {
            localStorage.setItem(`hasene_monthly_${monthStr}`, JSON.stringify(monthlyData));
        }
        
        const isCurrentMonth = month.getMonth() === today.getMonth() && month.getFullYear() === today.getFullYear();
        const accuracy = (monthlyData.correct + monthlyData.wrong) > 0 
            ? Math.round((monthlyData.correct / (monthlyData.correct + monthlyData.wrong)) * 100) 
            : 0;
        
        // Ayın toplam gün sayısı
        const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
        
        totalHasene += monthlyData.hasene || 0;
        totalCorrect += monthlyData.correct || 0;
        totalWrong += monthlyData.wrong || 0;
        totalDaysPlayed += monthlyData.daysPlayed || 0;
        
        monthlyStats.push({
            month: monthStr,
            monthObj: month,
            daysInMonth,
            ...monthlyData,
            accuracy,
            isCurrentMonth
        });
    }
    
    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    
    let html = '<div class="monthly-stats-container">';
    
    // Özet istatistikler
    html += `
        <div class="stats-summary">
            <div class="summary-item">
                <div class="summary-label">Toplam Hasene</div>
                <div class="summary-value">${formatNumber(totalHasene)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Doğru Cevap</div>
                <div class="summary-value">${formatNumber(totalCorrect)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Oynanan Gün</div>
                <div class="summary-value">${totalDaysPlayed}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Ortalama Doğruluk</div>
                <div class="summary-value">${totalCorrect + totalWrong > 0 ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) : 0}%</div>
            </div>
        </div>
    `;
    
    // Aylık detaylar
    html += '<div class="monthly-stats-list">';
    monthlyStats.forEach(stat => {
        const monthName = monthNames[stat.monthObj.getMonth()];
        const year = stat.monthObj.getFullYear();
        const displayDate = `${monthName} ${year}`;
        
        html += `
            <div class="monthly-stat-item ${stat.isCurrentMonth ? 'current-month' : ''}">
                <div class="stat-header">
                    <div class="stat-date">
                        ${stat.isCurrentMonth ? '<span class="current-badge">Bu Ay</span>' : ''}
                        <span class="date-text">${displayDate}</span>
                    </div>
                    ${stat.accuracy > 0 ? `<div class="stat-accuracy">${stat.accuracy}% doğruluk</div>` : ''}
                </div>
                <div class="stat-details">
                    <div class="stat-detail-item">
                        <span class="stat-icon">💰</span>
                        <span class="stat-label">Hasene</span>
                        <span class="stat-value">${formatNumber(stat.hasene || 0)}</span>
                    </div>
                    <div class="stat-detail-item">
                        <span class="stat-icon">✅</span>
                        <span class="stat-label">Doğru</span>
                        <span class="stat-value">${stat.correct || 0}</span>
                    </div>
                    <div class="stat-detail-item">
                        <span class="stat-icon">❌</span>
                        <span class="stat-label">Yanlış</span>
                        <span class="stat-value">${stat.wrong || 0}</span>
                    </div>
                    <div class="stat-detail-item">
                        <span class="stat-icon">📅</span>
                        <span class="stat-label">Oynanan Gün</span>
                        <span class="stat-value">${stat.daysPlayed || 0}/${stat.daysInMonth}</span>
                    </div>
                    ${stat.gamesPlayed > 0 ? `
                        <div class="stat-detail-item">
                            <span class="stat-icon">🎮</span>
                            <span class="stat-label">Oyun</span>
                            <span class="stat-value">${stat.gamesPlayed}</span>
                        </div>
                    ` : ''}
                    ${stat.perfectLessons > 0 ? `
                        <div class="stat-detail-item">
                            <span class="stat-icon">💎</span>
                            <span class="stat-label">Mükemmel</span>
                            <span class="stat-value">${stat.perfectLessons}</span>
                        </div>
                    ` : ''}
                    ${stat.bestStreak > 0 ? `
                        <div class="stat-detail-item">
                            <span class="stat-icon">🔥</span>
                            <span class="stat-label">En İyi Seri</span>
                            <span class="stat-value">${stat.bestStreak} gün</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });
    html += '</div></div>';
    
    content.innerHTML = html;
}

/**
 * Kelime istatistiklerini yükler
 */
async function loadWordsStats() {
    const content = document.getElementById('words-stats-content');
    if (!content) return;
    
    // Yükleniyor mesajı göster
    content.innerHTML = '<div style="text-align: center; padding: var(--spacing-lg); color: var(--text-secondary);">Yükleniyor...</div>';
    
    try {
        // Kelime verilerini yükle
        const loadKelimeDataFunc = window.loadKelimeData || loadKelimeData;
        const allWords = await loadKelimeDataFunc();
        
        // Önce global wordStats değişkenini kontrol et (resetAllStats sonrası boş olabilir)
        // ÖNEMLİ: Eğer window.wordStats boş bir obje ise ({}), resetAllStats çalıştırılmış demektir
        // Bu durumda fallback'e geçmemeli, direkt boş gösterilmeli
        let wordStatsData = {};
        
        // Eğer global wordStats tanımlı ise (undefined değilse), onu kullan
        // Boş obje ({}) ise, resetAllStats çalıştırılmış demektir - fallback'e geçme
        if (typeof window.wordStats !== 'undefined') {
            // window.wordStats tanımlı - boş olsa bile onu kullan (resetAllStats sonrası durum)
            wordStatsData = window.wordStats || {};
            
            // Eğer boşsa, direkt boş göster (fallback'e geçme)
            if (!wordStatsData || Object.keys(wordStatsData).length === 0) {
                content.innerHTML = '<div style="text-align: center; padding: var(--spacing-lg); color: var(--text-secondary);">Henüz kelime istatistiği yok. Oyun oynayarak kelime istatistikleri oluşturun.</div>';
                return;
            }
        } else if (typeof window.loadWordStats === 'function') {
            // window.wordStats tanımlı değil - ilk yükleme veya global değişken henüz set edilmemiş
            // ÖNEMLİ: Eğer resetAllStats çalıştırıldıysa (hasene_statsJustReset flag'i varsa), backend'den yükleme
            const statsJustReset = localStorage.getItem('hasene_statsJustReset') === 'true';
            if (statsJustReset) {
                // resetAllStats çalıştırıldı - backend'den yükleme, sadece localStorage'dan yükle
                console.log('ℹ️ resetAllStats sonrası - backend\'den wordStats yüklenmesi atlandı');
                wordStatsData = safeGetItem('hasene_wordStats', {});
                // Global değişkeni de boş yap
                if (typeof window.wordStats !== 'undefined') {
                    window.wordStats = {};
                }
                // Flag'i temizle - artık backend'den normal yüklenecek
                localStorage.removeItem('hasene_statsJustReset');
                console.log('ℹ️ resetAllStats flag\'i temizlendi - bir sonraki yüklemede backend\'den normal yüklenecek');
            } else {
                try {
                    wordStatsData = await window.loadWordStats();
                    // Supabase'den veri geldiyse localStorage'a da kaydet (senkronizasyon için)
                    // ÖNEMLİ: Eğer wordStatsData boşsa localStorage'ı da temizle
                    if (wordStatsData && Object.keys(wordStatsData).length > 0) {
                        localStorage.setItem('hasene_wordStats', JSON.stringify(wordStatsData));
                        // Global değişkeni de güncelle
                        if (typeof window.wordStats !== 'undefined') {
                            window.wordStats = wordStatsData;
                        }
                    } else {
                        // Backend boş döndüyse localStorage'ı da temizle
                        localStorage.removeItem('hasene_wordStats');
                        if (typeof window.wordStats !== 'undefined') {
                            window.wordStats = {};
                        }
                    }
                } catch (error) {
                    console.warn('Supabase\'den kelime istatistikleri yüklenemedi:', error);
                    // Fallback: localStorage (sadece window.wordStats tanımlı değilse)
                    wordStatsData = safeGetItem('hasene_wordStats', {});
                }
            }
        } else {
            // Fallback: localStorage (sadece window.wordStats tanımlı değilse)
            wordStatsData = safeGetItem('hasene_wordStats', {});
        }
        
        const words = Object.keys(wordStatsData || {});
        
        // Kelime yoksa boş mesaj göster
        if (words.length === 0) {
            content.innerHTML = '<div style="text-align: center; padding: var(--spacing-lg); color: var(--text-secondary);">Henüz kelime istatistiği yok. Oyun oynayarak kelime istatistikleri oluşturun.</div>';
            return;
        }
        
        // Kelime verilerini ID'ye göre map'le
        const wordsMap = new Map();
        if (allWords && Array.isArray(allWords)) {
            allWords.forEach(word => {
                wordsMap.set(word.id, word);
            });
        }
        
        // Tüm kelimeleri istatistiklerle birleştir
        const wordsWithStats = words
            .map(wordId => {
                const stats = wordStatsData[wordId];
                const wordData = wordsMap.get(wordId);
                return {
                    id: wordId,
                    ...stats,
                    kelime: wordData?.kelime || wordId,
                    anlam: wordData?.anlam || 'Bilinmiyor',
                    sure_adi: wordData?.sure_adi || '',
                    difficulty: wordData?.difficulty || 0
                };
            })
            .filter(w => w.attempts > 0);
        
        // Eğer hiç attempts > 0 olan kelime yoksa, boş mesaj göster
        if (wordsWithStats.length === 0) {
            content.innerHTML = '<div style="text-align: center; padding: var(--spacing-lg); color: var(--text-secondary);">Henüz kelime istatistiği yok. Oyun oynayarak kelime istatistikleri oluşturun.</div>';
            return;
        }
        
        // En zorlanılan kelimeler (başarı oranı düşük)
        // Koşul: En az 2 deneme olmalı
        const strugglingWords = [...wordsWithStats]
            .filter(w => w.attempts >= 2)
            .sort((a, b) => a.successRate - b.successRate)
            .slice(0, 20);
        
        // En iyi bilinen kelimeler (başarı oranı yüksek)
        // Koşul: En az 3 deneme VE %80+ başarı oranı
        const masteredWords = [...wordsWithStats]
            .filter(w => w.attempts >= 3 && w.successRate >= 80)
            .sort((a, b) => b.successRate - a.successRate)
            .slice(0, 20);
        
        // En çok denenen kelimeler
        // Koşul: Herhangi bir deneme (1+ deneme yeterli)
        const mostAttempted = [...wordsWithStats]
            .sort((a, b) => b.attempts - a.attempts)
            .slice(0, 20);
        
        // Son yanlış cevaplanan kelimeler
        // Koşul: En az 1 yanlış cevap verilmiş olmalı
        const recentWrong = [...wordsWithStats]
            .filter(w => w.lastWrong)
            .sort((a, b) => {
                if (!a.lastWrong) return 1;
                if (!b.lastWrong) return -1;
                return new Date(b.lastWrong) - new Date(a.lastWrong);
            })
            .slice(0, 20);
        
        // HTML oluştur
        let html = '<div class="words-stats-container">';
        
        // Filtre butonları
        html += `
            <div class="words-stats-filters">
                <button class="word-filter-btn active" data-filter="struggling">🔴 Zorlanılan</button>
                <button class="word-filter-btn" data-filter="mastered">✅ İyi Bilinen</button>
                <button class="word-filter-btn" data-filter="attempted">📊 Çok Denenen</button>
                <button class="word-filter-btn" data-filter="recent">🕐 Son Yanlışlar</button>
            </div>
        `;
        
        // Zorlanılan kelimeler
        html += '<div class="words-stats-section" id="struggling-words">';
        html += '<h4>🔴 En Zorlanılan Kelimeler</h4>';
        if (strugglingWords.length === 0) {
            html += '<div class="words-stats-empty">Henüz zorlanılan kelime yok. En az 2 deneme yapılan kelimeler burada görünecek.</div>';
        } else {
            html += '<div class="words-stats-list">';
            strugglingWords.forEach(word => {
                html += createWordStatItem(word);
            });
            html += '</div>';
        }
        html += '</div>';
        
        // İyi bilinen kelimeler
        html += '<div class="words-stats-section" id="mastered-words" style="display:none;">';
        html += '<h4>✅ En İyi Bilinen Kelimeler</h4>';
        if (masteredWords.length === 0) {
            html += '<div class="words-stats-empty">Henüz iyi bilinen kelime yok. En az 3 deneme ve %80+ başarı oranı gerekiyor.</div>';
        } else {
            html += '<div class="words-stats-list">';
            masteredWords.forEach(word => {
                html += createWordStatItem(word);
            });
            html += '</div>';
        }
        html += '</div>';
        
        // Çok denenen kelimeler
        html += '<div class="words-stats-section" id="attempted-words" style="display:none;">';
        html += '<h4>📊 En Çok Denenen Kelimeler</h4>';
        if (mostAttempted.length === 0) {
            html += '<div class="words-stats-empty">Henüz deneme yapılan kelime yok. Oyun oynayarak kelime istatistikleri oluşturun.</div>';
        } else {
            html += '<div class="words-stats-list">';
            mostAttempted.forEach(word => {
                html += createWordStatItem(word);
            });
            html += '</div>';
        }
        html += '</div>';
        
        // Son yanlışlar
        html += '<div class="words-stats-section" id="recent-words" style="display:none;">';
        html += '<h4>🕐 Son Yanlış Cevaplanan Kelimeler</h4>';
        if (recentWrong.length === 0) {
            html += '<div class="words-stats-empty">Henüz yanlış cevap verilen kelime yok. Yanlış cevap verdiğiniz kelimeler burada görünecek.</div>';
        } else {
            html += '<div class="words-stats-list">';
            recentWrong.forEach(word => {
                html += createWordStatItem(word);
            });
            html += '</div>';
        }
        html += '</div>';
        
        html += '</div>';
        content.innerHTML = html;
        
        // Filtre butonlarına event listener ekle
        document.querySelectorAll('.word-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Tüm butonları pasif yap
                document.querySelectorAll('.word-filter-btn').forEach(b => b.classList.remove('active'));
                // Tüm bölümleri gizle
                document.querySelectorAll('.words-stats-section').forEach(s => s.style.display = 'none');
                
                // Seçili butonu aktif yap
                btn.classList.add('active');
                // İlgili bölümü göster
                const filter = btn.dataset.filter;
                const sectionId = filter === 'struggling' ? 'struggling-words' :
                                 filter === 'mastered' ? 'mastered-words' :
                                 filter === 'attempted' ? 'attempted-words' :
                                 'recent-words';
                const section = document.getElementById(sectionId);
                if (section) {
                    section.style.display = 'block';
                }
            });
        });
        
    } catch (error) {
        errorLog('Kelime istatistikleri yükleme hatası:', error);
        content.innerHTML = '<div style="text-align: center; padding: var(--spacing-lg); color: var(--accent-error);">Kelime istatistikleri yüklenirken bir hata oluştu.</div>';
    }
}

/**
 * Favori kelimeleri yükler
 */
async function loadFavoritesStats() {
    const content = document.getElementById('favorites-stats-content');
    if (!content) return;
    
    content.innerHTML = '<div style="text-align: center; padding: var(--spacing-lg); color: var(--text-secondary);">Yükleniyor...</div>';

    // Favori kelimeleri al
    if (typeof getFavoriteWords === 'undefined' || typeof loadFavorites === 'undefined') {
        content.innerHTML = '<div style="text-align: center; padding: var(--spacing-lg); color: var(--text-secondary);">Favori kelimeler modülü yüklenemedi.</div>';
        return;
    }

    if (typeof loadFavorites === 'function') {
        await loadFavorites();
    }

    const favoriteWordIds = getFavoriteWords();
    
    if (favoriteWordIds.length === 0) {
        content.innerHTML = `
            <div class="words-stats-empty">
                <div style="font-size: 3rem; margin-bottom: var(--spacing-md);">⭐</div>
                <p>Henüz favori kelime eklenmemiş.</p>
                <p style="margin-top: var(--spacing-sm); font-size: 0.9rem; color: var(--text-secondary);">
                    Kelime istatistikleri sayfasından kelimeleri favorilere ekleyebilirsiniz.
                </p>
            </div>
        `;
        return;
    }
    
    // Kelime verilerini yükle
    const allWords = await loadKelimeData();
    const wordsMap = new Map();
    if (allWords && Array.isArray(allWords)) {
        allWords.forEach(word => {
            wordsMap.set(word.id, word);
        });
    }
    
    // Favori kelimeleri istatistiklerle birleştir
    const wordStatsData = safeGetItem('hasene_wordStats', {});
    const favoriteWordsWithStats = favoriteWordIds
        .map(wordId => {
            const wordData = wordsMap.get(wordId);
            const stats = wordStatsData[wordId] || {
                attempts: 0,
                correct: 0,
                wrong: 0,
                successRate: 0,
                masteryLevel: 0
            };
            return {
                id: wordId,
                ...stats,
                kelime: wordData?.kelime || wordId,
                anlam: wordData?.anlam || 'Bilinmiyor',
                sure_adi: wordData?.sure_adi || '',
                difficulty: wordData?.difficulty || 0
            };
        })
        .filter(w => w.kelime !== 'Bilinmiyor');
    
    if (favoriteWordsWithStats.length === 0) {
        content.innerHTML = `
            <div class="words-stats-empty">
                <p>Favori kelimeler bulunamadı.</p>
            </div>
        `;
        return;
    }
    
    // HTML oluştur
    let html = '<div class="words-stats-container">';
    html += `<div style="margin-bottom: var(--spacing-md); padding: var(--spacing-sm); background: var(--bg-secondary); border-radius: var(--radius-md);">
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--spacing-xs);">
            <strong>${favoriteWordsWithStats.length}</strong> favori kelime
        </p>
        <button class="btn-primary" onclick="startFavoritesGame()" style="width: 100%; margin-top: var(--spacing-xs);">
            🎮 Favori Kelimelerden Oyna
        </button>
    </div>`;
    
    html += '<div class="words-stats-list">';
    favoriteWordsWithStats.forEach(word => {
        html += createWordStatItem(word, true); // true = favori sayfasında göster
    });
    html += '</div>';
    html += '</div>';
    
    content.innerHTML = html;
}

/**
 * Favori kelimelerden oyun başlatır
 */
function startFavoritesGame() {
    // Detaylı istatistikler modalını kapat
    if (typeof closeModal === 'function') {
        closeModal('detailed-stats-modal');
    } else {
        const modal = document.getElementById('detailed-stats-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Ana menüye dön
    if (typeof goToMainMenu === 'function') {
        goToMainMenu();
    }
    
    // Zorluk seviyesi seçim ekranını göster
    const difficultyScreen = document.getElementById('difficulty-selection');
    if (difficultyScreen) {
        difficultyScreen.style.display = 'block';
    }
    
    // Oyun modu seçim ekranını göster
    const gameModeScreen = document.getElementById('game-mode-selection');
    if (gameModeScreen) {
        gameModeScreen.style.display = 'block';
    }
    
    // Kelime Çevir alt mod seçim ekranını göster
    const kelimeSubmodeSelection = document.getElementById('kelime-submode-selection');
    if (kelimeSubmodeSelection) {
        kelimeSubmodeSelection.style.display = 'block';
    }
    
    // Favori kelimelerden oyunu başlat
    if (typeof startKelimeCevirGame === 'function') {
        startKelimeCevirGame('favorites');
    } else {
        showErrorMessage('Oyun modülü yüklenemedi!');
    }
}

/**
 * Kelime istatistik öğesi HTML'i oluşturur
 * @param {Object} word - Kelime objesi
 * @param {boolean} showInFavorites - Favori sayfasında mı gösteriliyor?
 */
function createWordStatItem(word, showInFavorites = false) {
    const successColor = word.successRate >= 80 ? 'var(--accent-success)' :
                        word.successRate >= 50 ? 'var(--accent-warning)' :
                        'var(--accent-error)';
    
    // Favori durumunu kontrol et
    const isFav = typeof isFavorite === 'function' ? isFavorite(word.id) : false;
    
    return `
        <div class="word-stat-item">
            <div class="word-stat-header">
                <div class="word-arabic">${word.kelime}</div>
                <div style="display: flex; align-items: center; gap: var(--spacing-xs);">
                    <div class="word-id">${word.id}</div>
                    ${!showInFavorites ? `
                        <button class="favorite-btn ${isFav ? 'favorited' : ''}" 
                                onclick="toggleFavorite('${word.id}', this)" 
                                title="${isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}">
                            ${isFav ? '⭐' : '☆'}
                        </button>
                    ` : `
                        <button class="favorite-btn favorited" 
                                onclick="toggleFavorite('${word.id}', this)" 
                                title="Favorilerden çıkar">
                            ⭐
                        </button>
                    `}
                </div>
            </div>
            <div class="word-meaning">${word.anlam}</div>
            ${word.sure_adi ? `<div class="word-sure">${word.sure_adi}</div>` : ''}
            <div class="word-stats-details">
                <div class="word-stat-bar">
                    <div class="word-stat-label">Başarı Oranı</div>
                    <div class="word-stat-progress">
                        <div class="word-stat-progress-fill" style="width: ${word.successRate}%; background: ${successColor};"></div>
                        <span class="word-stat-percent">${Math.round(word.successRate)}%</span>
                    </div>
                </div>
                <div class="word-stat-numbers">
                    <span class="word-stat-number">
                        <strong>${word.attempts}</strong> Deneme
                    </span>
                    <span class="word-stat-number">
                        <strong style="color: var(--accent-success);">${word.correct}</strong> Doğru
                    </span>
                    <span class="word-stat-number">
                        <strong style="color: var(--accent-error);">${word.wrong}</strong> Yanlış
                    </span>
                    <span class="word-stat-number">
                        <strong>${word.masteryLevel}/10</strong> Ustalık
                    </span>
                </div>
                ${word.lastWrong ? `<div class="word-last-wrong">Son yanlış: ${word.lastWrong}</div>` : ''}
                ${word.lastCorrect ? `<div class="word-last-correct">Son doğru: ${word.lastCorrect}</div>` : ''}
                ${word.nextReviewDate ? `
                    <div class="word-next-review">
                        ${(() => {
                            const today = getLocalDateString();
                            const daysDiff = getDaysDifference(today, word.nextReviewDate);
                            if (daysDiff < 0) {
                                return `<span style="color: var(--accent-error);">⏰ ${Math.abs(daysDiff)} gün gecikmiş</span>`;
                            } else if (daysDiff === 0) {
                                return '<span style="color: var(--accent-warning);">⏰ Bugün tekrar</span>';
                            } else {
                                return `<span style="color: var(--text-secondary);">⏰ ${daysDiff} gün sonra</span>`;
                            }
                        })()}
                    </div>
                ` : ''}
                ${word.interval ? `<div class="word-interval" style="font-size: 0.65rem; color: var(--text-secondary);">Tekrar aralığı: ${word.interval} gün</div>` : ''}
            </div>
        </div>
    `;
}

// Debounce için timer
let refreshStatsTimer = null;

/**
 * Eğer detaylı istatistikler modalı açıksa, aktif tab'ı yeniler
 * Debounce ile çağrılır - çok sık çağrılırsa hesaplamalar bozulabilir
 */
function refreshDetailedStatsIfOpen() {
    const modal = document.getElementById('detailed-stats-modal');
    if (!modal || modal.style.display === 'none') {
        return; // Modal açık değil
    }
    
    // Debounce: Eğer zaten bir yenileme bekliyorsa, önceki timer'ı iptal et
    if (refreshStatsTimer) {
        clearTimeout(refreshStatsTimer);
    }
    
    // 300ms sonra yenile (çok sık yenilemeyi önlemek için)
    refreshStatsTimer = setTimeout(() => {
        // Aktif tab'ı bul
        // Her iki bölümü yenile
        if (typeof loadWordsStats === 'function') {
            loadWordsStats();
        }
        if (typeof loadFavoritesStats === 'function') {
            loadFavoritesStats();
        }
        refreshStatsTimer = null;
    }, 300);
}

// Export
if (typeof window !== 'undefined') {
    window.showDetailedStatsModal = showDetailedStatsModal;
    // toggleFavorite artık favorites-manager.js'de tanımlı
    window.startFavoritesGame = startFavoritesGame;
    window.loadFavoritesStats = loadFavoritesStats;
    window.loadWordsStats = loadWordsStats;
    window.refreshDetailedStatsIfOpen = refreshDetailedStatsIfOpen;
}


