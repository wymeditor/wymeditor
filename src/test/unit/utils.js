/* exported isContentEditable, simulateKey, wymEqual,
 makeTextSelection, moveSelector */
/* global rangy, deepEqual, html_beautify, expect, QUnit, strictEqual */
"use strict";

// Regex expression shortcuts
var preAmp = /&/g;
var preLt = /</g;
var preGt = />/g;
var preQuot = /\"/g;

// Attributes that should be ignored when normalizing HTML for comparison
// across browsers. The variable is an array of arrays where each array should
// have the name of the attribute to be ignored as the first element. The
// second element in each array should be an array of values that specifies
// that the attribute will only be ignored if it is one of those values. If
// this second element is not provided, it will always ignore the attribute no
// matter what the attribute's value is.
var ignoreAttributes = [
    ['_moz_editor_bogus_node'],
    ['_moz_dirty'],
    ['_wym_visited'],
    ['sizset'],
    ['tabindex'],
    ['rowspan', ['1']]
];

/**
* Escape html special characters.
*/
function textToHtml(str) {
    return str.replace(preAmp, '&amp;')
        .replace(preLt, '&lt;')
        .replace(preGt, '&gt;')
        // IE7 and IE8 produce carriage returns instead of newlines. Replace
        // them with newlines.
        .replace(/\r/g, '\n');
}

function attribToHtml(str) {
    return str.replace(preAmp, '&amp;')
        .replace(preLt, '&lt;')
        .replace(preGt, '&gt;')
        .replace(preQuot, '&quot;');
}

