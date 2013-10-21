ig.module(
        'plugins.vec2'
    )
    .requires(
        'impact.entity'
    )
    .defines(function(){

        ig.Vec2 = ig.Class.extend({

            x: 0,
            y: 0,

            init: function (x, y) {
                this.x = x;
                this.y = y;
            },

            //angle of this vector relative to axis
            angle: function () {
                return Math.atan2(this.y, this.x);
            },

            //get new instance of this vector
            clone: function () {
                return new ig.Vec2(this.x, this.y);
            },

            //get dot product between this vector
            //and passed in vector
            dot: function (vec2) {
                return this.x * vec2.x + this.y * vec2.y;
            },

            //compares a passed in vector to this vector
            //to see if they are equal
            equals: function (vec2) {
                return !(this.x !== vec2.x || this.y !== vec2.y);
            },

            //invert this vector
            invert: function () {
                this.x = -this.x;
                this.y = -this.y;
                return this;
            },

            //get interpolated vector between this vector
            //and passed in vector
            lerp: function (vec2, proportion) {
                return new ig.Vec2(
                    this.x + proportion * (vec2.x - this.x),
                    this.y + proportion * (vec2.y - this.y)
                );
            },

            //get magnitude of this vector
            magnitude: function () {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            },

            //normalize this vector
            normalize: function () {
                return this.scale(1 / this.magnitude());
            },

            //get vector orthogonal to this vector
            orthogonal: function () {
                return new ig.Vec2(-this.y, this.x);
            },

            //dot product of passed in vector
            //and perpendicular of this vector
            //this is the 2d equivalent of a 3d cross product
            perproduct: function (vec2) {
                return vec2.x * this.y - vec2.y * this.x;
            },

            //reflect this vector around the passed in vector
            reflect: function (vec2) {
                return this.sum(vec2.clone().normalize().orthogonal().scale(this.dot(vec2) * 2).inverse());
            },

            //rotate this vector
            rotate: function (angle) {
                var cos = Math.cos(angle),
                    sin = Math.sin(angle),
                    x = this.x,
                    y = this.y;
                this.x = x * cos - y * sin;
                this.y = x * sin + y * cos;
                return this;
            },

            //rotate this vector around a specified point
            rotateAroundPoint: function (angle, point) {
                return this.sum(-point).rotate(angle).sum(point);
            },

            //scale this vector
            //will scale by passed in value or vec2
            scale: function (scalar) {
                if (scalar instanceof ig.Vec2) {
                    this.x *= scalar.x;
                    this.y *= scalar.y;
                } else {
                    this.x *= scalar;
                    this.y *= scalar;
                }
                return this;
            },

            //sum this vector with another vector
            sum: function (vec2) {
                this.x += vec2.x;
                this.y += vec2.y;
                return this;
            },

            //convert from vector back to a generic object
            toObj: function () {
                return ig.Vec2.toObj(this);
            }

        });

        ig.Vec2.Zero = new ig.Vec2(0, 0);
        ig.Vec2.One = new ig.Vec2(1, 1);
        ig.Vec2.UnitX = new ig.Vec2(1, 0);
        ig.Vec2.UnitY = new ig.Vec2(0, 1);
        ig.Vec2.TileOrigin = ig.Vec2.UnitX.clone().rotate(Math.PI / 4).invert();

//convert an object with x & y properties to a vector
//if properties don't exit, return zero vector
        ig.Vec2.toVec2 = function (obj) {
            return new ig.Vec2(obj.x || 0, obj.y || 0);
        };

//convert from vector back to a generic object
        ig.Vec2.toObj = function (vec2) {
            return {
                x: vec2.x || 0,
                y: vec2.y || 0
            };
        };

    });