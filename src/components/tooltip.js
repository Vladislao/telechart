const createCache = require("../utils/cache");
const { formatDate } = require("../utils/transformation");

const createValue = chart => {
  const element = document.createElement("div");
  element.className = "tc-tooltip__value";

  const name = document.createElement("span");
  const value = document.createElement("span");
  value.style.color = chart.color.hex;

  element.appendChild(name.appendChild(document.createTextNode(chart.name)));
  element.appendChild(value);

  const cache = createCache();

  element.addEventListener("mouseover", e => {
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
  });

  return {
    id: chart.id,
    element,
    render: index => {
      cache(
        c => c.disabled !== chart.disabled || c.index !== index,
        c => {
          c.disabled = chart.disabled;
          c.index = index;

          if (chart.disabled) {
            element.classList.add("tc-tooltip__value--hidden");
          } else {
            element.classList.remove("tc-tooltip__value--hidden");
            if (index) {
              value.textContent = chart.values[index];
            }
          }
        }
      );
    }
  };
};

module.exports = state => {
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

  const cache = createCache();

  let width = null;

  return {
    element,
    render: () => {
      if (!width) {
        width = element.clientWidth / 2;
      }

      cache(
        c => c.index !== state.tooltip.index,
        c => {
          c.index = state.tooltip.index;

          const indexPosition = state.window.offsetFinal + c.index;

          if (state.tooltip.index === null) {
            element.classList.add("tc-tooltip--hidden");
          } else {
            element.classList.remove("tc-tooltip--hidden");
            element.style.transform = `translateX(${state.tooltip.indexX -
              width}px)`;
            name.textContent = formatDate(
              state.x.values[indexPosition],
              "full"
            );
          }

          values.forEach(v => v.render(indexPosition));
        }
      );
    },
    register: () => {}
  };
};
