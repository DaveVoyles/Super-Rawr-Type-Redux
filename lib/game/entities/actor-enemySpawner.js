/************************************************************************
 *  @actor-enemySpawner.js
 *
 *  @author:    Dave Voyles
 *  @date:      June 2013
 *  @copyright: (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @desc:      Spawns enemies
 ************************************************************************/
ig.module(
    'game.entities.actor-enemySpawner'
)
    .requires(
    'game.entities.base-enemy',
	'game.entities.actor-enemyKamikaze',
    'game.entities.actor-enemyKamikazeComp',
    'game.entities.actor-enemyChomper',
    'game.entities.actor-enemyOrbBlue',
  	'game.entities.actor-enemyBoss',
    'game.entities.actor-follower',
    'game.entities.actor-testFollower'
    )
    .defines(function() {
    EntityActorEnemySpawner = EntityBaseEnemy.extend({

    animSheet:       new ig.AnimationSheet('media/textures/pu_BulletTime.png', 18, 17),
    startPosition:   null,
    spawnTimer:      null,
    bossEndTimer:    null,
    health:          90000,
    canSpawnEnemies: true,
    bCanSpawnBoss:	 true,
    name:            'enemySpawner',
    size:            { x: 1, y: 1 },

    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.addAnim('idle', 60, [0]);
        ig.game.enemies.current--; // Don't count this entity in total enemy count
        this.spawnTimer = new ig.Timer(this.randomFromTo(ig.game.spawnTime.min, ig.game.spawnTime.max));
        // Allow enemies to spawn anywhere on the Y-axis
        this.randomSpawnLocY = this.randomFromTo(ig.system.height - 20, ig.system.height / 20);
        // Don't spawn enemies right away, give the player a moment to get their bearings
        this.initTimer = new ig.Timer(3);
    },
    update: function () {
		this.setPosition();
        this.checkBoss();
    	// Stops tons of enemies from spawning at once 	
        if (this.spawnTimer.delta() > 0 && !this.initTimer) {
                this.spawnEnemy();
        }
        this.enemiesAlwaysOnScreen();
        this.removeInitTimer();
    },
    setPosition: function(){
        this.parent = ig.game.player;  
        this.pos.x = ig.system.width + 50;
        this.pos.y = ig.system.height / 2;
    },
    // Give the player some time to catch bearings before spawning enmies
    removeInitTimer: function(){
        if (this.initTimer && this.initTimer.delta() > 0){
            this.initTimer = null;
        }
    },

    // Spawns enemies at random intervals. If they can't spawn, then set canSpawnEnemies to false
    spawnEnemy: function () {
		// No more than 5 enemies on screen at once
        if (ig.game.enemies.current < ig.game.enemies.max) {
		    var rndNum = this.randomFromTo(1, 11);
		    if (ig.game.stats.kills < ig.game.bossSpawnKills) {
		        switch (rndNum) {
		            case 1:
		                ig.game.spawnEntity(EntityActorEnemyOrbBlue,      this.pos.x, this.randomSpawnLocY);
		                this.spawnTimer.reset();
		                break;
		            case 2:
		                ig.game.spawnEntity(EntityActorEnemyChomper,      this.pos.x, this.randomSpawnLocY);
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
                        ig.game.createPathOne();
                        this.spawnTimer.reset();
                        break;
                    case 6:
                        ig.game.createPathTwo();
                        this.spawnTimer.reset();
                        break;
                    case 7:
                        ig.game.createPathThree();
                        this.spawnTimer.reset();
                        break;
                    case 8:
                        ig.game.createPathFour();
                        this.spawnTimer.reset();
                        break;
                    case 9: ig.game.createPathFive();
                        this.spawnTimer.reset();
                        break;
                    case 10:
                        ig.game.spawnEntity(EntityActorEnemyKamikazeComp, this.pos.x, this.randomSpawnLocY);
                        this.spawnTimer.reset();
                        break;
                    case 11:
                        ig.game.spawnEntity(EntityActorEnemyKamikazeComp, this.pos.x, this.randomSpawnLocY);
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
    // Makes sure that there are always enemies on screen for the player to kill
    enemiesAlwaysOnScreen: function(){
        if (!this.initTimer){
            var enemies = ig.game.getEntitiesByType(EntityBaseEnemy);
            if (enemies.length === 1 && this.canSpawnEnemies === true){
                this.spawnEnemy();
                console.log('enemeisAlwaysOnScreen');
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
    }
});
}); 