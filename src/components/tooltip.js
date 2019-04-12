const createValue = chart => {
  const value = document.createElement("span");
  const element = document.createElement("div");
  element.className = "tc-tooltip__value";
  element.style.color = chart.color.hex;

  element.appendChild(document.createTextNode(chart.name));
  element.appendChild(value);

  return {
    id: chart.id,
    element,
    render: () => {
      if (chart.disabled) {
        element.classList.add("tc-tooltip__value--hidden");
      } else {
        element.classList.remove("tc-tooltip__value--hidden");
      }
      // if (state.tooltip.index !== previous) {
      //   value.innerText = state.columns[id][state.tooltip.index];
      // }
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
  // if (state.tooltip.index !== previous) {
  //   element.style.transform = `translateX(${state.tooltip.offsetX - 10}px)`;
  //   name.innerText = new Date(
  //     state.columns.x[state.tooltip.index]
  //   ).toLocaleDateString();
  // }
  // values.forEach(v => v.render(previous));
  // previous = state.tooltip.index;

  return {
    element,
    render: () => {
      if (state.tooltip.x === null) {
        element.classList.add("tc-tooltip--hidden");
      } else {
        element.classList.remove("tc-tooltip--hidden");
      }
    },
    register: () => {}
  };
};
