const {
  drawHorizontalLines,
  drawYText,
  drawVerticalLine,
  drawPoint,
  drawArea,
  drawLine,
  drawBar
} = require("./grid");

module.exports = (state, context, cache, modes) => {
  const { previousState, chart, grid, tooltip, text } = cache;

  if (state.y_scaled) {
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
  } else {
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
  }

  if (cache.mode & (modes.CHART | modes.FORCE)) {
    context.clearRect(
      chart.region.x,
      chart.region.y,
      chart.region.width,
      chart.region.height
    );

    cache.first = true;

    context.lineJoin = "bevel";
    context.lineCap = "butt";
    context.lineWidth = chart.lineWidth;

    for (let i = 0; i < state.ids.length; i++) {
      const v = state.ids[i];
      const line = state.charts[v];

      if (line.color.alpha === 0) continue;
      if (state.y_scaled && i > 1) continue;

      if (state.y_scaled) {
        // TODO: scaleY1 for last only
        chart.scaleY = chart[`scaleY${i}`];
        chart.offsetY = chart[`offsetY${i}`];
      }

      context.globalAlpha = line.color.alpha;
      context.strokeStyle = line.color.hex;
      context.fillStyle = line.color.hex;

      if (line.type === "line") {
        drawLine(context, line.values, chart, line.type === "line", cache);
      }
      if (line.type === "area") {
        drawArea(context, line.values, chart, cache, line.alpha);
      }
      if (line.type === "bar") {
        drawBar(context, line.values, chart, cache, cache.lighten[v]);
      }

      cache.first = false;
    }

    context.lineWidth = grid.lineWidth;
    context.globalAlpha = state.grid.color.alpha;
    context.strokeStyle = state.grid.color.hex;

    drawHorizontalLines(context, state.grid.lines, chart);

    if (tooltip.x !== null && !cache.bar) {
      context.lineWidth = tooltip.lineWidth;
      context.globalAlpha = state.tooltip.color.alpha;
      context.strokeStyle = state.tooltip.color.hex;

      drawVerticalLine(context, tooltip.x, chart);

      context.lineWidth = chart.lineWidth;

      for (let i = 0; i < state.ids.length; i++) {
        const v = state.ids[i];
        const line = state.charts[v];

        if (line.color.alpha === 0) continue;
        if (line.type === "area") continue;
        if (state.y_scaled && i > 1) continue;

        if (state.y_scaled) {
          // TODO: scaleY1 for last only
          chart.scaleY = chart[`scaleY${i}`];
          chart.offsetY = chart[`offsetY${i}`];
        }

        context.globalAlpha = line.color.alpha;
        context.strokeStyle = line.color.hex;

        const y =
          chart.y + line.values[tooltip.indexD] * chart.scaleY + chart.offsetY;
        drawPoint(context, tooltip.xD, y, tooltip.radius);
      }
    }

    context.font = text.font;
    context.textBaseline = "bottom";

    if (state.y_scaled) {
      const color1 = state.charts[state.ids[0]].color;
      context.fillStyle = color1.hex;
      context.globalAlpha = color1.alpha;

      context.textAlign = "start";
      chart.scaleY = chart.scaleY0;
      chart.offsetY = chart.offsetY0;
      drawYText(context, state.y0.matrix[0], 0, chart, cache.formatY);

      const color2 = state.charts[state.ids[1]].color;
      context.fillStyle = color2.hex;
      context.globalAlpha = color2.alpha;

      context.textAlign = "end";
      chart.scaleY = chart.scaleY1;
      chart.offsetY = chart.offsetY1;
      drawYText(context, state.y0.matrix[1], chart.width, chart, cache.formatY);
    } else {
      context.fillStyle = state.axis.color.hex;
      context.globalAlpha = state.axis.color.alpha;

      context.textAlign = "start";
      // TODO: pass formated values
      drawYText(context, state.y0.matrix, 0, chart, cache.formatY);
    }
  }
};
