const { animate, easeOutCubic } = require("../utils/animation");
const { minmax, findScale, bound } = require("../utils/transformation");

const createAnimation = (state, nextOffset, nextWidth, ms) => {
  const windowYMinmax = minmax(state, nextOffset, nextOffset + nextWidth);
  const windowYScale = findScale(
    windowYMinmax[0],
    windowYMinmax[1],
    state.grid.lines
  );

  return animate(
    {
      offset: state.window.offset,
      width: state.window.width,
      y0: state.y0.matrix
    },
    {
      offset: nextOffset,
      width: nextWidth,
      y0: windowYScale
    },
    step => {
      state.window.offset = step.offset;
      state.window.width = step.width;
      state.y0.matrix = step.y0;
    },
    { start: ms, duration: 300, easing: easeOutCubic }
  );
};

const resizeRight = (state, initial, shift, ms) => {
  const width = initial.width + shift;
  const nextWidth = bound(width, state.window.minwidth, state.x.values.length);
  const nextOffset = bound(
    initial.offset + width - nextWidth,
    0,
    state.x.values.length - nextWidth
  );

  return createAnimation(state, nextOffset, nextWidth, ms);
};

const resizeLeft = (state, initial, shift, ms) => {
  const nextWidth = bound(
    initial.width - shift,
    state.window.minwidth,
    state.x.values.length
  );
  const nextOffset = bound(
    initial.offset + shift,
    0,
    state.x.values.length - nextWidth
  );

  return createAnimation(state, nextOffset, nextWidth, ms);
};

const drag = (state, initial, shift, ms) => {
  const nextOffset = bound(
    initial.offset + shift,
    0,
    state.x.values.length - state.window.width
  );

  return createAnimation(state, nextOffset, initial.width, ms);
};

const createScrollAnimation = (state, event, render) => {
  const current = {
    shift: 0
  };
  const initial = {
    offset: state.window.offset,
    width: state.window.width
  };

  let animation = null;

  return {
    draw: render,
    update: ms => {
      if (animation) {
        const running = animation(ms);
        if (!running) {
          animation = null;
        }
      }

      const shift = Math.ceil((event.pageX - event.initialPageX) * event.step);

      if (shift !== current.shift) {
        if (event.type === "drag") {
          animation = drag(state, initial, shift, ms);
        } else if (event.type === "resize-left") {
          animation = resizeLeft(state, initial, shift, ms);
        } else if (event.type === "resize-right") {
          animation = resizeRight(state, initial, shift, ms);
        }

        current.shift = shift;
      }

      return animation !== null || !event.done;
    }
  };
};

const createInspectAnimation = (state, event, render) => {
  const windowYMinmax = minmax(state, event.offset, event.offset + event.width);
  const windowYScale = findScale(
    windowYMinmax[0],
    windowYMinmax[1],
    state.grid.lines
  );

  return {
    draw: render,
    update: animate(
      {
        offset: state.window.offset,
        width: state.window.width,
        y0: state.y0.matrix
      },
      {
        offset: event.offset,
        width: event.width,
        y0: windowYScale
      },
      step => {
        state.window.offset = step.offset;
        state.window.width = step.width;
        state.y0.matrix = step.y0;
      },
      { duration: 500, easing: easeOutCubic }
    )
  };
};

module.exports.createScrollAnimation = createScrollAnimation;
module.exports.createInspectAnimation = createInspectAnimation;
