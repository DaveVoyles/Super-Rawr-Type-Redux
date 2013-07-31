/**
 *  @actor-enemyOrbBlue.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Ship that shoots bullets in 180 degrees
 */
ig.module(
	'game.entities.actor-enemyOrbBlue'
)
.requires(
    'game.entities.base-enemy'
    )
.defines(function () {

    EntityActorEnemyOrbBlue = EntityBaseEnemy.extend({

    /******************************************
    * Property Definitions
    ******************************************/
    animSheet: new ig.AnimationSheet('media/textures/actor-enemyOrb.png#e3a6f7', 15, 15),
    size: {
        x: 12,
        y: 12
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
    health:      4,
    shootTimer:  null,
    moveTimer:   null,
    initTimer:   null,
    xModifier:   100,
    initTime:    2,

    /*******************************************
    * Initialize
    *******************************************/
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.addAnim('fly', 0.1, [0, 1, 2, 3, 4, 3, 2, 1]);
        this.initTimer     = new ig.Timer(this.initTime);
        this.shootTimer    = new ig.Timer(this.randomFromTo(1, 2.3));
        this.moveTimer     = new ig.Timer(this.randomFromTo(1, 1.8));

        /* vars for gun */
        this.startAngle    = this.ownAngle;
        this._angle        = 241;
        this._increase     = 180;
        this.bullets       = 10;
        this.radius        = 5;
        this._entityBullet = EntityObjectEnemyBulletGreen;
    },

    /******************************************
    * Update
    ******************************************/
    update: function () {
        this.parent();
        // Reference to enemy spawner
        this.parental = ig.game.enemySpawner;

        // Forces ship to move onto screen, then random movements can occur
        if (this.pos.x > this.parental.pos.x - 50) {
            this.vel.x = this.kamikazeVelocity + this.xModifier;
            //this.moveTimer.reset();
        } else {
            // Movement
            if (this.moveTimer.delta() > 0) {
                this.randomizeMovements();
            }
        }
        this.shootBullets();
    },
});
});
