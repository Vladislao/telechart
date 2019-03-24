const webgl = require("../utils/webgl");
const source = require("../shaders/simple");

const createProgram = gl => webgl.createProgram(gl, source);

const createDrawingObject = (gl, programs, state, i) => ({
  programInfo: programs.simple,
  attributesInfo: {
    aX: webgl.createAttributeInfo(gl, new Float32Array([0, 1])),
    aY: webgl.createAttributeInfo(gl, new Float32Array([0, 0]))
  },
  uniformsInfo: {
    uOffset: () => {
      return ["2f", [0, state.minmax.y0.steps[i].point]];
    },
    uScale: () => ["2f", [1, 1]],
    uColor: () => ["4f", [0.5, 0.5, 0.5, 0.7]]
  },
  skip: () => state.minmax.y0.steps[i].point > 0.98,
  draw: () => gl.drawArrays(gl.LINES, 0, 2)
});

module.exports.createProgram = createProgram;
module.exports.createDrawingObject = createDrawingObject;
