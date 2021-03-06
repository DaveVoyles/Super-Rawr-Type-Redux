﻿/*******************************************************************************
 *  @actor-enemyBoss.js
 *
 *  @author:    Dave Voyles
 *  @date:      August 2013
 *  @copyright: (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @desc:      First level boss. Contains all entities that boss uses as well.
 ******************************************************************************/
ig.module(
	'game.entities.actor-enemyBoss'
)
.requires(
    'game.entities.base-enemy',
    'game.entities.object-healthbar'
   ,'game.entities.object-healthbar-boss'
)
.defines(function () {

window.EntityActorEnemyBoss = EntityBaseEnemy.extend({

    animSheet:         new ig.AnimationSheet('media/textures/animBossShipLg.png', 248, 362),
    destroyPorts:      new ig.Image('media/textures/destroy-ports.png'                    ),
    deathBlow:         new ig.Image('media/textures/death-blow1.png'                      ),
    name:              'Boss',
    size:              { x:  80, y: 140 },
    offset:            { x: 140, y: 110 },
    vel:               { x: -71, y:   0 },
    health:            150,
    MaxHealth:         150,
    bHasStopped:       false,  
    bWPExposed: 	   false,
    canTakeDmg:    	   false,
    shootTimer:    	   null,
    moveTimer:     	   null,
    animTimer:         null,
    pullTimer:         null,
    turRespawnTimer:   null,
    newSpawnTimer:     null,
    deathBlowTimer:    null,
    lastHeardTimer:    null,   
    deathBlowTime:     3,
    turrRespawnTime:   6,
    animTime:          4,
    xModifier:         100,
    initTime:          2,
    shootSpeed:        0.1,
    rotation:          1.4,
    rotTime:           1,
    spawnTime:         3,
    rotateTime:        1,
    pullTime:          2.2,
    pullVel:           130, 
    particleCnt:       40,
    animSpeed:         0.3,
    shakeVel:          40,
    shakeTime:         1, 
    stopPos:           300,
    pullPlayerDist:    800,
    statTurretsArr:    [],
    rotTurretsArr:     [],
    WPArr:     		   [],
    bSpawnWeakPt:      true,
    bSpawnRot:         true,
    bSpawnStat:        true,
    bPulling:          false,
    bCanCreateHealth:  false,
    bHasDrawHealth:    false,
    bSpawnAddRotTur:   true,
    bCanDrawDeathBlow: false,
    bCreateDBTimer:    true,
    isFilling:         false,
    wasFilling:        false,
    healthBars:        null,
    type:         	   ig.Entity.TYPE.A,
    checkAgainst:      ig.Entity.TYPE.A,
    collides:          ig.Entity.COLLIDES.NEVER,

    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.addAnim('idle',  0.1, [0]), true;
   	    this.animTimer 	     = new ig.Timer(this.animTime);
        this.shootTimer      = new ig.Timer(this.randomFromTo(3, 5));
        this.moveTimer       = new ig.Timer(this.randomFromTo(2, 4));
        this.newSpawnTimer   = new ig.Timer(this.spawnTime);
        this.lastShootTimer  = new ig.Timer(0);
        this.rotateTimer     = new ig.Timer(this.rotateTime);
        this.pullTimer       = new ig.Timer(this.pullTime);
        this.lastHeardTimer  = new ig.Timer(0.009);
        ig.game.boss         = this;
        this.pos.y           = ig.system.height / 3;
        ig.music.crossFade(1.8, 'bossMusic');

        /* vars for gun */
        this._angle         = -500;
        this._increase      = 60;
        this.bullets        = 4  
        this.radius         = 10;
        this._entityBullet  = EntityObjectEnemyBulletGreen;
    },
    update: function () {
        this.parent();
        this.parental = ig.game.enemySpawner;
        // Stop when on screen
        if (this.pos.x + this.stopPos  <= this.parental.pos.x) {
            this.vertMovement();
            this.checkAnims();
            this.checkHealth();
            this.checkCanTakeDmg();
            this.checkCanWPTakeDmg();
            this.checkBounds();
            this.bHasStopped = true
        }
    },
    createHealthBar: function () {
        if (this.bCanCreateHealth === true && this.bHasDrawHealth === false) {
            this.bCanCreateHealth = false;
            this.bHasDrawHealth   = true;
            this.healthBars       =  ig.game.spawnEntity(EntityHealthBarBoss, 0, 0, { Unit: this });
            window.SoundSource.blastoff.play();
        }
    },
    draw: function () {
        this.parent();
        this.drawDestroyPorts();
        this.drawDeathBlowText();
    },
    drawDestroyPorts: function () {
        if (!this.bHasStopped) {
            this.destroyPorts.draw(this.pos.x - 380, this.pos.y - 120)
        }
    },
    drawDeathBlowText: function () {
        if (this.deathBlowTimer) {
            var d2 = -this.deathBlowTimer.delta();
            var a2 = d2 > 1.7 ? d2.map(2, 1.7, 0, 1) : (d2 < 1 ? d2 : 1);
            this.deathBlow.alpha = Math.max(a2, 0);
            this.deathBlow.draw(this.pos.x - 280, this.pos.y - 120)
            this.deathBlow.alpha = 1;
            if (d2 < 0) {
                this.deathBlowTimer  = null;
                this.bCreateDBTimer  = false;
            }
        } 
    },
    /* change behaviour based on current health */      
    checkHealth: function () {
        if (this.health <= 150)   {
            this.checkSpawnStatTurrets();
            this.checkSpawnWeakPoints();	// NOTE: Keep this here, so that it draws on TOP of boss
            this.checkSpawnRotTurrets();
        } if (this.health === 110) {
             ig.game.screenShaker.timedShake(this.shakeVel, this.shakeTime);
        } if (this.health <= 110)  {
            this.pullPlayer()
            this.checkSpawnRotTurrets();
        } if (this.health === 70) {
             ig.game.screenShaker.timedShake(this.shakeVel, this.shakeTime);
        } if (this.health <= 70) {
            this.shootBullets(-90, -14);
        } if (this.health === 50) {
             ig.game.screenShaker.timedShake(this.shakeVel, this.shakeTime);
        } if (this.health <= 30)  {
             this.spawnAddRotTurrets();
             ig.game.screenShaker.timedShake(this.shakeVel, this.shakeTime);
        } if (this.health <= 0 ){
            this.kill();
        }

    },
    vertMovement: function () {
        if (this.moveTimer.delta() > 0) {
            this.moveToPlayer();
            this.moveTimer.reset();
        }
    },
    checkBounds: function () {
        if (this.pos.x <= ig.system.width / .4) {
            this.vel.x = 0;
        } if (this.pos.y >= ig.system.height - 280) {
            this.pos.y    = ig.system.height - 280;
        } if (this.pos.y <= 140) {
            this.pos.y    = 140;
        }
    },
    checkSpawnStatTurrets: function () {
        if (this.bSpawnStat) {
            this.statTurrets = ig.game.getEntitiesByType(EntityStatTurret);
            if (this.statTurrets.length === 0) {
                var topStatTur = this.statTurretsArr.push(ig.game.spawnEntity(EntityStatTurret,    this.pos.x, this.pos.y,
                    { xOffset: -140, yOffset: -26, shotDir: 'up' }));
                var bottomStatTur = this.statTurretsArr.push(ig.game.spawnEntity(EntityStatTurret, this.pos.x, this.pos.y,
                    { xOffset: -138, yOffset: 160, shotDir: 'down' }));
            }
            this.bSpawnStat = false;
        }
    },
    checkSpawnRotTurrets: function () {
        if (this.bSpawnRot) {
	        this.rotTurrets = ig.game.getEntitiesByType(EntityRotTurret);
	        if (this.rotTurrets.length === 0) {
	            this.rotTurretsArr.push(ig.game.spawnEntity(EntityRotTurret, this.pos.x, this.pos.y,
                    { yOffset:  200, xOffset: -80, shotDir: 'down' }));
	            this.rotTurretsArr.push(ig.game.spawnEntity(EntityRotTurret, this.pos.x, this.pos.y,
                    { yOffset: -200, xOffset: -80, shotDir: 'down', rotAngle: '-'}));
	        }
        this.bSpawnRot = false;
        }
    },
    checkSpawnWeakPoints: function () {
        if (this.bSpawnWeakPt) {
            this.entityWeakPoints = ig.game.getEntitiesByType(EntityWeakPoint);
            if (this.entityWeakPoints.length === 0) {
                var topWP = this.WPArr.push(ig.game.spawnEntity(   EntityWeakPoint, this.pos.x, this.pos.y,
                    { xOffset: 0, yOffset: -97 }));
                var centerWP = this.WPArr.push(ig.game.spawnEntity(EntityWeakPoint, this.pos.x, this.pos.y,
                    { xOffset: -64, yOffset: +30 }));
                var bottomWP = this.WPArr.push(ig.game.spawnEntity(EntityWeakPoint, this.pos.x, this.pos.y,
                    { xOffset: 0, yOffset: +156 }));
            }
        }
        this.bSpawnWeakPt = false;
    },
    spawnAddRotTurrets: function () {
        if (this.bspawnAddRotTur) {
            this.rotTurretsArr.push(ig.game.spawnEntity(EntityRotTurret, this.pos.x, this.pos.y,
                { yOffset:  200, xOffset: -80, shotDir: 'down'                }));
            this.rotTurretsArr.push(ig.game.spawnEntity(EntityRotTurret, this.pos.x, this.pos.y,
                { yOffset: -200, xOffset: -80, shotDir: 'down', rotAngle: '-' }));
        }
        this.bspawnAddRotTur = false;
    },
    /* Show weak points based on animTimer. If visible, then can take DMG */
	checkAnims: function(){
		if (!this.bWPExposed && this.animTimer.delta() > 0 ){
	      	  this.currentAnim = this.addAnim('opening',  this.animSpeed, [0, 1, 2, 3, 4], true);
		  	  this.bWPExposed  = true;
		  	  this.animTimer.set(this.animTime);
		}
		if (this.bWPExposed && this.animTimer.delta() > 0 ){
		  	  this.currentAnim = this.addAnim('closing',  this.animSpeed, [4, 3, 2, 1, 0], true);
		      this.bWPExposed  = false;
		      this.animTimer.set(this.animTime);
		} 	  
	},
    /* check if weak points are killed -- if so, take DMG 
     * Also, draw deathBlowText to tell user of weak point
     */
	checkCanTakeDmg: function () {
	    var  length = ig.game.getEntitiesByType(EntityWeakPoint).length;    
	        if (length == 0) {
                this.canTakeDmg        = true;
                this.type = ig.Entity.TYPE.B;
                this.bCanCreateHealth = true;
                this.createHealthBar();
                this.bCanDrawDeathBlow = true;
                if (this.bCanDrawDeathBlow === true && this.bCreateDBTimer === true) {
                    if (!this.deathBlowTimer) {
                        this.deathBlowTimer = new ig.Timer(this.deathBlowTime);
                    }
                }
            }  
    },
    /* If ports are open, weak points can take dmg, otherwise return */
	checkCanWPTakeDmg: function () {
	    for (var i = 0; i < this.WPArr.length; i++) {
	        if (this.bWPExposed === true) {
	            this.WPArr[i].canTakeDmg = true;
	        } else {
	            this.WPArr[i].canTakeDmg = false;
	        }
	    }
	},
	pullPlayer: function () {
	    if (this.distanceTo(ig.game.player) < this.pullPlayerDist) {
	        if (!this.bPulling && this.pullTimer.delta() > 0) {
	            this.bPulling = true;
	            ig.game.screenShaker.timedShake(25, this.pullTime);
	            this.pullTimer.reset();
	        } if (this.bPulling && this.pullTimer.delta() > 0) {
	            this.bPulling = false;
	            this.pullTimer.reset();
	        }
	        if (ig.game.player.pos.x > this.pos.x) {
	            this.bPulling = false;
	        }
	    }
	    if (this.bPulling) {
	        ig.game.player.vel.x = this.pullVel;
	    } else {
	        ig.game.player.vel.x = ig.game.player.vel.x;
	    }
	},
	receiveDamage: function (value, from) {
	    if (this.canTakeDmg === false) {
	        return;
	    } else {
	        this.parent(value, from);
	        if (this.health > 1) {
	            this.spawnParticles();
	        }
	    }
	},
	spawnParticles: function () {
	    var x = this.pos.x + (this.size.x >> 1 );
	    var y = this.pos.y + (this.size.y >> 1 );
	    ig.game.fragmentSpawner.spawn(x, y,FragmentSpawner.grey , this.particleCnt , this.size.x);
        ig.game.fragmentSpawner.spawn(x, y,FragmentSpawner.red ,  this.particleCnt , this.size.x);
	},
    kill: function(){
        ig.game.mode = window.RType.MODE.GAME_OVER; // Needed to trigger the gameOverScreen
        ig.game.createGameOverScreen();             // Checks if MODE = Game_Over
        this.parent();
    }
});


/***********************************************
 * @EntityStatTurret
 *
 * @Desc: Stationary turret attached to boss
 **********************************************/
EntityStatTurret = EntityBaseEnemy.extend({

    animSheet:    new ig.AnimationSheet('media/textures/actor-playerShip-invis.png', 24, 24),
    font:         new ig.Font('media/fonts/xfinFont.png'                                   ),
    size:         { x:  20, y:  20 },
    offset:       { x:   0, y:   0 },
    friction:     { x: 800, y: 800 },
    maxVel:       { x: 300, y: 300 },
    angle:        -Math.PI / 2,
    speed:        200,
    health:       12,
    respawnDelay: 2,
    shootFreq:    0.35,
    rotation:     1.4,
    rotDist:      0.4,      // Inverse: lower is more dist
    shotLength:   1.9,
    particleCnt:  30,
    lifeTimer:    null,
    xOffset:      null,
    yOffset:      null,
    shotDir:      'up',
    type:         ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.C,
    
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.addAnim('idle', 60, [0]);
        this.addAnim('shoot', 0.05, [3, 2, 1, 0], true);
        this.lastShootTimer = new ig.Timer(0);
        this.shotDir        = settings.shotDir || 'up';
        this.xOffset        = settings.xOffset || this.xOffset;
        this.yOffset        = settings.yOffset || this.yOffset;
    },
    update: function () {
        if (this.currentAnim.loopCount > 0) { this.currentAnim = this.anims.idle; }
        this.parent();
        this.parental = ig.game.boss;
        this.pos.x    = this.parental.pos.x + this.xOffset;
        this.pos.y    = this.parental.pos.y + this.yOffset;
        this.adjShootAngle();

    },
    adjShootAngle: function(){
        if ((0 | (ig.Timer.time * 1)) & 1) {
            this.currentAnim.angle -= this.rotation * ig.system.tick;
            if (this.shotDir === 'up'){
                this.checkShoot();
            }
        } else {
            this.currentAnim.angle += this.rotation * ig.system.tick;
            if (this.shotDir === 'down') {
                this.checkShoot();
            }
        }
    },
    checkShoot: function () {
        var isShooting = true;
            if (isShooting && this.lastShootTimer.delta() > 0) {
                this.shoot();
                this.lastShootTimer.set(this.shootFreq);
            }
    },
    receiveDamage: function (value, from) {
            this.parent(value, from);
            if (this.health > 1) {
                this.spawnParticles();
            }
    },
    shoot: function () {
        ig.game.spawnEntity(EntityEnemyTurretBullet, this.pos.x, this.pos.y, {
            angle: this.currentAnim.angle });
    },
    kill: function () {
        this.spawnParticles();
        ig.game.screenShaker.timedShake(50, 1);
        window.SoundSource.teleport.play();
        this.parent();
    },
    spawnParticles: function () {
        var x = this.pos.x + (this.size.x >> 1 );
        var y = this.pos.y + (this.size.y >> 1 );

	    ig.game.fragmentSpawner.spawn(x, y,FragmentSpawner.grey , this.particleCnt , this.size.x);
        ig.game.fragmentSpawner.spawn(x, y,FragmentSpawner.blue , this.particleCnt , this.size.x);        
    }
});


