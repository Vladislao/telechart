const { resize } = require("../utils/transformation");
const { drawTrack } = require("../rendering/scroll");
const drawLine = require("../rendering/line");
const createCache = require("../utils/cache");
// const { createAttributeInfo } = require("../utils/webgl");
// const createRender = require("../utils/render");

// const line = require("../rendering/line");
// const box = require("../rendering/box");

module.exports = state => {
  const canvas = document.createElement("canvas");
  canvas.className = "tc-preview";

  const context = canvas.getContext("2d");

  // const tcache = {};
  // const trackerCache = createCache(tcache);

  // const lcache = {};
  // const linesCache = createCache(lcache);

  // const scroll = state.window;
  // const tracker = scroll.tracker;
  // const mask = scroll.mask;

  const chart = {};
  const track = {};
  const previousState = { charts: {}, y: { matrix: [] }, window: {} };

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

      if (shouldDraw) {
        context.clearRect(0, 0, canvas.width, canvas.height);

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
