# 🧪 Google OAuth Test Rehberi

## ✅ Redirect URL'ler Eklendi!

Şimdi Google OAuth'un çalışıp çalışmadığını test edelim.

---

## 📋 Kontrol Listesi

### 1. Google Cloud Console Ayarları
- [ ] OAuth Client ID oluşturuldu mu?
- [ ] Client ID ve Client Secret kopyalandı mı?
- [ ] Redirect URI eklendi: `https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback`

### 2. Supabase Dashboard Ayarları
- [ ] Authentication → Providers → Google → Enable edildi mi?
- [ ] Client ID ve Client Secret girildi mi?
- [ ] Authentication → URL Configuration → Redirect URLs eklendi mi? ✅ (TAMAMLANDI)

---

## 🧪 Test Adımları

### Test 1: Desktop'ta Test
1. Bilgisayarınızda `http://localhost:5500` adresini açın
2. Sağ üstteki **"🔐 Giriş"** butonuna tıklayın
3. **"Google ile Giriş Yap"** butonuna tıklayın
4. Google hesabınızı seçin
5. İzinleri onaylayın
6. ✅ Başarılı olmalı - otomatik olarak ana sayfaya yönlendirilmeli

**Beklenen sonuç:** Google'da giriş yaptıktan sonra uygulamaya geri dönülmeli.

---

### Test 2: Mobil Cihazda Test
1. Mobil cihazınızdan uygulamayı açın (aynı ağda olmalı)
2. Sağ üstteki **"🔐 Giriş"** butonuna tıklayın
3. **"Google ile Giriş Yap"** butonuna tıklayın
4. Google hesabınızı seçin
5. İzinleri onaylayın
6. ✅ Başarılı olmalı - otomatik olarak ana sayfaya yönlendirilmeli

**Beklenen sonuç:** Google'da giriş yaptıktan sonra mobil uygulamaya geri dönülmeli.

---

## ❌ Hata Durumunda

### Hata 1: "CODE 500 ERROR CODE UNEXPECTED_FAILURE"
**Çözüm:**
- Supabase Dashboard → Authentication → Providers → Google
- Client ID ve Client Secret'ın doğru girildiğinden emin olun
- **Enable Google** butonunun aktif olduğunu kontrol edin

---

### Hata 2: "redirect_uri_mismatch"
**Çözüm:**
- Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID
- **Authorized redirect URIs** bölümüne şunu ekleyin:
  ```
  https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback
  ```
  *(Kendi Supabase project URL'inizi kullanın)*

---

### Hata 3: Mobil Cihazda Çalışmıyor
**Çözüm:**
1. Mobil cihazınızın tarayıcısında uygulamayı açın
2. Tarayıcı adres çubuğundaki URL'i kopyalayın (örnek: `http://192.168.1.100:5500`)
3. Bu URL'i Supabase Dashboard → Authentication → URL Configuration → Redirect URLs bölümüne ekleyin:
   ```
   http://192.168.1.100:5500/**
   ```

---

## ✅ Başarılı Test Sonrası

Google OAuth çalışıyorsa:
- ✅ Kullanıcı otomatik olarak giriş yapmalı
- ✅ Avatar görünmeli
- ✅ Supabase Dashboard → Authentication → Users bölümünde kullanıcı görünmeli
- ✅ `profiles` tablosunda kullanıcı kaydı oluşmalı

---

## 🔍 Kontrol: Supabase'de Kullanıcı Var mı?

1. Supabase Dashboard → Authentication → Users
2. Google ile giriş yaptıktan sonra kullanıcı burada görünmeli
3. Email adresi Google hesabınızın email'i olmalı

---

## 📝 Sonuç

Test ettikten sonra sonucu paylaşın:
- ✅ Başarılı mı?
- ❌ Hata mı var? Hangi hata?

