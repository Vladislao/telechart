const { setAttributes, setUniforms } = require("./webgl");

const resize = gl => {
  var realToCSSPixels = window.devicePixelRatio;

  // Lookup the size the browser is displaying the canvas in CSS pixels
  // and compute a size needed to make our drawingbuffer match it in
  // device pixels.
  var displayWidth = Math.floor(gl.canvas.clientWidth * realToCSSPixels);
  var displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels);

  // Check if the canvas is not the same size.
  if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
    // Make the canvas the same size
    gl.canvas.width = displayWidth;
    gl.canvas.height = displayHeight;
  }
};

module.exports = (gl, commonAttributes, drawingObjects) => {
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  return () => {
    resize(gl);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let lastProgram = null;
    drawingObjects.forEach(v => {
      if (v.skip()) return;

      if (lastProgram !== v.programInfo.program) {
        gl.useProgram(v.programInfo.program);
        lastProgram = v.programInfo.program;
      }

      setAttributes(
        gl,
        v.programInfo.attributes,
        Object.assign({}, commonAttributes, v.attributesInfo)
      );

      setUniforms(gl, v.programInfo.uniforms, v.uniformsInfo);

      v.draw();
    });
  };
};
