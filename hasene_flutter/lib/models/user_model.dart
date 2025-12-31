import 'package:json_annotation/json_annotation.dart';

part 'user_model.g.dart';

@JsonSerializable()
class UserModel {
  final String id;
  final String? username;
  final String? email;
  final int totalPoints;
  final int starPoints;
  final int currentLevel;
  final int currentStreak;
  final int bestStreak;
  
  @JsonKey(fromJson: _dateTimeFromJson, toJson: _dateTimeToJson)
  final DateTime? createdAt;
  
  @JsonKey(fromJson: _dateTimeFromJson, toJson: _dateTimeToJson)
  final DateTime? updatedAt;
  
  static DateTime? _dateTimeFromJson(String? timestamp) {
    if (timestamp == null) return null;
    return DateTime.tryParse(timestamp);
  }
  
  static String? _dateTimeToJson(DateTime? dateTime) {
    return dateTime?.toIso8601String();
  }

  UserModel({
    required this.id,
    this.username,
    this.email,
    this.totalPoints = 0,
    this.starPoints = 0,
    this.currentLevel = 1,
    this.currentStreak = 0,
    this.bestStreak = 0,
    this.createdAt,
    this.updatedAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);

  Map<String, dynamic> toJson() => _$UserModelToJson(this);

  UserModel copyWith({
    String? id,
    String? username,
    String? email,
    int? totalPoints,
    int? starPoints,
    int? currentLevel,
    int? currentStreak,
    int? bestStreak,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return UserModel(
      id: id ?? this.id,
      username: username ?? this.username,
      email: email ?? this.email,
      totalPoints: totalPoints ?? this.totalPoints,
      starPoints: starPoints ?? this.starPoints,
      currentLevel: currentLevel ?? this.currentLevel,
      currentStreak: currentStreak ?? this.currentStreak,
      bestStreak: bestStreak ?? this.bestStreak,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

