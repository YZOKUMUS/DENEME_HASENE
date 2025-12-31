import 'package:flutter/foundation.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';
import '../services/firebase_service.dart';

class UserProvider with ChangeNotifier {
  UserModel? _currentUser;
  bool _isInitialized = false;
  bool _isLoading = false;

  UserModel? get currentUser => _currentUser;
  bool get isInitialized => _isInitialized;
  bool get isLoading => _isLoading;

  final AuthService _authService = AuthService();
  final FirebaseService _firebaseService = FirebaseService();

  UserProvider() {
    _initialize();
  }

  Future<void> _initialize() async {
    _isLoading = true;
    notifyListeners();

    try {
      // Try to get current user from auth
      final user = await _authService.getCurrentUser();
      
      if (user != null) {
        // Load user data from Firestore
        final userData = await _firebaseService.getUserData(user.uid);
        if (userData != null) {
          _currentUser = UserModel.fromJson(userData);
        } else {
          // Create new user
          _currentUser = UserModel(
            id: user.uid,
            username: user.displayName,
            email: user.email,
            createdAt: DateTime.now(),
          );
          await _firebaseService.saveUserData(_currentUser!);
        }
      }
    } catch (e) {
      debugPrint('Error initializing user: $e');
    } finally {
      _isInitialized = true;
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> login(String username) async {
    _isLoading = true;
    notifyListeners();

    try {
      final user = await _authService.signInAnonymously();
      if (user != null) {
        _currentUser = UserModel(
          id: user.uid,
          username: username,
          createdAt: DateTime.now(),
        );
        await _firebaseService.saveUserData(_currentUser!);
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      debugPrint('Error logging in: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await _authService.signOut();
    _currentUser = null;
    notifyListeners();
  }

  Future<void> updateUser(UserModel user) async {
    _currentUser = user;
    await _firebaseService.saveUserData(user);
    notifyListeners();
  }

  Future<void> updatePoints(int points) async {
    if (_currentUser == null) return;
    
    _currentUser = _currentUser!.copyWith(
      totalPoints: _currentUser!.totalPoints + points,
      updatedAt: DateTime.now(),
    );
    await _firebaseService.saveUserData(_currentUser!);
    notifyListeners();
  }
}

