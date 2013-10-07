/***************************************************
 *  @SoundManager.js
 *  @version: 0.1
 *  @author: Dave Voyles
 *  @date: October 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @Desc: One-time loading of all sfx / music, global instance
 *         used to reduce the overhead with loading sfx / music
 ***************************************************/

ig.module(
    'game.SoundManager'
)
.requires(
    'impact.game',
    'impact.sound'
)
.defines(function(){

    var _SoundManager = ig.Class.extend({

        stage38Music:     new ig.Sound('media/Music/Stage38.*',                     true),
        bossMusic:        new ig.Sound('media/Music/SF_Corneria-Boss.*',            true),
        AstVenOrbMusic:   new ig.Sound('media/Music/SF_Asteroid-Venom-Orbital.*',   true),
        clearMusic:       new ig.Sound('media/Music/SF_clear.*',                    true),

        shoot:            new ig.Sound('media/sfx/hit01.*',                         true),
        hit:              new ig.Sound('media/sfx/hit03.*',                         true),
        explode:          new ig.Sound('media/sfx/Explode01.*',                     true),
        blastoff:         new ig.Sound('media/sfx/sfx_blastoff.*',                  true),
        teleport:         new ig.Sound('media/sfx/sfx_teleport.*',                  true),
        pickup:           new ig.Sound('media/sfx/PickupBulletTime.*',              true),
        miniShipSpawn:    new ig.Sound('media/sfx/MiniShipSpawn.*',                 true),
        miniShipKill:     new ig.Sound('media/sfx/MiniShipKill.*',                  true),
        slowMo:           new ig.Sound('media/sfx/SlowMo.*',                        true),

        init: function(){
            this.shoot.volume = 0.7;
        }

    });
        window._SoundManager = new _SoundManager();
});
