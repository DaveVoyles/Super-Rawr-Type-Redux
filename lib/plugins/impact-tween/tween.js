ig.module(
    'plugins.impact-tween.tween'
)
.requires(
    'plugins.impact-tween.entity'
)
.defines(function() {

if ( !Array.prototype.indexOf ) {
    Array.prototype.indexOf = function(el, start) {
        var start = start || 0;
        for ( var i=0; i < this.length; ++i ) {
            if ( this[i] === el ) {
                return i;
            }
        }
        return -1;
    };
}

ig.Tween = ig.Class.extend({
    _objects: null,
    valuesStart: [],
    valuesEnd: [],
    valuesDelta: [],
    _elapsed: 0,
    timer: false,
    started: false,
    _props: {},
    _chained: false,
    duration: 0,
    complete: false,
    paused: false,
    easing: null,
    onComplete: false,
    delay: 0,
    loop: 0,
    loopCount: -1,
    loopNum: -1,
    
    init: function(obj, properties, duration, settings) {
        this.easing = ig.Tween.Easing.Linear.EaseNone;
        this.duration = duration;
        ig.merge(this, settings);
        this.loopNum = this.loopCount;
        
        // Get target properties
        if (typeof properties == 'object' 
            && properties.constructor === (new Array).constructor
        ){
            // props is an array
            this._props = properties;
        } else {
            // props is a single object
            this._props = [properties];
        }
        
        // Get target objects
        if (typeof obj == 'object' 
            && obj.constructor === (new Array).constructor
        ){
            // objs is an array
            this._objects = obj;
        } else {
            // objs is a single object
            this._objects = [obj];
        }
        
        // Initialize values for each object
        for (var i = 0; i < this._objects.length; i++) {
            this.valuesStart.push({});
            this.valuesEnd.push({});
            this.valuesDelta.push({});
        }
    },
    
    chain: function(chainObj) {
        this._chained = chainObj;
    },
    
    initEnd: function(prop, from, to) {
        if ( typeof(from[prop]) !== "object" ) {
            to[prop] = from[prop];
        } else {
            for ( var subprop in from[prop] ) {
                if ( !to[prop] ) to[prop] = {};
                this.initEnd( subprop, from[prop], to[prop] );
            }
        }
    },
    
    initStart: function(prop, end, from, to) {;
        if ( typeof from.tweenInitStart === "function" ) {
            return from.tweenInitStart(prop, end, to);
        }
        if ( typeof(from[prop]) !== "object" ) {
            if ( typeof(end[prop]) !== "undefined" ) to[prop] = from[prop];
        } else {
            for ( var subprop in from[prop] ) {
                if ( !to[prop] ) to[prop] = {};
                if ( typeof(end[prop]) !== "undefined" ) this.initStart( subprop, end[prop], from[prop], to[prop] );
            }
        }
    },
    
    start: function() {
        this.complete = false;
        this.paused = false;
        this.loopNum = this.loopCount;
        this._elapsed = 0;
        this.started = true;
        this.timer = new ig.Timer();
        
        for (var i = 0; i < this._objects.length; i++) {
            
            // Ensure tween in all object tween arrays
            if ( this._objects[i].tweens.indexOf(this) == -1 ) this._objects[i].tweens.push(this);
            
            for ( var property in this._props[i] ) {
                this.initEnd(property, this._props[i], this.valuesEnd[i]);
            }
            for ( var property in this.valuesEnd[i] ) {
                this.initStart(property, this.valuesEnd[i], this._objects[i], this.valuesStart[i]);
                this.initDelta(property, this.valuesDelta[i], this._objects[i], this.valuesEnd[i]);
            }
        }
    },
    
    initDelta: function(prop, delta, start, end) {
        if ( typeof start.tweenInitDelta === "function" ) {
            return start.tweenInitDelta(prop, delta, end);
        }
        if ( typeof(end[prop]) !== "object" ) {
            delta[prop] = end[prop] - start[prop];
        } else {
            for ( var subprop in end[prop] ) {
                if ( !delta[prop] ) delta[prop] = {};
                this.initDelta(subprop, delta[prop], start[prop], end[prop]);
            }
        }
    },
    
    propUpdate: function(prop, obj, start, delta, value) {
        if ( typeof obj.tweenPropUpdate === "function" ) {
            return obj.tweenPropUpdate(prop, start, delta, value);
        }
        if ( typeof(start[prop]) !== "object" ) {
            if ( typeof start[prop] != "undefined" ) {
                obj[prop] = start[prop] + delta[prop] * value;
            } else {
                obj[prop] = obj[prop];
            }
        } else {
            for ( var subprop in start[prop] ) {
                this.propUpdate(subprop, obj[prop], start[prop], delta[prop], value);
            }
        }
    },
    
    propSet: function(prop, from, to) {
        if ( typeof to.tweenPropSet === "function" ) {
            return to.tweenPropSet(prop, from);
        }
        if ( typeof(from[prop]) !== "object" ) {
            to[prop] = from[prop];
        } else {
            for ( subprop in from[prop] ) {
                if ( !to[prop] ) to[prop] = {};
                this.propSet( subprop, from[prop], to[prop] );
            }
        }
    },
    
    update: function() {
        if ( !this.started ) return false;
        if ( this.delay ) {
            if ( this.timer.delta() < this.delay ) return;
            this.delay = 0;
            this.timer.reset();
        }
        if ( this.paused || this.complete ) return false;

        var elapsed = (this.timer.delta() + this._elapsed) / this.duration;
        elapsed = elapsed > 1 ? 1 : elapsed;
        var value = this.easing(elapsed);

        for (var i = 0; i < this._objects.length; i++) {
            for ( var property in this.valuesDelta[i] ) {
                this.propUpdate(property, this._objects[i], this.valuesStart[i], this.valuesDelta[i], value);
            }

            if ( elapsed >= 1 ) {
                if ( this.loopNum == 0 || !this.loop ) {
                    this.complete = true;
                    if ( this.onComplete ) this.onComplete();
                    if ( this._chained ) this._chained.start();
                    return false;
                } else if ( this.loop == ig.Tween.Loop.Revert ) {
                    for ( var property in this.valuesStart[i] ) {
                        this.propSet(property, this.valuesStart[i], this._objects[i]); 
                    }
                    this._elapsed = 0;
                    this.timer.reset();
                    if ( this.loopNum != -1 ) this.loopNum--;
                } else if ( this.loop == ig.Tween.Loop.Reverse ) {
                    var _start = {}, _end = {}, _delta = {};
                    ig.merge(_start, this.valuesEnd[i]);
                    ig.merge(_end, this.valuesStart[i]);
                    ig.merge(this.valuesStart[i], _start);
                    ig.merge(this.valuesEnd[i], _end);
                    for ( var property in this.valuesEnd[i] ) {
                        this.initDelta(property, this.valuesDelta[i], this._objects[i], this.valuesEnd[i]);
                    }
                    this._elapsed = 0;
                    this.timer.reset();
                    if ( this.loopNum != -1 ) this.loopNum--;
                }
            }
        }
    },
    
    pause: function() {
        this.paused = true;
        this._elapsed += this.timer.delta();
    },

    resume: function() {
        this.paused = false;
        this.timer.reset();
    },

    stop: function(doComplete) {
        if ( doComplete ) {
            this.paused = false;
            this.complete = false;
            this.loop = false;
            this._elapsed += this.duration;
            this.update();
        }
        this.complete = true;
    },
    
    rewind: function() {
        var loop = this.loop;
        this.complete = false;
        this.paused = false;
        this.loopNum = -1;
        this.loop = ig.Tween.Loop.Revert;
        this.update();
        this.loop = loop;
    }
});

ig.Tween.Loop = { Revert: 1, Reverse: 2 };

ig.Tween.Easing = { Linear: {}, Quadratic: {}, Cubic: {}, Quartic: {}, Quintic: {}, Sinusoidal: {}, Exponential: {}, Circular: {}, Elastic: {}, Back: {}, Bounce: {} };

ig.Tween.Easing.Linear.EaseNone = function ( k ) {
    return k;
};

ig.Tween.Easing.Quadratic.EaseIn = function ( k ) {
    return k * k;
};

ig.Tween.Easing.Quadratic.EaseOut = function ( k ) {
    return - k * ( k - 2 );
};

ig.Tween.Easing.Quadratic.EaseInOut = function ( k ) {
    if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
    return - 0.5 * ( --k * ( k - 2 ) - 1 );
};

ig.Tween.Easing.Cubic.EaseIn = function ( k ) {
    return k * k * k;
};

ig.Tween.Easing.Cubic.EaseOut = function ( k ) {
    return --k * k * k + 1;
};

ig.Tween.Easing.Cubic.EaseInOut = function ( k ) {
    if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
    return 0.5 * ( ( k -= 2 ) * k * k + 2 );
};

ig.Tween.Easing.Quartic.EaseIn = function ( k ) {
    return k * k * k * k;
};

ig.Tween.Easing.Quartic.EaseOut = function ( k ) {
    return - ( --k * k * k * k - 1 );
}

ig.Tween.Easing.Quartic.EaseInOut = function ( k ) {
    if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
    return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );
};

ig.Tween.Easing.Quintic.EaseIn = function ( k ) {
    return k * k * k * k * k;
};

ig.Tween.Easing.Quintic.EaseOut = function ( k ) {
    return ( k = k - 1 ) * k * k * k * k + 1;
};

ig.Tween.Easing.Quintic.EaseInOut = function ( k ) {
    if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
    return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );
};

