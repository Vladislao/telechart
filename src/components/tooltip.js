const createValue = (id, state) => {
  const value = document.createElement("span");
  const element = document.createElement("div");
  element.className = "tc-tooltip__value";
  element.style.color = state.colors[id];

  element.appendChild(value);
  element.append(state.names[id]);

  return {
    id,
    element,
    render: previous => {
      if (state.toggles[id]) {
        element.classList.remove("tc-tooltip__value--hidden");
      } else {
        element.classList.add("tc-tooltip__value--hidden");
      }

      if (state.tooltip.index !== previous) {
        value.innerText = state.columns[id][state.tooltip.index];
      }
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

  const values = state.ids.map(v => createValue(v, state));
  values.forEach(v => {
    wrapper.appendChild(v.element);
  });

  element.appendChild(name);
  element.appendChild(wrapper);

  let previous = null;
  const render = () => {
    if (state.tooltip.offsetX === null) {
      element.classList.add("tc-tooltip--hidden");
    } else {
      element.classList.remove("tc-tooltip--hidden");
    }

    if (state.tooltip.index !== previous) {
      element.style.transform = `translateX(${state.tooltip.offsetX - 10}px)`;

      name.innerText = new Date(
        state.columns.x[state.tooltip.index]
      ).toLocaleDateString();
    }

    values.forEach(v => v.render(previous));
    previous = state.tooltip.index;
  };

  return {
    element,
    render
  };
};
