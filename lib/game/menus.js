/***********************************************************
 *  @menus.js
 *
 *  @copyright: (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *  @author:     Dave Voyles
 *  @date:       August 2013
 **********************************************************/
ig.module(
    'game.menus'
)
 .requires(
    'impact.font'
  , 'game.UI.instructionScreen'
)
    .defines(function () { "use strict";

    window.MenuItem = ig.Class.extend({
        getText: function () {
            return 'none'
        },
        left:  function () {},
        right: function () {},
        ok:    function () {},
        click: function () {
            ig.system.canvas.style.cursor = 'auto';
            this.ok();
        }
    });
    window.Menu = ig.Class.extend({
        clearColor:   null,
        name:         null,
        font:         new ig.Font('media/fonts/xfinFont.png'         ),
        fontSelected: new ig.Font('media/fonts/xfinFont-blue-sel.png'),
        current:      0,
        itemClasses:  [],
        items:        [],

        init: function () {
            this.y = ig.system.height / 4 + 160;
            for (var i = 0; i < this.itemClasses.length; i++) {
                this.items.push(new this.itemClasses[i]());
            }
        },
        update: function () {
            if (ig.input.pressed('up')) {
                this.current--;
            }
            if (ig.input.pressed('down')) {
                this.current++;
            }
            this.current = this.current.limit(0, this.items.length - 1);
            if (ig.input.pressed('left')) {
                this.items[this.current].left();
            }
            if (ig.input.pressed('right')) {
                this.items[this.current].right();
            }
            var margin    = ig.ua.mobile ? this.font.height / 2 : 0;
            var ys        = this.y;
            var xs        = ig.system.width / 2;
            var hoverItem = null;
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                var w = this.font.widthForString(item.getText()) / 2 + margin;
                if (ig.input.mouse.x > xs - w && ig.input.mouse.x < xs + w && ig.input.mouse.y > ys - margin && ig.input.mouse.y < ys + this.font.height + margin) {
                    hoverItem    = item;
                    this.current = i;
                }
                ys += this.font.height + 20;
            }
            if (hoverItem) {
                ig.system.canvas.style.cursor = 'pointer';
                if (ig.input.pressed('shoot') || ig.input.pressed ('enter')) {
                    hoverItem.click();
                }
            } else {
                ig.system.canvas.style.cursor = 'auto';
            }
            if (ig.input.pressed('shoot') || ig.input.pressed ('enter')) {
                this.items[this.current].ok();
            }
        },
        draw: function () {

            if (this.clearColor) {
                ig.system.context.fillStyle = this.clearColor;
                ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);
            }
            var xs = ig.system.width / 2;
            var ys = this.y;
            if (this.name) {
                this.font.draw(this.name, xs, ys - 160, ig.Font.ALIGN.CENTER);
            }
            for (var i = 0; i < this.items.length; i++) {
                var t = this.items[i].getText();
                if (i == this.current) {
                    this.fontSelected.draw(t, xs, ys, ig.Font.ALIGN.CENTER);
                } else {
                    this.font.draw(t, xs, ys, ig.Font.ALIGN.CENTER);
                }
                ys += this.font.height + 20;
            }
        }
    });


    /* Menus
    *********************************************/
    window.MenuItemSoundVolume = MenuItem.extend({
        getText: function() {
            return 'Sound Volume: < ' + (ig.soundManager.volume * 100).round() + '% >';
        },
        left: function() {
            ig.soundManager.volume = (ig.soundManager.volume - 0.1).limit(0, 1);
        },
        right: function() {
            ig.soundManager.volume = (ig.soundManager.volume + 0.1).limit(0, 1);
        },
        click: function() {
            if (ig.input.mouse.x > 336) {
                this.right();
            } else {
                this.left();
            }
        }
    });
    window.MenuItemMusicVolume = MenuItem.extend({
        getText: function() {
            return 'Music Volume: < ' + (ig.music.volume * 100).round() + '% >';
        },
        left: function() {
            ig.music.volume = (ig.music.volume - 0.1).limit(0, 1);
        },
        right: function() {
            ig.music.volume = (ig.music.volume + 0.1).limit(0, 1);
        },
        click: function() {
            if (ig.input.mouse.x > 336) {
                this.right();
            } else {
                this.left();
            }
        }
    });
    window.MenuItemEasyMode = MenuItem.extend({
        getText: function () {
            return 'Play Easy Mode';
        },
        ok: function () {
            ig.game.difficulty = 'EASY';
            ig.game.setGame();
        }
    });
    window.MenuItemNormalMode = MenuItem.extend({
        getText: function () {
            return 'Play Normal Mode';
        },
        ok: function () {
            ig.game.difficulty = 'NORMAL';
            ig.game.setGame();
        }
    });
    window.MenuItemHardMode = MenuItem.extend({
        getText: function () {
            return 'Play Hard Mode';
        },
        ok: function () {
            ig.game.difficulty = 'HARD';
            ig.game.setGame();
        }
    });
    window.MenuItemResume = MenuItem.extend({
        getText: function() {
            return 'Resume';
        },
        ok: function() {
            ig.game.toggleMenu();
        }
    });
    window.MenuItemRestart = MenuItem.extend({
        getText: function() {
            return 'Restart Game';
        },
        ok: function() {
            ig.game.setTitle();
        }
    });
    window.MenuItemBlank = MenuItem.extend({
        getText: function() {
            return '';
        }
    });
    window.MenuItemInstructionScreen = MenuItem.extend({
        getText: function(){
            return  'Instructions';
        },
        ok: function(){
           var instructionsScreen = ig.game.getEntityByName('Instructions Screen');
            if (!instructionsScreen){
                ig.game.spawnEntity(EntityInstructionScreen, 0, 0);
                ig.game.mode = window.RType.MODE.INSTRUCTIONS_SCREEN;
                console.log(ig.game.mode);
            } else {
                instructionsScreen.isMarkedForDeath = true;
                ig.game.mode = window.RType.MODE.TITLE;
            }
        }
    });
    window.PauseMenu = Menu.extend({
        init: function() {
            if (ig.Sound.enabled) {
                this.itemClasses.push(MenuItemSoundVolume);
                this.itemClasses.push(MenuItemMusicVolume);
            }
            this.itemClasses.push(MenuItemResume);
            this.itemClasses.push(MenuItemRestart);
            this.parent();
            ig.game.isPaused;
        },
        name:       'Menu',
        clearColor: 'rgba(0,0,0,0.9)'
    });
    window.OptionsMenu = Menu.extend({
        init: function() {
            if (ig.Sound.enabled) {
                this.itemClasses.push(MenuItemSoundVolume);
                this.itemClasses.push(MenuItemMusicVolume);
            }
            this.itemClasses.push(MenuItemResume);
            this.parent();
            ig.game.isPaused;
        },
        name:       'Options',
        clearColor: 'rgba(0,0,0,0.9)'
    });
    window.MenuItemPlay = MenuItem.extend({
        getText: function () {
            return 'Start Game!';
        },
        ok: function () {
            ig.game.setGame();
        }
    });
    window.MenuItemSoundMenu = MenuItem.extend({
        getText: function() {
            return 'Options';
        },
        ok: function() {
            ig.game.toggleMenu();
        }
    });
    window.TitleMenu = Menu.extend({
        init: function () {
            this.itemClasses.push(MenuItemEasyMode);
            this.itemClasses.push(MenuItemNormalMode);
            this.itemClasses.push(MenuItemHardMode);
            if (ig.Sound.enabled) {
                this.itemClasses.push(MenuItemSoundMenu);
            }
            this.itemClasses.push(MenuItemInstructionScreen);
            this.parent();
        }
    });
    window.GameOverMenu = Menu.extend({
        init: function() {
            this.parent();
            this.y = 500;
        },
    //    itemClasses: [MenuItemBack],
        draw: function() {
            var ypos = 100;
            this.font.draw('Game Over', ig.system.width / 2, ypos, ig.Font.ALIGN.CENTER);
            this.font.draw('Score: ' + ig.game.score.zeroFill(6), ig.system.width / 2, ypos + 60, ig.Font.ALIGN.CENTER);
            this.parent();
        }
    });
});