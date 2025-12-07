# Dil Öğretme Uygulamalarının Kullandığı Yöntemler

## 1. Spaced Repetition (Aralıklı Tekrar) - En Yaygın Yöntem

### Temel Prensip
**Ebbinghaus Unutma Eğrisi**: İnsan beyni öğrendiği bilgileri zamanla unutur. Ancak doğru aralıklarla tekrar edilirse, bilgi uzun süreli hafızaya kalıcı olarak kaydedilir.

### Popüler Algoritmalar

#### A. SM-2 Algorithm (SuperMemo 2)
**En yaygın kullanılan algoritma** - Anki, Memrise gibi uygulamaların temelini oluşturur.

**Formül:**
```
EF (Ease Factor) = Öğrenme kolaylığı faktörü (başlangıç: 2.5)
I (Interval) = Tekrar aralığı (gün cinsinden)

İlk doğru cevap: I = 1 gün
İkinci doğru cevap: I = 6 gün
Sonraki doğru cevaplar: I = I × EF

Ease Factor güncellemesi:
- Kolay cevap (4/5): EF = EF + 0.15
- Normal cevap (3/5): EF değişmez
- Zor cevap (2/5): EF = EF - 0.15
- Çok zor (1/5): EF = EF - 0.20
```

**Örnek Tekrar Zamanları:**
- 1. doğru: 1 gün sonra
- 2. doğru: 6 gün sonra
- 3. doğru: 15 gün sonra (6 × 2.5)
- 4. doğru: 37 gün sonra (15 × 2.5)
- 5. doğru: 92 gün sonra (37 × 2.5)

#### B. Anki Algorithm (SM-2'nin Geliştirilmiş Versiyonu)
- SM-2'ye benzer ama daha esnek
- Minimum interval ayarları
- Maximum interval limitleri
- Graduating interval (mezuniyet aralığı)

#### C. Duolingo'nun Yaklaşımı
**"Half-Life Regression" Modeli:**
- Her kelime için bir "unutma olasılığı" hesaplar
- Kullanıcının performansına göre tekrar zamanını ayarlar
- Yanlış cevap verilirse, tekrar süresi kısalır
- Doğru cevap verilirse, tekrar süresi uzar

**Duolingo Tekrar Stratejisi:**
- İlk öğrenme: Hemen tekrar
- 1. tekrar: 4 saat sonra
- 2. tekrar: 1 gün sonra
- 3. tekrar: 3 gün sonra
- 4. tekrar: 1 hafta sonra
- 5. tekrar: 2 hafta sonra
- Sonraki: Performansa göre 1-3 ay

#### D. Memrise Yaklaşımı
- "Watering" sistemi: Kelimeler "susuz" hale gelir
- Her kelime için bir "sonraki tekrar" zamanı
- Yanlış cevap: Tekrar süresi sıfırlanır
- Doğru cevap: Tekrar süresi artar

## 2. Adaptive Learning (Uyarlamalı Öğrenme)

### Nasıl Çalışır?
1. **Başlangıç Seviyesi Belirleme**
   - Placement test
   - İlk birkaç soruya göre seviye tahmini

2. **Zorluk Ayarlama**
   - Doğru cevap → Zorluk artar
   - Yanlış cevap → Zorluk azalır
   - Sürekli doğru → Daha zor sorular
   - Sürekli yanlış → Daha kolay sorular

3. **Kişiselleştirme**
   - Zorlanılan konulara daha fazla odaklanma
   - İyi bilinen konuları atlama
   - Kullanıcının öğrenme hızına göre ayarlama

## 3. Leitner System (Kart Kutusu Sistemi)

### 5 Kutu Sistemi
```
Kutu 1: Her gün tekrar (yeni öğrenilenler)
Kutu 2: 2 günde bir tekrar
Kutu 3: 4 günde bir tekrar
Kutu 4: 8 günde bir tekrar
Kutu 5: 16 günde bir tekrar (ustalaşılanlar)
```

**Kurallar:**
- Doğru cevap → Bir sonraki kutuya geç
- Yanlış cevap → Kutu 1'e geri dön

## 4. Active Recall (Aktif Hatırlama)

### Yöntemler:
1. **Flash Cards**: Soru-cevap kartları
2. **Fill-in-the-blank**: Boşluk doldurma
3. **Multiple Choice**: Çoktan seçmeli
4. **Translation**: Çeviri yapma
5. **Production**: Üretim (yazma/konuşma)

## 5. Gamification (Oyunlaştırma)

