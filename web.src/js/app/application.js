;( function(window, document, undefined) {'use strict';

		var exports = window.exports;
		var globals = window.globals;
		var debug = window.debug;

		/*
		 * Public APIs
		 */
		var Application = Backbone.Router.extend({
			initialize : function(options) {
				//nothing to be done in this case

				if (options === null) {
					throw new Error("Application view not specified.");
				}

				/*
				 * Getters/Setters
				 */
				Object.defineProperties(this, {
					karura : {
						get : function() {
							return options.karura;
						}
					},
					view : {
						get : function(){
							return options.view;
						}
					}
				});

				debug.info("[Application] constructor about to exit");
			},

			start : function() {
				Backbone.history.start();
			},

			routes : {
				'' : 'index',
			},

			'index' : function() {
				//add your route specific logic here
			},
		});

		var instance = null;
		var _singleton = {
			getInstance : function(options) {
				if (instance == null) {
					instance = new Application(options);
					instance.constructor = null;
				}

				return instance;
			}
		};

		/*
		 * Make this class accessible in the exports namespace
		 */
		exports.add('app.Application', _singleton);
	}(window, document));
