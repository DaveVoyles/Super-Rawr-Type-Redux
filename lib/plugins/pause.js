/**
 *  @pause.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *  @Location: https://github.com/netmute/impact-pause
 */
ig.module(
  'plugins.pause'
)
.requires(
  'impact.game',
  'impact.timer'
)
.defines(function () {
  ig.Game.inject({

    paused: false,
    pauseDelayTimer: new ig.Timer(),
    pauseButtonDelay: .2,

    updateEntities: function () {
      for (var i = 0; ent = this.entities[i]; i++) {
        if (!ent._killed && !this.paused) {
          ent.update();
        } else if (ent.ignorePause) {
          ent.update();
        }
      }
    },

    togglePause: function (override) {
      if (this.pauseDelayTimer.delta() > this.pauseButtonDelay) {
        this.paused = override != null ? override : !this.paused;
        if (!this.paused) {
          this.onResume();
        } else {
          this.onPause();
        }
        this.pauseDelayTimer.reset();
      }
    },

    unPause: function(override){
        if (this.pauseDelayTimer.delta() > this.pauseButtonDelay) {
            this.paused = false;
            this.pauseDelayTimer.reset();
        }
    },

    onResume: function () {/* Un-pause certain timers here */ },
    onPause: function () {/* Pause timers here */ }
  });

  ig.Entity.inject({
    ignorePause: false
  });

});