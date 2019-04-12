const { animate, easeInOutQuad } = require("../utils/animation");
const { minmax, findScale } = require("../utils/transformation");

const createShowAnimation = (state, chart, render) => {
  const globalYMinmax = minmax(state, 0, state.x.values.length);
  const windowYMinmax = minmax(
    state,
    state.window.offset,
    state.window.offset + state.window.width
  );
  const windowYScale = findScale(
    windowYMinmax[0],
    windowYMinmax[1],
    state.grid.lines
  );

  return {
    draw: render,
    update: animate(
      {
        alpha: chart.color.alpha,
        y: state.y.matrix,
        y0: state.y0.matrix
      },
      {
        alpha: 1,
        y: [globalYMinmax[0], globalYMinmax[1] - globalYMinmax[0]],
        y0: windowYScale
      },
      step => {
        // step.y0.steps.forEach((v, i) => {
        //   v.value = to.y0.steps[i].value;
        // });
        chart.color.alpha = step.alpha;
        state.y.matrix = step.y;
        state.y0.matrix = step.y0;
      },
      {
        duration: 500,
        easing: easeInOutQuad
      }
    )
  };
};

const createHideAnimation = (state, chart, render) => {
  const globalYMinmax = minmax(state, 0, state.x.values.length);
  const windowYMinmax = minmax(
    state,
    state.window.offset,
    state.window.offset + state.window.width
  );
  const windowYScale = findScale(
    windowYMinmax[0],
    windowYMinmax[1],
    state.grid.lines
  );

  return {
    draw: render,
    update: animate(
      {
        alpha: chart.color.alpha,
        y: state.y.matrix,
        y0: state.y0.matrix
      },
      {
        alpha: 0,
        y: [globalYMinmax[0], globalYMinmax[1] - globalYMinmax[0]],
        y0: windowYScale
      },
      step => {
        chart.color.alpha = step.alpha;
        state.y.matrix = step.y;
        state.y0.matrix = step.y0;
      },
      {
        duration: 500,
        easing: easeInOutQuad
      }
    )
  };
};

module.exports.createHideAnimation = createHideAnimation;
module.exports.createShowAnimation = createShowAnimation;
