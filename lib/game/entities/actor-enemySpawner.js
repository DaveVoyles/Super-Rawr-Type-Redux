/************************************************************************
 *  @actor-enemySpawner.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Spawns enemies 
 ***********************************************************************/
ig.module(
    'game.entities.actor-enemySpawner'
)
    .requires(
    'game.entities.base-enemy',
	'game.entities.actor-enemyKamikaze',
    'game.entities.actor-enemyKamikazeComp',
    'game.entities.actor-enemyOrb',
    'game.entities.actor-enemyOrbBlue',
  	'game.entities.actor-enemyBoss',
    'game.entities.actor-follower'
    )
    .defines(function() {
        EntityActorEnemySpawner = EntityBaseEnemy.extend({

    animSheet:       new ig.AnimationSheet('media/textures/pu_BulletTime.png', 18, 17),
    startPosition:   null,
    spawnTimer:      null,
    bossEndTimer:    null,
    iniTimer:        null,
    health:          90000,
    canSpawnEnemies: true,
    bCanSpawnBoss:	 true,
    totalEnemyTypes: 5,
    size:            { x: 1, y: 1 },

    init: function (x, y, settings) {
    	this.abcdefg=0;
        this.parent(x, y, settings);
        this.addAnim('idle', 60, [0]);
        ig.game.enemies.current--; // Don't doubt this entity in total enemy count
        //this.spawnTimer = new ig.Timer(this.randomFromTo(3, 10));
        this.spawnTimer      = new ig.Timer(2);
        this.randomSpawnLocY = this.randomFromTo(ig.system.height - 20, ig.system.height / 20);
    },
    update: function () {
		this.setPosition();
        this.checkBoss();
    	// Stops tons of enemies from spawning at once 	
        if (this.spawnTimer.delta() > 0) {	
                this.spawnEnemy();
        } 
    },
    setPosition: function(){
        this.parent = ig.game.player;  
        this.pos.x = ig.system.width + 50;
        this.pos.y = ig.system.height / 2;
    },

    /******************************************
    * spawnEnemy
    * Spawns enemies at random intervals
    * If they can't spawn, then set canSpawnEnemies to false
    ******************************************/
    spawnEnemy: function () {
		// No more than 5 enemies on screen at once
        if (ig.game.enemies.current < ig.game.enemies.max) {
		    var rndNum = this.randomFromTo(1, this.totalEnemyTypes);
		    if (ig.game.stats.kills < ig.game.bossSpawnKills) {
		        switch (rndNum) {
		            case 1:
		                ig.game.spawnEntity(EntityActorEnemyOrbBlue,      this.pos.x, this.randomSpawnLocY);
		                this.spawnTimer.reset();
		                break;
		            case 2:
		                ig.game.spawnEntity(EntityActorEnemyOrb,          this.pos.x, this.randomSpawnLocY);
		                this.spawnTimer.reset();
		                break;
		            case 3:
		                ig.game.spawnEntity(EntityActorEnemyKamikaze,     this.pos.x, this.randomSpawnLocY);
		                this.spawnTimer.reset();
		                break;
		            case 4:
		                ig.game.spawnEntity(EntityActorEnemyKamikazeComp, this.pos.x, this.randomSpawnLocY);
		                this.spawnTimer.reset();
		                break;
                    case 5:
           //             this.createPathAndFollower();
                        this.spawnTimer.reset();
                        break;
		            default:
		                this.spawnTimer.reset();
		                break;
		        }
		    } else {
		        this.canSpawnEnemies = false;
		    }
        }
    },
    receiveDamage: function (value) {
        return;     // Invincible, so always return
    },
    wipeRemainingEnemies: function(){
        var allEnemies = ig.game.getEntitiesByType(EntityBaseEnemy);
        if (allEnemies.length > 0) {
            for (var i = 0; i < allEnemies.length; i++) {
                ig.game.removeEntity(allEnemies[i]);
           	}
        }     
    },
    checkBoss: function () {
        if (ig.game.stats.kills >= ig.game.bossSpawnKills) {
            var allBosses = ig.game.getEntitiesByType(EntityActorEnemyBoss);
             if (allBosses.length === 0 && this.bCanSpawnBoss === true) { 
        	     this.wipeRemainingEnemies();
				 this.spawnBoss();
			}
		}
    },
    spawnBoss: function(){
        ig.game.spawnEntity(EntityActorEnemyBoss, this.pos.x, this.pos.y);
        this.bCanSpawnBoss = false;   // Prevent boss from spawning more than once
    },
    createPathAndFollower: function(){
        var settings = {
            path              : null ,
            pathSpeed         : 70   ,
            loopCount         :  3   ,
            spawnDelay        :  0   ,
            rank 	          :  0   ,
            onPathEnd         : null ,
            adjustAngle       : false,
            shift             : null ,
            pathLengths       : null ,
            normalizedSegments: null         };

        var myPath    = new ga.Path ( [ig.system.width /2 ,300, 500] ) ;
        settings.path = myPath ;
        myPath.addFunctionPath( 650, 220, function(x) { return 12*Math.sin(40*x) ; } , 5 );

        ig.game.spawnEntity(EntityFollower, this.pos.x, this.randomSpawnLocY, settings );
        settings.spawnDelay=2;
    }
});
}); 