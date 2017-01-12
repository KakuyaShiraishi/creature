(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){
/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

var TWEEN = TWEEN || (function () {

	var _tweens = [];

	return {

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		add: function (tween) {

			_tweens.push(tween);

		},

		remove: function (tween) {

			var i = _tweens.indexOf(tween);

			if (i !== -1) {
				_tweens.splice(i, 1);
			}

		},

		update: function (time, preserve) {

			if (_tweens.length === 0) {
				return false;
			}

			var i = 0;

			time = time !== undefined ? time : TWEEN.now();

			while (i < _tweens.length) {

				if (_tweens[i].update(time) || preserve) {
					i++;
				} else {
					_tweens.splice(i, 1);
				}

			}

			return true;

		}
	};

})();


// Include a performance.now polyfill
(function () {
	// In node.js, use process.hrtime.
	if (this.window === undefined && this.process !== undefined) {
		TWEEN.now = function () {
			var time = process.hrtime();

			// Convert [seconds, microseconds] to milliseconds.
			return time[0] * 1000 + time[1] / 1000;
		};
	}
	// In a browser, use window.performance.now if it is available.
	else if (this.window !== undefined &&
	         window.performance !== undefined &&
		 window.performance.now !== undefined) {

		// This must be bound, because directly assigning this function
		// leads to an invocation exception in Chrome.
		TWEEN.now = window.performance.now.bind(window.performance);
	}
	// Use Date.now if it is available.
	else if (Date.now !== undefined) {
		TWEEN.now = Date.now;
	}
	// Otherwise, use 'new Date().getTime()'.
	else {
		TWEEN.now = function () {
			return new Date().getTime();
		};
	}
})();


TWEEN.Tween = function (object) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _yoyo = false;
	var _isPlaying = false;
	var _reversed = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;
	var _onStopCallback = null;

	// Set all starting values present on the target object
	for (var field in object) {
		_valuesStart[field] = parseFloat(object[field], 10);
	}

	this.to = function (properties, duration) {

		if (duration !== undefined) {
			_duration = duration;
		}

		_valuesEnd = properties;

		return this;

	};

	this.start = function (time) {

		TWEEN.add(this);

		_isPlaying = true;

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : TWEEN.now();
		_startTime += _delayTime;

		for (var property in _valuesEnd) {

			// Check if an Array was provided as property value
			if (_valuesEnd[property] instanceof Array) {

				if (_valuesEnd[property].length === 0) {
					continue;
				}

				// Create a local copy of the Array with the start value at the front
				_valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);

			}

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (_valuesStart[property] === undefined) {
				continue;
			}

			_valuesStart[property] = _object[property];

			if ((_valuesStart[property] instanceof Array) === false) {
				_valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[property] = _valuesStart[property] || 0;

		}

		return this;

	};

	this.stop = function () {

		if (!_isPlaying) {
			return this;
		}

		TWEEN.remove(this);
		_isPlaying = false;

		if (_onStopCallback !== null) {
			_onStopCallback.call(_object);
		}

		this.stopChainedTweens();
		return this;

	};

	this.stopChainedTweens = function () {

		for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
			_chainedTweens[i].stop();
		}

	};

	this.delay = function (amount) {

		_delayTime = amount;
		return this;

	};

	this.repeat = function (times) {

		_repeat = times;
		return this;

	};

	this.yoyo = function (yoyo) {

		_yoyo = yoyo;
		return this;

	};


	this.easing = function (easing) {

		_easingFunction = easing;
		return this;

	};

	this.interpolation = function (interpolation) {

		_interpolationFunction = interpolation;
		return this;

	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;

	};

	this.onStart = function (callback) {

		_onStartCallback = callback;
		return this;

	};

	this.onUpdate = function (callback) {

		_onUpdateCallback = callback;
		return this;

	};

	this.onComplete = function (callback) {

		_onCompleteCallback = callback;
		return this;

	};

	this.onStop = function (callback) {

		_onStopCallback = callback;
		return this;

	};

	this.update = function (time) {

		var property;
		var elapsed;
		var value;

		if (time < _startTime) {
			return true;
		}

		if (_onStartCallbackFired === false) {

			if (_onStartCallback !== null) {
				_onStartCallback.call(_object);
			}

			_onStartCallbackFired = true;

		}

		elapsed = (time - _startTime) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value = _easingFunction(elapsed);

		for (property in _valuesEnd) {

			// Don't update properties that do not exist in the source object
			if (_valuesStart[property] === undefined) {
				continue;
			}

			var start = _valuesStart[property] || 0;
			var end = _valuesEnd[property];

			if (end instanceof Array) {

				_object[property] = _interpolationFunction(end, value);

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if (typeof (end) === 'string') {

					if (end.charAt(0) === '+' || end.charAt(0) === '-') {
						end = start + parseFloat(end, 10);
					} else {
						end = parseFloat(end, 10);
					}
				}

				// Protect against non numeric properties.
				if (typeof (end) === 'number') {
					_object[property] = start + (end - start) * value;
				}

			}

		}

		if (_onUpdateCallback !== null) {
			_onUpdateCallback.call(_object, value);
		}

		if (elapsed === 1) {

			if (_repeat > 0) {

				if (isFinite(_repeat)) {
					_repeat--;
				}

				// Reassign starting values, restart by making startTime = now
				for (property in _valuesStartRepeat) {

					if (typeof (_valuesEnd[property]) === 'string') {
						_valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property], 10);
					}

					if (_yoyo) {
						var tmp = _valuesStartRepeat[property];

						_valuesStartRepeat[property] = _valuesEnd[property];
						_valuesEnd[property] = tmp;
					}

					_valuesStart[property] = _valuesStartRepeat[property];

				}

				if (_yoyo) {
					_reversed = !_reversed;
				}

				_startTime = time + _delayTime;

				return true;

			} else {

				if (_onCompleteCallback !== null) {
					_onCompleteCallback.call(_object);
				}

				for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
					// Make the chained tweens start exactly at the time they should,
					// even if the `update()` method was called way past the duration of the tween
					_chainedTweens[i].start(_startTime + _duration);
				}

				return false;

			}

		}

		return true;

	};

};


