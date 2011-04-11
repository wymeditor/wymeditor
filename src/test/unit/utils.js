/**
* Order HTML attributes for consistent HTML comparison.
*
* Adapted from google-code-prettify
* http://code.google.com/p/google-code-prettify/source/browse/trunk/src/prettify.js#311
* Apache license, Copyright (C) 2006 Google Inc.
*/
function normalizeHtml(node) {
	var html = '';
	switch (node.nodeType) {
	case 1:  // an element
		var name = node.tagName.toLowerCase();

		html += '<'+name;
		var attrs = node.attributes;
		var n = attrs.length;
		if (n) {
			// Node has attributes, order them
			var sortedAttrs = [];
			for (var i = n; --i >= 0;) {
				sortedAttrs[i] = attrs[i];
			}
			sortedAttrs.sort( function (a, b) {
				return (a.name < b.name) ? -1 : a.name === b.name ? 0 : 1;
			});
			attrs = sortedAttrs;

			for (var i = 0; i < n; ++i) {
				var attr = attrs[i];
				if (!attr.specified) {
					continue;
				}
				html += ' ' + attr.name.toLowerCase() +
					'="' + attribToHtml(attr.value) + '"';
			}
		}
		html += '>';
		for (var child = node.firstChild; child; child = child.nextSibling) {
			html += normalizeHtml(child);
		}
		if (node.firstChild || !/^(?:br|link|img)$/.test(name)) {
			html += '<\/' + name + '>';
		}

		break;
	case 3: case 4: // text
		html += textToHtml(node.nodeValue);
		break;
	}

	return html;
}

function attribToHtml(str) {
	return str.replace(pr_amp, '&amp;')
		.replace(pr_lt, '&lt;')
		.replace(pr_gt, '&gt;')
		.replace(pr_quot, '&quot;');
}

var pr_amp = /&/g;
var pr_lt = /</g;
var pr_gt = />/g;
var pr_quot = /\"/g;

/**
* Escape html special characters.
*/
function textToHtml(str) {
	return str.replace(pr_amp, '&amp;')
		.replace(pr_lt, '&lt;')
		.replace(pr_gt, '&gt;');
}

function trimHtml(html) {
	var trimmed = jQuery.trim(html);
	// This is a super-naive regex to turn things like:
	//    <html>   </html> => <html></html>
	// It fails for cases where white space is actually significant like:
	//    <strong>foo</strong> <em>bar</em>
	return trimmed.replace(/\>\s+\</g, '><');
}

/**
* Ensure the cleaned xhtml coming from a WYMeditor instance matches the
* expected HTML, accounting for differing whitespace and attribute ordering.
*/
function htmlEquals(wymeditor, expected) {
	var normedActual = normalizeHtml($(wymeditor.xhtml())[0]);
	var normedExpected = normalizeHtml($(expected)[0]);
	equals(normedActual, normedExpected);
}

/**
* Move the selection to the start of the given element within the editor.
*/
function moveSelector(wymeditor, selectedElement) {
	var iframeWin = wymeditor._iframe.contentDocument ? wymeditor._iframe.contentDocument.defaultView : wymeditor._iframe.contentWindow;
	var sel = rangy.getSelection(iframeWin);

	var range = rangy.createRange(wymeditor._doc);
	range.setStart(selectedElement, 0);
	range.setEnd(selectedElement, 0);
	range.collapse(false);

	sel.setSingleRange(range);
	// IE selection hack
	if ($.browser.msie) {
		wymeditor.saveCaret();
	}

	equals(wymeditor.selected(), selectedElement);
}

function makeSelection(
		wymeditor, startElement, endElement, startElementIndex, endElementIndex) {
	if (startElementIndex == null) {
		startElementIndex = 0;
	}
	if (endElementIndex == null) {
		endElementIndex = 0;
	}
	var iframeWin = wymeditor._iframe.contentDocument ? wymeditor._iframe.contentDocument.defaultView : wymeditor._iframe.contentWindow;
	var sel = rangy.getSelection(iframeWin);

	var range = rangy.createRange(wymeditor._doc);
	range.setStart(startElement, startElementIndex);
	range.setEnd(endElement, endElementIndex);

	sel.setSingleRange(range);
	// IE selection hack
	if ($.browser.msie) {
		wymeditor.saveCaret();
	}
}

/**
	* Simulate a keypress, firing off the keydown, keypress and keyup events.
	*/
function simulateKey(keyCode, targetElement, options) {
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
function isContentEditable(element) {
	if (element.contentEditable == '' || element.contentEditable == null) {
		return true;
	} else if (element.contentEditable == true) {
		return true;
	} else if (element.contentEditable == false) {
		return false;
	} else {
		return isContentEditable(element.parentNode);
	}
}