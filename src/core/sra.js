// SRA - Simple Rendering Application

// ----------------------------------------------------------------------------
// --------------------------------- GEOMETRY ---------------------------------
// ----------------------------------------------------------------------------
var Geometry = {
	_PRECISION: 0.0001,
	_DEG2RAD: 0.0174532925,

	degreesToRadians: function (degrees) {
		return degrees * this._DEG2RAD;
	},

	radiansToDegrees: function (radians) {
		return radians / this._DEG2RAD;
	}
};

Geometry.Vector2 = function (x, y) {
	this.x = x;
	this.y = y;
};

Geometry.Vector2.Zero = new Geometry.Vector2(0.0, 0.0);

// modifies fields
Geometry.Vector2.prototype.add = function (vector) {
	this.x += vector.x;
	this.y += vector.y;
	return this;
}

// modifies fields
Geometry.Vector2.prototype.subtract = function (vector) {
	this.x -= vector.x;
	this.y -= vector.y;
	return this;
}

Geometry.Vector2.prototype.plus = function (vector) {
	return new Geometry.Vector2(this.x + vector.x, this.y + vector.y);
}

Geometry.Vector2.prototype.minus = function (vector) {
	return new Geometry.Vector2(this.x - vector.x, this.y - vector.y);
}

Geometry.Vector2.prototype.dot = function (vector) {
	return (this.x * vector.x ) + (this.y * vector.y);
}

Geometry.Vector2.prototype.magnitude = function () {
	return Math.sqrt((this.x * this.x) + (this.y * this.y));
}

// only use for magnitude comparison
Geometry.Vector2.prototype.fastMagnitude = function () {
	return (this.x * this.x) + (this.y * this.y);	
}

// returns null if an angle does not exist
Geometry.Vector2.prototype.angleFrom = function (vector) {
	var dot = this.dot(vector);
	var mod1 = this.magnitude();
	var mod2 = vector.magnitude();
	var divisor = mod1 * mod2;

	if (divisor == 0) {
		return null;
	}

	return Math.acos(dot / divisor);
}

Geometry.Vector2.prototype.max = function () {
	return this.x > this.y ? this.x : this.y;
}

Geometry.Vector2.prototype.distanceFrom = function (vector) {
	return vector.minus(this).magnitude();
}

Geometry.Vector2.prototype.clone = function () {
	return new Geometry.Vector2(this.x, this.y);
}

Geometry.Vector2.prototype.equals = function (vector) {	
	return Math.abs(this.x - vector.x) <= Geometry._PRECISION && Math.abs(this.y - vector.y) <= Geometry._PRECISION;
}

Geometry.Vector2.prototype.toString = function () {
	return "{" + this.x + ", " + this.y + "}";
}

Geometry.Vector2.prototype.opposite = function () {
	return new Geometry.Vector2(-this.x, -this.y);
}

Geometry.Vector2.prototype.isOppositeTo = function (vector) {
	var angle = this.angleFrom(vector);

	if (!angle) {
		return false;
	}

	return Math.abs(angle - Math.PI) <= Geometry._PRECISION;
}

Geometry.Vector2.prototype.isParallelTo = function (vector) {
	var angle = this.angleFrom(vector);

	if (!angle) {
		return false;
	}

	return angle <= Geometry._PRECISION;
}

Geometry.Vector2.prototype.isPerpendicularTo = function (vector) {
	var dot = this.dot(vector);
	return Math.abs(dot) <= Geometry._PRECISION;	
}

Geometry.Vector2.prototype.map = function (func) {
	return new Geometry.Vector2(func(this.x), func(this.y));
}

Geometry.Vector2.prototype.multiply = function (num) {
	return new Geometry.Vector2(this.x * num, this.y * num);
}

Geometry.Vector2.prototype.reflectionOn = function (vector) {
	return new Geometry.Vector2(vector.x + (vector.x - this.x), vector.y + (vector.y - this.y));
}

// modifies fields
Geometry.Vector2.prototype.rotate = function (angleRads) {
	var cos = Math.cos(angleRads);
	var sin = Math.sin(angleRads);

	var newX = this.x * cos - this.y * sin;
	var newY = this.x * sin + this.y * cos;

	this.x = newX;
	this.y = newY;

	return this;
}

// modifies fields
Geometry.Vector2.prototype.normalize = function () {
	var magnitude = this.magnitude();
	this.x /= magnitude;
	this.y /= magnitude;
	return this;
}

Geometry.Vector2.prototype.angleFromXAxis = function () {
	return Math.atan2(this.y, this.x);
}

