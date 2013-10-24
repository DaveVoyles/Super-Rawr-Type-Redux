/***********************************************************************
*  @object-enemyBulletGreen.js
*
*  @author:    Dave Voyles
*  @date:      June 2013
*  @copyright: (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
*  @desc:      Neon bullets, slightly offset rotation
***********************************************************************/
    ig.module(
        'game.entities.object-enemyBulletGreen'
    )
    .requires(
        'game.entities.base-enemyBullet'
    )
    .defines(function () {
          "use strict";
    window.EntityObjectEnemyBulletGreen = EntityBaseEnemyBullet.extend({

    size:          { x: 20, y: 20 },
    image:         new ig.Image('media/textures/neon_bullet_b.png'),
    speed:         120,
    rotation:      1,
    rotationSpeed: 12,

    draw: function(){
        var ctx = ig.system.context;
        ctx.save();
        ctx.translate(
            ig.system.getDrawPos(this.pos.x+this.size.x/2 ),
            ig.system.getDrawPos(this.pos.y+this.size.y/2)
        );
        ctx.rotate(this.rotation);
        ctx.drawImage(this.image.data, -this.size.x/2, - this.size.y/2);
        ctx.restore();
    },

    update: function () {
        this.parent();
        this.vel.x = Math.cos(this.angle) * this.speed;
        this.vel.y = Math.sin(this.angle) * this.speed;
        
        this.pos.x += this.vel.x * ig.system.tick;
        this.pos.y += this.vel.y * ig.system.tick;
        this.rotation += this.rotationSpeed * ig.system.tick;
    }
});
});