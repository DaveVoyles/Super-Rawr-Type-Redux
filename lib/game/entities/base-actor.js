/**
 *  @base-actor.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Abstract class to base all actors from
 */
ig.module(
    'game.entities.base-actor'
)
.requires(
'impact.entity',
'impact.sound',
'game.entities.object-particles',
'plugins.imageblender'
)
.defines(function () {

EntityBaseActor = ig.Entity.extend({
            
    activeWeapon:       "none",
    visible:            true,
    startPosition:      null,
    markedForDeath:     false,
    invincible:         false,
    ignorePause: 		false,
    weapon:             0,
    invincibleDelay:    2,
    healthMax:          10,
    health:             10,
    equipment:          [],

    Explode01_sfx:      new ig.Sound('media/sfx/Explode01.*'       ),
    Hit01_sfx:          new ig.Sound('media/SFX/Hit01.*'           ),
    Hit03_sfx:          new ig.Sound('media/SFX/Hit03.*'           ),         
         
    init:function (x, y, settings) {
        this.parent(x, y, settings);
        this.startPosition        = { x: x,  y: y };
        this.Hit01_sfx.volume     = 0.3;
        this.Hit03_sfx.volume     = 0.3;
        this.Explode01_sfx.volume = 0.2;
    },

    equip:function (target) {
        this.equipment.push(target);
    },
    /******************************************
    * randomFromTo -- Utility math function
    ******************************************/
    randomFromTo: function (from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    },
});
});