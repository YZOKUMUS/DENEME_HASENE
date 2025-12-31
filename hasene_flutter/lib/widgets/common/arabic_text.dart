import 'package:flutter/material.dart';

class ArabicText extends StatelessWidget {
  final String text;
  final double? fontSize;
  final FontWeight? fontWeight;
  final Color? color;
  final TextAlign? textAlign;

  const ArabicText({
    super.key,
    required this.text,
    this.fontSize,
    this.fontWeight,
    this.color,
    this.textAlign,
  });

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: TextStyle(
        fontFamily: 'KFGQPCUthmanicScriptHAFS',
        fontSize: fontSize ?? 24,
        fontWeight: fontWeight ?? FontWeight.normal,
        color: color,
      ),
      textDirection: TextDirection.rtl,
      textAlign: textAlign ?? TextAlign.center,
    );
  }
}

