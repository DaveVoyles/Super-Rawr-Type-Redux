/**
 *  @bobject-playerBullet.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Shoots from player and companion ships
 */
ig.module(
    'game.entities.object-playerBullet'
)
.requires(
    'impact.entity',
    'impact.sound'
)
    .defines(function () {
        window.EntityPlayerBullet = ig.Entity.extend({
            image: new ig.Image('media/textures/plasma.png'),
            speed: {
                x: 1500,
                y: 900
            },
            size: {
                x: 6,
                y: 2
            },
            offset: {
                x: 46,
                y: 46
            },
            friction:{
                x: 0,
                y: 10
            },
            type: ig.Entity.TYPE.C,
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.PASSIVE,

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.vel.x = this.speed.x;
                this.vel.y = Math.sin(this.angle *2) * this.speed.y;
            },

            draw: function () {
                ig.system.context.save();
                ig.system.context.translate(this.pos.x - ig.game._rscreen.x, this.pos.y - ig.game._rscreen.y);
                ig.system.context.drawImage(this.image.data, -this.offset.x, -this.offset.y);
                ig.system.context.restore();
            },

            update: function () {
                this.parent();
                this.pos.x += this.vel.x * ig.system.tick *2;
                this.pos.y += this.vel.y * ig.system.tick /2;
                if (this.pos.x > ig.system.width + 50  ||
                    this.pos.y > ig.system.height + 50 ||
                    this.pos.x < -50 || this.pos.y < -50)
                {
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