/**************************************************************************
 *  @warningText.js
 *  @version:   1.00
 *  @author:    Dave Voyles
 *  @date:      Oct 2013
 *  @copyright: (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Desc:      Flashing 'Warning' across the screen before the boss approaches
 ***************************************************************************/
ig.module(
        'game.UI.warningText'
    )
    .requires(
        'impact.entity',
        'impact.sound'
    )
    .defines(function () {

        WarningText = ig.Entity.extend({

            animSheet:       new ig.AnimationSheet('media/ui/Warning.png', 537, 87),

            init: function(x,y,settings){
                this.parent(x,y,settings);
                this.addAnim('idle', 0.2, [0,1,2,3,4,5,6], true);
                this.tween( {pos: {x: ig.system.width /2}}, 2, {easing: ig.Tween.Easing.Quartic.EaseOut}).start();
            },
            draw: function(){
                this.parent();

                this.pos.x +=  ig.system.width / 2;
                this.pos.y +=  ig.system.height /2;
            }
        });
    });