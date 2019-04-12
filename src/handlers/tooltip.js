const { createTooltipAnimation } = require("../animations/tooltip");

module.exports = (state, engine, render) => v => {
  let animation = null;
  let event = null;

  const handleStart = (offsetX, width) => {
    if (event) return;

    event = {
      offsetX,
      step: state.window.width / width,
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
    if (event) handleMove(e.offsetX);
    else handleStart(e.offsetX, e.target.offsetWidth);
  });
  v.element.addEventListener(
    "mouseenter",
    e => {
      if (e.target !== v.canvas) return;
      handleStart(e.offsetX, e.target.offsetWidth);
    },
    engine.passive
  );
  v.element.addEventListener(
    "mouseleave",
    e => {
      // if (e.target !== v.canvas) return;
      handleCancel();
    },
    engine.passive
  );
};

// const handleStart = (offsetX, targetWidth) => {
//   state.tooltip.offsetX = offsetX;
//   state.tooltip.targetWidth = targetWidth;

//   if (animation) return;
//   animation = engine.registerAnimation(
//     createTooltipAnimation(state, () => {
//       render();
//       return true;
//     })
//   );
// };

// const handleCancel = () => {
//   state.tooltip.offsetX = null;

//   animation = engine.cancelAnimation(animation);
//   engine.registerAnimation(render);
// };

// v.element.addEventListener("mouseenter", e => {
//   handleStart(e.offsetX, e.target.width);
// });
// v.element.addEventListener("mousemove", e => {
//   handleStart(e.offsetX, e.target.width);
// });
// v.element.addEventListener("touchstart", e => {
//   const rect = e.target.getBoundingClientRect();
//   handleStart(e.targetTouches[0].pageX - rect.left, e.target.width);
// });
// v.element.addEventListener("touchmove", e => {
//   const rect = e.target.getBoundingClientRect();
//   handleStart(e.targetTouches[0].pageX - rect.left, e.target.width);
// });
// v.element.addEventListener("mouseleave", handleCancel);
