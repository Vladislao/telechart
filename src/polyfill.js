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
  _define(Math, "log2", function(x) {
    return Math.log(x) * Math.LOG2E;
  });
  _define(Array.prototype, "fill", function fill(value) {
    var start;
    if (arguments.length > 1) {
      start = arguments[1];
    }
    var end;
    if (arguments.length > 2) {
      end = arguments[2];
    }
    var list = Object(this);
    var len = list.length;
    start = start || 0;
    end = end || 0;

    var relativeStart =
      start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
    var relativeEnd = end < 0 ? len + end : end;

    for (var i = relativeStart; i < len && i < relativeEnd; ++i) {
      list[i] = value;
    }
    return list;
  });
  _define(Array.prototype, "find", function(predicate) {
    if (typeof predicate !== "function") {
      throw new TypeError("Array#find: predicate must be a function");
    }
    var list = Object(this);
    var length = list.length;
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
