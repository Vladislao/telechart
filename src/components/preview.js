const { createAttributeInfo } = require("../utils/webgl");
const createRender = require("../utils/render");

const line = require("../rendering/line");

module.exports = state => {
  const element = document.createElement("canvas");
  element.className = "tc-preview";

  const gl =
    element.getContext("webgl") || element.getContext("experimental-webgl");
  if (!gl) {
    throw "webgl is not supported";
  }

  const programs = {
    line: line.createProgram(gl)
  };
  const commonAttributes = {
    aX: createAttributeInfo(gl, state.columns.x)
  };
  const drawingObjects = state.ids.map(v =>
    line.createDrawingObject(gl, programs, state, v)
  );

  const render = createRender(gl, commonAttributes, drawingObjects);

  return {
    element,
    render,
    registerEvent: callback => callback({ id: "preview", element })
  };
};
