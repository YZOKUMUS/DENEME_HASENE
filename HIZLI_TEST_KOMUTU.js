// ============================================
// HIZLI TEST KOMUTU - Değişiklik Doğrulama
// ============================================
// Browser Console'da çalıştırın: testAutoCreateCollections()

async function testAutoCreateCollections() {
    console.log('🧪 autoCreateCollections Test Başlatılıyor...\n');
    
    // Test 1: Giriş yapmadan çağır
    console.log('1️⃣ Test: Giriş yapmadan autoCreateCollections()');
    console.log('   Beklenen: "LocalStorage kullanıcısı, atlandı" veya "Firebase auth yok, atlandı"');
    await window.autoCreateCollections();
    
    // Test 2: Kullanıcı bilgilerini kontrol et
    console.log('\n2️⃣ Test: Kullanıcı bilgileri');
    const user = await window.getCurrentUser();
    console.log('   Kullanıcı:', user);
    if (user) {
        console.log('   - ID:', user.id);
        console.log('   - Username:', user.username);
        console.log('   - Email:', user.email);
        console.log('   - Local kullanıcı mı?', user.id.startsWith('local-'));
    }
    
    // Test 3: Firebase auth kontrolü
    console.log('\n3️⃣ Test: Firebase auth');
    const auth = window.getFirebaseAuth();
    console.log('   Auth:', auth ? 'Mevcut' : 'Yok');
    if (auth) {
        console.log('   - Current User:', auth.currentUser ? 'Var' : 'Yok');
        if (auth.currentUser) {
            console.log('   - UID:', auth.currentUser.uid);
            console.log('   - UID uzunluğu:', auth.currentUser.uid.length);
        }
    }
    
    // Test 4: Tüm çağrı noktalarını kontrol et
    console.log('\n4️⃣ Test: Çağrı noktaları kontrolü');
    const scripts = Array.from(document.querySelectorAll('script'));
    let foundCalls = 0;
    scripts.forEach((script, index) => {
        if (script.textContent && script.textContent.includes('autoCreateCollections()')) {
            foundCalls++;
            const snippet = script.textContent.substring(
                script.textContent.indexOf('autoCreateCollections') - 50,
                script.textContent.indexOf('autoCreateCollections') + 200
            );
            console.log(`   ⚠️ Script ${index} içinde autoCreateCollections() bulundu:`, snippet);
        }
    });
    if (foundCalls === 0) {
        console.log('   ✅ Hiçbir script içinde otomatik çağrı bulunamadı');
    } else {
        console.log(`   ⚠️ ${foundCalls} adet otomatik çağrı bulundu!`);
    }
    
    // Test 5: Geçerli kullanıcı ile test
    console.log('\n5️⃣ Test: Geçerli kullanıcı ile autoCreateCollections()');
    if (user && !user.id.startsWith('local-') && user.username && user.username.length >= 2) {
        console.log('   ✅ Geçerli kullanıcı bulundu, test ediliyor...');
        await window.autoCreateCollections();
    } else {
        console.log('   ⚠️ Geçerli kullanıcı bulunamadı, test atlandı');
        console.log('   💡 Giriş yapın ve tekrar test edin');
    }
    
    console.log('\n✅ Test tamamlandı!');
    console.log('\n📋 Sonuçlar:');
    console.log('   - Eğer "Geçersiz username" veya "Firebase auth yok" görüyorsanız: ✅ DOĞRU');
    console.log('   - Eğer "Geçerli kullanıcı bulundu" görüyorsanız ve giriş yapmadıysanız: ❌ SORUN VAR');
    console.log('   - Eğer otomatik çağrı bulunduysa: ❌ SORUN VAR');
}

// Export
if (typeof window !== 'undefined') {
    window.testAutoCreateCollections = testAutoCreateCollections;
    console.log('✅ testAutoCreateCollections() fonksiyonu hazır!');
    console.log('💡 Browser Console\'da şunu çalıştırın: testAutoCreateCollections()');
}