// point-specific methods
Geometry.Vector2.prototype.rotateAroundPivot = function (pivot, angleRads) {
	this.subtract(pivot);
	this.rotate(angleRads);
	this.add(pivot);
	return this;
}

Geometry.Matrix3 = function (elements) {
	this.elements = elements.slice();
}

Geometry.Matrix3.Zero = new Geometry.Matrix3([[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]]);

Geometry.Matrix3.Identity = new Geometry.Matrix3([[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]]);

Geometry.Matrix3.prototype.clone = function () {
	return new Geometry.Matrix3(this.elements);
}

Geometry.Matrix3.prototype.toString = function () {
	var m = this.elements;

	return "" 	+ m[0][0] + ", " + m[0][1] + ", " + m[0][2] + '\n'
				+ m[1][0] + ", " + m[1][1] + ", " + m[1][2] + '\n'
				+ m[2][0] + ", " + m[2][1] + ", " + m[2][2];
}

Geometry.Matrix3.prototype.add = function (matrix) {
	var m1 = this.elements;
	var m2 = matrix.elements;

	m1[0][0] += m2[0][0];
	m1[0][1] += m2[0][1];
	m1[0][2] += m2[0][2];
	m1[1][0] += m2[1][0];
	m1[1][1] += m2[1][1];
	m1[1][2] += m2[1][2];
	m1[2][0] += m2[2][0];
	m1[2][1] += m2[2][1];
	m1[2][2] += m2[2][2];

	return this;
}

Geometry.Matrix3.prototype.subtract = function (matrix) {
	var m1 = this.elements;
	var m2 = matrix.elements;

	m1[0][0] -= m2[0][0];
	m1[0][1] -= m2[0][1];
	m1[0][2] -= m2[0][2];
	m1[1][0] -= m2[1][0];
	m1[1][1] -= m2[1][1];
	m1[1][2] -= m2[1][2];
	m1[2][0] -= m2[2][0];
	m1[2][1] -= m2[2][1];
	m1[2][2] -= m2[2][2];

	return this;
}

Geometry.Matrix3.prototype.plus = function (matrix) {
	var m1 = this.elements;
	var m2 = matrix.elements;

	return new Geometry.Matrix3([
		[m1[0][0] + m2[0][0], m1[0][1] + m2[0][1], m1[0][2] + m2[0][2]],
		[m1[1][0] + m2[1][0], m1[1][1] + m2[1][1], m1[1][2] + m2[1][2]],
		[m1[2][0] + m2[2][0], m1[2][1] + m2[2][1], m1[2][2] + m2[2][2]]
	]);
}

Geometry.Matrix3.prototype.minus = function (matrix) {
	var m1 = this.elements;
	var m2 = matrix.elements;

	return new Geometry.Matrix3([
		[m1[0][0] - m2[0][0], m1[0][1] - m2[0][1], m1[0][2] - m2[0][2]],
		[m1[1][0] - m2[1][0], m1[1][1] - m2[1][1], m1[1][2] - m2[1][2]],
		[m1[2][0] - m2[2][0], m1[2][1] - m2[2][1], m1[2][2] - m2[2][2]]
	]);	
}

Geometry.Matrix3.prototype.toUpperTriangular = function () {
	var triangular = this.clone();
	var elements = triangular.elements;
	var row, i, j, p;

	for (i = 0; i < 3; i++) {
		if (elements[i][i] === 0) {
			for (j = i + 1; j < 3; j++) {
				if (elements[j][i] !== 0) {
					elements[i] = [elements[i][0] + elements[j][0], elements[i][1] + elements[j][1], elements[i][2] + elements[j][2]];
					break;
				}
			}
		}

		if (elements[i][i] !== 0) {
			for (j = i + 1; j < 3; j++) {
				var multiplier = elements[j][i] / elements[i][i];
				row = [];

				for (p = 0; p < 3; p++) {
					row.push(p <= i ? 0 : elements[j][p] - (elements[i][p] * multiplier));
				}

				elements[j] = row;
			}
		}
	}

	return triangular;
}

Geometry.Matrix3.prototype.toRightTriangular = Geometry.Matrix3.prototype.toUpperTriangular;

Geometry.Matrix3.prototype.determinant = function () {
	var triangular = this.toRightTriangular();
	var m = triangular.elements;
	return m[0][0] * m[1][1] * m[2][2];
}

Geometry.Matrix3.prototype.element = function(i, j) {
	return this.elements[i][j];
}

