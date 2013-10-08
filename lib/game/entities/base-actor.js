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

         
    init:function (x, y, settings) {
        this.parent(x, y, settings);
        this.startPosition        = { x: x,  y: y };
    },

    equip:function (target) {
        this.equipment.push(target);
    },
    randomFromTo: function (from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }
});
});