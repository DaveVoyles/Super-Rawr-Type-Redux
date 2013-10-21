/**
 *  @object-playerBullet.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Shoots from player and companion ships
 */
ig.module(
        'game.entities.object-homingMissile'
    )
    .requires(
        'impact.entity',
        'impact.sound'
    )
    .defines(function () {
        EntityHomingMissile = ig.Entity.extend({
            animSheet:       new ig.AnimationSheet('media/textures/plasma_g.png', 66, 35),
            image:          new ig.Image('media/textures/plasma_g.png'),
            speed:          500,
            offset:         { x: 25, y: 10 },
            size:           { x: 25, y: 12 },
            bulletCount:    1,
            turnFactor:     0.7,
            type:           ig.Entity.TYPE.C,
            checkAgainst:   ig.Entity.TYPE.B,
            collides:       ig.Entity.COLLIDES.NEVER,

            init: function (x, y, settings) {
                var noArgs = (arguments.length == 0);
                this.parent(x, y, settings);
                this.addAnim('idle', 0.5, [0]);
                this.bulletCount = (settings && settings.bulletCount) ?
                settings.bulletCount : 0;
            },
            update: function () {
                this.parent();
                this.killIfOffScreen();
                // Ninja star effect
//              this.currentAnim.angle += angle;
                // Swimming sperm effect
//                this.vel.x  += Math.cos( angle ) * this.speed;
//                this.vel.y  += Math.sin( angle ) * this.speed;

                var target  = this.getNewTarget();
//                var target  = ig.game.getEntitiesByType(EntityBaseEnemy)[0];
                var angle   = this.angleTo( target );
                this.vel.x  = Math.cos( angle ) * this.speed;
                this.vel.y  = Math.sin( angle ) * this.speed;

                // set current angle to diff b/t angle and current angle.
                // Slow turning speed by turnFactor
                this.currentAnim.angle += (angle - this.currentAnim.angle) * this.turnFactor;
            },
            getNewTarget: function(){
                var newTarget = ig.game.getEntitiesByType(EntityBaseEnemy)[0];
                if (newTarget === 
                return newTarget;
            },
            killIfOffScreen: function(){
                if (this.pos.x > ig.system.width + 50  ||
                    this.pos.y > ig.system.height + 50 ||
                    this.pos.x < -50 || this.pos.y < -50) {
                    this.kill();
                }
            },
            check: function (other) {
                if (other instanceof EntityBaseEnemy) {
                    other.receiveDamage(1, this);
                    this.kill();
                }
            }
        });
    });