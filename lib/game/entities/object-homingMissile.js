/*********************************************************************
 *  @object-homingMissile.js
 *  @version:   1.00
 *  @author:    Dave Voyles
 *  @date:      June 2013
 *  @copyright: (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @desc:      Shoots from player and companion ships
 *********************************************************************/
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
            speed:          3900,
            offset:         { x:  25, y:  10 },
            size:           { x:  25, y:  12 },
            vel:            { x: 350, y:   0 },
            maxVel:         { x: 300, y: 300 },
            bulletCount:    1,
            turnFactor:     0.02,
            randomFactor:   0.02,
            targetArr:      [],
            targ:           null,
            type:           ig.Entity.TYPE.C,
            checkAgainst:   ig.Entity.TYPE.B,
            collides:       ig.Entity.COLLIDES.NEVER,

            //TODO: Create with 0 params and add to object pool
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
                this.getTargets();
                },
            getTargets: function() {
                targets = [],   minDistance = 1000, nearestTarget = null;
                targets = ig.game.getEntitiesByType(EntityBaseEnemy);

                for (var i = 0, len = targets.length; i < len; i++){
                    var target  = targets[i];
                    if (minDistance > this.distanceTo(target)){
                        nearestTarget = target;
                    }
                }
                if (nearestTarget === null){ return }

                var angle   = this.angleTo( nearestTarget ) * this.randomFactor;
                this.vel.x  = Math.cos( angle ) * this.speed;
                this.vel.y  = Math.sin( angle ) * this.speed;

                this.currentAnim.angle += (angle - this.currentAnim.angle);
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