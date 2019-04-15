const { animate, easeInOutQuad } = require("../utils/animation");
const { findMatrix, findSum } = require("../utils/transformation");
const segmentTree = require("../utils/segmentTree");

const createShowAnimation = (state, chart, render) => {
  let sum = [];
  if (state.stacked) {
    sum = findSum(state);
    if (!state.percentage) {
      state.y.mmtree = segmentTree.create(sum);
    }
  }

  const globalYMatrix = findMatrix(state, 0, state.x.values.length);
  const windowYMatrix = findMatrix(
    state,
    state.window.offset,
    state.window.offset + state.window.width
  );

  const animation = animate(
    {
      sum: state.y.sum || [],
      alpha: chart.color.alpha,
      y: state.y.matrix,
      y0: state.y0.matrix
    },
    {
      sum,
      alpha: 1,
      y: globalYMatrix,
      y0: windowYMatrix
    },
    step => {
      chart.color.alpha = step.alpha;
      state.y.matrix = step.y;
      state.y0.matrix = step.y0;
      if (state.stacked) {
        state.y.sum = step.sum;
      }
    },
    {
      duration: 500,
      easing: easeInOutQuad
    }
  );

  return {
    draw: render,
    update: animation
  };
};

const createHideAnimation = (state, chart, render) => {
  let sum = [];
  if (state.stacked) {
    sum = findSum(state);
    if (!state.percentage) {
      state.y.mmtree = segmentTree.create(sum);
    }
  }

  const globalYMatrix = findMatrix(state, 0, state.x.values.length);
  const windowYMatrix = findMatrix(
    state,
    state.window.offset,
    state.window.offset + state.window.width
  );

  const animation = animate(
    {
      sum: state.y.sum || [],
      alpha: chart.color.alpha,
      y: state.y.matrix,
      y0: state.y0.matrix
    },
    {
      sum,
      alpha: 0,
      y: globalYMatrix,
      y0: windowYMatrix
    },
    step => {
      chart.color.alpha = step.alpha;
      state.y.matrix = step.y;
      state.y0.matrix = step.y0;
      if (state.stacked) {
        state.y.sum = step.sum;
      }
    },
    {
      duration: 500,
      easing: easeInOutQuad
    }
  );

  return {
    draw: render,
    update: animation
  };
};

module.exports.createHideAnimation = createHideAnimation;
module.exports.createShowAnimation = createShowAnimation;
