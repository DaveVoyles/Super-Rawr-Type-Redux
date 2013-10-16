ig.module(
        'game.entities.actor-testFollower'
)
.requires(
        'game.entities.base-enemy'
)
.defines(function(){


    EntityTestFollower =  EntityBaseEnemy.extend({

        animSheet:      new ig.AnimationSheet('media/textures/actor-enemyOrb.png', 30, 30),
        size: 	        { x:  24, y: 24 },
        offset:         { x:  +2, y: +4 },
        friction:       { x: 150, y:  0 },
        speed:          600,
        health:         9,
        shootTimer:     null,
        moveTimer:      null,
        initTimer:      null,
        newSpawnTimer:  null,
        xModifier:      100,
        initTime:       2,

        settings : {
           path              : null ,
           pathSpeed         : 220  ,
           loopCount         :   0  ,
           spawnDelay        :   0  ,
           rank 	         :   3  ,
           onPathEnd         : null ,
           adjustAngle       : true ,
           shift             : null ,
           pathLengths       : null ,
           normalizedSegments: null ,
           createFollower    : true
        },

        init: function (x, y, settings) {

            this.parent(x, y, settings);
            console.log('creating test follower');
            this.createPathOne();
            this.addAnim('fly', 0.1, [0, 1, 2, 3, 4, 3, 2, 1]);
            this.initTimer      = new ig.Timer(this.initTime);
            this.shootTimer     = new ig.Timer(this.randomFromTo(3, 5));
        //    this.moveTimer      = new ig.Timer(this.randomFromTo(2, 4));
            this.newSpawnTimer  = new ig.Timer(3);

            /* vars for gun */
            this.startAngle     = this.ownAngle;
            this._angle         = -500;
            this._increase      =   60;
            this.bullets        =    4;
            this.radius         =   10;
            this._entityBullet  = EntityObjectEnemyBulletGreen;
        },
        createPathOne: function(){

            var width           = ig.system.width;
            var ceiling         =  0;
            var floor           = ig.system.height;
            var height          = 30;
            var bumps           =  3;
            var smoothing       = 30;

            var onePath = new ga.Path([width, floor / 4, width - 400, floor / 4]);
            onePath.addFunctionPath(width / 2, ig.system.height, function (r) { return height * Math.sin(bumps * Math.PI * r); }, smoothing);
            this.settings.path = onePath;
        },
        update: function () {
            this.parent();
            this.shootBullets();
        },
        receiveDamage: function (value, from) {

            this.parent(value, from);
            if (this.health > 1) {
                var x = this.pos.x + (this.size.x >> 1 );
                var y = this.pos.y + (this.size.y >> 1 );
                ig.game.fragmentSpawner.spawn(x,y,FragmentSpawner.yellow ,  this.particleKillCount , this.size.x);

            }
        }
    });
});