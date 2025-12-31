/**
 * Vazifeler Paneli Test Scripti
 * Bu script vazifeler panelinin backend'den veri yükleme ve gösterimini test eder
 */

// Test sonuçları
const testResults = {
    passed: 0,
    failed: 0,
    warnings: 0,
    details: []
};

function logTest(name, passed, message, details = {}) {
    if (passed) {
        testResults.passed++;
        console.log(`✅ ${name}: ${message}`, details);
    } else {
        testResults.failed++;
        console.error(`❌ ${name}: ${message}`, details);
    }
    testResults.details.push({ name, passed, message, details });
}

function logWarning(name, message, details = {}) {
    testResults.warnings++;
    console.warn(`⚠️ ${name}: ${message}`, details);
    testResults.details.push({ name, passed: null, message, details, warning: true });
}

/**
 * Test 1: dailyTasks.tasks ve dailyTasks.bonusTasks kontrolü
 */
function testDailyTasksExist() {
    console.log('\n📋 Test 1: dailyTasks.tasks ve dailyTasks.bonusTasks kontrolü');
    
    if (!window.dailyTasks) {
        logTest('dailyTasks objesi', false, 'dailyTasks objesi bulunamadı');
        return false;
    }
    
    const hasTasks = window.dailyTasks.tasks && Array.isArray(window.dailyTasks.tasks) && window.dailyTasks.tasks.length > 0;
    const hasBonusTasks = window.dailyTasks.bonusTasks && Array.isArray(window.dailyTasks.bonusTasks) && window.dailyTasks.bonusTasks.length > 0;
    
    logTest('dailyTasks.tasks var mı?', hasTasks, hasTasks ? `${window.dailyTasks.tasks.length} görev bulundu` : 'Görevler bulunamadı', {
        tasksCount: window.dailyTasks.tasks?.length || 0
    });
    
    logTest('dailyTasks.bonusTasks var mı?', hasBonusTasks, hasBonusTasks ? `${window.dailyTasks.bonusTasks.length} bonus görev bulundu` : 'Bonus görevler bulunamadı', {
        bonusTasksCount: window.dailyTasks.bonusTasks?.length || 0
    });
    
    return hasTasks && hasBonusTasks;
}

/**
 * Test 2: dailyTasks.todayStats kontrolü
 */
function testTodayStats() {
    console.log('\n📊 Test 2: dailyTasks.todayStats kontrolü');
    
    if (!window.dailyTasks || !window.dailyTasks.todayStats) {
        logTest('dailyTasks.todayStats', false, 'dailyTasks.todayStats bulunamadı');
        return false;
    }
    
    const todayStats = window.dailyTasks.todayStats;
    const hasToplamPuan = typeof todayStats.toplamPuan === 'number';
    const hasToplamDogru = typeof todayStats.toplamDogru === 'number';
    const hasAllGameModes = todayStats.allGameModes instanceof Set || Array.isArray(todayStats.allGameModes);
    
    logTest('todayStats.toplamPuan var mı?', hasToplamPuan, hasToplamPuan ? `toplamPuan: ${todayStats.toplamPuan}` : 'toplamPuan bulunamadı', {
        toplamPuan: todayStats.toplamPuan
    });
    
    logTest('todayStats.toplamDogru var mı?', hasToplamDogru, hasToplamDogru ? `toplamDogru: ${todayStats.toplamDogru}` : 'toplamDogru bulunamadı', {
        toplamDogru: todayStats.toplamDogru
    });
    
    logTest('todayStats.allGameModes var mı?', hasAllGameModes, hasAllGameModes ? `allGameModes: ${todayStats.allGameModes?.size || todayStats.allGameModes?.length || 0}` : 'allGameModes bulunamadı', {
        allGameModesSize: todayStats.allGameModes?.size || todayStats.allGameModes?.length || 0
    });
    
    return hasToplamPuan && hasToplamDogru && hasAllGameModes;
}

/**
 * Test 3: hasene_daily_${today}.points kontrolü
 */
function testDailyPoints() {
    console.log('\n💰 Test 3: hasene_daily_${today}.points kontrolü');
    
    if (typeof getLocalDateString !== 'function') {
        logTest('getLocalDateString fonksiyonu', false, 'getLocalDateString fonksiyonu bulunamadı');
        return false;
    }
    
    if (typeof safeGetItem !== 'function') {
        logTest('safeGetItem fonksiyonu', false, 'safeGetItem fonksiyonu bulunamadı');
        return false;
    }
    
    const today = getLocalDateString();
    const dailyKey = `hasene_daily_${today}`;
    const dailyData = safeGetItem(dailyKey, { points: 0, correct: 0, wrong: 0 });
    
    logTest('hasene_daily_${today}.points var mı?', true, `points: ${dailyData.points}`, {
        dailyKey,
        points: dailyData.points,
        correct: dailyData.correct,
        wrong: dailyData.wrong
    });
    
    if (dailyData.points === 0) {
        logWarning('hasene_daily_${today}.points', 'points değeri 0 - oyun oynanmamış olabilir', {
            dailyKey,
            points: dailyData.points
        });
    }
    
    return true;
}

/**
 * Test 4: updateTaskProgressFromStats fonksiyonu
 */
