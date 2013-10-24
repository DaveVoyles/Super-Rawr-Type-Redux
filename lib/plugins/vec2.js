/* Found here:  http://impactjs.com/forums/impact-engine/vector-math-helper-class */
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


        // Vector tools

        var Vec2 = {};
        /**
         * @inline
         * @param otherVec
         */
        Vec2.create = function(otherVec){
            var res = {};
            res.x = (otherVec && otherVec.x || 0);
            res.y = (otherVec && otherVec.y || 0);
            return res;
        };
        /**
         * @inline
         * @param x
         * @param y
         */
        Vec2.createC = function(x,y){
            var res = {};
            res.x = (x || 0);
            res.y = (y || 0);
            return res;
        };
        /**
         * @inline
         * @param v1
         * @param v2
         */
        Vec2.assign = function(v1, v2){
            v1.x = (v2.x || 0);
            v1.y = (v2.y || 0);
            return v1;
        };
        /**
         * @inline
         * @param v
         * @param x
         * @param y
         */
        Vec2.assignC = function(v, x, y){
            v.x = (x || 0);
            v.y = (y || 0);
            return v;
        };
        /**
         * @inline
         * @param v1
         * @param v2
         * @param {boolean=} copy
         */
        Vec2.add = function(v1, v2, copy){
            var res = copy || false ? {} : v1;
            res.x = (v1.x || 0) + (v2.x || 0);
            res.y = (v1.y || 0) + (v2.y || 0);
            return res;
        };
        /**
         * @inline
         * @param v1
         * @param x
         * @param y
         * @param {boolean=} copy
         */
        Vec2.addC = function(v1, x, y, copy){
            var res = copy || false ? {} : v1;
            y = y === undefined || y === null ? x: y;
            res.x = (v1.x || 0) + (x || 0);
            res.y = (v1.y || 0) + (y || 0);
            return res;
        };
        /**
         * @inline
         * @param v1
         * @param v2
         * @param {boolean=} copy
         */
        Vec2.sub = function(v1, v2, copy){
            var res = copy || false ? {} : v1;
            res.x = (v1.x || 0) - (v2.x || 0);
            res.y = (v1.y || 0) - (v2.y || 0);
            return res;
        };
        /**
         * @inline
         * @param v1
         * @param x
         * @param y
         * @param {boolean=} copy
         */
        Vec2.subC = function(v1, x, y, copy){
            var res = copy ? {} : v1;
            y = y === undefined || y === null ? x: y;
            res.x = (v1.x || 0) - (x || 0);
            res.y = (v1.y || 0) - (y || 0);
            return res;
        };
        /**
         * @inline
         * @param v1
         * @param v2
         * @param {boolean=} copy
         */
        Vec2.mul = function(v1, v2, copy){
            var res = copy || false ? {} : v1;
            res.x = (v1.x || 0) * (v2.x || 0);
            res.y = (v1.y || 0) * (v2.y || 0);
            return res;
        };
        /**
         * @inline
         * @param v1
         * @param x
         * @param y
         * @param {boolean=} copy
         */
        Vec2.mulC = function(v1, x, y, copy){
            var res = copy || false ? {} : v1;
            y = y === undefined || y === null ? x: y;
            res.x = (v1.x || 0) * (x || 0);
            res.y = (v1.y || 0) * (y || 0);
            return res;
        };
        /**
         * @inline
         * @param v1
         * @param f
         * @param {boolean=} copy
         */
        Vec2.mulF = function(v1, f, copy){
            var res = copy || false ? {} : v1;
            res.x = (v1.x || 0) * (f || 0);
            res.y = (v1.y || 0) * (f || 0);
            return res;
        };
        /**
         * @inline
         * @param v1
         * @param v2
         * @param {boolean=} copy
         */
        Vec2.div = function(v1, v2, copy){
            var res = copy || false ? {} : v1;
            res.x = (v1.x || 0) / (v2.x || 0);
            res.y = (v1.y || 0) / (v2.y || 0);
            return res;
        };
        /**
         * @inline
         * @param v1
         * @param x
         * @param y
         * @param {boolean=} copy
         */
        Vec2.divC = function(v1, x, y, copy){
            var res = copy || false ? {} : v1;
            y = y === undefined || y === null ? x: y;
            res.x = (v1.x || 0) / (x || 0);
            res.y = (v1.y || 0) / (y || 0);
            return res;
        };
        /**
         * @inline
         * @param v1
         * @param v2
         */
        Vec2.dot = function(v1, v2){
            return (v1.x || 0)* (v2.x || 0) + (v1.y || 0)*(v2.y || 0);
        };
        /**
         * @inline
         * @param v1
         * @param v2
         */
        Vec2.dotR = function(v1, v2){
            return  -(v1.y || 0) * (v2.x || 0) + (v1.x || 0) * (v2.y || 0);
        };
        /**
         * @inline
         * @param v
         * @param newLength
         * @param {boolean=} copy
         */
        Vec2.length = function(v, newLength, copy){
            var oldLength = Math.sqrt((v.x || 0)*(v.x || 0) + (v.y || 0)* (v.y || 0));
            if(newLength){
                return Vec2.mulC(v, oldLength ? newLength / oldLength : 1, null, copy);
            }
            else
                return oldLength;
        };
        /**
         * @inline
         * @param v
         * @param min
         * @param max
         * @param {boolean=} copy
         */
        Vec2.limit = function(v, min, max, copy){
            var length = Vec2.length(v);
            if(length > max){
                return Vec2.mulC(v, max / length, null, copy);
            }
            else if(length < min){
                return Vec2.mulC(v, min / length, null, copy);
            }
            else{
                return copy || false ? Vec2.create(v) : v;
            }
        };
        /**
         * @inline
         * @param v
         * @param {boolean=} copy
         */
        Vec2.normalize = function(v, copy){
            return Vec2.length(v, 1, copy);
        };
        /**
         * @inline
         * @param v
         */
        Vec2.clockangle = function(v){
            var result = Math.acos(-(v.y || 0) / Vec2.length(v) );
            if(v.x < 0) result = 2*Math.PI - result;
            return result || 0;
        };
        /**
         * @inline
         * @param v1
         * @param v2
         */
        Vec2.angle = function(v1, v2)
        {
            var result = Math.acos(  Vec2.dot(v1,v2)  / ( Vec2.length(v1)*Vec2.length(v2) ));
            return result || 0;
        };
        /**
         * @inline
         * @param v
         * @param angle
         * @param {boolean=} copy
         */
        Vec2.rotate = function(v, angle, copy){
            var res = copy || false ? {} : v;
            var x = v.x || 0;
            res.x = Math.cos(angle) * x + Math.sin(angle) * (v.y || 0);
            res.y = Math.sin(-angle) * x + Math.cos(angle) * (v.y || 0);
            return res;
        };
        /**
         * @inline
         * @param v
         * @param {boolean=} copy
         */
        Vec2.rotate90CW = function(v, copy)
        {
            var res = copy || false ? {} : v;
            var x = (v.x || 0);
            res.x = (v.y || 0);
            res.y = -x ;
            return res;
        };
        /**
         * @inline
         * @param v
         * @param {boolean=} copy
         */
        Vec2.rotate90CCW = function(v, copy)
        {
            var res = copy || false ? {} : v;
            var x = (v.x || 0);
            res.x = -(v.y || 0);
            res.y = x;
            return res;
        };
        /**
         * @inline
         * @param v
         * @param {boolean=} copy
         */
        Vec2.flip = function(v, copy){
            var res = copy || false ? {} : v;
            res.x = -v.x;
            res.y = -v.y;
            return res;
        };
        /**
         * @inline
         * @param v1
         * @param v2
         */
        Vec2.equal = function(v1,v2){
            return v1.x == v2.x && v1.y == v2.y;
        };
        /**
         * @inline
         * @param v1
         * @param v2
         */
        Vec2.distance = function(v1,v2){
            var x = ((v1.x - v2.x) || 0);
            var y = ((v1.y - v2.y) || 0);
            return  Math.sqrt( x * x + y * y);
        };
        /**
         * @inline
         * @param v1
         * @param v2
         * @param i
         * @param {boolean=} copy
         */
        Vec2.lerp = function(v1,v2, i, copy){
            var res = copy || false ? {} : v1;
            res.x = (v1.x || 0)*(1-i) + (v2.x || 0)*i;
            res.y = (v1.y || 0)*(1-i) + (v2.y || 0)*i;
            return res;
        }

    });