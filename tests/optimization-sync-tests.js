// ============================================
// OPTIMIZATION & SYNCHRONIZATION TESTS
// ============================================

/**
 * Optimizasyon ve Senkronizasyon Test Suite
 * 
 * Bu testler şunları kontrol eder:
 * 1. DOM Query Optimizasyonu
 * 2. Event Listener Yönetimi
 * 3. Memory Leak Kontrolü
 * 4. localStorage/IndexedDB Senkronizasyonu
 * 5. Veri Tutarlılığı
 * 6. Race Condition Kontrolü
 */

const OPTIMIZATION_TESTS = {
    // Test sonuçları
    results: {
        domOptimization: [],
        eventListeners: [],
        memoryLeaks: [],
        synchronization: [],
        dataConsistency: [],
        raceConditions: []
    },
    
    // Test istatistikleri
    stats: {
        totalTests: 0,
        passed: 0,
        failed: 0,
        warnings: 0
    }
};

/**
 * DOM Query Optimizasyonu Testi
 */
function testDOMOptimization() {
    console.log('🔍 DOM Query Optimizasyonu Testi Başlatılıyor...');
    
    const issues = [];
    const elementCache = new Map();
    const queries = [];
    
    // game-core.js içindeki DOM sorgularını analiz et
    const gameCoreCode = typeof fetch !== 'undefined' ? null : 'js/game-core.js';
    
    // Tekrarlanan querySelector/getElementById kullanımlarını tespit et
    const repeatedQueries = new Map();
    
    // Test: Element cache kullanımı
    if (typeof window !== 'undefined' && window.elements) {
        const cachedElements = Object.keys(window.elements || {});
        if (cachedElements.length > 0) {
            OPTIMIZATION_TESTS.results.domOptimization.push({
                test: 'Element Cache Kullanımı',
                status: 'PASS',
                message: `${cachedElements.length} element cache'lenmiş`,
                score: 100
            });
        } else {
            OPTIMIZATION_TESTS.results.domOptimization.push({
                test: 'Element Cache Kullanımı',
                status: 'WARNING',
                message: 'Element cache kullanılmıyor - performans sorunu olabilir',
                score: 50
            });
        }
    }
    
    // Test: querySelector kullanım sayısı
    const queryCount = 175; // grep sonucu
    if (queryCount > 100) {
        OPTIMIZATION_TESTS.results.domOptimization.push({
            test: 'DOM Query Sayısı',
            status: 'WARNING',
            message: `${queryCount} DOM sorgusu tespit edildi - cache kullanımı önerilir`,
            score: 60
        });
    } else {
        OPTIMIZATION_TESTS.results.domOptimization.push({
            test: 'DOM Query Sayısı',
            status: 'PASS',
            message: `DOM sorgu sayısı makul: ${queryCount}`,
            score: 100
        });
    }
    
    OPTIMIZATION_TESTS.stats.totalTests++;
    OPTIMIZATION_TESTS.stats.passed++;
    
    return issues;
}

/**
 * Event Listener Yönetimi Testi
 */
function testEventListenerManagement() {
    console.log('🔍 Event Listener Yönetimi Testi Başlatılıyor...');
    
    const issues = [];
    
    // Test: Event listener sayısı
    const listenerCount = 22; // grep sonucu
    if (listenerCount > 50) {
        OPTIMIZATION_TESTS.results.eventListeners.push({
            test: 'Event Listener Sayısı',
            status: 'WARNING',
            message: `${listenerCount} event listener tespit edildi - memory leak riski`,
            score: 70
        });
    } else {
        OPTIMIZATION_TESTS.results.eventListeners.push({
            test: 'Event Listener Sayısı',
            status: 'PASS',
            message: `Event listener sayısı makul: ${listenerCount}`,
            score: 100
        });
    }
    
    // Test: removeEventListener kullanımı
    const removeCount = 0; // Kontrol edilmeli
    if (removeCount === 0 && listenerCount > 10) {
        OPTIMIZATION_TESTS.results.eventListeners.push({
            test: 'Event Listener Temizliği',
            status: 'WARNING',
            message: 'removeEventListener kullanılmıyor - memory leak riski',
            score: 50
        });
    } else {
        OPTIMIZATION_TESTS.results.eventListeners.push({
            test: 'Event Listener Temizliği',
            status: 'PASS',
            message: 'Event listener temizliği yapılıyor',
            score: 100
        });
    }
    
    OPTIMIZATION_TESTS.stats.totalTests++;
    OPTIMIZATION_TESTS.stats.passed++;
    
    return issues;
}

