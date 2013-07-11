// In case the script is included on a page without WYMeditor, define the
// WYMeditor and WYMeditor.editor objects to hold the constants used.
if (typeof (WYMeditor) === 'undefined') {
    WYMeditor = {};
    WYMeditor.HEADING_ELEMENTS = ["h1", "h2", "h3", "h4", "h5", "h6"];
    WYMeditor.KEY = {
        BACKSPACE: 8,
        ENTER: 13,
        DELETE: 46
    };
}
if (typeof (WYMeditor.editor) === 'undefined') {
    WYMeditor.editor = {};
    WYMeditor.editor.prototype = {};
}

WYMeditor.STRUCTURED_HEADINGS_POLYFILL_REQUIRED =
    jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 8.0;

// Constants for class names used in structuring the headings
WYMeditor.STRUCTURED_HEADINGS_START_NODE_CLASS = 'wym-structured-headings-start';
WYMeditor.STRUCTURED_HEADINGS_LEVEL_CLASSES = ['wym-structured-heading-level1',
                                               'wym-structured-heading-level2',
                                               'wym-structured-heading-level3',
                                               'wym-structured-heading-level4',
                                               'wym-structured-heading-level5',
                                               'wym-structured-heading-level6'];
WYMeditor.STRUCTURED_HEADINGS_NUMBERING_SPAN_CLASS = 'wym-structured-heading-numbering';

