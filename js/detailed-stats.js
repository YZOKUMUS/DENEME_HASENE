// ============================================
// DETAILED STATS - Detaylı İstatistikler
// ============================================

/**
 * Detaylı istatistikler modalını gösterir
 */
function showDetailedStatsModal() {
    // Tab'ları yönet
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // Tüm tab'ları gizle
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // Tüm butonları pasif yap
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Seçili tab'ı göster
            const selectedTab = document.getElementById(`${tab}-stats-tab`);
            if (selectedTab) {
                selectedTab.style.display = 'block';
            }
            
            btn.classList.add('active');
            
            // İçeriği yükle
            loadTabContent(tab);
        });
    });
    
    // İlk tab'ı göster
    const firstTab = document.querySelector('.tab-btn.active');
    if (firstTab) {
        firstTab.click();
    }
    
    openModal('detailed-stats-modal');
}

/**
 * Tab içeriğini yükler
 */
function loadTabContent(tab) {
    if (tab === 'daily') {
        loadDailyStats();
    } else if (tab === 'weekly') {
        loadWeeklyStats();
    } else if (tab === 'monthly') {
        loadMonthlyStats();
    } else if (tab === 'words') {
        loadWordsStats();
    }
}

/**
 * Günlük istatistikleri yükler
 */
function loadDailyStats() {
    const content = document.getElementById('daily-stats-content');
    if (!content) return;
    
    // Son 7 günün verilerini göster
    let html = '<div class="stats-list">';
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = getLocalDateString(date);
        
        // Bu tarih için veri yoksa varsayılan değerler
        const dailyData = safeGetItem(`hasene_daily_${dateStr}`, {
            correct: 0,
            wrong: 0,
            points: 0
        });
        
        html += `
            <div class="daily-stat-item">
                <div class="stat-date">${dateStr}</div>
                <div class="stat-details">
                    <span>✅ ${dailyData.correct || 0}</span>
                    <span>❌ ${dailyData.wrong || 0}</span>
                    <span>💰 ${formatNumber(dailyData.points || 0)}</span>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    content.innerHTML = html;
}

/**
 * Haftalık istatistikleri yükler
 */
function loadWeeklyStats() {
    const content = document.getElementById('weekly-stats-content');
    if (!content) return;
    
    let html = '<div class="stats-list">';
    
    // Son 4 hafta
    for (let i = 3; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (i * 7));
        const weekStartStr = getWeekStartDateString(weekStart);
        
        const weeklyData = safeGetItem(`hasene_weekly_${weekStartStr}`, {
            hasene: 0,
            correct: 0,
            wrong: 0
        });
        
        html += `
            <div class="weekly-stat-item">
                <div class="stat-date">Hafta: ${weekStartStr}</div>
                <div class="stat-details">
                    <span>💰 ${formatNumber(weeklyData.hasene || 0)}</span>
                    <span>✅ ${weeklyData.correct || 0}</span>
                    <span>❌ ${weeklyData.wrong || 0}</span>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    content.innerHTML = html;
}

/**
 * Aylık istatistikleri yükler
 */
function loadMonthlyStats() {
    const content = document.getElementById('monthly-stats-content');
    if (!content) return;
    
    let html = '<div class="stats-list">';
    
    // Son 3 ay
    for (let i = 2; i >= 0; i--) {
        const month = new Date();
        month.setMonth(month.getMonth() - i);
        const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
        
        const monthlyData = safeGetItem(`hasene_monthly_${monthStr}`, {
            hasene: 0,
            correct: 0,
            wrong: 0
        });
        
        html += `
            <div class="monthly-stat-item">
                <div class="stat-date">${monthStr}</div>
                <div class="stat-details">
                    <span>💰 ${formatNumber(monthlyData.hasene || 0)}</span>
                    <span>✅ ${monthlyData.correct || 0}</span>
                    <span>❌ ${monthlyData.wrong || 0}</span>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    content.innerHTML = html;
}

/**
 * Kelime istatistiklerini yükler
 */
function loadWordsStats() {
    const content = document.getElementById('words-stats-content');
    if (!content) return;
    
    const wordStatsData = safeGetItem('hasene_wordStats', {});
    const words = Object.keys(wordStatsData);
    
    if (words.length === 0) {
        content.innerHTML = '<p>Henüz kelime istatistiği yok.</p>';
        return;
    }
    
    // En zorlanılan kelimeleri sırala
    const strugglingWords = words
        .map(wordId => ({
            id: wordId,
            ...wordStatsData[wordId]
        }))
        .filter(w => w.attempts >= 2)
        .sort((a, b) => a.successRate - b.successRate)
        .slice(0, 10);
    
    let html = '<div class="words-stats-list">';
    html += '<h4>En Zorlanılan Kelimeler</h4>';
    
    strugglingWords.forEach(word => {
        html += `
            <div class="word-stat-item">
                <div class="word-id">${word.id}</div>
                <div class="word-stats">
                    <span>Deneme: ${word.attempts}</span>
                    <span>Doğru: ${word.correct}</span>
                    <span>Yanlış: ${word.wrong}</span>
                    <span>Başarı: ${Math.round(word.successRate)}%</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    content.innerHTML = html;
}

// Export
if (typeof window !== 'undefined') {
    window.showDetailedStatsModal = showDetailedStatsModal;
}


