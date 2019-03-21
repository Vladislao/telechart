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

module.exports.colorToRgba = colorToRgba;
