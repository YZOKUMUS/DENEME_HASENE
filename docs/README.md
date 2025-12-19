## 🕌 Hasene Arapça Dersi – Tam Teknik Doküman (Yeniden Yazılabilir Sürüm)

Bu README, **Hasene Arapça Dersi** oyununu sıfırdan **aynısını yeniden yazmak** isteyen geliştirici için hazırlanmış **ana kitap**tır. Buradaki mimariyi takip eden biri, repo’yu görmeden sadece bu dokümandan yola çıkarak projeyi yeniden inşa edebilir.

Alt ayrıntılar için ayrıca `docs/sistem/HASENE_OYUN_TAM_DOKUMANTASYON.md` dosyasında **tam döküm** de bulunuyor; burada ise daha derli toplu ama yine %100 yeniden yazmaya yetecek seviye detay var.

---

## 1. Genel Bakış ve Amaç

**Amaç**: Kuran’da geçen kelimeleri ve ilgili ayet/dua/hadis içeriklerini oyunlaştırarak öğretmek, bunu yaparken de **Hasene puan sistemi**, **rozetler**, **başarımlar**, **günlük vird** ve **görevler** ile kullanıcıyı motive etmek.

- **Tamamen frontend (Vanilla JS)**
- **Veri kaynağı**: Statik JSON dosyaları (`data/*.json`)
- **Depolama**: `localStorage` + (opsiyonel) `IndexedDB`
- **PWA**: `manifest.json` + `sw.js` ile offline ve ana ekrana eklenebilir uygulama
- **Hedef cihaz**: Özellikle **mobil** (iOS/Android), ama tablet ve masaüstü de destekleniyor

Temel özellikler:
- **6 oyun/okuma modu** (toplam 8 alt mod ile)
  - Kelime Çevir (4 alt mod: Klasik, 30. cüz, Tekrar Et, Favoriler)
  - Dinle Bul (alt mod yok)
  - Boşluk Doldur (alt mod yok)
  - Ayet Oku (okuma modu)
  - Dua Et (okuma modu)
  - Hadis Oku (okuma modu)
  - Elif Ba (4 alt mod: Harfler, Kelimeler, Harekeler, Harf Tablosu)
- **Hasene puan sistemi + combo + perfect bonus**
- **Yıldız / seviye (mertebe) / rozet sistemi**
- **44 başarım (achievements)**
- **Günlük vird ve günlük görevler**
- **Streak (seri) + takvim görünümü**
- **Detaylı kelime istatistikleri ve favoriler**

---

## 2. Proje Yapısı ve Dosyalar

Temel klasör yapısı:

```text
DENEME_HASENE/
├── index.html          # Tüm uygulama UI’si ve modallar
├── style.css           # Tüm stil ve responsive tasarım
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (offline + cache)
├── js/
│   ├── config.js              # Genel ayarlar, DEBUG flag vs.
│   ├── constants.js           # Level/rozet/görev sabitleri
│   ├── utils.js               # Yardımcı fonksiyonlar
│   ├── indexeddb-cache.js     # IndexedDB wrapper (opsiyonel)
│   ├── data-loader.js         # JSON veri yükleme
│   ├── error-handler.js       # Hata yakalama ve loglama
│   ├── audio-manager.js       # Ses efektleri ve medya oynatma
│   ├── points-manager.js      # Seviye hesaplama, rozet hesaplama
│   ├── word-stats-manager.js  # Kelime istatistikleri
│   ├── favorites-manager.js   # Favori kelimeler
│   ├── badge-visualization.js # Rozet grid ve görselleştirme
│   ├── game-core.js           # Ana oyun mantığı (state + akış)
│   ├── detailed-stats.js      # Detaylı istatistikler modalı
│   ├── notifications.js       # Basit bildirim/hatırlatma mantığı
│   ├── onboarding.js          # İlk açılış turu (onboarding)
│   ├── leaderboard.js         # Haftalık lig/leaderboard
│   ├── api-service.js         # (Şu an) localStorage & (eski) backend API wrapper
│   ├── auth.js                # Kullanıcı kimliği (local user)
│   └── firebase-*.js          # Eski Firebase entegrasyonu (opsiyonel)
├── data/
│   ├── kelimebul.json   # Kelime oyunları için kelime listesi
│   ├── ayetoku.json     # Ayet okuma/veri
│   ├── duaet.json       # Dua okuma/veri
│   └── hadisoku.json    # Hadis okuma/veri
├── assets/
│   ├── images/          # Genel ikon ve görseller (icon-192, icon-512 vs.)
│   ├── badges/          # Rozet ikonları (rozet1.png … rozet42.png)
│   └── game-icons/      # Oyun mod ikonları (kelime, dinle-bul vs.)
└── docs/
    ├── README.md        # Bu doküman
    └── sistem/HASENE_OYUN_TAM_DOKUMANTASYON.md # Çok detaylı versiyon
```

**Aynısını yazmak için** yukarıdaki yapıyı birebir kurmanız yeterli. JSON şemaları ve ana state yapıları aşağıda.

---

## 3. Veri Modelleri (JSON ve Bellek State)

### 3.1. Kelime verisi – `data/kelimebul.json`

Basit şema:

```json
{
  "words": [
    {
      "id": "word_1",
      "arabic": "بِسْمِ",
      "translation": "ismiyle",
      "sure": 1,
      "verse": 1,
      "difficulty": 7,
      "audio": "https://.../bismi.mp3"
    }
  ]
}
```

- **id**: Benzersiz kelime ID’si
- **arabic**: Arapça kelime (Uthmani script ile gösterilir)
- **translation**: Türkçe meâl kısa karşılık
- **sure / verse**: Referans için (kelime hangi ayette geçiyor)
- **difficulty**: 1–10 arası zorluk; zorluk seçicisi bu değeri filtreler
- **audio**: İlgili kelimenin ses kaydı (opsiyonel)

### 3.2. Ayet / Dua / Hadis verileri

Hepsi aynı mantıkta; örnek `ayetoku.json`:

```json
{
  "verses": [
    {
      "id": "1:1",
      "sure": 1,
      "verse": 1,
      "arabic": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "translation": "Rahman ve Rahim olan Allah'ın adıyla",
      "audio": "https://.../001001.mp3"
    }
  ]
}
```

`duaet.json` ve `hadisoku.json` da benzer; sadece alan isimleri (`category`, `ref` gibi) genişleyebilir, ama temel yapı: `id`, `arabic`, `translation`, (opsiyonel) `audio`.

### 3.3. Oyun içi ana state (JavaScript)

`game-core.js` içinde global (veya module-level) değişkenler:

- **Kullanıcı & puan**
  - `let currentUser` – local kullanıcı objesi
  - `let totalPoints` – tüm Hasene puanı (global)
  - `let sessionScore` – o anki oyun oturumunun puanı
  - `let starPoints` – yıldız sayısı (`Math.floor(totalPoints / 250)`)
  - `let badges` – yıldız/bronze/silver/gold/diamond sayıları
  - `let currentLevel` – seviye (LEVELS.THRESHOLDS ile hesaplanır)

- **Oyun durumu**
  - `let currentGameMode` – `'kelime-cevir' | 'dinle-bul' | 'bosluk-doldur' | 'ayet-oku' | 'dua-et' | 'hadis-oku' | 'elif-ba'`
  - `let currentDifficulty` – `'easy' | 'medium' | 'hard'`
  - `let questionIndex` – 0–9 arası, 10 soruluk ders
  - `let correctCount`, `let wrongCount`
  - `let comboCount` – art arda doğru sayısı

- **Görev / vird / streak**
  - `let dailyTasks` – günlük görev objesi (aşağıda)
  - `let streakData` – streak yapısı
  - `let dailyGoalHasene`, `let dailyGoalLevel`

### 3.4. Günlük görev state – `DAILY_TASKS_TEMPLATE`

`constants.js` içinde şablonlar, `game-core.js` içinde state:

```js
const DAILY_TASKS_TEMPLATE = [
  {
    id: 'daily_3_modes',
    name: '3 Oyun Modu',
    description: '🎮 3 farklı oyun modu oyna',
    target: 3,
    type: 'game_modes',
    reward: 0
  },
  {
    id: 'daily_ayet_oku',
    name: 'Ayet Oku',
    description: '📖 Ayet okuması yap',
    target: 5,
    type: 'ayet_oku',
    reward: 0
  },
  // ... dua_et, hadis_oku
];

const DAILY_BONUS_TASKS_TEMPLATE = [
  {
    id: 'daily_30_correct',
    name: '30 Doğru Cevap',
    target: 30,
    type: 'correct'
  },
  {
    id: 'daily_500_hasene',
    name: '500 Hasene',
    target: 500,
    type: 'hasene'
  }
];

// Runtime state
let dailyTasks = {
  lastTaskDate: 'YYYY-MM-DD',
  tasks: [...DAILY_TASKS_TEMPLATE],
  bonusTasks: [...DAILY_BONUS_TASKS_TEMPLATE],
  completedTasks: [],
  todayStats: {
    toplamDogru: 0,
    toplamPuan: 0,
    comboCount: 0,
    allGameModes: new Set(),
    ayet_oku: 0,
    dua_et: 0,
    hadis_oku: 0
  },
  rewardsClaimed: false
};
```

### 3.5. Streak (seri) state

```js
let streakData = {
  currentStreak: 0,
  bestStreak: 0,
  totalPlayDays: 0,
  lastPlayDate: '',      // 'YYYY-MM-DD'
  playDates: [],         // ['2025-12-01', ...]
  todayProgress: 0       // Günlük vird ilerlemesi
};
```

Her gün, **günlük vird hedefi** (örn. 2700 Hasene) tamamlanırsa seri artar; tamamlanmazsa bir gün boş geçince sıfırlanır.

### 3.6. Rozet ve başarımlar – `constants.js`

#### Seviyeler

```js
const LEVELS = {
  THRESHOLDS: {
    1: 0,
    2: 2500,
    3: 5000,
    4: 8500,
    5: 13000,
    10: 46000
  },
  INCREMENT_AFTER_10: 15000,
  NAMES: {
    1: 'Mübtedi',
    2: 'Müterakki',
    3: 'Mütecaviz',
    4: 'Mütebahhir',
    5: 'Mütebahhir',
    10: 'Mütebahhir'
  }
};
```

#### Başarımlar (ACHIEVEMENTS)

Tüm başarımlar **yıldız sayısına** endeksli; örnek:

```js
const ACHIEVEMENTS = [
  { id: 'first_victory', name: '🕌 İlk Kelime',
    description: '1 Yıldız kazan - "Bismillah" ile başla',
    check: (stats) => stats.stars >= 1 },
  { id: 'bismillah', name: 'بِسْمِ اللَّهِ',
    description: '2 Yıldız kazan',
    check: (stats) => stats.stars >= 2 },
  // ... 40+ adet, kolaydan zora
];
```

#### Rozetler (BADGE_DEFINITIONS)

Her rozetin **Hasene puanı eşiği** var; örnek:

```js
const BADGE_DEFINITIONS = [
  {
    id: 'badge_1',
    name: 'İlk Adım',
    image: 'rozet1.png',
    description: '250 Hasene kazan',
    check: (stats) => stats.totalPoints >= 250,
    progress: (stats) => Math.min(100, (stats.totalPoints / 250) * 100)
  },
  // ...
];
```

Ayrıca Asr-ı Saadet rozetleri (`asr_1` … `asr_41`) de bu liste içinde; her biri **tarihsel olaya** karşılık geliyor (daha fazla detay için `rozet-kullanim-tablosu.html` ve `docs/rozetler/*`).

---

## 4. Oyun Modları ve Akışlar

Tüm oyun ekranları **tek sayfa** (`index.html`) içinde, `display: none | flex` ile gösterilip gizlenir. Ana controller `game-core.js`.

### 4.1. Zorluk seçici

- **Butonlar**: `data-difficulty="easy|medium|hard"`
- `currentDifficulty` global değişkeni güncellenir.
- Zorluğa göre kelime seçiminde `difficulty` alanı filtrelenir (Kolay → 1–4, Orta → 5–7, Zor → 8–10 gibi).

### 4.2. Kelime Çevir

**Alt Modlar** (4 adet):

1. **📚 Klasik** (`subMode: 'classic'`)
   - Tüm kelimelerden seçim (sadece zorluk seviyesi filtresi uygulanır)
   - Normal akıllı kelime seçimi algoritması kullanılır
   - En yaygın oyun modu

