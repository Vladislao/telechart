const createEngine = require("./engine");
const createState = require("./state");

const createView = require("../components/view");
const createPreview = require("../components/preview");
const createControls = require("../components/controls");
const createTooltip = require("../components/tooltip");
const createRange = require("../components/range");

const createControlHandlers = require("../handlers/controls");
const createTooltipHandler = require("../handlers/tooltip");
const createPreviewHandler = require("../handlers/preview");
const createZoomHandler = require("../handlers/zoom");

const mountDefault = (element, components) => {
  element.className = "tc-wrapper";

  element.appendChild(components.range);
  element.appendChild(components.view);
  element.appendChild(components.preview);
  element.appendChild(components.controls);
};

function telechart(data, options) {
  /*
   * Engine handles rendering and initialized once on the page.
   */
  const engine = createEngine();

  /*
   * Calculate initial state for chart.
   * TODO: Move to WebWorker to optimize page loading speed
   */
  const state = createState(data);

  /*
   * Initialize API
   */
  const api = {};

  /*
   * Create components used by chart
   * Component creators must return single object with following properties:
   *  element  - element that will be added to the DOM tree
   *  render   - function that updates component based on provided state once called
   *  register - function that receives single callback, can be used to add event handlers
   */
  const tooltip = createTooltip(state);
  const view = createView(state);

  // adds tooltip to view wrapper
  // important for proper event handling
  view.element.appendChild(tooltip.element);

  const preview = createPreview(state);
  const controls = createControls(state);
  const range = createRange(state);

  // Handle click events for toggle
  controls.register(
    createControlHandlers(state, engine, [view.render, preview.render])
  );

  // // Handle mouseover and click events for zooming and tooltip
  view.register(
    createTooltipHandler(state, engine, [view.render, tooltip.render])
  );

  // Handle mouse and touch events for preview interactions
  preview.register(
    createPreviewHandler(state, engine, [
      view.render,
      preview.render,
      range.render,
    ])
  );
  tooltip.register(createZoomHandler(api, state, engine, []));

  const components = {
    view,
    controls,
    preview,
    tooltip,
    range,
  };

  const elements = {
    view: view.element,
    preview: preview.element,
    controls: controls.element,
    range: range.element,
  };

  const _r = [view.render, preview.render, range.render, tooltip.render];
  const render = (force, immediately) => {
    if (immediately) {
      _r.forEach((v) => v(force));
    } else {
      engine.registerAnimation({
        force,
        draw: _r,
      });
    }
  };

  /*
   * API for chart
   */

  api.mount = (func) => {
    if (typeof func === "function") {
      func(elements);
    } else {
      mountDefault(func, elements);
    }

    // Render all components for the first time
    render(true, false);

    return api;
  };
  api.update = (func) => {
    func(engine, state, components);
    return api;
  };
  api.render = (force, immediately) => {
    render(force, immediately);
    return api;
  };
  api.onZoomIn = (func) => {
    api.zoomIn = func;
    return api;
  };

  return api;
}

export {
  createEngine,
  createState,
  createView,
  createPreview,
  createControls,
  createTooltip,
  createRange,
  createControlHandlers,
  createTooltipHandler,
  createPreviewHandler,
  createZoomHandler,
  mountDefault,
};

export default telechart;
