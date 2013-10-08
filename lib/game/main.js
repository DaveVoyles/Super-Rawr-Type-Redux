ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
    'impact.gaPooling',
    'impact.debug.debug',
    'plugins.packed-textures',
    'plugins.tween-lite',
    'plugins.menu',
    'plugins.pause',
    'plugins.pause-focus',
    'plugins.screenshaker',
    'plugins.musicFader',
    'plugins.impact-tween.tween',
    'game.entities.actor-player',
    'game.entities.object-pu-bulletTime',
    'game.entities.object-pu-miniship',
    'game.entities.object-pu-life',
    'game.screens.start-screen',
    'game.menus',
    'game.Jsparkle',
    'game.StarField',
    'game.UI.PlayerInfoLeft',
    'game.UI.PlayerInfoRight',
    'game.entities.follower',
    'plugins.Path',
    'game.SoundManager',
    'plugins.wordWrap'
 //  ,'game.entities.object-fragmentSpawner'
)
.defines(function () {

    window.RType = ig.Game.extend({

        font:        new ig.Font ('media/fonts/04b03_16.font.png'                  ),
        xFinBlue_sm: new ig.Font ('media/fonts/xfinFont-blue-sm.png'               ),
        scanlines:   new ig.Image('media/backgrounds/scan-lines.png'               ),
        statMatte:   new ig.Image('media/ui/stat-matte.png'                        ),
        title:       new ig.Image('media/textures/star.png'                        ),
        menu:        null,
        mode:        0,
        difficulty:  'EASY',
        isPaused:    false,
        screenShaker:null,
        timeSlower:  null,

        init: function () {
            this.screenShaker = new ScreenShaker();
            this.timeSlower   = new TimeSlower();
            this.inputControls();
          //  this.setGame();
            this.setStarField();
            this.poolEntities();
            this.setTitle();
            this.createPathAndFollower();  // Just testing for now
      //      this.fragmentSpawner = new FragmentSpawner(10000);
        },
        update: function () {
            this.parent();
            if (!this.menu) {
                this.screenShaker.update();
                this.screenShaker.shakeScreen(this.screen);
                this.timeSlower.update();
            }
            this.updateMenu();
            this.starSparkle.update(ig.system.tick, ig.Timer.time);
       //     this.fragmentSpawner.update();
        },
        updateMenu: function () {
            if (!this.menu && (ig.input.pressed('menu'))) {
                this.toggleMenu();
            }
            if (this.menu) {
                this.menu.update();
                if (ig.input.pressed('shoot') && ig.input.mouse.x > ig.system.width / 2 && ig.input.mouse.y > ig.system.height - 80) {
                    window.location = 'http://www.davidvoyles.wordpress.com/';
                }
                if (!(this.menu instanceof GameOverMenu)) {
                    return;
                }
            }
        },
        createPathAndFollower: function(){
            var settings = {
                path              : null,
                pathSpeed         :38   ,
                loopCount         : 3   ,
                spawnDelay        : 0   ,
                rank 	          : 0   ,
                onPathEnd         :null ,
                adjustAngle       :false,
                shift             :null ,
                pathLengths       :null ,
                normalizedSegments:null         };

            var myPath    = new ga.Path ( [100,100, 200,200, 200, 100] ) ;
            settings.path = myPath ;
            myPath.addFunctionPath( 650, 220, function(x) { return 12*Math.sin(40*x) ; } , 5 );

            this.spawnEntity(EntityFollower, -1,-1, settings );
            settings.spawnDelay=2;
        },
        draw: function () {
            this.parent();
  //          this.fragmentSpawner.draw();
			this.drawInsertCoin();
            this.drawMenu();
            this.scanlines.draw(0, 0);
            this.starSparkle.draw(ig.system.context);
        },
        drawInsertCoin: function(){
            if (ig.game.mode === window.RType.MODE.GAME){
                if ((0 | (ig.Timer.time * 1)) & 1) {
                    this.font.draw("Insert Coin", ig.system.width - 300, 20);
                    }
            }
        },
        drawMenu: function () {
            if (this.menu) {
                this.menu.draw();
                this.scanlines.draw(0, 0);
            }
        },
        drawTitle: function () {
            var xs = ig.system.width  / 2;
            var ys = ig.system.height / 4;
            this.title.draw(96, 96);
            var xc = ig.system.width  / 2;
            var yc = ig.system.height - 60;
            ig.system.context.globalAlpha = 0.6;
            this.xFinBlue_sm.draw('Developer: Dave Voyles | DavidVoyles.Wordpress.com', xc, yc);
            if (ig.Sound.enabled) {
                this.xFinBlue_sm.draw('Music: Kevin ....', xc, yc + 20);
            }
            ig.system.context.globalAlpha = 1;
        },
        inputControls: function () {
            ig.input.bind(ig.KEY.LEFT_ARROW,   'left');
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
            ig.input.bind(ig.KEY.UP_ARROW,       'up');
            ig.input.bind(ig.KEY.DOWN_ARROW,   'down');

            ig.input.bind(ig.KEY.C,           'shoot');
            ig.input.bind(ig.KEY.TAB,        'switch');
            ig.input.bind(ig.KEY.X,        'slowTime');
            ig.input.bind(ig.KEY.Q,  'spawnCompanion');
            ig.input.bind(ig.KEY.MOUSE1,      'shoot');
            ig.input.bind(ig.KEY.MOUSE2, 'rightClick');
            ig.input.bind(ig.KEY.V,       'shootTest');
            ig.input.bind(ig.KEY.ESC,          'menu');
            ig.input.bind(ig.KEY.V,     'spawnTurret');

            ig.input.bind(ig.KEY.ENTER,          'ok');
            ig.input.bind(ig.KEY.SPACE,          'ok');
        },
        toggleMenu: function () {
            if (ig.game.mode === window.RType.MODE.TITLE) {
                if (this.menu instanceof TitleMenu) {
                    this.menu = new PauseMenu();
                } else {
                    this.menu = new TitleMenu();
                }
            } else {
                if (this.menu) {
                    ig.system.canvas.style.cursor = '';
                    this.menu = null;
                } else {
                    this.menu = new PauseMenu();
                }
            }
            this.togglePause();
        },
        setGame: function () {
            window.scrollTo(0, 0);
            ig.game.unPause();
            this.setMusic();
            this.menu         = null;
            this.player       = ig.game.spawnEntity(EntityActorPlayer,       0, 				  ig.system.height / 2);
            this.enemySpawner = ig.game.spawnEntity(EntityActorEnemySpawner, ig.system.width / 2, ig.system.height / 2);
            ig.game.mode      = window.RType.MODE.GAME;
            this.setDifficulty();
            this.setUI();
        },
        setUI: function(){
             ig.game.spawnEntity(PlayerInfoLeft,  0,0);
             ig.game.spawnEntity(PlayerInfoRight, 0,0);
        },
        setTitle: function () {
            this.resetStats();
            this.clearScreen();
            ig.game.mode = window.RType.MODE.TITLE;
            this.menu    = new TitleMenu();
        },
        setMusic: function () {
            ig.music.add(window._SoundManager.AstVenOrbMusic, 'astroVenOrbMusic');
            ig.music.add(window._SoundManager.bossMusic,             'bossMusic');
            ig.music.add(window._SoundManager.clearMusic,           'clearMusic');
            ig.music.play('astroVenOrbMusic');
            ig.music.loop = true;
        },
        setDifficulty: function () {
            switch (ig.game.difficulty) {
                case 'EASY':
                    ig.game.bossSpawnKills = 1;
                    break;
                case 'NORMAL':
                    ig.game.bossSpawnKills = 40;
                    break;
                case 'HARD':
                    ig.game.bossSpawnKills = 60;
                    break;
                default:
                    ig.game.bossSpawnKills = 40;
            }
        },
        setStarField: function () {
            ga.particles.Star.setOnPrototype({
                fieldWidth:  ig.system.canvas.width,
                fieldHeight: ig.system.canvas.height,
                starSpeed:   -60,                 // unit is screen per second
                starImage:   this.title.data
            });
            var starCount    = 200;             // create the engine
        //    function getGameTime() { return ig.Timer.time * 1e3;  };
            this.starSparkle = new ga.JSparkle(ga.particles.Star, starCount, null);
        //    this.starSparkle = new ga.JSparkle(ga.particles.Star, starCount, ig.system.context, getGameTime);
            this.starSparkle.spawn(starCount);  // fill the engine
        },
        gameOver: function () {
            ig.finalStats = ig.game.stats;
            ig.system.setGame(StaffRollScreen);
            ig.game.currentEntities = 0;
			ig.music.stop();
            this.resetStats();
        },
        setVictoryEnd: function () {
            ig.game.mode = window.RType.MODE.TITLE;
            ig.music.crossFade(1, 'clearMusic');
            this.gameOverTimer = new ig.Timer(10);
            if (this.gameOverTimer.delta() > 0) {
                this.gameOver();
            }
        },
        setLosingEnd: function () {
            ig.game.mode = window.RType.MODE.TITLE;
			//TODO: Put losing music here
			ig.music.crossFade(1, 'clearMusic');
            this.gameOverTimer = new ig.Timer(10);
            if (this.gameOverTimer.delta() > 0) {
                this.gameOver();
            }
        },
        slowTime: function () {
            if (this.bulletTime.current <= this.bulletTime.max && this.bulletTime.current >= 0 &&
                this.player.slowMoTimer.delta() > this.player.slowMoDelay) {
                this.timeSlower.alterTimeScale(0.4, 1.2, 2.2, 1.2);
                this.bulletTime.current--;
                window._SoundManager.slowMo.play();
                this.player.slowMoTimer.reset();
                this.player.bulletTimeTimer = new ig.Timer(2);
            }
        },
        poolEntities: function () {
            ga.autoPoolEntities();
            EntityPlayerBullet.setupInitPool		   (50);
            EntityEnemyTurretBullet.setupInitPool	   (50);
       //     EntityTurretBullet.setupInitPool		  (100);
            EntityExplosionParticleGreen.setupInitPool (60);
            EntityExplosionParticleRed.setupInitPool   (60);
            EntityExplosionParticleYellow.setupInitPool(60);
            EntityExplosionParticleGreen.setupInitPool (60);
            EntityExplosionParticleBlue.setupInitPool( 180);
            EntityExplosionParticleGrey.setupInitPool( 180);
        },
        clearScreen: function(){
            this.entities = [];
        }
    });


    /*******************************************
    * Instructions Screen
    *******************************************/
    InstructionsScreen = ig.Game.extend({
        backgroundInstructions: new ig.Image('media/backgrounds/instructScreen.png'),
        instructText: new ig.Font('media/fonts/04b03.font.png'),

        init: function () {
            ig.input.bind(ig.KEY.SPACE, 'start');
            ig.input.bind(ig.KEY.ENTER, 'start');
        },
        update: function () {
            if (ig.input.pressed('start') || ig.input.pressed('click')) {
                ig.system.setGame(MyGame);
            }
            this.parent();
        },
        draw: function () {
            this.parent();
            ig.music.play('StaffRoll');
            this.backgroundInstructions.draw(0, 0);
            var x = ig.system.width / 2;
            y = ig.system.height / 2;
            this.instructText.draw('Press SpaceBar, Enter, or touch to continue', x, y - 100, ig.Font.ALIGN.CENTER);
        }
    });

    window.RType.MODE = {
        TITLE:     0,
        GAME:      1,
        GAME_OVER: 2
    };

    //if (ig.ua.mobile) {
    //Disable sound for all mobile devices
    ig.Sound.enabled = false;
    //}

    // Size of game screen & FPS
    ig.main('#canvas', RType, 60, 1280, 720, 1);
});