Geometry.Matrix3.prototype.equals = function (matrix) {
	var m1 = this.elements;
	var m2 = matrix.elements;
	var p = Geometry._PRECISION;

	return 	Math.abs(m1[0][0] - m2[0][0]) <= p &&
			Math.abs(m1[0][1] - m2[0][1]) <= p &&
			Math.abs(m1[0][2] - m2[0][2]) <= p &&
			Math.abs(m1[1][0] - m2[1][0]) <= p &&
			Math.abs(m1[1][1] - m2[1][1]) <= p &&
			Math.abs(m1[1][2] - m2[1][2]) <= p &&
			Math.abs(m1[2][0] - m2[2][0]) <= p &&
			Math.abs(m1[2][1] - m2[2][1]) <= p &&
			Math.abs(m1[2][2] - m2[2][2]) <= p;
}

Geometry.Matrix3.prototype.map = function(func) {
	var m = this.elements;

	return [
		[func(m[0][0]), func(m[0][1]), func(m[0][2])], 
		[func(m[1][0]), func(m[1][1]), func(m[1][2])],
		[func(m[2][0]), func(m[2][1]), func(m[2][2])]
	];
}

// modifies fields
Geometry.Matrix3.prototype.multiply = function(matrix) {
	var i, j, k;
	var m1 = this.elements;
	var m2 = matrix.elements;
	var result = this.elements = Matrix3.Zero.elements.slice();

	for(i = 0; i < 3; i++) {
		for(j = 0; j < 3; j++) {
			for(k = 0; k < 3; k++) {
				result[i][j] += m1[i][k] * m2[k][j];
			}
		}
	}

	return this;
}

// modifies fields
Geometry.Matrix3.prototype.multiplyScalar = function (num) {
	var m = this.elements;

	m[0][0] *= num;
	m[0][1] *= num;
	m[0][2] *= num;
	m[1][0] *= num;
	m[1][1] *= num;
	m[1][2] *= num;
	m[2][0] *= num;
	m[2][1] *= num;
	m[3][2] *= num;

	return this;
}

Geometry.Matrix3.prototype.trace = function () {
	var m = this.elements;
	return m[0][0] + m[1][1] + m[2][2];
}

// modifies fields
Geometry.Matrix3.prototype.transpose = function () {
	var elements = this.elements;
	var result = this.elements = [];

	result[0][1] = elements[1][0];
	result[0][2] = elements[2][0];
	result[1][0] = elements[0][1];
	result[1][2] = elements[2][1];
	result[2][0] = elements[0][2];
	result[2][1] = elements[1][2];

	return this;
}

Geometry.Size = function (width, height) {
	this.width = width;
	this.height = height;
}

// modifies fields
Geometry.Size.prototype.add = function (size) {
	this.width += size.width;
	this.height += size.height;
	return this;
}

// modifies fields
Geometry.Size.prototype.subtract = function (size) {
	this.width -= size.width;
	this.height -= size.height;
	return this;
}

Geometry.Size.prototype.plus = function (size) {
	return new Geometry.Size(this.width + size.width, this.height + size.height);
}

Geometry.Size.prototype.minus = function (size) {
	return new Geometry.Size(this.width - size.width, this.height - size.height);	
}

Geometry.Size.prototype.clone = function () {
	return new Geometry.Size(this.width, this.height);
}

Geometry.Size.Zero = new Geometry.Size(0.0, 0.0);

Geometry.Rect = function(origin, size) {
	this.origin = origin.clone();
	this.size = size.clone();
}

Geometry.Rect.prototype.clone = function () {
	return new Geometry.Rect(this.origin, this.size);
}

Geometry.Rect.Zero = new Geometry.Rect(Geometry.Vector2.Zero, Geometry.Size.Zero);

// ----------------------------------------------------------------------------
// --------------------------------- GRAPHICS ---------------------------------
// ----------------------------------------------------------------------------
var Graphics = {
	Color: {
		White: "rgb(255, 255, 255)",
		Black: "rgb(0, 0, 0)",
		Clear: "rgba(0, 0, 0, 0.0)",
		Red: "rgb(255, 0, 0)",
		Green: "rgb(0, 255, 0)",
		Blue: "rgb(0, 0, 255)",
		Yellow: "rgb(255, 255, 0)",
		Magenta: "rgb(255, 0, 255)",
		Cyan: "rgb(0, 255, 255)"
	}
};

Graphics.Image = {};

Graphics.Image.Cache = function (namespace) {
	this.namespace = namespace;
	this._images = {};
}

