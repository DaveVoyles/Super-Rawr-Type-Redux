/**
 *  @playerInfo.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: Oct 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Desc: HUD entity for left side of screen
 */
ig.module(
        'game.UI.PlayerInfoLeft'
    )
    .requires(
        'impact.entity',
        'impact.sound'
    )
    .defines(function () {

    PlayerInfoLeft = ig.Entity.extend({

            font:             new ig.Font ('media/fonts/04b03_16.font.png'                  ),
            lifeSprite:       new ig.Image('media/ui/ship_lifebar.png'                      ),
            transTextBG_left: new ig.Image('media/ui/transTextBG_Lg1.png'                   ),
            bulletTimeSprite: new ig.Image('media/ui/BulletTimeDisplayBar1.png'             ),
            hudOffsetX:       20,
            hudOffsetY:       20,

            init: function(x,y,settings){
                this.parent(x,y,settings);
                this.tween( {pos: {x: 40}}, 2, {easing: ig.Tween.Easing.Quartic.EaseOut}).start();
            },
            draw: function(){
                this.parent();

                var xPos = this.pos.x + this.hudOffsetX;
                var yPos = this.pos.y + this.hudOffsetY;

                // Draws transparent background behind text
                this.transTextBG_left.draw(xPos -9, yPos -13);

                // Draws lifebar
                this.font.draw("Lives", this.pos.x + this.hudOffsetX + 8, yPos- 6);
                for (var i = 0; i < ig.game.stats.lives; i++){
                    this.lifeSprite.draw(((this.lifeSprite.width + 1) * i) + xPos + 6, yPos+ 10);
                }

                // Draws bullet time bar
                this.font.draw("Bullet Time", xPos + 8, this.hudOffsetY + 26);
                for (var i = 0; i < ig.game.bulletTime.current; i++){
                    this.bulletTimeSprite.draw(((this.bulletTimeSprite.width + 4) * i) + xPos + 9, yPos+ 44);
                }

                // Draws turrets
                this.font.draw("Turrets", xPos + 8, this.hudOffsetY + 58);
                for (var i = 0; i < ig.game.turrets.current; i++){
                    this.bulletTimeSprite.draw(((this.bulletTimeSprite.width + 4) * i) + xPos + 9, yPos + 74);
                }
            }
        });
    });