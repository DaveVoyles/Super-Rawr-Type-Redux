ig.module(
	'game.gui'
)
.requires(
	'impact.game',
	'impact.font'
	)
.defines(function () {
    gui = ig.Game.extend({
    
     	font:             new ig.Font ('media/fonts/04b03_16.font.png'                  ),
        xFinBlue_sm:      new ig.Font ('media/fonts/xfinFont-blue-sm.png'               ),                  
        scanlines:        new ig.Image('media/backgrounds/scan-lines.png'               ),
        lifeSprite:       new ig.Image('media/ui/ship_lifebar.png'                      ),
        statMatte:        new ig.Image('media/ui/stat-matte.png'                        ),
        transTextBG_left: new ig.Image('media/ui/transTextBG_Lg1.png'                   ),
        transTextBG_Lg:   new ig.Image('media/ui/transTextBG_Lg.png'                    ),
        bulletTimeSprite: new ig.Image('media/ui/BulletTimeDisplayBar1.png'             ),
        title:            new ig.Image('media/textures/star.png'       					),
        hudOffsetX:       20,
        hudOffsetY:       20,                 
    
    init: function(x,y,settings){
    
    },
    draw: function(){
         this.drawHUD();
    },
    update: function(){
    console.log('is this being called?');
    },
            drawHUD: function () {
            if (!ig.game.menu) {
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

            } else if (ig.game.mode == RType.MODE.TITLE) {
                ig.game.drawTitle();
            }
        },
    
    });
});
