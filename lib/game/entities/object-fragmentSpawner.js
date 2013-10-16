/***************************************************
 *  @object-JSparleParticleSpawner.js
 *  @version: 0.1
 *  @author: Vincent Piel / GameAlchemist
 *  @date: October 2013
 *  @copyright (c) 2013 GameAlchemist. Fair-ware.
 ***************************************************/
ig.module(
    'game.entities.object-fragmentSpawner'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {
        "use strict";
        
     // Class just used to conveniently load the particles
     // images
     var ParticlesImages =  ig.Class.extend({
     	 init   : function() {},
     	 blue   : new ig.Image('media/textures/particlesBlue1.png'  ),
     	 yellow : new ig.Image('media/textures/particlesYellow1.png'),
     	 red    : new ig.Image('media/textures/particlesRed1.png'   ),
     	 green  : new ig.Image('media/textures/particlesGreen1.png' ),
     	 grey   : new ig.Image('media/textures/particlesGrey1.png'  )
     });

	window.FragmentSpawner = ig.Class.extend({
     	defaultCount : 10,
     	init : function(maxParticleCount) {

     		// retrieving images 
     		this.colors  = [ ];
     		var myImages = new ParticlesImages();
     		for (var p in myImages) { 
     			 FragmentSpawner[p] = this.colors.length;
     			 this.colors.push(myImages[p].data); 
     		}
     		function getGameTime() { return ig.Timer.time * 1e3;  };

            this._jSparkle = new ga.JSparkle(Fragment, maxParticleCount, ig.system.context, getGameTime );
            this.update    = this._jSparkle.update.bind(this._jSparkle);
            this.draw      = this._jSparkle.draw.bind(this._jSparkle);
     	},

     	/* spawns some particles at x,y. Using the colorIndex (from 0 to 4) image.
     	 * for the index you can use FragmentSpawner.blue (==0) or FragmentSpawner.yellow or ..
     	 * radial distance is the distance from center at which particles start
     	 * _count is optional, default to defaultCount (==10)
     	 * *************************************************************************************/
     	spawn : function (x, y, colorIndex, _count, _radialDistance , _circleCount, _circleDelay) {
			_count          =  _count         || this.defaultCount ;
			_circleCount    = _circleCount    ||  1                ;
			_circleDelay    = _circleDelay    || 34                ;
			_radialDistance = _radialDistance ||  6                ;
     		var colorImage  = this.colors[colorIndex];
     		    x           -=  colorImage.width  >> 1;
                y           -=  colorImage.height >> 1;
     		this._jSparkle.spawn(_count, x,y, colorImage,_radialDistance, _circleCount, _circleDelay);
     	}
     });
     
     function Fragment() {
     	this.x         = 0    ;      this.y    = 0;
     	this.velX      = 0    ;      this.velY = 0;
     	this.image     = null ;

     	this.birthTime = 0    ;      // birth is NOT handled in the spawn -all particles raise at once-
    	this.deathTime = 0    ;      // death is handled

		// Alpha    	
    	this.fadeTime  = 0    ;      // fade pattern
	    this.fadeRatio = 0    ;
	}
     
     // Alpha
     var defaultFadeDuration = 800 ;  // in ms

     Fragment.prototype = {
     	 dt           : 0            ,
         currentTime  : 0            ,
         drawContext  : null         ,
         
        maxVelocityNorm:        0.500,
        defaultLifeDuration:     1500, // in ms
        
        // Alpha
         defaultFadeDuration :          defaultFadeDuration     ,
         __defaultFadeDurationInverse : 1 / defaultFadeDuration ,    //__ is prefix for optimisation variables. here to avoid divide
         previousAlpha : 0,
                
        __screenX : 0,
        __screenY : 0,
                
     	update : function() {
				this.x += this.dt * this.velX;
				this.y += this.dt * this.velY;
				
				// Alpha
				 if (this.currentTime>=this.fadeTime) {
                   this.fadeRatio = (this.deathTime - this.currentTime)*this.__defaultFadeDurationInverse ;					
				 } else this.fadeRatio = 1;
     	 },
     	 draw : function() {
     	 	    //   Alpha
                this.drawContext.globalAlpha = this.fadeRatio;
                this.drawContext.drawImage(this.image,  0 | (0.5 + this.x - this.__screenX ), 0 | (0.5 + this.y - this.__screenY) );
         },
     	 preDraw : function() { 
     	 	this.__screenX = ig.game.screen.x;  
     	 	this.__screenY = ig.game.screen.y; 
     	 	// Alpha
     	 	this.previousAlpha = this.drawContext.globalAlpha ;
     	 },
     	 // postDraw : null,
     	 
     	 // Alpha
     	  postDraw : function () {
     	       this.drawContext.globalAlpha = this.previousAlpha ;
		   },
     	 
     	spawn : function (particleLoopBuffer, firstIndex, count, currentTime, x, y, image, radialDistance, circleCount, circleDelay /*... */) {
			var index       = firstIndex,
			    length      = particleLoopBuffer.length,
			    particle    = null,
			    angleStep   = circleCount * 2 * Math.PI / count,
			    baseAngle   = 0,
			    angle       = 0,
			    thisVel     = 0,
			    thisAngle   = 0,
			    circleIndex = 0, rand    = 0,
			    pIndex      = 0, thisCos = 0, thisSin = 0;
			    
			var   pointPerCircle = 0 | ( count / circleCount ) ;
			    
			while ( count-- ) {
				particle = particleLoopBuffer[index];
	
				//  --  start of particle initialisation
				particle.image    = image ;
				rand              = Math.random();
				thisVel           = ( 0.3 + 0.7 * rand ) * this.maxVelocityNorm ; // between 60% and 100% of maxVelocityNorm
				thisAngle         = baseAngle + ( 0.1 + 0.9 * rand ) * angleStep ;
                thisCos           = Math.cos ( thisAngle ) ;
                thisSin           =  Math.sin ( thisAngle ) ;
                particle.velX     = thisVel  * thisCos;
                particle.velY     = thisVel  * thisSin;
                particle.x        = x + radialDistance * thisCos * (1+0.25*rand);
                particle.y        = y + radialDistance * thisSin * (1+0.25*rand);

				if (circleIndex >0) {
					particle.birthTime = currentTime +  circleIndex*circleDelay ;
					particle.deathTime = particle.birthTime + this.defaultLifeDuration ;	
					
				} else {
					particle.birthTime = 0 ;
					particle.deathTime = currentTime + this.defaultLifeDuration ;	
				}
				// Alpha			
				 particle.fadeTime  = particle.deathTime - this.defaultFadeDuration ;
				
				baseAngle += angleStep ;
				pIndex++;
                if (pIndex==pointPerCircle) circleIndex++;{
				    //  --  end of particle initialisation
				    index++;
                }
                if (index == length ) {
                    index = 0;
                };
		  }	
        }
     };

     var getDrawPos = function(x) { return 0 | ( x + 0.5 ) ; };
});
