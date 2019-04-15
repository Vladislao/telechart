const { bound } = require("../utils/transformation");
// const { createTooltipAnimation } = require("../animations/tooltip");

module.exports = (api, state, engine, render) => v => {
  // let animation = null;

  v.element.addEventListener("click", () => {
    if (api.zoomIn) {
      const offset =
        state.window.offsetD != null
          ? state.window.offsetD
          : state.window.offset | 0;

      const index = bound(
        offset + state.tooltip.indexD,
        0,
        state.x.values.length - 1
      );
      api.zoomIn(state.x.values[index], (err, data) => {
        console.log(data);
      });
    }
  });
};
