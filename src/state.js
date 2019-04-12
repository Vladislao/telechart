const { closest, minmax, findScale } = require("./utils/transformation");
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

  const windowOffset = 0; //closest(x.length, 0.6);
  const windowWidth = closest(x.length, 0.3);

  const globalYMinmax = minmax({ ids, charts }, 0, x.length);
  const windowYMinmax = minmax(
    { ids, charts },
    windowOffset,
    windowOffset + windowWidth
  );
  const windowYScale = findScale(windowYMinmax[0], windowYMinmax[1], 6);

  // TODO: matrix to transform

  return {
    ids,
    charts,
    x: {
      values: x,
      matrix: [0, x.length - 1]
    },
    x0: {
      matrix: [windowOffset, windowWidth]
    },
    y: {
      width: 1,
      matrix: [globalYMinmax[0], globalYMinmax[1] - globalYMinmax[0]]
    },
    y0: {
      width: 1,
      matrix: windowYScale
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
    },
    grid: {
      lines: 6,
      linewidth: 1,
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
