const {
  createHideAnimation,
  createShowAnimation
} = require("../animations/toggle");

module.exports = (state, engine, render) => v => {
  const chart = state.charts[v.id];
  let animation = null;
  v.element.addEventListener("click", () => {
    // state.toggles[v.id] = !state.toggles[v.id];
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
