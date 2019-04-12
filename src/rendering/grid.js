const drawHorizontalLines = (context, matrix, position, width, yshift) => {
  context.beginPath();
  for (let i = matrix[0]; i <= matrix[2]; i += matrix[3]) {
    const ylineh = i * position.scaleY + position.offsetY - yshift;
    context.moveTo(0, ylineh);
    context.lineTo(width, ylineh);
  }
  context.stroke();
};

module.exports.drawHorizontalLines = drawHorizontalLines;
