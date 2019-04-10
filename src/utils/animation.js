const linear = t => t;
const easeInOutCubic = t =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
const easeOutCubic = t => --t * t * t + 1;
const easeInOutQuad = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

const update = (state, from, to, progress) => {
  if (Array.isArray(from)) {
    from.forEach((v, i) => {
      state[i] = update(state[i], v, to[i], progress);
    });
    return state;
  }
  if (typeof from === "object") {
    return Object.keys(from).reduce((acc, v) => {
      acc[v] = update(state[v], from[v], to[v], progress);
      return acc;
    }, state);
  }
  if (typeof from === "boolean") {
    return progress === 1 ? to : from;
  }
  return from + (to - from) * progress;
};

const clone = from => {
  if (Array.isArray(from)) {
    return from.map(v => clone(v));
  }
  if (typeof from === "object") {
    return Object.keys(from).reduce((acc, v) => {
      acc[v] = clone(from[v]);
      return acc;
    }, {});
  }
  return from;
};

const animate = (from, to, step, options) => {
  const params = Object.assign(
    {
      delay: 0,
      duration: 300,
      start: null,
      easing: linear
    },
    options
  );

  const state = clone(from);

  return now => {
    if (!params.start) {
      params.start = now;
      return true;
    }

    const elapsed = now - params.start;

    if (elapsed < params.delay) {
      return true;
    }

    const finished = elapsed >= params.duration;

    const progress = finished
      ? 1
      : Math.min(Math.max(params.easing(elapsed / params.duration), 0), 1);

    step(update(state, from, to, progress));

    return finished === false;
  };
};

module.exports.animate = animate;
module.exports.linear = linear;
module.exports.easeInOutCubic = easeInOutCubic;
module.exports.easeOutCubic = easeOutCubic;
module.exports.easeInOutQuad = easeInOutQuad;
