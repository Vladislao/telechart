module.exports = initialCache => {
  const cache = initialCache || {};

  return (invalidate, update) => {
    if (!invalidate || invalidate(cache)) {
      update(cache);
      return true;
    }

    return false;
  };
};
