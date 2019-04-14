const drawLine = require("./line");
const {
  drawHorizontalLines,
  drawYText,
  drawVerticalLine,
  drawPoint,
  drawBar,
  drawStackedBar
} = require("./grid");

module.exports = (state, context, cache, modes) => {
  const { previousState, chart, grid, tooltip, text } = cache;

  if (!previousState.y0.matrix) {
    previousState.y0.matrix = [-1, -1];
  }

  // update Y bounds
  if (
    cache.mode & modes.FORCE ||
    previousState.y0.matrix[0] !== state.y0.matrix[0] ||
    previousState.y0.matrix[1] !== state.y0.matrix[1]
  ) {
    cache.mode |= modes.CHART;
    previousState.y0.matrix[0] = state.y0.matrix[0];
    previousState.y0.matrix[1] = state.y0.matrix[1];

    chart.scaleY = -chart.height / state.y0.matrix[1];
    chart.offsetY = chart.height - state.y0.matrix[0] * chart.scaleY;
  }

  if (cache.mode & (modes.CHART | modes.FORCE)) {
    context.clearRect(
      chart.region.x,
      chart.region.y,
      chart.region.width,
      chart.region.height
    );

    context.lineJoin = "bevel";
    context.lineCap = "butt";
    context.lineWidth = chart.lineWidth;

    if (cache.stack) {
      cache.stack.first = true;
    }

    for (let i = 0; i < state.ids.length; i++) {
      const v = state.ids[i];
      const line = state.charts[v];

      if (line.color.alpha === 0) continue;

      context.globalAlpha = line.color.alpha;

      if (line.type === "bar") {
        context.fillStyle = line.color.hex;
        if (state.stacked) {
          drawStackedBar(
            context,
            line.values,
            chart,
            tooltip.indexD,
            tooltip.lighten[v],
            state.y0.matrix[2],
            state.y.sum,
            cache.stack,
            line.color.alpha
          );
          cache.stack.first = false;
        } else {
          drawBar(
            context,
            line.values,
            chart,
            tooltip.indexD,
            tooltip.lighten[v]
          );
        }
      } else {
        context.strokeStyle = line.color.hex;
        drawLine(context, line.values, chart);
      }

      // if (state.stacked) {
      //   for (let j = 0; j <= state.x.values.length; j++) {
      //     stack[j] = (stack[j] || 0) + line.values[j];
      //   }
      // }
    }

    context.lineWidth = grid.lineWidth;
    context.globalAlpha = state.grid.color.alpha;
    context.strokeStyle = state.grid.color.hex;

    drawHorizontalLines(context, state.grid.lines, chart);

    if (tooltip.x !== null && !chart.bar) {
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
          chart.y + line.values[tooltip.indexD] * chart.scaleY + chart.offsetY;
        drawPoint(context, tooltip.xD, y, tooltip.radius);
      }
    }

    context.font = text.font;
    context.fillStyle = state.axis.color.hex;
    context.globalAlpha = state.axis.color.alpha;

    // TODO: pass formated values
    context.textAlign = "start";
    context.textBaseline = "bottom";
    drawYText(context, state.y0.matrix, 0, chart, cache.formatY);
  }
};
