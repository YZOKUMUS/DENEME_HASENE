import 'package:flutter/foundation.dart';
import '../models/game_model.dart';
import '../models/word_model.dart';
import '../services/data_service.dart';
import '../utils/helpers.dart';
import '../utils/constants.dart';
import 'dart:math';

class GameProvider with ChangeNotifier {
  GameModel? _currentGame;
  String _currentDifficulty = AppConstants.difficultyMedium;
  String? _currentSubMode; // Alt mod seçimi
  bool _isLoading = false;

  GameModel? get currentGame => _currentGame;
  String get currentDifficulty => _currentDifficulty;
  String? get currentSubMode => _currentSubMode;
  bool get isLoading => _isLoading;

  final DataService _dataService = DataService();
  final Random _random = Random();

  void setDifficulty(String difficulty) {
    _currentDifficulty = difficulty;
    notifyListeners();
  }

  void setSubMode(String? subMode) {
    _currentSubMode = subMode;
    notifyListeners();
  }

  Future<void> startGame(String gameMode, {String? subMode}) async {
    _isLoading = true;
    _currentSubMode = subMode;
    notifyListeners();

    try {
      List<QuestionModel> questions = [];
      
      if (gameMode == AppConstants.gameModeKelimeSinavi) {
        // Kelime Sınavı - Kelime Çevir, Dinle Bul, Boşluk Doldur karışık
        questions = await _createKelimeSinaviQuestions(subMode ?? AppConstants.subModeClassic);
      } else if (gameMode == AppConstants.gameModeIlimModu) {
        // İlim Modu - Ayet Oku, Dua Et, Hadis Oku karışık
        questions = await _createIlimModuQuestions();
      } else {
        throw Exception('Geçersiz oyun modu: $gameMode');
      }

      if (questions.length < AppConstants.questionsPerGame) {
        throw Exception('Yeterli soru oluşturulamadı!');
      }

      _currentGame = GameModel(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        gameMode: gameMode,
        subMode: subMode,
        difficulty: _currentDifficulty,
        questions: questions,
      );
    } catch (e) {
      debugPrint('Error starting game: $e');
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Kelime Sınavı soruları oluştur (Kelime Çevir, Dinle Bul, Boşluk Doldur karışık)
  Future<List<QuestionModel>> _createKelimeSinaviQuestions(String subMode) async {
    final allQuestions = <QuestionModel>[];
    
    // Kelimeleri yükle
    List<WordModel> words = await _dataService.loadWords();
    
    // Alt moda göre filtrele
    if (subMode == AppConstants.subModeJuz30) {
      words = words.where((w) {
        if (w.sure == null) return false;
        final sureNum = int.tryParse(w.sure ?? '');
        return sureNum != null && 
               sureNum >= AppConstants.juz30Start && 
               sureNum <= AppConstants.juz30End;
      }).toList();
    } else if (subMode == AppConstants.subModeReview) {
      // Yanlış cevaplanan kelimeler (word stats'tan alınacak)
      // Şimdilik tüm kelimeleri kullan
    } else if (subMode == AppConstants.subModeFavorites) {
      // Favori kelimeler (favorites'tan alınacak)
      // Şimdilik tüm kelimeleri kullan
    }
    
    // Zorluk seviyesine göre filtrele
    words = filterByDifficulty(
      words,
      _currentDifficulty,
      (word) => word.difficulty,
    );

    if (words.length < AppConstants.questionsPerGame) {
      throw Exception('Yeterli kelime bulunamadı!');
    }

    final selectedWords = getRandomItems(words, AppConstants.questionsPerGame);
    
    // Her kelime için 3 farklı soru tipi oluştur (karışık)
    for (var word in selectedWords) {
      final questionType = _getRandomQuestionType(['kelime-cevir', 'dinle-bul', 'bosluk-doldur']);
      
      QuestionModel question;
      
      if (questionType == 'kelime-cevir') {
        question = _createKelimeCevirQuestion(word, words);
      } else if (questionType == 'dinle-bul') {
        question = _createDinleBulQuestion(word, words);
      } else if (questionType == 'bosluk-doldur') {
        question = await _createBoslukDoldurQuestion(word);
      } else {
        question = _createKelimeCevirQuestion(word, words); // Fallback
      }
      
      allQuestions.add(question);
    }

    // Soruları karıştır
    allQuestions.shuffle(_random);
    
    return allQuestions;
  }

  // İlim Modu soruları oluştur (Ayet Oku, Dua Et, Hadis Oku karışık)
  Future<List<QuestionModel>> _createIlimModuQuestions() async {
    final allQuestions = <QuestionModel>[];
    
    // Ayet, Dua, Hadis verilerini yükle
    final ayetler = await _dataService.loadAyet();
    final dualar = await _dataService.loadDua();
    final hadisler = await _dataService.loadHadis();
    
    // Her türden eşit sayıda soru seç (15 soru = 5 ayet + 5 dua + 5 hadis)
    final ayetCount = 5;
    final duaCount = 5;
    final hadisCount = 5;
    
    // Ayet soruları
    final selectedAyetler = getRandomItems(ayetler, ayetCount);
    for (var ayet in selectedAyetler) {
      allQuestions.add(_createAyetOkuQuestion(ayet));
    }
    
    // Dua soruları
    final selectedDualar = getRandomItems(dualar, duaCount);
    for (var dua in selectedDualar) {
      allQuestions.add(_createDuaEtQuestion(dua));
    }
    
    // Hadis soruları
    final selectedHadisler = getRandomItems(hadisler, hadisCount);
    for (var hadis in selectedHadisler) {
      allQuestions.add(_createHadisOkuQuestion(hadis));
    }
    
    // Soruları karıştır
    allQuestions.shuffle(_random);
    
    return allQuestions;
  }

  // Soru tiplerini rastgele seç
  String _getRandomQuestionType(List<String> types) {
    return types[_random.nextInt(types.length)];
  }

  // Kelime Çevir sorusu oluştur
  QuestionModel _createKelimeCevirQuestion(WordModel word, List<WordModel> allWords) {
    final options = _generateOptions(word, allWords);
    final shuffled = List<String>.from(options)..shuffle();
    final correctIndex = shuffled.indexOf(word.anlam);
    
    return QuestionModel(
      id: word.id,
      question: word.arabic,
      questionType: 'kelime-cevir',
      correctAnswer: word.anlam,
      options: shuffled,
      correctIndex: correctIndex,
      metadata: {
        'arabic': word.arabic,
        'difficulty': word.difficulty,
        'sure': word.sure,
        'ayet': word.ayet,
      },
    );
  }

  // Dinle Bul sorusu oluştur
  QuestionModel _createDinleBulQuestion(WordModel word, List<WordModel> allWords) {
    final options = _generateOptions(word, allWords);
    final shuffled = List<String>.from(options)..shuffle();
    final correctIndex = shuffled.indexOf(word.anlam);
    
    return QuestionModel(
      id: word.id,
      question: '🎧 Dinle ve seç', // Audio çalınacak
      questionType: 'dinle-bul',
      correctAnswer: word.anlam,
      options: shuffled,
      correctIndex: correctIndex,
      metadata: {
        'arabic': word.arabic,
        'difficulty': word.difficulty,
        'sure': word.sure,
        'ayet': word.ayet,
        'audioUrl': word.audioUrl,
      },
    );
  }

  // Ayet Oku sorusu oluştur
  QuestionModel _createAyetOkuQuestion(Map<String, dynamic> ayet) {
    return QuestionModel(
      id: 'ayet-${ayet['id'] ?? DateTime.now().millisecondsSinceEpoch}',
      question: ayet['ayet_metni'] ?? '',
      questionType: 'ayet-oku',
      correctAnswer: '', // Okuma modu, cevap yok
      options: [],
      correctIndex: 0,
      metadata: {
        'sure': ayet['sure'],
        'ayet': ayet['ayet'],
        'meal': ayet['meal'],
      },
    );
  }

  // Dua Et sorusu oluştur
  QuestionModel _createDuaEtQuestion(Map<String, dynamic> dua) {
    return QuestionModel(
      id: 'dua-${dua['id'] ?? DateTime.now().millisecondsSinceEpoch}',
      question: dua['dua_metni'] ?? '',
      questionType: 'dua-et',
      correctAnswer: '',
      options: [],
      correctIndex: 0,
      metadata: {
        'sure': dua['sure'],
        'ayet': dua['ayet'],
        'meal': dua['meal'],
      },
    );
  }

  // Hadis Oku sorusu oluştur
  QuestionModel _createHadisOkuQuestion(Map<String, dynamic> hadis) {
    return QuestionModel(
      id: 'hadis-${hadis['id'] ?? DateTime.now().millisecondsSinceEpoch}',
      question: hadis['hadis_metni'] ?? '',
      questionType: 'hadis-oku',
      correctAnswer: '',
      options: [],
      correctIndex: 0,
      metadata: {
        'kategori': hadis['kategori'],
        'baslik': hadis['baslik'],
        'kaynak': hadis['kaynak'],
      },
    );
  }

  // Boşluk Doldur sorusu oluştur
  Future<QuestionModel> _createBoslukDoldurQuestion(WordModel word) async {
    try {
      // Ayetleri yükle
      final ayetler = await _dataService.loadAyet();
      
      // Kelimeyi içeren ayet bul
      Map<String, dynamic>? foundAyet;
      try {
        foundAyet = ayetler.firstWhere(
          (a) => (a['ayet_metni'] ?? '').contains(word.arabic),
        );
      } catch (e) {
        // Kelimeyi içeren ayet bulunamazsa rastgele bir ayet seç
        if (ayetler.isNotEmpty) {
          foundAyet = getRandomItem(ayetler);
        } else {
          throw Exception('Ayet bulunamadı');
        }
      }
      
      if (foundAyet == null) throw Exception('Ayet bulunamadı');
      
      final ayetMetni = foundAyet['ayet_metni'] ?? '';
      final ayetWords = ayetMetni.split(' ').where((w) => w.trim().isNotEmpty).toList();
      
      // Eksik kelimeyi bul (ayet içindeki kelimelerden biri)
      String missingWord;
      if (ayetWords.contains(word.arabic)) {
        missingWord = word.arabic;
      } else if (ayetWords.isNotEmpty) {
        // Kelime ayette yoksa, ayetten rastgele bir kelime seç
        final randomWords = getRandomItems(ayetWords, 1);
        missingWord = randomWords.isNotEmpty ? randomWords.first.toString() : ayetWords.first.toString();
      } else {
        throw Exception('Ayet metni boş');
      }
      
      // Seçenekler oluştur
      final options = [missingWord];
      
      // Yanlış seçenekler için diğer kelimelerden seç
      final wrongWords = ayetWords
          .where((w) => w.trim() != missingWord && w.trim().isNotEmpty)
          .toList();
      
      if (wrongWords.length >= 3) {
        final wrongOptions = getRandomItems(wrongWords, 3).cast<String>();
        options.addAll(wrongOptions);
      } else {
        // Yeterli kelime yoksa, tüm kelimeleri ekle
        options.addAll(wrongWords);
        // Eksik kalan seçenekleri kelime listesinden doldur
        final allWords = await _dataService.loadWords();
        final takeCount = (3 - wrongWords.length).toInt();
        final additionalWords = allWords
            .where((w) => w.arabic != missingWord && !options.contains(w.arabic))
            .take(takeCount)
            .map<String>((w) => w.arabic)
            .toList();
        options.addAll(additionalWords);
      }
      
      // Seçenekleri karıştır
      options.shuffle();
      final correctIndex = options.indexOf(missingWord);
      
      // Boşluklu ayet metni oluştur
      final blankedAyet = ayetMetni.replaceFirst(missingWord, '_____');
      
      return QuestionModel(
        id: 'bosluk-${word.id}-${DateTime.now().millisecondsSinceEpoch}',
        question: blankedAyet,
        questionType: 'bosluk-doldur',
        correctAnswer: missingWord,
        options: options.take(4).toList(), // Maksimum 4 seçenek
        correctIndex: correctIndex < 4 ? correctIndex : 0,
        metadata: {
          'sure': foundAyet['sure_adı'] ?? foundAyet['sure'],
          'ayet': foundAyet['ayet_kimligi'] ?? foundAyet['ayet'],
          'meal': foundAyet['meal'],
          'fullAyet': ayetMetni,
        },
      );
    } catch (e) {
      debugPrint('Boşluk doldur sorusu oluşturulamadı: $e');
      // Hata durumunda fallback olarak kelime çevir sorusu oluştur
      final words = await _dataService.loadWords();
      return _createKelimeCevirQuestion(word, words);
    }
  }

  List<String> _generateOptions(WordModel correctWord, List<WordModel> allWords) {
    final options = [correctWord.anlam];
    final wrongWords = allWords
        .where((w) => w.id != correctWord.id)
        .toList();
    
      final wrongOptions = getRandomItems(wrongWords, 3)
          .map<String>((w) => w.anlam)
          .toList();
    
    options.addAll(wrongOptions);
    return options;
  }

  void answerQuestion(int selectedIndex) {
    if (_currentGame == null) return;
    
    final question = _currentGame!.questions[_currentGame!.currentQuestion];
    
    // Okuma modları için cevap kontrolü yok
    if (question.questionType == 'ayet-oku' || 
        question.questionType == 'dua-et' || 
        question.questionType == 'hadis-oku') {
      // Okuma modu - direkt geç
      _currentGame = _currentGame!.copyWith(
        currentQuestion: _currentGame!.currentQuestion + 1,
        sessionScore: _currentGame!.sessionScore + 10, // Okuma için sabit puan
        sessionCorrect: _currentGame!.sessionCorrect + 1,
      );
    } else {
      // Normal soru - cevap kontrolü
      final isCorrect = selectedIndex == question.correctIndex;

      if (isCorrect) {
        _currentGame = _currentGame!.copyWith(
          currentQuestion: _currentGame!.currentQuestion + 1,
          sessionScore: _currentGame!.sessionScore + _calculatePoints(question),
          sessionCorrect: _currentGame!.sessionCorrect + 1,
          comboCount: _currentGame!.comboCount + 1,
        );
      } else {
        _currentGame = _currentGame!.copyWith(
          currentQuestion: _currentGame!.currentQuestion + 1,
          sessionWrong: _currentGame!.sessionWrong + 1,
          comboCount: 0,
        );
      }
    }

    notifyListeners();
  }

  int _calculatePoints(QuestionModel question) {
    final difficulty = question.metadata?['difficulty'] as int? ?? 10;
    int basePoints = 10;
    
    if (difficulty >= AppConstants.difficultyEasyMin &&
        difficulty <= AppConstants.difficultyEasyMax) {
      basePoints = 5;
    } else if (difficulty >= AppConstants.difficultyMediumMin &&
        difficulty <= AppConstants.difficultyMediumMax) {
      basePoints = 10;
    } else if (difficulty >= AppConstants.difficultyHardMin &&
        difficulty <= AppConstants.difficultyHardMax) {
      basePoints = 15;
    }

    final comboBonus = _currentGame!.comboCount * AppConstants.comboBonusPerCorrect;
    
    return basePoints + comboBonus;
  }

  void endGame() {
    _currentGame = null;
    _currentSubMode = null;
    notifyListeners();
  }
}
