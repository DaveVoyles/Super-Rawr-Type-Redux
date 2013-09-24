/******************************************************************
 *  @musicFader.js
 *  @author: FelipeBudinich
 *  @date: June 2011
 *  @copyright (c) 2013, under The MIT License (see LICENSE)
 *  @Allows for easy crossfading between tracks
 *  @Source: http://impactjs.com/forums/code/music-fade-in/page/1 
 ******************************************************************/
ig.module(
    'plugins.musicFader'
)
.requires(
	'impact.sound'
)
.defines(function(){ "use strict";
ig.Music.inject({

    _loop: true,

    crossFade: function (time, name) {
        if (!this.currentTrack) { return; }
        clearInterval(this._fadeInterval);
        this.fadeTimer = new ig.Timer(time);
        this.duration = time;
        this.nextTrack = name;
        this._fadeInterval = setInterval(this._crossfadeStep.bind(this), 50);
    },

    _crossfadeStep: function () {
        var v = this.fadeTimer.delta()
            .map(-this.fadeTimer.target, 0, 1, 0)
            .limit(0, 1)
            * this._volume;
        if (v <= 0.01) {

            this.play(this.nextTrack);
            this.currentTrack.volume = this._volume;
            clearInterval(this._fadeInterval);
            this.fadeIn(this.duration);
        }
        else {
            this.currentTrack.volume = v;
        }
    },

    fadeIn: function (time) {
        if (!this.currentTrack) { return; }
        this.currentTrack.volume = 0;
        clearInterval(this._fadeInterval);
        this.fadeTimer = new ig.Timer(time);
        this._fadeInterval = setInterval(this._fadeInStep.bind(this), 50);
    },

    _fadeInStep: function () {
        var v = this.fadeTimer.delta()
            .map(this.fadeTimer.target, 0, 1, 0)
            .limit(0, 1)
            * this._volume;

        if (v == 1) {
            this.currentTrack.volume = this._volume;
            clearInterval(this._fadeInterval);
        }
        else {
            this.currentTrack.volume = v;
        }
    },

});
});