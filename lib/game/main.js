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
    'game.entities.actor-player',
    'game.entities.object-pu-bulletTime',
    'game.entities.object-pu-miniship',
    'game.entities.object-pu-life',
    'game.screens.start-screen',
    'game.menus',
    'game.Jsparkle',
    'game.StarField'

)
.defines(function () {

    window.RType = ig.Game.extend({

        font:             new ig.Font ('media/fonts/04b03_16.font.png'                  ),
        xFinBlue_sm:      new ig.Font ('media/fonts/xfinFont-blue-sm.png'               ),
        backdrop:         new ig.Image('media/backgrounds/tempBG.png'                   ),
        grid:             new ig.Image('media/backgrounds/tempBG.png'                   ),
        scanlines:        new ig.Image('media/backgrounds/scan-lines.png'               ),
        lifeSprite:       new ig.Image('media/ui/ship_lifebar.png'                      ),
        statMatte:        new ig.Image('media/ui/stat-matte.png'                        ),
        transTextBG_left: new ig.Image('media/ui/transTextBG_Lg1.png'                   ),
        transTextBG_Lg:   new ig.Image('media/ui/transTextBG_Lg.png'                    ),
        bulletTimeSprite: new ig.Image('media/ui/BulletTimeDisplayBar1.png'             ),
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

        entitiesKilled:  0,
        maxEntites:      6,
        currentEntities: 0,

        hudOffsetX:      20,
        hudOffsetY:      20,
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
            this.drawHUD();
            this.drawMenu();
            this.scanlines.draw(0, 0);
            this.starSparkle.draw(ig.system.context);
            ig.system.globalAlpha = 1;

        },
        drawHUD: function () {
            if (!this.menu) {
                for (var i = 0; i < this.entities.length; i++) {
                    this.entities[i].draw();
                }

                /* HUD in top-left corner
                 ************************/
                // Draws transparent background behind text
                this.transTextBG_left.draw(this.hudOffsetX - 9, this.hudOffsetY - 13);

                // Draws lifebar
                this.font.draw("Lives", this.hudOffsetX + 8, this.hudOffsetY - 6);
                for (var i = 0; i < this.stats.lives; i++)
                    this.lifeSprite.draw(((this.lifeSprite.width + 1) * i) + this.hudOffsetX + 6, this.hudOffsetY + 10);

                // Draws bullet time bar
                this.font.draw("Bullet Time", this.hudOffsetX + 8, this.hudOffsetY + 26);
                for (var i = 0; i < this.bulletTime.current; i++)
                    this.bulletTimeSprite.draw(((this.bulletTimeSprite.width + 4) * i) + this.hudOffsetX + 9, this.hudOffsetY + 44);

                // Draws turrets
                this.font.draw("Turrets", this.hudOffsetX + 8, this.hudOffsetY + 58);
                for (var i = 0; i < this.turrets.current; i++)
                    this.bulletTimeSprite.draw(((this.bulletTimeSprite.width + 4) * i) + this.hudOffsetX + 9, this.hudOffsetY + 74);

                /* HUD in top-right corner
                 ************************/
                // Draws transparent background behind text
                this.transTextBG_Lg.draw(ig.system.width - this.transTextBG_Lg.width - 9, this.hudOffsetY - 13);

                // Draws score
                this.font.draw("Current Score", ig.system.width - this.transTextBG_Lg.width + 6, this.hudOffsetY - 4);
                this.font.draw(this.stats.kills * 100, ig.system.width - this.transTextBG_Lg.width + 6, this.hudOffsetY + 10);

                // Draw kills until boss
                this.font.draw("Kills untill boss", ig.system.width - this.transTextBG_Lg.width + 6, this.hudOffsetY + 29);
                this.font.draw(-this.stats.kills + this.bossSpawnKills, ig.system.width - this.transTextBG_Lg.width + 6, this.hudOffsetY + 43);

            } else if (this.mode == RType.MODE.TITLE) {
                this.drawTitle();
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
            ig.input.bind(ig.KEY.SPACE,       'pause');
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
        },
        setGame: function () {
            window.scrollTo(0, 0);
            this.setMusic();
            this.menu         = null;
            this.player       = ig.game.spawnEntity(EntityActorPlayer,       0, 				  ig.system.height / 2);
            this.enemySpawner = ig.game.spawnEntity(EntityActorEnemySpawner, ig.system.width / 2, ig.system.height / 2);
            this.mode         = RType.MODE.game;
            this.setDifficulty();
          //  this.boss         = this.getEntitiesByType(EntityActorEnemyBoss); //TODO: Prob don't need this. Just ref in boss class?
        },
        setTitle: function () {
            //this.reset(); //TODO: Program this
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
            var starCount   = 200;              // create the engine	
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
            EntityPlayerBullet.setupInitPool(50);
            EntityEnemyTurretBullet.setupInitPool(50);
            EntityTurretBullet.setupInitPool(100);
            EntityExplosionParticleGreen.setupInitPool(60);
            EntityExplosionParticleRed.setupInitPool(60);
            EntityExplosionParticleYellow.setupInitPool(60);
            EntityExplosionParticleGreen.setupInitPool(60);
            EntityExplosionParticleBlue.setupInitPool(180);
            EntityExplosionParticleGrey.setupInitPool(180);
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
            ig.music.add(this.staffRollMusic, 'staffRollMusic');
            ig.music.play(                    'staffRollMusic');

            ig.input.bind(ig.KEY.SPACE,                'start');
            ig.input.bind(ig.KEY.ENTER,                'start');
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



