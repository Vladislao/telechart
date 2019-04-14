const drawHorizontalLines = (context, count, position) => {
  context.beginPath();
  const dy = -position.height / count;
  for (let i = 0; i < count; i += 1) {
    const y = position.y + i * dy + position.height;
    context.moveTo(position.x, y);
    context.lineTo(position.width, y);
  }
  context.stroke();
};

// TODO: pass formated values
const drawYText = (context, matrix, x, position, format) => {
  const end = ((matrix[2] - matrix[3]) | 0) + 1;
  for (let i = matrix[0]; i <= end; i += matrix[3]) {
    context.fillText(
      format(i, "short"),
      x,
      position.y + i * position.scaleY + position.offsetY
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

const drawStackedBar = (
  context,
  values,
  position,
  highlight,
  lighten,
  max,
  sum,
  stack,
  alpha
) => {
  const last = position.range + 1;
  const fillStyle = context.fillStyle;

  if (highlight !== null) {
    context.fillStyle = lighten;
  }

  for (let i = 0; i <= last; i += 1) {
    const index = position.start + i;
    if (index === highlight) continue;

    const total = sum[index];
    const ntotal = total / max;
    const inc = stack.first ? 0 : stack.values[index];

    const y0 = position.y + position.height * (1 - ntotal);
    const height0 = position.height * ntotal;

    const y = y0 + inc;
    const height = height0 * (values[index] / total) * alpha;

    // if (height < 1) continue;

    context.fillRect(
      position.x +
        i * position.scaleX +
        position.offsetX -
        position.scaleX / 2 -
        0.5,
      y,
      position.scaleX + 1,
      height
    );

    stack.values[index] = inc + height;
  }

  if (highlight !== null) {
    const total = sum[highlight];
    const ntotal = total / max;
    const inc = stack.first ? 0 : stack.values[highlight];

    const y0 = position.y + position.height * (1 - ntotal);
    const height0 = position.height * ntotal;

    const y = y0 + inc;
    const height = height0 * (values[highlight] / total) * alpha;

    // if (height < 1) return;

    context.fillStyle = fillStyle;

    context.fillRect(
      position.x +
        (highlight - position.start) * position.scaleX +
        position.offsetX -
        position.scaleX / 2,
      y,
      position.scaleX,
      height
    );

    stack.values[highlight] = inc + height;
  }
};

const drawBar = (context, values, position, highlight, lighten) => {
  const last = position.range + 1;
  const fillStyle = context.fillStyle;

  if (highlight !== null) {
    context.fillStyle = lighten;
  }

  for (let i = 0; i <= last; i += 1) {
    const index = position.start + i;
    if (index === highlight) continue;

    const y = position.y + values[index] * position.scaleY + position.offsetY;
    const height = position.height - y + position.y;

    if (height < 1) continue;

    context.fillRect(
      position.x +
        i * position.scaleX +
        position.offsetX -
        position.scaleX / 2 -
        0.5,
      y,
      position.scaleX + 1,
      height
    );
  }

  if (highlight !== null) {
    const y =
      position.y + values[highlight] * position.scaleY + position.offsetY;
    const height = position.height - y + position.y;

    if (height < 1) return;
    context.fillStyle = fillStyle;

    context.fillRect(
      position.x +
        (highlight - position.start) * position.scaleX +
        position.offsetX -
        position.scaleX / 2,
      y,
      position.scaleX,
      height
    );
  }
};

module.exports.drawHorizontalLines = drawHorizontalLines;
module.exports.drawVerticalLine = drawVerticalLine;
module.exports.drawPoint = drawPoint;
module.exports.drawYText = drawYText;
module.exports.drawStackedBar = drawStackedBar;
module.exports.drawBar = drawBar;
