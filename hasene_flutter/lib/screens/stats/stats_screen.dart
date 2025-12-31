import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/stats_provider.dart';
import '../../providers/user_provider.dart';
import '../../utils/theme.dart';

class StatsScreen extends StatelessWidget {
  const StatsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final statsProvider = Provider.of<StatsProvider>(context);
    final userProvider = Provider.of<UserProvider>(context);
    final user = userProvider.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('İstatistikler'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Overall Stats
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Genel İstatistikler',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStatItem('Toplam Doğru', statsProvider.totalCorrect),
                        _buildStatItem('Toplam Yanlış', statsProvider.totalWrong),
                        _buildStatItem(
                          'Başarı Oranı',
                          statsProvider.totalCorrect + statsProvider.totalWrong > 0
                              ? ((statsProvider.totalCorrect /
                                      (statsProvider.totalCorrect +
                                          statsProvider.totalWrong)) *
                                  100)
                                  .round()
                              : 0,
                          suffix: '%',
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            // User Stats
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Kullanıcı İstatistikleri',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _buildUserStatRow('Toplam Hasene', user?.totalPoints ?? 0),
                    _buildUserStatRow('⭐ Yıldız', user?.starPoints ?? 0),
                    _buildUserStatRow('Mertebe', user?.currentLevel ?? 1),
                    _buildUserStatRow('🔥 Seri', user?.currentStreak ?? 0),
                    _buildUserStatRow('En İyi Seri', user?.bestStreak ?? 0),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            // Game Mode Stats
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Oyun Modu İstatistikleri',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    ...statsProvider.gameModeCounts.entries.map(
                      (entry) => _buildUserStatRow(
                        _getGameModeName(entry.key),
                        entry.value,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, int value, {String suffix = ''}) {
    return Column(
      children: [
        Text(
          '$value$suffix',
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

  Widget _buildUserStatRow(String label, int value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 16),
          ),
          Text(
            value.toString(),
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.primary,
            ),
          ),
        ],
      ),
    );
  }

  String _getGameModeName(String mode) {
    switch (mode) {
      case 'kelime-cevir':
        return '📚 Kelime Çevir';
      case 'dinle-bul':
        return '🎧 Dinle Bul';
      case 'bosluk-doldur':
        return '✍️ Boşluk Doldur';
      case 'ayet-oku':
        return '📖 Ayet Oku';
      case 'dua-et':
        return '🤲 Dua Et';
      case 'hadis-oku':
        return '📜 Hadis Oku';
      case 'elif-ba':
        return '📘 Elif Ba';
      default:
        return mode;
    }
  }
}

