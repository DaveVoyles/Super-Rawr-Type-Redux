/***********************************************************************************************
 * follower.js: Class describing an object that will follow a path at a given speed.
 *              It will 'bounce' if it encounters a path border. Use move(dt) to make it move.
 *              (dt in ms), change its speed if you wish, and read its x and y values.
 *
 * @path                       : Path object
 * @speed                      : in pixels / ms if canvas is not scaled.
 * @onPathEnd                  : function called when path ends, whether looping or not.
 *                              signature : function (thisPathFollower, remainingLoopCount) (context===null)
 * @loopCount                  :  -1 for infinite loops, 0 for no loops.
 * @optional shift             : {x, y}      distance to the segment.
 * @optional segmentsLength    :     array of segments length.
 * @optional normalizedSegments: array of normalized segments x, y sizes
 *                              ( used when distance is !=0 )
 ***********************************************************************************************/
ig.module(
	'game.entities.actor-follower'
)
.requires(
	'impact.entity',
 	'plugins.Path',
    'plugins.PathFollower'
)
.defines(function(){

EntityfollowerParameters = 	{
	path           : null  , // path to follow = Path object.
	pathSpeed      : 0     , // unit is world pixels per second
	loop           : 0     , // number of times to loop before kill. set to -1 for infinite loops, 0 for none.
	rank           : 0     , // rank within current wave
	spawnDelay     : 0     , // delay, in seconds, before the entity spawns. used to create waves
	followScreen   : false , // should we add screen.x/y to the coordinates
	relativeTo     : null  , // entity to which this follower will be relative to
	onPathEnd      : null  , // function called when path ended, whether looping or not.
	                         //  signature : function (thisEntity, remainingLoopCount)
	adjustAngle    : false , // should entity rotate to follow the path ?
	shift		   : null  , // {x: , y: } to be added to the entity.
	                         // if adjustAngle is true, shifts x,y are rotated too
    createFollower : false   // Use follower properties/members or default to entity?
};

var followerParameters = {};
                     
EntityFollower = ig.Entity.extend({
	
	path               : null , // path to follow = Path object.
	pathSpeed          : 0    , // unit is world pixels per second
	loop               : 0    , // number of times to loop before kill. set to -1 for infinite loops, 0 for none.
	rank               : 0    , // rank within current wave
	spawnDelay         : 0    , // delay, in seconds, before the entity spawns. used to create waves
	followScreen       : false, // should we add screen.x/y to the coordinates
	relativeTo         : null , // entity to which this follower will be relative to
	onPathEnd          : null , // function called when path ended, whether looping or not.
	                            // signature : function (thisEntity, remainingLoopCount)
	adjustAngle        : false, // should entity rotate to follow the path?
	shift		       : null , // {x: , y: } to be added to the entity.
	                            // if adjustAngle is true, shifts x,y are rotated too
    createFollower     : false, // Use follower properties/members or default to entity?

	// private members
	_finalType 	       : 0    ,
	_finalCheckAgainst : 0    ,
	_finalCollides     : 0    ,
	_oldDraw           : null ,
	_spawnTimer        : null ,
	_pathFollower      : null ,
	
			
	init: function(  x, y, settings ) {
		this.parent( x, y, settings );

        if (this.createFollower === true){
            console.log('creating a follower');
            // handle spawn delay
            if (settings.spawnDelay) {
                this._hide();
                this._spawnTimer = new ig.Timer(this.spawnDelay);
            }

            // Are we creating a Path follower?
            // build parameters
            followerParameters = {};
            for (var p in ga.pathFollowerDefaultParameters) {
                 followerParameters[p] = settings[p] || ga.pathFollowerDefaultParameters[p];
            }

            // convert speed
            followerParameters.pathSpeed = followerParameters.pathSpeed * 1e-3 ;
            // we must compute angle in path follower to adjust it in follower entity
            if (settings.adjustAngle) { followerParameters.computeAngle = settings.adjustAngle }
            // create closure on onPathEnd
            var onPathEnd = null;
            if (settings.onPathEnd) {
                        onPathEnd = function(pthfllwr, remloopCount) { settings.onPathEnd(this, remloopCount) }	;
                        followerParameters.onPathEnd = onPathEnd;
            }

            // here we go
            this._pathFollower = new ga.PathFollower( followerParameters );

            // initialize position
            this.pos.x = this._pathFollower.x;
            this.pos.y = this._pathFollower.y;
        }
	},
	update: function() {
        if (this.createFollower === true){
            // is there a delay ?
            if (this._spawnTimer) {
               if  (this._spawnTimer.delta()<0) /* yes */	return;
               this._show();
               this._spawnTimer = null ;
            }
            // did the path came to an end ?
            if (this._pathFollower.ended) {
                    this.kill();
                    return;
            }
            this._pathFollower.move(ig.system.tick*1e3);
            this.pos.x = this._pathFollower.x;
            this.pos.y = this._pathFollower.y;
            this.parent();
        } else{
            this.parent();
        }
	},
	draw : function() {
        if (this.createFollower === true){
             var ctx=ig.system.context;
             ctx.save();
             ctx.scale(ig.system.scale,ig.system.scale);
             ctx.fillStyle='#FEA';
             ctx.fillRect(this.pos.x,this.pos.y, this.size.x,this.size.y);
             ctx.restore();
            this._pathFollower.drawPath(ig.system.context, '#FEA');
            this.parent();
        } else {
            this.parent();
        }
	},
	_hide : function() {
			// save
			this._oldDraw           = this.draw;
			this._finalType         = this.type ;
			this._finalCheckAgainst = this.checkAgainst;
			this._finalCollides     = this.collides ;
			// set 'invisible'
			this.draw               = voidFunction;
		    this.type               = ig.Entity.TYPE.NONE;
		    this.checkAgainst       = ig.Entity.TYPE.NONE;
		    this.collides           = ig.Entity.COLLIDES.NEVER;
	},
	_show : function() {
     		this._killed      = false ;
			this.draw         = this._oldDraw;
		    this.type         = this._finalType;
		    this.checkAgainst = this._finalCheckAgainst;
		    this.collides     = this._finalCollides;
	}
			
});

function voidFunction() {};

});