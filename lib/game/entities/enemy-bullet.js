  
    ig.module(
    'game.entities.enemy-bullet'
    )
    .requires(
    'game.entities.enemy'
    )
    .defines(function () {
        "use strict";
    window.EntityEnemyBullet = EntityEnemy.extend({
        size: {
            x: 16,
            y: 16
        },
        offset: {
            x: 2,
            y: 4
        },
        image: new ig.Image('media/textures/particlesGreen.png'),
        killTimerTime: 0,
        speed: 170,
    });
});