const { bound } = require("../utils/transformation");

module.exports = (context, values, position) => {
  // TODO: limits

  context.beginPath();

  const last = position.range + 1;
  for (let i = 0; i <= last; i += 1) {
    context.lineTo(
      position.x + i * position.scaleX + position.offsetX,
      position.y +
        values[position.start + i] * position.scaleY +
        position.offsetY
    );
  }

  context.stroke();
};
