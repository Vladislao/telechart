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

  v.element.addEventListener("mousedown", e => {
    const offset = (e.offsetX / e.target.width) * window.devicePixelRatio;
    const createPreviewAnimation = determineAnimation(state, offset);

    if (!createPreviewAnimation) {
      handleCancel();
      return;
    }

    if (animation) return;

    state.window.offsetX = e.offsetX;
    state.window.targetWidth = e.target.width;

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
  });

  v.element.addEventListener("mousemove", e => {
    if (!animation) return;

    state.window.offsetX = e.offsetX;
    state.window.targetWidth = e.target.width;
  });

  v.element.addEventListener("mouseleave", handleCancel);
  v.element.addEventListener("mouseup", handleCancel);
};