/*****************************
 * @EntityRotTurret
 *
 * @Desc: Turret rotates around boss
 ****************************/
EntityRotTurret = EntityBaseEnemy.extend({

    animSheet:    new ig.AnimationSheet('media/textures/chomper-lg.png', 47, 40),
    size: 	      { x:  24, y:  20 },
    offset:       { x:  +8, y: +10 },
    font:         new ig.Font('media/fonts/xfinFont.png'                                 ),
    bulletImage:  new ig.Image('media/textures/plasma_b_R.png'                           ),
    friction:     { x: 800, y: 800 },
    maxVel:       { x: 300, y: 300 },
    angle:        -Math.PI / 2,
    speed:        200,
    health:       10,
    respawnDelay: 2,
    shootFreq:     1,
    rotSpeed:     .03,
    lifeTimer:    null,
    radius:       100,     // How far away from center should hit area be positioned
    shotDir:     'up',
    rotAngle:     '+',
    xOffset:      null,
    yOffset:      null,
    particleCnt:  30,
    type:         ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.C,
    
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.lastShootTimer = new ig.Timer(0);
        this.addAnim('fly',0.1,  [0,1,2,1,0]);
        this.xOffset     = settings.xOffset     || this.xOffset;
        this.yOffset     = settings.yOffset     || this.yOffset;
        this.shotDir     = settings.shotDir     || this.shotDir;
        this.rotAngle    = settings.rotAngle    || this.rotAngle;
        this.radius      = settings.radius      || this.radius;
        this.bulletImage = settings.bulletImage || this.bulletImage;
    },
    update: function () {
        this.parent();
        this.parental = ig.game.boss;
        this.checkShoot();
    
        // Set position based on parental position
        var x = (this.parental.pos.x + this.parental.size.x / 2) + Math.cos(this.angle) * this.radius;
        var y = (this.parental.pos.y + this.parental.size.y / 2) + Math.sin(this.angle) * this.radius;

        // Rotate around boss
        this.pos.x = x + this.xOffset;
        this.pos.y = y + this.yOffset;
        this.setRotAngle();
    },
    setRotAngle: function (rotAngle) {
        if (this.rotAngle === '+') {
            this.angle = this.angle += this.rotSpeed;
        } else {
            this.angle = this.angle -= this.rotSpeed;
        }
    },
    checkShoot: function () {
        var isShooting = true;
        if (isShooting && this.lastShootTimer.delta() > 0) {
            this.shoot();
            this.lastShootTimer.set(this.shootFreq);
        }
    },
    shoot: function () {
        ig.game.spawnEntity(EntityEnemyTurretBullet, this.pos.x, this.pos.y +9, {
            angle: -this.currentAnim.angle, image: this.bulletImage
        });
    },
    kill: function () {
        this.spawnParticles();
        ig.game.screenShaker.timedShake(50, 1);
        window.SoundSource.teleport.play();
        this.parent();
    },
    spawnParticles: function () {
     	    var x = this.pos.x + (this.size.x >> 1 );
	        var y = this.pos.y + (this.size.y >> 1 );

	    ig.game.fragmentSpawner.spawn(x, y, FragmentSpawner.grey,   this.particleCnt, this.size.x);
        ig.game.fragmentSpawner.spawn(x, y, FragmentSpawner.yellow, this.particleCnt, this.size.x);
     },
    receiveDamage: function (value, from) {
        this.parent(value, from);
        if (this.health > 1) {
            this.spawnParticles();
            window.SoundSource.hit.play();
        }
    }
});

