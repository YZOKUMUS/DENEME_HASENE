// Konsolda çalıştırılacak test komutları
// Tarayıcı konsolunda (F12) bu komutları çalıştırın:

console.log('🧪 Vazifeler Paneli Test Başlatılıyor...\n');

// Test 1: Görevler var mı?
console.log('📋 Test 1: Görevler kontrolü');
console.log('dailyTasks.tasks:', dailyTasks.tasks?.length || 0);
console.log('dailyTasks.bonusTasks:', dailyTasks.bonusTasks?.length || 0);

// Test 2: todayStats kontrolü
console.log('\n📊 Test 2: todayStats kontrolü');
console.log('todayStats.toplamPuan:', dailyTasks.todayStats?.toplamPuan || 0);
console.log('todayStats.toplamDogru:', dailyTasks.todayStats?.toplamDogru || 0);

// Test 3: hasene_daily_${today}.points kontrolü
console.log('\n💰 Test 3: hasene_daily_${today}.points kontrolü');
const today = getLocalDateString();
const dailyKey = `hasene_daily_${today}`;
const dailyData = safeGetItem(dailyKey, { points: 0, correct: 0, wrong: 0 });
console.log('dailyKey:', dailyKey);
console.log('dailyData.points:', dailyData.points);
console.log('dailyData.correct:', dailyData.correct);

// Test 4: updateTaskProgressFromStats çağrısı
console.log('\n🔄 Test 4: updateTaskProgressFromStats çağrısı');
if (typeof updateTaskProgressFromStats === 'function') {
    updateTaskProgressFromStats();
    console.log('✅ updateTaskProgressFromStats çağrıldı');
    
    // Görevlerin progress değerlerini kontrol et
    if (dailyTasks.tasks) {
        dailyTasks.tasks.forEach(task => {
            console.log(`  ${task.id}: ${task.progress}/${task.target}`);
        });
    }
} else {
    console.error('❌ updateTaskProgressFromStats fonksiyonu bulunamadı!');
}

// Test 5: updateTasksDisplay çağrısı
console.log('\n🎨 Test 5: updateTasksDisplay çağrısı');
if (typeof updateTasksDisplay === 'function') {
    updateTasksDisplay().then(() => {
        console.log('✅ updateTasksDisplay tamamlandı');
        
        // DOM'da görevlerin görünüp görünmediğini kontrol et
        const dailyTasksList = document.getElementById('daily-tasks-list');
        if (dailyTasksList) {
            const taskItems = dailyTasksList.querySelectorAll('.task-item');
            console.log('DOM\'da görev sayısı:', taskItems.length);
            
            const progressTexts = dailyTasksList.querySelectorAll('.task-progress-text');
            console.log('Progress text sayısı:', progressTexts.length);
            progressTexts.forEach((el, idx) => {
                console.log(`  Progress ${idx + 1}: ${el.textContent}`);
            });
        } else {
            console.warn('⚠️ daily-tasks-list elementi bulunamadı - vazifeler paneli açık olmayabilir');
        }
    }).catch(err => {
        console.error('❌ updateTasksDisplay hatası:', err);
    });
} else {
    console.error('❌ updateTasksDisplay fonksiyonu bulunamadı!');
}

console.log('\n✅ Test tamamlandı!');
