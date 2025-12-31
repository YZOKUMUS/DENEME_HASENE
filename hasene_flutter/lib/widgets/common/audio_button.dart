import 'package:flutter/material.dart';
import '../../services/audio_service.dart';
import '../../utils/theme.dart';

class AudioButton extends StatefulWidget {
  final String? audioUrl;
  final String? assetPath;
  final double size;
  final Color? color;

  const AudioButton({
    super.key,
    this.audioUrl,
    this.assetPath,
    this.size = 48,
    this.color,
  }) : assert(audioUrl != null || assetPath != null);

  @override
  State<AudioButton> createState() => _AudioButtonState();
}

class _AudioButtonState extends State<AudioButton> {
  final AudioService _audioService = AudioService();
  bool _isPlaying = false;

  @override
  void dispose() {
    _audioService.dispose();
    super.dispose();
  }

  Future<void> _playAudio() async {
    if (_isPlaying) {
      await _audioService.stop();
      setState(() => _isPlaying = false);
      return;
    }

    setState(() => _isPlaying = true);

    if (widget.audioUrl != null) {
      await _audioService.playFromUrl(widget.audioUrl!);
    } else if (widget.assetPath != null) {
      await _audioService.playFromAsset(widget.assetPath!);
    }

    // Reset playing state after audio completes
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        setState(() => _isPlaying = false);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return IconButton(
      onPressed: _playAudio,
      icon: Icon(
        _isPlaying ? Icons.volume_up : Icons.volume_down,
        size: widget.size,
        color: widget.color ?? AppTheme.primary,
      ),
      tooltip: 'Dinle',
    );
  }
}

