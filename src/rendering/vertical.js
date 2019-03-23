const webgl = require("../utils/webgl");
const source = require("../shaders/vertical");

const createProgram = gl => webgl.createProgram(gl, source);

const createDrawingObject = (gl, programs, state) => ({
  programInfo: programs.vertical,
  attributesInfo: {
    aY: webgl.createAttributeInfo(gl, new Float32Array([0, 1]))
  },
  uniformsInfo: {
    uWidth: () => ["1f", gl.canvas.width / window.devicePixelRatio],
    uX: () => ["1f", state.offsetX],
    uColor: () => ["4f", [0.5, 0.5, 0.5, 0.7]]
  },
  skip: () => state.offsetX === null,
  draw: () => gl.drawArrays(gl.LINE_STRIP, 0, 2)
});

module.exports.createProgram = createProgram;
module.exports.createDrawingObject = createDrawingObject;
