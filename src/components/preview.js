const { createAttributeInfo } = require("../utils/webgl");
const createRender = require("../utils/render");

const line = require("../rendering/line");
const box = require("../rendering/box");

module.exports = state => {
  const element = document.createElement("canvas");
  element.className = "tc-preview";

  const gl =
    element.getContext("webgl") || element.getContext("experimental-webgl");
  if (!gl) {
    throw new Error("webgl is not supported");
  }

  const programs = {
    line: line.createProgram(gl),
    simple: box.createProgram(gl)
  };
  const commonAttributes = {
    aX: createAttributeInfo(gl, state.columns.x)
  };
  const lines = state.ids.map(v =>
    line.createDrawingObject(gl, programs, state, v, "full")
  );
  const window = box.createDrawingObject(gl, programs, state);

  const drawingObjects = lines.concat(window);

  const render = createRender(gl, commonAttributes, drawingObjects);

  return {
    element,
    render,
    registerEvent: callback => callback({ id: "preview", element })
  };
};
