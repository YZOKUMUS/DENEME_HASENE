// ============================================
// HAFTALIK XP TEMİZLEME - Browser Console'da Çalıştırın
// ============================================
// Browser Console'da (F12) şunu çalıştırın: temizleHaftalikXP()

async function temizleHaftalikXP() {
    console.log('🧹 Haftalık XP Temizleme Başlatılıyor...\n');
    
    try {
        const user = await window.getCurrentUser();
        if (!user || !user.id || user.id.startsWith('local-')) {
            console.log('❌ Firebase kullanıcısı bulunamadı. Lütfen giriş yapın.');
            return;
        }
        
        const weekStart = window.getWeekStart ? window.getWeekStart() : new Date();
        const weekStartStr = weekStart.toISOString().split('T')[0];
        const docId = (user.username && user.username !== 'Kullanıcı') 
            ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
            : user.id;
        
        const leaderboardDocId = `${docId}_${weekStartStr}`;
        
        console.log('🔍 Kontrol ediliyor:', {
            username: user.username,
            docId: docId,
            leaderboardDocId: leaderboardDocId,
            weekStart: weekStartStr
        });
        
        // Mevcut veriyi kontrol et
        const existing = await window.firestoreGet('weekly_leaderboard', leaderboardDocId);
        if (existing) {
            console.log('📊 Mevcut veri:', {
                weekly_xp: existing.weekly_xp,
                username: existing.username
            });
            
            // localStorage'daki değeri al
            const key = `hasene_weekly_xp_${weekStartStr}`;
            const localStorageXP = parseInt(localStorage.getItem(key) || '0');
            
            console.log('💾 localStorage değeri:', localStorageXP);
            
            // Firebase'i localStorage'a göre güncelle
            await window.firestoreSet('weekly_leaderboard', leaderboardDocId, {
                user_id: user.id,
                username: user.username || (user.email ? user.email.split('@')[0] : 'Kullanıcı'),
                firebase_uid: window.getFirebaseAuth()?.currentUser?.uid || null,
                week_start: weekStartStr,
                weekly_xp: localStorageXP, // localStorage'daki değeri kullan
                updated_at: new Date().toISOString()
            });
            
            console.log('✅ Haftalık XP temizlendi ve senkronize edildi!');
            console.log('📊 Yeni değer:', localStorageXP);
        } else {
            console.log('ℹ️ Firebase\'de haftalık XP verisi bulunamadı (normal, yeni kullanıcı olabilir)');
        }
    } catch (error) {
        console.error('❌ Hata:', error);
    }
}

// Export
if (typeof window !== 'undefined') {
    window.temizleHaftalikXP = temizleHaftalikXP;
    console.log('✅ temizleHaftalikXP() fonksiyonu hazır!');
    console.log('💡 Browser Console\'da şunu çalıştırın: temizleHaftalikXP()');
}
