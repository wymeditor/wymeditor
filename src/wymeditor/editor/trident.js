/*jslint evil: true */
/* global rangy, -$ */
"use strict";

WYMeditor.WymClassTrident = function (wym) {
    this._wym = wym;
    this._class = "className";
};

WYMeditor.WymClassTrident.prototype.initIframe = function (iframe) {
    this._iframe = iframe;
    this._doc = iframe.contentWindow.document;

    if (this._doc.designMode !== "On") {
        this._doc.designMode = "On";
        // Initializing designMode triggers the load event again, thus
        // triggering this method again. We can short-circuit this run and do
        // all of the work in the next trigger
        return false;
    }
    this._doc.title = this._wym._index;

    // Set the text direction
    jQuery('html', this._doc).attr('dir', this._options.direction);

    // Init html value
    if (this._wym._options.html) {
        this._html(this._wym._options.html);
    } else {
        this._html(this._element[0].value);
    }

    // Handle events
    var wym = this;

    this._doc.body.onfocus = function () {
        wym._doc.designMode = "on";
        wym._doc = iframe.contentWindow.document;
    };
    this._doc.onbeforedeactivate = function () {
        wym.saveCaret();
    };
    jQuery(this._doc).bind('keyup', wym.keyup);
    this._doc.onkeyup = function () {
        wym.saveCaret();
    };
    this._doc.onclick = function () {
        wym.saveCaret();
    };

    this._doc.body.onbeforepaste = function () {
        wym._iframe.contentWindow.event.returnValue = false;
    };

    this._doc.body.onpaste = function () {
        wym._iframe.contentWindow.event.returnValue = false;
        wym.paste(window.clipboardData.getData("Text"));
    };

    if (jQuery.isFunction(this._options.preBind)) {
        this._options.preBind(this);
    }

    this._wym.bindEvents();

    wym.iframeInitialized = true;

    wym.postIframeInit();
};

(function (editorInitSkin) {
    WYMeditor.WymClassTrident.prototype.initSkin = function () {
        // Mark container items as unselectable (#203)
        // Fix for issue explained:
        // http://stackoverflow.com/questions/
        // 1470932/ie8-iframe-designmode-loses-selection
        jQuery(this._box).find(
            this._options.containerSelector
        ).attr('unselectable', 'on');

        editorInitSkin.call(this);
    };
}(WYMeditor.editor.prototype.initSkin));

WYMeditor.WymClassTrident.prototype._exec = function (cmd, param) {
    if (param) {
        this._doc.execCommand(cmd, false, param);
    } else {
        this._doc.execCommand(cmd);
    }
};

WYMeditor.WymClassTrident.prototype.saveCaret = function () {
    this._doc.caretPos = this._doc.selection.createRange();
};

WYMeditor.WymClassTrident.prototype.insert = function (html) {

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

WYMeditor.WymClassTrident.prototype.wrap = function (left, right) {
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
WYMeditor.WymClassTrident.prototype.wrapWithContainer = function (
    node, containerType
) {
    var wym = this._wym,
        $wrappedNode,
        selection,
        range;

    $wrappedNode = jQuery(node).wrap('<' + containerType + ' />');
    selection = rangy.getIframeSelection(wym._iframe);
    range = rangy.createRange(wym._doc);
    range.selectNodeContents($wrappedNode[0]);
    range.collapse();
    selection.setSingleRange(range);
};

WYMeditor.WymClassTrident.prototype.unwrap = function () {
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

WYMeditor.WymClassTrident.prototype.keyup = function (evt) {
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
        if (jQuery.browser.msie && jQuery.browser.version === "8.0" &&
           container.parentNode) {
            if (parentName === 'ul' || parentName === 'ol') {
                wym.correctInvalidListNesting(container);
            }
        }

        // Fix formatting if necessary
        wym.fixBodyHtml();
    }
};