/*********************************************************************************
 * @EntityWeakPoint
 *
 * @Desc:   Vulnerable spot on the boss for players to attack
 * @Params: accepts int to determine the X and Y pos offset based on boss location
 ********************************************************************************/
EntityWeakPoint = EntityBaseEnemy.extend({

    // animSheet: new ig.AnimationSheet('media/textures/hitBox.png', 40, 100),
    size:         { x: 38, y: 80 },
    xOffset:  	  null,
    yOffset:      null,
    health:       8, // 10 is normal
    MaxHealth:    8, // 10 is normal
    canTakeDmg:   true,
    type:         ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.C,
    collides: 	  ig.Entity.COLLIDES.NEVER,

    init: function(x,y, settings) {
        this.parent(x,y, settings);
   //     this.addAnim('idle', 60, [0]);
        this.xOffset = settings.xOffset || this.xOffset;
        this.yOffset = settings.yOffset || this.yOffset;
        ig.game.spawnEntity(EntityHealthBar, this.pos.x, this.pos.y, { Unit: this });
    },
    update: function() {
        this.parent();
        this.parental = ig.game.boss;

        this.pos.x = this.parental.pos.x + this.xOffset;
        this.pos.y = this.parental.pos.y + this.yOffset;
    },        
    kill: function () {
        this.spawnParticles();
        SoundSource.teleport.play();
        ig.game.screenShaker.applyImpulse(150, 300);
        this.parent();
        //ig.game.removeEntity(this);
    },
    receiveDamage: function (value, from) {
        if (this.canTakeDmg === false) {
            return;
        }
        this.parent(value, from);
        if (this.health > 1) {
            this.spawnParticles();
            SoundSource.hit.play();
        }
    },
    spawnParticles: function () {
        var x = this.pos.x + (this.size.x >> 1 );
        var y = this.pos.y + (this.size.y >> 1 );

	    ig.game.fragmentSpawner.spawn(x, y, FragmentSpawner.grey, this.particleCnt, this.size.x);
        ig.game.fragmentSpawner.spawn(x, y, FragmentSpawner.blue, this.particleCnt, this.size.x);
    }
});
    
 /**************************************************************
  * @EntityEnemyTurretBullet
  *
  * @Desc:  Shoots from enemy turret ships
  * @Param: image param can be passed in from entity firing the bullet
  *************************************************************/
