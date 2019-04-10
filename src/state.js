const { closest, minmax } = require("./utils/transformation");
const segmentTree = require("./utils/segmentTree");

const getValues = (columns, id) => columns.find(v => v[0] === id).slice(1);

const createCharts = (ids, data) =>
  ids.reduce((acc, v) => {
    const values = getValues(data.columns, v);
    const mmtree = segmentTree.create(values);

    acc[v] = {
      id: v,
      name: data.names[v],
      type: data.types[v],
      color: {
        hex: data.colors[v],
        alpha: 1
      },
      disabled: false,
      values,
      mmtree
    };
    return acc;
  }, {});

const create = data => {
  const ids = Object.keys(data.names);
  const charts = createCharts(ids, data);

  const x = getValues(data.columns, "x");

  const windowOffset = closest(x.length, 0.6);
  const windowWidth = closest(x.length, 0.3);

  const globalYMinmax = minmax({ ids, charts }, 0, x.length);
  const windowYMinmax = minmax(
    { ids, charts },
    windowOffset,
    windowOffset + windowWidth
  );

  // TODO: matrix to transform

  return {
    ids,
    charts,
    x: {
      values: x,
      matrix: [0, x.length]
    },
    x0: {
      matrix: [windowOffset, x.length - windowOffset]
    },
    y: {
      // minmax: globalYMinmax,
      matrix: [globalYMinmax[0], globalYMinmax[1] - globalYMinmax[0]]
    },
    y0: {
      // minmax: windowYMinmax,
      matrix: [windowYMinmax[0], windowYMinmax[1] - windowYMinmax[0]]
    },
    window: {
      offset: windowOffset,
      width: windowWidth,
      minwidth: closest(x.length, 0.2),
      tracker: {
        width: 10,
        stroke: {
          hex: "#C0D1E1",
          alpha: 1
        },
        color: {
          hex: "#C0D1E1",
          alpha: 1
        }
      },
      mask: {
        color: {
          hex: "#E2EEF9",
          alpha: 0.6
        }
      }
    },
    tooltip: {
      offset: null
    }
  };
};

// const createCurrentState = initialState => {
//   const y0 = initialState.columns[initialState.ids[0]];
//   return Object.assign({}, initialState, {
//     initial: initialState,
//     toggles: initialState.ids.reduce((acc, v) => {
//       acc[v] = true;
//       return acc;
//     }, {}),
//     colorsRGBA: initialState.ids.reduce((acc, v) => {
//       acc[v] = initialState.colorsRGBA[v].slice(0);
//       return acc;
//     }, {}),
//     minmax: {
//       x: minmax(initialState.columns.x),
//       y: minmax(initialState.ids.map(v => initialState.columns[v])),
//       y0: minmax(
//         initialState.ids.map(v => initialState.columns[v]),
//         closest(y0, 0.7),
//         closest(y0, 1) + 1
//       )
//     },
//     window: {
//       offset: 0.7,
//       width: 0.3,
//       index: closest(y0, 0.7),
//       colorsRGBA: {
//         background: colorToRgba("#000", 0.35),
//         control: colorToRgba("#000", 0.5)
//       }
//     },
//     tooltip: {
//       offsetX: null,
//       columns: {}
//     }
//   });
// };

module.exports = create;
