/* jshint maxlen: 90 */
/* global -$, rangy */
"use strict";

// In case the script is included on a page without WYMeditor, define the
// WYMeditor and WYMeditor.editor objects to hold the constants used.
if (typeof (WYMeditor) === 'undefined') {
    /* jshint -W020 */
    WYMeditor = {};
    /* jshint +W020 */
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



/**
    StructuredHeadingsManager
    =========================

    A heading structure management object that makes it easier for a user to
    structure the headings in a document by simplifying the user interface and
    adding features such as heading numbering.

    @param options A configuration object.
    @param wym The WYMeditor instance to which the StructuredHeadingsManager
               object should attach.
    @class
*/
function StructuredHeadingsManager(options, wym) {
    options = jQuery.extend({
        headingIndentToolSelector: "li.wym_tools_indent a",
        headingOutdentToolSelector: "li.wym_tools_outdent a",

        enableFixHeadingStructureButton: false,
        fixHeadingStructureButtonHtml: String() +
        '<li class="wym_tools_fix_heading_structure">' +
            '<a name="fix_heading_structure" href="#" title="Fix Heading Structure" ' +
                'style="background-image: ' +
                    "url('" + wym._options.basePath +
                        "plugins/structured_headings/ruler_arrow.png')" + '">' +
                'Fix Heading Structure' +
            '</a>' +
        '</li>',
        fixHeadingStructureSelector: "li.wym_tools_fix_heading_structure a",

        headingContainerPanelHtml: String() +
            '<li class="wym_containers_heading">' +
                '<a href="#" name="HEADING">Heading</a>' +
            '</li>',
        headingContainerPanelSelector: "li.wym_containers_heading a",

        highestAllowableHeadingLevel: 1,
        lowestAllowableHeadingLevel: 6

    }, options);

    this._headingElements = WYMeditor.HEADING_ELEMENTS
        .slice(options.highestAllowableHeadingLevel - 1,
               options.lowestAllowableHeadingLevel);
    this._limitedHeadingSel = this._headingElements.join(", ");
    this._fullHeadingSel = WYMeditor.HEADING_ELEMENTS.join(", ");
    this._options = options;
    this._wym = wym;

    this.init();
}

/**
    init
    ====

    Initializes the heading structure object used in the plugin for the
    wymeditor instance. Creates the user interface adjustments, binds any
    required listeners, applies the necessary CSS stylesheets, and enables the
    IE7 heading numbering polyfill if necessary.
*/
StructuredHeadingsManager.prototype.init = function () {
    this.createUI();
    this.bindEvents();
    this.addCssStylesheet();

    if (WYMeditor.STRUCTURED_HEADINGS_POLYFILL_REQUIRED) {
        this.enableIE7Polyfill();
    }
};

/**
    createUI
    ========

    Creates the structured headings user interface by adding the tools to the
    tool bar and modifying the container selection panel.
*/
StructuredHeadingsManager.prototype.createUI = function () {
    var wym = this._wym,
        $tools = jQuery(wym._box).find(
            wym._options.toolsSelector + wym._options.toolsListSelector
        ),
        $containerItems,
        $containerLink,
        i;

    // Add tool panel buttons if necessary
    if (this._options.enableFixHeadingStructureButton) {
        $tools.append(this._options.fixHeadingStructureButtonHtml);
    }

    // Remove normal heading links from the containers panel list
    $containerItems = jQuery(wym._box).find(wym._options.containersSelector)
                                      .find('li');
    for (i = 0; i < $containerItems.length; ++i) {
        $containerLink = $containerItems.eq(i).find('a');
        if (jQuery.inArray($containerLink[0].name.toLowerCase(),
                           WYMeditor.HEADING_ELEMENTS) > -1) {
            $containerItems.eq(i).remove();
        }
    }

    // Add new single heading container to the containers panel list
    $containerItems.eq(0).after(this._options.headingContainerPanelHtml);
};

/**
    bindEvents
    ==========

    Binds the click events for the buttons in the tool bar and the container
    link in the containers panel.
*/
StructuredHeadingsManager.prototype.bindEvents = function () {
    var headingManager = this,
        wym = this._wym,
        $box = jQuery(wym._box);

    // Bind click events to tool buttons
    $box.find(this._options.headingOutdentToolSelector).click(function () {
        var sel = rangy.getIframeSelection(wym._iframe);
        headingManager.changeSelectedHeadingsLevel(sel, "up");
    });
    $box.find(this._options.headingIndentToolSelector).click(function () {
        var sel = rangy.getIframeSelection(wym._iframe);
        headingManager.changeSelectedHeadingsLevel(sel, "down");
    });
    if (this._options.enableFixHeadingStructureButton) {
        $box.find(this._options.fixHeadingStructureSelector).click(function () {
            headingManager.fixHeadingStructure();
        });
    }

    // Bind click event to the new single heading link
    $box.find(this._options.headingContainerPanelSelector).click(function () {
        var container = wym.findUp(wym.mainContainer(), WYMeditor.MAIN_CONTAINERS);
        headingManager.switchToHeading(container);
    });
};

/**
    addCssStylesheet
    ================

    Adds the CSS stylesheet for the heading numbering to the wymeditor iframe
    and stores the CSS for access through the printCss function.
*/
StructuredHeadingsManager.prototype.addCssStylesheet = function () {
    var wym = this._wym,
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
        stylesheetHref = stylesheetHref.replace(/editor.css$/, 'user.css');

    } else {
        stylesheetHref = '/plugins/structured_headings/structured_headings.css';
        cssLink.href = '../..' + stylesheetHref; // Adjust path for iframe
        iframeHead.appendChild(cssLink);
    }

    // Get stylesheet CSS and store it in WYMeditor so that it can be accessed
    // to put on other pages.
    cssRequest = new XMLHttpRequest();
    cssRequest.open('GET', wym._options.basePath + stylesheetHref, false);
    cssRequest.send('');
    WYMeditor.structuredHeadingsCSS = cssRequest.responseText;
};

