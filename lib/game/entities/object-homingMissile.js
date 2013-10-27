/*********************************************************************
 *  @object-homingMissile.js
 *
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
            speed:          200,
            offset:         { x:  25, y:  10 },
            size:           { x:  25, y:  12 },
            vel:            { x: 200, y:   0 },
            maxVel:         { x: 9999, y: 9999 },
            bulletCount:    1,
            turnFactor:     0.04,
            dmg:            3,
            nearestTarget:  null,
            type:           ig.Entity.TYPE.C,
            checkAgainst:   ig.Entity.TYPE.B,
            collides:       ig.Entity.COLLIDES.NEVER,

            init: function (x, y, settings) {
                var noArgs = (arguments.length == 0);
                this.parent(x, y, settings);
                this.addAnim('idle', 0.5, [0]);
                this.bulletCount = (settings && settings.bulletCount) ?
                settings.bulletCount : 0;
                ig.game.missiles.current--;
            },
            draw: function(){
                this.parent();
                this.drawDebugLines();
            },
            drawDebugLines: function(){
                var ctx         = ig.system.context;
                ctx.beginPath();
                ctx.strokeStyle = 'yellow';
                ctx.moveTo(this.pos.x,               this.pos.y);
                ctx.lineTo(this.nearestTarget.pos.x, this.nearestTarget.pos.y);
                ctx.stroke();
                ctx.closePath();
            },
            update: function () {
                this.parent();
                this.killIfOffScreen();
                this.getTargets();
                this.modifyVelocity();
            },
            getTargets: function() {
               var targets               = ig.game.getEntitiesByType(EntityBaseEnemy);
               var minDistanceFoundSoFar = 9999;
               this.nearestTarget        = null;

                for (var i = 0, len = targets.length; i < len; i++){
                    // Ignores the enemySpawner, who is off screen
                    if (targets[i] === EntityActorEnemySpawner){
                        continue;  // Go back to for, then continue on
                    }

                    var target  = targets[i];

                    if (this.distanceTo(target) < minDistanceFoundSoFar){
                        // if current target is nearest, then set and go after it
                        minDistanceFoundSoFar = this.distanceTo(target);
                        // maintaining best value thus far
                        this.nearestTarget = target;
                    }
                }
            },
            modifyVelocity: function(){

                // If we have no target, maintain current vector
                if(this.nearestTarget === null){
                    return;
                }

                var desiredAngle   = this.angleToCorr( this.nearestTarget );
                var currentAngle   = this.getVelAngle();
                var angleDiff      = this.getAngleDifference(desiredAngle, currentAngle);

                this.vel.x  = Math.cos( desiredAngle ) * this.speed;
                this.vel.y  = Math.sin( desiredAngle ) * this.speed;

                this.currentAnim.angle = desiredAngle;
            },
            getVelAngle: function(){
               var angle = Math.atan2( this.vel.y, this.vel.x);
               return angle;
            },

            // Returns quickest way to get from one direction to the next, and which dir (- or +)
            getAngleDifference: function(targetAngle, currentAngle){
                // Result of this is an angle of 0 - 360 degrees
                var rem = (targetAngle - currentAngle) % 2*Math.PI;

                // Result of this is an assurance that it is between -180 & 180
                if (rem > Math.PI) {
                    rem -= 2*Math.PI;
                }
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
                    other.receiveDamage(this.dmg, this);
                    this.spawnParticles();
                    this.kill();
                }
            },
            spawnParticles: function () {
                var x = this.pos.x + (this.size.x >> 1 );
                var y = this.pos.y + (this.size.y >> 1 );
                ig.game.fragmentSpawner.spawn(x, y, FragmentSpawner.grey ,   this.particleCnt , this.size.x);
                ig.game.fragmentSpawner.spawn(x, y, FragmentSpawner.green ,  this.particleCnt , this.size.x);
            }
        });
    });