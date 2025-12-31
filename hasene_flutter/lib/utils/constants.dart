// ============================================
// CONSTANTS - Oyun Sabitleri
// ============================================

class AppConstants {
  // App Info
  static const String appName = 'Hasene Arapça Dersi';
  static const String appVersion = '1.0.0';

  // Game Settings
  static const int questionsPerGame = 15; // Karışık oyun için 15 soru
  static const int minQuestionsForPerfect = 3;
  static const int timeLimitPerQuestion = 0; // Zaman limiti yok

  // Points System
  static const int pointsCorrect = 10; // Her doğru cevap için 10 Hasene
  static const int pointsWrong = 0; // Yanlış cevap için puan kaybı yok
  static const int comboBonusPerCorrect = 2; // Her doğru cevap için 2 Hasene combo bonusu
  static const int perfectLessonBonus = 50; // Her mükemmel ders için 50 Hasene bonus

  // Daily Goal Defaults
  static const int dailyGoalDefault = 2700;
  static const Map<String, int> dailyGoalLevels = {
    'easy': 1300,
    'normal': 2700,
    'hard': 5400,
    'serious': 6000,
  };

  // Streak
  static const int dailyGoalCorrect = 5; // Minimum doğru cevap sayısı

  // Storage
  static const String storagePrefix = 'hasene_';
  static const String hiveBoxName = 'HaseneGameDB';

  // Validation
  static const int minUsernameLength = 2;
  static const String defaultUsername = 'Kullanıcı';
  static const int minPasswordLength = 6;
  static const String localUserPrefix = 'local-';
  static const int minFirebaseUidLength = 10;

  // Difficulty Ranges
  static const int difficultyEasyMin = 5;
  static const int difficultyEasyMax = 8;
  static const int difficultyMediumMin = 9;
  static const int difficultyMediumMax = 12;
  static const int difficultyHardMin = 13;
  static const int difficultyHardMax = 21;

  // Juz 30 Range
  static const int juz30Start = 78;
  static const int juz30End = 114;

    // Firebase Collections
    static const String usersCollection = 'users';
    static const String statsCollection = 'stats';
    static const String wordStatsCollection = 'word_stats';
    static const String favoritesCollection = 'favorites';
    static const String achievementsCollection = 'achievements';
    static const String badgesCollection = 'badges';
    static const String leaderboardCollection = 'leaderboard';

    // Achievements (placeholder - full list would be imported from constants file)
    static List<Map<String, dynamic>> get achievements => [
      {
        'id': 'first_victory',
        'name': '🕌 İlk Kelime',
        'description': '1 Yıldız kazan',
        'check': (stats) => (stats['stars'] ?? 0) >= 1,
      },
      {
        'id': 'bismillah',
        'name': 'بِسْمِ اللَّهِ',
        'description': '2 Yıldız kazan',
        'check': (stats) => (stats['stars'] ?? 0) >= 2,
      },
    ];

  // Game Modes - YENİ YAPILANDIRMA
  // İki ana oyun modu:
  // 1. Kelime Sınavı - Kelime Çevir, Dinle Bul, Boşluk Doldur karışık
  // 2. İlim Modu - Ayet Oku, Dua Et, Hadis Oku karışık
  
  static const String gameModeKelimeSinavi = 'kelime-sinavi'; // Ana mod 1
  static const String gameModeIlimModu = 'ilim-modu'; // Ana mod 2
  
  // Alt modlar (Kelime Sınavı içinde)
  static const String subModeClassic = 'classic'; // Klasik oyun
  static const String subModeJuz30 = 'juz30'; // 30.cüz ayetlerinin kelimeleri
  static const String subModeReview = 'review'; // Yanlış cevaplanan kelimeleri tekrar et
  static const String subModeFavorites = 'favorites'; // Favori kelimelerden oyna
  
  // Eski modlar (referans için, kullanılmıyor)
  static const String gameModeKelimeCevir = 'kelime-cevir';
  static const String gameModeDinleBul = 'dinle-bul';
  static const String gameModeBoslukDoldur = 'bosluk-doldur';
  static const String gameModeAyetOku = 'ayet-oku';
  static const String gameModeDuaEt = 'dua-et';
  static const String gameModeHadisOku = 'hadis-oku';

  // Difficulty Levels
  static const String difficultyEasy = 'easy';
  static const String difficultyMedium = 'medium';
  static const String difficultyHard = 'hard';
}

