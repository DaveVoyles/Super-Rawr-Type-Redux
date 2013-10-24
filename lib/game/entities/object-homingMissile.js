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
            vel:            { x: 100, y:   0 },
            maxVel:         { x: 250, y: 200 },
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
            },
            getTargets: function() {
                targets = [],   minDistance = 1000;
                targets = ig.game.getEntitiesByType(EntityBaseEnemy);

                for (var i = 0, len = targets.length; i < len; i++){
                    if (targets[i] != EntityActorEnemySpawner){
                        var target  = targets[i];
                    }
                    if (minDistance > this.distanceTo(target)){
                        this.nearestTarget = target;
                    }
                    else if (this.nearestTarget === null){ return }
                }

                var angle   = this.angleTo( this.nearestTarget );


                this.vel.x  = Math.cos( angle ) * this.speed;
                this.vel.y  = Math.sin( angle ) * this.speed;
                this.currentAnim.angle += (angle - this.currentAnim.angle) * this.turnFactor;
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