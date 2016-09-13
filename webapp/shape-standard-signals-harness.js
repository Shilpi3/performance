(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (target) {
  if (typeof Object.assign == 'function') {
    return Object.assign.apply(Object, arguments);
  }

  target = Object(target);
  for (var index = 1; index < arguments.length; index++) {
    var source = arguments[index];
    if (source != null) {
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
  }
  return target;
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decode = decode;
exports.encode = encode;
var RFC4648_ALPHABET = exports.RFC4648_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var RFC4648_URL_ALPHABET = exports.RFC4648_URL_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=';

// input : String
// alphabet: String?
// output: Array<UInt8>
function decode(input, alphabet) {
  // todo: if missing == on end, should we auto-pad?
  var i;
  alphabet = alphabet == null ? RFC4648_URL_ALPHABET : alphabet;

  var codeMap = {};
  for (i = 0; i < alphabet.length; ++i) {
    codeMap[alphabet[i]] = i;
  }

  var output = [];

  var length = input.length;

  var in1, in2, in3, in4, out1, out2, out3;

  for (i = 0; i < length; i += 4) {
    in1 = codeMap[input[i]];
    in2 = codeMap[input[i + 1]];
    in3 = codeMap[input[i + 2]];
    in4 = codeMap[input[i + 3]];

    if (in3 === 64 && in4 !== 64) {
      throw new Error('The string to be decoded is not correctly padded.');
    }

    out1 = in1 << 2 | in2 >> 4;
    out2 = (in2 & 0x0F) << 4 | in3 >> 2;
    out3 = (in3 & 0x03) << 6 | in4;

    output.push(out1);

    if (in3 !== 64 && i + 2 < length) {
      // pad = 1 or pad = 2
      output.push(out2);
    }
    if (in4 !== 64 && i + 3 < length) {
      // pad = 2
      output.push(out3);
    }
  }

  return output;
}

// input : Array<UInt8> | UInt8Array
// alphabet : String?
// output: String
function encode(input, alphabet) {
  alphabet = alphabet == null ? RFC4648_URL_ALPHABET : alphabet;
  var output = '';
  var pad = input.length % 3;

  var length = input.length - pad; // dealing with padding outside of the while loop
  var in1, in2, in3, out1, out2, out3, out4;

  var i;

  for (i = 0; i < length; i += 3) {
    in1 = input[i];
    in2 = input[i + 1];
    in3 = input[i + 2];

    out1 = in1 >> 2;
    out2 = (in1 & 0x03) << 4 | in2 >> 4;
    out3 = (in2 & 0x0F) << 2 | in3 >> 6;
    out4 = in3 & 0x3F;

    output += alphabet.charAt(out1) + alphabet.charAt(out2) + alphabet.charAt(out3) + alphabet.charAt(out4);
  }

  if (pad === 2) {
    in1 = input[i];
    in2 = input[i + 1];

    out1 = in1 >> 2;
    out2 = (in1 & 0x03) << 4 | in2 >> 4;
    out3 = (in2 & 0x0F) << 2;

    output += alphabet.charAt(out1) + alphabet.charAt(out2) + alphabet.charAt(out3);
  } else if (pad === 1) {
    in1 = input[i];

    out1 = in1 >> 2;
    out2 = (in1 & 0x03) << 4;
    output += alphabet.charAt(out1) + alphabet.charAt(out2);
  }

  return output;
}

},{}],3:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getGlobal;
/* eslint-env node, es6 */
function getGlobal(g) {
  if (g != null) return g;
  if (typeof System !== 'undefined' && System != null && System.global != null && System.global.System === System) return System.global;
  if (typeof self !== 'undefined' && self != null && self.self === self) return self;
  if (typeof window !== 'undefined' && window != null && window.window === window) return window;
  if (typeof global !== 'undefined' && global != null && global.global === global) return global;
  return g;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = callOnReady;
var ready = false;
var callbacks = [];

function pageReady() {
  if (!ready) {
    ready = true;
    for (var i = 0; i < callbacks.length; ++i) {
      callbacks[i]();
    }
    callbacks = null;
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'complete') {
    ready = true;
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', pageReady);
  } else if (document.onreadystatechange) {
    document.onreadystatechange = function () {
      if (document.readyState === 'interactive') {
        pageReady();
      }
    };
  }
} else {
  // we are in an environment that doesn't have a DOM therefore we're ready
  ready = true;
}

function callOnReady(cb) {
  if (typeof setTimeout !== 'function') {
    cb();
  } else if (ready) {
    setTimeout(cb, 0);
  } else {
    callbacks.push(cb);
  }
}

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Performance;

var _ringBuffer = require('@shape/ring-buffer');

var _ringBuffer2 = _interopRequireDefault(_ringBuffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Performance(global) {
  this.entries = new _ringBuffer2.default(1000);
  if (typeof global !== 'undefined' && global.performance != null) {
    this.origPerformance = global.performance;
    this.origGetEntries = global.performance.getEntries;
    this.origNow = global.performance.now;
    this.origMark = global.performance.mark;
    this.origMeasure = global.performance.measure;
    this.origGetEntriesByName = global.performance.getEntriesByName;
    this.origGetEntriesByType = global.performance.getEntriesByType;
    this.origClearMarks = global.performance.clearMarks;
    this.origClearMeasures = global.performance.clearMeasures;
  }
}

Performance.prototype.now = function () {
  if (this.origNow) {
    return this.origNow.call(this.origPerformance);
  }
  return Date.now();
};

Performance.prototype.mark = function (name) {
  if (this.origMark) {
    this.origMark.call(this.origPerformance, name);
  }
  this.entries.put({
    entryType: 'mark',
    name: name,
    startTime: this.now(),
    duration: 0
  });
};

Performance.prototype.getEntries = function () {
  if (this.origGetEntries) {
    return this.origGetEntries.call(this.origPerformance);
  }
  return this.entries.toArray();
};

Performance.prototype.getEntriesByName = function (name, type) {
  if (this.origGetEntriesByName) {
    return this.origGetEntriesByName.call(this.origPerformance, name, type);
  }
  return this.getEntries().filter(function (entry) {
    return type != null ? entry.type === type && entry.name === name : entry.name === name;
  });
};

Performance.prototype.getEntriesByType = function (type) {
  if (this.origGetEntriesByType) {
    return this.origGetEntriesByType.call(this.origPerformance, type);
  }
  return this.getEntries().filter(function (entry) {
    return entry.entryType === type;
  });
};

Performance.prototype.measure = function (name, startMark, endMark) {
  if (this.origMeasure) {
    this.origMeasure.call(this.origPerformance, name, startMark, endMark);
  }
  var endEntries = this.getEntriesByName(endMark);
  var startEntries = this.getEntriesByName(startMark);
  var endTime = endEntries.length > 0 ? endEntries[0].startTime : this.now();
  var startTime = startEntries.length > 0 ? startEntries[0].startTime : 0;
  this.entries.put({
    entryType: 'measure',
    name: name,
    startTime: this.now(),
    duration: endTime - startTime
  });
};

Performance.prototype.clearMarks = function (name) {
  var self = this;
  if (this.origClearMarks) {
    this.origClearMarks.call(this.origClearMarks, name);
  }
  var nonMarks = this.entries.toArray().filter(function (entry) {
    return entry.entryType !== 'mark';
  });
  this.entries.clear();

  nonMarks.forEach(function (entry) {
    self.entries.put(entry);
  });
};

Performance.prototype.clearMeasures = function (name) {
  if (this.origClearMarks) {
    this.origClearMeasures.call(this.origClearMeasures, name);
  }
  var nonMeasures = this.entries.toArray().filter(function (entry) {
    return entry.entryType !== 'measure';
  });
  this.entries.clear();

  nonMeasures.forEach(function (entry) {
    self.entries.put(entry);
  });
};

},{"@shape/ring-buffer":8}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pick;
function pick(keys, target) {
  var i,
      l,
      key,
      result = {};
  if (target == null) return result;
  for (i = 0, l = keys.length; i < l; ++i) {
    key = keys[i];
    if (key in target) {
      result[key] = target[key];
    }
  }
  return result;
}

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = RingBuffer;
function RingBuffer(n) {
  this.i = 0;
  this.length = 0;
  if (n === 0 || typeof n !== 'number') {
    this.n = Infinity;
  } else {
    this.n = n;
  }
  this.arr = [];
}

RingBuffer.prototype.put = function (data) {
  this.arr[this.i] = data;
  this.i++;
  if (this.length < this.n) {
    this.length++;
  }
  if (this.i >= this.n) {
    this.i = 0;
  }
};

RingBuffer.prototype.toArray = function () {
  if (this.length < this.n) {
    return this.arr.slice(0, this.length);
  }
  return this.arr.slice(this.i, this.n).concat(this.arr.slice(0, this.i));
};

RingBuffer.prototype.clear = function () {
  this.arr = [];
  this.length = 0;
  this.i = 0;
};

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _activexSupport = require('./signals/activex-support');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_activexSupport).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/activex-support":43}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _audioSupport = require('./signals/audio-support');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_audioSupport).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/audio-support":44}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _audiocontextAnalyser = require('./signals/audiocontext-analyser');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_audiocontextAnalyser).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/audiocontext-analyser":45}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _audiocontextDynamicscompressor = require('./signals/audiocontext-dynamicscompressor');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_audiocontextDynamicscompressor).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/audiocontext-dynamicscompressor":46}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _browserPlugins = require('./signals/browser-plugins');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_browserPlugins).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/browser-plugins":47}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _canvasSupport = require('./signals/canvas-support');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_canvasSupport).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/canvas-support":48}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chromeWebstore = require('./signals/chrome-webstore');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_chromeWebstore).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/chrome-webstore":49}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createElement = require('./signals/create-element');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createElement).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/create-element":50}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cssSupport = require('./signals/css-support');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_cssSupport).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/css-support":51}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dateString = require('./signals/date-string');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_dateString).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/date-string":52}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _detectFonts = require('./signals/detect-fonts');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_detectFonts).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/detect-fonts":54}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _detectFonts = require('./signals/detect-fonts2');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_detectFonts).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/detect-fonts2":56}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hardwareConcurrency = require('./signals/hardware-concurrency');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_hardwareConcurrency).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/hardware-concurrency":57}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _imgSrcset = require('./signals/img-srcset');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_imgSrcset).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/img-srcset":58}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _javaSupport = require('./signals/java-support');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_javaSupport).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/java-support":59}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keyboardEvents = require('./signals/keyboard-events');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_keyboardEvents).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/keyboard-events":60}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = detectFonts;
/**
 * Collect a list of fonts available within the browser
 *
 * @param {array} [fontList] List of fonts to look for
 * @param {HTMLDocument} [document] document of parent DOM
 * @returns {object} boolean array
 */

// each of these characters was determined to be necessary based on our font list (version 2 at the time of writing)
var word = '0-_{w.';

function detectFonts(fontList, document) {
  var results = [];
  var canvas = document.createElement('canvas');
  var ctx = canvas && canvas.getContext && canvas.getContext('2d');
  if (ctx && ctx.measureText) {
    ctx.textBaseline = 'top';
    var sansBaseline = calculateWordWidth(ctx, word, 'sans-serif', 'sans-serif');
    var serifBaseline = calculateWordWidth(ctx, word, 'serif', 'serif');
    for (var i = 0; i < fontList.fonts.length; i++) {
      results.push(calculateWordWidth(ctx, word, fontList.fonts[i], 'sans-serif') !== sansBaseline || calculateWordWidth(ctx, word, fontList.fonts[i], 'serif') !== serifBaseline);
    }
  }
  return {
    version: fontList.version,
    fonts: results
  };
}

function calculateWordWidth(ctx, payload, font, fallback) {
  ctx.font = '50px \'' + font + '\', ' + fallback;
  return ctx.measureText(payload).width;
}

},{}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addEvent = addEvent;
exports.removeEvent = removeEvent;
exports.getEventTarget = getEventTarget;
function addEvent(element, event, func) {
  if (element.addEventListener) {
    element.addEventListener(event, func, true);
  } else if (element.attachEvent) {
    element.attachEvent('on' + event, func);
  }
}

function removeEvent(element, event, func) {
  if (element.removeEventListener) {
    element.removeEventListener(event, func, true);
  } else if (element.detachEvent) {
    element.detachEvent('on' + event, func);
  }
}

function getEventTarget(domEvent) {
  var target = domEvent.target || domEvent.srcElement || null;
  return target && {
    id: target.id,
    name: target.name,
    typeAttr: target.type,
    hidden: !!target.hidden,
    tagName: target.tagName,
    offsetLeft: target.offsetLeft,
    offsetTop: target.offsetTop
  };
}

},{}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = collectExtraProperties;
function instanceOfUIEvent(eventClass, e) {
  var trusted = true;
  if (typeof Object.getPrototypeOf === 'function') {
    trusted = trusted && Object.getPrototypeOf(e) === eventClass;
  } else if (typeof e.__proto__ !== 'undefined') {
    trusted = trusted && e.__proto__ === eventClass;
  } else {
    trusted = trusted && e instanceof eventClass;
  }
  return trusted;
}

function collectExtraProperties(e) {
  return {
    instanceOfUIEvent: instanceOfUIEvent(UIEvent, e),
    markedAsTrusted: e.isTrusted
  };
}

},{}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mathSupport = require('./signals/math-support');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_mathSupport).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/math-support":61}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mathmlSupport = require('./signals/mathml-support');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_mathmlSupport).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/mathml-support":62}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _maxTouchPoints = require('./signals/max-touch-points');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_maxTouchPoints).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/max-touch-points":63}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mediaDeviceId = require('./signals/media-device-id');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_mediaDeviceId).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/media-device-id":64}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mouseEvents = require('./signals/mouse-events');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_mouseEvents).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/mouse-events":65}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findInArrayLike;
function findInArrayLike(arrayLike, pred, notFoundSentinel) {
  for (var i = 0, l = arrayLike.length; i < l; ++i) {
    if (pred(arrayLike[i])) {
      return arrayLike[i];
    }
  }
  return notFoundSentinel;
}

},{}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = nonce;
function nonce() {
  return 'x' + Math.random().toString(36).slice(2);
}

},{}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hash;
function hash(s) {
  var z = 0;
  if (s.length === 0) return z;
  for (var i = 0; i < s.length; ++i) {
    z = (z << 5) - z + s.charCodeAt(i);
    z = z | 0;
  }
  return z;
}

},{}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = timer;
function timer() {
  var start = +new Date();
  var now = function now() {
    return +new Date() - start;
  };
  now.start = start;
  return now;
}

},{}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = RingBuffer;
function RingBuffer(n) {
  this.i = 0;
  this.length = 0;
  if (n === 0 || typeof n !== 'number') {
    this.n = Infinity;
  } else {
    this.n = n;
  }
  this.arr = [];
}

