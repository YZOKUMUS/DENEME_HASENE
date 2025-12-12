# 📧 Email Signup'ları Açma Rehberi

## ❌ Hata Mesajı
```
AuthApiError: Email signups are disabled
```

Bu hata, Supabase Dashboard'da **email provider'ın kapalı olmasından** kaynaklanır.

---

## ⚠️ ÖNEMLİ FARK

- **Email Provider**: Email ile kayıt/giriş yapmayı sağlar (BU AÇIK OLMALI ✅)
- **Email Confirmation**: Kayıt sonrası email doğrulama zorunluluğu (BU KAPALI OLABİLİR ⚠️)

**İKİSİ FARKLI ŞEYLER!**

---

## ✅ Çözüm: Email Provider'ı Açma

### Adım 1: Supabase Dashboard'a Giriş
1. https://app.supabase.com adresine gidin
2. Projenizi seçin (hasene projesi)

### Adım 2: Authentication → Providers
1. Sol menüden **"Authentication"** sekmesine tıklayın
2. **"Providers"** sekmesine gidin

### Adım 3: Email Provider'ını AÇIN ✅
1. **"Email"** provider'ını bulun
2. **"Enable email provider"** toggle'ını **MUTLAKA AÇIK (ON)** yapın
3. **"Save"** butonuna tıklayın

### Adım 4: Email Confirmation'ı Kapatın (Önerilen) ⚠️
Email doğrulama istemiyorsanız:
1. Aynı sayfada **"Confirm email"** toggle'ını **KAPALI (OFF)** yapın
2. **"Save"** butonuna tıklayın

---

## 📸 Görsel Rehber

```
Authentication → Providers → Email

┌─────────────────────────────────────┐
│ Email Provider                      │
├─────────────────────────────────────┤
│ ☑️ Enable email provider  [ON] ✅   │  ← BU MUTLAKA AÇIK OLMALI!
│                                     │
│ ☐ Confirm email          [OFF] ⚠️  │  ← Bu kapatılabilir
│                                     │
│         [Save]                      │
└─────────────────────────────────────┘
```

---

## 🔍 Kontrol Listesi

- [ ] Supabase Dashboard'a giriş yaptım
- [ ] Authentication → Providers → Email sayfasına gittim
- [ ] **"Enable email provider"** toggle'ını **AÇIK (ON)** yaptım ✅
- [ ] **"Confirm email"** toggle'ını **KAPALI (OFF)** yaptım (opsiyonel)
- [ ] **"Save"** butonuna tıkladım
- [ ] Uygulamayı yeniledim (F5)
- [ ] Kayıt olmayı denedim

---

## ✅ Test Etme

1. Uygulamayı yenileyin (F5)
2. "Kayıt Ol" sekmesine gidin
3. Email ve şifre girin
4. Kayıt ol butonuna tıklayın
5. Artık hata almamalısınız!

---

## 🆘 Sorun Devam Ederse

1. Supabase Dashboard'da **Authentication** → **Users** sekmesine gidin
2. Manuel olarak bir kullanıcı oluşturmayı deneyin
3. Eğer bu da çalışmıyorsa:
   - Projenizin aktif olduğundan emin olun
   - API keys'lerin doğru olduğunu kontrol edin
   - Browser console'da başka hata var mı kontrol edin

---

## 📝 Özet

**MUTLAKA YAPILMASI GEREKEN:**
- ✅ **"Enable email provider"** → **AÇIK (ON)**

**YAPILABİLECEK:**
- ⚠️ **"Confirm email"** → **KAPALI (OFF)** (email doğrulama istemiyorsanız)
