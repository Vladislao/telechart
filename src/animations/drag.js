const { animate, easeOutCubic } = require("../utils/animation");
const { minmax, bound, closest } = require("../utils/transformation");

const createDragAnimation = (state, initial, render) => () => {
  const offset =
    (state.window.offsetX / state.window.targetWidth) * window.devicePixelRatio;

  const delta = offset - initial.position;

  state.window.offset = bound(
    initial.offset + delta,
    0,
    bound(1 - state.window.width, 0, 1)
  );
  state.window.index = closest(state.columns.x, state.window.offset);

  return render();
};

const createWResizeAnimation = (state, event, render) => {
  const current = {
    shift: 0
  };
  const initial = {
    offset: state.window.offset
  };

  let animation = null;

  return {
    draw: render,
    update: ms => {
      if (animation) {
        animation(ms);
      }

      const shift = Math.ceil((event.pageX - event.initialPageX) * event.step);

      if (shift !== current.shift) {
        const nextOffset = bound(
          initial.offset + shift,
          0,
          state.x.values.length - state.window.minwidth
        );

        const windowYMinmax = minmax(
          state,
          nextOffset,
          nextOffset + state.window.width
        );

        animation = animate(
          {
            offset: state.window.offset,
            y0: state.y0.matrix
          },
          {
            offset: nextOffset,
            y0: [windowYMinmax[0], windowYMinmax[1] - windowYMinmax[0]]
          },
          step => {
            state.window.offset = step.offset;
            state.y0.matrix = step.y0;
          },
          { start: ms, duration: 300, easing: easeOutCubic }
        );

        current.shift = shift;
      }

      return true;
    }
  };
};

// const offset =
//   (state.window.offsetX / state.window.targetWidth) * window.devicePixelRatio;
// const delta = offset - initial.position;

// state.window.width = bound(
//   initial.width - delta,
//   0.2,
//   bound(1 - initial.offset - delta, 0, 1)
// );
// state.window.offset = bound(
//   initial.offset + delta,
//   0,
//   bound(1 - state.window.width, 0, 1)
// );
// state.window.index = closest(state.columns.x, state.window.offset);

// return render();

const createEResizeAnimation = (state, initial, render) => () => {
  const offset =
    (state.window.offsetX / state.window.targetWidth) * window.devicePixelRatio;
  const delta = offset - initial.position;

  state.window.width = bound(
    initial.width + delta,
    0.2,
    bound(1 - state.window.offset, 0, 1)
  );

  return render();
};

module.exports.createDragAnimation = createDragAnimation;
module.exports.createWResizeAnimation = createWResizeAnimation;
module.exports.createEResizeAnimation = createEResizeAnimation;