// Key codes for the keyup events that the heading numberings should be
// recalculated on
WYMeditor.STRUCTURED_HEADINGS_POTENTIAL_HEADING_MODIFICATION_KEYS =
    [WYMeditor.KEY.BACKSPACE, WYMeditor.KEY.DELETE, WYMeditor.KEY.ENTER];


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

    if (WYMeditor.STRUCTURED_HEADINGS_POLYFILL_REQUIRED) {
        stylesheetHref = '/plugins/structured_headings/' +
                         'structured_headings_ie7_editor.css';
        cssLink.href = '../..' + stylesheetHref; // Adjust path for iframe
        iframeHead.appendChild(cssLink);

        // Change href to user stylesheet to store in WYMeditor
        stylesheetHref = stylesheetHref.replace('editor', 'user');

        wym.enableIE7Polyfill();

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
    enableIE7Polyfill
    =================

    Enables Javascript polyfill to add heading numbering to IE versions 7
    and lower.
*/
WYMeditor.editor.prototype.enableIE7Polyfill = function () {
    var wym = this,
        $body = jQuery(wym._doc.body),
        $containersPanelLinks = jQuery(wym._box)
            .find(wym._options.containersSelector + ' li > a'),
        headingSel = WYMeditor.HEADING_ELEMENTS.join(', '),
        prevHeadingTotal = 0,
        prevSpanCharTotal = 0;

    $body.keyup(function (evt) {
        if (jQuery.inArray(evt.which,
            WYMeditor.STRUCTURED_HEADINGS_POTENTIAL_HEADING_MODIFICATION_KEYS) > -1) {

            var headingTotal = $body.find(headingSel).length,
                spanCharTotal = 0;

            $body.find('.' + WYMeditor.STRUCTURED_HEADINGS_NUMBERING_SPAN_CLASS)
                 .each(function () {

                spanCharTotal += this.innerHTML.length;
            });

            if (headingTotal !== prevHeadingTotal ||
                spanCharTotal !== prevSpanCharTotal) {

                prevSpanCharTotal = numberHeadingsIE7(wym._doc, true);
            }

            prevHeadingTotal = headingTotal;
        }
    });

    $containersPanelLinks.click(function (evt) {
        numberHeadingsIE7(wym._doc, true);
    });
};

/*
    getHeadingLevel
    ===============

    Returns the integer heading level of the passed heading DOM element. For
    example, if the passed heading was an `h2` element, the function would
    return the integer `2`.
*/
function getHeadingLevel(heading) {
    return parseInt(heading.nodeName.slice(-1), 10);
}

/*
    numberHeadingsIE7
    =================

    Stand-alone function from WYMeditor that manually numbers the headings in a
    document using javascript to mimic the heading numbering generated by the
    structured headings plugin using CSS in browsers that support CSS counters
    and :before pseudo-elements. Meant in particular to add structured heading
    support to IE7.

    The doc parameter specifies the document which contains the headings to be
    numbered. It defaults to the document object of the page if the parameter
    isn't given. The addClass parameter specifies whether the structured
    headings classes need to be added to the headings as the numbering is added
    to the headings. It defaults to false if the parameter isn't given.

    Both of these parameters are optional so that, in most cases, if a user is
    calling this function on a page to number a document's headings outside of
    the editor, they can call the function with no parameters.

    The function returns the total number of characters in all of the added
    heading numbering spans so that it can be monitored if the headings need to
    be corrected if the total number of characters in the numbering spans
    changes.

    NOTE: Although this function is stand-alone from WYMeditor, it still
    requires jQuery.
*/
function numberHeadingsIE7(doc, addClass) {
    doc = typeof doc !== 'undefined' ? doc : document;

    var $doc = jQuery(doc),

        $startNode = $doc.find('.' +
                               WYMeditor.STRUCTURED_HEADINGS_START_NODE_CLASS),
        startHeadingLevel,
        headingSel = WYMeditor.HEADING_ELEMENTS.join(', '),

        $allHeadings,
        $heading,
        headingLabel,

        span,
        spanCharTotal = 0,

        counters = [0, 0, 0, 0, 0, 0],
        counterIndex,
        i,
        j;

    // If no start node is set and addClass is true, set the start node as the
    // first heading in doc by default.
    if (addClass) {
        $startNode = $doc.find(headingSel);
        if ($startNode.length) {
            $startNode = $startNode.eq(0);
            $startNode.addClass(WYMeditor.STRUCTURED_HEADINGS_START_NODE_CLASS);
        }
    }
    // If there are no headings in the document or if no start node is defined
    // and addClass is false, do nothing.
    if (!$startNode.length) {
        return;
    }

    // startHeadingType is the level of the heading that is the start node.
    // This is found out by looking at the last character of its nodeName.
    startHeadingLevel = getHeadingLevel($startNode[0]);
    $allHeadings = $startNode.nextAll(headingSel).add($startNode);

    // Remove any previously calculated heading numbering
    $doc.find('.' + WYMeditor.STRUCTURED_HEADINGS_NUMBERING_SPAN_CLASS).remove();

    for (i = 0; i < $allHeadings.length; ++i) {
        $heading = $allHeadings.eq(i);
        counterIndex = getHeadingLevel($heading[0]) - startHeadingLevel;

        // If the counterIndex is negative, it means the level of the current
        // heading is above the level of the start node, so heading numbering
        // should stop at this point.
        if (counterIndex < 0) {
            break;
        }

        // Calculate the heading label
        ++counters[counterIndex];
        headingLabel = '';
        for (j = 0; j <= counterIndex; ++j) {
            if (j === counterIndex) {
                headingLabel += counters[j];
            } else {
                headingLabel += counters[j] + '.';
            }
        }
        if (addClass) {
            $heading.addClass(
                WYMeditor.STRUCTURED_HEADINGS_LEVEL_CLASSES[counterIndex]);
        }

        // Prepend span containing the heading's label to heading
        span = doc.createElement('span');
        span.innerHTML = headingLabel;
        span.className = WYMeditor.STRUCTURED_HEADINGS_NUMBERING_SPAN_CLASS;
        if (addClass) {
            span.className += ' ' + WYMeditor.EDITOR_ONLY_CLASS;
        }
        $heading.prepend(span);
        spanCharTotal += (counterIndex * 2) + 1;

        // Reset counters below the heading's level
        for (j = counterIndex + 1; j < counters.length; ++j) {
            counters[j] = 0;
        }
    }

    return spanCharTotal;
}

