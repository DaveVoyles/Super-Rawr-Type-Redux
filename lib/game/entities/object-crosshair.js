/**
 *  @object-crosshair.js
 *  @version: 1.00
 *  @author: Dominick Szablewski
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *
 */
ig.module(
    'game.entities.object-crosshair'
)
    .requires(
    'impact.entity'
)
    .defines(function () {

        EntityObjectCrosshair = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/textures/crosshair.png', 18, 18),
        size: {
            x: 2,
            y: 2
        },
        offset: {
            x: 8,
            y: 8
        },
        type: ig.Entity.TYPE.NONE,
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 60, [0]);
        },
        update: function () {
            this.pos.x = ig.input.mouse.x;
            this.pos.y = ig.input.mouse.y;
            this.currentAnim.angle -= 3 * ig.system.tick;
        }
    });
});