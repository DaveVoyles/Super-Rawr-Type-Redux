ig.module(
	'plugins.impact-tween.weltmeister'
)
.requires(
    'weltmeister.weltmeister',
    'plugins.impact-leveldata.weltmeister',
    'plugins.impact-tween.edit-tween'
)
.defines(function() {

wm.Weltmeister.inject({

	tweens: [], // Used internally by tweens...
	_tweens: [], // Used by weltmeister tween editor
	activeTween: null,
	isDebug: false,
	
    init: function() {
    
        // Load Weltmeister plugin CSS
        $('<link />', {
            rel: 'stylesheet',
            type: 'text/css',
            href: wm.config.project.modulePath + 'plugins/tweening/weltmeister.css'
        }).appendTo('head');
        
        // Create Tween Entity Menu
        $('<div id="tweenEntityMenu"><h2>Select Entity</h2></div>').insertAfter('#entityMenu');
        
        // Create Tween Container
		$('<div id="tweenContainer"> \
    			<h2>Tweens</h2> \
    			<div id="tweens"></div> \
    			<div id="tweenButtons"> \
    				<div class="button" id="buttonAddTween" title="Add Tween">+</div> \
    				<div class="button" id="buttonRemoveTween" title="Remove Tween">x</div> \
    				<div class="clear"></div> \
    			</div> \
    		</div>').insertAfter('#layerContainer');

        // Create Tween Settings element
		$('<div id="tweenSettings"> \
			<h2>Tween Settings</h2> \
			<dl> \
				<dt>Name:</dt><dd><input type="text" class="text" id="tweenName"/></dd> \
				<dt>Duration:</dt><dd><input type="text" class="number" id="tweenDuration"/></dd> \
				<dt>Delay:</dt><dd><input type="text" class="number" id="tweenDelay"/></dd> \
				<dt>Chain:</dt><dd><input type="text" class="text" id="tweenChain"/></dd> \
				<dt>Easing:</dt> \
				<dd> \
				    <select id="tweenEasing"> \
                        <option value="ig.Tween.Easing.Linear.EaseNone">Linear</option>                     \
                        <option value="ig.Tween.Easing.Quadratic.EaseIn">In Quadratic</option>              \
                        <option value="ig.Tween.Easing.Quadratic.EaseOut">Out Quadratic</option>            \
                        <option value="ig.Tween.Easing.Quadratic.EaseInOut">In Out Quadratic</option>       \
                        <option value="ig.Tween.Easing.Cubic.EaseIn">In Cubic</option>                      \
                        <option value="ig.Tween.Easing.Cubic.EaseOut">Out Cubic</option>                    \
                        <option value="ig.Tween.Easing.Cubic.EaseInOut">In Out Cubic</option>               \
                        <option value="ig.Tween.Easing.Quartic.EaseIn">In Quartic</option>                  \
                        <option value="ig.Tween.Easing.Quartic.EaseOut">Out Quartic</option>                \
                        <option value="ig.Tween.Easing.Quartic.EaseInOut">In Out Quartic</option>           \
                        <option value="ig.Tween.Easing.Quintic.EaseIn">In Quintic</option>                  \
                        <option value="ig.Tween.Easing.Quintic.EaseOut">Out Quintic</option>                \
                        <option value="ig.Tween.Easing.Quintic.EaseInOut">In Out Quintic</option>           \
                        <option value="ig.Tween.Easing.Sinusoidal.EaseIn">In Sine</option>                  \
                        <option value="ig.Tween.Easing.Sinusoidal.EaseOut">Out Sine</option>                \
                        <option value="ig.Tween.Easing.Sinusoidal.EaseInOut">In Out Sine</option>           \
                        <option value="ig.Tween.Easing.Exponential.EaseIn">In Exponetial</option>           \
                        <option value="ig.Tween.Easing.Exponential.EaseOut">Out Exponetial</option>         \
                        <option value="ig.Tween.Easing.Exponential.EaseInOut">In Out Exponential</option>   \
                        <option value="ig.Tween.Easing.Circular.EaseIn">In Circular</option>                \
                        <option value="ig.Tween.Easing.Circular.EaseOut">Out Circular</option>              \
                        <option value="ig.Tween.Easing.Circular.EaseInOut">In Out Circular</option>         \
                        <option value="ig.Tween.Easing.Bounce.EaseIn">In Bounce</option>                    \
                        <option value="ig.Tween.Easing.Bounce.EaseOut">Out Bounce</option>                  \
                        <option value="ig.Tween.Easing.Bounce.EaseInOut">In Out Bounce</option>             \
                        <option value="ig.Tween.Easing.Elastic.EaseIn">In Elastic</option>                  \
                        <option value="ig.Tween.Easing.Elastic.EaseOut">Out Elastic</option>                \
                        <option value="ig.Tween.Easing.Elastic.EaseInOut">In Out Elastic</option>           \
                        <option value="ig.Tween.Easing.Back.EaseIn">In Back</option>                        \
                        <option value="ig.Tween.Easing.Back.EaseOut">Out Back</option>                      \
                        <option value="ig.Tween.Easing.Back.EaseInOut">In Out Back</option>                 \
				    </select> \
				</dd> \
				<dd><input type="button" id="buttonSaveTweenSettings" value="Apply Changes" class="button"/></dd> \
			</dl> \
		</div>').insertAfter('#tweenContainer');
		
		// Create Tween Entity Container
        $('<div id="tweenEntityContainer"> \
			<h2>Tween Entities</h2> \
			<div id="tweenEntities"></div> \
			<div id="tweenEntityProperties"></div> \
			<dl id="tweenEntityPropertyInput"> \
				<dt>Key:</dt><dd><input type="text" class="text" id="tweenEntityKey"/></dd> \
				<dt>Value:</dt><dd><input type="text" class="text" id="tweenEntityValue"/></dd> \
			</dl> \
			<div id="tweenEntityButtons"> \
				<div class="button" id="buttonAddTweenEntity" title="Add Tween Entity">+</div> \
				<div class="button" id="buttonRemoveTweenEntity" title="Remove Tween Entity">x</div> \
				<div class="clear"></div> \
			</div> \
		</div>').insertAfter('#tweenSettings');
    
        // Super class init
        this.parent();
        
        // Add custom mode
        this.MODE.TWEENENTITYSELECT = 8;
        
		// Tween bindings
		$('#buttonAddTween').bind( 'click', this.addTween.bind(this) );
		$('#buttonSaveTweenSettings').bind( 'click', this.saveTweenSettings.bind(this) );
		$('#buttonSaveEntities').bind( 'click', this.saveTweenEntities.bind(this) );
        $('#buttonAddTweenEntity').bind( 'click', this.showAddTweenEntityDialog.bind(this) );
        $('#buttonRemoveTweenEntity').bind( 'click', this.removeTweenEntity.bind(this));
        $('#buttonRemoveTween').bind( 'click', this.removeTween.bind(this));
        
        // Hide tween UI
        $('#tweenEntityContainer').hide();
        $('#tweenSettings').hide();
        
        this.registerDataHook(this.dataHook.bind(this));
        
        ig.input.bind(ig.KEY['T'], 'screen');
    },
    
    dataHook: function(data) {
        data.tweens = [];
        for (var i = 0; i < this._tweens.length; i++) {
            data.tweens.push(this._tweens[i].getSaveData());
		}
		return data;
    },
    
    clearTweens: function() {
        for (var i = 0; i < this._tweens.length; i++) {
            this._tweens[i].clear();
        }
        this._tweens = [];
    },
    
    loadNew: function() { 
        this.clearTweens();
        this.parent();
    },
    
	loadResponse: function( data ) {
        this.clearTweens();

		// extract JSON from a module's JS
		var jsonMatch = data.match( /\/\*JSON\[\*\/([\s\S]*?)\/\*\]JSON\*\// );
		var parsedData = $.parseJSON( jsonMatch ? jsonMatch[1] : data );
		
		var activated = false;
		if (parsedData.tweens) {
    		for( var i=0; i < parsedData.tweens.length; i++ ) {
    			var td = parsedData.tweens[i];
                var newTween = new wm.EditTween(td.name);
                newTween.dur = td.dur;
                newTween.entities = td.entities;
                newTween.props = td.props;
                newTween.easing = td.easing;
                newTween.delay = td.delay;
                newTween.chain = (typeof td.chain === 'undefined') ? '' : td.chain;
                this._tweens.push(newTween);
                activated = newTween.name;
    		}
        }
        
        this.parent(data);
        
        if (activated) {
            this.setActiveTween(activated);
        }
	},
	
	// -------------------------------------------------------------------------
	// Tweens
	
    removeTween: function() {
        if (!this.activeTween) {
            return;
        }
        var i = this._tweens.indexOf(this.activeTween);
        if (i == -1) {
            return;
        }
        this.activeTween.clear();
        this._tweens.splice(i, 1);
        this.setActiveTween(null);
    },
    
    removeTweenEntity: function() {
        if (!this.activeTween) {
            return;
        }
        this.activeTween.removeActiveTweenEntity();
    },
	
	addTween: function() {
		var name = 'new_tween_' + this._tweens.length;
		var newTween = new wm.EditTween(name);
		this._tweens.push(newTween);
		this.setActiveTween(newTween.name);
	},
	
	showAddTweenEntityDialog: function(e) {
        if (this.activeTween) {
            this.mode = this.MODE.TWEENENTITYSELECT;
            this.activeTween.showEntityMenu(e.layerX, e.layerY);
        }
	},
	
	addTweenEntity: function(name) {
        this.activeTween.entities.push(name);
		this.setActiveTweenEntity(name);
	},
	
	getTweenWithName: function( name ) {
		for( var i = 0; i < this._tweens.length; i++ ) {
			if( this._tweens[i].name == name ) {
				return this._tweens[i];
			}
		}
		return null;
	},
	
	setActiveTween: function( name ) {
		var previousTween = this.activeTween;
		this.activeTween = this.getTweenWithName(name);
		if( previousTween == this.activeTween ) {
			return; // nothing to do here
		}
		
		if( previousTween ) {
			previousTween.setActive( false );
		}
		
		if (this.activeTween) {
    		this.activeTween.setActive( true );
        }
        
		this.mode = this.MODE.DEFAULT;
		
		this.entities.selectEntity(null);
		if (this.activeTween) {
    		this.setActiveLayer(null);
    		$('#tweenSettings').fadeOut(100, this.updateTweenSettings.bind(this)).fadeIn(100);
    		$('#tweenEntityContainer').fadeOut(100, this.updateTweenEntities.bind(this)).fadeIn(100);

        } else {
            $('#tweenSettings').fadeOut(100);
            $('#tweenEntityContainer').fadeOut(100);
        }
		
		this.draw();
	},
	
	updateTweenSettings: function( ) {
        if (this.activeTween) {
    		$('#tweenName').val( this.activeTween.name );
    		$('#tweenDuration').val( this.activeTween.dur );
    		$('#tweenEasing').val(this.activeTween.easing);
    		$('#tweenDelay').val(this.activeTween.delay);
    		$('#tweenChain').val(this.activeTween.chain);
        }
	},
	
	updateTweenEntities: function( ) {
        if (this.activeTween) {
        }
	},
	
	saveTweenSettings: function() {
		var newName = $('#tweenName').val();
		var newDur = $('#tweenDuration').val();
		var newEasing = $('#tweenEasing').val();
		var newDelay = $('#tweenDelay').val();
		var newChain = $('#tweenChain').val();
		this.activeTween.dur = newDur;
		this.activeTween.easing = newEasing;
		this.activeTween.delay = newDelay;
		this.activeTween.chain = newChain;
		this.activeTween.setName(newName);
		this.updateTweenSettings();
		this.setModified();
		this.draw();
	},
	
	saveTweenEntities: function() {
		this.updateTweenEntities();
		this.setModified();
		this.draw();
	},
	
	updateLayerSettings: function( ) {
        if (this.activeLayer) {
    		$('#layerName').val( this.activeLayer.name );
    		$('#layerTileset').val( this.activeLayer.tilesetName );
    		$('#layerTilesize').val( this.activeLayer.tilesize );
    		$('#layerWidth').val( this.activeLayer.width );
    		$('#layerHeight').val( this.activeLayer.height );
    		$('#layerRepeat').attr( 'checked', this.activeLayer.repeat ? 'checked' : '' );
    		$('#layerLinkWithCollision').attr( 'checked', this.activeLayer.linkWithCollision ? 'checked' : '' );
    		$('#layerDistance').val( this.activeLayer.distance );
        }
        this.parent();
	},
	
	setActiveLayer: function( name ) {
		var previousLayer = this.activeLayer;
		this.activeLayer = ( name == 'entities' ? this.entities : this.getLayerWithName(name) );
		if( previousLayer == this.activeLayer ) {
			return; // nothing to do here
		}
		
		if( previousLayer ) {
			previousLayer.setActive( false );
		}
		
		if (this.activeLayer) {
    		this.activeLayer.setActive( true );
        }
        
		this.mode = this.MODE.DEFAULT;
		
		
		if( name == 'entities' ) {
			$('#layerSettings').fadeOut(100);
			this.setActiveTween(null);
		}
		else {
			this.entities.selectEntity( null );
			if (this.activeLayer) {
                this.setActiveTween(null);
                $('#layerSettings').fadeOut(100,this.updateLayerSettings.bind(this)).fadeIn(100);
            } else {
                $('#layerSettings').fadeOut(100);
            }
		}
		
		this.draw();
	},
	
	keyup: function( action ) {
		if( !this.activeLayer && !this.activeTween ) {
			return;
		}
		
		if( action == 'delete' ) {
			this.entities.deleteSelectedEntity();
			this.setModified();
		}
		
		else if( action == 'clone' ) {
			this.entities.cloneSelectedEntity();
			this.setModified();
		}
		
		else if( action == 'menu' ) {
			if( this.mode != this.MODE.TILESELECT && this.mode != this.MODE.ENTITYSELECT && this.mode != this.MODE.TWEENENTITYSELECT ) {
				if( this.activeLayer == this.entities ) {
					this.mode = this.MODE.ENTITYSELECT;
					this.entities.showMenu( ig.input.mouse.x, ig.input.mouse.y );
				}
				else if (this.activeTween) {
				    this.mode = this.MODE.TWEENENTITYSELECT;
				    var doc = $(document);
				    this.activeTween.showEntityMenu(doc.width() / 2, doc.height() / 2);
				}
				else {
					this.mode = this.MODE.TILESELECT;
					this.activeLayer.tileSelect.setPosition( ig.input.mouse.x, ig.input.mouse.y	);
				}
			} else {
				this.mode = this.MODE.DEFAULT;
				this.entities.hideMenu();
				if (this.activeTween) {
				    this.activeTween.hideEntityMenu();
				}
			}
		}
		
		
		if( action == 'draw' ) {			
			// select tile
			if( this.mode == this.MODE.TILESELECT ) {
				this.activeLayer.brush = this.activeLayer.tileSelect.endSelecting( ig.input.mouse.x, ig.input.mouse.y );
				this.mode = this.MODE.DEFAULT;
			}
			else if( this.activeLayer == this.entities ) {
				this.undo.endEntityEdit();
			}
			else if( this.activeLayer ) {
				if( this.activeLayer.isSelecting ) {
					this.activeLayer.brush = this.activeLayer.endSelecting( ig.input.mouse.x, ig.input.mouse.y );
				}
				else {
					this.undo.endMapDraw();
				}
			}
		}
		
		if( action == 'undo' ) {
			this.undo.undo();
		}
		
		if( action == 'redo' ) {
			this.undo.redo();
		}
		
		this.draw();
		this.mouseLast = {x: ig.input.mouse.x, y: ig.input.mouse.y};
	}

});

});