const webgl = require("../utils/webgl");
const source = require("../shaders/simple");

const createProgram = gl => webgl.createProgram(gl, source);

const createDrawingObject = (gl, programs, state) => ({
  programInfo: programs.simple,
  attributesInfo: {
    aY: webgl.createAttributeInfo(gl, new Float32Array([0, 1])),
    aX: webgl.createAttributeInfo(gl, new Float32Array([0, 0]))
  },
  uniformsInfo: {
    uOffset: () => {
      return [
        "2f",
        [(state.tooltip.offsetX / gl.canvas.width) * window.devicePixelRatio, 0]
      ];
    },
    uScale: () => ["2f", [1, 1]],
    uColor: () => ["4f", [0.5, 0.5, 0.5, 0.7]]
  },
  skip: () => state.tooltip.offsetX === null,
  draw: () => gl.drawArrays(gl.LINE_STRIP, 0, 2)
});

module.exports.createProgram = createProgram;
module.exports.createDrawingObject = createDrawingObject;
