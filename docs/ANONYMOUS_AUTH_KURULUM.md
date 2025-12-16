# Firebase Anonymous Authentication Kurulumu

Verilerinizin Firebase'de saklanması ve her açtığınızda en son yerden devam etmeniz için Firebase Anonymous Authentication'ı etkinleştirmeniz gerekiyor.

## Adım 1: Firebase Console'da Anonymous Authentication'ı Etkinleştir

1. [Firebase Console](https://console.firebase.google.com/)'a gidin
2. Projenizi seçin: **hasene-arapca-dersi**
3. Sol menüden **Authentication** > **Sign-in method**'a tıklayın
4. **Anonymous** satırını bulun ve tıklayın
5. **Enable** butonuna tıklayın
6. **Save** butonuna tıklayın

## Adım 2: Firestore Security Rules'ı Güncelle

1. Firebase Console'da **Firestore Database** > **Rules** sekmesine gidin
2. `docs/FIRESTORE_RULES_ANONYMOUS.txt` dosyasındaki kuralları kopyalayın
3. Firestore Rules editörüne yapıştırın
4. **Publish** butonuna tıklayın

## Test

1. Sayfayı yenileyin (Ctrl+Shift+R)
2. "Giriş Yap" butonuna tıklayın
3. Kullanıcı adınızı girin
4. "Giriş Yap ve Başla" butonuna tıklayın
5. Konsolda şu logları görmelisiniz:
   - `✅ Firebase Anonymous Authentication başarılı: [UID]`
   - `✅ Kullanıcı profili Firestore'a kaydedildi`
6. Oyun oynayın ve puanlarınızı kazanın
7. Sayfayı yenileyin - verileriniz Firebase'den yüklenecek!

## Önemli Notlar

- **Anonymous Authentication** etkinleştirilmeden veriler Firebase'de saklanmaz
- Veriler Firebase'de saklandığında, farklı cihazlardan da erişebilirsiniz
- Anonymous kullanıcılar Firebase'de otomatik olarak oluşturulur (email/şifre gerekmez)