RingBuffer.prototype.put = function (data) {
  this.arr[this.i] = data;
  this.i++;
  if (this.length < this.n) {
    this.length++;
  }
  if (this.i >= this.n) {
    this.i = 0;
  }
};

RingBuffer.prototype.toArray = function () {
  if (this.length < this.n) {
    return this.arr.slice(0, this.length);
  }
  return this.arr.slice(this.i, this.n).concat(this.arr.slice(0, this.i));
};

RingBuffer.prototype.clear = function () {
  this.arr = [];
  this.length = 0;
};

},{}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _orientationEvents = require('./signals/orientation-events');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_orientationEvents).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/orientation-events":66}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _performanceSupport = require('./signals/performance-support');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_performanceSupport).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/performance-support":67}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propertyCheck = require('./signals/property-check');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_propertyCheck).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/property-check":68}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propertyValues = require('./signals/property-values');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_propertyValues).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/property-values":69}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _screenOverride = require('./signals/screen-override');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_screenOverride).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/screen-override":70}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'activexSupport',
  group: 'browser',
  data: _nodataSentinel2.default,

  afterReady: function afterReady(ctx) {
    this.data = typeof ctx.global.ActiveXObject === 'function' && new ctx.global.ActiveXObject('Microsoft.XMLHTTP') != null;
  }
};

},{"@shape/nodata-sentinel":4}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'audioSupport',
  group: 'browser',
  data: _nodataSentinel2.default,

  // eslint-disable-next-line no-unused-vars
  afterReady: function afterReady(ctx) {
    var data = {};

    // check support for audio formats via video element's canPlayType method
    var audioTypes = ['audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/wave', 'audio/wav'];
    try {
      var audio = ctx.global.document.createElement('audio');
      for (var i = 0, l = audioTypes.length; i < l; ++i) {
        var canPlayType = audio.canPlayType(audioTypes[i]);
        data[audioTypes[i]] = canPlayType !== '' && canPlayType !== 'no';
      }
    } catch (e) {}

    this.data = data;
  }
};

},{"@shape/nodata-sentinel":4}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global webkitAudioContext: false */
exports.default = {
  name: 'AudioContextAnalyser',
  group: 'computer',

  data: _nodataSentinel2.default,

  afterReady: function afterReady() {
    var AC;
    if (typeof AudioContext !== 'undefined') {
      AC = AudioContext;
    } else if (typeof webkitAudioContext !== 'undefined') {
      AC = webkitAudioContext;
    } else {
      return;
    }

    var ac = new AC();
    if (ac == null) return;

    var d = ac.destination;
    var a = ac.createAnalyser();

    this.data = {
      // AudioContext
      sampleRate: ac.sampleRate,
      state: ac.state,

      // AudioNode
      numberOfInputs: d.numberOfInputs,
      numberOfOutputs: d.numberOfOutputs,
      channelCount: d.channelCount,
      channelCountMod: d.channelCountMode,
      channelInterpretation: d.channelInterpretation,

      // AudioDestinationNode
      maxChannelCount: d.maxChannelCount,

      // AnalyserNode
      fftSize: a.fftSize,
      frequencyBinCount: a.frequencyBinCount,
      minDecibels: a.minDecibels,
      maxDecibels: a.maxDecibels,
      smoothingTimeConstant: a.smoothingTimeConstant
    };
  }
};

},{"@shape/nodata-sentinel":4}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hash = require('@shape/hash');

var _hash2 = _interopRequireDefault(_hash);

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global webkitOfflineAudioContext: false */
function run(cb) {
  var oac;
  if (typeof OfflineAudioContext !== 'undefined') {
    oac = new OfflineAudioContext(1, 44100 / 4, 44100 / 2);
  } else if (typeof webkitOfflineAudioContext !== 'undefined') {
    oac = new webkitOfflineAudioContext(1, 44100 / 2, 44100);
  } else {
    return;
  }

  if (oac == null) return;

  var oscillator = oac.createOscillator();
  oscillator.type = 'triangle';
  oscillator.frequency.value = 1e4;
  oscillator.start();

  var compressor = oac.createDynamicsCompressor();
  compressor.threshold.value = -60; // decibels
  compressor.knee.value = 10; // decibels
  compressor.ratio.value = 10;
  compressor.attack.value = 0.5; // seconds
  compressor.release.value = 0.5; // seconds

  oscillator.connect(compressor);
  compressor.connect(oac.destination);

  oac.oncomplete = function (event) {
    oscillator.disconnect();
    compressor.disconnect();
    cb(event.renderedBuffer.getChannelData(0));
  };
  oac.startRendering();
}

exports.default = {
  name: 'AudioContextDynamicsCompressor',
  group: 'computer',

  data: _nodataSentinel2.default,

  afterReady: function afterReady(ctx) {
    var self = this;
    function next(audioBuffer) {
      self.data = (0, _hash2.default)(JSON.stringify(audioBuffer));
      ctx.global.document.body.removeEventListener('touchend', eventHandler);
      ctx.global.document.body.removeEventListener('click', eventHandler);
    }
    function eventHandler() {
      run(next);
    }
    ctx.global.document.body.addEventListener('touchend', eventHandler);
    ctx.global.document.body.addEventListener('click', eventHandler);
    eventHandler();
  }
};

},{"@shape/hash":35,"@shape/nodata-sentinel":4}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hash = require('@shape/hash');

var _hash2 = _interopRequireDefault(_hash);

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'browserPlugins',
  group: 'browser',
  data: _nodataSentinel2.default,

  setup: function setup(ctx) {
    this.plugins = ctx.global.navigator.plugins;
  },

  afterReady: function afterReady() {
    var hasDefaultBrowserHelper = false;
    var hasWidevinePlugin = false;
    var pluginHashes = [];

    for (var i = 0, l = this.plugins.length; i < l; ++i) {
      try {
        var plugin = this.plugins[i];

        var pluginDetails = [plugin.name, plugin.description, plugin.filename, plugin.version, []];
        for (var k = 0, m = plugin.length; k < m; ++k) {
          pluginDetails[4].push(plugin[k].type, plugin[k].suffixes, plugin[k].description);
        }

        pluginHashes.push((0, _hash2.default)(JSON.stringify(pluginDetails)));

        if (plugin.name === 'Default Browser Helper') {
          hasDefaultBrowserHelper = true;
        } else if (plugin.name === 'Widevine Content Decryption Module') {
          hasWidevinePlugin = true;
        }
      } catch (e) {}
    }

    this.data = {
      plugins: pluginHashes,
      hasDefaultBrowserHelper: hasDefaultBrowserHelper,
      hasWidevinePlugin: hasWidevinePlugin
    };
  }
};

},{"@shape/hash":35,"@shape/nodata-sentinel":4}],48:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hash = require('@shape/hash');

var _hash2 = _interopRequireDefault(_hash);

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'canvasSupport',
  group: 'computer',

  data: _nodataSentinel2.default,

  afterReady: function afterReady(ctx) {
    // render a particular text to canvas; serialise as image/png;
    // collect simple hash of png data
    // the significance of this particular text is unknown
    var canvasTestText = 'Hel$&?6%){mZ+#@';
    var data = null;
    try {
      var canvas = ctx.global.document.createElement('canvas');
      var context = canvas.getContext('2d');
      context.font = '18pt Sans';
      context.textBaseline = 'top';
      context.fillText(canvasTestText, 2, 2);
      data = (0, _hash2.default)(canvas.toDataURL('image/png'));
    } catch (e) {}

    this.data = data;
  }
};

},{"@shape/hash":35,"@shape/nodata-sentinel":4}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  name: 'chromeWebstore',
  group: 'browser',

  setup: function setup(ctx) {
    this.data = ctx.global.chrome != null && ctx.global.chrome.webstore != null && typeof ctx.global.chrome.webstore.install === 'function';
  }
};

},{}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hash = require('@shape/hash');

var _hash2 = _interopRequireDefault(_hash);

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'createElement',
  group: 'browser',

  data: _nodataSentinel2.default,

  afterReady: function afterReady(ctx) {
    var v = ctx.global.document.createElement;
    var hasToSource = typeof v.toSource === 'function';
    this.data = {
      hasToSource: hasToSource,
      stringHash: (0, _hash2.default)(v.toString()),
      sourceHash: hasToSource ? (0, _hash2.default)(v.toSource()) : 0
    };
  }
};

},{"@shape/hash":35,"@shape/nodata-sentinel":4}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _generateNonce = require('@shape/generate-nonce');

var _generateNonce2 = _interopRequireDefault(_generateNonce);

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

var _findInArraylike = require('@shape/find-in-arraylike');

var _findInArraylike2 = _interopRequireDefault(_findInArraylike);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Given a CSS declaration, determine which of the known prefixes this
 * browser accepts
 */
function allowedVendorPrefixesForStyle(declarationText, styleNonce, document) {
  var result = {};
  var prefixes = ['-ms-', '-moz-', '-webkit-', ''];
  var id = (0, _generateNonce2.default)();

  try {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.nonce = styleNonce;
    document.head.appendChild(style);

    var ownerNodeIsStylePred = function ownerNodeIsStylePred(candidate) {
      return candidate.ownerNode === style;
    };

    for (var i = 0, l = prefixes.length; i < l; ++i) {
      result[prefixes[i]] = false;
      try {
        var css = '#' + id + '{' + prefixes[i] + declarationText + '}';
        var ss;
        if (style.styleSheet != null) {
          // for IE8, which doesn't support innerHTML on style elements
          style.styleSheet.cssText = css;
          ss = style.styleSheet;
        } else {
          style.innerHTML = css;
          ss = (0, _findInArraylike2.default)(document.styleSheets, ownerNodeIsStylePred);
        }
        result[prefixes[i]] = !/\{\s*\}/.test(ss.cssText || (ss.rules || ss.cssRules)[0].cssText);
      } catch (e) {}
    }
  } catch (e) {}

  try {
    document.head.removeChild(style);
  } catch (e) {}

  return result;
}

exports.default = {
  name: 'cssSupport',
  group: 'browser',

  data: _nodataSentinel2.default,

  afterReady: function afterReady(ctx) {
    var data = {};

    var potentiallyPrefixedCss = ['background-repeat: round space;', 'border-image: none;', 'border-radius: 4px;', 'color: var(companyblue);', 'display: run-in;', 'filter: blur(2px);', 'flow-into: main-thread;', 'grid-columns: auto 1fr;', 'hyphens: auto;', 'inline-block: none;', 'mask-repeat: repeat-x;', 'mask: auto;', 'object-fit: contain;', 'overflow-scrolling: touch;', 'position: sticky;', 'resize: both;', 'tab-size: 4;', 'text-stroke: 2.0px;', 'user-select: none;', 'word-break: auto;'];
    for (var i = 0, l = potentiallyPrefixedCss.length; i < l; ++i) {
      data[potentiallyPrefixedCss[i]] = allowedVendorPrefixesForStyle(potentiallyPrefixedCss[i], ctx.csp.styleNonce, ctx.global.document);
    }

    this.data = data;
  }
};

},{"@shape/find-in-arraylike":33,"@shape/generate-nonce":34,"@shape/nodata-sentinel":4}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// We collect a fixed time to compare locale clues like order of pieces, timezone, etc
// This particular fixed time was decided by a rigorous peer-reviewed process
// and it should not be changed without consulting Lewis and Michael.
var timestampOfInterest = -770172240000;

exports.default = {
  name: 'dateString',
  group: 'browser',

  setup: function setup() {
    this.data = new Date(timestampOfInterest).toString();
  }
};

},{}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// ******* IMPORTANT *******
//
// Please ensure to increment the version number if you make a
// change to this file.

