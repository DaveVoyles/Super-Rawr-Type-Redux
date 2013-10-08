/************************************************************************
 *  @object-turretBullet.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Shoots from turret ships
 *  @Desc: The difference between this and player bullet is the rotation!
 ***********************************************************************/
ig.module(
    'game.entities.object-turretBullet'
)
.requires(
    'impact.entity',
    'impact.sound'
)
.defines(function () {
    EntityTurretBullet = ig.Entity.extend({
        image:         new ig.Image('media/textures/plasma_g.png'),
        speed:         { x: 5800, y: 1000 },
        size:          { x:    8, y:    6 },
        offset:        { x:   20, y:   16 },
        friction:      { x:    0, y:   15 },
        speedModifier: 5,
        type:          ig.Entity.TYPE.C,
        checkAgainst:  ig.Entity.TYPE.B,
        collides:      ig.Entity.COLLIDES.PASSIVE,

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            var noArgs = (arguments.length == 0);
            this.vel.x = Math.cos(this.angle) * this.speed.x;
            this.vel.y = Math.sin(this.angle) * this.speed.y;
        },
        draw: function () {
            ig.system.context.save();
            ig.system.context.translate(this.pos.x - ig.game._rscreen.x, this.pos.y - ig.game._rscreen.y);
            ig.system.context.rotate(this.angle);
            ig.system.context.drawImage(this.image.data, -this.offset.x, -this.offset.y);
            ig.system.context.restore();
        },
        update: function () {
            this.parent();
            this.pos.x += this.vel.x * ig.system.tick * this.speedModifier;
            this.pos.y += this.vel.y * ig.system.tick / 2;
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