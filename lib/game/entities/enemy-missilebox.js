ig.module('game.entities.enemy-missilebox').requires('game.entities.enemy',  'game.entities.enemy-bullet').defines(function () {
    "use strict";
    window.EntityEnemyMissilebox = EntityEnemy.extend({
        size: {
            x: 44,
            y: 44
        },
        offset: {
            x: 2,
            y: 2
        },
        image: new ig.Image('media/textures/particlesRed.png'),
        health: 120,
        bullets: 6,
        reloadTime: 3,
        increase: 0,
        ab: 0,
        init: function (x, y, settings) {
            this.parent(x, y - 18, settings);
            this.moveTimer = new ig.Timer();
            this.angle = Math.PI / 2;
            this.startAngle = this.ownAngle;
            this.shootTimer = new ig.Timer(Math.random() * this.reloadTime * 2);
            this.ab = settings || this.ab;
            this.increase = settings || this.increase;
        },
        update: function (settings) {
            this.parent(this.ab, this.increase);
            if (this.shootTimer.delta() > 0) {
                var inc = increase/ (this.bullets - 1);
                console.log(this.increase);
                var a = ab + (this.angle - Math.PI / 2) * 180 / Math.PI;
                var radius = 5;     // Distance from point it leaves ship
                for (var i = 0; i < this.bullets; i++) {
                    var angle = a * Math.PI / 180;
                    var x = this.pos.x + 20 + Math.cos(angle) * radius;
                    var y = this.pos.y + 20 + Math.sin(angle) * radius;
                    ig.game.spawnEntity(EntityEnemyBullet, x, y, {
                        angle: angle
                    });
                    a += inc;
                }
                this.shootTimer.set(this.reloadTime);
            }
        }
    });
});