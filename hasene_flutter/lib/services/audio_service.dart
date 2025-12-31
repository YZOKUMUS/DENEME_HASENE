import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/foundation.dart';

class AudioService {
  final AudioPlayer _audioPlayer = AudioPlayer();
  bool _isPlaying = false;

  bool get isPlaying => _isPlaying;

  // Play audio from URL
  Future<void> playFromUrl(String url) async {
    try {
      await _audioPlayer.play(UrlSource(url));
      _isPlaying = true;
    } catch (e) {
      debugPrint('Error playing audio: $e');
      _isPlaying = false;
    }
  }

  // Play audio from asset
  Future<void> playFromAsset(String assetPath) async {
    try {
      await _audioPlayer.play(AssetSource(assetPath));
      _isPlaying = true;
    } catch (e) {
      debugPrint('Error playing audio from asset: $e');
      _isPlaying = false;
    }
  }

  // Stop audio
  Future<void> stop() async {
    try {
      await _audioPlayer.stop();
      _isPlaying = false;
    } catch (e) {
      debugPrint('Error stopping audio: $e');
    }
  }

  // Pause audio
  Future<void> pause() async {
    try {
      await _audioPlayer.pause();
      _isPlaying = false;
    } catch (e) {
      debugPrint('Error pausing audio: $e');
    }
  }

  // Resume audio
  Future<void> resume() async {
    try {
      await _audioPlayer.resume();
      _isPlaying = true;
    } catch (e) {
      debugPrint('Error resuming audio: $e');
    }
  }

  // Dispose
  void dispose() {
    _audioPlayer.dispose();
  }
}

