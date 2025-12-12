# HaveIBeenPwned Şifre Kontrolü Ayarı

## Sorun
Supabase Auth, sızdırılmış şifreleri kontrol etmek için HaveIBeenPwned.org servisini kullanabilir. Bu özellik şu anda kapalı.

## Çözüm
Bu ayar Supabase Dashboard üzerinden yapılmalıdır (SQL ile değil).

### Adımlar:

1. **Supabase Dashboard'a giriş yapın**
   - https://supabase.com/dashboard

2. **Projenizi seçin**

3. **Authentication > Settings** bölümüne gidin

4. **"Password"** sekmesine tıklayın

5. **"Check passwords against HaveIBeenPwned"** seçeneğini aktif edin

6. **Kaydedin**

## Ne Yapar?
- Kullanıcılar yeni şifre oluştururken veya şifre değiştirirken
- Şifre, HaveIBeenPwned.org veritabanında kontrol edilir
- Eğer şifre sızdırılmışsa, kullanıcıya uyarı verilir
- Bu, güvenliği artırır

## Önemli Notlar
- Bu özellik ücretsizdir
- API çağrıları Supabase tarafından yönetilir
- Kullanıcı şifreleri HaveIBeenPwned.org'a gönderilmez (sadece hash'ler gönderilir)
- Performans etkisi minimaldir

## Alternatif
Eğer bu özelliği kullanmak istemiyorsanız, kendi şifre kontrol mekanizmanızı oluşturabilirsiniz, ancak Supabase'in yerleşik çözümü daha güvenli ve kolaydır.

