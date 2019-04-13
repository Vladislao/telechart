const { bound } = require("../utils/transformation");
const {
  createScrollAnimation,
  createInspectAnimation
} = require("../animations/drag");

const determineAction = (state, offsetX, width) => {
  const scaleX = width / (state.x.values.length - 1);
  const trackerWidth = state.window.tracker.width * window.devicePixelRatio;

  const leftTrackX = state.window.offset * scaleX;
  const rightTrackX = (state.window.offset + state.window.width - 1) * scaleX;

  if (offsetX < leftTrackX || offsetX > rightTrackX) return "scroll";

  if (
    offsetX > leftTrackX + trackerWidth &&
    offsetX < rightTrackX - trackerWidth
  )
    return "drag";

  if (offsetX >= leftTrackX && offsetX <= leftTrackX + trackerWidth)
    return "resize-left";

  return "resize-right";
};

module.exports = (state, engine, render) => v => {
  // const listenerOptions = engine.passiveSupported ? { passive: true } : false;
  let event = null;
  let animation = null;

  const handleInspect = (offsetX, pageX, target) => {
    const width = target.width / window.devicePixelRatio;
    const scaleX = width / state.x.values.length;

    const inspectEvent = {
      offset: bound(
        Math.round(offsetX / scaleX - state.window.minwidth / 2),
        0,
        state.x.values.length - state.window.minwidth
      ),
      width: state.window.minwidth
    };

    engine.cancelAnimation(animation);
    animation = engine.registerAnimation(
      createInspectAnimation(state, inspectEvent, render)
    );
  };

  const handleStart = (offsetX, pageX, target) => {
    if (event) return;

    const width = target.width / window.devicePixelRatio;

    event = {
      type: determineAction(
        state,
        offsetX * window.devicePixelRatio,
        target.width
      ),
      initialPageX: pageX,
      step: state.x.values.length / width,
      pageX,
      done: false
    };

    engine.cancelAnimation(animation);
    animation = engine.registerAnimation(
      createScrollAnimation(state, event, render)
    );
  };

  const handleMove = e => {
    if (event === null) return;

    event.pageX = e.pageX;
  };

  const handleCancel = () => {
    if (!event) return;

    event.done = true;
    event = null;
  };

  v.element.addEventListener(
    "mousedown",
    e => {
      e.preventDefault();
      handleStart(e.offsetX, e.pageX, e.target);
    },
    false
  );

  v.element.addEventListener(
    "dblclick",
    e => {
      e.preventDefault();
      handleInspect(e.offsetX, e.pageX, e.target);
    },
    false
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
