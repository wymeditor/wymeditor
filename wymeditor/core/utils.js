(function(undefined){
Wymeditor.utils = {
	/**
	 * Reliable test for type based on the internal Class property. See:
	 * http://bonsaiden.github.com/JavaScript-Garden/#types.typeof
	 * 
	 * Value               Class  
	 * ------------------------------
	 * "foo"               String
	 * new String("foo")   String
	 * 1.2                 Number
	 * new Number(1.2)     Number
	 * true                Boolean
	 * new Boolean(true)   Boolean
	 * new Date()          Date
	 * new Error()         Error
	 * [1,2,3]             Array
	 * new Array(1, 2, 3)  Array
	 * new Function("")    Function
	 * /abc/g              RegExp
	 * new RegExp("meow")  RegExp
	 * {}                  Object
	 * new Object()        Object
	 *
	 */
	is: function (type, obj) {
		var cls = Object.prototype.toString.call(obj).slice(8, -1);
		return obj !== undefined && obj !== null && cls === type;
	},
	slice: function (arr) {
		return Array.prototype.slice.call(arr, Array.prototype.slice.call(arguments, 1));
	},
	extendPrototypeOf: function (Base, obj) {
	    function F () {}
	    F.prototype = Base.prototype;
	    var newPrototype = new F();
		
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
		return function() { 
			func.apply(scope, [this].concat(Wymeditor.utils.slice(arguments))) 
		};
	}
};
})()