/**
 *  @actor-enemyKamikaze.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Targets player when close, locks into position on Y axis, then quickly zooms in
 */
ig.module(
	'game.entities.actor-enemyKamikaze'
)
.requires(
    'game.entities.base-enemy'
)
.defines(function () {

    EntityActorEnemyKamikaze = EntityBaseEnemy.extend({

        animSheet: new ig.AnimationSheet('media/textures/actor-enemyKamikaze.png#f9ff49', 38, 48),
        size:     { x:  30, y: 30 },
        offset:   { x:  +2, y: +4 },
        friction: { x: 150, y:  0 },
        health: 5,
        speedModifier:   2.8,
        xModifier:       -70,

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('fly', 0.1, [0, 1, 2, 3, 4, 5, 6, 7]);
            this.tween( {pos: {x: 900}}, 2.5, {easing: ig.Tween.Easing.Sinusoidal.EaseOut}).start();
        },
        update: function () {
            this.parent();
            this.vel.x = this.kamikazeVelocity + this.xModifier;
        
            // Move toward player slowly
            if (this.distanceTo(this.player) < 500) {
                var angle = this.angleToCorr(this.player);
                var angleX = Math.cos(angle);
                var angleY = Math.sin(angle);

                this.vel.x = angleX * -this.kamikazeSpeed;
                this.vel.y = angleY * -this.kamikazeSpeed;
            }
            // Zoom toward player when close
            if (this.distanceTo(this.player) < 300) {
                this.vel.x = this.vel.x * this.speedModifier;
            }
            if (this.pos.x +3 < this.player.pos.x){
                this.vel.x = this.kamikazeSpeed;
            }
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
