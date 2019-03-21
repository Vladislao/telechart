const { colorToRgba } = require("../utils/transformations");
const { createProgram, compileShader } = require("../utils/webgl");
const { FSHADER_SOURCE, VSHADER_SOURCE } = require("../shaders/shaders");

module.exports = (data, options) => {
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

  const renderBorder = () => {
    const xVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, xVertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 1, 0]),
      gl.STATIC_DRAW
    );

    const aX = gl.getAttribLocation(program, "aX");
    gl.vertexAttribPointer(aX, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aX);

    const yVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, yVertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 1, 1, 0, 0]),
      gl.STATIC_DRAW
    );

    const aY = gl.getAttribLocation(program, "aY");
    gl.vertexAttribPointer(aY, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aY);

    const uN = gl.getUniformLocation(program, "uMin");
    gl.uniform2f(uN, 0, 0);

    const uM = gl.getUniformLocation(program, "uMax");
    gl.uniform2f(uM, 1, 1);

    const uColor = gl.getUniformLocation(program, "uColor");
    gl.uniform4f(uColor, 1, 1, 0, 1);

    return 5;
  };

  const renderLine = name => {
    const xVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, xVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, buffers.x, gl.STATIC_DRAW);

    const aX = gl.getAttribLocation(program, "aX");
    gl.vertexAttribPointer(aX, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aX);

    const yVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, yVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, buffers[name], gl.STATIC_DRAW);

    const aY = gl.getAttribLocation(program, "aY");
    gl.vertexAttribPointer(aY, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aY);

    const uN = gl.getUniformLocation(program, "uMin");
    gl.uniform2f(uN, 1542412800000, 20);

    const uM = gl.getUniformLocation(program, "uMax");
    gl.uniform2f(uM, 1552003200000, 278);

    const uColor = gl.getUniformLocation(program, "uColor");
    console.log();
    gl.uniform4f.apply(gl, [uColor].concat(colorToRgba(data.colors[name])));

    return buffers.x.length;
  };

  const render = () => {
    console.log(`canvas: ${canvas.width}px x ${canvas.height}px`);
    console.log(
      `client: ${gl.canvas.clientWidth}px x ${gl.canvas.clientHeight}px`
    );
    console.log(
      `buffer: ${gl.drawingBufferWidth}px x ${gl.drawingBufferHeight}px`
    );

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // const coords = coordSystem();
    // gl.drawArrays(gl.LINES, 0, coords);

    const line = renderLine("y0");
    gl.drawArrays(gl.LINE_STRIP, 0, line);

    const line2 = renderLine("y1");
    gl.drawArrays(gl.LINE_STRIP, 0, line2);

    const border = renderBorder();
    gl.drawArrays(gl.LINE_STRIP, 0, border);
  };

  const resize = () => {};

  render();
  window.requestAnimationFrame(render);

  return canvas;
};
