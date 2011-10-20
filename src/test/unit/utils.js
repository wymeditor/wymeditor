
// Regex expression shortcuts
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

function attribToHtml(str) {
    return str.replace(pr_amp, '&amp;')
        .replace(pr_lt, '&lt;')
        .replace(pr_gt, '&gt;')
        .replace(pr_quot, '&quot;');
}

/**
* Order HTML attributes for consistent HTML comparison.
*
* Adapted from google-code-prettify
* http://code.google.com/p/google-code-prettify/source/browse/trunk/src/prettify.js#311
* Apache license, Copyright (C) 2006 Google Inc.
*/
function normalizeHtml(node) {
    var html = '',
        i;
    switch (node.nodeType) {
    case 1:  // an element
        var name = node.tagName.toLowerCase(),
            attrs,
            attr,
            n,
            child,
            sortedAttrs;

        html += '<' + name;
        attrs = node.attributes;
        n = attrs.length;
        if (n) {
            // Node has attributes, order them
            sortedAttrs = [];
            for (i = n; --i >= 0;) {
                attr = attrs[i];
                if (attr.specified) {
                    // We only care about specified attributes
                    sortedAttrs.push(attr);
                }
            }
            sortedAttrs.sort(function (a, b) {
                return (a.name < b.name) ? -1 : a.name === b.name ? 0 : 1;
            });
            attrs = sortedAttrs;

            for (i = 0; i < attrs.length; ++i) {
                attr = attrs[i];
                html += ' ' + attr.name.toLowerCase() +
                    '="' + attribToHtml(attr.value) + '"';
            }
        }
        html += '>';
        for (child = node.firstChild; child; child = child.nextSibling) {
            html += normalizeHtml(child);
        }
        if (node.firstChild || !/^(?:br|link|img)$/.test(name)) {
            html += '<\/' + name + '>';
        }

        break;
    case 3:
    case 4: // text
        html += textToHtml(node.nodeValue);
        break;
    }

    return html;
}

/**
* Ensure the cleaned xhtml coming from a WYMeditor instance matches the
* expected HTML, accounting for differing whitespace and attribute ordering.
*/
function htmlEquals(wymeditor, expected) {
    var xhtml = jQuery.trim(wymeditor.xhtml());
    if (xhtml === '') {
        // In jQuery 1.2.x, $('') returns an empty list, so we can't call
        // normalizeHTML. On 1.3.x or higher upgrade, we can remove this
        // check for the empty string
        equals(xhtml, expected);
        return;
    }

    var normedActual = normalizeHtml($(xhtml)[0]);
    var normedExpected = normalizeHtml($(expected)[0]);
    equals(normedActual, normedExpected);
}

function makeSelection(wymeditor, startElement, endElement, startElementIndex, endElementIndex) {
    if (startElementIndex === null) {
        startElementIndex = 0;
    }
    if (endElementIndex === null) {
        endElementIndex = 0;
    }
    var sel = rangy.getIframeSelection(wymeditor._iframe);

    var range = rangy.createRange(wymeditor._doc);
    range.setStart(startElement, startElementIndex);
    range.setEnd(endElement, endElementIndex);
    if (startElement === endElement &&
            startElementIndex === 0 && endElementIndex === 0) {
        // Only collapse the range if we're selecting the start of one element
        range.collapse(false);
    }

    try {
        sel.setSingleRange(range);
    } catch (err) {
        // ie8 can raise an "unkown runtime error" trying to empty the range
    }
    // IE selection hack
    if ($.browser.msie) {
        wymeditor.saveCaret();
    }
}

/*
* Move the selection to the start of the given element within the editor.
*/
function moveSelector(wymeditor, selectedElement) {
    makeSelection(wymeditor, selectedElement, selectedElement, 0, 0);

    equals(wymeditor.selected(), selectedElement, "moveSelector");
}


/*
    Simulate a keypress, firing off the keydown, keypress and keyup events.
*/
function simulateKey(keyCode, targetElement, options) {
    var defaults = {
        'metaKey': false,
        'ctrlKey': false,
        'shiftKey': false,
        'altKey': false
    };

    options = $.extend(defaults, options);

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

/*
    Determine if this element is editable.
    Mimics https://developer.mozilla.org/en/DOM/element.isContentEditable
*/
function isContentEditable(element) {
    // We can't use isContentEditable in firefox 7 because it doesn't take
    // in to account designMode like firefox 3 did
    if (!$.browser.mozilla && typeof element.isContentEditable  !== 'undefined') {
        return element.isContentEditable;
    }

    if (element.contentEditable === '' || element.contentEditable === true) {
        return true;
    } else if (element.contentEditable === false) {
        return false;
    } else {
        if (element.parentNode === null) {
            if (element.designMode === "on") {
                return true;
            }
            return false;
        }
        return isContentEditable(element.parentNode);
    }
}
