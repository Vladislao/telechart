const { animate, easeInOutQuad } = require("../utils/animation");
const { minmax, closest } = require("../utils/transformation");

const createShowAnimation = (state, chart, render) => {
  // const to = {
  //   color: state.initial.colorsRGBA[id],
  //   y: minmax(
  //     state.ids.filter(v => state.toggles[v]).map(v => state.columns[v])
  //   ),
  //   y0: minmax(
  //     state.ids.filter(v => state.toggles[v]).map(v => state.columns[v]),
  //     closest(state.columns.x, state.window.offset),
  //     closest(state.columns.x, state.window.offset + state.window.width)
  //   )
  // };

  const globalYMinmax = minmax(state, 0, state.x.values.length);
  const windowYMinmax = minmax(
    state,
    state.window.index,
    state.x.values.length
  );

  return animate(
    {
      alpha: chart.color.alpha,
      y: state.y.matrix,
      y0: state.y0.matrix
    },
    {
      alpha: 1,
      y: [globalYMinmax[0], globalYMinmax[1] - globalYMinmax[0]],
      y0: [windowYMinmax[0], windowYMinmax[1] - windowYMinmax[0]]
    },
    step => {
      // step.y0.steps.forEach((v, i) => {
      //   v.value = to.y0.steps[i].value;
      // });
      chart.color.alpha = step.alpha;
      state.y.matrix = step.y;
      state.y0.matrix = step.y0;

      render();
    },
    {
      duration: 3000,
      easing: easeInOutQuad
    }
  );
};

const createHideAnimation = (state, chart, render) => {
  const globalYMinmax = minmax(state, 0, state.x.values.length);
  const windowYMinmax = minmax(
    state,
    state.window.index,
    state.x.values.length
  );

  return animate(
    {
      alpha: chart.color.alpha,
      y: state.y.matrix,
      y0: state.y0.matrix
    },
    {
      alpha: 0,
      y: [globalYMinmax[0], globalYMinmax[1] - globalYMinmax[0]],
      y0: [windowYMinmax[0], windowYMinmax[1] - windowYMinmax[0]]
    },
    step => {
      // step.y0.steps.forEach((v, i) => {
      //   v.value = to.y0.steps[i].value;
      // });
      chart.color.alpha = step.alpha;
      state.y.matrix = step.y;
      state.y0.matrix = step.y0;

      render();
    },
    {
      duration: 3000,
      easing: easeInOutQuad
    }
  );
};

module.exports.createHideAnimation = createHideAnimation;
module.exports.createShowAnimation = createShowAnimation;
