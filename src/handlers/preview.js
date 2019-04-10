const { createMinmaxAnimation } = require("../animations/common");
const {
  createDragAnimation,
  createWResizeAnimation,
  createEResizeAnimation
} = require("../animations/drag");

const determineAnimation = (state, offset) => {
  if (
    offset < state.window.offset ||
    offset > state.window.offset + state.window.width
  )
    return null;
  if (
    offset > state.window.offset + 0.02 &&
    offset < state.window.offset + state.window.width - 0.02
  )
    return createDragAnimation;

  if (offset <= state.window.offset + 0.02) return createWResizeAnimation;

  return createEResizeAnimation;
};

module.exports = (state, engine, render) => v => {
  let event = null;
  let animation = null;
  // let initialPageX = null;
  // let step = null;

  const handleStart = (pageX, target) => {
    if (event) return;

    event = {
      initialPageX: pageX,
      step: (window.devicePixelRatio * state.x.values.length) / target.width,
      pageX
    };

    animation = engine.registerAnimation(
      createWResizeAnimation(state, event, render)
    );
  };

  const handleMove = e => {
    if (event === null) return;

    event.pageX = e.pageX;
    // if (state.window.index !==)
  };

  const handleCancel = () => {
    if (!event) return;

    event = null;
    animation = engine.cancelAnimation(animation);
  };

  v.element.addEventListener(
    "mousedown",
    e => {
      handleStart(e.pageX, e.target);
    },
    engine.passiveSupported ? { passive: true } : false
  );

  engine.addEventListener("mousemove", handleMove);
  engine.addEventListener("mouseup", handleCancel);

  // v.element.addEventListener(
  //   "touchstart",
  //   e => {
  //     const rect = e.target.getBoundingClientRect();
  //     const offsetX = e.targetTouches[0].pageX - rect.left;
  //     handleStart(offsetX, e.target.width);
  //   },
  //   engine.passiveSupported ? { passive: true } : false
  // );

  // v.element.addEventListener("touchmove", e => {
  //   if (!animation) return;

  //   const rect = e.target.getBoundingClientRect();

  //   state.window.offsetX = e.targetTouches[0].pageX - rect.left;
  //   state.window.targetWidth = e.target.width;
  // });
  // v.element.addEventListener("mousemove", e => {
  //   if (!animation) return;

  //   state.window.offsetX = e.offsetX;
  //   state.window.targetWidth = e.target.width;
  // });

  // v.element.addEventListener("mouseleave", handleCancel);
  // v.element.addEventListener("mouseup", handleCancel);
  // v.element.addEventListener("touchcancel", handleCancel);
  // v.element.addEventListener("touchend", handleCancel);
};