2. **📖 30. Cüz Kelimeleri** (`subMode: 'juz30'`)
   - Sadece 30. cüz ayetlerinden kelimeler (Sure 78-114)
   - `filterJuz30()` fonksiyonu ile filtreleme
   - Kelime ID'sine göre sure numarası kontrol edilir: `sureNum >= 78 && sureNum <= 114`
   - Örnek: "Nas" (114. sure), "Felak" (113. sure) kelimeleri

3. **🔄 Yanlış Cevvapları Tekrar Et** (`subMode: 'review'`)
   - Zorlanılan kelimelerden seçim (`getStrugglingWords()`)
   - Koşul: Başarı oranı < 50% ve en az 2 deneme
   - Review modu aktif (`isReviewMode = true`) → zorlanılan kelimelere ekstra öncelik
   - Eğer yeterli zorlanılan kelime yoksa (< 10):
     - Uyarı gösterilir
     - Normal kelimelerle devam edilir
   - İlk oyun ise bilgilendirme mesajı gösterilir

4. **⭐ Favorilerden Oyna** (`subMode: 'favorites'`)
   - Sadece favori kelimelerden seçim (`getFavoriteWords()`)
   - Favori kelime ID'leri Set ile filtrelenir
   - Minimum gereksinim: En az 10 favori kelime
   - Eğer yeterli favori kelime yoksa (< 10):
     - Uyarı gösterilir
     - Oyun başlatılmaz (kullanıcı önce favori eklemelidir)

**Akış**:

1. Kullanıcı ana menüde **Kelime Çevir** kartına tıklar.
2. Alt mod seçim ekranı açılır (`#kelime-submode-selection`).
3. Kullanıcı bir alt mod seçer → `startKelimeCevirGame(subMode)` çağrılır.
4. Alt moda göre kelime havuzu filtrelenir:
   ```js
   let filteredWords = filterByDifficulty(allWords, currentDifficulty);
   
   if (subMode === 'juz30') {
       filteredWords = filterJuz30(filteredWords);
   } else if (subMode === 'review') {
       const strugglingWords = getStrugglingWords();
       filteredWords = filteredWords.filter(w => 
           strugglingWords.some(sw => sw.id === w.id)
       );
   } else if (subMode === 'favorites') {
       const favoriteIds = getFavoriteWords();
       filteredWords = filteredWords.filter(w => 
           favoriteIds.includes(w.id)
       );
   }
   ```
