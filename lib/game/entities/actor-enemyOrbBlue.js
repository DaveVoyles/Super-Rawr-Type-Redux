/***************************************************************************
 *  @actor-enemyOrbBlue.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @desc: Ship that shoots bullets 180 degrees
 **************************************************************************/
ig.module(
	'game.entities.actor-enemyOrbBlue'
)
.requires(
    'game.entities.base-enemy'
    )
.defines(function () {

    EntityActorEnemyOrbBlue = EntityBaseEnemy.extend({

    animSheet: new ig.AnimationSheet('media/textures/actor-enemyOrb.png#e3a6f7', 30, 30),
    size: {
        x: 24,
        y: 24
    },
    offset: {
        x: +2, 
        y: +4
    },
    friction: {
        x: 150,
        y: 0
    },
    speed:       600,  
    health:      8,
    shootTimer:  null,
    moveTimer:   null,
    initTimer:   null,
    xModifier:   100,
    initTime:    2,

    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.addAnim('fly', 0.1, [0, 1, 2, 3, 4, 3, 2, 1]);
        this.initTimer     = new ig.Timer(this.initTime);
        this.shootTimer    = new ig.Timer(this.randomFromTo(4, 6));
        this.moveTimer     = new ig.Timer(this.randomFromTo(2, 5));

        /* vars for gun */
        this.startAngle    = this.ownAngle;
        this._angle        = 241;
        this._increase     = 180;
        this.bullets       = 8;
        this.radius        = 5;
        this._entityBullet = EntityObjectEnemyBulletGreen;
    },
    update: function () {
        this.parent();
        this.parental = ig.game.enemySpawner;
            
        if (this.distanceTo(ig.game.player) > 1000){
            this.moveToPlayer();
        } else {
            if (this.moveTimer.delta() > 0) {
                this.randomizeMovements();
            }
        }
        if (this.distanceTo(ig.game.player) < 700) {
            this.shootBullets();
        }
    },
    receiveDamage: function (value, from) {
        this.parent(value, from);
        if (this.health > 1) {
   ig.game.fragmentSpawner.spawn(this.pos.x, this.pos.y,FragmentSpawner.green ,  this.particleKillCount , this.size.x);
	         }
    }
});
});