function testUpdateTaskProgressFromStats() {
    console.log('\n🔄 Test 4: updateTaskProgressFromStats fonksiyonu');
    
    if (typeof updateTaskProgressFromStats !== 'function') {
        logTest('updateTaskProgressFromStats fonksiyonu', false, 'updateTaskProgressFromStats fonksiyonu bulunamadı');
        return false;
    }
    
    // Fonksiyonu çağır
    try {
        updateTaskProgressFromStats();
        logTest('updateTaskProgressFromStats çağrısı', true, 'Fonksiyon başarıyla çağrıldı');
        
        // Görevlerin progress değerlerini kontrol et
        if (window.dailyTasks && window.dailyTasks.tasks) {
            const tasksWithProgress = window.dailyTasks.tasks.filter(t => typeof t.progress === 'number');
            logTest('Görevlerin progress değerleri', tasksWithProgress.length > 0, `${tasksWithProgress.length} görevde progress değeri var`, {
                tasksWithProgress: tasksWithProgress.length,
                totalTasks: window.dailyTasks.tasks.length
            });
        }
        
        return true;
    } catch (error) {
        logTest('updateTaskProgressFromStats çağrısı', false, `Hata: ${error.message}`, { error });
        return false;
    }
}

/**
 * Test 5: updateTasksDisplay fonksiyonu
 */
async function testUpdateTasksDisplay() {
    console.log('\n🎨 Test 5: updateTasksDisplay fonksiyonu');
    
    if (typeof updateTasksDisplay !== 'function') {
        logTest('updateTasksDisplay fonksiyonu', false, 'updateTasksDisplay fonksiyonu bulunamadı');
        return false;
    }
    
    // Fonksiyonu çağır
    try {
        await updateTasksDisplay();
        logTest('updateTasksDisplay çağrısı', true, 'Fonksiyon başarıyla çağrıldı');
        
        // DOM'da görevlerin görünüp görünmediğini kontrol et
        const dailyTasksList = document.getElementById('daily-tasks-list');
        if (dailyTasksList) {
            const taskItems = dailyTasksList.querySelectorAll('.task-item');
            logTest('DOM\'da görevler görünüyor mu?', taskItems.length > 0, `${taskItems.length} görev DOM\'da görünüyor`, {
                taskItemsCount: taskItems.length
            });
            
            // Progress değerlerini kontrol et
            const progressTexts = dailyTasksList.querySelectorAll('.task-progress-text');
            const hasProgressValues = Array.from(progressTexts).some(el => {
                const text = el.textContent;
                const match = text.match(/(\d+)\/(\d+)/);
                return match && parseInt(match[1]) >= 0;
            });
            
            logTest('Progress değerleri DOM\'da görünüyor mu?', hasProgressValues, hasProgressValues ? 'Progress değerleri görünüyor' : 'Progress değerleri görünmüyor', {
                progressTextsCount: progressTexts.length
            });
        } else {
            logWarning('daily-tasks-list elementi', 'daily-tasks-list elementi bulunamadı - vazifeler paneli açık olmayabilir');
        }
        
        return true;
    } catch (error) {
        logTest('updateTasksDisplay çağrısı', false, `Hata: ${error.message}`, { error });
        return false;
    }
}

/**
 * Test 6: Backend'den veri yükleme
 */
async function testBackendDataLoad() {
    console.log('\n📥 Test 6: Backend\'den veri yükleme');
    
    if (typeof window.loadDailyTasks !== 'function') {
        logTest('loadDailyTasks fonksiyonu', false, 'loadDailyTasks fonksiyonu bulunamadı');
        return false;
    }
    
    if (typeof window.getCurrentUser !== 'function') {
        logTest('getCurrentUser fonksiyonu', false, 'getCurrentUser fonksiyonu bulunamadı');
        return false;
    }
    
    try {
        const user = await window.getCurrentUser();
        if (!user) {
            logWarning('Kullanıcı kontrolü', 'Kullanıcı giriş yapmamış - backend testi atlanıyor');
            return false;
        }
        
        const backendDailyTasks = await window.loadDailyTasks();
        if (backendDailyTasks) {
            logTest('Backend\'den daily_tasks yüklendi', true, 'Backend\'den veri yüklendi', {
                hasTodayStats: !!backendDailyTasks.todayStats,
                tasksCount: backendDailyTasks.tasks?.length || 0,
                bonusTasksCount: backendDailyTasks.bonusTasks?.length || 0,
                toplamPuan: backendDailyTasks.todayStats?.toplamPuan || 0
            });
            
            if (backendDailyTasks.todayStats?.toplamPuan === 0) {
                logWarning('Backend toplamPuan', 'Backend\'den gelen toplamPuan 0 - oyun oynanmamış olabilir', {
                    toplamPuan: backendDailyTasks.todayStats.toplamPuan
                });
            }
        } else {
            logWarning('Backend veri yükleme', 'Backend\'den veri yüklenemedi - localStorage kullanılıyor olabilir');
        }
        
        return true;
    } catch (error) {
        logTest('Backend veri yükleme', false, `Hata: ${error.message}`, { error });
        return false;
    }
}

/**
 * Tüm testleri çalıştır
 */
async function runAllTests() {
    console.log('🚀 Vazifeler Paneli Test Suite Başlatılıyor...\n');
    console.log('='.repeat(60));
    
    testDailyTasksExist();
    testTodayStats();
    testDailyPoints();
    testUpdateTaskProgressFromStats();
    await testUpdateTasksDisplay();
    await testBackendDataLoad();
    
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 Test Sonuçları:');
    console.log(`✅ Başarılı: ${testResults.passed}`);
    console.log(`❌ Başarısız: ${testResults.failed}`);
    console.log(`⚠️ Uyarı: ${testResults.warnings}`);
    console.log(`📈 Başarı Oranı: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
    
    return testResults;
}

// Testleri çalıştır
if (typeof window !== 'undefined') {
    // Tarayıcıda çalışıyorsa
    window.testVazifelerPaneli = runAllTests;
    console.log('✅ Test scripti yüklendi! Konsolda şu komutu çalıştırın:');
    console.log('await testVazifelerPaneli()');
} else {
    // Node.js'de çalışıyorsa
    console.log('⚠️ Bu script tarayıcıda çalıştırılmalıdır!');
}
