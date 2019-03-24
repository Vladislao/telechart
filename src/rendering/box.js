const webgl = require("../utils/webgl");
const { expandRectangle } = require("../utils/transformation");
const source = require("../shaders/simple");

const createProgram = gl => webgl.createProgram(gl, source);

const createControl = (gl, programs, state, y, x) => ({
  zindex: 0,
  programInfo: programs.simple,
  attributesInfo: {
    aY: webgl.createAttributeInfo(gl, new Float32Array(y)),
    aX: () => webgl.createAttributeInfo(gl, new Float32Array(x()))
  },
  uniformsInfo: {
    uOffset: () => ["2f", [0, 0]],
    uScale: () => ["2f", [1, 1]],
    uColor: () => ["4f", state.window.colorsRGBA.control]
  },
  skip: () => false,
  draw: () => gl.drawArrays(gl.TRIANGLES, 0, 6)
});

const createForeground = (gl, programs, state, x) => ({
  zindex: 2,
  programInfo: programs.simple,
  attributesInfo: {
    aY: webgl.createAttributeInfo(
      gl,
      new Float32Array(expandRectangle(0, 1, 1, 0))
    ),
    aX: () => webgl.createAttributeInfo(gl, new Float32Array(x()))
  },
  uniformsInfo: {
    uOffset: () => ["2f", [0, 0]],
    uScale: () => ["2f", [1, 1]],
    uColor: () => ["4f", state.window.colorsRGBA.background]
  },
  skip: () => false,
  draw: () => gl.drawArrays(gl.TRIANGLES, 0, 6)
});

const createDrawingObject = (gl, programs, state) => [
  createForeground(gl, programs, state, () =>
    expandRectangle(0, 0, state.window.offset, state.window.offset)
  ),
  createControl(gl, programs, state, expandRectangle(0, 1, 1, 0), () =>
    expandRectangle(
      state.window.offset,
      state.window.offset,
      state.window.offset + 0.02,
      state.window.offset + 0.02
    )
  ),
  createControl(gl, programs, state, expandRectangle(0.95, 1, 1, 0.95), () =>
    expandRectangle(
      state.window.offset + 0.02,
      state.window.offset + 0.02,
      state.window.offset + state.window.width - 0.02,
      state.window.offset + state.window.width - 0.02
    )
  ),
  createControl(gl, programs, state, expandRectangle(0, 0.05, 0.05, 0), () =>
    expandRectangle(
      state.window.offset + 0.02,
      state.window.offset + 0.02,
      state.window.offset + state.window.width - 0.02,
      state.window.offset + state.window.width - 0.02
    )
  ),
  createControl(gl, programs, state, expandRectangle(0, 1, 1, 0), () =>
    expandRectangle(
      state.window.offset + state.window.width - 0.02,
      state.window.offset + state.window.width - 0.02,
      state.window.offset + state.window.width,
      state.window.offset + state.window.width
    )
  ),
  createForeground(gl, programs, state, () =>
    expandRectangle(
      state.window.offset + state.window.width,
      state.window.offset + state.window.width,
      1,
      1
    )
  )
];

module.exports.createProgram = createProgram;
module.exports.createDrawingObject = createDrawingObject;
