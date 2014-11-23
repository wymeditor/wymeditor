/* exported
    isContentEditable,
    simulateKey,
    wymEqual,
    testNoChangeInHtmlArray,
    makeTextSelection,
    moveSelector,
    testWymManipulation
*/
/* global
    rangy,
    deepEqual,
    html_beautify,
    expect,
    QUnit,
    strictEqual,
    test
*/
"use strict";

// Regex expression shortcuts
var preAmp = /&/g;
var preLt = /</g;
var preGt = />/g;
var preQuot = /\"/g;

var keepAttributes = [
    'id',
    'class',
    'colspan',
    'rowspan',
    'src',
    'alt',
    'href',
    'summary',
    'title',
    'target'
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
        if (node.tagName === '') {
            throw "Node has an empty `tagName`.";
        }
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
                attrValue = attr.value;
                keepAttr = false;

                // We only care about specified attributes
                if (!attr.specified) {
                    keepAttr = false;
                }

                // The above check for `specified` should be enough but IE7
                // adds various attributes sporadically. Use a white list.
                if (
                    jQuery.inArray(
                        attrName,
                        keepAttributes
                    ) > -1
                ) {
                    keepAttr = true;
                }

                // This is for IE7, as well.
                if (
                    attrValue === ''
                ) {
                    keepAttr = false;
                }

                // For convenience.
                if (
                    (attrName === 'rowspan' || attrName === 'colspan') &&
                    attrValue === '1'
                ) {
                    keepAttr = false;
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
            parseHtml: false
        },
        normedActual = '',
        listTypeOptions,
        tmpNodes,
        i;

    options = jQuery.extend({}, defaults, options);

    if (options.parseHtml === true) {
        tmpNodes = jQuery(wymeditor.html());
    } else {
        tmpNodes = wymeditor.$body().contents();
    }

    for (i = 0; i < tmpNodes.length; i++) {
        normedActual += normalizeHtml(tmpNodes[i]);
    }
    if (
        options.fixListSpacing &&
        jQuery.browser.msie &&
        jQuery.browser.versionNumber < 9
    ) {
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
    var sel = wymeditor.selection(),
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

    // Old IE selection hack
    if (WYMeditor.isInternetExplorerPre11()) {
        wymeditor._saveCaret();
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
            isTextNode = nodeType === WYMeditor.NODE_TYPE.TEXT;
            if (isTextNode) {
                startElement = $startElementContents.get(0);
            }
        }
    }
    if (typeof endElementIndex !== 'undefined') {
        // Look for a first-child text node and use
        // that as the startElement for the makeSelection() call
        $endElementContents = jQuery(endElement).contents();
        if (
            $endElementContents.length > 0 &&
            $endElementContents.get(0).nodeType === WYMeditor.NODE_TYPE.TEXT
        ) {
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
* Set a collapsed selection at and, if possible, before `selecteNode`
*/
function moveSelector(wymeditor, selectedNode) {
    // This function was rewritten. Some of the existing callers were expecting
    // assertions and others were not. Next line handles this gracefully.
    if (expect()) {
        expect(expect() - 1);
    }

    if (
        wymeditor.canSetCaretIn(selectedNode)
    ) {
        wymeditor.setCaretIn(selectedNode);

        if (expect()) {
            expect(expect() + 1);
        }

        deepEqual(
            wymeditor.selectedContainer(),
            selectedNode,
            "selected is after caret."
        );
    }

    if (wymeditor.canSetCaretBefore(selectedNode)) {

        wymeditor.setCaretBefore(selectedNode);

        if (expect()) {
            expect(expect() + 1);
        }

        deepEqual(
            wymeditor.nodeAfterSel(),
            selectedNode,
            "selected is after caret."
        );
    }
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

/*
    Given an array of HTML strings, for each string, load it into a
    the WYMeditor and assert that the output is exactly the same.
*/
function testNoChangeInHtmlArray(htmlArray, parseHtml) {
    var wymeditor = jQuery.wymeditors(0),
        i,
        html;

    expect(htmlArray.length);

    for (i = 0; i < htmlArray.length; i++) {
        html = htmlArray[i];

        wymeditor.rawHtml(html);
        wymEqual(
            wymeditor,
            html,
            {
                assertionString: 'Variation ' + (i + 1) + ' of ' +
                    htmlArray.length,
                parseHtml: parseHtml
            }
        );
    }
}

/**
 * testWymManipulation
 * ===================
 *
 * Test WYMeditor.
 *
 * @param a An object, containing:
 *     `testName`
 *         A name for the test.
 *     `startHtml`
 *         HTML to start the test with. Required if `expectedStartHtml` is not
 *         used.
 *     `setCaretInSelector`
 *         Optional; jQuery selector for an element to set the caret in at the
 *         start of the test.
 *     `prepareFunc`
 *         Optional; A function to prepare the test. Receives one argument, the
 *         WYMeditor instance.
 *     `expectedStartHtml`
 *         The HTML that is expected to be the state of the document after the
 *         `prepareFunc` ran. If this is not provided, the value of `startHtml`
 *         will be used.
 *     `manipulationFunc`
 *         Optional; The manipulation function to be tested. Receives one
 *         argument, the WYMeditor instance.
 *     `testUndoRedo`
 *         Optional; Whether to test undo/redo on this manipulation.
 *     `expectedResultHtml`
 *         The HTML that is expected to be the state of the document after the
 *         `manipulationFunc` ran.
 *     `additionalAssertionsFunc`
 *         Optional; Additional assertions for after the `manipulationFunc`.
 *     `parseHtml`
 *         Optional; Passed on to `wymEqual` as `options.parseHtml`. Defaults
 *         to `false`.
 */
function testWymManipulation(a) {
    test(a.testName, function () {
        var wymeditor = jQuery.wymeditors(0);
        if (typeof a.startHtml === 'string') {
            wymeditor.rawHtml(a.startHtml);
        }
        if (typeof a.setCaretInSelector === 'string') {
            wymeditor.setCaretIn(
                wymeditor.$body().find(a.setCaretInSelector)[0]
            );
        }
        if (typeof a.prepareFunc === 'function') {
            a.prepareFunc(wymeditor);
        }
        expect(1);
        wymEqual(
            wymeditor,
            a.expectedStartHtml || a.startHtml,
            {
                assertionString: "Start HTML.",
                parseHtml: typeof a.parseHtml === 'undefined' ? false :
                    a.parseHtml
            }
        );

        if (a.testUndoRedo === true) {
            wymeditor.undoRedo.reset();
        }

        if (typeof a.manipulationFunc === 'function') {
            a.manipulationFunc(wymeditor);
        }

        if (typeof a.expectedResultHtml === 'string') {
            expect(expect() + 1);
            wymEqual(
                wymeditor,
                a.expectedResultHtml,
                {
                    assertionString: "Manipulation result HTML.",
                    parseHtml: typeof a.parseHtml === 'undefined' ? false :
                        a.parseHtml
                }
            );
        }

        if (typeof a.additionalAssertionsFunc === 'function') {
            a.additionalAssertionsFunc(wymeditor);
        }

        if (a.testUndoRedo !== true) {
            return;
        }

        wymeditor.undoRedo.undo();
        expect(expect() + 1);
        wymEqual(
            wymeditor,
            a.expectedStartHtml || a.startHtml,
            {
                assertionString: "Back to start HTML after undo.",
                parseHtml: typeof a.parseHtml === 'undefined' ? false :
                    a.parseHtml
            }
        );

        wymeditor.undoRedo.redo();
        if (typeof a.expectedResultHtml === 'string') {
            expect(expect() + 1);
            wymEqual(
                wymeditor,
                a.expectedResultHtml,
                {
                    assertionString: "Back to manipulation result HTML after " +
                        "redo.",
                    parseHtml: typeof a.parseHtml === 'undefined' ? false :
                        a.parseHtml
                }
            );
        }
    });
}