TWEEN.Easing = {

	Linear: {

		None: function (k) {

			return k;

		}

	},

	Quadratic: {

		In: function (k) {

			return k * k;

		},

		Out: function (k) {

			return k * (2 - k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k;
			}

			return - 0.5 * (--k * (k - 2) - 1);

		}

	},

	Cubic: {

		In: function (k) {

			return k * k * k;

		},

		Out: function (k) {

			return --k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k + 2);

		}

	},

	Quartic: {

		In: function (k) {

			return k * k * k * k;

		},

		Out: function (k) {

			return 1 - (--k * k * k * k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k;
			}

			return - 0.5 * ((k -= 2) * k * k * k - 2);

		}

	},

	Quintic: {

		In: function (k) {

			return k * k * k * k * k;

		},

		Out: function (k) {

			return --k * k * k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k * k * k + 2);

		}

	},

	Sinusoidal: {

		In: function (k) {

			return 1 - Math.cos(k * Math.PI / 2);

		},

		Out: function (k) {

			return Math.sin(k * Math.PI / 2);

		},

		InOut: function (k) {

			return 0.5 * (1 - Math.cos(Math.PI * k));

		}

	},

	Exponential: {

		In: function (k) {

			return k === 0 ? 0 : Math.pow(1024, k - 1);

		},

		Out: function (k) {

			return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1);
			}

			return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

		}

	},

	Circular: {

		In: function (k) {

			return 1 - Math.sqrt(1 - k * k);

		},

		Out: function (k) {

			return Math.sqrt(1 - (--k * k));

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return - 0.5 * (Math.sqrt(1 - k * k) - 1);
			}

			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);

		},

		Out: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			k *= 2;

			if (k < 1) {
				return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
			}

			return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;

		}

	},

	Back: {

		In: function (k) {

			var s = 1.70158;

			return k * k * ((s + 1) * k - s);

		},

		Out: function (k) {

			var s = 1.70158;

			return --k * k * ((s + 1) * k + s) + 1;

		},

		InOut: function (k) {

			var s = 1.70158 * 1.525;

			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}

			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

		}

	},

	Bounce: {

		In: function (k) {

			return 1 - TWEEN.Easing.Bounce.Out(1 - k);

		},

		Out: function (k) {

			if (k < (1 / 2.75)) {
				return 7.5625 * k * k;
			} else if (k < (2 / 2.75)) {
				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
			} else if (k < (2.5 / 2.75)) {
				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
			} else {
				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
			}

		},

		InOut: function (k) {

			if (k < 0.5) {
				return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
			}

			return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.Linear;

		if (k < 0) {
			return fn(v[0], v[1], f);
		}

		if (k > 1) {
			return fn(v[m], v[m - 1], m - f);
		}

		return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);

	},

	Bezier: function (v, k) {

		var b = 0;
		var n = v.length - 1;
		var pw = Math.pow;
		var bn = TWEEN.Interpolation.Utils.Bernstein;

		for (var i = 0; i <= n; i++) {
			b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
		}

		return b;

	},

	CatmullRom: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.CatmullRom;

		if (v[0] === v[m]) {

			if (k < 0) {
				i = Math.floor(f = m * (1 + k));
			}

			return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

		} else {

			if (k < 0) {
				return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
			}

			if (k > 1) {
				return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
			}

			return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);

		}

	},

	Utils: {

		Linear: function (p0, p1, t) {

			return (p1 - p0) * t + p0;

		},

		Bernstein: function (n, i) {

			var fc = TWEEN.Interpolation.Utils.Factorial;

			return fc(n) / fc(i) / fc(n - i);

		},

		Factorial: (function () {

			var a = [1];

			return function (n) {

				var s = 1;

				if (a[n]) {
					return a[n];
				}

				for (var i = n; i > 1; i--) {
					s *= i;
				}

				a[n] = s;
				return s;

			};

		})(),

		CatmullRom: function (p0, p1, p2, p3, t) {

			var v0 = (p2 - p0) * 0.5;
			var v1 = (p3 - p1) * 0.5;
			var t2 = t * t;
			var t3 = t * t2;

			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

		}

	}

};