### Öğeler:
- **Streak (Seri)**: Günlük oynama serisi
- **XP (Experience Points)**: Deneyim puanları
- **Levels**: Seviyeler
- **Badges**: Rozetler
- **Leaderboards**: Liderlik tabloları
- **Lives**: Can sistemi
- **Combo**: Ardışık doğru cevaplar

## 6. Microlearning (Mikro Öğrenme)

- Kısa oturumlar (5-15 dakika)
- Günlük hedefler
- Küçük parçalara bölünmüş içerik
- Sık tekrarlar

## 7. Contextual Learning (Bağlamsal Öğrenme)

- Kelimeleri cümle içinde öğretme
- Gerçek hayat senaryoları
- Hikaye tabanlı öğrenme
- Diyalog pratikleri

## Popüler Uygulamalar ve Yöntemleri

### Duolingo
- **Spaced Repetition**: Half-life regression
- **Gamification**: Streak, XP, Hearts
- **Adaptive**: Zorluk ayarlama
- **Microlearning**: 5-10 dakikalık dersler

### Anki
- **Spaced Repetition**: SM-2 algoritması
- **Active Recall**: Flash cards
- **Customizable**: Kullanıcı kendi kartlarını oluşturur

### Memrise
- **Spaced Repetition**: Watering sistemi
- **Mnemonic Devices**: Hafıza teknikleri
- **Video Clips**: Gerçek insanlardan öğrenme

### Babbel
- **Conversation-Based**: Konuşma odaklı
- **Grammar Integration**: Dilbilgisi entegrasyonu
- **Real-life Scenarios**: Gerçek hayat senaryoları

### Busuu
- **CEFR Aligned**: Seviye bazlı
- **Community Feedback**: Topluluk geri bildirimi
- **Offline Mode**: Çevrimdışı mod

## Önerilen Sistem (Hasene Oyunu İçin)

### Mevcut Sistemin İyileştirilmesi:

1. **Spaced Repetition Eklenmesi**
   ```javascript
   // Her kelime için:
   - nextReviewDate: Sonraki tekrar tarihi
   - easeFactor: Öğrenme kolaylığı (2.5 başlangıç)
   - interval: Tekrar aralığı (gün)
   
   // Doğru cevap:
   interval = interval * easeFactor
   easeFactor += 0.15 (kolay ise)
   
   // Yanlış cevap:
   interval = 1 gün (sıfırla)
   easeFactor -= 0.15
   ```

2. **Adaptive Difficulty**
   - Başarı oranına göre zorluk ayarlama
   - Sürekli doğru → Daha zor kelimeler
   - Sürekli yanlış → Daha kolay kelimeler

3. **Leitner System Entegrasyonu**
   - 5 seviyeli kutu sistemi
   - Her kutu için farklı tekrar süreleri

4. **Performance-Based Scheduling**
   - Son yanlış cevap tarihi
   - Başarı oranı
   - Ustalık seviyesi
   - Toplam deneme sayısı

### Örnek Algoritma:

```javascript
function calculateNextReview(wordStats) {
    const { attempts, correct, wrong, lastReview, easeFactor = 2.5 } = wordStats;
    const successRate = (correct / attempts) * 100;
    
    // İlk öğrenme
    if (attempts === 1) {
        return { interval: 1, easeFactor: 2.5 }; // 1 gün sonra
    }
    
    // İkinci doğru cevap
    if (attempts === 2 && correct === 2) {
        return { interval: 6, easeFactor: 2.5 }; // 6 gün sonra
    }
    
    // Sonraki tekrarlar
    let interval = wordStats.interval || 1;
    
    if (successRate >= 80) {
        // Başarılı → Aralığı artır
        interval = Math.floor(interval * easeFactor);
        easeFactor = Math.min(easeFactor + 0.15, 2.5); // Max 2.5
    } else if (successRate < 50) {
        // Başarısız → Aralığı azalt
        interval = Math.max(1, Math.floor(interval / 2));
        easeFactor = Math.max(1.3, easeFactor - 0.15); // Min 1.3
    }
    
    return {
        interval,
        easeFactor,
        nextReviewDate: addDays(today, interval)
    };
}
```

## Sonuç

Dil öğretme uygulamaları genellikle **Spaced Repetition** algoritmalarını kullanır. En etkili yöntem:

1. **SM-2 veya Anki algoritması** temel alınmalı
2. **Adaptive learning** ile kişiselleştirme
3. **Gamification** ile motivasyon
4. **Active recall** ile aktif öğrenme
5. **Contextual learning** ile gerçek hayat bağlantısı

Hasene oyunu için önerilen: **SM-2 benzeri bir spaced repetition sistemi** + **mevcut adaptive learning** kombinasyonu en etkili olacaktır.

