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
    )
  };
  return animate(
    {
      y: state.minmax.y,
      y0: state.minmax.y0
    },
    to,
    step => {
      step.y0.steps.forEach((v, i) => {
        v.value = to.y0.steps[i].value;
      });

      state.minmax.y = step.y;
      state.minmax.y0 = step.y0;
      render();
    }
  );
};

const createShowAnimation = (id, state, render) => {
  const to = {
    color: state.initial.colorsRGBA[id],
    y: minmax(
      state.ids.filter(v => state.toggles[v]).map(v => state.columns[v])
    ),
    y0: minmax(
      state.ids.filter(v => state.toggles[v]).map(v => state.columns[v]),
      closest(state.columns.x, state.window.offset),
      closest(state.columns.x, state.window.offset + state.window.width)
    )
  };
  return animate(
    {
      color: state.colorsRGBA[id],
      y: state.minmax.y,
      y0: state.minmax.y0
    },
    to,
    step => {
      step.y0.steps.forEach((v, i) => {
        v.value = to.y0.steps[i].value;
      });

      state.colorsRGBA[id] = step.color;
      state.minmax.y = step.y;
      state.minmax.y0 = step.y0;
      render();
    }
  );
};

const createHideAnimation = (id, state, render) => {
  const to = {
    color: state.colorsRGBA[id].slice(0, 3).concat([0]),
    y: minmax(
      state.ids.filter(v => state.toggles[v]).map(v => state.columns[v])
    ),
    y0: minmax(
      state.ids.filter(v => state.toggles[v]).map(v => state.columns[v]),
      closest(state.columns.x, state.window.offset),
      closest(state.columns.x, state.window.offset + state.window.width)
    )
  };

  return animate(
    {
      color: state.colorsRGBA[id],
      y: state.minmax.y,
      y0: state.minmax.y0
    },
    to,
    step => {
      step.y0.steps.forEach((v, i) => {
        v.value = to.y0.steps[i].value;
      });

      state.colorsRGBA[id] = step.color;
      state.minmax.y = step.y;
      state.minmax.y0 = step.y0;
      render();
    }
  );
};

module.exports.createMinmaxAnimation = createMinmaxAnimation;
module.exports.createHideAnimation = createHideAnimation;
module.exports.createShowAnimation = createShowAnimation;
