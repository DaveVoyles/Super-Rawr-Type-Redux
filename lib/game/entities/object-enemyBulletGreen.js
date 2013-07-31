/**
*  @object-enemyBulletGreen.js
*  @version: 1.00
*  @author: Dave Voyles
*  @date: June 2013
*  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
*  @5 shot bullet pattern
*/
    ig.module(
    'game.entities.object-enemyBulletGreen'
    )
    .requires(
    'game.entities.base-enemyBullet'
    )
    .defines(function () {
    "use strict";
    window.EntityObjectEnemyBulletGreen = EntityBaseEnemyBullet.extend({
    size: {
        x: 16,
        y: 16
    },
    offset: {
        x: 2,
        y: 4
    },
    image:      new ig.Image('media/textures/particlesGreen.png'),
    speed:      120,

    update: function () {
        this.vel.x = Math.cos(this.angle) * this.speed;
        this.vel.y = Math.sin(this.angle) * this.speed;
        
        this.pos.x += this.vel.x * ig.system.tick;
        this.pos.y += this.vel.y * ig.system.tick;
        this.parent();
    }, 
});
});