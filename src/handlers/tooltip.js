const { createTooltipAnimation } = require("../animations/tooltip");

module.exports = (state, engine, render) => v => {
  // TODO: touchevent
  // TODO: cross
  let animation = null;

  const handleStart = (offsetX, targetWidth) => {
    state.tooltip.offsetX = offsetX;
    state.tooltip.targetWidth = targetWidth;

    if (animation) return;
    animation = engine.registerAnimation(
      createTooltipAnimation(state, () => {
        render();
        return true;
      })
    );
  };

  const handleCancel = () => {
    state.tooltip.offsetX = null;

    animation = engine.cancelAnimation(animation);
    engine.registerAnimation(render);
  };

  v.element.addEventListener("mouseenter", e => {
    handleStart(e.offsetX, e.target.width);
  });
  v.element.addEventListener("mousemove", e => {
    handleStart(e.offsetX, e.target.width);
  });
  v.element.addEventListener("touchstart", e => {
    const rect = e.target.getBoundingClientRect();
    handleStart(e.targetTouches[0].pageX - rect.left, e.target.width);
  });
  v.element.addEventListener("touchmove", e => {
    const rect = e.target.getBoundingClientRect();
    handleStart(e.targetTouches[0].pageX - rect.left, e.target.width);
  });
  v.element.addEventListener("mouseleave", handleCancel);
};
