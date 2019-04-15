const {
  createHideAnimation,
  createShowAnimation
} = require("../animations/toggle");

module.exports = (state, engine, render) => v => {
  const chart = state.charts[v.id];
  let animation = null;

  v.element.addEventListener("animationend", () => {
    v.element.classList.remove("apply-shake");
  });

  v.element.addEventListener("click", () => {
    const chartsVisible = state.ids.reduce(
      (acc, id) => acc + (state.charts[id].disabled ? 0 : 1),
      0
    );

    if (!chart.disabled && chartsVisible < 2) {
      v.element.classList.add("apply-shake");
      return;
    }

    engine.cancelAnimation(animation);
    chart.disabled = !chart.disabled;

    if (chart.disabled) {
      v.element.classList.remove("tc-checked");
      animation = engine.registerAnimation(
        createHideAnimation(state, chart, render)
      );
    } else {
      v.element.classList.add("tc-checked");
      animation = engine.registerAnimation(
        createShowAnimation(state, chart, render)
      );
    }
  });
};
