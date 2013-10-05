ig.module(
	'plugins.impact-tween.entities.object-proxy'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityObjectProxy = ig.Entity.extend({
	
	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 255, 255, 0.7)',
	
	target: null,
	
    tweenInitStart: function(prop, end, to, obj) {
        obj = (typeof obj === "undefined") ? eval(this.target) : obj;
        if ( typeof(obj[prop]) !== "object" ) {
            if ( typeof(end[prop]) !== "undefined" ) to[prop] = obj[prop];
        } else {
            for ( var subprop in obj[prop] ) {
                if ( !to[prop] ) to[prop] = {};
                if ( typeof(end[prop]) !== "undefined" ) this.tweenInitStart( subprop, end[prop], to[prop], obj[prop]);
            }
        }
    },
    
    tweenInitDelta: function(prop, delta, end, obj) {
        obj = (typeof obj === "undefined") ? eval(this.target) : obj;
        if ( typeof(end[prop]) !== "object" ) {
            delta[prop] = end[prop] - obj[prop];
        } else {
            for ( var subprop in end[prop] ) {
                if ( !delta[prop] ) delta[prop] = {};
                this.tweenInitDelta(subprop, delta[prop], end[prop], obj[prop]);
            }
        }
    },
	
    tweenPropUpdate: function(prop, start, delta, value, obj) {
        obj = (typeof obj === "undefined") ? eval(this.target) : obj;
        if ( typeof(start[prop]) !== "object" ) {
            if ( typeof start[prop] != "undefined" ) {
                obj[prop] = start[prop] + delta[prop] * value;
            } else {
                obj[prop] = obj[prop];
            }
        } else {
            for ( var subprop in start[prop] ) {
                this.tweenPropUpdate(subprop, start[prop], delta[prop], value, obj[prop]);
            }
        }
    },
    
    tweenPropSet: function(prop, from, obj) {
        obj = (typeof obj === "undefined") ? eval(this.target) : obj;
        if ( typeof(from[prop]) !== "object" ) {
            obj[prop] = from[prop];
        } else {
            for ( subprop in from[prop] ) {
                if ( !obj[prop] ) obj[prop] = {};
                this.tweenPropSet( subprop, from[prop], obj[prop] );
            }
        }
    }
});

});