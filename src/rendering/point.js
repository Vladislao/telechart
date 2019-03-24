const webgl = require("../utils/webgl");
const source = require("../shaders/simple");
const { ratio, expandCircle } = require("../utils/transformation");

const circle = expandCircle(24);

const createProgram = gl => webgl.createProgram(gl, source);

const createDrawingObject = (gl, programs, state, id) => ({
  programInfo: programs.simple,
  attributesInfo: {
    aX: webgl.createAttributeInfo(gl, new Float32Array(circle.x)),
    aY: webgl.createAttributeInfo(gl, new Float32Array(circle.y))
  },
  uniformsInfo: {
    uOffset: () => ["2f", [state.tooltip.x, state.tooltip.columns[id]]],
    uScale: () => ["2f", ratio(10, 10, gl.canvas.width, gl.canvas.height)],
    uColor: () => {
      const c = state.colorsRGBA[id];
      return ["4f", [c[0], c[1], c[2], 0.5]];
    }
  },
  skip: () =>
    state.colorsRGBA[id][3] === 0 ||
    state.tooltip.columns[id] === undefined ||
    state.tooltip.offsetX === null,
  draw: () => gl.drawArrays(gl.TRIANGLE_FAN, 0, circle.x.length)
});

module.exports.createProgram = createProgram;
module.exports.createDrawingObject = createDrawingObject;
