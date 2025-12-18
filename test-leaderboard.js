// ============================================
// LİDERLİK TABLOSU TEST SCRIPT
// ============================================
// Browser Console'da çalıştırın

async function testLeaderboard() {
    console.log('🔥 Liderlik Tablosu Test Başlatılıyor...\n');
    
    // 1. Kullanıcı bilgilerini kontrol edin
    const user = await window.getCurrentUser();
    console.log('1️⃣ Kullanıcı:', user);
    
    if (!user || user.id.startsWith('local-')) {
        console.error('❌ Firebase\'de giriş yapmamışsınız!');
        return;
    }
    
    // 2. Hafta başlangıcını kontrol edin
    const weekStart = window.getWeekStart();
    const weekStartStr = weekStart.toISOString().split('T')[0];
    console.log('2️⃣ Hafta başlangıcı:', weekStartStr);
    
    // 3. Document ID formatını kontrol edin
    const docId = (user.username && user.username !== 'Kullanıcı') 
        ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
        : user.id;
    const leaderboardDocId = `${docId}_${weekStartStr}`;
    console.log('3️⃣ Document ID:', leaderboardDocId);
    console.log('   - Username:', user.username);
    console.log('   - User ID:', user.id);
    console.log('   - Clean DocId:', docId);
    
    // 4. Firebase'de veri var mı kontrol edin
    console.log('\n4️⃣ Firebase\'de veri kontrol ediliyor...');
    const data = await window.firestoreGet('weekly_leaderboard', leaderboardDocId);
    console.log('   Firebase verisi:', data);
    
    // 5. Eğer user_id ile farklı bir document ID varsa kontrol edin
    if (!data && user.id !== docId) {
        const altDocId = `${user.id}_${weekStartStr}`;
        console.log('   Alternatif Document ID deneniyor:', altDocId);
        const altData = await window.firestoreGet('weekly_leaderboard', altDocId);
        console.log('   Alternatif veri:', altData);
    }
    
    // 6. Tüm weekly_leaderboard collection'ını kontrol edin
    console.log('\n5️⃣ Tüm weekly_leaderboard collection\'ı kontrol ediliyor...');
    const allData = await window.firestoreGetCollection('weekly_leaderboard', null, null);
    console.log('   Toplam document sayısı:', allData.length);
    const weekData = allData.filter(d => d.week_start === weekStartStr);
    console.log('   Bu hafta document\'ları:', weekData);
    console.log('   Bu hafta document sayısı:', weekData.length);
    
    // 7. Kullanıcı pozisyonunu kontrol edin
    console.log('\n6️⃣ Kullanıcı pozisyonu kontrol ediliyor...');
    const position = await window.getUserLeaguePosition();
    console.log('   Pozisyon:', position);
    
    // 8. localStorage'da haftalık XP var mı kontrol edin
    console.log('\n7️⃣ localStorage\'da haftalık XP kontrol ediliyor...');
    const key = `hasene_weekly_xp_${weekStartStr}`;
    const localXP = localStorage.getItem(key);
    console.log('   localStorage key:', key);
    console.log('   localStorage XP:', localXP);
    
    // 9. Manuel XP ekleme (test için)
    if (!data && !localXP) {
        console.log('\n8️⃣ Test için manuel XP ekleniyor...');
        await window.updateWeeklyXP(100);
        console.log('   ✅ 100 XP eklendi!');
        
        // Tekrar kontrol edin
        const newData = await window.firestoreGet('weekly_leaderboard', leaderboardDocId);
        console.log('   Yeni Firebase verisi:', newData);
        
        const newPosition = await window.getUserLeaguePosition();
        console.log('   Yeni pozisyon:', newPosition);
    }
    
    console.log('\n✅ Test tamamlandı!');
}

if (typeof window !== 'undefined') {
    window.testLeaderboard = testLeaderboard;
    console.log('✅ testLeaderboard() fonksiyonu hazır!');
    console.log('💡 Browser Console\'da şunu çalıştırın: testLeaderboard()');
}