exports.default = {
  version: 2,
  fonts: ['Abyssinica SIL', 'Aharoni', 'Al Bayan', 'Aldhabi', 'Al Nile', 'Al Tarikh', 'American Typewriter', 'Andale Mono', 'Andalus', 'Angsana New', 'AngsanaUPC', 'Aparajita', 'Apple Braille', 'Apple Chancery', 'Apple Color Emoji', 'AppleGothic', 'Apple LiGothic', 'Apple LiSung', 'AppleMyungjo', 'Apple SD Gothic Neo', 'Apple Symbols', 'Arabic Transparent', 'Arabic Typesetting', 'Arial', 'Arial Baltic', 'Arial Black', 'Arial CE', 'Arial CYR', 'Arial Greek', 'Arial Hebrew', 'Arial Narrow', 'Arial Rounded MT Bold', 'Arial TUR', 'Arial Unicode MS', 'Athelas', 'Avenir', 'Avenir Next', 'Avenir Next Condensed', 'Ayuthaya', 'Baghdad', 'Bangla MN', 'Bangla Sangam MN', 'Baoli SC', 'Baskerville', 'Batang', 'BatangChe', 'Beirut', 'Bell MT', 'BiauKai', 'Big Caslon', 'Bitstream Charter', 'Browallia New', 'BrowalliaUPC', 'Brush Script', 'Brush Script MT', 'Calibri', 'Calibri Light', 'Cambria', 'Cambria Math', 'Candara', 'Century Schoolbook L', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Chandas', 'Charcoal CY', 'Charter', 'Cochin', 'Comic Sans MS', 'Consolas', 'Constantia', 'Copperplate', 'Corbel', 'Cordia New', 'CordiaUPC', 'Corsiva Hebrew', 'Courier', 'Courier 10 Pitch', 'Courier New', 'Courier New Baltic', 'Courier New CE', 'Courier New CYR', 'Courier New Greek', 'Courier New TUR', 'Curlz MT', 'Damascus', 'DaunPenh', 'David', 'DecoType Naskh', 'DejaVu Sans', 'DejaVu Sans Condensed', 'DejaVu Sans Light', 'DejaVu Sans Mono', 'DejaVu Serif', 'DejaVu Serif Condensed', 'Devanagari MT', 'Devanagari Sangam MN', 'DFKai-SB', 'Didot', 'DilleniaUPC', 'DIN Alternate', 'DIN Condensed', 'Dingbats', 'Diwan Kufi', 'Diwan Thuluth', 'DokChampa', 'Dotum', 'DotumChe', 'Droid Arabic Naskh', 'Droid Sans', 'Droid Sans Armenian', 'Droid Sans Ethiopic', 'Droid Sans Fallback', 'Droid Sans Georgian', 'Droid Sans Hebrew', 'Droid Sans Japanese', 'Droid Sans Mono', 'Droid Sans Thai', 'Droid Serif', 'EastLift', 'Ebrima', 'Elephant', 'Engravers', 'Eras Light ITC', 'Estrangelo Edessa', 'EucrosiaUPC', 'Euphemia', 'Euphemia UCAS', 'FangSong', 'Farah', 'Farisi', 'Forte', 'Franklin Gothic Medium', 'FrankRuehl', 'FreeMono', 'FreeSans', 'FreeSerif', 'FreesiaUPC', 'Freestyle Script', 'Futura', 'Gabriola', 'Gadget', 'Gadugi', 'gargi', 'Garuda', 'Gautami', 'GB18030 Bitmap', 'Geeza Pro', 'Geneva', 'Geneva CY', 'Georgia', 'Gill Sans', 'Gisha', 'Gujarati MT', 'Gujarati Sangam MN', 'Gulim', 'GulimChe', 'GungSeo', 'Gungsuh', 'GungsuhChe', 'Gurmukhi MN', 'Gurmukhi MT', 'Gurmukhi Sangam MN', 'Hannotate SC', 'Hannotate TC', 'HanziPen SC', 'HanziPen TC', 'HeadLineA', 'Hei', 'Heiti SC', 'Heiti TC', 'Helvetica', 'Helvetica CY', 'Helvetica Neue', 'Herculanum', 'Hiragino Kaku Gothic Pro', 'Hiragino Kaku Gothic ProN', 'Hiragino Kaku Gothic Std', 'Hiragino Kaku Gothic StdN', 'Hiragino Maru Gothic Pro', 'Hiragino Maru Gothic ProN', 'Hiragino Mincho Pro', 'Hiragino Mincho ProN', 'Hiragino Sans GB', 'Hoefler Text', 'Impact', 'InaiMathi', 'Iowan Old Style', 'IrisUPC', 'Iskoola Pota', 'JasmineUPC', 'KacstArt', 'KacstBook', 'KacstDecorative', 'KacstDigital', 'KacstFarsi', 'KacstLetter', 'KacstNaskh', 'KacstOffice', 'KacstOne', 'KacstPen', 'KacstPoster', 'KacstQurn', 'KacstScreen', 'KacstTitle', 'KacstTitleL', 'Kai', 'Kailasa', 'KaiTi', 'Kaiti SC', 'Kaiti TC', 'Kalinga', 'Kannada MN', 'Kannada Sangam MN', 'Kartika', 'Kedage', 'Kefa', 'Khmer MN', 'Khmer OS', 'Khmer OS System', 'Khmer Sangam MN', 'Khmer UI', 'Kinnari', 'KodchiangUPC', 'Kokila', 'Kokonor', 'Krungthep', 'KufiStandardGK', 'Lantinghei SC', 'Lantinghei TC', 'Lao MN', 'Lao Sangam MN', 'Lao UI', 'Latha', 'Leelawadee', 'Levenim MT', 'Liberation Mono', 'Liberation Sans', 'Liberation Sans Narrow', 'Liberation Serif', 'Libian SC', 'LiHei Pro', 'LilyUPC', 'LiSong Pro', 'LKLUG', 'Lohit Bengali', 'Lohit Devanagari', 'Lohit Gujarati', 'Lohit Punjabi', 'Lohit Tamil', 'Loma', 'Lucida Console', 'Lucida Grande', 'Lucida Sans Unicode', 'Malayalam MN', 'Malayalam Sangam MN', 'Malgun Gothic', 'Mallige', 'Mangal', 'Marion', 'Marker Felt', 'Marlett', 'Meera', 'Meiryo', 'Meiryo UI', 'Menlo', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft JhengHei UI', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft Uighur', 'Microsoft YaHei', 'Microsoft YaHei UI', 'Microsoft Yi Baiti', 'MingLiU', 'MingLiU-ExtB', 'MingLiU_HKSCS', 'MingLiU_HKSCS-ExtB', 'Miriam', 'Miriam Fixed', 'Mishafi', 'Monaco', 'Mongolian Baiti', 'MoolBoran', 'mry_KacstQurn', 'MS Gothic', 'Mshtakan', 'MS Mincho', 'MS PGothic', 'MS PMincho', 'MS UI Gothic', 'Mukti Narrow', 'Muna', 'MV Boli', 'Myanmar MN', 'Myanmar Sangam MN', 'Myanmar Text', 'Nadeem', 'NanumBarunGothic', 'Nanum Brush Script', 'Nanum Gothic', 'NanumGothic', 'Nanum Myeongjo', 'NanumMyeongjo', 'Nanum Pen Script', 'Narkisim', 'New Gulim', 'New Peninim MT', 'New York', 'Nimbus Mono L', 'Nimbus Roman No9 L', 'Nimbus Sans L', 'Nirmala UI', 'Norasi', 'Noteworthy', 'NSimSun', 'Nyala', 'OpenSymbol', 'Optima', 'ori1Uni,utkal', 'Oriya MN', 'Oriya Sangam MN', 'Osaka', 'Padauk', 'Padauk Book', 'Palatino', 'Palatino Linotype', 'Papyrus', 'PCMyungjo', 'Phetsarath OT', 'PilGi', 'Plantagenet Cherokee', 'PMingLiU', 'PMingLiU-ExtB', 'Pothana2000', 'PT Mono', 'PT Sans', 'PT Sans Caption', 'PT Sans Narrow', 'PT Serif', 'PT Serif Caption', 'Purisa', 'Raanana', 'Raavi', 'Rachana', 'Rekha', 'Rod', 'Saab', 'Sakkal Majalla', 'Sana', 'Sans', 'Sathu', 'Savoye LET', 'Sawasdee', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Light', 'Segoe UI Semibold', 'Segoe UI Semilight', 'Segoe UI Symbol', 'Seravek', 'Shonar Bangla', 'Shruti', 'Silom', 'SimHei', 'Simplified Arabic', 'Simplified Arabic Fixed', 'SimSun', 'SimSun-ExtB', 'Sinhala MN', 'Sinhala Sangam MN', 'Skia', 'Snell Roundhand', 'Songti SC', 'Songti TC', 'Standard Symbols L', 'STFangsong', 'STHeiti', 'STIXGeneral', 'STIXIntegralsD', 'STIXIntegralsSm', 'STIXIntegralsUp', 'STIXIntegralsUpD', 'STIXIntegralsUpSm', 'STIXNonUnicode', 'STIXSizeFiveSym', 'STIXSizeFourSym', 'STIXSizeOneSym', 'STIXSizeThreeSym', 'STIXSizeTwoSym', 'STIXVariants', 'STKaiti', 'STSong', 'Superclarendon', 'Sylfaen', 'Symbol', 'Tahoma', 'Takao P', 'TakaoPGothic', 'Tamil MN', 'Tamil Sangam MN', 'Telugu MN', 'Telugu Sangam MN', 'Thonburi', 'Tibetan Machine Uni', 'Times', 'Times New Roman', 'Times New Roman Baltic', 'Times New Roman CE', 'Times New Roman CYR', 'Times New Roman Greek', 'Times New Roman TUR', 'TlwgMono', 'TlwgTypewriter', 'Tlwg Typist', 'Tlwg Typo', 'Traditional Arabic', 'Trebuchet MS', 'Tunga', 'Ubuntu', 'Ubuntu Condensed', 'Ubuntu Light', 'Ubuntu Medium', 'Ubuntu Mono', 'Umpush', 'Urdu Typesetting', 'URW Bookman L', 'URW Chancery L', 'URW Gothic L', 'URW Palladio L', 'Utsaah', 'Vani', 'Vemana2000', 'Verdana', 'Vijaya', 'Vrinda', 'Waree', 'Waseem', 'Wawati SC', 'Wawati TC', 'Webdings', 'Weibei SC', 'Weibei TC', 'Wide Latin', 'Wingdings', 'Wingdings 2', 'Wingdings 3', 'Xingkai SC', 'XITS', 'Yuanti SC', 'YuGothic', 'YuMincho', 'Yuppy SC', 'Yuppy TC', 'Zapf Dingbats', 'Zapfinfo']
};

},{}],54:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fontList = require('./font-list');

var _fontList2 = _interopRequireDefault(_fontList);

var _detectFonts = require('../../lib/detect-fonts');

var _detectFonts2 = _interopRequireDefault(_detectFonts);

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'detectFonts',
  group: 'computer',

  data: _nodataSentinel2.default,

  afterReady: function afterReady(ctx) {
    this.data = (0, _detectFonts2.default)(_fontList2.default, ctx.global.document);
  }
};

},{"../../lib/detect-fonts":25,"./font-list":53,"@shape/nodata-sentinel":4}],55:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// ******* IMPORTANT *******
//
// Please ensure to increment the version number if you make a
// change to this file.

exports.default = {
  version: 3,
  fonts: ['Andale Mono', 'Arial Narrow', 'Arial Unicode MS', 'Batang', 'Bell MT', 'Brush Script', 'Brush Script MT', 'Calibri', 'Charter', 'Courier', 'Courier New', 'Curlz MT', 'DejaVu Sans', 'DejaVu Sans Mono', 'DejaVu Serif Condensed', 'Droid Sans', 'Droid Sans Fallback', 'Droid Serif', 'Forte', 'Futura', 'Geneva', 'Hei', 'Leelawadee', 'Levenim MT', 'Liberation Sans', 'Liberation Sans Narrow', 'Marlett', 'Meiryo UI', 'Microsoft Uighur', 'Microsoft YaHei UI', 'MS Mincho', 'MS UI Gothic', 'NanumGothic', 'Nirmala UI', 'Palatino', 'Papyrus', 'PMingLiU', 'PT Serif', 'SimHei', 'STIXVariants', 'STSong', 'Traditional Arabic', 'Urdu Typesetting', 'Verdana', 'Wingdings', 'Wingdings 3']
};

},{}],56:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fontList = require('./font-list');

var _fontList2 = _interopRequireDefault(_fontList);

var _detectFonts = require('../../lib/detect-fonts');

var _detectFonts2 = _interopRequireDefault(_detectFonts);

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'detectFonts2',
  group: 'computer',

  data: _nodataSentinel2.default,

  afterReady: function afterReady(ctx) {
    this.data = (0, _detectFonts2.default)(_fontList2.default, ctx.global.document);
  }
};

},{"../../lib/detect-fonts":25,"./font-list":55,"@shape/nodata-sentinel":4}],57:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  name: 'hardwareConcurrency',
  group: 'computer',

  setup: function setup(ctx) {
    this.data = ctx.global.navigator.hardwareConcurrency;
  }
};

},{}],58:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'imgSrcset',
  group: 'browser',

  data: _nodataSentinel2.default,

  afterReady: function afterReady(ctx) {
    this.data = 'srcset' in ctx.global.document.createElement('img');
  }
};

},{"@shape/nodata-sentinel":4}],59:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'javaSupport',
  group: 'browser',

  data: _nodataSentinel2.default,

  afterReady: function afterReady(ctx) {
    this.data = typeof ctx.global.navigator.javaEnabled === 'function' && ctx.global.navigator.javaEnabled();
  }
};

},{"@shape/nodata-sentinel":4}],60:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _trustedEvents = require('../../lib/trusted-events');

var _trustedEvents2 = _interopRequireDefault(_trustedEvents);

var _events = require('../../lib/events');

var eventsHelper = _interopRequireWildcard(_events);

var _ringBuffer = require('@shape/ring-buffer');

var _ringBuffer2 = _interopRequireDefault(_ringBuffer);

var _now = require('@shape/now');

var _now2 = _interopRequireDefault(_now);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var now = (0, _now2.default)();

var EVENT_TYPES = {
  KEY_DOWN: 1,
  KEY_UP: 2,
  KEY_PRESS: 3
};

function isDataKeyCode(keyCode) {
  return keyCode >= 48 && keyCode <= 57 || // 0 through 9
  keyCode >= 58 && keyCode <= 64 || // :;<=>?@
  keyCode >= 65 && keyCode <= 90 || // a-z
  keyCode >= 96 && keyCode <= 111 || // numpad 0-9 * + (separator?) - . /
  keyCode >= 160 && keyCode <= 176 || // ^!"#$%&_()*+|-{}~
  keyCode >= 186 && keyCode <= 192 || // ;=,-./`
  keyCode >= 219 && keyCode <= 222; // [\]'
}

function KeyboardEventManager(ctx) {
  this.ctx = ctx;
  this.events = new _ringBuffer2.default(this.ctx.userEventLimit);
  this.keysPressed = [];
  this.sequenceNumber = 0;
}

