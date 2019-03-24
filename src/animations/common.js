const { animate } = require("../utils/animation");
const { minmax, closest } = require("../utils/transformation");

const createMinmaxAnimation = (state, render) => {
  const to = {
    y: minmax(
      state.ids.filter(v => state.toggles[v]).map(v => state.columns[v])
    ),
    y0: minmax(
      state.ids.filter(v => state.toggles[v]).map(v => state.columns[v]),
      closest(state.columns.x, state.window.offset),
      closest(state.columns.x, state.window.offset + state.window.width)
    ),
    x0: minmax(
      state.columns.x,
      closest(state.columns.x, state.window.offset),
      closest(state.columns.x, state.window.offset + state.window.width)
    )
  };
  return animate(
    {
      y: state.minmax.y,
      y0: state.minmax.y0,
      x0: state.minmax.x0
    },
    to,
    step => {
      step.y0.steps.forEach((v, i) => {
        v.value = to.y0.steps[i].value;
      });
      step.x0.steps.forEach((v, i) => {
        v.value = to.x0.steps[i].value;
      });

      state.minmax.y = step.y;
      state.minmax.y0 = step.y0;
      state.minmax.x0 = step.x0;
      render();
    }
  );
};

module.exports.createMinmaxAnimation = createMinmaxAnimation;
