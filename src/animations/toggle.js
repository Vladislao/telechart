const { animate } = require("../utils/animation");
const { minmax } = require("../utils/transformation");

const createShowAnimation = (id, state, render) =>
  animate(
    {
      color: state.colorsRGBA[id],
      minmax: state.minmax.y
    },
    {
      color: state.initial.colorsRGBA[id],
      minmax: minmax(
        state.ids.filter(v => state.toggles[v]).map(v => state.columns[v])
      )
    },
    step => {
      state.colorsRGBA[id] = step.color;
      state.minmax.y = step.minmax;
      render();
    }
  );

const createHideAnimation = (id, state, render) =>
  animate(
    {
      color: state.colorsRGBA[id],
      minmax: state.minmax.y
    },
    {
      color: state.colorsRGBA[id].slice(0, 3).concat([0]),
      minmax: minmax(
        state.ids.filter(v => state.toggles[v]).map(v => state.columns[v])
      )
    },
    step => {
      state.colorsRGBA[id] = step.color;
      state.minmax.y = step.minmax;
      render();
    }
  );

module.exports.createHideAnimation = createHideAnimation;
module.exports.createShowAnimation = createShowAnimation;
