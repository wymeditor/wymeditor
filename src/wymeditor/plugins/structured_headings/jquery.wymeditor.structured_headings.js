// Constants for selecting headings
var HEADING_LIST = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    HEADING_SEL = HEADING_LIST.join(', ');

// Constants for class names used in structuring the headings
var START_NODE_CLASS = 'wym-structured-headings-start',
    NUMBERING_SPAN_CLASS = 'wym-structured-heading-numbering',
    LEVEL_CLASSES = ['wym-structured-heading-level1',
                     'wym-structured-heading-level2',
                     'wym-structured-heading-level3',
                     'wym-structured-heading-level4',
                     'wym-structured-heading-level5',
                     'wym-structured-heading-level6'];

// Key codes for the keyup events that the heading numberings should be
// recalculated on (i.e. for backspace, enter, and delete keys)
var NUMBER_HEADINGS_KEYUPS = [8, 13, 46];

// The class of the containers panel and the classes of the DOM elmements
// within that panel that the heading numberings should be recalculated on
// click
var CONTAINERS_PANEL_CLASS = 'wym_containers';
var CLICK_HYPERLINK_NAMES = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

// Check if wymeditor exists on the page. If it doesn't exist and we're in IE7,
// number the structured headings on the page. If it does exist, set up the
// plugin for the editor.
if (typeof jQuery.wymeditors === 'undefined') {
    if (jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 8.0) {
        jQuery(document).ready(function() { numberHeadingsIE7(); });
    }

} else {
    WYMeditor.BROWSER_SUPPORTED_STRUCTURED_HEADINGS =
        !(jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 7.0);
    WYMeditor.BROWSER_SUPPORTED_STRUCTURED_HEADINGS_POLYFILL =
        jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 8.0;

    WYMeditor.STRUCTURED_HEADINGS_LIST = HEADING_LIST;
    WYMeditor.STRUCTURED_HEADINGS_SEL = HEADING_SEL;
    WYMeditor.STRUCTURED_HEADINGS_START_NODE_CLASS = START_NODE_CLASS;
    WYMeditor.STRUCTURED_HEADINGS_NUMBERING_SPAN_CLASS = NUMBERING_SPAN_CLASS;
    WYMeditor.STRUCTURED_HEADINGS_LEVEL_CLASSES = LEVEL_CLASSES;
    WYMeditor.STRUCTURED_HEADINGS_NUMBER_HEADINGS_KEYUPS = NUMBER_HEADINGS_KEYUPS;
    WYMeditor.STRUCTURED_HEADINGS_CONTAINERS_PANEL_CLASS = CONTAINERS_PANEL_CLASS;
    WYMeditor.STRUCTURED_HEADINGS_CLICK_HYPERLINK_NAMES = CLICK_HYPERLINK_NAMES;

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

        if (WYMeditor.BROWSER_SUPPORTED_STRUCTURED_HEADINGS_POLYFILL) {
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
                .find('.' + CONTAINERS_PANEL_CLASS + ' li > a'),
            prevHeadingTotal = 0,
            prevSpanCharTotal = 0;

        $body.keyup(function (evt) {
            if (jQuery.inArray(evt.which, NUMBER_HEADINGS_KEYUPS) > -1) {
                var headingTotal = $body.find(HEADING_SEL).length,
                    spanCharTotal = 0;

                $body.find('.' + NUMBERING_SPAN_CLASS).each(function () {
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
            if (jQuery.inArray(evt.target.name, CLICK_HYPERLINK_NAMES) > -1) {
                numberHeadingsIE7(wym._doc, true);
            }
        });
    };
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

        $startNode = $doc.find('.' + START_NODE_CLASS),
        startIndex,
        adjustedHeadingSel,

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
        $startNode = $doc.find(HEADING_SEL);
        if ($startNode.length) {
            $startNode = $startNode.eq(0);
            $startNode.addClass(START_NODE_CLASS);
        }
    }
    // If there are no headings in the document or if no start node is defined
    // and addClass is false, do nothing.
    if (!$startNode.length) {
        return;
    }

    // startHeadingType is the level of the heading that is the start node.
    // This is found out by looking at the last character of its nodeName.
    startHeadingLevel = parseInt($startNode[0].nodeName.slice(-1), 10);
    $allHeadings = $startNode.nextAll(HEADING_SEL).add($startNode);

    // Remove any previously calculated heading numbering
    $doc.find('.' + NUMBERING_SPAN_CLASS).remove();

    for (i = 0; i < $allHeadings.length; ++i) {
        $heading = $allHeadings.eq(i);
        counterIndex = parseInt($heading[0].nodeName.slice(-1), 10) -
            startHeadingLevel;

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
            $heading.addClass(LEVEL_CLASSES[counterIndex]);
        }

        // Prepend span containing the heading's label to heading
        span = doc.createElement('span');
        span.innerHTML = headingLabel;
        span.className = NUMBERING_SPAN_CLASS;
        $heading.prepend(span);
        spanCharTotal += (counterIndex * 2) + 1;

        // Reset counters below the heading's level
        for (j = counterIndex + 1; j < counters.length; ++j) {
            counters[j] = 0;
        }
    }

    return spanCharTotal;
}

