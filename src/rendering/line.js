const webgl = require("../utils/webgl");
const source = require("../shaders/line");

const { closest } = require("../utils/transformation");

const createProgram = gl => webgl.createProgram(gl, source);

const createDrawingObject = (gl, programs, state, id, type) => ({
  programInfo: programs[state.types[id]],
  attributesInfo: {
    aY: webgl.createAttributeInfo(gl, state.columns[id])
  },
  uniformsInfo: {
    uMin: () => [
      "2f",
      [
        state.minmax.x.min,
        type === "full" ? state.minmax.y.scale.min : state.minmax.y0.scale.min
      ]
    ],
    uMax: () => [
      "2f",
      [
        state.minmax.x.max,
        type === "full" ? state.minmax.y.scale.max : state.minmax.y0.scale.max
      ]
    ],
    uView: () => [
      "2f",
      type === "full" ? [0, 1] : [state.window.offset, state.window.width]
    ],
    uColor: () => ["4f", state.colorsRGBA[id]]
  },
  skip: () => state.colorsRGBA[id][3] === 0,
  draw: () => {
    const offset = type === "full" ? 0 : Math.max(state.window.index - 1, 0);
    gl.drawArrays(gl.LINE_STRIP, offset, state.columns.x.length - offset);
  }
});

module.exports.createProgram = createProgram;
module.exports.createDrawingObject = createDrawingObject;
