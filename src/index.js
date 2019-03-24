require("./index.css");

const createEngine = require("./engine");
const { createInitialState, createCurrentState } = require("./state");
const { bound, closest, translate } = require("./utils/transformation");

const {
  createHideAnimation,
  createShowAnimation,
  createMinmaxAnimation
} = require("./animations/toggle");

const createView = require("./components/view");
const createPreview = require("./components/preview");
const createControls = require("./components/controls");
const createTooltip = require("./components/tooltip");
const createGrid = require("./components/grid");

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
  const preview = createPreview(state);
  const controls = createControls(state);
  const tooltip = createTooltip(state);
  const grid = createGrid(state);

  const render = () => {
    view.render();
    grid.render();
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

  grid.registerEvent(v => {
    // TODO: touchevent
    // TODO: cross
    let animation = null;
    const handleMouseEvent = e => {
      state.tooltip.offsetX = e.offsetX;

      const localOffset =
        (e.offsetX / e.target.width) * window.devicePixelRatio;

      const offset = state.window.offset + state.window.width * localOffset;

      const index = closest(state.columns.x, offset);

      if (state.tooltip.index !== index) {
        state.tooltip.index = index;
        state.tooltip.x = translate(
          state.columns.x[index],
          state.minmax.x.max,
          state.minmax.x.min,
          state.window.offset,
          state.window.width
        );

        state.tooltip.columns = state.ids.reduce((acc, c) => {
          acc[c] = translate(
            state.columns[c][index],
            state.minmax.y0.scale.max,
            state.minmax.y0.scale.min,
            0,
            1
          );
          return acc;
        }, state.tooltip.columns);
      }

      tooltip.render();

      if (animation) return;

      animation = engine.registerAnimation(() => {
        view.render();
        return true;
      });
    };

    v.element.addEventListener("mouseenter", handleMouseEvent);
    v.element.addEventListener("mousemove", handleMouseEvent);
    v.element.addEventListener("mouseleave", () => {
      state.tooltip.offsetX = null;

      animation = engine.cancelAnimation(animation);
      engine.registerAnimation(view.render);
      tooltip.render();
    });
  });

  preview.registerEvent(v => {
    let animation = null;
    let action = null;

    const handleCancel = () => {
      animation = engine.cancelAnimation(animation);
      action = null;
      engine.registerAnimation(createMinmaxAnimation(state, render));
    };

    const getCursor = offset => {
      if (
        offset < state.window.offset ||
        offset > state.window.offset + state.window.width
      )
        return "default";
      if (
        offset > state.window.offset + 0.02 &&
        offset < state.window.offset + state.window.width - 0.02
      )
        return "grab";

      if (offset <= state.window.offset + 0.02) return "w-resize";

      return "e-resize";
    };

    v.element.addEventListener("mousedown", e => {
      const offset = (e.offsetX / e.target.width) * window.devicePixelRatio;
      const cursor = getCursor(offset);

      if (cursor === "default") {
        handleCancel(e);
        return;
      }

      action = {
        type: cursor,
        offset: state.window.offset,
        width: state.window.width,
        initial: offset
      };

      animation = engine.registerAnimation(() => {
        render();
        return true;
      });
    });

    v.element.addEventListener("mousemove", e => {
      if (!action) return;

      const offset = (e.offsetX / e.target.width) * window.devicePixelRatio;
      const delta = offset - action.initial;

      if (action.type === "grab") {
        state.window.offset = bound(
          action.offset + delta,
          0,
          bound(1 - state.window.width, 0, 1)
        );
      }
      if (action.type === "w-resize") {
        state.window.width = bound(
          action.width - delta,
          0.2,
          bound(1 - action.offset - delta, 0, 1)
        );
        state.window.offset = bound(
          action.offset + delta,
          0,
          bound(1 - state.window.width, 0, 1)
        );
      }
      if (action.type === "e-resize") {
        state.window.width = bound(
          action.width + delta,
          0.2,
          bound(1 - state.window.offset, 0, 1)
        );
      }
    });

    v.element.addEventListener("mouseleave", handleCancel);
    v.element.addEventListener("mouseup", handleCancel);
  });

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
