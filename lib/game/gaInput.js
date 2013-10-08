(function () {
	

    window.ga = window.ga || {} ;
    
    ga.Constant = ga.Constant ? ga.Constant : {} ;
    
    ga.Constant.areaTypes 		       = {};
    ga.Constant.areaTypes.button       = 0 ;
    ga.Constant.areaTypes.strictButton = 1 ;
    ga.Constant.areaTypes.virtualStick = 2 ;
    ga.Constant.areaTypes.dragSource   = 3 ;
    ga.Constant.areaTypes.dragTarget   = 4 ;
   
    // AreaBase : base class for rectArea, circleArea.
    function AreaBase() {
        defHidProp (this, '_inputInstance',  null);
        this.status = 0;
        this.pressed = false ;
        this.released = false ;
        this.startPoint = {x:-1, y:-1 };
        this.currentPoint = { x:-1, y:-1 };
        this.currentVector = { };
        var that = this;
        Object.defineProperty(this.currentVector, 'x', { get : function() { return (that.currentPoint.x - that.startPoint.x) ; } } );
        Object.defineProperty(this.currentVector, 'y', { get : function() { return (that.currentPoint.y - that.startPoint.y) ; } } );
    }
    var AB_pr = AreaBase.prototype;

    Object.defineProperty( AB_pr, 'attach', { value : function (inputInstance) { this._inputInstance = inputInstance ; } } );

      
    // constructor for a rectangular area
    // coordinates are in world view coordinates.
    // type might be 0 (button) 1 (drag source) or 2 (drag target)
    ga.rectArea = function (x,y,w,h,type) {
    	this.x    = x ;
    	this.y    = y ;
    	this.w    = w ;
    	this.h    = h ;
    	this.type = type ? type : 0 ;  	
    };
    
    ga.rectArea.prototype = Object.create(AreaBase.prototype);
    // takes screen coordinates as input
    // returns wether given point is within this area or not
    ga.rectArea.prototype.inArea = function (x,y) {
        return ((x >= this.x) && (x <= this.x + this.w) && (y >= this.y) && (y <= this.y + this.h)) ;
    };
    // used for duck typing
    ga.rectArea.prototype.isArea = true;

   // constructor for a circular area
    // coordinates are in world view coordinates.
    // type might be 0 (button) 1 (drag source) or 2 (drag target)
    ga.circleArea = function (x,y,radius,type) {
    	this.x      = x      ;
    	this.y      = y      ;
    	this.radius = radius ;
    	this.type = type ? type : 0 ;
    };

    ga.circleArea.prototype = Object.create(AreaBase.prototype);
    // takes screen coordinates as input
    // returns wether given point is within this area or not
    ga.circleArea.prototype.inArea = function (x,y) {
        return ((x-this.x)*(x-this.x)+(y-this.y)*(y-this.y)) <this.radius*this.radius ;
    };
    // used for duck typing
    ga.circleArea.prototype.isArea = true;
    
    ga.KEY = { // _________________________ All codes must be > 0
            'MOUSE1': 1,          'MOUSE2': 3, /* right button */       'MOUSE3': 2,
            'MWHEEL_UP': 4,       'MWHEEL_DOWN': 5,                       // code < 8  <=> mouse interaction

            'BACKSPACE': 8,       'TAB': 9,            'ENTER': 13,         'PAUSE': 19,
            'CAPS': 20,           'ESC': 27,           'SPACE': 32,

            'PAGE_UP': 33,        'PAGE_DOWN': 34,     'END': 35,           'HOME': 36,

            'LEFT_ARROW': 37,     'UP_ARROW': 38,      'RIGHT_ARROW': 39,   'DOWN_ARROW': 40,

            'INSERT': 45,         'DELETE': 46,

            '_0': 48,          '_1': 49,            '_2': 50,           '_3': 51,           '_4': 52,
            '_5': 53,          '_6': 54,            '_7': 55,           '_8': 56,           '_9': 57,

            'A': 65,            'B': 66,            'C': 67,            'D': 68,
            'E': 69,            'F': 70,            'G': 71,            'H': 72,
            'I': 73,            'J': 74,            'K': 75,            'L': 76,
            'M': 77,            'N': 78,            'O': 79,            'P': 80,
            'Q': 81,            'R': 82,            'S': 83,            'T': 84,
            'U': 85,            'V': 86,            'W': 87,            'X': 88,
            'Y': 89,            'Z': 90,

            'NUMPAD_0': 96,  'NUMPAD_1': 97,  'NUMPAD_2': 98,  'NUMPAD_3': 99, 'NUMPAD_4': 100,
            'NUMPAD_5': 101, 'NUMPAD_6': 102, 'NUMPAD_7': 103, 'NUMPAD_8': 104,'NUMPAD_9': 105,

            'MULTIPLY': 106,  'ADD': 107 ,  'SUBSTRACT': 109,  'DECIMAL': 110,
            'DIVIDE': 111  ,  'PLUS': 187,  'COMMA': 188    ,  'MINUS': 189,
            'PERIOD': 190  ,

            'F1' : 112,  'F2' : 113,  'F3' : 114,  'F4': 115,  'F5': 116,
            'F6' : 117,  'F7' : 118,  'F8' : 119,  'F9': 120,
            'F10': 121,  'F11': 122,  'F12': 123,

            'SHIFT': 16,              'CTRL': 17,            'ALT': 18   ,            
      };
      
    var _maxKey = (function() { var max=0; for (p in ga.KEY) max=Math.max(max,ga.KEY[p]); return max; }());    


    var propertyDescr = {
        value: null,
        writable: true
    };

    function defHidProp (obj, propName, val) {
    	propertyDescr.value = val;
        Object.defineProperty(obj, propName, propertyDescr) ;
    };
    
    var _hasUnderscore = /_.*/g ;

   function setProperties(tgt, props) {
        for (var prop in props) {
            if (_hasUnderscore.test(prop)) {
                propertyDescr.value = props[prop];
                Object.defineProperty(tgt, prop, propertyDescr);
            } else {
                tgt[prop] = props[prop];
            }
        }
    };


    ga.Input = function (targetCanvas, screenToWorldViewTransform, timeGetter) {
    	if (arguments.length<1) { throw('ga.Input constructor requires at least targetCanvas parameter.'); };
        
        var that = this;
                
        this.mouse = {};
        
        Object.defineProperty(this.mouse,'x', { get : function () {
					                if (that._mouseUpdated) return that._mouseXwv;
					                that._mouseXwv = that._screenToWorldCoordinates(that.mouseXscr);
					                that._mouseYwv = that._screenToWorldCoordinates(that.mouseYscr);
					                that._mouseUpdated = true;
					                return that._mouseXwv;
        } });
       
        Object.defineProperty(this.mouse,'y', { get : function () {       
                if (that._mouseUpdated) return that._mouseYwv;
                that._mouseXwv = that._screenToWorldCoordinates(that.mouseXscr);
                that._mouseYwv = that._screenToWorldCoordinates(that.mouseYscr);
                that._mouseUpdated = true;
                return that._mouseYwv;
        } });
        
        defHidProp(this, '_now', -1);
        Object.defineProperty(this, 'now', { get : function() { if (this._now<0) { this._now = this._getTime(); }
        	                                                    return this._now;   } });
            
        this.accel = {
            x: 0,
            y: 0,
            z: 0
        };
        
        this.MousevsTouchRaceStatus = -1; // -1 not started; 0 ongoing; 1 mouse won; 2 touch won; 

        
        this.mouseXscr = 0;
        this.mouseYscr = 0;

	    this.touchPos		=		[ { x :0, y:0 }, { x :0, y:0 }, { x :0, y:0 }, { x :0, y:0 },{ x :0, y:0 } ];   
	    this.touchId		=		[ -1, -1, -1, -1, -1 ] ;  
	    this.touchStartPos	=	 	[ { x :0, y:0 }, { x :0, y:0 }, { x :0, y:0 }, { x :0, y:0 },{ x :0, y:0 } ]; 
	    this.touchStartTime	=	    [ 0, 0, 0, 0, 0 ] ;  


        var inputProperties = {
            _targetCanvas: targetCanvas,

            _getTime: (timeGetter) ? timeGetter : Date.now, // function used to measure time.  

            _screenToWorldCoordinates: screenToWorldViewTransform || function (v) { return v ; },

            _isBound: [],          //  _isBound       [keyCode]  == how many binding(s) for this code ?
            _actionToCode: null,   //  _actionToCode  [action]  == which keyCode(s) for this action

            _lastRepeatTime	: [],  //  _lastRepeatTime [action]  == game time when action repeated (using this._getTime())
            _autoRepeatTime	: [],  //  _autoRepeatTime [action]  == auto repeat duration in ms
			
            _isCurrentlyPressed : [], //  _isCurrentlyPressed [keyCode]  
        						     //    if pressed : (== time if measuring time or 1 if not), 0 if not pressed
            _isJustPressed: [],      //  _isJustPressed [keyCode]  == is pressed this cycle
            						 //   === 0 if action not ongoing. 
            _isJustReleased: [],  //  _is JustReleased [keycode] == released this cycle
            _hasDefault: [],      //  _hasDefault[keycode] == has this keycode a default handler ?

            _justPressedStack: [0,0,0,0,0,0,0,0,0,0,0,0,0,0], // used to store the keycode needing to be released
            _justPressedStackLength: 0,

            _justReleasedStack: [0,0,0,0,0,0,0,0,0,0,0,0,0,0], // used to store the keycode needing to be released
            _justReleasedStackLength: 0,

            _latestMouse: {
                x: -1,
                y: -1
            }, //

            _areaInfoUpdated: false,
            _areas: [],

            _isFrozen: false, // do we freeze users interactions ?
            _isFrozenTimer: null, // timer for the freeze

            _isUsingMouse: false, // ...
            _isUsingKeyboard: false, // ...
            _isUsingTouch: false, // ...
            _isUsingAccelerometer: false, // ...

            _mouseInitialized: false, // ...
            _keyboardInitialized: false, // ...
            _touchInitialized: false, // ...
            _accelerometerInitialized: false, // ...

            _mouseUpdated: false, // flag to avoid dividing by ig.scale each time the mouse moves.
            _mouseXwv: 0, // mouse world coordinates x
            _mouseYwv: 0, // mouse world coordinates y

            _canvasOffsetX: -1, // Dom Canvas Offset x
            _canvasOffsetY: -1, // Dom Canvas Offset y
            _cssScaleX : 1,
            _cssScaleY : 1,

        };


        setProperties(this, inputProperties);
        
        this._isCurrentlyPressed [_maxKey]     = 0     ; 
        this._isJustPressed      [_maxKey]     = false ;
        this._isJustReleased     [_maxKey]     = false ; 

        return this;
    };

    ga.Input.bindings = {};

// Timer

    function Timer (inputInstance, waitTime_ms) {
        defHidProp(this, "_inputInstance", inputInstance);
        defHidProp(this, "_startTime", ga.Input._getTime());
        waitTime_ms = (waitTime_ms === undefined) ? 0 : waitTime_ms;
        defHidProp(this, "_waitTime", waitTime_ms);
    };

    Timer.prototype.delta = function () {
        return (this._inputInstance._getTime() - this._startTime - this._waitTime);
    };

    Timer.prototype.set = function (waitTime_ms) {
        this._waitTime = waitTime_ms;
        return this;
    };

// /Timer

    var _pr = ga.Input.prototype;

    var InputPrototypeProperties = {
    	
        isIOS : function() { return  !! navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ; },
        
        isSafari :  function() { return (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) ; },

		isAndroid : function() {
				var ua = navigator.userAgent.toLowerCase();
				return (ua.indexOf("android") > -1); 			
		},

        // ------------------------------------------------------------------------------
        //      Bindings
        // ---------------------------------------------------------------------------

        bind: function (key, action, autoRepeatTime_ms) {
            this._checkAction(action);          
            
            // init mouse or keyboard binding
            if (key < 8) {
                this._initMouse();
            } else if (key >= 8) {
                this._initKeyboard();
            }

            this._addKeyActionPair(key, action, autoRepeatTime_ms);

            this._isCurrentlyPressed[key] = 0     ;
            this._isJustPressed[key]      = false ;
            this._isJustReleased[key]     = false ;
        },
        
        bindArea : function(area, autoRepeatTime_ms) {
        	if (!area || !area.isArea) {throw('can only use bindArea on area objects'); }
            this._areas.push(area);                    	
        },

        bindTouch: function () {
            this._initTouch();
        },

        bindMouse: function () {
            this._initMouse();
        },

        bindAccelerometer: function () {
            this._initAccelerometer();
        },
        // Checks that the action argument of bind is valid,
        // and that only integers OR only strings are used as actions
        _checkAction: function (action) {
            if (action === undefined ) {   throw ('cannot bind to undefined');  }
            if (this._actionToCode == null) {
                this._actionToCode = ((typeof action == "string") || (action instanceof String)) ? {} : [];
            } else {
                if (((typeof action == "string") || (action instanceof String)) && (this._actionToCode.length !== undefined)) {
                    throw ('Cannot add both string and integer actions (action :' + action + ')');
                }
            }
        },

        _addAutoRepeat: function (action, autoRepeatTime_ms) {
			if (autoRepeatTime_ms && autoRepeatTime_ms > 0) {
                this._autoRepeatTime[action] = autoRepeatTime_ms;
                this._lastRepeatTime[action] = this._getTime() + 1;
            }
        },

        _addKeyActionPair: function (key, action, autoRepeatTime_ms) {
            this._addAutoRepeat(action, autoRepeatTime_ms);
            var code = this._actionToCode[action];
            // return if key allready bound to that action
            if (code && (code.indexOf(key) >= 0)) {
                return;
            }
            // do we allready have an code for this action ?
            if (code === undefined) {
                // no : create an array to store it
                this._actionToCode[action] = [];
            }   
            this._actionToCode[action].push(key);
  			// store the key as bound          
            this._isBound[key] = (this._isBound[key] === undefined) ? 1 : this._isBound[key] + 1;
        },

        // ------------------------------------------------------------------------------
        //      UnBinding
        // ---------------------------------------------------------------------------

        // undinds the key <-> action.  
        // does nothing if key <-> Action allready unbound.
        unbind: function (key, action) {
            if (!key || ((!action) && (action != 0))) {     return;   }
            if (this._isBound[key] === undefined || this._isBound[key] <= 0) return;
            this._removeKeycodeActionPair(key, action);
        },
        
        unbindArea : function(area) {
        	throw('not implemeented ');
        },

        unbindAll: function () {
            this.resetKeys();
            this._isBound = [];
            this._actionToCode = null;
            this._isJustPressed = [];
            this._isCurrentlyPressed = [];
            this._isJustReleased = [];

            this._autoRepeatTime = [];
            this._lastRepeatTime = [];
            
            this._areas = [];
        },

        _removeKeycodeActionPair: function (keycode, action) {
            var code = this._actionToCode[action];
            if (!code) {
                return;
            } // already unbound or never bound
            var index = code.indexOf(keycode);
            if (index < 0) {
                return;
            } // key not found
            this._isBound[keycode]--;
            if ( code.length == 1) {
                this._actionToCode[action] = null ;
            } else {
                    code.splice(index, 1);
            };
        },

        // --------------------------------------------------------------------
        //          status  readers
        // --------------------------------------------------------------------

        status: function (action) {
        	
        	
            if (this._isFrozen) return false;
            var _code = this._actionToCode[action];
            if (!_code) {
                throw ('error in input.state : the action requested is not bound ( ' + action + ' ) ') ;
            }

            if (this._areasCount && !this._areaInfoUpdated) {
                this._updateTouchArea() ;
            }

            var i = _code.length;
            var max = this._isCurrentlyPressed[_code[0]];
            while (--i) {
                max = Math.max(max, this._isCurrentlyPressed[_code[i]]);
            }
            if (!max) {                return 0 ;           }
            return (this._getTime() - max);
            
            
            
//      /*            var actionTime = 1;
//          
//                actionTime = this._actionTime[action];
//                actionTime = (actionTime) ? Math.min(min, actionTime) : min;
//                this._actionTime[action] = actionTime;
//                actionTime = this._getTime() - actionTime;
//            return actionTime;   
        },
    
    

        pressed: function (action) {
            if (this._isFrozen) {
                return false ;
            };
            var _code = this._actionToCode[action];
            if (!_code) {
                throw ('error in input.pressed : the action requested is not bound ( ' + action + ' ) ') ;
            }
            if (this._areasCount && !this._areaInfoUpdated) {
                this._updateTouchArea();
            }

            if (this._justPressedStackLength == 0 && (!this._autoRepeatTime[action])) {
                return false ;
            };

            if (this._areasCount && !this._areaInfoUpdated) {
                this._updateTouchArea() ;
            }

            var justPressed = false;
            var i = _code.length;
            while (i--) {
                if (this._isJustPressed[_code[i]]) {
                    justPressed = true;
                    break;
                };
            }

            if (justPressed) {
                if  (this._autoRepeatTime[action]) {
                    this._lastRepeatTime[action] = this._getTime() ;
                }
                return true;
            }

            // now handle autorepeat case
            // no auto repeat for this action --> return false
            if (!this._autoRepeatTime[action]) {
                return false;
            }
            // not enough time elapsed --> return false
            if ((this._getTime() - this._lastRepeatTime[action]) < this._autoRepeatTime[action]) {
                return false;
            }
            // are we currently pressed for this action ?
            var isCurrentlyPressed = false;

            var i = _code.length;
            while (i--) {
                if (this._isCurrentlyPressed[_code[i]]) {
                    isCurrentlyPressed = true;
                    break;
                }
            };

            // not pressed --> set last repeat time to 'infinity' so that we do not test any more for pressed                 
            if (!isCurrentlyPressed) {
                this._lastRepeatTime[action] *= 100;
                return false;
            }
            // pressed : update last repeat time and return a fake true
            this._lastRepeatTime[action] = this._getTime() + 1;
            return true;
        },


        released: function (action) {
            if (this._isFrozen) return false;
            if (this._areasCount && !this._areaInfoUpdated) {
                this._updateTouchArea() ;
            }

            if (this._justReleasedStackLength == 0) {
                return false ;
            };
            var _code = this._actionToCode[action];
            if (!_code) throw ('error in input.released : the action requested is not bound ( ' + action + ' ) ');

            var i = _code.length;
            while (i--) {
                if (this._isJustReleased[_code[i]]) {
                    return true ;
                };
            }
            return false;
        },

        // freeze the input (no user interaction reported) for the given time (in ms)
        freeze: function (freezeTime_ms) {
            this._isFrozen = true;
            if (freezeTime_ms <= 0) {
                throw ('freeze time cannot be <=0');
            }
            this._isFrozenTimer = (this._isFrozenTimer) ? this._isFrozenTimer.set(freezeTime_ms) : new Timer(this, freezeTime_ms);
        },

        // stop the freeze
        unFreeze: function () {
            this._isFrozen = false;
        },

        // --------------------------------------------------------------------
        //          touch handling
        // --------------------------------------------------------------------

        _updateAreas: function () {
            var inArea = false;
            var thisArea = null;
            var _code = 0;
            for (var i = 0; i < this._areas.length; i++) {
                thisArea = this._areas[i];
                inArea = this.touchInRect(thisArea.x, thisArea.y, thisArea.w, thisArea.h);
                if (inArea && !this._isCurrentlyPressed[_code]) { // entering
                    this._isJustPressed[_code] = true;
                    this._justPressedStack[this._justPressedStackLength++] = _code;
                    this._isCurrentlyPressed[_code] = this._getTime() ;
                } else if (!inArea && this._isCurrentlyPressed[_code]) { // leaving
                    this._isJustReleased[_code] = true;
                    this._justReleasedStack[this._justReleasedStackLength++] = _code;
                    this._isCurrentlyPressed[_code] = 0;
                }
            }
        },


        resetKeys: function () {
            // clear just pressed keys
            if (this._justPressedStackLength > 0) {
                var _code = 0;
                while (this._justPressedStackLength--) {
                    _code = this._justPressedStack[this._justPressedStackLength];
                    this._isJustPressed[_code] = false;
                }
                this._justPressedStackLength = 0;
            }
            // clear just released keys
            if (this._justReleasedStackLength > 0) {
                var _code = 0;
                while (this._justReleasedStackLength--) {
                    _code = this._justReleasedStack[this._justReleasedStackLength];
                    this._isJustReleased[_code] = false;
                }
                this._justReleasedStackLength = 0;
            }
            // stop the freeze if timer elapsed
            if (this._isFrozen && (this._isFrozenTimer.delta() > 0)) {
                this._isFrozen = false;
            }
            this._areaInfoUpdated = false ;
            this._now = -1;
        },

        // ------------------------------------------------------------------------------
        //     
        // ---------------------------------------------------------------------------

        _handleScroll: function () {
            this._computeCanvasOffset();
        },

        _computeCanvasOffset: function () { // http://ejohn.org/blog/getboundingclientrect-is-awesome/
            var rect = this._targetCanvas.getBoundingClientRect();
            this._canvasOffsetX = rect.left;
            this._canvasOffsetY = rect.top;
            
            this._cssScaleX = this._targetCanvas.width / ( this._targetCanvas.offsetWidth || this._targetCanvas.width ) ; 
            this._cssScaleY = this._targetCanvas.height / ( this._targetCanvas.offsetHeight || this._targetCanvas.height ) ; 
		
        },

        // --------------------------------------------------------------------
        //          init of events listeners
        // --------------------------------------------------------------------

		_startMousevsTouchRace: function () {			
		            this.MousevsTouchRaceStatus = 0;
		            var that = this;
		            function mouseWin() { stopRace(); this.MousevsTouchRaceStatus =1; that._initMouse(); };
		            function touchWin() { stopRace(); this.MousevsTouchRaceStatus =2; that._initTouch(); that._initMouse(); };
					function stopRace() {
				            document.removeEventListener('touchstart', touchWin);
				            document.removeEventListener('touchend', touchWin);
				            document.removeEventListener('touchmove', touchWin);		
				            that._targetCanvas.removeEventListener('mousedown', mouseWin);
				            that._targetCanvas.removeEventListener('mouseup', mouseWin);
				            document.removeEventListener('mousemove', mouseWin);						
					};
		            
		            document.addEventListener('touchstart', touchWin, false);
		            document.addEventListener('touchend', touchWin, false);
		            document.addEventListener('touchmove', touchWin, false);

		            this._targetCanvas.addEventListener('mousedown', mouseWin, false);
		            this._targetCanvas.addEventListener('mouseup', mouseWin, false);
		            document.addEventListener('mousemove', mouseWin, false);
		},


        _initMouse: function () {
        	if (this.MousevsTouchRaceStatus<0) { this._startMousevsTouchRace(); return; }
            this._isUsingMouse = true;
            if (this._mouseInitialized) {
                return;
            } // exit if init allready done
            var mouseWheelBound = this._handleMouseWheel.bind(this);
            this._targetCanvas.addEventListener('mousewheel', mouseWheelBound, false);
            this._targetCanvas.addEventListener('DOMMouseScroll', mouseWheelBound, false);

            document.addEventListener('scroll', this._handleScroll.bind(this), false);

            document.addEventListener('contextmenu', this._handleContextMenu.bind(this), false);

            this._targetCanvas.addEventListener('mousedown', this._handleMouseDown.bind(this), false);
            this._targetCanvas.addEventListener('mouseup', this._handleMouseUp.bind(this), false);
            document.addEventListener('mousemove', this._handleMouseMove.bind(this), false);

            this._computeCanvasOffset();

            this._mouseInitialized = true;
        },
        
        _initTouch: function () {
        	if (this.MousevsTouchRaceStatus<0) { this._startMousevsTouchRace(); return; }
            this._isUsingTouch      = true ;
            if (this._touchInitialized) {
                return;
            }
            var that = this;
            document.addEventListener('touchstart', this._handleTouchStart.bind(this), false);
            document.addEventListener('touchmove', this._handleTouchMove.bind(this), false);
            document.addEventListener('touchend', this._handleTouchEnd.bind(this), false);
            document.addEventListener('touchcancel', this._handleTouchEnd.bind(this), false);
            this._computeCanvasOffset();
            this._touchInitialized = true;
        },
        
        _initKeyboard: function () {
            this._isUsingKeyboard = true;
            if (this._keyboardInitialized) {
                return;
            }
            document.addEventListener('keydown', this._handleKeyDown.bind(this), false);
            document.addEventListener('keyup', this._handleKeyUp.bind(this), false);
            this._keyboardInitialized = true;
        },

        _initAccelerometer: function () {
            this._isUsingAccelerometer = true;
            if (this._accelerometerInitialized) {
                return;
            }
            window.addEventListener('devicemotion', this._handleDeviceMotion.bind(this), false);
            this._accelerometerInitialized = true;
        },




        // --------------------------------------------------------------------
        //          events handler
        // --------------------------------------------------------------------
        _handleContextMenu: function (event) {
            if (this._isBound[ga.KEY.MOUSE2]) {
                event.stopPropagation();
                event.preventDefault();
            }
            return false;
        },

        _handleKeyDown: function (event) {
            if (event.target.type == 'text') { return; }

            var _code = event.keyCode ;

            if (this._isBound[_code]) {
                if (!this._isCurrentlyPressed[_code]) {
                    this._isJustPressed[_code] = true;
                    this._justPressedStack[this._justPressedStackLength++] = _code;
                    this._isCurrentlyPressed[_code] = this._getTime() ;
                }
                event.stopPropagation();
                event.preventDefault();
            }
        },

        _handleKeyUp: function (event) {
            if (event.target.type == 'text') {  return;  }

            var _code = event.keyCode ;

            if (this._isBound[_code]) {
                this._isJustReleased[_code] = true;
                this._justReleasedStack[this._justReleasedStackLength++] = _code;
                this._isCurrentlyPressed[_code] = 0;
                event.stopPropagation();
                event.preventDefault();
            }
        },

        _handleDeviceMotion: function (event) {
            this.accel = event.accelerationIncludingGravity;
        },

        
        _handleMouseWheel: function (event) {
            var delta = event.wheelDelta ? event.wheelDelta : (event.detail * -1);
            var code = delta > 0 ? ga.KEY.MWHEEL_UP : ga.KEY.MWHEEL_DOWN;
            if (this._isBound[code]) {
                this._isJustPressed[code] = true;
                this._justPressedStack[this._justPressedStackLength++] = _code;
                this._isJustReleased[code] = true;
                this._justReleasedStack[this._justReleasedStackLength++] = _code;
                event.stopPropagation();
                event.preventDefault();
            }
        },

        _handleMouseMove: function (event) {
        
            this.mouseXscr =  ( event.clientX - this._canvasOffsetX ) * this._cssScaleX;
            this.mouseYscr = ( event.clientY - this._canvasOffsetY ) * this._cssScaleY;
            this._mouseUpdated = false;
        },

        _handleMouseDown: function (event) { 
            var _code = event.button + 1;
            if (this._isBound[_code]) {
                if (!this._isCurrentlyPressed[_code]) {
                    this._isJustPressed[_code] = true;
                    this._justPressedStack[this._justPressedStackLength++] = _code;
                    this._isCurrentlyPressed[_code] = this._getTime() ;
			}
                event.stopPropagation();
                event.preventDefault();
            }
            this._handleMouseMove(event);
        },

        _handleMouseUp: function (event) { 
                var _code =  event.button + 1 ;
	            if (this._isBound[_code] > 0) {
	                this._isJustReleased[_code] = true;
	                this._justReleasedStack[this._justReleasedStackLength++] = _code;
	                this._isCurrentlyPressed[_code] = 0;
	                event.stopPropagation();
	                event.preventDefault();
	            }
               this._handleMouseMove(event);
        },  

        _handleTouchStart : function (event) {
            event.stopPropagation();
            event.preventDefault();

            var touches = event.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    var id = this._findFreeIndex();
                    if (id >= 0) {
                        this.touchStartPos[id].x = this._screenToWorldCoordinates(touches[i].pageX - this._canvasOffsetX);
                        this.touchStartPos[id].y = this._screenToWorldCoordinates(touches[i].pageY - this._canvasOffsetY);
                        this.touchPos[id].x = this.touchStartPos[id].x ;
                        this.touchPos[id].y = this.touchStartPos[id].y ;
                        this.touchStartTime[id] = this._getTime();
                        this.touchId[id] = touches[i].identifier;
                    }
                };
        },

        _handleTouchMove : function (event) { 
            event.stopPropagation();
            event.preventDefault();
                var touches = event.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    var id = this._findTouchIndex(touches[i].identifier);
                    if (id >= 0) {
                        this.touchPos[id].x = this._screenToWorldCoordinates(touches[i].pageX - this._canvasOffsetX);
                        this.touchPos[id].y = this._screenToWorldCoordinates(touches[i].pageY - this._canvasOffsetY);
                    }
                };

       	},
       	
        _handleTouchEnd  : function (event) { 
            event.stopPropagation();
            event.preventDefault();

               var touches = event.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    var id = this._findTouchIndex(touches[i].identifier);
                    if (id >= 0) {
                        this.touchStartTime[id] = 0;
                    }
                };
        	
        },


       // ------------------------------------------------       
       // Helpers for touch handling
        
       _findTouchIndex: function (id) {
            for (var i = 0; i < 5; i++) {
                if ((this.touchStartTime[i]) && (this.touchId[i] == id)) {
                    return i;
                };
            };
            return -1;
        },

        _findFreeIndex: function () {
            for (var i = 0; i < 5; i++) {
                if (!this.touchStartTime[i]) {
                    return i;
                };
            }
            var min = Math.prototype.min.apply(Math,this.touchStartTime);   // ?????????????????????????????????????????????????????
            var ind = this.touchStartTime.indexOf(min);
            return ind;
        }
        
        
        

    }; // end of InputPrototypeProperties

    setProperties(ga.Input.prototype, InputPrototypeProperties);

    _pr._standardKeyPressed = _pr.resetKeys;

    _pr.clearPressed = _pr.resetKeys;
    //  -----------------------------------------------
    
    
    function isNumber(n) {
             return !isNaN(parseFloat(n)) && isFinite(n);
    }
    
    
    
    
 }());

/*    var copyCode = function( src, srcLength, dest, value) {
        var _i = srcLength;
        while(i) {
            _i--;
            var _code = src[_i];
            dest[_code] = value;
        }
    };
*/