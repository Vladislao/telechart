module.exports = state => {
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  if (!gl) {
    throw "webgl is not supported";
  }

  return canvas;
};
