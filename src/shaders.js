module.exports.VSHADER_SOURCE = `
  precision mediump float;

  attribute float aX;
  attribute float aY;
  uniform vec2 uN;
  uniform vec2 uM;

  void main() {
    vec2 position = (vec2(aX, aY) - uN) / (uM - uN);

    vec2 clipSpace = position * 2.0 - 1.0;

    gl_Position = vec4(clipSpace, 1, 1);
  }
`;

module.exports.FSHADER_SOURCE = `
  precision mediump float;

  uniform vec4 uColor;

  void main() {
    gl_FragColor = uColor;
  }
`;
