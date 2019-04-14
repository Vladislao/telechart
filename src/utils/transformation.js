const segmentTree = require("./segmentTree");

// const PREFERED_STEPS = [1, 1.5, 2, 2.5, 5, 7.5, 10];

// const findScale = (min, max, count) => {
//   const range = max - min;

//   const roughStep = range / (count - 1);
//   const stepPower = Math.pow(10, -Math.floor(Math.log10(Math.abs(roughStep))));
//   const normalizedStep = roughStep * stepPower;

//   const preferedStep = PREFERED_STEPS.find(v => v >= normalizedStep);
//   const step = Math.round(preferedStep / stepPower);

//   const bot = Math.floor(min / step) * step;
//   const top = Math.ceil(max / step) * step;

//   return [bot, top - bot, top, step];
// };

const findScale = (min, max, count) => {
  const range = max - min;
  const roughStep = range / count;
  const stepPower = Math.pow(10, Math.floor(Math.log10(Math.abs(roughStep))));

  const normalizedStep = (roughStep / stepPower) * 10;
  const preferedStep =
    Math.max(normalizedStep, Math.ceil(normalizedStep / 5) * 5) / 10;

  const step = preferedStep * stepPower;

  const bot = min;
  const top = bot + step * count;

  return [bot, top - bot, top, step];
};

const findSum = state => {
  const length = state.x.values.length;
  const result = new Array(length);

  const idsCount = state.ids.length;

  for (let i = 0; i < length; i++) {
    let sum = 0;
    for (let j = 0; j < idsCount; j++) {
      const chart = state.charts[state.ids[j]];
      if (chart.disabled) continue;
      sum += chart.values[i];
    }
    result[i] = sum;
  }

  return result;
};

const findMinmax = (state, from, to) => {
  return state.ids.reduce(
    (acc, v) => {
      const chart = state.charts[v];
      if (chart.disabled) return acc;

      const local = segmentTree.find(chart.mmtree, from, to);

      acc[0] = Math.min(acc[0], local[0]);
      acc[1] = Math.max(acc[1], local[1]);
      return acc;
    },
    [Infinity, -Infinity]
  );
};

const findScaledY = (mmtree, from, to, count) => {
  const minmax = segmentTree.find(mmtree, from, to);
  return findScale(minmax[0], minmax[1], count);
};

const findMatrix = (state, from, to) => {
  const linesCount = state.grid.lines;

  if (state.y_scaled && state.ids.length === 2) {
    const first = state.charts[state.ids[0]];
    const second = state.charts[state.ids[1]];
    return [
      findScaledY(first.mmtree, from, to, linesCount),
      findScaledY(second.mmtree, from, to, linesCount)
    ];
  }

  if (state.stacked) {
    return findScaledY(state.y.mmtree, from, to, linesCount);
  }

  const minmax = findMinmax(state, from, to);
  return findScale(minmax[0], minmax[1], linesCount);
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

const formatDate = (v, mode) => {
  const datetime = new Date(v);
  const date = datetime.getDate();
  const month = datetime.getMonth();

  if (mode === "short")
    return `${MONTH[month]} ${date > 9 ? date : `0${date}`}`;
  if (mode === "date")
    return `${date} ${MONTH[month]} ${datetime.getFullYear()}`;

  return `${DAY[datetime.getDay()]}, ${date > 9 ? date : `0${date}`} ${
    MONTH[month]
  } ${datetime.getFullYear()}`;
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

  const displayWidth = Math.floor(canvas.clientWidth * realToCSSPixels);
  const displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);

  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    return true;
  }

  return false;
};

module.exports.formatDate = formatDate;
module.exports.formatValue = formatValue;
module.exports.findMatrix = findMatrix;
module.exports.findSum = findSum;
module.exports.closest = closest;
module.exports.bound = bound;
module.exports.resize = resize;
