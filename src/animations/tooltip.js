const { animate } = require("../utils/animation");

const createTooltipAnimation = (state, event, render) => {
  let previousX = state.tooltip.index;
  let animation = null;

  return {
    draw: render,
    update: ms => {
      if (event.done) {
        state.tooltip.x = null;
        state.tooltip.index = null;
        return false;
      }

      if (animation) {
        const running = animation(ms);
        if (!running) {
          animation = null;
        }
      }

      const x = Math.floor(event.offsetX * event.step);

      if (x !== previousX) {
        const indexX = Math.round(x / event.step);

        if (state.tooltip.x) {
          animation = animate(
            state.tooltip.x,
            x,
            step => {
              state.tooltip.x = step;
              state.tooltip.index = x;
              state.tooltip.indexX = indexX;
            },
            { start: ms, duration: 150 }
          );
        } else {
          state.tooltip.x = x;
          state.tooltip.index = x;
          state.tooltip.indexX = indexX;
        }
        previousX = x;
      }

      return true;
    }
  };
};

// const { offsetX, targetWidth } = state.tooltip;

// const localOffset = (offsetX / targetWidth) * window.devicePixelRatio;
// const offset = state.window.offset + state.window.width * localOffset;

// const index = closest(state.columns.x, offset);

// if (state.tooltip.index !== index) {
//   state.tooltip.index = index;
//   state.tooltip.x = translate(
//     state.columns.x[index],
//     state.minmax.x.max,
//     state.minmax.x.min,
//     state.window.offset,
//     state.window.width
//   );

//   state.tooltip.columns = state.ids.reduce((acc, c) => {
//     acc[c] = translate(
//       state.columns[c][index],
//       state.minmax.y0.scale.max,
//       state.minmax.y0.scale.min,
//       0,
//       1
//     );
//     return acc;
//   }, state.tooltip.columns);
// }

// return render();

module.exports.createTooltipAnimation = createTooltipAnimation;
