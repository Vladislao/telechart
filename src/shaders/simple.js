module.exports.VSHADER_SOURCE = `
  precision mediump float;

  attribute float aX;
  attribute float aY;

  uniform vec2 uOffset;
  uniform vec2 uScale;

  void main() {
    vec2 position = vec2(aX, aY) * uScale + uOffset;
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