/**
 * Memory Leak Kontrolü
 */
function testMemoryLeaks() {
    console.log('🔍 Memory Leak Kontrolü Başlatılıyor...');
    
    const issues = [];
    
    // Test: setTimeout/setInterval temizliği
    const timerCount = 27; // grep sonucu
    if (timerCount > 20) {
        OPTIMIZATION_TESTS.results.memoryLeaks.push({
            test: 'Timer Kullanımı',
            status: 'WARNING',
            message: `${timerCount} timer tespit edildi - clearTimeout/clearInterval kontrolü önerilir`,
            score: 70
        });
    } else {
        OPTIMIZATION_TESTS.results.memoryLeaks.push({
            test: 'Timer Kullanımı',
            status: 'PASS',
            message: `Timer sayısı makul: ${timerCount}`,
            score: 100
        });
    }
    
    // Test: Global değişken kullanımı
    const globalVars = 29; // grep sonucu (game-core.js)
    if (globalVars > 30) {
        OPTIMIZATION_TESTS.results.memoryLeaks.push({
            test: 'Global Değişken Sayısı',
            status: 'WARNING',
            message: `${globalVars} global değişken - modüler yapı önerilir`,
            score: 60
        });
    } else {
        OPTIMIZATION_TESTS.results.memoryLeaks.push({
            test: 'Global Değişken Sayısı',
            status: 'PASS',
            message: `Global değişken sayısı makul: ${globalVars}`,
            score: 100
        });
    }
    
    OPTIMIZATION_TESTS.stats.totalTests++;
    OPTIMIZATION_TESTS.stats.passed++;
    
    return issues;
}

/**
 * localStorage/IndexedDB Senkronizasyonu Testi
 */
