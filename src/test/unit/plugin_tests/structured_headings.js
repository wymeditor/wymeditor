/*
    Tests for the structured_headings plugin. Currently doesn't support IE
    versions 7 and below.
*/

if (WYMeditor.BROWSER_SUPPORTED_STRUCTURED_HEADINGS) {

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
            linkHref,
            i;

        for (i = 0; i < $iframeHeadLinks.length; ++i) {
            linkFileName = $iframeHeadLinks[i].href.split('/').pop();
            if (linkFileName === 'structured_headings.css') {
                foundLink = true;
                linkHref = $iframeHeadLinks[i].href;
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
            stylesheetURL = '../../wymeditor/plugins/structured_headings/' +
                            'structured_headings.css';

        cssRequest = new XMLHttpRequest();
        cssRequest.open('GET', stylesheetURL, false);
        cssRequest.send('');

        equals(WYMeditor.structuredHeadingsCSS, cssRequest.responseText,
               "CSS correctly stored for user access");
    });
}
