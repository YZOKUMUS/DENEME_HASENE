# VAZIFELER PANELİ MİMARİSİ VE VERİ AKIŞI

## 1. GÖREV OLUŞTURMA AKIŞI

```
checkDailyTasks() 
  → dailyTasks.lastTaskDate !== today kontrolü
  → generateDailyTasks(today)
    → DAILY_TASKS_TEMPLATE.map() → dailyTasks.tasks[]
    → DAILY_BONUS_TASKS_TEMPLATE.map() → dailyTasks.bonusTasks[]
  → dailyTasks.todayStats sıfırlanıyor
  → saveStats() → Firebase'e kaydediliyor
```

**Fonksiyonlar:**
- `checkDailyTasks()` (satır 4307): Günlük görevleri kontrol eder, yeni günse görevleri oluşturur
- `generateDailyTasks(date)` (satır 4461): Template'lerden görevleri oluşturur

## 2. PROGRESS GÜNCELLEME AKIŞI

### 2.1. Oyun Oynanırken
```
Oyun oynanıyor
  → saveDetailedStats() → dailyTasks.todayStats.toplamPuan güncelleniyor
  → updateTaskProgress(gameType, data) (satır 4458)
    → dailyTasks.todayStats değerleri güncelleniyor
    → Görev progress'leri güncelleniyor (task.progress = ...)
    → updateTasksDisplay() → UI güncelleniyor
    → saveDailyTasks() → Firebase'e kaydediliyor
```

### 2.2. Backend'den Yükleme Sonrası
```
loadStats()
  → loadDailyTasks() → Firebase'den daily_tasks yükleniyor
  → dailyTasks = backendDailyTasks
  → dailyTasks.todayStats güncelleniyor
  → updateTaskProgressFromStats() (satır 4651)
    → dailyTasks.todayStats değerlerini kullanarak görev progress'lerini güncelliyor
  → updateTasksDisplay() → UI güncelleniyor
```

**Fonksiyonlar:**
- `updateTaskProgress(gameType, data)`: Oyun oynanırken çağrılıyor
- `updateTaskProgressFromStats()`: Backend'den yükleme sonrası çağrılıyor
- `updateTasksDisplay()`: UI'ı güncelliyor

## 3. VERİ KAYNAKLARI

### 3.1. Görevler (Tasks)
- **Kaynak:** `DAILY_TASKS_TEMPLATE` ve `DAILY_BONUS_TASKS_TEMPLATE` (constants.js)
- **Saklama:** `dailyTasks.tasks[]` ve `dailyTasks.bonusTasks[]`
- **Backend:** Firebase `daily_tasks` collection'ında saklanıyor

### 3.2. Progress Değerleri
- **Kaynak:** `dailyTasks.todayStats` objesi
  - `toplamPuan`: `hasene_daily_${today}.points` (ANA KAYNAK)
  - `toplamDogru`: `hasene_daily_${today}.correct`
  - `ayetOku`, `duaEt`, `hadisOku`: Sayaçlar
  - `allGameModes`: Set (oyun modları)
- **Güncelleme:** `saveDetailedStats()` ve `updateTaskProgress()`

## 4. SORUN ANALİZİ

### Sorun 1: Görevler Backend'den Yüklenmiyor
**Durum:** Backend'den `daily_tasks` yüklenirken `tasks` ve `bonusTasks` array'leri yoksa görevler oluşturulmuyor.

**Çözüm:** `loadStats()` içinde backend'den yükleme sonrası görevler yoksa `checkDailyTasks()` çağrılmalı.

### Sorun 2: Progress Değerleri 0 Görünüyor
**Durum:** `updateTaskProgressFromStats()` çağrılıyor ama `dailyTasks.todayStats` değerleri 0.

**Olası Nedenler:**
1. Backend'den `todayStats.toplamPuan` değeri 0 olarak yükleniyor
2. `hasene_daily_${today}.points` ile senkronizasyon yapılmıyor
3. `updateTaskProgressFromStats()` çağrılmadan önce `todayStats` güncellenmiyor

### Sorun 3: UI Güncellenmiyor
**Durum:** `updateTasksDisplay()` çağrılıyor ama progress değerleri UI'da görünmüyor.

**Olası Nedenler:**
1. `task.progress` değerleri güncellenmiyor
2. DOM güncellemesi yapılmıyor
3. `updateTasksDisplay()` çağrılmıyor

## 5. ÇÖZÜM PLANI

### Adım 1: Görevlerin Oluşturulmasını Garanti Et
- `loadStats()` içinde backend'den yükleme sonrası görevler yoksa `checkDailyTasks()` çağrılmalı
- `updateTaskProgressFromStats()` içinde görevler yoksa `checkDailyTasks()` çağrılmalı

### Adım 2: Progress Değerlerinin Doğru Yüklenmesini Garanti Et
- Backend'den yükleme sonrası `dailyTasks.todayStats.toplamPuan` değeri `hasene_daily_${today}.points` ile senkronize edilmeli
- `updateTaskProgressFromStats()` çağrılmadan önce `todayStats` değerleri güncellenmiş olmalı

### Adım 3: UI Güncellemesini Garanti Et
- `updateTaskProgressFromStats()` çağrıldıktan sonra `updateTasksDisplay()` çağrılmalı
- `updateTasksDisplay()` içinde `task.progress` değerleri doğru kullanılmalı

## 6. KRİTİK NOKTALAR

1. **ANA KAYNAK:** `hasene_daily_${today}.points` - Bu değer her zaman doğru kabul edilmeli
2. **SENKRONİZASYON:** `dailyTasks.todayStats.toplamPuan` = `hasene_daily_${today}.points`
3. **GÖREV OLUŞTURMA:** Backend'den görevler yoksa mutlaka oluşturulmalı
4. **UI GÜNCELLEME:** Progress değerleri güncellendikten sonra UI mutlaka güncellenmeli
