/* jshint maxlen: 90 */
/* global setupWym, SKIP_KNOWN_FAILING_TESTS,
wymEqual, makeTextSelection, normalizeHtml,
ok, test, expect, deepEqual */
"use strict";

/*
    Tests for the structured_headings plugin.
*/
var START_NODE_CLASS = WYMeditor.STRUCTURED_HEADINGS_START_NODE_CLASS;
var LEVEL_CLASSES = WYMeditor.STRUCTURED_HEADINGS_LEVEL_CLASSES;
var NUMBERING_SPAN_CLASS = WYMeditor.STRUCTURED_HEADINGS_NUMBERING_SPAN_CLASS;

/*
    getHtmlAfterKeyup
    =================

    Triggers an enter keyup event on the wymeditor body and returns the
    normalized html of the body after the keyup event was applied.
*/
function getHtmlAfterKeyup(wymeditor) {
    var $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        keyupEvent,
        bodyHtml;

    // Set up shift key keyup event
    keyupEvent = jQuery.Event('keyup');
    keyupEvent.which = WYMeditor.KEY.ENTER;

    $body.trigger(keyupEvent);

    // Normalize HTML and remove the body tag to get just inner body html
    bodyHtml = normalizeHtml($body[0]).replace(/<\/?body.*?>/g, '');
    return bodyHtml;
}

module("structured_headings-initialize_interface", {setup: setupWym});

test("Single 'Heading' option in containers panel", function () {
    expect(2);
    var wymeditor = jQuery.wymeditors(0),
        $box = jQuery(wymeditor._box),
        $containersPanelItems = $box.find(
            wymeditor._options.containersSelector + ' li a'),
        containerName,
        specificHeadingFound = false,
        genericHeadingFound = false,
        i;

    for (i = 0; i < $containersPanelItems.length; ++i) {
        containerName = $containersPanelItems[i].name.toLowerCase();
        if (jQuery.inArray(containerName, WYMeditor.HEADING_ELEMENTS) > -1) {
            specificHeadingFound = true;
            break;
        }
    }
    ok(!specificHeadingFound,
       "No specific heading type option listed in the containers panel");

    for (i = 0; i < $containersPanelItems.length; ++i) {
        containerName = $containersPanelItems[i].name.toLowerCase();
        if (containerName === "heading") {
            genericHeadingFound = true;
            break;
        }
    }
    ok(genericHeadingFound,
       "Generic heading option listed in the containers panel");
});

module("structured_headings-initialize_styles", {setup: setupWym});

test("Stylesheet added to iframe", function () {
    expect(2);
    var wymeditor = jQuery.wymeditors(0),
        $iframeHeadLinks = jQuery(wymeditor._doc).find('head > link'),

        foundLink = false,
        successfulRequest = false,

        testRequest,
        linkFileName,
        expectedFileName,
        linkHref,
        i;

    if (WYMeditor.STRUCTURED_HEADINGS_POLYFILL_REQUIRED) {
        expectedFileName = 'structured_headings_ie7_editor.css';
    } else {
        expectedFileName = 'structured_headings.css';
    }

    for (i = 0; i < $iframeHeadLinks.length; ++i) {
        linkFileName = $iframeHeadLinks[i].href.split('/').pop();
        if (linkFileName === expectedFileName) {
            foundLink = true;
            linkHref = $iframeHeadLinks.eq(i).attr('href');
            linkHref = linkHref.replace('../..', '/wymeditor');
            break;
        }
    }
    ok(foundLink, "Link exists in iframe head for stylesheet");

    if (linkHref) {
        testRequest = new XMLHttpRequest();
        testRequest.open('GET', linkHref, false);
        testRequest.send('');
        successfulRequest = (testRequest.status === 200);
    }
    ok(successfulRequest, "Stylesheet successfully loads on request");
});

module("structured_headings-css_access", {setup: setupWym});

test("CSS stored for user access through console", function () {
    expect(1);
    var cssRequest,
        stylesheetURL = '../../wymeditor/plugins/structured_headings/';

    if (WYMeditor.STRUCTURED_HEADINGS_POLYFILL_REQUIRED) {
        stylesheetURL += 'structured_headings_ie7_user.css';
    } else {
        stylesheetURL += 'structured_headings.css';
    }

    cssRequest = new XMLHttpRequest();
    cssRequest.open('GET', stylesheetURL, false);
    cssRequest.send('');

    deepEqual(WYMeditor.structuredHeadingsCSS, cssRequest.responseText,
              "CSS correctly stored for user access");
});

var testHeadingInsertion = function () {};
var testHeadingIndent = function () {};
var testHeadingOutdent = function () {};
var testMultiIndentOutdent = function () {};

