/**
 *  @particles.js
 *  @version: 1.00
 *  @author: Dominick Szablewski
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 */
ig.module(
    'game.entities.object-particles'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {
        "use strict";

        window.EntityObjectParticles = ig.Class.extend({
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.NEVER,
            _vel: null,
            _pos: null,
            image: null,
            lifetime: 1,
            fadetime: 0.2,
            alpha: .2,
            count: 10,
            vel: {
                x: 0,
                y: 0
            },
            size: {
                x: 1,
                y: 1
            },
            init: function (x, y, settings) {
                this.count = settings.count || this.count;
                var l = this.count * 2;
                x -= this.image.width / 2;
                y -= this.image.height / 2;
                this._vel = Array(l);
                this._pos = Array(l);
                for (var i = 0; i < l; i += 2) {
                    this._vel[i] = (Math.random() * 2 - 1) * this.vel.x;
                    this._vel[i + 1] = (Math.random() * 2 - 1) * this.vel.y;
                    this._pos[i] = x;
                    this._pos[i + 1] = y;
                }
                this.idleTimer = new ig.Timer();
            },
            update: function () {
                if (this.idleTimer.delta() > this.lifetime) {
                    ig.game.removeEntity(this);
                    return;
                }
                this.alpha = this.idleTimer.delta().map(this.lifetime - this.fadetime, this.lifetime, 1, 0);
            },
            draw: function () {
                var l = this.count * 2;
                var p = this._pos,
                    v = this._vel,
                    t = ig.system.tick,
                    ctx = ig.system.context,
                    img = this.image.data,
                    sx = ig.game._rscreen.x,
                    sy = ig.game._rscreen.y;
                //   ig.system.context.globalAlpha = this.alpha;
                for (var i = 0; i < l; i += 2) {
                    p[i] += v[i] * t;
                    p[i + 1] += v[i + 1] * t;
                    ctx.drawImage(img, p[i] + sx, p[i + 1] + sy);
                }
            }
        });

        /************************************
        * Particle classes for various colors
        ************************************/
        window.EntityExplosionParticleBlue = EntityObjectParticles.extend({
            vel: {
                x: 340,
                y: 200
            },
            image: new ig.Image('media/textures/particlesBlue.png'),
        });

        window.EntityExplosionParticleYellow = EntityObjectParticles.extend({
            vel: {
                x: 220,
                y: 330
            },
            image: new ig.Image('media/textures/particlesYellow.png'),
        });

        window.EntityExplosionParticleRed = EntityObjectParticles.extend({
            vel: {
                x: 260,
                y: 260
            },
            image: new ig.Image('media/textures/particlesRed.png'),
        });

        window.EntityExplosionParticleGreen = EntityObjectParticles.extend({
            vel: {
                x: 260,
                y: 260
            },
            image: new ig.Image('media/textures/particlesGreen.png'),
        });

        window.EntityExplosionParticleGrey = EntityObjectParticles.extend({
            vel: {
                x: 260,
                y: 260
            },
            image: new ig.Image('media/textures/particlesGrey.png'),
        });
    });