KeyboardEventManager.prototype.addKeyEvent = function (eventType, domEvent) {
  var target = eventsHelper.getEventTarget(domEvent);
  var keyCode = domEvent.which || domEvent.keyCode;

  if (typeof keyCode !== 'number') keyCode = 0;

  var sequenceNumber;
  if (eventType === EVENT_TYPES.KEY_DOWN) {
    this.keysPressed[keyCode] = this.sequenceNumber++;
    sequenceNumber = this.keysPressed[keyCode];
  } else if (eventType === EVENT_TYPES.KEY_UP || eventType === EVENT_TYPES.KEY_PRESS) {
    if (typeof this.keysPressed[keyCode] === 'number') {
      sequenceNumber = this.keysPressed[keyCode];
    } else {
      sequenceNumber = this.sequenceNumber++;
    }
  }

  // filter keyCode to avoid collecting user input (printable keystrokes except space and enter)
  if (!domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey && isDataKeyCode(keyCode)) {
    keyCode = 1;
  }

  var extra = (0, _trustedEvents2.default)(domEvent);

  this.events.put({
    eventType: eventType,
    timestamp: now(),
    sequenceNumber: sequenceNumber,
    altKey: !!domEvent.altKey,
    ctrlKey: !!domEvent.ctrlKey,
    metaKey: !!domEvent.metaKey,
    shiftKey: !!domEvent.shiftKey,
    keyCode: keyCode,
    target: target,
    instanceOfUIEvent: extra.instanceOfUIEvent,
    markedAsTrusted: extra.markedAsTrusted
  });
};

KeyboardEventManager.prototype.formatEvents = function (events) {
  return {
    keyDown: events.filter(function (elt) {
      return elt.eventType === 1;
    }),
    keyUp: events.filter(function (elt) {
      return elt.eventType === 2;
    }),
    keyPress: events.filter(function (elt) {
      return elt.eventType === 3;
    })
  };
};

exports.default = {
  name: 'keyboardEvents',
  group: 'user',

  setup: function setup(ctx) {
    var self = this;
    this.ctx = ctx;
    this.eventManager = new KeyboardEventManager(ctx);
    this.lastOOBIndex = 0;

    eventsHelper.addEvent(ctx.global.document, 'keydown', function (e) {
      self.eventManager.addKeyEvent(EVENT_TYPES.KEY_DOWN, e);
    });

    eventsHelper.addEvent(ctx.global.document, 'keyup', function (e) {
      self.eventManager.addKeyEvent(EVENT_TYPES.KEY_UP, e);
    });

    eventsHelper.addEvent(ctx.global.document, 'keypress', function (e) {
      self.eventManager.addKeyEvent(EVENT_TYPES.KEY_PRESS, e);
    });
  },

  get data() {
    return this.eventManager.formatEvents(this.eventManager.events.toArray());
  }
};

},{"../../lib/events":26,"../../lib/trusted-events":27,"@shape/now":36,"@shape/ring-buffer":37}],61:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hash = require('@shape/hash');

var _hash2 = _interopRequireDefault(_hash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'mathSupport',
  group: 'browser',

  setup: function setup() {
    this.data = (0, _hash2.default)(Object.getOwnPropertyNames(Math).join('\0'));
  }
};

},{"@shape/hash":35}],62:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _generateNonce = require('@shape/generate-nonce');

var _generateNonce2 = _interopRequireDefault(_generateNonce);

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'mathmlSupport',
  group: 'browser',

  data: _nodataSentinel2.default,

  afterReady: function afterReady(ctx) {
    var supportsMathMl = false;

    var mathmlElement, styleElement;
    var id = (0, _generateNonce2.default)();

    mathmlElement = ctx.global.document.createElement('div');
    styleElement = ctx.global.document.createElement('style');
    styleElement.nonce = ctx.csp.styleNonce;

    // this width and height were chosen by random dice roll
    var expectedWidth = 403;
    var expectedHeight = 184;

    styleElement.innerHTML = '#' + id + '{ position: absolute; top: -10000px; left: -10000px; line-height: 0; }';

    mathmlElement.innerHTML = '<math xmlns="http://www.w3.org/1998/Math/MathML" id=' + JSON.stringify(id) + '><mspace height="' + expectedHeight + 'px" width="' + expectedWidth + 'px"/></math></div>';

    try {
      ctx.global.document.body.appendChild(mathmlElement);
      ctx.global.document.body.appendChild(styleElement);

      var dimensions = mathmlElement.firstChild.firstChild.getBoundingClientRect();

      supportsMathMl = dimensions.height === expectedHeight && dimensions.width === expectedWidth;
    } catch (e) {}

    try {
      ctx.global.document.body.removeChild(styleElement);
    } catch (e) {}

    try {
      ctx.global.document.body.removeChild(mathmlElement);
    } catch (e) {}

    this.data = supportsMathMl;
  }
};

},{"@shape/generate-nonce":34,"@shape/nodata-sentinel":4}],63:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  name: 'maxTouchPoints',
  group: 'computer',

  setup: function setup(ctx) {
    this.data = ctx.global.navigator.maxTouchPoints;
  }
};

},{}],64:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hash = require('@shape/hash');

var _hash2 = _interopRequireDefault(_hash);

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'mediaDeviceId',
  group: 'browser',

  data: _nodataSentinel2.default,

  afterReady: function afterReady(ctx) {
    var navigator = ctx.global.navigator;
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.enumerateDevices !== 'function') {
      return;
    }

    var self = this;
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
      self.data = (0, _hash2.default)(devices.map(function (device) {
        return device.deviceId;
      }).join(''));
    }, function (error) {
      throw error;
    });
  }
};

},{"@shape/hash":35,"@shape/nodata-sentinel":4}],65:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _trustedEvents = require('../../lib/trusted-events');

var _trustedEvents2 = _interopRequireDefault(_trustedEvents);

var _events = require('../../lib/events');

var eventsHelper = _interopRequireWildcard(_events);

var _ringBuffer = require('@shape/ring-buffer');

var _ringBuffer2 = _interopRequireDefault(_ringBuffer);

var _now = require('@shape/now');

var _now2 = _interopRequireDefault(_now);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var now = (0, _now2.default)();

var EVENT_TYPES = {
  MOUSE_DOWN: 1,
  MOUSE_UP: 2,
  MOUSE_CLICK: 3,
  MOUSE_MOVE: 4
};

function MouseEventManager(ctx) {
  this.ctx = ctx;
  this.events = new _ringBuffer2.default(this.ctx.userEventLimit);
  this.sequenceNumber = 0;
  this.buttonsPressed = [];
}

MouseEventManager.prototype.addMouseButtonEvent = function (eventType, domEvent) {
  var target = eventsHelper.getEventTarget(domEvent);
  var extra = (0, _trustedEvents2.default)(domEvent);
  var buttonCode = domEvent.button;

  var sequenceNumber;
  if (eventType === EVENT_TYPES.MOUSE_DOWN) {
    this.buttonsPressed[buttonCode] = this.sequenceNumber++;
    sequenceNumber = this.buttonsPressed[buttonCode];
  } else if (eventType === EVENT_TYPES.MOUSE_UP || eventType === EVENT_TYPES.MOUSE_CLICK) {
    if (typeof this.buttonsPressed[buttonCode] === 'number') {
      sequenceNumber = this.buttonsPressed[buttonCode];
    } else {
      sequenceNumber = this.sequenceNumber++;
    }
  }

  this.events.put({
    eventType: eventType,
    timestamp: now(),
    x: domEvent.clientX,
    y: domEvent.clientY,
    button: domEvent.button,
    target: target,
    instanceOfUIEvent: extra.instanceOfUIEvent,
    markedAsTrusted: extra.markedAsTrusted,
    sequenceNumber: sequenceNumber
  });
};

MouseEventManager.prototype.addMouseMoveEvent = function (domEvent) {
  var extra = (0, _trustedEvents2.default)(domEvent);

  this.events.put({
    eventType: EVENT_TYPES.MOUSE_MOVE,
    timestamp: now(),
    x: domEvent.clientX,
    y: domEvent.clientY,
    button: null,
    target: null,
    fakeEvent: extra.fakeEvent,
    untrustedEvent: extra.untrustedEvent
  });
};

MouseEventManager.prototype.formatEvents = function (events) {
  return {
    mouseDown: events.filter(function (elt) {
      return elt.eventType === 1;
    }),
    mouseUp: events.filter(function (elt) {
      return elt.eventType === 2;
    }),
    mouseClick: events.filter(function (elt) {
      return elt.eventType === 3;
    }),
    mouseMove: events.filter(function (elt) {
      return elt.eventType === 4;
    })
  };
};

exports.default = {
  name: 'mouseEvents',
  group: 'user',

  setup: function setup(ctx) {
    var self = this;
    this.ctx = ctx;
    this.eventManager = new MouseEventManager(ctx);
    this.lastOOBIndex = 0;

    eventsHelper.addEvent(ctx.global.document, 'mousedown', function (e) {
      self.eventManager.addMouseButtonEvent(EVENT_TYPES.MOUSE_DOWN, e);
    });

    eventsHelper.addEvent(ctx.global.document, 'mouseup', function (e) {
      self.eventManager.addMouseButtonEvent(EVENT_TYPES.MOUSE_UP, e);
    });

    eventsHelper.addEvent(ctx.global.document, 'click', function (e) {
      self.eventManager.addMouseButtonEvent(EVENT_TYPES.MOUSE_CLICK, e);
    });

    eventsHelper.addEvent(ctx.global.document, 'mousemove', function (e) {
      self.eventManager.addMouseMoveEvent(e);
    });
  },

  get data() {
    return this.eventManager.formatEvents(this.eventManager.events.toArray());
  }
};

},{"../../lib/events":26,"../../lib/trusted-events":27,"@shape/now":36,"@shape/ring-buffer":37}],66:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _now = require('@shape/now');

var _now2 = _interopRequireDefault(_now);

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var now = (0, _now2.default)();

function OrientationEventManager() {
  this.lastTimestamp = 0;
  this.numOrientationEvents = 0;
  this.avgInterval = 0;
  this.avgAlpha = 0;
  this.avgBeta = 0;
  this.avgGamma = 0;
  this.stdDevInterval = 0;
  this.stdDevAlpha = 0;
  this.stdDevBeta = 0;
  this.stdDevGamma = 0;
}

OrientationEventManager.prototype.collectEvent = function (e) {
  var time = now();
  ++this.numOrientationEvents;
  if (this.numOrientationEvents <= 1) {
    this.lastTimestamp = time;
    this.avgAlpha = e.alpha;
    this.stdDevAlpha = e.alpha * e.alpha;
    this.avgBeta = e.beta;
    this.stdDevBeta = e.beta * e.beta;
    this.avgGamma = e.gamma;
    this.stdDevGamma = e.gamma * e.gamma;
  } else {
    var interval = time - this.lastTimestamp;
    var significanceOfAlreadyCapturedIntervals = (this.numOrientationEvents - 2) / (this.numOrientationEvents - 1);
    var significanceOfThisInterval = 1 / (this.numOrientationEvents - 1);

    this.avgInterval = this.avgInterval * significanceOfAlreadyCapturedIntervals + interval * significanceOfThisInterval;
    this.stdDevInterval = this.stdDevInterval * significanceOfAlreadyCapturedIntervals + interval * interval * significanceOfThisInterval;
    this.lastTimestamp = time;

    var significanceOfAlreadyCapturedData = (this.numOrientationEvents - 1) / this.numOrientationEvents;
    var significanceOfThisData = 1 / this.numOrientationEvents;

    this.avgAlpha = this.avgAlpha * significanceOfAlreadyCapturedData + e.alpha * significanceOfThisData;
    this.avgBeta = this.avgBeta * significanceOfAlreadyCapturedData + e.beta * significanceOfThisData;
    this.avgGamma = this.avgGamma * significanceOfAlreadyCapturedData + e.gamma * significanceOfThisData;
    this.stdDevAlpha = this.stdDevAlpha * significanceOfAlreadyCapturedData + e.alpha * e.alpha * significanceOfThisData;
    this.stdDevBeta = this.stdDevBeta * significanceOfAlreadyCapturedData + e.beta * e.beta * significanceOfThisData;
    this.stdDevGamma = this.stdDevGamma * significanceOfAlreadyCapturedData + e.gamma * e.gamma * significanceOfThisData;
  }
};

OrientationEventManager.prototype.getEventData = function () {
  if (this.numOrientationEvents < 1) return _nodataSentinel2.default;
  return {
    numOrientationEvents: this.numOrientationEvents,
    avgInterval: this.avgInterval,
    avgAlpha: this.avgAlpha,
    avgBeta: this.avgBeta,
    avgGamma: this.avgGamma,
    stdDevInterval: this.stdDevInterval,
    stdDevAlpha: this.stdDevAlpha,
    stdDevBeta: this.stdDevBeta,
    stdDevGamma: this.stdDevGamma
  };
};

exports.default = {
  name: 'orientationEvents',
  group: 'user',

  setup: function setup(ctx) {
    var self = this;
    this.eventManager = new OrientationEventManager();

    ctx.global.addEventListener('deviceorientation', function (e) {
      self.eventManager.collectEvent(e);
    });
  },

  get data() {
    return this.eventManager.getEventData();
  }
};

},{"@shape/nodata-sentinel":4,"@shape/now":36}],67:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  name: 'performanceSupport',
  group: 'browser',

  setup: function setup(ctx) {
    this.data = ctx.global.performance != null && typeof ctx.global.performance.now === 'function';
  }
};

},{}],68:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('@shape/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// creates an object which represents which keys in `keys` are `in` `target`
function checkKeysInObject(keys, target) {
  var i,
      l,
      key,
      result = {};
  for (i = 0, l = keys.length; i < l; ++i) {
    key = keys[i];
    result[key] = target != null && key in target;
  }
  return result;
}

var globalPropertiesToObserve = ['ActiveXObject', 'File', 'Int8Array', 'MutationObserver', 'Notification', 'SharedWorker', 'TouchEvent', 'XDomainRequest', '_phantom', '_Selenium_IDE_Recorder', 'addEventListener', 'attachEvent', 'callPhantom', 'createPopup', 'detachEvent', 'dispatchEvent', 'event', 'external', 'fireEvent', 'frames', 'getComputedStyle', 'globalStorage', 'localStorage', 'mozRTCPeerConnection', 'mozRequestAnimationFrame', 'phantom', 'postMessage', 'removeEventListener', 'requestAnimationFrame', 'sessionStorage', 'sidebar', 'webkitRTCPeerConnection', 'webkitRequestAnimationFrame'];

var documentPropertiesToObserve = ['_Selenium_IDE_Recorder', 'all', 'characterSet', 'charset', 'compatMode', 'documentMode', 'getElementById', 'getElementsByClassName', 'hasAttributes', 'images', 'layers', 'querySelector'];

var globalPropertiesToObserveBeforeSending = ['__fxdriver_unwrapped'];

var documentPropertiesToObserveBeforeSending = ['$cdc_asdjflasutopfhvcZLmcfl_', '__fxdriver_unwrapped', '__webdriver_script_fn'];

var documentBodyPropertiesToObserve = ['contextMenu', 'innerHTML', 'innerText', 'mozRequestFullScreen', 'requestFullScreen', 'webdriver', 'webkitRequestFullScreen'];

var navigatorPropertiesToObserve = ['vibrate'];

var externalPropertiesToObserve = ['Sequentum'];

exports.default = {
  name: 'propertyCheck',
  group: 'browser',

  setup: function setup(ctx) {
    this.ctx = ctx;
    // collect information about the existence of certain meaningful properties in global/DOM objects
    this._data = {
      global: checkKeysInObject(globalPropertiesToObserve, ctx.global),
      document: checkKeysInObject(documentPropertiesToObserve, ctx.global.document),
      documentBody: checkKeysInObject(documentBodyPropertiesToObserve, ctx.global.document.body),
      navigator: checkKeysInObject(navigatorPropertiesToObserve, ctx.global.navigator),
      external: checkKeysInObject(externalPropertiesToObserve, ctx.global.external)
    };
  },

  get data() {
    this._data.document = (0, _assign2.default)(this._data.document, checkKeysInObject(documentPropertiesToObserveBeforeSending, this.ctx.global.document));
    this._data.global = (0, _assign2.default)(this._data.global, checkKeysInObject(globalPropertiesToObserveBeforeSending, this.ctx.global));
    return this._data;
  }
};

},{"@shape/assign":1}],69:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pick = require('@shape/pick');

