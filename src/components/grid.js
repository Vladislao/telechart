const {
  resize,
  closest,
  translate,
  preferedXSteps,
  findScale
} = require("../utils/transformation");

module.exports = (state, options) => {
  const element = document.createElement("canvas");
  element.className = "tc-grid";

  const ctx = element.getContext("2d");
  if (!ctx) throw new Error("2d context is not supported!");

  const params = Object.assign(
    {
      fontSize: 12,
      fontFamily: "Roboto, sans-serif",
      color: "#98A4AB"
    },
    options
  );

  const render = () => {
    resize(ctx);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.font = `${params.fontSize * window.devicePixelRatio}px ${
      params.fontFamily
    }`;
    ctx.fillStyle = params.color;

    const height = ctx.canvas.height - 40;
    state.minmax.y0.steps.forEach(v => {
      const y = height - height * v.point - 4;
      ctx.fillText(v.value, 0, y);
    });

    const start = closest(state.columns.x, state.window.offset);
    const end = closest(
      state.columns.x,
      state.window.width + state.window.offset
    );

    const borderStart = closest(state.columns.x, 0.03);
    const borderEnd = closest(state.columns.x, 0.97);
    const scale = findScale(start, end, 6, preferedXSteps);

    for (
      let i = Math.max(scale.min, borderStart);
      i < Math.min(scale.max, borderEnd);
      i += scale.step
    ) {
      const value = state.columns.x[i];

      const dx = translate(
        value,
        state.minmax.x.max,
        state.minmax.x.min,
        state.window.offset,
        state.window.width
      );

      const fvalue = new Date(value).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short"
      });
      const measure = ctx.measureText(fvalue);
      const x = ctx.canvas.width * dx - measure.width / 2;
      ctx.fillText(fvalue, x, ctx.canvas.height);
    }
  };

  return {
    element,
    render,
    registerEvent: callback => callback({ id: "grid", element })
  };
};
