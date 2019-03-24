const colorToRgba = (color, opacity) => {
  if (~color.indexOf("rgba")) {
    return color
      .replace("rgba(", "")
      .split(",")
      .map(v => parseInt(v, 10) / 255);
  }

  const hex = color.substring(1);

  const num = parseInt(hex, 16);
  const red = num >> 16;
  const green = (num >> 8) & 255;
  const blue = num & 255;

  if (!opacity && opacity !== 0) opacity = 1;

  return [red / 255, green / 255, blue / 255, opacity];
};

const findMin = arr => {
  if (!arr.length) return arr;

  if (arr[0].length) return Math.min.apply(null, arr.map(v => findMin(v)));
  return Math.min.apply(null, arr);
};

const findMax = arr => {
  if (!arr.length) return arr;

  if (arr[0].length) return Math.max.apply(null, arr.map(v => findMax(v)));
  return Math.max.apply(null, arr);
};

const preferedSteps = [1, 1.5, 2, 2.5, 5, 7.5, 10];
const findScale = (min, max, count) => {
  const range = max - min;

  const roughStep = range / (count - 1);
  const stepPower = Math.pow(10, -Math.floor(Math.log10(Math.abs(roughStep))));
  const normalizedStep = roughStep * stepPower;

  const preferedStep = preferedSteps.find(v => v >= normalizedStep);
  const step = +(preferedStep / stepPower).toPrecision(5);

  return {
    min: Math.floor(min / step) * step,
    max: Math.ceil(max / step) * step,
    step,
    count
  };
};

const expandSteps = (min, max, step, count) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    const value = min + step * i;
    result.push({
      value: value,
      point: translate(value, max, min, 0, 1)
    });
  }
  return result;
};

const minmax = arr => {
  const min = findMin(arr);
  const max = findMax(arr);
  const scale = findScale(min, max, 7);
  const steps = expandSteps(scale.min, scale.max, scale.step, 7);

  return {
    min: min,
    max: max,
    scale,
    steps
  };
};

const closest = (arr, offset) =>
  Math.max(Math.min(Math.round(arr.length * offset), arr.length), 1) - 1;

const translate = (v, max, min, offset, width) =>
  ((v - min) / (max - min) - offset) / width;

const expandRectangle = (a, b, c, d) => [a, b, c, c, d, a];

const expandCircle = count => {
  const x = [0];
  const y = [0];

  for (i = 0; i <= count; i++) {
    x.push(Math.cos((i * 2 * Math.PI) / count));
    y.push(Math.sin((i * 2 * Math.PI) / count));
  }
  return { x, y };
};

const ratio = (a, b, width, height) => [a / width, b / height];

const bound = (x, lower, upper) => Math.max(Math.min(x, upper), lower);

const resize = gl => {
  var realToCSSPixels = window.devicePixelRatio;

  // Lookup the size the browser is displaying the canvas in CSS pixels
  // and compute a size needed to make our drawingbuffer match it in
  // device pixels.
  var displayWidth = Math.floor(gl.canvas.clientWidth * realToCSSPixels);
  var displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels);

  // Check if the canvas is not the same size.
  if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
    // Make the canvas the same size
    gl.canvas.width = displayWidth;
    gl.canvas.height = displayHeight;
  }
};

module.exports.colorToRgba = colorToRgba;
module.exports.minmax = minmax;
module.exports.translate = translate;
module.exports.expandRectangle = expandRectangle;
module.exports.expandCircle = expandCircle;
module.exports.closest = closest;
module.exports.ratio = ratio;
module.exports.bound = bound;
module.exports.resize = resize;
