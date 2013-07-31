ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
    'game.entities.actor-player',
    'game.entities.object-crosshair',
    'impact.debug.debug',
    'game.entities.object-pickupBulletTime'
)
.defines(function(){

MyGame = ig.Game.extend({
	
    font:             new ig.Font ('media/fonts/04b03.font.png'),
    backdrop:         new ig.Image('media/backgrounds/tempBG.png'),
    grid:             new ig.Image('media/backgrounds/grid.png'),
    scanlines:        new ig.Image('media/backgrounds/scan-lines-dark.png'),
    lifeSprite:       new ig.Image('media/ui/ship_lifebar.png'),
    statMatte:        new ig.Image('media/ui/stat-matte.png'),
    transTextBG:      new ig.Image('media/ui/transTextBG.png'),
    bulletTimeSprite: new ig.Image('media/ui/BulletTimeDisplayBar1.png'),
    
    
    /*******************************************
    * Init
    ******************************************/
    init: function () {
        var bgmap = new ig.BackgroundMap(620, [
                        [1]], this.grid);
        bgmap.repeat = true;
        this.backgroundMaps.push(bgmap);
        this.inputControls();
        this.player = ig.game.spawnEntity(EntityActorPlayer, ig.system.width / 2, ig.system.height / 2)
        this.enemySpawner = ig.game.spawnEntity(EntityActorEnemySpawner,ig.system.width / 2, ig.system.height /2);
    },
   
    /*******************************************
    * Update
    ******************************************/
	update: function() {
		this.parent();
		this.backgroundMaps[0].scroll.x -= 100 * ig.system.tick;
	},
	
    /*******************************************
    * Draw
    ******************************************/
	draw: function () {
	    this.backdrop.draw(0, 0);
	    for (var i = 0; i < this.backgroundMaps.length; i++) {
	        this.backgroundMaps[i].draw();
	    }	
	    for (var i = 0; i < this.entities.length; i++) {
	        this.entities[i].draw();
	    }
	    // Draws transparent background behind text
	    this.transTextBG.draw(0, 0);

	    // Draws lifebar
	    this.font.draw("Lives", 5, 5);
	    for (var i = 0; i < this.stats.lives; i++)
	        this.lifeSprite.draw(((this.lifeSprite.width + 2) * i) + 5, 15);
	    
	    // Draws bullet time bar
	    this.font.draw("Bullet Time", 5, 32);
	    for (var i = 0; i < EntityObjectPickupBulletTime.prototype.currentBulletTime; i++)
	        this.bulletTimeSprite.draw(((this.bulletTimeSprite.width + 2) * i) + 5, 40);

	    this.scanlines.draw(0,0);
	},
    
    /*******************************************
    * Input Controls
    ******************************************/
	inputControls: function(){
        ig.input.bind(ig.KEY.A,          'left'          );
        ig.input.bind(ig.KEY.LEFT_ARROW, 'left'          );
        ig.input.bind(ig.KEY.D,          'right'         );
        ig.input.bind(ig.KEY.RIGHT_ARROW,'right'         );
        ig.input.bind(ig.KEY.W,          'up'            );
        ig.input.bind(ig.KEY.UP_ARROW,   'up'            );
        ig.input.bind(ig.KEY.S,          'down'          );
        ig.input.bind(ig.KEY.DOWN_ARROW, 'down'          );
	    
        ig.input.bind(ig.KEY.C,          'shoot'         );
        ig.input.bind(ig.KEY.TAB,        'switch'        );
        ig.input.bind(ig.KEY.X,          'slowTime'      );
        ig.input.bind(ig.KEY.Q,          'spawnCompanion');
        ig.input.bind(ig.KEY.MOUSE1,     'shoot'         );
        ig.input.bind(ig.KEY.MOUSE2,     'rightClick'    );
	    ig.input.bind(ig.KEY.V,          'shootTest'     );
    }
});

//if (ig.ua.mobile) {
    //Disable sound for all mobile devices
    ig.Sound.enabled = false;
//}
// Start the Game with 60fps, a resolution of 640x480, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 720, 480, 1 );
});
