/**************************************************************************
 *  @developersScreen.js
 *
 *  @author:    Dave Voyles
 *  @date:      Oct 2013
 *  @copyright: (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @desc:      Draws credits screen
 ***************************************************************************/
ig.module(
        'game.UI.developersScreen'
    )
    .requires(
        'impact.entity',
        'impact.sound'
    )
    .defines(function () {

        EntityDevelopersScreen = ig.Entity.extend({

            screenImage:      new ig.Image('media/ui/developersScreen.png'),
            name:             'Developers Screen',
            isMarkedForDeath: false,
            finishTimer:      null,
            hasFocus:         true,

            init: function(x,y,settings){
                this.parent(x,y,settings);
                this.tween( {pos: {x: 120}}, 2, {easing: ig.Tween.Easing.Quartic.EaseOut}).start();
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
                    this.hasFocus = false;
                }
            },
            // Creates a timer that kills the screen once it expires
            createFinishTimerAndKill: function(){
                // If a timer doesn't exist, create one
                if (this.finishTimer === null){
                    this.finishTimer = new ig.Timer(2);
                }
                // Once timer expires, kill this entity. Allow enough time for the entity
                // to get off screen completely, before killing
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