5. `selectIntelligentWords(filteredWords, 10, isReviewMode)` ile 10 kelime seçilir.
6. Her soru için:
   - 1 doğru cevap (seçilen kelimenin `translation`/`anlam` alanı)
   - 3 yanlış çeldirici (`allWordsData`'dan aynı zorluk seviyesinden rastgele)
   - `shuffleWithEqualDistribution()` ile şıklar karıştırılır
   - Arapça kelime + 4 Türkçe seçenek gösterilir
7. Kullanıcı cevap verir → `checkKelimeAnswer(index)`:
   - Doğruysa: +puan, combo++, `updateWordStats(wordId, true)`
   - Yanlışsa: combo sıfırlanır, `updateWordStats(wordId, false)`, review listesine eklenir
8. 10 soru bittiğinde **Oyun Sonu Modalı** açılır.
9. Session puanı `addToGlobalPoints(sessionScore, correctCount)` ile globale eklenir.
10. Görevler (`updateTaskProgress`) ve başarımlar (`checkAchievements`) tetiklenir.

### 4.3. Dinle Bul

- Aynı kelime havuzunu kullanır ama **UI’de kelime gizlenir**, sadece ses vardır.
- Akış, Kelime Çevir ile aynıdır; tek fark soru metni yerine **"Dinlediğin kelimeyi seç"** ifadesi ve ses butonu (`playAudio(word.audio)`).

### 4.4. Boşluk Doldur

- `ayetoku.json` içindeki ayetlerden seçilir.
- Bir kelime boş bırakılır (`<span class="blank">____</span>`).
- 4 seçenekten doğru kelime seçilir.
- Puan mantığı yine aynı (doğru → Hasene, combo, perfect olasılığı).

### 4.5. Ayet Oku / Dua Et / Hadis Oku

- Bunlar **okuma modu**, oyun değil:
  - Arapça metin + Türkçe meâl
  - Ses butonu (varsa)
  - Önceki / Sonraki butonları
- Puan verilmez; sadece günlük görev sayacı artabilir ("5 Ayet Oku" gibi).

### 4.6. Elif Ba

**Alt Modlar** (4 adet):

1. **🔤 Harfler** (`mode: 'harfler'`)
   - Arapça harfleri öğrenme (ا, ب, ت, ث, ...)
   - Veri kaynağı: `data/harf.json` (harfler array'i)
   - Soru formatı: Arapça harf gösterilir, 4 seçenekten doğru okunuş seçilir
   - Seçenekler: Harfin `okunus` alanı (örn: "elif", "be", "te")
   - Harfler karıştırılarak gösterilir (`shuffleArray`)

2. **📝 Kelimeler** (`mode: 'kelimeler'`)
   - Üç harfli kelimeleri öğrenme
   - Veri kaynağı: `elifBaData.kelimeler` (hardcoded array)
   - Soru formatı: Arapça kelime gösterilir (örn: "دَرَجَ"), 4 seçenekten doğru okunuş seçilir
   - Seçenekler: Kelimenin `okunus` alanı (örn: "derece", "keleme")
   - Kelimeler sıralı gösterilir (test modu)

3. **✨ Harekeler** (`mode: 'harekeler'`)
   - Harfler + harekeler (üstün, esre, ötre)
   - Soru formatı: Hareketli harf gösterilir (örn: "بَ", "بِ", "بُ"), 4 seçenekten doğru okunuş seçilir
   - Seçenekler: Hareketli harfin `okunus` alanı (örn: "ba", "bi", "bu")
   - Harekeler sıralı gösterilir: Önce tüm harflerin üstünü, sonra esresini, sonra ötresini
   - Her harf için 3 soru oluşturulur (üstün, esre, ötre)

4. **📋 Harf Tablosu** (`mode: 'harfler-grid'`)
   - Grid görünümünde tüm harfler (interaktif tablo)
   - Oyun değil, referans tablosu
   - Harfler kartlar halinde gösterilir
   - Her harfe tıklandığında ses çalınır (`playElifBaAudio`)
   - Renk kodları: İnce sesli harfler (altın), kalın sesli harfler (koyu)
   - RTL (right-to-left) sıralama: Elif sağda, Ye solda

**Veri Yapısı** (`data/harf.json`):

```json
{
  "harfler": [
    {
      "harf": "ا",
      "isim": "Elif",
      "okunus": "elif",
      "sesTipi": "ince_sesli_harf",
      "renkKodu": "#D4AF37",
      "audioUrl": "assets/audio/elif.mp3"
    },
    // ... 28 harf
  ]
}
```

**Harekeler Verisi**:

```js
const harekeler = {
    ustun: { isaret: 'َ', isim: 'Üstün', okunus: 'a', unicode: '\u064E' },
    esre: { isaret: 'ِ', isim: 'Esre', okunus: 'i', unicode: '\u0650' },
    otre: { isaret: 'ُ', isim: 'Ötre', okunus: 'u', unicode: '\u064F' }
};
```

**Akış**:

1. Kullanıcı **Elif Ba** kartına tıklar.
2. Alt mod seçim ekranı açılır (`#elif-ba-mode-selection`).
3. Kullanıcı bir alt mod seçer → `startElifBaGame(mode)` çağrılır.
4. Moda göre:
   - **Harfler/Kelimeler/Harekeler**: Normal oyun ekranı (`#elif-ba-normal-game`)
   - **Harf Tablosu**: Grid görünümü (`#elif-ba-harfler-grid`)
5. Sorular hazırlanır ve gösterilir.
6. Her soru için:
   - Arapça harf/kelime/hareketli harf gösterilir
   - 4 seçenekten doğru okunuş seçilir
   - Ses butonu ile dinlenebilir (TTS veya audio dosyası)
7. Cevap kontrolü → `checkElifBaAnswer(selectedBtn, isCorrect)`
8. 10 soru bittiğinde **Oyun Sonu Modalı** açılır.

---

## 5. Puan, Combo, Perfect ve Yıldız Sistemi

### 5.1. Temel puanlama

Güncel mantık `HASENE_OYUN_TAM_DOKUMANTASYON.md` içinde hem eski hem yeni halleriyle detaylı; özet mimari:

- **Doğru cevap**: Temel Hasene (kelime zorluğuna göre 5–21 arası) + **her doğru için** combo bonusu (+2) 
- **Yanlış cevap**: Puan kaybı yok (en son revizyonda cezalar kaldırıldı)

Örnek sadeleştirilmiş hesap:

```js
function onCorrectAnswer(basePoints) {
  comboCount += 1;
  const comboBonus = 2;          // her doğru için sabit
  const gained = basePoints + comboBonus;

  sessionScore += gained;
  totalPoints += gained;

  addSessionPoints(gained);      // points-manager.js
  addDailyXP(gained);            // game-core.js tarafında
}
```

### 5.2. Perfect ders

Koşullar:
- Oyun bittiğinde (10 soru)
- `wrongCount === 0`
- `correctCount >= 3`

Bonus:

- Yeni sistemde **sabit 50 Hasene** (ders sayısına endeksli) veya belirli sürümlerde `sessionScore * 0.5` idi.
- README’yi uygularken **sabit 50** mantığını tercih edebilirsiniz (daha tutarlı):

```js
if (wrongCount === 0 && correctCount >= 3) {
  const perfectBonus = 50;
  sessionScore += perfectBonus;
  totalPoints += perfectBonus;
}
```

### 5.3. Yıldız hesabı

- **250 Hasene = 1 Yıldız**
- Yaklaşık 2–3 oyun = 1 yıldız

```js
const stars = Math.floor(totalPoints / 250);
```

### 5.4. Seviye (mertebe) hesabı

`points-manager.js`:

```js
function calculateLevel(points) {
  if (!LEVELS || !LEVELS.THRESHOLDS) return 1;

  let level = 1;
  for (let i = 1; i <= 20; i++) {
    if (points >= LEVELS.THRESHOLDS[i]) level = i;
    else break;
  }

  if (points >= LEVELS.THRESHOLDS[10]) {
    const extra = points - LEVELS.THRESHOLDS[10];
    const extraLevels = Math.floor(extra / LEVELS.INCREMENT_AFTER_10);
    level = 10 + extraLevels;
  }

  return level;
}
```

Seviye adı:

```js
function getLevelName(level) {
  if (!LEVELS.NAMES) return 'Mübtedi';
  if (level <= 5) return LEVELS.NAMES[level] || 'Mübtedi';
  if (level <= 10) return LEVELS.NAMES[level] || 'Müteallim';
  return 'Usta';
}
```

---

## 6. Günlük Vird, Görevler ve Streak

### 6.1. Günlük vird

- Kullanıcı, ana karttaki ⚙️ butonundan günlük hedef seçer:
  - 😊 Rahat – 1,300 Hasene
  - ⚖️ Normal – 2,700 Hasene (varsayılan)
  - 🔥 Zor – 5,400 Hasene
  - 💪 Ciddi – 6,000 Hasene
  - Özel: 100–10,000 arası elle girilebilir
- Gün içindeki **kazanılan tüm Hasene** bu hedefe doğru sayılır.
- Hedef tamamlanınca:
  - `dailyGoalCompleted = true`
  - +100 Hasene bonus verilir
  - Streak güncellemesi yapılır.

### 6.2. Günlük görevler

Görevler, her gün için `DAILY_TASKS_TEMPLATE`’ten üretilir ve `dailyTasks` state’ine yazılır. İlerleme:

- Her doğru cevap sonrası: `updateTaskProgress('correct', 1)`
- Her Hasene sonrası: `updateTaskProgress('hasene', gainedPoints)`
- Ayet okunduğunda: `updateTaskProgress('ayet_oku', 1)` vs.

Gün sonunda tüm görevler tamamlanmışsa **Günlük Ödül Kutusu** aktif olur:

- `claimDailyRewards()` çağrılır.
- Rastgele **100 / 250 / 500 Hasene** verir.
- Ayrıca bir İslami öğreti (zikir / dua / kısa hadis) gösterir.

### 6.3. Streak (seri) mantığı

- Her gün, günlük vird hedefi veya minimum aktivite eşiği sağlandığında **streak +1**.
- Arada boş gün varsa streak 0’a düşer.
- `bestStreak` her artış sonrası güncellenir.
- Takvim modalında bu bilgiler renkli hücrelerle gösterilir.

---

## 7. Rozetler ve Başarımlar

### 7.1. Rozet tipleri

- **Yıldız / Bronz / Gümüş / Altın / Elmas** – saf Hasene temelli uzun vadeli rozetler.
- **Asr-ı Saadet rozetleri (41 adet)** – tarihsel hat boyunca ilerleme, Hasene eşiklerine bağlı.
- Tüm rozetler `BADGE_DEFINITIONS` dizisinde tanımlı.

Kazanınca:

- `checkBadges(stats)` → `BADGE_DEFINITIONS` boyunca `check(stats)` fonksiyonlarını çalıştırır.
- Yeni kazanılan rozet için görsel animasyon ve detay modalı açılabilir (`badge-visualization.js`).

### 7.2. Başarımlar (achievements)

- **Tamamı yıldız sayısına göre**; bu sayede tek parametre ile tüm progression kontrol edilebilir.
- Kategoriler:
  - İlk Adımlar (1–6 yıldız)
  - Başlangıç
  - İlerleme
  - Ustalık
  - Master
  - Efsane (ör. `hafiz`: 10.000 yıldız ≈ 2.5M Hasene)

Algoritma:

```js
function checkAchievements(stats) {
  const newlyUnlocked = [];
  for (const ach of ACHIEVEMENTS) {
    if (!unlockedAchievements.includes(ach.id) && ach.check(stats)) {
      unlockedAchievements.push(ach.id);
      newlyUnlocked.push(ach);
    }
  }
  if (newlyUnlocked.length) showAchievementModal(newlyUnlocked[0]);
}
```

---

## 8. Depolama: localStorage ve IndexedDB

### 8.1. localStorage key’leri

Sistemi yeniden yazarken en kritik parçalardan biri **isimlerin tutarlılığıdır**. Kullanılan başlıca key’ler:

- `hasene_totalPoints` – toplam Hasene
- `hasene_badges` – rozet durumu (JSON)
- `hasene_streakData` – streak bilgisi (JSON)
- `hasene_dailyTasks` – günlük görev state’i (JSON)
- `hasene_wordStats` – kelime istatistikleri (JSON)
- `hasene_favorites` – favori kelimeler (JSON)
- `unlockedAchievements` – başarımlar listesi (JSON array)
- `dailyXP`, `dailyCorrect`, `dailyWrong`
- `hasene_onboarding_seen_v2` – onboarding bir kez gösterilsin diye flag

Yeniden yazarken bu isimleri aynen korursanız, eski verilerle de uyumlu çalışabilirsiniz.

### 8.2. IndexedDB (opsiyonel)

- DB adı: `HaseneGameDB`
- Store adı: `gameData`
- Aynı key’ler burada da tutulur; mantık: **IndexedDB ana, localStorage yedek**.

Akış:

1. Uygulama açılır → `loadStats()` çağrılır.
2. Önce IndexedDB’den okunur; yoksa localStorage’dan; o da yoksa default.
3. Puan/artış oldukça `debouncedSaveStats()` tetiklenir → hem IndexedDB hem localStorage güncellenir.

---

## 9. UI, Modallar ve Akış Diyagramı

### 9.1. index.html yapısı (özet)

- `#loadingScreen` – iOS tarzı liquid glass loading
- `#main-container`
  - Combined stats card (toplam Hasene, yıldız, mertebe, streak, günlük vird barı)
  - Zorluk seçici (`.difficulty-selector`)
  - Oyun mod kartları (`.game-card[data-game]`)
- Alt navigation (`.bottom-nav`)
  - `data-page="main-menu|stats|badges|calendar|tasks"`
- Her oyun/okuma modu için ayrı `div`:
  - `#kelime-cevir-screen`
  - `#dinle-bul-screen`
  - `#bosluk-doldur-screen`
  - `#ayet-oku-screen`
  - `#dua-et-screen`
  - `#hadis-oku-screen`
  - `#elif-ba-screen`
- Modallar:
  - `#auth-modal`, `#onboarding-modal`
  - `#badges-modal`, `#badge-detail-modal`
  - `#calendar-modal`, `#tasks-modal`
  - `#detailed-stats-modal`, `#data-status-modal`
  - `#game-result-modal`, `#level-up-modal`, `#achievement-modal`, `#daily-reward-modal`

**Kısaca**: Tek bir HTML dosyası, onlarca modal ve section; JS sadece göster/gizle ve içeriği dolduruyor.

### 9.2. Yükleme ve init akışı

Pseudo-akış:

```js
window.addEventListener('load', async () => {
  await initIndexedDB();        // opsiyonel
  await loadStats();            // puan, rozet, streak, görev, kelime stats
  await loadJsonData();         // kelimebul / ayetoku / duaet / hadisoku
  initUIEventListeners();       // buton tıklamaları, nav, modallar
  showLoadingScreen(false);
  maybeShowOnboarding();
});
```

---

## 10. Sıfırdan Yeniden Yazmak İçin Yol Haritası

Bu projeyi **başka bir yerde, sıfırdan** ama aynı davranışla kurmak istiyorsanız adımlar:

1. **Temel iskeleti kurun**
   - `index.html`, `style.css`, `manifest.json`, `sw.js`
   - `js/` ve `data/` klasörlerini oluşturun.
2. **Veri şemalarını uygulayın**
   - `kelimebul.json`, `ayetoku.json`, `duaet.json`, `hadisoku.json` formatlarını bu README’deki şemaya göre doldurun.
3. **Ana state ve depolamayı kurun**
   - `totalPoints`, `sessionScore`, `streakData`, `dailyTasks`, `wordStats` gibi objeleri `game-core.js` içinde tanımlayın.
   - `loadStats()`, `saveStats()` ve `debouncedSaveStats()` fonksiyonlarını yazın.
4. **Oyun modlarını sırayla inşa edin**
   - Önce sadece **Kelime Çevir**: 10 soruluk ders, doğru/yanlış, puan, combo ve perfect bonus.
   - Ardından Dinle Bul ve Boşluk Doldur; ikisi Kelime Çevir’in varyasyonlarıdır.
   - Sonra okuma modları (Ayet/Dua/Hadis) – sadece veri gösterimi.
5. **Puan ve rozet sistemini ekleyin**
   - `points-manager.js` ile `calculateLevel`, `calculateBadges` fonksiyonlarını uygulayın.
   - `constants.js` içindeki `LEVELS`, `BADGE_DEFINITIONS` ve `ACHIEVEMENTS`’i temel alarak kendi listenizi kurun (ister birebir kopya, ister sadeleştirilmiş sürüm).
6. **Görevler, vird ve streak**
   - Günlük görevleri `DAILY_TASKS_TEMPLATE`’ten üretin.
   - Her doğru/puan/okuma sonrası `updateTaskProgress` çalışsın.
   - Gün sonunda ödül kutusu ve streak güncellemeleri devreye girsin.
7. **UI/UX detayları ve PWA**
   - Bottom nav, combined stats card, modallar, glassmorphism gibi detayları adım adım ekleyin.
   - `manifest.json` ve `sw.js` ile offline + ana ekrana ekleme özelliğini etkinleştirin.

Bu README ve `HASENE_OYUN_TAM_DOKUMANTASYON.md` birlikte kullanıldığında, oyunun **tüm sistemleri (veri, mantık, UI, puan, görev, rozet, streak, PWA)** şeffaf biçimde tanımlanmıştır. Aynı kuralları takip eden bir geliştirici, oyunu baştan sona tekrar inşa edebilir.

---

## 11. Proje Dili ve Teknoloji Stack

### 11.1. JavaScript Versiyonu ve Özellikler

- **ES6+ (ES2015+)**: Modern JavaScript özellikleri kullanılıyor
- **Async/Await**: Tüm asenkron işlemler `async/await` ile yapılıyor (Promise chain yerine)
- **Arrow Functions**: `() => {}` yaygın kullanım
- **Template Literals**: `` `${variable}` `` string interpolation
- **Destructuring**: `const { a, b } = obj`
- **Spread Operator**: `[...array]`, `{...obj}`
- **Modules**: ES6 module syntax yok, ama `window` global export pattern kullanılıyor
- **Optional Chaining**: `obj?.prop` (modern tarayıcılar için)
- **Nullish Coalescing**: `value ?? defaultValue`

**Örnek kod stili**:
```js
// Async/await pattern
async function loadData() {
    try {
        const response = await fetch('./data/kelimebul.json');
        const data = await response.json();
        return data.words;
    } catch (error) {
        console.error('Veri yükleme hatası:', error);
        return [];
    }
}

// Arrow functions ve destructuring
const processWord = (word) => {
    const { id, arabic, translation, difficulty } = word;
    return { id, arabic, translation, difficulty: difficulty ?? 10 };
};
```

### 11.2. Tarayıcı Desteği

- **Minimum**: ES6 destekleyen modern tarayıcılar (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- **PWA**: Service Worker ve Manifest API desteği gerekli
- **IndexedDB**: Modern tarayıcılarda mevcut (fallback: localStorage)
- **CSS Grid/Flexbox**: Responsive layout için gerekli
- **Backdrop Filter**: Glassmorphism efekti için (iOS Safari 9+, Chrome 76+)

---

## 12. CSS Stil Sistemi ve Tasarım Detayları

### 12.1. Renk Paleti (CSS Variables)

```css
:root {
    /* Primary Colors */
    --bg-primary: linear-gradient(135deg, #a8b5ff 0%, #b8a5e8 100%);
    --bg-secondary: #fff;
    --text-primary: #1a1a2e;
    --text-secondary: #64748b;

    /* Accent Colors */
    --accent-primary: #9d8aff;
    --accent-secondary: #b8a5e8;
    --accent-success: #10b981;
    --accent-warning: #f59e0b;
    --accent-error: #ef4444;
    --accent-gold: #fbbf24;

    /* iOS 16 Liquid Glass (Glassmorphism) */
    --glass-bg: rgba(255, 255, 255, 0.7);
    --glass-bg-dark: rgba(255, 255, 255, 0.85);
    --glass-border: rgba(255, 255, 255, 0.18);
    --glass-blur: blur(20px);
    --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}
```

### 12.2. Tipografi

**Ana Fontlar**:
- **Sistem Font**: `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif`
- **Arapça Font**: `'KFGQPC Uthmanic Script HAFS'` (local font file: `assets/fonts/KFGQPC Uthmanic Script HAFS Regular.otf`)
- **Google Fonts**: `'Nunito'` (weights: 400, 600, 700, 800), `'Reem Kufi'` (weights: 400, 600, 700)

**Font Boyutları**:
- Mobil: `14px` base (≤480px), `13px` (≤360px)
- Desktop: `16px` base
- Responsive: `clamp()` fonksiyonu ile dinamik boyutlandırma

### 12.3. Spacing Sistemi

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
```

### 12.4. Border Radius (iOS 16 Style)

```css
--radius-sm: 12px;
--radius-md: 16px;
--radius-lg: 24px;
--radius-xl: 30px;
```

### 12.5. Transitions ve Animasyonlar

```css
--transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
--transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
--transition-bounce: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

**Animasyonlar**:
- `fadeIn`: Modal açılışları
- `slideDown` / `slideUp`: Alert mesajları
- `float`: Loading screen logo
- `scale` + `rotate`: Rozet kazanma animasyonu

### 12.6. Responsive Breakpoints

```css
/* Mobil */
@media (max-width: 600px) { ... }

/* Küçük Mobil */
@media (max-width: 360px) { ... }

/* Tablet */
@media (min-width: 601px) and (max-width: 900px) { ... }

/* Desktop */
@media (min-width: 901px) { ... }

/* Yatay Mod (Landscape) */
@media (max-height: 500px) and (orientation: landscape) { ... }
```

**Responsive Özellikler**:
- Oyun kartları: Mobil 2 sütun, Tablet/Desktop 3 sütun
- Font boyutları: `clamp()` ile dinamik
- Modal genişlikleri: Mobil `calc(100% - 20px)`, Desktop `600px`
- Bottom nav: Mobil `90px` yükseklik, safe area desteği

---

## 13. Tüm Fonksiyonlar ve API'ler (Detaylı Liste)

### 13.1. Oyun Fonksiyonları (`game-core.js`)

#### Kelime Çevir Modu
```js
function startKelimeGame(subMode)          // Oyunu başlatır
function loadKelimeQuestion()              // Yeni soru yükler
function checkKelimeAnswer(selectedIndex)  // Cevap kontrol eder
function handleHint()                      // İpucu kullanır
function selectIntelligentWord(filteredData) // Akıllı kelime seçimi
```

#### Dinle Bul Modu
```js
function startDinleGame()                  // Oyunu başlatır
function loadDinleQuestion()               // Yeni soru yükler
function checkDinleAnswer(selectedIndex)   // Cevap kontrol eder
function playAudio(audioUrl)               // Ses çalar
```

#### Boşluk Doldur Modu
```js
function startBoslukGame()                 // Oyunu başlatır
function loadBoslukQuestion()              // Yeni soru yükler
function checkBoslukAnswer(selectedIndex) // Cevap kontrol eder
```

#### Okuma Modları (Ayet/Dua/Hadis)
```js
function loadAyet(index)                   // Ayet yükler
function loadDua(index)                     // Dua yükler
function loadHadis(index)                  // Hadis yükler
function nextVerse()                        // Sonraki ayet/dua/hadis
function prevVerse()                        // Önceki ayet/dua/hadis
```

### 13.2. Puan ve Seviye Fonksiyonları (`points-manager.js`)

```js
function addSessionPoints(points)          // Session puanı ekler
function calculateLevel(points)            // Seviye hesaplar (1-∞)
function getLevelName(level)               // Seviye adı döndürür
function calculateBadges(points)           // Rozet sayılarını hesaplar
```

### 13.3. Veri Yönetimi (`game-core.js`)

```js
async function loadStats()                 // Tüm istatistikleri yükler
async function saveStats()                 // Tüm istatistikleri kaydeder
function debouncedSaveStats()              // Debounced kaydetme (500ms)
async function saveStatsImmediate()       // Anında kaydetme
async function resetAllStats()             // Tüm verileri sıfırlar
```

### 13.4. Görev Sistemi (`game-core.js`)

```js
async function checkDailyTasks()           // Günlük görevleri kontrol eder
async function checkWeeklyTasks()          // Haftalık görevleri kontrol eder
function generateDailyTasks(date)          // Günlük görevler oluşturur
function updateTaskProgress(gameType, data) // Görev ilerlemesi günceller
async function claimDailyRewards()         // Günlük ödülü alır
function updateTasksDisplay()              // Görev UI'ını günceller
```

### 13.5. Streak Sistemi (`game-core.js`)

```js
function updateDailyProgress(correctAnswers) // Günlük ilerleme günceller
function calculateCurrentStreakDates()      // Mevcut seri tarihlerini hesaplar
function getWeekStartDate(date)             // Hafta başlangıcı (Pazartesi)
function getWeekEndDate(date)               // Hafta sonu (Pazar)
```

### 13.6. Başarım ve Rozet (`game-core.js`)

```js
function checkAchievements(stats)           // Başarımları kontrol eder
function checkBadges(stats)                 // Rozetleri kontrol eder
function showAchievementModal(achievement) // Başarım modalı gösterir
function showBadgeDetailModal(badgeId)     // Rozet detay modalı gösterir
```

### 13.7. Kelime İstatistikleri (`word-stats-manager.js`)

```js
function updateWordStats(wordId, isCorrect) // Kelime istatistiği günceller
function getStrugglingWords()              // Zorlanılan kelimeleri alır
function getWordMasteryLevel(wordId)        // Kelime ustalık seviyesi
function addToReviewList(wordId)            // Review listesine ekler
```

### 13.8. Favoriler (`favorites-manager.js`)

```js
function toggleFavorite(wordId)            // Favori ekle/çıkar
function isFavorite(wordId)                // Favori mi kontrol eder
function getFavorites()                     // Tüm favorileri alır
```

### 13.9. Yardımcı Fonksiyonlar (`utils.js`)

```js
function getLocalDateString(date)          // YYYY-MM-DD formatında tarih
function formatNumber(num)                 // Binlik ayırıcı ile formatlar
function closeModal(modalId)               // Modal kapatır
function openModal(modalId)                // Modal açar
function goToMainMenu(saveProgress)        // Ana menüye döner
function shuffleArray(array)               // Array karıştırır
function getRandomItem(array)              // Rastgele eleman seçer
function filterByDifficulty(words, difficulty) // Zorluk seviyesine göre filtreler
function debounce(func, wait)             // Debounce fonksiyonu
function throttle(func, limit)             // Throttle fonksiyonu
```

### 13.10. Modal Fonksiyonları (`game-core.js`)

```js
function showStatsModal()                  // İstatistikler modalı
function showBadgesModal()                 // Rozetler modalı
function showCalendarModal()                // Takvim modalı
function showDailyTasksModal()             // Görevler modalı
function showDailyGoalSettings()           // Günlük vird ayarları
function showDetailedStats()               // Detaylı istatistikler
function showGameInfoModal(gameMode)       // Oyun bilgilendirme modalı
```

### 13.11. Backend API Fonksiyonları (`api-service.js`)

```js
async function getCurrentUser()            // Mevcut kullanıcıyı alır
async function loadUserStats()             // Kullanıcı istatistiklerini yükler
async function saveUserStats(stats)        // Kullanıcı istatistiklerini kaydeder
async function loadDailyTasks()            // Günlük görevleri yükler
async function saveDailyTasks(tasks)       // Günlük görevleri kaydeder
async function firestoreGet(collection, docId)  // Firestore'dan okur
async function firestoreSet(collection, docId, data) // Firestore'a yazar
function getBackendType()                  // Backend tipini döndürür ('firebase' | 'local')
```

---

## 14. Detaylı Puanlama Sistemleri ve Formüller

### 14.1. Temel Puanlama Formülü

**Her doğru cevap için**:
```js
// Kelime Çevir ve Dinle Bul
const basePoints = word.difficulty;  // 5-21 arası (kelime zorluğuna göre)
const comboBonus = 2;                // Her doğru için sabit +2
const totalGained = basePoints + comboBonus;

// Boşluk Doldur
const verseLength = verse.arabic.split(' ').length;
let basePoints;
if (verseLength <= 6) basePoints = 10;
else if (verseLength <= 12) basePoints = 15;
else basePoints = 20;
const comboBonus = 2;
const totalGained = basePoints + comboBonus;
```

**Yanlış cevap**: `0 Hasene` (puan kaybı yok)

### 14.2. Combo Bonusu (Detaylı Sistem)

**Combo Mekanizması**:
- Her doğru cevap için `comboCount` artar
- Yanlış cevap verildiğinde `comboCount = 0` (sıfırlanır)
- Oyun bitişinde `maxCombo` güncellenir (en yüksek combo değeri)

**Combo Bonus Hesaplama**:
```js
// Her doğru cevap için combo sayacı artar
comboCount += 1;
maxCombo = Math.max(maxCombo, comboCount);

// Her doğru cevap için +2 Hasene combo bonusu (sabit)
const comboBonus = CONFIG.COMBO_BONUS_PER_CORRECT; // 2 Hasene
const totalGained = basePoints + comboBonus;
```

**Önemli Notlar**:
- Combo bonusu **her doğru cevap için** verilir (doğru sayısına endeksli)
- Combo bonusu **sabit 2 Hasene**'dir (combo sayısına göre artmaz)
- Yanlış cevap verildiğinde combo sıfırlanır ama **puan kaybı yok**
- Maksimum combo sadece istatistik amaçlıdır (başarım/rozet için kullanılabilir)

**Örnek Hesaplama**:
- 10 soru, hepsi doğru, basePoints=10 → 10 × (10 + 2) = 120 Hasene
- 10 soru, 8 doğru 2 yanlış, basePoints=10 → 8 × (10 + 2) = 96 Hasene (combo 2 kez sıfırlandı)

### 14.3. Perfect Lesson Bonusu

**Koşullar**:
- Oyun tamamlandı (10 soru bitti)
- `wrongCount === 0`
- `correctCount >= 3`

**Bonus**:
```js
const perfectBonus = 50;  // Sabit 50 Hasene (ders sayısına endeksli)
```

**Örnek**: 10 soru, hepsi doğru, basePoints=10 → (10 × 12) + 50 = 170 Hasene

### 14.4. Günlük Vird Bonusu

**Koşul**: Günlük hedef tamamlandığında (örn. 2700 Hasene)

**Bonus**:
```js
const dailyGoalBonus = 100;  // Sabit +100 Hasene
```

### 14.5. Günlük Görev Ödülü (Detaylı)

**Koşul**: Tüm günlük görevler (4 ana + 2 bonus) tamamlandığında

**Ödül Mekanizması**:
```js
// Her İslami öğreti için farklı ödül miktarları
const islamicTeachings = [
    {
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        turkish: 'Rahman ve Rahim olan Allah\'ın adıyla',
        explanation: 'Her işe Allah\'ın adıyla başlamak sünnettir.',
        rewardAmounts: [100, 250, 500]  // Rastgele seçilir
    },
    // ... 20+ farklı öğreti
];

// Rastgele bir öğreti ve ödül seçilir
const randomTeaching = islamicTeachings[Math.floor(Math.random() * islamicTeachings.length)];
const rewardPoints = randomTeaching.rewardAmounts[Math.floor(Math.random() * randomTeaching.rewardAmounts.length)];
```

**Ödül Miktarları**: 100, 250 veya 500 Hasene (rastgele)

**Ek Özellikler**:
- Ödül alındığında bir İslami öğreti (zikir/dua/hadis) gösterilir
- Öğreti Arapça metin, Türkçe meâl ve açıklama içerir
- Ödül sadece günde 1 kez alınabilir (`rewardsClaimed` flag'i ile kontrol edilir)

**İslami Öğretiler Listesi** (15 adet):
1. لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ - "Güç ve kuvvet ancak Allah iledir"
2. أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ - "Şehadet ederim ki Allah'tan başka ilah yoktur"
3. سُبْحَانَ اللَّهِ - "Allah noksan sıfatlardan münezzehtir"
4. الْحَمْدُ لِلَّهِ - "Hamd Allah'a mahsustur"
5. اللهُ أَكْبَرُ - "Allah en büyüktür"
6. لَا إِلَٰهَ إِلَّا اللَّهُ - "Allah'tan başka ilah yoktur"
7. حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ - "Allah bize yeter, O ne güzel vekildir"
8. إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ - "Biz Allah'a aidiz ve O'na döneceğiz"
9. مَا شَاءَ اللَّهُ - "Allah dilediğini yapar"
10. بَارَكَ اللَّهُ - "Allah bereket versin"
11. سُبْحَانَ اللَّهِ وَبِحَمْدِهِ - "Allah noksan sıfatlardan münezzehtir, hamd O'na mahsustur"
12. لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ - "Senden başka ilah yoktur, sen münezzehsin, ben zalimlerden oldum"
13. رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ - "Rabbimiz, bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru"
14. اللَّهُمَّ بَارِكْ لِي فِيهَا - "Allah'ım, bunda benim için bereket ver"
15. رَبِّ زِدْنِي عِلْمًا - "Rabbim, benim ilmimi artır"

Her öğreti için ödül miktarları: `[100, 250, 500]` (rastgele seçilir)

### 14.6. Yıldız Hesaplama

```js
const stars = Math.floor(totalPoints / 250);
// Örnek: 1250 Hasene = 5 Yıldız
```

### 14.7. Rozet Dönüşümü

```js
const badges = {
    stars: Math.floor(totalPoints / 250),
    bronze: Math.floor(stars / 5),      // 5 Yıldız = 1 Bronz
    silver: Math.floor(bronze / 5),     // 5 Bronz = 1 Gümüş
    gold: Math.floor(silver / 5),       // 5 Gümüş = 1 Altın
    diamond: Math.floor(gold / 5)       // 5 Altın = 1 Elmas
};
```

**Örnek**: 31,250 Hasene = 125 Yıldız = 25 Bronz = 5 Gümüş = 1 Altın

---

## 15. Backend Mimarisi (Firebase + LocalStorage Fallback)

### 15.1. Backend Tipi

Proje **hibrit** bir sistem kullanıyor:
- **Firebase** (opsiyonel): Kullanıcı Firebase'e giriş yaparsa veriler Firestore'da saklanır
- **LocalStorage** (varsayılan): Firebase yoksa veya kullanıcı local ise tüm veriler localStorage'da

**Backend tipi kontrolü**:
```js
function getBackendType() {
    return window.BACKEND_TYPE || 'firebase';
}
```

### 15.2. Firebase Yapılandırması

**Firebase Collections**:
- `user_stats`: Kullanıcı istatistikleri
  - `total_points`, `badges`, `streak_data`, `game_stats`, `perfect_lessons_count`
- `daily_tasks`: Günlük görevler
  - `last_task_date`, `tasks`, `bonus_tasks`, `completed_tasks`, `today_stats`
- `word_stats`: Kelime istatistikleri (opsiyonel, şu an localStorage'da)

**Firestore Rules** (`firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Kullanıcı sadece kendi verilerine erişebilir
    match /user_stats/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /daily_tasks/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 15.3. API Servis Fonksiyonları

**Veri Senkronizasyonu**:
1. **Öncelik**: IndexedDB → localStorage → Firebase (yükleme)
2. **Kaydetme**: Hem localStorage hem Firebase'e kaydedilir (paralel)
3. **Fallback**: Firebase hata verirse localStorage kullanılır

**Örnek akış**:
```js
async function loadUserStats() {
    // 1. IndexedDB'den yükle
    const cached = await loadFromIndexedDB('hasene_totalPoints');
    if (cached) return { total_points: parseInt(cached) };
    
    // 2. localStorage'dan yükle
    const local = localStorage.getItem('hasene_totalPoints');
    if (local) return { total_points: parseInt(local) };
    
    // 3. Firebase'den yükle (kullanıcı varsa)
    const user = await getCurrentUser();
    if (user && !user.id.startsWith('local-')) {
        const firebase = await firestoreGet('user_stats', user.id);
        if (firebase) return firebase;
    }
    
    // 4. Varsayılan değer
    return { total_points: 0 };
}
```

### 15.4. Kullanıcı Kimlik Doğrulama (`auth.js`)

**Local Kullanıcı**:
- Kullanıcı adı ile direkt giriş yapılır
- `localStorage`'da `hasene_user_id`, `hasene_username`, `hasene_user_email` saklanır
- User ID formatı: `local-${timestamp}`

**Firebase Anonymous Auth** (opsiyonel):
- Firebase Anonymous Authentication ile otomatik giriş
- User ID: Firebase UID
- Veriler Firestore'da saklanır

---

## 16. Frontend Mimari ve Modüler Yapı

### 16.1. Modül Yapısı

Proje **modüler** ama **ES6 modules** kullanmıyor; bunun yerine **global window export pattern** kullanılıyor:

```js
// Her modül dosyasının sonunda
if (typeof window !== 'undefined') {
    window.functionName = functionName;
    window.CONSTANT = CONSTANT;
}
```

**Modül Bağımlılıkları**:
```
index.html
├── js/config.js (ilk yüklenir)
├── js/constants.js
├── js/utils.js
├── js/indexeddb-cache.js
├── js/data-loader.js
├── js/error-handler.js
├── js/firebase-config.js (Firebase varsa)
├── js/firebase-init.js (Firebase varsa, ES6 module)
├── js/api-service.js
├── js/auth.js
├── js/audio-manager.js
├── js/points-manager.js
├── js/word-stats-manager.js
├── js/favorites-manager.js
├── js/badge-visualization.js
├── js/game-core.js (ana mantık, en son yüklenir)
├── js/detailed-stats.js
├── js/notifications.js
├── js/onboarding.js
└── js/leaderboard.js
```

### 16.2. Event Handling

**Event Listener Pattern**:
```js
// Oyun kartları
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
        const gameMode = card.dataset.game;
        startGame(gameMode);
    });
});

// Zorluk seçici
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentDifficulty = btn.dataset.difficulty;
        updateDifficultyUI();
    });
});

