/************************************************************************
 *  @actor-enemySentinel.js
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
            size: 	        { x:  50, y: 40 },
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
            particleCnt:    40,

            init: function (x, y, settings) {

                this.parent(x, y, settings);
                this.addAnim('fly', 0.1, [0, 1, 2, 3, 4, 5, 6]);
                this.initTimer      = new ig.Timer(this.initTime);
                this.shootTimer     = new ig.Timer(1);
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
                    ig.game.fragmentSpawner.spawn(x,y,FragmentSpawner.green ,  this.particleCnt , this.size.x);
                }
            }
        });
    });