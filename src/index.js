require("./index.css");

const createEngine = require("./engine");
const { createInitialState, createCurrentState } = require("./state");
const { bound, closest, translate } = require("./utils/transformation");

const {
  createHideAnimation,
  createShowAnimation
} = require("./animations/toggle");

const createView = require("./components/view");
const createPreview = require("./components/preview");
const createControls = require("./components/controls");
const createTooltip = require("./components/tooltip");
const createGrid = require("./components/grid");

const createDOM = (element, chart, controls, preview, tooltip, grid) => {
  element.className = "tc-wrapper";

  if (chart) element.appendChild(chart);
  if (grid) element.appendChild(grid);
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

  view.registerEvent(v => {
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

        state.tooltip.columns = state.ids.reduce((acc, v) => {
          acc[v] = translate(
            state.columns[v][index],
            state.minmax.y.scale.max,
            state.minmax.y.scale.min,
            0,
            1
          );
          return acc;
        }, state.tooltip.columns);
      }

      tooltip.render();

      if (animation) return;

      animation = engine.registerAnimation(() => {
        render();
        return true;
      });
    };

    v.element.addEventListener("mouseenter", handleMouseEvent);
    v.element.addEventListener("mousemove", handleMouseEvent);
    v.element.addEventListener("mouseleave", () => {
      state.tooltip.offsetX = null;

      animation = engine.cancelAnimation(animation);
      engine.registerAnimation(render);
      tooltip.render();
    });
  });

  preview.registerEvent(v => {
    let animation = null;
    let action = null;

    const handleCancel = e => {
      animation = engine.cancelAnimation(animation);
      action = null;
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
        return handleCancel(e);
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
        // console.log("w", action.width - delta, 1 - action.offset - delta);
        state.window.width = bound(
          action.width - delta,
          0.2,
          bound(1 - action.offset - delta, 0, 1)
        );
        // console.log("o", action.offset + delta, 1 - state.window.width);
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
