import 'package:flutter/foundation.dart';

class StatsProvider with ChangeNotifier {
  int _totalCorrect = 0;
  int _totalWrong = 0;
  Map<String, int> _gameModeCounts = {};
  Map<String, dynamic> _wordStats = {};

  int get totalCorrect => _totalCorrect;
  int get totalWrong => _totalWrong;
  Map<String, int> get gameModeCounts => Map.unmodifiable(_gameModeCounts);
  Map<String, dynamic> get wordStats => Map.unmodifiable(_wordStats);

  void updateStats({
    int? correct,
    int? wrong,
    String? gameMode,
    Map<String, dynamic>? wordStatsUpdate,
  }) {
    if (correct != null) _totalCorrect += correct;
    if (wrong != null) _totalWrong += wrong;
    if (gameMode != null) {
      _gameModeCounts[gameMode] = (_gameModeCounts[gameMode] ?? 0) + 1;
    }
    if (wordStatsUpdate != null) {
      _wordStats.addAll(wordStatsUpdate);
    }
    notifyListeners();
  }

  void resetStats() {
    _totalCorrect = 0;
    _totalWrong = 0;
    _gameModeCounts.clear();
    _wordStats.clear();
    notifyListeners();
  }
}

