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
})(jQuery);

