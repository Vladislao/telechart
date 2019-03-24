const { closest, translate } = require("../utils/transformation");

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

module.exports.createTooltipAnimation = createTooltipAnimation;
