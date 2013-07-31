/**
 *  @actor-enemySpawner.js
 *  @version: 1.00
 *  @author: Dave Voyles
 *  @date: June 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Spawns enemies off screen
 */
ig.module(
    'game.entities.actor-enemySpawner'
)
    .requires(
    'game.entities.base-enemy',
	'game.entities.actor-enemyKamikaze',
    'game.entities.actor-enemyKamikazeComp',
    'game.entities.actor-enemyOrb'
    )
    .defines(function() {
        EntityActorEnemySpawner = EntityBaseEnemy.extend({
            
    /****************************************** 
    * Property Definitions
    ******************************************/
    animSheet:       new ig.AnimationSheet('media/textures/pu_BulletTime.png', 18, 17),
    startPosition:   null,
    invincible:      true,
    spawnTimer:      null,
    spawnTimerGrpA:  null,
    spawnTimerGrpB:  null,
    spawnTimerGrpC:  null,
    health:          90000,
    size: {
        x: 1,
        y: 1
    },

    /******************************************
    * Handles initialization
    ******************************************/

    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.addAnim('idle', 60, [0]);

        // Spawning timers for enemy ships
        this.spawnTimerGrpA = new ig.Timer(this.randomFromTo(3, 9));
        
        //this.spawnTimerGrpB = new ig.Timer(this.randomFromTo(3, 7));
        this.spawnTimerGrpB = new ig.Timer(this.randomFromTo(1, 4));
        this.spawnTimerGrpC = new ig.Timer(this.randomFromTo(4, 9));
    },

    /******************************************
    * update
    * Handles initialization
    ******************************************/
    update: function () {
        this.parent = ig.game.player;
        
        // Set position based on parent (player) position and in middle of screen
        this.pos.x = this.parent.pos.x + 500;
        this.pos.y = ig.system.height / 2;

        // If we haven't reached our max entities cap...
        if (ig.game.currentEntities < ig.game.maxEntites) {
            // Spawn enemies of Group A
            if (this.spawnTimerGrpA.delta() > 0) {
                this.spawnEnemyGrpA();
            }

            // Spawn enemies of Group B
            if (this.spawnTimerGrpB.delta() > 0) {
                this.spawnEnemyGrpB();
            }

        //    // Spawn enemies of Group C
        //    if (this.spawnTimerGrpC.delta() > 0) {
        //        this.spawnEnemyGrpC();
        //    }
        }
    },

    /******************************************
    * receiveDamage
    ******************************************/
    receiveDamage: function (value) {
        return;
    },

    /******************************************
    * randomFromTo
    ******************************************/
    //TODO: Move to utility class
    randomFromTo: function (from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    },


    /******************************************
    * spawnEnemyGrpA
    * Spawns 1 of 2 types of enemies at random intervals
    ******************************************/
    spawnEnemyGrpA: function () {
        // Resets random number
        var rndNum = null;
        // Rolls a random number
        rndNum = this.randomFromTo(1, 10);
        // Adds 1 to the total entities count
        ig.game.currentEntities++;

        // Spawns enemies within the Y bounds of the screen
        this.randomSpawnLocY = this.randomFromTo(ig.system.height - 20, ig.system.height / 20);

        // determines which enemy type will spawn
        //if (rndNum > 5) {
        //    ig.game.spawnEntity(EntityEnemyShip01, this.pos.x, this.randomSpawnLocY);
        //}
        if (rndNum < 9) {
            ig.game.spawnEntity(EntityActorEnemyOrb, this.pos.x, this.randomSpawnLocY);
        }
        // Resets timer
        this.spawnTimerGrpA.reset();
    },

    /******************************************
    * spawnEnemyGrpB
    * Spawns 1 of 2 types of enemies at random intervals
    ******************************************/
    spawnEnemyGrpB: function () {
        // Resets random number
        var rndNum = null;
        // Rolls a random number
        rndNum = this.randomFromTo(1, 10);
        // Adds 1 to the total entities count
        ig.game.currentEntities++;

        // Spawns enemies within the Y bounds of the screen
        this.randomSpawnLocY = this.randomFromTo(ig.system.height - 20, ig.system.height / 20);

        // determines which enemy type will spawn
        if (rndNum > 5) {
            ig.game.spawnEntity(EntityActorEnemyKamikaze, this.pos.x, this.randomSpawnLocY);
        }
        if (rndNum < 5) {
            ig.game.spawnEntity(EntityActorEnemyKamikazeComp, this.pos.x, this.randomSpawnLocY);
        }
        // Resets timer
        this.spawnTimerGrpB.reset();
    },

    /******************************************
    * spawnEnemyGrpC
    * Spawns 1 of 2 types of enemies at random intervals
    ******************************************/
    spawnEnemyGrpC: function () {
        // Resets random number
        var rndNum = null;
        // Rolls a random number
        rndNum = this.randomFromTo(1, 10);
        // Adds 1 to the total entities count
        ig.game.currentEntities++;

        // Spawns enemies within the Y bounds of the screen
        this.randomSpawnLocY = this.randomFromTo(ig.system.height - 20, ig.system.height / 20);

        // determines which enemy type will spawn
        if (rndNum < 3) {
            ig.game.spawnEntity(EntityEnemyShip01, this.pos.x, this.randomSpawnLocY);
        }
        if (rndNum > 4) {
            ig.game.spawnEntity(EntityEnemySpinningShip, this.pos.x, this.randomSpawnLocY);
        }
        // Resets timer
        this.spawnTimerGrpC.reset();
    }
});
});