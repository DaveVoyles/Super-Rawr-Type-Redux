/**
 *  @actor-companion.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Mini ship to fight alongside the player
 */
ig.module(
    'game.entities.actor-companion'
)
    .requires(
    'game.entities.base-player',
    'game.entities.object-playerBullet'
)
.defines(function () {
    EntityCompanion = EntityBasePlayer.extend({

        animSheet:      new ig.AnimationSheet('media/textures/actor-playerShip.png', 24, 24),
        size:     { x:  2, y:    2 },
        offset:   { x: 11, y:   11 },
        friction: { x: 800, y: 800 },
        maxVel:   { x: 300, y: 300 },
        angle:             -Math.PI / 2,
        speed:             200,
        health:            9000,
        respawnDelay:      2,
        rotationSpeed:     0.10,
        type:              ig.Entity.TYPE.B,
        checkAgainst:      ig.Entity.TYPE.A,

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 60, [0]);
            this.addAnim('shoot', 0.05, [3, 2, 1, 0], true);
            this.lastShootTimer = new ig.Timer(0);
            window._SoundManager.miniShipSpawn.play();
            ig.game.companions.current++;
        },
        update: function () {
            if (this.currentAnim.loopCount > 0) {
                this.currentAnim = this.anims.idle;
            }
            this.parent();
            this.collisionDetection();
            this.handleDesktopInput();
            // Get player
            this.parental = ig.game.player;

            // Set position based on parental (player) position
            x = (this.parental.pos.x + this.parental.size.x / 2) + Math.cos(this.angle) * 70;
            y = (this.parental.pos.y + this.parental.size.y / 2) + Math.sin(this.angle) * 70;

            // Rotate around player
            this.pos.x = x;
            this.pos.y = y;
            this.angle += this.rotationSpeed;
        },
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
        handleDesktopInput: function () {
            var isShooting = ig.input.state('shoot');
            if (isShooting && this.lastShootTimer.delta() > 0) {
                this.shoot();
                this.lastShootTimer.set(0.1);
            }
        },
        shoot: function () {
            this.currentAnim = this.anims.shoot.rewind();
            var angle        = -Math.PI / 2 + Math.random() * 0.03 - 0.01;
            ig.game.spawnEntity(EntityPlayerBullet, this.pos.x - 1, this.pos.y - 1, {
                angle: angle
            });
        },
        kill: function () {
            ig.game.companions.current--;
            ig.game.spawnEntity(EntityExplosionParticleGrey, this.pos.x, this.pos.y, {
                count: 50
            });
            ig.game.spawnEntity(EntityExplosionParticleRed, this.pos.x, this.pos.y, {
                count: 50
            });
            window._SoundManager.miniShipKill.play();
            this.parent();
        }
    });
});
