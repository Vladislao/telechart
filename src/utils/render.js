const { setAttributes, setUniforms } = require("./webgl");
const { resize } = require("./transformation");

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
      // console.log()
      if (v.debug) {
        console.log(v);
      }

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
