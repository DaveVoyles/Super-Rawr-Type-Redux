//             Starfield
//
//  Definition of a Particle for the Starfield demo of JSparkle.
//

ig.module(
	'game.StarField'
)
.requires(
)
.defines(function () {

    // Game Alchemist Workspace.
    window.ga = window.ga || {};

    ga.particles = ga.particles || {};

    ga.particles.Star = function () {
        this.x = 0;
        this.y = 0;
        this.fakeZ = 1; // trick : we use a 'fake Z', which is a number [0..1[ 
        // by which we multiply (not divide) x and y (>12 times faster)
        this.speed = 0;

        this.colorIndex = 0;
    };

    var colors = [];
    for (var i = 0; i < 10; i++) colors.push('#' + (i + 5).toString(16) + (i + 5).toString(16) + (i + 5).toString(16))

    ga.particles.Star.prototype = {
        dt: 0,
        currentTime: 0,
        drawContext: null,

        fieldWidth: 0, // 
        fieldHeight: 0, // 
        starSpeed: 1, // unit is screen per second for the closest stars.
        starImage: null, //

        update: function () {
            this.x += this.dt * this.speed;
            /*           if (this.x > this.fieldWidth) { // put the star on the left again if it left the field
                           this.x = -32;
                           this.y = Math.random() * this.fieldHeight; // random height
                           this.speed = this.fakeZ * this.fieldWidth * this.starSpeed / (1000);
                           // in fact we should sort the loop buffer here but huushh !!  	
                       } 
              */         if (this.x < 0) {
       this.x = this.fieldWidth + 32;
       this.y = Math.random() * this.fieldHeight; // random height
       this.speed = this.fakeZ * this.fieldWidth * this.starSpeed / (1000);
   }
        },

        draw: function () {
            var width1 = Math.round(4 * this.fakeZ * this.fakeZ);
            if (width1 > 2) {
                // draw the star image.
                //this.drawContext.drawImage(this.starImage, Math.round(this.x), Math.round(this.y), width1, width1);
                this.drawContext.fillStyle = colors[this.colorIndex];
                this.drawContext.globalAlpha = 0.4 + 0.6 * Math.abs(Math.cos(this.timeShift + Date.now() / 200));
               //this.drawContext.fillStyle = '#e8e8e8';
                this.drawContext.fillRect(Math.round(this.x), Math.round(this.y), 3.2, 3.2);
            } else {
                // too small star : just draw a point
                //    this.drawContext.fillStyle = '#e8e8e8';
                this.drawContext.fillStyle = colors[this.colorIndex];
                this.drawContext.globalAlpha = 0.4 + 0.6 * Math.abs(Math.cos(this.timeShift + Date.now() / 200));
                this.drawContext.fillRect(Math.round(this.x), Math.round(this.y), 1.2, 1.2);
            }
            },

        //    var width1 = Math.round(4 * this.fakeZ * this.fakeZ);
        //    this.drawContext.fillStyle = colors[this.colorIndex];
        //    this.drawContext.globalAlpha = 0.4 + 0.6 * Math.abs(Math.cos(this.timeShift + Date.now() / 200));
        //    this.drawContext.fillRect(Math.round(this.x), Math.round(this.y), width1, width1);
        //},

        spawn: function (particleLoopBuffer, firstIndex, lastIndex) {
            var w = this.fieldWidth,
                h = this.fieldHeight;
            var index = firstIndex;
            var length = particleLoopBuffer.length;
            var particle = null;
            while (true) {
                particle = particleLoopBuffer[index];
                // ---- initialise here -----
                particle.x = w * Math.random();
                particle.y = h * Math.random();
                particle.fakeZ = 0.08 + Math.pow(Math.random(), 1.4) * 0.92; // far stars are more likely.
                particle.speed = this.starSpeed * w * particle.fakeZ / (1000); // speed related to depth. 	
                particle.colorIndex = 0 | (particle.fakeZ * colors.length);
                particle.timeShift = Math.random() * 100;
                // ---------------------------
                if (index == lastIndex) break;
                index++;
                if (index == length) index = 0;
            }
            particleLoopBuffer.sort(function (a, b) {
                if (!a.fakeZ * b.fakeZ) return 1;
                return (a.fakeZ - b.fakeZ)
            });
        }
    };
});