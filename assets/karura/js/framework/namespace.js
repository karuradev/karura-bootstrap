/*
* The undefined at the end of the function parameter list creates a local undefined in case someone redefines undefined 
* somewhere in the scope chain. 
* Also provides a faster lookup since undefined is a global property, so the scope chain traversal is reduced.
*/
function defineNamespace(namespace, undefined) {
	'use strict';

	namespace = namespace || {};

	namespace.add = function(exportName, objectForExport) {
		if (exportName.length === 0) {
			debug.info('[Namespace] An empty export was ignored');
			return namespace;
		}

		var rexp = /^([\$\_a-z][\$\_a-z\d]*\.?)+$/i;

		// if not a valid export name then we cannot process this request
		if (!exportName.match(rexp)) {
			debug.error('[Namespace] namespace was not extended because the export name was invalid.');
			return;
		}

		var names = exportName.split('.');
		var _namespace = namespace;

		for (var i = 0; i < names.length; i++) {
			var entry = names[i];
			if (!(entry in _namespace)) {
				debug.info('[Namespace] : Adding a new object of name ' + entry);
				if (objectForExport === null){
					_namespace[entry] = Object.create(null);
				}else{
					_namespace[entry] = objectForExport;
				}
			}
			_namespace = _namespace[entry];
		}
		return _namespace;
	};
	return namespace;
}

//add the exports namespace
window.exports = defineNamespace(window.exports);
window.globals = defineNamespace(window.globals);