Graphics.Image.Cache.prototype.cacheImage = function (key, image) {
	this._images[key] = image;
}

Graphics.Image.Cache.prototype.imageForKey = function (key) {
	return this._images[key];
}

// If key is not passed, this will invalidate the whole cache
Graphics.Image.Cache.prototype.invalidate = function (key) {
	if (arguments.length) {
		this._images[key] = null;
	} else {
		for (var property in this._images) {
			this._images[property] = null;
		}
	}
}

// @imagePaths - REQUIRED, an array of image paths
// @cache - REQUIRED, a Graphics.Image.Cache object to be filled with the loaded images. Images will be cached with their paths as keys in the cache.
// Images will be available in the cache when the completion block is invoked
// @completionCallback - REQUIRED, a function invoked when loading has finished. It should take one parameter which will be the number 
// of images actually loaded
Graphics.Image.Loader = function (imagePaths, cache, completionCallback) {
	this._imagePaths = imagePaths;
	this._cache = cache;
	this._completionCallback = completionCallback;
	this._all = imagePaths.length;
	this._processed = 0;
	this._loaded = 0;
}

Graphics.Image.Loader.prototype.start = function () {
	for (var i = 0; i < this._all; i++) {
		var path = this._imagePaths[i];
		var image = new Image();

		image.onload = Graphics.Image.Loader.prototype._onLoad;
		image.onerror = Graphics.Image.Loader.prototype._onError;
		image.onabort = Graphics.Image.Loader.prototype._onAbort;

		image.GILoader = this;
		image.GIPath = path;
		image.src = path;
	}
}

Graphics.Image.Loader.prototype._completeMaybe = function () {
	if (this._processed == this._all) {
		this._completionCallback(this._loaded);
	}
}

Graphics.Image.Loader.prototype._onLoad = function () {
	var loader = this.GILoader;
	loader._processed++;
	loader._loaded++;
	console.log('caching - ' + this.GIPath + ' - ' + this);
	loader._cache.cacheImage(this.GIPath, this);
	loader._completeMaybe();
	this.GILoader = this.GIPath = null;
}

Graphics.Image.Loader.prototype._onError = function () {
	var loader = this.GILoader;
	loader._processed++;
	loader._completeMaybe();
	this.GILoader = this.GIPath = null;
}

Graphics.Image.Loader.prototype._onAbort = function () {
	var loader = this.GILoader;
	loader._processed++;
	loader._completeMaybe();
	this.GILoader = this.GIPath = null;
}

Graphics.Canvas = function (canvas) {
	this.DOMElement = canvas;
	this.context = canvas.getContext('2d');
	this._size = new Geometry.Size(canvas.width, canvas.height);
}

Graphics.Canvas.prototype.getSize = function () {
	return this._size.clone();
}

// ----------------------------------------------------------------------------
// --------------------------------- DISPATCH ---------------------------------
// ----------------------------------------------------------------------------
var Dispatch = {};

Dispatch.RunLoop = function (tickrate, callback, context) {
	this._tickrate = tickrate || 0.0;
	this._callback = callback;
	this._running = false;
	this._timer = null;
	this._context = context;
}

Dispatch.RunLoop.prototype.start = function () {
	if (this._running || this._tickrate <= 0 || !this._callback) {
		return;
	}

	this._running = true;
	this._timer = setInterval(this._callback, this._tickrate, this._context);
}

Dispatch.RunLoop.prototype.stop = function () {
	if (!this._running) {
		return;
	}

	clearTimeout(this._timer);
	this._running = false;
}

Dispatch.RunLoop.prototype.isRunning = function () {
	return this._running;
}

Dispatch.RunLoop.prototype.setTickRate = function (tickrate) {
	this._tickrate = tickrate;

	if (this._running) {
		this.stop();
		this.start();
	}
}

Dispatch.RunLoop.prototype.getTickRate = function () {
	return this._tickrate;
}

Dispatch.Scheduler = function () {
	this._targets = [];
	this._actions = [];
}

Dispatch.Scheduler.prototype.schedule= function (target, action) {
	if (!target || !action) {
		return;
	}

	this._targets.push(target);
	this._actions.push(action);
}

Dispatch.Scheduler.prototype.unschedule = function (target) {
	var index = this._targets.indexOf(target);

	if (-1 == index) {
		return;
	}

	this._targets.splice(index, 1);
	this._actions.splice(index, 1);
}

Dispatch.Scheduler.prototype._hit = function (delta) {
	var target, action;

	for (var i = 0; i < this._targets.length; i++) {
		target = this._targets[i];
		action = this._actions[i];
		action.call(target, delta);
	}
}

