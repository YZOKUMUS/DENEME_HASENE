# 🔍 Backend'de Veri Kontrol Rehberi

## 📊 Konsolda Kontrol Etme

Sayfayı açtığınızda konsolda (F12) şu logları göreceksiniz:

### 1. Kullanıcı Kontrolü
```
🔍 Kullanıcı kontrolü başlatılıyor...
📥 getCurrentUser() sonucu: ✅ Kullanıcı var (user-id-123)
```

### 2. Backend Yükleme
```
📥 loadUserStats: Kullanıcı ID: user-id-123
📥 loadUserStats: Supabase'den veri çekiliyor...
```

### 3. Sonuç Senaryoları

#### ✅ Senaryo 1: Backend'de Veri VAR
```
✅ loadUserStats: Backend'den veri yüklendi: {
  total_points: 1500,
  badges: {...},
  currentStreak: 5,
  totalCorrect: 120
}
```

#### ⚠️ Senaryo 2: Backend'de Veri YOK (Normal - İlk Oyun)
```
⚠️ loadUserStats: Backend'de veri bulunamadı (PGRST116) - Kullanıcının henüz verisi yok
💡 İpucu: Oyun oynadığınızda veriler otomatik olarak backend'e kaydedilecek
```

#### ❌ Senaryo 3: Backend Hatası
```
❌ loadUserStats: Backend hatası: [hata detayları]
```

---

## 🗄️ Supabase Dashboard'da Kontrol Etme

### Adım 1: Supabase Dashboard'a Gidin
1. https://app.supabase.com adresine gidin
2. Projenizi seçin

### Adım 2: Table Editor'ü Açın
1. Sol menüden **"Table Editor"** sekmesine tıklayın
2. **`user_stats`** tablosunu açın

### Adım 3: Kullanıcı ID'nizi Bulun
Konsolda gördüğünüz kullanıcı ID'sini kopyalayın:
```
📥 getCurrentUser() sonucu: ✅ Kullanıcı var (abc123-def456-ghi789)
```

### Adım 4: Verileri Kontrol Edin
1. `user_stats` tablosunda `user_id` kolonunda kullanıcı ID'nizi arayın
2. Eğer satır varsa → ✅ Backend'de veri VAR
3. Eğer satır yoksa → ⚠️ Backend'de veri YOK (ilk oyun)

---

## 🔧 Sorun Giderme

### Problem: Konsolda "Backend'de veri bulunamadı" görüyorum

**Çözüm 1: İlk Oyun**
- Bu normal! İlk oyunu oynadığınızda veriler otomatik kaydedilecek
- Oyun bitince konsolda "Backend'e istatistikler kaydedildi" mesajını göreceksiniz

**Çözüm 2: RLS (Row Level Security) Sorunu**
1. Supabase Dashboard → **"Authentication"** → **"Policies"**
2. `user_stats` tablosu için politikaların aktif olduğunu kontrol edin
3. Şu politikalar olmalı:
   - ✅ "Users can view own stats" (SELECT)
   - ✅ "Users can update own stats" (UPDATE)
   - ✅ "Users can insert own stats" (INSERT)

**Çözüm 3: Manuel Kontrol**
Supabase SQL Editor'de şu sorguyu çalıştırın:
```sql
SELECT * FROM user_stats WHERE user_id = 'SİZİN-KULLANICI-ID-NİZ';
```

---

## 📝 Test Senaryosu

### 1. İlk Oyun Öncesi
- ✅ Konsolda: "Backend'de veri bulunamadı" → Normal
- ✅ Supabase'de: `user_stats` tablosunda satır yok → Normal

### 2. İlk Oyun Sonrası
- ✅ Konsolda: "Backend'e istatistikler kaydedildi"
- ✅ Supabase'de: `user_stats` tablosunda yeni satır oluştu
- ✅ `total_points` > 0 olmalı

### 3. Sayfa Yenileme
- ✅ Konsolda: "Backend'den veri yüklendi: {total_points: 1500, ...}"
- ✅ UI'da: Hasene, Yıldız, Seri değerleri görünür

---

## 🎯 Hızlı Kontrol Listesi

- [ ] Konsolu açtım (F12)
- [ ] "📥 loadUserStats" loglarını görüyorum
- [ ] Kullanıcı ID'mi buldum
- [ ] Supabase Dashboard'a gittim
- [ ] `user_stats` tablosunu açtım
- [ ] Kullanıcı ID'mi aradım
- [ ] Veri var mı yok mu kontrol ettim

---

## 💡 İpuçları

1. **İlk oyun**: Backend'de veri yoksa normal, oyun oynadıktan sonra oluşacak
2. **Sayfa yenileme**: Backend'den veriler otomatik yüklenecek
3. **Konsol logları**: Her zaman konsolu kontrol edin, sorunları gösterir
4. **RLS politikaları**: Eğer veri kaydedilemiyorsa RLS politikalarını kontrol edin



