# 🏆 Duolingo Benzeri Leaderboard Sistemi

## 📋 Sistem Özellikleri

### 1. **Haftalık Ligler** (İslami Terimler)

1. **Mübtedi** (مبتدئ) - Başlangıç seviyesi
2. **Talib** (طالب) - Öğrenen
3. **Mutavassıt** (متوسط) - Orta seviye
4. **Mütebahhir** (متبحر) - Derinleşen
5. **Hafız** (حافظ) - Koruyan (Kur'an-ı ezberleyen)
6. **Kurra** (قراء) - Okuyucu (Kıraat ilmine sahip)
7. **Alim** (عالم) - Bilgin
8. **Müctehid** (مجتهد) - İçtihad eden
9. **Muhaddis** (محدث) - Hadis alimi
10. **Fakih** (فقيه) - Fıkıh alimi
11. **İmam** (إمام) - Önder
12. **Ulema** (علماء) - Alimler zümresi (En yüksek mertebe)

### 2. **Lig Kuralları**
- **Yükselme**: Her ligde ilk %10-30 arası (liga göre değişir)
- **Düşme**: Her ligde son %10-30 arası (Bronze hariç, düşüş yok)
- **Korunma**: Orta %40-80 arası
- **Reset**: Her Pazartesi saat 00:00 (UTC)

### 3. **Haftalık XP Sistemi**
- Her hafta sıfırlanan XP
- Sadece o hafta kazanılan Hasene puanları sayılır
- **XP = Hasene Puanları**

---

## 🗄️ Backend Schema

### **weekly_leaderboard** Tablosu
```sql
CREATE TABLE weekly_leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    week_start DATE NOT NULL, -- Hafta başlangıç tarihi (Pazartesi)
    week_end DATE NOT NULL,   -- Hafta bitiş tarihi (Pazar)
    weekly_xp INTEGER DEFAULT 0, -- Bu hafta kazanılan XP
    league VARCHAR(50) NOT NULL, -- Mevcut lig (mubtedi, talib, mutavassit, vb.)
    position INTEGER, -- Ligin içindeki sıralama
    promoted BOOLEAN DEFAULT FALSE, -- Bu hafta yükseldi mi?
    demoted BOOLEAN DEFAULT FALSE,  -- Bu hafta düştü mü?
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, week_start)
);

CREATE INDEX idx_weekly_leaderboard_week ON weekly_leaderboard(week_start);
CREATE INDEX idx_weekly_leaderboard_league ON weekly_leaderboard(league, weekly_xp DESC);
CREATE INDEX idx_weekly_leaderboard_user_week ON weekly_leaderboard(user_id, week_start);
```

### **user_leagues** Tablosu (Kullanıcı Lig Durumu)
```sql
CREATE TABLE user_leagues (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_league VARCHAR(50) DEFAULT 'mubtedi',
    current_week_start DATE, -- Mevcut haftanın başlangıç tarihi
    total_weeks_in_league INTEGER DEFAULT 1, -- Bu ligde kaç hafta geçirdi
    best_league VARCHAR(50) DEFAULT 'mubtedi', -- En yüksek ulaştığı lig
    total_promotions INTEGER DEFAULT 0, -- Toplam yükseliş sayısı
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **League Definitions** (Lig Tanımları)
```sql
CREATE TABLE league_config (
    league_name VARCHAR(50) PRIMARY KEY,
    league_order INTEGER NOT NULL, -- Sıralama (1=Mübtedi, 2=Talib, vb.)
    promotion_top_percent INTEGER DEFAULT 25, -- Yükselme için ilk %kaç
    demotion_bottom_percent INTEGER DEFAULT 30, -- Düşme için son %kaç
    min_players INTEGER DEFAULT 5, -- Minimum oyuncu sayısı
    icon VARCHAR(50), -- Lig ikonu/emoji
    color VARCHAR(20) -- Lig rengi
);

-- Lig tanımlarını ekle (İslami Terimler)
INSERT INTO league_config (league_name, league_order, promotion_top_percent, demotion_bottom_percent, icon, color, display_name, arabic_name, description) VALUES
('mubtedi', 1, 25, 0, '📖', '#8B4513', 'Mübtedi', 'مبتدئ', 'Başlangıç seviyesi'),
('talib', 2, 25, 30, '📚', '#CD7F32', 'Talib', 'طالب', 'Öğrenen'),
('mutavassit', 3, 20, 25, '📘', '#4682B4', 'Mutavassıt', 'متوسط', 'Orta seviye'),
('mutebahhir', 4, 20, 25, '📗', '#228B22', 'Mütebahhir', 'متبحر', 'Derinleşen'),
('hafiz', 5, 15, 20, '📙', '#FFD700', 'Hafız', 'حافظ', 'Koruyan'),
('kurra', 6, 15, 20, '📕', '#DC143C', 'Kurra', 'قراء', 'Okuyucu'),
('alim', 7, 12, 18, '📓', '#4B0082', 'Alim', 'عالم', 'Bilgin'),
('mujtahid', 8, 12, 18, '📔', '#4169E1', 'Müctehid', 'مجتهد', 'İçtihad Eden'),
('muhaddis', 9, 10, 15, '📖', '#000080', 'Muhaddis', 'محدث', 'Hadis Alimi'),
('faqih', 10, 10, 15, '📗', '#006400', 'Fakih', 'فقيه', 'Fıkıh Alimi'),
('imam', 11, 8, 12, '📘', '#8B008B', 'İmam', 'إمام', 'Önder'),
('ulama', 12, 0, 10, '✨', '#FFD700', 'Ulema', 'علماء', 'Alimler Zümresi');
```

---

## 🔄 Haftalık Reset Mantığı

### **1. Hafta Başlangıcı Kontrolü**
```javascript
function getWeekStart(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Pazartesi
    return new Date(d.setDate(diff));
}

function getWeekEnd(weekStart) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6); // Pazar
    return weekEnd;
}
```

### **2. Reset İşlemi (Cron Job / Function)**
```sql
-- Her Pazartesi 00:00'da çalışacak fonksiyon
CREATE OR REPLACE FUNCTION reset_weekly_leaderboard()
RETURNS void AS $$
DECLARE
    current_week_start DATE;
    previous_week_start DATE;
    league_record RECORD;
    promotion_threshold INTEGER;
    demotion_threshold INTEGER;
    total_in_league INTEGER;
