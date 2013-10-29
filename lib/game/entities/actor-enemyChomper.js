/*************************************************************************
 *  @actor-enemyChomper.js
 *
 *  @author:    Dave Voyles
 *  @date:      June 2013
 *  @copyright: (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @desc:      Ship that shoots bullets but does not track player
 ************************************************************************/
ig.module(
	'game.entities.actor-enemyChomper'
)
.requires(
    'game.entities.base-enemy'
)
.defines(function () {

EntityActorEnemyChomper = EntityBaseEnemy.extend({

    animSheet:      new ig.AnimationSheet('media/textures/chomper-lg.png', 47, 40),
    size: 	        { x:  24, y:  20 },
    offset:         { x:  +8, y: +10 },
    friction:       { x: 150, y:   0 },
    speed:          600,  
    health:         9,
    shootTimer:     null,
    moveTimer:      null,
    initTimer:      null,
    newSpawnTimer:  null,
    xModifier:      100,
    initTime:       2,
    shootDist:      600,
    moveDist:       1000,
    name:           'enemyOrb',

    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.addAnim('fly',0.1,  [0,1,2,1,0]);
        this.initTimer      = new ig.Timer(this.initTime);
        this.shootTimer     = new ig.Timer(this.randomFromTo(3, 5));
        this.moveTimer      = new ig.Timer(this.randomFromTo(2, 4));
        this.newSpawnTimer  = new ig.Timer(3);
        
        /* vars for gun */
        this.startAngle     = this.ownAngle;
        this._angle         = this.currentAnim.angle + 3;
        this._increase      = 30;
        this.bullets        = 3;
        this.radius         = 3;
        this._entityBullet  = EntityObjectEnemyBulletPurple;
    },
    update: function () {
        this.parent();
        this.handleMovement();
        this.shoot();
    },    
    receiveDamage: function (value, from) {
        this.parent(value, from);
        if (this.health > 1) {
          this.spawnParticles();
        }
    },
    shoot: function(){
        if (this.distanceTo(ig.game.player) < this.shootDist) {
            this.shootBullets();
        }
    },
    handleMovement: function(){
        if (this.distanceTo(ig.game.player) > this.moveDist){
            this.moveToPlayer();
        } else {
            if (this.moveTimer.delta() > 0) {
                this.randomizeMovements();
            }
        }
    },
    spawnParticles: function(){
        var x = this.pos.x + (this.size.x >> 1 );
        var y = this.pos.y + (this.size.y >> 1 );
        ig.game.fragmentSpawner.spawn(x,y,FragmentSpawner.yellow ,  this.particleKillCount , this.size.x);
    }
});
});
