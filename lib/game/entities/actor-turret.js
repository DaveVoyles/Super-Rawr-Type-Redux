/***********************************************************************
 *  @actor-companion.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Mini ship to fight alongside the player
 ***********************************************************************/
ig.module(
    'game.entities.actor-turret'
)
    .requires(
    'game.entities.base-player',
    'game.entities.object-turretBullet' 
)
.defines(function () {
    EntityTurret = ig.Entity.extend({

    animSheet:     new ig.AnimationSheet('media/textures/actor-playerShip.png', 24, 24),
    font:          new ig.Font('media/fonts/xfinFont.png'                              ),
    size:          { x:   2, y:   2 },
    offset:        { x:  11, y:  11 },
    friction:      { x: 800, y: 800 },
    maxVel:        { x: 300, y: 300 },
    angle:         -Math.PI / 2,
    speed:         200,
    health:        9000,
    respawnDelay:  2,
    shootSpeed:    0.03,
    rotation:      1.4,
    lifeTime:      7,   
    lifeTimer:     null,
    type:          ig.Entity.TYPE.B,
    checkAgainst:  ig.Entity.TYPE.A,

    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.addAnim('idle', 60, [0]);
        this.addAnim('shoot', 0.05, [3, 2, 1, 0], true);
        this.lastShootTimer = new ig.Timer(0);
        this.lifeTimer      = new ig.Timer(this.lifeTime);
        SoundSource.miniShipSpawn.play();
        ig.game.turrets.current--;
    },
    update: function () {
        if (this.currentAnim.loopCount > 0) {
            this.currentAnim = this.anims.idle;
        }
        this.parent();
        this.collisionDetection();
        this.checkShoot();

        if ((0 | (ig.Timer.time * 1.5)) & 1) {
            this.currentAnim.angle -= this.rotation * ig.system.tick;
        } else {
            this.currentAnim.angle += this.rotation * ig.system.tick;
        }
        if (this.lifeTimer.delta() > 0) {
            this.kill();
        }
    },
    // TODO: FINISH THIS
    /* Draws health bar
        *****************/
    //draw: function () {
    //    this.parent();
    //    if (this.textTimer && ig.game.bulletTime.current < ig.game.bulletTime.max) {
    //        this.font.draw('Bullet Time!', this.pos.x + 22, this.pos.y - 20, ig.Font.ALIGN.CENTER);
    //        if (this.textTimer.delta() > 0) {
    //            this.textTimer = null;
    //        }
    //    }
    //},

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
    checkShoot: function () {
        var isShooting = true;
        if (isShooting && this.lastShootTimer.delta() > 0) {
            this.shoot();
            this.lastShootTimer.set(this.shootSpeed);
        }
    },
    shoot: function () {
        this.currentAnim = this.anims.shoot.rewind();
        ig.game.spawnEntity(EntityTurretBullet, this.pos.x - 1, this.pos.y - 1, {
            angle: this.currentAnim.angle
        });
    },
    kill: function () {
        ig.game.turrets.current--;
             	    var x = this.pos.x + (this.size.x >> 1 );
	        var y = this.pos.y + (this.size.y >> 1 );

        ig.game.fragmentSpawner.spawn(x,y,FragmentSpawner.grey ,  80 , this.size.x, 2);
    	   ig.game.fragmentSpawner.spawn(x,y,FragmentSpawner.red , 80 , this.size.x, 2);

        SoundSource.miniShipKill.play();
        this.parent();
    }
});
});
