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
  let animation = null;

  const handleCancel = () => {
    if (!animation) return;

    animation = engine.cancelAnimation(animation);
    engine.registerAnimation(createMinmaxAnimation(state, render));
  };

  const handleStart = (offsetX, targetWidth) => {
    if (animation) return;

    const offset = (offsetX / targetWidth) * window.devicePixelRatio;
    const createPreviewAnimation = determineAnimation(state, offset);

    if (!createPreviewAnimation) {
      // handleCancel();
      return;
    }

    state.window.offsetX = offsetX;
    state.window.targetWidth = targetWidth;

    animation = engine.registerAnimation(
      createPreviewAnimation(
        state,
        {
          offset: state.window.offset,
          width: state.window.width,
          position: offset
        },
        () => {
          render();
          return true;
        }
      )
    );
  };

  v.element.addEventListener("mousedown", e => {
    handleStart(e.offsetX, e.target.width);
  });
  v.element.addEventListener("touchstart", e => {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.targetTouches[0].pageX - rect.left;
    handleStart(offsetX, e.target.width);
  });

  v.element.addEventListener("touchmove", e => {
    if (!animation) return;

    const rect = e.target.getBoundingClientRect();

    state.window.offsetX = e.targetTouches[0].pageX - rect.left;
    state.window.targetWidth = e.target.width;
  });
  v.element.addEventListener("mousemove", e => {
    if (!animation) return;

    state.window.offsetX = e.offsetX;
    state.window.targetWidth = e.target.width;
  });

  v.element.addEventListener("mouseleave", handleCancel);
  v.element.addEventListener("mouseup", handleCancel);
  v.element.addEventListener("touchcancel", handleCancel);
  v.element.addEventListener("touchend", handleCancel);
};
