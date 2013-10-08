/***********************************************************************
 *  @object-pu-miniship.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Spawns a companionship at the player
 ***********************************************************************/
ig.module(
    'game.entities.object-pu-miniship'
)
    .requires(
        'impact.entity',
        'impact.sound',
        'game.entities.actor-player'
    )
    .defines(function () {

        EntityObjectPuMiniShip = ig.Entity.extend({

            animSheet:     new ig.AnimationSheet('media/textures/PickupMiniShip.png', 34, 35),
            font:          new ig.Font('media/fonts/xfinFont.png'                           ),
            size:          { x:  17, y: 17 },
            vel:           { x: -60, y:  0 },
            health:        100000,
            speed:         -75,
            type:          ig.Entity.TYPE.C,
            checkAgainst:  ig.Entity.TYPE.A,
            collides:      ig.Entity.COLLIDES.PASSIVE,

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('idle', .1, [0]);
            },
            update: function () {
                this.parent();
                this.player = ig.game.player; 

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
            draw: function () {
                this.parent();
                if ((0 | (ig.Timer.time * 1.5)) & 1) {
                    this.font.draw('Mini-ship!', this.pos.x + 16, this.pos.y - 28, ig.Font.ALIGN.CENTER);
                } else {
                    return
                }
            },
            check: function (other) {
                other.receiveDamage(0, this);
                if (ig.game.companions.current < ig.game.companions.max) {
                    ig.game.spawnEntity(EntityCompanion, ig.game.player.pos.x, ig.game.player.y);
                }
                this.kill();
            }
        });
    });