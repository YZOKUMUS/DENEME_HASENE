# 🔐 Google Cloud Console'da OAuth Client ID Oluşturma

## 📋 Adım Adım Rehber

### Adım 1: Google Cloud Console'a Giriş

1. **Google Cloud Console**'a gidin:
   - https://console.cloud.google.com/

2. Google hesabınızla giriş yapın

3. **Proje seçin** (üst kısımda):
   - Mevcut bir proje varsa seçin
   - Yoksa **"+ NEW PROJECT"** butonuna tıklayın
   - Proje adı: "Hasene" (veya istediğiniz isim)
   - **CREATE** butonuna tıklayın

---

### Adım 2: OAuth Consent Screen Ayarları (İlk Defa İse)

**Not:** İlk defa OAuth Client ID oluşturuyorsanız önce OAuth Consent Screen'i ayarlamanız gerekir.

1. Sol menüden **"APIs & Services"** → **"OAuth consent screen"** seçin

2. **User Type** seçin:
   - **External** (genel kullanım için) ✅ Önerilen
   - **Internal** (sadece Google Workspace için)

3. **"CREATE"** butonuna tıklayın

4. **App information** bölümü:
   - **App name**: `Hasene` (veya istediğiniz isim)
   - **User support email**: Email adresinizi seçin
   - **Developer contact information**: Email adresinizi girin
   - **SAVE AND CONTINUE** butonuna tıklayın

5. **Scopes** bölümü:
   - Varsayılan scope'lar yeterli
   - **SAVE AND CONTINUE** butonuna tıklayın

6. **Test users** bölümü (opsiyonel):
   - Test modundaysa test kullanıcılarını ekleyebilirsiniz
   - **SAVE AND CONTINUE** butonuna tıklayın

7. **Summary** bölümü:
   - Ayarları kontrol edin
   - **BACK TO DASHBOARD** butonuna tıklayın

---

### Adım 3: OAuth Client ID Oluşturma

1. Sol menüden **"APIs & Services"** → **"Credentials"** seçin

2. Üstte **"+ CREATE CREDENTIALS"** butonuna tıklayın

3. **"OAuth client ID"** seçeneğini seçin

4. **Application type** seçin:
   - **Web application** ✅ (Bu seçeneği seçin)

5. **Name** bölümü:
   - İsim: `Hasene Web Client` (veya istediğiniz isim)

6. **Authorized JavaScript origins** (Opsiyonel):
   - Bu bölümü boş bırakabilirsiniz

7. **Authorized redirect URIs** bölümü ⭐ (ÖNEMLİ!):
   - **"+ ADD URI"** butonuna tıklayın
   - Şu URL'i ekleyin:
     ```
     https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback
     ```
     *(Kendi Supabase project URL'inizi kullanın - `ldsudrqanyjqisdunikn` yerine kendi proje URL'iniz)*
   
   **Nasıl bulunur?**
   - Supabase Dashboard → Settings → API
   - **Project URL** kısmındaki URL'i kullanın
   - Örnek: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`

8. **"CREATE"** butonuna tıklayın

9. ✅ **ÖNEMLİ!** Açılan pencerede:
   - **Your Client ID** değerini kopyalayın 📋
   - **Your Client Secret** değerini kopyalayın 📋
   
   ⚠️ **UYARI:** Client Secret bir daha gösterilmeyecek! Şimdi kopyalayın ve güvenli bir yere kaydedin.

10. **OK** butonuna tıklayın

---

## ✅ Tamamlandı!

Artık şunlara sahipsiniz:
- ✅ **Client ID** (örnek: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
- ✅ **Client Secret** (örnek: `GOCSPX-abcdefghijklmnopqrstuvwxyz`)

---

## 🔄 Sıradaki Adım: Supabase'e Ekleme

Şimdi bu bilgileri Supabase'e eklemeniz gerekiyor:

1. **Supabase Dashboard**'a gidin:
   - https://app.supabase.com

2. Projenizi seçin

3. Sol menüden **"Authentication"** → **"Providers"** seçin

4. **"Google"** provider'ını bulun

5. **"Enable Google"** butonuna tıklayın (veya zaten enable ise ayarlara tıklayın)

6. Şu bilgileri girin:
   - **Client ID (for OAuth)**: Google'dan kopyaladığınız Client ID'yi yapıştırın
   - **Client Secret (for OAuth)**: Google'dan kopyaladığınız Client Secret'ı yapıştırın

7. **"SAVE"** butonuna tıklayın

8. ✅ **TAMAMLANDI!** Artık Google OAuth çalışmalı.

---

## 📸 Görsel Konumlar

### Google Cloud Console:
```
Google Cloud Console
├── Sol Menü
│   └── APIs & Services
│       ├── OAuth consent screen (ilk defa ise)
│       └── Credentials
│           └── + CREATE CREDENTIALS
│               └── OAuth client ID
```

### Supabase Dashboard:
```
Supabase Dashboard
├── Sol Menü
│   └── Authentication
│       └── Providers
│           └── Google
│               └── Enable Google
│                   ├── Client ID
│                   └── Client Secret
```

---

## ❓ Sık Sorulan Sorular

### S: Supabase Project URL'i nereden bulunur?
**C:** Supabase Dashboard → Settings → API → Project URL

### S: Client Secret'ı kaybettim, ne yapmalıyım?
**C:** Yeni bir OAuth Client ID oluşturmanız gerekir. Eski Client ID'yi silebilir veya yeni bir tane ekleyebilirsiniz.

### S: Test modunda çalışıyor mu?
**C:** Evet, OAuth Consent Screen test modundaysa sadece eklediğiniz test kullanıcıları giriş yapabilir. Production için yayınlamanız gerekebilir.

### S: Birden fazla redirect URI ekleyebilir miyim?
**C:** Evet, her redirect URI'yi ayrı ayrı ekleyebilirsiniz.

---

## ✅ Kontrol Listesi

- [ ] Google Cloud Console'a giriş yapıldı
- [ ] Proje seçildi veya oluşturuldu
- [ ] OAuth Consent Screen ayarlandı (ilk defa ise)
- [ ] OAuth Client ID oluşturuldu
- [ ] Redirect URI eklendi: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
- [ ] Client ID kopyalandı
- [ ] Client Secret kopyalandı
- [ ] Supabase'e eklendi

---

## 🎯 Hızlı Başlangıç

**5 dakikada:**
1. https://console.cloud.google.com/ → Proje seç
2. APIs & Services → Credentials → + CREATE CREDENTIALS → OAuth client ID
3. Web application seç → Redirect URI ekle → CREATE
4. Client ID ve Secret'ı kopyala
5. Supabase → Authentication → Providers → Google → Enable → Bilgileri gir → SAVE

✅ **TAMAMLANDI!**

