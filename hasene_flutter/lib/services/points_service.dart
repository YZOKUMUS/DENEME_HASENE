import '../utils/constants.dart';

class PointsService {
  // Calculate points based on difficulty
  static int calculatePoints(int difficulty, int comboCount) {
    int basePoints = 10;
    
    // Adjust points based on difficulty
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

    // Add combo bonus
    final comboBonus = comboCount * AppConstants.comboBonusPerCorrect;
    
    return basePoints + comboBonus;
  }

  // Calculate perfect lesson bonus
  static int calculatePerfectBonus(bool isPerfect) {
    return isPerfect ? AppConstants.perfectLessonBonus : 0;
  }

  // Calculate stars from points (250 points = 1 star)
  static int calculateStars(int totalPoints) {
    return (totalPoints / 250).floor();
  }

  // Calculate level from points
  static int calculateLevel(int totalPoints) {
    if (totalPoints < 2500) return 1;
    if (totalPoints < 5000) return 2;
    if (totalPoints < 8500) return 3;
    if (totalPoints < 13000) return 4;
    if (totalPoints < 46000) return 5;
    
    // Level 10 and above
    final extraPoints = totalPoints - 46000;
    return 10 + (extraPoints / 15000).floor();
  }

  // Calculate badges from stars
  static Map<String, int> calculateBadges(int stars) {
    final bronze = (stars / 5).floor();
    final silver = (bronze / 5).floor();
    final gold = (silver / 5).floor();
    final diamond = (gold / 5).floor();
    
    return {
      'stars': stars % 5,
      'bronze': bronze % 5,
      'silver': silver % 5,
      'gold': gold % 5,
      'diamond': diamond,
    };
  }
}

