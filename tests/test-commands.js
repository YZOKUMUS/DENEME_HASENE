// ============================================
// getCurrentUser() Test Komutları
// ============================================
// Bu dosyayı konsola kopyalayıp yapıştırabilirsiniz veya
// Ana uygulamada (index.html) konsolu açıp bu komutları çalıştırın

(async function runTests() {
    console.log('🧪 ============================================');
    console.log('🧪 getCurrentUser() Test Suite Başlatılıyor...');
    console.log('🧪 ============================================\n');
    
    const results = {
        passed: 0,
        failed: 0,
        warnings: 0,
        tests: []
    };
    
    function addResult(name, status, message) {
        results.tests.push({ name, status, message });
        const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
        console.log(`${icon} ${name}: ${message}`);
        if (status === 'PASS') results.passed++;
        else if (status === 'FAIL') results.failed++;
        else results.warnings++;
    }
    
    try {
        // Test 1: Fonksiyon var mı?
        console.log('\n📋 Test 1: Fonksiyon Kontrolü');
        if (typeof window.getCurrentUser !== 'function') {
            addResult('Fonksiyon Kontrolü', 'FAIL', 'window.getCurrentUser fonksiyonu bulunamadı!');
            return;
        }
        addResult('Fonksiyon Kontrolü', 'PASS', 'window.getCurrentUser fonksiyonu mevcut');
        
        // Test 2: Fonksiyon çağrısı
        console.log('\n📋 Test 2: Fonksiyon Çağrısı');
        const user = await window.getCurrentUser();
        
        if (!user) {
            addResult('Fonksiyon Çağrısı', 'WARNING', 'Fonksiyon null döndü (kullanıcı giriş yapmamış olabilir)');
        } else {
            addResult('Fonksiyon Çağrısı', 'PASS', `Kullanıcı bilgileri alındı: ID=${user.id}, Username=${user.username}, Email=${user.email}`);
            
            // Test 3: Email 'null' kontrolü
            console.log('\n📋 Test 3: Email Değeri Kontrolü');
            if (user.email === 'null' || user.email === null) {
                addResult('Email Değeri', 'FAIL', `Email hala 'null' veya null! Değer: ${user.email}`);
            } else if (user.email && user.email.includes('@')) {
                addResult('Email Değeri', 'PASS', `Email düzgün: ${user.email}`);
            } else {
                addResult('Email Değeri', 'WARNING', `Email formatı beklenmedik: ${user.email}`);
            }
            
            // Test 4: Tutarlılık testi
            console.log('\n📋 Test 4: Tutarlılık Testi (3 Çağrı)');
            const consistencyResults = [];
            for (let i = 0; i < 3; i++) {
                const u = await window.getCurrentUser();
                consistencyResults.push(u);
            }
            
            const allSame = consistencyResults.every(r => 
                r && r.id === user.id && 
                r.username === user.username && 
                r.email === user.email
            );
            
            if (allSame) {
                addResult('Tutarlılık', 'PASS', 'Tüm çağrılar aynı sonucu döndü');
            } else {
                addResult('Tutarlılık', 'FAIL', `Farklı sonuçlar döndü: ${JSON.stringify(consistencyResults, null, 2)}`);
            }
        }
        
        // Test 5: localStorage kontrolü
        console.log('\n📋 Test 5: localStorage Kontrolü');
        const userId = localStorage.getItem('hasene_user_id');
        const username = localStorage.getItem('hasene_username');
        const email = localStorage.getItem('hasene_user_email');
        
        console.log('localStorage değerleri:', { userId, username, email });
        
        if (email === 'null') {
            addResult('localStorage Email', 'FAIL', "Email 'null' string olarak kaydedilmiş!");
        } else if (email && email !== 'null') {
            addResult('localStorage Email', 'PASS', `Email düzgün: ${email}`);
        } else {
            addResult('localStorage Email', 'WARNING', "Email localStorage'da yok");
        }
        
        if (userId || username || email) {
            addResult('localStorage Değerleri', 'PASS', 'localStorage\'da kullanıcı verileri mevcut');
        } else {
            addResult('localStorage Değerleri', 'WARNING', 'localStorage\'da kullanıcı verisi yok');
        }
        
    } catch (error) {
        addResult('Genel Hata', 'FAIL', `Hata oluştu: ${error.message}\n${error.stack}`);
    }
    
    // Özet
    console.log('\n🧪 ============================================');
    console.log('🧪 Test Sonuçları Özeti');
    console.log('🧪 ============================================');
    console.log(`✅ Başarılı: ${results.passed}`);
    console.log(`⚠️  Uyarı: ${results.warnings}`);
    console.log(`❌ Başarısız: ${results.failed}`);
    console.log(`📊 Toplam: ${results.tests.length}`);
    const successRate = results.tests.length > 0 
        ? Math.round((results.passed / results.tests.length) * 100)
        : 0;
    console.log(`📈 Başarı Oranı: ${successRate}%`);
    console.log('🧪 ============================================\n');
    
    return results;
})();
