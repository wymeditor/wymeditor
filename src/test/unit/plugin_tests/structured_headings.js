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
            keyup_event,
            bodyHtml;

        // Set up shift key keyup event
        keyup_event = jQuery.Event('keyup');
        keyup_event.which = WYMeditor.KEY.ENTER;

        $body.trigger(keyup_event);

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
        confirmContent = false,

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

module("structured_headings-heading_insertion", {setup: setupWym});

function testHeadingInsertion(wymeditor) {
    expect(6);
    var $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        $headingContainerLink = jQuery(wymeditor._box).find(
            wymeditor.structuredHeadingsManager._options.headingContainerPanelSelector),
        paragraph,
        i,
        correctHtml = [
            correctHtmlH1Insertion,
            correctHtmlH2Insertion,
            correctHtmlH3Insertion,
            correctHtmlH4Insertion,
            correctHtmlH5Insertion,
            correctHtmlH6Insertion
        ];

    for (i = 1; i < 7; ++i) {
        wymeditor._html(htmlForHeadingInsertion);
        paragraph = $body.find('#to_be_h' + i)[0];
        makeTextSelection(wymeditor, paragraph, paragraph);
        $headingContainerLink.click();
        htmlEquals(wymeditor, correctHtml[i - 1],
                   "Insertion of an H" + i + " heading based on context.");
    }
}

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

var correctHtmlH1Insertion = htmlForHeadingInsertion.replace(
    '<p id="to_be_h1">Test</p>', '<h1 id="to_be_h1">Test</h1>');

var correctHtmlH2Insertion = htmlForHeadingInsertion.replace(
    '<p id="to_be_h2">Test</p>', '<h2 id="to_be_h2">Test</h2>');

var correctHtmlH3Insertion = htmlForHeadingInsertion.replace(
    '<p id="to_be_h3">Test</p>', '<h3 id="to_be_h3">Test</h3>');

var correctHtmlH4Insertion = htmlForHeadingInsertion.replace(
    '<p id="to_be_h4">Test</p>', '<h4 id="to_be_h4">Test</h4>');

var correctHtmlH5Insertion = htmlForHeadingInsertion.replace(
    '<p id="to_be_h5">Test</p>', '<h5 id="to_be_h5">Test</h5>');

var correctHtmlH6Insertion = htmlForHeadingInsertion.replace(
    '<p id="to_be_h6">Test</p>', '<h6 id="to_be_h6">Test</h6>');

test("Insert headings with defualt settings", function () {
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
});

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

    var editedNumberingSubSubLevel = expectedHeadings.
                                        replace(/>2.2.1</g, '>2.2.<');

    var expectedParsedHeadings = expectedHeadings.
                                    replace(/<span.*?<\/span>/g, '');

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
        htmlEquals(wymeditor, expectedParsedHeadings,
                   "Heading numbering stripped by parser");
    });
}
