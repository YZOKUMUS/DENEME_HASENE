// ============================================
// HELPER FUNCTIONS - Yardımcı Fonksiyonlar
// ============================================

import 'package:intl/intl.dart';
import 'constants.dart';

/// Kullanıcı adının geçerli olup olmadığını kontrol eder
bool isValidUsername(String? username) {
  if (username == null || username.trim().isEmpty) return false;
  final trimmed = username.trim();
  return trimmed.length >= AppConstants.minUsernameLength &&
      trimmed != AppConstants.defaultUsername &&
      trimmed != 'Kullanici';
}

/// Array'in boş olup olmadığını güvenli şekilde kontrol eder
bool isEmptyArray(List? list) {
  return list == null || list.isEmpty;
}

/// Map'in boş olup olmadığını güvenli şekilde kontrol eder
bool isEmptyMap(Map? map) {
  return map == null || map.isEmpty;
}

/// String'in boş olup olmadığını güvenli şekilde kontrol eder
bool isEmptyString(String? str) {
  return str == null || str.trim().isEmpty;
}

/// Number'ın geçerli olup olmadığını kontrol eder
bool isValidNumber(num? number) {
  return number != null && number.isFinite && !number.isNaN;
}

/// YYYY-MM-DD formatında bugünün tarihini döndürür
String getLocalDateString([DateTime? date]) {
  final dateTime = date ?? DateTime.now();
  return DateFormat('yyyy-MM-dd').format(dateTime);
}

/// Sayıyı binlik ayırıcı ile formatlar (1,234)
String formatNumber(int number) {
  return NumberFormat('#,###').format(number);
}

/// Hafta başlangıç tarihini döndürür (Pazartesi)
DateTime getWeekStartDate([DateTime? date]) {
  final d = date ?? DateTime.now();
  final day = d.weekday;
  final diff = d.day - day + (day == 7 ? -6 : 1); // Pazartesi
  return DateTime(d.year, d.month, diff, 0, 0, 0);
}

/// Hafta bitiş tarihini döndürür (Pazar)
DateTime getWeekEndDate([DateTime? date]) {
  final start = getWeekStartDate(date);
  return DateTime(
    start.year,
    start.month,
    start.day + 6,
    23,
    59,
    59,
    999,
  );
}

/// Array'den rastgele eleman seçer
T? getRandomItem<T>(List<T> list) {
  if (isEmptyArray(list)) return null;
  return list[(DateTime.now().millisecondsSinceEpoch % list.length)];
}

/// Array'den rastgele N eleman seçer (tekrar etmeden)
List<T> getRandomItems<T>(List<T> list, int count) {
  if (isEmptyArray(list) || count <= 0) return [];
  if (count >= list.length) return List.from(list);
  
  final shuffled = List<T>.from(list)..shuffle();
  return shuffled.take(count).toList();
}

/// Zorluk seviyesine göre kelime filtreler
List<T> filterByDifficulty<T>(List<T> words, String difficulty, int Function(T) getDifficulty) {
  switch (difficulty) {
    case AppConstants.difficultyEasy:
      return words.where((w) {
        final diff = getDifficulty(w);
        return diff >= AppConstants.difficultyEasyMin &&
            diff <= AppConstants.difficultyEasyMax;
      }).toList();
    case AppConstants.difficultyMedium:
      return words.where((w) {
        final diff = getDifficulty(w);
        return diff >= AppConstants.difficultyMediumMin &&
            diff <= AppConstants.difficultyMediumMax;
      }).toList();
    case AppConstants.difficultyHard:
      return words.where((w) {
        final diff = getDifficulty(w);
        return diff >= AppConstants.difficultyHardMin &&
            diff <= AppConstants.difficultyHardMax;
      }).toList();
    default:
      return words;
  }
}

