# 📧 Email Signup'ları Açma Rehberi

## ❌ Hata Mesajı
```
AuthApiError: Email signups are disabled
```

Bu hata, Supabase Dashboard'da email signup'ların kapalı olmasından kaynaklanır.

---

## ✅ Çözüm: Email Signup'ları Açma

### Adım 1: Supabase Dashboard'a Giriş
1. https://app.supabase.com adresine gidin
2. Projenizi seçin (hasene projesi)

### Adım 2: Authentication Ayarlarına Git
1. Sol menüden **"Authentication"** sekmesine tıklayın
2. **"Providers"** sekmesine gidin

### Adım 3: Email Provider'ını Aç
1. **"Email"** provider'ını bulun
2. **"Enable email provider"** toggle'ını **AÇIK** (ON) yapın
3. **"Save"** butonuna tıklayın

### Adım 4: Email Confirmation'ı Kapat (Opsiyonel)
Eğer email confirmation istemiyorsanız:
1. Aynı sayfada **"Confirm email"** toggle'ını **KAPALI** (OFF) yapın
2. **"Save"** butonuna tıklayın

---

## 🔄 Alternatif Yöntem: Settings Üzerinden

Eğer yukarıdaki yöntem çalışmazsa:

1. **Authentication** → **Settings** sekmesine gidin
2. **"Enable email signups"** toggle'ını **AÇIK** (ON) yapın
3. **"Enable email confirmations"** toggle'ını **KAPALI** (OFF) yapın (opsiyonel)
4. **"Save"** butonuna tıklayın

---

## 📝 Notlar

- Email signup'ları açtıktan sonra değişiklikler hemen aktif olur
- Email confirmation kapalıysa, kullanıcılar email doğrulaması yapmadan giriş yapabilir
- Email confirmation açıksa, kullanıcılar kayıt olduktan sonra email'lerine gelen linki tıklamalıdır

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
3. Eğer bu da çalışmıyorsa, Supabase projenizin aktif olduğundan emin olun

