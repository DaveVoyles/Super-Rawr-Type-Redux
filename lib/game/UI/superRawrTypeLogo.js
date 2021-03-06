/**************************************************************************
 *  @superRawrTypeLogo.js
 *
 *  @author:    Dave Voyles
 *  @date:      Oct 2013
 *  @copyright: (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @desc:      Draws logo
 ***************************************************************************/
ig.module(
        'game.UI.superRawrTypeLogo'
    )
    .requires(
        'impact.entity',
        'impact.sound'
    )
    .defines(function () {

        EntitySuperRawrTypeLogo = ig.Entity.extend({

            screenImage:      new ig.Image('media/ui/Super-Rawr-Type-Redux-Logo.png'),
            name:             'Logo',
            isMarkedForDeath: false,
            finishTimer:      null,
            hasFocus:         true,
            timeTillDeath:    1.2,

            init: function(x,y,settings){
                this.parent(x,y,settings);
                this.tween( {pos: {x: ig.system.width / 2 - 210, y: 130}}, 2, {easing: ig.Tween.Easing.Quartic.EaseOut}).start();
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
                // Remove this screen when the instructions or credits screen comes in
                if (ig.game.mode === window.RType.MODE.INSTRUCTIONS_SCREEN){
                    this.createFinishTimerAndKill();
                }
            },
            // Creates a timer that kills the screen once it expires
            createFinishTimerAndKill: function(){
                // If a timer doesn't exist, create one
                if (this.finishTimer === null){
                    this.finishTimer = new ig.Timer(this.timeTillDeath);
                    this.tweenOut();
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