const segmentTree = require("./segmentTree");

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

const minmax = (state, from, to) => {
  return state.ids.reduce(
    (acc, v) => {
      const chart = state.charts[v];
      if (chart.disabled) return acc;

      const local = segmentTree.find(
        chart.mmtree,
        from,
        to,
        chart.values.length
      );

      acc[0] = Math.min(acc[0], local[0]);
      acc[1] = Math.max(acc[1], local[1]);
      return acc;
    },
    [Infinity, -Infinity]
  );
};

const MONTH = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatDate = (v, short) => {
  const datetime = new Date(v);
  const date = datetime.getDate();
  const month = `${MONTH[datetime.getMonth()]} ${date > 9 ? date : `0${date}`}`;
  if (short) return month;

  return `${DAY[datetime.getDay()]}, ${month}`;
};

const formatValue = v => {};

const closest = (target, offset) =>
  Math.max(Math.min(Math.round((target - 1) * offset), target - 1), 0);

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

const resize = canvas => {
  const realToCSSPixels = window.devicePixelRatio;

  // Lookup the size the browser is displaying the canvas in CSS pixels
  // and compute a size needed to make our drawingbuffer match it in
  // device pixels.
  const displayWidth = Math.floor(canvas.clientWidth * realToCSSPixels);
  const displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);

  // Check if the canvas is not the same size.
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    return true;
  }

  return false;
};

module.exports.formatDate = formatDate;
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
