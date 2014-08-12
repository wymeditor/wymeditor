/*jslint evil: true */
/* global rangy, -$ */
"use strict";

// This file contains the quirks for pre-7 Trident.
WYMeditor._quirks._tridentPre7 = {};

WYMeditor._quirks._tridentPre7.startupQuirks = function () {
    WYMeditor.CLASS = 'className';
};

WYMeditor._quirks._tridentPre7._init = {};

WYMeditor._quirks._tridentPre7._init
    ._onEditorIframeLoad = function () {
    var init = this,
        wym = init._wym;

    wym._init._assignWymDoc();

    if (wym._init._isDesignModeOn() === false) {
        wym._doc.designMode = "On";
    } else {
        // Pre-7 Trident Internet Explorer versions reload the Iframe when its
        // designMode property is set to "on". So this will run on the second
        // time this handler is called.
        wym._init._afterDesignModeOn();
    }
};

WYMeditor._quirks._tridentPre7._init._assignWymDoc = function () {
    var init = this,
        wym = init._wym;

    wym._doc = wym._iframe.contentWindow.document;
};

WYMeditor._quirks._tridentPre7._init._docEventQuirks = function () {
    var init = this,
        wym = init._wym;

    wym._doc.onbeforedeactivate = function () {
        wym.saveCaret();
    };
    jQuery(wym._doc).bind('keyup', wym.keyup);
    wym._doc.onkeyup = function () {
        wym.saveCaret();
    };
    wym._doc.onclick = function () {
        wym.saveCaret();
    };

    wym._doc.body.onbeforepaste = function () {
        wym._iframe.contentWindow.event.returnValue = false;
    };

    wym._doc.body.onpaste = function () {
        wym._iframe.contentWindow.event.returnValue = false;
        wym.paste(window.clipboardData.getData("Text"));
    };
};

WYMeditor._quirks._tridentPre7._init._setButtonsUnselectable = function () {
    var init = this,
        wym = init._wym,
        buttonsSelector,
        $buttons;

    buttonsSelector = [
        wym._options.toolSelector,
        wym._options.containerSelector,
        wym._options.classSelector
    ].join(', ');

    $buttons = jQuery(wym._box).find(buttonsSelector);
    $buttons.attr('unselectable', 'on');
};

WYMeditor._quirks._tridentPre7._init._UiQuirks = function () {
    var init = this;
    if (jQuery.browser.versionNumber === 8) {
        // Mark UI buttons as unselectable (#203)
        // Issue explained here:
        // http://stackoverflow.com/questions/1470932
        init._setButtonsUnselectable();
    }
};

WYMeditor._quirks._tridentPre7.editor = {};

WYMeditor._quirks._tridentPre7.editor._exec = function (cmd, param) {
    var wym = this;
    if (param) {
        wym._doc.execCommand(cmd, false, param);
    } else {
        wym._doc.execCommand(cmd);
    }
};

WYMeditor._quirks._tridentPre7.editor.saveCaret = function () {
    var wym = this;
    wym._doc.caretPos = wym._doc.selection.createRange();
};

WYMeditor._quirks._tridentPre7.editor.insert = function (html) {
    var wym = this,
        range,
        $selectionParents;

    // Get the current selection
    range = wym._doc.selection.createRange();

    // Check if the current selection is inside the editor
    $selectionParents = jQuery(range.parentElement()).parents();
    if ($selectionParents.is(wym._options.iframeBodySelector)) {
        try {
            // Overwrite selection with provided html
            range.pasteHTML(html);
        } catch (e) {}
    } else {
        // Fall back to the internal paste function if there's no selection
        wym.paste(html);
    }
};

WYMeditor._quirks._tridentPre7.editor.wrap = function (left, right) {
    var wym = this;
    // Get the current selection
    var range = wym._doc.selection.createRange(),
        $selectionParents;

    // Check if the current selection is inside the editor
    $selectionParents = jQuery(range.parentElement()).parents();
    if ($selectionParents.is(wym._options.iframeBodySelector)) {
        try {
            // Overwrite selection with provided html
            range.pasteHTML(left + range.text + right);
        } catch (e) {}
    }
};

