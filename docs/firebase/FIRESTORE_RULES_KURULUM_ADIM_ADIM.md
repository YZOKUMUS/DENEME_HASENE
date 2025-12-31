# Firestore Rules Kurulumu - Adım Adım

## Adım 1: Firebase Console'a Giriş

1. [Firebase Console](https://console.firebase.google.com/)'a gidin
2. Projenizi seçin: **hasene-arapca-dersi**

## Adım 2: Firestore Database'e Gidin

1. Sol menüden **Firestore Database**'e tıklayın
2. Üstteki sekmelerden **Rules** sekmesine tıklayın

## Adım 3: Mevcut Rules'ı Değiştirin

1. Rules editöründe **TÜM MEVCUT KURALLARI SEÇİN** (Ctrl+A)
2. **SİLİN** (Delete)
3. `docs/FIRESTORE_RULES_ANONYMOUS.txt` dosyasındaki kuralları **KOPYALAYIN**
4. Rules editörüne **YAPIŞTIRIN** (Ctrl+V)

## Adım 4: Rules'ı Kaydedin

1. Rules editöründe değişiklik yaptıktan sonra **sağ üstte "Publish" butonu görünecek**
2. **Publish** butonuna tıklayın
3. Onay mesajında **Publish** butonuna tekrar tıklayın

## Önemli Notlar

- **Publish butonu sadece Rules'ı değiştirdikten sonra görünür**
- Eğer "Publish" butonu görünmüyorsa, Rules editöründe değişiklik yapmamışsınız demektir
- Rules'ı yapıştırdıktan sonra mutlaka "Publish" butonuna tıklayın
- Rules güncellendikten sonra birkaç saniye içinde aktif olur

## Test

1. Rules'ı güncelledikten sonra sayfayı yenileyin (Ctrl+Shift+R)
2. "Giriş Yap" butonuna tıklayın
3. Kullanıcı adınızı girin
4. Konsolda permission hataları görünmemeli
5. Oyun oynayın ve puanlarınızı kazanın
6. Sayfayı yenileyin - verileriniz Firebase'den yüklenecek!
