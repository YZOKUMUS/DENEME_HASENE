# 📱 Yeni Kullanıcı İlk Adımlar Rehberi

## 🎯 Cep Telefonundan İlk Açılış

### Adım 1: Uygulamayı Açın
1. Tarayıcıdan (Chrome, Safari, vs.) uygulamayı açın
2. Veya **PWA** olarak yüklüyse, ana ekrandan açın

---

### Adım 2: İlk Açılışta Onboarding (Tanıtım)
- İlk açılışta **tanıtım ekranları** gösterilir
- 6 adımlık tanıtım:
  1. Hoş geldiniz
  2. Ders türleri
  3. Hasene ve ilerleme
  4. Görevler ve seri
  5. Rozetler
  6. Başla butonu

**Not:** Tanıtımı atlayabilir veya okuyabilirsiniz.

---

### Adım 3: Kayıt Ol / Giriş Yap (Önerilen)

#### ❓ Neden Kayıt Olmalıyım?
- ✅ Verileriniz bulut'a kaydedilir (telefon değiştirseniz bile verileriniz kaybolmaz)
- ✅ Liderlik tablosunda yer alırsınız
- ✅ Haftalık liglerde yarışırsınız
- ✅ Başarımlar ve rozetler kaydedilir

#### 🔐 Kayıt Olma
1. Sağ üstteki **"🔐 Giriş"** butonuna tıklayın
2. **"Kayıt Ol"** sekmesine geçin
3. Bilgilerinizi girin:
   - **Kullanıcı Adı** (örn: ali123)
   - **Email** (örn: ali@example.com)
   - **Şifre** (en az 6 karakter)
   - **Şifre Tekrar**
4. **"Kayıt Ol"** butonuna tıklayın
5. ✅ Başarılı olursa otomatik giriş yapılır

**Not:** Email confirmation kapalıysa direkt giriş yapılır.

---

### Adım 4: İlk Oyunu Oynayın
1. Ana menüde **oyun modu** seçin (örn: "Kelime Çevir")
2. **Zorluk seviyesi** seçin:
   - 🌱 Kolay
   - ⚖️ Orta (önerilen)
   - 🔥 Zor
3. Oyunu başlatın
4. 10 soru cevaplayın
5. Oyun biter → **Sonuç ekranı** görünür
6. **"Ana Menüye Dön"** butonuna tıklayın

---