/**
    canRaiseHeadingLevel
    ====================

    Checks the context of the passed heading DOM node to see if it can validly
    have its heading level raised. Returns true if the heading's level can
    validly be raised, false if otherwise.

    @param heading A heading DOM node for checking if it can validly have its
                   heading level raised
*/
StructuredHeadingsManager.prototype.canRaiseHeadingLevel = function (heading) {
    var headingLevel = getHeadingLevel(heading),
        headingLevelDifference,
        nextHeading,
        nextHeadingLevel;

    // The level of a heading cannot be raised if it is already at the highest
    // allowable level.
    if (headingLevel === this._options.highestAllowableHeadingLevel) {
        return false;
    }

    // The level of a heading cannot be raised if the heading level is any
    // higher than the level of its following heading.
    nextHeading = jQuery(heading).nextAll(this._fullHeadingSel)[0];
    if (nextHeading) {
        nextHeadingLevel = getHeadingLevel(nextHeading);
        headingLevelDifference = headingLevel - nextHeadingLevel;
        if (headingLevelDifference < 0) {
            return false;
        }
    }

    return true;
};

/**
    canLowerHeadingLevel
    ====================

    Checks the context of the passed heading DOM node to see if it can validly
    have its heading level lowered. Returns true if the heading's level can
    validly be lowered, false if otherwise.

    @param heading A heading DOM node for checking if it can validly have its
                   heading level lowered
*/
StructuredHeadingsManager.prototype.canLowerHeadingLevel = function (heading) {
    var headingLevel = getHeadingLevel(heading),
        headingLevelDifference,
        prevHeading,
        prevHeadingLevel;

    // The level of a heading cannot be lowered if it is already at the lowest
    // allowable level.
    if (headingLevel === this._options.lowestAllowableHeadingLevel) {
        return false;
    }

    // The user cannot lower the level of a heading if the heading level is any
    // lower than the level of its previous heading.
    prevHeading = jQuery(heading).prevAll(this._fullHeadingSel)[0];
    if (prevHeading) {
        prevHeadingLevel = getHeadingLevel(prevHeading);
        headingLevelDifference = prevHeadingLevel - headingLevel;
        if (headingLevelDifference < 0) {
            return false;
        }
    }

    return true;
};

