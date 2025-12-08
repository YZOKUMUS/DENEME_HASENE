# 🕌 HASENE ARAPÇA OYUNU - TAM DOKÜMANTASYON

## 📋 İÇİNDEKİLER

1. [Genel Bakış](#genel-bakış)
2. [Tasarım ve UI/UX](#tasarım-ve-uiux)
3. [Oyun Modları](#oyun-modları)
4. [Puan Sistemi](#puan-sistemi)
5. [Rozet ve Başarım Sistemi](#rozet-ve-başarım-sistemi)
6. [Günlük ve Haftalık Görevler](#günlük-ve-haftalık-görevler)
7. [Streak (Seri) Sistemi](#streak-seri-sistemi)
8. [Paneller ve Modallar](#paneller-ve-modallar)
9. [Veri Yönetimi](#veri-yönetimi)
10. [Teknik Detaylar](#teknik-detaylar)
11. [Fonksiyonlar ve API'ler](#fonksiyonlar-ve-apiler)
12. [Dosya Yapısı](#dosya-yapısı)

---

## 🎯 GENEL BAKIŞ

**Hasene**, Arapça öğrenmeyi eğlenceli hale getiren interaktif bir eğitim oyunudur. Kuran kelimelerini öğrenme, rozet toplama, günlük görevleri tamamlama ve seri takibi gibi özellikler sunar.

### Temel Özellikler
- 📚 6 farklı oyun modu
- 💰 Hasene puan sistemi
- ⭐ Yıldız ve Mertebe sistemi
- 🏆 Rozet ve başarım sistemi
- 📊 Detaylı istatistikler
- 📅 Günlük ve haftalık görevler
- 🔥 Seri (streak) takibi
- 📱 PWA desteği (mobil uygulama gibi çalışır)
- 🌐 Offline çalışma

---

## 🎨 TASARIM VE UI/UX

### Renk Paleti

```css
/* Primary Colors */
--bg-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--bg-secondary: #fff;
--text-primary: #1a1a2e;
--text-secondary: #64748b;

/* Accent Colors */
--accent-primary: #667eea;
--accent-secondary: #764ba2;
--accent-success: #10b981;
--accent-warning: #f59e0b;
--accent-error: #ef4444;
--accent-gold: #fbbf24;
```

### Tipografi

- **Ana Font**: 'Nunito', 'Segoe UI', 'Roboto', -apple-system
- **Arapça Font**: 'Uthmani' (KFGQPC Uthmanic Script HAFS Regular.otf)
- **Başlık Font**: 'Reem Kufi'

### Sayfa Düzeni

#### 1. Header (Üst Bar)
- **Konum**: Fixed, top: 0
- **İçerik**:
  - Oyun başlığı: "Hasene Arapça Dersi"
  - Kısayol butonları (opsiyonel)
- **Z-index**: 1000
- **Yükseklik**: ~75px

#### 2. Ana Menü
- **Hero Section**:
  - Hasene puanı (büyük, vurgulu)
  - Yıldız puanı (⭐)
  - Mertebe (Level)
  - Günlük Vird ilerleme çubuğu
- **Zorluk Seçici**:
  - 🌱 Kolay
  - ⚖️ Orta (varsayılan)
  - 🔥 Zor
- **Oyun Modları Grid**:
  - 6 oyun kartı (2x3 veya 3x2 grid)
  - Her kart: ikon, başlık, açıklama

#### 3. Bottom Navigation (Alt Menü)
- **5 Buton**:
  - 🏠 Ana Menü
  - 📊 İstatistikler
  - 🏆 Muvaffakiyetler
  - 📅 Takvim
  - 📋 Vazifeler (badge ile bildirim)
- **Konum**: Fixed, bottom: 0
- **Yükseklik**: ~90px

#### 4. Container
- **Max-width**: 600px
- **Margin**: 75px auto 90px auto (header ve bottom nav için boşluk)
- **Border-radius**: 20px
- **Padding**: 20px
- **Box-shadow**: 0 10px 35px rgba(0,0,0,0.08)

### Animasyonlar

#### CSS Animasyonları
```css
/* Transition Timing */
--transition-fast: 0.15s ease;
--transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
--transition-bounce: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

#### JavaScript Animasyonları
- **Rozet Kazanma**: `badgeUnlock` animasyonu (scale + rotate)
- **Doğru Cevap**: Yeşil glow efekti
- **Yanlış Cevap**: Kırmızı shake efekti
- **Modal Açılma**: Fade in + scale
- **Loading**: Spinner animasyonu

### Responsive Tasarım

- **Mobil**: Max-width 600px, tek sütun
- **Tablet**: 2 sütun grid (oyun kartları)
- **Desktop**: 3 sütun grid (oyun kartları)
- **Touch-friendly**: Minimum 44x44px buton boyutları

---

## 🎮 OYUN MODLARI

### 1. Kelime Çevir (Kelime Çevir)

**Açıklama**: Arapça kelimelerin Türkçe Meâl karşılığını bulma oyunu.

**Alt Modlar**:
1. **📚 Klasik**
   - Normal oyun modu
   - 10 soru
   - Zorluk seviyesi: Seçilen zorluk (Kolay/Orta/Zor)

2. **📖 30.cüz Ayetlerinin Kelimeleri**
   - Sadece 78-114. sureler (30.cüz)
   - 10 soru
   - Zaman limiti: 30 saniye/soru

3. **❤️ 3 Can**
   - 3 can hakkı
   - Yanlış cevap = -1 can
   - Can bitince oyun biter

4. **🔥 Zorluk**
   - Sadece zor kelimeler (zorluk 7-10)
   - 10 soru

5. **🔄 Tekrar Et**
   - Zorlanılan kelimeleri tekrar et
   - Review mode aktif

**Oyun Akışı**:
1. Zorluk seviyesi seçilir (Kolay/Orta/Zor)
2. Alt mod seçilir
3. 10 soru sorulur
4. Her soruda:
   - Arapça kelime gösterilir
   - 4 seçenek sunulur (1 doğru, 3 yanlış)
   - İpucu butonu (1 yanlış seçeneği kaldırır)
5. Oyun bitince sonuç modalı gösterilir

**Puanlama**:
- Doğru cevap: +10 Hasene
- Yanlış cevap: -5 Hasene
- Combo bonusu: Her 3 doğru cevapta +5 Hasene
- Perfect Lesson: Tüm sorular doğru (yanlış=0, doğru>=3) → Session skorunun %50'si bonus

### 2. Dinle ve Bul (Dinle Bul)

**Açıklama**: Kuran'da geçen Arapça kelimeyi dinle ve sahih kelimeyi seç.

**Özellikler**:
- Ses çalma butonu
- Ses tanıma ile cevap verme (opsiyonel)
- 10 soru
- Zorluk seviyesi: Seçilen zorluk

**Oyun Akışı**:
1. Ses çalınır (otomatik)
2. 4 seçenek gösterilir
3. Kullanıcı doğru kelimeyi seçer
4. Ses tekrar çalınabilir
5. Ses tanıma ile cevap verilebilir

**Puanlama**: Kelime Çevir ile aynı

### 3. Boşluk Doldur

**Açıklama**: Ayetteki eksik kelimeyi tamamla.

**Özellikler**:
- Ayet metni gösterilir (boşluk ile)
- 4 seçenek (kelime seçenekleri)
- Ses çalma butonu
- 10 soru

**Oyun Akışı**:
1. Ayet metni gösterilir (boşluk ile)
2. 4 kelime seçeneği gösterilir
3. Kullanıcı doğru kelimeyi seçer
4. Ses çalınabilir

**Puanlama**: Kelime Çevir ile aynı

### 4. Ayet Oku

**Açıklama**: Ayetin Arapça'sını oku, dinle ve meâli idrak et.

**Özellikler**:
- Arapça ayet metni (Uthmani font)
- Türkçe meâl
- Ses çalma butonu
- Önceki/Sonraki butonları
- Sure bilgisi

**Oyun Akışı**:
- Oyun değil, okuma modu
- Ayetler arasında gezinme
- Ses dinleme

**Puanlama**: Yok (sadece okuma)

### 5. Dua Et

**Açıklama**: Kuran'da geçen duaları dinle ve öğren.

**Özellikler**:
- Arapça dua metni
- Türkçe anlamı
- Ses çalma butonu
- Önceki/Sonraki butonları
- Sure bilgisi

**Oyun Akışı**: Ayet Oku ile aynı (okuma modu)

**Puanlama**: Yok

### 6. Hadis Oku

**Açıklama**: Hadis-i şerifleri oku ve istifade et.

**Özellikler**:
- Hadis metni
- Kategori
- Ravi bilgisi
- Referans
- Önceki/Sonraki butonları

**Oyun Akışı**: Okuma modu

**Puanlama**: Yok

---

## 💰 PUAN SİSTEMİ

### Hasene Puanı

**Temel Puanlama**:
- **Doğru Cevap**: +10 Hasene
- **Yanlış Cevap**: -5 Hasene (ceza)
- **Combo Bonusu**: Her 3 doğru cevapta +5 Hasene
- **Perfect Lesson Bonusu**: Tüm sorular doğru → Session skorunun %50'si ekstra

**Bonus Puanlar**:
- **Günlük Vird Tamamlama**: +1,000 Hasene
- **Günlük Görevler Tamamlama**: +2,500 Hasene
- **Haftalık Görevler Tamamlama**: +5,000 Hasene

**Puan Hesaplama**:
```javascript
// Her doğru cevap
sessionScore += 10;
totalPoints += 10;

// Combo bonusu (her 3 doğru cevapta)
if (comboCount % 3 === 0) {
    sessionScore += 5;
    totalPoints += 5;
}

// Perfect Lesson (oyun bitişinde)
if (wrong === 0 && correct >= 3) {
    const perfectBonus = Math.floor(sessionScore * 0.5);
    totalPoints += perfectBonus;
}
```

### Yıldız Sistemi

**Dönüşüm**:
- **100 Hasene = 1 Yıldız**
- Yıldızlar rozet sistemine dönüşür

**Hesaplama**:
```javascript
const starPoints = Math.floor(totalPoints / 100);
```

### Mertebe (Level) Sistemi

**Seviye Eşikleri**:
```javascript
LEVELS = {
    THRESHOLDS: {
        1: 0,           // Level 1: 0-2499 puan
        2: 2500,        // Level 2: 2500-4999 puan
        3: 5000,        // Level 3: 5000-8499 puan
        4: 8500,        // Level 4: 8500-12999 puan
        5: 13000,       // Level 5: 13000-45999 puan
        10: 46000,      // Level 10: 46000-57999 puan
    },
    INCREMENT_AFTER_10: 15000,  // Level 10'dan sonra her seviye için
}
```

**Mertebe İsimleri**:
- **1. Mertebe**: Mübtedi
- **2. Mertebe**: Müterakki
- **3. Mertebe**: Mütecaviz
- **4. Mertebe**: Mütebahhir
- **5+ Mertebe**: Mütebahhir (devam)

**Seviye Atlama**:
- Seviye atlandığında modal gösterilir
- Ses efekti çalınır
- Animasyon gösterilir

---

## 🏆 ROZET VE BAŞARIM SİSTEMİ

### Rozet Sistemi

**Rozet Türleri**:
1. **🥉 Bronz**: 5 yıldız = 1 bronz (500 Hasene)
2. **🥈 Gümüş**: 5 bronz = 1 gümüş (2,500 Hasene)
3. **🥇 Altın**: 5 gümüş = 1 altın (12,500 Hasene)
4. **💎 Elmas**: 5 altın = 1 elmas (62,500 Hasene)

**Rozet Hesaplama**:
```javascript
const badges = {
    stars: Math.floor(totalPoints / 100),  // Yıldız sayısı
    bronze: Math.floor(stars / 5),          // Bronz sayısı
    silver: Math.floor(bronze / 5),         // Gümüş sayısı
    gold: Math.floor(silver / 5),           // Altın sayısı
    diamond: Math.floor(gold / 5)           // Elmas sayısı
};
```

**Rozet Görselleştirme**:
- PNG ikonlar: `assets/badges/rozet*.png`
- Renk kodları: `badge-visualization.js` içinde tanımlı
- Animasyonlar: Kazanma animasyonu, glow efekti

### Başarım (Achievement) Sistemi

**Başarımlar**:

#### Günlük Başarımlar
- **🎯 İlk Zafer**: İlk sahih cevap
- **⭐ Günlük Kahraman**: Günlük virdi tamamla

#### Combo Başarımları
- **🔥 Muvazebet Ustası**: 5x muvazebet yap

#### Seri Başarımları
- **🔥 7 Gün Muvazebet**: 7 gün üst üste talebe et
- **🔥 14 Gün Muvazebet**: 14 gün üst üste talebe et
- **🔥 21 Gün Muvazebet**: 21 gün üst üste talebe et
- **🔥 30 Gün Muvazebet**: 30 gün üst üste talebe et

#### Mertebe Başarımları
- **🏆 Mertebe 5**: Mertebe 5'e ulaş
- **💎 Mertebe 10**: Mertebe 10'a ulaş
- **🌟 Mertebe 20**: Mertebe 20'ye ulaş

#### Hasene Başarımları
- **🌱 İlk Adım**: 500 Hasene topla (~4 dk)
- **🥉 Mübtedi Yolcu**: 2,000 Hasene (1 Bronz)
- **⚡ Hızlı Talebe**: 4,000 Hasene topla
- **🥈 Gümüş Ustası**: 8,500 Hasene (1 Gümüş) (~1 saat)
- **💯 İkinci Gümüş**: 17,000 Hasene topla
- **🥇 Altın Ustası**: 25,500 Hasene (1 Altın) (~3 gün)
- **🔥 İkinci Altın**: 51,000 Hasene topla
- **💎 Elmas Ustası**: 85,000 Hasene (1 Elmas) (~10 gün)
- **✨ Ustalar Ustası**: 170,000 Hasene topla
- **📖 HAFIZ**: 1,000,000 Hasene topla

**Başarım Kontrolü**:
- `checkAchievements()` fonksiyonu her oyun bitişinde çağrılır
- Yeni başarımlar kazanıldığında popup gösterilir
- `unlockedAchievements` array'inde saklanır

---

## 📋 GÜNLÜK VE HAFTALIK GÖREVLER

### Günlük Görevler

**Görev Türleri**:

#### Temel Görevler (8 adet)
1. **10 Doğru Cevap**: 10 sahih cevap ver
2. **50 Doğru Cevap**: 50 sahih cevap ver
3. **100 Hasene**: 100 Hasene kazan
4. **500 Hasene**: 500 Hasene kazan
5. **3 Oyun Modu**: 3 farklı oyun modu oyna
6. **3 Zorluk Seviyesi**: 3 farklı zorluk seviyesi dene
7. **5x Combo**: 5x muvazebet yap
8. **Seri Koru**: Günlük serini koru

#### Fazilet Vazifeleri (4 adet - Bonus)
1. **20 Doğru Cevap**: 20 sahih cevap ver
2. **1000 Hasene**: 1,000 Hasene kazan
3. **Tüm Oyun Modları**: Tüm 6 oyun modunu oyna
4. **10x Combo**: 10x muvazebet yap

**Görev Yapısı**:
```javascript
dailyTasks = {
    lastTaskDate: "2025-12-06",  // Son görev tarihi
    tasks: [...],                 // Temel görevler
    bonusTasks: [...],           // Fazilet vazifeleri
    completedTasks: [...],        // Tamamlanan görev ID'leri
    todayStats: {
        toplamDogru: 0,
        toplamPuan: 0,
        comboCount: 0,
        allGameModes: Set(),
        farklıZorluk: Set(),
        perfectStreak: 0,
        accuracy: 0,
        reviewWords: Set(),
        streakMaintain: 0,
        totalPlayTime: 0
    },
    rewardsClaimed: false
};
```

**Görev Ödülü**:
- Tüm görevler tamamlandığında: **+2,500 Hasene**
- `claimDailyRewards()` fonksiyonu ile ödül alınır

**Görev Kontrolü**:
- `updateTaskProgress(gameType, amount)` fonksiyonu ile güncellenir
- Her oyun bitişinde kontrol edilir
- `updateTasksDisplay()` ile UI güncellenir

### Haftalık Görevler

**Görev Türleri** (6 adet):
1. **100 Doğru Cevap**: 100 sahih cevap ver
2. **5000 Hasene**: 5,000 Hasene kazan
3. **7 Gün Seri**: 7 gün üst üste talebe et
4. **Tüm Oyun Modları**: Tüm 6 oyun modunu oyna
5. **50x Combo**: 50x muvazebet yap
6. **Perfect Lesson**: 5 mükemmel ders yap

**Görev Yapısı**:
```javascript
weeklyTasks = {
    lastWeekStart: "2025-12-01",  // Son hafta başlangıcı
    weekStart: "2025-12-01",
    weekEnd: "2025-12-07",
    tasks: [...],
    completedTasks: [...],
    weekStats: {
        totalHasene: 0,
        totalCorrect: 0,
        totalWrong: 0,
        daysPlayed: 0,
        streakDays: 0,
        allModesPlayed: Set(),
        comboCount: 0
    },
    rewardsClaimed: false
};
```

**Görev Ödülü**:
- Tüm görevler tamamlandığında: **+5,000 Hasene**
- `claimWeeklyRewards()` fonksiyonu ile ödül alınır

**Hafta Hesaplama**:
- Hafta başlangıcı: Pazartesi
- Hafta sonu: Pazar
- `getWeekStartDate()` ve `getWeekEndDate()` fonksiyonları ile hesaplanır

---

## 🔥 STREAK (SERİ) SİSTEMİ

### Streak Yapısı

```javascript
streakData = {
    currentStreak: 0,        // Mevcut seri (gün)
    bestStreak: 0,           // En iyi seri (gün)
    totalPlayDays: 0,        // Toplam oyun günü
    lastPlayDate: "",        // Son oyun tarihi (YYYY-MM-DD)
    playDates: [],           // Oynanan tarihler array'i
    dailyGoal: 5,            // Günlük hedef (doğru cevap sayısı)
    todayProgress: 0,        // Bugünkü ilerleme
    todayDate: ""            // Bugünün tarihi
};
```

### Streak Kuralları

**Günlük Hedef**:
- Varsayılan: 5 doğru cevap
- Günlük hedef tamamlandığında seri korunur/artar

**Seri Artışı**:
- Günlük hedef tamamlandığında: `currentStreak++`
- `lastPlayDate` güncellenir
- `playDates` array'ine eklenir

**Seri Kırılması**:
- Günlük hedef tamamlanmazsa ve bir gün geçerse seri kırılır
- `currentStreak = 0` olur

**En İyi Seri**:
- `currentStreak > bestStreak` ise `bestStreak` güncellenir

### Streak Güncelleme

**Fonksiyon**: `updateDailyProgress(correctAnswers)`
- Her doğru cevapta çağrılır
- `todayProgress++` yapılır
- Günlük hedef tamamlandığında seri güncellenir

**Kontrol**: `checkDailyTasks()` ve `checkWeeklyTasks()`
- Her sayfa yüklendiğinde kontrol edilir
- Yeni gün başladıysa streak kontrol edilir

---

## 📊 PANELLER VE MODALLAR

### 1. İstatistikler Modalı

**Açılma**: Alt menüden "📊 İstatistikler" butonuna tıklama

**İçerik**:
- **Bugünkü Amel**:
  - Toplam Sahih: `dailyCorrect`
  - Hatalı: `dailyWrong`
- **Toplam İstatistikler**:
  - Toplam Hasene: `totalPoints`
  - Toplam Sahih: Toplam doğru cevap
  - Toplam Hatalı: Toplam yanlış cevap
  - Başarı Oranı: (Doğru / Toplam) * 100
- **Oyun Türü İstatistikleri**:
  - Kelime Çevir: Oynama sayısı
  - Dinle Bul: Oynama sayısı
  - Boşluk Doldur: Oynama sayısı
  - Ayet Oku: Okuma sayısı
  - Dua Et: Okuma sayısı
  - Hadis Oku: Okuma sayısı
- **Detaylı İstatistikler Butonu**: `detailed-stats.js` modalını açar
- **Veri Durumu Butonu**: IndexedDB ve localStorage durumunu gösterir

**Fonksiyon**: `showStatsModal()`

### 2. Muvaffakiyetler (Badges) Modalı

**Açılma**: Alt menüden "🏆 Muvaffakiyetler" butonuna tıklama

**İçerik**:
- **Rozet Grid**:
  - Yıldız, Bronz, Gümüş, Altın, Elmas rozetleri
  - Her rozet: ikon, isim, açıklama, kazanılma durumu
- **Başarımlar Grid**:
  - Tüm başarımlar listelenir
  - Kazanılan başarımlar vurgulanır
  - Animasyonlar gösterilir

**Fonksiyon**: `showBadgesModal()`

### 3. Takvim Modalı

**Açılma**: Alt menüden "📅 Takvim" butonuna tıklama

**İçerik**:
- **Aylık Takvim**:
  - 30 günlük takvim görünümü
  - Oynanan günler işaretlenir
  - Seri günleri vurgulanır
- **Haftalık Seri Görünümü**:
  - Son 7 günün seri durumu
  - Günlük hedef tamamlama durumu

**Fonksiyon**: `showCalendarModal()`

### 4. Günlük Vazifeler Modalı

**Açılma**: Alt menüden "📋 Vazifeler" butonuna tıklama

**İçerik**:
- **Günlük Görevler**:
  - Temel görevler listesi (8 adet)
  - Fazilet vazifeleri listesi (4 adet)
  - Her görev: isim, ilerleme (X/Y), tamamlanma durumu
- **Haftalık Görevler**:
  - Haftalık görevler listesi (6 adet)
  - Her görev: isim, ilerleme, tamamlanma durumu
- **Ödül Butonları**:
  - "Günlük Ödülü Al" butonu (tüm görevler tamamlandığında aktif)
  - "Haftalık Ödülü Al" butonu (tüm görevler tamamlandığında aktif)

**Fonksiyon**: `showDailyTasksModal()`

### 5. Günlük Vird Ayarları Modalı

**Açılma**: Ana menüdeki "🎯 Günlük Vird" başlığına tıklama

**İçerik**:
- **Hedef Seviyesi Seçimi**:
  - 😊 Rahat: 1,300 Hasene (~10 dakika)
  - ⚖️ Normal: 2,700 Hasene (~20 dakika) [varsayılan]
  - 🔥 Zor: 5,400 Hasene (~40 dakika)
  - 💪 Ciddi: 6,000 Hasene (~45 dakika)
- **Özel Hedef**: Manuel olarak 100-10,000 arası değer girilebilir

**Fonksiyon**: `showDailyGoalSettings()`

### 6. Detaylı İstatistikler Modalı

**Açılma**: İstatistikler modalından "Detaylı İstatistikler" butonuna tıklama

**İçerik**:
- **Günlük İstatistikler**: Son 7 günün detaylı verileri
- **Haftalık İstatistikler**: Son 4 haftanın verileri
- **Aylık İstatistikler**: Son 3 ayın verileri
- **Trend Grafikleri**: Hasene, doğru/yanlış cevap trendleri
- **Kelime İstatistikleri**:
  - Öğrenilen kelimeler
  - Zorlanılan kelimeler
  - Ortalama başarı oranı
  - En zor kelime

**Fonksiyon**: `showDetailedStats()` (detailed-stats.js)

### 7. Veri Durumu Modalı

**Açılma**: İstatistikler modalından "Veri Durumu" butonuna tıklama

**İçerik**:
- **IndexedDB Durumu**: Veri mevcut/bulunamadı
- **localStorage Durumu**: Veri mevcut/bulunamadı
- **Günlük Görevler Durumu**:
  - Son tarih
  - Tamamlanan/Toplam görev sayısı
  - Bugünkü puan
- **Haftalık Görevler Durumu**:
  - Son hafta
  - Tamamlanan/Toplam görev sayısı
  - Haftalık puan
- **Streak Durumu**:
  - Mevcut seri
  - En iyi seri
  - Toplam oyun günü
  - Son oyun tarihi
  - Bugünkü ilerleme

**Fonksiyon**: `showDataStatus()`

### 8. Oyun Sonu Modalı

**Açılma**: Oyun bitişinde otomatik

**İçerik**:
- **Sonuçlar**:
  - Doğru cevap sayısı
  - Yanlış cevap sayısı
  - Kazanılan Hasene
- **Perfect Lesson Bonusu** (varsa):
  - "Mükemmel Ders!" mesajı
  - Bonus Hasene miktarı
- **Butonlar**:
  - "Tekrar Oyna" butonu
  - "Ana Menüye Dön" butonu

**Fonksiyon**: `showCustomConfirm(correct, wrong, xp)`

### 9. Seviye Atlama Modalı

**Açılma**: Seviye atlandığında otomatik

**İçerik**:
- **Yeni Seviye**: Seviye numarası ve ismi
- **Kazanılan Rozetler** (varsa)
- **Animasyon**: Confetti efekti

**Fonksiyon**: `showLevelUpModal(level)`

### 10. Onboarding Modalı

**Açılma**: İlk açılışta otomatik (sadece bir kez)

**İçerik**:
- 6 adımlık tur:
  1. Hoş geldin mesajı
  2. Ders türleri açıklaması
  3. Hasene ve ilerleme açıklaması
  4. Takvim ve günlük vazifeler açıklaması
  5. Rozetler açıklaması
  6. Başla butonu

**Fonksiyon**: `showOnboarding()`

---

## 💾 VERİ YÖNETİMİ

### Veri Saklama

#### 1. LocalStorage

**Kullanılan Key'ler**:
```javascript
// Oyun Verileri
'hasene_totalPoints'        // Toplam Hasene puanı
'hasene_badges'             // Rozet verileri (JSON)
'hasene_streak'             // Streak verileri (JSON)
'hasene_streakData'         // Streak verileri (alternatif key)
'hasene_dailyTasks'         // Günlük görevler (JSON)
'hasene_weeklyTasks'        // Haftalık görevler (JSON)
'hasene_wordStats'          // Kelime istatistikleri (JSON)
'hasene_currentMode'        // Mevcut oyun modu
'hasene_currentDifficulty'  // Mevcut zorluk seviyesi

// İstatistikler
'dailyCorrect'              // Bugünkü doğru cevap sayısı
'dailyWrong'                // Bugünkü yanlış cevap sayısı
'dailyXP'                   // Günlük XP
'dailyGoalHasene'           // Günlük hedef Hasene
'dailyGoalLevel'            // Günlük hedef seviyesi (easy/normal/hard/serious)
'lastDailyGoalDate'         // Son günlük hedef tarihi

// Başarımlar
'unlockedAchievements'      // Kazanılan başarımlar (JSON array)

// Kelime Verileri
'hasene_favorites'          // Favori kelimeler (JSON array)
'hasene_reviewWords'        // Tekrar edilecek kelimeler (JSON array)
'hasene_recentlyWrong'      // Son yanlış cevap verilen kelimeler (JSON array)

// Liderlik Tablosu
'hasene_weeklyScores'       // Haftalık skorlar (JSON)
'hasene_monthlyScores'      // Aylık skorlar (JSON)
'haseneLeaderboard'         // Liderlik tablosu (JSON array)

// Detaylı İstatistikler
'hasene_detailedStats'      // Detaylı istatistikler (JSON)
'hasene_dailyStats'         // Günlük istatistikler (JSON)
'hasene_weeklyStats'        // Haftalık istatistikler (JSON)
'hasene_monthlyStats'       // Aylık istatistikler (JSON)
'hasene_trendStats'         // Trend istatistikleri (JSON)
'hasene_daily_YYYY-MM-DD'   // Tarih bazlı günlük veriler

// Bildirimler
'hasene_notifications'      // Bildirim ayarları (JSON)
'hasene_notificationSettings' // Bildirim ayarları (JSON)
'hasene_lastNotificationDate' // Son bildirim tarihi
'hasene_lastDailyReminder'  // Son günlük hatırlatıcı tarihi
'hasene_lastTaskReminder'   // Son görev hatırlatıcı tarihi

// Sosyal Paylaşım
'hasene_socialShare'        // Sosyal paylaşım verileri (JSON)
'hasene_shareHistory'       // Paylaşım geçmişi (JSON)

// Onboarding
'hasene_onboarding_seen_v2' // Onboarding görüldü mü?

// Tutorial
'hasene_all_game_tutorials_seen' // Tüm tutorial'lar görüldü mü?

// Dev Mode
'hasene_dev_mode'           // Geliştirici modu (1 = aktif)
'hasene_statsJustReset'    // İstatistikler sıfırlandı mı? (flag)
'achievementsJustReset'    // Başarımlar sıfırlandı mı? (flag)
```

#### 2. IndexedDB

**Database**: `HaseneGameDB`
**Version**: 1
**Object Store**: `gameData`

**Key'ler**:
```javascript
'hasene_totalPoints'        // Toplam Hasene puanı (string)
'hasene_badges'             // Rozet verileri (JSON string)
'hasene_streak'             // Streak verileri (JSON string)
'hasene_streakData'         // Streak verileri (alternatif)
'hasene_dailyTasks'         // Günlük görevler (JSON string)
'hasene_weeklyTasks'        // Haftalık görevler (JSON string)
'hasene_currentMode'        // Mevcut oyun modu (string)
'hasene_currentDifficulty'  // Mevcut zorluk seviyesi (string)
'hasene_wordStats'          // Kelime istatistikleri (JSON string)
'gameStats'                 // Genel oyun istatistikleri (JSON string)
```

**Fonksiyonlar**:
- `initIndexedDB()`: IndexedDB'yi başlatır
- `saveToIndexedDB(key, value)`: Veri kaydeder
- `loadFromIndexedDB(key)`: Veri yükler

### Veri Yükleme ve Kaydetme

#### Yükleme
```javascript
async function loadStats() {
    // 1. IndexedDB'den yükle (öncelikli)
    const savedPoints = await loadFromIndexedDB('hasene_totalPoints');
    const savedBadges = await loadFromIndexedDB('hasene_badges');
    // ...
    
    // 2. localStorage'dan yükle (yedek)
    if (!savedPoints) {
        totalPoints = parseInt(localStorage.getItem('hasene_totalPoints') || '0');
    }
    // ...
    
    // 3. Varsayılan değerler (hiç veri yoksa)
    if (!totalPoints) {
        totalPoints = 0;
    }
}
```

#### Kaydetme
```javascript
async function saveStats() {
    // 1. IndexedDB'ye kaydet (ana sistem)
    if (db) {
        saveToIndexedDB('hasene_totalPoints', totalPoints.toString());
        saveToIndexedDB('hasene_badges', JSON.stringify(badges));
        // ...
    }
    
    // 2. localStorage'a kaydet (yedek)
    localStorage.setItem('hasene_totalPoints', totalPoints.toString());
    localStorage.setItem('hasene_badges', JSON.stringify(badges));
    // ...
}
```

**Debounced Kaydetme**:
- `debouncedSaveStats()`: 500ms debounce ile kaydeder
- `saveStatsImmediate()`: Anında kaydeder (oyun bitişinde)

### Veri Sıfırlama

**Fonksiyon**: `resetAllStats()`

**Sıfırlanan Veriler**:
- Tüm localStorage key'leri (`hasene_` ile başlayanlar)
- Tüm IndexedDB key'leri
- Global değişkenler (totalPoints, badges, streakData, vb.)
- UI elementleri
- Kelime istatistikleri
- Favoriler ve tekrar listeleri

**Flag Sistemi**:
- `hasene_statsJustReset = 'true'` flag'i set edilir
- Bu flag sayesinde otomatik görev oluşturulmaz
- İlk oyun oynandığında flag temizlenir

---

## 🔧 TEKNİK DETAYLAR

### Teknoloji Stack

- **Frontend**: Vanilla JavaScript (framework yok)
- **Styling**: CSS3 (CSS Variables, Flexbox, Grid)
- **Storage**: LocalStorage + IndexedDB
- **PWA**: Service Worker, Manifest
- **Fonts**: Google Fonts (Nunito, Reem Kufi) + Uthmani (local)
- **Audio**: Web Audio API
- **Testing**: Vitest

### Dosya Yapısı

```
NEW_HASENE/
├── index.html              # Ana HTML dosyası
├── style.css              # Stil dosyası (10,000+ satır)
├── sw.js                  # Service Worker
├── manifest.json          # PWA manifest
├── js/
│   ├── config.js          # Yapılandırma ve debug
│   ├── constants.js      # Oyun sabitleri
│   ├── game-core.js      # Ana oyun mantığı (15,000+ satır)
│   ├── data-loader.js     # Veri yükleme (lazy loading)
│   ├── badge-visualization.js  # Rozet görselleştirme
│   ├── leaderboard.js     # Liderlik tablosu
│   ├── detailed-stats.js  # Detaylı istatistikler
│   ├── notifications.js   # Bildirimler
│   ├── onboarding.js      # İlk açılış turu
│   ├── game-tutorial.js   # Oyun tutorial'ları
│   ├── favorites.js       # Favori kelimeler
│   ├── social-share.js    # Sosyal paylaşım
│   ├── sound-effects.js   # Ses efektleri
│   ├── accessibility.js   # Erişilebilirlik
│   ├── error-handler.js   # Hata yönetimi
│   ├── error-boundary.js  # Hata sınırları
│   ├── event-handler.js   # Event yönetimi
│   ├── safety-checks.js   # Güvenlik kontrolleri
│   ├── utils.js           # Yardımcı fonksiyonlar
│   ├── indexeddb-cache.js # IndexedDB cache
│   └── json-parser-worker.js # JSON parser worker
├── data/
│   ├── kelimebul.json     # Kelime verileri
│   ├── ayetoku.json       # Ayet verileri
│   ├── duaet.json         # Dua verileri
│   └── hadisoku.json      # Hadis verileri
├── assets/
│   ├── badges/            # Rozet PNG ikonları
│   ├── fonts/             # Uthmani font
│   ├── game-icons/        # Oyun modu ikonları
│   └── images/            # Diğer görseller
└── tests/                 # Test dosyaları
```

### Performans Optimizasyonları

1. **Lazy Loading**: Veriler sadece ihtiyaç duyulduğunda yüklenir
2. **Debounced Saving**: Veri kaydetme 500ms debounce ile yapılır
3. **GPU Acceleration**: Animasyonlar için `transform: translateZ(0)`
4. **Content Containment**: CSS `contain` property
5. **Request Animation Frame**: DOM güncellemeleri için RAF kullanılır
6. **Service Worker**: Offline çalışma ve cache yönetimi

### Güvenlik

1. **CSP (Content Security Policy)**: XSS koruması
2. **HTML Sanitization**: Kullanıcı girdileri sanitize edilir
3. **LocalStorage Validation**: Schema validation ile veri doğrulama
4. **Error Boundaries**: Hata yakalama ve yönetimi

---

## 📚 FONKSİYONLAR VE API'LER

### Ana Fonksiyonlar

#### Oyun Fonksiyonları

```javascript
// Kelime Çevir
function loadQuestion()              // Yeni soru yükle
function checkAnswer(selectedIndex)  // Cevap kontrol et
function handleHint()                // İpucu kullan

// Dinle Bul
function loadDinleQuestion()         // Yeni soru yükle
function checkDinleAnswer(selectedIndex) // Cevap kontrol et

// Boşluk Doldur
function loadBoslukQuestion()        // Yeni soru yükle
function checkBoslukAnswer(selectedIndex) // Cevap kontrol et

// Oyun Başlatma/Bitirme
function startGame()                 // Oyunu başlat
function endGame()                   // Oyunu bitir
function addToGlobalPoints(points, correctAnswers) // Puan ekle
```

#### Puan Sistemi

```javascript
function addSessionPoints(points)    // Session puanı ekle
function addDailyXP(points)          // Günlük XP ekle
function calculateLevel(points)      // Seviye hesapla
function updateStatsBar()            // Üst barı güncelle
function updateUI()                  // Oyun içi UI'ı güncelle
```

#### Görev Sistemi

```javascript
function checkDailyTasks()           // Günlük görevleri kontrol et
function checkWeeklyTasks()          // Haftalık görevleri kontrol et
function generateDailyTasks(date)     // Günlük görevler oluştur
function generateWeeklyTasks(weekStart) // Haftalık görevler oluştur
function updateTaskProgress(gameType, amount) // Görev ilerlemesi güncelle
function claimDailyRewards()         // Günlük ödülü al
function claimWeeklyRewards()        // Haftalık ödülü al
function updateTasksDisplay()        // Görev UI'ını güncelle
```

#### Streak Sistemi

```javascript
function updateDailyProgress(correctAnswers) // Günlük ilerleme güncelle
function calculateCurrentStreakDates()      // Mevcut seri tarihlerini hesapla
function getWeekStartDate(date)             // Hafta başlangıcı hesapla
function getWeekEndDate(date)               // Hafta sonu hesapla
```

#### Veri Yönetimi

```javascript
async function loadStats()           // Tüm verileri yükle
async function saveStats()           // Tüm verileri kaydet
function debouncedSaveStats()        // Debounced kaydetme
async function saveStatsImmediate()  // Anında kaydetme
async function resetAllStats()       // Tüm verileri sıfırla
```

#### Modal Fonksiyonları

```javascript
function showStatsModal()            // İstatistikler modalını göster
function showBadgesModal()           // Rozetler modalını göster
function showCalendarModal()         // Takvim modalını göster
function showDailyTasksModal()       // Görevler modalını göster
function showDailyGoalSettings()    // Günlük vird ayarları modalını göster
function showDataStatus()            // Veri durumu modalını göster
function showCustomConfirm(correct, wrong, xp) // Oyun sonu modalını göster
function showLevelUpModal(level)     // Seviye atlama modalını göster
function showOnboarding()            // Onboarding modalını göster
```

#### Başarım Sistemi

```javascript
function checkAchievements()         // Başarımları kontrol et
function showAchievementUnlock(achievement) // Başarım kazanma popup'ı
```

#### Kelime İstatistikleri

```javascript
function updateWordStats(wordId, isCorrect) // Kelime istatistiği güncelle
function getStrugglingWords()       // Zorlanılan kelimeleri al
function selectIntelligentWord(filteredData) // Akıllı kelime seçimi
```

#### Liderlik Tablosu

```javascript
function saveWeeklyScore(score, date) // Haftalık skor kaydet
function saveMonthlyScore(score, date) // Aylık skor kaydet
function updateLeaderboardScores(points) // Liderlik tablosunu güncelle
```

### Yardımcı Fonksiyonlar

```javascript
function getLocalDateString()       // YYYY-MM-DD formatında tarih
function formatNumber(num)          // Sayı formatlama (binlik ayırıcı)
function playSound(soundName)       // Ses çal
function showCustomAlert(message, type) // Alert göster
function showSuccessMessage(message) // Başarı mesajı göster
function goToMainMenu()             // Ana menüye dön
```

---

## 📁 DOSYA YAPISI DETAYLARI

### index.html

**Yapı**:
- `<head>`: Meta tags, CSS, fonts, manifest
- `<body>`:
  - Loading screen
  - Ana menü
  - Alt navigasyon
  - Oyun modları (Kelime Çevir, Dinle Bul, Boşluk Doldur, Ayet Oku, Dua Et, Hadis Oku)
  - Modallar (onboarding, istatistikler, rozetler, takvim, görevler, vb.)
  - Script tags (JS dosyaları)

**Toplam Satır**: ~2,556 satır

### style.css

**Bölümler**:
1. CSS Variables (renkler, spacing, transitions)
2. Global Reset
3. Container ve Layout
4. Header ve Navigation
5. Hero Section
6. Oyun Kartları
7. Modal Stilleri
8. Oyun Ekranları (Kelime Çevir, Dinle Bul, Boşluk Doldur)
9. Animasyonlar
10. Responsive Tasarım
11. Dark Mode (opsiyonel)

**Toplam Satır**: ~10,000+ satır

### js/game-core.js

**Bölümler**:
1. Storage Manager (localStorage wrapper)
2. Storage Schemas (veri doğrulama)
3. Constants ve Config
4. Global Variables
5. DOM Elements
6. Veri Yükleme (loadStats, loadData)
7. Veri Kaydetme (saveStats, debouncedSaveStats)
8. Oyun Fonksiyonları (Kelime Çevir, Dinle Bul, Boşluk Doldur)
9. Puan Sistemi (addSessionPoints, addToGlobalPoints)
10. Görev Sistemi (checkDailyTasks, updateTaskProgress)
11. Streak Sistemi (updateDailyProgress)
12. Başarım Sistemi (checkAchievements)
13. Modal Fonksiyonları (showStatsModal, showBadgesModal, vb.)
14. UI Güncelleme (updateUI, updateStatsBar)
15. IndexedDB Fonksiyonları
16. Event Listeners
17. Error Handling

**Toplam Satır**: ~15,480 satır

### Veri Dosyaları (JSON)

#### kelimebul.json
```json
{
  "words": [
    {
      "id": "word_1",
      "arabic": "بِسْمِ",
      "translation": "ismiyle",
      "sure": 1,
      "verse": 1,
      "difficulty": 1,
      "audio": "https://..."
    }
  ]
}
```

#### ayetoku.json
```json
{
  "verses": [
    {
      "id": "verse_1",
      "sure": 1,
      "verse": 1,
      "arabic": "بِسْمِ ٱللَّهِ...",
      "translation": "Rahman ve Rahim olan Allah'ın adıyla...",
      "audio": "https://..."
    }
  ]
}
```

#### duaet.json ve hadisoku.json
Benzer yapıda, dua ve hadis verileri

---

## 🎯 ÖZEL ÖZELLİKLER

### 1. Akıllı Kelime Seçimi

**Fonksiyon**: `selectIntelligentWord(filteredData)`

**Algoritma**:
1. Son yanlış cevap verilen kelimelere yüksek öncelik (100x, 50x, 25x, ...)
2. Zorlanılan kelimelere orta öncelik (3x)
3. Review mode'da zorlanılan kelimelere ekstra öncelik
4. Ustalık seviyesi düşük kelimelere öncelik
5. Rastgele seçim (öncelik skoruna göre ağırlıklı)

### 2. Kelime İstatistikleri

**Takip Edilen Veriler**:
- Toplam deneme sayısı
- Doğru cevap sayısı
- Yanlış cevap sayısı
- Başarı oranı (%)
- Ustalık seviyesi (0-10)
- Son doğru/yanlış cevap tarihi

**Hesaplama**:
```javascript
wordStats[wordId] = {
    attempts: 0,
    correct: 0,
    wrong: 0,
    successRate: 0,
    masteryLevel: 0,
    lastCorrect: null,
    lastWrong: null
};
```

### 3. Perfect Lesson Bonusu

**Koşullar**:
- Yanlış cevap = 0
- Doğru cevap >= 3
- Session skoru > 0

**Bonus**: Session skorunun %50'si ekstra Hasene

### 4. Combo Sistemi

**Kurallar**:
- Her doğru cevap combo sayacını artırır
- Yanlış cevap combo sayacını sıfırlar
- Her 3 doğru cevapta +5 Hasene bonus

**Görselleştirme**:
- Combo sayısı gösterilir
- Combo bonusu animasyonu
- Combo görevlerinde ilerleme

### 5. Günlük Vird Sistemi

**Hedef Seviyeleri**:
- 😊 Rahat: 1,300 Hasene (~10 dakika)
- ⚖️ Normal: 2,700 Hasene (~20 dakika) [varsayılan]
- 🔥 Zor: 5,400 Hasene (~40 dakika)
- 💪 Ciddi: 6,000 Hasene (~45 dakika)
- Özel: 100-10,000 Hasene (manuel)

**Tamamlama Bonusu**: +1,000 Hasene

**Görselleştirme**:
- İlerleme çubuğu (0-100%)
- Yüzde gösterimi
- Tamamlandığında vurgulama

### 6. Bildirim Sistemi

**Bildirim Türleri**:
- Günlük hatırlatıcı (09:00'da)
- Günlük görev hatırlatıcısı (22:00'den sonra)
- Streak uyarısı (seri kırılma riski)
- Başarım bildirimi

**Ayarlar**:
- Bildirimleri aç/kapat
- Hatırlatıcı saati ayarla
- Streak uyarısı aç/kapat

### 7. Ses Sistemi

**Ses Efektleri**:
- Doğru cevap sesi
- Yanlış cevap sesi
- Seviye atlama sesi
- Başarım kazanma sesi

**Ayet/Dua/Hadis Sesleri**:
- Kuran ayetleri için audio URL'leri
- Dua ve hadisler için audio URL'leri
- Ses çalma butonu

**Ses Tanıma**:
- Dinle Bul modunda ses tanıma ile cevap verme
- Web Speech API kullanımı

### 8. PWA Özellikleri

**Manifest**:
- App ismi: "Hasene Arapça Dersi"
- Short name: "Hasene"
- Icons: 192x192, 512x512
- Display: standalone
- Orientation: portrait-primary
- Theme color: #764ba2
- Background color: #667eea

**Service Worker**:
- Offline çalışma
- Cache yönetimi
- Asset caching
- Network-first strategy

**Install Prompt**:
- "Ana Ekrana Ekle" butonu
- Install event listener
- PWA install rehberi

---

## 🔄 AKIŞ DİYAGRAMLARI

### Oyun Başlatma Akışı

```
1. Kullanıcı zorluk seviyesi seçer (Kolay/Orta/Zor)
2. Kullanıcı oyun modunu seçer (Kelime Çevir, Dinle Bul, vb.)
3. Kelime Çevir ise alt mod seçilir (Klasik, 30.cüz, 3 Can, Zorluk, Tekrar Et)
4. "Oyunu Başlat" butonuna tıklanır
5. Veriler yüklenir (lazy loading)
6. İlk soru gösterilir
7. Kullanıcı cevap verir
8. Cevap kontrol edilir
9. Puan güncellenir
10. Görev ilerlemesi güncellenir
11. Streak güncellenir
12. Bir sonraki soru gösterilir (10 soru tamamlanana kadar)
13. Oyun bitişinde sonuç modalı gösterilir
14. Puanlar global'e aktarılır
15. Veriler kaydedilir (debounced)
16. Başarımlar kontrol edilir
```

### Veri Kaydetme Akışı

```
1. Oyun bitişinde addToGlobalPoints() çağrılır
2. debouncedSaveStats() çağrılır
3. 500ms beklenir (debounce)
4. saveStats() çağrılır
5. IndexedDB'ye kaydet (ana sistem)
6. localStorage'a kaydet (yedek)
7. Hata durumunda fallback mekanizması
```

### Görev Kontrolü Akışı

```
1. Sayfa yüklendiğinde loadStats() çağrılır
2. checkDailyTasks() çağrılır
3. Bugünün tarihi kontrol edilir
4. Yeni gün başladıysa:
   - Yeni günlük görevler oluşturulur
   - Bugünkü istatistikler sıfırlanır
   - Önceki günün verileri korunur
5. checkWeeklyTasks() çağrılır
6. Yeni hafta başladıysa:
   - Yeni haftalık görevler oluşturulur
   - Haftalık istatistikler sıfırlanır
7. updateTasksDisplay() ile UI güncellenir
```

---

## 📝 ÖNEMLİ NOTLAR

### Tarih Formatı

- **Format**: YYYY-MM-DD (örnek: 2025-12-06)
- **Fonksiyon**: `getLocalDateString()`
- **Kullanım**: Görev tarihleri, streak tarihleri, günlük istatistikler

### Hafta Hesaplama

- **Hafta Başlangıcı**: Pazartesi
- **Hafta Sonu**: Pazar
- **Fonksiyonlar**: `getWeekStartDate()`, `getWeekEndDate()`

### Zaman Dilimi

- Tüm tarih hesaplamaları **yerel saat** kullanır
- Gece yarısı (00:01) görevler ve streak sıfırlanır
- Hafta başlangıcı Pazartesi 00:01

### Veri Senkronizasyonu

- **Öncelik**: IndexedDB → localStorage → Varsayılan değerler
- **Kaydetme**: Hem IndexedDB hem localStorage'a kaydedilir
- **Sıfırlama**: Her iki sistem de temizlenir

### Performans

- **Debounced Saving**: 500ms debounce ile kaydetme
- **Lazy Loading**: Veriler sadece ihtiyaç duyulduğunda yüklenir
- **Request Animation Frame**: DOM güncellemeleri için RAF
- **GPU Acceleration**: Animasyonlar için transform kullanımı

### Hata Yönetimi

- **Try-Catch**: Tüm kritik fonksiyonlarda hata yakalama
- **Error Boundaries**: UI hatalarını yakalama
- **Fallback Mekanizmaları**: IndexedDB hata durumunda localStorage
- **Logging**: Detaylı log sistemi (config.js)

---

## 🎓 SONUÇ

Bu dokümantasyon, Hasene Arapça Oyunu'nun tüm özelliklerini, sistemlerini, fonksiyonlarını ve teknik detaylarını kapsamaktadır. Başka bir AI uygulamasına bu dokümantasyonu vererek aynı oyunu geliştirebilirsiniz.

**Önemli Noktalar**:
- Tüm puan hesaplamaları detaylı açıklanmıştır
- Tüm görev türleri ve ödüller listelenmiştir
- Tüm modal ve panel yapıları açıklanmıştır
- Veri yapıları ve saklama mekanizmaları detaylandırılmıştır
- Fonksiyon isimleri ve parametreleri belirtilmiştir
- Tasarım renkleri ve CSS yapısı açıklanmıştır

**Eksik Kalmaması Gerekenler**:
- Tüm localStorage key'leri
- Tüm IndexedDB key'leri
- Tüm modal yapıları
- Tüm oyun modları ve alt modları
- Tüm puan hesaplama formülleri
- Tüm görev türleri ve ödüller
- Tüm başarım türleri
- Tüm fonksiyon isimleri

Bu dokümantasyon ile oyunun %100'ü yeniden oluşturulabilir.

---

**Dokümantasyon Tarihi**: 2025-12-06
**Versiyon**: 1.0.0
**Hazırlayan**: AI Assistant

