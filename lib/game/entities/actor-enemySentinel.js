/************************************************************************
 *  @actor-enemySentinel.js
 *
 *  @author:    Dave Voyles
 *  @date:      Oct 2013
 *  @copyright: (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Desc:      Creates an enemy which follows paths
 ***********************************************************************/
ig.module(
        'game.entities.actor-enemySentinel'
    )
    .requires(
        'game.entities.base-enemy'
    )
    .defines(function(){


    EntityEnemySentinel =  EntityBaseEnemy.extend({

        animSheet:      new ig.AnimationSheet('media/textures/purple-ship.png', 52, 48),
        size: 	        { x:  30, y: 30 },
        offset:         { x:  +6, y: +8 },
        friction:       { x: 150, y:  0 },
        speed:          600,
        health:         7,
        shootTimer:     null,
        moveTimer:      null,
        initTimer:      null,
        newSpawnTimer:  null,
        xModifier:      100,
        initTime:       2,
        particleCnt:    40,

        init: function (x, y, settings) {

            this.parent(x, y, settings);
            this.addAnim('fly', 0.2, [0, 1, 2, 3, 4, 5, 6]);
            this.initTimer      = new ig.Timer(this.initTime);
            this.shootTimer     = new ig.Timer(this.randomFromTo(1, 3));

            this.newSpawnTimer  = new ig.Timer(3);

            /* vars for gun */
            this.startAngle     = this.ownAngle;
            this._angle         = this.currentAnim.angle + 3;
            this._increase      = 30;
            this.bullets        = 3;
            this.radius         = 1;
            this._entityBullet  = EntityObjectEnemyBulletPurple;
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
                ig.game.fragmentSpawner.spawn(x,y,FragmentSpawner.green ,  this.particleCnt , this.size.x);
            }
        }
    });
});