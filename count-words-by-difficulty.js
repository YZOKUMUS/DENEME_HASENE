// Alt mod seçeneklerinin zorluk modlarına göre kelime sayısını hesaplayan script
const fs = require('fs');
const path = require('path');

console.log('📂 JSON dosyası okunuyor...');
// JSON dosyasını oku
const jsonPath = path.join(__dirname, 'data', 'kelimebul.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`✅ ${data.length} kelime yüklendi\n`);

console.log('📊 ALT MOD VE ZORLUK SEVİYESİNE GÖRE KELİME SAYILARI\n');
console.log(`Toplam kelime sayısı: ${data.length}\n`);

// Zorluk seviyelerine göre filtreleme fonksiyonları
function filterByDifficulty(words, difficulty) {
    if (difficulty === 'easy') {
        // Kolay: difficulty 5-8 arası
        return words.filter(w => {
            const diff = w.difficulty ?? 10;
            return diff >= 5 && diff <= 8;
        });
    } else if (difficulty === 'medium') {
        // Orta: difficulty 9-12 arası
        return words.filter(w => {
            const diff = w.difficulty ?? 10;
            return diff >= 9 && diff <= 12;
        });
    } else if (difficulty === 'hard') {
        // Zor: difficulty 13-21 arası
        return words.filter(w => {
            const diff = w.difficulty ?? 10;
            return diff >= 13 && diff <= 21;
        });
    }
    return words;
}

// 30. cüz filtresi (sure 78-114)
function filterJuz30(words) {
    return words.filter(w => {
        const sureNum = parseInt(w.id.split(':')[0]);
        return sureNum >= 78 && sureNum <= 114;
    });
}

// Zorluk seviyeleri
const difficulties = ['easy', 'medium', 'hard'];
const difficultyNames = {
    easy: '🌱 Kolay (5-8)',
    medium: '⚖️ Orta (9-12)',
    hard: '🔥 Zor (13-21)'
};

// Alt modlar
const subModes = [
    { name: 'Klasik Oyun', filter: (words) => words },
    { name: '30.cüz Ayetlerinin Kelimeleri', filter: filterJuz30 },
    { name: 'Yanlış cevaplanan kelimeleri tekrar et', filter: (words) => words } // Review mode için tüm kelimeler (zorlanılan kelimeler dinamik)
];

console.log('═'.repeat(80));
console.log('ALT MOD VE ZORLUK SEVİYESİNE GÖRE KELİME SAYILARI');
console.log('═'.repeat(80));
console.log();

// Her alt mod için
subModes.forEach((subMode, subModeIndex) => {
    console.log(`\n📌 ${subModeIndex + 1}. ${subMode.name}`);
    console.log('─'.repeat(80));
    
    // Her zorluk seviyesi için
    difficulties.forEach(difficulty => {
        // Önce zorluk seviyesine göre filtrele
        let filtered = filterByDifficulty(data, difficulty);
        
        // Sonra alt mod filtresini uygula
        filtered = subMode.filter(filtered);
        
        const count = filtered.length;
        const percentage = ((count / data.length) * 100).toFixed(2);
        const bar = '█'.repeat(Math.min(50, Math.floor(count / data.length * 500)));
        
        console.log(`  ${difficultyNames[difficulty]}: ${String(count).padStart(6)} kelime (${percentage.padStart(5)}%) ${bar}`);
    });
    
    // Toplam (tüm zorluk seviyeleri)
    let totalFiltered = subMode.filter(data);
    const totalCount = totalFiltered.length;
    const totalPercentage = ((totalCount / data.length) * 100).toFixed(2);
    const totalBar = '█'.repeat(Math.min(50, Math.floor(totalCount / data.length * 500)));
    console.log(`  📊 Toplam:        ${String(totalCount).padStart(6)} kelime (${totalPercentage.padStart(5)}%) ${totalBar}`);
});

// Özet tablo
console.log('\n\n');
console.log('═'.repeat(80));
console.log('ÖZET TABLO');
console.log('═'.repeat(80));
console.log();

// Başlık
console.log('Alt Mod'.padEnd(40) + 'Kolay'.padStart(10) + 'Orta'.padStart(10) + 'Zor'.padStart(10) + 'Toplam'.padStart(10));
console.log('─'.repeat(80));

// Her alt mod için satır
subModes.forEach(subMode => {
    const easyCount = filterByDifficulty(subMode.filter(data), 'easy').length;
    const mediumCount = filterByDifficulty(subMode.filter(data), 'medium').length;
    const hardCount = filterByDifficulty(subMode.filter(data), 'hard').length;
    const totalCount = subMode.filter(data).length;
    
    const name = subMode.name.length > 38 ? subMode.name.substring(0, 35) + '...' : subMode.name;
    console.log(
        name.padEnd(40) +
        String(easyCount).padStart(10) +
        String(mediumCount).padStart(10) +
        String(hardCount).padStart(10) +
        String(totalCount).padStart(10)
    );
});

// Zorluk seviyelerine göre genel dağılım
console.log('\n\n');
console.log('═'.repeat(80));
console.log('ZORLUK SEVİYELERİNE GÖRE GENEL DAĞILIM (TÜM KELİMELER)');
console.log('═'.repeat(80));
console.log();

difficulties.forEach(difficulty => {
    const filtered = filterByDifficulty(data, difficulty);
    const count = filtered.length;
    const percentage = ((count / data.length) * 100).toFixed(2);
    const bar = '█'.repeat(Math.min(50, Math.floor(count / data.length * 500)));
    
    console.log(`${difficultyNames[difficulty]}: ${String(count).padStart(6)} kelime (${percentage.padStart(5)}%) ${bar}`);
});

console.log('\n');

