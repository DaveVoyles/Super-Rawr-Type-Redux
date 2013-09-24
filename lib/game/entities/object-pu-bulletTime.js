/**
 *  @object-pu-bulletTime.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Pickup for slow mo. Adds 1 to player's pool
 */
ig.module(
    'game.entities.object-pu-bulletTime'
)
    .requires(
        'impact.entity',
        'impact.sound'
)
.defines(function () {

    EntityObjectPickupBulletTime = ig.Entity.extend({
            
    /*******************************************
    * Property Definitions
    *******************************************/
    animSheet:           new ig.AnimationSheet('media/textures/pu_BulletTime.png', 42, 41),
    pickup_sfx:          new ig.Sound('media/SFX/PickupBulletTime.ogg'                   ),
    pickup_sfx:          new ig.Sound('media/SFX/PickupBulletTime.mp3'                   ),
    pickup_sfx:          new ig.Sound('media/SFX/PickupBulletTime.*'                     ),
    font:                new ig.Font('media/fonts/xfinfont.png'                          ),
    size: {
        x: 17,
        y: 17
    },
    vel: {
        x: -75,
        y: 0
    },
    health:             100000,
    speed: -75,
    type:               ig.Entity.TYPE.B,
    checkAgainst:       ig.Entity.TYPE.A,
    collides:           ig.Entity.COLLIDES.PASSIVE,

    /******************************************
    * Initialization
    * Sets up anim sequences
    ******************************************/
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.addAnim('idle', .1, [0]);
    },

    /******************************************
    * Update
    ******************************************/
    update: function () {
        this.parent();

        if (this.pos.x > ig.system.width  + 50 ||
            this.pos.y > ig.system.height + 50 ||
            this.pos.x < -50 ||
            this.pos.y < -50) {
                this.kill();
        }
        if ((0 | (ig.Timer.time * .3)) & 1) {
            this.vel.y = 65;
        } else {
            this.vel.y = -65;
        }
    },

    /******************************************
    * drawst text above pickup at 1 sec intervals
    ******************************************/
    draw: function(){
        this.parent();
        if ((0 | (ig.Timer.time * 1.5)) & 1){ 
            this.font.draw('Bullet Time!', this.pos.x + 22, this.pos.y - 20, ig.Font.ALIGN.CENTER);
        } else {
            return;
        }
    },

    /******************************************
    * Checks for collision
    ******************************************/
    check: function (other) {
        other.receiveDamage(0, this);
        if (ig.game.bulletTime.current < ig.game.bulletTime.max) {
            ig.game.bulletTime.current++;
            this.pickup_sfx.play();
            ig.game.player.pu_BT_TextTimer = new ig.Timer(3);
        }
        this.kill();
    },

});
});