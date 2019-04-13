const createCache = require("../utils/cache");
const { formatDate } = require("../utils/transformation");

module.exports = state => {
  const element = document.createElement("div");
  element.className = "tc-range";

  const from = document.createElement("div");
  const to = document.createElement("div");

  element.appendChild(from);
  element.appendChild(document.createTextNode(" - "));
  element.appendChild(to);

  const cache = createCache();

  const scroller = state.window;

  return {
    element,
    render: () => {
      cache(
        c =>
          c.offset !== state.window.offsetFinal ||
          c.width !== state.window.widthFinal,
        c => {
          c.offset = state.window.offsetFinal;
          c.width = state.window.widthFinal;

          from.textContent = formatDate(state.x.values[c.offset], "date");
          to.textContent = formatDate(
            state.x.values[c.offset + c.width - 1],
            "date"
          );
        }
      );
    },
    register: () => {}
  };
};
