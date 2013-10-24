/************************************************************************
 *  @base-player.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Base class for all allies 
 ***********************************************************************/
ig.module(
    'game.entities.base-player'

)
    .requires(
        'impact.entity',
        'game.entities.object-homingMissile'
)
.defines(function () {

EntityBasePlayer = ig.Entity.extend({

    type:               ig.Entity.TYPE.A,
    checkAgainst:       ig.Entity.TYPE.B,
    collides:           ig.Entity.COLLIDES.PASSIVE,
    invincible:         false,
    shootTime:          0.035,
    compRespawnDelay:   2,
    turretRespawnDelay: 1,

    init: function (x, y, settings) {
        this.parent(x, y, settings);
    },

    /* Briefly keeps player invincible after respawning */
    receiveDamage: function (value, from) {
        if (this.invincible || !this.visible) {
            return;
        }
        this.parent(value, from);
    },
    spawnCompanion: function () {
        if (ig.input.pressed(Bindings.spawnCompanion)) {
            if (ig.game.companions.current < ig.game.companions.max &&
                this.compSpawnTimer.delta() > this.compRespawnDelay) {
                ig.game.spawnEntity(EntityCompanion, this.pos.x + 6, this.pos.y - 9);
                this.compSpawnTimer.reset();
            }
        }
    },
    spawnTurret: function () {
        if (ig.input.pressed(Bindings.spawnTurret)) {
            if (ig.game.turrets.current > 0 && this.turretSpawnTimer.delta() > this.turretRespawnDelay) {
                ig.game.spawnEntity(EntityTurret, this.pos.x + 6, this.pos.y - 9);
                this.turretSpawnTimer.reset();
            }
        }
    },
    makeInvincible: function () {
        this.invincible = true;
        this.invincibleTimer.reset();
    },
    drawBulletTimeText: function () {
        if (this.bulletTimeTimer) {
            var d2 = -this.bulletTimeTimer.delta();
            var a2 = d2 > 1.7 ? d2.map(2, 1.7, 0, 1) : (d2 < 1 ? d2 : 1);
            var xs2 = ig.system.width / 2;
            var ys2 = ig.system.height / 3 + (d2 < 1 ? Math.cos(1 - d2).map(1, 0, 0, 250) : 0);
            this.font.alpha = Math.max(a2, 0);
            this.font.draw('Bullet Time!', xs2, ys2, ig.Font.ALIGN.CENTER);
            this.font.alpha = 1;
            this.bCanBulletTime = false;
            if (d2 < 0) {
                this.bulletTimeTimer = null;
            }
        }
    },
    drawBossText: function () {
        if (this.bossTextTimer) {
            var d2 = -this.bossTextTimer.delta();
            var a2 = d2 > 4.7 ? d2.map(2, 4.7, 0, 1) : (d2 < 1 ? d2 : 1);
            var xs2 = ig.system.width / 2;
            var ys2 = ig.system.height / 3 + (d2 < 1 ? Math.cos(1 - d2).map(1, 0, 0, 250) : 0);
            this.font.alpha = Math.max(a2, 0);
            this.font.draw('WARNING! Boss Approaching!', xs2, ys2 + 30, ig.Font.ALIGN.CENTER);
            this.font.alpha = 1;
            if (d2 < 0) {
                this.bossTextTimer = null;
            }
        }
    },
    drawUI: function () {
        if (this.livesRemainingTimer) {
            var d2 = -this.livesRemainingTimer.delta();
            var a2 = d2 > 2.7 ? d2.map(2, 2.7, 0, 1) : (d2 < 1 ? d2 : 1);
            var xs2 = ig.system.width / 2;
            var ys2 = ig.system.height / 3 + (d2 < 1 ? Math.cos(1 - d2).map(1, 0, 0, 250) : 0);
            this.font.alpha = Math.max(a2, 0);
            if (ig.game.stats.lives > 1) {
                this.font.draw(ig.game.stats.lives + ' Ships Remaining', xs2, ys2, ig.Font.ALIGN.CENTER);
            } else {
                this.font.draw(ig.game.stats.lives + ' Ship Remaining',  xs2, ys2, ig.Font.ALIGN.CENTER);
            }
            this.font.alpha = 1;
            if (d2 < 0) {
                this.livesRemainingTimer = null;
            }
        }
    },
    /* Keep player within screen bounds */
    collisionDetection: function () {
        if (this.pos.x < 0) {
            this.pos.x = 0;
        } else if (this.pos.x > ig.system.width) {
            this.pos.x = ig.system.width;
        }
        if (this.pos.y <= 10) {
            this.pos.y = +10;
        } else if (this.pos.y >= ig.system.height -15) {
            this.pos.y = ig.system.height -15;
        }
    },
    handleDesktopInput: function () {
        if (ig.input.state(Bindings.left)) {
            this.vel.x = -this.speed;
        } else if (ig.input.state(Bindings.right)) {
            this.vel.x = this.speed;
        } else {
            this.vel.x = 0;
        }
        
        if (ig.input.state(Bindings.up)) {
            this.vel.y = -this.speed;
        } else if (ig.input.state(Bindings.down)) {
            this.vel.y = this.speed;
        } else {
            this.vel.y = 0;
        }
        
  // std ig.input 
  //      	var isShooting = ig.input.state(Bindings.shoot);
   //         if (isShooting && this.lastShootTimer.delta() > 0) {
   //             this.shoot();
   //             this.lastShootTimer.set(0.1);
   //         }

       var isShooting = ig.input.pressed(Bindings.shoot);
        if (isShooting) {
            this.shoot();
        }
        if (ig.input.pressed(Bindings.slowTime)) {
            ig.game.slowTime();
        }
        if (ig.input.pressed(Bindings.shootMissile)){
            this.shootMissile();
        }
    },
    shootMissile:function(){
        if (ig.game.missiles.current > 0){
            ig.game.spawnEntity((EntityHomingMissile), this.pos.x, this.pos.y);
            SoundSource.missileLaunch.play();
        }
    }
});
});