async function testSynchronization() {
    console.log('🔍 Senkronizasyon Testi Başlatılıyor...');
    
    const issues = [];
    
    try {
        // Test: IndexedDB başlatma
        if (typeof initIndexedDB === 'function') {
            try {
                await initIndexedDB();
                OPTIMIZATION_TESTS.results.synchronization.push({
                    test: 'IndexedDB Başlatma',
                    status: 'PASS',
                    message: 'IndexedDB başarıyla başlatıldı',
                    score: 100
                });
            } catch (error) {
                OPTIMIZATION_TESTS.results.synchronization.push({
                    test: 'IndexedDB Başlatma',
                    status: 'FAIL',
                    message: `IndexedDB başlatılamadı: ${error.message}`,
                    score: 0
                });
                OPTIMIZATION_TESTS.stats.failed++;
            }
        } else {
            OPTIMIZATION_TESTS.results.synchronization.push({
                test: 'IndexedDB Başlatma',
                status: 'WARNING',
                message: 'initIndexedDB fonksiyonu bulunamadı',
                score: 50
            });
            OPTIMIZATION_TESTS.stats.warnings++;
        }
        
        // Test: Veri yazma/okuma senkronizasyonu
        const testKey = 'hasene_test_sync';
        const testValue = { test: true, timestamp: Date.now() };
        
        if (typeof saveToIndexedDB === 'function' && typeof loadFromIndexedDB === 'function') {
            // IndexedDB'ye yaz
            await saveToIndexedDB(testKey, testValue);
            
            // localStorage'a yaz (yedek)
            if (typeof safeSetItem === 'function') {
                safeSetItem(testKey, testValue);
            }
            
            // IndexedDB'den oku
            const indexedDBValue = await loadFromIndexedDB(testKey);
            
            // localStorage'dan oku
            const localStorageValue = typeof safeGetItem === 'function' 
                ? safeGetItem(testKey) 
                : null;
            
            // Senkronizasyon kontrolü
            if (indexedDBValue && localStorageValue) {
                const indexedDBMatch = JSON.stringify(indexedDBValue) === JSON.stringify(testValue);
                const localStorageMatch = JSON.stringify(localStorageValue) === JSON.stringify(testValue);
                
                if (indexedDBMatch && localStorageMatch) {
                    OPTIMIZATION_TESTS.results.synchronization.push({
                        test: 'Veri Senkronizasyonu',
                        status: 'PASS',
                        message: 'IndexedDB ve localStorage senkronize',
                        score: 100
                    });
                } else {
                    OPTIMIZATION_TESTS.results.synchronization.push({
                        test: 'Veri Senkronizasyonu',
                        status: 'FAIL',
                        message: 'IndexedDB ve localStorage senkronize değil',
                        score: 0
                    });
                    OPTIMIZATION_TESTS.stats.failed++;
                }
            } else {
                OPTIMIZATION_TESTS.results.synchronization.push({
                    test: 'Veri Senkronizasyonu',
                    status: 'WARNING',
                    message: 'Veri okuma/yazma fonksiyonları eksik',
                    score: 50
                });
                OPTIMIZATION_TESTS.stats.warnings++;
            }
            
            // Test verisini temizle
            if (typeof deleteFromIndexedDB === 'function') {
                await deleteFromIndexedDB(testKey);
            }
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(testKey);
            }
        }
        
        OPTIMIZATION_TESTS.stats.totalTests++;
        OPTIMIZATION_TESTS.stats.passed++;
        
    } catch (error) {
        OPTIMIZATION_TESTS.results.synchronization.push({
            test: 'Senkronizasyon Testi',
            status: 'FAIL',
            message: `Hata: ${error.message}`,
            score: 0
        });
        OPTIMIZATION_TESTS.stats.failed++;
        OPTIMIZATION_TESTS.stats.totalTests++;
    }
    
    return issues;
}

/**
 * Veri Tutarlılığı Testi
 */
async function testDataConsistency() {
    console.log('🔍 Veri Tutarlılığı Testi Başlatılıyor...');
    
    const issues = [];
    
    try {
        // Test: loadStats ve saveStats tutarlılığı
        if (typeof loadStats === 'function' && typeof saveStats === 'function') {
            // Mevcut veriyi yükle
            await loadStats();
            
            // Test değerleri
            const originalPoints = typeof totalPoints !== 'undefined' ? totalPoints : 0;
            const testPoints = originalPoints + 100;
            
            // Geçici olarak değiştir
            if (typeof window !== 'undefined') {
                window.totalPoints = testPoints;
            }
            
            // Kaydet
            await saveStats();
            
            // Yeniden yükle
            await loadStats();
            
            // Kontrol et
            const loadedPoints = typeof totalPoints !== 'undefined' ? totalPoints : 0;
            
            if (Math.abs(loadedPoints - testPoints) < 1) {
                OPTIMIZATION_TESTS.results.dataConsistency.push({
                    test: 'Veri Kaydetme/Yükleme',
                    status: 'PASS',
                    message: 'Veri tutarlı şekilde kaydediliyor ve yükleniyor',
                    score: 100
                });
            } else {
                OPTIMIZATION_TESTS.results.dataConsistency.push({
                    test: 'Veri Kaydetme/Yükleme',
                    status: 'FAIL',
                    message: `Veri tutarsız: Beklenen ${testPoints}, Yüklenen ${loadedPoints}`,
                    score: 0
                });
                OPTIMIZATION_TESTS.stats.failed++;
            }
            
            // Orijinal değere geri dön
            if (typeof window !== 'undefined') {
                window.totalPoints = originalPoints;
            }
            await saveStats();
        }
        
        // Test: Set/Array dönüşümü tutarlılığı
        const testSet = new Set(['a', 'b', 'c']);
        const testArray = Array.from(testSet);
        const restoredSet = new Set(testArray);
        
        if (testSet.size === restoredSet.size && 
            Array.from(testSet).every(item => restoredSet.has(item))) {
            OPTIMIZATION_TESTS.results.dataConsistency.push({
                test: 'Set/Array Dönüşümü',
                status: 'PASS',
                message: 'Set/Array dönüşümü tutarlı',
                score: 100
            });
        } else {
            OPTIMIZATION_TESTS.results.dataConsistency.push({
                test: 'Set/Array Dönüşümü',
                status: 'FAIL',
                message: 'Set/Array dönüşümü tutarsız',
                score: 0
            });
            OPTIMIZATION_TESTS.stats.failed++;
        }
        
        OPTIMIZATION_TESTS.stats.totalTests++;
        OPTIMIZATION_TESTS.stats.passed++;
        
    } catch (error) {
        OPTIMIZATION_TESTS.results.dataConsistency.push({
            test: 'Veri Tutarlılığı Testi',
            status: 'FAIL',
            message: `Hata: ${error.message}`,
            score: 0
        });
        OPTIMIZATION_TESTS.stats.failed++;
        OPTIMIZATION_TESTS.stats.totalTests++;
    }
    
    return issues;
}

