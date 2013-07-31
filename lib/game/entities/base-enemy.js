/**
 *  @actor-enemy.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @base actor for all enemy ships
 */
ig.module(
    'game.entities.base-enemy'
)
.requires(
    'game.entities.base-actor',
    'game.entities.object-enemyBulletBlue',
    'game.entities.object-enemyBulletGreen'
)
.defines(function () {
    EntityBaseEnemy = EntityBaseActor.extend({

        health: 6,
        hitOtherDmg: 10,
        speedModifier: 1.1,
        kamikazeSpeed: -200,
        kamikazeVelocity: -200,
        particleCount: 6,
        particleKillCount: 12,
        xModifier: 100,
        maxVel: {
            x: 300,
            y: 300
        },
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        /* Used for gun */
        reloadTime: 3,
        angle: Math.PI / 2,
        fireOffset: 10,             // Starts bullets from center of gun
        radius: {},                 // Distance from point it leaves ship
        bullets: {},                // Number of bullets fired
        _angle: {},                 // Direction bullets fire [-500 = right to left]
        _distance: {},              // Distance between bullets [degrees]
        _entityBullet: {},          // Bullet type passed in [Entity]

        /*******************************************
        * Initialize
        *******************************************/
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            ig.game.currentEntities++;
        },

        /***********************************************
        * Update
        * Kills objects if past the bounds of the screen
        ************************************************/
        update: function () {
            this.parent();
            this.player = ig.game.player;

            if (this.pos.x > ig.system.width + 50 ||
                this.pos.y > ig.system.height + 250 ||
                this.pos.x < -50 ||
                this.pos.y < -50) {
                this.killedByScreen();
            }
        },

        /******************************************
        * Kill
        ******************************************/
        kill: function () {
            ig.game.stats.kills++;
            ig.game.spawnEntity(EntityExplosionParticleRed, this.pos.x, this.pos.y, {
                count: this.particleKillCount,
            });
            ig.game.spawnEntity(EntityExplosionParticleGrey, this.pos.x, this.pos.y, {
                count: this.particleKillCount,
            });
            this.Explode01_sfx.play();
            //        this.lootDrop();            //TODO: Program this
            ig.game.currentEntities--;
            this.parent();
        },

        /******************************************
        * killedByScreen
        * prevents particles from going off when
        * killed by screen
        ******************************************/
        killedByScreen: function () {
            ig.game.removeEntity(this);
            ig.game.currentEntities--;
            console.log("killed");
        },

        /******************************************
        * Check (for damage done to others)
        ******************************************/
        check: function (other) {
            other.receiveDamage(this.hitOtherDmg, this);
            this.kill();
        },

        /******************************************
        * receiveDamage
        * Throws particles each time actor is hit
        ******************************************/
        receiveDamage: function (value) {
            this.parent(value);
            if (this.health > 1) {
                ig.game.spawnEntity(EntityExplosionParticleBlue, this.pos.x, this.pos.y, {
                    count: this.particleCount,
                });
                ig.game.spawnEntity(EntityExplosionParticleYellow, this.pos.x, this.pos.y, {
                    count: this.particleCount,
                });
                this.Hit03_sfx.play();
            }
        },

        /******************************************
        * shootBullets
        ******************************************/
        shootBullets: function () {
            if (this.shootTimer.delta() > 0) {
                var inc = this._increase / (this.bullets - 1);
                var a = this._angle * 180 / Math.PI;

                for (var i = 0; i < this.bullets; i++) {
                    var angle = a * Math.PI / 180;
                    var x = this.pos.x + this.fireOffset + Math.cos(angle) * this.radius;
                    var y = this.pos.y + Math.sin(angle) * this.radius;
                    ig.game.spawnEntity(this._entityBullet, x, y, {
                        angle: angle
                    });
                    a += inc;
                }
                this.shootTimer.set(this.reloadTime);
            }
        },


        /********************************************************************************************
        * Enemy Movements
        ********************************************************************************************/

        /******************************************
        * Randomizes movements for AI
        * We repeat forward movements to emphasize
        * enemy movement toward player.
        ******************************************/
        randomizeMovements: function () {
            var rndNum = this.randomFromTo(1, 9);
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
                default:
                    this.moveForward();
                    break;
            }
        },

        moveToPlayer: function () {
            var angle = this.angleTo(this.player);
            var angleX = Math.cos(angle);
            var angleY = Math.sin(angle);

            this.vel.x = angleX * -this.kamikazeSpeed;
            this.vel.y = angleY * -this.kamikazeSpeed;
        },

        moveFromPlayer: function () {
            var angle = this.angleTo(this.player);
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
