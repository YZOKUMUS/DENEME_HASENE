# 🔧 Supabase CORS Ayarları

## CORS Ayarlarını Bulma

### Yöntem 1: API Sekmesinden (Önerilen)

1. Sol menüden **"API"** sekmesine tıklayın (Settings altında)
2. **"CORS"** veya **"Allowed Origins"** bölümünü bulun
3. GitHub Pages URL'inizi ekleyin:
   - `https://yzokumus.github.io`

### Yöntem 2: API Keys Sekmesinden

1. Sol menüden **"API Keys"** sekmesine tıklayın
2. **"CORS"** veya **"Allowed Origins"** bölümünü arayın
3. GitHub Pages URL'inizi ekleyin

### Yöntem 3: Project Settings → API

1. Sol menüden **"Project Settings"** (⚙️) ikonuna tıklayın
2. **"API"** sekmesine gidin
3. **"CORS"** veya **"Allowed Origins"** bölümünü bulun
4. GitHub Pages URL'inizi ekleyin:
   - `https://yzokumus.github.io`
   - Veya tam URL: `https://yzokumus.github.io/DENEME_HASENE`

## ⚠️ Önemli Not

Eğer CORS ayarlarını bulamazsanız:
- Supabase'in yeni versiyonunda CORS otomatik olarak açık olabilir
- Önce GitHub Pages'i aktifleştirin ve test edin
- Eğer CORS hatası alırsanız, o zaman CORS ayarlarını yapın

## Test

1. GitHub Pages URL'inize gidin
2. Console'u açın (F12)
3. CORS hatası görünüyorsa → CORS ayarlarını yapın
4. CORS hatası yoksa → Her şey çalışıyor! ✅