// ----------------------------------------------------------------------------
// ----------------------------------- SRA ------------------------------------
// ----------------------------------------------------------------------------
var SRA = {};

/**
  * Credits for the following bezier easing implementation go to Gaëtan Renaudeau
  * Original source code can be found at https://github.com/gre/bezier-easing
  *
  * TimingFunction - use bezier curve for transition easing function
  * is inspired from Firefox's nsSMILKeySpline.cpp
  * Usage:
  * var spline = new TimingFunction(0.25, 0.1, 0.25, 1.0)
  * spline(x) => returns the easing value | x must be in [0, 1] range
  */
SRA.TimingFunction = function (mX1, mY1, mX2, mY2) {
	if (!(this instanceof SRA.TimingFunction)) return new SRA.TimingFunction(mX1, mY1, mX2, mY2);

    // Validate arguments
    if (arguments.length !== 4) throw new Error("TimingFunction requires 4 arguments.");
    for (var i=0; i<4; ++i) {
		if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i]))
			throw new Error("TimingFunction arguments should be integers.");
    }
    if (mX1 < 0 || mX1 > 1 || mX2 < 0 || mX2 > 1) throw new Error("TimingFunction x values must be in [0, 1] range.");
   
    function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
    function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
    function C(aA1)      { return 3.0 * aA1; }
   
    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
    function CalcBezier(aT, aA1, aA2) {
		return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
    }
   
    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
    function GetSlope(aT, aA1, aA2) {
		return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
    }
   
    function GetTForX(aX) {
     	// Newton raphson iteration
      	var aGuessT = aX;
      	for (var i = 0; i < 8; ++i) {
        	var currentSlope = GetSlope(aGuessT, mX1, mX2);
        	if (currentSlope === 0.0) return aGuessT;
        	var currentX = CalcBezier(aGuessT, mX1, mX2) - aX;
        	aGuessT -= currentX / currentSlope;
      	}
      	return aGuessT;
    }

    // TODO: optimization to come: cache and pre-compute some samples for faster computation

    var f = function (aX) {
      	if (mX1 === mY1 && mX2 === mY2) return aX; // linear
      	return CalcBezier(GetTForX(aX), mY1, mY2);
    };
    var str = "TimingFunction("+[mX1, mY1, mX2, mY2]+")";
    f.toString = function () { return str; };
    return f;
}

SRA.TimingFunction.Linear = function (x) { return x; };
SRA.TimingFunction.Ease = new SRA.TimingFunction(0.25, 0.1, 0.25, 1.0);
SRA.TimingFunction.EaseIn = new SRA.TimingFunction(0.42, 0.0, 1.0, 1.0);
SRA.TimingFunction.EaseOut = new SRA.TimingFunction(0.0, 0.0, 0.58, 1.0);
SRA.TimingFunction.EaseInOut = new SRA.TimingFunction(0.42, 0.0, 0.58, 1.0);

SRA.BaseAction = {
	_init: function (duration, rate) {
		this._target = null;
		this._duration = duration;
		this._finished = false;
		this._elapsedTime = 0.0;
		this.rate = rate || 1.0;
		this._timingFunction = SRA.TimingFunction.Linear;
	},

	setTimingFunction: function (timingFunction) {
		this._timingFunction = timingFunction;
	},

	_begin: function (target) {
		this._target = target;
		this._elapsedTime = 0.0;
		this._finished = false;

		this.begin();
	},

	begin: function () {

	},

	_step: function (delta) {
		this._elapsedTime += delta;
		var duration = this._duration;

		if (duration <= 0.0) {
			this.step(1);
			return;
		}

		duration /= this.rate;

		if (this._elapsedTime > duration) {
			this._elapsedTime = duration;
		}

		this.step(this._timingFunction(this._elapsedTime / duration));	
	},

	step: function (progress) {

	},

	end: function () {
		this._finished = true;
	},

	hasFinished: function () {
		return this._finished || this._elapsedTime >= this._duration / this.rate;
	}
};

SRA.DelayAction = function (duration, rate) {
	this._init(duration, rate);
}

SRA.DelayAction.prototype = Object.create(SRA.BaseAction);

SRA.RepeatAction = function (innerAction, repeat) {
	this._init(0.0, 1.0);

	var infinite = (repeat && repeat < 0 ? true : false);
	var iterations = 0;

	if (!infinite) {
		iterations = 1 + (repeat || 0);
	}
	
	this._iterations = iterations;
	this._infinite = infinite;
	this._innerAction = innerAction;
}

