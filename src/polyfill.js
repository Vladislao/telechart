/* eslint-disable */
(function() {
  var _call = Function.call.bind(Function.call);
  var _supportsDescriptors = !!Object.defineProperty;
  var defineProperty = function(object, name, value) {
    if (name in object) {
      return;
    }
    if (_supportsDescriptors) {
      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: value
      });
    } else {
      object[name] = value;
    }
  };

  defineProperty(Math, "log10", function(x) {
    return Math.log(x) * Math.LOG10E;
  });
  defineProperty(Array.prototype, "find", function(predicate) {
    if (typeof predicate === "function") {
      throw new TypeError("Array#find: predicate must be a function");
    }
    var list = this;
    var length = this.length;
    var thisArg = arguments.length > 1 ? arguments[1] : null;
    for (var i = 0, value; i < length; i++) {
      value = list[i];
      if (thisArg) {
        if (_call(predicate, thisArg, value, i, list)) {
          return value;
        }
      } else if (predicate(value, i, list)) {
        return value;
      }
    }
  });
  defineProperty(Float32Array.prototype, "slice", function(begin, end) {
    return new Float32Array(Array.prototype.slice.call(this, begin, end));
  });
})();
