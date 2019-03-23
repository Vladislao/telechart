var engine = null;

module.exports = () => {
  if (!engine) {
    engine = {
      animations: [],

      registerAnimation: animation => {
        engine.animations.push(animation);

        if (engine.animations.length === 1) {
          window.requestAnimationFrame(engine.render);
        }
        return animation;
      },

      cancelAnimation: animation => {
        engine.animations = engine.animations.filter(v => v !== animation);
        return animation;
      },

      render: ms => {
        engine.animations = engine.animations.filter(v => v(ms));

        if (engine.animations.length) {
          window.requestAnimationFrame(engine.render);
        }
      }
    };
  }

  return engine;
};
