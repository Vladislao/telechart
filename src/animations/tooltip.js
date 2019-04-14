const { animate } = require("../utils/animation");

const createTooltipAnimation = (state, event, render) => {
  let previous = state.tooltip.indexD;
  let animation = null;

  return {
    draw: render,
    update: ms => {
      if (event.done) {
        state.tooltip.index = null;
        state.tooltip.indexD = null;
        return false;
      }

      if (animation) {
        const running = animation(ms);
        if (!running) {
          animation = null;
        }
      }

      const indexD = Math.min(
        Math.max(Math.floor(event.offsetX * event.step), 0),
        state.x.values.length
      );

      if (indexD !== previous) {
        const indexX = Math.round(indexD / event.step);

        if (state.tooltip.index !== null) {
          animation = animate(
            state.tooltip.index,
            indexD,
            step => {
              state.tooltip.index = step;
              state.tooltip.indexD = indexD;
              state.tooltip.indexX = indexX;
            },
            { start: ms, duration: 150 }
          );
        } else {
          state.tooltip.index = indexD;
          state.tooltip.indexD = indexD;
          state.tooltip.indexX = indexX;
        }
        previous = indexD;
      }

      return true;
    }
  };
};

module.exports.createTooltipAnimation = createTooltipAnimation;
