WYMeditor.BROWSER_SUPPORTED_STRUCTURED_HEADINGS =
    !(jQuery.browser.msie && jQuery.browser.version < "7.0");

/**
    structuredHeadings
    ==================

    Initializes the structured_headings plugin for the wymeditor instance. This
    method should be called by the passed wymeditor instance in the `postInit`
    function of the wymeditor instantiation.
*/
WYMeditor.editor.prototype.structuredHeadings = function () {
    var wym = this,
        wymBasePath = WYMeditor.computeBasePath(WYMeditor.computeWymPath()),
        iframeHead = jQuery(wym._doc).find('head')[0],
        stylesheetHref,
        cssLink,
        cssRequest;

    cssLink = wym._doc.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.type = 'text/css';

    if (jQuery.browser.msie && jQuery.browser.version < "8.0") {
        stylesheetHref = '/plugins/structured_headings/structured_headings_ie7.css';
        cssLink.href = '../..' + stylesheetHref; // Adjust path for iframe
        iframeHead.appendChild(cssLink);

        wym.setupHeadingNumbering();

    } else {
        stylesheetHref = '/plugins/structured_headings/structured_headings.css';
        cssLink.href = '../..' + stylesheetHref; // Adjust path for iframe
        iframeHead.appendChild(cssLink);
    }

    // Get stylesheet CSS and store it in WYMeditor so that it can be accessed
    // to put on other pages.
    cssRequest = new XMLHttpRequest();
    cssRequest.open('GET', wymBasePath + stylesheetHref, false);
    cssRequest.send('');
    WYMeditor.structuredHeadingsCSS = cssRequest.responseText;
};

/**
    WYMeditor.getStructuredHeadingsCSS
    ==================================

    Function to output the plugin CSS to the console log so that it can be
    copied over to other pages.
*/
WYMeditor.printStructuredHeadingsCSS = function () {
    WYMeditor.console.log(WYMeditor.structuredHeadingsCSS);
};

/**
    setupHeadingNumbering
    =====================

    Javascript polyfill to add heading numbering to IE versions 7 and lower.
*/
WYMeditor.editor.prototype.setupHeadingNumbering = function () {
    var wym = this,
        $body = jQuery(wym._doc.body),
        headingList = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        headingSel = headingList.join(', '),
        numbering_span_class = 'structured-heading-numbering',
        prevHeadingTotal = 0,
        prevSpanCharTotal = 0;

    $body.keydown(function () {
        var headingTotal = $body.find(headingSel).length,
            spanCharTotal = 0;

        $body.find('.' + numbering_span_class).each(function () {
            spanCharTotal += this.innerHTML.length;
        });

        if (headingTotal !== prevHeadingTotal ||
            spanCharTotal !== prevSpanCharTotal) {

            prevSpanCharTotal = numberHeadingsIE7(wym._doc, true);
        }

        prevHeadingTotal = headingTotal;
    });
}
