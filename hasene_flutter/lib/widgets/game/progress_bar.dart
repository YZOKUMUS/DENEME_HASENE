import 'package:flutter/material.dart';
import '../../utils/theme.dart';

class GameProgressBar extends StatelessWidget {
  final int current;
  final int total;
  final double height;

  const GameProgressBar({
    super.key,
    required this.current,
    required this.total,
    this.height = 8,
  });

  @override
  Widget build(BuildContext context) {
    final progress = current / total;

    return Container(
      height: height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(height / 2),
        color: Colors.grey.shade200,
      ),
      child: FractionallySizedBox(
        alignment: Alignment.centerLeft,
        widthFactor: progress,
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(height / 2),
            gradient: const LinearGradient(
              colors: [AppTheme.primary, AppTheme.secondary],
            ),
          ),
        ),
      ),
    );
  }
}

