Geometry = {
	_PRECISION: 0.0001,
	_DEG2RAD: 0.0174532925,

	degreesToRadians: function (degrees) {
		return degrees * this._DEG2RAD;
	},

	radiansToDegrees: function (radians) {
		return radians / this._DEG2RAD;
	},

	isFloatEqualToFloat: function (f1, f2) {
		return Math.abs(f1 - f2) <= this._PRECISION;
	}
};

Geometry.Vector2 = function (x, y) {
	this.x = x;
	this.y = y;
};

Geometry.Vector2.Zero = new Geometry.Vector2(0.0, 0.0);

// modifies fields
Geometry.Vector2.prototype.set = function (x, y) {
	this.x = x;
	this.y = y;
}

Geometry.Vector2.prototype.setVector = function (vector) {
	this.x = vector.x;
	this.y = vector.y;
}

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
	return (this.x * vector.x) + (this.y * vector.y);
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

Geometry.Vector2.prototype.rotated90Degrees = function (clockwise) {
	if (clockwise) {
		return new Geometry.Vector2(this.y, -this.x);
	}

	return new Geometry.Vector2(-this.y, this.x);
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

// modifies fields
Geometry.Vector2.prototype.multiply = function (num) {
	this.x *= num;
	this.y *= num;
	return this;
}

Geometry.Vector2.prototype.times = function (num) {
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

Geometry.Size.prototype.set = function (width, height) {
	this.width = width;
	this.height = height;
}

Geometry.Size.prototype.setSize = function (size) {
	this.width = size.width;
	this.height = size.height;
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

Geometry.Rect.prototype.set = function (x, y, width, height) {
	this.origin.x = x;
	this.origin.y = y;
	this.size.width = width;
	this.size.height = height;
}

Geometry.Rect.prototype.setRect = function (rect) {
	this.origin.x = rect.origin.x;
	this.origin.y = rect.origin.y;
	this.size.width = rect.size.width;
	this.size.height = rect.size.height;
}

Geometry.Rect.prototype.clone = function () {
	return new Geometry.Rect(this.origin, this.size);
}

Geometry.Rect.prototype.isPointInside = function (point) {
	return this.isXYPointInside(point.x, point.y);
}

Geometry.Rect.prototype.isXYPointInside = function (x, y) {
	var tx = this.origin.x;
	var ty = this.origin.y;
	return x >= tx && y >= ty && x <= tx + this.size.width && y <= ty + this.size.height;	
}

Geometry.Rect.prototype.intersectsWithRect = function (rect) {
	var xOverlap = 	(this.origin.x >= rect.origin.x && this.origin.x <= rect.getMaxX()) || 
					(rect.origin.x >= this.origin.x && rect.origin.x <= this.getMaxX());
	var yOverlap = 	(this.origin.y >= rect.origin.y && this.origin.y <= rect.getMaxY()) ||
					(rect.origin.y >= this.origin.y && rect.origin.y <= this.getMaxY());

	return xOverlap && yOverlap;
}

Geometry.Rect.prototype.getMaxX = function () {
	return this.origin.x + this.size.width;
}

Geometry.Rect.prototype.getMaxY = function () {
	return this.origin.y + this.size.height;
}

Geometry.Rect.Zero = new Geometry.Rect(Geometry.Vector2.Zero, Geometry.Size.Zero);