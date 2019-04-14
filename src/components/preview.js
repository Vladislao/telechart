const { resize } = require("../utils/transformation");
const { drawTrack } = require("../rendering/scroll");
const drawLine = require("../rendering/line");
const { drawBar } = require("../rendering/grid");

module.exports = state => {
  const canvas = document.createElement("canvas");
  canvas.className = "tc-preview";

  const context = canvas.getContext("2d");

  const chart = {};
  const track = {};
  const previousState = { charts: {}, y: {}, window: {} };

  const cache = {
    chart,
    track,
    state: previousState
  };

  return {
    element: canvas,
    render: force => {
      let shouldDraw = force;

      if (force) {
        resize(canvas);

        const dpr = window.devicePixelRatio;

        // track
        track.padding = 1 * dpr;
        track.borderRadius = 5 * dpr;
        track.width = (state.window.tracker.width || 10) * dpr;

        // chart
        chart.lineWidth = state.y.lineWidth * dpr;
        chart.width = canvas.width;
        chart.height = canvas.height - track.padding * 2;

        chart.x = 0;
        chart.y = track.padding;

        chart.region = {
          x: 0,
          y: 0,
          width: canvas.width,
          height: canvas.height
        };

        chart.start = 0;
        chart.range = state.x.values.length;

        chart.scaleX = canvas.width / chart.range;
        chart.offsetX = 0;
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
          shouldDraw = true;
        }
      }

      if (
        force ||
        previousState.window.offset !== state.window.offset ||
        previousState.window.width !== state.window.width
      ) {
        previousState.window.offset = state.window.offset;
        previousState.window.width = state.window.width;

        track.left = state.window.offset * chart.scaleX + track.width;
        track.right =
          (state.window.offset + state.window.width) * chart.scaleX -
          track.width;

        shouldDraw = true;
      }

      if (state.y_scaled) {
        if (!previousState.y.matrix) {
          previousState.y.matrix = [[-1, -1], [-1, -1]];
        }

        if (
          force ||
          previousState.y.matrix[0][0] !== state.y.matrix[0][0] ||
          previousState.y.matrix[0][1] !== state.y.matrix[0][1]
        ) {
          previousState.y.matrix[0][0] = state.y.matrix[0][0];
          previousState.y.matrix[0][1] = state.y.matrix[0][1];

          chart.scaleY0 = -chart.height / state.y.matrix[0][1];
          chart.offsetY0 = chart.height - state.y.matrix[0][0] * chart.scaleY0;

          shouldDraw = true;
        }

        if (
          force ||
          previousState.y.matrix[1][0] !== state.y.matrix[1][0] ||
          previousState.y.matrix[1][1] !== state.y.matrix[1][1]
        ) {
          previousState.y.matrix[1][0] = state.y.matrix[1][0];
          previousState.y.matrix[1][1] = state.y.matrix[1][1];

          chart.scaleY1 = -chart.height / state.y.matrix[1][1];
          chart.offsetY1 = chart.height - state.y.matrix[1][0] * chart.scaleY1;

          shouldDraw = true;
        }
      } else {
        if (!previousState.y.matrix) {
          previousState.y.matrix = [-1, -1];
        }

        if (
          force ||
          previousState.y.matrix[0] !== state.y.matrix[0] ||
          previousState.y.matrix[1] !== state.y.matrix[1]
        ) {
          previousState.y.matrix[0] = state.y.matrix[0];
          previousState.y.matrix[1] = state.y.matrix[1];

          chart.scaleY = -chart.height / state.y.matrix[1];
          chart.offsetY = chart.height - state.y.matrix[0] * chart.scaleY;

          shouldDraw = true;
        }
      }

      if (shouldDraw) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.lineJoin = "bevel";
        context.lineCap = "butt";
        context.lineWidth = chart.lineWidth;

        if (state.y_scaled) {
          for (let i = 0; i < 2; i++) {
            const v = state.ids[i];
            const line = state.charts[v];

            if (line.color.alpha === 0) continue;

            context.globalAlpha = line.color.alpha;
            context.strokeStyle = line.color.hex;

            chart.scaleY = chart[`scaleY${i}`];
            chart.offsetY = chart[`offsetY${i}`];
            drawLine(context, line.values, chart);
          }
        } else {
          for (let i = 0; i < state.ids.length; i++) {
            const v = state.ids[i];
            const line = state.charts[v];

            if (line.color.alpha === 0) continue;

            context.globalAlpha = line.color.alpha;
            context.strokeStyle = line.color.hex;

            if (line.type === "bar") {
              context.fillStyle = line.color.hex;
              drawBar(context, line.values, chart);
            } else {
              context.strokeStyle = line.color.hex;
              drawLine(context, line.values, chart);
            }
          }
        }

        context.globalAlpha = state.window.mask.color.alpha;
        context.fillStyle = state.window.mask.color.hex;

        context.fillRect(chart.x, chart.y, track.left, chart.height);

        if (track.right !== canvas.width) {
          context.fillRect(
            track.right,
            chart.y,
            canvas.width - track.right,
            chart.height
          );
        }

        context.globalAlpha = state.window.tracker.color.alpha;
        context.fillStyle = state.window.tracker.color.hex;

        drawTrack(
          context,
          track.left,
          track.width,
          canvas.height,
          track.borderRadius,
          1
        );
        drawTrack(
          context,
          track.right,
          -track.width,
          canvas.height,
          track.borderRadius,
          -1
        );

        context.fillRect(
          track.left,
          0,
          track.right - track.left,
          track.padding
        );
        context.fillRect(
          track.left,
          canvas.height - track.padding,
          track.right - track.left,
          track.padding
        );
      }
    },
    register: callback => callback({ id: "preview", element: canvas })
  };
};