var _pick2 = _interopRequireDefault(_pick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'propertyValues',
  // todo: break this into 2-3 signal functions to separate user, ua, computer
  group: 'browser',

  setup: function setup(ctx) {
    var data = {};

    data.global = (0, _pick2.default)(['frameElement', 'innerHeight', 'innerWidth', 'outerHeight', 'outerWidth', 'screenX', 'screenY', 'pageXOffset', 'pageYOffset'], ctx.global);

    data.screen = (0, _pick2.default)(['height', 'width', 'availHeight', 'availWidth', 'pixelDepth', 'colorDepth'], ctx.global.screen);

    data.navigator = (0, _pick2.default)(['appCodeName', 'appName', 'appVersion', 'buildID', 'hardwareConcurrency', 'maxTouchPoints', 'platform', 'product', 'productSub', 'userAgent', 'vendor', 'vendorSub'], ctx.global.navigator);

    if (ctx.global.opera && typeof ctx.global.opera.version === 'function') {
      data.operaVersion = ctx.global.opera.version();
    }

    if (data.global.frameElement != null) {
      data.global.frameElement = {};
    }

    this.data = data;
  }
};

},{"@shape/pick":7}],70:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hash = require('@shape/hash');

var _hash2 = _interopRequireDefault(_hash);

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'screenOverride',
  group: 'browser',

  data: _nodataSentinel2.default,

  afterReady: function afterReady(ctx) {
    var v = ctx.global.screen;
    var hasToSource = typeof v.toSource === 'function';
    this.data = {
      hasToSource: hasToSource,
      stringHash: (0, _hash2.default)(v.toString()),
      sourceHash: hasToSource ? (0, _hash2.default)(v.toSource()) : 0
    };
  }
};

},{"@shape/hash":35,"@shape/nodata-sentinel":4}],71:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _generateNonce = require('@shape/generate-nonce');

var _generateNonce2 = _interopRequireDefault(_generateNonce);

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'sopEnabled',
  group: 'browser',

  data: _nodataSentinel2.default,

  afterReady: function afterReady(ctx) {
    var id = (0, _generateNonce2.default)();
    var styleElement = ctx.global.document.createElement('style');
    styleElement.nonce = ctx.csp.styleNonce;

    styleElement.innerHTML = '#' + id + '{ display:none; }';

    var fr = ctx.global.document.createElement('iframe');
    fr.id = id;
    fr.src = 'data:text/html,';
    fr.setAttribute('sandbox', '');

    try {
      ctx.global.document.body.appendChild(fr);
      ctx.global.document.body.appendChild(styleElement);
      try {
        this.data = fr.contentWindow.location.href === void 0;
      } catch (e) {
        this.data = true;
      }
    } catch (e) {}

    try {
      ctx.global.document.body.removeChild(styleElement);
    } catch (e) {}
    try {
      ctx.global.document.body.removeChild(fr);
    } catch (e) {}
  }
};

},{"@shape/generate-nonce":34,"@shape/nodata-sentinel":4}],72:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function urlFilter(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/(?:(?:https?|file):\/)?\/[^/]*\/.*?(?:(:\d+){1,2})/ig, 'URL');
}

exports.default = {
  name: 'stackTrace',
  group: 'browser',
  data: _nodataSentinel2.default,

  setup: function setup() {

    try {
      null[0]();
    } catch (e) {
      this.data = {
        name: e.name,
        description: e.description,
        message: e.message,
        stack: urlFilter(e.stack),
        stacktrace: e.stacktrace,
        num: e.number
      };
    }
  }
};

},{"@shape/nodata-sentinel":4}],73:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  name: 'svgSupport',
  group: 'browser',

  setup: function setup(ctx) {
    this.data = typeof ctx.global.document.createElementNS === 'function' && !!ctx.global.document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
  }
};

},{}],74:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ringBuffer = require('@shape/ring-buffer');

var _ringBuffer2 = _interopRequireDefault(_ringBuffer);

var _now = require('@shape/now');

var _now2 = _interopRequireDefault(_now);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var now = (0, _now2.default)();

var EVENT_TYPES = {
  TOUCH_START: 1,
  TOUCH_MOVE: 2,
  TOUCH_END: 3
};

function TouchEventManager(ctx) {
  this.ctx = ctx;
  this.events = new _ringBuffer2.default(this.ctx.userEventLimit);
}

TouchEventManager.prototype.addTouchEvent = function (eventType, domEvent) {
  var touches = [];
  if (domEvent.touches != null) {
    for (var i = 0, l = domEvent.touches.length; i < l; ++i) {
      var touch = domEvent.touches[i];
      // there are other touch properties available like radius/rotation/force
      // they might be worth collecting some day, but we have no use right now
      touches.put({
        x: touch.clientX,
        y: touch.clientY
      });
    }
  }
  this.events.put({
    eventType: eventType,
    timestamp: now(),
    touches: touches
  });
};

TouchEventManager.prototype.formatEvents = function (events) {
  return {
    touchStart: events.filter(function (elt) {
      return elt.eventType === 1;
    }),
    touchEnd: events.filter(function (elt) {
      return elt.eventType === 2;
    }),
    touchMove: events.filter(function (elt) {
      return elt.eventType === 3;
    })
  };
};

exports.default = {
  name: 'touchEvents',
  group: 'user',

  setup: function setup(ctx) {
    var self = this;
    this.ctx = ctx;
    this.eventManager = new TouchEventManager(ctx);
    this.lastOOBIndex = 0;

    ctx.global.document.addEventListener('touchstart', function (e) {
      self.eventManager.addTouchEvent(EVENT_TYPES.TOUCH_START, e);
    });

    ctx.global.document.addEventListener('touchmove', function (e) {
      self.eventManager.addTouchEvent(EVENT_TYPES.TOUCH_MOVE, e);
    });

    ctx.global.document.addEventListener('touchend', function (e) {
      self.eventManager.addTouchEvent(EVENT_TYPES.TOUCH_END, e);
    });
  },

  get data() {
    return this.eventManager.formatEvents(this.eventManager.events.toArray());
  }
};

},{"@shape/now":36,"@shape/ring-buffer":37}],75:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'trustedUIEvent',
  group: 'browser',

  data: _nodataSentinel2.default,

  afterReady: function afterReady(ctx) {
    this.data = typeof ctx.global.UIEvent !== 'undefined' && !!ctx.global.document.createEvent('UIEvent').isTrusted;
  }
};

},{"@shape/nodata-sentinel":4}],76:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'videoSupport',
  group: 'browser',

  data: _nodataSentinel2.default,

  afterReady: function afterReady(ctx) {
    var data = {};
    // check support for audio formats via video element's canPlayType method
    var audioTypes = ['mpeg', 'x-mpeg', 'x-mpegurl', 'mp4', 'mp4; codecs=mp4a.40.2', 'ogg; codecs=opus', 'ogg; codecs=speex', 'webm; codecs=vorbis', 'wav; codecs="0"', 'wav; codecs="1"', 'wav; codecs="2"', 'wave', 'wave; codecs=0', 'wave; codecs=1', 'wave; codecs=2'];

    // check support for video formats via video element's canPlayType method
    var videoTypes = ['3gpp; codecs="mp4v.20.8, samr"', 'webm; codecs="vorbis,vp9"', 'mp4; codecs="avc1.42c00d"', 'webm; codecs="vp8, vorbis"', 'ogg; codecs=theora', 'ogg; codecs="theora, speex"', 'mp4; codecs="avc1.64001E, mp4a.40.2"', 'mp4; codecs="mp4v.20.8, mp4a.40.2"', 'mp4; codecs=bogus', 'mp2t; codecs="avc1.42E01E,mp4a.40.2"'];

    try {
      var canPlayType, i, l;
      var video = ctx.global.document.createElement('video');
      for (i = 0, l = videoTypes.length; i < l; ++i) {
        canPlayType = video.canPlayType('video/' + videoTypes[i]);
        data[videoTypes[i]] = canPlayType;
      }
      for (i = 0, l = audioTypes.length; i < l; ++i) {
        canPlayType = video.canPlayType('audio/' + audioTypes[i]);
        data[audioTypes[i]] = canPlayType;
      }
    } catch (e) {}

    this.data = data;
  }
};

},{"@shape/nodata-sentinel":4}],77:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hash = require('@shape/hash');

var _hash2 = _interopRequireDefault(_hash);

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global Float32Array */
function getWebGL(ctx) {
  var c = ctx.global.document.createElement('canvas');
  var gl = null;
  try {
    gl = c.getContext('webgl') || c.getContext('experimental-webgl');
  } catch (ignored) {}
  return gl;
}

function maxAnisotropy(gl) {
  var ext = gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
  return ext ? gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : -1;
}

function getDrawnImageUrl(gl, drawingStyle) {
  // simple vertex shader, fragment shader w/transparency
  var vShaderTemplate = 'attribute vec2 v;varying vec2 tc;void main(){tc=v;gl_Position=vec4(v,0,1);}';
  var fShaderTemplate = 'precision mediump float;varying vec2 tc;void main() {gl_FragColor=vec4(tc,0,.2);}';

  var vertices = new Float32Array([-1 / 3, -1 / 3, -1 / 3, -0, -4 / 3, -4 / 3, 1, 4 / 3, 4 / 3]);

  // create a 2D drawing
  var vertexPosBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // 3 dimensions per point, 3 points
  vertexPosBuffer.itemSize = 3;
  vertexPosBuffer.numItems = 3;

  // compile, attach vertex/fragment shaders to program and link to GPU, then set to be used
  var program = gl.createProgram();
  var vShader = gl.createShader(gl.VERTEX_SHADER);
  var fShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vShader, vShaderTemplate);
  gl.compileShader(vShader);
  gl.shaderSource(fShader, fShaderTemplate);
  gl.compileShader(fShader);
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  program.vertexPosAttrib = gl.getAttribLocation(program, 'v');
  gl.enableVertexAttribArray(program.vertexPosArray);
  // Specify location & type of array of vertices; not normalized, 0 for bytes between attributes & offset of 1st byte
  gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // drawing mode, index to start with, number of vertices to consider
  gl.drawArrays(drawingStyle, 0, vertexPosBuffer.numItems);

  // get URL version of the data to use for hashing
  return gl.canvas != null ? gl.canvas.toDataURL() : '';
}

exports.default = {
  name: 'webgl',
  group: 'computer',

  data: _nodataSentinel2.default,

  afterReady: function afterReady(ctx) {
    var gl = getWebGL(ctx);
    if (!gl) return;

    var data = {};

    var dimensions = [gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE), gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE), gl.getParameter(gl.MAX_VIEWPORT_DIMS)].map(function (dims) {
      return dims != null && typeof dims.join === 'function' ? dims.join('') : '';
    });

    var params = [gl.getParameter(gl.ALPHA_BITS), gl.getParameter(gl.BLUE_BITS), gl.getParameter(gl.GREEN_BITS), gl.getParameter(gl.RED_BITS), gl.getParameter(gl.DEPTH_BITS), gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS), gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE), gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS), gl.getParameter(gl.MAX_RENDERBUFFER_SIZE), gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS), gl.getParameter(gl.MAX_TEXTURE_SIZE), gl.getParameter(gl.MAX_VARYING_VECTORS), gl.getParameter(gl.MAX_VERTEX_ATTRIBS), gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS), gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS), gl.getParameter(gl.RENDERER), gl.getParameter(gl.SHADING_LANGUAGE_VERSION), gl.getParameter(gl.STENCIL_BITS), gl.getParameter(gl.VENDOR), gl.getParameter(gl.VERSION)];

    data.parameters = (0, _hash2.default)([gl.getContextAttributes().antialias, maxAnisotropy(gl), dimensions.join(':'), params.join(':')].join('|'));

    if (!gl.getShaderPrecisionFormat) {
      data.shaderPrecisions = null;
    } else {
      data.shaderPrecisions = (0, _hash2.default)([gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT), gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT), gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT), gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT), gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT), gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT), gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT), gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT), gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT), gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT), gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT), gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT)].map(function (obj) {
        return obj != null ? [obj.precision, obj.rangeMin, obj.rangeMax].join('') : '';
      }).join(':'));
    }

    data.supportedExtensions = (0, _hash2.default)(gl.getSupportedExtensions().join(':'));

    var contextProperties = [];
    /* eslint-disable guard-for-in */
    for (var prop in gl) {
      contextProperties.push(prop);
    }
    /* eslint-enable guard-for-in */

    data.contextProperties = (0, _hash2.default)(contextProperties.join('|'));

    data.drawings = (0, _hash2.default)(getDrawnImageUrl(gl, gl.TRIANGLE_STRIP) + getDrawnImageUrl(gl, null));

    this.data = data;
  }
};

},{"@shape/hash":35,"@shape/nodata-sentinel":4}],78:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'xhrSupport',
  group: 'browser',

  data: _nodataSentinel2.default,

  afterReady: function afterReady(ctx) {
    this.data = 'XMLHttpRequest' in ctx.global && 'response' in new ctx.global.XMLHttpRequest();
  }
};

},{"@shape/nodata-sentinel":4}],79:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodataSentinel = require('@shape/nodata-sentinel');

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'xhr2Support',
  group: 'browser',

  data: _nodataSentinel2.default,

  afterReady: function afterReady(ctx) {
    if ('XMLHttpRequest' in ctx.global) {
      var xhr = new ctx.global.XMLHttpRequest();
      this.data = 'upload' in xhr && 'withCredentials' in xhr;
    } else {
      this.data = false;
    }
  }
};

},{"@shape/nodata-sentinel":4}],80:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sopEnabled = require('./signals/sop-enabled');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_sopEnabled).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/sop-enabled":71}],81:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stacktrace = require('./signals/stacktrace');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_stacktrace).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/stacktrace":72}],82:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _svgSupport = require('./signals/svg-support');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_svgSupport).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/svg-support":73}],83:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _touchEvents = require('./signals/touch-events');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_touchEvents).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/touch-events":74}],84:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _trustedUievent = require('./signals/trusted-uievent');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_trustedUievent).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/trusted-uievent":75}],85:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _videoSupport = require('./signals/video-support');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_videoSupport).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/video-support":76}],86:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webgl = require('./signals/webgl');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_webgl).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/webgl":77}],87:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _xhrSupport = require('./signals/xhr-support');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_xhrSupport).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/xhr-support":78}],88:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _xhr2Support = require('./signals/xhr2-support');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_xhr2Support).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./signals/xhr2-support":79}],89:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = encode;
var F8 = 0xFFFFFFFF;
var F4 = 0xFFFF;
var F2 = 0xFF;

