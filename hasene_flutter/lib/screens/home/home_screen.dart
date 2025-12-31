import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/user_provider.dart';
import '../../providers/game_provider.dart';
import '../../utils/theme.dart';
import '../../utils/constants.dart';
import '../game/game_screen.dart';
import '../game/submode_selection_screen.dart';
import '../stats/stats_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hasene Arapça Dersi'),
        actions: [
          IconButton(
            icon: const Icon(Icons.bar_chart),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const StatsScreen(),
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              Provider.of<UserProvider>(context, listen: false).logout();
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Stats Card
            _buildStatsCard(context),
            const SizedBox(height: 24),
            // Difficulty Selector
            _buildDifficultySelector(context),
            const SizedBox(height: 32),
            // Game Modes - YUKARIDAN AŞAĞIYA SIRALI
            _buildGameModes(context),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsCard(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context);
    final user = userProvider.currentUser;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatItem('Toplam Hasene', user?.totalPoints ?? 0),
                _buildStatItem('⭐ Yıldız', user?.starPoints ?? 0),
                _buildStatItem('Mertebe', user?.currentLevel ?? 1),
                _buildStatItem('🔥 Seri', user?.currentStreak ?? 0),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, int value) {
    return Column(
      children: [
        Text(
          value.toString(),
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: AppTheme.primary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: AppTheme.textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildDifficultySelector(BuildContext context) {
    final gameProvider = Provider.of<GameProvider>(context);
    final currentDifficulty = gameProvider.currentDifficulty;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Zorluk Seviyesi',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildDifficultyButton(
                context,
                'Kolay',
                AppConstants.difficultyEasy,
                '🌱',
                '5-8 Hasene',
                currentDifficulty == AppConstants.difficultyEasy,
                () {
                  gameProvider.setDifficulty(AppConstants.difficultyEasy);
                },
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _buildDifficultyButton(
                context,
                'Orta',
                AppConstants.difficultyMedium,
                '⚖️',
                '9-12 Hasene',
                currentDifficulty == AppConstants.difficultyMedium,
                () {
                  gameProvider.setDifficulty(AppConstants.difficultyMedium);
                },
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _buildDifficultyButton(
                context,
                'Zor',
                AppConstants.difficultyHard,
                '🔥',
                '13-21 Hasene',
                currentDifficulty == AppConstants.difficultyHard,
                () {
                  gameProvider.setDifficulty(AppConstants.difficultyHard);
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildDifficultyButton(
    BuildContext context,
    String label,
    String difficulty,
    String icon,
    String subtitle,
    bool isSelected,
    VoidCallback onTap,
  ) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.primary : AppTheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? AppTheme.primary : Colors.grey.shade300,
            width: 2,
          ),
        ),
        child: Column(
          children: [
            Text(icon, style: const TextStyle(fontSize: 24)),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: isSelected ? Colors.white : AppTheme.text,
              ),
            ),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 10,
                color: isSelected ? Colors.white70 : AppTheme.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGameModes(BuildContext context) {
    // İKİ ANA OYUN MODU - YUKARIDAN AŞAĞIYA SIRALI
    final gameModes = [
      {
        'mode': AppConstants.gameModeKelimeSinavi,
        'icon': '📚',
        'title': 'Kelime Sınavı',
        'desc': 'Kelime Çevir, Dinle Bul ve Boşluk Doldur soruları karışık (15 soru)',
        'hasSubMode': true,
      },
      {
        'mode': AppConstants.gameModeIlimModu,
        'icon': '📖',
        'title': 'İlim Modu',
        'desc': 'Ayet Oku, Dua Et ve Hadis Oku içerikleri karışık',
        'hasSubMode': false,
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Oyun Modları',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        ...gameModes.map((mode) => _buildGameModeCard(context, mode)),
      ],
    );
  }

  Widget _buildGameModeCard(BuildContext context, Map<String, dynamic> mode) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 4,
      child: InkWell(
        onTap: () {
          _startGame(context, mode['mode'] as String, mode['hasSubMode'] as bool);
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              // Icon
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: AppTheme.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(
                    mode['icon'] as String,
                    style: const TextStyle(fontSize: 32),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              // Title and Description
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      mode['title'] as String,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      mode['desc'] as String,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_ios, color: AppTheme.primary),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _startGame(BuildContext context, String gameMode, bool hasSubMode) async {
    final gameProvider = Provider.of<GameProvider>(context, listen: false);
    
    // Alt mod seçimi gerekiyorsa önce alt mod seçim ekranına git
    if (hasSubMode && gameMode == AppConstants.gameModeKelimeSinavi) {
      final subMode = await Navigator.push<String>(
        context,
        MaterialPageRoute(
          builder: (context) => const SubModeSelectionScreen(),
        ),
      );
      
      if (subMode == null) return; // Kullanıcı iptal etti
      
      try {
        await gameProvider.startGame(gameMode, subMode: subMode);
        if (context.mounted) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const GameScreen(),
            ),
          );
        }
      } catch (e) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Oyun başlatılamadı: $e'),
              backgroundColor: AppTheme.error,
            ),
          );
        }
      }
    } else {
      // Alt mod seçimi yok, direkt başlat
      try {
        await gameProvider.startGame(gameMode);
        if (context.mounted) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const GameScreen(),
            ),
          );
        }
      } catch (e) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Oyun başlatılamadı: $e'),
              backgroundColor: AppTheme.error,
            ),
          );
        }
      }
    }
  }
}
