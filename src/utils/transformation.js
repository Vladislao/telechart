const segmentTree = require("./segmentTree");

const PREFERED_STEPS = [1, 1.5, 2, 2.5, 5, 7.5, 10];

const findScale = (min, max, count) => {
  console.log(min, max, count);
  const range = max - min;

  const roughStep = range / (count - 1);
  const stepPower = Math.pow(10, -Math.floor(Math.log10(Math.abs(roughStep))));
  const normalizedStep = roughStep * stepPower;

  const preferedStep = PREFERED_STEPS.find(v => v >= normalizedStep);
  const step = Math.round(preferedStep / stepPower);

  const bot = Math.floor(min / step) * step;
  const top = Math.ceil(max / step) * step;

  return [bot, top - bot, top, step];
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

const formatValue = v => {
  const abs = Math.abs(v);

  if (abs > 999999999) return (v / 1000000000).toFixed(2).trim + "B";
  if (abs > 999999) return (v / 1000000).toFixed(2) + "M";
  if (abs > 999) return (v / 1000).toFixed(1) + "K";

  return v.toFixed(0);
};

const closest = (target, offset) =>
  Math.max(Math.min(Math.round((target - 1) * offset), target - 1), 0);

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
module.exports.formatValue = formatValue;
module.exports.minmax = minmax;
module.exports.closest = closest;
module.exports.bound = bound;
module.exports.resize = resize;
module.exports.findScale = findScale;
