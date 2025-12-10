# ✅ Email Confirmation - Manuel Çözüm

## Sorun
Mevcut kullanıcılar için email confirmation hala aktif. Dashboard'dan kapatmak yeni kullanıcılar için geçerli, mevcut kullanıcılar için değil.

## Çözüm 1: Dashboard'dan Manuel Confirm (Önerilen)

### Adımlar:
1. Supabase Dashboard'a git
2. Sol menüden **"Authentication"** (🔐) ikonuna tıkla
3. **"Users"** sekmesine git
4. Email'i confirm etmek istediğin kullanıcıyı bul
5. Kullanıcıya tıkla
6. **"Confirm email"** veya **"Email confirmed"** checkbox'ını işaretle
7. **"Save"** veya **"Update"** butonuna tıkla

## Çözüm 2: Yeni Kullanıcı Kaydı Oluştur

Dashboard'dan email confirmation'ı kapattıysanız, yeni kayıt olan kullanıcılar için çalışmalı:

1. Yeni bir email ile kayıt ol
2. Hemen giriş yapabilmelisin

## Çözüm 3: Email Template'i Değiştir (Gelişmiş)

Eğer email confirmation'ı tamamen kaldırmak istiyorsanız, email template'ini değiştirebilirsiniz ama bu önerilmez.