/**
    changeSelectedHeadingsLevel
    ===========================

    Iterates through the headings in the passed selection and raises or lowers
    the level of each heading if it is allowable.

    The level of a heading can only be raised if it is not the highest
    allowable level and if the level of the heading is not higher than the
    level of its following heading after all headings in the selection have had
    their heading level attempted to be raised.

    The level of a heading can only be lowered if it is not the lowest
    allowable level and if the level of the heading is not lower than the level
    of its preceding heading after all headings in the selection have had their
    heading level attempted to be lowered.

    @param selection A rangy selection object to have the level of its
                     containing headings raised if allowable.
    @param upOrDown A string being either "up" or "down" that specifies if the
                    selected headings should have their level raised up or
                    lowered down.
*/
StructuredHeadingsManager.prototype.changeSelectedHeadingsLevel = function (
    selection, upOrDown
) {
    var wym = this._wym,
        headingManager = this,
        shouldRaise = (upOrDown === 'up'),
        i,
        iStart = (shouldRaise ? selection.rangeCount - 1 : 0),
        iLimit = (shouldRaise ? -1 : selection.rangeCount),
        iterChange = (shouldRaise ? -1 : 1),
        range,
        heading,
        headingList,
        j,
        jStart,
        jLimit,
        headingNodeFilter;

    headingNodeFilter = function (testNode) {
        return jQuery(testNode).is(headingManager._fullHeadingSel);
    };

    // Iterate through the headings in the selection from bottom to top if the
    // level of the headings should be raised or top to bottom if the level of
    // the headings should be lowered. This ordering is necessary to ensure
    // each heading has had its relevant context of surrounding heading levels
    // modified so that it can be assessed if the heading can validly be raised
    // or lowered.
    for (i = iStart; i !== iLimit; i += iterChange) {
        range = selection.getRangeAt(i);
        if (range.collapsed) {
            // Collapsed ranges don't return their node with getNodes(), so
            // use findUp to get the containing heading.
            heading = wym.findUp(range.startContainer,
                                 WYMeditor.HEADING_ELEMENTS);
            this.changeHeadingLevel(heading, upOrDown);
        } else {
            // Use getNodes to get the selected headings
            headingList = range.getNodes(false, headingNodeFilter);
            if (!headingList.length && range.getNodes().length) {
                // If there are some nodes in the range, but none of the are
                // headings, it's possible that all of the nodes are contained
                // within a heading.
                headingList = [wym.findUp(range.getNodes()[0],
                                          WYMeditor.HEADING_ELEMENTS)];
            }

            jStart = (shouldRaise ? headingList.length - 1 : 0);
            jLimit = (shouldRaise ? -1 : headingList.length);
            for (j = jStart; j !== jLimit; j += iterChange) {
                this.changeHeadingLevel(headingList[j], upOrDown);
            }
        }
    }
};

/**
    changeHeadingLevel
    ==================

    If the passed heading DOM node exists in the documet, changes the level of
    that heading up or down by one level if it is allowable. The heading will not
    have its level moved up if the heading following it is at a lower level
    than the passed heading's current level. A heading will not have its
    level moved down if the heading preceding it is at a higher level than the
    passed heading's current level.

    @param heading The DOM node of a heading element in the document.
    @param upOrDown A string either being "up" or "down" that indicates if the
                    heading level should be raised or lowered.
*/
StructuredHeadingsManager.prototype.changeHeadingLevel = function (
    heading, upOrDown
) {
    var wym = this._wym,
        changeLevelUp = (upOrDown === "up"),
        levelAdjustment = (changeLevelUp ? -1 : 1),
        headingLevel;

    // If the heading doesn't exist, don't do anything.
    if (!heading) {
        return;
    }

    // Check if the requested change in the heading level is valid. If it is
    // not valid, don't modify the heading.
    headingLevel = getHeadingLevel(heading);
    if (changeLevelUp && !this.canRaiseHeadingLevel(heading)) {
        return;
    }
    if (!changeLevelUp && !this.canLowerHeadingLevel(heading)) {
        return;
    }

    wym.switchTo(heading, 'h' + (headingLevel + levelAdjustment));
    if (WYMeditor.STRUCTURED_HEADINGS_POLYFILL_REQUIRED) {
        this.numberHeadingsIE7();
    }
};