if (!WYMeditor.STRUCTURED_HEADINGS_POLYFILL_REQUIRED ||
    !SKIP_KNOWN_FAILING_TESTS) {

    module("structured_headings-heading_insertion", {setup: setupWym});

    var htmlForHeadingInsertion = String() +
        '<h1>H1</h1>' +
        '<p id="to_be_h1">Test</p>' +
            '<h2>H1_1</h2>' +
                '<h3>H1_1_1</h3>' +
                '<h3>H1_1_2</h3>' +
            '<h2>H1_2</h2>' +
            '<p id="to_be_h2">Test</p>' +
                '<h3>H1_2_1</h3>' +
                '<h3>H1_2_2</h3>' +
                    '<h4>H1_2_2_1</h4>' +
                    '<p id="to_be_h4">Test</p>' +
                    '<h4>H1_2_2_2</h4>' +
        '<h1>H2</h1>' +
            '<h2>H2_1</h2>' +
                '<h3>H2_1_1</h3>' +
                    '<h4>H2_1_1_1</h4>' +
                    '<h4>H2_1_1_2</h4>' +
                        '<h5>H2_1_1_2_1</h5>' +
                        '<h5>H2_1_1_2_2</h5>' +
                        '<p id="to_be_h5">Test</p>' +
                '<h3>H2_1_2</h3>' +
                '<p id="to_be_h3">Test</p>' +
            '<h2>H2_2</h2>' +
                '<h3>H2_2_1</h3>' +
                    '<h4>H2_2_1_1</h4>' +
                        '<h5>H2_2_1_1_1</h5>' +
                            '<h6>H2_2_1_1_1_1</h6>' +
                            '<p id="to_be_h6">Test</p>' +
                            '<h6>H2_2_1_1_1_2</h6>' +
                        '<h5>H2_2_1_1_2</h5>' +
                    '<h4>H2_2_1_2</h4>' +
                '<h3>H2_2_2</h3>';

    var correctHtmlInsertions = [];
    var i;

    // Generate the correct html after a heading is inserted at various levels. The
    // correct html for each heading level insertion will be stored in
    // correctHtmlInsertions at the index one less than the heading's level (e.g.
    // the correct html for an insertion at the H1 level is stored at index 0 of
    // correctHtmlInsertions).
    for (i = 1; i < 7; ++i) {
        correctHtmlInsertions.push(htmlForHeadingInsertion.replace(
            '<p id="to_be_h' + i + '">Test</p>',
            '<h' + i + ' id="to_be_h' + i + '">Test</h' + i + '>'
        ));
    }

    /**
        testHeadingInsertion
        ====================

        Tests that headings are assigned to be a proper level based on the
        context in which the headings are inserted. Selects a paragraph after a
        heading of each level between `h1` and `h6`, and clicks on the heading
        link in the containers panel to test if the heading is properly
        inserted.

       @param wymeditor A wymeditor instance in which to test heading
                        insertion.
    */
    testHeadingInsertion = function (wymeditor) {
        var $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
            $headingContainerLink = jQuery(wymeditor._box).find(
                wymeditor.structuredHeadingsManager._options.headingContainerPanelSelector
            ),
            paragraph,
            i;

        for (i = 1; i < 7; ++i) {
            wymeditor._html(htmlForHeadingInsertion);
            paragraph = $body.find('#to_be_h' + i)[0];
            makeTextSelection(wymeditor, paragraph, paragraph);
            $headingContainerLink.click();
            wymEqual(wymeditor, correctHtmlInsertions[i - 1], {
                    assertionString: "Insertion of an H" + i +
                        " heading based on context."
                });
        }
    };

    test("Insert headings with default settings", function () {
        expect(6);
        var wymeditor = jQuery.wymeditors(0);

        testHeadingInsertion(wymeditor);
    });

    test("Insert headings with custom highest and lowest heading levels", function () {
        expect(6);
        var wymeditor = jQuery.wymeditors(0);

        wymeditor.structuredHeadingsManager._options.highestAllowableHeadingLevel = 2;
        wymeditor.structuredHeadingsManager._options.lowestAllowableHeadingLevel = 4;

        testHeadingInsertion(wymeditor);

        // Restore defaults for other tests
        wymeditor.structuredHeadingsManager._options.highestAllowableHeadingLevel = 1;
        wymeditor.structuredHeadingsManager._options.lowestAllowableHeadingLevel = 6;
    });


    // Set up variables for indention and outdention tests
    var htmlForHeadingIndention = String() +
        '<h1>H1</h1>' +
            '<h2 id="h2_no_indent">H1_1</h2>' +
                '<h3>H1_1_1</h3>' +
                '<h3>H1_1_2</h3>' +
            '<h2 id="h2_for_indent">H1_2</h2>' +
                '<h3>H1_2_1</h3>' +
                '<h3>H1_2_2</h3>' +
                    '<h4>H1_2_2_1</h4>' +
                    '<h4 id="h4_for_indent">H1_2_2_2</h4>' +
        '<h1 id="h1_for_indent">H2</h1>' +
            '<h2>H2_1</h2>' +
                '<h3 id="h3_no_indent">H2_1_1</h3>' +
                    '<h4>H2_1_1_1</h4>' +
                    '<h4>H2_1_1_2</h4>' +
                        '<h5 id="h5_no_indent">H2_1_1_2_1</h5>' +
                        '<h5>H2_1_1_2_2</h5>' +
                '<h3 id="h3_for_indent">H2_1_2</h3>' +
            '<h2>H2_2</h2>' +
                '<h3>H2_2_1</h3>' +
                    '<h4 id="h4_no_indent">H2_2_1_1</h4>' +
                        '<h5>H2_2_1_1_1</h5>' +
                            '<h6>H2_2_1_1_1_1</h6>' +
                            '<h6 id="h6_for_indent">H2_2_1_1_1_2</h6>' +
                        '<h5 id="h5_for_indent">H2_2_1_1_2</h5>' +
                    '<h4>H2_2_1_2</h4>' +
                '<h3>H2_2_2</h3>';

    var htmlForHeadingOutdention = String() +
        '<h1>H1</h1>' +
            '<h2>H1_1</h2>' +
                '<h3>H1_1_1</h3>' +
                '<h3>H1_1_2</h3>' +
            '<h2 id="h2_no_outdent">H1_2</h2>' +
                '<h3>H1_2_1</h3>' +
                '<h3>H1_2_2</h3>' +
                    '<h4>H1_2_2_1</h4>' +
                    '<h4 id="h4_for_outdent">H1_2_2_2</h4>' +
            '<h2 id="h2_for_outdent">H1_3</h2>' +
        '<h1 id="h1_for_outdent">H2</h1>' +
            '<h2>H2_1</h2>' +
                '<h3 id="h3_no_outdent">H2_1_1</h3>' +
                    '<h4>H2_1_1_1</h4>' +
                    '<h4 id="h4_no_outdent">H2_1_1_2</h4>' +
                        '<h5>H2_1_1_2_1</h5>' +
                        '<h5 id="h5_for_outdent">H2_1_1_2_2</h5>' +
                '<h3 id="h3_for_outdent">H2_1_2</h3>' +
                '<h3>H2_1_3</h3>' +
            '<h2>H2_2</h2>' +
                '<h3>H2_2_1</h3>' +
                    '<h4>H2_2_1_1</h4>' +
                        '<h5>H2_2_1_1_1</h5>' +
                            '<h6 id="h6_for_outdent">H2_2_1_1_1_1</h6>' +
                            '<h6>H2_2_1_1_1_2</h6>' +
                        '<h5 id="h5_no_outdent">H2_2_1_1_2</h5>' +
                            '<h6>H2_2_1_1_2_1</h6>' +
                    '<h4>H2_2_1_2</h4>' +
                '<h3>H2_2_2</h3>';


    var correctHtmlIndent = [];
    var correctHtmlOutdent = [];
    var pattern;
    var i;

    // Generate the correct html after an indent or outdent is applied to various
    // heading levels. The correct html for each heading level after indention or
    // outdention will be stored in correctHtmlIndent and correctHtmlOutdent at the
    // index one less than the heading's level (e.g. the correct html for the H1
    // heading after indention is stored at index 0 of correctHtmlIndent).
    for (i = 1; i < 7; ++i) {
        if (i !== 6) {
            pattern = new RegExp('<h' + i + ' id="h' + i +
                                 '_for_indent">(\\w*)<\\/h' + i + '>');
            correctHtmlIndent.push(htmlForHeadingIndention.replace(
                pattern,
                '<h' + (i + 1) + ' id="h' + i + '_for_indent">$1</h' +
                    (i + 1) + '>'
            ));
        }

        if (i !== 1) {
            pattern = new RegExp('<h' + i + ' id="h' + i +
                                 '_for_outdent">(\\w*)<\\/h' + i + '>');
            correctHtmlOutdent.push(htmlForHeadingOutdention.replace(
                pattern,
                '<h' + (i - 1) + ' id="h' + i + '_for_outdent">$1</h' +
                    (i - 1) + '>'
            ));
        }
    }

    module("structured_headings-indent", {setup: setupWym});

    /**
        testHeadingIndent
        =================

        Tests heading indention by individually selecting with the passed
        selectionType a heading at each level between `h1` and `h5` followed by
        using the indent tool and comparing the resulting html to the expected
        result.

        @param wymeditor The wymeditor instance in which to test heading
                         indention.
        @param selectionType A string that specifies the type of selection used
                             in the tests. Can be either 'text' or 'collapsed'.
    */
    testHeadingIndent = function (wymeditor, selectionType) {
        var $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
            $indentTool = jQuery(wymeditor._box).find(
                wymeditor.structuredHeadingsManager._options.headingIndentToolSelector),
            selectionStart = 0,
            selectionEnd = (selectionType === 'collapsed' ? 0 : 2),
            heading,
            i;

        for (i = 1; i < 6; ++i) {
            wymeditor._html(htmlForHeadingIndention);
            heading = $body.find('#h' + i + '_for_indent')[0];
            makeTextSelection(wymeditor, heading, heading,
                              selectionStart, selectionEnd);
            $indentTool.click();
            wymEqual(wymeditor, correctHtmlIndent[i - 1], {
                    assertionString: "Indention of an H" + i + " heading"
                });
        }
    };

    test("Headings indent when allowable by using indent tool with text " +
         "selection", function () {
        expect(5);
        var wymeditor = jQuery.wymeditors(0);

        testHeadingIndent(wymeditor, 'text');
    });

    test("Headings indent when allowable by using indent tool with collapsed " +
         "selection", function () {
        expect(5);
        var wymeditor = jQuery.wymeditors(0);

        testHeadingIndent(wymeditor, 'collapsed');
    });

    test("Lowest heading level does not indent", function () {
        expect(2);
        var wymeditor = jQuery.wymeditors(0),
            $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
            $indentTool = jQuery(wymeditor._box).find(
                wymeditor.structuredHeadingsManager._options.headingIndentToolSelector),
            heading;

        // Default highest heading level
        wymeditor._html(htmlForHeadingIndention);
        if (WYMeditor.STRUCTURED_HEADINGS_POLYFILL_REQUIRED) {
            wymeditor.structuredHeadingsManager.numberHeadingsIE7();
        }
        heading = $body.find('#h6_for_indent')[0];
        makeTextSelection(wymeditor, heading, heading);
        $indentTool.click();
        wymEqual(wymeditor, htmlForHeadingIndention, {
                assertionString: "Indention of default lowest heading level does nothing"
            });

        // Customized highest heading level
        wymeditor.structuredHeadingsManager._options.lowestAllowableHeadingLevel = 4;
        wymeditor._html(htmlForHeadingIndention);
        if (WYMeditor.STRUCTURED_HEADINGS_POLYFILL_REQUIRED) {
            wymeditor.structuredHeadingsManager.numberHeadingsIE7();
        }
        heading = $body.find('#h4_for_indent')[0];
        makeTextSelection(wymeditor, heading, heading);
        $indentTool.click();
        wymEqual(wymeditor, htmlForHeadingIndention, {
                assertionString: "Indention of customized lowest heading " +
                    "level does nothing"
            });

        // Restore default for other tests
        wymeditor.structuredHeadingsManager._options.lowestAllowableHeadingLevel = 6;
    });

    test("Heading cannot be indented more than one level below directly " +
         "previous heading level", function () {
        expect(4);
        var wymeditor = jQuery.wymeditors(0),
            $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
            $indentTool = jQuery(wymeditor._box).find(
                wymeditor.structuredHeadingsManager._options.headingIndentToolSelector),
            heading,
            i;

        for (i = 2; i < 6; ++i) {
            wymeditor._html(htmlForHeadingIndention);
            if (WYMeditor.STRUCTURED_HEADINGS_POLYFILL_REQUIRED) {
                wymeditor.structuredHeadingsManager.numberHeadingsIE7();
            }
            heading = $body.find('#h' + i + '_no_indent')[0];
            makeTextSelection(wymeditor, heading, heading);
            $indentTool.click();
            wymEqual(wymeditor, htmlForHeadingIndention, {
                assertionString: "Indention of an H" + i + " heading directly after an " +
                "H" + (i - 1) + " heading does nothing"
            });
        }
    });

    module("structured_headings-outdent", {setup: setupWym});

    /**
        testHeadingOutdent
        =================

        Tests heading outdention by individually selecting with the passed
        selectionType a heading at each level between `h2` and `h6` followed by
        using the outdent tool and comparing the resulting html to the expected
        result.

        @param wymeditor The wymeditor instance in which to test heading
                         outdention.
        @param selectionType A string that specifies the type of selection used
                             in the tests. Can be either 'text' or 'collapsed'.
    */
    testHeadingOutdent = function (wymeditor, selectionType) {
        var $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
            $outdentTool = jQuery(wymeditor._box).find(
                wymeditor.structuredHeadingsManager._options.headingOutdentToolSelector),
            selectionStart = 0,
            selectionEnd = (selectionType === 'collapsed' ? 0 : 2),
            heading,
            i;

        for (i = 2; i < 7; ++i) {
            wymeditor._html(htmlForHeadingOutdention);
            heading = $body.find('#h' + i + '_for_outdent')[0];
            makeTextSelection(wymeditor, heading, heading,
                              selectionStart, selectionEnd);
            $outdentTool.click();
            wymEqual(wymeditor, correctHtmlOutdent[i - 2], {
                    assertionString: "Outdention of an H" + i + " heading"
                });
        }
    };

    test("Headings outdent when allowable by using outdent tool with text " +
         "selection", function () {
        expect(5);
        var wymeditor = jQuery.wymeditors(0);

        testHeadingOutdent(wymeditor, 'text');
    });

    test("Headings outdent when allowable by using outdent tool with collapsed " +
         "selection", function () {
        expect(5);
        var wymeditor = jQuery.wymeditors(0);

        testHeadingOutdent(wymeditor, 'collapsed');
    });

    test("Highest heading level does not outdent", function () {
        expect(2);
        var wymeditor = jQuery.wymeditors(0),
            $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
            $outdentTool = jQuery(wymeditor._box).find(
                wymeditor.structuredHeadingsManager._options.headingOutdentToolSelector),
            heading;

        // Default highest heading level
        wymeditor._html(htmlForHeadingOutdention);
        if (WYMeditor.STRUCTURED_HEADINGS_POLYFILL_REQUIRED) {
            wymeditor.structuredHeadingsManager.numberHeadingsIE7();
        }
        heading = $body.find('#h1_for_outdent')[0];
        makeTextSelection(wymeditor, heading, heading);
        $outdentTool.click();
        wymEqual(wymeditor, htmlForHeadingOutdention, {
                assertionString: "Outdention of default highest heading " +
                    "level does nothing"
            });

        // Customized highest heading level
        wymeditor.structuredHeadingsManager._options.highestAllowableHeadingLevel = 3;
        wymeditor._html(htmlForHeadingOutdention);
        if (WYMeditor.STRUCTURED_HEADINGS_POLYFILL_REQUIRED) {
            wymeditor.structuredHeadingsManager.numberHeadingsIE7();
        }
        heading = $body.find('#h3_for_outdent')[0];
        makeTextSelection(wymeditor, heading, heading);
        $outdentTool.click();
        wymEqual(wymeditor, htmlForHeadingOutdention, {
                assertionString: "Outdention of customized highest heading" +
                    " level does nothing"
            });

        // Restore default for other tests
        wymeditor.structuredHeadingsManager._options.highestAllowableHeadingLevel = 1;
    });

    test("Heading cannot be outdented more than one level above directly " +
         "following heading level", function () {
        expect(4);
        var wymeditor = jQuery.wymeditors(0),
            $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
            $outdentTool = jQuery(wymeditor._box).find(
                wymeditor.structuredHeadingsManager._options.headingOutdentToolSelector),
            heading,
            i;

        for (i = 2; i < 6; ++i) {
            wymeditor._html(htmlForHeadingOutdention);
            if (WYMeditor.STRUCTURED_HEADINGS_POLYFILL_REQUIRED) {
                wymeditor.structuredHeadingsManager.numberHeadingsIE7();
            }
            heading = $body.find('#h' + i + '_no_outdent')[0];
            makeTextSelection(wymeditor, heading, heading);
            $outdentTool.click();
            wymEqual(wymeditor, htmlForHeadingOutdention, {
                assertionString: "Outdention of an H" + i + " heading with a directly " +
                    "following H" + (i + 1) + " heading does nothing"
            });
        }
    });

    /**
        testMultiIndentOutdent
        ======================

        Tests the indention or outdention of multiple headings in a single
        selection. First, the passed startHtml is set in the editor body. Then,
        a selection with the passed startIndex and endIndex is made between the
        element with the id "start_selection" to the element with the id
        "end_selection". Then, the indent or outdent tool is clicked depending
        on indentOrOutdent, and finally, the html in the editor is tested
        against the passed correctHtml.

        @param wymeditor A wymeditor instance in which to test.
        @param indentOrOutdent A string being either 'indent' or 'outdent' that
                               specifies whether the indent or outdent tool
                               should be used.
        @param startHtml An html string to set in the editor body before the
                         test.
        @param correctHtml An html string to compare against the resulting html
                           in the editor after testing the multiple indention.
        @param startIndex The numeric index to start the selection at in the
                          text of the "start_selection" element.
        @param endIndex The numeric index to end the selection at in the text
                        of the "end_selection" element.
        @param assertionString The string message to be used with the equals
                               assertion of the test.
    */
    var testMultiIndentOutdent = function (
        wymeditor, indentOrOutdent, startHtml, correctHtml,
        startIndex, endIndex, assertionString
    ) {
        var $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
            $tool,
            startElement,
            endElement;

        if (indentOrOutdent === 'indent') {
            $tool = jQuery(wymeditor._box).find(
                wymeditor.structuredHeadingsManager._options.headingIndentToolSelector);
        } else {
            $tool = jQuery(wymeditor._box).find(
                wymeditor.structuredHeadingsManager._options.headingOutdentToolSelector);
        }

        wymeditor._html(startHtml);
        startElement = $body.find('#start_selection')[0];
        endElement = $body.find('#end_selection')[0];
        makeTextSelection(wymeditor, startElement, endElement,
                          startIndex, endIndex);
        $tool.click();
        wymEqual(wymeditor, correctHtml, {
            assertionString: assertionString
        });
    };

    module("structured_headings-multiple_indent", {setup: setupWym});

    var basicMultiIndentStart = String() +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
            '<h2 id="start_selection">Test</h2>' +
                '<h3>Test</h3>' +
                '<h3 id="end_selection">Test</h3>';
    var basicMultiIndentCorrect = String() +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
                '<h3 id="start_selection">Test</h3>' +
                    '<h4>Test</h4>' +
                    '<h4 id="end_selection">Test</h4>';

    test("Basic multiple indent", function () {
        expect(1);
        var wymeditor = jQuery.wymeditors(0);

        testMultiIndentOutdent(
            wymeditor, 'indent',
            basicMultiIndentStart, basicMultiIndentCorrect,
            undefined, undefined,
            "Basic multiple indent"
        );
    });

    test("Partial text selection multiple indent", function () {
        expect(1);
        var wymeditor = jQuery.wymeditors(0);

        testMultiIndentOutdent(
            wymeditor, 'indent',
            basicMultiIndentStart, basicMultiIndentCorrect,
            2, 3,
            "Partial text selection multiple indent"
        );
    });

    var multiIndentWithContentStart = String() +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
            '<p>Content</p>' +
            '<h2 id="start_selection"><a href="http://google.com">Test</a></h2>' +
            '<p>Content</p>' +
            '<pre>Preformatted Content</pre>' +
                '<h3>T<em>es</em>t</h3>' +
                '<p>Content</p>' +
                '<h3 id="end_selection">Te<span>st</span></h3>' +
                '<p>Content</p>';
    var multiIndentWithContentCorrect = String() +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
            '<p>Content</p>' +
                '<h3 id="start_selection"><a href="http://google.com">Test</a></h3>' +
                '<p>Content</p>' +
                '<pre>Preformatted Content</pre>' +
                    '<h4>T<em>es</em>t</h4>' +
                    '<p>Content</p>' +
                    '<h4 id="end_selection">Te<span>st</span></h4>' +
                    '<p>Content</p>';

    test("Mulitple indent with content within and around the headings", function () {
        expect(1);
        var wymeditor = jQuery.wymeditors(0);

        testMultiIndentOutdent(
            wymeditor, 'indent',
            multiIndentWithContentStart, multiIndentWithContentCorrect,
            undefined, undefined,
            "Mulitple indent with content within and around the headings"
        );
    });

    var multiIndentWithListStart = String() +
        '<h1>Test</h1>' +
            '<h2 id="start_selection">Test</h2>' +
            '<ol>' +
                '<li>Test</li>' +
                '<li>Test</li>' +
                '<li>Test</li>' +
            '</ol>' +
            '<h2>Test</h2>' +
            '<ul>' +
                '<li>Test</li>' +
                '<li>Test</li>' +
                '<li>Test</li>' +
            '</ul>' +
                '<h3>Test</h3>' +
                '<h3 id="end_selection">Test</h3>';
    var multiIndentWithListCorrect = String() +
        '<h1>Test</h1>' +
            '<h2 id="start_selection">Test</h2>' +
            '<ol>' +
                '<li>Test</li>' +
                '<li>Test</li>' +
                '<li>Test</li>' +
            '</ol>' +
                '<h3>Test</h3>' +
                '<ul>' +
                    '<li>Test</li>' +
                    '<li>Test</li>' +
                    '<li>Test</li>' +
                '</ul>' +
                    '<h4>Test</h4>' +
                    '<h4 id="end_selection">Test</h4>';

    test("Multiple indent with list content between headings", function () {
        expect(1);
        var wymeditor = jQuery.wymeditors(0);

        testMultiIndentOutdent(
            wymeditor, 'indent',
            multiIndentWithListStart, multiIndentWithListCorrect,
            undefined, undefined,
            "Multiple indent with list content between headings"
        );

    });

    var fullyInvalidMultiIndentStart = String() +
        '<h1>Test</h1>' +
            '<h2 id="start_selection">Test</h2>' +
                '<h3 id="start_selection">Test</h3>' +
                    '<h4 id="end_selection">Test</h4>' +
                '<h3>Test</h3>';

    test("Fully invalid multiple indent", function () {
        expect(1);
        var wymeditor = jQuery.wymeditors(0);

        testMultiIndentOutdent(
            wymeditor, 'indent',
            fullyInvalidMultiIndentStart, fullyInvalidMultiIndentStart,
            undefined, undefined,
            "Fully invalid multiple indent"
        );
    });

    var invalidStartMultiIndentStart = String() +
        '<h1>Test</h1>' +
            '<h2 id="start_selection">Test</h2>' +
            '<h2>Test</h2>' +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
            '<h2>Test</h2>' +
                '<h3>Test</h3>' +
                    '<h4 id="end_selection">Test</h4>' +
                '<h3>Test</h3>';
    var invalidStartMultiIndentCorrect = String() +
        '<h1>Test</h1>' +
            '<h2 id="start_selection">Test</h2>' +
                '<h3>Test</h3>' +
            '<h2>Test</h2>' +
                '<h3>Test</h3>' +
                '<h3>Test</h3>' +
                    '<h4>Test</h4>' +
                        '<h5 id="end_selection">Test</h5>' +
                '<h3>Test</h3>';
    var invalidUntilEndMultiIndentStart = String() +
        '<h1>Test</h1>' +
            '<h2 id="start_selection">Test</h2>' +
                '<h3>Test</h3>' +
                    '<h4>Test</h4>' +
                    '<h4>Test</h4>' +
                    '<h4 id="end_selection">Test</h4>' +
                '<h3>Test</h3>';
    var invalidUntilEndMultiIndentCorrect = String() +
        '<h1>Test</h1>' +
            '<h2 id="start_selection">Test</h2>' +
                '<h3>Test</h3>' +
                    '<h4>Test</h4>' +
                        '<h5>Test</h5>' +
                        '<h5 id="end_selection">Test</h5>' +
                '<h3>Test</h3>';

    test("Partially invalid multiple indent", function () {
        expect(2);
        var wymeditor = jQuery.wymeditors(0);

        testMultiIndentOutdent(
            wymeditor, 'indent',
            invalidStartMultiIndentStart, invalidStartMultiIndentCorrect,
            undefined, undefined,
            "Invalid start multiple indent"
        );
        testMultiIndentOutdent(
            wymeditor, 'indent',
            invalidUntilEndMultiIndentStart,
            invalidUntilEndMultiIndentCorrect,
            undefined, undefined,
            "Invalid until end multiple indent"
        );
    });

    var multiIndentLowestLevelStart = String() +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
            '<h2>Test</h2>' +
                '<h3>Test</h3>' +
                '<h3>Test</h3>' +
                    '<h4>Test</h4>' +
                    '<h4 id="start_selection">Test</h4>' +
                        '<h5>Test</h5>' +
                        '<h5>Test</h5>' +
                            '<h6>Test</h6>' +
                            '<h6>Test</h6>' +
                    '<h4>Test</h4>' +
                    '<h4>Test</h4>' +
                        '<h5>Test</h5>' +
                        '<h5>Test</h5>' +
            '<h2>Test</h2>' +
            '<h2 id="end_selection">Test</h2>' +
                '<h3>Test</h3>' +
                '<h3>Test</h3>';
    var multiIndentLowestLevelCorrect = String() +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
            '<h2>Test</h2>' +
                '<h3>Test</h3>' +
                '<h3>Test</h3>' +
                    '<h4>Test</h4>' +
                        '<h5 id="start_selection">Test</h5>' +
                            '<h6>Test</h6>' +
                            '<h6>Test</h6>' +
                            '<h6>Test</h6>' +
                            '<h6>Test</h6>' +
                        '<h5>Test</h5>' +
                        '<h5>Test</h5>' +
                            '<h6>Test</h6>' +
                            '<h6>Test</h6>' +
                '<h3>Test</h3>' +
                '<h3 id="end_selection">Test</h3>' +
                '<h3>Test</h3>' +
                '<h3>Test</h3>';

    test("Multiple indent with lowest level heading", function () {
        expect(1);
        var wymeditor = jQuery.wymeditors(0);

        testMultiIndentOutdent(
            wymeditor, 'indent',
            multiIndentLowestLevelStart, multiIndentLowestLevelCorrect,
            undefined, undefined,
            "Multiple indent with lowest level heading"
        );
    });

    var multiIndentLargeTestStart = String() +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
            '<p>Content</p>' +
            '<h2>Test</h2>' +
                '<h3>Test</h3>' +
                '<p>Content</p>' +
                '<h3>Test</h3>' +
                    '<h4>T<strong id="start_selection">es</strong>t</h4>' +
                    '<p>Content</p>' +
                    '<h4>Te<em>st</em></h4>' +
                    '<p>Content</p>' +
                        '<h5>Test</h5>' +
                        '<p>Content</p>' +
                        '<ul>' +
                            '<li>Test</li>' +
                            '<li>Test' +
                                '<ul>' +
                                    '<li>Test</li>' +
                                    '<li>Test</li>' +
                                '</ul>' +
                            '</li>' +
                            '<li>Test</li>' +
                        '</ul>' +
                        '<h5><span>Test</span></h5>' +
                        '<pre>Preformatted Content</pre>' +
                            '<h6>Test</h6>' +
                            '<p>Content</p>' +
                            '<h6>Test</h6>' +
                    '<h4>Test</h4>' +
                    '<p>Content</p>' +
                    '<h4><span>Test</span></h4>' +
                    '<p><strong>Content</strong></p>' +
                        '<h5>Test</h5>' +
                        '<h5>Test</h5>' +
            '<h2>Test</h2>' +
            '<ol>' +
                '<li>Test</li>' +
                '<li>Test' +
                    '<ol>' +
                        '<li>Test</li>' +
                        '<li>Test</li>' +
                    '</ol>' +
                '</li>' +
                '<li>Test</li>' +
            '</ol>' +
            '<p>Content</p>' +
            '<h2>Te<sub id="end_selection">st</sub></h2>' +
                '<h3>Test</h3>' +
                '<p>Content</p>' +
                '<h3>Test</h3>';
    var multiIndentLargeTestCorrect = String() +
            '<h1>Test</h1>' +
            '<h2>Test</h2>' +
            '<p>Content</p>' +
            '<h2>Test</h2>' +
                '<h3>Test</h3>' +
                '<p>Content</p>' +
                '<h3>Test</h3>' +
                    '<h4>T<strong id="start_selection">es</strong>t</h4>' +
                    '<p>Content</p>' +
                        '<h5>Te<em>st</em></h5>' +
                        '<p>Content</p>' +
                            '<h6>Test</h6>' +
                            '<p>Content</p>' +
                            '<ul>' +
                                '<li>Test</li>' +
                                '<li>Test' +
                                    '<ul>' +
                                        '<li>Test</li>' +
                                        '<li>Test</li>' +
                                    '</ul>' +
                                '</li>' +
                                '<li>Test</li>' +
                            '</ul>' +
                            '<h6><span>Test</span></h6>' +
                            '<pre>Preformatted Content</pre>' +
                            '<h6>Test</h6>' +
                            '<p>Content</p>' +
                            '<h6>Test</h6>' +
                        '<h5>Test</h5>' +
                        '<p>Content</p>' +
                        '<h5><span>Test</span></h5>' +
                        '<p><strong>Content</strong></p>' +
                            '<h6>Test</h6>' +
                            '<h6>Test</h6>' +
                '<h3>Test</h3>' +
                '<ol>' +
                    '<li>Test</li>' +
                    '<li>Test' +
                        '<ol>' +
                            '<li>Test</li>' +
                            '<li>Test</li>' +
                        '</ol>' +
                    '</li>' +
                    '<li>Test</li>' +
                '</ol>' +
                '<p>Content</p>' +
                '<h3>Te<sub id="end_selection">st</sub></h3>' +
                '<h3>Test</h3>' +
                '<p>Content</p>' +
                '<h3>Test</h3>';

    // This tests combines the test cases from all the other multiple indent
    // tests to ensure that they still work when all happening at the same
    // time.
    test("Multiple indent large testing example", function () {
        expect(1);
        var wymeditor = jQuery.wymeditors(0);

        testMultiIndentOutdent(
            wymeditor, 'indent',
            multiIndentLargeTestStart, multiIndentLargeTestCorrect,
            1, 1,
            "Multiple indent large testing example"
        );

    });

    module("structured_headings-multiple_outdent", {setup: setupWym});

    var basicMultiOutdentStart = String() +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
            '<h2 id="start_selection">Test</h2>' +
                '<h3>Test</h3>' +
                '<h3 id="end_selection">Test</h3>';
    var basicMultiOutdentCorrect = String() +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
        '<h1 id="start_selection">Test</h1>' +
            '<h2>Test</h2>' +
            '<h2 id="end_selection">Test</h2>';

    test("Basic multiple outdent", function () {
        expect(1);
        var wymeditor = jQuery.wymeditors(0);

        testMultiIndentOutdent(
            wymeditor, 'outdent',
            basicMultiOutdentStart, basicMultiOutdentCorrect,
            undefined, undefined,
            "Basic multiple outdent"
        );
    });

    test("Partial text selection multiple outdent", function () {
        expect(1);
        var wymeditor = jQuery.wymeditors(0);

        testMultiIndentOutdent(
            wymeditor, 'outdent',
            basicMultiOutdentStart, basicMultiOutdentCorrect,
            2, 3,
            "Partial text selection multiple outdent"
        );
    });

    var multiOutdentWithContentStart = String() +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
            '<p>Content</p>' +
            '<h2 id="start_selection"><a href="http://google.com">Test</a></h2>' +
            '<p>Content</p>' +
            '<pre>Preformatted Content</pre>' +
                '<h3>T<em>es</em>t</h3>' +
                '<p>Content</p>' +
                '<h3 id="end_selection">Te<span>st</span></h3>' +
                '<p>Content</p>';
    var multiOutdentWithContentCorrect = String() +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
            '<p>Content</p>' +
        '<h1 id="start_selection"><a href="http://google.com">Test</a></h1>' +
        '<p>Content</p>' +
        '<pre>Preformatted Content</pre>' +
            '<h2>T<em>es</em>t</h2>' +
            '<p>Content</p>' +
            '<h2 id="end_selection">Te<span>st</span></h2>' +
            '<p>Content</p>';

    test("Mulitple outdent with content within and around the headings", function () {
        expect(1);
        var wymeditor = jQuery.wymeditors(0);

        testMultiIndentOutdent(
            wymeditor, 'outdent',
            multiOutdentWithContentStart, multiOutdentWithContentCorrect,
            undefined, undefined,
            "Mulitple outdent with content within and around the headings"
        );
    });

    var multiOutdentWithListStart = String() +
        '<h1>Test</h1>' +
            '<h2 id="start_selection">Test</h2>' +
            '<ol>' +
                '<li>Test</li>' +
                '<li>Test</li>' +
                '<li>Test</li>' +
            '</ol>' +
            '<h2>Test</h2>' +
            '<ul>' +
                '<li>Test</li>' +
                '<li>Test</li>' +
                '<li>Test</li>' +
            '</ul>' +
                '<h3>Test</h3>' +
                '<h3 id="end_selection">Test</h3>';
    var multiOutdentWithListCorrect = String() +
        '<h1>Test</h1>' +
        '<h1 id="start_selection">Test</h1>' +
            '<ol>' +
                '<li>Test</li>' +
                '<li>Test</li>' +
                '<li>Test</li>' +
            '</ol>' +
        '<h1>Test</h1>' +
        '<ul>' +
            '<li>Test</li>' +
            '<li>Test</li>' +
            '<li>Test</li>' +
        '</ul>' +
            '<h2>Test</h2>' +
            '<h2 id="end_selection">Test</h2>';

    test("Multiple outdent with list content between headings", function () {
        expect(1);
        var wymeditor = jQuery.wymeditors(0);

        testMultiIndentOutdent(
            wymeditor, 'outdent',
            multiOutdentWithListStart, multiOutdentWithListCorrect,
            undefined, undefined,
            "Multiple outdent with list content between headings"
        );

    });

    var fullyInvalidMultiOutdentStart = String() +
        '<h1>Test</h1>' +
            '<h2 id="start_selection">Test</h2>' +
                '<h3 id="start_selection">Test</h3>' +
                    '<h4 id="end_selection">Test</h4>' +
                        '<h5>Test</h5>' +
                '<h3>Test</h3>';

    test("Fully invalid multiple outdent", function () {
        expect(1);
        var wymeditor = jQuery.wymeditors(0);

        testMultiIndentOutdent(
            wymeditor, 'outdent',
            fullyInvalidMultiOutdentStart, fullyInvalidMultiOutdentStart,
            undefined, undefined,
            "Fully invalid multiple outdent"
        );
    });

    var invalidEndMultiOutdentStart = String() +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
            '<h2 id="start_selection">Test</h2>' +
            '<h2>Test</h2>' +
                '<h3>Test</h3>' +
                '<h3>Test</h3>' +
                '<h3>Test</h3>' +
                    '<h4 id="end_selection">Test</h4>' +
                        '<h5>Test</h5>' +
                '<h3>Test</h3>';
    var invalidEndMultiOutdentCorrect = String() +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
        '<h1 id="start_selection">Test</h1>' +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
            '<h2>Test</h2>' +
                '<h3>Test</h3>' +
                    '<h4 id="end_selection">Test</h4>' +
                        '<h5>Test</h5>' +
                '<h3>Test</h3>';
    var invalidUntilStartMultiOutdentStart = String() +
        '<h1>Test</h1>' +
            '<h2 id="start_selection">Test</h2>' +
            '<h2>Test</h2>' +
                '<h3>Test</h3>' +
                    '<h4 id="end_selection">Test</h4>' +
                        '<h5>Test</h5>' +
                '<h3>Test</h3>';
    var invalidUntilStartMultiOutdentCorrect = String() +
        '<h1>Test</h1>' +
        '<h1 id="start_selection">Test</h1>' +
            '<h2>Test</h2>' +
                '<h3>Test</h3>' +
                    '<h4 id="end_selection">Test</h4>' +
                        '<h5>Test</h5>' +
                '<h3>Test</h3>';

    test("Partially invalid multiple outdent", function () {
        expect(2);
        var wymeditor = jQuery.wymeditors(0);

        testMultiIndentOutdent(
            wymeditor, 'outdent',
            invalidEndMultiOutdentStart, invalidEndMultiOutdentCorrect,
            undefined, undefined,
            "Invalid end multiple outdent"
        );
        testMultiIndentOutdent(
            wymeditor, 'outdent',
            invalidUntilStartMultiOutdentStart,
            invalidUntilStartMultiOutdentCorrect,
            undefined, undefined,
            "Invalid until start multiple outdent"
        );
    });

    var multiOutdentHighestLevelStart = String() +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
            '<h2 id="start_selection">Test</h2>' +
                '<h3>Test</h3>' +
                '<h3>Test</h3>' +
        '<h1>Test</h1>' +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
            '<h2>Test</h2>' +
                '<h3>Test</h3>' +
                '<h3>Test</h3>' +
                    '<h4>Test</h4>' +
                    '<h4>Test</h4>' +
                        '<h5>Test</h5>' +
                        '<h5>Test</h5>' +
            '<h2 id="end_selection">Test</h2>' +
            '<h2>Test</h2>' +
                '<h3>Test</h3>' +
                '<h3>Test</h3>';
    var multiOutdentHighestLevelCorrect = String() +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
        '<h1 id="start_selection">Test</h1>' +
            '<h2>Test</h2>' +
            '<h2>Test</h2>' +
        '<h1>Test</h1>' +
        '<h1>Test</h1>' +
        '<h1>Test</h1>' +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
            '<h2>Test</h2>' +
                '<h3>Test</h3>' +
                '<h3>Test</h3>' +
                    '<h4>Test</h4>' +
                    '<h4>Test</h4>' +
        '<h1 id="end_selection">Test</h1>' +
            '<h2>Test</h2>' +
                '<h3>Test</h3>' +
                '<h3>Test</h3>';

    test("Multiple outdent with highest level heading", function () {
        expect(1);
        var wymeditor = jQuery.wymeditors(0);

        testMultiIndentOutdent(
            wymeditor, 'outdent',
            multiOutdentHighestLevelStart, multiOutdentHighestLevelCorrect,
            undefined, undefined,
            "Multiple outdent with highest level heading"
        );
    });

    var multiOutdentLargeTestStart = String() +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
            '<p>Content</p>' +
            '<h2><em>Te<span id="start_selection">st</span></em></h2>' +
            '<p>Content</p>' +
                '<h3>Test</h3>' +
                '<p>Content</p>' +
                '<h3>Test</h3>' +
        '<h1>Test</h1>' +
        '<p>Content</p>' +
        '<h1>T<strong>es</strong>t</h1>' +
        '<p>Content</p>' +
        '<ul>' +
            '<li>Test</li>' +
            '<li>Test' +
                '<ul>' +
                    '<li>Test</li>' +
                    '<li>Test</li>' +
                '</ul>' +
            '</li>' +
            '<li>Test</li>' +
        '</ul>' +
            '<h2>Test</h2>' +
            '<p><em>Content</em></p>' +
            '<h2>Test</h2>' +
            '<pre>Preformatted content</pre>' +
                '<h3>Test</h3>' +
                '<p>Content</p>' +
                '<h3>Te<sub>st</sub></h3>' +
                    '<h4>Test</h4>' +
                    '<ol>' +
                        '<li>Test</li>' +
                        '<li>Test' +
                            '<ol>' +
                                '<li>Test</li>' +
                                '<li>Test</li>' +
                            '</ol>' +
                        '</li>' +
                        '<li>Test</li>' +
                    '</ol>' +
                    '<h4>Test</h4>' +
                    '<p>Content</p>' +
                        '<h5>Test</h5>' +
                        '<h5>Test</h5>' +
                        '<p>Content</p>' +
            '<h2>Test</h2>' +
            '<h2>Te<sup id="end_selection">st</sup></h2>' +
            '<p>Content</p>' +
                '<h3>Test</h3>' +
                '<h3>Test</h3>';
    var multiOutdentLargeTestCorrect = String() +
        '<h1>Test</h1>' +
            '<h2>Test</h2>' +
            '<p>Content</p>' +
        '<h1><em>Te<span id="start_selection">st</span></em></h1>' +
        '<p>Content</p>' +
            '<h2>Test</h2>' +
            '<p>Content</p>' +
            '<h2>Test</h2>' +
        '<h1>Test</h1>' +
        '<p>Content</p>' +
        '<h1>T<strong>es</strong>t</h1>' +
        '<p>Content</p>' +
        '<ul>' +
            '<li>Test</li>' +
            '<li>Test' +
                '<ul>' +
                    '<li>Test</li>' +
                    '<li>Test</li>' +
                '</ul>' +
            '</li>' +
            '<li>Test</li>' +
        '</ul>' +
        '<h1>Test</h1>' +
        '<p><em>Content</em></p>' +
        '<h1>Test</h1>' +
        '<pre>Preformatted content</pre>' +
            '<h2>Test</h2>' +
            '<p>Content</p>' +
            '<h2>Te<sub>st</sub></h2>' +
                '<h3>Test</h3>' +
                '<ol>' +
                    '<li>Test</li>' +
                    '<li>Test' +
                        '<ol>' +
                            '<li>Test</li>' +
                            '<li>Test</li>' +
                        '</ol>' +
                    '</li>' +
                    '<li>Test</li>' +
                '</ol>' +
                '<h3>Test</h3>' +
                '<p>Content</p>' +
                    '<h4>Test</h4>' +
                    '<h4>Test</h4>' +
                    '<p>Content</p>' +
        '<h1>Test</h1>' +
            '<h2>Te<sup id="end_selection">st</sup></h2>' +
            '<p>Content</p>' +
                '<h3>Test</h3>' +
                '<h3>Test</h3>';

    // This tests combines the test cases from all the other multiple outdent
    // tests to ensure that they still work when all happening at the same
    // time.
    test("Multiple outdent large testing example", function () {
        expect(1);
        var wymeditor = jQuery.wymeditors(0);

        testMultiIndentOutdent(
            wymeditor, 'outdent',
            multiOutdentLargeTestStart, multiOutdentLargeTestCorrect,
            1, 1,
            "Multiple outdent large testing example"
        );
    });
}

