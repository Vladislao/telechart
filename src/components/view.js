const { resize, formatDate, formatValue } = require("../utils/transformation");

const handleXValues = require("../rendering/x");
const handleLineChart = require("../rendering/y");

const lighten = color => {
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);

  const lr = (r + (255 - r) / 3) | 0;
  const lg = (g + (255 - g) / 3) | 0;
  const lb = (b + (255 - b) / 3) | 0;

  return `#${lr.toString(16)}${lg.toString(16)}${lb.toString(16)}`;
};

const MODE = {
  NONE: 0,
  FORCE: 1,
  XBOUNDS: 2,
  CHART: 4,
  TEXT: 8
};

module.exports = (state, options) => {
  const wrapper = document.createElement("div");
  wrapper.className = "tc-chart-wrapper";

  const canvas = document.createElement("canvas");
  canvas.className = "tc-chart";

  wrapper.appendChild(canvas);
  const context = canvas.getContext("2d");

  const chart = {};
  const text = {};
  const grid = {};
  const tooltip = {};
  const previousState = {
    charts: {},
    window: {},
    tooltip: {},
    y0: {}
  };
  const cache = {
    mode: MODE.NONE,
    chart,
    text,
    grid,
    tooltip,
    previousState
  };

  const bounds = {};

  return {
    element: wrapper,
    register: callback =>
      callback({ id: "view", element: wrapper, canvas, bounds }),

    render: force => {
      cache.mode = MODE.NONE;

      cache.sum = state.y.sum;
      cache.matrix = state.y0.matrix;

      if (force) {
        cache.mode |= MODE.FORCE;
        resize(canvas);

        // update element positions
        const clientRect = canvas.getBoundingClientRect();
        bounds.left = clientRect.left + window.pageXOffset;
        bounds.top = clientRect.top + window.pageYOffset;
        bounds.right = clientRect.right + window.pageXOffset;
        bounds.bottom = clientRect.bottom + window.pageYOffset;

        const dpr = window.devicePixelRatio;

        // value formatters
        cache.formatX = (options && options.formatX) || formatDate;
        cache.formatY = (options && options.formatY) || formatValue;

        cache.stacked = state.stacked;
        cache.percentage = state.percentage;

        // cache for stacked values to avoid GC
        if (state.stacked) {
          cache.stack = new Array(state.x.values.length);
        }

        // text
        const fontSize = (state.axis.x.size || 10) * dpr;
        text.font = `${fontSize}px ${state.axis.x.font}`;

        text.height = fontSize + 4 * dpr;
        text.width = canvas.width;

        text.x = 0;
        text.y = canvas.height - text.height + 2 * dpr;

        context.font = text.font;
        const xTextWidth = Math.ceil(
          context.measureText(cache.formatX(state.x.values[0], "short")).width
        );

        text.steps = Math.max(canvas.width / (xTextWidth * 2), 1);
        text.minstep = (state.window.minwidth - 1) / text.steps;
        text.padding = Math.floor(text.minstep / 2);

        text.region = {
          x: 0,
          y: canvas.height - text.height,
          width: canvas.width,
          height: fontSize + 4 * dpr
        };

        // grid lines
        grid.lineWidth = state.grid.lineWidth * dpr;
        grid.font = `${(state.axis.y.size || 10) * dpr}px ${state.axis.y.font}`;

        // tooltip point and line
        tooltip.lineWidth = state.tooltip.lineWidth * dpr;
        tooltip.radius = state.tooltip.radius * dpr;

        // chart
        chart.lineWidth = state.y0.lineWidth * dpr;

        chart.width = canvas.width;
        chart.height = canvas.height - text.height - (tooltip.radius + 4);

        chart.x = 0;
        chart.y = 0;

        chart.region = {
          x: 0,
          y: 0,
          width: canvas.width,
          height: canvas.height - text.height
        };

        chart.limit = { bottom: chart.height };

        // some props based on charts provided
        cache.lighten = {};
        cache.bar = false;
        for (let i = 0; i < state.ids.length; i++) {
          const id = state.ids[i];
          const line = state.charts[id];
          cache.lighten[id] = lighten(line.color.hex);
          cache.bar = cache.bar || line.type === "bar";
        }
      }

      // Update x bounds
      if (
        cache.mode & MODE.FORCE ||
        previousState.window.offset !== state.window.offset ||
        previousState.window.width !== state.window.width
      ) {
        cache.mode |= MODE.XBOUNDS | MODE.CHART | MODE.TEXT;

        previousState.window.offset = state.window.offset;
        previousState.window.width = state.window.width;

        chart.start = state.window.offset | 0;
        chart.range = state.window.width | 0;

        if (cache.bar) {
          chart.scaleX =
            chart.width / (chart.range + state.window.width - chart.range);
          chart.offsetX =
            -chart.scaleX * (state.window.offset - chart.start) +
            chart.scaleX / 2;
        } else {
          chart.scaleX =
            chart.width / (chart.range - 1 + state.window.width - chart.range);
          chart.offsetX = -chart.scaleX * (state.window.offset - chart.start);
        }
      }

      // update tooltip position
      if (
        cache.mode & (MODE.FORCE | MODE.XBOUNDS) ||
        previousState.tooltip.index !== state.tooltip.index
      ) {
        cache.mode |= MODE.CHART;
        previousState.tooltip.index = state.tooltip.index;

        if (state.tooltip.index !== null) {
          tooltip.indexD = Math.min(
            chart.start + state.tooltip.indexD,
            state.x.values.length - 1
          );
          tooltip.xD =
            chart.x +
            (tooltip.indexD - chart.start) * chart.scaleX +
            chart.offsetX;
          tooltip.x =
            chart.x + state.tooltip.index * chart.scaleX + chart.offsetX;
        } else {
          tooltip.xD = null;
          tooltip.indexD = null;
          tooltip.x = null;
        }
      }

      // update chart colors
      for (let i = 0; i < state.ids.length; i++) {
        const v = state.ids[i];
        if (!(v in previousState.charts)) {
          previousState.charts[v] = { color: {} };
        }

        const current = state.charts[v].color;
        const previous = previousState.charts[v].color;

        if (previous.hex !== current.hex || previous.alpha !== current.alpha) {
          previous.hex = current.hex;
          previous.alpha = current.alpha;
          cache.mode |= MODE.CHART;
        }
      }

      // if (state.y_scaled) {
      //   handleScaledLineChart(state, context, cache, MODE);
      // } else {
      handleLineChart(state, context, cache, MODE);
      // }

      handleXValues(state, context, cache, MODE);
    }
  };
};
