ig.module(
	'impact.gaPooling'
)
.requires(
	'impact.impact',
	'impact.entity'
)
.defines(function(){ "use strict";


//
//        Pooling for Impact
//
//
// to pool a true javascript class or to pool a class extending ig.Class,
//  ( hence with an init() scheme ) use : 
//                                MyClass.setupPool(100);
//
// once a class is pooled, create an instance with :  var instance = MyClass.pnew(arg1,....);
// and don't forget to dispose it when it is no longer used with : instance.pdispose();
//
// to pool automatically your entities
//  just call ga.autoPoolEntities()
// and pool your classes with EntitySomeBadGuy.setupPool( size-of-the-pool )
// then if you only use spawnEntity() and kill() your entities are
// taken from/put back in the pool automatically


window.ga = (window.ga) ? ga : {} ;

Object.defineProperty(Function.prototype,'setupPool', { value : setupPool });

Object.defineProperty(Function.prototype,'init', { value : null, configurable : true, writable : true });

// setupPool. 
// setup a pool on the function, add a pnew method to retrieve objects
// from the pool, and add a hidden pdispose method to the instances so
// they can be sent back on the pool.
// use : MyPureJSClass.setupPool(100);
//   or   MyExtendedClass.setupPool(10);
// then : var myInstance = MyPureJSClass.pnew(23, 'arg 2', ..);
function setupPool(newPoolSize) {
	if (!(newPoolSize>0)) throw('setupPool takes a size > 0 as argument.');
    this.pool                = this.pool || []    ;
    this.poolSize            = this.poolSize || 0 ;
    this.pnew                = pnew               ;
    Object.defineProperty(this.prototype, 'pdispose', { value : pdispose } ) ; 
    // pre-fill the pool.
    while ( this.poolSize < newPoolSize ) { (new this()).pdispose(); }
    // reduce the pool size if new size is smaller than previous size.
    if (this.poolSize > newPoolSize) {
    	this.poolSize    =  newPoolSize ;
    	this.pool.length =  newPoolSize ; // allow for g.c.
    }
}

// pnew : method of the constructor function. 
//        returns an instance, that might come from the pool
//        if there was some instance left,
//        or created new, if the pool was empty.	
// instance is initialized the same way it would be when using new
function  pnew () {
    var pnewObj  = null     ; 
    if (this.poolSize !== 0 ) {              // the pool contains objects : grab one
           this.poolSize--  ;
           pnewObj = this.pool[this.poolSize];
           this.pool[this.poolSize] = null   ; 
    } else {
           pnewObj = new this() ;             // the pool is empty : create new object
    }
     // initialize object with init class if available, with constructor otherwise
    if (pnewObj.init) {  pnewObj.init.apply(pnewObj, arguments); }
    else this.apply(pnewObj, arguments);          
    return pnewObj;
}

// pdispose : release on object that will return in the pool.
//             if a dispose method exists, it will get called.
//            do not re-use a pdisposed object. 
function pdispose() {
    var thisCttr = this.constructor           ;
    if (this.dispose) this.dispose()          ;  // Call dispose if defined
    thisCttr.pool[thisCttr.poolSize++] = this ;  // throw the object back in the pool 
}

 

//
//        Helper for auto-pooling  of entites (provided you use spawnEntity and kill only)
//


ga.autoPoolEntities = function() {
	
		var EntityKill=ig.Entity.prototype.kill;
		
		ig.Entity.prototype.kill = function() {
			    if (this.pdispose) { this.pdispose(); }		
				ig.game.removeEntity( this );
		};
		
		var spawnEntity =ig.Game.prototype.spawnEntity;
		
		ig.Game.prototype.spawnEntity =	 function( type, x, y, settings ) {
		        if (!type) { throw ('cannot spawn entity of undefined type'); }
			    type =  ( typeof(type) === 'string' ) ? ig.global[type] : type;
				
			 	var ent = null;
		 		if  (type.pnew) {
		 			ent = type.pnew(x,y,settings )	;
		 			ent._killed = false;
					var pr = ent.__proto__;
					ent.type = pr.type  ; 
					ent.checkAgainst = pr.checkAgainst; 
					ent.collides =  pr.collides;  

		 		} else  { ent = new (type)( x, y, settings ); }
	 		
		 		
				this.entities.push( ent );
				if( ent.name ) {
					this.namedEntities[ent.name] = ent;
				}
				return ent;
		};
};

});