const { resize, formatDate, formatValue } = require("../utils/transformation");
const drawLine = require("../rendering/line");
const {
  drawHorizontalLines,
  drawYText,
  drawVerticalLine,
  drawPoint
} = require("../rendering/grid");

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
    y0: { matrix: [-1, -1] }
  };

  const cache = {
    chart,
    text,
    grid,
    tooltip,
    state: previousState
  };

  return {
    element: wrapper,
    register: callback => callback({ id: "view", element: wrapper, canvas }),

    render: force => {
      // if (!resizedOnce) {
      //   resize(canvas);
      //   resizedOnce = true;
      // }

      let shouldDrawChart = force;
      let shouldDrawXText = force;

      if (force) {
        resize(canvas);

        const dpr = window.devicePixelRatio;

        // value formatters
        cache.formatX = (options && options.formatX) || formatDate;
        cache.formatY = (options && options.formatY) || formatValue;

        // text
        const fontSize = (state.axis.size || 10) * dpr;
        text.font = `${fontSize}px ${state.axis.font}`;

        text.height = fontSize + 4 * dpr;
        text.width = canvas.width;

        text.x = 0;
        text.y = canvas.height - text.height;

        context.font = text.font;
        const xTextWidth = Math.ceil(
          context.measureText(cache.formatX(state.x.values[0], "short")).width
        );

        text.offsetX = Math.floor(xTextWidth / 2);
        text.offsetY = fontSize + 2 * dpr;
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

        // tooltip point and line
        tooltip.lineWidth = state.tooltip.lineWidth * dpr;
        tooltip.radius = state.tooltip.radius * dpr;

        // chart
        chart.lineWidth = state.y0.lineWidth * dpr;
        chart.width = canvas.width;
        chart.height = canvas.height - text.height - (tooltip.radius + 1) * 2;

        chart.x = 0;
        chart.y = tooltip.radius + 1;

        chart.region = {
          x: 0,
          y: 0,
          width: canvas.width,
          height: canvas.height - text.height
        };

        chart.limit = { bottom: chart.lineWidth };
      }

      // Update x bounds
      let xBoundsChanged = false;
      if (
        force ||
        previousState.window.offset !== state.window.offset ||
        previousState.window.width !== state.window.width
      ) {
        previousState.window.offset = state.window.offset;
        previousState.window.width = state.window.width;

        chart.start = Math.trunc(state.window.offset);
        chart.range = Math.trunc(state.window.width);

        chart.scaleX =
          chart.width / (chart.range - 1 + state.window.width - chart.range);
        chart.offsetX = -chart.scaleX * (state.window.offset - chart.start);

        xBoundsChanged = true;
        shouldDrawChart = true;
        shouldDrawXText = true;
      }

      // update tooltip position
      if (
        force ||
        xBoundsChanged ||
        previousState.tooltip.index !== state.tooltip.index
      ) {
        previousState.tooltip.index = state.tooltip.index;

        // delta

        // destination
        tooltip.indexD = chart.start + state.tooltip.indexD;
        tooltip.xD =
          chart.x + state.tooltip.indexD * chart.scaleX + chart.offsetX;
        tooltip.x =
          chart.x + state.tooltip.index * chart.scaleX + chart.offsetX;

        shouldDrawChart = true;
      }

      // update Y bounds
      if (
        force ||
        previousState.y0.matrix[0] !== state.y0.matrix[0] ||
        previousState.y0.matrix[1] !== state.y0.matrix[1]
      ) {
        previousState.y0.matrix[0] = state.y0.matrix[0];
        previousState.y0.matrix[1] = state.y0.matrix[1];

        chart.scaleY = -chart.height / state.y0.matrix[1];
        chart.offsetY = chart.height - state.y0.matrix[0] * chart.scaleY;

        shouldDrawChart = true;
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
          shouldDrawChart = true;
        }
      }

      if (shouldDrawChart) {
        context.clearRect(
          chart.region.x,
          chart.region.y,
          chart.region.width,
          chart.region.height
        );

        context.lineJoin = "bevel";
        context.lineCap = "butt";
        context.lineWidth = chart.lineWidth;

        for (let i = 0; i < state.ids.length; i++) {
          const v = state.ids[i];
          const line = state.charts[v];

          if (line.color.alpha === 0) continue;

          context.globalAlpha = line.color.alpha;
          context.strokeStyle = line.color.hex;

          drawLine(context, line.values, chart);
        }

        context.lineWidth = grid.lineWidth;
        context.globalAlpha = state.grid.color.alpha;
        context.strokeStyle = state.grid.color.hex;

        drawHorizontalLines(context, state.y0.matrix, chart);

        if (tooltip.x !== null) {
          context.lineWidth = tooltip.lineWidth;
          context.globalAlpha = state.tooltip.color.alpha;
          context.strokeStyle = state.tooltip.color.hex;

          drawVerticalLine(context, tooltip.x, chart);

          context.lineWidth = chart.lineWidth;

          for (let i = 0; i < state.ids.length; i++) {
            const v = state.ids[i];
            const line = state.charts[v];

            if (line.color.alpha === 0) continue;

            context.globalAlpha = line.color.alpha;
            context.strokeStyle = line.color.hex;

            const y =
              chart.y +
              line.values[tooltip.indexD] * chart.scaleY +
              chart.offsetY;
            drawPoint(context, tooltip.xD, y, tooltip.radius);
          }
        }

        context.font = text.font;
        context.fillStyle = state.axis.color.hex;
        context.globalAlpha = state.axis.color.alpha;

        // TODO: pass formated values
        drawYText(context, state.y0.matrix, 0, chart, cache.formatY);
      }

      if (force || xBoundsChanged) {
        const steps = chart.range / text.steps;
        const magnitude = steps / text.minstep;
        const magnitudeI = Math.floor(magnitude);
        const primary = magnitudeI % 2;

        text.fraction = magnitude - magnitudeI;
        if (text.magnitudeI !== magnitudeI || text.primary !== primary) {
          text.magnitudeI = magnitudeI;
          text.primary = primary;

          text.step =
            Math.max(magnitudeI - primary, 1) * Math.ceil(text.minstep);
          text.doublestep = Math.ceil(text.step * 2);
        }

        const closest =
          Math.ceil(chart.start / text.step) * text.step - text.step;

        text.start = Math.max(closest, text.step) - text.padding;
        text.last = Math.min(
          chart.start + chart.range + 1,
          state.x.values.length
        );

        shouldDrawXText = true;
      }

      if (shouldDrawXText) {
        context.clearRect(
          text.region.x,
          text.region.y,
          text.region.width,
          text.region.height
        );

        const alpha = state.axis.color.alpha;

        context.font = text.font;
        context.fillStyle = state.axis.color.hex;
        context.globalAlpha = alpha;

        for (let i = -text.padding; i < text.last; i += text.doublestep) {
          if (i < text.start) continue;

          const shift = i - chart.start;

          context.fillText(
            formatDate(state.x.values[i], "short"),
            shift * chart.scaleX + chart.offsetX + text.offsetX,
            text.y + text.offsetY
          );
        }

        context.globalAlpha = text.primary ? alpha - text.fraction : alpha;

        for (
          let i = text.step - text.padding;
          i < text.last;
          i += text.doublestep
        ) {
          if (i < text.start) continue;
          const shift = i - chart.start;

          context.fillText(
            formatDate(state.x.values[i], "short"),
            shift * chart.scaleX + chart.offsetX + text.offsetX,
            text.y + text.offsetY
          );
        }
      }
    }
  };
};
