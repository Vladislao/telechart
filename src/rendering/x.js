module.exports = (state, context, cache, modes) => {
  const { chart, text } = cache;

  if (cache.mode & (modes.FORCE | modes.XBOUNDS)) {
    cache.mode |= modes.TEXT;

    const steps = chart.range / text.steps;
    const magnitude = steps / text.minstep;
    const magnitudeI = Math.floor(magnitude);
    const primary = magnitudeI % 2;

    text.fraction = magnitude - magnitudeI;
    if (text.magnitudeI !== magnitudeI || text.primary !== primary) {
      text.magnitudeI = magnitudeI;
      text.primary = primary;

      text.step = Math.max(magnitudeI - primary, 1) * Math.ceil(text.minstep);
      text.doublestep = Math.ceil(text.step * 2);
    }

    const closest = Math.ceil(chart.start / text.step) * text.step - text.step;

    text.start = Math.max(closest, text.step) - text.padding;
    text.last = Math.min(chart.start + chart.range + 1, state.x.values.length);
  }

  if (cache.mode & modes.TEXT) {
    context.clearRect(
      text.region.x,
      text.region.y,
      text.region.width,
      text.region.height
    );

    const alpha = state.axis.color.alpha;

    context.font = text.font;
    context.fillStyle = state.axis.color.hex;
    context.globalAlpha = alpha;

    for (let i = -text.padding; i < text.last; i += text.doublestep) {
      if (i < text.start) continue;

      const shift = i - chart.start;

      context.fillText(
        cache.formatX(state.x.values[i], "short"),
        shift * chart.scaleX + chart.offsetX + text.offsetX,
        text.y + text.offsetY
      );
    }

    context.globalAlpha = text.primary ? alpha - text.fraction : alpha;

    for (
      let i = text.step - text.padding;
      i < text.last;
      i += text.doublestep
    ) {
      if (i < text.start) continue;
      const shift = i - chart.start;

      context.fillText(
        cache.formatX(state.x.values[i], "short"),
        shift * chart.scaleX + chart.offsetX + text.offsetX,
        text.y + text.offsetY
      );
    }
  }
};