/* eslint-disable no-unused-vars */
var UINT6_BASE = 0x00,
    UINT14_BASE = 0x40,
    NINT4_BASE = 0x80,
    BARRAY4_BASE = 0x90,
    ARRAY5_BASE = 0xA0,
    STR5_BASE = 0xC0,
    FALSE = 0xE0,
    TRUE = 0xE1,
    NULL = 0xE2,
    UNDEFINED = 0xE3,
    UINT16 = 0xE4,
    UINT24 = 0xE5,
    UINT32 = 0xE6,
    UINT64 = 0xE7,
    NINT8 = 0xE8,
    NINT16 = 0xE9,
    NINT32 = 0xEA,
    NINT64 = 0xEB,
    FLOAT32 = 0xEC,
    DOUBLE64 = 0xED,
    TIMESTAMP = 0xEE,
    BINARY_ = 0xEF,
    CSTRING = 0xF0,
    STR8 = 0xF1,
    STR_ = 0xF2,
    STRLU = 0xF3,
    ARRAY8 = 0xF4,
    ARRAY_ = 0xF5,
    BARRAY8 = 0xF6,
    BARRAY_ = 0xF7,
    MAP_ = 0xF8,
    BMAP_ = 0xF9,
    MAPL_ = 0xFA,
    BMAPL_ = 0xFB,
    STRLUT = 0xFE,
    EXTENSION = F2;
/* eslint-enable no-unused-var */

var zeros23 = '00000000000000000000000';
var keysetLUT, keysetList, stringHist, stringPlaceholders;

function byteFromBools(bools, offset) {
  return bools[offset] << 7 | bools[offset + 1] << 6 | bools[offset + 2] << 5 | bools[offset + 3] << 4 | bools[offset + 4] << 3 | bools[offset + 5] << 2 | bools[offset + 6] << 1 | bools[offset + 7];
}

function pushUInt32(n, target) {
  target.push(n >>> 24, n >> 16 & F2, n >> 8 & F2, n & F2);
}

function pushArrayElements(value, target) {
  value.forEach(function (element) {
    encodeValue(element, target);
  });
}

function encodeString(str, target, lut) {
  var index;
  if (lut && (index = lut.indexOf(str)) !== -1) {
    // Using indexOf knowing lut.length <= 255 so it's O(1)
    // todo: consider better ways to do this
    target.push(STRLU, index);
  } else {
    // Note: this encoding fails if value contains an unmatched surrogate half.
    // utf8Ascii will be an ascii representation of UTF-8 bytes
    // ref: http://monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
    var utf8Bytes = [];
    var utf8Ascii = unescape(encodeURIComponent(str));
    var containsNull = false;
    for (var i = 0; i < utf8Ascii.length; ++i) {
      utf8Bytes.push(utf8Ascii.charCodeAt(i));
      if (utf8Bytes[i] === 0) containsNull = true;
    }

    var numBytes = utf8Bytes.length;
    if (numBytes < 32) {
      target.push(STR5_BASE | numBytes);
    } else if (!containsNull) {
      target.push(CSTRING);
      utf8Bytes.push(0);
    } else if (numBytes <= F2) {
      target.push(STR8, numBytes);
    } else {
      target.push(STR_);
      encodeUInt(numBytes, target);
    }
    // todo: find way around blowing callstack with huge strings
    target.push.apply(target, utf8Bytes);
  }
}

function encodeUInt(value, target) {
  if (value <= 63) {
    target.push(value);
  } else if (value <= 0x3FFF) {
    target.push(UINT14_BASE | value >> 8, value & F2);
  } else if (value <= F4) {
    target.push(UINT16, value >> 8, value & F2);
  } else if (value <= 0xFFFFFF) {
    target.push(UINT24, value >> 16, value >> 8 & F2, value & F2);
  } else if (value <= F8) {
    target.push(UINT32);
    pushUInt32(value, target);
  } else {
    target.push(UINT64);
    pushUInt32(value / 0x100000000 & F8, target);
    pushUInt32(value & F8, target);
  }
}

function encodeInteger(value, target) {
  if (value === 0 && 1 / value === -Infinity) {
    target.push(NINT4_BASE);
  } else if (value >= 0) {
    encodeUInt(value, target);
  } else {
    value = -value;
    if (value <= 15) {
      target.push(NINT4_BASE | value);
    } else if (value <= F2) {
      target.push(NINT8, value);
    } else if (value <= F4) {
      target.push(NINT16, value >> 8, value & F2);
    } else if (value <= F8) {
      target.push(NINT32);
      pushUInt32(value, target);
    } else {
      target.push(NINT64);
      pushUInt32(value / 0x100000000 & F8, target);
      pushUInt32(value & F8, target);
    }
  }
}

function encodeDate(value, target) {
  // timestamp: same as uint48, with unix timestamp in ms
  var timestamp = Date.prototype.getTime.call(value);
  var high = timestamp / 0x100000000 & F4;
  target.push(TIMESTAMP, high >> 8, high & F2);
  pushUInt32(timestamp & F8, target);
}

function encodeFloat(value, target) {
  // either float32 or double64, need to figure out which.
  var negative = value < 0;
  if (negative) value = -value;

  var exp;
  var bits = value.toString(2);
  var firstOne = bits.indexOf(1);
  var lastOne = bits.lastIndexOf(1);
  var dot = bits.indexOf('.');

  if (dot === -1) {
    exp = bits.length - 1;
  } else if (dot < firstOne) {
    exp = dot - firstOne;
  } else {
    exp = dot - 1;
  }
  var mantissa = bits.substring(firstOne + 1, lastOne + 1).replace('.', '');

  if (mantissa.length <= 23 && -126 <= exp && exp <= 127) {
    // yay it can fit in a float32
    exp += 127;
    if (negative) exp |= 0x100;
    mantissa = parseInt(mantissa + zeros23.slice(mantissa.length), 2);
    target.push(FLOAT32);
    pushUInt32(mantissa | exp << 23, target);
  } else {
    // need to use double64
    exp += 1023;
    if (negative) exp |= 0x800;

    mantissa = parseInt(mantissa.length > 52 ? mantissa.slice(0, 52) : mantissa + (zeros23 + zeros23 + '000000').slice(mantissa.length), 2);

    target.push(DOUBLE64);
    pushUInt32(mantissa / 0x100000000 & 0xFFFFF | exp << 20, target);
    pushUInt32(mantissa & F8, target);
  }
}

function findIndex(keys, table, list) {
  var keyLengths = keys.map(function (key) {
    return key.length;
  }).join(',');
  var keyConcats = keys.join('');
  if (!table[keyLengths]) {
    table[keyLengths] = {};
  }
  if (typeof table[keyLengths][keyConcats] !== 'number') {
    table[keyLengths][keyConcats] = list.length;
    list.push(keys);
  }
  return table[keyLengths][keyConcats];
}

function buildLUT(hist) {
  // Keep the up-to-255 keys that will save the most space, sorted by savings
  return Object.keys(hist).filter(function (key) {
    return hist[key] >= 2 && key.length * hist[key] >= 8;
  }).map(function (key) {
    // [key, expected savings]
    return [key, (key.length + 1) * hist[key] - (key.length + 1 + 2 * hist[key])];
  }).sort(function (e1, e2) {
    return e2[1] - e1[1];
  }).slice(0, 255).map(function (elt) {
    return elt[0];
  });
}

function encodeValue(value, target) {
  var i, containsOnlyBooleans;
  if (value === false) {
    target.push(FALSE);
  } else if (value === true) {
    target.push(TRUE);
  } else if (value === null) {
    target.push(NULL);
  } else if (typeof value === 'undefined') {
    target.push(UNDEFINED);
  } else if (typeof value === 'number') {
    if (!isFinite(value)) {
      if (value === Infinity) {
        target.push(FLOAT32, 0x7F, 0x80, 0x00, 0x00);
      } else if (value === -Infinity) {
        target.push(FLOAT32, F2, 0x80, 0x00, 0x00);
      } else if (value !== value) {
        target.push(FLOAT32, 0x7F, 0xC0, 0x00, 0x00);
      }
    } else if (Math.floor(value) === value && value < 0xFFFFFFFFFFFFFFFF) {
      encodeInteger(value, target);
    } else {
      encodeFloat(value, target);
    }
  } else if (typeof value === 'string') {
    // Push the string itself for handling later
    if (stringPlaceholders) {
      stringHist[value] = (stringHist[value] || 0) + 1;
      target.push(value);
    } else {
      encodeString(value, target);
    }
  } else if ({}.toString.call(value) === '[object Date]') {
    encodeDate(value, target);
  } else if (Array.isArray(value)) {
    var numElements = value.length;
    containsOnlyBooleans = true;

    containsOnlyBooleans = value.every(function (element) {
      return typeof element === 'boolean';
    });

    if (containsOnlyBooleans && numElements > 0) {
      if (numElements <= 15) {
        target.push(BARRAY4_BASE | numElements);
      } else if (numElements <= 255) {
        target.push(BARRAY8, numElements);
      } else {
        target.push(BARRAY_);
        encodeUInt(numElements, target);
      }
      for (i = 0; i < numElements; i += 8) {
        // note: there's some out of bounds going on here, but it works out like we want
        target.push(byteFromBools(value, i));
      }
    } else {
      if (numElements <= 31) {
        target.push(ARRAY5_BASE | numElements);
      } else if (numElements <= 255) {
        target.push(ARRAY8, numElements);
      } else {
        target.push(ARRAY_);
        encodeUInt(numElements, target);
      }
      pushArrayElements(value, target);
    }
  } else {
    // assumption: anything not in an earlier case can be treated as an object
    var keys = Object.keys(value).sort();
    var numKeys = keys.length;
    var keysetIndex = findIndex(keys, keysetLUT, keysetList);

    containsOnlyBooleans = keys.every(function (key) {
      return typeof value[key] === 'boolean';
    });

    if (containsOnlyBooleans) {
      target.push(BMAP_);
      encodeUInt(keysetIndex, target);

      var b = [0, 0, 0, 0, 0, 0, 0, 0];
      for (i = 0; i < numKeys; i += 8) {
        for (var j = 0; j < 8; ++j) {
          b[j] = i + j < numKeys && value[keys[i + j]];
        }
        target.push(byteFromBools(b, 0));
      }
    } else {
      target.push(MAP_);
      encodeUInt(keysetIndex, target);

      keys.forEach(function (key) {
        encodeValue(value[key], target);
      });
    }
  }
  return target;
}

function encode(value) {
  var output = [];
  keysetLUT = {};
  keysetList = [];
  stringHist = {};
  stringPlaceholders = true;

  var data = encodeValue(value, []);
  var keysetData = encodeValue(keysetList, []);
  var stringLUT = buildLUT(stringHist);

  stringPlaceholders = false;

  if (stringLUT.length > 0 || keysetList.length > 0) {
    output.push(STRLUT);
    output.push(stringLUT.length);
    pushArrayElements(stringLUT, output);
    data = keysetData.concat(data);
  }

  data.forEach(function (piece) {
    if (typeof piece === 'string') {
      encodeString(piece, output, stringLUT);
    } else {
      output.push(piece);
    }
  });

  return output;
}

},{}],90:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = urlNormalize;
function urlNormalize(url) {
  var a = document.createElement('a');

  a.href = url || window.location + '';

  // this apparent no-op is actually for getting ie9 to work with relative urls.
  // http://stackoverflow.com/a/13405933
  if (a.host === '') {
    a.href = a.href;
  }

  return {
    protocol: a.protocol.slice(0, a.protocol.length - 1),
    hostname: a.hostname,
    pathname: a.pathname[0] === '/' ? a.pathname : '/' + a.pathname,
    search: a.search.slice(1)
  };
}

},{}],91:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _onready = require("@shape/onready");

var _onready2 = _interopRequireDefault(_onready);

var _signalManager = require("./signal-manager");

var _signalManager2 = _interopRequireDefault(_signalManager);

var _getGlobal = require("@shape/get-global");

var _getGlobal2 = _interopRequireDefault(_getGlobal);

