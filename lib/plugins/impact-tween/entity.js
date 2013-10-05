ig.module(
    'plugins.impact-tween.entity'
)
.requires(
    'impact.entity'
)
.defines(function() {

if ( !Array.prototype.indexOf ) {
    Array.prototype.indexOf = function(el, start) {
        var start = start || 0;
        for ( var i=0; i < this.length; ++i ) {
            if ( this[i] === el ) {
                return i;
            }
        }
        return -1;
    };
}

ig.Entity.inject({
    tweens: [],
    
    update: function() {
        this.parent();
        if ( this.tweens.length > 0 ) {
            var currentTweens = [];
            for ( var i = 0; i < this.tweens.length; i++ ) {
                this.tweens[i].update();
                if ( !this.tweens[i].complete ) currentTweens.push(this.tweens[i]);
            }
            this.tweens = currentTweens;
        }
    },
    
    tween: function(props, duration, settings) {
        var tween = new ig.Tween(this, props, duration, settings);
        this.tweens.push(tween);
        return tween;
    },
    
    pauseTweens: function() {
        for ( var i = 0; i < this.tweens.length; i++ ) {
            this.tweens[i].pause();
        }
    },
    
    resumeTweens: function () {
        for ( var i = 0; i < this.tweens.length; i++ ) {
            this.tweens[i].resume();
        }
    },
    
    stopTweens: function(doComplete) {
        for ( var i = 0; i < this.tweens.length; i++ ) {
            this.tweens[i].stop(doComplete);
        }
    }
});

});