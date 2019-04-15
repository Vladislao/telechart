const { animate, easeInOutQuad } = require("../utils/animation");
const { findMatrix, findSum } = require("../utils/transformation");
const segmentTree = require("../utils/segmentTree");

const createToggleAnimation = (state, render) => {
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

  const currentAlpha = state.ids.reduce((acc, v) => {
    acc[v] = state.charts[v].color.alpha;
    return acc;
  }, {});

  const targetAlpha = state.ids.reduce((acc, v) => {
    acc[v] = state.charts[v].disabled ? 0 : 1;
    return acc;
  }, {});

  const animation = animate(
    {
      sum: state.y.sum || [],
      alpha: currentAlpha,
      y: state.y.matrix,
      y0: state.y0.matrix
    },
    {
      sum,
      alpha: targetAlpha,
      y: globalYMatrix,
      y0: windowYMatrix
    },
    step => {
      for (let i = 0; i < state.ids.length; i++) {
        const id = state.ids[i];
        state.charts[id].color.alpha = step.alpha[id];
      }

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

module.exports.createToggleAnimation = createToggleAnimation;
