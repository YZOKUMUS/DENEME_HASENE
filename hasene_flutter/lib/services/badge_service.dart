import '../utils/constants.dart';

class BadgeService {
  // Check and unlock achievements
  static List<String> checkAchievements({
    required int totalPoints,
    required int stars,
    required int currentLevel,
    required int currentStreak,
    required int totalCorrect,
    required Map<String, int> gameModeCounts,
  }) {
    final unlocked = <String>[];

    // Check each achievement
    for (final achievement in AppConstants.achievements) {
      final checkFunction = achievement['check'] as bool Function(Map<String, dynamic>);
      if (checkFunction({
        'totalPoints': totalPoints,
        'stars': stars,
        'currentLevel': currentLevel,
        'currentStreak': currentStreak,
        'totalCorrect': totalCorrect,
        'gameModeCounts': gameModeCounts,
      })) {
        unlocked.add(achievement['id'] as String);
      }
    }

    return unlocked;
  }

  // Get badge info
  static Map<String, dynamic>? getBadgeInfo(String badgeId) {
    try {
      final achievement = AppConstants.achievements.firstWhere(
        (achievement) => achievement['id'] == badgeId,
      );
      return achievement as Map<String, dynamic>?;
    } catch (e) {
      return null;
    }
  }
}

