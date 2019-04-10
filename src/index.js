require("./index.css");

const createEngine = require("./engine");
const createState = require("./state");

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

module.exports = (element, data, options) => {
  /*
   * Engine handles rendering and initialized once on the page.
   */
  const engine = createEngine();

  /*
   * Calculate initial state for chart.
   * TODO: Move to WebWorker to optimize page loading speed
   */
  const state = createState(data);
  console.log(state);

  /*
   * Create components used by chart
   * Component creators must return single object with following properties:
   *  element  - element that will be added to the DOM tree
   *  render   - function that updates component based on provided state once called
   *  register - function that receives single callback, can be used to add event handlers
   */
  const view = createView(state);
  const grid = createGrid(state);
  const preview = createPreview(state);
  const controls = createControls(state);
  const tooltip = createTooltip(state);

  // Handle click events for toggle
  controls.register(
    createControlHandlers(state, engine, [view.render, preview.render])
  );

  // // Handle mouseover and click events for zooming and tooltip
  // grid.register(
  //   createTooltipHandler(state, engine, () => {
  //     view.render();
  //     tooltip.render();
  //   })
  // );

  // Handle mouse and touch events for preview interactions
  preview.register(
    createPreviewHandler(state, engine, [
      view.render,
      grid.render,
      preview.render
    ])
  );

  // Render all components for the first time
  engine.registerAnimation({
    draw: [view.render, grid.render, preview.render]
  });

  // Add elements to the DOM tree
  createDOM(
    element,
    view.element,
    controls.element,
    preview.element,
    tooltip.element,
    grid.element
  );

  // TODO: Destroy, update options, update data
  // TODO: Might be an API
  return state;
};