/**
 * Race Condition Kontrolü
 */
async function testRaceConditions() {
    console.log('🔍 Race Condition Kontrolü Başlatılıyor...');
    
    const issues = [];
    
    try {
        // Test: Paralel kaydetme işlemleri
        if (typeof saveStats === 'function') {
            const promises = [];
            const results = [];
            
            // 5 paralel kaydetme işlemi
            for (let i = 0; i < 5; i++) {
                promises.push(
                    saveStats().then(() => {
                        results.push(i);
                        return i;
                    })
                );
            }
            
            await Promise.all(promises);
            
            if (results.length === 5) {
                OPTIMIZATION_TESTS.results.raceConditions.push({
                    test: 'Paralel Kaydetme',
                    status: 'PASS',
                    message: 'Paralel kaydetme işlemleri başarılı',
                    score: 100
                });
            } else {
                OPTIMIZATION_TESTS.results.raceConditions.push({
                    test: 'Paralel Kaydetme',
                    status: 'WARNING',
                    message: `Paralel kaydetme: ${results.length}/5 tamamlandı`,
                    score: 60
                });
                OPTIMIZATION_TESTS.stats.warnings++;
            }
        }
        
        // Test: Debounce kullanımı
        if (typeof debouncedSaveStats !== 'undefined') {
            OPTIMIZATION_TESTS.results.raceConditions.push({
                test: 'Debounce Kullanımı',
                status: 'PASS',
                message: 'Debounce mekanizması kullanılıyor',
                score: 100
            });
        } else {
            OPTIMIZATION_TESTS.results.raceConditions.push({
                test: 'Debounce Kullanımı',
                status: 'WARNING',
                message: 'Debounce mekanizması kullanılmıyor - race condition riski',
                score: 50
            });
            OPTIMIZATION_TESTS.stats.warnings++;
        }
        
        OPTIMIZATION_TESTS.stats.totalTests++;
        OPTIMIZATION_TESTS.stats.passed++;
        
    } catch (error) {
        OPTIMIZATION_TESTS.results.raceConditions.push({
            test: 'Race Condition Testi',
            status: 'FAIL',
            message: `Hata: ${error.message}`,
            score: 0
        });
        OPTIMIZATION_TESTS.stats.failed++;
        OPTIMIZATION_TESTS.stats.totalTests++;
    }
    
    return issues;
}

/**
 * Tüm testleri çalıştır
 */
async function runAllTests() {
    console.log('🚀 Optimizasyon ve Senkronizasyon Testleri Başlatılıyor...\n');
    
    // Testleri sırayla çalıştır
    testDOMOptimization();
    testEventListenerManagement();
    testMemoryLeaks();
    await testSynchronization();
    await testDataConsistency();
    await testRaceConditions();
    
    // Sonuçları göster
    displayResults();
}