/**
* Order HTML attributes for consistent HTML comparison.
*
* Adapted from google-code-prettify
* prettify.js
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
        attrName,
        attrValue,
        keepAttr,
        i,
        j,
        $captions;

    if (jQuery.browser.msie) {
        $captions = jQuery(node).find('caption');
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
                attrName = attr.nodeName.toLowerCase();
                attrValue = attr.nodeValue;
                keepAttr = true;

                // We only care about specified attributes
                if (!attr.specified) {
                    keepAttr = false;
                }

                // Ignore attributes that are only used in specific browsers.
                for (j = 0; j < ignoreAttributes.length; ++j) {
                    if (attrName === ignoreAttributes[j][0]) {
                        if (!ignoreAttributes[j][1] ||
                            jQuery.inArray(
                                attrValue,
                                ignoreAttributes[j][1]
                            ) > -1) {

                            keepAttr = false;
                            break;
                        }
                    }

                    // With some versions of jQuery on IE, sometimes attributes
                    // named `sizcache` or `sizzle-` followed by a differing
                    // string of numbers are added to elements, so regex must
                    // be used to check for them.
                    if (/sizcache\d*/.test(attrName) ||
                        /sizzle-\d*/.test(attrName)) {
                        keepAttr = false;
                        break;
                    }
                }

                if (keepAttr) {
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
        if (name === "br" || name === "img" || name === "link") {
            // close self-closing element
            html += ' />';
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

// Options for the HTML beautifier.
var htmlBeautifyOptions = {
    'indent_inner_html': false,
    'indent_size': 4,
    'indent_car': ' ',
    'wrap_line_length': 300,
    'brace_style': 'collapse',
    'unformatted': 'normal',
    'preserve_newlines': true,
    'max_preserve_newlines': 'unlimited',
    'indent_handlebars': false
};

/**
* Compares between the HTML in a WYMeditor instance and expected HTML.
*
* The HTML from the WYMeditor instance can be fetched either using the
* normal method, `.xhtml`, or, it can be fetched directly from the DOM, which
* bypasses the XHTML parser.
*
* If the compared HTML strings are found to be different, a comparison is made
* also between beautified versions of them.
*/
function wymEqual(wymeditor, expected, options) {
    var defaults = {
            // The message printed with the result of the assertion checking
            // this matching.
            assertionString: null,
            // A boolean that specifies whether leading spaces before line
            // breaks and list type elements should be removed in old versions
            // of Internet Explorer (i.e. IE7,8).
            fixListSpacing: false,
            skipParser: false
        },
        actual = '',
        normedActual = '',
        listTypeOptions,
        tmpNodes,
        i;

    // Apply defaults.
    options = jQuery.extend({}, defaults, options);

    // If it is requested that the parser be skipped:
    if (options.skipParser) {
        // Extract the HTML from the DOM of the WYMeditor.
        jQuery(wymeditor._doc).find('body.wym_iframe').contents().each(
            function () {
                actual += this.outerHTML
                // IE7 and IE8 provide HTML strings with carriage returns
                // and newlines. Those are wholly unnecessary and upon DOM
                // creation, IE7 and IE8 turn them into spaces. Remove them.
                .replace(/[\r\n]/g, '');
            }
        );
    // Otherwise:
    } else {
        // Get it through the API and trim it.
        actual = jQuery.trim(wymeditor.xhtml());
    }

    tmpNodes = jQuery(actual);

    for (i = 0; i < tmpNodes.length; i++) {
        normedActual += normalizeHtml(tmpNodes[i]);
    }
    if (options.fixListSpacing && jQuery.browser.msie &&
            parseInt(jQuery.browser.version, 10) < 9.0) {
        normedActual = normedActual.replace(/\s(<br.*?\/>)/g, '$1');

        listTypeOptions = WYMeditor.LIST_TYPE_ELEMENTS.join('|');
        normedActual = normedActual.replace(
            new RegExp('\\s(<(' + listTypeOptions + ').*?>)', 'g'),
            '$1'
        );
    }

    // Assert: compare between normalized actual HTML and expected HTML.
    strictEqual(normedActual, expected, options.assertionString);
    // If the last assertion failed:
    if (QUnit.config.current
        .assertions[QUnit.config.current.assertions.length - 1]
        .result === false) {
        // If assertions are expected:
        if (expect()) {
            // Increment the number of expected assertions by one. This allows
            // tests to treat this wymEqual helper as if it was one assertion.
            expect(expect() + 1);
        }
        // Assert also on beautified HTML.
        strictEqual(
            /* jshint camelcase: false */
            html_beautify(normedActual, htmlBeautifyOptions),
            html_beautify(expected, htmlBeautifyOptions),
            options.assertionString + ' (beautified)'
        );
    }
}

function makeSelection(
    wymeditor, startElement, endElement, startElementIndex, endElementIndex
) {
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
    // http://code.google.com/p/rangy/wiki/RangySelection
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
function makeTextSelection(
    wymeditor, startElement, endElement, startElementIndex, endElementIndex) {
    var $startElementContents,
        $endElementContents,
        nodeType,
        isTextNode;

    if (typeof startElementIndex !== 'undefined') {
        // Look for a first-child text node and use
        // that as the startElement for the makeSelection() call
        $startElementContents = jQuery(startElement).contents();
        if ($startElementContents.length > 0) {
            nodeType = $startElementContents.get(0).nodeType;
            isTextNode = nodeType === WYMeditor.NODE.TEXT;
            if (isTextNode) {
                startElement = $startElementContents.get(0);
            }
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

    makeSelection(
        wymeditor,
        startElement,
        endElement,
        startElementIndex,
        endElementIndex
    );
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

    deepEqual(wymeditor.selContainer(), selectedElement, "moveSelector");
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

    keydown.which = keyCode;
    keydown.metaKey = options.metaKey;
    keydown.ctrlKey = options.ctrlKey;
    keydown.shiftKey = options.shiftKey;
    keydown.altKey = options.altKey;

    keypress = jQuery.Event('keypress');
    keypress.which = keyCode;
    keydown.metaKey = options.metaKey;
    keydown.ctrlKey = options.ctrlKey;
    keydown.shiftKey = options.shiftKey;
    keydown.altKey = options.altKey;

    keyup = jQuery.Event('keyup');
    keyup.which = keyCode;
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
    if (!jQuery.browser.mozilla &&
        typeof element.isContentEditable  !== 'undefined') {
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
