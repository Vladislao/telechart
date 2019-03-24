const {
  createHideAnimation,
  createShowAnimation
} = require("../animations/toggle");

module.exports = (state, engine, render) => v => {
  v.element.addEventListener("click", () => {
    state.toggles[v.id] = !state.toggles[v.id];

    if (state.toggles[v.id]) {
      v.element.classList.add("tc-checked");
      engine.registerAnimation(createShowAnimation(v.id, state, render));
    } else {
      v.element.classList.remove("tc-checked");
      engine.registerAnimation(createHideAnimation(v.id, state, render));
    }
  });
};
