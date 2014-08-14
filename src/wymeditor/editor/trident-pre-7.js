/*jslint evil: true */
/* global rangy, -$ */
"use strict";

WYMeditor.WymClassTridentPre7 = function (wym) {
    this._wym = wym;
    this._class = "className";
};

WYMeditor.WymClassTridentPre7.prototype._onEditorIframeLoad = function (wym) {
    wym._assignWymDoc();

    if (wym._isDesignModeOn() === false) {
        wym._doc.designMode = "On";
    } else {
        // Pre-7 Trident Internet Explorer versions reload the Iframe when its
        // designMode property is set to "on". So this will run on the second
        // time this handler is called.
        wym._afterDesignModeOn();
    }
};

WYMeditor.WymClassTridentPre7.prototype._assignWymDoc = function () {
    var wym = this;

    wym._doc = wym._iframe.contentWindow.document;
};

WYMeditor.WymClassTridentPre7.prototype._docEventQuirks = function () {
    var wym = this;

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

WYMeditor.WymClassTridentPre7.prototype._setButtonsUnselectable = function () {
    // Mark UI buttons as unselectable (#203)
    // Issue explained here:
    // http://stackoverflow.com/questions/1470932
    var wym = this,
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

WYMeditor.WymClassTridentPre7.prototype._UiQuirks = function () {
    var wym = this;
    if (jQuery.browser.versionNumber === 8) {
        wym._setButtonsUnselectable();
    }
};

WYMeditor.WymClassTridentPre7.prototype._exec = function (cmd, param) {
    if (param) {
        this._doc.execCommand(cmd, false, param);
    } else {
        this._doc.execCommand(cmd);
    }
};

WYMeditor.WymClassTridentPre7.prototype.saveCaret = function () {
    this._doc.caretPos = this._doc.selection.createRange();
};

WYMeditor.WymClassTridentPre7.prototype.insert = function (html) {

    // Get the current selection
    var range = this._doc.selection.createRange(),
        $selectionParents;

    // Check if the current selection is inside the editor
    $selectionParents = jQuery(range.parentElement()).parents();
    if ($selectionParents.is(this._options.iframeBodySelector)) {
        try {
            // Overwrite selection with provided html
            range.pasteHTML(html);
        } catch (e) {}
    } else {
        // Fall back to the internal paste function if there's no selection
        this.paste(html);
    }
};

WYMeditor.WymClassTridentPre7.prototype.wrap = function (left, right) {
    // Get the current selection
    var range = this._doc.selection.createRange(),
        $selectionParents;

    // Check if the current selection is inside the editor
    $selectionParents = jQuery(range.parentElement()).parents();
    if ($selectionParents.is(this._options.iframeBodySelector)) {
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
WYMeditor.WymClassTridentPre7.prototype.wrapWithContainer = function (
    node, containerType
) {
    var wym = this._wym,
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

WYMeditor.WymClassTridentPre7.prototype.unwrap = function () {
    // Get the current selection
    var range = this._doc.selection.createRange(),
        $selectionParents,
        text;

    // Check if the current selection is inside the editor
    $selectionParents = jQuery(range.parentElement()).parents();
    if ($selectionParents.is(this._options.iframeBodySelector)) {
        try {
            // Unwrap selection
            text = range.text;
            this._exec('Cut');
            range.pasteHTML(text);
        } catch (e) {}
    }
};

WYMeditor.WymClassTridentPre7.prototype.keyup = function (evt) {
    //'this' is the doc
    var wym = WYMeditor.INSTANCES[this.title],
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
    this._selectedImage = null;

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