ig.Tween.Easing.Sinusoidal.EaseIn = function ( k ) {
    return - Math.cos( k * Math.PI / 2 ) + 1;
};

ig.Tween.Easing.Sinusoidal.EaseOut = function ( k ) {
    return Math.sin( k * Math.PI / 2 );
};

ig.Tween.Easing.Sinusoidal.EaseInOut = function ( k ) {
    return - 0.5 * ( Math.cos( Math.PI * k ) - 1 );
};

ig.Tween.Easing.Exponential.EaseIn = function ( k ) {
    return k == 0 ? 0 : Math.pow( 2, 10 * ( k - 1 ) );
};

ig.Tween.Easing.Exponential.EaseOut = function ( k ) {
    return k == 1 ? 1 : - Math.pow( 2, - 10 * k ) + 1;
};

ig.Tween.Easing.Exponential.EaseInOut = function ( k ) {
    if ( k == 0 ) return 0;
    if ( k == 1 ) return 1;
    if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 2, 10 * ( k - 1 ) );
    return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );
};

ig.Tween.Easing.Circular.EaseIn = function ( k ) {
    return - ( Math.sqrt( 1 - k * k ) - 1);
};

ig.Tween.Easing.Circular.EaseOut = function ( k ) {
    return Math.sqrt( 1 - --k * k );
};

