const { createProgram, compileShader } = require("./utils");
const { FSHADER_SOURCE, VSHADER_SOURCE } = require("./shaders");

// const createLine = () => {
//   return {
//     uniforms: {

//     },
//     programInfo: {

//     },
//     bufferInfo: {

//     }
//   }
// }

module.exports = function telechart(element, data) {
  // TODO: check if already a canvas
  // TODO: check caniuse

  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  const vertexShader = compileShader(gl, VSHADER_SOURCE, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(gl, FSHADER_SOURCE, gl.FRAGMENT_SHADER);

  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  const buffers = data.columns.reduce((acc, v) => {
    acc[v[0]] = new Float32Array(v.slice(1));
    return acc;
  }, {});

  const renderLine = name => {
    const xVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, xVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, buffers.x, gl.STATIC_DRAW);

    const aX = gl.getAttribLocation(program, "aX");
    gl.vertexAttribPointer(aX, 1, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(aX);

    const yVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, yVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, buffers[name], gl.STATIC_DRAW);

    const aY = gl.getAttribLocation(program, "aY");
    gl.vertexAttribPointer(aY, 1, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(aY);

    const uN = gl.getUniformLocation(program, "uN");
    gl.uniform2f(uN, 1542412800000, 0);

    const uM = gl.getUniformLocation(program, "uM");
    gl.uniform2f(uM, 1552003200000, 278);

    const uColor = gl.getUniformLocation(program, "uColor");
    gl.uniform4f(uColor, 1, 0, 0, 1);

    return buffers.x.length / 2;
  };

  const render = () => {
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // const coords = coordSystem();
    // gl.drawArrays(gl.LINES, 0, coords);

    const line = renderLine("y0");
    gl.drawArrays(gl.LINE_STRIP, 0, line);
  };

  const resize = () => {};

  render();

  element.appendChild(canvas);

  return this;
};