BEGIN
    -- Mevcut haftanın başlangıcı
    current_week_start := DATE_TRUNC('week', CURRENT_DATE)::DATE + 1; -- Pazartesi
    
    -- Önceki haftanın başlangıcı
    previous_week_start := current_week_start - INTERVAL '7 days';
    
    -- Her lig için işlem yap
    FOR league_record IN SELECT league_name FROM league_config ORDER BY league_order LOOP
        -- Bu ligdeki toplam oyuncu sayısı
        SELECT COUNT(*) INTO total_in_league
        FROM weekly_leaderboard
        WHERE week_start = previous_week_start
        AND league = league_record.league_name;
        
        -- Minimum oyuncu yoksa atla
        IF total_in_league < (SELECT min_players FROM league_config WHERE league_name = league_record.league_name) THEN
            CONTINUE;
        END IF;
        
        -- Yükselme eşiği (top %)
        SELECT promotion_top_percent INTO promotion_threshold
        FROM league_config
        WHERE league_name = league_record.league_name;
        
        -- Düşme eşiği (alt %)
        SELECT demotion_bottom_percent INTO demotion_threshold
        FROM league_config
        WHERE league_name = league_record.league_name;
        
        -- Yükselenleri bul ve güncelle
        UPDATE weekly_leaderboard wl
        SET promoted = TRUE,
            league = (
                SELECT league_name 
                FROM league_config 
                WHERE league_order = (
                    SELECT league_order + 1 
                    FROM league_config 
                    WHERE league_name = league_record.league_name
                )
            )
        WHERE wl.week_start = previous_week_start
        AND wl.league = league_record.league_name
        AND wl.user_id IN (
            SELECT user_id
            FROM weekly_leaderboard
            WHERE week_start = previous_week_start
            AND league = league_record.league_name
            ORDER BY weekly_xp DESC
            LIMIT (total_in_league * promotion_threshold / 100)
        );
        
        -- Düşenleri bul ve güncelle (Mübtedi hariç)
        IF league_record.league_name != 'mubtedi' THEN
            UPDATE weekly_leaderboard wl
            SET demoted = TRUE,
                league = (
                    SELECT league_name 
                    FROM league_config 
                    WHERE league_order = (
                        SELECT league_order - 1 
                        FROM league_config 
                        WHERE league_name = league_record.league_name
                    )
                )
            WHERE wl.week_start = previous_week_start
            AND wl.league = league_record.league_name
            AND wl.user_id IN (
                SELECT user_id
                FROM weekly_leaderboard
                WHERE week_start = previous_week_start
                AND league = league_record.league_name
                ORDER BY weekly_xp ASC
                LIMIT (total_in_league * demotion_threshold / 100)
            );
        END IF;
    END LOOP;
    
    -- Yeni hafta kayıtları oluştur (tüm kullanıcılar için)
    INSERT INTO weekly_leaderboard (user_id, week_start, week_end, weekly_xp, league)
    SELECT 
        ul.user_id,
        current_week_start,
        current_week_start + INTERVAL '6 days',
        0,
        COALESCE(
            (SELECT league FROM weekly_leaderboard 
             WHERE user_id = ul.user_id 
             AND week_start = previous_week_start 
             LIMIT 1),
            ul.current_league
        )
    FROM user_leagues ul
    ON CONFLICT (user_id, week_start) DO NOTHING;
    
    -- user_leagues tablosunu güncelle
    UPDATE user_leagues ul
    SET 
        current_league = (
            SELECT league FROM weekly_leaderboard
            WHERE user_id = ul.user_id
            AND week_start = current_week_start
            LIMIT 1
        ),
        current_week_start = current_week_start,
        total_weeks_in_league = CASE
            WHEN (SELECT league FROM weekly_leaderboard
                  WHERE user_id = ul.user_id
                  AND week_start = previous_week_start
                  LIMIT 1) = (SELECT league FROM weekly_leaderboard
                              WHERE user_id = ul.user_id
                              AND week_start = current_week_start
                              LIMIT 1)
            THEN total_weeks_in_league + 1
            ELSE 1
        END,
        best_league = CASE
            WHEN (SELECT league_order FROM league_config
                  WHERE league_name = (SELECT league FROM weekly_leaderboard
                                       WHERE user_id = ul.user_id
                                       AND week_start = current_week_start
                                       LIMIT 1)) >
                 (SELECT league_order FROM league_config
                  WHERE league_name = ul.best_league)
            THEN (SELECT league FROM weekly_leaderboard
                  WHERE user_id = ul.user_id
                  AND week_start = current_week_start
                  LIMIT 1)
            ELSE best_league
        END,
        total_promotions = total_promotions + CASE
            WHEN (SELECT promoted FROM weekly_leaderboard
                  WHERE user_id = ul.user_id
                  AND week_start = previous_week_start
                  LIMIT 1) = TRUE
            THEN 1
            ELSE 0
        END;
