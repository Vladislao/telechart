const { resize, formatDate } = require("../utils/transformation");
const createCache = require("../utils/cache");

module.exports = state => {
  const canvas = document.createElement("canvas");
  canvas.className = "tc-chart";

  const context = canvas.getContext("2d");

  const lcache = createCache();

  return {
    element: canvas,
    render: () => {
      const resizeTriggered = resize(canvas);

      const lc = lcache(
        c =>
          c.offset !== state.window.offset ||
          c.width !== state.window.width ||
          c.length !== state.x.values.length ||
          resizeTriggered,
        c => {
          c.length = state.x.values.length;
          c.offset = state.window.offset;
          c.width = state.window.width;

          // c.range = Math.floor(state.window.width) - 1;
          // c.offsetDelta = state.window.offset - c.offset;
          // c.widthDelta = state.window.width - c.width;

          // const end = c.offset + c.width;
        }
      );

      const offset = Math.floor(lc.offset);
      const width = Math.floor(lc.width);

      const textMargin = 2 * window.devicePixelRatio;
      const textSize = (state.axis.size || 10) * window.devicePixelRatio;
      const padding = textSize + textMargin * 2;

      const height = canvas.height - padding;

      const end = offset + width;
      const range = end - offset - 1;
      const last = range + 2;

      const scaleX = canvas.width / (range + state.window.width - width);
      const offsetX = -scaleX * (state.window.offset - offset);

      const scaleY = -height / state.y0.matrix[1];
      const offsetY = height - state.y0.matrix[0] * scaleY;

      // draw lines
      context.clearRect(0, 0, canvas.width, canvas.height);

      context.lineJoin = "bevel";
      context.lineCap = "butt";
      context.lineWidth = 1 * window.devicePixelRatio;

      state.ids.forEach(v => {
        const chart = state.charts[v];

        if (chart.color.alpha === 0) return;

        context.globalAlpha = chart.color.alpha;
        context.strokeStyle = chart.color.hex;

        context.beginPath();

        for (let i = 0; i < last; i += 1) {
          context.lineTo(
            i * scaleX + offsetX,
            chart.values[offset + i] * scaleY + offsetY
          );
        }

        context.stroke();
      });

      // draw bottom text

      context.font = `${state.axis.size * devicePixelRatio}px ${
        state.axis.font
      }`;
      context.fillStyle = state.axis.color.hex;

      // ширина текста в пикселях
      const textWidth = Math.ceil(
        context.measureText(formatDate(state.x.values[0], true)).width
      );

      const textSteps =
        state.axis.steps || Math.max(canvas.width / (textWidth * 2), 1);

      // минимально возможный шаг
      const textMinStep = (state.window.minwidth - 1) / textSteps;
      // текущий шаг
      const textLocalStep = range / textSteps;

      // отношение к минимальному шагу
      const textMagnitude = textLocalStep / textMinStep;
      // целая часть множителя
      const textMagnitudeInteger = Math.floor(textMagnitude);
      // дробная часть множителя
      const textFraction = textMagnitude - textMagnitudeInteger;
      // четность множителя
      const primary = textMagnitudeInteger % 2;

      // оптимальный текущий шаг
      const textStep =
        Math.max(textMagnitudeInteger - primary, 1) * Math.ceil(textMinStep);

      const textPadding = Math.floor(textMinStep / 2);
      const textDoubleStep = Math.ceil(textStep * 2);

      // ближайший справа к первому на графике индекс кратный шагу
      const textClosest = Math.ceil(offset / textStep) * textStep;
      // индекс первого элемента с датой
      const textStart = Math.max(textClosest, textStep) - textPadding;

      // конечный элемент
      const textLast = offset + last;

      // сдвиг
      const textOffsetX = offsetX - Math.floor(textWidth / 2);

      const textBaseAlpha = state.axis.color.alpha;
      const bottomCorner = canvas.height - textMargin;

      context.globalAlpha = textBaseAlpha;

      for (let i = -textPadding; i <= textLast; i += textDoubleStep) {
        if (i < textStart) continue;

        const indexShift = i - offset;

        context.fillText(
          formatDate(state.x.values[i], true),
          indexShift * scaleX + textOffsetX,
          bottomCorner
        );
      }

      context.globalAlpha = primary
        ? textBaseAlpha - textFraction
        : textBaseAlpha;

      for (let i = textStep - textPadding; i <= textLast; i += textDoubleStep) {
        if (i < textStart) continue;
        const indexShift = i - offset;

        context.fillText(
          formatDate(state.x.values[i], true),
          indexShift * scaleX + textOffsetX,
          bottomCorner
        );
      }
    },
    register: callback => callback({ id: "view", element: canvas })
  };
};
