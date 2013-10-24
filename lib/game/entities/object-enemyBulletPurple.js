/************************************************************************
 *  @object-enemyBulletPurple.js
 *
 *  @author:    Dave Voyles
 *  @date:      June 2013
 *  @copyright: (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @desc:      Straight bullet used to fire at angles.
 ***********************************************************************/

ig.module(
        'game.entities.object-enemyBulletPurple'
    )
    .requires(
        'game.entities.base-enemyBullet'
    )
    .defines(function () {
        window.EntityObjectEnemyBulletPurple = EntityBaseEnemyBullet.extend({


            image:          new ig.Image('media/textures/plasma_b.png'),
            speed:          250,
            speedModifier:  2.5,
            size:           { x:  6, y:  2 },
            offset:         { x: 46, y: 46 },

            update: function () {
                this.parent();
                this.vel.x = Math.cos(this.angle) * this.speed;
                this.vel.y = Math.sin(this.angle) * this.speed;

                this.pos.x += this.vel.x * ig.system.tick;
                this.pos.y += this.vel.y * ig.system.tick;
            }
        });
    });