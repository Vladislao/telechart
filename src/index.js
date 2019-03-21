require("./index.css");

const createChart = require("./components/chart");
const createControls = require("./components/controls");

const initilize = data => {
  const state = Object.assign({}, data);

  state.ids = Object.keys(data.types);

  state.buffers = data.columns.reduce((acc, v) => {
    acc[v[0]] = new Float32Array(v, 1);
    return acc;
  }, {});
  delete state.columns;

  state.toggle = state.ids.reduce((acc, v) => {
    acc[v] = true;
    return acc;
  }, {});

  return state;
};

module.exports = (element, data, options) => {
  // TODO: check if already a canvas
  // TODO: check caniuse
  const state = initilize(data);

  const chart = createChart(state);

  const controls = createControls(state, id => {
    state.toggle[id] = !state.toggle[id];
  });

  element.appendChild(controls);
};
