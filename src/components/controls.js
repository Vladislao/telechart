const createControl = (id, state) => {
  const color = state.colors[id];
  const name = state.names[id];

  const checkbox = document.createElement("div");
  checkbox.className = "tc-checkbox";
  checkbox.style.backgroundColor = color;

  const element = document.createElement("div");
  element.appendChild(checkbox);
  element.append(name);
  element.className = "tc-control tc-checked";

  return element;
};

module.exports = state => {
  const element = document.createElement("div");
  element.className = "tc-controls";

  const controls = Object.keys(state.names).map(v => {
    const control = createControl(v, state);
    element.appendChild(control);
    return { id: v, element: control };
  });

  return {
    element,
    registerEvent: callback => {
      controls.forEach(v => callback(v));
    }
  };
};
