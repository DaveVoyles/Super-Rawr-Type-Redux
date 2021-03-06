/************************************************************************
 *  @actor-testFollower.js
 *
 *  @author:    Dave Voyles
 *  @date:      Oct 2013
 *  @copyright: (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Desc:      Creates an enemy which follows paths
 ***********************************************************************/
ig.module(
    'game.entities.actor-testFollower'
)
.requires(
    'game.entities.base-enemy'
)
.defines(function(){


    EntityTestFollower =  EntityBaseEnemy.extend({

    animSheet:      new ig.AnimationSheet('media/textures/actor-enemyOrb.png', 30, 30),
    size: 	        { x:  24, y: 24 },
    offset:         { x:  +2, y: +4 },
    friction:       { x: 150, y:  0 },
    speed:          600,
    health:         9,
    shootTimer:     null,
    moveTimer:      null,
    initTimer:      null,
    newSpawnTimer:  null,
    xModifier:      100,
    initTime:       2,

    init: function (x, y, settings) {

        this.parent(x, y, settings);
        this.addAnim('fly', 0.1, [0, 1, 2, 3, 4, 3, 2, 1]);
        this.initTimer      = new ig.Timer(this.initTime);
        this.shootTimer     = new ig.Timer(this.randomFromTo(1, 3));
        this.newSpawnTimer  = new ig.Timer(3);

        // vars for gun
        this.startAngle     = this.ownAngle;
        this._angle         = -500;
        this._increase      =   60;
        this.bullets        =    3;
        this.radius         =   10;
        this._entityBullet  = EntityObjectEnemyBulletGreen;
    },
    update: function () {

        this.parent();
        this.shootBullets();
    },
    receiveDamage: function (value, from) {

        this.parent(value, from);
        if (this.health > 1) {
            var x = this.pos.x + (this.size.x >> 1 );
            var y = this.pos.y + (this.size.y >> 1 );
            ig.game.fragmentSpawner.spawn(x,y,FragmentSpawner.yellow ,  this.particleKillCount , this.size.x);
        }
    }
});
});