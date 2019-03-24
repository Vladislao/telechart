require("./index.css");

const createEngine = require("./engine");
const { createInitialState, createCurrentState } = require("./state");

const {
  createHideAnimation,
  createShowAnimation,
  createMinmaxAnimation,
  createTooltipAnimation,
  createDragAnimation,
  createWResizeAnimation,
  createEResizeAnimation
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
  const grid = createGrid(state);
  const preview = createPreview(state);
  const controls = createControls(state);
  const tooltip = createTooltip(state);

  const tooltipAnimation = createTooltipAnimation(state, () => {
    view.render();
    tooltip.render();
    return true;
  });

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
      state.tooltip.targetWidth = e.target.width;

      if (animation) return;
      animation = engine.registerAnimation(tooltipAnimation);
    };

    v.element.addEventListener("mouseenter", handleMouseEvent);
    v.element.addEventListener("mousemove", handleMouseEvent);
    v.element.addEventListener("mouseleave", () => {
      state.tooltip.offsetX = null;

      animation = engine.cancelAnimation(animation);
      engine.registerAnimation(() => {
        view.render();
        tooltip.render();
        return false;
      });
    });
  });

  preview.registerEvent(v => {
    let animation = null;

    const determineAnimation = offset => {
      if (
        offset < state.window.offset ||
        offset > state.window.offset + state.window.width
      )
        return null;
      if (
        offset > state.window.offset + 0.02 &&
        offset < state.window.offset + state.window.width - 0.02
      )
        return createDragAnimation;

      if (offset <= state.window.offset + 0.02) return createWResizeAnimation;

      return createEResizeAnimation;
    };

    const handleCancel = () => {
      if (!animation) return;
      animation = engine.cancelAnimation(animation);
      engine.registerAnimation(createMinmaxAnimation(state, render));
    };

    v.element.addEventListener("mousedown", e => {
      const offset = (e.offsetX / e.target.width) * window.devicePixelRatio;
      const createPreviewAnimation = determineAnimation(offset);

      if (!createPreviewAnimation) {
        handleCancel();
        return;
      }

      if (animation) return;

      state.window.offsetX = e.offsetX;
      state.window.targetWidth = e.target.width;

      animation = engine.registerAnimation(
        createPreviewAnimation(
          state,
          {
            offset: state.window.offset,
            width: state.window.width,
            position: offset
          },
          () => {
            view.render();
            grid.render();
            preview.render();
            return true;
          }
        )
      );
    });

    v.element.addEventListener("mousemove", e => {
      if (!animation) return;

      state.window.offsetX = e.offsetX;
      state.window.targetWidth = e.target.width;
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
