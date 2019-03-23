require("./index.css");

const createEngine = require("./engine");
const { createInitialState, createCurrentState } = require("./state");

const {
  createHideAnimation,
  createShowAnimation
} = require("./animations/toggle");

const createView = require("./components/view");
const createPreview = require("./components/preview");
const createControls = require("./components/controls");

const createDOM = (element, chart, controls, preview) => {
  element.className = "tc-wrapper";

  if (chart) element.appendChild(chart);
  if (preview) element.appendChild(preview);
  if (controls) element.appendChild(controls);
};

module.exports = (element, data) => {
  // TODO: check if already a canvas
  // TODO: check caniuse
  const engine = createEngine();

  const initialState = createInitialState(data);
  const state = createCurrentState(initialState);

  const view = createView(state);
  const preview = createPreview(state);
  const controls = createControls(state);

  const render = () => {
    view.render();
    preview.render();
  };

  controls.registerEvent(v => {
    v.element.addEventListener("click", () => {
      state.toggles[v.id] = !state.toggles[v.id];

      if (state.toggles[v.id]) {
        v.element.classList.add("tc-checked");
        engine.registerAnimation(createShowAnimation(v.id, state, render));
      } else {
        v.element.classList.remove("tc-checked");
        engine.registerAnimation(createHideAnimation(v.id, state, render));
      }
    });
  });

  view.registerEvent(v => {
    // TODO: touchevent
    // TODO: cross
    let previous = null;
    v.element.addEventListener("mousemove", e => {
      state.offsetX = e.offsetX;
      state.offsetY = e.offsetY;

      engine.cancelAnimation(previous);
      previous = engine.registerAnimation(render);
    });
    v.element.addEventListener("mouseleave", e => {
      state.offsetX = null;

      engine.cancelAnimation(previous);
      previous = engine.registerAnimation(render);
    });
  });

  engine.registerAnimation(view.render);
  engine.registerAnimation(preview.render);

  createDOM(element, view.element, controls.element, preview.element);

  return state;
};
