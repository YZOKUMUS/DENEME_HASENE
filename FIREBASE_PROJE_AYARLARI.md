# 🔥 Firebase Proje Ayarları - TEK KAYNAK

## ⚠️ ÖNEMLİ: PROJE İSİM KARIŞIKLIĞI ÖNLENMESİ

Bu projede **SADECE** `hasene-arapca-dersi` projesi kullanılmalıdır.

## 📋 Proje Bilgileri

- **Proje ID**: `hasene-arapca-dersi`
- **Proje Adı**: Hasene Arapça Dersi
- **Firebase Console**: https://console.firebase.google.com/project/hasene-arapca-dersi/overview

## ✅ Doğru Ayarlar

### 1. `.firebaserc` Dosyası
```json
{
  "projects": {
    "default": "hasene-arapca-dersi"
  }
}
```

### 2. `js/firebase-config.js` Dosyası
```javascript
projectId: "hasene-arapca-dersi"
```

### 3. Firebase CLI
```bash
firebase use hasene-arapca-dersi
```

## 🚫 KULLANILMAMALI

- ❌ `deneme-hasene` - Eski test projesi, kullanılmamalı
- ❌ `hasene-da146` - Farklı proje, kullanılmamalı
- ❌ `test-e2fead07` - Test projesi, kullanılmamalı

## 🔧 Deploy Komutları

```bash
# Projeyi seç
firebase use hasene-arapca-dersi

# Rules deploy et
firebase deploy --only firestore:rules

# Tümünü deploy et
firebase deploy
```

## 📝 Kontrol Listesi

- [ ] `.firebaserc` dosyasında `hasene-arapca-dersi` var mı?
- [ ] `js/firebase-config.js` dosyasında `hasene-arapca-dersi` var mı?
- [ ] Firebase CLI'da doğru proje seçili mi? (`firebase use`)
- [ ] Firebase Console'da doğru projeye bakıyor musunuz?

## 🔍 Proje Kontrolü

Firebase CLI ile kontrol:
```bash
firebase use
# Çıktı: hasene-arapca-dersi olmalı
```

Firebase Console'da kontrol:
- URL'de `hasene-arapca-dersi` görünmeli
- Proje adı "Hasene Arapça Dersi" olmalı
