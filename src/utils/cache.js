module.exports = initialCache => {
  const cache = initialCache || {};

  return (invalidate, update) => {
    if (typeof invalidate === "function" ? invalidate(cache) : !!invalidate) {
      update(cache);
      return true;
    }

    return false;
  };
};
