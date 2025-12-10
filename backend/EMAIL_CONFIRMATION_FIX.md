# 🔧 Email Confirmation Hatası Düzeltme

## Sorun

"Email not confirmed" hatası alıyorsunuz. Bu, Supabase'in email confirmation özelliği aktif olduğu için oluyor.

## Çözüm: Email Confirmation'ı Kapat (Development için)

### Adım 1: Supabase Dashboard'a Git

1. **https://supabase.com/dashboard** adresine git
2. Projenizi seçin: `ldsudrqanyjqisdunikn`

### Adım 2: Email Confirmation'ı Kapat

1. Sol menüden **"Authentication"** > **"Providers"** sekmesine git
2. **"Email"** provider'ını bul
3. **"Confirm email"** seçeneğini **KAPAT** (toggle'ı kapat)
4. **"Save"** butonuna tıkla

### Adım 3: Test Et

1. Oyunu yenileyin (F5)
2. Yeni bir kullanıcı kaydı oluşturun
3. Hemen giriş yapabilmelisiniz ✅

## Alternatif: Email Confirmation'ı Açık Tutmak İsterseniz

Eğer email confirmation'ı açık tutmak istiyorsanız:

1. Kayıt olduktan sonra email'inize gelen doğrulama linkine tıklayın
2. Email'i doğruladıktan sonra giriş yapabilirsiniz

**Not**: Development için genellikle email confirmation kapatılır. Production'da açık tutabilirsiniz.

## Production İçin

Production'da email confirmation'ı açık tutmak istiyorsanız:
- Email template'lerini özelleştirebilirsiniz
- Custom email gönderme servisi kullanabilirsiniz
- Supabase'in varsayılan email servisini kullanabilirsiniz

