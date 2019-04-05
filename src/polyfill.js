/* eslint-disable */
(function() {
  if (!Float32Array.prototype.slice) {
    Object.defineProperty(Float32Array.prototype, "slice", {
      value: function(begin, end) {
        return new Float32Array(Array.prototype.slice.call(this, begin, end));
      }
    });
  }
  if (!Math.log10) {
    Math.log10 = function(x) {
      return Math.log(x) * Math.LOG10E;
    };
  }
})();
