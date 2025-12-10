# 📋 Leaderboard Implementation Plan

## 🎯 Duolingo Benzeri Haftalık Lig Sistemi

### **Adım 1: Backend SQL Setup** ✅
- [x] `weekly_leaderboard` tablosu
- [x] `user_leagues` tablosu  
- [x] `league_config` tablosu
- [x] Index'ler ve RLS policies
- [x] Helper functions

**Dosya**: `backend/leaderboard-setup.sql`

---

### **Adım 2: Frontend API Fonksiyonları**

#### **2.1 API Service'e Ekleme**
**Dosya**: `js/api-service.js`

```javascript
// Haftalık XP güncelle
async function updateWeeklyXP(points) {
    const user = await getCurrentUser();
    if (!user) return;
    
    const weekStart = getWeekStart();
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { error } = await supabaseClient.rpc('increment_weekly_xp', {
            p_user_id: user.id,
            p_week_start: weekStart.toISOString().split('T')[0],
            p_points: points
        });
        
        if (error) {
            console.warn('Weekly XP update error:', error);
            // Fallback: manual upsert
        }
    }
}

// Lig bilgilerini getir
async function getLeagueInfo(userId = null) {
    const user = userId || await getCurrentUser();
    if (!user) return null;
    
    const weekStart = getWeekStart();
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { data, error } = await supabaseClient
            .from('weekly_leaderboard')
            .select('*, user_leagues(*)')
            .eq('user_id', user.id)
            .eq('week_start', weekStart.toISOString().split('T')[0])
            .single();
        
        if (error) return null;
        return data;
    }
    return null;
}

// Ligdeki sıralamayı getir
async function getLeagueRankings(leagueName, limit = 50) {
    const weekStart = getWeekStart();
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { data, error } = await supabaseClient
            .from('league_rankings')
            .select('*')
            .eq('league', leagueName)
            .eq('week_start', weekStart.toISOString().split('T')[0])
            .order('weekly_xp', { ascending: false })
            .limit(limit);
        
        if (error) return [];
        return data || [];
    }
    return [];
}

// Kullanıcının lig pozisyonu
async function getUserLeaguePosition(userId = null) {
    const user = userId || await getCurrentUser();
    if (!user) return null;
    
    const weekStart = getWeekStart();
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        // Kullanıcının bilgileri
        const { data: userData } = await supabaseClient
            .from('weekly_leaderboard')
            .select('league, weekly_xp')
            .eq('user_id', user.id)
            .eq('week_start', weekStart.toISOString().split('T')[0])
            .single();
        
        if (!userData) return null;
        
        // Ligdeki tüm sıralama
        const { data: rankings } = await supabaseClient
            .from('weekly_leaderboard')
            .select('user_id, weekly_xp')
            .eq('week_start', weekStart.toISOString().split('T')[0])
            .eq('league', userData.league)
            .order('weekly_xp', { ascending: false });
        
        if (!rankings) return null;
        
        const position = rankings.findIndex(r => r.user_id === user.id) + 1;
        const totalInLeague = rankings.length;
        
        // Lig config'den yükselme/düşme eşiklerini al
        const { data: leagueConfig } = await supabaseClient
            .from('league_config')
            .select('promotion_top_percent, demotion_bottom_percent')
            .eq('league_name', userData.league)
            .single();
        
        const promotionThreshold = Math.ceil(totalInLeague * (leagueConfig?.promotion_top_percent || 25) / 100);
        const demotionThreshold = Math.floor(totalInLeague * (100 - (leagueConfig?.demotion_bottom_percent || 30)) / 100);
        
        return {
            league: userData.league,
            weekly_xp: userData.weekly_xp,
            position: position,
            total_in_league: totalInLeague,
            promotion_threshold: promotionThreshold,
            demotion_threshold: demotionThreshold
        };
    }
    
    return null;
}

// Helper: Hafta başlangıcını hesapla
function getWeekStart(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Pazartesi
    return new Date(d.setDate(diff));
}
```

#### **2.2 Export Functions**
```javascript
// api-service.js sonunda
if (typeof window !== 'undefined') {
    // ... mevcut exports ...
    window.updateWeeklyXP = updateWeeklyXP;
    window.getLeagueInfo = getLeagueInfo;
    window.getLeagueRankings = getLeagueRankings;
    window.getUserLeaguePosition = getUserLeaguePosition;
}
```

---

### **Adım 3: Game Core Entegrasyonu**

#### **3.1 Puan Kazanınca XP Güncelle**
**Dosya**: `js/game-core.js`

