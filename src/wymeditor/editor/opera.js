/*jslint evil: true */
/* global -$ */
"use strict";

WYMeditor.WymClassOpera = function (wym) {
    this._wym = wym;
    this._class = "class";
};

WYMeditor.WymClassOpera.prototype.initIframe = function (iframe) {
    this._iframe = iframe;
    this._doc = iframe.contentWindow.document;

    this._doc.title = this._wym._index;

    // Set the text direction
    jQuery('html', this._doc).attr('dir', this._options.direction);

    this._doc.designMode = "on";

    // Init html value
    this._html(this._wym._options.html);

    if (jQuery.isFunction(this._options.preBind)) {
        this._options.preBind(this);
    }

    // Bind external events
    this._wym.bindEvents();

    jQuery(this._doc).bind("keydown", this.keydown);
    jQuery(this._doc).bind("keyup", this.keyup);
    if (jQuery.isFunction(this._options.postInit)) {
        this._options.postInit(this);
    }

    // Add event listeners to doc elements, e.g. images
    this.listen();

    jQuery(wym._element).trigger(
        WYMeditor.EVENTS.postIframeInitialization,
        this._wym
    );
};

WYMeditor.WymClassOpera.prototype._exec = function(cmd, param) {
    if (param) {
        this._doc.execCommand(cmd, false, param);
    }
    else {
        this._doc.execCommand(cmd);
    }
};

WYMeditor.WymClassOpera.prototype.selected = function() {
    var sel = this._iframe.contentWindow.getSelection();
    var node = sel.focusNode;
    if (node) {
        if (node.nodeName === "#text") {
            return node.parentNode;
        } else {
            return node;
        }
    } else {
        return null;
    }
};

WYMeditor.WymClassOpera.prototype.keydown = function(evt) {
    //'this' is the doc
    var wym = WYMeditor.INSTANCES[this.title];
    var sel = wym._iframe.contentWindow.getSelection();
    startNode = sel.getRangeAt(0).startContainer;

    //Get a P instead of no container
    if (!jQuery(startNode).parentsOrSelf(WYMeditor.MAIN_CONTAINERS.join(","))[0] &&
            !jQuery(startNode).parentsOrSelf('li') &&
            !keyCanCreateBlockElement(evt.which)) {

        wym._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
    }
};

WYMeditor.WymClassOpera.prototype.keyup = function(evt) {
    //'this' is the doc
    var wym = WYMeditor.INSTANCES[this.title];
    wym._selectedImage = null;

    // Handle issue #430.
    if (evt.which === WYMeditor.KEY.ENTER &&
        container.tagName.toLowerCase() === "p" &&
        container.parentNode.tagName.toLowerCase() === "li" &&
        jQuery(container).find('*').length === 1 &&
        jQuery(container).children()[0].tagName.toLowerCase() === "br") {
        wym.correctInvalidListNesting(container);
    }
};
