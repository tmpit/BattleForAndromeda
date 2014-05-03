// SRA - Simple Rendering Application

// ----------------------------------------------------------------------------
// --------------------------------- GRAPHICS ---------------------------------
// ----------------------------------------------------------------------------
var Graphics = {
	Color: {
		White: 'rgb(255, 255, 255)',
		Black: 'rgb(0, 0, 0)',
		Gray: 'rgb(200, 200, 200)',
		Clear: 'rgba(0, 0, 0, 0)',
		Red: 'rgb(255, 0, 0)',
		Green: 'rgb(0, 255, 0)',
		Blue: 'rgb(0, 0, 255)',
		Yellow: 'rgb(255, 255, 0)',
		Magenta: 'rgb(255, 0, 255)',
		Cyan: 'rgb(0, 255, 255)'
	},

	Image: {
		ContentMode: {
			Center: 0,
			Top: 1,
			Left: 2,
			Bottom: 3,
			Right: 4,
			TopLeft: 5,
			TopRight: 6,
			BottomLeft: 7,
			BottomRight: 8
		}
	}
};

Graphics.Image.Cache = function (namespace) {
	this.namespace = namespace || 'DefaultNamespace';
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
// ---------------------------------- INPUT -----------------------------------
// ----------------------------------------------------------------------------
var Input = {};

Input.EventObserver = function () {
	this._mouseDOMElement = null;
	this._observingKeyEvents = false;
	this._observingMouseEvents = false;
	this.keys = {};
	this.mousePosition = null;
	this.mouseDelta = Geometry.Vector2.Zero.clone();
}

Input.EventObserver.prototype.startObservingKeyboardEvents = function () {
	if (this._observingKeyEvents) {
		return;
	}

	this._observingKeyEvents = true;
	var self = this;

	window.onkeydown = function (event) {
		var c = self._charFromKeyCode(event.keyCode);
		self.keys[c] = true;
	}

	window.onkeyup = function (event) {
		var c = self._charFromKeyCode(event.keyCode);
		self.keys[c] = false;
	}
}

Input.EventObserver.prototype.stopObservingKeyboardEvents = function () {
	if (!this._observingKeyEvents) {
		return;
	}

	this._observingKeyEvents = false;
	window.onkeydown = null;
	window.onkeyup = null;
}

Input.EventObserver.prototype.startObservingMouseEvents = function (DOMElement) {
	if (this._observingMouseEvents) {
		return;
	}

	this._observingMouseEvents = true;
	this._mouseDOMElement = DOMElement;
	var self = this;

	DOMElement.onmousedown = function (event) {
		if (!event.button) {
			self.keys.left = true;
		} else if (2 == event.button) {
			self.keys.right = true;
		}
	}

	DOMElement.onmouseup = function (event) {
		if (!event.button) {
			self.keys.left = false;
		} else if (2 == event.button) {
			self.keys.right = false;
		}
	}

	DOMElement.oncontextmenu = function () {
		return false;
	}

	DOMElement.onmousemove = function (event) {
		var point = self._convertedPointInDOMElementSpace(event.clientX, event.clientY);

		if (self.mousePosition) {
			self.mouseDelta = point.minus(self.mousePosition);
		}

		self.mousePosition = point;
	}
}

Input.EventObserver.prototype.stopObservingMouseEvents = function () {
	if (!this._observingMouseEvents) {
		return;
	}

	this._observingMouseEvents = false;
	this._mouseDOMElement.onmousedown = null;
	this._mouseDOMElement.onmouseup = null;
	this._mouseDOMElement.onmousemove = null;
	this._mouseDOMElement.oncontextmenu = function () {
		return true;
	}

	this._mouseDOMElement = null;
}

Input.EventObserver.prototype._charFromKeyCode = function (code) {
	return String.fromCharCode(code);
}

Input.EventObserver.prototype._convertedPointInDOMElementSpace = function (x, y) {
	if (this._mouseDOMElement !== window) {
		var rect = this._mouseDOMElement.getBoundingClientRect();	
		x -= rect.left;
		y -= rect.top;
	}

	return new Geometry.Vector2(x, y);
}

// ----------------------------------------------------------------------------
// ----------------------------------- SRA ------------------------------------
// ----------------------------------------------------------------------------
var SRA = {};

SRA.BaseEntity = {
	_init: function () {
		this.tag = 0
		this.context = {};

		this.rect = Geometry.Rect.Zero.clone();
		this.rotation = 0.0;
		this.scale = new Geometry.Vector2(1.0, 1.0);
		this.anchor = new Geometry.Vector2(0.5, 0.5);
		this._zOrder = 0;

		this.contentMode = Graphics.Image.ContentMode.Center;
		this.sprite = null;
		this.backgroundColor = Graphics.Color.White;

		this.visible = true;
		this.opacity = 1.0;
		this.rigidBody = null;

		this.children = [];
		this._parent = null;
		this._childrenNeedSorting = false;	
	},

	getPosition: function () {
		return new Geometry.Vector2(this.rect.origin.x + (this.rect.size.width * this.anchor.x), 
									this.rect.origin.y + (this.rect.size.height * this.anchor.y));
	},

	setPosition: function (position) {
		this.rect.origin.x = position.x - (this.rect.size.width * this.anchor.x);
		this.rect.origin.y = position.y - (this.rect.size.height * this.anchor.y);
	},

	setZOrder: function (zOrder) {
		this._zOrder = zOrder;

		if (this._parent) {
			this._parent._childrenNeedSorting = true;
		}
	},

	getZOrder: function () {
		return this._zOrder;
	},

	addChild: function (childEntity) {
		this.children.push(childEntity);
		childEntity._parent = this;
		this._childrenNeedSorting = true;
	},

	removeAllChildren: function () {
		var children = this.children;
		var length = children.length;

		for (var i = 0; i < length; i++) {
			children[i]._parent = null;
		}

		children.splice(0, length);
	},

	removeFromParent: function () {
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
	},

	childWithTag: function (tag) {
		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			if (tag == child.tag) {
				return child;
			}
		}

		return null;
	},

	addAction: function (action) {
		SRA.Controller.getSharedInstance().getActionManager().addAction(action, this);
	},

	_draw: function (context) {
		context.save();

		context.globalAlpha = this.opacity;

		if (this.backgroundColor) {
			context.fillStyle = this.backgroundColor;
			context.fillRect(0.0, 0.0, this.rect.size.width, this.rect.size.height);
		}

		if (this.sprite) {
			this._drawSpriteRespectingContentMode(context);
		}

		if (this._drawMajor) {
			this._drawMajor(context);
		}

		if (this.draw) {
			this.draw(context);
		}

		context.restore();
	},

	_drawMajor: function (context) {
		// Subclass custom drawing
	},

	draw: function (context) {
		// Client custom drawing
	},

	_drawSpriteRespectingContentMode: function (context) {
		var w = this.rect.size.width;
		var h = this.rect.size.height;
		var iw = this.sprite.width;
		var ih = this.sprite.height;
		var minW = (w < iw ? w : iw);
		var minH = (h < ih ? h : ih);
		var clipW = iw > w;
		var clipH = ih > h;

		switch(this.contentMode) {
			case Graphics.Image.ContentMode.Center:
				if (clipW || clipH) {
					var clipX, clipY, startX, startY;

					if (clipW) {
						clipX = (iw - w) / 2.0;
						startX = 0.0;
					} else {
						clipX = 0.0;
						startX = (w - iw) / 2.0;
					}

					if (clipH) {
						clipY = (ih - h) / 2.0;
						startY = 0.0;
					} else {
						clipY = 0.0;
						startY = (h - ih) / 2.0;
					}

					context.drawImage(this.sprite, clipX, clipY, minW, minH, startX, startY, minW, minH);
				} else {
					context.drawImage(this.sprite, (w - iw) / 2.0, (h - ih) / 2.0);
				}
				break;

			case Graphics.Image.ContentMode.Top:
				if (clipW || clipH) {
					var clipX, startX;

					if (clipW) {
						clipX = (iw - w) / 2.0;
						startX = 0.0;
					} else {
						clipX = 0.0;
						startX = (w - iw) / 2.0;
					}

					context.drawImage(this.sprite, clipX, 0.0, minW, minH, startX, 0.0, minW, minH);
				} else {
					context.drawImage(this.sprite, (w - iw) / 2.0, 0.0);
				}
				break;

			case Graphics.Image.ContentMode.Left:
				if (clipW || clipH) {
					var clipY, startY;

					if (clipH) {
						clipY = (ih - h) / 2.0;
						startY = 0.0;
					} else {
						clipY = 0.0;
						startY = (h - ih) / 2.0;
					}

					context.drawImage(this.sprite, 0.0, clipY, minW, minH, 0.0, startY, minW, minH);
				} else {
					context.drawImage(this.sprite, 0.0, (h - ih) / 2.0);
				}
				break;

			case Graphics.Image.ContentMode.Bottom:
				if (clipW || clipH) {
					var clipX, clipY, startX, startY;

					if (clipW) {
						clipX = (iw - w) / 2.0;
						startX = 0.0;
					} else {
						clipX = 0.0;
						startX = (w - iw) / 2.0;
					}

					if (clipH) {
						clipY = ih - h;
						startY = 0.0;
					} else {
						clipY = 0.0;
						startY = h - ih;
					}
					
					context.drawImage(this.sprite, clipX, clipY, minW, minH, startX, startY, minW, minH);
				} else {
					context.drawImage(this.sprite, (w - iw) / 2.0, h - ih);
				}
				break;

			case Graphics.Image.ContentMode.Right:
				if (clipW || clipH) {
					var clipX, clipY, startX, startY;

					if (clipW) {
						clipX = iw - w;
						startX = 0.0;
					} else {
						clipX = 0.0;
						startX = w - iw;
					}

					if (clipH) {
						clipY = (ih - h) / 2.0;
						startY = 0.0;
					} else {
						clipY = 0.0;
						startY = (h - ih) / 2.0;
					}

					context.drawImage(this.sprite, clipX, clipY, minW, minH, startX, startY, minW, minH);
				} else {
					context.drawImage(this.sprite, w - iw, (h - ih) / 2.0);
				}
				break;

			case Graphics.Image.ContentMode.TopLeft:
				context.drawImage(this.sprite, 0.0, 0.0, minW, minH, 0.0, 0.0, minW, minH);
				break;

			case Graphics.Image.ContentMode.TopRight:
				var clipX, startX;

				if (clipW) {
					clipX = iw - w;
					startX = 0.0;
				} else {
					clipX = 0.0;
					startX = w - iw;
				}

				context.drawImage(this.sprite, clipX, 0.0, minW, minH, startX, 0.0, minW, minH);
				break;

			case Graphics.Image.ContentMode.BottomLeft:
				var clipY, startY;

				if (clipH) {
					clipY = ih - h;
					startY = 0.0;
				} else {
					clipY = 0.0;
					startY = h - ih;
				}

				context.drawImage(this.sprite, 0.0, clipY, minW, minH, 0.0, startY, minW, minH);
				break;

			case Graphics.Image.ContentMode.BottomRight:
				var clipX, clipY, startX, startY;

				if (clipW) {
					clipX = iw - w;
					startX = 0.0;
				} else {
					clipX = 0.0;
					startX = w - iw;
				} 

				if (clipH) {
					clipY = ih - h;
					startY = 0.0;
				} else {
					clipY = 0.0;
					startY = h - ih;
				}

				context.drawImage(this.sprite, clipX, clipY, minW, minH, startX, startY, minW, minH);
				break;
		}
	},

	_hit: function (context) {
		if (!this.visible || this.opacity <= 0.0) {
			return;
		}

		this._applyTransform(context);

		var childrenCount = this.children.length;

		if (!childrenCount) {
			this._draw(context);
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

			this._draw(context);

			for (; i < childrenCount; i++) {
				var child = this.children[i];
				child._hit(context);
			}
		}

		this._removeTransform(context);
	},

	_applyTransform: function (context) {
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
	},

	_removeTransform: function (context) {
		context.restore();
	},

	_sortChildrenByZOrder: function () {
		this.children.sort(function (a, b) {
			return a.zOrder - b.zOrder;
		});
	}
};

