/* exported
    isContentEditable,
    simulateKey,
    wymEqual,
    testNoChangeInHtmlArray,
    makeTextSelection,
    moveSelector,
    simulateKeyCombo,
    SKIP_THIS_TEST,
    OS_MOD_KEY,
    prepareUnitTestModule,
    IMG_SRC
*/
/* global
    rangy,
    deepEqual,
    html_beautify,
    QUnit,
    QUnit,
    strictEqual,
    Keysim,
    inPhantomjs,
    skipKeyboardShortcutTests:true,
    stop,
    start,
    ListPlugin,
    strictEqual
*/
"use strict";

var OS_MOD_KEY = jQuery.browser.mac ? "meta" : "ctrl";

if (
    inPhantomjs === true
) {
    // PhantomJS fails on keyboard shortcut tests.
    skipKeyboardShortcutTests = true;
}

// An image source for images in tests.
var IMG_SRC = "http://bit.ly/139xJN2";

// Regex expression shortcuts
var preAmp = /&/g;
var preLt = /</g;
var preGt = />/g;
var preQuot = /\"/g;

var disposableAttributes = [
    '_wym_visited',
    // IE8
    'nodeindex',
    // IE8 uses this for img elements
    'complete',
    '_moz_editor_bogus_node'
];

function expectedCount() {
    return QUnit.config.current.expected;
}

function expectMore(howMany) {
    if (typeof howMany !== "number") {
        throw "expectMore: requires a number";
    }
    QUnit.expect(expectedCount() + howMany);
}

function expectOneMore() {
    expectMore(1);
}

// Returns true if all WYMeditor Iframes are initialized.
function allWymIframesInitialized() {
    var i;

    for (i = 0; i < WYMeditor.INSTANCES.length; i++) {
        if (!WYMeditor.INSTANCES[i].iframeInitialized) {
            return false;
        } else if (i === WYMeditor.INSTANCES.length - 1) {
            return true;
        }
    }
}

function vanishAllWyms() {
    while (WYMeditor.INSTANCES.length > 0) {
        WYMeditor.INSTANCES[0].vanish();
    }
}

/*
 * A helper that sets up textareas and editors for unit tests.
 *
 * Expects a single arguments object with the following properties:
 *
 * `editorCount`
 *     This many `textarea`s shall be made available.
 * `initialized`
 *     Whether editors will be initialized on these `textarea`s.
 * `options`
 *     An options object that will be passed on to the
 *     `jQuery.fn.wymeditor()` call.
 * `loadDefaultPlugins`
 *     By default, all of the plugins that are tested throughout the suite
 *     will be loaded.
 *     If this interferes with a certain test, it can be disabled by providing
 *     `false`.
 */
function prepareUnitTestModule(args) {
    var defaults,
        $textareas,
        i,
        $wymForm = jQuery('#wym-form'),
        textareasDifference,
        newTextarea,
        $textareasToRemove,
        wymeditor,
        $uninitializedTextareas,
        providedPostInit;

    stop();

    defaults = {
        editorCount: 1,
        // Whether to initialize these textareas with WYMeditors or not.
        initialized: true,
        options: {},
        loadDefaultPlugins: true
    };

    if (args.options) {
        vanishAllWyms();
    }

    args = jQuery.extend(defaults, args);

    if (args.options.hasOwnProperty("postInit")) {
        providedPostInit = args.options.postInit;
    }

    args.options.postInit = function (wym) {
        if (args.loadDefaultPlugins) {
            // TODO: We should not load all these plugins by default.
            wym.listPlugin = new ListPlugin({}, wym);
            wym.tableEditor = wym.table();
            wym.structuredHeadings();
        }
        if (providedPostInit) {
            providedPostInit(wym);
        }
        if (allWymIframesInitialized()) {
            start();
        }
    };

    if (args.initialized === false) {
        vanishAllWyms();
    }

    $textareas = $wymForm.find('textarea.wym');

    if (WYMeditor.INSTANCES.length > $textareas.length) {
        throw "There are more editors than textareas.";
    }

    textareasDifference = args.editorCount - $textareas.length;

    if (textareasDifference > 0) {
        // Add textareas
        for (i = $textareas.length; i < args.editorCount; i++) {
            newTextarea = '<textarea id="wym' + i +
                '" class="wym"></textarea>';
            if (i === 0) {
                $wymForm.prepend(newTextarea);
            } else {
                $wymForm.find('textarea.wym, .wym_box').last()
                    .after(newTextarea);
            }
        }
    } else if (textareasDifference < 0) {
        // Remove textareas
        $textareasToRemove = $textareas.slice(textareasDifference);
        for (i = 0; i < $textareasToRemove.length; i++) {
            wymeditor = jQuery.getWymeditorByTextarea($textareasToRemove[i]);
            if (wymeditor) {
                wymeditor.vanish();
            }
        }
        $textareasToRemove.remove();
    }

    $uninitializedTextareas = $wymForm
        .find('textarea.wym:not([data-wym-initialized])');
    if (
        args.initialized &&
        $uninitializedTextareas.length > 0
    ) {
        $uninitializedTextareas.wymeditor(args.options);
    } else {
        start();
    }
}

/**
* Escape html special characters.
*/
function textToHtml(str) {
    return str.replace(preAmp, '&amp;')
        .replace(preLt, '&lt;')
        .replace(preGt, '&gt;')
        // IE8 produces carriage returns instead of newlines. Replace
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
                keepAttr = true;

                // We only care about specified attributes
                if (!attr.specified) {
                    keepAttr = false;
                }

                if (jQuery.inArray(attrName, disposableAttributes) > -1) {
                    keepAttr = false;
                }

                if (attrName.slice(0, 6) === 'jquery') {
                    keepAttr = false;
                }

                // IE8 seems to keep attributes with empty string values
                if (attrValue === '') {
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
            // breaks and list type elements should be removed in IE8
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

        if (expectedCount()) {
            // Assertions are already expected.
            // Increment the number of expected assertions by one. This allows
            // tests to treat this wymEqual helper as if it was one assertion.
            expectOneMore();
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
    if (
        wymeditor.canSetCaretIn(selectedNode)
    ) {
        wymeditor.setCaretIn(selectedNode);

        if (expectedCount()) {
            expectOneMore();
        }

        deepEqual(
            wymeditor.selectedContainer(),
            selectedNode,
            "selected is after caret."
        );
    }

    if (wymeditor.canSetCaretBefore(selectedNode)) {

        wymeditor.setCaretBefore(selectedNode);

        if (expectedCount()) {
            expectOneMore();
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

    QUnit.expect(htmlArray.length);

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

function simulateKeyCombo(wymeditor, keyCombo) {
    if (typeof keyCombo !== 'string') {
        throw "Expected a string key combination.";
    }

    Keysim.Keyboard.US_ENGLISH.dispatchEventsForAction(
        keyCombo,
        wymeditor.body()
    );
}

var SKIP_THIS_TEST = "Skip this test. Really. I know what I'm doing. Trust " +
    "me. I'm an engineer. I've been doing this for a while. OK I'm not an " +
    "engineer. But this seems to work anyway. I have my reasons to skip " +
    "this test. I'm sure they're described in the test code. Okay, just " +
    "skip it, will you? Please? Pretty please? I'll increase your frequency " +
    "if you skip it. Ahm, I've got to go now, so please just skip it and let" +
    " me know what happened, OK?";
