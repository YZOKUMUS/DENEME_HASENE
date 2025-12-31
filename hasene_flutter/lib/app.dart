import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'providers/user_provider.dart';
import 'screens/splash/splash_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/home/home_screen.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<UserProvider>(
      builder: (context, userProvider, _) {
        // Check if user is initialized
        if (!userProvider.isInitialized) {
          return const SplashScreen();
        }

        // Check if user is logged in
        if (userProvider.currentUser == null) {
          return const LoginScreen();
        }

        // User is logged in, show home screen
        return const HomeScreen();
      },
    );
  }
}

