require("./index.css");

const createEngine = require("./engine");
const { createInitialState, createCurrentState } = require("./state");

const createView = require("./components/view");
const createPreview = require("./components/preview");
const createControls = require("./components/controls");
const createTooltip = require("./components/tooltip");
const createGrid = require("./components/grid");

const createControlHandlers = require("./handlers/controls");
const createTooltipHandler = require("./handlers/tooltip");
const createPreviewHandler = require("./handlers/preview");

const createDOM = (uElement, chart, controls, preview, tooltip, grid) => {
  const element = uElement;
  element.className = "tc-wrapper";

  const wrapper = document.createElement("div");
  wrapper.className = "tc-chart-wrapper";

  if (chart) wrapper.appendChild(chart);
  if (grid) wrapper.appendChild(grid);

  element.appendChild(wrapper);

  if (preview) element.appendChild(preview);
  if (controls) element.appendChild(controls);
  if (tooltip) element.appendChild(tooltip);
};

module.exports = (element, data) => {
  // TODO: check if already a canvas
  // TODO: check caniuse

  const engine = createEngine();

  const initialState = createInitialState(data);
  const state = createCurrentState(initialState);

  const view = createView(state);
  const grid = createGrid(state);
  const preview = createPreview(state);
  const controls = createControls(state);
  const tooltip = createTooltip(state);

  controls.registerEvent(
    createControlHandlers(state, engine, () => {
      view.render();
      grid.render();
      preview.render();
    })
  );
  grid.registerEvent(
    createTooltipHandler(state, engine, () => {
      view.render();
      tooltip.render();
    })
  );
  preview.registerEvent(
    createPreviewHandler(state, engine, () => {
      view.render();
      grid.render();
      preview.render();
    })
  );

  // render our initial state once
  engine.registerAnimation(view.render);
  engine.registerAnimation(grid.render);
  engine.registerAnimation(preview.render);

  createDOM(
    element,
    view.element,
    controls.element,
    preview.element,
    tooltip.element,
    grid.element
  );

  return state;
};
