# ✅ Supabase Kurulum Test Rehberi

## 1. Tabloların Oluşturulduğunu Kontrol Et

1. **Supabase Dashboard'a git**: https://supabase.com/dashboard
2. Projenizi seçin
3. Sol menüden **"Table Editor"** sekmesine tıklayın
4. Şu tabloları görmelisiniz:
   - ✅ `profiles`
   - ✅ `user_stats`
   - ✅ `daily_tasks`
   - ✅ `weekly_tasks`
   - ✅ `word_stats`
   - ✅ `favorite_words`
   - ✅ `achievements`
   - ✅ `badges`
   - ✅ `daily_stats`
   - ✅ `weekly_stats`
   - ✅ `monthly_stats`

## 2. Oyunu Test Et

1. **Oyunu açın**: `index.html` dosyasını tarayıcıda açın
2. **Browser Console'u açın**: F12 tuşuna basın
3. **Şu mesajı görmelisiniz**:
   ```
   ✅ Supabase client başlatıldı: https://ldsudrqanyjqisdunikn.supabase.co
   ```

## 3. Veri Kaydetme Testi

1. **Oyun oynayın**: Herhangi bir oyun modunu başlatın
2. **Birkaç soru cevaplayın**: Doğru/yanlış cevaplar verin
3. **Puan kazanın**: Hasene puanı kazanın
4. **Supabase Dashboard'a geri dönün**
5. **"Table Editor" > "user_stats"** tablosuna bakın
6. **Verilerin göründüğünü kontrol edin** ✅

## 4. Sorun Giderme

### Console'da "Supabase client başlatılamadı" hatası

**Kontrol et**:
```javascript
// Browser console'da çalıştırın:
console.log(window.VITE_SUPABASE_URL);
console.log(window.VITE_SUPABASE_ANON_KEY);
```

Eğer `undefined` görüyorsanız:
- Sayfayı yenileyin (F5)
- `index.html` dosyasında script tag'lerin doğru olduğundan emin olun

### Veriler kaydedilmiyor

**Kontrol et**:
1. Browser console'da hata var mı?
2. Supabase Dashboard'da **"Logs"** sekmesine bakın
3. RLS (Row Level Security) politikaları aktif mi?

**Not**: Şu an authentication olmadığı için veriler kaydedilmeyebilir. Bu normal! Authentication ekledikten sonra çalışacak.

## 5. Sonraki Adımlar

1. ✅ Database schema oluşturuldu
2. ⏳ **Authentication ekle** (kullanıcı girişi/kaydı) - ŞİMDİ YAPILACAK
3. ⏳ Liderlik tablosu ekle
4. ⏳ Real-time özellikler ekle (isteğe bağlı)

## Başarılı Kurulum Kontrol Listesi

- [ ] Tablolar Supabase'de görünüyor mu?
- [ ] Console'da "Supabase client başlatıldı" mesajı var mı?
- [ ] Oyun çalışıyor mu?
- [ ] Veriler kaydediliyor mu? (Authentication sonrası)

Eğer hepsi ✅ ise, kurulum başarılı! 🎉

