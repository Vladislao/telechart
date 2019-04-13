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

  const tcache = {};
  const trackerCache = createCache(tcache);

  const lcache = {};
  const linesCache = createCache(lcache);

  const scroll = state.window;
  const tracker = scroll.tracker;
  const mask = scroll.mask;

  let resizedOnce = false;

  return {
    element: canvas,
    render: () => {
      if (!resizedOnce) {
        resize(canvas);
        resizedOnce = true;
      }

      let shouldDraw = false;

      const trackerSizeChanged = trackerCache(
        c => c._trackerW !== tracker.width,
        c => {
          c._trackerW = tracker.width;

          c.trackerW = c._trackerW * window.devicePixelRatio;
          c.padding = 1 * window.devicePixelRatio;
          c.borderRadius = 5 * window.devicePixelRatio;
        }
      );
      shouldDraw = shouldDraw || trackerSizeChanged;

      const length = state.x.values.length - 1;
      const xBoundsChanged = linesCache(
        c => c.range !== length,
        c => {
          c.start = 0;
          c.range = length;

          c.scaleX = canvas.width / c.range;
          c.offsetX = 0;
        }
      );
      shouldDraw = shouldDraw || xBoundsChanged;

      const yBoundsChanged = linesCache(
        c => c.ymin !== state.y.matrix[0] || c.yrange !== state.y.matrix[1],
        c => {
          c.ymin = state.y.matrix[0];
          c.yrange = state.y.matrix[1];

          c.scaleY = -(canvas.height - tcache.padding * 2) / state.y.matrix[1];
          c.offsetY =
            canvas.height - state.y.matrix[0] * c.scaleY - tcache.padding;
          c.borderBottom = canvas.height;
        }
      );
      shouldDraw = shouldDraw || yBoundsChanged;

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
      shouldDraw = shouldDraw || colorsChanged;

      const trackerPositionChanged = trackerCache(
        c =>
          c.scrollOffset !== scroll.offset ||
          c.scrollWidth !== scroll.width ||
          trackerSizeChanged ||
          xBoundsChanged,
        c => {
          c.scrollOffset = scroll.offset;
          c.scrollWidth = scroll.width;

          c.left = c.scrollOffset * lcache.scaleX + c.trackerW;
          c.right =
            (c.scrollOffset + c.scrollWidth - 1) * lcache.scaleX - c.trackerW;
        }
      );
      shouldDraw = shouldDraw || trackerPositionChanged;

      if (shouldDraw) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.lineJoin = "bevel";
        context.lineCap = "butt";
        context.lineWidth = state.y.lineWidth * window.devicePixelRatio;

        state.ids.forEach(v => {
          const chart = state.charts[v];

          if (chart.color.alpha === 0) return;

          context.globalAlpha = chart.color.alpha;
          context.strokeStyle = chart.color.hex;

          drawLine(context, chart.values, lcache);
        });

        context.globalAlpha = mask.color.alpha;
        context.fillStyle = mask.color.hex;

        context.fillRect(
          0,
          tcache.padding,
          tcache.left,
          canvas.height - tcache.padding * 2
        );

        if (tcache.right !== canvas.width) {
          context.fillRect(
            tcache.right,
            tcache.padding,
            canvas.width - tcache.right,
            canvas.height - tcache.padding * 2
          );
        }

        context.globalAlpha = tracker.color.alpha;
        context.fillStyle = tracker.color.hex;

        drawTrack(
          context,
          tcache.left,
          tcache.trackerW,
          canvas.height,
          tcache.borderRadius,
          1
        );
        drawTrack(
          context,
          tcache.right,
          -tcache.trackerW,
          canvas.height,
          tcache.borderRadius,
          -1
        );

        context.fillRect(
          tcache.left,
          0,
          tcache.right - tcache.left,
          tcache.padding
        );
        context.fillRect(
          tcache.left,
          canvas.height - tcache.padding,
          tcache.right - tcache.left,
          tcache.padding
        );
      }
    },
    register: callback => callback({ id: "preview", element: canvas })
  };
};