SRA.Entity = function () {
	this._init();
}

SRA.Entity.prototype = Object.create(SRA.BaseEntity);

SRA.TileEntity = function (images) {
	this._init();
	this._images = images = images.slice();
	this._numberOfRows = images.length;
	this._numberOfColumns = images[0].length;
	this._contentOffset = Geometry.Vector2.Zero.clone();

	var image = images[0][0];
	this._imageSize = new Geometry.Size(image.width, image.height);
}

SRA.TileEntity.prototype = Object.create(SRA.BaseEntity);

SRA.TileEntity.prototype.setContentOffset = function (contentOffset) {
	this._contentOffset = contentOffset.clone();
}

SRA.TileEntity.prototype.getContentOffset = function () {
	return this._contentOffset.clone();
}

SRA.TileEntity.prototype._drawMajor = function (context) {
	var w = this._imageSize.width;
	var h = this._imageSize.height;
	var contentOffset = this._contentOffset;
	var colIndex = Math.floor(contentOffset.x / w);
	var rowIndex = Math.floor(contentOffset.y / h);
	var startX = (colIndex * w) - contentOffset.x;
	var startY = (rowIndex * h) - contentOffset.y;
	var numRows = this._numberOfRows;
	var numCols = this._numberOfColumns;
	colIndex %= numCols;
	rowIndex %= numRows;

	if (colIndex < 0) {
		colIndex += numCols;
	}
	if (rowIndex < 0) {
		rowIndex += numRows;
	}
	
	var maxX = this.rect.getMaxX();
	var maxY = this.rect.getMaxY();
	var images = this._images;
	var x = startX, y = startY;
	var ci = colIndex, ri = rowIndex;

	while (y < maxY) {
		while (x < maxX) {
			var image = images[ri][ci];
			context.drawImage(image, x, y);

			x += w;

			if (++ci == numCols) {
				ci = 0;
			}
		}

		x = startX;
		y += h;
		ci = colIndex;

		if (++ri == numRows) {
			ri = 0;
		}
	}			
}

