const update = (from, to) => {
  for (let i = 0; i < to.length; i++) {
    to[i] = from[i];
  }
};

module.exports = () => {
  let input;
  let output;

  return function cached() {
    let cachehit = false;

    if (input === undefined) {
      input = new Array(arguments.length);
    } else {
      cachehit = input.every((v, i) => arguments[i] === v);
    }

    if (cachehit) return output;

    output = func.apply(null, arguments);
    update(arguments, input);

    return output;
  };
};
