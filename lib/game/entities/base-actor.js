/**
 *  @base-actor.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *
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
    weapon:             0,
    invincibleDelay:    2,
    healthMax:          10,
    health:             10,
    equipment:          [],
            
    // Sound Effects
    Explode01_sfx:      new ig.Sound('media/sfx/Explode01.ogg'),
    Explode01_sfx:      new ig.Sound('media/sfx/Explode01.mp3'),
    Explode01_sfx:      new ig.Sound('media/sfx/Explode01.*'  ),
            
    Hit01_sfx:          new ig.Sound('media/SFX/Hit01.ogg'    ),
    Hit01_sfx:          new ig.Sound('media/SFX/Hit01.mp3'    ),
    Hit01_sfx:          new ig.Sound('media/SFX/Hit01.*'      ),
            
    Hit03_sfx:          new ig.Sound('media/SFX/Hit03.ogg'    ),
    Hit03_sfx:          new ig.Sound('media/SFX/Hit03.mp3'    ),
    Hit03_sfx:          new ig.Sound('media/SFX/Hit03.*'      ),
            
    Respawn_sfx:        new ig.Sound('media/SFX/Respawn.ogg'  ),
    Respawn_sfx:        new ig.Sound('media/SFX/Respawn.mp3'  ),
    Respawn_sfx:        new ig.Sound('media/SFX/Respawn.*'    ),
            
    init:function (x, y, settings) {
        this.parent(x, y, settings);
        this.startPosition = {
            x: x,
            y: y
        };
        
        // Volume controls for SFX
        this.Hit01_sfx.volume     = 0.7;
        this.Hit03_sfx.volume     = 0.7;
        this.Respawn_sfx.volume   = 0.7;
        this.Explode01_sfx.volume = 0.5;
    },

    collideWith:function (other, axis) {

        // check for crushing damage from a moving platform (or any FIXED entity)
        if (other.collides == ig.Entity.COLLIDES.FIXED && this.touches(other)) {
            // we're still overlapping, but by how much?
            var overlap;
            var size;
            if (axis == 'y') {
                size = this.size.y;
                if (this.pos.y < other.pos.y) overlap = this.pos.y + this.size.y - other.pos.y;
                else overlap = this.pos.y - (other.pos.y + other.size.y);
            } else {
                size = this.size.x;
                if (this.pos.x < other.pos.x) overlap = this.pos.x + this.size.x - other.pos.x;
                else overlap = this.pos.x - (other.pos.x + other.size.x);
            }
            overlap = Math.abs(overlap);

            // overlapping by more than 1/2 of our size?
            if (overlap > 3) {
                // we're being crushed - this is damage per-frame, so not 100% the same at different frame rates
                this.kill();
            }
        }
    },
    equip:function (target) {
        this.equipment.push(target);
    },
    draw:function () {

        // Exit draw call if the entity is not visible
        if (!this.visible)
            return;

        this.parent();
    },
    
    /******************************************
    * randomFromTo -- Utility math function
    ******************************************/
    randomFromTo: function (from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    },
});
});