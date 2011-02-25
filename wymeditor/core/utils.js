Wymeditor.core.utils = {
    array: {
        slice: function (arr) {
            return Array.prototype.slice.call(arr, Array.prototype.slice.call(arguments, 1));
        }
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
    namespace: function(name, container) {
        var ns = name.split('.'),
            o = container || window,
            i, len;
        for(i = 0, len = ns.length; i < len; i++){
            o = o[ns[i]] = o[ns[i]] || {};
        }
        return o;
    }
};