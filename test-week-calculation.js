// Hafta hesaplama testi
// Bu dosyayı tarayıcı konsolunda çalıştırabilirsiniz

function getWeekStartDate(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Pazartesi
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function getWeekEndDate(date = new Date()) {
    const start = getWeekStartDate(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
}

function getDayName(date) {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return days[date.getDay()];
}

function formatDate(date) {
    return `${date.getDate()} ${date.toLocaleString('tr-TR', { month: 'long' })} ${date.getFullYear()} (${getDayName(date)})`;
}

// Test tarihleri
const testDates = [
    new Date(2025, 11, 12), // 12 Aralık 2025 (Cuma)
    new Date(2025, 11, 13), // 13 Aralık 2025 (Cumartesi)
    new Date(2025, 11, 14), // 14 Aralık 2025 (Pazar)
    new Date(2025, 11, 15), // 15 Aralık 2025 (Pazartesi)
    new Date(2025, 11, 16), // 16 Aralık 2025 (Salı)
];

console.log('=== HAFTA HESAPLAMA TESTİ ===\n');

testDates.forEach(testDate => {
    const weekStart = getWeekStartDate(testDate);
    const weekEnd = getWeekEndDate(testDate);
    
    console.log(`Tarih: ${formatDate(testDate)}`);
    console.log(`Hafta Başlangıcı: ${formatDate(weekStart)}`);
    console.log(`Hafta Sonu: ${formatDate(weekEnd)}`);
    console.log(`Görüntü: ${weekStart.getDate()} Aralık - ${weekEnd.getDate()} Aralık`);
    console.log(`Beklenen: Pazartesi - Pazar aralığı olmalı`);
    console.log(`Sonuç: ${getDayName(weekStart) === 'Pazartesi' && getDayName(weekEnd) === 'Pazar' ? '✅ DOĞRU' : '❌ YANLIŞ'}`);
    console.log('---\n');
});

console.log('=== SONUÇ ===');
console.log('Tüm testler Pazartesi-Pazar aralığı göstermeli!');
