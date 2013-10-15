/************************************************************************
 *  @base-enemy.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @base actor for all enemy ships
 ***********************************************************************/
ig.module(
    'game.entities.base-enemy'
)
.requires(
    'impact.entity',
    'plugins.imageblender',
    'game.entities.object-enemyBulletBlue',
    'game.entities.object-enemyBulletGreen'
  //  , 'game.entities.actor-follower'
)
.defines(function () {
    EntityBaseEnemy = ig.Entity.extend({
  //  EntityBaseEnemy = EntityFollower.extend({

        health:            12,
        hitOtherDmg:       10,
        speedModifier:     1.1,
        kamikazeSpeed:     -200,
        kamikazeVelocity:  -200,
        particleCount:     15,
        particleKillCount: 20,
        xModifier:         150,
        maxVel:            { x: 400, y: 400 },
        type:              ig.Entity.TYPE.B,
        checkAgainst:      ig.Entity.TYPE.A,
        collides:          ig.Entity.COLLIDES.PASSIVE,

        /* Used for gun */
        reloadTime:    3,
        angle:         Math.PI / 2,
        fireOffset:    10,           // Starts bullets from center of gun
        radius:        {},           // Distance from point it leaves ship
        bullets:       {},           // Number of bullets fired
        _angle:        {},           // Direction bullets fire [-500 = right to left]
        _distance:     {},           // Distance between bullets [degrees]
        _entityBullet: {},           // Bullet type passed in [Entity]

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            ig.game.enemies.current++;
        },
        update: function () {
            this.parent();
            this.collisionDetection();
            this.player = ig.game.player;

            if (this.pos.x > ig.system.width  +  50 ||
                this.pos.y > ig.system.height + 250 ||
                this.pos.x < -50 ||
                this.pos.y < -50) {
                    this.killedByScreen();
            }
        },

        kill: function () {
        	var x = this.pos.x + (this.size.x >> 1 );
	        var y = this.pos.y + (this.size.y >> 1 );

           ig.game.fragmentSpawner.spawn(x,y, FragmentSpawner.red  , this.particleKillCount, this.size.x);
    	   ig.game.fragmentSpawner.spawn(x,y, FragmentSpawner.grey , this.particleKillCount, this.size.x);
            SoundSource.explode.play();
            this.lootDrop();          
            ig.game.enemies.current--;
            ig.game.stats.kills++;
            this.parent();
        },
        // prevents particles from going off when  killed by screen
        killedByScreen: function () {
            ig.game.enemies.current--;
            ig.game.removeEntity(this);
        },
        check: function (other) {
            other.receiveDamage(this.hitOtherDmg, this);
        },
        receiveDamage: function (value, from) {
            this.parent(value, from);
            if (this.health > 1) {
                SoundSource.hit.play();
            }
        },
        // Randomly spawns loot for player
        lootDrop: function () {
            var rndNum = this.randomFromTo(1, 8);

            if (rndNum  < 2) {
            var rndDropNum = this.randomFromTo(1, 4);
            switch (rndDropNum) {
                case 1:
                    if (ig.game.companions.current < ig.game.companions.max) {
                        ig.game.spawnEntity(EntityObjectPuMiniShip,       this.pos.x, this.pos.y);
                    }
                    break;
                case 2:
                    if (ig.game.bulletTime.current < ig.game.bulletTime.max) {
                        ig.game.spawnEntity(EntityObjectPickupBulletTime, this.pos.x, this.pos.y);
                    }
                    break;
                case 3:
                    if (ig.game.turrets.current < ig.game.turrets.max) {
                        ig.game.spawnEntity(EntityObjectPickupTurret,     this.pos.x, this.pos.y);
                    }
                    break;
                default:
                    break
            }
          }
        },
        shootBullets: function (xOffset, yOffset) {
            if (this.shootTimer.delta() > 0) {
                var centerX = this.pos.x + this.size.x / 2;
                var centerY = this.pos.y + this.size.y / 2;
                if (xOffset) {
                    var OffsetX = xOffset
                } else {
                    var OffsetX = 0;
                }
                if (yOffset) {
                    var OffsetY = yOffset
                } else {
                    var OffsetY = 0;
                }
                var xPos    = centerX + OffsetX;
                var yPos    = centerY + OffsetY;
                var inc     = this._increase / (this.bullets - 1);
                var a       = this._angle * 180 / Math.PI;

                for (var i = 0; i < this.bullets; i++) {
                    var angle = a * Math.PI / 180;
                    ig.game.spawnEntity(this._entityBullet, xPos, yPos, {
                        angle: angle
                    });
                    a += inc;
                }
                this.shootTimer.set(this.reloadTime);
            }
        },
        collisionDetection: function () {
            if (this.pos.x > ig.system.width) {
                this.pos.x = ig.system.width;
            }
            if (this.pos.y <= 10) {
                this.pos.y = +10;
            } else if (this.pos.y >= ig.system.height - 30) {
                this.pos.y = ig.system.height - 30;
            }
        },
        randomFromTo: function (from, to) {
            return Math.floor(Math.random() * (to - from + 1) + from);
        },


        /********************************************************************************************
        * Enemy Movements
        ********************************************************************************************/

        // We repeat forward movements to emphasize enemy movement toward player.
        randomizeMovements: function () {
            var rndNum = this.randomFromTo(1, 10);
            this.moveTimer.reset();

            switch (rndNum) {
                case 1:
                    this.stop();
                    break;
                case 2:
                    this.moveToPlayer();
                    break;
                case 3:
                    this.moveFromPlayer();
                    break;
                case 4:
                    this.moveForward();
                    break;
                case 5:
                    this.backup();
                    break;
                case 6:
                    this.moveToPlayer();
                    break;
                case 7:
                    this.moveToPlayer();
                    break;
                case 8:
                    this.moveForward();
                    break;
                case 9:
                    this.moveForward();
                    break;
                case 10:
                    this.moveForward();
                    break;
                default:
                    this.moveForward();
                    break;
            }
        },

        moveToPlayer: function () {
            var angle  = this.angleTo(this.player);
            var angleX = Math.cos(angle);
            var angleY = Math.sin(angle);

            this.vel.x = angleX * -this.kamikazeSpeed;
            this.vel.y = angleY * -this.kamikazeSpeed;
        },

        moveFromPlayer: function () {
            var angle  = this.angleTo(this.player);
            var angleX = -Math.cos(angle);
            var angleY = -Math.sin(angle);

            this.vel.x = angleX * -this.kamikazeSpeed;
            this.vel.y = angleY * -this.kamikazeSpeed;
        },

        backup: function () {
            this.vel.x = +50;
        },

        stop: function () {
            this.vel.x = 0;
        },

        moveForward: function () {
            this.vel.x = this.kamikazeVelocity + this.xModifier;
        }
    });
});
