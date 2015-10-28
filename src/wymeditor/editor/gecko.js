/*jslint evil: true */
/* global -$ */
"use strict";

WYMeditor.WymClassGecko = function (wym) {
    var wymClassGecko = this;
    wymClassGecko._wym = wym;
    wymClassGecko._class = "class";
};

// Placeholder cell to allow content in TD cells for FF 3.5+
WYMeditor.WymClassGecko.CELL_PLACEHOLDER = '<br _moz_dirty="" />';

// Firefox 3.5 and 3.6 require the CELL_PLACEHOLDER and 4.0 doesn't
WYMeditor.WymClassGecko.NEEDS_CELL_FIX = parseInt(
    jQuery.browser.version, 10) === 1 &&
    jQuery.browser.version >= '1.9.1' &&
    jQuery.browser.version < '2.0';

WYMeditor.WymClassGecko.prototype._docEventQuirks = function () {
    var wym = this;
    var $doc = jQuery(wym._doc);

    $doc.keyup(wym._keyup.bind(wym));
    $doc.focus(function () {
        // not providing _onBodyFocus here because it doesn't exist yet
        wym.undoRedo._onBodyFocus();
    });
    $doc.click(wym._click.bind(wym));
};

// Keyup handler, mainly used for cleanups
WYMeditor.WymClassGecko.prototype._keyup = function (evt) {
    var wym = this,
        container,
        defaultRootContainer,
        notValidRootContainers,
        name,
        parentName;

    notValidRootContainers =
        wym.documentStructureManager.structureRules.notValidRootContainers;
    defaultRootContainer =
        wym.documentStructureManager.structureRules.defaultRootContainer;
    container = null;

    // If the inputted key cannont create a block element and is not a command,
    // check to make sure the selection is properly wrapped in a container
    if (!wym.keyCanCreateBlockElement(evt.which) &&
            evt.which !== WYMeditor.KEY_CODE.CTRL &&
            evt.which !== WYMeditor.KEY_CODE.COMMAND &&
            !evt.metaKey &&
            !evt.ctrlKey) {

        container = wym.selectedContainer();
        name = container.tagName.toLowerCase();
        if (container.parentNode) {
            parentName = container.parentNode.tagName.toLowerCase();
        }

        // Fix forbidden root containers
        if (wym.isForbiddenRootContainer(name)) {
            name = parentName;
        }

        // Replace text nodes with default root tags and make sure the
        // container is valid if it is a root container
        if (name === WYMeditor.BODY ||
                (jQuery.inArray(name, notValidRootContainers) > -1 &&
                parentName === WYMeditor.BODY)) {

            wym._exec(
                WYMeditor.EXEC_COMMANDS.FORMAT_BLOCK,
                defaultRootContainer
            );
            wym.prepareDocForEditing();
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
            wym._exec(
                WYMeditor.EXEC_COMMANDS.FORMAT_BLOCK,
                defaultRootContainer
            );
        }

        // Call for the check for--and possible correction of--issue #430.
        wym._handlePotentialEnterInEmptyNestedLi(evt.which, container);

        // Fix formatting if necessary
        wym.prepareDocForEditing();
    }
};

WYMeditor.WymClassGecko.prototype._click = function () {
    var wym = this,
        container = wym.selectedContainer(),
        sel;

    if (WYMeditor.WymClassGecko.NEEDS_CELL_FIX === true) {
        if (container && container.tagName.toLowerCase() === WYMeditor.TR) {
            // Starting with FF 3.6, inserted tables need some content in their
            // cells before they're editable
            jQuery(WYMeditor.TD, wym._doc.body).append(
                WYMeditor.WymClassGecko.CELL_PLACEHOLDER);

            // The user is still going to need to move out of and then back in
            // to this cell if the table was inserted via an inner_html call
            // (like via the manual HTML editor).
            // TODO: Use rangy or some other selection library to consistently
            // put the users selection out of and then back in this cell
            // so that it appears to be instantly editable
            // Once accomplished, can remove the _afterInsertTable handling
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
            wym._exec(WYMeditor.EXEC_COMMANDS.FORMAT_BLOCK, WYMeditor.P);
        }
    }
};

WYMeditor.WymClassGecko.prototype._designModeQuirks = function () {
    var wym = this;
    // Handle any errors that might occur.
    try {
        wym._doc.execCommand("styleWithCSS", '', false);
        wym._doc.execCommand("enableObjectResizing", false, false);
        wym._doc.execCommand("enableInlineTableEditing", false, false);
    } catch (e) {}
};

/*
 * Fix new cell contents and ability to insert content at the front and end of
 * the contents.
 */
WYMeditor.WymClassGecko.prototype._afterInsertTable = function (table) {
    if (WYMeditor.WymClassGecko.NEEDS_CELL_FIX === true) {
        // In certain FF versions, inserted tables need some content in their
        // cells before they're editable, otherwise the user has to move focus
        // in and then out of a cell first, even with our _click() hack
        jQuery(table).find('td').each(function (index, element) {
            jQuery(element).append(WYMeditor.WymClassGecko.CELL_PLACEHOLDER);
        });
    }
};