END;
$$ LANGUAGE plpgsql;
```

---

## 📊 Frontend API Fonksiyonları

### **1. Haftalık XP Güncelleme**
```javascript
// js/api-service.js
async function updateWeeklyXP(points) {
    const user = await getCurrentUser();
    if (!user) return;
    
    const weekStart = getWeekStart();
    const weekEnd = getWeekEnd(weekStart);
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { error } = await supabaseClient
            .rpc('increment_weekly_xp', {
                user_id: user.id,
                week_start: weekStart.toISOString().split('T')[0],
                points: points
            });
        
        if (error) {
            // Fallback: upsert ile
            const { data: current } = await supabaseClient
                .from('weekly_leaderboard')
                .select('weekly_xp')
                .eq('user_id', user.id)
                .eq('week_start', weekStart.toISOString().split('T')[0])
                .single();
            
            await supabaseClient
                .from('weekly_leaderboard')
                .upsert({
                    user_id: user.id,
                    week_start: weekStart.toISOString().split('T')[0],
                    week_end: weekEnd.toISOString().split('T')[0],
                    weekly_xp: (current?.weekly_xp || 0) + points,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id,week_start'
                });
        }
    }
}
```

### **2. Lig Bilgilerini Getir**
```javascript
async function getLeagueInfo(userId = null) {
    const user = userId || await getCurrentUser();
    if (!user) return null;
    
    const weekStart = getWeekStart();
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { data, error } = await supabaseClient
            .from('weekly_leaderboard')
            .select(`
                *,
                user_leagues!inner(current_league, best_league, total_promotions)
            `)
            .eq('user_id', user.id)
            .eq('week_start', weekStart.toISOString().split('T')[0])
            .single();
        
        if (error) throw error;
        return data;
    }
    
    return null;
}
```

### **3. Ligdeki Sıralamayı Getir**
```javascript
async function getLeagueRankings(leagueName, limit = 50) {
    const weekStart = getWeekStart();
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { data, error } = await supabaseClient
            .from('weekly_leaderboard')
            .select(`
                *,
                profiles!inner(username)
            `)
            .eq('week_start', weekStart.toISOString().split('T')[0])
            .eq('league', leagueName)
            .order('weekly_xp', { ascending: false })
            .limit(limit);
        
        if (error) throw error;
        return data;
    }
    
    return [];
}
```

### **4. Kullanıcının Lig Pozisyonu**
```javascript
async function getUserLeaguePosition(userId = null) {
    const user = userId || await getCurrentUser();
    if (!user) return null;
    
    const weekStart = getWeekStart();
    
    if (BACKEND_TYPE === 'supabase' && supabaseClient) {
        const { data: userData, error: userError } = await supabaseClient
            .from('weekly_leaderboard')
            .select('league, weekly_xp')
            .eq('user_id', user.id)
            .eq('week_start', weekStart.toISOString().split('T')[0])
            .single();
        
        if (userError) return null;
        
        // Aynı ligde kaç kişi var ve kullanıcı kaçıncı sırada
        const { data: rankings, error: rankError } = await supabaseClient
            .from('weekly_leaderboard')
            .select('user_id, weekly_xp')
            .eq('week_start', weekStart.toISOString().split('T')[0])
            .eq('league', userData.league)
            .order('weekly_xp', { ascending: false });
        
        if (rankError) return null;
        
        const position = rankings.findIndex(r => r.user_id === user.id) + 1;
        const totalInLeague = rankings.length;
        
        return {
            league: userData.league,
            weekly_xp: userData.weekly_xp,
            position: position,
            total_in_league: totalInLeague,
            promotion_threshold: Math.ceil(totalInLeague * 0.25), // İlk %25
            demotion_threshold: Math.floor(totalInLeague * 0.70) // Son %30
        };
    }
    
    return null;
}
```

---

## 🎨 Frontend UI Tasarımı

### **1. Leaderboard Modal**
- Üst kısım: Kullanıcının mevcut ligi, pozisyonu, XP
- Orta kısım: Ligdeki ilk 10 kişi (Top 3 özel gösterim)
- Alt kısım: Kullanıcının çevresindeki 5 kişi (yukarı 2, aşağı 2)
- Progress bar: Yükselme/Düşme eşiği gösterimi

### **2. Lig Görsel Tasarımı**
```html
<div class="league-info">
    <div class="league-icon">📖</div>
    <div class="league-name">Mübtedi</div>
    <div class="league-arabic">مبتدئ</div>
    <div class="league-position">#12 / 45</div>
    <div class="weekly-xp">1,250 XP</div>
