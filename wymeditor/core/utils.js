Wymeditor.utils = {
	slice: function (arr) {
		return Array.prototype.slice.call(arr, Array.prototype.slice.call(arguments, 1));
	},
	extendPrototypeOf: function (Base, obj) {
	    function F () {}
	    F.prototype = Base.prototype;
	    var newPrototype = new F();
		
		newPrototype.constructor = Base;
		
	    // Extend with optional methods and properties
	    if (obj) {
	        for (var i in obj) {
				if (obj.hasOwnProperty(i)) {
            		newPrototype[i] = obj[i];
				}
			}
		}
		return newPrototype;
    },
	setScope: function (scope, func) {
		return function() { func.apply(scope, [this].concat(Wymeditor.utils.slice(arguments))) };
	}
};