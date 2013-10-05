/***********************************************************************************************
 * PathFollower.js : Class describing an object that will follow a path at a given speed.
 *                   It will 'bounce' if it encounters a path border. Use move(dt) to make it move.
 *                   (dt in ms), change its speed if you wish, and read its x and y values.
 *
 * @path            : Path object
 * @speed           : in pixels / ms if canvas is not scaled.
 * @onPathEnd       : function called when path ends, whether looping or not.
 *                    signature : function (thisPathFollower, remainingLoopCount) (context===null)
 * @loopCount       :  -1 for infinite loops, 0 for no loops.
 * @optional shift : {x, y}      distance to the segment.
 * @optional segmentsLength:     array of segments length.
 * @optional normalizedSegments: array of normalized segments x, y sizes
 *            ( used when distance is !=0 )
 ***********************************************************************************************/
ig.module(
        'plugins.PathFollower'
    )
    .requires(
        'plugins.Path'
    )
    .defines(function(){

        window.ga = window.ga || {} ;

        ga.pathFollowerDefaultParameters = {
            path         : null  ,
            pathSpeed    : 40    ,
            loopCount    :  0    ,
            onPathEnd    : null  ,
            computeAngle : false ,
            shift        : null
        };

        ga.PathFollower = function(parameters) {
            // checking for a few errors in the parameters
            var err = null ;
            if (!parameters.path) { err = ' path parameter cannot be null or undefined'; }
            if (!err && (parameters.path.length<4) || (parameters.path.length & 1)) { err =' path length must be even and >=4'; }
            if (err) throw('error in PathFollower :' + err);

            // assign all parameters, using default values if need be.
            for (var p in ga.pathFollowerDefaultParameters) {
                this[p] = parameters[p] ||  ga.pathFollowerDefaultParameters[p];
            }
            // build path length and normalized segments if need be
            this.path.finalize (!!this.shift);

            // public properties
            this.x     = this.path[0];
            this.y     = this.path[0];
            this.angle = 0 ;
            this.ended = false;

            // private properties
            this._pathIndex = 0 ;
            this._ratio     = 0 ;  // _ratio of position within current segment.

            return this;
        };

        ga.PathFollower.prototype = {

            move : function(dt) {
                if (this.ended) { return; }
                // distance to travel
                var distance = Math.abs( dt * this.pathSpeed );
                // speed sign
                var sign                   = (this.pathSpeed > 0) ? 2 : -2 ;
                var thisSegLength          = 0,
                    remainingthisSegLength = 0;

                var segmentsLength = this.path.segmentsLength;
                while (distance >0) {
                    // current segment length
                    thisSegLength = segmentsLength[this._pathIndex >> 1];
                    // remaining segment length : depends on speed sign
                    if (sign > 0) {
                        if (this._ratio == 0)  remainingthisSegLength=thisSegLength;
                        else remainingthisSegLength = (1-this._ratio) * thisSegLength;
                    } else {
                        if (this._ratio == 1) remainingthisSegLength=thisSegLength;
                        else remainingthisSegLength = this._ratio * thisSegLength;
                    }

                    if (remainingthisSegLength < distance) {
                        // if this segment cannot eat up the distance, skip to next.
                        distance -= remainingthisSegLength; // eat
                        this._ratio = (sign > 0 ) ? 0 : 1; // new _ratio within segment
                        // loop if encounter the end of the path
                        if ( (sign<0 && this._pathIndex == 0) ||
                            (sign>0 && this._pathIndex == this.path.length-4))  {
                            if (this.onPathEnd) {
                                this.onPathEnd.call(null,this, this.loopCount>0 ? this.loopCount-1 : this.loopCount);
                            }
                            if (!this.loopCount) { this.ended = true; return };
                            if (this.loopCount>0) this.loopCount--;
                            this.pathSpeed = -this.pathSpeed;
                            this._ratio= (this.pathSpeed >0) ? 0 : 1;
                            sign = (this.pathSpeed > 0) ? 2 : -2 ;
                            //do not iterate
                            continue;
                        }
                        // iterate
                        this._pathIndex +=sign;
                    } else {
                        // let us eat as much of this segment as we can.
                        var _ratio = distance / thisSegLength ;
                        this._ratio += (sign>0) ? _ratio : -_ratio;
                        break;
                    }
                }

                this.path.interpolate(this._pathIndex, this._ratio, (sign < 0 ), tempPoint );
                this.x = tempPoint.x;
                this.y = tempPoint.y;

                if (this.adjustAngle) {
                    this.angle= Math.atan2(
                        (this.path[this._pathIndex+3]  - this.path[this._pathIndex+1])
                        , (this.path[this._pathIndex+2] -  this.path[this._pathIndex]));
                }

                if (this.shift) {
                    this.x += this.shift.x*this.normalizedSegments[this._pathIndex+1];
                    this.y += this.shift.y*this.normalizedSegments[this._pathIndex];
                }
            },

            drawPath: function (ctx, color) {
                var path=this.path;
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth=1;
                ctx.moveTo(path[0],path[1]);
                for (var i=2; i<path.length; i+=2) {
                    ctx.lineTo(path[i], path[i+1]);
                }
                ctx.stroke();
            }
        };

        var tempPoint = { x:0 , y:0 };

        function sq(x) { return x*x };

    });



