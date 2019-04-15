const { formatDate } = require("../utils/transformation");

module.exports = (state, options) => {
  const wrapper = document.createElement("div");
  wrapper.className = "tc-range";

  const from = document.createElement("div");
  const to = document.createElement("div");

  wrapper.appendChild(from);
  wrapper.appendChild(document.createTextNode(" - "));
  wrapper.appendChild(to);

  const previousState = { window: {} };
  const cache = {};

  return {
    element: wrapper,
    render: force => {
      const offset =
        state.window.offsetD === undefined
          ? Math.trunc(state.window.offset)
          : state.window.offsetD;
      const width =
        state.window.widthD === undefined
          ? Math.trunc(state.window.width)
          : state.window.widthD;

      if (force) {
        cache.formatX = (options && options.formatX) || formatDate;
      }

      if (
        force ||
        previousState.window.widthD !== width ||
        previousState.window.offsetD !== offset
      ) {
        previousState.window.widthD = width;
        previousState.window.offsetD = offset;

        from.textContent = cache.formatX(state.x.values[offset], "date");
        to.textContent = cache.formatX(
          state.x.values[offset + width - 1],
          "date"
        );
      }
    },
    register: () => {}
  };
};
