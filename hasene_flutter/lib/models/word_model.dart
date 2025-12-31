import 'package:json_annotation/json_annotation.dart';

part 'word_model.g.dart';

@JsonSerializable()
class WordModel {
  final String id;
  final String arabic;
  final String anlam;
  final int difficulty;
  final String? sure;
  final String? ayet;
  final String? audioUrl;

  WordModel({
    required this.id,
    required this.arabic,
    required this.anlam,
    required this.difficulty,
    this.sure,
    this.ayet,
    this.audioUrl,
  });

  factory WordModel.fromJson(Map<String, dynamic> json) =>
      _$WordModelFromJson(json);

  Map<String, dynamic> toJson() => _$WordModelToJson(this);
}