### Adım 5: İstatistikleri Kontrol Edin
Ana menüde üstteki rakamları kontrol edin:
- **Hasene**: Kazandığınız puan
- **⭐ Yıldız**: Yıldız puanı
- **Mertebe**: Seviyeniz (1'den başlar)
- **🔥 Seri**: Günlük seri sayınız

**✅ Bu rakamlar hemen güncellenmiş olmalı!**

---

### Adım 6: Supabase'de Verileri Kontrol Edin

#### 🖥️ Bilgisayardan Supabase Dashboard'a gidin:
1. https://app.supabase.com
2. Projenizi seçin
3. **Table Editor** sekmesine gidin

#### 📋 Kontrol Edilecek Tablolar:

##### 1. `profiles` Tablosu
- ✅ Kullanıcı adınız görünmeli
- ✅ `id` sütunu (UUID)

##### 2. `user_stats` Tablosu
- ✅ `total_points`: Kazandığınız Hasene
- ✅ `badges`: Rozetler
- ✅ `streak_data`: Seri bilgileri
- ✅ `game_stats`: Oyun istatistikleri

##### 3. `weekly_leaderboard` Tablosu
- ✅ `weekly_xp`: Bu hafta kazandığınız XP
- ✅ `league`: Hangi ligdesiniz (mubtedi, talib, vs.)
- ✅ `position`: Ligdeki sıralamanız

##### 4. `daily_tasks` Tablosu
- ✅ Günlük görevler
- ✅ İlerleme durumu

##### 5. `achievements` Tablosu
- ✅ Kazandığınız başarımlar

##### 6. `badges` Tablosu
- ✅ Kazandığınız rozetler

---

### Adım 7: Liderlik Tablosunu Kontrol Edin
1. Ana menüde alt navigasyondan **"🏅 Ligler"** butonuna tıklayın
2. **Liderlik tablosu** açılır
3. Kendi liginizi ve sıralamanızı görün
4. Diğer oyuncuları görün

---

## ✅ Kontrol Listesi

### İlk Oyun Sonrası Kontrol:
- [ ] Ana menüdeki rakamlar güncellendi mi? (Hasene, Yıldız, Mertebe, Seri)
- [ ] Günlük hedef progress bar güncellendi mi?
- [ ] Supabase Dashboard'da `user_stats` tablosunda veriler var mı?
- [ ] `weekly_leaderboard` tablosunda kaydım var mı?
- [ ] Liderlik tablosunu açabiliyor muyum?
- [ ] Görevler (Vazifeler) görünüyor mu?

---

## 🎮 İlk Oyun Sonrası Ne Olur?

### Otomatik Olarak:
1. ✅ Hasene puanınız artar
2. ✅ Yıldız puanınız artar
3. ✅ Mertebe (seviye) artabilir
4. ✅ Seri başlar (eğer günlük hedef tamamlandıysa)
5. ✅ Günlük görevler güncellenir
6. ✅ Haftalık lig'e kaydolursunuz
7. ✅ Başarımlar ve rozetler kontrol edilir

### Supabase'e Kaydedilir:
- ✅ `user_stats` → İstatistikler
- ✅ `weekly_leaderboard` → Liderlik tablosu
- ✅ `daily_tasks` → Günlük görevler
- ✅ `achievements` → Başarımlar (varsa)
- ✅ `badges` → Rozetler (varsa)

---

## 🔍 Sorun Giderme

### Problem: Rakamlar güncellenmedi
**Çözüm:**
- Sayfayı yenileyin (F5 veya tarayıcı yenile butonu)
- Console'da hata var mı kontrol edin (F12)

### Problem: Supabase'de veriler görünmüyor
**Çözüm:**
1. Giriş yaptığınızdan emin olun
2. Supabase Dashboard'da tabloyu refresh edin
3. `user_id` ile filtreleme yapın
4. Console'da hata var mı kontrol edin

### Problem: Liderlik tablosu açılmıyor
**Çözüm:**
1. Giriş yaptığınızdan emin olun
2. En az bir oyun oynayın (puan kazanın)
3. Console'da hata var mı kontrol edin

---

## 📝 Özet

### İlk Açılışta Yapılacaklar:
1. ✅ Uygulamayı açın
2. ✅ Kayıt olun (veya giriş yapın)
3. ✅ İlk oyunu oynayın
4. ✅ Ana menüdeki rakamları kontrol edin
5. ✅ Supabase Dashboard'da verileri kontrol edin
6. ✅ Liderlik tablosunu açın

**Hepsi bu kadar! 🎉**

---

## 🎯 Test Senaryosu

### Tam Test Senaryosu:
1. ✅ Cep telefonundan uygulamayı aç
2. ✅ "🔐 Giriş" butonuna tıkla
3. ✅ "Kayıt Ol" sekmesine geç
4. ✅ Bilgileri gir ve kayıt ol
5. ✅ Ana menüye dön
6. ✅ Bir oyun oyna (10 soru)
7. ✅ Oyun bitince ana menüye dön
8. ✅ Üstteki rakamları kontrol et → Güncellenmiş mi?
9. ✅ Bilgisayardan Supabase Dashboard aç
10. ✅ `user_stats` tablosunu kontrol et → Veriler var mı?
11. ✅ `weekly_leaderboard` tablosunu kontrol et → Kayıt var mı?

**✅ Hepsi başarılı olmalı!**

