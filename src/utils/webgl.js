const compileShader = (gl, shaderSource, shaderType) => {
  var shader = gl.createShader(shaderType);

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    throw "could not compile shader:" + gl.getShaderInfoLog(shader);
  }

  return shader;
};

const createProgram = (gl, vertexShader, fragmentShader) => {
  var program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    throw "program filed to link:" + gl.getProgramInfoLog(program);
  }

  return program;
};

module.exports.compileShader = compileShader;
module.exports.createProgram = createProgram;
