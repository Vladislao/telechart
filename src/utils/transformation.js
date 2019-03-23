const colorToRgba = color => {
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

  return [red / 255, green / 255, blue / 255, 1];
};

const min = arr => {
  if (!arr.length) return arr;

  if (arr[0].length) return Math.min.apply(null, arr.map(v => min(v)));
  return Math.min.apply(null, arr);
};

const max = arr => {
  if (!arr.length) return arr;

  if (arr[0].length) return Math.max.apply(null, arr.map(v => max(v)));
  return Math.max.apply(null, arr);
};

const minmax = arr => ({ min: min(arr), max: max(arr) });

module.exports.colorToRgba = colorToRgba;
module.exports.minmax = minmax;
