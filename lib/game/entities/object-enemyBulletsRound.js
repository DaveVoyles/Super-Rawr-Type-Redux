/**
 *  @particles.js
 *  @version: 1.00
 *  @author: Dominick Szablewski
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 */
ig.module(
    'game.entities.object-enemyBulletsRound'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {
        "use strict";

        window.EntityObjectEnemyBulletsRound = ig.Class.extend({
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.NEVER,
            _vel: null,
            _pos: null,
            angle: -Math.PI / 2,
            image: null,
            lifetime: 5,
            fadetime: 0.2,
            alpha: .2,
            count: 10,
            rotationSpeed: .10,
            vel: {
                x: 20,
                y: 0
            },
            size: {
                x: 1,
                y: 1
            },
            loopCount: 7,
            init: function (x, y, settings) {
                this.count = settings.count || this.count;

          //      x -= this.image.width / 2;
           //     y -= this.image.height / 2;
         //       this._vel = this._vel;
            //    this._pos = this._pos;
                this._pos =  150;
                //this._pos = y;
             //   this._angle = this.angle;
               
                this.idleTimer = new ig.Timer();
            },
            update: function () {
                if (this.idleTimer.delta() > this.lifetime) {
                    ig.game.removeEntity(this);
                    return;
                }
                this.angle += this.rotationSpeed;
              //  this.alpha = this.idleTimer.delta().map(this.lifetime - this.fadetime, this.lifetime, 1, 0);
            },
            draw: function () {
                var p = this._pos,
                    v = this._vel,
                    t = ig.system.tick,
                    ctx = ig.system.context,
                    img = this.image.data,
                    sx = ig.game._rscreen.x,
                    sy = ig.game._rscreen.y;
                    p += v * t;
                ctx.drawImage(img, p + sx, p + sy);
            }
        });

        /************************************
        * Particle classes for various colors
        ************************************/
        window.EntityObjectEnemyBulletsRoundBlue = EntityObjectEnemyBulletsRound.extend({
            vel: {
                x: 20,
                y: 20
            },
            image: new ig.Image('media/textures/particlesBlue.png'),
        });

        window.EntityObjectEnemyBulletsRoundYellow = EntityObjectEnemyBulletsRound.extend({
            vel: {
                x: 220,
                y: 330
            },
            image: new ig.Image('media/textures/particlesYellow.png'),
        });

        window.EntityObjectEnemyBulletsRoundRed = EntityObjectEnemyBulletsRound.extend({
            vel: {
                x: 260,
                y: 260
            },
            image: new ig.Image('media/textures/particlesRed.png'),
        });

        window.EntityObjectEnemyBulletsRoundGreen = EntityObjectEnemyBulletsRound.extend({
            vel: {
                x: 260,
                y: 260
            },
            image: new ig.Image('media/textures/particlesGreen.png'),
        });

        window.EntityObjectEnemyBulletsRoundGrey = EntityObjectEnemyBulletsRound.extend({
            vel: {
                x: 260,
                y: 260
            },
            image: new ig.Image('media/textures/particlesGrey.png'),
        });
    });