module.exports = initialCache => {
  const cache = initialCache || {};
  cache.__hit = false;

  return (invalidate, update) => {
    if (invalidate(cache)) {
      cache.__hit = false;
      update(cache);
      return cache;
    }

    cache.__hit = true;
    return cache;
  };
};
