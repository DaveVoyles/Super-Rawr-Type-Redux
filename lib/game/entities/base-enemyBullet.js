/**
 *  @base-enemyBullet.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Abstract classs used to extend all enemy bullets from
 */
ig.module(
    'game.entities.base-enemyBullet'
)
.requires(
    'impact.entity',
    'impact.sound'
)
    .defines(function() {
    window.EntityBaseEnemyBullet = ig.Entity.extend({
        type:                      ig.Entity.TYPE.C,
        checkAgainst:              ig.Entity.TYPE.A,
        collides:                  ig.Entity.COLLIDES.PASSIVE,
            
    draw: function () {
        ig.system.context.save();
        ig.system.context.translate(this.pos.x - ig.game._rscreen.x, this.pos.y - ig.game._rscreen.y);
        ig.system.context.drawImage(this.image.data, -this.offset.x, -this.offset.y);
        ig.system.context.restore();
    },

    update: function () {
        this.parent();             
        if (this.pos.x > ig.system.width + 50  ||
            this.pos.y > ig.system.height + 50 ||
            this.pos.x < -50 || this.pos.y < -50){
                this.kill();
        }
    },
        
    check: function (other) {
    if (other instanceof EntityActorPlayer) {
        other.receiveDamage(1, this);
        this.kill();
    }
}
});
});