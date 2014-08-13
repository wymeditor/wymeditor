/*jslint evil: true */
/* global -$ */
"use strict";

// This file contains the quirks for Gecko.
WYMeditor._quirks._gecko = {};

WYMeditor._quirks._gecko._init = {};

WYMeditor._quirks._gecko._init._docEventQuirks = function () {
    var init = this,
        wym = init._wym;

    jQuery(wym._doc).bind("keydown", wym.keydown);
    jQuery(wym._doc).bind("keyup", wym.keyup);
    jQuery(wym._doc).bind("click", wym.click);
    // Bind editor focus events (used to reset designmode - Gecko bug)
    jQuery(wym._doc).bind("focus", function () {
        wym._init._enableDesignModeOnIframe();
    });
};

WYMeditor._quirks._gecko.editor = {};

// Placeholder cell to allow content in TD cells for FF 3.5+
WYMeditor._quirks._gecko.editor.CELL_PLACEHOLDER = '<br _moz_dirty="" />';

// Firefox 3.5 and 3.6 require the CELL_PLACEHOLDER and 4.0 doesn't
WYMeditor._quirks._gecko.editor.NEEDS_CELL_FIX = parseInt(
    jQuery.browser.version, 10) === 1 &&
    jQuery.browser.version >= '1.9.1' &&
    jQuery.browser.version < '2.0';

/** @name html
 * @description Get/Set the html value
 */
WYMeditor._quirks._gecko.editor._html = function (html) {
    var wym = this;

    if (typeof html === 'string') {
        //disable designMode
        try {
            wym._doc.designMode = "off";
        } catch (e) {
            //do nothing
        }

        //replace em by i and strong by bold
        //(designMode issue)
        html = html.replace(/<em(\b[^>]*)>/gi, "<i$1>");
        html = html.replace(/<\/em>/gi, "</i>");
        html = html.replace(/<strong(\b[^>]*)>/gi, "<b$1>");
        html = html.replace(/<\/strong>/gi, "</b>");

        //update the html body
        jQuery(wym._doc.body).html(html);
        wym.fixBodyHtml();

        //re-init designMode
        wym._init._enableDesignModeOnIframe();
    } else {
        return jQuery(wym._doc.body).html();
    }
    return false;
};

WYMeditor._quirks._gecko.editor._exec = function (cmd, param) {
    var wym = this,
        container;

    if (!wym.selectedContainer()) {
        return false;
    }

    if (param) {
        wym._doc.execCommand(cmd, '', param);
    } else {
        wym._doc.execCommand(cmd, '', null);
    }

    //set to P if parent = BODY
    container = wym.selectedContainer();
    if (container && container.tagName.toLowerCase() === WYMeditor.BODY) {
        wym._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
        wym.fixBodyHtml();
    }

    return true;
};

// keydown handler, mainly used for keyboard shortcuts
WYMeditor._quirks._gecko.editor.keydown = function (evt) {
    var doc = this,
        wym = WYMeditor.INSTANCES[doc.title];

    if (evt.ctrlKey) {
        if (evt.which === 66) {
            //CTRL+b => STRONG
            wym._exec(WYMeditor.BOLD);
            return false;
        }
        if (evt.which === 73) {
            //CTRL+i => EMPHASIS
            wym._exec(WYMeditor.ITALIC);
            return false;
        }
    }

    return true;
};

