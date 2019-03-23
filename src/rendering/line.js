const webgl = require("../utils/webgl");
const source = require("../shaders/line");

const createProgram = gl => webgl.createProgram(gl, source);

const createDrawingObject = (gl, programs, state, id) => ({
  programInfo: programs[state.types[id]],
  attributesInfo: {
    aY: webgl.createAttributeInfo(gl, state.columns[id])
  },
  uniformsInfo: {
    uMin: () => ["2f", [state.xminmax.min, state.yminmax.min]],
    uMax: () => ["2f", [state.xminmax.max, state.yminmax.max]],
    uColor: () => ["4f", state.colorsRGBA[id]]
  },
  skip: () => state.colorsRGBA[id][3] === 0,
  draw: () => gl.drawArrays(gl.LINE_STRIP, 0, state.columns.x.length)
});

module.exports.createProgram = createProgram;
module.exports.createDrawingObject = createDrawingObject;
