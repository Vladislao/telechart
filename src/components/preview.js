const { resize } = require("../utils/transformation");
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

      const scaleX = canvas.width / state.x.matrix[1];
      const offsetX = -state.x.matrix[0] * scaleX;

      const scaleY = -canvas.height / state.y.matrix[1];
      const offsetY = canvas.height - state.y.matrix[0] * scaleY;

      state.ids.forEach(v => {
        const chart = state.charts[v];

        if (chart.color.alpha === 0) return;

        context.globalAlpha = chart.color.alpha;
        context.strokeStyle = chart.color.hex;

        context.beginPath();
        context.lineJoin = "bevel";
        context.lineCap = "butt";

        context.moveTo(0, chart.values[0] * scaleY + offsetY);

        for (let i = 1; i < state.x.values.length; i += 1) {
          context.lineTo(
            state.x.values[i] * scaleX + offsetX,
            chart.values[i] * scaleY + offsetY
          );
        }

        context.stroke();
      });
    },
    register: callback => callback({ id: "preview", element: canvas })
  };
};
