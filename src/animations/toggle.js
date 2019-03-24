const { animate } = require("../utils/animation");
const {
  minmax,
  closest,
  translate,
  bound
} = require("../utils/transformation");

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

const createWResizeAnimation = (state, initial, render) => () => {
  const offset =
    (state.window.offsetX / state.window.targetWidth) * window.devicePixelRatio;
  const delta = offset - initial.position;

  state.window.width = bound(
    initial.width - delta,
    0.2,
    bound(1 - initial.offset - delta, 0, 1)
  );
  state.window.offset = bound(
    initial.offset + delta,
    0,
    bound(1 - state.window.width, 0, 1)
  );
  state.window.index = closest(state.columns.x, state.window.offset);

  return render();
};

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

const createTooltipAnimation = (state, render) => () => {
  const { offsetX, targetWidth } = state.tooltip;

  const localOffset = (offsetX / targetWidth) * window.devicePixelRatio;
  const offset = state.window.offset + state.window.width * localOffset;

  const index = closest(state.columns.x, offset);

  if (state.tooltip.index !== index) {
    state.tooltip.index = index;
    state.tooltip.x = translate(
      state.columns.x[index],
      state.minmax.x.max,
      state.minmax.x.min,
      state.window.offset,
      state.window.width
    );

    state.tooltip.columns = state.ids.reduce((acc, c) => {
      acc[c] = translate(
        state.columns[c][index],
        state.minmax.y0.scale.max,
        state.minmax.y0.scale.min,
        0,
        1
      );
      return acc;
    }, state.tooltip.columns);
  }

  return render();
};

const createMinmaxAnimation = (state, render) => {
  const to = {
    y: minmax(
      state.ids.filter(v => state.toggles[v]).map(v => state.columns[v])
    ),
    y0: minmax(
      state.ids.filter(v => state.toggles[v]).map(v => state.columns[v]),
      closest(state.columns.x, state.window.offset),
      closest(state.columns.x, state.window.offset + state.window.width)
    ),
    x0: minmax(
      state.columns.x,
      closest(state.columns.x, state.window.offset),
      closest(state.columns.x, state.window.offset + state.window.width)
    )
  };
  return animate(
    {
      y: state.minmax.y,
      y0: state.minmax.y0,
      x0: state.minmax.x0
    },
    to,
    step => {
      step.y0.steps.forEach((v, i) => {
        v.value = to.y0.steps[i].value;
      });
      step.x0.steps.forEach((v, i) => {
        v.value = to.x0.steps[i].value;
      });

      state.minmax.y = step.y;
      state.minmax.y0 = step.y0;
      state.minmax.x0 = step.x0;
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

module.exports.createTooltipAnimation = createTooltipAnimation;
module.exports.createMinmaxAnimation = createMinmaxAnimation;
module.exports.createHideAnimation = createHideAnimation;
module.exports.createShowAnimation = createShowAnimation;
module.exports.createDragAnimation = createDragAnimation;
module.exports.createWResizeAnimation = createWResizeAnimation;
module.exports.createEResizeAnimation = createEResizeAnimation;
