Dispatch = {};

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

Dispatch.Scheduler.prototype.schedule = function (target, action) {
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

Dispatch.Scheduler.prototype._hit = function (arg) {
	var target, action;

	for (var i = 0; i < this._targets.length; i++) {
		target = this._targets[i];
		action = this._actions[i];
		action.call(target, arg);
	}
}