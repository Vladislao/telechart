const createControl = (id, state, callback) => {
  const color = state.colors[id];
  const name = state.names[id];

  const checkbox = document.createElement("div");
  checkbox.className = "tc-checkbox";
  checkbox.style.backgroundColor = color;

  const element = document.createElement("div");
  element.appendChild(checkbox);
  element.append(name);
  element.className = "tc-control tc-checked";
  element.addEventListener("click", e => {
    element.classList.toggle("tc-checked");
    callback(id);
  });

  return element;
};

module.exports = (state, callback) => {
  const controls = document.createElement("div");
  controls.className = "tc-controls";

  Object.keys(state.names).forEach(v => {
    const control = createControl(v, state, callback);
    controls.appendChild(control);
  });

  return controls;
};
