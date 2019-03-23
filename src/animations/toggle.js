const { animate } = require("../utils/animation");
const { minmax } = require("../utils/transformation");

const createShowAnimation = (id, state, render) =>
  animate(
    {
      color: state.colorsRGBA[id],
      yminmax: state.yminmax
    },
    {
      color: state.initial.colorsRGBA[id],
      yminmax: minmax(
        state.ids.filter(v => state.toggles[v]).map(v => state.columns[v])
      )
    },
    step => {
      state.colorsRGBA[id] = step.color;
      state.yminmax = step.yminmax;
      render();
    }
  );

const createHideAnimation = (id, state, render) =>
  animate(
    {
      color: state.colorsRGBA[id],
      yminmax: state.yminmax
    },
    {
      color: state.colorsRGBA[id].slice(0, 3).concat([0]),
      yminmax: minmax(
        state.ids.filter(v => state.toggles[v]).map(v => state.columns[v])
      )
    },
    step => {
      state.colorsRGBA[id] = step.color;
      state.yminmax = step.yminmax;
      render();
    }
  );

module.exports.createHideAnimation = createHideAnimation;
module.exports.createShowAnimation = createShowAnimation;
