WYMeditor.BROWSER_SUPPORTED_STRUCTURED_HEADINGS = !(jQuery.browser.msie &&
                                                jQuery.browser.version < "8.0");

/**
    structuredHeadings
    ==================

    Initializes the structured_headings plugin for the wymeditor instance. This
    method should be called by the passed wymeditor instance in the `postInit`
    function of the wymeditor instantiation.
*/
WYMeditor.editor.prototype.structuredHeadings = function () {
    var wym = this,
        stylesheetHref = '/plugins/structured_headings/structured_headings.css',
        wymBasePath = WYMeditor.computeBasePath(WYMeditor.computeWymPath()),
        iframeHead,
        cssLink,
        cssRequest;

    if (!WYMeditor.BROWSER_SUPPORTED_STRUCTURED_HEADINGS) {
        // TODO: Use Javascript to add the header numbering on versions of IE
        // before 8 because they don't support CSS counters.
        wym.setupHeadingNumbering();

    } else {
        iframeHead = jQuery(wym._doc).find('head')[0];

        cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.type = 'text/css';
        cssLink.href = '../..' + stylesheetHref; // Adjust path for iframe

        iframeHead.appendChild(cssLink);

        // Get stylesheet CSS and store it in WYMeditor so that it can be accessed
        // to put on other pages.
        cssRequest = new XMLHttpRequest();
        cssRequest.open('GET', wymBasePath + stylesheetHref, false);
        cssRequest.send('');
        WYMeditor.structuredHeadingsCSS = cssRequest.responseText;
    }
};

/**
    WYMeditor.getStructuredHeadingsCSS
    ==================================

    Function to output the plugin CSS to the console log so that it can be
    copied over to other pages.
*/
WYMeditor.printStructuredHeadingsCSS = function () {
    if (WYMeditor.BROWSER_SUPPORTED_STRUCTURED_HEADINGS) {
        WYMeditor.console.log(WYMeditor.structuredHeadingsCSS);
    }
};

/**
    setupHeadingNumbering
    =====================

    TODO: Javascript shim to add heading numbering to IE versions 7 and lower.
*/
WYMeditor.WymClassExplorer.prototype.setupHeadingNumbering = function () {
    return false;
}
