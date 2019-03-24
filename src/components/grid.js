const { resize } = require("../utils/transformation");

module.exports = (state, options) => {
  const element = document.createElement("canvas");
  element.className = "tc-grid";

  const ctx = element.getContext("2d");
  if (!ctx) throw "2d context is not supported!";

  const params = Object.assign(
    {
      fontSize: 24,
      fontFamily: "Roboto, sans-serif",
      color: "#98A4AB"
    },
    options
  );

  const render = () => {
    resize(ctx);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.font = `${params.fontSize}px ${params.fontFamily}`;
    ctx.fillStyle = params.color;

    // const height = ctx.canvas.height / window.devicePixelRatio;
    state.minmax.y0.steps.forEach(v => {
      var y = ctx.canvas.height - ctx.canvas.height * v.point - 4;

      // if (y < params.fontSize) {
      //   y += params.fontSize + 4;
      // }

      ctx.fillText(v.value, 0, y);
    });
  };

  return {
    element,
    render,
    registerEvent: callback => callback({ id: "grid", element })
  };
};
