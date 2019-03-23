const { colorToRgba, minmax } = require("./utils/transformation");

const createInitialState = data => {
  const ids = Object.keys(data.names);

  return {
    ids: ids,
    names: data.names,
    types: data.types,
    colors: data.colors,
    colorsRGBA: ids.reduce((acc, v) => {
      acc[v] = colorToRgba(data.colors[v]);
      return acc;
    }, {}),
    columns: data.columns.reduce((acc, v) => {
      acc[v[0]] = new Float32Array(v.slice(1));
      return acc;
    }, {})
  };
};

const createCurrentState = initialState =>
  Object.assign({}, initialState, {
    initial: initialState,
    toggles: initialState.ids.reduce((acc, v) => {
      acc[v] = true;
      return acc;
    }, {}),
    colorsRGBA: Object.assign({}, initialState.colorsRGBA),
    xminmax: minmax(initialState.columns.x),
    yminmax: minmax(initialState.ids.map(v => initialState.columns[v])),
    windowWidth: 0.3,
    windowOffset: 0.7
  });

module.exports.createInitialState = createInitialState;
module.exports.createCurrentState = createCurrentState;
