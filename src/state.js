const { closest, findMatrix } = require("./utils/transformation");
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

  const globalYMinmax = findMatrix(
    {
      ids,
      charts,
      y_scaled: data.y_scaled,
      stacked: data.stacked,
      grid: { lines: 5 }
    },
    0,
    x.length
  );
  const windowYMatrix = findMatrix(
    {
      ids,
      charts,
      y_scaled: data.y_scaled,
      stacked: data.stacked,
      grid: { lines: 5 }
    },
    windowOffset,
    windowOffset + windowWidth
  );

  // TODO: matrix to transform

  return {
    ids,
    charts,
    y_scaled: data.y_scaled,
    stacked: data.stacked,
    x: {
      values: x,
      matrix: [0, x.length - 1]
    },
    y: {
      lineWidth: 1,
      matrix: globalYMinmax
    },
    y0: {
      lineWidth: 2,
      matrix: windowYMatrix
    },
    window: {
      offset: windowOffset,
      width: windowWidth,
      minwidth: closest(x.length, 0.05),
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
      lineWidth: 1,
      color: {
        hex: "#182D3B",
        alpha: 0.1
      },
      radius: 3,
      index: null
    },
    grid: {
      lines: 5,
      lineWidth: 1,
      color: {
        hex: "#182D3B",
        alpha: 0.1
      }
    },
    axis: {
      font: "Arial",
      size: 10,
      color: {
        hex: "#8E8E93",
        alpha: 1
      }
    }
  };
};

module.exports = create;
