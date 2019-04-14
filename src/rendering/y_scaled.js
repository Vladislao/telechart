const drawLine = require("./line");
const {
  drawHorizontalLines,
  drawYText,
  drawVerticalLine,
  drawPoint
} = require("./grid");

module.exports = (state, context, cache, modes) => {
  const { previousState, chart, grid, tooltip, text } = cache;

  if (!previousState.y0.matrix) {
    previousState.y0.matrix = [[-1, -1], [-1, -1]];
  }

  // update Y0 bounds
  if (
    cache.mode & modes.FORCE ||
    previousState.y0.matrix[0][0] !== state.y0.matrix[0][0] ||
    previousState.y0.matrix[0][1] !== state.y0.matrix[0][1]
  ) {
    cache.mode |= modes.CHART;
    previousState.y0.matrix[0][0] = state.y0.matrix[0][0];
    previousState.y0.matrix[0][1] = state.y0.matrix[0][1];

    chart.scaleY0 = -chart.height / state.y0.matrix[0][1];
    chart.offsetY0 = chart.height - state.y0.matrix[0][0] * chart.scaleY0;
  }

  // update Y1 bounds
  if (
    cache.mode & modes.FORCE ||
    previousState.y0.matrix[1][0] !== state.y0.matrix[1][0] ||
    previousState.y0.matrix[1][1] !== state.y0.matrix[1][1]
  ) {
    cache.mode |= modes.CHART;
    previousState.y0.matrix[1][0] = state.y0.matrix[1][0];
    previousState.y0.matrix[1][1] = state.y0.matrix[1][1];

    chart.scaleY1 = -chart.height / state.y0.matrix[1][1];
    chart.offsetY1 = chart.height - state.y0.matrix[1][0] * chart.scaleY1;
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

    for (let i = 0; i < 2; i++) {
      const line = state.charts[state.ids[i]];

      context.globalAlpha = line.color.alpha;
      context.strokeStyle = line.color.hex;

      if (line.color.alpha === 0) continue;

      chart.scaleY = chart[`scaleY${i}`];
      chart.offsetY = chart[`offsetY${i}`];
      drawLine(context, line.values, chart);
    }

    context.lineWidth = grid.lineWidth;
    context.globalAlpha = state.grid.color.alpha;
    context.strokeStyle = state.grid.color.hex;

    // chart.scaleY = chart.scaleY0;
    // chart.offsetY = chart.offsetY0;
    drawHorizontalLines(context, state.grid.lines, chart);

    if (tooltip.x !== null) {
      context.lineWidth = tooltip.lineWidth;
      context.globalAlpha = state.tooltip.color.alpha;
      context.strokeStyle = state.tooltip.color.hex;

      drawVerticalLine(context, tooltip.x, chart);

      context.lineWidth = chart.lineWidth;
      for (let i = 0; i < 2; i++) {
        const line = state.charts[state.ids[i]];

        if (line.color.alpha === 0) continue;

        context.globalAlpha = line.color.alpha;
        context.strokeStyle = line.color.hex;

        const y =
          chart.y +
          line.values[tooltip.indexD] * chart[`scaleY${i}`] +
          chart[`offsetY${i}`];

        drawPoint(context, tooltip.xD, y, tooltip.radius);
      }
    }

    context.font = text.font;

    for (let i = 0; i < 2; i++) {
      const line = state.charts[state.ids[i]];

      if (line.color.alpha === 0) continue;

      context.globalAlpha = line.color.alpha;
      context.fillStyle = line.color.hex;

      chart.scaleY = chart[`scaleY${i}`];
      chart.offsetY = chart[`offsetY${i}`];
      const x = i === 0 ? 0 : chart.width - text.ywidth;
      // TODO: pass formated values
      drawYText(context, state.y0.matrix[i], x, chart, cache.formatY);
    }
  }
};
