// Difficulty dağılımını kontrol eden script
const fs = require('fs');
const path = require('path');

// JSON dosyasını oku
const jsonPath = path.join(__dirname, 'data', 'kelimebul.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('📊 DIFFICULTY DAĞILIMI ANALİZİ\n');
console.log(`Toplam kelime sayısı: ${data.length}\n`);

// Difficulty değerlerini say
const difficultyCount = {};
const difficultyByLevel = {
    easy: [],    // 0-8
    medium: [], // 9-16
    hard: []    // 17-24
};

data.forEach(word => {
    const diff = word.difficulty ?? 12; // Varsayılan 12 (orta)
    
    // Genel sayım
    difficultyCount[diff] = (difficultyCount[diff] || 0) + 1;
    
    // Seviyelere göre dağılım
    if (diff >= 0 && diff <= 8) {
        difficultyByLevel.easy.push(word);
    } else if (diff >= 9 && diff <= 16) {
        difficultyByLevel.medium.push(word);
    } else if (diff >= 17 && diff <= 24) {
        difficultyByLevel.hard.push(word);
    }
});

// Her difficulty değerinin sayısını göster
console.log('📈 Her Difficulty Değerinin Sayısı:');
console.log('─'.repeat(50));
const sortedDifficulties = Object.keys(difficultyCount)
    .map(Number)
    .sort((a, b) => a - b);

sortedDifficulties.forEach(diff => {
    const count = difficultyCount[diff];
    const percentage = ((count / data.length) * 100).toFixed(2);
    const bar = '█'.repeat(Math.floor(count / data.length * 100));
    console.log(`Difficulty ${String(diff).padStart(2)}: ${String(count).padStart(5)} kelime (${percentage.padStart(5)}%) ${bar}`);
});

// Seviyelere göre özet
console.log('\n🎯 ZORLUK SEVİYELERİNE GÖRE DAĞILIM:');
console.log('─'.repeat(50));
console.log(`🌱 KOLAY (0-8):   ${String(difficultyByLevel.easy.length).padStart(5)} kelime (${((difficultyByLevel.easy.length / data.length) * 100).toFixed(2)}%)`);
console.log(`⚖️  ORTA (9-16):   ${String(difficultyByLevel.medium.length).padStart(5)} kelime (${((difficultyByLevel.medium.length / data.length) * 100).toFixed(2)}%)`);
console.log(`🔥 ZOR (17-24):    ${String(difficultyByLevel.hard.length).padStart(5)} kelime (${((difficultyByLevel.hard.length / data.length) * 100).toFixed(2)}%)`);

// Eşit dağılım kontrolü
const total = data.length;
const expectedPerLevel = total / 3;
const easyDiff = Math.abs(difficultyByLevel.easy.length - expectedPerLevel);
const mediumDiff = Math.abs(difficultyByLevel.medium.length - expectedPerLevel);
const hardDiff = Math.abs(difficultyByLevel.hard.length - expectedPerLevel);

console.log('\n⚖️  EŞİT DAĞILIM KONTROLÜ:');
console.log('─'.repeat(50));
console.log(`Beklenen (her seviye için): ${expectedPerLevel.toFixed(0)} kelime`);
console.log(`\nKolay:  ${difficultyByLevel.easy.length} (fark: ${easyDiff.toFixed(0)})`);
console.log(`Orta:   ${difficultyByLevel.medium.length} (fark: ${mediumDiff.toFixed(0)})`);
console.log(`Zor:    ${difficultyByLevel.hard.length} (fark: ${hardDiff.toFixed(0)})`);

// En çok ve en az kullanılan difficulty değerleri
const maxCount = Math.max(...Object.values(difficultyCount));
const minCount = Math.min(...Object.values(difficultyCount));
const maxDiff = sortedDifficulties.find(d => difficultyCount[d] === maxCount);
const minDiff = sortedDifficulties.find(d => difficultyCount[d] === minCount);

console.log('\n📊 İSTATİSTİKLER:');
console.log('─'.repeat(50));
console.log(`En çok kelime: Difficulty ${maxDiff} (${maxCount} kelime)`);
console.log(`En az kelime: Difficulty ${minDiff} (${minCount} kelime)`);
console.log(`Ortalama: ${(total / sortedDifficulties.length).toFixed(2)} kelime/difficulty`);

// Eşit dağılım yüzdesi
const maxDeviation = Math.max(easyDiff, mediumDiff, hardDiff);
const deviationPercent = ((maxDeviation / expectedPerLevel) * 100).toFixed(2);
console.log(`\nMaksimum sapma: ${maxDeviation.toFixed(0)} kelime (${deviationPercent}%)`);

if (deviationPercent < 10) {
    console.log('✅ Dağılım oldukça eşit!');
} else if (deviationPercent < 25) {
    console.log('⚠️  Dağılım kabul edilebilir seviyede.');
} else {
    console.log('❌ Dağılım eşit değil, dengesiz!');
}


