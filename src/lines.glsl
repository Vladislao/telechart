  precision mediump float;

  attribute float aX;
  attribute float aY;

  void main() {
    vec2 position = vec2(aX, aY);
    vec2 zeroToTwo = position * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace, 0, 1);
  }