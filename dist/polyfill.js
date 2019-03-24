(function() {
  if (!Float32Array.prototype.slice) {
    Object.defineProperty(Float32Array.prototype, "slice", {
      value: function(begin, end) {
        return new Float32Array(Array.prototype.slice.call(this, begin, end));
      }
    });
  }
})();
