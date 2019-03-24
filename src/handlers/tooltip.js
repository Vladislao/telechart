const { createTooltipAnimation } = require("../animations/tooltip");

module.exports = (state, engine, render) => v => {
  // TODO: touchevent
  // TODO: cross
  let animation = null;

  const handleMouseEvent = e => {
    state.tooltip.offsetX = e.offsetX;
    state.tooltip.targetWidth = e.target.width;

    if (animation) return;
    animation = engine.registerAnimation(
      createTooltipAnimation(state, () => {
        render();
        return true;
      })
    );
  };

  v.element.addEventListener("mouseenter", handleMouseEvent);
  v.element.addEventListener("mousemove", handleMouseEvent);
  v.element.addEventListener("mouseleave", () => {
    state.tooltip.offsetX = null;

    animation = engine.cancelAnimation(animation);
    engine.registerAnimation(render);
  });
};
