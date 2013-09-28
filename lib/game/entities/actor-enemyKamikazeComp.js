/**
 *  @actor-enemyKamikazeComp.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Flies alongside Kamikaze
 */
ig.module(
	'game.entities.actor-enemyKamikazeComp'
)
.requires(
    'game.entities.base-enemy',
	'game.entities.actor-enemySpinShip'
)
.defines(function () {

    EntityActorEnemyKamikazeComp = EntityBaseEnemy.extend({
        /******************************************
        * Property Definitions
        ******************************************/
        animSheet:      new ig.AnimationSheet('media/textures/actor-enemyKamikaze.png', 38, 48),
        size: {
            x: 30,
            y: 30
        },
        offset: {
            x: +2,
            y: +4
        },
        friction: {
            x: 150,
            y: 0
        },
        health:         7,

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('fly', 0.1, [0, 1, 2, 3, 4, 5, 6, 7]);
            
            this.gun = ig.game.spawnEntity(EntityActorEnemySpinShip, this.pos.x + 30, this.pos.y + 20);
            this.gun = ig.game.spawnEntity(EntityActorEnemySpinShip, this.pos.x + 30, this.pos.y - 20);
        },
        update: function () {
            this.parent();
            this.vel.x = this.kamikazeVelocity;

            // Move toward player slowly
            if (this.distanceTo(this.player) < 500) {
                var angle = this.angleTo(this.player);
                var angleX = Math.cos(angle);
                var angleY = Math.sin(angle);

                this.vel.x = angleX * -this.kamikazeSpeed;
                this.vel.y = angleY * -this.kamikazeSpeed;
            }
            // Zoom toward player when close
            if (this.distanceTo(this.player) < 300) {
                this.vel.x = this.vel.x * this.speedModifier;
            }
            if (this.pos.x + 3 < this.player.pos.x) {
                this.vel.x = this.kamikazeSpeed;
            }
        },
        receiveDamage: function (value, from) {
	        this.parent(value, from);
	        if (this.health > 1) {
            ig.game.spawnEntity(EntityExplosionParticleGrey, this.pos.x, this.pos.y, {
                count: this.particleKillCount,
            });
	        }
        },    
    });
});