SRA.RepeatAction.prototype = Object.create(SRA.BaseAction);

SRA.RepeatAction.prototype._begin = function (target) {
	this._target = target;
	this._innerAction._begin(target);
}

SRA.RepeatAction.prototype._step = function (delta) {
	this._innerAction._step(delta);

	if (this._innerAction.hasFinished() && (this._iterations > 0 || this._infinite)) {
		this._iterations--;
		this._innerAction._begin(this._target);
	}
}

SRA.RepeatAction.prototype.hasFinished = function () {
	return this._finished || (this._iterations <= 0 && !this._infinite);
}

SRA.ActionGroup = function (actions) {
	this._init(0.0, 1.0);
	this._actions = actions.slice();
	this._activeActions = null;
}

SRA.ActionGroup.prototype = Object.create(SRA.BaseAction);

SRA.ActionGroup.prototype._begin = function (target) {
	this._target = target;
	var actions = this._activeActions = this._actions.slice();
	var length = actions.length;

	for (var i = 0; i < length; i++) {
		actions[i]._begin(target);
	}
}

SRA.ActionGroup.prototype._step = function (delta) {
	var actions = this._activeActions;
	var length = actions.length;
	var action;

	for (var i = 0; i < length; i++) {
		action = actions[i];
		action._step(delta);

		if (action.hasFinished()) {
			actions.splice(i, 1);
			length--;
			i--;
		}
	}
}

SRA.ActionGroup.prototype.hasFinished = function () {
	return !this._activeActions.length || this._finished;
}

SRA.ActionSequence = function (actions) {
	this._init(0.0, 1.0);
	this._actions = actions.slice();
	this._currentActionIndex = 0;
}

SRA.ActionSequence.prototype = Object.create(SRA.BaseAction);

SRA.ActionSequence.prototype._begin = function (target) {
	this._target = target;
	this._currentActionIndex = 0;
	this._actions[0]._begin(target);
}

SRA.ActionSequence.prototype._step = function (delta) {
	var action = this._actions[this._currentActionIndex];
	action._step(delta);

	if (action.hasFinished()) {
		if (++this._currentActionIndex < this._actions.length) {
			this._actions[this._currentActionIndex]._begin(this._target);
		}
	}
}

SRA.ActionSequence.prototype.hasFinished = function () {
	return this._currentActionIndex >= this._actions.length || this._finished;
}

SRA.MoveToAction = function (toPoint, duration, rate) {
	this._init(duration, rate);
	this._to = toPoint.clone();
}

SRA.MoveToAction.prototype = Object.create(SRA.BaseAction);

SRA.MoveToAction.prototype.begin = function () {
	this._from = this._target.rect.origin.clone();
	this._delta = this._to.minus(this._from);
}

SRA.MoveToAction.prototype.step = function (progress) {
	var step = this._delta.multiply(progress);
	this._target.rect.origin = this._from.plus(step);
}

SRA.MoveByAction = function (delta, duration, rate) {
	this._init(duration, rate);
	this._delta = delta.clone();
}

SRA.MoveByAction.prototype = Object.create(SRA.BaseAction);

SRA.MoveByAction.prototype.begin = function () {
	this._from = this._target.rect.origin.clone();
}

SRA.MoveByAction.prototype.step = function (progress) {
	var step = this._delta.multiply(progress);
	this._target.rect.origin = this._from.plus(step);
}

SRA.RotateToAction = function (angleRadians, duration, rate) {
	this._init(duration, rate);
	this._to = angleRadians;
}

SRA.RotateToAction.prototype = Object.create(SRA.BaseAction);

SRA.RotateToAction.prototype.begin = function () {
	this._from = this._target.rotation;
	this._delta = this._to - this._from;
}

SRA.RotateToAction.prototype.step = function (progress) {
	var step = this._delta * progress;
	this._target.rotation = this._from + step;
}

SRA.RotateByAction = function (angleRadians, duration, rate) {
	this._init(duration, rate);
	this._delta = angleRadians;
}

SRA.RotateByAction.prototype = Object.create(SRA.BaseAction);

SRA.RotateByAction.prototype.begin = function () {
	this._from = this._target.rotation;
}

SRA.RotateByAction.prototype.step = function (progress) {
	var step = this._delta * progress;
	this._target.rotation = this._from + step;
}

SRA.ScaleToAction = function (scale, duration, rate) {
	this._init(duration, rate);
	this._to = scale.clone();
}

