# 🚀 Leaderboard SQL Setup - Çalıştırma Rehberi

## 📍 SQL Dosyası Konumu

**Dosya**: `backend/leaderboard-setup.sql`

Bu dosya projenizin `backend` klasöründe bulunuyor.

---

## 🔧 Supabase'de Çalıştırma Adımları

### **Yöntem 1: Supabase Dashboard (Önerilen)**

1. **Supabase Dashboard'a Git**
   - Tarayıcıda şu adrese git: https://supabase.com/dashboard
   - Projenize giriş yapın

2. **SQL Editor'ü Aç**
   - Sol menüden **"SQL Editor"** sekmesine tıklayın
   - Veya direkt link: https://supabase.com/dashboard/project/_/sql/new

3. **SQL Dosyasını Yükle**
   - Yeni bir query oluşturun ("New query" butonu)
   - `backend/leaderboard-setup.sql` dosyasının içeriğini kopyalayın
   - SQL Editor'e yapıştırın

4. **Çalıştır**
   - Sağ alttaki **"Run"** butonuna tıklayın
   - Veya `Ctrl + Enter` tuş kombinasyonunu kullanın

5. **Sonucu Kontrol Et**
   - Başarılı mesajı görmelisiniz: "Success. No rows returned"
   - Hata varsa hata mesajını kontrol edin

---

### **Yöntem 2: Supabase CLI (Geliştiriciler İçin)**

Eğer Supabase CLI kuruluysa:

```bash
# Supabase'e bağlan
supabase db push backend/leaderboard-setup.sql

# Veya direkt SQL çalıştır
supabase db execute -f backend/leaderboard-setup.sql
```

---

## ✅ Kurulum Sonrası Kontrol

SQL başarıyla çalıştıktan sonra, şunları kontrol edin:

### **1. Tablolar Oluştu mu?**
Supabase Dashboard > Table Editor'da şu tablolar görünmeli:
- ✅ `weekly_leaderboard`
- ✅ `user_leagues`
- ✅ `league_config`

### **2. Fonksiyonlar Oluştu mu?**
Supabase Dashboard > Database > Functions'da:
- ✅ `increment_weekly_xp` fonksiyonu görünmeli

### **3. View Oluştu mu?**
Supabase Dashboard > Database > Views'da:
- ✅ `league_rankings` view'ı görünmeli

### **4. RLS Policies Aktif mi?**
Supabase Dashboard > Authentication > Policies'de:
- Her tablo için policies görünmeli

---

## 🔍 Hata Kontrolü

Eğer hata alırsanız:

### **Hata: "relation already exists"**
- Tablolar zaten var demektir
- Önce tabloları silin veya `DROP TABLE IF EXISTS` kullanın

### **Hata: "function already exists"**
- Fonksiyonlar zaten var
- `CREATE OR REPLACE FUNCTION` kullanın (dosyada zaten var)

### **Hata: "permission denied"**
- RLS policies yüzünden olabilir
- SQL'i "Service Role" key ile çalıştırın (dikkatli!)

---

## 📝 SQL Dosyası İçeriği Özeti

SQL dosyası şunları oluşturur:

1. **weekly_leaderboard** tablosu - Haftalık XP kayıtları
2. **user_leagues** tablosu - Kullanıcı lig durumu
3. **league_config** tablosu - 12 İslami lig tanımı
4. **increment_weekly_xp** fonksiyonu - XP güncelleme
5. **league_rankings** view - Sıralama görünümü
6. **RLS Policies** - Güvenlik kuralları
7. **Index'ler** - Performans optimizasyonu

---

## 🎯 Sonraki Adım

SQL başarıyla çalıştıktan sonra:

1. ✅ Frontend'de leaderboard butonuna tıklayın
2. ✅ Giriş yapın
3. ✅ Oyun oynayın (puan kazanın)
4. ✅ Leaderboard modal'ında verilerinizi görün

---

## 📞 Yardım

SQL dosyasında sorun varsa:
- Dosyayı kontrol edin: `backend/leaderboard-setup.sql`
- Hata mesajını bana gönderin
- Supabase Dashboard'dan logları kontrol edin




