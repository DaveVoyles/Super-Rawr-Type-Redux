ig.module(
	'plugins.pause-focus'
)
.requires(
	'impact.game'
)
.defines(function() {

	ig.Game.inject({

		staticInstantiate: function() {

			// https://gist.github.com/775473
			window.addEventListener("blur", function () {
				if (ig.system) {
					ig.music.pause();
					ig.system.stopRunLoop();

                    // draw a black rect on full screen with low opacity.
                    ig.system.context.fillStyle = 'black';
                    var oldAlpha = ig.system.context.globalAlpha ;
                    ig.system.context.globalAlpha = 0.4;
                    ig.system.context.fillRect(0,0,
                        ig.system.canvas.width*ig.system.scale,
                        ig.system.canvas.height*ig.system.scale);
                    ig.system.context.globalAlpha = oldAlpha;
				}
			}, false);
			window.addEventListener("focus", function () {
				if (ig.system) {
					ig.music.play();
					ig.system.startRunLoop();
				}
			}, false);

			return this.parent();
		}

	});

});