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
  context.lineTo(x, position.height);
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

const yPercentage = (result, index, value, alpha, position, options) => {
  const total = options.sum[index];
  const height = position.height * (value / total) * alpha;

  let y = position.y + position.height - height;

  if (options.stacked) {
    const inc = options.first ? 0 : options.stack[index];
    y -= inc;
    options.stack[index] = inc + height;
  }

  result[0] = y;
  result[1] = height;
  // return result;
};

const yStacked = (result, index, value, alpha, position, options) => {
  // TODO: improve

  const total = options.sum[index];
  const ntotal = total / options.matrix[2];
  const inc = options.first ? 0 : options.stack[index];

  const y0 = position.y + position.height * (1 - ntotal);
  const height0 = position.height * ntotal;

  const y = y0 + inc;

  const height = height0 * (value / total) * alpha;
  options.stack[index] = inc + height;

  result[0] = y;
  result[1] = height;
  // return result;
};

const yBasic = (result, value, position) => {
  const y = position.y + value * position.scaleY + position.offsetY;
  const height = position.height - y + position.y;

  result[0] = y;
  result[1] = height;
  // return result;
};

const drawArea = (context, values, position, options) => {
  const alpha = context.globalAlpha;
  // to avoid GC, probably unnecessary
  const y = new Array(2);

  context.beginPath();

  if (!options.first && options.stacked) {
    for (let i = position.range; i >= 0; i--) {
      const index = position.start + i;

      const xb = position.x + i * position.scaleX + position.offsetX;
      const yb = position.y + position.height - options.stack[index];

      context.lineTo(xb, yb);
    }
  }

  for (let i = 0; i <= position.range; i += 1) {
    const index = position.start + i;

    const x = position.x + i * position.scaleX + position.offsetX;

    if (options.percentage) {
      yPercentage(y, index, values[index], alpha, position, options);
    } else if (options.stacked) {
      yStacked(y, index, values[index], alpha, position, options);
    } else {
      yBasic(y, values[index], position);
    }

    if (position.limit.bottom) {
      const y0 = y[0];
      y[0] = y0 < position.limit.bottom ? y0 : position.limit.bottom;
    }

    context.lineTo(x, y[0]);
  }

  if (options.first || !options.stacked) {
    context.lineTo(position.width, position.y + position.height);
    context.lineTo(position.x, position.y + position.height);
  }

  context.fill();
};

const drawLine = (context, values, position, stroke, options) => {
  const alpha = context.globalAlpha;

  context.beginPath();

  const last = position.range + 1;

  // to avoid GC, probably unnecessary
  const y = new Array(2);

  for (let i = 0; i <= last; i += 1) {
    const index = position.start + i;

    const x = position.x + i * position.scaleX + position.offsetX;

    if (options.percentage) {
      yPercentage(y, index, values[index], alpha, position, options);
    } else if (options.stacked) {
      yStacked(y, index, values[index], alpha, position, options);
    } else {
      yBasic(y, values[index], position);
    }

    if (position.limit.bottom) {
      const y0 = y[0];
      y[0] = y0 < position.limit.bottom ? y0 : position.limit.bottom;
    }

    context.lineTo(x, y[0]);
  }

  context.stroke();
};

const drawBar = (context, values, position, options, lighten) => {
  const fillStyle = context.fillStyle;
  const alpha = context.globalAlpha;

  const highlight = options.tooltip.indexD;
  if (highlight != null) {
    context.fillStyle = lighten;
  }

  context.beginPath();

  const last = position.range + 1;
  const y = new Array(2);
  for (let i = 0; i <= last; i += 1) {
    const index = position.start + i;
    if (index === highlight) continue;

    const x =
      position.x + i * position.scaleX + position.offsetX - position.scaleX / 2;
    const width = position.scaleX;

    if (options.percentage) {
      yPercentage(y, index, values[index], alpha, position, options);
    } else if (options.stacked) {
      yStacked(y, index, values[index], alpha, position, options);
    } else {
      yBasic(y, values[index], position);
    }

    context.rect(x, y[0], width, y[1]);
  }

  context.fill();

  if (highlight != null) {
    const i = highlight - position.start;
    const x =
      position.x + i * position.scaleX + position.offsetX - position.scaleX / 2;
    const width = position.scaleX;

    if (options.percentage) {
      yPercentage(y, highlight, values[highlight], alpha, position, options);
    } else if (options.stacked) {
      yStacked(y, highlight, values[highlight], alpha, position, options);
    } else {
      yBasic(y, values[highlight], position);
    }

    context.fillStyle = fillStyle;
    context.fillRect(x, y[0], width, y[1]);
  }
};

module.exports.drawHorizontalLines = drawHorizontalLines;
module.exports.drawVerticalLine = drawVerticalLine;
module.exports.drawPoint = drawPoint;
module.exports.drawYText = drawYText;

module.exports.drawArea = drawArea;
module.exports.drawLine = drawLine;
module.exports.drawBar = drawBar;