SRA.Scene = function () {
	this._init();
}

SRA.Scene.prototype = Object.create(SRA.BaseEntity);

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
		this._elapsedTime = 0.0;
		this.rate = rate || 1.0;	
		this._timingFunction = SRA.TimingFunction.Linear;
		this._jumpToEnd = false;
		this._active = true;
		this._finished = false;
	},

	setTimingFunction: function (timingFunction) {
		this._timingFunction = timingFunction;
	},

	_begin: function (target) {
		this._target = target;
		this._elapsedTime = 0.0;
		this._finished = false;
		this._jumpToEnd = false;
		this._active = true;
		this._finished = false;

		this.begin();
	},

	begin: function () {

	},

	_step: function (delta) {
		if (!this._active) {
			return;
		}

		this._elapsedTime += delta;
		var duration = this._duration;

		if (duration <= 0.0) {
			this.step(1);
			return;
		}

		duration /= this.rate;

		if (this._elapsedTime > duration || this._jumpToEnd) {
			this._elapsedTime = duration;
		}

		this.step(this._timingFunction(this._elapsedTime / duration));
	},

	step: function (progress) {

	},

	end: function (interrupt) {
		if (interrupt) {
			this._active = false;
		} else {
			this._jumpToEnd = true;
		}
		
		this._finished = true;
	},

	hasFinished: function () {
		return this._finished || this._elapsedTime >= this._duration / this.rate;
	},

	pause: function () {
		this._active = false;
	},

	resume: function () {
		this._active = true;
	}
};

