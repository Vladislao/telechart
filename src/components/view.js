const { createAttributeInfo } = require("../utils/webgl");
const createRender = require("../utils/render");

const line = require("../rendering/line");
const vertical = require("../rendering/vertical");
const horizontal = require("../rendering/horizontal");
const point = require("../rendering/point");

module.exports = (state, subscribe) => {
  const element = document.createElement("canvas");
  element.className = "tc-chart";

  const gl =
    element.getContext("webgl") || element.getContext("experimental-webgl");

  if (!gl) {
    throw "webgl is not supported";
  }

  const programs = {
    line: line.createProgram(gl),
    vertical: vertical.createProgram(gl),
    simple: point.createProgram(gl)
  };
  const commonAttributes = {
    aX: createAttributeInfo(gl, state.columns.x)
  };

  const chartLines = state.ids.map(v =>
    line.createDrawingObject(gl, programs, state, v)
  );
  const points = state.ids.map(v =>
    point.createDrawingObject(gl, programs, state, v)
  );
  const verticalLine = vertical.createDrawingObject(gl, programs, state);
  const horizontalLines = state.minmax.y.steps.map((v, i) =>
    horizontal.createDrawingObject(gl, programs, state, i)
  );

  const drawingObjects = [verticalLine]
    .concat(horizontalLines)
    .concat(chartLines)
    .concat(points);

  const render = createRender(gl, commonAttributes, drawingObjects);

  return {
    element,
    registerEvent: callback => callback({ id: "view", element }),
    render
  };
};
