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
    colorsRGBA: initialState.ids.reduce((acc, v) => {
      acc[v] = initialState.colorsRGBA[v].slice(0);
      return acc;
    }, {}),
    minmax: {
      x: minmax(initialState.columns.x),
      // xwindow: calculateWindow(initialState.columns.x, 0.7, 0.3),
      y: minmax(initialState.ids.map(v => initialState.columns[v]))
    },
    window: {
      offset: 0.7,
      width: 0.3,
      colorsRGBA: {
        background: colorToRgba("#000", 0.35),
        control: colorToRgba("#000", 0.5)
      }
    },
    tooltip: {
      offsetX: null,
      columns: {}
    }
  });

module.exports.createInitialState = createInitialState;
module.exports.createCurrentState = createCurrentState;
