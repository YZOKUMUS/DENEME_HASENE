// ============================================
// HIZLI KONTROL - Tüm Fonksiyonları Test Et
// ============================================
// Browser Console'da çalıştırın: hizliKontrol()

async function hizliKontrol() {
    console.log('🔍 Hızlı Kontrol Başlatılıyor...\n');
    
    // 1. Fonksiyonlar mevcut mu?
    console.log('1️⃣ Fonksiyon Kontrolü:');
    console.log('   - window.autoCreateCollections:', typeof window.autoCreateCollections);
    console.log('   - window.getCurrentUser:', typeof window.getCurrentUser);
    console.log('   - window.getFirebaseAuth:', typeof window.getFirebaseAuth);
    console.log('   - window.firestoreSet:', typeof window.firestoreSet);
    
    // 2. Kullanıcı bilgileri
    console.log('\n2️⃣ Kullanıcı Bilgileri:');
    try {
        const user = await window.getCurrentUser();
        if (user) {
            console.log('   ✅ Kullanıcı bulundu:', {
                id: user.id,
                username: user.username,
                email: user.email,
                isLocal: user.id.startsWith('local-')
            });
        } else {
            console.log('   ⚠️ Kullanıcı bulunamadı (null)');
        }
    } catch (error) {
        console.log('   ❌ Hata:', error.message);
    }
    
    // 3. Firebase Auth
    console.log('\n3️⃣ Firebase Auth:');
    try {
        const auth = window.getFirebaseAuth();
        if (auth) {
            console.log('   ✅ Auth mevcut');
            console.log('   - Current User:', auth.currentUser ? 'Var' : 'Yok');
            if (auth.currentUser) {
                console.log('   - UID:', auth.currentUser.uid);
            }
        } else {
            console.log('   ⚠️ Auth bulunamadı (null)');
        }
    } catch (error) {
        console.log('   ❌ Hata:', error.message);
    }
    
    // 4. autoCreateCollections test
    console.log('\n4️⃣ autoCreateCollections Test:');
    try {
        if (typeof window.autoCreateCollections === 'function') {
            console.log('   ✅ Fonksiyon mevcut, çağrılıyor...');
            const result = await window.autoCreateCollections();
            console.log('   - Sonuç:', result);
        } else {
            console.log('   ❌ Fonksiyon bulunamadı!');
        }
    } catch (error) {
        console.log('   ❌ Hata:', error.message);
        console.log('   - Stack:', error.stack);
    }
    
    // 5. Script kontrolü
    console.log('\n5️⃣ Script Kontrolü:');
    const scripts = Array.from(document.querySelectorAll('script'));
    let found = 0;
    scripts.forEach((script, index) => {
        if (script.textContent && script.textContent.includes('autoCreateCollections()')) {
            found++;
            const lines = script.textContent.split('\n');
            const lineIndex = lines.findIndex(line => line.includes('autoCreateCollections()'));
            console.log(`   ⚠️ Script ${index} içinde bulundu (satır ${lineIndex + 1})`);
            if (lineIndex >= 0) {
                console.log('   - Satır:', lines[lineIndex].trim());
            }
        }
    });
    if (found === 0) {
        console.log('   ✅ Hiçbir script içinde otomatik çağrı bulunamadı');
    } else {
        console.log(`   ⚠️ ${found} adet otomatik çağrı bulundu!`);
    }
    
    console.log('\n✅ Kontrol tamamlandı!');
}

// Export
if (typeof window !== 'undefined') {
    window.hizliKontrol = hizliKontrol;
    console.log('✅ hizliKontrol() fonksiyonu hazır!');
    console.log('💡 Browser Console\'da şunu çalıştırın: hizliKontrol()');
}
