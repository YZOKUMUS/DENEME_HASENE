// Alt mod seçeneklerinin zorluk modlarına göre kelime sayısını hesaplayan script (optimize edilmiş)
const fs = require('fs');
const path = require('path');

console.log('📂 JSON dosyası okunuyor...');
const jsonPath = path.join(__dirname, 'data', 'kelimebul.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`✅ ${data.length} kelime yüklendi\n`);

// Zorluk seviyelerine göre filtreleme
function filterByDifficulty(words, difficulty) {
    if (difficulty === 'easy') {
        return words.filter(w => {
            const diff = w.difficulty ?? 10;
            return diff >= 5 && diff <= 8;
        });
    } else if (difficulty === 'medium') {
        return words.filter(w => {
            const diff = w.difficulty ?? 10;
            return diff >= 9 && diff <= 12;
        });
    } else if (difficulty === 'hard') {
        return words.filter(w => {
            const diff = w.difficulty ?? 10;
            return diff >= 13 && diff <= 21;
        });
    }
    return words;
}

// 30. cüz filtresi
function filterJuz30(words) {
    return words.filter(w => {
        const sureNum = parseInt(w.id.split(':')[0]);
        return sureNum >= 78 && sureNum <= 114;
    });
}

// Önce tüm filtrelemeleri yap
console.log('🔄 Filtreleme yapılıyor...\n');

const easyAll = filterByDifficulty(data, 'easy');
const mediumAll = filterByDifficulty(data, 'medium');
const hardAll = filterByDifficulty(data, 'hard');

const juz30All = filterJuz30(data);
const juz30Easy = filterByDifficulty(juz30All, 'easy');
const juz30Medium = filterByDifficulty(juz30All, 'medium');
const juz30Hard = filterByDifficulty(juz30All, 'hard');

// Sonuçları göster
console.log('═'.repeat(70));
console.log('ALT MOD VE ZORLUK SEVİYESİNE GÖRE KELİME SAYILARI');
console.log('═'.repeat(70));
console.log();

console.log('📌 1. Klasik Oyun');
console.log('─'.repeat(70));
console.log(`  🌱 Kolay (5-8):   ${String(easyAll.length).padStart(6)} kelime (${((easyAll.length / data.length) * 100).toFixed(2)}%)`);
console.log(`  ⚖️  Orta (9-12):   ${String(mediumAll.length).padStart(6)} kelime (${((mediumAll.length / data.length) * 100).toFixed(2)}%)`);
console.log(`  🔥 Zor (13-21):    ${String(hardAll.length).padStart(6)} kelime (${((hardAll.length / data.length) * 100).toFixed(2)}%)`);
console.log(`  📊 Toplam:        ${String(data.length).padStart(6)} kelime (100.00%)`);

console.log('\n📌 2. 30.cüz Ayetlerinin Kelimeleri');
console.log('─'.repeat(70));
console.log(`  🌱 Kolay (5-8):   ${String(juz30Easy.length).padStart(6)} kelime (${((juz30Easy.length / juz30All.length) * 100).toFixed(2)}% of 30.cüz)`);
console.log(`  ⚖️  Orta (9-12):   ${String(juz30Medium.length).padStart(6)} kelime (${((juz30Medium.length / juz30All.length) * 100).toFixed(2)}% of 30.cüz)`);
console.log(`  🔥 Zor (13-21):    ${String(juz30Hard.length).padStart(6)} kelime (${((juz30Hard.length / juz30All.length) * 100).toFixed(2)}% of 30.cüz)`);
console.log(`  📊 Toplam:        ${String(juz30All.length).padStart(6)} kelime (${((juz30All.length / data.length) * 100).toFixed(2)}% of all)`);

console.log('\n📌 3. Yanlış cevaplanan kelimeleri tekrar et');
console.log('─'.repeat(70));
console.log('  ⚠️  Bu mod dinamik - kullanıcının yanlış cevapladığı kelimelere göre değişir');
console.log('  📊 Potansiyel: Tüm kelimeler (zorluk seviyesine göre filtrelenir)');

console.log('\n\n═'.repeat(70));
console.log('ÖZET TABLO');
console.log('═'.repeat(70));
console.log();
console.log('Alt Mod'.padEnd(45) + 'Kolay'.padStart(8) + 'Orta'.padStart(8) + 'Zor'.padStart(8) + 'Toplam'.padStart(8));
console.log('─'.repeat(70));
console.log('Klasik Oyun'.padEnd(45) + String(easyAll.length).padStart(8) + String(mediumAll.length).padStart(8) + String(hardAll.length).padStart(8) + String(data.length).padStart(8));
console.log('30.cüz Ayetlerinin Kelimeleri'.padEnd(45) + String(juz30Easy.length).padStart(8) + String(juz30Medium.length).padStart(8) + String(juz30Hard.length).padStart(8) + String(juz30All.length).padStart(8));
console.log('Yanlış cevaplanan kelimeleri tekrar et'.padEnd(45) + 'Dinamik'.padStart(8) + 'Dinamik'.padStart(8) + 'Dinamik'.padStart(8) + 'Dinamik'.padStart(8));

console.log('\n');

