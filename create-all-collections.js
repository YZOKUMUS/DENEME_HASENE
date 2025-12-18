// ============================================
// FIREBASE COLLECTION OLUŞTURMA SCRIPT
// ============================================
// Bu script tüm collection'ları test document'leri ile oluşturur
// Browser Console'da çalıştırın

async function createAllCollections() {
    console.log('🔥 Tüm Firebase Collection\'ları oluşturuluyor...\n');
    
    const user = await window.getCurrentUser();
    if (!user || !user.id || user.id.startsWith('local-')) {
        console.error('❌ Firebase\'de giriş yapmamışsınız!');
        return;
    }
    
    const docId = (user.username && user.username !== 'Kullanıcı') 
        ? user.username.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 1500) 
        : user.id;
    
    const auth = window.getFirebaseAuth();
    const firebaseUid = auth?.currentUser?.uid || null;
    
    const collections = [
        {
            name: 'users',
            data: {
                user_id: user.id,
                username: user.username || 'Test',
                email: user.email || 'test@test.com',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                auth_type: 'anonymous',
                firebase_uid: firebaseUid
            }
        },
        {
            name: 'user_stats',
            data: {
                user_id: user.id,
                username: user.username || 'Test',
                firebase_uid: firebaseUid,
                total_points: 0,
                badges: { stars: 0, bronze: 0, silver: 0, gold: 0, diamond: 0 },
                streak_data: { currentStreak: 0, bestStreak: 0, totalPlayDays: 0 },
                game_stats: { totalCorrect: 0, totalWrong: 0, gameModeCounts: {} },
                perfect_lessons_count: 0
            }
        },
        {
            name: 'user_reports',
            data: {
                user_id: user.id,
                username: user.username || 'Test',
                firebase_uid: firebaseUid,
                toplam_hasene: 0,
                yildiz: 0,
                mertebe: 1,
                mertebe_adi: 'Başlangıç',
                seri: 0,
                updated_at: new Date().toISOString()
            }
        },
        {
            name: 'user_achievements',
            data: {
                user_id: user.id,
                username: user.username || 'Test',
                firebase_uid: firebaseUid,
                unlocked_badges: [],
                updated_at: new Date().toISOString()
            }
        },
        {
            name: 'daily_tasks',
            data: {
                user_id: user.id,
                username: user.username || 'Test',
                firebase_uid: firebaseUid,
                lastTaskDate: new Date().toISOString().split('T')[0],
                tasks: [],
                bonusTasks: [],
                completedTasks: [],
                todayStats: {
                    toplamDogru: 0,
                    toplamPuan: 0,
                    comboCount: 0,
                    allGameModes: [],
                    farklıZorluk: [],
                    reviewWords: []
                },
                rewardsClaimed: false
            }
        },
        {
            name: 'weekly_tasks',
            data: {
                user_id: user.id,
                username: user.username || 'Test',
                firebase_uid: firebaseUid,
                lastWeekStart: '',
                weekStart: '',
                weekEnd: '',
                tasks: [],
                completedTasks: [],
                weekStats: {
                    totalHasene: 0,
                    totalCorrect: 0,
                    totalWrong: 0,
                    daysPlayed: 0,
                    streakDays: 0,
                    allModesPlayed: [],
                    comboCount: 0
                },
                rewardsClaimed: false
            }
        }
    ];
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const collection of collections) {
        try {
            const result = await window.firestoreSet(collection.name, docId, collection.data);
            if (result) {
                console.log(`✅ ${collection.name} oluşturuldu`);
                successCount++;
            } else {
                console.log(`⚠️ ${collection.name} oluşturulamadı (firestoreSet false döndü)`);
                errorCount++;
            }
        } catch (error) {
            console.error(`❌ ${collection.name} hatası:`, error.message);
            errorCount++;
        }
    }
    
    console.log(`\n📊 Özet: ${successCount} başarılı, ${errorCount} hata`);
    console.log('\n💡 Firebase Console\'u yenileyin (F5) ve collection\'ları kontrol edin!');
}

// Browser Console'da çalıştırın:
// createAllCollections()

if (typeof window !== 'undefined') {
    window.createAllCollections = createAllCollections;
    // NOT: Otomatik çalıştırma - sadece manuel çağrılmalı
    // console.log('✅ createAllCollections() fonksiyonu hazır!');
    // console.log('💡 Browser Console\'da şunu çalıştırın: createAllCollections()');
}
