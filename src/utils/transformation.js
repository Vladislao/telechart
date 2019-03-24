const colorToRgba = (color, opacity) => {
  if (color.indexOf("rgba") >= 0) {
    return color
      .replace("rgba(", "")
      .split(",")
      .map(v => parseInt(v, 10) / 255);
  }

  const hex = color.substring(1);

  const num = parseInt(hex, 16);
  // eslint-disable-next-line no-bitwise
  const red = num >> 16;
  // eslint-disable-next-line no-bitwise
  const green = (num >> 8) & 255;
  // eslint-disable-next-line no-bitwise
  const blue = num & 255;

  if (!opacity && opacity !== 0) opacity = 1;

  return [red / 255, green / 255, blue / 255, opacity];
};

const findMin = (arr, start, end) => {
  if (!arr.length) return arr;

  if (arr[0].length)
    return Math.min.apply(null, arr.map(v => findMin(v, start, end)));
  return Math.min.apply(null, arr.slice(start || 0, end || arr.length));
};

const findMax = (arr, start, end) => {
  if (!arr.length) return arr;

  if (arr[0].length)
    return Math.max.apply(null, arr.map(v => findMax(v, start, end)));
  return Math.max.apply(null, arr.slice(start || 0, end || arr.length));
};

const preferedYSteps = [1, 1.5, 2, 2.5, 5, 7.5, 10];
const preferedXSteps = [1, 2, 3, 5, 7, 10, 11, 14, 15, 30];

const findScale = (min, max, count, preference) => {
  const range = max - min;

  const roughStep = range / (count - 1);
  const stepPower = Math.pow(10, -Math.floor(Math.log10(Math.abs(roughStep))));
  const normalizedStep = roughStep * stepPower;

  const preferedStep = preference.find(v => v >= normalizedStep);
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
      value,
      point: translate(value, max, min, 0, 1)
    });
  }
  return result;
};

const minmax = (arr, start, end) => {
  const min = findMin(arr, start, end);
  const max = findMax(arr, start, end);
  const scale = findScale(min, max, 7, preferedYSteps);
  const steps = expandSteps(scale.min, scale.max, scale.step, 7);

  return {
    min,
    max,
    scale,
    steps
  };
};

const closest = (arr, offset) =>
  Math.max(Math.min(Math.round((arr.length - 1) * offset), arr.length - 1), 0);

const translate = (v, max, min, offset, width) =>
  ((v - min) / (max - min) - offset) / width;

const expandRectangle = (a, b, c, d) => [a, b, c, c, d, a];

const expandCircle = count => {
  const x = [0];
  const y = [0];

  for (let i = 0; i <= count; i++) {
    x.push(Math.cos((i * 2 * Math.PI) / count));
    y.push(Math.sin((i * 2 * Math.PI) / count));
  }
  return { x, y };
};

const ratio = (a, b, width, height) => [a / width, b / height];

const bound = (x, lower, upper) => Math.max(Math.min(x, upper), lower);

const resize = gl => {
  const realToCSSPixels = window.devicePixelRatio;

  // Lookup the size the browser is displaying the canvas in CSS pixels
  // and compute a size needed to make our drawingbuffer match it in
  // device pixels.
  const displayWidth = Math.floor(gl.canvas.clientWidth * realToCSSPixels);
  const displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels);

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
module.exports.findScale = findScale;
module.exports.expandSteps = expandSteps;
module.exports.preferedXSteps = preferedXSteps;
module.exports.preferedYSteps = preferedYSteps;
