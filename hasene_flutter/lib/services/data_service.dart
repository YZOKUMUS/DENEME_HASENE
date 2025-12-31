import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/word_model.dart';

class DataService {
  Future<List<WordModel>> loadWords() async {
    try {
      final String jsonString = await rootBundle.loadString(
        'assets/data/kelimebul.json',
      );
      final List<dynamic> jsonList = json.decode(jsonString);
      return jsonList.map((json) => WordModel.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Kelimeler yüklenemedi: $e');
    }
  }

  Future<List<Map<String, dynamic>>> loadAyet() async {
    try {
      final String jsonString = await rootBundle.loadString(
        'assets/data/ayetoku.json',
      );
      return List<Map<String, dynamic>>.from(json.decode(jsonString));
    } catch (e) {
      throw Exception('Ayetler yüklenemedi: $e');
    }
  }

  Future<List<Map<String, dynamic>>> loadDua() async {
    try {
      final String jsonString = await rootBundle.loadString(
        'assets/data/duaet.json',
      );
      return List<Map<String, dynamic>>.from(json.decode(jsonString));
    } catch (e) {
      throw Exception('Dualar yüklenemedi: $e');
    }
  }

  Future<List<Map<String, dynamic>>> loadHadis() async {
    try {
      final String jsonString = await rootBundle.loadString(
        'assets/data/hadisoku.json',
      );
      return List<Map<String, dynamic>>.from(json.decode(jsonString));
    } catch (e) {
      throw Exception('Hadisler yüklenemedi: $e');
    }
  }

  Future<List<Map<String, dynamic>>> loadHarf() async {
    try {
      final String jsonString = await rootBundle.loadString(
        'assets/data/harf.json',
      );
      return List<Map<String, dynamic>>.from(json.decode(jsonString));
    } catch (e) {
      throw Exception('Harfler yüklenemedi: $e');
    }
  }
}