// UMD (Universal Module Definition)
(function (root) {

	if (typeof define === 'function' && define.amd) {

		// AMD
		define([], function () {
			return TWEEN;
		});

	} else if (typeof module !== 'undefined' && typeof exports === 'object') {

		// Node.js
		module.exports = TWEEN;

	} else if (root !== undefined) {

		// Global variable
		root.TWEEN = TWEEN;

	}

})(this);

}).call(this,require('_process'))

},{"_process":1}],3:[function(require,module,exports){
'use strict';

var Joint = function Joint(options) {

  THREE.Object3D.call(this);

  this.type = 'Joint';

  this.offset = new THREE.Matrix4();

  this.transform = new THREE.Matrix4();

  Object.assign(this, options || {});

  this.applyMatrix(this.transform);

  this.setOffset();
};

Joint.prototype = Object.create(THREE.Object3D.prototype);
Joint.prototype.constructor = Joint;

Joint.prototype.setOffset = function () {

  this.updateMatrixWorld();

  this.offset.getInverse(this.matrixWorld);
};

Joint.prototype.updateTransform = function () {

  this.updateMatrixWorld();

  this.transform.copy(this.matrixWorld).multiply(this.offset);
};

module.exports = Joint;

},{}],4:[function(require,module,exports){
// JointMaterial.js
'use strict';



var JointMaterial = function JointMaterial(jointTransforms, options) {

  options = options || {};

  var mat = {

    blending: 0,

    wireframe: false,

    depthTest: true,

    depthWrite: true,

    side: 0,

    lights: true,

    opacity: 1,

    transparent: false,

    uniforms: Object.assign({}, THREE.UniformsLib.common, THREE.UniformsLib.aomap, THREE.UniformsLib.lightmap, THREE.UniformsLib.emissivemap, THREE.UniformsLib.bumpmap, THREE.UniformsLib.normalmap, THREE.UniformsLib.displacementmap, THREE.UniformsLib.fog, THREE.UniformsLib.lights, {
      emissive: { value: new THREE.Color(0x111520) },
      specular: { value: new THREE.Color(0x333333) },
      shininess: { value: 12 },
      time: { type: 'f', value: 0 },
      hitVal: { type: 'f', value: 0 },
      hitColor: { type: 'c', value: new THREE.Color(0x22ABFF) },
      // hitColor: {type: 'c', value: new THREE.Color(0x22ABFF)},
      rimColor: { type: 'c', value: new THREE.Color(0xFFFFFF) },
      // joints: {type: 'm4v', value: jointTransforms },
      map: { type: 't', value: undefined },
      jointTexture: { type: 't', value: undefined },
      jointTextureDim: { type: 'v2', value: options.jointTextureDim || new THREE.Vector2(4, 64) }
    }),

    vertexShader: ['#define PHONG', "#define USE_MAP", "#define ALPHATEST",

    // "#define FLAT_SHADED",


    'varying vec3 vViewPosition;',

    // '#ifndef FLAT_SHADED',

    'varying vec3 vNormal;',

    // '#endif',


    // "uniform mat4 joints["+ jointTransforms.length +"];",

    // "attribute vec3 normal;",

    "attribute vec3 jointWeights;", "attribute vec3 jointIndices;", 'uniform sampler2D jointTexture;', 'uniform vec2 jointTextureDim;', 'uniform float hitVal;', 'uniform float time;', 'varying float vHitVal;', 'float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}', 'vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}', 'vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}', 'float noise(vec3 p){', '    vec3 a = floor(p);', '    vec3 d = p - a;', '    d = d * d * (3.0 - 2.0 * d);', '    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);', '    vec4 k1 = perm(b.xyxy);', '    vec4 k2 = perm(k1.xyxy + b.zzww);', '    vec4 c = k2 + a.zzzz;', '    vec4 k3 = perm(c);', '    vec4 k4 = perm(c + 1.0);', '    vec4 o1 = fract(k3 * (1.0 / 41.0));', '    vec4 o2 = fract(k4 * (1.0 / 41.0));', '    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);', '    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);', '    return o4.y * d.y + o4.x * (1.0 - d.y);', '}', THREE.ShaderChunk['common'], THREE.ShaderChunk['uv_pars_vertex'], THREE.ShaderChunk['uv2_pars_vertex'], THREE.ShaderChunk['displacementmap_pars_vertex'], THREE.ShaderChunk['envmap_pars_vertex'], THREE.ShaderChunk['color_pars_vertex'], THREE.ShaderChunk['morphtarget_pars_vertex'], THREE.ShaderChunk['skinning_pars_vertex'], THREE.ShaderChunk['shadowmap_pars_vertex'], THREE.ShaderChunk['logdepthbuf_pars_vertex'], THREE.ShaderChunk['clipping_planes_pars_vertex'], 'void main() {', THREE.ShaderChunk['uv_vertex'], THREE.ShaderChunk['uv2_vertex'], THREE.ShaderChunk['color_vertex'],

    // 'vHitVal *= pow(sin(position.y - time) * cos(position.x * 10.0 - time), 1.0);',

    // 'vHitVal = max(0.0, hitVal * max(0.0,1.5 * (uv.y + 0.1)));',


    // THREE.ShaderChunk['begin_vertex'],
    "mat4 jointMatrix = mat4( 0.0 );", "vec3 jw = normalize(jointWeights.xyz);", "for(int i=0; i<3; i++){", '  vec4 v0 = texture2D( jointTexture, vec2(0.0, jointIndices[i]) / jointTextureDim );', '  vec4 v1 = texture2D( jointTexture, vec2(1.0, jointIndices[i]) / jointTextureDim );', '  vec4 v2 = texture2D( jointTexture, vec2(2.0, jointIndices[i]) / jointTextureDim );', '  vec4 v3 = texture2D( jointTexture, vec2(3.0, jointIndices[i]) / jointTextureDim );', '  jointMatrix += jw[i] * mat4(v0, v1, v2, v3);', "}", 'vec3 transformed = vec3( position );', 'vHitVal = pow(noise(vec3(position.y, time, uv.y)), 2.0) * 3.0;',

    // 'vHitVal *= pow(noise(position - vec3(0.0, time, 0.0)), 2.0) * 2.0;',


    // THREE.ShaderChunk['beginnormal_vertex'],
    'vec3 objectNormal = (jointMatrix * vec4(normal, 0.)).xyz;', THREE.ShaderChunk['morphnormal_vertex'], THREE.ShaderChunk['skinbase_vertex'], THREE.ShaderChunk['skinnormal_vertex'],

    // THREE.ShaderChunk['defaultnormal_vertex'],
    'vec3 transformedNormal = normalMatrix * objectNormal;', THREE.ShaderChunk['displacementmap_vertex'], THREE.ShaderChunk['morphtarget_vertex'],
    // THREE.ShaderChunk['skinning_vertex'],
    // THREE.ShaderChunk['project_vertex'],


    // THREE.ShaderChunk['worldpos_vertex'],
    // 'vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );',
    'vec4 worldPosition = modelMatrix * jointMatrix * vec4( transformed, 1.0 );', "vec4 mvPosition = viewMatrix * worldPosition;", "gl_Position = projectionMatrix * mvPosition;", THREE.ShaderChunk['logdepthbuf_vertex'], THREE.ShaderChunk['clipping_planes_vertex'], " vViewPosition = -mvPosition.xyz;", 'vNormal = normalize( transformedNormal );', THREE.ShaderChunk['envmap_vertex'], THREE.ShaderChunk['shadowmap_vertex'], '}'].join('\n'),

    fragmentShader: ['#define PHONG', "#define USE_MAP", 'uniform vec3 diffuse;', 'uniform vec3 emissive;', 'uniform vec3 specular;', 'uniform float shininess;', 'uniform float opacity;', 'uniform vec3 rimColor;', 'uniform vec3 hitColor;', 'varying float vHitVal;', THREE.ShaderChunk['common'], THREE.ShaderChunk['packing'], THREE.ShaderChunk['color_pars_fragment'], THREE.ShaderChunk['uv_pars_fragment'], THREE.ShaderChunk['uv2_pars_fragment'], THREE.ShaderChunk['map_pars_fragment'], THREE.ShaderChunk['alphamap_pars_fragment'], THREE.ShaderChunk['aomap_pars_fragment'], THREE.ShaderChunk['lightmap_pars_fragment'], THREE.ShaderChunk['emissivemap_pars_fragment'], THREE.ShaderChunk['envmap_pars_fragment'], THREE.ShaderChunk['fog_pars_fragment'], THREE.ShaderChunk['bsdfs'], THREE.ShaderChunk['lights_pars'], THREE.ShaderChunk['lights_phong_pars_fragment'], THREE.ShaderChunk['shadowmap_pars_fragment'], THREE.ShaderChunk['bumpmap_pars_fragment'], THREE.ShaderChunk['normalmap_pars_fragment'], THREE.ShaderChunk['specularmap_pars_fragment'], THREE.ShaderChunk['logdepthbuf_pars_fragment'], THREE.ShaderChunk['clipping_planes_pars_fragment'], 'vec3 evaluateBezierPosition( vec3 v0,vec3 v1,vec3 v2,vec3 v3, float t )', '{', '    vec3 p;', '    float OneMinusT = 1.0 - t;', '    float b0 = OneMinusT*OneMinusT*OneMinusT;', '    float b1 = 3.0*t*OneMinusT*OneMinusT;', '    float b2 = 3.0*t*t*OneMinusT;', '    float b3 = t*t*t;', '    return b0*v0 + b1*v1 + b2*v2 + b3*v3;', '}', 'void main() {',

    // 'gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);',

    THREE.ShaderChunk['clipping_planes_fragment'], 'vec4 diffuseColor = vec4( diffuse, opacity );', 'ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );', 'vec3 totalEmissiveRadiance = emissive;', THREE.ShaderChunk['logdepthbuf_fragment'], THREE.ShaderChunk['map_fragment'], THREE.ShaderChunk['color_fragment'], THREE.ShaderChunk['alphamap_fragment'], THREE.ShaderChunk['alphatest_fragment'], THREE.ShaderChunk['specularmap_fragment'], THREE.ShaderChunk['normal_flip'], THREE.ShaderChunk['normal_fragment'], THREE.ShaderChunk['emissivemap_fragment'],

    // accumulation
    THREE.ShaderChunk['lights_phong_fragment'], THREE.ShaderChunk['lights_template'],

    // modulation
    THREE.ShaderChunk['aomap_fragment'], 'vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;', THREE.ShaderChunk['envmap_fragment'], 'gl_FragColor = vec4( outgoingLight, diffuseColor.a );', THREE.ShaderChunk['premultiplied_alpha_fragment'], THREE.ShaderChunk['tonemapping_fragment'], THREE.ShaderChunk['encodings_fragment'], THREE.ShaderChunk['fog_fragment'], 'float fr = max(dot( normalize(vViewPosition), normal ),0.0);', 'float mfr = pow(1.0 - fr, 8.0);', 'gl_FragColor.xyz = max(gl_FragColor.xyz, hitColor * min(2.0, texelColor.r * vHitVal)) + mfr * rimColor * max(0.0, normal.y);', '}'].join("\n")

  };

  Object.assign(mat, options || {});

  THREE.ShaderMaterial.call(this, mat);

  this.castShadow = true;

  this.needsUpdate = true;
};

/**
 * @extends {THREE.ShaderMaterial}
 */
JointMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);

/**
 * common js
 */
module.exports = JointMaterial;

},{}],5:[function(require,module,exports){
"use strict";

var JointTexture = function JointTexture(jointTransforms) {

  this.transforms = jointTransforms;

  var w = 4; // 4 pixels needed for 1 matrix
  var h = THREE.Math.nextPowerOfTwo(jointTransforms.length);

  this.jointData = new Float32Array(w * h * 4);

  for (var i = 0; i < this.transforms.length; i++) {
    this.transforms[i].toArray(this.jointData, i * 16);
  }

  this.texture = new THREE.DataTexture(this.jointData, w, h, THREE.RGBAFormat, THREE.FloatType);

  this.texture.minFilter = this.texture.magFilter = THREE.NearestFilter;
};

JointTexture.prototype.constructor = JointTexture;

JointTexture.prototype.update = function () {

  for (var i = 0; i < this.transforms.length; i++) {

    this.transforms[i].toArray(this.jointData, i * 16);
  }

  this.texture.needsUpdate = true;
};

module.exports = JointTexture;

},{}],6:[function(require,module,exports){
// LaserOimoWrapper.js

'use strict';

var LaserOimoWrapper = function LaserOimoWrapper(options) {

  options = options || {};

  this.bodies = [];

  // TimeStep, BroadPhaseType, Iterations, NoStat 
  this.world = new OIMO.World(options.timeStep || 1 / 60, 2, options.iterations || 4);
  // this.world = new OIMO.World();
  this.world.worldscale(options.worldScale || 1);

  this.gravity = this.world.gravity;

  this.defaultConfig = [1, // The density of the shape.
  0.9, // The coefficient of friction of the shape.
  0.25, // The coefficient of restitution of the shape.
  1, // The bits of the collision groups to which the shape belongs.
  0xffffffff // The bits of the collision groups with which the shape collides.
  ];

  this.defaultAxis = new OIMO.Vec3(1, 0, 0);

  for (var i in options) {
    this[i] = options[i];
  }
};

LaserOimoWrapper.prototype.update = function () {
  this.world.step();

  // update mesh positions
};

LaserOimoWrapper.prototype.removeBody = function (b) {

  this.world.removeRigidBody(b);
};

LaserOimoWrapper.prototype.makeConfig = function (options) {
  var config = this.defaultConfig.slice();

  if (options.density !== undefined) config[0] = options.density;
  if (options.friction !== undefined) config[1] = options.friction;
  if (options.restitution !== undefined) config[2] = options.restitution;
  if (options.belongsTo !== undefined) config[3] = options.belongsTo;
  if (options.collidesWith !== undefined) config[4] = options.collidesWith;

  return config;
};

LaserOimoWrapper.prototype.addBox = function (dimensions, pos, euler, options) {

  var config = this.makeConfig(options);

  var b = {
    type: "box",
    size: [dimensions.x, dimensions.y, dimensions.z],
    pos: [pos.x, pos.y, pos.z],
    rot: [euler.x, euler.y, euler.z],
    move: options.move !== undefined ? options.move : true,
    config: config
  };

  Object.assign(b, options || {});

  return this.world.add(b);
};

LaserOimoWrapper.prototype.addSphere = function (rad, pos, euler, options) {

  var config = this.makeConfig(options);

  var b = {
    type: "sphere",
    size: [rad, rad, rad],
    pos: [pos.x, pos.y, pos.z],
    rot: [euler.x, euler.y, euler.z],
    move: options.move !== undefined ? options.move : true,
    config: config
  };

  Object.assign(b, options || {});

  return this.world.add(b);
};

LaserOimoWrapper.prototype.addFromMesh = function (m, type, options) {

  if (!m.geometry.boundingBox) {
    m.geometry.computeBoundingBox();
  }

  var dimensions = m.geometry.boundingBox.getSize().multiply(m.scale);

  var b;

  if (type === 'box' || type === undefined) {
    b = this.addBox(dimensions, m.position, m.rotation, options);
  } else if (type === 'sphere') {
    b = this.addSphere(dimensions.x * 0.5, m.position, m.rotation, options);
  }

  return b;
};

LaserOimoWrapper.prototype.getJointConfig = function (a, b, options) {

  // https://github.com/lo-th/Oimo.js/blob/gh-pages/src/constraint/joint/JointConfig.js

  options = options || {};

  var jc = new OIMO.JointConfig();

  jc.body1 = a;

  jc.body2 = b;

  if (options.pointInA) jc.localAnchorPoint1.copy(options.pointInA).multiplyScalar(OIMO.INV_SCALE);

  if (options.pointInB) jc.localAnchorPoint2.copy(options.pointInB).multiplyScalar(OIMO.INV_SCALE);

  if (options.axisA) jc.localAxis1.copy(options.axisA);

  if (options.axisB) jc.localAxis2.copy(options.axisB);

  jc.allowCollision = options.allowCollision || false;

  return jc;
};

LaserOimoWrapper.prototype.pointToPoint = function (a, b, options) {

  options = options || {};

  var jc = this.getJointConfig(a, b, options);

  var joint = new OIMO.DistanceJoint(jc, options.min || 0, options.max || 0.001);

  this.world.addJoint(joint);

  return joint;
};

LaserOimoWrapper.prototype.removeConstraint = function (constraint) {
  this.world.removeJoint(constraint);
};

LaserOimoWrapper.prototype.hingeJoint = function (a, b, options) {

  options = options || {};

  var spring = options.spring;
  var motor = options.motor;
  var min = (options.min || -60) * OIMO.degtorad;
  var max = (options.max || 60) * OIMO.degtorad;

  var jc = this.getJointConfig(a, b, options);

  var joint = new OIMO.HingeJoint(jc, min, max);

  if (spring) joint.limitMotor.setSpring(spring[0], spring[1]); // soften the joint ex: 100, 0.2

  if (motor) joint.limitMotor.setMotor(motor[0], motor[1]);

  this.world.addJoint(joint);

  return joint;
};

LaserOimoWrapper.prototype.distanceJoint = function (a, b, options) {

  options = options || {};

  var spring = options.spring;
  var motor = options.motor;
  var min = (options.min || -60) * OIMO.degtorad;
  var max = (options.max || 60) * OIMO.degtorad;

  var jc = this.getJointConfig(a, b, options);

  var joint = new OIMO.DistanceJoint(jc, min, max);

  if (spring) joint.limitMotor.setSpring(spring[0], spring[1]);

  if (motor) joint.limitMotor.setMotor(motor[0], motor[1]);

  this.world.addJoint(joint);

  return joint;
};

LaserOimoWrapper.prototype.slideJoint = function (a, b, options) {

  options = options || {};

  var min = (options.min || -60) * OIMO.degtorad;
  var max = (options.max || 60) * OIMO.degtorad;

  var jc = this.getJointConfig(a, b, options);

  var joint = new OIMO.SliderJoint(jc, min, max);

  this.world.addJoint(joint);

  return joint;
};

LaserOimoWrapper.prototype.PrismaticJoint = function (a, b, options) {

  options = options || {};

  var min = (options.min || -60) * OIMO.degtorad;
  var max = (options.max || 60) * OIMO.degtorad;

  var jc = this.getJointConfig(a, b, options);

  var joint = new OIMO.PrismaticJoint(jc, min, max);

  this.world.addJoint(joint);

  return joint;
};

LaserOimoWrapper.prototype.ballJoint = function (a, b, options) {

  options = options || {};

  var min = (options.min || -60) * OIMO.degtorad;
  var max = (options.max || 60) * OIMO.degtorad;

  var jc = this.getJointConfig(a, b, options);

  var joint = new OIMO.BallAndSocketJoint(jc, min, max);

  this.world.addJoint(joint);

  return joint;
};

module.exports = LaserOimoWrapper;

},{}],7:[function(require,module,exports){
"use strict";

module.exports = function (mat, jointTransforms) {

  return new THREE.ShaderMaterial({

    vertexShader: [

    // "uniform mat4 joints["+ jointTransforms.length +"];",

    "attribute vec3 jointWeights;", "attribute vec3 jointIndices;", 'uniform sampler2D jointTexture;', 'uniform vec2 jointTextureDim;', 'void main() {', "mat4 jointMatrix = mat4( 0.0 );", "vec3 jw = normalize(jointWeights.xyz);", "for(int i=0; i<3; i++){", '  vec4 v0 = texture2D( jointTexture, vec2(0.0, jointIndices[i]) / jointTextureDim );', '  vec4 v1 = texture2D( jointTexture, vec2(1.0, jointIndices[i]) / jointTextureDim );', '  vec4 v2 = texture2D( jointTexture, vec2(2.0, jointIndices[i]) / jointTextureDim );', '  vec4 v3 = texture2D( jointTexture, vec2(3.0, jointIndices[i]) / jointTextureDim );', '  jointMatrix += jw[i] * mat4(v0, v1, v2, v3);', "}", 'vec3 transformed = vec3( position );', 'vec4 worldPosition = modelMatrix * jointMatrix * vec4( transformed, 1.0 );', "gl_Position = projectionMatrix * viewMatrix * worldPosition;", '}'].join('\n'),

    fragmentShader: [THREE.ShaderChunk['common'], THREE.ShaderChunk['packing'], THREE.ShaderChunk['uv_pars_fragment'], THREE.ShaderChunk['map_pars_fragment'], THREE.ShaderChunk['alphamap_pars_fragment'], THREE.ShaderChunk['logdepthbuf_pars_fragment'], THREE.ShaderChunk['clipping_planes_pars_fragment'], 'void main() {', THREE.ShaderChunk['clipping_planes_fragment'], 'vec4 diffuseColor = vec4( 1.0 );', THREE.ShaderChunk['map_fragment'], THREE.ShaderChunk['alphamap_fragment'], THREE.ShaderChunk['alphatest_fragment'], THREE.ShaderChunk['logdepthbuf_fragment'], 'gl_FragColor = packDepthToRGBA( gl_FragCoord.z );', '}'].join('\n'),

    uniforms: mat.uniforms
  });
};

},{}],8:[function(require,module,exports){

'use strict';

var _Joint = require('./Joint.js');

var _Joint2 = _interopRequireDefault(_Joint);

var _skinDataToGeometry = require('./skinDataToGeometry.js');

var _skinDataToGeometry2 = _interopRequireDefault(_skinDataToGeometry);

var _LaserOimoWrapper = require('./LaserOimoWrapper.js');

var _LaserOimoWrapper2 = _interopRequireDefault(_LaserOimoWrapper);

var _JointMaterial = require('./JointMaterial.js');

var _JointMaterial2 = _interopRequireDefault(_JointMaterial);

var _randomElement = require('./randomElement.js');

var _randomElement2 = _interopRequireDefault(_randomElement);

var _getCustomDepthMaterial = require('./getCustomDepthMaterial.js');

var _getCustomDepthMaterial2 = _interopRequireDefault(_getCustomDepthMaterial);

var _tween = require('tween.js');

var _tween2 = _interopRequireDefault(_tween);

var _JointTexture = require('./JointTexture.js');

var _JointTexture2 = _interopRequireDefault(_JointTexture);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lerp = THREE.Math.lerp;

var mapLinear = THREE.Math.mapLinear;

var randf = THREE.Math.randFloat;

var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 || function (p) {
  return p.toString() === "[object SafariRemoteNotification]";
}(!window['safari'] || safari.pushNotification);

// StartAudioContext(Tone.context, '#container', ()=>{
//   // if(isSafari)  alert('StartAudioContext')
// });

var makeNote = function makeNote(name, duration, velocity) {
  return {
    name: name,
    duration: duration || '32n',
    velocity: Math.min(velocity)
  };
};

var randf = THREE.Math.randFloat;

var Sketch = function Sketch(options) {

  options = options || {};

  var debug = false;

  var updateVertexPositions = false;

  var elapsedTime = 0;

  var container = options.container || $("#container");

  var globeRad = 3;

  var goalPos = new THREE.Vector3(0, 0, 0);

  var attenuation = 0.99;

  var hingeRange = 60.0;

  var springRange = 60.0;

  var wigglyness = 1;

  var wigglySpeed = 6;

  var orig_wigglySpeed = wigglySpeed;

  var orig_wigglyness = wigglyness;

  var shadowRes = 2048;

  var attraction = 0.0125;

  var bodySmoothing = 0.25;

  var animationGoal = new THREE.Vector3(0, 0, 0);

  var darkColor = new THREE.Color(0x333742).multiplyScalar(1.5);

  // colors
  var c0 = new THREE.Color(0x000000);
  var c1 = new THREE.Color(0x111114);
  var orig_c0 = c0.clone();
  var orig_c1 = c1.clone();

  var textureLoader = new THREE.TextureLoader();

  var circleTex = textureLoader.load('./assets/ramp.png');

  // three
  var view = new ThreeView(container); // boiler plate... couldn't this be passed in? then we could do a player...

  var renderer = view.setupRenderer();

  if (!isSafari) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; // THREE.PCFSoftShadowMap;
  }
  renderer.setClearColor(0x333333, 0.1);

  var clock = new THREE.Clock();

  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 50, 150);

  var camera = new THREE.PerspectiveCamera(60, view.aspect, 1, 1000);
  camera.position.set(16, 55, 38);
  camera.lookAt(new THREE.Vector3(camera.position.x, camera.position.y - 20, 0));

  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  // controls.enabled = false;
  controls.enableZoom = true;
  controls.enableRotate = false;
  controls.enablePan = true;
  controls.enableDamping = true;
  controls.dampingFactor = 0.5;
  controls.rotateSpeed = 0.5;
  controls.minDistance = globeRad + 4;
  controls.maxDistance = 240;

  controls.maxPolarAngle = Math.PI * 0.5;

  var spotLight = new THREE.SpotLight(0xffffff, 2);
  spotLight.position.set(0, 100, 0);
  spotLight.castShadow = true;
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 1;
  spotLight.decay = 2;
  spotLight.distance = 200;
  spotLight.shadow.mapSize.width = shadowRes;
  spotLight.shadow.mapSize.height = shadowRes;
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 200;

  spotLight.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(spotLight);

  var hemi = new THREE.HemisphereLight(0x6688BB, 0x181844, 0.25);
  scene.add(hemi);

  var box = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({
    color: 'white',
    wireframe: true,
    side: 2
  }));

  var oc = new _LaserOimoWrapper2.default({
    iterations: 20
  });
  oc.gravity.set(0, -100, 0);

  var groundBox = new THREE.Mesh(new THREE.BoxGeometry(1000, 40, 1000), new THREE.MeshPhongMaterial({
    color: darkColor
  }));

  groundBox.castShadow = false;
  groundBox.receiveShadow = true;
  scene.add(groundBox);

  var conf = [1, // The density of the shape.
  0.4, // The coefficient of friction of the shape.
  0.2, // The coefficient of restitution of the shape.
  1, // The bits of the collision groups to which the shape belongs.
  0xffffffff // The bits of the collision groups with which the shape collides.
  ];
  groundBox.body = oc.world.add({
    size: [400, 40, 400],
    pos: [0, -20, 0],
    config: conf
  });

  var dragPlane = new THREE.Mesh(new THREE.PlaneGeometry(300, 300, 10, 10), new THREE.MeshBasicMaterial({
    color: 'magenta',
    wireframe: true
  }));
  dragPlane.visible = false;

  scene.add(dragPlane);

  var dataTex = new THREE.DataTexture(new Uint8Array([255, 0, 255, 0, 255, 255]), 2, 1, THREE.RGBFormat);
  var updateDataTex = function updateDataTex() {

    var colorVals = c0.toArray().concat(c1.toArray());

    for (var i = 0; i < colorVals.length; i++) {
      dataTex.image.data[i] = colorVals[i] * 255;
    }
    dataTex.needsUpdate = true;
  };
  updateDataTex();

  var skinLoader = new THREE.XHRLoader();
  skinLoader.setResponseType('json');

  // debug meshes
  var cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial({
    color: 'cyan',
    wireframe: true,
    transparent: true,
    opacity: 0.5,
    blending: 2
  }));

  var jointCube = new THREE.Mesh(cube.geometry, new THREE.MeshBasicMaterial({
    color: 'red',
    wireframe: true
  }));
  jointCube.scale.multiplyScalar(0.5);

  var skins = [];
  var intersectables = [];

  var createSkin = function createSkin(json, geometry) {
    var skin = {
      skinObj: new THREE.Object3D(),
      raycastIntersects: [],
      rigidBodies: [],
      constraints: [],
      loaded: false,
      joints: [],
      geometry: null,
      material: null,
      mesh: null,
      jointTexture: null
    };

    var skinObj = skin.skinObj;
    scene.add(skinObj);

    // create the joints
    var jointMap = {};

    json['joints'].forEach(function (j) {

      var joint = new _Joint2.default({
        name: j.name,
        transform: new THREE.Matrix4().fromArray(j['transform']),
        rigidBody: j.rigidBody
      });

      skin.joints.push(joint);

      jointMap[j.name] = joint;

      // DEBUG
      if (debug) joint.add(jointCube.clone());
    });

    // create the rigid bodies

    var _loop = function _loop(_i) {

      var data = json['rigidBodies'][_i];

      var b = new THREE.Object3D();
      b.name = _i;
      b.applyMatrix(new THREE.Matrix4().fromArray(data['transform']));
      b.updateMatrixWorld(true);
      skinObj.add(b);
      skin.rigidBodies.push(b);

      var inv = new THREE.Matrix4().getInverse(b.matrixWorld);

      data.joints.forEach(function (j) {
        jointMap[j].applyMatrix(inv);
        b.add(jointMap[j]);
      });

      // debug rigid body bounds
      var c = cube.clone();
      c.scale.multiply(new THREE.Vector3().fromArray(data['extents']));
      c.visible = debug;
      b.add(c);

      // b.body = cc.addBoxMesh( c, {
      //   position: b.position,
      //   mass: data.mass,
      //   restitution: data.restitution,
      //   // material: groundMaterial
      // });

      b.body = oc.addFromMesh(c, 'box', {
        mass: data.mass
      });

      b.body.skin = skin;

      c.body = b.body;
      skin.raycastIntersects.push(c);
    };

    for (var _i in json['rigidBodies']) {
      _loop(_i);
    }

    // set the initial joint offsets
    skinObj.updateMatrixWorld(true);

    skin.joints.forEach(function (j) {
      j.setOffset();
    });

    // create the constraints
    for (var i in json['constraints']) {

      var c = json["constraints"][i];
      var a = skinObj.getObjectByName(c['rigidBodyA']);
      var _b = skinObj.getObjectByName(c['rigidBodyB']);

      var dataA = json['rigidBodies'][c['rigidBodyA']];
      var dataB = json['rigidBodies'][c['rigidBodyB']];

      var constraintPos = new THREE.Vector3().fromArray(c['translate']);

      if (a && _b) {

        // local axis in rigid bodies
        var invA = new THREE.Matrix4().getInverse(a.matrixWorld);
        var invB = new THREE.Matrix4().getInverse(_b.matrixWorld);

        var pointInA = constraintPos.clone().applyMatrix4(invA);
        var pointInB = constraintPos.clone().applyMatrix4(invB);

        var axisA = pointInA.clone().normalize();
        axisA.negate();

        var axisB = pointInB.clone().normalize();
        // axisB.negate();

        axisA.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * -0.5);
        axisB.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * -0.5);

        var constraint = oc.hingeJoint(a.body, _b.body, {
          pointInA: pointInA,
          pointInB: pointInB,
          axisA: axisA, //new THREE.Vector3(1, 0, 0), // <-- this seems to be the axis the motor rotates on
          axisB: axisB, //new THREE.Vector3(1, 0, 0), // <-- this seems to be the axis the motor rotates on
          min: -hingeRange,
          max: hingeRange,
          collision: false,
          spring: [-springRange, springRange]
        });

        skin.constraints.push(constraint);
      }
    }

    // set the initial joint offsets
    skinObj.updateMatrixWorld(true);

    skin.joints.forEach(function (j) {
      j.setOffset();
    });

    // put together the mesh
    var jointTransforms = skin.joints.map(function (j) {
      return j.transform;
    });

    var jointTexture = new _JointTexture2.default(jointTransforms);
    var jointMaterial = new _JointMaterial2.default(jointTransforms);

    // console.log( 'jointMaterial', jointMaterial, jointMaterial.fragmentShader );

    // jointMaterial.uniforms.hitColor.value.copy(c1)
    jointMaterial.uniforms.shininess.value = 128;
    jointMaterial.uniforms.reflectivity.value = 1;
    jointMaterial.uniforms.map.value = circleTex;
    jointMaterial.uniforms.jointTexture.value = jointTexture.texture;
    jointMaterial.uniforms.jointTextureDim.value.set(jointTexture.texture.image.width, jointTexture.texture.image.height);

    var mesh = new THREE.Mesh(geometry, jointMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.customDepthMaterial = (0, _getCustomDepthMaterial2.default)(jointMaterial, jointTransforms);

    skinObj.add(mesh);
    skin.geometry = geometry;
    skin.material = jointMaterial;
    skin.material = jointMaterial;
    skin.mesh = mesh;
    skin.jointTexture = jointTexture;

    skin.loaded = true;

    intersectables = intersectables.concat(skin.raycastIntersects);

    return skin;
  };

  var animateSkin = function animateSkin(skin, index) {

    var step = 1 / skins.length;

    // color
    // skin.mesh.material.uniforms.hitColor.value.setHSL(step * skin.skinIndex, 1, 0.5)
  };

  skinLoader.load('assets/mesh.json', function (json) {

    $('#working').hide();

    var geometry = (0, _skinDataToGeometry2.default)(json);

    var count = isSafari ? 4 : 14;

    var rad = isSafari ? 10 : 40;

    var step = Math.PI * 2 / count;
    for (var i = 0; i < count; i++) {

      var skin = createSkin(json, geometry);
      skins.push(skin);

      skin.skinIndex = i;

      skin.rigidBodies.forEach(function (rb) {

        rb.body.position.x += Math.sin(i * step) * rad;
        rb.body.position.y = 10;
        rb.body.position.z += Math.cos(i * step) * rad;
      });
    }

    skins.forEach(animateSkin);

    // for(let i=0; i<10; i++){
    //   cc.update(i * 0.1);
    // }
  });

  var updateSkin = function updateSkin(skin) {

    skin.mesh.material.uniforms.time.value = elapsedTime;

    if (skin.loaded) {
      var attractionDistance;

      (function () {

        skin.joints.forEach(function (j) {
          j.updateTransform();
        });

        skin.constraints.forEach(function (c, i) {
          var l = Math.pow(Math.sin(elapsedTime + (i + skin.skinIndex) * 0.33), 3.0) * -2.0 + 1;
          c.limitMotor.lowerLimit = l - 0.1;
          c.limitMotor.upperLimit = l + 0.1;
        });

        skin.jointTexture.update();

        // rigid bodiy transforms
        attractionDistance = 20;

        var delta = new THREE.Vector3(0, 0, 0);
        var q = new THREE.Quaternion();
        var attractor = new THREE.Vector3();

        skin.rigidBodies.forEach(function (b, i) {

          // let localForce = new CANNON.Vec3(0, -3 * (Math.sin(elapsedTime + skin.skinIndex + i)),0);

          if (b.body) {

            b.body.linearVelocity.x *= attenuation;
            b.body.linearVelocity.y *= attenuation;
            b.body.linearVelocity.z *= attenuation;

            b.body.angularVelocity.x *= attenuation;
            b.body.angularVelocity.y *= attenuation;
            b.body.angularVelocity.z *= attenuation;

            delta.copy(b.position);
            delta.sub(attractor);

            if (delta.length() > attractionDistance) {
              delta.normalize().multiplyScalar(attractionDistance);
            }

            if (!skin.grabbed) {
              b.body.linearVelocity.x -= delta.x * attraction;
              b.body.linearVelocity.y -= delta.y * attraction;
              b.body.linearVelocity.z -= delta.z * attraction;
            }

            // if(i === 0) {

            // }

            b.position.lerp(b.body.getPosition(), bodySmoothing);
            q.copy(b.body.getQuaternion());
            b.quaternion.slerp(q, bodySmoothing);
          }
        });
      })();
    }
  };

  view.update = function () {

    // if(Tone.context.state && Tone.context.state === "suspended") {
    //   Tone.context.resume().then(function() {
    //     console.log("AudioContext resumed!");
    //     // fire your callback here
    //   });
    // }

    elapsedTime = clock.getElapsedTime();

    _tween2.default.update();

    animationGoal.copy(camera.position).normalize().multiplyScalar(globeRad * 4);

    oc.update();

    controls.update();

    skins.forEach(function (skin) {

      updateSkin(skin);
    });

    groundBox.position.copy(groundBox.body.getPosition());

    groundBox.quaternion.copy(groundBox.body.getQuaternion());
  };

  view.draw = function () {

    renderer.render(scene, camera, null, true);
  };

  view.onResize = function () {

    camera.aspect = view.aspect;
    camera.updateProjectionMatrix();
  };

  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  var mousedown = false;
  var dragging = false;
  var grabbed = false;
  var draggedBody, dragConstraint, grabbedSkin;

  var onPress = function onPress(e) {

    mousedown = true;

    if (e.type === 'touchstart') {

      mouse.x = e.touches[0].pageX / window.innerWidth * 2 - 1;
      mouse.y = -(e.touches[0].pageY / window.innerHeight) * 2 + 1;

      if (e.touches.length > 1) return;
    } else {
      mouse.x = e.pageX / window.innerWidth * 2 - 1;
      mouse.y = -(e.pageY / window.innerHeight) * 2 + 1;
    }

    raycaster.setFromCamera(mouse, camera);

    intersectables.forEach(function (m) {
      m.visible = true;
    });

    var intersects = raycaster.intersectObjects(intersectables);

    intersectables.forEach(function (m) {
      m.visible = debug;
    });

    if (intersects.length) {

      grabbed = true;

      if (e.type === 'touchstart') controls.enabled = false;
      controls.enableRotate = false;

      var skin = intersects[0].object.body.skin;

      skin.grabbed = true;
      grabbedSkin = skin;

      // grabbedSkin.mesh.material.uniforms.hitVal.value = 1

      var p = intersects[0].point;

      dragPlane.position.copy(p);
      dragPlane.lookAt(camera.position);

      if (p.length() < globeRad) {
        p.normalize().multiplyScalar(globeRad + 0.5);
      }

      // debugSphere.position.copy(p)
      // debugSphere.body.position.copy(debugSphere.position);

      // dragConstraint = cc.addPointConstraint(
      //   intersects[0].object.body,
      //   new THREE.Vector3( 0, 0, 0 ),
      //   debugSphere.body,
      //   new THREE.Vector3( 0, 0, 0 ));
    }
  };

  var onRelease = function onRelease(e) {

    if (grabbed) {
      // cc.removeConstraint(dragConstraint)
    }

    if (!controls.enableRotate) {
      controls.enabled = true;
      controls.enableRotate = true;
    }

    if (grabbedSkin) {

      if (!dragging) {

        var delta = camera.position.clone();
        delta.sub(grabbedSkin.rigidBodies[0].body.getPosition());

        delta.y = -Math.abs(delta.y);

        delta.normalize().multiplyScalar(100);

        grabbedSkin.rigidBodies[0].body.linearVelocity.x -= delta.x;
        grabbedSkin.rigidBodies[0].body.linearVelocity.y -= delta.y;
        grabbedSkin.rigidBodies[0].body.linearVelocity.z -= delta.z;

        var step = Math.PI * 2 / skins.length;
        grabbedSkin.mesh.material.uniforms.hitColor.value.setHSL(step * grabbedSkin.skinIndex, 1, 0.5);

        new _tween2.default.Tween(grabbedSkin.mesh.material.uniforms.hitColor.value).to(new THREE.Color(0x22ABFF), 1500).start();
      }

      grabbedSkin.grabbed = false;

      grabbedSkin = false;
    }

    mousedown = false;

    grabbed = false;

    dragPlane.visible = false;

    dragging = false;
  };

  var dragIntersects = [dragPlane];

  var onDrag = function onDrag(e) {

    if (mousedown) dragging = true;

    // if(grabbed){

    // grabbedSkin.mesh.material.uniforms.hitVal.value = 2

    if (e.type === 'touchmove') {

      mouse.x = e.touches[0].pageX / window.innerWidth * 2 - 1;
      mouse.y = -(e.touches[0].pageY / window.innerHeight) * 2 + 1;

      if (e.touches.length > 1) return;
    } else {
      mouse.x = e.pageX / window.innerWidth * 2 - 1;
      mouse.y = -(e.pageY / window.innerHeight) * 2 + 1;
    }

    raycaster.setFromCamera(mouse, camera);

    dragPlane.lookAt(camera.position);

    dragPlane.visible = true;
    var intersects = raycaster.intersectObjects(dragIntersects);
    dragPlane.visible = false;

    if (intersects.length) {

      var p = intersects[0].point;

      if (p.length() < globeRad) {
        p.normalize().multiplyScalar(globeRad + 0.5);
      }
    }
  };

  $(window).on('mousedown', onPress);
  $(window).on('mouseup', onRelease);
  $(window).on('mousemove', onDrag);

  container.on('touchstart', onPress);
  container.on('touchend', onRelease);
  container.on('touchmove', onDrag);

  $(window).on('keypress', function (e) {
    console.log(e);

    switch (e.key) {
      case 'd':
      case 'D':
        debug = !debug;
        break;

      case 'c':
        console.log(camera);
        break;
    }
  });

  return {
    begin: function begin() {
      view.begin();
    }
  };
};

