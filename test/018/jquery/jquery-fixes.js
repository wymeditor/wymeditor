(function($) {
$.extend = function() {
	// copy reference to target object
	var target = arguments[0],
		a = 1;

	// extend jQuery itself if only one argument is passed
	if ( arguments.length == 1 ) {
		target = this;
		a = 0;
	}
	var prop;

	while (prop = arguments[a++])
		// Extend the base object
		for ( var i in prop )
		{
			// prevent endless inheritances/loops
			// perhaps someone might want it though
			//if (target == prop[i]) continue;

			// extend recursively if current prop is an object, and
			// target has props of the same name
			if (typeof prop[i] == 'object' && target[i])
				jQuery.extend(target[i],prop[i]);
			else
				target[i] = prop[i];
		}

	// Return the modified object
	return target
};


$.event.add  = function(element, type, handler, data) {
	// For whatever reason, IE has trouble passing the window object
	// around, causing it to be cloned in the process
	if ( jQuery.browser.msie && element.setInterval != undefined )
		element = window;

	// Make sure that the function being executed has a unique ID
	if ( !handler.guid )
		handler.guid = this.guid++;

	// Init the element's event structure
	if (!element.$events)
		element.$events = {};

	// Get the current list of functions bound to this event
	var handlers = element.$events[type];

	// If it hasn't been initialized yet
	if (!handlers) {
		// Init the event handler queue
		handlers = element.$events[type] = {};

		// Remember an existing handler, if it's already there
		if (element["on" + type])
			handlers[0] = element["on" + type];
	}

	// Add the function to the element's handler list
	handlers[handler.guid] = {handler: handler};

	if( data )
		element.$events[type][handler.guid].data = data;

	if (element.addEventListener)
		element.addEventListener(type, this.handle, false);
	else
		// And bind the global event handler to the element
		element["on" + type] = this.handle;

	// Remember the function in a global list (for triggering)
	if (!this.global[type])
		this.global[type] = [];
        this.global[type].push( element )
};

// Detach an event or set of events from an element
$.event.remove = function(element, type, handler) {
	if (element.removeEventListener)
		element.removeEventListener(type, this.handle, false);

	if (element.$events) {
		var i,j,k;
		if ( type && type.type ) { // type is actually an event object here
			handler = type.handler;
			type    = type.type;
		}

		if (type && element.$events[type])
			// remove the given handler for the given type
			if ( handler )
				delete element.$events[type][handler.guid];

			// remove all handlers for the given type
			else
				for ( i in element.$events[type] )
					delete element.$events[type][i];

		// remove all handlers
		else
			for ( j in element.$events )
				this.remove( element, j );

		// remove event handler if no more handlers exist
		for ( k in element.$events[type] )
			if (k) {
				k = true;
				break;
			}
		if (!k) element["on" + type] = null;
	}
};



$.event.handle = function(event) {
	// Handle the second event of a trigger and when
	// an event is called after a page has unloaded
	if ( typeof jQuery == "undefined" || jQuery.event.triggered ) return;

	// Empty object is for triggered events with no data
	event = jQuery.event.fix( event || window.event || {} ); 

	// returned undefined or false
	var returnValue;

	var c = this.$events[event.type];

	var args = [].slice.call( arguments, 1 );
	args.unshift( event );

	for ( var j in c ) {
		// Pass in a reference to the handler function itself
		// So that we can later remove it
		args[0].handler = c[j].handler;
		args[0].data = c[j].data;

		if ( c[j].handler.apply( this, args ) === false ) {
			event.preventDefault();
			event.stopPropagation();
			returnValue = false;
		}
	}

	// Clean up added properties in IE to prevent memory leak
	if (jQuery.browser.msie) event.target = event.preventDefault = event.stopPropagation = event.handler = event.data = null;

	return returnValue;
};


$.clean = function(a, doc) {
	var r = [];
	var doc = doc;

	if ( doc == undefined )
		doc = document;

	jQuery.each( a, function(i,arg){
		if ( !arg ) return;

		if ( arg.constructor == Number )
			arg = arg.toString();
		
		 // Convert html string into DOM nodes
		if ( typeof arg == "string" ) {
			// Trim whitespace, otherwise indexOf won't work as expected
			var s = jQuery.trim(arg), div = doc.createElement("div"), tb = [];

			var wrap =
				 // option or optgroup
				!s.indexOf("<opt") &&
				[1, "<select>", "</select>"] ||
				
				(!s.indexOf("<thead") || !s.indexOf("<tbody") || !s.indexOf("<tfoot")) &&
				[1, "<table>", "</table>"] ||
				
				!s.indexOf("<tr") &&
				[2, "<table><tbody>", "</tbody></table>"] ||
				
			 	// <thead> matched above
				(!s.indexOf("<td") || !s.indexOf("<th")) &&
				[3, "<table><tbody><tr>", "</tr></tbody></table>"] ||
				
				[0,"",""];

			// Go to html and back, then peel off extra wrappers
			div.innerHTML = wrap[1] + s + wrap[2];

			// Move to the right depth
			while ( wrap[0]-- )
				div = div.firstChild;

			// Remove IE's autoinserted <tbody> from table fragments
			if ( jQuery.browser.msie ) {
				
				// String was a <table>, *may* have spurious <tbody>
				if ( !s.indexOf("<table") && s.indexOf("<tbody") < 0 ) 
					tb = div.firstChild && div.firstChild.childNodes;

				// String was a bare <thead> or <tfoot>
				else if ( wrap[1] == "<table>" && s.indexOf("<tbody") < 0 )
					tb = div.childNodes;

				for ( var n = tb.length-1; n >= 0 ; --n )
					if ( jQuery.nodeName(tb[n], "tbody") && !tb[n].childNodes.length )
						tb[n].parentNode.removeChild(tb[n]);
				
			}
			
			arg = [];
			for (var i=0, l=div.childNodes.length; i<l; i++)
				arg.push(div.childNodes[i]);
		}

		if ( arg.length === 0 && !jQuery.nodeName(arg, "form") )
			return;

		if ( arg[0] == undefined || jQuery.nodeName(arg, "form") )
			r.push( arg );
		else
			r = jQuery.merge( r, arg );

	});

	return r;
};


$.wrap = function() {
	// The elements to wrap the target around
	var a = jQuery.clean(arguments, this[0].ownerDocument);

	// Wrap each of the matched elements individually
	return this.each(function(){
		// Clone the structure that we're using to wrap
		var b = a[0].cloneNode(true);

		// Insert it before the element to be wrapped
		this.parentNode.insertBefore( b, this );

		// Find the deepest point in the wrap structure
		while ( b.firstChild )
			b = b.firstChild;

		// Move the matched element to within the wrap structure
		b.appendChild( this );
	});
};

$.fn.domManip = function(args, table, dir, fn){
	var clone = this.length > 1; 
	var a = jQuery.clean(args, this[0].ownerDocument);
	if ( dir < 0 )
		a.reverse();

	return this.each(function(){
		var obj = this;

		if ( table && jQuery.nodeName(this, "table") && jQuery.nodeName(a[0], "tr") )
			obj = this.getElementsByTagName("tbody")[0] || this.appendChild(document.createElement("tbody"));

		jQuery.each( a, function(){
			fn.apply( obj, [ clone ? this.cloneNode(true) : this ] );
		});

	});
};
})(jQuery);