SRA.DelayAction = function (duration, rate) {
	this._init(duration, rate);
}

SRA.DelayAction.prototype = Object.create(SRA.BaseAction);
// TODO: implement inactive state and end in complex actions
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
	if (!this._active) {
		return;
	}

	if (this._jumpToEnd) {
		var action = this._innerAction;
		action.end(false);
		action._step(0.0);

		if (!this._infinite) {
			var iterations = this._iterations - 1;
			var target = this._target;

			while (iterations > 0) {
				action._begin(target);
				action.end(false);
				action._step(0.0);
				iterations--;
			}

			this._iterations = 0;
		}
	} else {
		this._innerAction._step(delta);

		if (this._innerAction.hasFinished() && (this._iterations > 0 || this._infinite)) {
			this._iterations--;
			this._innerAction._begin(this._target);
		}
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
	if (!this._active) {
		return;
	}

	var actions = this._activeActions;
	var length = actions.length;
	var action;

	if (this._jumpToEnd) {
		for (var i = 0; i < length; i++) {
			action = actions[i];
			action.end(false);
			action._step(0.0);
		}

		actions.splice(0, length);
	} else {
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
	if (!this._active) {
		return;
	}

	if (this._jumpToEnd) {
		var target = this._target;
		var actions = this._actions;
		var length = actions.length;

		var action = actions[this._currentActionIndex];
		action.end(false);
		action._step(0.0);

		for (var i = this._currentActionIndex + 1; i < length; i++) {
			action = actions[i];
			action._begin(target);
			action.end(false);
			action._step(0.0);
		}

		this._currentActionIndex = length - 1;
	} else {
		var action = this._actions[this._currentActionIndex];
		action._step(delta);

		if (action.hasFinished()) {
			if (++this._currentActionIndex < this._actions.length) {
				this._actions[this._currentActionIndex]._begin(this._target);
			}
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
	var step = this._delta.times(progress);
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
	var step = this._delta.times(progress);
	this._target.rect.origin = this._from.plus(step);
}

SRA.MovePositionToAction = function (toPosition, duration, rate) {
	this._init(duration, rate);
	this._to = toPosition;
}

SRA.MovePositionToAction.prototype = Object.create(SRA.BaseAction);

SRA.MovePositionToAction.prototype.begin = function () {
	this._from = this._target.getPosition();
	this._delta = this._to.minus(this._from);
}

SRA.MovePositionToAction.prototype.step = function (progress) {
	var step = this._delta.times(progress);
	this._target.setPosition(this._from.plus(step));
}

SRA.MovePositionByAction = function (delta, duration, rate) {
	this._init(duration, rate);
	this._delta = delta.clone();
}

SRA.MovePositionByAction.prototype = Object.create(SRA.BaseAction);

SRA.MovePositionByAction.prototype.begin = function () {
	this._from = this._target.getPosition();
}

SRA.MovePositionByAction.prototype.step = function (progress) {
	var step = this._delta.times(progress);
	this._target.setPosition(this._from.plus(step));	
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
	var step = this._delta.times(progress);
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
	var step = this._delta.times(progress);
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

SRA.SpriteAction = function (images, duration, rate) {
	this._init(duration, rate);
	this._images = images.slice();
}

SRA.SpriteAction.prototype = Object.create(SRA.BaseAction);

SRA.SpriteAction.prototype.begin = function () {
	this._threshold = 1.0 / this._images.length;
}

SRA.SpriteAction.prototype.step = function (progress) {
	var index = Math.floor(progress / this._threshold);
	var images = this._images;

	if (index >= images.length) {
		index = images.length - 1;
	}

	this._target.sprite = images[index];
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

SRA.Controller = function () {}

SRA.Controller.getSharedInstance = function () {
	if (!SRA.Controller._sharedInstance) {
		var controller = new SRA.Controller();
		controller.canvas = null;
		controller._scheduler = new Dispatch.Scheduler();
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

SRA.Controller.prototype.scheduleUpdate = function (entity, action) {
	this._scheduler.schedule(entity, action);
}

SRA.Controller.prototype.unscheduleUpdate = function (entity) {
	this._scheduler.unschedule(entity);
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
	controller._scheduler._hit(controller._deltaTime);
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
