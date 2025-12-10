# ✅ Supabase Kurulumu Tamamlandı!

## Yapılan İşlemler

1. ✅ Supabase URL ve API Key projeye eklendi
2. ✅ `.env` dosyası oluşturuldu
3. ✅ `index.html` içine configuration eklendi
4. ✅ `api-service.js` güncellendi

## Şimdi Yapmanız Gerekenler

### 1. Database Schema Oluştur (ÖNEMLİ!)

1. **Supabase Dashboard'a git**: https://supabase.com/dashboard
2. Projenizi seçin: `ldsudrqanyjqisdunikn`
3. Sol menüden **"SQL Editor"** sekmesine tıklayın
4. **`backend/supabase-setup.sql`** dosyasını açın
5. Tüm içeriği kopyalayın
6. SQL Editor'e yapıştırın
7. **"Run"** butonuna tıklayın
8. ✅ Tüm tablolar oluşturulacak!

### 2. Test Et

1. Oyunu açın (index.html)
2. Browser console'u açın (F12)
3. Şu mesajı görmelisiniz: `✅ Supabase client başlatıldı`
4. Oyun oynayın, puan kazanın
5. Supabase Dashboard'da **"Table Editor"** > **"user_stats"** tablosuna bakın
6. Verilerin göründüğünü kontrol edin ✅

## Sorun Giderme

### "Supabase client başlatılamadı" hatası

**Çözüm**: Browser console'da şunu kontrol edin:
```javascript
console.log(window.VITE_SUPABASE_URL);
console.log(window.VITE_SUPABASE_ANON_KEY);
```

Eğer `undefined` görüyorsanız, sayfayı yenileyin (F5).

### Veriler backend'e kaydedilmiyor

**Kontrol et**:
1. SQL dosyasını çalıştırdınız mı? (ÖNEMLİ!)
2. Browser console'da hata var mı?
3. Supabase Dashboard'da **"Table Editor"** sekmesinde tablolar görünüyor mu?

### "Unauthorized" hatası

**Çözüm**: SQL dosyasını çalıştırdığınızdan emin olun. RLS (Row Level Security) politikaları SQL dosyasında tanımlı.

## Sonraki Adımlar

1. ✅ Database schema oluştur (SQL dosyasını çalıştır)
2. ⏳ Authentication ekle (kullanıcı girişi/kaydı)
3. ⏳ Liderlik tablosu ekle
4. ⏳ Real-time özellikler ekle (isteğe bağlı)

## Başarılı Kurulum Kontrolü

✅ Supabase client başlatıldı mesajı görünüyor mu?
✅ SQL dosyasını çalıştırdınız mı?
✅ Veriler backend'e kaydediliyor mu?

Eğer hepsi ✅ ise, kurulum başarılı! 🎉

