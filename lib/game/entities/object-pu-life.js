/*************************************************************************
 *  @object-pu-life.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: August 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Adds 1 life to player when picked up
 **************************************************************************/
ig.module(
    'game.entities.object-pu-life'
)
    .requires(
        'impact.entity',
        'impact.sound',
        'game.entities.actor-player'
    )
    .defines(function (){

        EntityObjectPulife = ig.Entity.extend({

            animSheet:  new ig.AnimationSheet('media/ui/Ship-Lifebar-PU', 28, 28),
            size:         { x:   28, y: 28 },
            vel:          { x: -30,  y:  0 },
            health:       100000,
            speed:        -75,
            type:         ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.A,
            collides:     ig.Entity.COLLIDES.PASSIVE,

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('idle', .1, [0, 1, 2, 1]);
            },
            update: function () {
                this.parent();

                // Grabs player
                this.player = ig.game.player;

                // Kills object if past certain bounds of screen
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
                    this.font.draw('Extra Ship!', this.pos.x + 22, this.pos.y - 20, ig.Font.ALIGN.CENTER);
                } else {
                    return;
                }
            },
            check: function (other) {
                other.receiveDamage(0, this);
                if (ig.game.stats.lives < ig.game.stats.maxLives) {
                    ig.game.stats.lives++;
                    window._SoundManager.pickup.play();
                    ig.game.player.pu_Life_TextTimer = new ig.Timer(2);
                }                
                this.kill();
            }
        });
    });