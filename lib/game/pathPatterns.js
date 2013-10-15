/************************************************************************
 *  @pathPatterns
 *  @author: Dave Voyles
 *  @date: Oct 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Desc: creates pre-defined paths for enemies to traverse
 ***********************************************************************/
ig.module(
    'game.pathPatterns'
)
.requires (
    'impact.game'
    ,'plugins.Path'
    ,'game.entities.actor-follower'
)
    .defines(function(){ "use strict";

    ig.Game.inject({

     createPathAndFollower: function () {
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
            normalizedSegments: null
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
        this.spawnEntity(EntityFollower, -1, -1, settings);
        settings.spawnDelay += 0.4;
        this.spawnEntity(EntityFollower, -1, -1, settings);


        var fourPath = new ga.Path([width / 2, floor, ig.system.width /2, floor / 2]);
        fourPath.addFunctionPath(0, floor / 2, function (r) { return height * Math.sin(bumps * Math.PI * r); }, smoothing);
        settings.path = fourPath;
        this.spawnEntity(EntityFollower, -1, -1, settings);
        settings.spawnDelay += 0.4;
        this.spawnEntity(EntityFollower, -1, -1, settings);
     },

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
            normalizedSegments: null
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
        this.spawnEntity(EntityFollower, -1,-1, settings );
        settings.spawnDelay += 0.4;
        this.spawnEntity(EntityFollower, -1,-1, settings );
        settings.spawnDelay += 0.4;
    },

    createPathTwo: function(){

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
            normalizedSegments: null
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
        this.spawnEntity(EntityFollower, -1,-1, settings );
        settings.spawnDelay += 0.4;
        this.spawnEntity(EntityFollower, -1, -1, settings);
    }
});
});