const drawHorizontalLines = (context, matrix, position) => {
  context.beginPath();
  for (let i = matrix[0]; i <= matrix[2]; i += matrix[3]) {
    const y = position.y + i * position.scaleY + position.offsetY;
    context.moveTo(position.x, y);
    context.lineTo(position.width, y);
  }
  context.stroke();
};

// TODO: pass formated values
const drawYText = (context, matrix, x, position, format) => {
  for (let i = matrix[0]; i <= matrix[2]; i += matrix[3]) {
    context.fillText(
      format(i, "short"),
      x,
      position.y +
        i * position.scaleY +
        position.offsetY -
        position.lineWidth -
        position.lineWidth
    );
  }
};

const drawVerticalLine = (context, x, position) => {
  context.beginPath();
  context.moveTo(x, position.region.y);
  context.lineTo(x, position.region.height);
  context.stroke();
};

const drawPoint = (context, x, y, radius) => {
  context.beginPath();
  context.arc(x, y, radius + 1, 0, 2 * Math.PI);
  context.stroke();

  const previous = context.globalCompositeOperation;
  context.globalCompositeOperation = "destination-out";

  context.beginPath();
  context.arc(x, y, radius - 1, 0, 2 * Math.PI);
  context.fill();
  context.globalCompositeOperation = previous;
};

const drawBar = (context, values, position) => {
  const last = position.range + 1;
  console.log(position);
  for (let i = 0; i <= last; i += 1) {
    const y =
      position.y +
      values[position.start + i] * position.scaleY +
      position.offsetY;
    const height = position.height - y + position.y;

    if (height < 1) continue;

    context.fillRect(
      position.x + i * position.scaleX + position.offsetX - position.scaleX / 2,
      y,
      position.scaleX + 1,
      height
    );
    // context.lineTo(
    //   position.x + i * position.scaleX + position.offsetX,
    //   position.y +
    //     values[position.start + i] * position.scaleY +
    //     position.offsetY
    // );
  }
};

module.exports.drawHorizontalLines = drawHorizontalLines;
module.exports.drawVerticalLine = drawVerticalLine;
module.exports.drawPoint = drawPoint;
module.exports.drawYText = drawYText;
module.exports.drawBar = drawBar;
