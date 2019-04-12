const drawHorizontalLines = (context, matrix, position, width, yshift) => {
  context.beginPath();
  for (let i = matrix[0]; i <= matrix[2]; i += matrix[3]) {
    const ylineh = i * position.scaleY + position.offsetY - yshift;
    context.moveTo(0, ylineh);
    context.lineTo(width, ylineh);
  }
  context.stroke();
};

const drawVerticalLine = (context, left, height) => {
  context.beginPath();
  context.moveTo(left, 0);
  context.lineTo(left, height);
  context.stroke();
};

const drawPoint = (context, x, y, radius) => {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.stroke();

  const previous = context.globalCompositeOperation;
  context.globalCompositeOperation = "destination-out";

  context.beginPath();
  context.arc(x, y, radius - 1, 0, 2 * Math.PI);
  context.fill();
  context.globalCompositeOperation = previous;
};

module.exports.drawHorizontalLines = drawHorizontalLines;
module.exports.drawVerticalLine = drawVerticalLine;
module.exports.drawPoint = drawPoint;
