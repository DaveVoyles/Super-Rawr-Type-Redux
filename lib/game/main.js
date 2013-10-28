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
    'plugins.Path',
    'plugins.pause',
    'plugins.parallax',
    'plugins.pause-focus',
    'plugins.screenshaker',
    'plugins.musicFader',
    'plugins.impact-tween.tween',
    'game.entities.actor-player',
    'game.entities.object-pu-bulletTime',
    'game.entities.object-pu-miniship',
    'game.entities.object-pu-life',
    'game.entities.object-pu-missile',
    'game.entities.object-fragmentSpawner',
    'game.entities.actor-follower',
    'game.screens.start-screen',
    'game.UI.PlayerInfoLeft',
    'game.UI.PlayerInfoRight',
    'game.UI.warningText',
    'game.menus',
	'game.StarField',
    'game.SoundSource',
    'game.pathPatterns'

)
.defines(function () {
	
	// Merge the ImpactMixin - if present - into the 'ig' namespace. This gives other
    // code the chance to modify 'ig' before it's doing any work.
	ig.merge(ig, window.ImpactMixin);

window.RType = ig.Game.extend({

    font:        new ig.Font ('media/fonts/04b03_16.font.png'    ),
    xFinBlue_sm: new ig.Font ('media/fonts/xfinFont-blue-sm.png' ),
    scanlines:   new ig.Image('media/backgrounds/scan-lines.png' ),
    statMatte:   new ig.Image('media/ui/stat-matte.png'          ),
    title:       new ig.Image('media/textures/star.png'          ),
    deathStar:   new ig.Image('media/backgrounds/deathStar.png'  ),
    menu:        null,
    mode:        0,
    difficulty:  'EASY',
    isPaused:    false,
    screenShaker:null,
    timeSlower:  null,

    init: function () {
        this.screenShaker = new ScreenShaker();
        this.timeSlower   = new TimeSlower();
        this.setStarField();
        this.poolEntities();
        this.setTitle();
   //     this.setGame();                // DEBUG: Just launch right into the game, save time
        this.fragmentSpawner = new FragmentSpawner(1000);
        this.parallax = new Parallax(); // Parallax maps
    },
    update: function () {
        this.parent();
        if (!this.menu) {
            this.screenShaker.update();
            this.screenShaker.shakeScreen(this.screen);
            this.timeSlower.update();
        }
        this.updateMenu();
        this.starSparkle.update();
        this.fragmentSpawner.update();
    //    this.parallax.move(25);
        this.inputControls();
        this.voidInputsIfInMenu();
    },
    updateMenu: function () {
        if (!this.menu && (ig.input.pressed('escape'))) {
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
        this.starSparkle.draw();
        this.fragmentSpawner.draw();
        this.drawInsertCoin();
        this.drawMenu();
        this.scanlines.draw(0, 0);
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
    inputControls: function(){
        ig.input.bind(ig.KEY.LEFT_ARROW, 'left'          );
        ig.input.bind(ig.KEY.RIGHT_ARROW,'right'         );
        ig.input.bind(ig.KEY.UP_ARROW,   'up'            );
        ig.input.bind(ig.KEY.DOWN_ARROW, 'down'          );
        ig.input.bind(ig.KEY.ENTER,      'enter'         );

        ig.input.bind(ig.KEY.C,          'shoot'         );
        ig.input.bind(ig.KEY.X,          'slowTime'      );
        ig.input.bind(ig.KEY.Z,          'spawnCompanion');
        ig.input.bind(ig.KEY.MOUSE1,     'shoot'         );
        ig.input.bind(ig.KEY.V,          'spawnTurret'   );
        ig.input.bind(ig.KEY.B,          'shootMissile'  );
        ig.input.bind(ig.KEY.ESC,        'escape'        );
    },
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
    voidInputsIfInMenu: function(){
        if (ig.game.mode === window.RType.MODE.INSTRUCTIONS_SCREEN){
            if (ig.input.pressed('up')){
                return;
            }
        }
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
       // this.parallax.add('media/backgrounds/deathStar.png', {distance: 1, y: 0})
    },
    setUI: function(){
         // Start left way off screen, so that it slides into place at the same time as InfoRight
         ig.game.spawnEntity(PlayerInfoLeft, -500, 0);
         ig.game.spawnEntity(PlayerInfoRight,   0, 0);
    },
    setTitle: function () {
        this.resetStats();
        this.clearScreen();
        ig.game.mode = window.RType.MODE.TITLE;
        this.menu    = new TitleMenu();
    },
    setMusic: function () {
        ig.music.add(SoundSource.AstVenOrbMusic, 'astroVenOrbMusic');
        ig.music.add(SoundSource.bossMusic,             'bossMusic');
        ig.music.add(SoundSource.clearMusic,           'clearMusic');
        ig.music.play('astroVenOrbMusic');
        ig.music.loop = true;
    },
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
            SoundSource.slowMo.play();
            this.player.slowMoTimer.reset();
            falseplayer.bulletTimeTimer = new ig.Timer(2);
        }
    },
    poolEntities: function () {
        ga.autoPoolEntities();
        EntityPlayerBullet.setupPool		   (60);
        EntityEnemyTurretBullet.setupPool	   (60);
        EntityTurretBullet.setupPool		  (100);
        EntityHomingMissile.setupPool          (10);
    },
    clearScreen: function(){
        for (var i = 0 ; i<this.entities.length ; i++) { this.entities[i].kill(); };
    }
});


window.RType.MODE = {
    TITLE:               0,
    GAME:                1,
    GAME_OVER:           2,
    INSTRUCTIONS_SCREEN: 3
};

//if (ig.ua.mobile) {
//Disable sound for all mobile devices
ig.Sound.enabled = false;
//}

// Size of game screen & FPS
ig.main('#canvas', RType, 60, 1280, 720, 1);

});



