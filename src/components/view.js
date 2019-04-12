const { resize, formatDate, formatValue } = require("../utils/transformation");
const createCache = require("../utils/cache");
const drawLine = require("../rendering/line");
const {
  drawHorizontalLines,
  drawVerticalLine,
  drawPoint
} = require("../rendering/grid");

module.exports = state => {
  const canvas = document.createElement("canvas");
  canvas.className = "tc-chart";

  const context = canvas.getContext("2d");

  const tcache = {};
  const textCache = createCache(tcache);

  const tpcache = {};
  const tooltipCache = createCache(tpcache);

  const ccache = {};
  const canvasCache = createCache(ccache);

  const lcache = {};
  const linesCache = createCache(lcache);

  return {
    element: canvas,
    render: () => {
      // TODO: options
      const formatter = formatDate;

      const resizeTriggered = resize(canvas);

      let shouldDrawLines = resizeTriggered;
      let shouldDrawText = resizeTriggered;

      // update font size
      const fontSizeChanged = textCache(
        c => c.axisSize !== state.axis.size,
        c => {
          c.axisSize = state.axis.size;

          c.fontSize = (state.axis.size || 10) * window.devicePixelRatio;
          c.margin = 2 * window.devicePixelRatio;
        }
      );
      shouldDrawText = shouldDrawText || fontSizeChanged;

      // update x bounds
      const xBoundsChanged = linesCache(
        c =>
          c.offset !== state.window.offset ||
          c.width !== state.window.width ||
          c.length !== state.x.values.length ||
          resizeTriggered,
        c => {
          c.length = state.x.values.length;
          c.offset = state.window.offset;
          c.width = state.window.width;

          c.start = Math.trunc(c.offset);
          c.range = Math.trunc(c.width);

          c.scaleX = canvas.width / (c.range - 1 + c.width - c.range);
          c.offsetX = -c.scaleX * (c.offset - c.start);
        }
      );
      shouldDrawLines = shouldDrawLines || xBoundsChanged;
      shouldDrawText = shouldDrawText || xBoundsChanged;

      // update tooltip position
      const tooltipChanged = tooltipCache(
        c => c.x !== state.tooltip.x || xBoundsChanged || resizeTriggered,
        c => {
          c.x = state.tooltip.x;
          c.radius = state.tooltip.radius * window.devicePixelRatio;
          c.index = state.tooltip.index;

          if (c.x !== null) {
            c.indexLeft = c.index * lcache.scaleX + lcache.offsetX;
            c.left = c.x * lcache.scaleX + lcache.offsetX;
          }
        }
      );
      console.log(tpcache);

      shouldDrawLines = shouldDrawLines || tooltipChanged;

      // update y bounds
      const yBoundsChanged = linesCache(
        c =>
          c.ymin !== state.y0.matrix[0] ||
          c.yrange !== state.y0.matrix[1] ||
          fontSizeChanged ||
          resizeTriggered,
        c => {
          c.ymin = state.y0.matrix[0];
          c.yrange = state.y0.matrix[1];
          c.height = canvas.height - tcache.fontSize - tcache.margin * 2;
          c.borderBottom = c.height - 1;

          c.scaleY = -c.height / c.yrange;
          c.offsetY = c.height - c.ymin * c.scaleY;
        }
      );
      shouldDrawLines = shouldDrawLines || yBoundsChanged;

      // update color and alpha
      const colorsChanged = linesCache(
        c =>
          state.ids.some(v => {
            if (!(v in c)) return true;

            const ci = c[v];
            const color = state.charts[v].color;

            return color.alpha !== ci.alpha || color.hex !== ci.hex;
          }),
        c =>
          state.ids.forEach(v => {
            if (!(v in c)) c[v] = {};

            const ci = c[v];
            const color = state.charts[v].color;

            ci.alpha = color.alpha;
            ci.hex = color.hex;
          })
      );
      shouldDrawLines = shouldDrawLines || colorsChanged;

      if (shouldDrawLines) {
        context.clearRect(0, 0, canvas.width, lcache.height);

        canvasCache(
          c =>
            c.lineJoin !== "bevel" ||
            c.lineCap !== "butt" ||
            c.width !== state.y.width,
          c => {
            context.lineJoin = c.lineJoin = "bevel";
            context.lineCap = c.lineCap = "butt";
            c.width = state.y0.width;

            context.lineWidth = c.lineWidth =
              state.y0.width * window.devicePixelRatio;
          }
        );

        state.ids.forEach(v => {
          const chart = state.charts[v];

          if (chart.color.alpha === 0) return;

          ccache.globalAlpha = context.globalAlpha = chart.color.alpha;
          ccache.strokeStyle = context.strokeStyle = chart.color.hex;

          drawLine(context, chart.values, lcache, lcache.border);
        });

        canvasCache(
          c =>
            c.width !== state.grid.linewidth ||
            c.globalAlpha !== state.grid.color.alpha ||
            c.strokeStyle !== state.grid.color.hex,
          c => {
            c.width = state.axis.linewidth;

            context.lineWidth = c.lineWidth =
              state.grid.linewidth * window.devicePixelRatio;
            context.globalAlpha = c.globalAlpha = state.grid.color.alpha;
            context.strokeStyle = c.strokeStyle = state.grid.color.hex;
          }
        );

        drawHorizontalLines(
          context,
          state.y0.matrix,
          lcache,
          canvas.width,
          ccache.lineWidth
        );

        if (tpcache.x !== null) {
          drawVerticalLine(
            context,
            tpcache.left,
            lcache.height - ccache.lineWidth * 1.5
          );

          state.ids.forEach(v => {
            const chart = state.charts[v];

            if (chart.color.alpha === 0) return;

            ccache.globalAlpha = context.globalAlpha = chart.color.alpha;
            ccache.strokeStyle = context.strokeStyle = chart.color.hex;

            drawPoint(
              context,
              tpcache.indexLeft,
              lcache.scaleY * chart.values[tpcache.index] + lcache.offsetY,
              tpcache.radius
            );
          });
        }

        canvasCache(
          c =>
            c.baseFont !== state.axis.font ||
            c.fillStyle !== state.axis.color.hex ||
            c.globalAlpha !== state.axis.color.alpha ||
            fontSizeChanged,
          c => {
            c.baseFont = state.axis.font;
            context.font = c.font = `${tcache.fontSize}px ${state.axis.font}`;
            context.fillStyle = c.fillStyle = state.axis.color.hex;
            context.globalAlpha = c.globalAlpha = state.axis.color.alpha;
          }
        );

        const matrix = state.y0.matrix;
        for (let i = matrix[0]; i <= matrix[2]; i += matrix[3]) {
          context.fillText(
            formatValue(i),
            0,
            i * lcache.scaleY +
              lcache.offsetY -
              ccache.lineWidth -
              2 * window.devicePixelRatio
          );
        }
      }

      canvasCache(
        c =>
          c.baseFont !== state.axis.font ||
          c.fillStyle !== state.axis.color.hex ||
          fontSizeChanged,
        c => {
          c.baseFont = state.axis.font;
          context.font = c.font = `${tcache.fontSize}px ${state.axis.font}`;
          context.fillStyle = c.fillStyle = state.axis.color.hex;
        }
      );

      // update text size
      const textWidthChanged = textCache(
        c => c.formatter !== formatter || fontSizeChanged || resizeTriggered,
        c => {
          c.formatter = formatter;

          const textWidth = Math.ceil(
            context.measureText(c.formatter(state.x.values[0], true)).width
          );

          c.textBaseOffsetX = Math.floor(textWidth / 2);
          c.textSteps = Math.max(canvas.width / (textWidth * 2), 1);
          c.textMinStep = (state.window.minwidth - 1) / c.textSteps;
          c.textPadding = Math.floor(c.textMinStep / 2);
        }
      );
      shouldDrawText = shouldDrawText || textWidthChanged;

      // update position
      const textPositionChanged = textCache(
        () => textWidthChanged || xBoundsChanged,
        c => {
          const textLocalStep = lcache.range / c.textSteps;

          const textMagnitude = textLocalStep / c.textMinStep;
          const textMagnitudeInteger = Math.floor(textMagnitude);
          const primary = textMagnitudeInteger % 2;

          c.textFraction = textMagnitude - textMagnitudeInteger;

          // update step
          textCache(
            cc =>
              cc.textMagnitudeInteger !== textMagnitudeInteger ||
              cc.primary !== primary,
            cc => {
              cc.textMagnitudeInteger = textMagnitudeInteger;
              cc.primary = primary;

              cc.textStep =
                Math.max(textMagnitudeInteger - primary, 1) *
                Math.ceil(cc.textMinStep);

              cc.textDoubleStep = Math.ceil(cc.textStep * 2);
            }
          );

          const textClosest =
            Math.ceil(lcache.start / c.textStep) * c.textStep - c.textStep;
          c.textStart = Math.max(textClosest, c.textStep) - c.textPadding;
          c.textLast = Math.min(
            lcache.start + lcache.range + 1,
            state.x.values.length
          );
          c.textOffsetX = lcache.offsetX - c.textBaseOffsetX;
        }
      );
      shouldDrawText = shouldDrawText || textPositionChanged;

      if (shouldDrawText) {
        const textBaseAlpha = state.axis.color.alpha;
        const bottomCorner = canvas.height - tcache.margin;

        context.clearRect(
          0,
          lcache.height,
          canvas.width,
          canvas.height - lcache.height
        );

        context.globalAlpha = textBaseAlpha;

        for (
          let i = -tcache.textPadding;
          i <= tcache.textLast;
          i += tcache.textDoubleStep
        ) {
          if (i < tcache.textStart) continue;

          const indexShift = i - lcache.start;

          context.fillText(
            formatDate(state.x.values[i], true),
            indexShift * lcache.scaleX + tcache.textOffsetX,
            bottomCorner
          );
        }

        context.globalAlpha = tcache.primary
          ? textBaseAlpha - tcache.textFraction
          : textBaseAlpha;

        for (
          let i = tcache.textStep - tcache.textPadding;
          i <= tcache.textLast;
          i += tcache.textDoubleStep
        ) {
          if (i < tcache.textStart) continue;
          const indexShift = i - lcache.start;

          context.fillText(
            formatDate(state.x.values[i], true),
            indexShift * lcache.scaleX + tcache.textOffsetX,
            bottomCorner
          );
        }
      }
    },
    register: callback => callback({ id: "view", element: canvas })
  };
};
