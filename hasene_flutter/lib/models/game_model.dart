import 'package:json_annotation/json_annotation.dart';

part 'game_model.g.dart';

@JsonSerializable()
class GameModel {
  final String id;
  final String gameMode; // 'kelime-sinavi' veya 'ilim-modu'
  final String? subMode; // Alt mod (classic, juz30, review, favorites)
  final String difficulty;
  final List<QuestionModel> questions;
  final int currentQuestion;
  final int sessionScore;
  final int sessionCorrect;
  final int sessionWrong;
  final int comboCount;
  
  @JsonKey(fromJson: _dateTimeFromJson, toJson: _dateTimeToJson)
  final DateTime startTime;
  
  static DateTime _dateTimeFromJson(String timestamp) {
    return DateTime.parse(timestamp);
  }
  
  static String _dateTimeToJson(DateTime dateTime) {
    return dateTime.toIso8601String();
  }

  GameModel({
    required this.id,
    required this.gameMode,
    this.subMode,
    required this.difficulty,
    required this.questions,
    this.currentQuestion = 0,
    this.sessionScore = 0,
    this.sessionCorrect = 0,
    this.sessionWrong = 0,
    this.comboCount = 0,
    DateTime? startTime,
  }) : startTime = startTime ?? DateTime.now();

  factory GameModel.fromJson(Map<String, dynamic> json) =>
      _$GameModelFromJson(json);

  Map<String, dynamic> toJson() => _$GameModelToJson(this);

  bool get isCompleted => currentQuestion >= questions.length;
  bool get isPerfect => sessionWrong == 0 && sessionCorrect == questions.length && questions.length >= 3;
  
  GameModel copyWith({
    String? id,
    String? gameMode,
    String? subMode,
    String? difficulty,
    List<QuestionModel>? questions,
    int? currentQuestion,
    int? sessionScore,
    int? sessionCorrect,
    int? sessionWrong,
    int? comboCount,
    DateTime? startTime,
  }) {
    return GameModel(
      id: id ?? this.id,
      gameMode: gameMode ?? this.gameMode,
      subMode: subMode ?? this.subMode,
      difficulty: difficulty ?? this.difficulty,
      questions: questions ?? this.questions,
      currentQuestion: currentQuestion ?? this.currentQuestion,
      sessionScore: sessionScore ?? this.sessionScore,
      sessionCorrect: sessionCorrect ?? this.sessionCorrect,
      sessionWrong: sessionWrong ?? this.sessionWrong,
      comboCount: comboCount ?? this.comboCount,
      startTime: startTime ?? this.startTime,
    );
  }
}

@JsonSerializable()
class QuestionModel {
  final String id;
  final String question;
  final String questionType; // 'kelime-cevir', 'dinle-bul', 'bosluk-doldur', 'ayet-oku', 'dua-et', 'hadis-oku'
  final String correctAnswer;
  final List<String> options;
  final int correctIndex;
  final Map<String, dynamic>? metadata;

  QuestionModel({
    required this.id,
    required this.question,
    required this.questionType,
    required this.correctAnswer,
    required this.options,
    required this.correctIndex,
    this.metadata,
  });

  factory QuestionModel.fromJson(Map<String, dynamic> json) =>
      _$QuestionModelFromJson(json);

  Map<String, dynamic> toJson() => _$QuestionModelToJson(this);
}
