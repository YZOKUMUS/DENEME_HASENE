# 🚀 GitHub Pages ile Canlıya Alma

## Adımlar

### 1. Değişiklikleri Commit ve Push Et

```bash
# Tüm değişiklikleri ekle
git add .

# Commit et
git commit -m "Backend entegrasyonu ve authentication sistemi eklendi"

# GitHub'a push et
git push origin main
```

### 2. GitHub Pages'i Aktifleştir

1. GitHub repository'nize gidin
2. **Settings** sekmesine tıklayın
3. Sol menüden **Pages** sekmesine gidin
4. **Source** bölümünden **Deploy from a branch** seçin
5. **Branch** olarak **main** seçin
6. **Folder** olarak **/ (root)** seçin
7. **Save** butonuna tıklayın

### 3. Site URL'ini Al

- GitHub Pages otomatik olarak bir URL oluşturur:
  - `https://kullaniciadi.github.io/repository-adi`
- Bu URL'i not edin (birkaç dakika içinde aktif olur)

### 4. Supabase CORS Ayarlarını Güncelle

GitHub Pages URL'inizi Supabase'e eklemeniz gerekiyor:

1. Supabase Dashboard → **Project Settings** → **API**
2. **CORS** bölümüne gidin
3. GitHub Pages URL'inizi ekleyin:
   - `https://kullaniciadi.github.io`
   - Veya tam URL: `https://kullaniciadi.github.io/repository-adi`

### 5. Test Et

1. GitHub Pages URL'inize gidin
2. Giriş yapmayı deneyin
3. Oyun oynayın
4. Verilerin kaydedildiğini kontrol edin

## ⚠️ Önemli Notlar

### Environment Variables

GitHub Pages'de environment variable kullanamazsınız. Şu an `index.html` içinde hardcoded Supabase URL ve Key var, bu development için sorun değil ama production için:

**Seçenek 1:** Hardcoded bırakın (şu anki durum - çalışıyor)
**Seçenek 2:** Netlify/Vercel kullanın (environment variable desteği var)

### Custom Domain (İsteğe Bağlı)

GitHub Pages'de custom domain ekleyebilirsiniz:
1. Settings → Pages → Custom domain
2. Domain'inizi ekleyin
3. DNS ayarlarını yapın

## 🎉 Tamamlandı!

Artık oyununuz canlıda! Diğer kullanıcılar:
- Kayıt olabilir
- Giriş yapabilir
- Oyun oynayabilir
- Verileri backend'de saklanır






