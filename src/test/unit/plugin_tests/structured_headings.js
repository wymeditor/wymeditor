/*
    Tests for the structured_headings plugin.
*/
var START_NODE_CLASS = WYMeditor.STRUCTURED_HEADINGS_START_NODE_CLASS;
var NUMBERING_SPAN_CLASS = WYMeditor.STRUCTURED_HEADINGS_NUMBERING_SPAN_CLASS;
var LEVEL_CLASSES = WYMeditor.STRUCTURED_HEADINGS_LEVEL_CLASSES;

/*
    getHtmlAfterKeyup
    =================

    Triggers an enter keyup event on the wymeditor body and returns the
    normalized html of the body after the keydown event was applied.
*/
function getHtmlAfterKeyup(wymeditor) {
        var $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
            keydown_event,
            bodyHtml;

        // Set up shift key keydown event
        keydown_event = jQuery.Event('keyup');
        keydown_event.which = WYMeditor.KEY.ENTER;

        $body.trigger(keydown_event);

        // Normalize HTML and remove the body tag to get just inner body html
        bodyHtml = normalizeHtml($body[0]).replace(/<\/?body[\d\w\s"=]*>/g, '');
        return bodyHtml;
}

module("structured_headings-initialize", {setup: setupWym});

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

    if (jQuery.browser.msie && jQuery.browser.version < "8.0") {
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

    if (jQuery.browser.msie && jQuery.browser.version < "8.0") {
        stylesheetURL += 'structured_headings_ie7_user.css';
    } else {
        stylesheetURL += 'structured_headings.css';
    }

    cssRequest = new XMLHttpRequest();
    cssRequest.open('GET', stylesheetURL, false);
    cssRequest.send('');

    equals(WYMeditor.structuredHeadingsCSS, cssRequest.responseText,
           "CSS correctly stored for user access");
});

// Tests for the IE7 polyfill
if (jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 8.0) {

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
            '<span class="' + NUMBERING_SPAN_CLASS + '">1</span>' +
            'H1' +
        '</h1>' +
            '<h2 class="' + LEVEL_CLASSES[1] + '">' +
                '<span class="' + NUMBERING_SPAN_CLASS + '">1.1</span>' +
                'H1_1' +
            '</h2>' +
                '<h3 class="' + LEVEL_CLASSES[2] + '">' +
                    '<span class="' + NUMBERING_SPAN_CLASS + '">1.1.1</span>' +
                    'H1_1_1' +
                '</h3>' +
                '<h3 class="' + LEVEL_CLASSES[2] + '">' +
                    '<span class="' + NUMBERING_SPAN_CLASS + '">1.1.2</span>' +
                    'H1_1_2' +
                '</h3>' +
            '<h2 class="' + LEVEL_CLASSES[1] + '">' +
                '<span class="' + NUMBERING_SPAN_CLASS + '">1.2</span>' +
                'H1_2' +
            '</h2>' +
                '<h3 class="' + LEVEL_CLASSES[2] + '">' +
                    '<span class="' + NUMBERING_SPAN_CLASS + '">1.2.1</span>' +
                    'H1_2_1' +
                '</h3>' +
                '<h3 class="' + LEVEL_CLASSES[2] + '">' +
                    '<span class="' + NUMBERING_SPAN_CLASS + '">1.2.2</span>' +
                    'H1_2_2' +
                '</h3>' +
        '<h1 class="' + LEVEL_CLASSES[0] + '">' +
            '<span class="' + NUMBERING_SPAN_CLASS + '">2</span>' +
            'H2' +
        '</h1>' +
            '<h2 class="' + LEVEL_CLASSES[1] + '">' +
                '<span class="' + NUMBERING_SPAN_CLASS + '">2.1</span>' +
                'H2_1' +
            '</h2>' +
                '<h3 class="' + LEVEL_CLASSES[2] + '">' +
                    '<span class="' + NUMBERING_SPAN_CLASS + '">2.1.1</span>' +
                    'H2_1_1' +
                '</h3>' +
                '<h3 class="' + LEVEL_CLASSES[2] + '">' +
                    '<span class="' + NUMBERING_SPAN_CLASS + '">2.1.2</span>' +
                    'H2_1_2' +
                '</h3>' +
            '<h2 class="' + LEVEL_CLASSES[1] + '">' +
                '<span class="' + NUMBERING_SPAN_CLASS + '">2.2</span>' +
                'H2_2' +
            '</h2>' +
                '<h3 class="' + LEVEL_CLASSES[2] + '">' +
                    '<span class="' + NUMBERING_SPAN_CLASS + '">2.2.1</span>' +
                    'H2_2_1' +
                '</h3>' +
                '<h3 class="' + LEVEL_CLASSES[2] + '">' +
                    '<span class="' + NUMBERING_SPAN_CLASS + '">2.2.2</span>' +
                    'H2_2_2' +
                '</h3>';

    var editedNumberingTopLevel = expectedHeadings.replace(/>2</g, '><');

    var editedNumberingSubLevel = expectedHeadings.replace(/>1.2</g, '>1.<');

    var editedNumberingSubSubLevel = expectedHeadings.replace(/>2.2.1</g, '>2.2.<');

    module("structured_headings-ie7_polyfill", {setup: setupWym});

    test("Heading numbering properly added on keydown", function () {
        expect(1);
        var wymeditor = jQuery.wymeditors(0);

        wymeditor.html(startHeadings);
        equals(getHtmlAfterKeyup(wymeditor), expectedHeadings,
               "Heading numbering properly added on keydown");
    });

    test("Heading numbering fixed on keydown if edited", function () {
        expect(4);
        var wymeditor = jQuery.wymeditors(0);

        // Add correct headings to editor first
        wymeditor.html(expectedHeadings);
        equals(getHtmlAfterKeyup(wymeditor), expectedHeadings,
               "Heading numbering unchanged on keydown if already correct");

        // Break a correct top level heading by replacing it with a heading
        // with edited numbering
        wymeditor.html(editedNumberingTopLevel);
        equals(getHtmlAfterKeyup(wymeditor), expectedHeadings,
               "Top level heading numbering fixed on keydown");

        // Break a correct sublevel heading by replacing it with a heading with
        // edited numbering
        wymeditor.html(editedNumberingSubLevel);
        equals(getHtmlAfterKeyup(wymeditor), expectedHeadings,
               "Sublevel heading numbering fixed on keydown");

        // Break a correct subsublevel heading by replacing it with a heading
        // with edited numbering
        wymeditor.html(editedNumberingSubSubLevel);
        equals(getHtmlAfterKeyup(wymeditor), expectedHeadings,
               "Subsublevel heading numbering fixed on keydown");
    });
}
