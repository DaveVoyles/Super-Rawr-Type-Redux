/**
 *  @base-player.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Base class for all allies 
 */
ig.module(
    'game.entities.base-player',
    'game.entities.object-playerBullet',
    'game.entities.object-enemyBulletsRound'
)
    .requires(
    'game.entities.base-actor'
)
    .defines(function () {

        EntityBasePlayer = EntityBaseActor.extend({

            type:           ig.Entity.TYPE.A,
            checkAgainst:   ig.Entity.TYPE.B,
            collides:       ig.Entity.COLLIDES.PASSIVE,          
        });
    });
