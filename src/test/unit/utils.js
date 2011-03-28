function htmlEquals( wymeditor, expected ) {
	equals( jQuery.trim( wymeditor.xhtml() ), jQuery.trim( expected ) );
}

/**
* Move the selection to the start of the given element within the editor.
*/
function moveSelector( wymeditor, selectedElement ) {
	var sel = wymeditor._iframe.contentWindow.getSelection();

	var range = wymeditor._doc.createRange();
	range.setStart( selectedElement, 0 );
	range.setEnd( selectedElement, 0 );

	sel.removeAllRanges();
	sel.addRange( range );
}

/*
 * Simulate a keypress, firing off the keydown, keypress and keyup events.
 */
function simulateKey( keyCode, targetElement, options) {
	var defaults = {
		'metaKey': false,
		'ctrlKey': false,
		'shiftKey': false,
		'altKey': false
	};

	var options = $.extend(defaults, options);

	var keydown = $.Event('keydown');
	keydown.keyCode = keyCode;
	keydown.metaKey = options.metaKey;
	keydown.ctrlKey = options.ctrlKey;
	keydown.shiftKey = options.shiftKey;
	keydown.altKey = options.altKey;

	var keypress = $.Event('keypress');
	keypress.keyCode = keyCode;
	keydown.metaKey = options.metaKey;
	keydown.ctrlKey = options.ctrlKey;
	keydown.shiftKey = options.shiftKey;
	keydown.altKey = options.altKey;

	var keyup = $.Event('keyup');
	keyup.keyCode = keyCode;
	keydown.metaKey = options.metaKey;
	keydown.ctrlKey = options.ctrlKey;
	keydown.shiftKey = options.shiftKey;
	keydown.altKey = options.altKey;

	$(targetElement).trigger(keydown);
	$(targetElement).trigger(keypress);
	$(targetElement).trigger(keyup);
}

/**
* Determine if this element is editable.
* Mimics https://developer.mozilla.org/en/DOM/element.isContentEditable
*/
function isContentEditable( element ) {
	if ( element.contentEditable == '' || element.contentEditable == null ) {
		return true;
	} else if ( element.contentEditable == true ) {
		return true;
	} else if ( element.contentEditable == false ) {
		return false;
	}else {
		return isContentEditable( element.parentNode );
	}
}