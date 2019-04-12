const { bound } = require("../utils/transformation");

module.exports = (context, values, position, borders) => {
  const border = borders || {};

  context.beginPath();

  const last = position.range + 1;
  for (let i = 0; i <= last; i += 1) {
    context.lineTo(
      i * position.scaleX + position.offsetX,
      Math.min(
        values[position.start + i] * position.scaleY + position.offsetY,
        position.borderBottom
      )
    );
  }

  context.stroke();
};
