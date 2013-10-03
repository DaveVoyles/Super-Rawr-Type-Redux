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
    'game.UI.PlayerInfoRight'

)
.defines(function () {

    window.RType = ig.Game.extend({

        font:             new ig.Font ('media/fonts/04b03_16.font.png'                  ),
        xFinBlue_sm:      new ig.Font ('media/fonts/xfinFont-blue-sm.png'               ),                  
        scanlines:        new ig.Image('media/backgrounds/scan-lines.png'               ),
        statMatte:        new ig.Image('media/ui/stat-matte.png'                        ),
        title:            new ig.Image('media/textures/star.png'                        ),
        stage38Music:     new ig.Sound('media/Music/Stage38.mp3',                   true),
        stage38Music:     new ig.Sound('media/Music/Stage38.ogg',                   true),
        stage38Music:     new ig.Sound('media/Music/Stage38.*',                     true),
        bossMusic:        new ig.Sound('media/Music/SF_Corneria-Boss.mp3',          true),
        bossMusic:        new ig.Sound('media/Music/SF_Corneria-Boss.ogg',          true),
        bossMusic:        new ig.Sound('media/Music/SF_Corneria-Boss.*',            true),
        AstVenOrbMusic:   new ig.Sound('media/Music/SF_Asteroid-Venom-Orbital.mp3', true),
        AstVenOrbMusic:   new ig.Sound('media/Music/SF_Asteroid-Venom-Orbital.ogg', true),
        AstVenOrbMusic:   new ig.Sound('media/Music/SF_Asteroid-Venom-Orbital.*',   true),
        clearMusic:       new ig.Sound('media/Music/SF_clear.mp3',                  true),
        clearMusic:       new ig.Sound('media/Music/SF_clear.ogg',                  true),
        clearMusic:       new ig.Sound('media/Music/SF_clear.*',                    true),
        menu:            null,
        mode:            0,
        difficulty:      'EASY',
        isPaused:        false,
        screenShaker:    null,
        timeSlower:      null,

        init: function () {
            this.screenShaker = new ScreenShaker();
            this.timeSlower   = new TimeSlower();
            this.inputControls();
            this.setGame();
            this.setStarField();
            this.poolEntities();
            // this.setTitle();
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
        draw: function () {
            this.parent();
			this.drawInsertCoin();
            this.drawMenu();
            this.scanlines.draw(0, 0);
            this.starSparkle.draw(ig.system.context);
        },
        drawInsertCoin: function(){      
			if ((0 | (ig.Timer.time * 1)) & 1) {
        		this.font.draw("Insert Coin", ig.system.width - 300, 20);
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
            if (this.mode == RType.MODE.TITLE) {
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
            this.setMusic();
            this.menu         = null;
            this.player       = ig.game.spawnEntity(EntityActorPlayer,       0, 				  ig.system.height / 2);
            this.enemySpawner = ig.game.spawnEntity(EntityActorEnemySpawner, ig.system.width / 2, ig.system.height / 2);
            this.mode         = RType.MODE.game;
            this.setDifficulty();
            this.setUI();
        },
        setUI: function(){
            var playerInfoLeft  = ig.game.spawnEntity(PlayerInfoLeft,  0,0);
            var playerInfoRight = ig.game.spawnEntity(PlayerInfoRight, 0,0);
        },
        setTitle: function () {
            this.resetStats();
            this.mode = RType.MODE.TITLE;
            this.menu = new TitleMenu();
        },
        setMusic: function () {
/*             ig.music.add(this.stage38Music,     'stage38Music'); */
            ig.music.add(this.AstVenOrbMusic, 'astVenOrbMusic');
            ig.music.add(this.bossMusic,           'bossMusic');
            ig.music.add(this.clearMusic,         'clearMusic');
            ig.music.play('AstVenOrbMusic');
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
                fieldWidth: ig.system.canvas.width,
                fieldHeight: ig.system.canvas.height,
                starSpeed: -60,                 // unit is screen per second
                starImage: this.title.data
            });
            var starCount    = 200;             // create the engine	
            this.starSparkle = new ga.JSparkle(ga.particles.Star, starCount, null);
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
            window.RType.MODE = 2;
            ig.music.crossFade(1, 'clearMusic');
            this.gameOverTimer = new ig.Timer(10);
            if (this.gameOverTimer.delta() > 0) {
                this.gameOver();
            }
        },
        setLosingEnd: function () {
            window.RType.MODE = 2;
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
                this.player.SlowMo01_sfx.play();
                this.player.slowMoTimer.reset();
                this.player.bulletTimeTimer = new ig.Timer(2);
            }
        },
        poolEntities: function () {
            ga.autoPoolEntities();
            EntityPlayerBullet.setupInitPool		   (50);
            EntityEnemyTurretBullet.setupInitPool	   (50);
            EntityTurretBullet.setupInitPool		  (100);
            EntityExplosionParticleGreen.setupInitPool (60);
            EntityExplosionParticleRed.setupInitPool   (60);
            EntityExplosionParticleYellow.setupInitPool(60);
            EntityExplosionParticleGreen.setupInitPool (60);
            EntityExplosionParticleBlue.setupInitPool( 180);
            EntityExplosionParticleGrey.setupInitPool( 180);
        },
    });

    /*******************************************
    * Staff Roll Screen
    *******************************************/
    StaffRollScreen = ig.Game.extend({
        instructText:   new ig.Font('media/fonts/04b03.font.png'      ),
//         background:     new ig.Image('media/backgrounds/StaffRoll.png'),
        staffRollMusic: new ig.Sound('media/Music/Staff Roll 1.mp3'   ),
        staffRollMusic: new ig.Sound('media/Music/Staff Roll 1.ogg'   ),
        staffRollMusic: new ig.Sound('media/Music/Staff Roll 1.*'     ),

        init: function () {
            ig.music.add(this.staffRollMusic, '		   staffRollMusic');
            ig.music.play(                    		  'staffRollMusic');

            ig.input.bind(ig.KEY.SPACE,                        'start');
            ig.input.bind(ig.KEY.ENTER,                        'start');
        },
        update: function () {
            if (ig.input.pressed('start') || ig.input.pressed('click')) {
                ig.system.setGame(StartScreen);
            }
            this.parent();
        },
        draw: function () {
            this.parent();
            ig.music.play('StaffRoll');
            this.background.draw(0, 0);
            var x = ig.system.width / 2,
                y = ig.system.height / 2;
            this.instructText.draw('Thanks for playing!', x, y, ig.Font.ALIGN.CENTER);
            this.instructText.draw('Press SpaceBar or Enter to continue', x, y + 40, ig.Font.ALIGN.CENTER);
            this.instructText.draw('All music property of YouTube user Kevvviiinnn', x, y - 80, ig.Font.ALIGN.CENTER);
            this.instructText.draw('Developer: Dave Voyles - @DaveVoyles | www.DavidVoyles.Wordpress.com', x, y - 70, ig.Font.ALIGN.CENTER);
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
        TITLE: 0,
        GAME: 1,
        GAME_OVER: 2,
    };

    //if (ig.ua.mobile) {
    //Disable sound for all mobile devices
    ig.Sound.enabled = false;
    //}

    // Size of game screen & FPS
    ig.main('#canvas', RType, 60, 1280, 720, 1);
});



