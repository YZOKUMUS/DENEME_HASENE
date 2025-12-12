# 📊 Supabase'de Tabloları Görme Rehberi

## 🎯 Adım 1: Supabase Dashboard'a Git

1. Tarayıcınızda şu adrese gidin:
   ```
   https://supabase.com/dashboard
   ```

2. Giriş yapın (email/şifre veya Google ile)

3. Projenizi seçin (DENEME_HASENE projesi)

---

## 🎯 Adım 2: Table Editor'ı Aç

**Yöntem 1: Sol Menüden**

1. Sol taraftaki menüde **"Table Editor"** yazısına tıklayın
   - İkon: 📊 (tablo simgesi)
   - Sol menünün üst kısmında olmalı

2. Table Editor açılacak

**Yöntem 2: Direkt Link**

Eğer menüden bulamazsanız, direkt şu linki kullanın:
```
https://supabase.com/dashboard/project/ldsudrqanyjqisdunikn/editor
```

---

## 🎯 Adım 3: Tabloları Kontrol Et

Table Editor açıldığında, sol tarafta **tablo listesi** görünmelidir.

### Aradığınız Tablolar:

1. ✅ **weekly_leaderboard**
2. ✅ **user_leagues**  
3. ✅ **league_config**

### Eğer Görmüyorsanız:

1. **Sayfayı Yenileyin**
   - `F5` tuşuna basın
   - Veya tarayıcıdaki yenile butonuna tıklayın

2. **Sol Panel'i Kontrol Edin**
   - Table Editor'ın sol tarafında bir menü var
   - Orada "Tables" başlığı altında tablolar listelenir
   - Aşağı kaydırarak tüm tabloları görebilirsiniz

3. **Arama Yapın**
   - Sol panelde arama kutusu varsa, tablo ismini yazın
   - Örneğin: "leaderboard" yazın

---

## 🎯 Adım 4: Tablolara Tıklayın

Her tabloya tıkladığınızda:
- Sağ tarafta tablonun içeriği görünür
- Sütunlar (kolonlar) görünür
- Varsa veriler görünür

---

## 📋 Görünmesi Gereken Tablolar

### 1. **weekly_leaderboard**
- Sütunlar:
  - `id` (UUID)
  - `user_id` (UUID)
  - `week_start` (DATE)
  - `week_end` (DATE)
  - `weekly_xp` (INTEGER)
  - `league` (VARCHAR)
  - `position` (INTEGER)
  - `promoted` (BOOLEAN)
  - `demoted` (BOOLEAN)
  - `created_at` (TIMESTAMPTZ)
  - `updated_at` (TIMESTAMPTZ)

### 2. **user_leagues**
- Sütunlar:
  - `user_id` (UUID)
  - `current_league` (VARCHAR)
  - `current_week_start` (DATE)
  - `total_weeks_in_league` (INTEGER)
  - `best_league` (VARCHAR)
  - `total_promotions` (INTEGER)
  - `created_at` (TIMESTAMPTZ)
  - `updated_at` (TIMESTAMPTZ)

### 3. **league_config**
- Sütunlar:
  - `league_name` (VARCHAR)
  - `league_order` (INTEGER)
  - `promotion_top_percent` (INTEGER)
  - `demotion_bottom_percent` (INTEGER)
  - `min_players` (INTEGER)
  - `icon` (VARCHAR)
  - `color` (VARCHAR)
  - `display_name` (VARCHAR)
  - `arabic_name` (VARCHAR)
  - `description` (TEXT)
- **İçerik**: 12 lig kaydı olmalı (Mübtedi, Talib, vb.)

---

## 🔍 Eğer Tablolar Görünmüyorsa

### Kontrol Listesi:

1. ✅ SQL başarıyla çalıştı mı? (Başarı mesajı aldınız)
2. ✅ Doğru projede misiniz? (DENEME_HASENE)
3. ✅ Table Editor'da mısınız? (Sol menüden Table Editor)
4. ✅ Sayfayı yenilediniz mi? (F5)

### Hala Görünmüyorsa:

1. **Database Schema'yı Kontrol Edin**
   - Sol menüden **"Database"** > **"Tables"** sekmesine gidin
   - Orada tüm tablolar görünmelidir

2. **SQL Editor'de Kontrol Edin**
   - Sol menüden **"SQL Editor"** sekmesine gidin
   - Yeni bir query açın
   - Şu kodu çalıştırın:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('weekly_leaderboard', 'user_leagues', 'league_config');
   ```
   - Bu sorgu, tabloların var olup olmadığını gösterir

---

## 📸 Ekran Görüntüsü Nerede?

Table Editor'da şöyle görünmelidir:

```
┌─────────────────────────────┐
│  Supabase Dashboard         │
├─────────────────────────────┤
│  [Sol Panel]  │  [Ana Panel]│
│  Tables:      │             │
│  ├─ weekly_   │  Tablo      │
│  │  leaderboard│  Verileri  │
│  ├─ user_     │             │
│  │  leagues   │             │
│  └─ league_   │             │
│     config    │             │
└─────────────────────────────┘
```

---

## ✅ Başarı Kontrolü

Eğer:
- ✅ 3 tablo da görünüyorsa → **BAŞARILI!** 
- ✅ Tablolara tıklayınca sütunlar görünüyorsa → **BAŞARILI!**
- ✅ league_config tablosunda 12 kayıt varsa → **MÜKEMMEL!**

---

## 🎯 Sonraki Adım

Tabloları gördükten sonra:
1. Frontend'i test edin
2. Giriş yapın
3. Oyun oynayın
4. Leaderboard modal'ını açın

---

**Sorun devam ederse, hangi adımda takıldığınızı bana söyleyin!**






