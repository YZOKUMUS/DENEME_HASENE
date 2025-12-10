// ============================================
// LEADERBOARD - Duolingo Benzeri Haftalık Ligler
// ============================================

/**
 * Leaderboard modal'ını göster
 */
async function showLeaderboardModal() {
    const modal = document.getElementById('leaderboard-modal');
    if (!modal) {
        console.warn('Leaderboard modal not found');
        return;
    }
    
    if (typeof window.openModal === 'function') {
        window.openModal('leaderboard-modal');
    } else if (modal) {
        modal.style.display = 'flex';
    }
    
    await loadLeaderboardData();
}

/**
 * Leaderboard verilerini yükle
 */
async function loadLeaderboardData() {
    try {
        if (typeof window.getUserLeaguePosition !== 'function') {
            console.warn('getUserLeaguePosition fonksiyonu bulunamadı');
            showError('Liderlik tablosu yüklenirken bir hata oluştu.');
            return;
        }
        
        const position = await window.getUserLeaguePosition();
        if (!position) {
            // Kullanıcı giriş yapmamış veya henüz haftalık kayıt yok
            showNoLeaderboardData();
            return;
        }
        
        // Kullanıcı bilgilerini göster
        await updateUserLeagueCard(position);
        
        // Lig sıralamasını yükle
        if (typeof window.getLeagueRankings === 'function') {
            const rankings = await window.getLeagueRankings(position.league, 20);
            displayRankings(rankings, position);
        }
    } catch (error) {
        console.error('Error loading leaderboard data:', error);
        showError('Liderlik tablosu yüklenirken bir hata oluştu.');
    }
}

/**
 * Kullanıcı lig kartını güncelle
 */
async function updateUserLeagueCard(position) {
    // Lig config bilgilerini al
    if (typeof window.getLeagueConfig !== 'function') {
        console.warn('getLeagueConfig fonksiyonu bulunamadı');
        return;
    }
    
    const leagueConfig = await window.getLeagueConfig(position.league);
    if (!leagueConfig) return;
    
    // Icon ve isimleri güncelle
    const iconEl = document.getElementById('user-league-icon');
    const nameEl = document.getElementById('user-league-name');
    const arabicEl = document.getElementById('user-league-arabic');
    const positionEl = document.getElementById('user-league-position');
    const xpEl = document.getElementById('user-weekly-xp');
    const leagueTitleEl = document.getElementById('current-league-title');
    const markerEl = document.getElementById('user-position-marker');
    const positionInfoEl = document.getElementById('position-info');
    
    const formatNum = typeof window.formatNumber === 'function' ? window.formatNumber : (n) => n.toString();
    
    if (iconEl) iconEl.textContent = leagueConfig.icon || '📖';
    if (nameEl) nameEl.textContent = leagueConfig.display_name || position.league;
    if (arabicEl) arabicEl.textContent = leagueConfig.arabic_name || '';
    if (positionEl) positionEl.textContent = `#${position.position}`;
    if (xpEl) xpEl.textContent = formatNum(position.weekly_xp || 0);
    if (leagueTitleEl) leagueTitleEl.textContent = `${leagueConfig.display_name || position.league} Sıralaması`;
    
    // Progress bar güncelle
    if (markerEl && position.total_in_league > 0) {
        const progressPercent = ((position.total_in_league - position.position) / position.total_in_league) * 100;
        const clampedPercent = Math.max(0, Math.min(100, progressPercent));
        markerEl.style.left = `${100 - clampedPercent}%`;
    }
    
    // Pozisyon bilgisi
    if (positionInfoEl) {
        positionInfoEl.textContent = `${position.position} / ${position.total_in_league}`;
    }
    
    // League card rengini güncelle
    const cardEl = document.getElementById('user-league-info');
    if (cardEl && leagueConfig.color) {
        cardEl.style.background = `linear-gradient(135deg, ${leagueConfig.color} 0%, ${adjustColorBrightness(leagueConfig.color, -20)} 100%)`;
    }
}

/**
 * Renk parlaklığını ayarla
 */
function adjustColorBrightness(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Sıralamayı göster
 */
function displayRankings(rankings, userPosition) {
    const container = document.getElementById('league-rankings-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (rankings.length === 0) {
        container.innerHTML = '<div class="loading-text">Henüz bu ligde oyuncu yok.</div>';
        return;
    }
    
    // Kullanıcının user_id'sini al
    let currentUserId = null;
    if (typeof window.getCurrentUser === 'function') {
        window.getCurrentUser().then(user => {
            if (user) currentUserId = user.id;
        }).catch(() => {});
    }
    
    rankings.forEach((rank, index) => {
        const item = document.createElement('div');
        item.className = 'ranking-item';
        
        // Top 3'e özel stil
        if (index < 3) {
            item.classList.add('top-3');
        }
        
        // Kullanıcının kendi kaydını vurgula
        if (currentUserId && rank.user_id === currentUserId) {
            item.classList.add('user-item');
        }
        
        const position = rank.position || index + 1;
        const username = rank.username || rank.profiles?.username || 'Anonim';
        const xp = rank.weekly_xp || 0;
        
        const formatNum = typeof window.formatNumber === 'function' ? window.formatNumber : (n) => n.toString();
        item.innerHTML = `
            <div class="ranking-position">#${position}</div>
            <div class="ranking-username">${escapeHtml(username)}</div>
            <div class="ranking-xp">${formatNum(xp)} XP</div>
        `;
        
        container.appendChild(item);
    });
}

/**
 * Veri yok mesajı göster
 */
function showNoLeaderboardData() {
    const container = document.getElementById('league-rankings-list');
    if (container) {
        container.innerHTML = '<div class="loading-text">Liderlik tablosu için giriş yapmalısınız.</div>';
    }
    
    // Kullanıcı kartını gizle veya varsayılan göster
    const cardEl = document.getElementById('user-league-info');
    if (cardEl) {
        cardEl.style.display = 'none';
    }
}

/**
 * Hata mesajı göster
 */
function showError(message) {
    const container = document.getElementById('league-rankings-list');
    if (container) {
        container.innerHTML = `<div class="loading-text" style="color: #ef4444;">${escapeHtml(message)}</div>`;
    }
}

/**
 * HTML escape
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export functions
if (typeof window !== 'undefined') {
    window.showLeaderboardModal = showLeaderboardModal;
    window.loadLeaderboardData = loadLeaderboardData;
}

