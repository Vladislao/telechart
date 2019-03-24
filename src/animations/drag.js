const { bound, closest } = require("../utils/transformation");

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

module.exports.createDragAnimation = createDragAnimation;
module.exports.createWResizeAnimation = createWResizeAnimation;
module.exports.createEResizeAnimation = createEResizeAnimation;
