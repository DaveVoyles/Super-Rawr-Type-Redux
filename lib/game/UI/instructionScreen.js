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

            screenImage:      new ig.Image('media/ui/instructionsScreen.png'),
            name:             'Instructions Screen',
            isMarkedForDeath: false,
            finishTimer:      null,

            init: function(x,y,settings){
                this.parent(x,y,settings);
                this.tween( {pos: {x: 120}}, 3, {easing: ig.Tween.Easing.Quartic.EaseOut}).start();
                console.log(this.isMarkedForDeath);
            },
            draw: function(){
                this.parent();

                var xPos     = this.pos.x + 0;
                var yPos     = this.pos.y + 0;

                this.screenImage.draw(xPos, yPos);

            },
            update: function(){
                this.parent();
                if (this.isMarkedForDeath === true){
                    this.tweenOut();
                    this.createFinishTimerAndKill();
                }
            },
            // Creates a timer that kills the screen once it expires
            createFinishTimerAndKill: function(){
                if (this.finishTimer === null){
                    this.finishTimer = new ig.Timer(3);
                }
                if (this.finishTimer && this.finishTimer.delta() > 0){
                    this.kill();
                }
            },
            // Tweens entity off the screen
            tweenOut: function(){
                this.tween( {pos: {x: -1500}}, 3, {
                    easing: ig.Tween.Easing.Quartic.EaseOut
                }).start();
            }
        });
    });