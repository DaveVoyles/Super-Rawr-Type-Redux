/**
 *  @actor-enemyOrb.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Ship that shoots bullets but does not track player
 */
ig.module(
	'game.entities.actor-enemyOrb'
)
.requires(
    'game.entities.base-enemy'
    )
.defines(function () {

EntityActorEnemyOrb = EntityBaseEnemy.extend({

    /******************************************
    * Property Definitions
    ******************************************/
    animSheet:   new ig.AnimationSheet('media/textures/actor-enemyOrb.png', 30, 30),
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
    speed:          600,  
    health:         9,
    shootTimer:     null,
    moveTimer:      null,
    initTimer:      null,
    newSpawnTimer:  null,
    xModifier:      100,
    initTime:       2,

    


    /*******************************************
    * Initialize
    *******************************************/
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.addAnim('fly', 0.1, [0, 1, 2, 3, 4, 3, 2, 1]);
        this.initTimer      = new ig.Timer(this.initTime);
        this.shootTimer     = new ig.Timer(this.randomFromTo(3, 5));
        this.moveTimer      = new ig.Timer(this.randomFromTo(2, 4));
        this.newSpawnTimer  = new ig.Timer(3);
        
        /* vars for gun */
        this.startAngle     = this.ownAngle;
        this._angle         = -500;
        this._increase      = 60;
        this.bullets        = 4;
        this.radius         = 10; 
        this._entityBullet  = EntityObjectEnemyBulletGreen;
    },

    /******************************************
    * Update
    ******************************************/
    update: function () {
        this.parent();
            
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
});
});
