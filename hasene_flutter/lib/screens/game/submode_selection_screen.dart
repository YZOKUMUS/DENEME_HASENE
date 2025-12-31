import 'package:flutter/material.dart';
import '../../utils/theme.dart';
import '../../utils/constants.dart';

class SubModeSelectionScreen extends StatelessWidget {
  const SubModeSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final subModes = [
      {
        'mode': AppConstants.subModeClassic,
        'icon': '🎯',
        'title': 'Klasik Oyun',
        'desc': 'Tüm kelimelerden rastgele seçim',
      },
      {
        'mode': AppConstants.subModeJuz30,
        'icon': '📖',
        'title': '30.cüz Ayetlerinin Kelimeleri',
        'desc': 'Sadece 30.cüz ayetlerindeki kelimeler',
      },
      {
        'mode': AppConstants.subModeReview,
        'icon': '🔄',
        'title': 'Yanlış Cevaplanan Kelimeler',
        'desc': 'Daha önce yanlış cevapladığınız kelimeleri tekrar et',
      },
      {
        'mode': AppConstants.subModeFavorites,
        'icon': '⭐',
        'title': 'Favori Kelimeler',
        'desc': 'Favorilerinizden oyna',
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Oyun Modu Seçin'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Kelime Sınavı için bir alt mod seçin:',
              style: TextStyle(
                fontSize: 16,
                color: AppTheme.textSecondary,
              ),
            ),
            const SizedBox(height: 24),
            ...subModes.map((subMode) => _buildSubModeCard(context, subMode)),
          ],
        ),
      ),
    );
  }

  Widget _buildSubModeCard(BuildContext context, Map<String, String> subMode) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Text(subMode['icon']!, style: const TextStyle(fontSize: 32)),
        title: Text(subMode['title']!),
        subtitle: Text(subMode['desc']!),
        trailing: const Icon(Icons.arrow_forward_ios),
        onTap: () {
          Navigator.pop(context, subMode['mode']);
        },
      ),
    );
  }
}