</div>

<div class="league-progress">
    <div class="promotion-zone">Promotion Zone</div>
    <div class="safe-zone">Safe Zone</div>
    <div class="demotion-zone">Demotion Zone</div>
    <div class="user-marker" style="left: 65%"></div>
</div>
```

---

## 🔄 Oyun İçi Entegrasyon

### **1. Puan Kazanınca XP Güncelle**
```javascript
// js/game-core.js - addToGlobalPoints() içinde
async function addToGlobalPoints(points, correctAnswers) {
    // ... mevcut kod ...
    
    // Haftalık XP'yi güncelle
    if (typeof window.updateWeeklyXP === 'function') {
        await window.updateWeeklyXP(points);
    }
}
```

### **2. Oyun Sonu Modal'ında Lig Bilgisi Göster**
```javascript
function showGameEndModal() {
    // ... mevcut kod ...
    
    // Lig bilgilerini getir ve göster
    if (typeof window.getUserLeaguePosition === 'function') {
        window.getUserLeaguePosition().then(position => {
            if (position) {
                showLeagueUpdate(position);
            }
        });
    }
}
```

---

## 📅 Haftalık Reset Zamanlaması

### **Supabase Edge Function / Cron Job**
- **Zaman**: Her Pazartesi 00:00 UTC
- **İşlem**: `reset_weekly_leaderboard()` fonksiyonunu çalıştır
- **Supabase Cron**: Dashboard > Database > Cron Jobs

---

## 🎯 Özet

**Backend:**
1. ✅ `weekly_leaderboard` tablosu
2. ✅ `user_leagues` tablosu
3. ✅ `league_config` tablosu
4. ✅ Haftalık reset fonksiyonu
5. ✅ RPC fonksiyonları (increment_weekly_xp, vb.)

**Frontend:**
1. ✅ API fonksiyonları (updateWeeklyXP, getLeagueInfo, vb.)
2. ✅ Leaderboard modal UI
3. ✅ Lig görsel tasarımı
4. ✅ Progress bar (yükselme/düşme göstergesi)
5. ✅ Oyun sonu entegrasyonu

**Özellikler:**
- ✅ Haftalık reset
- ✅ Otomatik lig yükselme/düşme
- ✅ Top 3 özel gösterim
- ✅ Kullanıcı pozisyon takibi
- ✅ Progress bar ile durum gösterimi