var _nodataSentinel = require("@shape/nodata-sentinel");

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

var _pick = require("@shape/pick");

var _pick2 = _interopRequireDefault(_pick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Client = function () {
  function Client(config) {
    _classCallCheck(this, Client);

    var global = (0, _getGlobal2.default)(config.global);
    if (global[config.stateKey]) {
      this.alreadyLoaded = true;
      return;
    }
    Object.defineProperty(global, config.stateKey, {
      value: true,
      enumerable: false,
      configurable: false,
      writable: false
    });

    var context = {
      global: global,
      csp: {
        scriptNonce: config.cspScriptNonce,
        styleNonce: config.cspStyleNonce
      }
    };

    if (config.performance) {
      this.perf = new config.performance(global);
    } else {
      this.perf = {
        mark: function mark() {},
        measure: function measure() {},
        getEntriesByType: function getEntriesByType() {
          return [];
        },
        getEntriesByName: function getEntriesByName() {
          return [];
        }
      };
    }

    this.config = config;
    this.global = global;
    this.transmissionHandler = new config.transmissionHandler(this.config.transmissionConfig, context, this.getData.bind(this));
    this.signalManager = new _signalManager2.default(config.signals, {
      userEventLimit: config.userEventLimit,
      maxErrorsToRecord: config.maxErrorsToRecord,
      perf: this.perf
    }, context);
  }

  _createClass(Client, [{
    key: '_getDebugInfo',
    value: function _getDebugInfo() {
      var info = {};
      info.matchers = this.config.transmissionConfig.hookEndpoints;
      info.instrumentation = this.transmissionHandler._getInstrumentation();
      info.data = this.getData();
      info.perf = this.perf.getEntriesByType('measure');
      return info;
    }
  }, {
    key: 'init',
    value: function init() {
      if (this.alreadyLoaded) return;
      this.perf.mark('init:start');

      this.transmissionHandler.init();
      this.signalManager.init();

      (0, _onready2.default)(this.afterReady.bind(this));
      this.perf.measure('Client::init', 'init:start');
    }
  }, {
    key: 'afterReady',
    value: function afterReady() {
      this.perf.mark('afterReady:start');
      this.transmissionHandler.afterReady();
      this.signalManager.afterReady();
      this.perf.measure('Client::afterReady', 'afterReady:start');
    }
  }, {
    key: 'getData',
    value: function getData() {
      var data = {};
      var hasData = false;
      this.perf.mark('getData:start');

      var signalData = this.signalManager.getData();
      if (signalData !== _nodataSentinel2.default) {
        hasData = true;
        data.signals = signalData;
      }

      if (this.global.performance && this.global.performance.timing) {
        hasData = true;
        data.performance = (0, _pick2.default)(['domComplete', 'domContentLoadedEventEnd', 'domContentLoadedEventStart', 'domInteractive', 'domLoading', 'requestStart', 'responseStart'], this.global.performance.timing);
      }

      this.perf.measure('Client::getData', 'getData:start');
      return hasData ? data : _nodataSentinel2.default;
    }
  }]);

  return Client;
}();

exports.default = Client;

},{"./signal-manager":95,"@shape/get-global":3,"@shape/nodata-sentinel":4,"@shape/onready":5,"@shape/pick":7}],92:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Encode;

var _encoder = require('@shape/super-pack/src/encoder');

var _encoder2 = _interopRequireDefault(_encoder);

var _base = require('@shape/base64');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Encode(config) {
  this.config = config;
}

Encode.prototype.encode = function (data) {
  return (0, _base.encode)((0, _encoder2.default)(data), this.config.base64Alphabet);
};

},{"@shape/base64":2,"@shape/super-pack/src/encoder":89}],93:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FetchManager;
function FetchManager() {}

FetchManager.instrument = function (config, context, shouldHook, getHookData) {
  FetchManager.config = config;
  FetchManager.context = context;
  FetchManager.shouldHook = shouldHook;
  FetchManager.getHookData = getHookData;

  var originalFetch = context.global.fetch;
  if (typeof originalFetch === 'function') {
    fetch = function fetch(input, init) {
      // Always create a request, to unify cases of input being a string or Request and of init being present or not
      var ourRequest = new Request(input, init);
      var headerChunkSize = FetchManager.config.headerChunkSize;

      var reqDetails = {
        url: ourRequest.url,
        method: ourRequest.method
      };
      if (FetchManager.shouldHook(reqDetails)) {
        var data = FetchManager.getHookData();
        if (data) {
          for (var prop in data) {
            if ({}.hasOwnProperty.call(data, prop)) {
              var payload = data[prop];

              var headerName = FetchManager.config.headerNamePrefix + prop;
              ourRequest.headers.set(headerName, payload.slice(0, headerChunkSize));

              if (payload.length > headerChunkSize) {
                var sliceStart = headerChunkSize;
                for (var chunk = 0; sliceStart < payload.length; chunk++) {
                  ourRequest.headers.set(headerName + chunk, payload.slice(sliceStart, sliceStart += headerChunkSize));
                }
              }
            }
          }
        }
      }

      return originalFetch(ourRequest);
    };
  }
};

},{}],94:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FormManager;

var _ringBuffer = require('@shape/ring-buffer');

var _ringBuffer2 = _interopRequireDefault(_ringBuffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FormManager(config, context, shouldHook, getHookData) {
  this.headerNamePrefix = config.headerNamePrefix;
  this.instrumentationStateKey = config.instrumentationStateKey;
  this.context = context;
  this.shouldHook = shouldHook;
  this.getHookData = getHookData;
  this.instrumentedForms = new _ringBuffer2.default(20);
}

FormManager.prototype.onSubmit = function (e) {
  if (!e.target) return;
  var reqDetails = {
    url: e.target.action,
    method: e.target.method
  };

  if (this.shouldHook(reqDetails)) {
    var data = this.getHookData();
    if (data) {
      for (var prop in data) {
        if ({}.hasOwnProperty.call(data, prop)) {
          var propName = this.headerNamePrefix + prop;

          var el = e.target.querySelector('input[type=hidden][name=' + propName + ']');
          if (el != null) {
            // a hidden input with our propName has already been added to this form, update it
            el.value = data[prop];
          } else {
            var input = this.context.global.document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('hidden', true);
            input.setAttribute('name', propName);
            input.setAttribute('value', data[prop]);
            input.setAttribute('style', 'display: none;');
            e.target.appendChild(input);
          }
        }
      }
    }
  }
};

FormManager.prototype.instrumentForm = function (form) {
  // Need to do our own idempotency for .submit override
  if (form[this.instrumentationStateKey] != null) {
    return;
  }
  form[this.instrumentationStateKey] = true;

  if (this.shouldHook({ url: form.action, method: form.method })) {
    this.instrumentedForms.put(form);
  }

  form.addEventListener('submit', this.onSubmit.bind(this));

  var oldSubmit = form.submit;
  if (typeof oldSubmit !== 'function') {
    var descriptor = Object.getOwnPropertyDescriptor(form, 'submit');
    if (descriptor && descriptor.writable) {
      form.submit = this.onSubmit.bind(this, { target: form });
    }
  } else {
    var self = this;
    form.submit = function () {
      self.onSubmit({ target: form });
      oldSubmit.apply(this, arguments);
    };
  }
};

FormManager.prototype.instrument = function (forms) {
  if (forms == null) forms = this.context.global.document.forms;
  forms = forms || this.context.global.document.getElementsByTagName('form');
  for (var i = 0; i < forms.length; ++i) {
    this.instrumentForm(forms[i]);
  }
};

},{"@shape/ring-buffer":8}],95:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodataSentinel = require("@shape/nodata-sentinel");

var _nodataSentinel2 = _interopRequireDefault(_nodataSentinel);

var _ringBuffer = require("@shape/ring-buffer");

var _ringBuffer2 = _interopRequireDefault(_ringBuffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function urlFilter(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/(?:(?:https?|file):\/)?\/[^/]*\/.*?(?:(:\d+){1,2})/ig, 'URL');
}

var SignalManager = function () {
  function SignalManager(signals, config, ctx) {
    _classCallCheck(this, SignalManager);

    this.ctx = ctx || {};
    this.ctx.userEventLimit = config.userEventLimit || 30;
    this.signals = signals || [];
    this.errors = new _ringBuffer2.default(config.maxErrorsToRecord || 2);
    this.perf = config.perf;
  }

  _createClass(SignalManager, [{
    key: 'init',
    value: function init() {
      for (var i = 0; i < this.signals.length; ++i) {
        var signal = this.signals[i];
        var signalMark = 'signal:' + signal.name;
        this.perf.mark(signalMark);
        try {
          if (typeof signal.setup === 'function') {
            signal.setup(this.ctx);
          }
          this.perf.measure('setup:' + signal.name, signalMark);
        } catch (e) {
          // Prevent one signal's failure from blowing up the rest. Record the error.
          this.recordError(signal.name, 'setup', e);
        }
      }
    }
  }, {
    key: 'afterReady',
    value: function afterReady(cb) {
      var i = this.signals.length,
          self = this;
      this.signals.forEach(function (signal) {
        setTimeout(function () {
          --i;
          var signalMark = 'signal:' + signal.name;
          self.perf.mark(signalMark);
          try {
            if (typeof signal.afterReady === 'function') {
              signal.afterReady(self.ctx);
            }
            self.perf.measure('afterReady:' + signal.name, signalMark);
          } catch (e) {
            // Prevent one signal's failure from blowing up the rest. Record the error.
            self.recordError(signal.name, 'afterReady', e);
          }
          if (i === 0 && typeof cb === 'function') {
            setTimeout(cb, 0);
          }
        }, 0);
      });
    }
  }, {
    key: 'recordError',
    value: function recordError(signalName, stage, e) {
      this.errors.put({
        signalName: signalName,
        stage: stage,
        name: e.name,
        description: e.description,
        message: e.message,
        stack: urlFilter(e.stack),
        stacktrace: e.stacktrace,
        num: e.number
      });
    }
  }, {
    key: 'getData',
    value: function getData() {
      var data = {};
      var value;
      var signal;
      var hasData = false;

      for (var i = 0; i < this.signals.length; ++i) {
        signal = this.signals[i];

        try {
          var signalMark = 'signal:' + signal.name;
          this.perf.mark(signalMark);
          value = signal.data;
          if (value !== _nodataSentinel2.default) {
            hasData = true;
            if (signal.group && typeof signal.group === 'string') {
              if (!data[signal.group]) {
                data[signal.group] = {};
              }
              data[signal.group][signal.name] = value;
            } else {
              data[signal.name] = value;
            }
          }
          this.perf.measure('getData:' + signal.name, signalMark);
        } catch (e) {
          // Prevent one signal's failure from blowing up the rest. Record the error.
          this.recordError(this.signals[i].name, 'getData', e);
        }
      }

      data.errors = this.errors.toArray();

      return hasData || data.errors.length ? data : _nodataSentinel2.default;
    }
  }]);

  return SignalManager;
}();

exports.default = SignalManager;

},{"@shape/nodata-sentinel":4,"@shape/ring-buffer":8}],96:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = StandardTransmissionHandler;

var _encoder = require('../encoder');

var _encoder2 = _interopRequireDefault(_encoder);

var _xhrManager = require('../xhr-manager');

var _xhrManager2 = _interopRequireDefault(_xhrManager);

var _fetchManager = require('../fetch-manager');

var _fetchManager2 = _interopRequireDefault(_fetchManager);

var _formManager = require('../form-manager');

var _formManager2 = _interopRequireDefault(_formManager);

var _urlNormalize = require('@shape/url-normalize');

var _urlNormalize2 = _interopRequireDefault(_urlNormalize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function StandardTransmissionHandler(config, context, getData) {
  this.getData = getData;
  this.config = config;
  this.context = context;
  this.encoder = new _encoder2.default({
    base64Alphabet: config.base64Alphabet
  });
}

function matchUrl(urlMatcher, urlToMatch) {
  var urlParts = (0, _urlNormalize2.default)(urlToMatch);

  return checkMatches(urlMatcher.protocol, urlParts.protocol) && checkMatches(urlMatcher.hostname, urlParts.hostname) && checkMatches(urlMatcher.pathname, urlParts.pathname) && checkMatches(urlMatcher.search, urlParts.search);
}

function checkMatches(matches, toMatch) {
  var doesMatch = function doesMatch(match) {
    return checkMatch(match, toMatch);
  };

  switch (matches.matchesType) {
    case 'ANYTHING':
      return true;
    case 'ALL':
      return matches.matchers.every(doesMatch);
    case 'ANY':
      return matches.matchers.some(doesMatch);
    case 'NONE':
      return !matches.matchers.some(doesMatch);
    default:
      return false;
  }
}

function checkMatch(match, toMatch) {
  // if isInsensitive, match.str will have already been toLowerCase'd
  if (match.isInsensitive) toMatch = toMatch.toLowerCase();

  var matched;
  switch (match.matchType) {
    case 'IS':
      matched = toMatch === match.str;
      break;
    case 'STARTSWITH':
      matched = toMatch.slice(0, match.str.length) === match.str;
      break;
    case 'CONTAINS':
      matched = toMatch.indexOf(match.str) !== -1;
      break;
    case 'ENDSWITH':
      matched = toMatch.slice(-match.str.length) === match.str;
      break;
    default:
      return false;
  }

  return match.isNegated ? !matched : matched;
}

function shouldHook(req) {
  return this.config.hookEndpoints.some(function (hookEndpoint) {
    return hookEndpoint.httpMethods.some(function (method) {
      return method.toLowerCase() === 'any' || method.toLowerCase() === req.method.toLowerCase();
    }) && matchUrl(hookEndpoint.urlMatcher, req.url);
  });
}

function getHookData() {
  var ret = {};
  ret[this.config.uuidTokenKey] = this.config.uuidToken;
  ret[this.config.payloadKey] = this.encoder.encode(this.getData());
  return ret;
}

StandardTransmissionHandler.prototype.init = function () {
  var self = this;
  _xhrManager2.default.instrument(this.config, this.context, shouldHook.bind(this), getHookData.bind(this));
  _fetchManager2.default.instrument(this.config, this.context, shouldHook.bind(this), getHookData.bind(this));
  this.formManager = new _formManager2.default(this.config, this.context, shouldHook.bind(this), getHookData.bind(this));

  if (typeof MutationObserver !== 'undefined') {
    var mutationConfig = {
      childList: true, // watch child nodes
      subtree: true // watch decendent nodes
    };
    new MutationObserver(function () {
      // Rather than compile the list of changed/added forms, just
      // reinstrument the live NodeList document.forms since checking
      // if we have reinstrumented is trivial and the mutations/addedNodes can be huge.
      self.formManager.instrument(self.context.global.document.forms);
    }).observe(self.context.global.document.documentElement, mutationConfig);
  } else {
    setInterval(this.formManager.instrument.bind(this.formManager), this.config.instrumentationPollInterval);
  }
  this.formManager.instrument();
};

StandardTransmissionHandler.prototype.afterReady = function () {
  this.formManager.instrument();
};

StandardTransmissionHandler.prototype._getInstrumentation = function () {
  return this.formManager.instrumentedForms.toArray();
};

},{"../encoder":92,"../fetch-manager":93,"../form-manager":94,"../xhr-manager":97,"@shape/url-normalize":90}],97:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = XhrManager;
function XhrManager() {}