EntityEnemyTurretBullet = ig.Entity.extend({

    image:         new ig.Image('media/textures/bossRoundBulletSingle.png'),
    speed:         { x: 5800, y: 300 },
    size:          { x:   30, y:  30 },
    offset:        { x:    0, y:   0 },
    friction:      { x:    0, y:  15 },
    speedModifier: 5,
    angle:         null,
    type:          ig.Entity.TYPE.C,
    checkAgainst:  ig.Entity.TYPE.A,
    collides:      ig.Entity.COLLIDES.PASSIVE,

    init: function (x, y, settings) {
        var noArgs       = (arguments.length == 0);
        this.parent(x, y, settings);
       // this.addAnim('shoot', 0.1, [0,1,2,3,4,5,6], true);
        this.vel.x = Math.cos(this.angle) * this.speed.x;
        this.vel.y = Math.sin(this.angle) * this.speed.y;
        this.bulletCount = (settings && settings.bulletCount) ?
                            settings.bulletCount : 0;
        this.image       = (settings && settings.image)       ?
                            settings.image: new ig.Image('media/textures/bossRoundBulletSingle.png');
    },
    draw: function () {
      //  this.parent();
        ig.system.context.save();
        ig.system.context.translate(this.pos.x - ig.game._rscreen.x, this.pos.y - ig.game._rscreen.y);
        ig.system.context.rotate(-this.angle);
        ig.system.context.drawImage(this.image.data, -this.offset.x, -this.offset.y);
        ig.system.context.restore();
    },
    update: function () {
        this.parent();

        this.pos.x -= this.vel.x * ig.system.tick * this.speedModifier;
        this.pos.y += this.vel.y * ig.system.tick / 2;

        if (this.pos.x > ig.system.width  + 50 ||
            this.pos.y > ig.system.height + 50 ||
            this.pos.x < -50 || this.pos.y < -50) {
            this.kill();
        }
    },
    check: function (other) {
        if (other instanceof EntityActorPlayer) {
            other.receiveDamage(1, this);
            this.kill();
        }
    }
});
});