/**
    wrapWithContainer
    =================

    Wraps the passed node in a container of the passed type. Also, restores the
    selection to being after the node within its new container.

    @param node A DOM node to be wrapped in a container
    @param containerType A string of an HTML tag that specifies the container
                         type to use for wrapping the node.
*/
WYMeditor._quirks._tridentPre7.editor.wrapWithContainer = function (
    node, containerType
) {
    var wym = this,
        $wrappedNode,
        selection,
        range;

    $wrappedNode = jQuery(node).wrap('<' + containerType + ' />');
    selection = wym.selection();
    range = rangy.createRange(wym._doc);
    range.selectNodeContents($wrappedNode[0]);
    range.collapse();
    selection.setSingleRange(range);
};

WYMeditor._quirks._tridentPre7.editor.unwrap = function () {
    // Get the current selection
    var wym = this,
        range = wym._doc.selection.createRange(),
        $selectionParents,
        text;

    // Check if the current selection is inside the editor
    $selectionParents = jQuery(range.parentElement()).parents();
    if ($selectionParents.is(wym._options.iframeBodySelector)) {
        try {
            // Unwrap selection
            text = range.text;
            wym._exec('Cut');
            range.pasteHTML(text);
        } catch (e) {}
    }
};

WYMeditor._quirks._tridentPre7.editor.keyup = function (evt) {
    var doc = this,
        wym = WYMeditor.INSTANCES[doc.title],
        container,
        defaultRootContainer,
        notValidRootContainers,
        name,
        parentName,
        forbiddenMainContainer = false,
        selectedNode;

    notValidRootContainers =
        wym.documentStructureManager.structureRules.notValidRootContainers;
    defaultRootContainer =
        wym.documentStructureManager.structureRules.defaultRootContainer;
    doc._selectedImage = null;

    // If the pressed key can't create a block element and is not a command,
    // check to make sure the selection is properly wrapped in a container
    if (!wym.keyCanCreateBlockElement(evt.which) &&
            evt.which !== WYMeditor.KEY.CTRL &&
            evt.which !== WYMeditor.KEY.COMMAND &&
            !evt.metaKey &&
            !evt.ctrlKey) {

        container = wym.selectedContainer();
        selectedNode = wym.selection().focusNode;
        if (container !== null) {
            name = container.tagName.toLowerCase();
        }
        if (container.parentNode) {
            parentName = container.parentNode.tagName.toLowerCase();
        }

        // Fix forbidden main containers
        if (wym.isForbiddenMainContainer(name)) {
            name = parentName;
            forbiddenMainContainer = true;
        }

        // Wrap text nodes and forbidden main containers with default root node
        // tags
        if (name === WYMeditor.BODY && selectedNode.nodeName === "#text") {
            // If we're in a forbidden main container, switch the selected node
            // to its parent node so that we wrap the forbidden main container
            // itself and not its inner text content
            if (forbiddenMainContainer) {
                selectedNode = selectedNode.parentNode;
            }
            wym.wrapWithContainer(selectedNode, defaultRootContainer);
            wym.fixBodyHtml();
        }

        if (jQuery.inArray(name, notValidRootContainers) > -1 &&
                parentName === WYMeditor.BODY) {
            wym.switchTo(container, defaultRootContainer);
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
            wym.switchTo(container, defaultRootContainer);
        }

        // Call for the check for--and possible correction of--issue #430.
        wym.handlePotentialEnterInEmptyNestedLi(evt.which, container);

        // IE8 bug https://github.com/wymeditor/wymeditor/issues/446
        if (
            evt.which === WYMeditor.KEY.BACKSPACE &&
            jQuery.browser.msie &&
            jQuery.browser.versionNumber === 8 &&
            container.parentNode && (
                parentName === 'ul' ||
                parentName === 'ol'
            )
        ) {
            wym.correctInvalidListNesting(container);
        }

        // Fix formatting if necessary
        wym.fixBodyHtml();
    }
};
