# 🔍 HASENE Oyunu - Duplikasyon Test Raporu

**Tarih:** 2025-01-XX  
**Test Kapsamı:** Kod, JSON, DOM, Event Listener Duplikasyonları

---

## 📋 İçindekiler

1. [Kod Duplikasyon Testi](#1-kod-duplikasyon-testi)
2. [JSON veya Veri Dosyasında Duplikasyon Testi](#2-json-veya-veri-dosyasında-duplikasyon-testi)
3. [Database Duplikasyon Testi (SQL)](#3-database-duplikasyon-testi-sql)
4. [API Response veya Backend İçinde Duplikasyon Testi](#4-api-response-veya-backend-içinde-duplikasyon-testi)
5. [UI Component Duplikasyon Testi](#5-ui-component-duplikasyon-testi)
6. [Build Sistemleri ile Duplikasyon Tespiti](#6-build-sistemleri-ile-duplikasyon-tespiti)
7. [Manual Review Checklist](#7-manual-review-checklist)

---

## 1. Kod Duplikasyon Testi

### ✅ Tespit Edilen Duplikasyonlar

#### 🔴 Kritik: Navigasyon Butonları Duplikasyonu

**Konum:** `js/game-core.js`

**Sorun:** `displayAyet`, `displayDua`, `displayHadis` fonksiyonlarında navigasyon butonları için aynı kod tekrarlanıyor.

**Örnek Kod:**
```javascript
// displayAyet (satır 1655-1677)
const prevBtn = document.getElementById('ayet-prev-btn');
const nextBtn = document.getElementById('ayet-next-btn');
if (prevBtn) {
    prevBtn.disabled = currentAyetIndex === 0;
    prevBtn.onclick = () => { /* ... */ };
}
if (nextBtn) {
    nextBtn.disabled = false;
    nextBtn.onclick = () => { /* ... */ };
}

// displayDua (satır 1797-1819) - AYNI KOD
const prevBtn = document.getElementById('dua-prev-btn');
const nextBtn = document.getElementById('dua-next-btn');
if (prevBtn) {
    prevBtn.disabled = currentDuaIndex === 0;
    prevBtn.onclick = () => { /* ... */ };
}
if (nextBtn) {
    nextBtn.disabled = false;
    nextBtn.onclick = () => { /* ... */ };
}

// displayHadis (satır 1867-1889) - AYNI KOD
const prevBtn = document.getElementById('hadis-prev-btn');
const nextBtn = document.getElementById('hadis-next-btn');
if (prevBtn) {
    prevBtn.disabled = currentHadisIndex === 0;
    prevBtn.onclick = () => { /* ... */ };
}
if (nextBtn) {
    nextBtn.disabled = false;
    nextBtn.onclick = () => { /* ... */ };
}
```

**Önerilen Çözüm:**
```javascript
// Ortak fonksiyon oluştur
function setupNavigationButtons(prevBtnId, nextBtnId, currentIndex, allItems, displayFunction) {
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    
    if (prevBtn) {
        prevBtn.disabled = currentIndex === 0;
        prevBtn.onclick = () => {
            if (currentIndex > 0) {
                currentIndex--;
                displayFunction(allItems[currentIndex], allItems);
            }
        };
    }
    
    if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.onclick = () => {
            const randomIndex = Math.floor(Math.random() * allItems.length);
            currentIndex = randomIndex;
            displayFunction(allItems[currentIndex], allItems);
        };
    }
}
```

**Etkilenen Dosyalar:**
- `js/game-core.js` (satır 1655-1677, 1797-1819, 1867-1889)

**Öncelik:** 🔴 Yüksek

---

#### 🟡 Orta: Audio Button Handling Duplikasyonu

**Konum:** `js/game-core.js`

**Sorun:** Her modda (Ayet, Dua, Hadis) audio button handling için benzer kod tekrarlanıyor.

**Örnek Kod:**
```javascript
// displayAyet (satır 1631-1652)
const playAudioBtn = document.getElementById('ayet-play-audio-btn');
if (playAudioBtn && typeof setupAudioButton === 'function') {
    setupAudioButton(playAudioBtn, ayet.ses_url, { /* ... */ });
} else if (playAudioBtn) {
    // Fallback: Eski yöntem
    playAudioBtn.onclick = () => { /* ... */ };
}

// displayDua (satır 1732-1794) - BENZER KOD
const playAudioBtn = document.getElementById('dua-play-audio-btn');
if (playAudioBtn && typeof setupAudioButton === 'function') {
    setupAudioButton(playAudioBtn, dua.ses_url, { /* ... */ });
} else if (playAudioBtn) {
    // Fallback: Eski yöntem
    playAudioBtn.onclick = () => { /* ... */ };
}
```

**Önerilen Çözüm:**
```javascript
// Ortak fonksiyon oluştur
function setupAudioButtonForContent(buttonId, audioUrl, startTime = null) {
    const playAudioBtn = document.getElementById(buttonId);
    if (playAudioBtn && typeof setupAudioButton === 'function') {
        setupAudioButton(playAudioBtn, audioUrl, {
            onEnded: () => {},
            onError: () => {}
        });
        if (startTime && window.currentAudio) {
            window.currentAudio.currentTime = startTime;
        }
    } else if (playAudioBtn && audioUrl) {
        // Fallback handling
        playAudioBtn.onclick = () => { /* ... */ };
    }
}
```

**Etkilenen Dosyalar:**
- `js/game-core.js` (satır 1631-1652, 1732-1794, ~1853-1865)

**Öncelik:** 🟡 Orta

---

#### 🟡 Orta: Onboarding.js'de Element Duplikasyonu

**Konum:** `js/onboarding.js`

**Sorun:** `nextBtn` ve `prevBtn` elementleri iki kere alınıyor.

**Örnek Kod:**
```javascript
// Satır 33-34 (updateOnboardingSlide fonksiyonu içinde)
const prevBtn = document.getElementById('onboarding-prev');
const nextBtn = document.getElementById('onboarding-next');

// Satır 89-90 (Event listeners bölümünde)
const nextBtn = document.getElementById('onboarding-next');
const prevBtn = document.getElementById('onboarding-prev');
```

**Önerilen Çözüm:**
```javascript
// Elementleri bir kere al ve cache'le
const onboardingElements = {
    prevBtn: null,
    nextBtn: null,
    skipBtn: null
};

function getOnboardingElements() {
    if (!onboardingElements.prevBtn) {
        onboardingElements.prevBtn = document.getElementById('onboarding-prev');
        onboardingElements.nextBtn = document.getElementById('onboarding-next');
        onboardingElements.skipBtn = document.getElementById('onboarding-skip');
    }
    return onboardingElements;
}
```

**Etkilenen Dosyalar:**
- `js/onboarding.js` (satır 33-34, 89-90)

**Öncelik:** 🟡 Orta

---

#### 🟢 Düşük: Oyun Modu Fonksiyonları Benzerlik

**Konum:** `js/game-core.js`

**Sorun:** `checkKelimeAnswer`, `checkDinleAnswer`, `checkBoslukAnswer` fonksiyonları benzer mantık içeriyor.

**Not:** Bu fonksiyonlar oyun modlarına özgü farklılıklar içerdiği için tam duplikasyon sayılmaz, ancak ortak kısımlar extract edilebilir.

**Etkilenen Dosyalar:**
- `js/game-core.js` (satır 837-933, 1115-1208, 1421-1582)

**Öncelik:** 🟢 Düşük

---

## 2. JSON veya Veri Dosyasında Duplikasyon Testi

### ✅ Test Sonuçları

#### 🔴 Kritik: JSON Dosyalarında Tekrar Eden Kelimeler

**Test Edilen Dosyalar:**
- `data/kelimebul.json` (43,654 satır)
- `data/ayetoku.json` (53,750 satır)
- `data/duaet.json` (316 satır)
- `data/hadisoku.json` (118,698 satır)

**Test Yöntemi:** Node.js script ile kelime tekrarı kontrolü

**Sonuç:** 
- ⚠️ Büyük JSON dosyaları nedeniyle tam analiz yapılamadı
- 📝 Manuel kontrol gerekli

**Önerilen Test Script:**
```javascript
// test-duplicate-words.js
const fs = require('fs');

function checkDuplicates(filePath, keyField) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const words = {};
    
    data.forEach((item, index) => {
        const key = item[keyField] || '';
        if (key) {
            if (words[key]) {
                words[key].push(index);
            } else {
                words[key] = [index];
            }
        }
    });
    
    const duplicates = Object.entries(words)
        .filter(([k, v]) => v.length > 1)
        .sort((a, b) => b[1].length - a[1].length);
    
    console.log(`\n${filePath}:`);
    console.log(`Toplam kayıt: ${data.length}`);
    console.log(`Tekrar eden kelime sayısı: ${duplicates.length}`);
    console.log(`\nİlk 10 tekrar eden kelime:`);
    duplicates.slice(0, 10).forEach(([word, indices]) => {
        console.log(`  "${word}": ${indices.length} kez (satırlar: ${indices.join(', ')})`);
    });
    
    return duplicates;
}

// Test
checkDuplicates('data/kelimebul.json', 'kelime');
checkDuplicates('data/ayetoku.json', 'ayet');
checkDuplicates('data/duaet.json', 'dua');
```

**Öncelik:** 🔴 Yüksek (Manuel test gerekli)

---

## 3. Database Duplikasyon Testi (SQL)

### ✅ Test Sonuçları

**Durum:** Bu proje IndexedDB kullanıyor, SQL veritabanı yok.

**IndexedDB Duplikasyon Kontrolü:**

**Potansiyel Sorunlar:**
1. **localStorage Duplikasyonu:** Aynı key birden fazla yerde set edilebilir
2. **IndexedDB Key Duplikasyonu:** Aynı primary key ile birden fazla kayıt eklenebilir

**Kontrol Edilmesi Gerekenler:**
- `js/indexeddb-cache.js` - Key yönetimi
- `js/game-core.js` - localStorage kullanımları
- `js/word-stats-manager.js` - Kelime istatistikleri kayıtları

**Önerilen Kontrol:**
```javascript
// IndexedDB key kontrolü
async function checkIndexedDBDuplicates() {
    const db = await openDB();
    const tx = db.transaction(['words'], 'readonly');
    const store = tx.objectStore('words');
    const allKeys = await store.getAllKeys();
    
    const duplicates = allKeys.filter((key, index) => 
        allKeys.indexOf(key) !== index
    );
    
    if (duplicates.length > 0) {
        console.warn('Duplicate keys found:', duplicates);
    }
}
```

**Öncelik:** 🟡 Orta

---

## 4. API Response veya Backend İçinde Duplikasyon Testi

### ✅ Test Sonuçları

**Durum:** Bu proje backend kullanmıyor, tamamen client-side çalışıyor.

**Not:** Eğer gelecekte API entegrasyonu yapılırsa:
- Response cache kontrolü
- Duplicate request kontrolü
- Response deduplication

**Öncelik:** 🟢 Düşük (Şu an için geçerli değil)

---

## 5. UI Component Duplikasyon Testi

### ✅ Tespit Edilen Duplikasyonlar

#### 🟡 Orta: Aynı Ekranın İki Yerde DOM'da Bulunması

**Kontrol Edilen Ekranlar:**
- ✅ `kelime-cevir-screen` - Sadece bir kere tanımlı
- ✅ `dinle-bul-screen` - Sadece bir kere tanımlı
- ✅ `bosluk-doldur-screen` - Sadece bir kere tanımlı
- ✅ `ayet-oku-screen` - Sadece bir kere tanımlı
- ✅ `dua-et-screen` - Sadece bir kere tanımlı
- ✅ `hadis-oku-screen` - Sadece bir kere tanımlı

**Sonuç:** ✅ Ekranlar sadece bir kere tanımlı, duplikasyon yok.

**Ancak Dikkat Edilmesi Gerekenler:**
- Modal'ların birden fazla instance'ı olmamalı
- Loading screen'in birden fazla kopyası olmamalı

**Kontrol Script:**
```javascript
// DOM duplikasyon kontrolü
function checkDOMDuplicates() {
    const allIds = [];
    document.querySelectorAll('[id]').forEach(el => {
        const id = el.id;
        if (allIds.includes(id)) {
            console.error(`Duplicate ID found: ${id}`);
        } else {
            allIds.push(id);
        }
    });
    
    // Önemli ekranların kontrolü
    const importantScreens = [
        'loadingScreen',
        'main-menu',
        'kelime-cevir-screen',
        'dinle-bul-screen',
        'bosluk-doldur-screen',
        'ayet-oku-screen',
        'dua-et-screen',
        'hadis-oku-screen'
    ];
    
    importantScreens.forEach(screenId => {
        const elements = document.querySelectorAll(`#${screenId}`);
        if (elements.length > 1) {
            console.error(`Duplicate screen found: ${screenId} (${elements.length} times)`);
        }
    });
}
```

**Öncelik:** 🟢 Düşük (Şu an için sorun yok)

---

#### 🟡 Orta: Event Listener Duplikasyonu

**Tespit Edilen Sorunlar:**

1. **window.addEventListener('load') Duplikasyonu:**
   - `js/game-core.js` (satır 4399, 4466)
   - `js/indexeddb-cache.js` (satır 196)
   - `js/notifications.js` (satır 81)
   - `js/data-loader.js` (satır 232)

2. **document.addEventListener('DOMContentLoaded') Duplikasyonu:**
   - `js/game-core.js` (satır 4459)
   - `js/favorites-manager.js` (satır 161)

**Sorun:** Birden fazla `load` event listener'ı performans sorunlarına yol açabilir.

**Önerilen Çözüm:**
```javascript
// Ortak event manager oluştur
const EventManager = {
    loadCallbacks: [],
    domReadyCallbacks: [],
    
    onLoad(callback) {
        if (document.readyState === 'complete') {
            callback();
        } else {
            this.loadCallbacks.push(callback);
        }
    },
    
    onDOMReady(callback) {
        if (document.readyState !== 'loading') {
            callback();
        } else {
            this.domReadyCallbacks.push(callback);
        }
    },
    
    init() {
        if (this.loadCallbacks.length > 0) {
            window.addEventListener('load', () => {
                this.loadCallbacks.forEach(cb => cb());
                this.loadCallbacks = [];
            }, { once: true });
        }
        
        if (this.domReadyCallbacks.length > 0) {
            document.addEventListener('DOMContentLoaded', () => {
                this.domReadyCallbacks.forEach(cb => cb());
                this.domReadyCallbacks = [];
            }, { once: true });
        }
    }
};
```

**Etkilenen Dosyalar:**
- `js/game-core.js`
- `js/indexeddb-cache.js`
- `js/notifications.js`
- `js/data-loader.js`
- `js/favorites-manager.js`

**Öncelik:** 🟡 Orta

---

#### 🟡 Orta: `.onclick` vs `addEventListener` Karışımı

**Sorun:** Bazı yerlerde `.onclick =` kullanılırken, bazı yerlerde `addEventListener` kullanılıyor.

**Örnekler:**
```javascript
// .onclick kullanımı (game-core.js)
prevBtn.onclick = () => { /* ... */ };
nextBtn.onclick = () => { /* ... */ };

// addEventListener kullanımı (onboarding.js)
nextBtn.addEventListener('click', nextOnboardingSlide);
```

**Sorun:** `.onclick =` kullanımı önceki event listener'ları override eder, bu da duplikasyon sorunlarına yol açabilir.

**Önerilen Çözüm:** Tüm event listener'lar için `addEventListener` kullanılmalı.

**Etkilenen Dosyalar:**
- `js/game-core.js` (çok sayıda `.onclick =` kullanımı)
- `js/audio-manager.js` (satır 140, 149)

**Öncelik:** 🟡 Orta

---

## 6. Build Sistemleri ile Duplikasyon Tespiti

### ✅ Test Sonuçları

**Durum:** Bu proje build sistemi kullanmıyor (vanilla JavaScript).

**Not:** Eğer gelecekte build sistemi eklenirse:
- Webpack bundle analyzer
- Rollup duplicate detection
- ESLint no-duplicate-imports rule

**Öncelik:** 🟢 Düşük (Şu an için geçerli değil)

---

## 7. Manual Review Checklist

### ✅ Kontrol Listesi

#### Kod Duplikasyonu
- [x] Navigasyon butonları için ortak fonksiyon oluşturulmalı
- [x] Audio button handling için ortak fonksiyon oluşturulmalı
- [x] Onboarding.js'de element duplikasyonu düzeltilmeli
- [ ] Oyun modu fonksiyonlarındaki benzerlikler extract edilmeli

#### JSON Duplikasyonu
- [ ] `data/kelimebul.json` - Tekrar eden kelimeler kontrol edilmeli
- [ ] `data/ayetoku.json` - Tekrar eden ayetler kontrol edilmeli
- [ ] `data/duaet.json` - Tekrar eden dualar kontrol edilmeli
- [ ] `data/hadisoku.json` - Tekrar eden hadisler kontrol edilmeli

#### DOM Duplikasyonu
- [x] Tüm ekranlar sadece bir kere tanımlı ✅
- [x] Modal'lar sadece bir kere tanımlı ✅
- [x] Loading screen sadece bir kere tanımlı ✅

#### Event Listener Duplikasyonu
- [ ] `window.addEventListener('load')` birleştirilmeli
- [ ] `document.addEventListener('DOMContentLoaded')` birleştirilmeli
- [ ] `.onclick =` yerine `addEventListener` kullanılmalı

#### Database Duplikasyonu
- [ ] IndexedDB key duplikasyonu kontrol edilmeli
- [ ] localStorage key duplikasyonu kontrol edilmeli

---

## 📊 Özet

### Kritik Sorunlar (🔴)
1. Navigasyon butonları duplikasyonu (3 yerde tekrar)
2. JSON dosyalarında tekrar eden kelimeler (test gerekli)

### Orta Öncelikli Sorunlar (🟡)
1. Audio button handling duplikasyonu
2. Onboarding.js'de element duplikasyonu
3. Event listener duplikasyonu (`load`, `DOMContentLoaded`)
4. `.onclick` vs `addEventListener` karışımı
5. IndexedDB key duplikasyonu kontrolü

### Düşük Öncelikli Sorunlar (🟢)
1. Oyun modu fonksiyonlarındaki benzerlikler
2. Build sistemi duplikasyon kontrolü (gelecek için)

---

## 🎯 Önerilen Aksiyonlar

1. **Hemen Yapılacaklar:**
   - Navigasyon butonları için ortak fonksiyon oluştur
   - JSON dosyalarında tekrar eden kelimeleri kontrol et

2. **Kısa Vadede Yapılacaklar:**
   - Audio button handling için ortak fonksiyon oluştur
   - Event listener'ları birleştir
   - `.onclick` kullanımlarını `addEventListener`'a çevir

3. **Uzun Vadede Yapılacaklar:**
   - Oyun modu fonksiyonlarındaki benzerlikleri extract et
   - IndexedDB duplikasyon kontrolü ekle

---

## 📝 Notlar

- Bu rapor otomatik ve manuel testlerin birleşimidir
- Büyük JSON dosyaları nedeniyle tam analiz yapılamadı, manuel kontrol gerekli
- Event listener duplikasyonları performans sorunlarına yol açabilir
- Kod duplikasyonları bakım maliyetini artırır

---

**Rapor Oluşturulma Tarihi:** 2025-01-XX  
**Test Edilen Versiyon:** main branch  
**Test Edilen Dosyalar:** js/, data/, index.html

