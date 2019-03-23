module.exports.VSHADER_SOURCE = `
  precision mediump float;

  attribute float aY;
  uniform float uX;
  uniform float uWidth;

  void main() {
    vec2 position = vec2(uX / uWidth, aY);
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
