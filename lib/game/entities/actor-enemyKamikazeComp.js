/*************************************************************************
 *  @actor-enemyKamikazeComp.js
 *
 *  @author:    Dave Voyles
 *  @date:      June 2013
 *  @copyright: (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @desc:      Kamikaze which spawns 2 additional ships alongside it
 **************************************************************************/
ig.module(
	'game.entities.actor-enemyKamikazeComp'
)
.requires(
    'game.entities.base-enemy',
	'game.entities.actor-enemySpinShip'
)
.defines(function () {

    EntityActorEnemyKamikazeComp = EntityBaseEnemy.extend({
        animSheet: new ig.AnimationSheet('media/textures/actor-enemyKamikaze-lg.png#f9ff49', 63.3, 50),
        size:            { x:  30, y:  30 },
        offset:          { x: +16, y: +14 },
        friction:        { x: 150, y:   0 },
        health:          7,
        speedModifier:   2.5,
        xModifier:       -60,

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('fly', 0.1, [0, 1, 2, 3, 4, 5, 6, 7]);
            
            this.gun = ig.game.spawnEntity(EntityActorEnemySpinShip, this.pos.x - 80, this.pos.y + 80);
            this.gun = ig.game.spawnEntity(EntityActorEnemySpinShip, this.pos.x - 80, this.pos.y - 80);
        },
        update: function () {
            this.parent();
            this.vel.x = this.kamikazeVelocity;

            this.slowMoveToPlayer();
            this.zoomToPlayer();
        },
        zoomToPlayer: function(){
            // Zoom toward player when close
            if (this.distanceTo(this.player) < 300) {
                this.vel.x = this.vel.x * this.speedModifier;
            }
            if (this.pos.x + 3 < this.player.pos.x) {
                this.vel.x = this.kamikazeSpeed;
            }
        },
        slowMoveToPlayer: function(){
            // Move toward player slowly
            if (this.distanceTo(this.player) < 500) {
                var angle = this.angleToCorr(this.player);
                var angleX = Math.cos(angle);
                var angleY = Math.sin(angle);

                this.vel.x = angleX * -this.kamikazeSpeed;
                this.vel.y = angleY * -this.kamikazeSpeed;
            }
        },
        receiveDamage: function (value, from) {
	        this.parent(value, from);
	        if (this.health > 1) {
               var x = this.pos.x + (this.size.x >> 1 );
               var y = this.pos.y + (this.size.y >> 1 );
        	   ig.game.fragmentSpawner.spawn(x,y,FragmentSpawner.grey ,  this.particleKillCount , this.size.x);
	 	    }
        }
    });
});
