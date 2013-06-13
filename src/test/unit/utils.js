
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
        name,
        attrs,
        attr,
        n,
        child,
        sortedAttrs,
        i,
        $captions;

    if (jQuery.browser.msie) {
        $captions = jQuery(node).find('table > caption');
        if ($captions.length) {
            // Some versions of IE can unexpectedly add the caption of a table
            // after the table body. This ensures the table caption is always
            // at the start.
            $captions.each(function () {
                jQuery(this).prependTo(jQuery(this).parent());
            });
        }
    }

    switch (node.nodeType) {
    case 1:  // an element
        name = node.tagName.toLowerCase();

        html += '<' + name;
        attrs = node.attributes;
        n = attrs.length;
        if (n) {
            // Node has attributes, order them
            sortedAttrs = [];
            for (i = n; --i >= 0;) {
                attr = attrs[i];
                if (attr.specified) {
                    // We only care about specified attributes and ignore
                    // attributes needed for the editor internally.
                    if (!(jQuery.browser.mozilla &&
                            (attr.nodeName === '_moz_editor_bogus_node' ||
                             attr.nodeName === '_moz_dirty')) &&
                        !(jQuery.browser.msie &&
                            attr.nodeName === '_wym_visited')
                       ) {

                        sortedAttrs.push(attr);
                    }
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
        if (name === "br" || name === "img" || name === "link") {
            // close self-closing element
            html += '/>';
        } else {
            html += '>';
        }

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
    var xhtml = '',
        normedActual = '',
        normedExpected = '',
        tmpNodes,
        i;
    xhtml = jQuery.trim(wymeditor.xhtml());
    if (xhtml === '') {
        // In jQuery 1.2.x, jQuery('') returns an empty list, so we can't call
        // normalizeHTML. On 1.3.x or higher upgrade, we can remove this
        // check for the empty string
        equals(xhtml, expected);
        return;
    }

    tmpNodes = jQuery(xhtml, wymeditor._doc);
    for (i = 0; i < tmpNodes.length; i++) {
        normedActual += normalizeHtml(tmpNodes[i]);
    }
    tmpNodes = jQuery(expected, wymeditor._doc);
    for (i = 0; i < tmpNodes.length; i++) {
        normedExpected += normalizeHtml(tmpNodes[i]);
    }

    equals(normedActual, normedExpected);
}

function makeSelection(wymeditor, startElement, endElement, startElementIndex, endElementIndex) {
    if (typeof startElementIndex === 'undefined') {
        startElementIndex = 0;
    }
    if (typeof endElementIndex === 'undefined') {
        // IE8+ has some trouble selecting a node without selecting any content
        // from that node. This is really kind of a hack, as the other browsers
        // handle selecting the 0-index of the endElement with no trouble. This
        // might be something that rangy can handle.
        endElementIndex = 1;
    }
    var sel = rangy.getIframeSelection(wymeditor._iframe),
        range = rangy.createRange(wymeditor._doc);

    range.setStart(startElement, startElementIndex);
    range.setEnd(endElement, endElementIndex);
    if (startElement === endElement &&
            startElementIndex === endElementIndex) {
        // Only collapse the range to the start if the start and end are the
        // exact same
        range.collapse(true);
    }

    // ie will raise an error if we try to use a Control range that
    // encompasses more than one element. See:
    // http://code.google.com/p/rangy/wiki/RangySelection#Control_selections_in_Internet_Explorer
    // We need to handle internet explorer selection differently
    sel.setSingleRange(range);

    // IE selection hack
    if (jQuery.browser.msie) {
        wymeditor.saveCaret();
    }
}

/**
    Make a selection between two elements, but assume that the given indexes
    are to a child TextNode instead of a child DOM node.
*/
function makeTextSelection(wymeditor, startElement, endElement, startElementIndex, endElementIndex) {
    var $startElementContents,
        $endElementContents;

    if (typeof startElementIndex !== 'undefined') {
        // Look for a first-child text node and use
        // that as the startElement for the makeSelection() call
        $startElementContents = jQuery(startElement).contents();
        if ($startElementContents.length > 0 &&
                $startElementContents.get(0).nodeType === WYMeditor.NODE.TEXT) {
            startElement = $startElementContents.get(0);
        }
    }
    if (typeof endElementIndex !== 'undefined') {
        // Look for a first-child text node and use
        // that as the startElement for the makeSelection() call
        $endElementContents = jQuery(endElement).contents();
        if ($endElementContents.length > 0 &&
                $endElementContents.get(0).nodeType === WYMeditor.NODE.TEXT) {
            endElement = $endElementContents.get(0);
        }
    }

    makeSelection(wymeditor, startElement, endElement, startElementIndex, endElementIndex);
}


/*
* Move the selection to the start of the given element within the editor.
*/
function moveSelector(wymeditor, selectedElement) {
    if (selectedElement.tagName.toLowerCase() === 'span') {
        // Hack to make span element selections work outside of FF. Webkit and
        // IE select the node before the span if you try a collapsed selection
        // on a span node.
        // Should probably be doing block vs inline detection here instead of
        // hardcoding detection for a span element
        makeSelection(wymeditor, selectedElement, selectedElement, 0, 1);
    } else {
        makeSelection(wymeditor, selectedElement, selectedElement, 0, 0);
    }

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
    },
        keydown,
        keypress,
        keyup;

    options = jQuery.extend(defaults, options);

    keydown = jQuery.Event('keydown');

    keydown.keyCode = keyCode;
    keydown.metaKey = options.metaKey;
    keydown.ctrlKey = options.ctrlKey;
    keydown.shiftKey = options.shiftKey;
    keydown.altKey = options.altKey;

    keypress = jQuery.Event('keypress');
    keypress.keyCode = keyCode;
    keydown.metaKey = options.metaKey;
    keydown.ctrlKey = options.ctrlKey;
    keydown.shiftKey = options.shiftKey;
    keydown.altKey = options.altKey;

    keyup = jQuery.Event('keyup');
    keyup.keyCode = keyCode;
    keydown.metaKey = options.metaKey;
    keydown.ctrlKey = options.ctrlKey;
    keydown.shiftKey = options.shiftKey;
    keydown.altKey = options.altKey;

    jQuery(targetElement).trigger(keydown);
    jQuery(targetElement).trigger(keypress);
    jQuery(targetElement).trigger(keyup);
}

/*
    Determine if this element is editable.
    Mimics https://developer.mozilla.org/en/DOM/element.isContentEditable
*/
function isContentEditable(element) {
    // We can't use isContentEditable in firefox 7 because it doesn't take
    // in to account designMode like firefox 3 did
    if (!jQuery.browser.mozilla && typeof element.isContentEditable  !== 'undefined') {
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
