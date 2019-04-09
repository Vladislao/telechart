/* eslint-disable */
(function() {
  var _call = Function.call.bind(Function.call);
  var _supportsDescriptors = !!Object.defineProperty;
  var _define = function(object, name, value) {
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

  _define(Object, "assign", function(target) {
    if (target === "undefined" || target === null) {
      throw new TypeError("target must be an object");
    }

    var objTarget = Object(target);
    var s, source, i, props, value, key;
    for (s = 1; s < arguments.length; ++s) {
      source = Object(arguments[s]);
      props = Object.keys(source);
      for (i = 0; i < props.length; ++i) {
        key = props[i];
        value = source[key];
        if (source.propertyIsEnumerable(key)) {
          objTarget[key] = value;
        }
      }
    }
    return objTarget;
  });
  _define(Math, "log10", function(x) {
    return Math.log(x) * Math.LOG10E;
  });
  _define(Array.prototype, "find", function(predicate) {
    if (typeof predicate !== "function") {
      throw new TypeError("Array#find: predicate must be a function");
    }
    var list = Object(this);
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
})();
