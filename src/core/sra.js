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

Geometry.Vector2.prototype.equals = function (vector, precise) {
	if (!precise) {
		return this.x == vector.x && this.y == vector.y;
	}

	return Math.abs(this.x - vector.x) <= _PRECISION && Math.abs(this.y - vector.y) <= _PRECISION;
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

	return Math.abs(angle - Math.PI) <= _PRECISION;
}

Geometry.Vector2.prototype.isParallelTo = function (vector) {
	var angle = this.angleFrom(vector);

	if (!angle) {
		return false;
	}

	return angle <= _PRECISION;
}

Geometry.Vector2.prototype.isPerpendicularTo = function (vector) {
	var dot = this.dot(vector);
	return Math.abs(dot) <= _PRECISION;	
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

	return 	Math.abs(m1[0][0] - m2[0][0]) <= _PRECISION &&
			Math.abs(m1[0][1] - m2[0][1]) <= _PRECISION &&
			Math.abs(m1[0][2] - m2[0][2]) <= _PRECISION &&
			Math.abs(m1[1][0] - m2[1][0]) <= _PRECISION &&
			Math.abs(m1[1][1] - m2[1][1]) <= _PRECISION &&
			Math.abs(m1[1][2] - m2[1][2]) <= _PRECISION &&
			Math.abs(m1[2][0] - m2[2][0]) <= _PRECISION &&
			Math.abs(m1[2][1] - m2[2][1]) <= _PRECISION &&
			Math.abs(m1[2][2] - m2[2][2]) <= _PRECISION;
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
// this should have delay and sub actions
SRA.Action = function (target, key, fromValue, toValue, duration, rate) {
	this._target = target;
	this._key = key;

	this._from = fromValue;
	this._to = toValue;
	this._step = (toValue - fromValue) / duration;

	this.rate = rate || 1.0;
	this._finished = false;
}

SRA.Action.prototype._step = function (delta) {
	var value = this._target[this._key] + this._step * (this.rate * delta);

	if (value > this._to) {
		value = this._to;
	}

	this._target[this._key] = value;	
}

SRA.Action.prototype._begin = function () {
	this._target[this._key] = this._from;
}

SRA.Action.prototype.end = function () {
	this._target[this._key] = this._to;
	this._finished = true;
}

SRA.Action.prototype.hasFinished = function () {
	return this._finished;
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

}

SRA.Entity.prototype.draw = function (context) {
	context.save();

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
	if (!this.visible) {
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
