/**
 *  @playerInfo.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: Oct 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Desc: HUD entity for right side of screen
 */
ig.module(
        'game.UI.PlayerInfoRight'
    )
    .requires(
        'impact.entity',
        'impact.sound'
    )
    .defines(function () {

        PlayerInfoRight = ig.Entity.extend({

            font:             new ig.Font ('media/fonts/04b03_16.font.png'                  ),
            transTextBG_Lg:   new ig.Image('media/ui/transTextBG_Lg.png'                    ),
            hudOffsetY:       20,

            init: function(x,y,settings){
                this.parent(x,y,settings);
                this.tween( {pos: {x: ig.system.width - 160}}, 2, {easing: ig.Tween.Easing.Quartic.EaseOut}).start();
            },
            draw: function(){
                this.parent();

                var xPos            = this.pos.x;
                var yPos            = this.pos.y + this.hudOffsetY;
                var killsUntillBoss = -ig.game.stats.kills + ig.game.bossSpawnKills;

                // Draws transparent background behind text
                this.transTextBG_Lg.draw( xPos - 9,  yPos - 13);

                // Draws score
                this.font.draw("Current Score", xPos + 6, yPos - 4);
                this.font.draw(ig.game.stats.kills * 100, xPos + 6, yPos + 10);

                // Draw kills until boss
                this.font.draw("Kills untill boss", xPos + 6, this.hudOffsetY + 29);
                this.font.draw(killsUntillBoss, xPos + 6, yPos+ 43);
            }
        });
    });