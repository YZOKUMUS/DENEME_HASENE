import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/user_model.dart';
import '../utils/constants.dart';

class FirebaseService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // User Operations
  Future<Map<String, dynamic>?> getUserData(String userId) async {
    try {
      final doc = await _firestore
          .collection(AppConstants.usersCollection)
          .doc(userId)
          .get();
      return doc.data();
    } catch (e) {
      throw Exception('Kullanıcı verisi yüklenemedi: $e');
    }
  }

  Future<void> saveUserData(UserModel user) async {
    try {
      await _firestore
          .collection(AppConstants.usersCollection)
          .doc(user.id)
          .set(user.toJson(), SetOptions(merge: true));
    } catch (e) {
      throw Exception('Kullanıcı verisi kaydedilemedi: $e');
    }
  }

  // Stats Operations
  Future<Map<String, dynamic>?> getStatsData(String userId) async {
    try {
      final doc = await _firestore
          .collection(AppConstants.statsCollection)
          .doc(userId)
          .get();
      return doc.data();
    } catch (e) {
      return null;
    }
  }

  Future<void> saveStatsData(String userId, Map<String, dynamic> stats) async {
    try {
      await _firestore
          .collection(AppConstants.statsCollection)
          .doc(userId)
          .set(stats, SetOptions(merge: true));
    } catch (e) {
      // Silent fail for stats
    }
  }

  // Leaderboard Operations
  Future<List<Map<String, dynamic>>> getLeaderboard({
    int limit = 100,
  }) async {
    try {
      final snapshot = await _firestore
          .collection(AppConstants.leaderboardCollection)
          .orderBy('weeklyXP', descending: true)
          .limit(limit)
          .get();
      
      return snapshot.docs.map((doc) => {
        'id': doc.id,
        ...doc.data(),
      }).toList();
    } catch (e) {
      return [];
    }
  }
}