// Tests for the IE7 polyfill
if (WYMeditor.STRUCTURED_HEADINGS_POLYFILL_REQUIRED) {

    var NUMBERING_SPAN_CLASS_ATTR = 'class="' + NUMBERING_SPAN_CLASS + ' ' +
                                     WYMeditor.EDITOR_ONLY_CLASS + '"';

    var startHeadings = String() +
        '<h1>H1</h1>' +
            '<h2>H1_1</h2>' +
                '<h3>H1_1_1</h3>' +
                '<h3>H1_1_2</h3>' +
            '<h2>H1_2</h2>' +
                '<h3>H1_2_1</h3>' +
                '<h3>H1_2_2</h3>' +
        '<h1>H2</h1>' +
            '<h2>H2_1</h2>' +
                '<h3>H2_1_1</h3>' +
                '<h3>H2_1_2</h3>' +
            '<h2>H2_2</h2>' +
                '<h3>H2_2_1</h3>' +
                '<h3>H2_2_2</h3>';

    var expectedHeadings = String() +
        '<h1 class="' + START_NODE_CLASS + ' ' + LEVEL_CLASSES[0] + '">' +
            '<span ' + NUMBERING_SPAN_CLASS_ATTR + '>1</span>' +
            'H1' +
        '</h1>' +
            '<h2 class="' + LEVEL_CLASSES[1] + '">' +
                '<span ' + NUMBERING_SPAN_CLASS_ATTR + '>1.1</span>' +
                'H1_1' +
            '</h2>' +
                '<h3 class="' + LEVEL_CLASSES[2] + '">' +
                    '<span ' + NUMBERING_SPAN_CLASS_ATTR + '>1.1.1</span>' +
                    'H1_1_1' +
                '</h3>' +
                '<h3 class="' + LEVEL_CLASSES[2] + '">' +
                    '<span ' + NUMBERING_SPAN_CLASS_ATTR + '>1.1.2</span>' +
                    'H1_1_2' +
                '</h3>' +
            '<h2 class="' + LEVEL_CLASSES[1] + '">' +
                '<span ' + NUMBERING_SPAN_CLASS_ATTR + '>1.2</span>' +
                'H1_2' +
            '</h2>' +
                '<h3 class="' + LEVEL_CLASSES[2] + '">' +
                    '<span ' + NUMBERING_SPAN_CLASS_ATTR + '>1.2.1</span>' +
                    'H1_2_1' +
                '</h3>' +
                '<h3 class="' + LEVEL_CLASSES[2] + '">' +
                    '<span ' + NUMBERING_SPAN_CLASS_ATTR + '>1.2.2</span>' +
                    'H1_2_2' +
                '</h3>' +
        '<h1 class="' + LEVEL_CLASSES[0] + '">' +
            '<span ' + NUMBERING_SPAN_CLASS_ATTR + '>2</span>' +
            'H2' +
        '</h1>' +
            '<h2 class="' + LEVEL_CLASSES[1] + '">' +
                '<span ' + NUMBERING_SPAN_CLASS_ATTR + '>2.1</span>' +
                'H2_1' +
            '</h2>' +
                '<h3 class="' + LEVEL_CLASSES[2] + '">' +
                    '<span ' + NUMBERING_SPAN_CLASS_ATTR + '>2.1.1</span>' +
                    'H2_1_1' +
                '</h3>' +
                '<h3 class="' + LEVEL_CLASSES[2] + '">' +
                    '<span ' + NUMBERING_SPAN_CLASS_ATTR + '>2.1.2</span>' +
                    'H2_1_2' +
                '</h3>' +
            '<h2 class="' + LEVEL_CLASSES[1] + '">' +
                '<span ' + NUMBERING_SPAN_CLASS_ATTR + '>2.2</span>' +
                'H2_2' +
            '</h2>' +
                '<h3 class="' + LEVEL_CLASSES[2] + '">' +
                    '<span ' + NUMBERING_SPAN_CLASS_ATTR + '>2.2.1</span>' +
                    'H2_2_1' +
                '</h3>' +
                '<h3 class="' + LEVEL_CLASSES[2] + '">' +
                    '<span ' + NUMBERING_SPAN_CLASS_ATTR + '>2.2.2</span>' +
                    'H2_2_2' +
                '</h3>';

    var editedNumberingTopLevel = expectedHeadings.replace(/>2</g, '><');

    var editedNumberingSubLevel = expectedHeadings.replace(/>1.2</g, '>1.<');

    var editedNumberingSubSubLevel = expectedHeadings.replace(
        />2.2.1</g,
        '>2.2.<'
    );

    var expectedParsedHeadings = expectedHeadings.replace(
        /<span.*?<\/span>/g,
        ''
    );

    module("structured_headings-ie7_polyfill", {setup: setupWym});

    test("Heading numbering properly added on keyup", function () {
        expect(1);
        var wymeditor = jQuery.wymeditors(0);

        wymeditor._html(startHeadings);
        deepEqual(getHtmlAfterKeyup(wymeditor), expectedHeadings,
                  "Heading numbering properly added on keyup");
    });

    test("Heading numbering fixed on keyup if edited", function () {
        expect(4);
        var wymeditor = jQuery.wymeditors(0);

        // Add correct headings to editor first
        wymeditor._html(expectedHeadings);
        deepEqual(getHtmlAfterKeyup(wymeditor), expectedHeadings,
                  "Heading numbering unchanged on keyup if already correct");

        // Break a correct top level heading by replacing it with a heading
        // with edited numbering
        wymeditor._html(editedNumberingTopLevel);
        deepEqual(getHtmlAfterKeyup(wymeditor), expectedHeadings,
                  "Top level heading numbering fixed on keyup");

        // Break a correct sublevel heading by replacing it with a heading with
        // edited numbering
        wymeditor._html(editedNumberingSubLevel);
        deepEqual(getHtmlAfterKeyup(wymeditor), expectedHeadings,
                  "Sublevel heading numbering fixed on keyup");

        // Break a correct subsublevel heading by replacing it with a heading
        // with edited numbering
        wymeditor._html(editedNumberingSubSubLevel);
        deepEqual(getHtmlAfterKeyup(wymeditor), expectedHeadings,
                  "Subsublevel heading numbering fixed on keyup");
    });

    test("Heading numbering stripped on parsing", function () {
        expect(1);
        var wymeditor = jQuery.wymeditors(0);

        wymeditor._html(expectedHeadings);
        wymEqual(wymeditor, expectedParsedHeadings, {
                assertionString: "Heading numbering stripped by parser"
            });
    });
}
