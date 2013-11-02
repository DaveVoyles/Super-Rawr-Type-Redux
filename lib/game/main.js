ig.module(
	'game.main'
)
.requires(
	'impact.game',	'impact.font',    'impact.gaPooling',
    'plugins.packed-textures',    'plugins.tween-lite',    'plugins.menu',
    'plugins.Path',    'plugins.pause',    'plugins.parallax',    'plugins.pause-focus',
    'plugins.screenshaker',    'plugins.musicFader',    'plugins.impact-tween.tween',
    'game.entities.actor-player',    'game.entities.object-pu-bulletTime',
    'game.entities.object-pu-miniship',    'game.entities.object-pu-life',
    'game.entities.object-pu-missile',    'game.entities.object-pu-turret',
    'game.entities.object-fragmentSpawner',    'game.entities.actor-follower',
    'game.screens.start-screen',    'game.UI.PlayerInfoLeft',    'game.UI.PlayerInfoRight',
    'game.UI.warningText',    'game.UI.gameOverScreen',    'game.menus',
	'game.StarField',    'game.SoundSource',    'game.pathPatterns', 'game.UI.superRawrTypeLogo'

)
.defines(function () {
	
	// Merge the ImpactMixin - if present - into the 'ig' namespace. This gives other
    // code the chance to modify 'ig' before it's doing any work.
	ig.merge(ig, window.ImpactMixin);

window.RType = ig.Game.extend({

    font:          new ig.Font ('media/fonts/04b03_16.font.png'    ),
    xFinBlue_sm:   new ig.Font ('media/fonts/xfinFont-blue-sm.png' ),
    title:         new ig.Image('media/textures/star.png'          ),
    menu:          null,
    mode:          0,
    difficulty:    'EASY',
    isPaused:      false,
    screenShaker:  null,
    timeSlower:    null,
    finishTimer:   null,
    gameOverTimer: null,
    gameResetTime: 8,

    init: function () {
        this.screenShaker    = new ScreenShaker();
        this.timeSlower      = new TimeSlower();
        this.fragmentSpawner = new FragmentSpawner(1000);   // Creates particles
        this.setStarField();                                // Creates parallax star background
        this.poolEntities();
        this.setMusic();                                    // Loads game music
        this.setTitle();                                    // Creates title menus
    },
    update: function () {
        this.parent();
        this.updateShakeScreenAndSlowTime();
        this.updateMenu();
        this.inputControls();
        this.createGameOverScreen();
        this.createGameOverTimer();
        this.starSparkle.update();
        this.fragmentSpawner.update()
        console.log(ig.game.mode);
    },
    draw: function () {
        this.parent();
        this.starSparkle.draw();
        this.fragmentSpawner.draw();
        this.drawInsertCoin();
        this.drawMenu();
    },
    drawInsertCoin: function(){
        if (ig.game.mode === window.RType.MODE.GAME){
            // Flash 'Insert Coin' text on and off each second
            if ((0 | (ig.Timer.time * 1)) & 1) {
                this.font.draw("Insert Coin", ig.system.width - 300, 20);
                }
        }
    },
    drawMenu: function () {
        if (this.menu) {
            this.menu.draw();
        }
    },
    updateMenu: function () {
        // Toggles menu while in game
        if (!this.menu && (ig.input.pressed('escape'))) {
            this.toggleMenu();
        }
        // Responds to user inputs
        if (this.menu) {
            this.menu.update();
        }
    },
    inputControls: function(){
        ig.input.bind(ig.KEY.LEFT_ARROW, 'left'          );
        ig.input.bind(ig.KEY.RIGHT_ARROW,'right'         );
        ig.input.bind(ig.KEY.UP_ARROW,   'up'            );
        ig.input.bind(ig.KEY.DOWN_ARROW, 'down'          );

        ig.input.bind(ig.KEY.ENTER,      'enter'         );
        ig.input.bind(ig.KEY.C,          'shoot'         );
        ig.input.bind(ig.KEY.X,          'slowTime'      );
        ig.input.bind(ig.KEY.MOUSE1,     'shoot'         );
        ig.input.bind(ig.KEY.V,          'spawnTurret'   );
        ig.input.bind(ig.KEY.B,          'shootMissile'  );
        ig.input.bind(ig.KEY.ESC,        'escape'        );
    },
    // Only displays in title mode, toggles the options menu on and off
    toggleMenu: function () {
        if (ig.game.mode === window.RType.MODE.TITLE) {
            if (this.menu instanceof TitleMenu) {
                this.menu = new OptionsMenu();
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
            this.togglePause();
        }
    },
    // Starts the gameplay
    setGame: function () {
        ig.game.unPause();        // Just in case the game is paused
        this.menu         = null; // Removes menus
        ig.music.play('astroVenOrbMusic');
        this.player       = ig.game.spawnEntity(EntityActorPlayer,       0, 				  ig.system.height / 2);
        this.enemySpawner = ig.game.spawnEntity(EntityActorEnemySpawner, ig.system.width / 2, ig.system.height / 2);
        ig.game.mode      = window.RType.MODE.GAME;
        this.setDifficulty();    // Sets difficulty / stats based on user selection from menu
        this.setUI();            // Gets & draws game UI
        this.destroyLogo();      // Game has started, no longer a need for the logo
    },
    destroyLogo: function(){
        var logo = ig.game.getEntityByName('Logo');
        logo.createFinishTimerAndKill();
    },
    setUI: function(){
         // Start left way off screen, so that it slides into place at the same time as InfoRight
         ig.game.spawnEntity(PlayerInfoLeft, -500, 0);
         ig.game.spawnEntity(PlayerInfoRight,   0, 0);
    },
    setTitle: function () {
        ig.game.mode = window.RType.MODE.TITLE;
        this.clearScreen();                 // Wipes all entities off screen
        this.menu    = new TitleMenu();     // Displays a new menu screen
        this.setMusic();
        ig.music.crossFade(.4, 'controlsMusic');
        // Logo begins at this point, and tweens down onto tween (x/y) definied in entity
        ig.game.spawnEntity(EntitySuperRawrTypeLogo, ig.system.width / 2 - 210, -400);
    },
    // Adds music from sound manger, and can be used from anywhere within the game
    // Must remain here, b/c sound manager cannot load actual files to music.add.
    setMusic: function () {
        ig.music.add(SoundSource.controlsMusic,     'controlsMusic');
        ig.music.add(SoundSource.AstVenOrbMusic, 'astroVenOrbMusic');
        ig.music.add(SoundSource.bossMusic,             'bossMusic');
        ig.music.add(SoundSource.clearMusic,           'clearMusic');
        ig.music.loop = true;
    },
    // Sets game difficulty based on user selection at title menu
    setDifficulty: function () {
        switch (ig.game.difficulty) {
            case 'EASY':
                ig.game.resetStats('EASY');
                break;
            case 'NORMAL':
                ig.game.resetStats('NORMAL');
                break;
            case 'HARD':
                ig.game.resetStats('HARD');
                break;
            default:
                ig.game.resetStats('NORMAL');
        }
    },
    // Creates parallax star field
    setStarField: function () {
        ga.particles.Star.setOnPrototype({
            fieldWidth:  ig.system.canvas.width,
            fieldHeight: ig.system.canvas.height,
            starSpeed:   -0.3,              // unit is screen per second
            starImage:   this.title.data
        });
        var starCount    = 250;             // create the engine
        function getGameTime() { return ig.Timer.time * 1e3 ;  };
        this.starSparkle = new ga.JSparkle(ga.particles.Star, starCount, ig.system.context,  getGameTime);
        this.starSparkle.spawn(starCount);  // fill the engine
    },
    setGameOver: function () {
        this.clearScreen();
        this.resetStats();
        this.setTitle();
    },
    // Creates timer which removes gameOverScreen, brings in new menus, & resets game
    createGameOverTimer: function(){
            if (ig.game.mode === window.RType.MODE.GAME_OVER){
                    if (this.gameOverTimer === null){
                         this.gameOverTimer = new ig.Timer(this.gameResetTime);
                    }
            }
            if (this.gameOverTimer && this.gameOverTimer.delta() > 0) {
                    this.setGameOver();
                    this.gameOverTimer = null;
                    // Prevents the boss from spawning the gameOverScreen again!
                    // Without this, boss.kill will always call a new screen, therefore drawing one after the other!
                    ig.game.mode = window.RType.MODE.TITLE;
            }
    },
    // Creates screen which tweens in and displays game over info, created as soon as player has 0 lives
    createGameOverScreen: function(){
            if (ig.game.mode === window.RType.MODE.GAME_OVER){
                    var gameOverScreen = ig.game.getEntityByName('Game Over Screen');
                    if (!gameOverScreen){
                            if (this.finishTimer === null){
                                this.finishTimer = new ig.Timer(2);
                            }
                            if (this.finishTimer && this.finishTimer.delta() > 0){
                                ig.game.spawnEntity(EntitygameOverScreen, 0, -1000);
                                this.finishTimer = null;
                            }
                    }
            }
    },
    updateShakeScreenAndSlowTime: function(){
            this.screenShaker.update();
            this.screenShaker.shakeScreen(this.screen);
            this.timeSlower.update();
    },
    // Activated by player, slows the game's update for slowMo (also called BulletTime)
    slowTime: function () {
        if (this.bulletTime.current <= this.bulletTime.max && this.bulletTime.current >= 0 &&
            this.player.slowMoTimer.delta() > this.player.slowMoDelay) {
            this.timeSlower.alterTimeScale(0.4, 1.2, 2.2, 1.2);
            this.bulletTime.current--;
            SoundSource.slowMo.play();
            this.player.slowMoTimer.reset();
            this.player.bulletTimeTimer = new ig.Timer(2);
        }
    },
    poolEntities: function () {
        ga.autoPoolEntities();
        EntityPlayerBullet.setupPool		   (60);
        EntityEnemyTurretBullet.setupPool	   (60);
        EntityTurretBullet.setupPool		  (100);
        EntityHomingMissile.setupPool          (20);
    },
    // Removes all entities off the screen, to reset the game. This allows us to keep object pooling and
    // not have to instantiate objects again, either.
    clearScreen: function(){
        // Sometimes this doesn't kill all entities, so we need to use ig.game.entities = [] as well
        for (var i = 0 ; i<this.entities.length ; i++) { this.entities[i].kill(); };

        // Removes Game Over Screen
        var gameOverScreen = ig.game.getEntityByName('Game Over Screen');
        if (gameOverScreen) { gameOverScreen.kill(); };
    }
});

    window.RType.MODE = {
        TITLE:               0,
        GAME:                1,
        GAME_OVER:           2,
        BOSS_JUST_KILLED:    3,
        INSTRUCTIONS_SCREEN: 4
    };

    //if (ig.ua.mobile) {
    //Disable sound for all mobile devices
    ig.Sound.enabled = true;
    //}

    // Size of game screen & FPS
    ig.main('#canvas', RType, 60, 1280, 720, 1);

});



