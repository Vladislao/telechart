const createControl = chart => {
  const checkbox = document.createElement("div");
  checkbox.className = "tc-checkbox";
  checkbox.style.backgroundColor = chart.color.hex;

  const wrapper = document.createElement("div");
  wrapper.appendChild(checkbox);
  wrapper.appendChild(document.createTextNode(chart.name));
  wrapper.className = "tc-control tc-checked";

  return {
    id: chart.id,
    element: wrapper
  };
};

module.exports = state => {
  const wrapper = document.createElement("div");
  wrapper.className = "tc-controls";

  const controls = state.ids.map(v => {
    const control = createControl(state.charts[v]);
    wrapper.appendChild(control.element);
    return control;
  });

  return {
    element: wrapper,
    render: () => {},
    register: callback => {
      controls.forEach(v => callback(v));
    }
  };
};
