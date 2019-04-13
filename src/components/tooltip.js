const { formatDate } = require("../utils/transformation");

const createValue = chart => {
  const element = document.createElement("div");
  element.className = "tc-tooltip__value";

  const name = document.createElement("span");
  const value = document.createElement("span");
  value.style.color = chart.color.hex;

  element.appendChild(name.appendChild(document.createTextNode(chart.name)));
  element.appendChild(value);

  // element.addEventListener("mouseover", e => {
  //   e.stopPropagation();
  //   e.stopImmediatePropagation();
  //   e.preventDefault();
  // });

  const previousState = {};

  return {
    id: chart.id,
    element,
    render: (force, index) => {
      if (force || previousState.disabled !== chart.disabled) {
        previousState.disabled = chart.disabled;
        if (chart.disabled) {
          element.classList.add("tc-tooltip__value--hidden");
        } else {
          element.classList.remove("tc-tooltip__value--hidden");
        }
      }

      if (force || previousState.index !== index) {
        previousState.index = index;
        if (index) {
          value.textContent = chart.values[index];
        }
      }
    }
  };
};

module.exports = (state, options) => {
  const element = document.createElement("div");
  element.className = "tc-tooltip tc-tooltip--hidden";

  const name = document.createElement("div");
  name.className = "tc-tooltip__name";

  const wrapper = document.createElement("div");
  wrapper.className = "tc-tooltip__wrapper";

  const values = state.ids.map(v => {
    const value = createValue(state.charts[v]);
    wrapper.appendChild(value.element);

    return value;
  });

  element.appendChild(name);
  element.appendChild(wrapper);

  const previousState = { tooltip: {} };
  const cache = {};

  return {
    element,
    render: force => {
      if (force) {
        cache.formatX = (options && options.formatX) || formatDate;
      }

      if (force || previousState.tooltip.indexD !== state.tooltip.indexD) {
        previousState.tooltip.indexD = state.tooltip.indexD;

        if (state.tooltip.index === null) {
          element.classList.add("tc-tooltip--hidden");
        } else {
          element.classList.remove("tc-tooltip--hidden");
          element.style.transform = `translateX(${state.tooltip.indexX +
            10}px)`;

          const offset =
            state.window.offsetD === undefined
              ? Math.trunc(state.window.offset)
              : state.window.offsetD;

          const index = offset + state.tooltip.indexD;
          name.textContent = cache.formatX(state.x.values[index], "full");
          values.forEach(v => v.render(force, index));
        }
      }
    },
    register: () => {}
  };
};