```javascript
async function addToGlobalPoints(points, correctAnswers) {
    // ... mevcut kod ...
    
    // Haftalık XP'yi güncelle
    if (typeof window.updateWeeklyXP === 'function') {
        try {
            await window.updateWeeklyXP(points);
        } catch (error) {
            console.warn('Weekly XP update failed:', error);
        }
    }
}
```

---

### **Adım 4: UI Components**

#### **4.1 Leaderboard Modal HTML**
**Dosya**: `index.html`

```html
<!-- Leaderboard Modal -->
<div id="leaderboard-modal" class="modal" style="display:none;">
    <div class="modal-content leaderboard-modal-content">
        <div class="modal-header">
            <h2>🏆 Haftalık Ligler</h2>
            <button class="modal-close" onclick="closeModal('leaderboard-modal')">×</button>
        </div>
        <div class="modal-body">
            <!-- Kullanıcının Lig Bilgileri -->
            <div id="user-league-info" class="user-league-card">
                <div class="league-icon" id="user-league-icon">🥉</div>
                <div class="league-name" id="user-league-name">Bronze League</div>
                <div class="league-stats">
                    <div class="stat-item">
                        <span class="stat-label">Pozisyon</span>
                        <span class="stat-value" id="user-league-position">#12</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Bu Hafta XP</span>
                        <span class="stat-value" id="user-weekly-xp">1,250</span>
                    </div>
                </div>
                
                <!-- Progress Bar -->
                <div class="league-progress-container">
                    <div class="progress-zones">
                        <div class="zone promotion-zone">
                            <span>Yükselme Bölgesi</span>
                        </div>
                        <div class="zone safe-zone">
                            <span>Güvenli Bölge</span>
                        </div>
                        <div class="zone demotion-zone">
                            <span>Düşme Bölgesi</span>
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="user-marker" id="user-position-marker"></div>
                    </div>
                </div>
            </div>
            
            <!-- Lig Sıralaması -->
            <div class="league-rankings">
                <h3 id="current-league-title">Mübtedi Sıralaması</h3>
                <div id="league-rankings-list" class="rankings-list">
                    <!-- Dinamik olarak doldurulacak -->
                </div>
            </div>
        </div>
    </div>
</div>
```

#### **4.2 Leaderboard CSS**
**Dosya**: `style.css`

```css
/* Leaderboard Modal */
.leaderboard-modal-content {
    max-width: 600px;
}

.user-league-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 20px;
    color: white;
    margin-bottom: 24px;
}

.league-icon {
    font-size: 48px;
    text-align: center;
    margin-bottom: 8px;
}

.league-name {
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 16px;
}

.league-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
}

.stat-item {
    text-align: center;
}

.stat-label {
    display: block;
    font-size: 12px;
    opacity: 0.8;
    margin-bottom: 4px;
}

.stat-value {
    display: block;
    font-size: 20px;
    font-weight: 700;
}

.league-progress-container {
    margin-top: 20px;
}

.progress-zones {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    margin-bottom: 8px;
}

.zone {
    text-align: center;
    font-size: 10px;
    padding: 4px;
    border-radius: 4px;
}

.promotion-zone {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
}

.safe-zone {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
}

.demotion-zone {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
}

.progress-bar {
    height: 8px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    position: relative;
}

.user-marker {
    position: absolute;
    top: -4px;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    transform: translateX(-50%);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.rankings-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.ranking-item {
    display: flex;
    align-items: center;
    padding: 12px;
    background: #f9fafb;
    border-radius: 8px;
    gap: 12px;
}

.ranking-item.top-3 {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: white;
}

.ranking-position {
    font-size: 18px;
    font-weight: 700;
    min-width: 32px;
    text-align: center;
}

.ranking-username {
    flex: 1;
    font-weight: 600;
}

.ranking-xp {
    font-weight: 700;
    color: var(--accent-primary);
}

.ranking-item.top-3 .ranking-xp {
    color: white;
}
```

#### **4.3 Leaderboard JavaScript**
**Yeni Dosya**: `js/leaderboard.js`

