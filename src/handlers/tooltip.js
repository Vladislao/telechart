const { createTooltipAnimation } = require("../animations/tooltip");

module.exports = (state, engine, render) => v => {
  let animation = null;
  let event = null;

  const handleStart = (offsetX, width) => {
    if (event) return;

    const windowWidth =
      state.window.widthD === undefined
        ? state.window.width | 0
        : state.window.widthD;

    event = {
      offsetX,
      step: windowWidth / width,
      done: false
    };

    engine.cancelAnimation(animation);
    animation = engine.registerAnimation(
      createTooltipAnimation(state, event, render)
    );
  };

  const handleCancel = () => {
    if (!event) return;

    event.done = true;
    event = null;
  };

  const handleMove = offsetX => {
    if (!event) return;
    event.offsetX = offsetX;
  };

  engine.addEventListener("mousemove", e => {
    if (e.target !== v.canvas) return;

    const offsetX = e.pageX - v.bounds.left;

    if (event) handleMove(offsetX);
    else handleStart(offsetX, v.bounds.right - v.bounds.left);
  });
  engine.addEventListener("touchstart", e => {
    if (e.target !== v.canvas) {
      handleCancel();
    } else {
      const pageX = e.targetTouches[0].pageX;
      const offsetX = pageX - v.bounds.left;

      if (event) {
        handleMove(offsetX);
      } else {
        handleStart(offsetX, v.bounds.right - v.bounds.left);
      }
    }
  });
  v.element.addEventListener(
    "mouseenter",
    e => {
      if (e.target !== v.canvas) return;
      handleStart(e.pageX - v.bounds.left, v.bounds.right - v.bounds.left);
    },
    engine.passive
  );
  v.element.addEventListener(
    "mouseleave",
    () => {
      handleCancel();
    },
    engine.passive
  );
};
