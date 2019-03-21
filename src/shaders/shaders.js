module.exports.VSHADER_SOURCE = `
  precision mediump float;

  attribute float aX;
  attribute float aY;

  uniform vec2 uMin;
  uniform vec2 uMax;

  void main() {
    vec2 shift = uMax - uMin;
    vec2 position = (vec2(aX, aY) - uMin) / shift;

    vec2 clipSpace = (position * 2.0) - 1.0;

    gl_Position = vec4(clipSpace, 0, 1);
  }
`;

module.exports.FSHADER_SOURCE = `
  precision mediump float;

  uniform vec4 uColor;

  void main() {
    gl_FragColor = uColor;
  }
`;
