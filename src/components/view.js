const { createAttributeInfo } = require("../utils/webgl");
const createRender = require("../utils/render");

const line = require("../rendering/line");
const vertical = require("../rendering/vertical");

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
    vertical: vertical.createProgram(gl)
  };
  const commonAttributes = {
    aX: createAttributeInfo(gl, state.columns.x)
  };

  const lines = state.ids.map(v =>
    line.createDrawingObject(gl, programs, state, v)
  );
  const drawingObjects = [
    vertical.createDrawingObject(gl, programs, state)
  ].concat(lines);

  const render = createRender(gl, commonAttributes, drawingObjects);

  return {
    element,
    registerEvent: callback => callback({ id: "view", element }),
    render
  };
};
