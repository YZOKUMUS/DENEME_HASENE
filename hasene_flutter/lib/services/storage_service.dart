import 'package:shared_preferences/shared_preferences.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../utils/constants.dart';

class StorageService {
  static const String _prefsBoxName = 'hasene_prefs';
  static Box? _hiveBox;

  // Initialize Hive box
  static Future<void> init() async {
    _hiveBox = await Hive.openBox(AppConstants.hiveBoxName);
  }

  // SharedPreferences operations
  static Future<void> setString(String key, String value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('${AppConstants.storagePrefix}$key', value);
  }

  static Future<String?> getString(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('${AppConstants.storagePrefix}$key');
  }

  static Future<void> setInt(String key, int value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('${AppConstants.storagePrefix}$key', value);
  }

  static Future<int?> getInt(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt('${AppConstants.storagePrefix}$key');
  }

  static Future<void> setBool(String key, bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('${AppConstants.storagePrefix}$key', value);
  }

  static Future<bool?> getBool(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool('${AppConstants.storagePrefix}$key');
  }

  static Future<void> remove(String key) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('${AppConstants.storagePrefix}$key');
  }

  static Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    final keys = prefs.getKeys();
    for (final key in keys) {
      if (key.startsWith(AppConstants.storagePrefix)) {
        await prefs.remove(key);
      }
    }
  }

  // Hive operations (for complex objects)
  static Future<void> put(String key, dynamic value) async {
    if (_hiveBox == null) await init();
    await _hiveBox!.put(key, value);
  }

  static dynamic get(String key) {
    if (_hiveBox == null) return null;
    return _hiveBox!.get(key);
  }

  static Future<void> delete(String key) async {
    if (_hiveBox == null) await init();
    await _hiveBox!.delete(key);
  }

  static Future<void> clearHive() async {
    if (_hiveBox == null) await init();
    await _hiveBox!.clear();
  }
}

