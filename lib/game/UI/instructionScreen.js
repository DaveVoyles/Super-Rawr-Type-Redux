/**************************************************************************
 *  @instructionScreen.js
 *
 *  @author:    Dave Voyles
 *  @date:      Oct 2013
 *  @copyright: (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Desc:      Draws instruction screen text
 ***************************************************************************/
ig.module(
        'game.UI.instructionScreen'
    )
    .requires(
        'impact.entity',
        'impact.sound'
    )
    .defines(function () {

        EntityInstructionScreen = ig.Entity.extend({

            screenImage: new ig.Image('media/ui/instructionsScreen.png'),
            name:        'Instructions Screen',

            init: function(x,y,settings){
                this.parent(x,y,settings);
                this.tween( {pos: {x: 120}}, 3, {easing: ig.Tween.Easing.Quartic.EaseOut}).start();
            },
            draw: function(){
                this.parent();

                var xPos     = this.pos.x + 0;
                var yPos     = this.pos.y + 0;

                this.screenImage.draw(xPos, yPos);

            }
        });
    });