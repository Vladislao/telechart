const { resize } = require("../utils/transformation");
// const { createAttributeInfo } = require("../utils/webgl");
// const createRender = require("../utils/render");

// const line = require("../rendering/line");
// const vertical = require("../rendering/vertical");
// const horizontal = require("../rendering/horizontal");
// const point = require("../rendering/point");

module.exports = state => {
  const canvas = document.createElement("canvas");
  canvas.className = "tc-chart";

  const context = canvas.getContext("2d");

  return {
    element: canvas,
    render: () => {
      resize(canvas);

      context.clearRect(0, 0, canvas.width, canvas.height);

      const offset = Math.floor(state.window.offset);
      const width = Math.floor(state.window.width);

      const start = Math.max(offset, 0);
      const end = Math.min(offset + width, state.x.values.length);
      const range = end - start;

      const scaleX = canvas.width / range;
      const offsetX = -scaleX * (state.window.offset - offset);

      const scaleY = -canvas.height / state.y0.matrix[1];
      const offsetY = canvas.height - state.y0.matrix[0] * scaleY;

      context.lineJoin = "bevel";
      context.lineCap = "butt";
      context.lineWidth = 1 * window.devicePixelRatio;

      state.ids.forEach(v => {
        const chart = state.charts[v];

        if (chart.color.alpha === 0) return;

        context.globalAlpha = chart.color.alpha;
        context.strokeStyle = chart.color.hex;

        context.beginPath();
        context.moveTo(offsetX, chart.values[start] * scaleY + offsetY);

        for (let i = 1; i < end; i += 1) {
          context.lineTo(
            i * scaleX + offsetX,
            chart.values[start + i] * scaleY + offsetY
          );
        }

        context.stroke();
      });
    },
    register: callback => callback({ id: "view", element: canvas })
  };
};
