ig.module(
    'plugins.impact-tween.edit-tween'
)
.requires(
    'plugins.impact-tween.tween'
)
.defines(function(){

wm.EditTween = ig.Class.extend({

    name: null,
    div: null,
    dur: 1,
    active: true,
    easing: 'ig.Tween.Easing.Linear.EaseNone',
    delay: 0,
    chain: '',
    entities: [],
    entityMenu: null,
    activeTweenEntity: null,
    props: [],
    _settingCallback: null,
    tween: null,
    drawLoop: null,
    
    init: function(name) {
        this.setName(name);
        this.div = $( '<div/>', {
            'class': 'tween tweenActive', 
            'id': ('tween_' + this.name),
            'mouseup': this.click.bind(this)
        });
        this.entityMenu = $('#tweenEntityMenu');
        this.resetDiv();
        $('#tweens').prepend( this.div );
        this._settingCallback = this.setTweenEntitySetting.bind(this);
    },
    
    clear: function() {
        this.div.remove();
    },
    
    setName: function( name ) {
        this.name = name.replace(/[^0-9a-zA-Z]/g, '_');
        if (this.div) {
            this.resetDiv();
        }
    },
    
    setActive: function( active ) {
        this.active = !!active;
        if( active ) {
            this.div.addClass( 'tweenActive' );
            this.resetEntities();
            $('#tweenEntityValue').bind('keydown', this._settingCallback);
        } else {
            this.div.removeClass( 'tweenActive' );
            $('#tweenEntityValue').unbind('keydown', this._settingCallback);
        }
    },
    
    resetDiv: function() {
        this.div.html(
            '<span class="name">' + this.name + '</span> '
            + '<span class="play" title="Play">' 
                + '&#x25B7;' + ' </span> '
            + '<span class="rewind inactive" title="Rewind">'
                + '&#x21BA;' + ' </span>'
        );
        this.div.children('.play').bind('mousedown', this.playTweenClick.bind(this) );
        this.div.children('.rewind').bind('mousedown', this.rewindTweenClick.bind(this) );
    },
    
    resetEntityMenu: function() {
        $('div[id^="tweenEntityMenu_"]', this.entityMenu).remove();
    
        // Note original value of each property in orig object
        for (var name in ig.game.entities.namedEntities) {
            if (ig.game.entities.namedEntities.hasOwnProperty(name) 
                && $.inArray(name, this.entities) == -1
            ) {
                var a = $('<div/>', {
                    id: 'tweenEntityMenu_' + name,
                    html: name,
                    mouseup: this.newTweenEntityClick.bind(this)
                });
                this.entityMenu.append(a);
            }
        }
    },
    
    resetEntities: function() {
        this.activeTweenEntity = null;
        var oldEntities = ig.copy(this.entities);
        this.entities = [];
        $('#tweenEntities').empty();
        for (var i = 0; i < oldEntities.length; i++) {
            this.addTweenEntity(oldEntities[i]);
        }
        this.resetEntityProperties();
    },
    
    showEntityMenu: function( x, y ) {
        this.resetEntityMenu();
        this.entityMenu.css({top: y, left: x});
        this.entityMenu.show();
    },
    
    hideEntityMenu: function( x, y ) {
        ig.editor.mode = ig.editor.MODE.DEFAULT;
        this.entityMenu.hide();
    },
    
    click: function() {
        ig.editor.setActiveTween(this.name);
    },
    
    playTweenClick: function(e) {
    
        if (this.tween) {
            return;
        }
            
        var objs = [],
            props = [],
            self = this;
            
        for (var i = 0; i < this.entities.length; i++) {
            objs.push(ig.game.entities.getEntityByName(this.entities[i]));
            var p = {},
                op = p;
            for (var j in this.props[i]) {
                var pieces = j.split('.');
                for (var k = 0; k < pieces.length - 1; k++) {
                    p[pieces[k]] = {};
                    p = p[pieces[k]];
                }
                p[pieces[pieces.length - 1]] = this.props[i][j];
            }
            props.push(op);
        }
        
        this.tween = new ig.Tween(objs, props, this.dur, {
            onComplete: function() {
                clearInterval(self.drawLoop);
                self.drawLoop = null;
            },
            easing: eval(this.easing),
            delay: this.delay
        });
        
        this.tween.start();
        
        this.drawLoop = setInterval(function() {
            ig.Timer.step();
            self.tween.update();
            
            // Hack to force background maps to scroll with screen when tweening
			for( var i = 0; i < ig.game.layers.length; i++ ) {
				ig.game.layers[i].setScreenPos(ig.game.screen.x, ig.game.screen.y);
			}
			
            ig.game.draw();
        }, 10);
        this.div.children('.rewind').removeClass('inactive');
        this.div.children('.play').addClass('inactive');
    },
    
    rewindTweenClick: function(e) {

        if (!this.tween) {
            return;
        }
        
        if (this.drawLoop) {
            this.tween.onComplete();
        }
        this.tween.rewind();
        this.tween = null;
        this.div.children('.play').removeClass('inactive');
        this.div.children('.rewind').addClass('inactive');
        
        // Hack to force background maps to scroll with screen when tweening
		for( var i = 0; i < ig.game.layers.length; i++ ) {
			ig.game.layers[i].setScreenPos(ig.game.screen.x, ig.game.screen.y);
		}

        ig.game.draw();
        
    },
    
    newTweenEntityClick: function(e) {
        var name = e.target.id.split('_', 2)[1];
        this.addTweenEntity(name);
        this.hideEntityMenu();
    },
    
    addTweenEntity: function(name) {
        this.entities.push(name);
        var self = this,
            entity = $('<div/>', {
                id: 'tweenEntity_' + name,
                className: 'tweenEntity',
                html: name
            }).click(function() {
                self.setActiveTweenEntity(name);
            });
        $('#tweenEntities').append(entity);
        this.setActiveTweenEntity(name);
    },
    
    removeActiveTweenEntity: function() {
        if (!this.activeTweenEntity) {
            return;
        }
        var i = this.entities.indexOf(this.activeTweenEntity);
        if (i == -1) {
            return;
        }
        this.props.splice(i, 1);
        this.entities.splice(i, 1);
        this.resetEntities();
    },
    
    setActiveTweenEntity: function(name) {
        var previousTweenEntity = this.activeTweenEntity;
        this.activeTweenEntity = name;
        if (this.activeTweenEntity == previousTweenEntity) {
            return;
        }
        $('#tweenEntity_' + previousTweenEntity).removeClass('tweenEntityActive');
        $('#tweenEntity_' + name).addClass('tweenEntityActive');
        this.resetEntityProperties();
    },
    
    resetEntityProperties: function() {
        var index = $.inArray(this.activeTweenEntity, this.entities);
        var html = '';
        for (var name in this.props[index]) {
            if (this.props[index].hasOwnProperty(name)) {
                html += '<div class="tweenEntityProperty"><span class="key">' + name + '</span>:<span class="value" id="entityProperty' 
                    + name + '">' + this.props[index][name] + '</span></div>';
            }
        }
        $('#tweenEntityProperties').html(html);
        $('.tweenEntityProperty').bind('mouseup', this.selectTweenEntitySetting);
    },
    
	selectTweenEntitySetting: function(e) {
		$('#tweenEntityKey').val( $(this).children('.key').text() );
		$('#tweenEntityValue').val( $(this).children('.value').text() );
		$('#tweenEntityValue').select();
	},
	
	setTweenEntitySetting: function(e) {
		if(e.which != 13) {
			return true;
		}
		var key = $('#tweenEntityKey').val();
		var value = $('#tweenEntityValue').val();
		var floatVal = parseFloat(value);
		if(value == floatVal) {
			value = floatVal;
		}
		
        var index = $.inArray(this.activeTweenEntity, this.entities);
        if (!this.props[index]) {
            this.props[index] = {};
        }
        if (value === '' && this.props[index].hasOwnProperty(key)) {
            delete this.props[index][key];
        } else {
            this.props[index][key] = value;
        }
		
		ig.game.setModified();
		ig.game.draw();
		
		$('#tweenEntityKey').val('');
		$('#tweenEntityValue').val('');
		$('#tweenEntityValue').blur();
		this.resetEntityProperties();
		
		$('#tweenEntityKey').focus(); 

		return false;
	},
	
	getSaveData: function() {
		return {
			name: this.name,
			dur: this.dur,
			easing: this.easing,
            entities: this.entities,
            props: this.props,
            delay: this.delay,
            chain: this.chain
		};
	}

});

});
