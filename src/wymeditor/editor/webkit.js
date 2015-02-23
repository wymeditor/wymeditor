/*jslint evil: true */
/* global -$ */
"use strict";

WYMeditor.WymClassWebKit = function (wym) {
    var wymClassWebKit = this;
    wymClassWebKit._wym = wym;
    wymClassWebKit._class = "class";
};

WYMeditor.WymClassWebKit.prototype._docEventQuirks = function () {
    var wym = this;

    jQuery(wym._doc).bind("keyup", function (evt) {
        wym._keyup(evt);
    });

    wym.keyboard.combokeys.bind(
        "shift+enter",
        // WebKit's shift+enter seems to create a new paragraph so we fix it
        function () {
            wym._exec(WYMeditor.EXEC_COMMANDS.INSERT_LINEBREAK);
            return false;
        }
    );

    wym.$body().bind("focus", function () {
        wym.undoRedo._onBodyFocus();
    });
};

// A `div` can be created by breaking out of a list in some cases. Issue #549.
WYMeditor.WymClassWebKit.prototype._inListBreakoutDiv = function (evtWhich) {
    var wym = this,
        $rootContainer = jQuery(wym.getRootContainer());

    if (
        evtWhich === WYMeditor.KEY_CODE.ENTER &&
        $rootContainer.is('div') &&
        wym.documentStructureManager.defaultRootContainer !== 'div' &&
        $rootContainer.prev('ol, ul').length === 1
    ) {
        return true;
    }
    return false;
};

// Checks whether this is issue #542.
WYMeditor.WymClassWebKit.prototype._isLiInLiAfterEnter = function (evtWhich) {
    var wym = this,
        nodeAfterSel = wym.nodeAfterSel(),
        parentNode,
        previousSibling,
        previousSiblingChild,
        previousPreviousSibling;

    if (evtWhich !== WYMeditor.KEY_CODE.ENTER) {
        return false;
    }

    if (!nodeAfterSel) {
        return false;
    }

    parentNode = nodeAfterSel.parentNode;
    if (!parentNode) {
        return false;
    }
    if (typeof parentNode.tagName !== 'string') {
        return false;
    }
    if (parentNode.tagName.toLowerCase() !== 'li') {
        return false;
    }

    previousSibling = nodeAfterSel.previousSibling;
    if (!previousSibling) {
        return false;
    }
    if (typeof previousSibling.tagName !== 'string') {
        return false;
    }
    if (previousSibling.tagName.toLowerCase() !== 'li') {
        return false;
    }

    if (previousSibling.childNodes.length !== 1) {
        return false;
    }
    previousSiblingChild = previousSibling.childNodes[0];
    if (!previousSiblingChild) {
        return false;
    }
    if (typeof previousSiblingChild.tagName !== 'string') {
        return false;
    }
    if (previousSiblingChild.tagName.toLowerCase() !== 'br') {
        return false;
    }

    previousPreviousSibling = previousSibling.previousSibling;
    if (!previousPreviousSibling) {
        return false;
    }
    if (typeof previousPreviousSibling.tagName !== 'string') {
        return false;
    }
    if (
        jQuery.inArray(
        previousPreviousSibling.tagName.toLowerCase(),
        ['ol', 'ul']
        ) === -1
    ) {
        return false;
    }

    return true;
};

// Fixes issue #542.
WYMeditor.WymClassWebKit.prototype
    ._fixLiInLiAfterEnter = function () {
    var wym = this,
        nodeAfterSel = wym.nodeAfterSel(),
        $errorLi = jQuery(nodeAfterSel.previousSibling),
        $parentLi = $errorLi.parent('li'),
        errorLiIndex = $parentLi.contents().index($errorLi),
        $contentsAfterErrorLi = $parentLi.contents().slice(errorLiIndex + 1);

    $errorLi.remove();
    $parentLi.after('<li><br /></li>');
    $parentLi.next().append($contentsAfterErrorLi);
    wym.setCaretBefore($parentLi.next('li').children().first('br')[0]);
};

// Keyup handler, mainly used for cleanups
WYMeditor.WymClassWebKit.prototype._keyup = function (evt) {
    var wym = this,
        container,
        defaultRootContainer,
        notValidRootContainers,
        name,
        parentName,
        rootContainer;

    notValidRootContainers =
        wym.documentStructureManager.structureRules.notValidRootContainers;
    defaultRootContainer =
        wym.documentStructureManager.structureRules.defaultRootContainer;

    // Fix to allow shift + return to insert a line break in older safari
    if (jQuery.browser.version < 534.1) {
        // Not needed in AT MAX chrome 6.0. Probably safe earlier
        if (evt.which === WYMeditor.KEY_CODE.ENTER && evt.shiftKey) {
            wym._exec('InsertLineBreak');
        }
    }

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
            container = wym.selectedContainer();
        }

        // Issue #542
        if (wym._isLiInLiAfterEnter(evt.which, container)) {
            wym._fixLiInLiAfterEnter();
            // Container may have changed.
            container = wym.selectedContainer();
            return;
        }

        // Call for the check for--and possible correction of--issue #430.
        wym._handlePotentialEnterInEmptyNestedLi(evt.which, container);

        // Issue #549.
        if (wym._inListBreakoutDiv(evt.which)) {
            rootContainer = wym.switchTo(
                wym.getRootContainer(),
                defaultRootContainer
            );
            wym.setCaretIn(rootContainer);
        }

        // Fix formatting if necessary
        wym.prepareDocForEditing();
    }
};
