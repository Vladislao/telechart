const { bound } = require("../utils/transformation");
const {
  createScrollAnimation,
  createInspectAnimation
} = require("../animations/drag");

const determineAction = (state, offsetX, width, mobile) => {
  const scaleX = width / (state.x.values.length - 1);
  // make life easier for mobile devices
  const trackerWidth = state.window.tracker.width * (mobile ? 3 : 1);

  const leftTrackX =
    state.window.offset * scaleX - (mobile ? state.window.tracker.width : 0);
  const rightTrackX =
    (state.window.offset + state.window.width - 1) * scaleX +
    (mobile ? state.window.tracker.width : 0);

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

  const handleInspect = (offsetX, width) => {
    const scaleX = width / state.x.values.length;

    const action = determineAction(state, offsetX, width);

    let inspectEvent;
    if (action === "resize-left") {
      inspectEvent = {
        offset: 0,
        width: state.window.offset + state.window.width
      };
    } else if (action === "resize-right") {
      inspectEvent = {
        offset: state.window.offset,
        width: state.x.values.length - state.window.offset
      };
    } else {
      inspectEvent = {
        offset: bound(
          Math.round(offsetX / scaleX - state.window.minwidth / 2),
          0,
          state.x.values.length - state.window.minwidth
        ),
        width: state.window.minwidth
      };
    }

    engine.cancelAnimation(animation);
    animation = engine.registerAnimation(
      createInspectAnimation(state, inspectEvent, render)
    );
  };

  const handleStart = (offsetX, pageX, width) => {
    if (event) return;
    event = {
      type: determineAction(state, offsetX, width, engine.mobile),
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

  const handleMove = pageX => {
    if (event === null) return;
    event.pageX = pageX;
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

      handleStart(
        e.pageX - v.bounds.left,
        e.pageX,
        v.bounds.right - v.bounds.left
      );
    },
    false
  );

  v.element.addEventListener(
    "touchstart",
    e => {
      e.preventDefault();
      const pageX = e.targetTouches[0].pageX;
      handleStart(pageX - v.bounds.left, pageX, v.bounds.right - v.bounds.left);
    },
    false
  );

  v.element.addEventListener(
    "dblclick",
    e => {
      e.preventDefault();
      handleInspect(e.pageX - v.bounds.left, v.bounds.right - v.bounds.left);
    },
    false
  );

  v.element.addEventListener(
    "touchstart",
    e => {
      e.preventDefault();
      const pageX = e.targetTouches[0].pageX;
      handleStart(pageX - v.bounds.left, pageX, v.bounds.right - v.bounds.left);
    },
    false
  );

  engine.addEventListener("mousemove", e => {
    if (!event) return;
    handleMove(e.pageX);
  });
  engine.addEventListener("touchmove", e => {
    if (!event) return;
    handleMove(e.targetTouches[0].pageX);
  });

  engine.addEventListener("mouseup", handleCancel);
  engine.addEventListener("touchcancel", handleCancel);
  engine.addEventListener("touchend", handleCancel);

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
