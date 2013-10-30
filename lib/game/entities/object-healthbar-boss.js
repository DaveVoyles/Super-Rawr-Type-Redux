/**********************************************************************************
 *  @object-healthbar.js
 *
 *  @author: SnakePlissken - http://probableprogrammer.com/html5/health-bar-entity/
 *  @date:   August 2013
 *  @desc:   Draws a healthbar for the boss entity
 *********************************************************************************/
ig.module(
    'game.entities.object-healthbar-boss'
)
.requires(
    'impact.game',
    'impact.entity'
)
.defines(function () {

    EntityHealthBarBoss = ig.Entity.extend({

        // Health Bar Size
        size: { x: 58, y: 352 },

        // Health Bar Animation Sheet
        animSheet: new ig.AnimationSheet('media/textures/health-bar.png', 58, 352),

        // Pass In Unit enity to this variable
        Unit: 0,

        // Add Animations for every 10 percent health lost
        // set zIndex to make sure its in front
        init: function (x, y, settings) {

            this.addAnim('Full',      1, [0]) ;
            this.addAnim('Ninety',    1, [1]) ;
            this.addAnim('Eighty',    1, [2]) ;
            this.addAnim('Seventy',   1, [3]) ;
            this.addAnim('Sixty',     1, [4]) ;
            this.addAnim('Fifty',     1, [5]) ;
            this.addAnim('Fourty',    1, [6]) ;
            this.addAnim('Thirty',    1, [7]) ;
            this.addAnim('Twenty',    1, [8]) ;
            this.addAnim('Ten',       1, [9]) ;
            this.addAnim('NearDeath', 1, [10]);

            this.parent(x, y, settings);
            this.zIndex = 6;
            this.tween( {pos: {x: ig.system.width - 96, y: 96}}, 2, {easing: ig.Tween.Easing.Quartic.EaseOut}).start();
        },

        update: function () {
            this.parent();

            //Checks the Health Values
            // MaxHealth was created in the Entity and set to its initial health
            if (this.Unit.health == this.Unit.MaxHealth) {
                this.currentAnim = this.anims.Full;
            }
                // Unit below max not below 90%
            else if (this.Unit.health >= (this.Unit.MaxHealth * .9)
                && this.Unit.health < this.Unit.MaxHealth) {
                this.currentAnim = this.anims.Ninety;
            }
                // Unit below 90% not below 80%
            else if (this.Unit.health >= (this.Unit.MaxHealth * .8)
                && this.Unit.health < (this.Unit.MaxHealth * .9)) {
                this.currentAnim = this.anims.Eighty;
            }
                // Unit Below 80% not below 70%
            else if (this.Unit.health >= (this.Unit.MaxHealth * .7)
                && this.Unit.health < (this.Unit.MaxHealth * .8)) {
                this.currentAnim = this.anims.Seventy;
            }
                // Unit Below 70% not below 60%
            else if (this.Unit.health >= (this.Unit.MaxHealth * .6)
                && this.Unit.health < (this.Unit.MaxHealth * .7)) {
                this.currentAnim = this.anims.Sixty;
            }
                // Unit Below 60% not below 50%
            else if (this.Unit.health >= (this.Unit.MaxHealth * .5)
                && this.Unit.health < (this.Unit.MaxHealth * .6)) {
                this.currentAnim = this.anims.Fifty;
            }
                // Unit Below 50% not below 40%
            else if (this.Unit.health >= (this.Unit.MaxHealth * .4)
                && this.Unit.health < (this.Unit.MaxHealth * .5)) {
                this.currentAnim = this.anims.Fourty;
            }
                // Unit Below 40% not below 30%
            else if (this.Unit.health >= (this.Unit.MaxHealth * .3)
                && this.Unit.health < (this.Unit.MaxHealth * .4)) {
                this.currentAnim = this.anims.Thirty;
            }
                // Unit Below 30% not below 20%
            else if (this.Unit.health >= (this.Unit.MaxHealth * .2)
                && this.Unit.health < (this.Unit.MaxHealth * .3)) {
                this.currentAnim = this.anims.Twenty;
            }
                // Unit Below 20% not below 10%
            else if (this.Unit.health >= (this.Unit.MaxHealth * .1)
                && this.Unit.health < (this.Unit.MaxHealth * .2)) {
                this.currentAnim = this.anims.Ten;
            }
                // Unit Below 10% not DEAD
            else if (this.Unit.health > 0
                && this.Unit.health < (this.Unit.MaxHealth * .1)) {
                this.currentAnim = this.anims.NearDeath;
            }
            else if (this.Unit.health <= 0) {
                this.kill();
            }
        }
    });
});