/**
 *  @object-enemyBullet.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Standard bullet used by enemy ships -- fires straight. 
 */

ig.module(
    'game.entities.object-enemyBulletBlue'
)
    .requires(
    'game.entities.base-enemyBullet'
)
    .defines(function () {
        window.EntityObjectEnemyBulletBlue = EntityBaseEnemyBullet.extend({
            
    image:          new ig.Image('media/textures/plasma.png#6b95ff'),
    speed:          600,
    speedModifier:  2.5,
    size: {
        x: 6,
        y: 2
    },
    offset: {
        x: 46,
        y: 46
    },       
    
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.vel.x = -this.speed;
    },
    update: function () {
        this.pos.x += this.vel.x * this.speedModifier * ig.system.tick;
        this.pos.y += this.vel.y * this.speedModifier * ig.system.tick;
        this.parent();
    },
});
});