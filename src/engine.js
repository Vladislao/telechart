let engine = null;

const isPassiveSupported = () => {
  let passiveSupported = false;
  try {
    const options = {
      get passive() {
        passiveSupported = true;
      }
    };

    window.addEventListener("test", options, options);
    window.removeEventListener("test", options, options);
  } catch (err) {
    return false;
  }
  return passiveSupported;
};

const createEventListeners = () => {
  const passiveSupported = isPassiveSupported();

  engine.passiveSupported = passiveSupported;
  engine.passive = passiveSupported ? { passive: true, capture: false } : false;

  window.addEventListener("mousedown", engine.handleEvent, engine.passive);
  window.addEventListener("mouseup", engine.handleEvent, engine.passive);
  window.addEventListener("mousemove", engine.handleEvent, engine.passive);
};

module.exports = () => {
  if (!engine) {
    engine = {
      passiveSupported: false,

      animations: [],
      listeners: {
        mousedown: [],
        mouseup: [],
        mousemove: []
      },

      handleEvent: e => {
        engine.listeners[e.type].forEach(v => v(e));
      },

      addEventListener: (type, listener) => {
        engine.listeners[type].push(listener);
      },

      removeEventListener: (type, listener) => {
        engine.listeners[type] = engine.listeners[type].filter(
          v => v !== listener
        );
      },

      registerAnimation: animation => {
        engine.animations.push(animation);

        if (engine.animations.length === 1) {
          window.requestAnimationFrame(engine.render);
        }
        return animation;
      },

      cancelAnimation: animation => {
        engine.animations = engine.animations.filter(v => v !== animation);
        return null;
      },

      render: ms => {
        // collect components that requires repainting
        const draw = [];
        let force = false;
        // run animations, filter finished ones
        engine.animations = engine.animations.filter(v => {
          draw.push(v.draw);
          force = force || v.force;
          return v.update ? v.update(ms) : false;
        });

        // TODO: very ugly, rethink
        const finished = [];
        let count = 0;
        draw.forEach(v =>
          v.forEach(component => {
            if (finished.some(c => c === component)) return;
            finished.push(component);
            component(force);
            count += 1;
          })
        );
        console.log(
          `rendering took ${performance.now() - ms}ms, ${count} repaints`
        );
        // request next frame if we have more animations to render
        if (engine.animations.length) {
          window.requestAnimationFrame(engine.render);
        }
      }
    };

    createEventListeners();
  }

  return engine;
};