// Bottom navigation
document.querySelectorAll('.bottom-nav .nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        if (page) showPage(page);
        else if (btn.onclick) btn.onclick();
    });
});
```

### 16.3. State Management

**Global State Pattern** (React/Redux yok, vanilla JS):
- Tüm state `game-core.js` içinde global değişkenler olarak tutulur
- State güncellemeleri direkt değişken atamalarıyla yapılır
- UI güncellemeleri state değişikliklerinden sonra manuel çağrılır

**Örnek**:
```js
// State güncelleme
totalPoints += gainedPoints;
comboCount += 1;

// UI güncelleme
updateStatsBar();
updateDailyGoalDisplay();
```

---

## 17. İstatistik Tipleri ve Veri Yapıları

### 17.1. Oyun İstatistikleri (`gameStats`)

```js
let gameStats = {
    totalCorrect: 0,        // Toplam doğru cevap
    totalWrong: 0,          // Toplam yanlış cevap
    gameModeCounts: {       // Her oyun modu için oynama sayısı
        'kelime-cevir': 0,
        'dinle-bul': 0,
        'bosluk-doldur': 0,
        'ayet-oku': 0,
        'dua-et': 0,
        'hadis-oku': 0,
        'elif-ba': 0
    }
};
```

### 17.2. Kelime İstatistikleri (`wordStats`)

```js
let wordStats = {
    'word_1': {
        attempts: 10,           // Toplam deneme sayısı
        correct: 7,             // Doğru cevap sayısı
        wrong: 3,               // Yanlış cevap sayısı
        successRate: 70,        // Başarı oranı (%)
        masteryLevel: 5,        // Ustalık seviyesi (0-10)
        lastCorrect: '2025-12-19', // Son doğru cevap tarihi
        lastWrong: '2025-12-18',   // Son yanlış cevap tarihi
        easeFactor: 2.5,        // Spaced repetition faktörü
        nextReview: '2025-12-20' // Sonraki review tarihi
    }
};
```

### 17.3. Günlük İstatistikler (`hasene_daily_YYYY-MM-DD`)

```js
const dailyStats = {
    date: '2025-12-19',
    points: 1250,              // Günlük Hasene
    correct: 25,               // Günlük doğru cevap
    wrong: 5,                  // Günlük yanlış cevap
    combo: 15,                 // Maksimum combo
    perfectLessons: 1,         // Mükemmel ders sayısı
    gamesPlayed: 3,            // Oynanan oyun sayısı
    timeSpent: 1800            // Saniye cinsinden süre
};
```

### 17.4. Detaylı İstatistikler (`detailed-stats.js`)

**Günlük Trend** (son 7 gün):
```js
const dailyTrend = [
    { date: '2025-12-13', points: 800, correct: 15, wrong: 3 },
    { date: '2025-12-14', points: 1200, correct: 22, wrong: 4 },
    // ...
];
```

**Haftalık Trend** (son 4 hafta):
```js
const weeklyTrend = [
    { week: '2025-12-01', points: 8500, correct: 150, wrong: 25 },
    // ...
];
```

**Aylık Trend** (son 3 ay):
```js
const monthlyTrend = [
    { month: '2025-10', points: 35000, correct: 600, wrong: 100 },
    // ...
];
```

---

## 18. Linter ve Formatting Ayarları

### 18.1. Proje Linter Yapılandırması

Proje şu an **linter yapılandırması içermiyor** (package.json yok), ama önerilen ayarlar:

**ESLint Önerisi** (`.eslintrc.json`):
```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "script"
  },
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off",
    "no-var": "error",
    "prefer-const": "error",
    "prefer-arrow-callback": "warn"
  },
  "globals": {
    "window": "readonly",
    "document": "readonly",
    "localStorage": "readonly",
    "IndexedDB": "readonly"
  }
}
```

**Prettier Önerisi** (`.prettierrc.json`):
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 4,
  "trailingComma": "none",
  "printWidth": 100
}
```