XhrManager.attachData = function (xhr) {
  var state = xhr[XhrManager.config.xhrStateKey];
  var headerChunkSize = XhrManager.config.headerChunkSize;

  var reqDetails = {
    url: state.url,
    method: state.method.toLowerCase()
  };

  if (XhrManager.shouldHook(reqDetails)) {
    var data = XhrManager.getHookData();
    if (data) {
      for (var prop in data) {
        if (data.hasOwnProperty(prop)) {
          var payload = data[prop];

          var headerName = XhrManager.config.headerNamePrefix + prop;
          xhr.setRequestHeader(headerName, payload.slice(0, headerChunkSize));

          if (payload.length > headerChunkSize) {
            var sliceStart = headerChunkSize;
            for (var chunk = 0; sliceStart < payload.length; chunk++) {
              xhr.setRequestHeader(headerName + chunk, payload.slice(sliceStart, sliceStart += headerChunkSize));
            }
          }
        }
      }
    }
  }
};

XhrManager.iSend = function (original, body) {
  var state = this[XhrManager.config.xhrStateKey];
  state.body = body;

  XhrManager.attachData(this);

  original.open.apply(this, [state.method, state.url].concat(Array.prototype.slice.call(state.openArgs, 2)));

  // NOTE: Number of headers can change if multiple XHR overrides in same
  //       web document. Caching header count is intentional.
  var headerCount = state.setRequestHeaderArgs.length;

  for (var i = 0; i < headerCount; i++) {
    original.setRequestHeader.apply(this, state.setRequestHeaderArgs[i]);
  }
  state.setRequestHeaderArgs = [];

  original.send.call(this, state.body);
};

XhrManager.iSetRequestHeader = function (header, value) {
  var state = this[XhrManager.config.xhrStateKey];

  // Defer setRequestHeader calls ... they must occur *after* XMLHttpRequest.prototype.open

  // NOTE: If multiple XHR overrides exist in same document (occurs via AJAX
  //       content injection), may end up adding headers to setRequestHeaderArgs
  //       multiple times.
  state.setRequestHeaderArgs.push(Array.prototype.slice.call(arguments, 0));

  // NOTE: _state.headers are for inspection only; we don't use this object
  //       to reconstruct the outbound headers - we use the original function
  //       arguments (stored in _state.headerCalls) so as to preserve case

  // cast null/undefined values to strings first (null/null is a valid
  // set of arguments, and will be accepted by native setRequestHeader)
  state.headers[(header + '').toLowerCase()] = (value + '').toLowerCase();
};

// eslint-disable-next-line no-unused-vars
XhrManager.iOpen = function (method, url, async, user, password) {
  var state = this[XhrManager.config.xhrStateKey];
  state.openArgs = Array.prototype.slice.call(arguments, 0);
  state.method = method;
  state.url = url;
};

// XMLHttpRequest wrapper ... creates state variable on native XHR object
// for tracking method calls
XhrManager.iConstruct = function () {
  var xhr = new XhrManager.Xhr();

  // xhrStateKey is randomly substituted per-transformation. Having a different
  // xhrStateKey name for each transformed page/fragment is *intentional*. This allows
  // for multiple XHR overrides to exist simultaneously, without inter-mingling
  // state.

  xhr[XhrManager.config.xhrStateKey] = {
    openArgs: null, // xhr.open call arguments
    method: null, // method being used (GET, POST, ...)
    url: null, // target url

    headers: {}, // dict of xhr.setRequestHeader calls (lower case keys)
    setRequestHeaderArgs: [] // array of xhr.setRequestHeader call arguments
  };
  return xhr;
};

XhrManager.instrument = function (config, context, shouldHook, getHookData) {
  XhrManager.config = config;
  XhrManager.context = context;
  XhrManager.shouldHook = shouldHook;
  XhrManager.getHookData = getHookData;

  var Xhr = XhrManager.Xhr = XhrManager.context.global.XMLHttpRequest;
  if (Xhr && Xhr.prototype && Xhr.prototype.send) {
    XhrManager.iConstruct.prototype = Xhr.prototype;
    XhrManager.context.global.XMLHttpRequest = this.iConstruct;

    var original = {
      open: Xhr.prototype.open,
      setRequestHeader: Xhr.prototype.setRequestHeader,
      send: Xhr.prototype.send
    };

    Xhr.prototype.open = XhrManager.iOpen;
    Xhr.prototype.setRequestHeader = XhrManager.iSetRequestHeader;
    Xhr.prototype.send = function (body) {
      XhrManager.iSend.call(this, original, body);
    };
  }
};

},{}],98:[function(require,module,exports){
'use strict';

var _client = require('../src/client');

var _client2 = _interopRequireDefault(_client);

var _standard = require('../src/transmission/standard');

var _standard2 = _interopRequireDefault(_standard);

var _activexSupport = require('@shape/signals/activex-support');

var _activexSupport2 = _interopRequireDefault(_activexSupport);

var _audioSupport = require('@shape/signals/audio-support');

var _audioSupport2 = _interopRequireDefault(_audioSupport);

var _audiocontextAnalyser = require('@shape/signals/audiocontext-analyser');

var _audiocontextAnalyser2 = _interopRequireDefault(_audiocontextAnalyser);

var _audiocontextDynamicscompressor = require('@shape/signals/audiocontext-dynamicscompressor');

var _audiocontextDynamicscompressor2 = _interopRequireDefault(_audiocontextDynamicscompressor);

var _browserPlugins = require('@shape/signals/browser-plugins');

var _browserPlugins2 = _interopRequireDefault(_browserPlugins);

var _canvasSupport = require('@shape/signals/canvas-support');

var _canvasSupport2 = _interopRequireDefault(_canvasSupport);

var _chromeWebstore = require('@shape/signals/chrome-webstore');

var _chromeWebstore2 = _interopRequireDefault(_chromeWebstore);

var _createElement = require('@shape/signals/create-element');

var _createElement2 = _interopRequireDefault(_createElement);

var _cssSupport = require('@shape/signals/css-support');

var _cssSupport2 = _interopRequireDefault(_cssSupport);

var _dateString = require('@shape/signals/date-string');

var _dateString2 = _interopRequireDefault(_dateString);

var _detectFonts = require('@shape/signals/detect-fonts');

var _detectFonts2 = _interopRequireDefault(_detectFonts);

var _detectFonts3 = require('@shape/signals/detect-fonts2');

var _detectFonts4 = _interopRequireDefault(_detectFonts3);

var _hardwareConcurrency = require('@shape/signals/hardware-concurrency');

var _hardwareConcurrency2 = _interopRequireDefault(_hardwareConcurrency);

var _imgSrcset = require('@shape/signals/img-srcset');

var _imgSrcset2 = _interopRequireDefault(_imgSrcset);

var _javaSupport = require('@shape/signals/java-support');

var _javaSupport2 = _interopRequireDefault(_javaSupport);

var _keyboardEvents = require('@shape/signals/keyboard-events');

var _keyboardEvents2 = _interopRequireDefault(_keyboardEvents);

var _mathSupport = require('@shape/signals/math-support');

var _mathSupport2 = _interopRequireDefault(_mathSupport);

var _mathmlSupport = require('@shape/signals/mathml-support');

var _mathmlSupport2 = _interopRequireDefault(_mathmlSupport);

var _maxTouchPoints = require('@shape/signals/max-touch-points');

var _maxTouchPoints2 = _interopRequireDefault(_maxTouchPoints);

var _mediaDeviceId = require('@shape/signals/media-device-id');

var _mediaDeviceId2 = _interopRequireDefault(_mediaDeviceId);

var _mouseEvents = require('@shape/signals/mouse-events');

var _mouseEvents2 = _interopRequireDefault(_mouseEvents);

var _orientationEvents = require('@shape/signals/orientation-events');

var _orientationEvents2 = _interopRequireDefault(_orientationEvents);

var _performanceSupport = require('@shape/signals/performance-support');

var _performanceSupport2 = _interopRequireDefault(_performanceSupport);

var _propertyCheck = require('@shape/signals/property-check');

var _propertyCheck2 = _interopRequireDefault(_propertyCheck);

var _propertyValues = require('@shape/signals/property-values');

var _propertyValues2 = _interopRequireDefault(_propertyValues);

var _screenOverride = require('@shape/signals/screen-override');

var _screenOverride2 = _interopRequireDefault(_screenOverride);

var _sopEnabled = require('@shape/signals/sop-enabled');

var _sopEnabled2 = _interopRequireDefault(_sopEnabled);

var _stacktrace = require('@shape/signals/stacktrace');

var _stacktrace2 = _interopRequireDefault(_stacktrace);

var _svgSupport = require('@shape/signals/svg-support');

var _svgSupport2 = _interopRequireDefault(_svgSupport);

var _touchEvents = require('@shape/signals/touch-events');

var _touchEvents2 = _interopRequireDefault(_touchEvents);

var _trustedUievent = require('@shape/signals/trusted-uievent');

var _trustedUievent2 = _interopRequireDefault(_trustedUievent);

var _videoSupport = require('@shape/signals/video-support');

var _videoSupport2 = _interopRequireDefault(_videoSupport);

var _webgl = require('@shape/signals/webgl');

var _webgl2 = _interopRequireDefault(_webgl);

var _xhrSupport = require('@shape/signals/xhr-support');

var _xhrSupport2 = _interopRequireDefault(_xhrSupport);

var _xhr2Support = require('@shape/signals/xhr2-support');

var _xhr2Support2 = _interopRequireDefault(_xhr2Support);

var _performancePolyfill = require('@shape/performance-polyfill');

var _performancePolyfill2 = _interopRequireDefault(_performancePolyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = new _client2.default({
  performance: _performancePolyfill2.default,
  transmissionHandler: _standard2.default,
  transmissionConfig: {
    payloadKey: 'payload',
    headerChunkSize: 8000,
    base64Alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=',
    xhrStateKey: 'xhrStateKey',
    uuidTokenKey: 'uuidTokenKey',
    instrumentationPollInterval: 100,
    instrumentationStateKey: 'instrumentationStateKey',
    uuidToken: 'uuidtoken(obviously fake)',
    headerNamePrefix: 'SC-',
    hookEndpoints: [{
      httpMethods: ['any'],
      urlMatcher: {
        protocol: { matchesType: 'ANYTHING' },
        hostname: { matchesType: 'ANYTHING' },
        pathname: { matchesType: 'ANYTHING' },
        search: { matchesType: 'ANYTHING' }
      }
    }]
  },
  stateKey: 'shape-harness',
  signals: [_activexSupport2.default, _audioSupport2.default, _audiocontextAnalyser2.default, _audiocontextDynamicscompressor2.default, _browserPlugins2.default, _canvasSupport2.default, _chromeWebstore2.default, _createElement2.default, _cssSupport2.default, _dateString2.default, _detectFonts2.default, _detectFonts4.default, _hardwareConcurrency2.default, _imgSrcset2.default, _javaSupport2.default, _keyboardEvents2.default, _mathSupport2.default, _mathmlSupport2.default, _maxTouchPoints2.default, _mediaDeviceId2.default, _mouseEvents2.default, _orientationEvents2.default, _performanceSupport2.default, _propertyCheck2.default, _propertyValues2.default, _screenOverride2.default, _sopEnabled2.default, _stacktrace2.default, _svgSupport2.default, _touchEvents2.default, _trustedUievent2.default, _videoSupport2.default, _webgl2.default, _xhrSupport2.default, _xhr2Support2.default]
});

client.init();

window.client = client;


},{"../src/client":91,"../src/transmission/standard":96,"@shape/performance-polyfill":6,"@shape/signals/activex-support":9,"@shape/signals/audio-support":10,"@shape/signals/audiocontext-analyser":11,"@shape/signals/audiocontext-dynamicscompressor":12,"@shape/signals/browser-plugins":13,"@shape/signals/canvas-support":14,"@shape/signals/chrome-webstore":15,"@shape/signals/create-element":16,"@shape/signals/css-support":17,"@shape/signals/date-string":18,"@shape/signals/detect-fonts":19,"@shape/signals/detect-fonts2":20,"@shape/signals/hardware-concurrency":21,"@shape/signals/img-srcset":22,"@shape/signals/java-support":23,"@shape/signals/keyboard-events":24,"@shape/signals/math-support":28,"@shape/signals/mathml-support":29,"@shape/signals/max-touch-points":30,"@shape/signals/media-device-id":31,"@shape/signals/mouse-events":32,"@shape/signals/orientation-events":38,"@shape/signals/performance-support":39,"@shape/signals/property-check":40,"@shape/signals/property-values":41,"@shape/signals/screen-override":42,"@shape/signals/sop-enabled":80,"@shape/signals/stacktrace":81,"@shape/signals/svg-support":82,"@shape/signals/touch-events":83,"@shape/signals/trusted-uievent":84,"@shape/signals/video-support":85,"@shape/signals/webgl":86,"@shape/signals/xhr-support":87,"@shape/signals/xhr2-support":88}]},{},[98]);
