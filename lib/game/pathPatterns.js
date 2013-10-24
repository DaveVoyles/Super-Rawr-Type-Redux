/************************************************************************
 *  @pathPatterns
 *  @author:    Dave Voyles
 *  @date:      Oct 2013
 *  @copyright: (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Desc:      Creates pre-defined paths for enemies to traverse.
 *              Called from enemySpawner to create paths / enemies.
 ***********************************************************************/
ig.module(
    'game.pathPatterns'
)
.requires (
    'impact.game'
    ,'plugins.Path'
    ,'game.entities.actor-follower'
    ,'game.entities.actor-enemySentinel'
)
    .defines(function(){ "use strict";

    ig.Game.inject({

    createPathOne: function(){
        var settings = {
            path              : null ,
            pathSpeed         : 220  ,
            loopCount         :   0  ,
            spawnDelay        :   0  ,
            rank 	          :   3  ,
            onPathEnd         : null ,
            adjustAngle       : true ,
            shift             : null ,
            pathLengths       : null ,
            normalizedSegments: null ,
            createFollower    : true
        };

        var width           = ig.system.width;
        var ceiling         =  0;
        var floor           = ig.system.height;
        var height          = 30;
        var bumps           =  3;
        var smoothing       = 30;


        var onePath = new ga.Path([width, floor / 4, width - 400, floor / 4]);
        onePath.addFunctionPath(width / 2, ig.system.height, function (r) { return height * Math.sin(bumps * Math.PI * r); }, smoothing);
        settings.path = onePath;
        ig.game.spawnEntity(EntityEnemySentinel, -1,-1, settings );
        settings.spawnDelay+=0.8;
        ig.game.spawnEntity(EntityEnemySentinel, -1,-1, settings );
        settings.spawnDelay+=0.8;
        ig.game.spawnEntity(EntityEnemySentinel, -1,-1, settings );
    },

    createPathTwo: function(){

        var settings = {
            path              : null ,
            pathSpeed         : 200  ,
            loopCount         :   0  ,
            spawnDelay        :   0  ,
            rank 	          :   3  ,
            onPathEnd         : null ,
            adjustAngle       : true ,
            shift             : null ,
            pathLengths       : null ,
            normalizedSegments: null ,
            createFollower    : true
        };

        var width           = ig.system.width;
        var ceiling         =  0;
        var floor           = ig.system.height;
        var height          = 30;
        var bumps           =  3;
        var smoothing       = 30;

        var twoPath = new ga.Path([width, floor / 2, width - 400, floor / 2]);
        twoPath.addFunctionPath(width / 2, ceiling, function (r) { return height * Math.sin(bumps * Math.PI * r); }, smoothing);
        settings.path = twoPath;
        ig.game.spawnEntity(EntityEnemySentinel, -1,-1, settings );
        settings.spawnDelay+=0.8;
        ig.game.spawnEntity(EntityEnemySentinel, -1,-1, settings );
        settings.spawnDelay+=0.8;
        ig.game.spawnEntity(EntityEnemySentinel, -1,-1, settings );
    },

    createPathThree: function () {
        var settings = {
            path              : null ,
            pathSpeed         : 220  ,
            loopCount         :   0  ,
            spawnDelay        :   0  ,
            rank 	          :   3  ,
            onPathEnd         : null ,
            adjustAngle       : true ,
            shift             : null ,
            pathLengths       : null ,
            normalizedSegments: null ,
            createFollower    : true
        };

        var width           = ig.system.width;
        var ceiling         =  0;
        var floor           = ig.system.height;
        var height          = 30;
        var bumps           =  3;
        var smoothing       = 30;

        var threePath = new ga.Path([width /2, floor, width - 400, floor / 2]);
        threePath.addFunctionPath(width / 2, ceiling, function (r) { return height * Math.sin(bumps * Math.PI * r); }, smoothing);
        settings.path = threePath;
        ig.game.spawnEntity(EntityEnemySentinel, -1,-1, settings );
        settings.spawnDelay+=0.8;
        ig.game.spawnEntity(EntityEnemySentinel, -1,-1, settings );
        settings.spawnDelay+=0.8;
        ig.game.spawnEntity(EntityEnemySentinel, -1,-1, settings );
    },

    createPathFour: function () {
        var settings = {
            path              : null ,
            pathSpeed         : 180  ,
            loopCount         :   0  ,
            spawnDelay        :   0  ,
            rank 	          :   3  ,
            onPathEnd         : null ,
            adjustAngle       : true ,
            shift             : null ,
            pathLengths       : null ,
            normalizedSegments: null ,
            createFollower    : true
        };

        var width           = ig.system.width;
        var ceiling         =  0;
        var floor           = ig.system.height;
        var height          = 30;
        var bumps           =  3;
        var smoothing       = 30;

        var fourPath = new ga.Path([width / 2, floor, ig.system.width /2, floor / 2]);
        fourPath.addFunctionPath(0, floor / 2, function (r) { return height * Math.sin(bumps * Math.PI * r); }, smoothing);
        settings.path = fourPath;
        ig.game.spawnEntity(EntityEnemySentinel, -1,-1, settings );
        settings.spawnDelay+=0.8;
        ig.game.spawnEntity(EntityEnemySentinel, -1,-1, settings );
    },
    createPathFive: function(){
        var settings = {
            path              : null ,
            pathSpeed         : 320  ,
            loopCount         :   0  ,
            spawnDelay        :   0  ,
            rank 	          :   3  ,
            onPathEnd         : null ,
            adjustAngle       : true ,
            shift             : null ,
            pathLengths       : null ,
            normalizedSegments: null ,
            createFollower    : true
        };

        var width           = ig.system.width;
        var ceiling         =  0;
        var floor           = ig.system.height;
        var height          = 30;
        var bumps           =  3;
        var smoothing       = 30;

        var onePath = new ga.Path([width, floor / 4, width - 400, floor / 4]);
        onePath.addFunctionPath(width / 2, ig.system.height, function (r) { return height * Math.sin(bumps * Math.PI * r); }, smoothing);
        settings.path = onePath;
        ig.game.spawnEntity(EntityTestFollower, -1,-1, settings );
        settings.spawnDelay+=0.8;
        ig.game.spawnEntity(EntityTestFollower, -1,-1, settings );
        settings.spawnDelay+=0.8;
        ig.game.spawnEntity(EntityTestFollower, -1,-1, settings );
    },
    createPathSix: function () {
        var settings = {
            path              : null ,
            pathSpeed         : 220  ,
            loopCount         :   0  ,
            spawnDelay        :   0  ,
            rank 	          :   3  ,
            onPathEnd         : null ,
            adjustAngle       : true ,
            shift             : null ,
            pathLengths       : null ,
            normalizedSegments: null ,
            createFollower    : true
        };

        var width           = ig.system.width;
        var ceiling         =  0;
        var floor           = ig.system.height;
        var height          = 30;
        var bumps           =  3;
        var smoothing       = 30;

        var fourPath = new ga.Path([width / 2, floor, ig.system.width /2, floor / 2]);
        fourPath.addFunctionPath(0, floor / 2, function (r) { return height * Math.sin(bumps * Math.PI * r); }, smoothing);
        settings.path = fourPath;
        this.spawnEntity(EntityActorEnemySpinShip , -1, -1, settings);
        settings.spawnDelay += 0.4;
        this.spawnEntity(EntityActorEnemySpinShip , -1, -1, settings);
        settings.spawnDelay += 0.4;
        this.spawnEntity(EntityActorEnemySpinShip , -1, -1, settings);
    }
});
});