### 18.2. Kod Stili Kuralları

**Değişken İsimlendirme**:
- `camelCase`: Fonksiyonlar, değişkenler (`totalPoints`, `loadStats`)
- `UPPER_SNAKE_CASE`: Sabitler (`CONFIG`, `LEVELS`, `DAILY_GOAL_DEFAULT`)
- `PascalCase`: Sınıflar (projede sınıf yok, ama gelecekte)

**Fonksiyon İsimlendirme**:
- `verbNoun`: `loadStats()`, `saveStats()`, `updateUI()`
- `is/has/can`: Boolean döndürenler (`isFavorite()`, `hasBadge()`)
- `get/set`: Getter/Setter (`getCurrentUser()`, `setDailyGoal()`)

**Dosya İsimlendirme**:
- `kebab-case`: `game-core.js`, `word-stats-manager.js`
- `camelCase`: `indexeddb-cache.js` (istisna)

---

## 19. Oyun Formatları ve Soru Yapıları

### 19.1. Kelime Çevir Formatı

**Soru Yapısı**:
```html
<div class="question-section">
    <div class="arabic-word-container">
        <div class="arabic-word" id="arabic-word">بِسْمِ</div>
        <div class="kelime-metadata">
            <span class="kelime-id" id="kelime-id">1:1</span>
            <button class="hint-icon-btn" id="hint-btn">💡</button>
            <button class="play-audio-speaker-btn" id="kelime-play-audio-btn">🔊</button>
        </div>
    </div>
</div>

<div class="options-section">
    <button class="option-btn" data-index="0">ismiyle</button>
    <button class="option-btn" data-index="1">rahman</button>
    <button class="option-btn" data-index="2">rahim</button>
    <button class="option-btn" data-index="3">Allah</button>
</div>
```

