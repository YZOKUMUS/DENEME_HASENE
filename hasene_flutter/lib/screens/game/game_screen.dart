import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/game_provider.dart';
import '../../providers/user_provider.dart';
import '../../providers/stats_provider.dart';
import '../../utils/theme.dart';
import '../../utils/constants.dart';
import '../../widgets/game/progress_bar.dart';
import '../../widgets/common/arabic_text.dart';
import '../../widgets/common/audio_button.dart';

class GameScreen extends StatelessWidget {
  const GameScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final gameProvider = Provider.of<GameProvider>(context);
    final game = gameProvider.currentGame;

    if (game == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (game.isCompleted) {
      return _buildGameCompleteScreen(context, game);
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Soru ${game.currentQuestion + 1}/${game.questions.length}'),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () {
            gameProvider.endGame();
            Navigator.pop(context);
          },
        ),
      ),
      body: _buildQuestionScreen(context, game),
    );
  }

  Widget _buildQuestionScreen(BuildContext context, game) {
    final question = game.questions[game.currentQuestion];
    final gameProvider = Provider.of<GameProvider>(context);
    final questionType = question.questionType;

    // Okuma modları için farklı UI
    if (questionType == 'ayet-oku' || questionType == 'dua-et' || questionType == 'hadis-oku') {
      return _buildReadingScreen(context, question, game);
    }

    // Normal soru ekranı (Kelime Çevir, Dinle Bul, Boşluk Doldur)
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Progress bar
          GameProgressBar(
            current: game.currentQuestion + 1,
            total: game.questions.length,
          ),
          const SizedBox(height: 24),
          // Score
          Text(
            'Hasene: ${game.sessionScore}',
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.primary,
            ),
          ),
          if (game.comboCount > 0) ...[
            const SizedBox(height: 8),
            Text(
              '🔥 Combo: ${game.comboCount}',
              style: const TextStyle(
                fontSize: 14,
                color: AppTheme.warning,
              ),
            ),
          ],
          const SizedBox(height: 32),
          // Question (Arabic text)
          Card(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  // Soru tipi göstergesi
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppTheme.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      _getQuestionTypeLabel(questionType),
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.primary,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Boşluk doldur için özel gösterim
                  if (questionType == 'bosluk-doldur') ...[
                    // Ayet metni (boşluklu)
                    Center(
                      child: ArabicText(
                        text: question.question,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    // Meâl (varsa)
                    if (question.metadata?['meal'] != null)
                      Text(
                        'Meâl: ${question.metadata!['meal']}',
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppTheme.textSecondary,
                        ),
                        textAlign: TextAlign.center,
                      ),
                  ] else ...[
                    // Normal soru (Kelime Çevir, Dinle Bul)
                    Center(
                      child: ArabicText(
                        text: question.question,
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                  // Audio button (Dinle Bul için)
                  if (questionType == 'dinle-bul') ...[
                    const SizedBox(height: 16),
                    AudioButton(
                      audioUrl: question.metadata?['audioUrl'],
                    ),
                  ],
                ],
              ),
            ),
          ),
          const SizedBox(height: 32),
          // Options
          Expanded(
            child: ListView.builder(
              itemCount: question.options.length,
              itemBuilder: (context, index) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: ElevatedButton(
                    onPressed: () {
                      gameProvider.answerQuestion(index);
                      _handleAnswer(context, index == question.correctIndex);
                    },
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.all(16),
                      backgroundColor: AppTheme.surface,
                      foregroundColor: AppTheme.text,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(
                      question.options[index],
                      style: const TextStyle(fontSize: 16),
                      textAlign: TextAlign.center,
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReadingScreen(BuildContext context, question, game) {
    final questionType = question.questionType;
    final metadata = question.metadata ?? {};
    
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Progress bar
          GameProgressBar(
            current: game.currentQuestion + 1,
            total: game.questions.length,
          ),
          const SizedBox(height: 24),
          // Soru tipi başlığı
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: AppTheme.primary,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              _getQuestionTypeLabel(questionType),
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
          const SizedBox(height: 24),
          // Arapça metin
          Expanded(
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Başlık bilgisi
                      if (metadata['sure'] != null && metadata['ayet'] != null)
                        Text(
                          '${metadata['sure']}:${metadata['ayet']}',
                          style: const TextStyle(
                            fontSize: 14,
                            color: AppTheme.textSecondary,
                          ),
                        ),
                      const SizedBox(height: 16),
                      // Arapça metin
                      Center(
                        child: ArabicText(
                          text: question.question,
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 24),
                      // Meâl
                      if (metadata['meal'] != null) ...[
                        const Divider(),
                        const SizedBox(height: 16),
                        Text(
                          'Meâl:',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          metadata['meal'],
                          style: const TextStyle(
                            fontSize: 16,
                            height: 1.6,
                          ),
                        ),
                      ],
                      // Hadis için ek bilgiler
                      if (questionType == 'hadis-oku') ...[
                        if (metadata['kategori'] != null) ...[
                          const SizedBox(height: 16),
                          Text(
                            'Kategori: ${metadata['kategori']}',
                            style: const TextStyle(
                              fontSize: 14,
                              color: AppTheme.textSecondary,
                            ),
                          ),
                        ],
                        if (metadata['kaynak'] != null) ...[
                          const SizedBox(height: 8),
                          Text(
                            'Kaynak: ${metadata['kaynak']}',
                            style: const TextStyle(
                              fontSize: 14,
                              color: AppTheme.textSecondary,
                            ),
                          ),
                        ],
                      ],
                    ],
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          // Devam butonu
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                final gameProvider = Provider.of<GameProvider>(context, listen: false);
                gameProvider.answerQuestion(0); // Okuma modu için direkt geç
              },
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text(
                'Devam Et',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getQuestionTypeLabel(String questionType) {
    switch (questionType) {
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
      default:
        return 'Soru';
    }
  }

  void _handleAnswer(BuildContext context, bool isCorrect) {
    if (isCorrect) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✅ Doğru!'),
          backgroundColor: AppTheme.success,
          duration: Duration(seconds: 1),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('❌ Yanlış!'),
          backgroundColor: AppTheme.error,
          duration: Duration(seconds: 1),
        ),
      );
    }
  }

  Widget _buildGameCompleteScreen(BuildContext context, game) {
    final gameProvider = Provider.of<GameProvider>(context);
    final userProvider = Provider.of<UserProvider>(context);
    final statsProvider = Provider.of<StatsProvider>(context);

    final isPerfect = game.isPerfect;
    final perfectBonus = isPerfect ? AppConstants.perfectLessonBonus : 0;
    final totalScore = game.sessionScore + perfectBonus;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Oyun Bitti!'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (isPerfect)
              const Text(
                '⭐ Mükemmel Ders!',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.success,
                ),
              ),
            const SizedBox(height: 32),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    _buildResultItem('✅ Doğru', game.sessionCorrect),
                    _buildResultItem('❌ Yanlış', game.sessionWrong),
                    _buildResultItem('💰 Kazanılan Hasene', game.sessionScore),
                    if (isPerfect)
                      _buildResultItem('⭐ Perfect Bonus', perfectBonus),
                    const Divider(),
                    _buildResultItem(
                      '🎉 Toplam Hasene',
                      totalScore,
                      isTotal: true,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      // Update user points
                      userProvider.updatePoints(totalScore);
                      // Update stats
                      statsProvider.updateStats(
                        correct: game.sessionCorrect,
                        wrong: game.sessionWrong,
                        gameMode: game.gameMode,
                      );
                      // End game and go back
                      gameProvider.endGame();
                      Navigator.pop(context);
                    },
                    child: const Text('Ana Menüye Dön'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      // Restart game with same mode
                      gameProvider.endGame();
                      Navigator.pop(context);
                    },
                    child: const Text('Tekrar Oyna'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResultItem(String label, int value, {bool isTotal = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: isTotal ? 20 : 16,
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
            ),
          ),
          Text(
            value.toString(),
            style: TextStyle(
              fontSize: isTotal ? 24 : 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.primary,
            ),
          ),
        ],
      ),
    );
  }
}
