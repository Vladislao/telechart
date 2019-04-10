const { resize } = require("../utils/transformation");
const { track } = require("../rendering/scroll");
// const { createAttributeInfo } = require("../utils/webgl");
// const createRender = require("../utils/render");

// const line = require("../rendering/line");
// const box = require("../rendering/box");

module.exports = state => {
  const canvas = document.createElement("canvas");
  canvas.className = "tc-preview";

  const context = canvas.getContext("2d");

  return {
    element: canvas,
    render: () => {
      resize(canvas);

      context.clearRect(0, 0, canvas.width, canvas.height);

      const tracker = state.window.tracker;

      const trackerWidth = tracker.width * window.devicePixelRatio;
      const paddingHeight = 1 * window.devicePixelRatio;

      const height = canvas.height;
      const width = canvas.width;

      const scaleX = width / state.x.matrix[1];
      const offsetX = 0;

      const scaleY = -(height - paddingHeight * 2) / state.y.matrix[1];
      const offsetY = height - state.y.matrix[0] * scaleY - paddingHeight;

      context.lineWidth = 1 * window.devicePixelRatio;
      context.lineJoin = "bevel";
      context.lineCap = "butt";

      // render line charts
      state.ids.forEach(v => {
        const chart = state.charts[v];

        if (chart.color.alpha === 0) return;

        context.globalAlpha = chart.color.alpha;
        context.strokeStyle = chart.color.hex;

        context.beginPath();

        context.moveTo(offsetX, chart.values[0] * scaleY + offsetY);

        for (let i = 1; i < state.x.values.length; i += 1) {
          context.lineTo(
            i * scaleX + offsetX,
            chart.values[i] * scaleY + offsetY
          );
        }

        context.stroke();
      });

      // render scroller

      // TODO: options

      const borderRadius = 5 * window.devicePixelRatio;
      const leftTrackX = state.window.offset * scaleX + trackerWidth;
      const rightTrackX =
        (state.window.offset + state.window.width - 1) * scaleX - trackerWidth;

      const mask = state.window.mask;
      context.globalAlpha = mask.color.alpha;
      context.strokeStyle = mask.color.hex;
      context.fillStyle = mask.color.hex;

      context.fillRect(
        0,
        paddingHeight,
        leftTrackX,
        height - paddingHeight * 2
      );
      if (rightTrackX !== canvas.width) {
        context.fillRect(
          rightTrackX,
          paddingHeight,
          width - rightTrackX,
          height - paddingHeight * 2
        );
      }

      context.globalAlpha = tracker.color.alpha;
      context.strokeStyle = tracker.color.hex;
      context.fillStyle = tracker.color.hex;

      track(context, leftTrackX, trackerWidth, height, borderRadius, 1);
      track(context, rightTrackX, -trackerWidth, height, borderRadius, -1);
      context.fillRect(leftTrackX, 0, rightTrackX - leftTrackX, paddingHeight);
      context.fillRect(
        leftTrackX,
        height - paddingHeight,
        rightTrackX - leftTrackX,
        paddingHeight
      );
    },
    register: callback => callback({ id: "preview", element: canvas })
  };
};