```javascript
// Leaderboard Modal Fonksiyonları
async function showLeaderboardModal() {
    const modal = document.getElementById('leaderboard-modal');
    if (!modal) return;
    
    openModal('leaderboard-modal');
    await loadLeaderboardData();
}

async function loadLeaderboardData() {
    const position = await getUserLeaguePosition();
    if (!position) {
        console.warn('League position not found');
        return;
    }
    
    // Kullanıcı bilgilerini göster
    updateUserLeagueCard(position);
    
    // Lig sıralamasını yükle
    const rankings = await getLeagueRankings(position.league, 20);
    displayRankings(rankings, position);
}

function updateUserLeagueCard(position) {
    // Lig config'den bilgileri al
    const leagueConfig = getLeagueConfig(position.league);
    
    document.getElementById('user-league-icon').textContent = leagueConfig.icon;
    document.getElementById('user-league-name').textContent = leagueConfig.display_name;
    document.getElementById('user-league-position').textContent = `#${position.position}`;
    document.getElementById('user-weekly-xp').textContent = formatNumber(position.weekly_xp);
    
    // Progress bar güncelle
    const progressPercent = ((position.total_in_league - position.position) / position.total_in_league) * 100;
    const marker = document.getElementById('user-position-marker');
    marker.style.left = `${100 - progressPercent}%`;
    
    // Zone genişliklerini ayarla
    const promotionPercent = (position.promotion_threshold / position.total_in_league) * 100;
    const demotionPercent = (position.demotion_threshold / position.total_in_league) * 100;
    
    // TODO: Zone genişliklerini CSS'te güncelle
}

function displayRankings(rankings, userPosition) {
    const container = document.getElementById('league-rankings-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    rankings.forEach((rank, index) => {
        const item = document.createElement('div');
        item.className = 'ranking-item';
        
        if (index < 3) {
            item.classList.add('top-3');
        }
        
        if (rank.user_id === (window.currentUser?.id)) {
            item.style.border = '2px solid var(--accent-primary)';
        }
        
        item.innerHTML = `
            <div class="ranking-position">#${rank.position || index + 1}</div>
            <div class="ranking-username">${rank.username || 'Anonim'}</div>
            <div class="ranking-xp">${formatNumber(rank.weekly_xp)} XP</div>
        `;
        
        container.appendChild(item);
    });
}

function getLeagueConfig(leagueName) {
    const configs = {
        'mubtedi': { icon: '📖', display_name: 'Mübtedi', arabic: 'مبتدئ', color: '#8B4513' },
        'talib': { icon: '📚', display_name: 'Talib', arabic: 'طالب', color: '#CD7F32' },
        'mutavassit': { icon: '📘', display_name: 'Mutavassıt', arabic: 'متوسط', color: '#4682B4' },
        'mutebahhir': { icon: '📗', display_name: 'Mütebahhir', arabic: 'متبحر', color: '#228B22' },
        'hafiz': { icon: '📙', display_name: 'Hafız', arabic: 'حافظ', color: '#FFD700' },
        'kurra': { icon: '📕', display_name: 'Kurra', arabic: 'قراء', color: '#DC143C' },
        'alim': { icon: '📓', display_name: 'Alim', arabic: 'عالم', color: '#4B0082' },
        'mujtahid': { icon: '📔', display_name: 'Müctehid', arabic: 'مجتهد', color: '#4169E1' },
        'muhaddis': { icon: '📖', display_name: 'Muhaddis', arabic: 'محدث', color: '#000080' },
        'faqih': { icon: '📗', display_name: 'Fakih', arabic: 'فقيه', color: '#006400' },
        'imam': { icon: '📘', display_name: 'İmam', arabic: 'إمام', color: '#8B008B' },
        'ulama': { icon: '✨', display_name: 'Ulema', arabic: 'علماء', color: '#FFD700' }
    };
    return configs[leagueName] || configs['mubtedi'];
}
```

---

### **Adım 5: Ana Menüye Buton Ekleme**

**Dosya**: `index.html`

```html
<!-- Ana menüde -->
<button class="menu-btn" onclick="showLeaderboardModal()">
    <span class="btn-icon">🏆</span>
    <span class="btn-text">Haftalık Ligler</span>
</button>
```

---

## ✅ Implementation Checklist

- [ ] Backend SQL setup çalıştır
- [ ] API fonksiyonlarını ekle (`js/api-service.js`)
- [ ] Game core'a XP güncelleme ekle
- [ ] Leaderboard modal HTML ekle
- [ ] Leaderboard CSS ekle
- [ ] Leaderboard JavaScript fonksiyonları ekle
- [ ] Ana menüye buton ekle
- [ ] Test et

---

## 🎯 Sonraki Adımlar

1. **Haftalık Reset**: Supabase Cron job kurulumu
2. **Bildirimler**: Lig yükselme/düşme bildirimleri
3. **Animasyonlar**: Yükselme/düşme animasyonları
4. **Arkadaşlar**: Arkadaş listesi ve karşılaştırma
5. **Ödüller**: Lige göre özel rozetler/ödüller