window.onload = function () {

  var sketch = new Sketch();

  sketch.begin();
};

},{"./Joint.js":3,"./JointMaterial.js":4,"./JointTexture.js":5,"./LaserOimoWrapper.js":6,"./getCustomDepthMaterial.js":7,"./randomElement.js":9,"./skinDataToGeometry.js":10,"tween.js":2}],9:[function(require,module,exports){
"use strict";

/**
 * returns a random element from an array or object
 * @param  {Array|Object} obj
 * @return {object}
 */
module.exports = function (obj) {

  if (Array.isArray(obj)) {

    return obj[Math.floor(Math.random() * obj.length)];
  } else if (obj instanceof Object) {

    return obj[randElement(Object.keys[obj])];
  }

  return obj;
};

},{}],10:[function(require,module,exports){
'use strict';

// SkinDataToGeometry.js


module.exports = function (json) {

  var faces = json['meshData']['faces'];
  var v = json['meshData']['position'];
  var n = json['meshData']['normal'];
  var uv = json['meshData']['uv'][Object.keys(json['meshData']['uv'])[0]];
  var sw = json['skinWeights'];
  var si = json['skinIndices'];

  var positions = [];
  var normals = [];
  var uvs = [];

  var jointWeights = [];
  var jointIndices = [];

  var addPos = function addPos(p) {
    positions.push(p[0], p[1], p[2]);
  };

  var addNorm = function addNorm(n) {
    normals.push(n[0], n[1], n[2]);
  };

  var addUV = function addUV(uv) {
    uvs.push(uv[0], uv[1]);
  };

  var addJointWeights = function addJointWeights(jw) {
    jointWeights.push(jw[0] || 0, jw[1] || 0, jw[2] || 0);
  };

  var addJointIndices = function addJointIndices(ji) {
    jointIndices.push(ji[0] || 0, ji[1] || 0, ji[2] || 0);
  };

  // interate through the faces
  var v0, v1, v2, i, j;
  faces.forEach(function (f) {

    // iterate through the face triangles
    var norm = [n[f[1][0]], n[f[1][1]], n[f[1][2]]];
    for (i = 1, j = 2; j < f[0].length; i++, j++) {

      // positions
      addPos(v[f[0][0]]);
      addPos(v[f[0][i]]);
      addPos(v[f[0][j]]);

      // normals
      // addNorm(norm[0]);
      // addNorm(norm[1]);
      // addNorm(norm[2]);

      addNorm(n[f[1][0]]);
      addNorm(n[f[1][i]]);
      addNorm(n[f[1][j]]);

      // uvs
      addUV(uv[f[2][0]]);
      addUV(uv[f[2][i]]);
      addUV(uv[f[2][j]]);

      // joint weights
      addJointWeights(sw[f[0][0]]);
      addJointWeights(sw[f[0][i]]);
      addJointWeights(sw[f[0][j]]);

      // joint indices
      addJointIndices(si[f[0][0]]);
      addJointIndices(si[f[0][i]]);
      addJointIndices(si[f[0][j]]);
    }
  });

  // create the Buffer mesh
  var geometry = new THREE.BufferGeometry();

  geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  geometry.addAttribute('orig_position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  geometry.addAttribute('orgPos', new THREE.BufferAttribute(new Float32Array(positions), 3));
  geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
  geometry.addAttribute('jointWeights', new THREE.BufferAttribute(new Float32Array(jointWeights), 3));
  geometry.addAttribute('jointIndices', new THREE.BufferAttribute(new Float32Array(jointIndices), 3));
  geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));

  return geometry;
};

},{}]},{},[8])


//# sourceMappingURL=bundle.js.map
