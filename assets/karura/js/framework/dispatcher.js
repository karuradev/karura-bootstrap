;(function(window, document, undefined){
	
	function Dispatcher(karura){
		if (!(this instanceof Dispatcher)){
			return new Dispatcher(karura);
		}
		
		Object.defineProperty(this, 'karura', {
			get : function(){
				return karura;
			}
		});
		
		Object.defineProperty(this, 'objectMap',  {
			get : function(){
				return karura.objectMap;
			}
		});
		
		Object.defineProperty(this, 'callMap', {
			get : function(){
				return karura.callMap;
			}
		});
		
		return this;
	}
	
	Dispatcher.prototype = {
		constructor : Dispatcher,
		version : "1.0",
		
		dispatch : function(id){
			/*
			 * This method is called from the java layer to trigger an event or a callback in the
			 * javascript layer.
			 * 
			 * @param id: it is the id of the script which contains the js fragment corresponding to
			 * this request. When this event is trigger the javascript layer will request the java layer
			 * for the js fragment which is then appended to dom and executed.
			 */

			id = parseInt(id, 10);
			if (_.isNumber(id)) {
				var self = this;
				
				var objectDispatch = function(_json) {
					var json = JSON.parse(_json);
					var data = json.data.data;

					var action = ('action' in json) && json.action;

					var receiver = json.receiver;
					var callId = json.method;
					var timeout = ('timeout' in json) && json.timeout; // not in use!

					var objectReceiver = self.objectMap.getById(receiver);
					var objectReceiverMethod;

					var receiverOptions = self.callMap.getById(callId);

					//Todo fix for events
					if (_.isObject(objectReceiver) && _.isObject(receiverOptions)) {
						if (action !== undefined) {
							objectReceiverMethod = receiverOptions[action];
						} else {
							objectReceiverMethod = 'On' + method + 'Listener';
						}
						var func = objectReceiverMethod || null;
						if (_.isFunction(func)) {
							func.apply(objectReceiver, [data, globals]);
						} else {
							debug.error('[karura] Not a function: ' + func);
						}
		
						if (action !== null && (action == "resolve" || action == "reject")){
							self.callMap.remove(callId, receiverOptions);
						}
					} else {
						//Nothing much can be done in this case except for ignoring the request
						debug.error('[karura] Object receiver does not exist: ' + receiver + ' -- ' + JSON.stringify(json));
					}
				};

				//asynchronously try and load the javascript fragment
				setTimeout(function() {
					try {
						var _json = self.karura.getJsWithId(id);
						objectDispatch(_json);
					} catch (e) {
						debug.error('[karura] Error stack: ' + e.stack);
					}
				}, 0);
			} else {
				debug.error('[karura] Supplied javascript fragment id is not an integer: ' + id);
			}
		}
	};
	
	Object.freeze(Dispatcher.prototype);
	
	window.exports.add('Dispatcher', Dispatcher);
}(window, document));