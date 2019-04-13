const { animate, easeInOutQuad } = require("../utils/animation");
const { findMatrix } = require("../utils/transformation");

const createShowAnimation = (state, chart, render) => {
  const globalYMatrix = findMatrix(state, 0, state.x.values.length);
  const windowYMatrix = findMatrix(
    state,
    state.window.offset,
    state.window.offset + state.window.width
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
        y: globalYMatrix,
        y0: windowYMatrix
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

const createHideAnimation = (state, chart, render) => {
  const globalYMatrix = findMatrix(state, 0, state.x.values.length);
  const windowYMatrix = findMatrix(
    state,
    state.window.offset,
    state.window.offset + state.window.width
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
        y: globalYMatrix,
        y0: windowYMatrix
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