ig.Tween.Easing.Circular.EaseInOut = function ( k ) {
    if ( ( k /= 0.5 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
    return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);
};

ig.Tween.Easing.Elastic.EaseIn = function( k ) {
    var s, a = 0.1, p = 0.4;
    if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
    if ( !a || a < 1 ) { a = 1; s = p / 4; }
    else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
    return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
};

ig.Tween.Easing.Elastic.EaseOut = function( k ) {
    var s, a = 0.1, p = 0.4;
    if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
    if ( !a || a < 1 ) { a = 1; s = p / 4; }
    else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
    return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
};

ig.Tween.Easing.Elastic.EaseInOut = function( k ) {
    var s, a = 0.1, p = 0.4;
    if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
    if ( !a || a < 1 ) { a = 1; s = p / 4; }
    else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
    if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
    return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
};

ig.Tween.Easing.Back.EaseIn = function( k ) {
    var s = 1.70158;
    return k * k * ( ( s + 1 ) * k - s );
};

ig.Tween.Easing.Back.EaseOut = function( k ) {
    var s = 1.70158;
    return ( k = k - 1 ) * k * ( ( s + 1 ) * k + s ) + 1;
};

ig.Tween.Easing.Back.EaseInOut = function( k ) {
    var s = 1.70158 * 1.525;
    if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
    return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
};

ig.Tween.Easing.Bounce.EaseIn = function( k ) {
    return 1 - ig.Tween.Easing.Bounce.EaseOut( 1 - k );
};

ig.Tween.Easing.Bounce.EaseOut = function( k ) {
    if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
        return 7.5625 * k * k;
    } else if ( k < ( 2 / 2.75 ) ) {
        return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
    } else if ( k < ( 2.5 / 2.75 ) ) {
        return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
    } else {
        return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
    }
};

ig.Tween.Easing.Bounce.EaseInOut = function( k ) {
    if ( k < 0.5 ) return ig.Tween.Easing.Bounce.EaseIn( k * 2 ) * 0.5;
    return ig.Tween.Easing.Bounce.EaseOut( k * 2 - 1 ) * 0.5 + 0.5;
};

});
