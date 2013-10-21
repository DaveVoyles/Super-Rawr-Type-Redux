ig.module(
    'plugins.interpolation'
)
.requires(
    'impact.impact', 'impact.game'
)
.defines(function(){

        /* Example snippet :
         http://impactjs.com/forums/code/interpolation-number-tween-plugin

         // range from 100 to 200 in 4 sec
         var myNumb = new ig.Interpolation(100, 200, 4 );

         myNumb.value <-- current value

         myNumb.done <-- has interpolation ended ?

         you can use the object as a Number: ( !not a number)
         var someValue = 100 + myNumb ;

         launch another interpolation with set. The ease function is kept if unchanged.
         myNumb.set(500, 800, 10);
         */

        // Interpolation : object that will take values from start to end in
        // a duration time (in seconds).
        // Default to linear interpolation.
        // define _easeFn argument to set an easing function ([0,1] -> [0,1])
        ig.Interpolation = function(start, end, duration, _easeFn) {
            // private properties
            this._start         = start    || 0 ;
            this._end           = end      || 0;
            this._duration      = duration || 0 ;
            this._oneOnDuration = this._duration && 1/duration ;
            this._easeFn        = _easeFn  || this._easeFn ;
            this._done          = (end - start !== 0) && (duration>0);
            this._startTime     = this._done ? -1 : ig.Timer.time;
            return this;
        };

        var interpProto = ig.Interpolation.prototype;

        // have the object return its value when used as a Number
        interpProto.valueOf = function() {
            if (this._done) return this._end;

            var v = ig.Timer.time - this._startTime ;

            if ( v>= this._duration ) { this._done = true;   return this._end; }
            v *=  this._oneOnDuration;

            if  (this._easeFn)  { v = this._easeFn(v); }

            return (this._start ) + ((this._end-this._start) * v);    // just 1 mul
        };

        // public properties : value and done
        defGetter(interpProto, 'value', ig.Interpolation.prototype.valueOf );

        defGetter(interpProto, 'done', function() {
            if (this._done) return true;
            var v = ig.Timer.time - this._startTime ;
            if ( v>= this._duration ) { this._done = true;   return this._end; }
        });

        // public method : set
        interpProto.prototype.set = ig.Interpolation;

        //----------------------------------
        // helper function
        function defGetter(Obj, prop, getterFunc){
            propDef.get = getterFunc;
            Object.defineProperty(Obj, prop, propDef );
        }

        var propDef = { get : null, configurable : true } ;
    });