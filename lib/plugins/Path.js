ig.module(
        'plugins.Path'
    )
//.requires(
//)
    .defines(function(){

        window.ga = window.ga || {} ;

        ga.Path = function Path (initialPoints, smoothFactor) {
            this.segments      	 	= initialPoints || [];
            this.segmentsLength 	= null ; // length of the i-th segment of the path.
            this.normalizedSegments = null ;
            this.smoothFactor       = smoothFactor || 0 ;
            this.interpolate        = smoothFactor ? this._smoothInterpolate : this._linearInterpolate ;
            this.onload             = null ;
            this.src                = null ;
            return this;
        };

        ga.Path.prototype = {

            pushPoint : function (x,y) {
                this.segments.push(x);
                this.segments.push(y);
                return this;
            },

            lastX : function() {
                if (!this.segments.length){
                    return undefined;
                }
                return this.segments[this.segments.length-2];
            },

            lastY : function() {
                if (!this.segments.length){
                    return undefined;
                }
                return this.segments[this.segments.length-1];
            },

            // center the current path on x,y.
            // (x,y) defaults to (0,0)
            center : function (x,y) {
                x = x || 0;
                y = y || 0;
                var minX = 0, maxX = 0;
                var minY = 0, maxY = 0;
                minX=maxX=this.segments[0];
                minY=maxY=this.segments[1];
                for (var i=1, len=this.segments.length; i<len; i+=2) {
                    var thisX            = this.segments[i]  ;
                    var thisY            = this.segments[i+1];
                    if (thisX<minX) minX = thisX;
                    if (thisX>maxX) maxX = thisX;
                    if (thisY<minY) minY = thisY;
                    if (thisY>maxY) maxY = thisY;
                }
                this.translate(x - minX - (maxX-minX)/2, y - minY - (maxY - minY) /2);
            },

            // translate the current path by (x,y)
            translate : function (x, y) {
                for (var i=1, len=this.segments.length; i<len; i+=2) {
                    this.segments[i  ] += x ;
                    this.segments[i+1] += y ;
                }
            },

            // scale the path by scaleX, scaleY factor.
            // scaleY default to scaleX  ( scale(2) == scale(2,2) )
            scale : function(scaleX, scaleY) {
                scaleY= scaleY || scaleX ;
                for (var i=1, len=this.segments.length; i<len; i+=2) {
                    this.segments[i  ] *= scaleX ;
                    this.segments[i+1] *= scaleY ;
                }
            },

            // once you build your path, use finalize to make it ready for use.
            // PathFollower automatically finalizes all paths.
            finalize : function (computeNormalizedSegments) {
                if (!this.segmentsLength) this.buildsegmentsLength();
                if (computeNormalizedSegments && !this.normalizedSegments) this.buildnormalizedSegments();
            },

            /* adds a path to the current one.
             * Call S1 the segment starting from the last point of curve, ending at (x1, y1).
             * The points added are at a distance fn(r) of this segment (r in [0,1])
             * accuracy defines the number of points walked on S1 to compute next point.
             * @expl : addFunctionPath(100,100, function(r) { return 10*Math.sin(2*Math.PI*r);}, 5)
             *         will move from 0,0 to 100,100 following a sinusoid.
             **************************************************************************************/
            addFunctionPath : function(x1,y1, fn, accuracy) {
                if (this.segments.length<2) throw('at least one point must be defined to add a function path');
                var path=this.segments;
                // get normalized directing vector
                var x0=path[path.length-2],y0=path[path.length-1];
                var dx=(x1-x0);
                var dy=(y1-y0);
                var dst = Math.sqrt(sq(dx)+sq(dy));
                if (!dst) return;
                dx/=dst;
                dy/=dst;
                var x=x0, y=y0, stepCount = 0 | (dst/accuracy), stepDone=0 ;
                console.log(dst/accuracy);
                while(stepDone<stepCount) {
                    stepDone++;
                    var fnValue = fn(stepDone/stepCount);
                    path.push(x0+stepDone*accuracy*dx - fnValue*dy );
                    path.push(y0+stepDone*accuracy*dy + fnValue*dx );
                    // we could only add up to x0,y0 but i am afraid of the accuracy in that case.
                }
                return this;
            },

            // returns a new path that is symetric to the current one in respect
            // to the ( (x0,y0) ; (x1,y1) ) segment.
            buildSymmetricPath : function(x0,y0,x1,y1) {
                var path     = this.segments ;
                var newPath  = [];
                var ux       = (x1 - x0);
                var uy       = (y1 - y0);
                var dist     = Math.sqrt(sq(ux) + sq(uy));
                ux/=dist;  uy/=dist;
                for (var i=0,len=path.length ; i<len; i+=2) {
                    var projX =   (path[i]   - x0) * ux + (path[i+1] - y0) * uy  ;
                    var projY = - (path[i]   - x0) * uy + (path[i+1] - y0) * ux  ;
                    newPath.push(x0 + projX*ux + projY*uy );
                    newPath.push(y0 + projX*uy - projY*ux );
                }
                return new ga.Path(newPath, this.smoothFactor);
            },

            // ensure segmentLength property contains the length of the current segments.
            // segmensLength[i] contains the length of the ith segment ((2*i, 2*i+1) ; (2*i+2, 2*i+3))
            buildsegmentsLength : function () {
                var path = this.segments ;
                var segmentsLength = this.segmentsLength ? this.segmentsLength : [];
                for (var i=0, j=0 ; i<=path.length-4; i+=2, j++) {
                    segmentsLength[j] = (Math.sqrt (
                        sq(path[i+2] - path[i]) +
                            sq(path[i+3] - path[i+1]) ));
                }
                if (segmentsLength.length>(this.segments.length/2)) segmentsLength.length=(this.segments.length/2);
                this.segmentsLength = segmentsLength ;
                return this;
            },

            // ensure normalizedSegments property contains the normalized
            // direction vector for each segment.
            // normalizedSegments[i] contains normalized direction vector for the ith
            // segment (segments (2*i,2*i+1) ; (2*i+2,2*i+3))
            buildnormalizedSegments : function () {
                var path    = this.segments ;
                var normSeg = this.normalizedSegments ? this.normalizedSegments : [];
                var path=this.path;
                for (var i=0 ; i<=path.length-4; i+=2) {
                    var thisL    = this.pathLengths[i>>1] ;
                    var segX     = (path[i+2]-path[i  ])/thisL;
                    var segY     = (path[i+3]-path[i+1])/thisL;
                    normSeg[i]   = (  segX  );
                    normSeg[i+1] = (  segY  );
                }
                this.normalizedSegments = normSeg ;
                return this;
            },

            _linearInterpolate : function(segIndex, ratio, backward, targetPoint ) {
                targetPoint.x =   Math.ceil( this.segments[segIndex  ] +
                    ratio *(this.segments[segIndex+2] - this.segments[segIndex]) ) ;
                targetPoint.y =  Math.ceil (this.segments[segIndex+1] +
                    ratio*(this.segments[segIndex+3] - this.segments[segIndex+1] ) );
            },

            _smoothInterpolate : function(segIndex, ratio, backward , targetPoint ) {
                if ( (!backward && segIndex>this.length-5 ) || (backward && (segIndex < 4) ) ) {
                    return this._linearInterpolate(segIndex, ratio, targetPoint, backward);
                }
                var nextIndex = backward ? -4 : 4;
                targetPoint.x = this.segments[segIndex  ] +
                    ratio *(this.segments[segIndex+2] - this.segments[segIndex]) ;
                targetPoint.y = this.segments[segIndex+1] +
                    ratio*(this.segments[segIndex+3] - this.segments[segIndex+1]);
            }

        };

        Object.defineProperty(ga.Path.prototype, 'length', { get : function () { return this.segments ? this.segments.length : 0 ; } });

        function sq(x) { return x*x };

    });