// Keyup handler, mainly used for cleanups
WYMeditor._quirks._gecko.editor.keyup = function (evt) {
    var doc = this,
        wym = WYMeditor.INSTANCES[doc.title],
        container,
        defaultRootContainer,
        notValidRootContainers,
        name,
        parentName;

    notValidRootContainers =
        wym.documentStructureManager.structureRules.notValidRootContainers;
    defaultRootContainer =
        wym.documentStructureManager.structureRules.defaultRootContainer;
    wym._selectedImage = null;
    container = null;

    // If the inputted key cannont create a block element and is not a command,
    // check to make sure the selection is properly wrapped in a container
    if (!wym.keyCanCreateBlockElement(evt.which) &&
            evt.which !== WYMeditor.KEY.CTRL &&
            evt.which !== WYMeditor.KEY.COMMAND &&
            !evt.metaKey &&
            !evt.ctrlKey) {

        container = wym.selectedContainer();
        name = container.tagName.toLowerCase();
        if (container.parentNode) {
            parentName = container.parentNode.tagName.toLowerCase();
        }

        // Fix forbidden main containers
        if (wym.isForbiddenMainContainer(name)) {
            name = parentName;
        }

        // Replace text nodes with default root tags and make sure the
        // container is valid if it is a root container
        if (name === WYMeditor.BODY ||
                (jQuery.inArray(name, notValidRootContainers) > -1 &&
                parentName === WYMeditor.BODY)) {

            wym._exec(WYMeditor.FORMAT_BLOCK, defaultRootContainer);
            wym.fixBodyHtml();
        }
    }

    // If we potentially created a new block level element or moved to a new
    // one, then we should ensure the container is valid and the formatting is
    // proper.
    if (wym.keyCanCreateBlockElement(evt.which)) {
        // If the selected container is a root container, make sure it is not a
        // different possible default root container than the chosen one.
        container = wym.selectedContainer();
        name = container.tagName.toLowerCase();
        if (container.parentNode) {
            parentName = container.parentNode.tagName.toLowerCase();
        }
        if (jQuery.inArray(name, notValidRootContainers) > -1 &&
                parentName === WYMeditor.BODY) {
            wym._exec(WYMeditor.FORMAT_BLOCK, defaultRootContainer);
        }

        // Call for the check for--and possible correction of--issue #430.
        wym.handlePotentialEnterInEmptyNestedLi(evt.which, container);

        // Fix formatting if necessary
        wym.fixBodyHtml();
    }
};

WYMeditor._quirks._gecko.editor.click = function () {
    var doc = this,
        wym = WYMeditor.INSTANCES[doc.title],
        container = wym.selectedContainer(),
        sel;

    if (WYMeditor._quirks._gecko.editor.NEEDS_CELL_FIX === true) {
        if (container && container.tagName.toLowerCase() === WYMeditor.TR) {
            // Starting with FF 3.6, inserted tables need some content in their
            // cells before they're editable
            jQuery(WYMeditor.TD, wym._doc.body).append(
                WYMeditor._quirks._gecko.CELL_PLACEHOLDER);

            // The user is still going to need to move out of and then back in
            // to this cell if the table was inserted via an inner_html call
            // (like via the manual HTML editor).
            // TODO: Use rangy or some other selection library to consistently
            // put the users selection out of and then back in this cell
            // so that it appears to be instantly editable
            // Once accomplished, can remove the afterInsertTable handling
        }
    }

    if (container && container.tagName.toLowerCase() === WYMeditor.BODY) {
        // A click in the body means there is no content at all, so we
        // should automatically create a starter paragraph
        sel = wym.selection();
        if (sel.isCollapsed === true) {
            // If the selection isn't collapsed, we might have a selection that
            // drags over the body, but we shouldn't turn everything in to a
            // paragraph tag. Otherwise, double-clicking in the space to the
            // right of an h2 tag would turn it in to a paragraph
            wym._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
        }
    }
};

WYMeditor._quirks._gecko._init._enableDesignModeOnIframe = function () {
    var init = this,
        wym = init._wym;

    if (wym._doc.designMode === "off") {
        try {
            wym._doc.designMode = "on";
            wym._doc.execCommand("styleWithCSS", '', false);
            wym._doc.execCommand("enableObjectResizing", false, true);
        } catch (e) {}
    }
};

/*
 * Fix new cell contents and ability to insert content at the front and end of
 * the contents.
 */
WYMeditor._quirks._gecko.editor.afterInsertTable = function (table) {
    if (WYMeditor._quirks._gecko.editor.NEEDS_CELL_FIX === true) {
        // In certain FF versions, inserted tables need some content in their
        // cells before they're editable, otherwise the user has to move focus
        // in and then out of a cell first, even with our click() hack
        jQuery(table).find('td').each(function (index, element) {
            jQuery(element).append(WYMeditor._quirks._gecko.CELL_PLACEHOLDER);
        });
    }
};
