/**
 *  @object-pickupBuletTime.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Pickup for slow mo 
 */
ig.module(
    'game.entities.object-pickupBulletTime'
)
    .requires(
        'impact.entity',
        'impact.sound'
)
.defines(function () {

    EntityObjectPickupBulletTime = ig.Entity.extend({
            
    /*******************************************
    * Property Definitions
    ******************************************/
    animSheet:          new ig.AnimationSheet('media/textures/pu_BulletTime.png', 17, 17),
    size: {
        x: 17,
        y: 17
    },
    maxVel: {
        x: 100,
        y: 100
    },
    friction: {
        x: 150,
        y: 0
    },
    health:             100000,
    speed:              -75,
    currentBulletTime:  2,
    maxBulletTime:      3,
    type:               ig.Entity.TYPE.C,
    checkAgainst:       ig.Entity.TYPE.A,
    collides:           ig.Entity.COLLIDES.PASSIVE,

    // SFX
    PickupBuletTime01_sfx: new ig.Sound('media/SFX/PickupBulletTime.ogg'),
    PickupBuletTime01_sfx: new ig.Sound('media/SFX/PickupBulletTime.mp3'),
    PickupBuletTime01_sfx: new ig.Sound('media/SFX/PickupBulletTime.*'),

    /******************************************
    * Initialization
    * Sets up anim sequences
    ******************************************/
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        // Add animations
        this.addAnim('idle', .1, [0]);
    },

    /******************************************
    * Update
    ******************************************/
    update: function () {
        this.parent();

        // Kills object if past certain bounds of screen
        if (this.pos.x > ig.system.width + 50  ||
            this.pos.y > ig.system.height + 50 ||
            this.pos.x < -50 ||
            this.pos.y < -50) {
                this.kill();
        }
    },

    /******************************************
    *Checks for collision 
    ******************************************/
    check: function (other) {
        other.receiveDamage(0, this);
        if (EntityObjectPickupBulletTime.prototype.currentBulletTime < EntityObjectPickupBulletTime.prototype.maxBulletTime) {
            EntityObjectPickupBulletTime.prototype.currentBulletTime++;
            this.PickupBuletTime01_sfx.play();
            console.log(EntityObjectPickupBulletTime.prototype.currentBulletTime);
        }
        this.kill();
    },
});
});