SRA.ScaleToAction.prototype = Object.create(SRA.BaseAction);

SRA.ScaleToAction.prototype.begin = function () {
	this._from = this._target.scale.clone();
	this._delta = this._to.minus(this._from);
}

SRA.ScaleToAction.prototype.step = function (progress) {
	var step = this._delta.multiply(progress);
	this._target.scale = this._from.plus(step);
}

SRA.ScaleByAction = function (scale, duration, rate) {
	this._init(duration, rate);
	this._delta = scale.clone();
}

SRA.ScaleByAction.prototype = Object.create(SRA.BaseAction);

SRA.ScaleByAction.prototype.begin = function () {
	this._from = this._target.scale.clone();
}

SRA.ScaleByAction.prototype.step = function (progress) {
	var step = this._delta.multiply(progress);
	this._target.scale = this._from.plus(step);
}

SRA.FadeToAction = function (value, duration, rate) {
	this._init(duration, rate);
	this._to = value;
}

SRA.FadeToAction.prototype = Object.create(SRA.BaseAction);

SRA.FadeToAction.prototype.begin = function () {
	this._from = this._target.opacity;
	this._delta = this._to - this._from;
}

SRA.FadeToAction.prototype.step = function (progress) {
	var step = this._delta * progress;
	this._target.opacity = this._from + step;
}

SRA.FadeByAction = function (delta, duration, rate) {
	this._init(duration, rate);
	this._delta = delta;
}

SRA.FadeByAction.prototype = Object.create(SRA.BaseAction);

SRA.FadeByAction.prototype.begin = function () {
	this._from = this._target.opacity;
}

SRA.FadeByAction.prototype.step = function (progress) {
	var step = this._delta * progress;
	this._target.opacity = this._from + step;
}

SRA.ActionManager = function () {
	this._actions = [];
}

SRA.ActionManager.prototype.addAction = function (action, target) {
	if (!target) {
		return;
	}
	
	action._begin(target);
	this._actions.push(action);
}

SRA.ActionManager.prototype.removeAction = function (action) {
	var index = this._actions.indexOf(action);

	if (-1 == index) {
		return false;
	}

	this._actions.splice(index, 1);
	return true;
}

SRA.ActionManager.prototype._hit = function (delta) {
	var length = this._actions.length;

	for (var i = 0; i < length; i++) {
		var action = this._actions[i];
		action._step(delta);

		if (action.hasFinished()) {
			this.removeAction(action);
			i--;
			length--;		
		}
	}
}

SRA.Entity = function () {
	this.tag = 0
	this.context = {};

	this.rect = Geometry.Rect.Zero.clone();
	this.rotation = 0.0;
	this.scale = new Geometry.Vector2(1.0, 1.0);
	this.anchor = new Geometry.Vector2(0.5, 0.5);
	this.zOrder = 0;

	this.sprite = null;
	this.backgroundColor = Graphics.Color.White;

	this.visible = true;
	this.opacity = 1.0;
	this.rigidBody = null;

	this.children = [];
	this._parent = null;
	this._childrenNeedSorting = false;
}

SRA.Entity.prototype.getPosition = function () {
	return new Geometry.Vector2(this.rect.origin.x + (this.rect.size.width * this.anchor.x), this.rect.origin.y + (this.rect.size.height * this.anchor.y));
}

SRA.Entity.prototype.setPosition = function (position) {
	this.rect.origin.x = position.x - (this.rect.size.width * this.anchor.x);
	this.rect.origin.y = position.y - (this.rect.size.height * this.anchor.y);
}

SRA.Entity.prototype.addChild = function (childEntity) {
	this.children.push(childEntity);
	childEntity._parent = this;
	this._childrenNeedSorting = true;
}

SRA.Entity.prototype.removeFromParent = function () {
	if (!this._parent) {
		return;
	}

	var index = this._parent.children.indexOf(this);

	if (-1 == index) {
		return;
	}

	this._parent.children.splice(index, 1);
	this._parent._childrenNeedSorting = true;
	this._parent = null;
}

SRA.Entity.prototype.childWithTag = function (tag) {
	for (var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if (tag == child.tag) {
			return child;
		}
	}

	return null;
}

SRA.Entity.prototype.addAction = function (action) {
	SRA.Controller.getSharedInstance().getActionManager().addAction(action, this);
}

