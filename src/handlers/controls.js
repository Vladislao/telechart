const { createToggleAnimation } = require("../animations/toggle");

const getChartsVisible = state => {
  return state.ids.reduce(
    (acc, v) => acc + (state.charts[v].disabled ? 0 : 1),
    0
  );
};

module.exports = (state, engine, render) => wrapper => {
  let animation = null;

  const handleToggleOne = controller => {
    const chart = state.charts[controller.id];
    const chartsVisible = getChartsVisible(state);

    if (!chart.disabled && chartsVisible < 2) {
      controller.element.classList.add("apply-shake");
      return;
    }

    engine.cancelAnimation(animation);
    chart.disabled = !chart.disabled;

    if (chart.disabled) {
      controller.element.classList.remove("tc-checked");
      animation = engine.registerAnimation(
        createToggleAnimation(state, render)
      );
    } else {
      controller.element.classList.add("tc-checked");
      animation = engine.registerAnimation(
        createToggleAnimation(state, render)
      );
    }
  };

  const handleToggleAll = controller => {
    engine.cancelAnimation(animation);

    const chart = state.charts[controller.id];
    const chartsVisible = getChartsVisible(state);

    if (!chart.disabled && chartsVisible < 2) {
      // check all when long pressing single checked filter
      state.ids.forEach(v => {
        state.charts[v].disabled = false;
      });
      wrapper.controls.forEach(v => {
        v.element.classList.add("tc-checked");
      });
      animation = engine.registerAnimation(
        createToggleAnimation(state, render, true)
      );
    } else {
      state.ids.forEach(v => {
        state.charts[v].disabled = v !== controller.id;
      });
      wrapper.controls.forEach(v => {
        if (v !== controller) {
          v.element.classList.remove("tc-checked");
        } else {
          v.element.classList.add("tc-checked");
        }
      });
      animation = engine.registerAnimation(
        createToggleAnimation(state, render)
      );
    }
  };

  let timeout = null;
  const handleLongPress = c => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      handleToggleAll(c);
      timeout = null;
    }, 1000);
  };

  const handleSimplePress = c => {
    if (!timeout) return;

    clearTimeout(timeout);
    handleToggleOne(c);
  };

  wrapper.controls.forEach(c => {
    c.element.addEventListener("animationend", () => {
      c.element.classList.remove("apply-shake");
    });

    c.element.addEventListener(
      "touchstart",
      () => {
        handleLongPress(c);
      },
      engine.passive
    );
    c.element.addEventListener("touchend", e => {
      e.preventDefault();
      handleSimplePress(c);
    });
    c.element.addEventListener("touchcancel", e => {
      e.preventDefault();
      handleSimplePress(c);
    });
    c.element.addEventListener(
      "mousedown",
      () => {
        handleLongPress(c);
      },
      engine.passive
    );
    c.element.addEventListener(
      "mouseup",
      () => {
        handleSimplePress(c);
      },
      engine.passive
    );
  });
};
