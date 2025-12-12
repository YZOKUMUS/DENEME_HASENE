# ❌ Error 400: redirect_uri_mismatch - Çözüm

## 🔍 Sorun

```
Access blocked: This app's request is invalid
Error 400: redirect_uri_mismatch
```

Bu hata, Google Cloud Console'da tanımlı redirect URI ile Supabase'in kullandığı URI'nin eşleşmediği anlamına gelir.

---

## ✅ Çözüm: Adım Adım

### Adım 1: Supabase Project URL'inizi Bulun

1. **Supabase Dashboard**'a gidin:
   - https://app.supabase.com

2. Projenizi seçin

3. **Settings** (⚙️) → **API** sekmesine gidin

4. **Project URL** değerini kopyalayın:
   - Örnek: `https://ldsudrqanyjqisdunikn.supabase.co`
   - **Tam redirect URI**: `https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback`

---

### Adım 2: Google Cloud Console'da Redirect URI'yi Düzeltin

1. **Google Cloud Console**'a gidin:
   - https://console.cloud.google.com/

2. Projenizi seçin

3. Sol menüden **APIs & Services** → **Credentials** seçin

4. **OAuth 2.0 Client IDs** bölümünden Client ID'nize tıklayın (veya düzenleme ikonuna)

5. **Authorized redirect URIs** bölümünü bulun

6. **Mevcut URI'leri kontrol edin:**
   - Eğer yanlış bir URI varsa, düzeltin
   - Eğer hiç URI yoksa, yeni ekleyin

7. **"+ ADD URI"** butonuna tıklayın

8. **Şu URI'yi ekleyin:**
   ```
   https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback
   ```
   *(Kendi Supabase project URL'inizi kullanın)*

9. **SAVE** butonuna tıklayın

---

### Adım 3: URI Formatını Kontrol Edin

**Doğru format:**
```
https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
```

**Yanlış formatlar:**
```
❌ https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback/  (sonunda / var)
❌ https://ldsudrqanyjqisdunikn.supabase.co/callback  (yanlış path)
❌ http://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback  (http yerine https)
❌ https://app.supabase.com/auth/v1/callback  (yanlış domain)
```

**Önemli:**
- ✅ **HTTPS** olmalı (HTTP değil)
- ✅ Sonunda **"/"** olmamalı
- ✅ Tam path: `/auth/v1/callback`

---

### Adım 4: Bekleyin ve Test Edin

1. Google Cloud Console'da değişikliklerin kaydedilmesi **1-2 dakika** sürebilir

2. Uygulamanızı yenileyin (hard refresh: Ctrl+F5)

3. Google ile giriş yapmayı tekrar deneyin

---

## 🔍 Doğru Supabase Project URL'i Nasıl Bulunur?

### Yöntem 1: Supabase Dashboard
1. Supabase Dashboard → Settings → API
2. **Project URL** değerini kopyalayın
3. Sonuna `/auth/v1/callback` ekleyin

### Yöntem 2: api-service.js Dosyasından
`js/api-service.js` dosyasında:
```javascript
let supabaseUrl = 'https://ldsudrqanyjqisdunikn.supabase.co';
```
Bu URL'i kullanın: `https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback`

---

## ✅ Kontrol Listesi

- [ ] Supabase Project URL'i bulundu
- [ ] Google Cloud Console'a giriş yapıldı
- [ ] OAuth 2.0 Client ID bulundu
- [ ] Authorized redirect URIs bölümüne gidildi
- [ ] Doğru URI eklendi: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
- [ ] URI formatı doğru (HTTPS, doğru path, sonunda / yok)
- [ ] SAVE butonuna tıklandı
- [ ] 1-2 dakika beklendi
- [ ] Uygulama yenilendi (hard refresh)
- [ ] Tekrar test edildi

---

## ❓ Hala Çalışmıyor mu?

### Kontrol 1: URI Tam Olarak Eşleşiyor mu?

Google Cloud Console'daki URI ile Supabase'in kullandığı URI **tam olarak** aynı olmalı:

**Supabase kullanıyor:**
```
https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback
```

**Google Cloud Console'da olması gereken:**
```
https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback
```

✅ **Karakter karakter aynı olmalı!**

---

### Kontrol 2: Birden Fazla OAuth Client ID Var mı?

Eğer birden fazla OAuth Client ID varsa:
1. Her birini kontrol edin
2. Hepsinde doğru redirect URI olmalı
3. Supabase'de kullanılan Client ID'nin doğru olduğundan emin olun

---

### Kontrol 3: Supabase'deki Client ID Doğru mu?

1. Supabase Dashboard → Authentication → Providers → Google
2. **Client ID** değerini kopyalayın
3. Google Cloud Console'da bu Client ID'yi bulun
4. O Client ID'de redirect URI'yi kontrol edin

---

## 💡 İpucu: URI'yi Test Edin

URI'yi kopyalayıp tarayıcıda açın:
```
https://ldsudrqanyjqisdunikn.supabase.co/auth/v1/callback
```

**Beklenen sonuç:**
- Sayfa açılmalı (boş bir sayfa veya hata sayfası olabilir)
- Eğer 404 hatası alırsanız, path yanlış olabilir

---

## 📝 Özet

**Sorun:** Google Cloud Console'da yanlış veya eksik redirect URI

**Çözüm:** 
1. Supabase Project URL'inizi bulun
2. `/auth/v1/callback` ekleyin
3. Google Cloud Console → OAuth Client ID → Authorized redirect URIs → Ekleyin
4. SAVE → Bekleyin → Test edin

**Önemli:** URI tam olarak eşleşmeli! Karakter karakter aynı olmalı.

