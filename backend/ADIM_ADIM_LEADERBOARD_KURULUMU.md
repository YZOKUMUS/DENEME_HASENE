# 📋 Leaderboard Kurulumu - Adım Adım Rehber

## 🎯 Adım 1: SQL Dosyasını Aç

1. Proje klasörünüzde `backend` klasörüne gidin
2. `leaderboard-setup.sql` dosyasını açın
3. Tüm içeriği seçin (`Ctrl + A`)
4. Kopyalayın (`Ctrl + C`)

---

## 🎯 Adım 2: Supabase Dashboard'a Git

1. Tarayıcınızda şu adresi açın:
   ```
   https://supabase.com/dashboard
   ```

2. Giriş yapın (email/şifre veya Google ile)

3. Projenizi seçin (DENEME_HASENE projesi)

---

## 🎯 Adım 3: SQL Editor'ü Aç

1. Sol menüden **"SQL Editor"** sekmesine tıklayın
   - Veya direkt: https://supabase.com/dashboard/project/ldsudrqanyjqisdunikn/sql/new

2. **"New query"** butonuna tıklayın (sağ üstte)

3. Boş bir SQL editor açılacak

---

## 🎯 Adım 4: SQL Kodunu Yapıştır

1. SQL Editor'ün içine tıklayın

2. Kopyaladığınız SQL kodunu yapıştırın (`Ctrl + V`)

3. Kodun tamamen yapıştığını kontrol edin

---

## 🎯 Adım 5: SQL'i Çalıştır

1. SQL Editor'ün sağ alt köşesindeki **"Run"** butonuna tıklayın
   - Veya `Ctrl + Enter` tuşlarına basın

2. Biraz bekleyin (5-10 saniye)

3. Sonucu kontrol edin:
   - ✅ **Başarılı**: "Success. No rows returned" mesajı görünür
   - ❌ **Hata**: Kırmızı hata mesajı görünür (hata varsa bana gönderin)

---

## 🎯 Adım 6: Tabloları Kontrol Et

1. Sol menüden **"Table Editor"** sekmesine tıklayın

2. Şu tablolar görünmeli:
   - ✅ `weekly_leaderboard`
   - ✅ `user_leagues`
   - ✅ `league_config`

3. Eğer görünmüyorsa, sayfayı yenileyin (`F5`)

---

## 🎯 Adım 7: Fonksiyonları Kontrol Et

1. Sol menüden **"Database"** > **"Functions"** sekmesine gidin

2. Şu fonksiyon görünmeli:
   - ✅ `increment_weekly_xp`

---

## 🎯 Adım 8: View'ı Kontrol Et

1. Sol menüden **"Database"** > **"Views"** sekmesine gidin

2. Şu view görünmeli:
   - ✅ `league_rankings`

---

## ✅ Tamamlandı!

Eğer tüm adımlar başarılıysa, leaderboard sistemi hazır demektir!

Şimdi frontend'de test edebilirsiniz:
1. Tarayıcıda uygulamayı açın
2. Giriş yapın
3. Oyun oynayın (puan kazanın)
4. Alt nav bar'dan **"Ligler"** butonuna tıklayın
5. Leaderboard modal açılmalı

---

## ❌ Hata Alırsanız

Eğer herhangi bir adımda hata alırsanız:

1. Hata mesajını kopyalayın
2. Bana gönderin
3. Birlikte çözelim

**Yaygın Hatalar:**

- "relation already exists" → Tablolar zaten var, sorun değil
- "permission denied" → RLS policy hatası, düzeltebiliriz
- "function already exists" → Fonksiyon zaten var, sorun değil

---

## 📞 Yardım

Herhangi bir adımda takılırsanız, bana yazın. Adım adım yardımcı olurum!