/**
    switchToHeading
    ===============

    Switches the passed DOM node (if it exists) to a heading with the same
    heading level as the preceding heading to the node. If there is no
    preceding heading to the node, the node is switched to a heading with the
    specified highest allowable heading level in the options.

    @param node The DOM node to be switched to a heading.
*/
StructuredHeadingsManager.prototype.switchToHeading = function (node) {
    var wym = this._wym,
        $prevHeading;

    // If the node doesn't exist, don't do anything.
    if (!node) {
        return;
    }

    $prevHeading = jQuery(node).prev(this._fullHeadingSel);
    if ($prevHeading.length) {
        wym.switchTo(node, $prevHeading[0].nodeName);
    } else {
        wym.switchTo(node, 'h' + this._options.highestAllowableHeadingLevel);
    }

    if (WYMeditor.STRUCTURED_HEADINGS_POLYFILL_REQUIRED) {
        this.numberHeadingsIE7();
    }
};

/**
    fixHeadingStructure
    ===================

    Fixes the structure of the headings in the editor if needed so that they
    follow proper standards of heading usage. The main fix this applies is
    preventing headings from being more than one level apart while descending
    (e.g. an H1 followed by an H3 or an H2 followed by an H4).

    This function is pretty simple now and will need more work in the future to
    make it smarter.
*/
StructuredHeadingsManager.prototype.fixHeadingStructure = function () {
    var wym = this._wym,
        $headings = jQuery(wym._doc).find('body.wym_iframe')
                                    .find(this._limitedHeadingSel),
        heading,
        headingLevel,
        prevHeadingLevel,
        i;

    // If there are no headings in the document, don't do anything.
    if (!$headings.length) {
        return;
    }

    prevHeadingLevel = getHeadingLevel($headings[0]);
    for (i = 1; i < $headings.length; ++i) {
        heading = $headings[i];
        headingLevel = getHeadingLevel(heading);
        if (headingLevel - prevHeadingLevel > 1) {
            wym.switchTo(heading, 'h' + (prevHeadingLevel + 1));
            ++prevHeadingLevel;
        } else {
            prevHeadingLevel = headingLevel;
        }
    }
};

/**
    enableIE7Polyfill
    =================

    Enables Javascript polyfill to add heading numbering to IE versions 7
    and lower.
*/
StructuredHeadingsManager.prototype.enableIE7Polyfill = function () {
    var wym = this._wym,
        headingManager = this,
        $body = jQuery(wym._doc).find('body.wym_iframe'),
        $containersPanelLinks = jQuery(wym._box)
            .find(wym._options.containersSelector + ' li > a'),
        prevHeadingTotal = 0,
        prevSpanCharTotal = 0;

    $body.keyup(function (evt) {
        if (jQuery.inArray(evt.which,
            WYMeditor.STRUCTURED_HEADINGS_POTENTIAL_HEADING_MODIFICATION_KEYS) > -1) {

            var headingTotal = $body.find(headingManager._limitedHeadingSel).length,
                spanCharTotal = 0;

            $body.find('.' + WYMeditor.STRUCTURED_HEADINGS_NUMBERING_SPAN_CLASS)
                 .each(function () {

                spanCharTotal += this.innerHTML.length;
            });

            if (headingTotal !== prevHeadingTotal ||
                spanCharTotal !== prevSpanCharTotal) {

                prevSpanCharTotal = headingManager.numberHeadingsIE7();
            }

            prevHeadingTotal = headingTotal;
        }
    });

    $containersPanelLinks.click(function () {
        headingManager.numberHeadingsIE7();
    });
};

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

/**
    numberHeadingsIE7
    =================

    A method of Structured Headings Manager objects that wraps the
    numberHeadingsIE7 function in the plugin file for easier use.
*/
StructuredHeadingsManager.prototype.numberHeadingsIE7 = function () {
    numberHeadingsIE7(this._wym._doc, true);
};

/**
    WYMeditor.printStructuredHeadingsCss
    ====================================

    Function to output the plugin CSS to the console log so that it can be
    copied over to other pages.
*/
WYMeditor.printStructuredHeadingsCSS = function () {
    WYMeditor.console.log(WYMeditor.structuredHeadingsCSS);
};

/**
    structuredHeadings
    ==================

    Construct and return a heading structure object using the given options
    object. This should be called in the `postInit` function when initializing
    a wymeditor instance.

    @param options A configuration object.
*/
WYMeditor.editor.prototype.structuredHeadings = function (options) {
    var structuredHeadingsManager = new StructuredHeadingsManager(options, this);
    this.structuredHeadingsManager = structuredHeadingsManager;

    return structuredHeadingsManager;
};
