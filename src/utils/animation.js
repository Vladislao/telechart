const linear = t => t;

const update = (from, to, progress) => {
  if (Array.isArray(from)) {
    return from.map((v, i) => update(v, to[i], progress));
  }
  if (typeof from === "object") {
    return Object.keys(from).reduce((acc, v) => {
      acc[v] = update(from[v], to[v], progress);
      return acc;
    }, from);
  }
  return from + (to - from) * progress;
};

const animate = (from, to, step, options) => {
  const params = Object.assign(
    {
      duration: 300,
      start: null,
      easing: linear
    },
    options
  );

  return now => {
    if (!params.start) {
      params.start = now;
      return true;
    }

    const elapsed = now - params.start;
    const progress = Math.min(
      Math.max(params.easing(elapsed / params.duration), 0),
      1
    );

    // console.log(progress);
    step(update(from, to, progress));

    return elapsed < params.duration;
  };
};

module.exports.animate = animate;
module.exports.linear = linear;
