;(function(window, document, undefined) {
	/*
	 * It catches some common coding issues, throwing exceptions. It prevents, or throws errors,
	 * when relatively "unsafe" actions are taken (such as gaining access to the global object).
	 */
	'use strict';

	var exports = window.exports;
	var debug = window.debug;

	function ObjectMap() {
		// Make sure some one is not able to apply this function to any arbitary closure
		if (!(this instanceof ObjectMap)) {
			return new ObjectMap();
		}

		/*
		 * Singleton, we are redefining the function in the following code so that all
		 * subsequent calls to this function get is the current intance, but there is
		 * no-reinitialization of the map and the getter setter properties
		 */
		var instance = this;
		ObjectMap = function() {
			debug.info("[ObjectMap] singleton instance being returned");
			return instance;
		};

		debug.info("[ObjectMap] constructor called");
		
		// initialize the map
		var map = {};

		/*
		 * Getters/Setters
		 */
		Object.defineProperties(this, {
			map : {
				get : function() {
					return map;
				},
				set : function(val) {
					map = val;
				}
			}
		});
	}

	/*
	 * Public APIs
	 */
	ObjectMap.prototype = {
		constructor : ObjectMap,
		VERSION : '1.0',
		/**
		 * Call this function to cache an object
		 * @param objOrId The object or Id of the object which needs to be cached. If two arguments 
		 * passed to this method then this is the id, else this is an object which must have a getId
		 * member for us to retrieve the object id
		 *
		 * @param obj If this argument is present then this is the reference to the object to be cached
		 */
		add : function(objOrId) {
		    var id, _obj;
		    
			switch (arguments.length) {
			    case 1:
					_obj = objOrId;
					id = objOrId.getId();
					break;
			    case 2:
					id = arguments[0];
					_obj = arguments[1];
					break;
			    default:
					debug.error("[ObjectMap] add was called incorrectly. Ignored.");
			    	return;
		    }
		    debug.log("[ObjectMap] add called with ObjectId " + id);
		    if (id) {
				return !!(this.map[id] = _obj);
		    }
		},

 	    /**
		 * Remove the object from object cache
		 * @param objOrId The object or Id of the object which needs to be removed. If two arguments 
		 * passed to this method then this is the id, else this is an object which must have a getId
		 * member for us to retrieve the object id
		 *
		 * @param obj If this argument is present then this is the reference to the object to be removed
		 */
		remove : function(objOrId) {
			
			var id, _obj;
			
			switch (arguments.length) {
			    case 1:
					_obj = objOrId;
					id = objOrId.getId();
					break;
			    case 2:
					id = arguments[0];
					_obj = arguments[1];
					break;
			    default:
					debug.error("[ObjectMap] remove was called incorrectly. Ignored.");
			    	return;
		    }
			if (id) {
				this.map[id] = null;
				delete this.map[id];
				return true;
			}
			return false;
		},

		/**
		 * Retrieve a cached object 
		 * @param id The id of the object which needs to be fetched
		 */
		getById : function(id) {
			debug.log("[ObjectMap] getById called with ObjectId " + id);
			return this.map[id];
		},

		toString : function() {
			return '[ObjectMap]';
		}
	};

	/*
	 * Make this class final
	 */
	Object.freeze(ObjectMap.prototype);

	/*
	 * Make this class accessible in the exports namespace
	 */
	exports.add('ObjectMap', ObjectMap);

}(window, document));