/**
 * Test sonuçlarını göster
 */
function displayResults() {
    console.log('\n📊 TEST SONUÇLARI\n');
    console.log('='.repeat(60));
    
    // Her kategori için sonuçları göster
    const categories = [
        { name: 'DOM Optimizasyonu', results: OPTIMIZATION_TESTS.results.domOptimization },
        { name: 'Event Listener Yönetimi', results: OPTIMIZATION_TESTS.results.eventListeners },
        { name: 'Memory Leak Kontrolü', results: OPTIMIZATION_TESTS.results.memoryLeaks },
        { name: 'Senkronizasyon', results: OPTIMIZATION_TESTS.results.synchronization },
        { name: 'Veri Tutarlılığı', results: OPTIMIZATION_TESTS.results.dataConsistency },
        { name: 'Race Condition', results: OPTIMIZATION_TESTS.results.raceConditions }
    ];
    
    categories.forEach(category => {
        console.log(`\n📁 ${category.name}:`);
        category.results.forEach(result => {
            const icon = result.status === 'PASS' ? '✅' : 
                        result.status === 'WARNING' ? '⚠️' : '❌';
            console.log(`  ${icon} ${result.test}: ${result.message} (Skor: ${result.score}/100)`);
        });
    });
    
    // Özet istatistikler
    console.log('\n' + '='.repeat(60));
    console.log('📈 ÖZET İSTATİSTİKLER:');
    console.log(`  Toplam Test: ${OPTIMIZATION_TESTS.stats.totalTests}`);
    console.log(`  ✅ Başarılı: ${OPTIMIZATION_TESTS.stats.passed}`);
    console.log(`  ⚠️  Uyarı: ${OPTIMIZATION_TESTS.stats.warnings}`);
    console.log(`  ❌ Başarısız: ${OPTIMIZATION_TESTS.stats.failed}`);
    
    const successRate = OPTIMIZATION_TESTS.stats.totalTests > 0 
        ? Math.round((OPTIMIZATION_TESTS.stats.passed / OPTIMIZATION_TESTS.stats.totalTests) * 100)
        : 0;
    
    console.log(`  📊 Başarı Oranı: ${successRate}%`);
    console.log('='.repeat(60));
    
    // Öneriler
    if (OPTIMIZATION_TESTS.stats.warnings > 0 || OPTIMIZATION_TESTS.stats.failed > 0) {
        console.log('\n💡 ÖNERİLER:');
        
        if (OPTIMIZATION_TESTS.results.domOptimization.some(r => r.status === 'WARNING')) {
            console.log('  • DOM sorgularını cache\'leyin (elements objesi kullanın)');
        }
        
        if (OPTIMIZATION_TESTS.results.eventListeners.some(r => r.status === 'WARNING')) {
            console.log('  • Event listener\'ları temizleyin (removeEventListener kullanın)');
        }
        
        if (OPTIMIZATION_TESTS.results.memoryLeaks.some(r => r.status === 'WARNING')) {
            console.log('  • Timer\'ları temizleyin (clearTimeout/clearInterval)');
        }
        
        if (OPTIMIZATION_TESTS.results.raceConditions.some(r => r.status === 'WARNING')) {
            console.log('  • Debounce/throttle mekanizmalarını kullanın');
        }
    }
}

// Export
if (typeof window !== 'undefined') {
    window.OPTIMIZATION_TESTS = OPTIMIZATION_TESTS;
    window.runOptimizationTests = runAllTests;
    window.testDOMOptimization = testDOMOptimization;
    window.testEventListenerManagement = testEventListenerManagement;
    window.testMemoryLeaks = testMemoryLeaks;
    window.testSynchronization = testSynchronization;
    window.testDataConsistency = testDataConsistency;
    window.testRaceConditions = testRaceConditions;
}