**Alt Modlar**:
1. **Klasik**: Normal oyun, tüm kelimeler
2. **30. cüz**: Sadece sure 78-114 kelimeleri
3. **Tekrar Et**: Yanlış cevaplanan kelimeler (`reviewWords` Set'inden)
4. **Favoriler**: Favori kelimeler (`hasene_favorites` array'inden)

### 19.2. Dinle Bul Formatı

**Soru Yapısı**:
```html
<div class="question-section">
    <div class="arabic-word-container">
        <p class="instruction">
            <span class="headphone-icon">🎧</span>
            Dinlediğin kelimeyi seç
        </p>
        <button class="play-audio-speaker-btn" id="play-audio-btn">🔊</button>
    </div>
</div>
<!-- Seçenekler aynı -->
```

**Fark**: Arapça kelime gösterilmez, sadece ses çalınır.

### 19.3. Boşluk Doldur Formatı

**Soru Yapısı**:
```html
<div class="question-section">
    <div class="arabic-word-container">
        <div class="verse-text" id="verse-text">
            بِسْمِ <span class="blank" id="blank-word">____</span> الرَّحْمَٰنِ الرَّحِيمِ
        </div>
        <div class="verse-metadata">
            <span class="verse-meal" id="verse-meal">Rahman ve Rahim olan Allah'ın adıyla</span>
        </div>
    </div>
</div>
```

**Algoritma**:
1. Ayet seçilir (`ayetoku.json`'dan)
2. Rastgele bir kelime boş bırakılır
3. 1 doğru + 3 yanlış çeldirici oluşturulur (ayetin diğer kelimelerinden)

### 19.4. Ayet/Dua/Hadis Okuma Formatı

**Yapı**:
```html
<div class="reading-content">
    <div class="verse-info">
        <span class="verse-id">1:1</span>
        <h3>Fâtiha Suresi</h3>
        <button class="play-audio-speaker-btn">🔊</button>
    </div>
    <div class="arabic-text" id="ayet-arabic-text">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
    </div>
    <div class="translation-text" id="ayet-translation">
        Rahman ve Rahim olan Allah'ın adıyla
    </div>
    <div class="reading-actions">
        <button class="nav-btn" id="ayet-prev-btn">← Önceki</button>
        <button class="nav-btn" id="ayet-next-btn">Sonraki →</button>
    </div>
</div>
```

**Navigasyon**: Önceki/Sonraki butonları ile liste içinde gezinme.

### 19.5. Elif Ba Formatı

**Alt Modlar**:
1. **Harfler**: Arapça harfleri öğrenme (ا, ب, ت, ...)
2. **Kelimeler**: Üç harfli kelimeler (ب س م, ...)
3. **Harekeler**: Harfler + harekeler (بَ, بِ, بُ, ...)
4. **Harf Tablosu**: Grid görünümünde tüm harfler

**Soru Formatı** (Harfler modu):
```html
<div class="arabic-word" id="elif-ba-word" style="font-size: 3rem;">ا</div>
<span id="elif-ba-instruction">Arapça harfi seçin</span>
<!-- 4 seçenek: ا, ب, ت, ث -->
```

---

## 20. Performans Optimizasyonları

### 20.1. Lazy Loading

**Veri Yükleme**:
- JSON dosyaları sadece ihtiyaç duyulduğunda yüklenir
- `data-loader.js` içinde `loadWordsData()`, `loadVersesData()` fonksiyonları

**Örnek**:
```js
let wordsDataCache = null;
async function loadWordsData() {
    if (wordsDataCache) return wordsDataCache;
    const response = await fetch('./data/kelimebul.json');
    wordsDataCache = await response.json();
    return wordsDataCache;
}
```

### 20.2. Debounced Saving

**Kaydetme Stratejisi**:
- Her puan artışında `debouncedSaveStats()` çağrılır
- 500ms debounce ile sadece son değişiklik kaydedilir
- Oyun bitişinde `saveStatsImmediate()` ile anında kaydetme

### 20.3. IndexedDB Cache

**Cache Stratejisi**:
- IndexedDB ana depolama, localStorage yedek
- İlk yüklemede IndexedDB'den okunur (hızlı)
- Arka planda Firebase'den senkronizasyon (paralel)

### 20.4. GPU Acceleration

**CSS Optimizasyonları**:
```css
.game-card {
    transform: translateZ(0);  /* GPU acceleration */
    will-change: transform;     /* Optimizasyon ipucu */
}
```

---

## 21. Güvenlik ve Hata Yönetimi

### 21.1. XSS Koruması

**HTML Sanitization**:
```js
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;  // Text olarak ekle (HTML escape)
    return div.innerHTML;
}
```

### 21.2. Veri Doğrulama

**LocalStorage Validation**:
```js
function safeGetItem(key, defaultValue) {
    try {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return defaultValue;
    }
}
```

### 21.3. Hata Yakalama

**Try-Catch Pattern**:
- Tüm kritik fonksiyonlarda `try-catch` kullanılır
- Hata durumunda fallback mekanizmaları devreye girer
- Kullanıcıya hata mesajı gösterilmez (sessiz fail)

**Örnek**:
```js
async function loadStats() {
    try {
        // Ana işlem
    } catch (error) {
        console.error('loadStats error:', error);
        // Fallback: localStorage'dan yükle
        totalPoints = parseInt(localStorage.getItem('hasene_totalPoints') || '0');
    }
}
```

---

## 22. PWA (Progressive Web App) Detayları

### 22.1. Manifest.json Yapılandırması

```json
{
  "name": "Hasene Arapça Dersi",
  "short_name": "Hasene",
  "description": "Kuran kelimelerini öğren, rozet topla, günlük görevleri tamamla",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "background_color": "#667eea",
  "theme_color": "#764ba2",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "assets/images/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/images/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["education", "games"],
  "lang": "tr"
}
```

### 22.2. Service Worker (`sw.js`)

**Cache Stratejisi**:
- **App dosyaları**: Network First (güncel versiyon için)
- **JSON veriler**: Cache First (hızlı yükleme için)
- **API çağrıları**: Network Only (cache'lenmez)

**Cache İsimleri**:
- `hasene-v2`: App dosyaları (HTML, CSS, JS)
- `hasene-data-v2`: JSON verileri

**Offline Desteği**:
- Tüm app dosyaları cache'lenir
- JSON verileri cache'lenir
- Offline durumda cache'den servis edilir

---

## 23. Test ve Debug Araçları

### 23.1. Debug Modu

**Config.js içinde**:
```js
const CONFIG = {
    DEBUG: false,              // Genel debug modu
    LOG_LEVEL: 'error',        // 'debug', 'info', 'warn', 'error'
    GAME_DEBUG: false         // Oyun adımları için detaylı log
};
```

**Konsol Fonksiyonları**:
```js
debugLog('Mesaj');      // DEBUG modunda gösterilir
infoLog('Mesaj');       // INFO seviyesinde gösterilir
warnLog('Mesaj');       // WARN seviyesinde gösterilir
errorLog('Mesaj');      // Her zaman gösterilir
gameLog('Adım', data);  // Oyun adımları için özel log
```

### 23.2. Test Dosyaları

**Test HTML Sayfaları**:
- `test-complete.html`: Kapsamlı test suite
- `tests/test-runner.html`: Optimizasyon ve senkronizasyon testleri
- `rozet-kullanim-tablosu.html`: Rozet görsel referans tablosu

**Test Script Dosyaları**:
- `test-commands.js`: Konsol test komutları
- `test-leaderboard.js`: Leaderboard testleri
- `test-vazifeler-paneli.js`: Görev paneli testleri
- `HIZLI_TEST_KOMUTU.js`: Hızlı test komutları
- `HIZLI_KONTROL.js`: Hızlı kontrol scripti

---

## 24. Deployment ve Build Süreci

### 24.1. Build Gereksinimleri

**Şu an**: Build süreci yok, direkt statik dosyalar servis ediliyor.

**Önerilen Build Süreci** (gelecekte):
1. **Minification**: CSS ve JS dosyalarını minify et
2. **Bundling**: JS dosyalarını birleştir (opsiyonel)
3. **Image Optimization**: PNG/JPEG optimizasyonu
4. **Service Worker**: Cache versiyonlarını güncelle

### 24.2. Deployment

**Statik Hosting**:
- Firebase Hosting
- Netlify
- Vercel
- GitHub Pages
- Herhangi bir statik dosya sunucusu

**Firebase Hosting Örneği**:
```bash
firebase deploy --only hosting
```

**Gerekli Dosyalar**:
- `index.html`
- `style.css`
- `manifest.json`
- `sw.js`
- `js/` klasörü (tüm JS dosyaları)
- `data/` klasörü (tüm JSON dosyaları)
- `assets/` klasörü (tüm görseller)

---

## 26. Lig Sistemi (Leaderboard) - Detaylı Açıklama

### 26.1. Lig Seviyeleri ve XP Eşikleri

Proje **12 lig seviyesi** kullanıyor. Her lig, haftalık XP (Hasene) miktarına göre belirlenir:

```js
// Lig seviyesi hesaplama (api-service.js)
function calculateLeague(weeklyXP) {
    if (weeklyXP >= 10000) return 'ulama';      // Ulema - En yüksek lig
    else if (weeklyXP >= 8000) return 'imam';   // İmam
    else if (weeklyXP >= 6000) return 'faqih';  // Fakih
    else if (weeklyXP >= 4000) return 'muhaddis'; // Muhaddis
    else if (weeklyXP >= 3000) return 'mujtahid'; // Müctehid
    else if (weeklyXP >= 2000) return 'alim';   // Alim
    else if (weeklyXP >= 1500) return 'kurra';  // Kurra
    else if (weeklyXP >= 1000) return 'hafiz';  // Hafız
    else if (weeklyXP >= 500) return 'mutebahhir'; // Mütebahhir
    else if (weeklyXP >= 250) return 'mutavassit'; // Mutavassıt
    else if (weeklyXP >= 100) return 'talib';   // Talib
    else return 'mubtedi';                      // Mübtedi - Başlangıç ligi
}
```

**Lig Tablosu** (XP eşikleri ve isimleri):

| Lig | Arapça | Türkçe | Minimum XP | Renk |
|-----|--------|--------|------------|------|
| `mubtedi` | مبتدئ | Mübtedi | 0 | #8B4513 |
| `talib` | طالب | Talib | 100 | #CD7F32 |
| `mutavassit` | متوسط | Mutavassıt | 250 | #4682B4 |
| `mutebahhir` | متبحر | Mütebahhir | 500 | #228B22 |
| `hafiz` | حافظ | Hafız | 1,000 | #FFD700 |
| `kurra` | قراء | Kurra | 1,500 | #DC143C |
| `alim` | عالم | Alim | 2,000 | #4B0082 |
| `mujtahid` | مجتهد | Müctehid | 3,000 | #4169E1 |
| `muhaddis` | محدث | Muhaddis | 4,000 | #000080 |
| `faqih` | فقيه | Fakih | 6,000 | #006400 |
| `imam` | إمام | İmam | 8,000 | #8B008B |
| `ulama` | علماء | Ulema | 10,000+ | #FFD700 |

### 26.2. Haftalık XP Sistemi

**XP Kaynağı**:
- Her oyun sonrası kazanılan Hasene, haftalık XP'ye eklenir
- Hafta Pazartesi başlar, Pazar biter
- Her hafta başında haftalık XP sıfırlanır

**XP Güncelleme**:
```js
async function updateWeeklyXP(points) {
    const weekStart = getWeekStart(); // Pazartesi
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const key = `hasene_weekly_xp_${weekStartStr}`;
    
    // localStorage'a ekle
    const currentXP = parseInt(localStorage.getItem(key) || '0');
    const newXP = currentXP + points;
    localStorage.setItem(key, newXP.toString());
    
    // Firebase'e kaydet (kullanıcı varsa)
    await firestoreSet('weekly_leaderboard', `${userId}_${weekStartStr}`, {
        weekly_xp: newXP,
        week_start: weekStartStr,
        username: user.username
    });
}
```

### 26.3. Lig Geçiş Kuralları

**Promosyon (Yükselme)**:
- Hafta sonunda haftalık XP, bir üst ligin minimum XP eşiğini geçerse otomatik yükselir
- Örnek: 1,200 XP → `hafiz` ligine yükselir (1,000+)

**Demotion (Düşme)**:
- Hafta sonunda haftalık XP, mevcut ligin minimum XP eşiğinin altına düşerse bir alt lige düşer
- Örnek: 800 XP → `mutebahhir` ligine düşer (500-999 arası)

**Lig Değişikliği**:
- Lig değişiklikleri hafta sonunda (Pazar gece yarısı) otomatik hesaplanır
- Kullanıcı yeni haftada yeni liginde başlar

### 26.4. Leaderboard Görünümü

**Genel Sıralama**:
- Tüm kullanıcılar haftalık XP'ye göre genel sıralamada gösterilir
- Lig fark etmeksizin en yüksek XP'den en düşüğe sıralanır

**Lig İçi Sıralama**:
- Her lig kendi içinde sıralanır
- Aynı ligdeki kullanıcılar arasında rekabet gösterilir

**Kullanıcı Pozisyonu**:
```js
async function getUserLeaguePosition(userId) {
    // Tüm kullanıcıları sırala
    const allUsers = await getAllUsersRankings();
    const userPosition = allUsers.findIndex(u => u.user_id === userId) + 1;
    
    // Lig bilgilerini hesapla
    const weeklyXP = user.weekly_xp;
    const league = calculateLeague(weeklyXP);
    const leagueUsers = allUsers.filter(u => u.league === league);
    
    return {
        league: league,
        position: userPosition,  // Genel sıralamadaki pozisyon
        weekly_xp: weeklyXP,
        total_in_league: leagueUsers.length
    };
}
```

---

## 27. Başarımlar (Achievements) - Tam Liste

### 27.1. Tüm 44 Başarım Listesi

Tüm başarımlar **yıldız sayısına endekslidir** (250 Hasene = 1 Yıldız):

**İlk Adımlar (1-6 Yıldız)**:
1. `first_victory` - 🕌 İlk Kelime (1 Yıldız)
2. `bismillah` - بِسْمِ اللَّهِ (2 Yıldız)
3. `combo_master` - 🕌 Muvazebet Ustası (3 Yıldız)
4. `first_step` - 🌱 İlk Adım (4 Yıldız)
5. `level_1` - 📖 Mübtedi (5 Yıldız)
6. `perfect_lesson_1` - ✨ Mükemmel Ders (6 Yıldız)

**Başlangıç (8-50 Yıldız)**:
7. `alhamdulillah` - الْحَمْدُ لِلَّهِ (8 Yıldız)
8. `combo_10` - 🕋 On Muvazebet (10 Yıldız)
9. `bronze_traveler` - 📿 Mübtedi Talebe (12 Yıldız)
10. `streak_3` - 📿 Üç Gün Vird (15 Yıldız)
11. `daily_hero` - 📿 Günlük Vird (18 Yıldız)
12. `mashallah` - مَا شَاءَ اللَّهُ (20 Yıldız)
13. `fast_student` - 🕌 Hızlı Talebe (25 Yıldız)
14. `perfect_lesson_5` - 🌟 Beş Mükemmel (30 Yıldız)
15. `all_modes` - 📚 Tüm Modlar (35 Yıldız)
16. `streak_7` - 🕌 Haftalık Vird (40 Yıldız)
17. `level_5` - 🕌 Mütebahhir (50 Yıldız)

**İlerleme (60-250 Yıldız)**:
18. `thousand_correct_250` - 🕌 İki Yüz Elli Doğru (60 Yıldız)
19. `silver_master` - 🕋 Gümüş Mertebe (75 Yıldız)
20. `combo_20` - ☪️ Yirmi Muvazebet (90 Yıldız)
21. `perfect_lesson_10` - 💎 On Mükemmel (100 Yıldız)
22. `streak_14` - 🌙 İki Hafta Vird (120 Yıldız)
23. `thousand_correct_500` - 🕌 Beş Yüz Doğru (150 Yıldız)
24. `level_10` - 🕋 Alim (180 Yıldız)
25. `streak_21` - ☪️ Üç Hafta Vird (200 Yıldız)
26. `streak_30` - 🕋 Ramazan Virdi (250 Yıldız)

**Ustalık (300-700 Yıldız)**:
27. `second_silver` - ☪️ İkinci Gümüş (300 Yıldız)
28. `thousand_correct` - 🕌 Bin Doğru (350 Yıldız)
29. `gold_master` - 🌟 Altın Mertebe (400 Yıldız)
30. `level_15` - ☪️ Fakih (500 Yıldız)
31. `streak_40` - 🌟 Kırk Gün Vird (600 Yıldız)
32. `level_20` - 🌟 Muhaddis (700 Yıldız)

**Master (800-1,500 Yıldız)**:
33. `second_gold` - 💎 İkinci Altın (800 Yıldız)
34. `perfect_lesson_50` - 🌟 Elli Mükemmel (900 Yıldız)
35. `diamond_master` - ✨ Elmas Mertebe (1,000 Yıldız)
36. `level_25` - 💎 Müfessir (1,200 Yıldız)
37. `streak_100` - 💎 Yüz Gün Vird (1,500 Yıldız)

**Efsane (2,000-10,000 Yıldız)**:
38. `master_of_masters` - 📖 Ustalar Ustası (2,000 Yıldız)
39. `level_30` - ✨ Hafız (2,500 Yıldız)
40. `perfect_lesson_100` - 🕋 Yüz Mükemmel (3,000 Yıldız)
41. `five_thousand_correct` - 🕋 Beş Bin Doğru (4,000 Yıldız)
42. `diamond_master_final` - ✨ Elmas Mertebe (5,000 Yıldız)
43. `master_of_masters_final` - 📖 Ustalar Ustası (6,000 Yıldız)
44. `hafiz` - 🕋 Kurra Hafız (10,000 Yıldız ≈ 2.5M Hasene)

### 27.2. Başarım Kontrol Mekanizması

```js
function checkAchievements(stats) {
    const statsWithStars = {
        ...stats,
        stars: Math.floor(stats.totalPoints / 250)
    };
    
    const newlyUnlocked = [];
    for (const ach of ACHIEVEMENTS) {
        if (!unlockedAchievements.includes(ach.id) && ach.check(statsWithStars)) {
            unlockedAchievements.push(ach.id);
            newlyUnlocked.push(ach);
        }
    }
    
    if (newlyUnlocked.length) {
        showAchievementModal(newlyUnlocked[0]);
    }
}
```

---

## 28. Rozetler (Badges) - Tam Liste

### 28.1. Temel Rozetler (1-10)

Tüm rozetler **Hasene puanına endekslidir**:

1. `badge_1` - İlk Adım (250 Hasene)
2. `badge_2` - Başlangıç (500 Hasene)
3. `badge_3` - İlk Seri (750 Hasene)
4. `badge_4` - Hızlı Öğrenci (1,000 Hasene)
5. `badge_5` - Combo Ustası (1,500 Hasene)
6. `badge_6` - Mükemmel Ders (2,000 Hasene)
7. `badge_7` - Haftalık Kahraman (2,500 Hasene)
8. `badge_8` - Kelime Ustası (3,500 Hasene)
9. `badge_9` - İlerleme (5,000 Hasene)
10. `badge_10` - Çoklu Mod (7,500 Hasene)

### 28.2. Orta Seviye Rozetler (11-20)

11. `badge_11` - 2 Hafta Seri (10,000 Hasene)
12. `badge_12` - Bronz Yolcu (15,000 Hasene)
13. `badge_14` - 10x Combo (20,000 Hasene)
14. `badge_15` - 100 Doğru (25,000 Hasene)
15. `badge_16` - 3 Hafta Seri (30,000 Hasene)
16. `badge_17` - 5 Mükemmel (40,000 Hasene)
17. `badge_18` - Gümüş Yolcu (50,000 Hasene)
18. `badge_19` - Ay Boyunca (60,000 Hasene)
19. `badge_20` - 250 Doğru (75,000 Hasene)

### 28.3. İleri Seviye Rozetler (21-30)

21. `badge_21` - Mertebe 5 (85,000 Hasene)
22. `badge_22` - Altın Yolcu (100,000 Hasene)
23. `badge_23` - 20x Combo (125,000 Hasene)
24. `badge_24` - 500 Doğru (150,000 Hasene)
25. `badge_25` - 10 Mükemmel (200,000 Hasene)
26. `badge_26` - Mertebe 10 (250,000 Hasene)
27. `badge_27` - Elmas Yolcu (300,000 Hasene)
28. `badge_28` - 1000 Doğru (400,000 Hasene)
29. `badge_29` - 50 Gün Seri (500,000 Hasene)
30. `badge_30` - Ustalar Ustası (600,000 Hasene)

### 28.4. Uzman Seviye Rozetler (32-42)

32. `badge_32` - Mertebe 20 (750,000 Hasene)
33. `badge_33` - 100 Mükemmel (850,000 Hasene)
34. `badge_34` - 100 Gün Seri (1,000,000 Hasene)
35. `badge_35` - 5000 Doğru (1,250,000 Hasene)
36. `badge_36` - HAFIZ (1,500,000 Hasene)
42. `badge_42` - Efsane (2,500,000 Hasene)

### 28.5. Asr-ı Saadet Rozetleri (41 Adet)

**Mekke Dönemi (1-13)**:
- `asr_1` - Doğum (571) - 250 Hasene
- `asr_2` - Sütannesi Halime (575) - 500 Hasene
- `asr_3` - Dedesi Abdülmuttalib (578) - 750 Hasene
- `asr_4` - Amcası Ebu Talib (579) - 1,000 Hasene
- `asr_5` - Hz. Hatice ile Evlilik (595) - 1,250 Hasene
- `asr_6` - İlk Vahiy (610) - 1,500 Hasene
- `asr_7` - İlk Müslümanlar (610) - 1,750 Hasene
- `asr_8` - Açık Davet (613) - 2,000 Hasene
- `asr_9` - Habeşistan Hicreti (615) - 2,500 Hasene
- `asr_10` - Hüzün Yılı (619) - 3,000 Hasene
- `asr_11` - İsra ve Miraç (620) - 3,500 Hasene
- `asr_12` - Birinci Akabe Biatı (621) - 4,000 Hasene
- `asr_13` - İkinci Akabe Biatı (622) - 4,500 Hasene

**Medine Dönemi (14-27)**:
- `asr_14` - Hicret (622 Hicri 1) - 5,000 Hasene
- `asr_15` - Mescid-i Nebevi İnşası (622) - 6,000 Hasene
- `asr_16` - Kardeşlik Antlaşması (622) - 7,000 Hasene
- `asr_17` - Bedir Savaşı (624 Hicri 2) - 8,000 Hasene
- `asr_18` - Ramazan Orucu (624) - 9,000 Hasene
- `asr_19` - Uhud Savaşı (625 Hicri 3) - 10,000 Hasene
- `asr_20` - Hendek Savaşı (627 Hicri 5) - 12,000 Hasene
- `asr_21` - Hudeybiye Antlaşması (628 Hicri 6) - 14,000 Hasene
- `asr_22` - Hayber'in Fethi (629 Hicri 7) - 16,000 Hasene
- `asr_23` - Mekke'nin Fethi (630 Hicri 8) - 18,000 Hasene
- `asr_24` - Huneyn Savaşı (630) - 20,000 Hasene
- `asr_25` - Tebük Seferi (630 Hicri 9) - 22,000 Hasene
- `asr_26` - Veda Haccı (631 Hicri 9) - 24,000 Hasene
- `asr_27` - Vefat (632 Hicri 11) - 26,000 Hasene

**Dört Halife Dönemi (28-41)**:
- `asr_28` - Hz. Ebu Bekir'in Halife Seçilmesi (632) - 28,000 Hasene
- `asr_29` - Ridde Savaşları (632-633) - 30,000 Hasene
- `asr_30` - Hz. Ömer'in Halife Seçilmesi (634) - 32,000 Hasene
- `asr_31` - Kadisiyye Savaşı (636) - 35,000 Hasene
- `asr_32` - Kudüs'ün Fethi (637) - 38,000 Hasene
- `asr_33` - Hicri Takvim Başlangıcı (638) - 42,000 Hasene
- `asr_34` - Hz. Ömer'in Şehit Edilmesi (644) - 45,000 Hasene
- `asr_35` - Hz. Osman'ın Halife Seçilmesi (644) - 50,000 Hasene
- `asr_36` - Kuran'ın Çoğaltılması (650) - 55,000 Hasene
- `asr_37` - Hz. Osman'ın Şehit Edilmesi (656) - 60,000 Hasene
- `asr_38` - Hz. Ali'nin Halife Seçilmesi (656) - 65,000 Hasene
- `asr_39` - Cemel (Deve) Vakası (656) - 70,000 Hasene
- `asr_40` - Sıffin Savaşı (657) - 75,000 Hasene
- `asr_41` - Hz. Ali'nin Şehit Edilmesi (661) - 80,000 Hasene

**Toplam**: 42 normal rozet + 41 Asr-ı Saadet rozeti = **83 rozet**

### 28.6. Rozet Kontrol Mekanizması

```js
function checkBadges() {
    const stats = {
        totalPoints: totalPoints,
        stars: Math.floor(totalPoints / 250),
        perfectLessons: perfectLessonsCount,
        totalCorrect: gameStats.totalCorrect
    };
    
    for (const badge of BADGE_DEFINITIONS) {
        if (!unlockedBadges.includes(badge.id) && badge.check(stats)) {
            unlockBadge(badge);
        }
    }
}
```

---

## 29. Kelime Seçim Algoritması ve Analiz Sistemi

### 29.1. Akıllı Kelime Seçimi (Intelligent Word Selection)

**Algoritma**: Spaced Repetition (SM-2) tabanlı akıllı seçim

**Öncelik Sırası** (yüksekten düşüğe):

1. **Tekrar Zamanı Geçmiş Kelimeler** (Priority: 200+)
   - `nextReviewDate` bugün veya geçmişte olan kelimeler
   - Gecikme ne kadar fazlaysa öncelik o kadar artar
   - Formül: `priority = 200 + (overdueDays * 10)`

2. **Son Yanlış Cevap Verilen Kelimeler** (Priority: 12-100)
   - Son 10 yanlış cevap verilen kelimeler
   - Öncelik gün farkına göre:
     - Bugün yanlış: 100
     - 1 gün önce: 50
     - 2 gün önce: 25
     - 3 gün önce: 12

3. **Zorlanılan Kelimeler** (Priority: 3-10)
   - Başarı oranı < 50% ve en az 2 deneme
   - Review modunda: 10, normal modda: 3

4. **Düşük Ustalık Seviyesi** (Priority: 2)
   - Ustalık seviyesi 0-3 arası ve en az 1 deneme

5. **Normal Kelimeler** (Priority: 1-1.5)
   - Tekrar zamanı henüz gelmemiş
   - Tekrar zamanı 1-2 gün içindeyse: 1.5

6. **Hiç Denenmemiş Kelimeler** (Priority: 5)
   - İstatistik kaydı olmayan kelimeler

**Seçim Mekanizması**:

```js
function selectIntelligentWords(words, count, isReviewMode = false) {
    // 1. Kelimeleri kategorilere ayır
    const recentWrongWords = [];      // Tekrar zamanı geçmiş + son yanlışlar
    const strugglingWords = [];       // Zorlanılan kelimeler
    const lowMasteryWords = [];       // Düşük ustalık
    const normalWords = [];           // Normal + denenmemiş
    
    // 2. Öncelik skorlarına göre kategorize et
    words.forEach(word => {
        const stats = wordStats[word.id];
        // ... kategorilere ayır
    });
    
    // 3. Yüksek öncelikli kelimelerden seç (en fazla count/2)
    const highPriorityWords = [...recentWrongWords, ...strugglingWords]
        .filter(w => w.priority >= 10)
        .sort((a, b) => b.priority - a.priority);
    
    const highPriorityCount = Math.min(Math.floor(count / 2), highPriorityWords.length);
    // ... yüksek öncelikli kelimeleri ekle
    
    // 4. Kalan kelimeleri ağırlıklı rastgele seç
    // Toplam öncelik skoruna göre weighted random selection
    while (selectedWords.length < count) {
        const totalPriority = remainingWords.reduce((sum, w) => sum + w.priority, 0);
        let random = Math.random() * totalPriority;
        
        for (const item of remainingWords) {
            random -= item.priority;
            if (random <= 0) {
                selectedWords.push(item.word);
                break;
            }
        }
    }
    
    // 5. Son olarak karıştır
    return shuffleArray(selectedWords);
}
```

**Örnek Senaryo**:
- 10 soru için seçim: 5 yüksek öncelikli (tekrar zamanı geçmiş/zorlanılan) + 5 ağırlıklı rastgele

### 29.2. Çeldirici (Distractor) Oluşturma

**Yanlış Cevap Seçimi**:

```js
// Kelime Çevir için çeldirici oluşturma
function createDistractors(correctWord, allWords) {
    // 1. Doğru cevabı ve aynı kelimeyi hariç tut
    const uniqueWrongMeanings = allWords
        .filter(w => w.id !== correctWord.id && w.anlam !== correctWord.anlam)
        .map(w => w.anlam)
        .filter((v, i, a) => a.indexOf(v) === i); // Tekrarları kaldır
    
    // 2. Rastgele 3 yanlış cevap seç
    const wrongAnswers = getRandomItems(uniqueWrongMeanings, 3);
    
    // 3. Doğru cevap + 3 yanlış = 4 seçenek
    return [correctWord.anlam, ...wrongAnswers];
}
```

**Özellikler**:
- Çeldiriciler aynı zorluk seviyesinden seçilir (zorluk filtresi uygulanır)
- Tekrarlı anlamlar filtrelenir (unique)
- Rastgele seçim (`getRandomItems` fonksiyonu)

### 29.3. Şıkların Karıştırılması (Eşit Dağılımlı Shuffle)

**Problem**: Doğru cevabın her zaman aynı pozisyonda (örn. A şıkkı) görünmesi

**Çözüm**: Eşit dağılımlı karıştırma (`shuffleWithEqualDistribution`)

**Algoritma**:

```js
function shuffleWithEqualDistribution(options, correctAnswer, positionCounts) {
    // positionCounts: [0, 0, 0, 0] - Her pozisyonun kullanım sayısı
    
    // 1. En az kullanılan pozisyonları bul
    const minCount = Math.min(...positionCounts);
    const leastUsedPositions = positionCounts
        .map((count, index) => ({ count, index }))
        .filter(item => item.count === minCount)
        .map(item => item.index);
    
    // 2. Doğru cevabı en az kullanılan pozisyonlardan birine taşı
    const targetPosition = leastUsedPositions[Math.floor(Math.random() * leastUsedPositions.length)];
    
    // 3. Diğer seçenekleri karıştır
    const otherOptions = options.filter(opt => opt !== correctAnswer);
    const shuffledOthers = shuffleArray(otherOptions);
    
    // 4. Doğru cevabı hedef pozisyona yerleştir
    const result = [...shuffledOthers];
    result.splice(targetPosition, 0, correctAnswer);
    
    // 5. Pozisyon sayacını güncelle
    positionCounts[targetPosition]++;
    
    return {
        options: result,
        correctIndex: targetPosition
    };
}
```

**Sonuç**:
- 10 soruda doğru cevap her pozisyonda yaklaşık eşit sayıda görünür
- Örnek: [3, 2, 3, 2] veya [2, 3, 2, 3] gibi dağılım

### 29.4. Kelime İstatistikleri Takibi (SM-2 Algoritması)

**Veri Yapısı**:

```js
wordStats[wordId] = {
    attempts: 0,              // Toplam deneme sayısı
    correct: 0,              // Doğru cevap sayısı
    wrong: 0,                // Yanlış cevap sayısı
    successRate: 0,          // Başarı oranı (%)
    masteryLevel: 0,         // Ustalık seviyesi (0-10)
    lastCorrect: null,       // Son doğru cevap tarihi ('YYYY-MM-DD')
    lastWrong: null,         // Son yanlış cevap tarihi
    easeFactor: 2.5,         // SM-2 kolaylık faktörü (1.3 - 2.5)
    interval: 0,             // Tekrar aralığı (gün cinsinden)
    nextReviewDate: null,    // Sonraki tekrar tarihi ('YYYY-MM-DD')
    lastReview: null         // Son tekrar tarihi
};
```

**SM-2 Algoritması (Spaced Repetition)**:

**Doğru Cevap Durumu**:
```js
if (isCorrect) {
    stats.correct++;
    stats.lastCorrect = today;
    
    // İlk öğrenme
    if (previousAttempts === 0) {
        stats.interval = 1; // 1 gün sonra tekrar
    }
    // İkinci doğru cevap
    else if (previousAttempts === 1 && stats.correct === 2) {
        stats.interval = 6; // 6 gün sonra tekrar
    }
    // Sonraki doğru cevaplar
    else {
        stats.interval = Math.max(1, Math.floor(stats.interval * stats.easeFactor));
    }
    
    // Ease Factor güncellemesi
    const currentSuccessRate = (stats.correct / stats.attempts) * 100;
    if (currentSuccessRate >= 90) {
        stats.easeFactor = Math.min(2.5, stats.easeFactor + 0.15);
    } else if (currentSuccessRate >= 70) {
        stats.easeFactor = Math.min(2.5, stats.easeFactor + 0.05);
    } else if (currentSuccessRate < 50) {
        stats.easeFactor = Math.max(1.3, stats.easeFactor - 0.15);
    }
    
    // Sonraki tekrar tarihini hesapla
    stats.nextReviewDate = addDays(today, stats.interval);
}
```

**Yanlış Cevap Durumu**:
```js
else {
    stats.wrong++;
    stats.lastWrong = today;
    
    // Interval sıfırla ve ease factor azalt
    stats.interval = 1; // 1 gün sonra tekrar
    stats.easeFactor = Math.max(1.3, stats.easeFactor - 0.20);
    
    // Sonraki tekrar tarihini hesapla
    stats.nextReviewDate = addDays(today, stats.interval);
}
```

**Ustalık Seviyesi Hesaplama**:
```js
stats.successRate = (stats.correct / stats.attempts) * 100;
stats.masteryLevel = Math.min(10, Math.floor(stats.successRate / 10));
// 0-10% → Level 0, 10-20% → Level 1, ..., 90-100% → Level 10
```

### 29.5. Zorlanılan Kelimeler (Struggling Words)

**Tanım**:
- Başarı oranı < 50%
- En az 2 deneme

**Algoritma**:
```js
function getStrugglingWords() {
    return Object.keys(wordStats)
        .filter(wordId => {
            const stats = wordStats[wordId];
            return stats.attempts >= 2 && stats.successRate < 50;
        })
        .map(wordId => ({
            id: wordId,
            ...wordStats[wordId]
        }))
        .sort((a, b) => a.successRate - b.successRate) // En düşük başarı oranından başla
        .slice(0, 20); // En fazla 20 kelime
}
```

**Kullanım**:
- "Yanlış cevapları tekrar et" modunda öncelikli gösterilir
- Review listesine otomatik eklenir

### 29.6. Review Listesi (Tekrar Listesi)

**Review Listesi Oluşturma**:
```js
// Yanlış cevap verilen kelimeler review listesine eklenir
function addToReviewList(wordId) {
    if (!dailyTasks.todayStats.reviewWords) {
        dailyTasks.todayStats.reviewWords = new Set();
    }
    dailyTasks.todayStats.reviewWords.add(wordId);
}
```

**Review Modu**:
- "Yanlış cevapları tekrar et" alt modu seçildiğinde
- Review listesindeki kelimeler öncelikli olarak seçilir
- `selectIntelligentWords(words, count, isReviewMode = true)` çağrılır

### 29.7. Kelime Analizleri ve İstatistikler

**Takip Edilen Metrikler**:

1. **Başarı Oranı**: `(correct / attempts) * 100`
2. **Ustalık Seviyesi**: `Math.floor(successRate / 10)` (0-10 arası)
3. **Tekrar Aralığı**: SM-2 algoritmasına göre hesaplanan gün sayısı
4. **Ease Factor**: Kelimenin zorluk/kolaylık faktörü (1.3 - 2.5)
5. **Son Tekrar Tarihi**: En son ne zaman soruldu
6. **Sonraki Tekrar Tarihi**: SM-2'ye göre hesaplanan sonraki tekrar zamanı

**İstatistik Güncelleme**:
- Her soru sonrası `updateWordStats(wordId, isCorrect)` çağrılır
- Batch queue ile performanslı kaydetme (debounced)
- Backend'e senkronize edilir (Firebase varsa)

**Kullanım Senaryoları**:
- Akıllı kelime seçimi (tekrar zamanı gelmiş kelimeler öncelikli)
- Zorlanılan kelimeleri belirleme
- Review modu için kelime filtreleme
- Detaylı istatistikler modalında gösterim

---

## 25. Sonuç ve Yeniden Yazma Kontrol Listesi

Bu README'yi takip ederek oyunu yeniden yazmak için **kontrol listesi**:

### ✅ Temel Yapı
- [ ] Proje klasör yapısını oluştur
- [ ] `index.html` ana sayfasını kur
- [ ] `style.css` stil dosyasını oluştur
- [ ] `manifest.json` PWA manifest'i ekle
- [ ] `sw.js` service worker'ı yaz

### ✅ Veri Katmanı
- [ ] `data/kelimebul.json` formatını oluştur
- [ ] `data/ayetoku.json` formatını oluştur
- [ ] `data/duaet.json` formatını oluştur
- [ ] `data/hadisoku.json` formatını oluştur
- [ ] `data/harf.json` formatını oluştur (Elif Ba için)

### ✅ JavaScript Modülleri
- [ ] `js/config.js` - Yapılandırma
- [ ] `js/constants.js` - Sabitler (LEVELS, ACHIEVEMENTS, BADGE_DEFINITIONS)
- [ ] `js/utils.js` - Yardımcı fonksiyonlar
- [ ] `js/indexeddb-cache.js` - IndexedDB wrapper
- [ ] `js/data-loader.js` - JSON yükleme
- [ ] `js/error-handler.js` - Hata yönetimi
- [ ] `js/audio-manager.js` - Ses yönetimi
- [ ] `js/points-manager.js` - Puan hesaplama
- [ ] `js/word-stats-manager.js` - Kelime istatistikleri
- [ ] `js/favorites-manager.js` - Favoriler
- [ ] `js/badge-visualization.js` - Rozet görselleştirme
- [ ] `js/game-core.js` - Ana oyun mantığı
- [ ] `js/detailed-stats.js` - Detaylı istatistikler
- [ ] `js/notifications.js` - Bildirimler
- [ ] `js/onboarding.js` - İlk açılış turu
- [ ] `js/leaderboard.js` - Liderlik tablosu
- [ ] `js/api-service.js` - Backend API
- [ ] `js/auth.js` - Kullanıcı kimlik doğrulama

### ✅ Oyun Modları
- [ ] Kelime Çevir (4 alt mod)
- [ ] Dinle Bul
- [ ] Boşluk Doldur
- [ ] Ayet Oku
- [ ] Dua Et
- [ ] Hadis Oku
- [ ] Elif Ba (4 alt mod)

### ✅ Sistemler
- [ ] Puan sistemi (temel + combo + perfect)
- [ ] Yıldız ve rozet sistemi
- [ ] Seviye (mertebe) sistemi
- [ ] Başarım sistemi (44 başarım)
- [ ] Günlük vird sistemi
- [ ] Günlük görevler sistemi
- [ ] Streak (seri) sistemi
- [ ] Kelime istatistikleri
- [ ] Favoriler sistemi

### ✅ UI/UX
- [ ] Ana menü (combined stats card)
- [ ] Zorluk seçici
- [ ] Oyun ekranları (7 mod)
- [ ] Bottom navigation
- [ ] Modallar (10+ modal)
- [ ] Responsive tasarım
- [ ] Loading screen
- [ ] Onboarding

### ✅ PWA
- [ ] Service Worker cache stratejisi
- [ ] Offline desteği
- [ ] Install prompt
- [ ] Manifest yapılandırması

### ✅ Backend (Opsiyonel)
- [ ] Firebase yapılandırması
- [ ] Firestore rules
- [ ] API servis fonksiyonları
- [ ] Kullanıcı kimlik doğrulama

---

**Bu README ile oyunun %100'ü yeniden yazılabilir.** Tüm fonksiyonlar, stil detayları, puanlama formülleri, backend mimarisi, istatistik tipleri ve oyun formatları bu dokümanda mevcuttur.
