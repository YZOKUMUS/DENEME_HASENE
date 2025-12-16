# Kelime Tekrar Sorulma Sıklığı Analizi

## Mevcut Sistem Nasıl Çalışıyor?

### Öncelik Sistemi (Öncelik Değeri = Seçilme Olasılığı)

1. **Son Yanlış Cevaplanan Kelimeler** (En Yüksek Öncelik)
   - Bugün yanlış: **100x öncelik**
   - Dün yanlış: **50x öncelik**
   - 2 gün önce yanlış: **25x öncelik**
   - 3 gün önce yanlış: **12x öncelik**
   - 4+ gün önce: **0x öncelik** (normal kategoriye düşer)

2. **Zorlanılan Kelimeler** (Başarı Oranı < 50% ve En Az 2 Deneme)
   - Normal mod: **3x öncelik**
   - Review mod: **10x öncelik**

3. **Düşük Ustalık Seviyesi** (0-3 seviye, attempts > 0)
   - **2x öncelik**

4. **Hiç Denenmemiş Kelimeler**
   - **5x öncelik**

5. **Normal Kelimeler** (İyi bilinen, yüksek başarı oranı)
   - **1x öncelik** (en düşük)

### Tekrar Sorulma Sıklığı (Deneme Sayısına Göre)

**Mevcut sistemde deneme sayısı direkt öncelik belirlemiyor.** Bunun yerine:

- **1. Deneme**: Hiç denenmemiş → 5x öncelik
- **2. Deneme**: 
  - Eğer 1. denemede yanlış → Son yanlış kategorisinde (100x öncelik)
  - Eğer 1. denemede doğru → Normal kategori (1x öncelik)
- **3. Deneme**:
  - Eğer başarı oranı < 50% → Zorlanılan (3x öncelik)
  - Eğer başarı oranı ≥ 50% → Normal (1x öncelik)
- **4+ Deneme**:
  - Başarı oranına göre kategorize edilir
  - Yüksek başarı oranı → Düşük öncelik
  - Düşük başarı oranı → Yüksek öncelik

### Örnek Senaryolar

#### Senaryo 1: Başarılı Öğrenme
- 1. deneme: Doğru → Normal (1x)
- 2. deneme: Doğru → Normal (1x)
- 3. deneme: Doğru → Normal (1x)
- **Sonuç**: Düşük öncelik, nadiren tekrar sorulur

#### Senaryo 2: Zorlanılan Kelime
- 1. deneme: Yanlış → Son yanlış (100x)
- 2. deneme: Yanlış → Son yanlış (100x) + Zorlanılan (3x)
- 3. deneme: Doğru → Zorlanılan (3x) [Başarı: 33%]
- **Sonuç**: Yüksek öncelik, sık tekrar sorulur

#### Senaryo 3: Karışık Durum
- 1. deneme: Doğru → Normal (1x)
- 2. deneme: Yanlış → Son yanlış (100x)
- 3. deneme: Doğru → Normal (1x) [Başarı: 67%]
- **Sonuç**: İlk birkaç gün yüksek öncelik, sonra normal

### Oyun Başına Tekrar Olasılığı

Her oyun **10 soru** içerir. Algoritma:

1. **Yüksek öncelikli kelimelerden** (öncelik ≥ 10) en fazla **5 kelime** seçer
2. **Kalan 5 kelime** ağırlıklı rastgele seçilir (öncelik skoruna göre)

### Tekrar Sorulma İstatistikleri (Tahmini)

Bir kelimenin tekrar sorulma olasılığı:

- **1. denemeden sonra**: 
  - Yanlış cevap → %80-90 olasılık (sonraki 1-3 oyunda)
  - Doğru cevap → %10-20 olasılık (rastgele)
  
- **2. denemeden sonra**:
  - Her ikisi de yanlış → %90-95 olasılık (zorlanılan kategori)
  - Biri doğru, biri yanlış → %50-70 olasılık
  - Her ikisi de doğru → %5-10 olasılık
  
- **3. denemeden sonra**:
  - Başarı < 50% → %70-85 olasılık (zorlanılan)
  - Başarı ≥ 50% → %20-40 olasılık
  - Başarı ≥ 80% → %5-15 olasılık

### Önerilen İyileştirmeler

Eğer deneme sayısına göre daha kontrollü bir sistem istiyorsanız:

1. **Deneme sayısına göre öncelik ekleme**
   - 1 deneme: 5x
   - 2 deneme: 3x
   - 3 deneme: 2x
   - 4+ deneme: 1x (başarı oranına göre)

2. **Zaman bazlı tekrar sistemi**
   - Son sorulma tarihine göre öncelik
   - Örn: 7 gün önce sorulduysa yüksek öncelik

3. **Spaced Repetition (Aralıklı Tekrar)**
   - Ebbinghaus unutma eğrisine göre
   - 1 gün, 3 gün, 7 gün, 14 gün aralıklarla

