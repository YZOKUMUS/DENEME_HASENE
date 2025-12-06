// ============================================
// NOTIFICATIONS - Bildirimler
// ============================================

/**
 * Bildirim izni ister
 */
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        warnLog('Bu tarayıcı bildirimleri desteklemiyor');
        return false;
    }
    
    if (Notification.permission === 'granted') {
        return true;
    }
    
    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    
    return false;
}

/**
 * Bildirim gönderir
 */
function sendNotification(title, options = {}) {
    if (!CONFIG.NOTIFICATIONS_ENABLED) return;
    
    if (Notification.permission === 'granted') {
        new Notification(title, {
            icon: '/assets/images/icon-192.png',
            badge: '/assets/images/icon-192.png',
            ...options
        });
    }
}

/**
 * Günlük hatırlatıcıyı ayarlar
 */
function scheduleDailyReminder() {
    // Bu fonksiyon service worker veya scheduled task ile çalışabilir
    // Şu an için basit bir implementasyon
    const reminderTime = CONFIG.DAILY_REMINDER_TIME.split(':');
    const now = new Date();
    const reminder = new Date();
    reminder.setHours(parseInt(reminderTime[0]), parseInt(reminderTime[1]), 0, 0);
    
    if (reminder <= now) {
        reminder.setDate(reminder.getDate() + 1);
    }
    
    const timeUntilReminder = reminder - now;
    
    setTimeout(() => {
        sendNotification('🕌 Hasene Arapça Dersi', {
            body: 'Günlük dersinizi yapmayı unutmayın!',
            tag: 'daily-reminder'
        });
    }, timeUntilReminder);
}

/**
 * Bildirimleri başlatır
 */
function initNotifications() {
    if (CONFIG.NOTIFICATIONS_ENABLED) {
        requestNotificationPermission().then(granted => {
            if (granted) {
                scheduleDailyReminder();
            }
        });
    }
}

// Sayfa yüklendiğinde bildirimleri başlat
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        initNotifications();
    });
}

// Export
if (typeof window !== 'undefined') {
    window.requestNotificationPermission = requestNotificationPermission;
    window.sendNotification = sendNotification;
    window.initNotifications = initNotifications;
}


