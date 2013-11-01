/*************************************************************************
 *  @SoundSource.js
 *
 *  @author:    Dave Voyles
 *  @date:      October 2013
 *  @copyright: (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Desc:      One-time loading of all sfx / music, global instance
 *              used to reduce the overhead with loading sfx / music.
 *  @Example:   SoundSource.missileLaunch.play();
 ************************************************************************/

ig.module(
    'game.SoundSource'
)
.requires(
    'impact.game',
    'impact.sound'
)
.defines(function(){

   // Temp class used to load and hold sounds.
   //     It is its instance that will get used.
    var _SoundSource = ig.Class.extend({

        bossMusic:        new ig.Sound('media/music/Boss-5.*',                       true),
        AstVenOrbMusic:   new ig.Sound('media/music/Granitoid-Basilisk.*',          true),
        clearMusic:       new ig.Sound('media/music/Password-4.*',                  true),
        controlsMusic:    new ig.Sound('media/music/Cutscene-1.*',                  true),

        shoot:            new ig.Sound('media/sfx/hit01.*',                         true),
        hit:              new ig.Sound('media/sfx/hit03.*',                         true),
        explode:          new ig.Sound('media/sfx/Explode01.*',                     true),
        blastoff:         new ig.Sound('media/sfx/sfx_blastoff.*',                  true),
        teleport:         new ig.Sound('media/sfx/sfx_teleport.*',                  true),
        pickup:           new ig.Sound('media/sfx/PickupBulletTime.*',              true),
        miniShipSpawn:    new ig.Sound('media/sfx/MiniShipSpawn.*',                 true),
        miniShipKill:     new ig.Sound('media/sfx/MiniShipKill.*',                  true),
        slowMo:           new ig.Sound('media/sfx/SlowMo.*',                        true),
        missileLaunch:    new ig.Sound('media/sfx/missile-launch.*',                true)

    });
        window.SoundSource = new _SoundSource();
});
