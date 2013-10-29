/*************************************************************************
 *  @base-enemyBullet.js
 *
 *  @author:    Dave Voyles
 *  @date:      June 2013
 *  @copyright: (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @desc:      Abstract classs used to extend all enemy bullets from
 *************************************************************************/
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
        rotation:                  1,
        rotationSpeed:             12,
        lifeTime:                  4,

        init: function(x, y, settings){
            this.parent(x,y,settings);
            this.lifeTimer = new ig.Timer(this.lifeTime);
        },
        draw: function () {
            var ctx = ig.system.context;
            ctx.save();
            ctx.translate(
                ig.system.getDrawPos(this.pos.x+this.size.x/2 ),
                ig.system.getDrawPos(this.pos.y+this.size.y/2)
            );
            ctx.drawImage(this.image.data, -this.size.x/2, - this.size.y/2);
            ctx.restore();
        },

    update: function () {
        this.parent();             
        if (this.pos.x > ig.system.width  + 50 ||
            this.pos.y > ig.system.height + 50 ||
            this.pos.x < -50 || this.pos.y < -50){
                this.kill();
        }
        this.killWhenLifeTimerExpires();
    },
        
    check: function (other) {
        if (other instanceof EntityActorPlayer) {
            other.receiveDamage(1, this);
            this.kill();
        }
    },
    killWhenLifeTimerExpires: function(){
        if (this.lifeTimer && this.lifeTimer.delta() > 0)
            this.kill();
    }
});
});