SRA.Entity.prototype.draw = function (context) {
	context.save();

	context.globalAlpha = this.opacity;

	if (this.backgroundColor) {
		context.fillStyle = this.backgroundColor;
		context.fillRect(0.0, 0.0, this.rect.size.width, this.rect.size.height);
	}

	if (this.sprite) {
		context.drawImage(this.sprite, this.rect.origin.x, this.rect.origin.y);
	}

	context.restore();
}

SRA.Entity.prototype._hit = function (context) {
	if (!this.visible || this.opacity <= 0.0) {
		return;
	}

	this._applyTransform(context);

	var childrenCount = this.children.length;

	if (!childrenCount) {
		this.draw(context);
	} else {
		if (this._childrenNeedSorting) {
			this._childrenNeedSorting = false;
			this._sortChildrenByZOrder();
		}		

		var i = 0;

		for (; i < childrenCount; i++) {
			var child = this.children[i];

			if (child.zOrder < 0) {
				child._hit(context);
			} else {
				break;
			}
		}

		this.draw(context);

		for (; i < childrenCount; i++) {
			var child = this.children[i];
			child._hit(context);
		}
	}

	this._removeTransform(context);
}

SRA.Entity.prototype._applyTransform = function (context) {
	context.save();

	var rotate = this.rotation != 0.0;
	var scale = this.scale.x != 1.0 || this.scale.y != 1.0;

	if (rotate || scale) {
		// Rotation and scaling needs to be done relative to the position
		var position = this.getPosition();
		var xDiff = position.x - this.rect.origin.x;
		var yDiff = position.y - this.rect.origin.y;

		context.translate(position.x, position.y);

		if (rotate) {
			context.rotate(this.rotation);	
		}

		if (scale) {
			context.scale(this.scale.x, this.scale.y);
		}
				
		context.translate(-xDiff, -yDiff);
	} else {
		context.translate(this.rect.origin.x, this.rect.origin.y);
	}
}

SRA.Entity.prototype._removeTransform = function (context) {
	context.restore();
}

SRA.Entity.prototype._sortChildrenByZOrder = function () {
	this.children.sort(function (a, b) {
		return a.zOrder - b.zOrder;
	});
}

SRA.Scene = function () {}

SRA.Scene.prototype = new SRA.Entity();

SRA.Controller = function () {}

SRA.Controller.getSharedInstance = function () {
	if (!SRA.Controller._sharedInstance) {
		var controller = new SRA.Controller();
		controller.canvas = null;
		controller.scheduler = new Dispatch.Scheduler();
		controller._runLoop = new Dispatch.RunLoop(-1, SRA.Controller.prototype._mainLoop, controller);
		controller._actionManager = new SRA.ActionManager();
		controller._scenesStack = [];
		controller._deltaTime = 0.0;
		controller._lastDisplayTime = 0;
		controller._paused = false;

		SRA.Controller._sharedInstance = controller;
	}

	return SRA.Controller._sharedInstance;
}

SRA.Controller.prototype.setFrameRate = function (fps) {
	this._runLoop.setTickRate(1000.0 / fps);
}

SRA.Controller.prototype.getFrameRate = function () {
	return 1000.0 / this._runLoop.getTickRate();
}

SRA.Controller.prototype.pushScene = function (scene) {
	if (!scene) {
		return;
	}

	this._scenesStack.push(scene);
}

SRA.Controller.prototype.popScene = function () {
	return this.scenesStack.pop();
}

SRA.Controller.prototype.getTopScene = function () {
	if (!this._scenesStack.length) {
		return null;
	}

	return this._scenesStack[this._scenesStack.length - 1];
}

SRA.Controller.prototype.getActionManager = function () {
	return this._actionManager;
}

SRA.Controller.prototype.pause = function () {
	this._paused = true;
}

SRA.Controller.prototype.run = function () {
	this._paused = false;
	this._runLoop.start();
}

SRA.Controller.prototype._mainLoop = function (context) {
	var controller = context;
	var topScene = controller.getTopScene();

	if (!topScene || controller._paused) {
		controller._deltaTime = 0;
		controller._lastDisplayTime = 0;
		controller._runLoop.stop();
		return;
	}

	controller._calculateDeltaTime();
	controller._actionManager._hit(controller._deltaTime);
	controller.scheduler._hit(controller._deltaTime);
	topScene._hit(controller.canvas.context);
}

SRA.Controller.prototype._calculateDeltaTime = function () {
	var now = Date.now();

	if (!this._lastDisplayTime) {
		this._deltaTime = 0;
	} else {
		var dt = now - this._lastDisplayTime;
		this._deltaTime = dt / 1000.0; // Seconds would be more convenient
	}

	this._lastDisplayTime = now;
}
