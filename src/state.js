const { colorToRgba, minmax } = require("./utils/transformations");

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
    }, {}),
    toggles: ids.reduce((acc, v) => {
      acc[v] = true;
      return acc;
    }, {})
  };
};

const createCurrentState = initialState =>
  Object.assign({}, initialState, {
    initial: initialState,
    colorsRGBA: Object.assign({}, initialState.colorsRGBA),
    xminmax: minmax(initialState.columns.x),
    yminmax: minmax(initialState.ids.map(v => initialState.columns[v]))
  });

module.exports.createInitialState = createInitialState;
module.exports.createCurrentState = createCurrentState;
