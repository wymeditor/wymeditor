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
    if (!(jQuery.browser.msie && jQuery.browser.version < "8.0")) {
        console.log(WYMeditor.structuredHeadingsCSS);
    }
};

/**
    setupHeadingNumbering
    =====================

    TODO: Javascript shim to add heading numbering to IE versions 7 and lower.
*/
WYMeditor.editor.prototype.setupHeadingNumbering = function () {
    var wym = this,
        $body = jQuery(wym._doc.body),
        $head = jQuery(wym._doc).find('head'),
        headerList = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        headerSel = headerList.join(', '),
        prevHeaderTotal = 0;

    $body.keydown(function () {
        var $allHeaders,
            $header,
            headerNum,
            headerLabel,
            headerID,

            span,
            $span,
            headerCSS,
            $headCSS,

            counters,
            i,
            j;

        $allHeaders = $body.find(headerSel);
        if ($allHeaders.length !== prevHeaderTotal) {

            counters = [0, 0, 0, 0, 0, 0];
            $body.find('.structured-heading-numbering').remove();

            for (i = 0; i < $allHeaders.length; ++i) {
                $header = $allHeaders.eq(i);
                headerNum = parseInt($header[0].nodeName.slice(-1), 10) - 1;

                ++counters[headerNum];
                headerID = '';
                for (j = 0; j <= headerNum; ++j) {
                    if (j === headerNum) {
                        headerID += counters[j];
                    } else {
                        headerID += counters[j] + '.';
                    }
                }
                span = wym._doc.createElement('span');
                $span = jQuery(span);
                $header.prepend(span);
                $span.html(headerID);
                $span.attr('class', 'structured-heading-numbering');
                $span.attr('contentEditable', 'false');

                /*headerLabel = headerID.replace(/-/g, '.');
                headerCSS = String() +
                    '#h' + headerID + '{' +
                        'zoom: expression( this.runtimeStyle["zoom"] = "1",' +
                        'this.innerHTML = "' + headerLabel + ' "+this.innerHTML);' +
                    '}';
                $headCSS = $head.find('style#structured-headings-css');
                if ($headCSS.length) {
                    $headCSS[0].styleSheet.cssText += '\n' + headerCSS;
                } else {
                    style = wym._doc.createElement('style');

                    style.setAttribute('id', 'structured-headings-css');
                    style.setAttribute('type', 'text/css');
                    style.styleSheet.cssText = headerCSS;

                    $head[0].appendChild(style);
                }*/

                for (j = headerNum + 1; j < counters.length; ++j) {
                    counters[j] = 0;
                }
            }

            prevHeaderTotal = $allHeaders.length;
        }
    });
}
