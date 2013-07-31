/**
 *  @actor-player.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Player controlled ship
 */
ig.module(
    'game.entities.actor-player'
)
    .requires(
    'game.entities.base-player',
    'game.entities.actor-companion',
    'game.entities.actor-enemySpawner',
    'plugins.timeslower'
)
.defines(function () {
    EntityActorPlayer = EntityBasePlayer.extend({

        /******************************************
        * Property Definitions
        ******************************************/
        animSheet:        new ig.AnimationSheet('media/textures/actor-playerShip.png', 24, 24),
        soundShoot:       new ig.Sound('media/sfx/Explode01.ogg'),
        font:             new ig.Font('media/fonts/04b03.font.png'),
        size: {
            x: 10,
            y: 10
        },
        offset: {
            x: 11,
            y: 11
        },
        friction: {
            x: 800,
            y: 600
        },
        angle:            -Math.PI / 2,
        speed:            320,
        health:           1,
        compRespawnDelay: 2,



        /******************************************
        * Initialization
        ******************************************/
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 60, [0]);
            this.addAnim('shoot', 0.05, [3, 2, 1, 0], true);
            this.lastShootTimer = new ig.Timer(0);
            this.compSpawnTimer = new ig.Timer(0);
            this.soundShoot.volume = 0.7;
            ig.game.player = this;

            this.EnemySpawner = ig.game.spawnEntity(EntityActorEnemySpawner, this.pos.x + 500, null);
            
            // Creates a new slow timer for slowMo
            this.myTimeSlower = new TimeSlower();
        },
        
        /******************************************
        * Draw
        ******************************************/
        draw: function () {
            this.parent();
            this.drawBulletTimeText();
        },

        /******************************************
        * Update
        ******************************************/
        update: function () {
            if (this.currentAnim.loopCount > 0) {
                this.currentAnim = this.anims.idle;
            }
            this.handleDesktopInput();
            this.parent();
            this.collisionDetection();
            this.spawnCompanion();

            if (ig.input.pressed('slowTime') && this.bulletTimeTimer == null ||
                this.bSlowingTime && this.bulletTimeTimer == null) {
                ig.game.slowTime();
            }
            this.myTimeSlower.update();
        },

        /******************************************
        * Collision Detection
        * Keep player within screen bounds
        ******************************************/
        collisionDetection: function () {
            if (this.pos.x < 0) {
                this.pos.x = 0;
            } else if (this.pos.x > ig.system.width) {
                this.pos.x = ig.system.width;
            }
            if (this.pos.y < 0) {
                this.pos.y = 0;
            } else if (this.pos.y > ig.system.height) {
                this.pos.y = ig.system.height;
            }
        },

        /******************************************
        * Spawn Companion
        ******************************************/
        spawnCompanion: function () {
            if (ig.input.pressed('spawnCompanion')) {
                if (EntityCompanion.prototype.currentCompanions < EntityCompanion.prototype.maxCompanions &&
                    this.compSpawnTimer.delta() > this.compRespawnDelay) {
                    ig.game.spawnEntity(EntityCompanion, this.pos.x + 6, this.pos.y - 9);
                    this.compSpawnTimer.reset();
                }
            }
        },

        /******************************************
        * Handle Desktop Input
        ******************************************/
        handleDesktopInput: function () {
            if (ig.input.state('left')) {
                this.vel.x = -this.speed;
            } else if (ig.input.state('right')) {
                this.vel.x = this.speed;
            } else {
                this.vel.x = 0;
            }
            if (ig.input.state('up')) {
                this.vel.y = -this.speed;
            } else if (ig.input.state('down')) {
                this.vel.y = this.speed;
            } else {
                this.vel.y = 0;
            }
            var isShooting = ig.input.state('shoot');
            if (isShooting && this.lastShootTimer.delta() > 0) {
                this.shoot();
                this.lastShootTimer.set(0.05);
            }
            if (isShooting && !this.wasShooting) {
                this.wasShooting = true;
                this.soundShoot.play();
                if (!this.soundShoot.currentClip.iloop) {
                    this.soundShoot.currentClip.iloop = true;
                    this.soundShoot.currentClip.addEventListener('ended', (function () {
                        this.currentTime = 0;
                        this.play();
                    }).bind(this.soundShoot.currentClip), false);
                }
            } else if (this.wasShooting && !isShooting) {
                this.soundShoot.stop();
                this.wasShooting = false;
            }
        },

        /******************************************
        * Shoot
        ******************************************/
        shoot: function () {
            this.currentAnim = this.anims.shoot.rewind();
            var angle = -Math.PI / 2 + Math.random() * 0.03 - 0.01;
            ig.game.spawnEntity(EntityPlayerBullet, this.pos.x - 1, this.pos.y - 1, {
                angle: angle
            });
        },
        
        /*******************************************
         * drawBulletTimeText
        ******************************************/
        drawBulletTimeText: function () {
            if (this.bulletTimeTimer) {
                var d2 = -this.bulletTimeTimer.delta();
                var a2 = d2 > 1.7 ? d2.map(2, 1.7, 0, 1) : (d2 < 1 ? d2 : 1);
                var xs2 = ig.system.width / 2;
                var ys2 = ig.system.height / 3 + (d2 < 1 ? Math.cos(1 - d2).map(1, 0, 0, 250) : 0);
                this.font.alpha = Math.max(a2, 0);
                this.font.draw('Bullet Time!', xs2, ys2, ig.Font.ALIGN.CENTER);
                this.font.alpha = 1;
                if (d2 < 0) {
                    this.bulletTimeTimer = null;
                }
            }
        },

        /*******************************************
        * Kill
        ********************************************/
        kill: function () {
            ig.game.spawnEntity(EntityExplosionParticleGrey, this.pos.x, this.pos.y, {
                count: 20,
            });
            this.parent();
            for (var i = 0; ig.game.companions.length; i++)
                ig.game.companions[i].kill();
        }
    });
});
