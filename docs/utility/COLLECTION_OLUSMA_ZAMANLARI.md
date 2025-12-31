# 🔥 Firebase Collection'ları - Ne Zaman Oluşur?

## ✅ OYUN OYNANDIKÇA OTOMATİK OLUŞANLAR

### 1️⃣ **`users`** - Giriş Yaptığınızda
- **Ne zaman**: İlk giriş yaptığınızda
- **Otomatik**: ✅ Evet
- **Bekleme**: Giriş yaptıktan hemen sonra

### 2️⃣ **`user_stats`** - İlk Puan Kazandığınızda
- **Ne zaman**: İlk soruyu doğru cevapladığınızda
- **Otomatik**: ✅ Evet
- **Bekleme**: İlk oyun oynadıktan sonra

### 3️⃣ **`user_reports`** - İlk Puan Kazandığınızda
- **Ne zaman**: `user_stats` ile birlikte
- **Otomatik**: ✅ Evet
- **Bekleme**: İlk oyun oynadıktan sonra

### 4️⃣ **`daily_tasks`** - Günlük Görevler Oluşturulduğunda
- **Ne zaman**: Ana menüye ilk giriş yaptığınızda veya gün değiştiğinde
- **Otomatik**: ✅ Evet
- **Bekleme**: Ana menüyü açtığınızda

### 5️⃣ **`user_achievements`** - İlk Rozet Kazandığınızda
- **Ne zaman**: İlk rozet kazandığınızda
- **Otomatik**: ✅ Evet
- **Bekleme**: İlk rozet kazanana kadar

### 6️⃣ **`daily_stats`** - Günlük İstatistik Kaydedildiğinde
- **Ne zaman**: Gün sonunda veya oyun bitince
- **Otomatik**: ✅ Evet
- **Bekleme**: Oyun oynadıktan sonra

### 7️⃣ **`weekly_stats`** - Haftalık İstatistik Kaydedildiğinde
- **Ne zaman**: Hafta sonunda veya oyun bitince
- **Otomatik**: ✅ Evet
- **Bekleme**: Hafta içinde oyun oynadıktan sonra

### 8️⃣ **`monthly_stats`** - Aylık İstatistik Kaydedildiğinde
- **Ne zaman**: Ay sonunda veya oyun bitince
- **Otomatik**: ✅ Evet
- **Bekleme**: Ay içinde oyun oynadıktan sonra

### 9️⃣ **`weekly_tasks`** - Haftalık Görevler Oluşturulduğunda
- **Ne zaman**: Haftalık görevler aktif olduğunda
- **Otomatik**: ✅ Evet (eğer haftalık görevler aktifse)
- **Bekleme**: Haftalık görevler sistemi aktif olduğunda

---

## ⏳ KULLANILDIĞINDA OLUŞANLAR

### 🔟 **`word_stats`** - Kelime İstatistiği Kaydedildiğinde
- **Ne zaman**: Bir kelime için ilk istatistik kaydedildiğinde
- **Otomatik**: ✅ Evet
- **Bekleme**: Kelime istatistikleri aktif olduğunda

### 1️⃣1️⃣ **`favorites`** - İlk Favori Eklendiğinde
- **Ne zaman**: İlk kelimeyi favorilere eklediğinizde
- **Otomatik**: ✅ Evet
- **Bekleme**: Favori ekleme özelliği kullanıldığında

### 1️⃣2️⃣ **`achievements`** - İlk Başarım Kazandığınızda
- **Ne zaman**: İlk başarım kazandığınızda
- **Otomatik**: ✅ Evet
- **Bekleme**: Başarım sistemi aktif olduğunda

### 1️⃣3️⃣ **`badges`** - Eski Sistem (Kullanılmıyor Olabilir)
- **Ne zaman**: Eski rozet sistemi kullanıldığında
- **Otomatik**: ⚠️ Belirsiz (eski sistem)
- **Bekleme**: Eski sistem aktifse

---

## 📊 ÖZET: HEMEN GÖRÜNMESİ GEREKENLER

**Oyun oynadıktan sonra şunlar görünmeli:**
1. ✅ `users` - Giriş yaptıktan sonra
2. ✅ `user_stats` - İlk soruyu cevapladıktan sonra
3. ✅ `user_reports` - İlk soruyu cevapladıktan sonra
4. ✅ `daily_tasks` - Ana menüye girdiğinizde

**Biraz daha bekleyin:**
5. ⏳ `user_achievements` - İlk rozet kazandığınızda
6. ⏳ `daily_stats` - Gün sonunda veya oyun bitince
7. ⏳ `weekly_stats` - Hafta sonunda
8. ⏳ `monthly_stats` - Ay sonunda

---

## 🚀 HIZLI TEST

**1. Giriş yapın** (YZOKUMUS)
**2. Ana menüye gidin** → `daily_tasks` oluşur
**3. Bir oyun oynayın** (1 soru cevaplayın) → `user_stats`, `user_reports` oluşur
**4. Firebase Console'u yenileyin** (F5)
**5. Collection'ları kontrol edin**

---

## 💡 İPUCU

Eğer hemen görmek istiyorsanız:
```javascript
// Browser Console'da (F12)
createAllCollections()
```

Bu script tüm collection'ları hemen oluşturur!
